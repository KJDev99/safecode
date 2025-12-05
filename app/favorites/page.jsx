"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { useApiStore } from "@/store/useApiStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import toast from "react-hot-toast";
import ProductCart from "@/components/catalog/product-cart";

const buildProductSize = (product) => {
    if (product?.sizes_list?.length) {
        const size = product.sizes_list[0];
        if (size?.width && size?.height && size?.depth) {
            return `${size.width}×${size.height}×${size.depth}`;
        }
    }
    if (product?.width && product?.height && product?.depth) {
        return `${product.width}×${product.height}×${product.depth}`;
    }
    return "Не указан";
};

const getProductImage = (product) => {
    if (product?.images_list?.length) {
        const img = product.images_list[0];
        if (typeof img === "string") return img;
        return img.image || img.image_url || "/cart.png";
    }
    if (product?.images?.length) {
        const img = product.images[0];
        if (typeof img === "string") return img;
        return img.image || img.image_url || "/cart.png";
    }
    return "/cart.png";
};

export default function FavoritesPage() {
    const router = useRouter();
    const { getDataToken, postDataToken, deleteDataToken } = useApiStore();
    const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
    const clearFavorites = useFavoritesStore((state) => state.clearFavorites);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        try {
            // Backend'dan barcha mahsulotlarni olish
            const response = await getDataToken("/products/favorites/");

            // Backend javobini to'g'ri qayta ishlash
            let favoriteProducts = [];

            if (response?.success && Array.isArray(response?.data)) {
                // Favorite items array'dan product obyektlarini chiqarib olish
                favoriteProducts = response.data.map(favoriteItem => ({
                    // Favorite ID
                    favoriteId: favoriteItem.id,
                    // Asosiy mahsulot ma'lumotlari
                    ...favoriteItem.product,
                    // Favorite created_at va updated_at maydonlarini saqlash
                    favorite_created_at: favoriteItem.created_at,
                    favorite_updated_at: favoriteItem.updated_at
                }));
            } else if (Array.isArray(response?.data)) {
                favoriteProducts = response.data;
            } else if (Array.isArray(response)) {
                favoriteProducts = response;
            }

            setProducts(favoriteProducts);
        } catch (error) {
            console.error("Error loading favorites:", error);
            toast.error("Не удалось загрузить избранное");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [getDataToken]);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const handleFavoriteToggle = useCallback(
        async (productId, shouldLike) => {
            try {
                if (shouldLike) {
                    await postDataToken("/products/favorites/", {
                        product_id: productId,
                    });
                } else {
                    // Product ID orqali favorite item ID ni topish
                    const favoriteItem = products.find(p => p.id === productId);
                    const favoriteId = favoriteItem?.favoriteId;

                    if (favoriteId) {
                        await deleteDataToken(`/products/favorites/${favoriteId}/delete/`);
                        // O'chirilgandan keyin ro'yxatni yangilash
                        setProducts((prev) => prev.filter((p) => p.id !== productId));
                    } else {
                        // Agar favoriteId topilmasa, productId orqali urinib ko'rish
                        await deleteDataToken(`/products/favorites/${productId}/delete/`);
                        setProducts((prev) => prev.filter((p) => p.id !== productId));
                    }
                }
                toast.success(
                    shouldLike ? "Добавлено в избранное" : "Удалено из избранного"
                );
                return true;
            } catch (error) {
                console.error("Error toggling favorite:", error);
                toast.error("Не удалось обновить избранное");
                return false;
            }
        },
        [postDataToken, deleteDataToken, products]
    );

    const handleCardClick = useCallback(
        (productId) => {
            router.push(`/products/${productId}`);
        },
        [router]
    );

    const handleClearAll = async () => {
        if (window.confirm("Вы уверены, что хотите очистить все избранное?")) {
            try {
                // Barcha sevimlilarni backend'dan o'chirish
                await Promise.all(
                    products.map((product) => {
                        const favoriteId = product.favoriteId || product.id;
                        return deleteDataToken(`/products/favorites/${favoriteId}/delete/`);
                    })
                );
                setProducts([]);
                clearFavorites();
                toast.success("Избранное очищено");
            } catch (error) {
                console.error("Error clearing favorites:", error);
                toast.error("Не удалось очистить избранное");
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12 max-md:px-2">
                <h1 className="text-3xl font-bold text-[#1E1E1E] mb-8 max-md:text-2xl">
                    Избранное
                </h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-32 h-32 mb-6 text-[#1E1E1E]/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
                        Список избранного пуст
                    </h2>
                    <p className="text-[#1E1E1E]/60 mb-8">
                        Добавьте товары из каталога
                    </p>
                    <Button
                        text="Перейти в каталог"
                        onClick={() => router.push("/catalog")}
                        className="w-[250px] h-14"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 max-md:px-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 max-md:flex-col max-md:items-start max-md:gap-4">
                <h1 className="text-3xl font-bold text-[#1E1E1E] max-md:text-2xl">
                    Избранное ({products.length})
                </h1>

            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5">
                {products.map((product) => (
                    <ProductCart
                        key={product.id}
                        productId={product.id}
                        isNew={product.is_new || false} // is_new maydoni bo'lmasa false qo'ying
                        isLike={true} // Favorites page da barcha mahsulotlar liked
                        img={getProductImage(product)}
                        title={product.name}
                        item={product.article}
                        size={buildProductSize(product)}
                        price={product.price}
                        initialQuantity={1}
                        stock={product.stock} // stock ni ProductCart componentga uzatish
                        onFavoriteToggle={handleFavoriteToggle}
                        onCardClick={handleCardClick}
                    />
                ))}
            </div>
        </div>
    );
}