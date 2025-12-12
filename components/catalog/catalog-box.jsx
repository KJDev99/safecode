"use client";

import Badge from "@/components/ui/badge";
import SelectInput from "@/components/ui/selectInput";
import Title from "@/components/ui/title";
import { useApiStore } from "@/store/useApiStore";
import React, { useEffect, useState } from "react";
import CatalogCart from "./catalog-cart";

export default function CatalogBox() {
  const { getDataToken } = useApiStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const response = await getDataToken("/products/category/all/");
        const incoming = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : [];
        setCategories(incoming);
      } catch (error) {
        setCategories([]);
        setCategoriesError("Не удалось загрузить категории");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [getDataToken]);

  const categoryOptions = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  const handleCategoryChange = (value) => {
    setSelectedCategory(value || "");
  };

  const handleCategoryChipClick = (categoryId) => {
    if (selectedCategory === String(categoryId)) {
      setSelectedCategory("");
      return;
    }
    setSelectedCategory(String(categoryId));
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="py-8 max-md:px-6">
        <Badge
          link2={"Каталог товаров"}
          adress2={"catalog"}
          link3={"Пожарная безопасность"}
          className="pb-0 max-md:pb-0"
          color="text-[#1E1E1E]/60"
        />
      </div>
      <div className="flex justify-between items-center mb-6 max-md:flex-col">
        <Title text="Каталог" />
        <div className="w-[285px] max-md:w-full max-md:px-6 max-md:mt-4">
          <SelectInput
            className={"max-md:text-sm !h-[56px] max-md:h-[50px]"}
            placeholder={
              isLoadingCategories ? "Загрузка..." : "Выберите категорию"
            }
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>
      </div>

      {categoriesError && (
        <p className="text-sm text-red-500 mb-4">{categoriesError}</p>
      )}

      {/* <div className="flex flex-wrap gap-3 mb-8 max-md:px-6">
        <button
          className={`px-4 py-2 rounded-full border transition-colors ${
            selectedCategory === ""
              ? "bg-[#2C5AA0] text-white border-[#2C5AA0]"
              : "border-gray-200 text-[#1E1E1E] hover:border-[#2C5AA0]"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          Все категории
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedCategory === String(category.id)
                ? "bg-[#2C5AA0] text-white border-[#2C5AA0]"
                : "border-gray-200 text-[#1E1E1E] hover:border-[#2C5AA0]"
            }`}
            onClick={() => handleCategoryChipClick(category.id)}
            disabled={isLoadingCategories}
          >
            {category.name}
          </button>
        ))}
      </div> */}

      <CatalogCart selectedCategory={selectedCategory} />
    </div>
  );
}
