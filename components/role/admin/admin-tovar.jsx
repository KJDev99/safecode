"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2, FiX, FiUpload } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import Image from "next/image";
import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import Loader from "@/components/Loader";
import { useApiStore } from "@/store/useApiStore";

export default function AdminTovar() {
  const {
    data,
    loading,
    getDataToken,
    postDataToken,
    putDataToken,
    deleteDataToken,
  } = useApiStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    article: "",
    is_active: true,
    images_list: [],
    width: 0,
    height: 0,
    depth: 0,
  });

  // Load products and categories
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoadingData(true);
      await Promise.all([loadProducts(currentPage), loadCategories()]);
      setIsLoadingData(false);
    };

    loadAllData();
  }, [currentPage]);

  // Update products when data changes
  useEffect(() => {
    if (data) {
      console.log("API Response:", data);

      // Handle different response structures
      if (data.success && Array.isArray(data.data)) {
        // Standard API response: { success: true, data: [...], pagination: {...} }
        setProducts(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages || 1);
        }
      } else if (data.data && Array.isArray(data.data)) {
        // Response with data property
        setProducts(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages || 1);
        }
      } else if (Array.isArray(data)) {
        // Direct array response
        setProducts(data);
      }
    }
  }, [data]);

  const loadProducts = async (page = 1) => {
    await getDataToken(`/products/?page=${page}`);
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getDataToken("/products/category/all/");
      console.log("Categories data:", categoriesData);

      if (categoriesData?.data && Array.isArray(categoriesData.data)) {
        setCategories(categoriesData.data);
      } else if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else if (
        categoriesData?.success &&
        Array.isArray(categoriesData.data)
      ) {
        setCategories(categoriesData.data);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]);
    }
  };

  const handleImageUploadCreate = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check if adding new images would exceed limit
    if (uploadingImages.length + files.length > 10) {
      toast.error("Максимум 10 изображений");
      return;
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} не является изображением`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} слишком большой (макс. 5MB)`);
        continue;
      }

      uploadedFiles.push(file);
    }

    // Add files to uploadingImages state (for preview)
    setUploadingImages((prev) => [...prev, ...uploadedFiles]);

    if (uploadedFiles.length > 0) {
      toast.success(`Добавлено ${uploadedFiles.length} изображений`);
    }
  };

  const handleImageUploadEdit = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Check if adding new images would exceed limit
    if (formData.images_list.length + files.length > 10) {
      toast.error("Максимум 10 изображений");
      return;
    }

    const uploadedFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} не является изображением`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} слишком большой (макс. 5MB)`);
        continue;
      }

      uploadedFiles.push(file);
    }

    // Add files to formData.images_list (for preview)
    setFormData((prev) => ({
      ...prev,
      images_list: [...prev.images_list, ...uploadedFiles],
    }));

    if (uploadedFiles.length > 0) {
      toast.success(`Добавлено ${uploadedFiles.length} изображений`);
    }
  };
  // Remove image from form (for edit modal)
  const removeImageFromForm = (index) => {
    const imageToRemove = formData.images_list[index];

    // Agar bu File bo'lsa, oddiygina o'chiramiz
    if (imageToRemove instanceof File) {
      setFormData((prev) => ({
        ...prev,
        images_list: prev.images_list.filter((_, i) => i !== index),
      }));
    }
    // Agar bu serverdan kelgan image bo'lsa (object yoki string)
    else if (typeof imageToRemove === "object" && imageToRemove.id) {
      // Serverdan o'chirish
      deleteImageFromServer(imageToRemove.id);
    } else {
      setFormData((prev) => ({
        ...prev,
        images_list: prev.images_list.filter((_, i) => i !== index),
      }));
    }
  };

  // Remove image from upload list (for create modal)
  const removeImageFromUpload = (index) => {
    setUploadingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete image from server
  const deleteImageFromServer = async (imageId) => {
    try {
      const response = await deleteDataToken(
        `/products/images/${imageId}/delete/`
      );

      if (response && !response.error) {
        toast.success("Изображение удалено");
        // Remove image from form data
        setFormData((prev) => ({
          ...prev,
          images_list: prev.images_list.filter((img) =>
            typeof img === "object" ? img.id !== imageId : true
          ),
        }));
      } else {
        toast.error(response?.error || "Ошибка удаления изображения");
      }
    } catch (error) {
      console.error("Delete image error:", error);
      toast.error("Ошибка удаления изображения");
    }
  };

  // CREATE product with multipart/form-data
  const handleCreateProduct = async () => {
    if (
      !formData.name ||
      !formData.article ||
      formData.price <= 0 ||
      !formData.category
    ) {
      toast.error("Заполните обязательные поля");
      return;
    }

    if (uploadingImages.length === 0) {
      toast.error("Добавьте хотя бы одно изображение");
      return;
    }

    const loadingToast = toast.loading("Создание товара...");

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Add text fields
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("price", parseFloat(formData.price));
      formDataObj.append("category", parseInt(formData.category));
      formDataObj.append("stock", parseInt(formData.stock));
      formDataObj.append("article", formData.article);
      formDataObj.append("is_active", formData.is_active);
      formDataObj.append("width", parseFloat(formData.width));
      formDataObj.append("height", parseFloat(formData.height));
      formDataObj.append("depth", parseFloat(formData.depth));

      // Add images as files
      uploadingImages.forEach((file, index) => {
        formDataObj.append("images_list", file); // Bu multiple files qabul qilishi kerak
      });

      // Send request with multipart/form-data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}products/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok && (result.success || result.id)) {
        toast.success("Товар успешно создан");
        setShowCreateModal(false);
        resetFormData();
        setUploadingImages([]);
        await loadProducts(currentPage);
      } else {
        toast.error(
          result?.message || result?.error || "Ошибка при создании товара"
        );
        console.error("Create error:", result);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Create product error:", error);
      toast.error("Ошибка при создании товара");
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    if (
      !formData.name ||
      !formData.article ||
      formData.price <= 0 ||
      !formData.category
    ) {
      toast.error("Заполните обязательные поля");
      return;
    }

    const loadingToast = toast.loading("Обновление товара...");

    try {
      // Create FormData object
      const formDataObj = new FormData();

      // Add text fields
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);
      formDataObj.append("price", parseFloat(formData.price));
      formDataObj.append("category", parseInt(formData.category));
      formDataObj.append("stock", parseInt(formData.stock));
      formDataObj.append("article", formData.article);
      formDataObj.append("is_active", formData.is_active);
      formDataObj.append("width", parseFloat(formData.width));
      formDataObj.append("height", parseFloat(formData.height));
      formDataObj.append("depth", parseFloat(formData.depth));

      // Add new image files (filter out strings which are already uploaded images)
      const newImages = formData.images_list.filter(
        (img) => img instanceof File
      );
      newImages.forEach((file, index) => {
        formDataObj.append("images_list", file);
      });

      // Send request with multipart/form-data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}products/${selectedProduct.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();

      toast.dismiss(loadingToast);

      if (response.ok && (result.success || result.id)) {
        toast.success("Товар успешно обновлен");
        setShowEditModal(false);
        setSelectedProduct(null);
        resetFormData();
        setUploadingImages([]);
        await loadProducts(currentPage);
      } else {
        toast.error(
          result?.message || result?.error || "Ошибка при обновлении товара"
        );
        console.error("Update error:", result);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Update product error:", error);
      toast.error("Ошибка при обновлении товара");
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    const loadingToast = toast.loading("Удаление товара...");

    const response = await deleteDataToken(`/products/${productToDelete.id}/`);

    toast.dismiss(loadingToast);

    if (response && !response.error) {
      toast.success("Товар успешно удален");
      setShowDeleteModal(false);
      setProductToDelete(null);
      await loadProducts(currentPage);
    } else {
      toast.error(
        response?.message || response?.error || "Ошибка при удалении товара"
      );
    }
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      article: "",
      is_active: true,
      images_list: [],
      width: 0,
      height: 0,
      depth: 0,
    });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    resetFormData();
    setUploadingImages([]);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    resetFormData();
    setUploadingImages([]);
  };

  const openEditModal = (product) => {
    console.log("Opening edit modal for product:", product);
    setSelectedProduct(product);

    // Extract size from sizes_list if available
    const size =
      product.sizes_list && product.sizes_list.length > 0
        ? product.sizes_list[0]
        : null;

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || 0,
      category:
        product.category?.id?.toString() || product.category?.toString() || "",
      stock: product.stock || 0,
      article: product.article || "",
      is_active: product.is_active !== undefined ? product.is_active : true,
      images_list: product.images_list || product.images || [],
      width: size?.width || product.width || 0,
      height: size?.height || product.height || 0,
      depth: size?.depth || product.depth || 0,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getSizeString = (product) => {
    // Check if sizes are in sizes_list array
    if (product.sizes_list && product.sizes_list.length > 0) {
      const size = product.sizes_list[0];
      if (size.width && size.height && size.depth) {
        return `${size.width}×${size.height}×${size.depth}`;
      }
    }
    // Fallback to direct properties
    const { width, height, depth } = product;
    if (width && height && depth) {
      return `${width}×${height}×${depth}`;
    }
    return "Не указан";
  };

  const getCategoryName = (category) => {
    // If category is an object with name property
    if (category && typeof category === "object" && category.name) {
      return category.name;
    }
    // If category is an ID, find it in categories list
    if (category) {
      const foundCategory = categories.find(
        (cat) => cat.id === category || cat.id === parseInt(category)
      );
      return foundCategory ? foundCategory.name : "Без категории";
    }
    return "Без категории";
  };

  if (isLoadingData && products.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseCreateModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <Title text={"Создать товар"} size={"text-xl font-bold"} />
                <button
                  onClick={handleCloseCreateModal}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <IoMdClose className="text-xl" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Название *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                      placeholder="Введите название"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Артикул *
                    </label>
                    <input
                      type="text"
                      name="article"
                      value={formData.article}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                      placeholder="Введите артикул"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Цена (₽) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Количество на складе
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Ширина (мм)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Высота (мм)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Глубина (мм)
                    </label>
                    <input
                      type="number"
                      name="depth"
                      value={formData.depth}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    placeholder="Введите описание товара"
                  />
                </div>

                {/* Create Modal ichida */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                    Изображения * (макс. 10)
                  </label>
                  <div className="mb-4">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2C5AA0] transition-colors">
                      <div className="text-center">
                        <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Загрузите изображения
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG до 5MB</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUploadCreate} // ✅ Bu yerda yangi funksiya
                        className="hidden"
                      />
                    </label>
                  </div>

                  {uploadingImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {uploadingImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            {/* Preview uchun URL.createObjectURL */}
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Memory cleanup
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImageFromUpload(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2C5AA0] rounded focus:ring-[#2C5AA0]"
                  />
                  <label
                    htmlFor="is_active"
                    className="ml-2 text-sm font-semibold text-[#1E1E1E]"
                  >
                    Активный товар
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button
                  className="flex-1 h-[48px]"
                  text="Создать"
                  onClick={handleCreateProduct}
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.article ||
                    formData.price <= 0 ||
                    !formData.category ||
                    uploadingImages.length === 0
                  }
                />
                <Button
                  className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                  text="Отмена"
                  onClick={handleCloseCreateModal}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <Title
                  text={"Редактировать товар"}
                  size={"text-xl font-bold"}
                />
                <button
                  onClick={handleCloseEditModal}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <IoMdClose className="text-xl" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Название *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Артикул *
                    </label>
                    <input
                      type="text"
                      name="article"
                      value={formData.article}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Категория *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Цена (₽) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Количество на складе
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Ширина (мм)
                    </label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Высота (мм)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                      Глубина (мм)
                    </label>
                    <input
                      type="number"
                      name="depth"
                      value={formData.depth}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                  />
                </div>

                {/* Edit Modal ichida */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1E1E1E] ">
                    Изображения (макс. 10)
                  </label>

                  <div className="mb-4">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#2C5AA0] transition-colors">
                      <div className="text-center">
                        <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Добавить новые изображения
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG до 5MB</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUploadEdit} // ✅ Bu yerda yangi funksiya
                        className="hidden"
                      />
                    </label>
                  </div>

                  {formData.images_list.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {formData.images_list.map((img, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                            {img instanceof File ? (
                              // Yangi yuklangan file preview
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`New image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={(e) =>
                                  URL.revokeObjectURL(e.target.src)
                                }
                              />
                            ) : (
                              // Serverdan kelgan image
                              <Image
                                src={
                                  typeof img === "object"
                                    ? img.image || img.image_url || img
                                    : img
                                }
                                alt={`Product image ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImageFromForm(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FiX className="text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active_edit"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#2C5AA0] rounded focus:ring-[#2C5AA0]"
                  />
                  <label
                    htmlFor="is_active_edit"
                    className="ml-2 text-sm font-semibold text-[#1E1E1E]"
                  >
                    Активный товар
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button
                  className="flex-1 h-[48px]"
                  text="Сохранить"
                  onClick={handleEditProduct}
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.article ||
                    formData.price <= 0 ||
                    !formData.category
                  }
                />
                <Button
                  className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                  text="Отмена"
                  onClick={handleCloseEditModal}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && productToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdClose className="text-3xl text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                  Удалить товар?
                </h3>
                <p className="text-[#1E1E1E]/60 mb-6">
                  Вы уверены, что хотите удалить товар{" "}
                  <span className="font-semibold">
                    "{productToDelete.name}"
                  </span>
                  ?
                  <br />
                  Это действие нельзя отменить.
                </p>
                <div className="flex gap-3">
                  <Button
                    className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                    text="Отмена"
                    onClick={() => setShowDeleteModal(false)}
                  />
                  <Button
                    className="flex-1 h-[48px] bg-red-500 hover:bg-red-600"
                    text="Удалить"
                    onClick={handleDeleteProduct}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between md:items-center max-md:flex-col max-md:gap-4">
        <div className="flex flex-col">
          <Title
            text={"Управление товарами"}
            size={"text-[24px] max-md:text-[22px]"}
            cls="uppercase"
          />
          <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
            Создание и редактирование товаров
            {products.length > 0 && ` (${products.length} товаров)`}
          </p>
        </div>
        <Button
          className="h-[54px] w-[200px] gap-2.5 max-md:w-full"
          icon={<FaPlus />}
          text={"Создать товар"}
          onClick={() => setShowCreateModal(true)}
        />
      </div>

      {/* Products Grid */}
      {products.length === 0 && !isLoadingData ? (
        <div
          className="mt-6 bg-white rounded-2xl p-8 text-center"
          style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">Товары не найдены</p>
          <p className="text-gray-400 mt-2">Создайте свой первый товар</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="relative group">
                <div
                  className="p-4 relative rounded-[12px] transition-all duration-300 w-full max-md:p-2 max-md:rounded-[8px] bg-white hover:shadow-lg"
                  style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
                >
                  {/* New Badge */}
                  {product.is_new && (
                    <div className="absolute top-4 left-4 text-[#2C5AA0] py-1 px-3 max-md:py-0.5 max-md:px-2 border border-[#2C5AA099] rounded-[6px] max-md:rounded-[4px] bg-white text-xs max-md:text-[10px] z-10">
                      Новинка
                    </div>
                  )}

                  {/* Edit/Delete Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                      onClick={() => openEditModal(product)}
                      title="Редактировать"
                    >
                      <MdEdit className="text-base text-[#1E1E1E]" />
                    </button>
                    <button
                      className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      onClick={() => confirmDeleteProduct(product)}
                      title="Удалить"
                    >
                      <MdDelete className="text-lg text-white" />
                    </button>
                  </div>

                  {/* Inactive Badge */}
                  {!product.is_active && (
                    <div className="absolute top-14 right-4 px-2 py-1 bg-red-500 text-white text-xs rounded z-10">
                      Неактивен
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={
                        product.images_list?.[0]?.image ||
                        product.images_list?.[0]?.image_url ||
                        product.images?.[0]?.image ||
                        product.images?.[0]?.image_url ||
                        "/cart.png"
                      }
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <h3 className="text-base text-[#1E1E1E] font-medium mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-[#1E1E1E]/60 text-sm mb-1">
                    <span className="font-semibold">Артикул:</span>{" "}
                    {product.article || "Не указан"}
                  </p>
                  <p className="text-[#1E1E1E]/60 text-sm mb-1">
                    <span className="font-semibold">Размер:</span>{" "}
                    {getSizeString(product)}
                  </p>
                  <p className="text-[#1E1E1E]/60 text-sm mb-3">
                    <span className="font-semibold">Категория:</span>{" "}
                    {getCategoryName(product.category || product.category_id)}
                  </p>

                  <div className="text-sm text-[#1E1E1E]/60">
                    <span className="font-semibold">На складе:</span>{" "}
                    {product.stock || 0} шт.
                  </div>
                  {/* Price */}
                  <div className="text-lg font-bold text-[#2C5AA0]">
                    <span className="text-sm text-[#1E1E1E]/60">Цена:</span>{" "}
                    {formatPrice(product.price)} ₽
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Назад
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-[#2C5AA0] text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Вперед
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
