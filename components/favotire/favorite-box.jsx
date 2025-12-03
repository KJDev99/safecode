"use client";

import { useApiStore } from "@/store/useApiStore";
import Badge from "@/components/ui/badge";
import Title from "@/components/ui/title";
import ProductCart from "@/components/catalog/product-cart";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const extractProduct = (favoriteItem) => {
  if (!favoriteItem) return null;
  if (favoriteItem.product) {
    return { ...favoriteItem.product, favorite_entry_id: favoriteItem.id };
  }
  return favoriteItem;
};

export default function FavoriteBox() {
  const router = useRouter();
  const { getDataToken, postDataToken, deleteDataToken } = useApiStore();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await getDataToken("/products/favorites/");
      const incoming = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];
      setFavorites(incoming);
    } catch (error) {
      setErrorMessage("Не удалось загрузить избранные товары");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [getDataToken]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const preparedFavorites = useMemo(
    () =>
      favorites
        .map((item) => extractProduct(item))
        .filter((item) => Boolean(item && item.id)),
    [favorites]
  );

  const handleFavoriteToggle = useCallback(
    async (productId, shouldLike) => {
      try {
        if (shouldLike) {
          await postDataToken("/products/favorites/", {
            product_id: productId,
          });
          await fetchFavorites();
        } else {
          await deleteDataToken(`/products/favorites/${productId}/delete/`);
          setFavorites((prev) =>
            prev.filter((favoriteItem) => {
              const product = extractProduct(favoriteItem);
              return product?.id !== productId;
            })
          );
        }
        toast.success(
          shouldLike ? "Добавлено в избранное" : "Удалено из избранного"
        );
        return true;
      } catch (error) {
        toast.error("Не удалось обновить избранное");
        return false;
      }
    },
    [deleteDataToken, fetchFavorites, postDataToken]
  );

  const handleAddToCart = useCallback(() => {
    router.push("/cart");
  }, [router]);

  const handleCardClick = useCallback(
    (productId) => {
      router.push(`/products/${productId}`);
    },
    [router]
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 md:px-0 py-8">
      <Badge
        link2={"Избранные товары"}
        adress2={"favorite"}
        link3={"Избранное"}
        className="pb-4"
        color="text-[#1E1E1E]/60"
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <Title text="Избранное" />
        <Button
          text="Вернуться в каталог"
          className="w-full md:w-[220px] h-[48px]"
          onClick={() => router.push("/catalog")}
        />
      </div>

      {loading && (
        <div className="w-full flex justify-center py-16">
          <span className="text-[#1E1E1E]/60">
            Загрузка избранных товаров...
          </span>
        </div>
      )}

      {errorMessage && !loading && (
        <div className="w-full flex justify-center py-16">
          <span className="text-red-500">{errorMessage}</span>
        </div>
      )}

      {!loading && preparedFavorites.length === 0 && !errorMessage && (
        <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-lg font-medium text-[#1E1E1E]">
            У вас пока нет избранных товаров
          </p>
          <p className="text-[#1E1E1E]/60 mt-2 mb-6">
            Добавьте понравившиеся товары, чтобы быстро найти их здесь
          </p>
          <Button
            text="Перейти в каталог"
            onClick={() => router.push("/catalog")}
            className="h-[48px] px-6"
          />
        </div>
      )}

      {!loading && preparedFavorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {preparedFavorites.map((product) => (
            <ProductCart
              key={product.id}
              productId={product.id}
              isNew={product.is_new}
              isLike={true}
              img={
                product.images_list?.[0]?.image ||
                product.images_list?.[0]?.image_url ||
                product.images?.[0]?.image ||
                product.images?.[0]?.image_url ||
                "/cart.png"
              }
              title={product.name}
              item={product.article}
              size={
                product.sizes_list?.length
                  ? `${product.sizes_list[0].width}×${product.sizes_list[0].height}×${product.sizes_list[0].depth}`
                  : product.width && product.height && product.depth
                  ? `${product.width}×${product.height}×${product.depth}`
                  : "Не указан"
              }
              price={product.price}
              onFavoriteToggle={handleFavoriteToggle}
              onAddToCart={handleAddToCart}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
