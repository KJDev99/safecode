"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { LuMinus, LuPlus } from "react-icons/lu";
import Button from "@/components/ui/button";
import { useApiStore } from "@/store/useApiStore";
import { useCartStore } from "@/store/useCartStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { getDataToken, postDataToken, deleteDataToken } = useApiStore();
    const addToCart = useCartStore((state) => state.addToCart);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(false);
    const isFavoriteInStore = useFavoritesStore((state) => state.isFavorite);
    const addFavorite = useFavoritesStore((state) => state.addFavorite);
    const removeFavorite = useFavoritesStore((state) => state.removeFavorite);

    const loadProduct = useCallback(async () => {
        if (!params?.id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getDataToken(`/products/${params.id}/`);
            const productData = response?.data || response;

            setProduct(productData);

            // Backend va localStorage'dan tekshirish
            const isInBackend = Boolean(productData?.is_favorite);
            const isInLocalStorage = isFavoriteInStore(Number(params.id));
            const finalLikedState = isInBackend || isInLocalStorage;

            setIsLiked(finalLikedState);

            // Agar backend'da bor, localStorage'ga ham qo'shish
            if (isInBackend && !isInLocalStorage) {
                addFavorite(Number(params.id));
            }
        } catch (err) {
            setError(err?.message || "Не удалось загрузить продукт");
            toast.error("Ошибка загрузки продукта");
        } finally {
            setLoading(false);
        }
    }, [params?.id, getDataToken, isFavoriteInStore, addFavorite]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const handleFavoriteToggle = async () => {
        if (!product?.id) return;

        // Yangi holatni oldindan aniqlash
        const newLikedState = !isLiked;
        setIsLiked(newLikedState); // Darhol UI yangilash

        try {
            if (newLikedState) {
                await postDataToken("/products/favorites/", {
                    product_id: product.id,
                });
                addFavorite(product.id);
                toast.success("Добавлено в избранное");
            } else {
                await deleteDataToken(`/products/favorites/${product.id}/delete/`);
                removeFavorite(product.id);
                toast.success("Удалено из избранного");
            }
        } catch (error) {
            // Xatolik bo'lsa, state qaytarish
            setIsLiked(!newLikedState);
            toast.error("Не удалось обновить избранное");
        }
    };

    const handleAddToCart = () => {
        if (!product) return;

        const size = product.sizes_list?.[0]
            ? `${product.sizes_list[0].width}×${product.sizes_list[0].height}×${product.sizes_list[0].depth}`
            : "Не указан";

        const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            article: product.article,
            image: product.images_list?.[0]?.image || "/cart.png",
            size: size,
        };

        addToCart(cartProduct, quantity);
        toast.success(`${product.name} добавлен в корзину`);
        router.push("/cart");
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    };
    useEffect(() => {
        if (params?.id) {
            const isInStore = isFavoriteInStore(Number(params.id));
            if (isInStore !== isLiked) {
                setIsLiked(isInStore);
            }
        }
    }, [params?.id, isFavoriteInStore]);

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-lg text-red-500 mb-4">
                        {error || "Продукт не найден"}
                    </div>
                    <Button
                        text="Вернуться к каталогу"
                        onClick={() => router.push("/catalog")}
                    />
                </div>
            </div>
        );
    }

    const images = product.images_list || [];
    const size = product.sizes_list?.[0]
        ? `${product.sizes_list[0].width}×${product.sizes_list[0].height}×${product.sizes_list[0].depth}`
        : "Не указан";

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 max-md:px-2">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                <span
                    className="cursor-pointer hover:text-[#2C5AA0]"
                    onClick={() => router.push("/")}
                >
                    Главная
                </span>
                <span>/</span>
                <span
                    className="cursor-pointer hover:text-[#2C5AA0]"
                    onClick={() => router.push("/catalog")}
                >
                    Каталог
                </span>
                <span>/</span>
                <span className="text-[#1E1E1E]">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-md:gap-4">
                {/* Images Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative w-full h-[320px] max-md:h-[300px] bg-white rounded-[12px] flex items-center justify-center overflow-hidden border border-gray-200">
                        <Image
                            src={images[selectedImage]?.image || "/cart.png"}
                            width={500}
                            height={500}
                            className="object-contain w-full h-full p-4"
                            alt={product.name}
                        />

                        {/* Favorite Button */}
                        <div
                            className={`absolute top-4 right-4 border rounded-[6px] text-[#2C5AA0] border-[#2C5AA099] w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isLiked
                                ? " bg-[#D7E5FA]"
                                : " bg-white hover:bg-[#D7E5FA]"
                                }`}
                            onClick={handleFavoriteToggle}
                        >
                            {isLiked ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                        </div>
                    </div>

                    {/* Thumbnail Images */}
                    {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`min-w-[100px] h-[100px] max-md:min-w-[70px] max-md:h-[70px] rounded-[8px] border-2 cursor-pointer transition-all overflow-hidden ${selectedImage === index
                                        ? "border-[#2C5AA0]"
                                        : "border-gray-200 hover:border-[#2C5AA0]/50"
                                        }`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <Image
                                        src={img.image || "/cart.png"}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-contain p-2"
                                        alt={`${product.name} ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info Section */}
                <div className="space-y-6">
                    {/* Title and Status */}
                    <div>
                        {product.is_new && (
                            <span className="inline-block text-[#2C5AA0] py-1 px-3 border border-[#2C5AA099] rounded-[6px] bg-white text-sm mb-3">
                                Новинка
                            </span>
                        )}
                        <h1 className="text-3xl font-semibold text-[#1E1E1E] max-md:text-2xl">
                            {product.name}
                        </h1>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                        <p className="text-[#1E1E1E]/60 text-sm">
                            <span className="font-medium text-[#1E1E1E]">Артикул:</span>{" "}
                            {product.article}
                        </p>
                        <p className="text-[#1E1E1E]/60 text-sm">
                            <span className="font-medium text-[#1E1E1E]">Размер:</span> {size}
                        </p>
                        <p className="text-[#1E1E1E]/60 text-sm">
                            <span className="font-medium text-[#1E1E1E]">Категория:</span>{" "}
                            {product.category?.name || "Не указана"}
                        </p>

                    </div>

                    {/* Price */}
                    <div className="py-4 bg-[#F5F5F5] px-6 rounded-[10px] max-md:px-4 max-md:py-3 w-full">
                        <div className="flex flex-col items-baseline gap-2">
                            <span className="text-4xl font-bold text-[#2C5AA0] max-md:text-3xl">
                                {formatPrice(parseFloat(product.price) * quantity)} ₽
                            </span>
                            <p className="text-[#1E1E1E]/60 text-sm">
                                <span className="font-medium text-[#1E1E1E]">В наличии:</span>{" "}
                                {product.stock > 0 ? `${product.stock} шт` : "Нет в наличии"}
                            </p>
                        </div>
                    </div>

                    {/* Description */}


                    {/* Quantity and Add to Cart */}
                    <div className="space-y-4 flex gap-x-4">
                        <div className="flex gap-4 items-center">
                            {/* Quantity Selector */}
                            <div className="border border-[#1E1E1E80] rounded-[10px] flex items-center justify-between h-[54px] px-6 gap-4">
                                <button
                                    className={`text-xl font-medium transition-colors duration-200 ${quantity <= 1
                                        ? "text-[#1E1E1E80] cursor-not-allowed"
                                        : "text-[#1E1E1E80] hover:text-[#2C5AA0]"
                                        }`}
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    <LuMinus />
                                </button>
                                <span className="text-[#1E1E1E] font-medium text-lg min-w-[30px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    className="text-xl font-medium text-[#1E1E1E80] hover:text-[#2C5AA0] transition-colors duration-200"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <LuPlus />
                                </button>
                            </div>

                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            text="Заказать"
                            className="w-full h-[54px] text-lg"
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                        />

                        {product.stock <= 0 && (
                            <p className="text-sm text-red-500 text-center">
                                Товар временно отсутствует
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {product.description && (
                    <div>
                        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-2">
                            Описание
                        </h3>
                        <p className="text-[#1E1E1E]/80 text-sm leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}