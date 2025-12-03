import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductCart from "./product-cart";
import Button from "../ui/button";
import { useApiStore } from "@/store/useApiStore";

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

export default function CatalogCart({ selectedCategory }) {
  const router = useRouter();
  const { getDataToken, postDataToken, deleteDataToken } = useApiStore();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    params.append("page", currentPage);
    if (selectedCategory) {
      params.append("category", selectedCategory);
    }
    return `/products/?${params.toString()}`;
  }, [currentPage, selectedCategory]);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorMessage(null);
    try {
      const response = await getDataToken(endpoint);
      const incoming = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
        ? response
        : [];

      setProducts((prev) =>
        currentPage === 1 ? incoming : [...prev, ...incoming]
      );
      setPagination(response?.pagination ?? null);
    } catch (error) {
      setErrorMessage(error?.message || "Не удалось загрузить товары");
    } finally {
      setLoadingProducts(false);
    }
  }, [endpoint, getDataToken, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    setProducts([]);
    setPagination(null);
    setCurrentPage(1);
  }, [selectedCategory]);

  const handleFavoriteToggle = useCallback(
    async (productId, shouldLike) => {
      try {
        if (shouldLike) {
          await postDataToken("/products/favorites/", {
            product_id: productId,
          });
        } else {
          await deleteDataToken(`/products/favorites/${productId}/delete/`);
        }
        setProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? { ...product, is_favorite: shouldLike }
              : product
          )
        );
        toast.success(
          shouldLike ? "Добавлено в избранное" : "Удалено из избранного"
        );
        return true;
      } catch (error) {
        toast.error("Не удалось обновить избранное");
        return false;
      }
    },
    [postDataToken, deleteDataToken]
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

  if (loadingProducts && products.length === 0) {
    return (
      <div className="mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4">
        <div className="flex col-span-4 justify-center">
          <div className="text-center">Загрузка товаров...</div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4">
        <div className="flex col-span-4 justify-center">
          <div className="text-center text-red-500">{errorMessage}</div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4">
        <div className="flex col-span-4 justify-center">
          <div className="text-center">Нет доступных продуктов</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4">
      {products.map((product, index) => (
        <ProductCart
          key={product.id || product.article || index}
          productId={product.id}
          isNew={product.is_new}
          isLike={Boolean(product.is_favorite)}
          img={getProductImage(product)}
          title={product.name}
          item={product.article}
          size={buildProductSize(product)}
          price={product.price}
          initialQuantity={1}
          onFavoriteToggle={handleFavoriteToggle}
          onAddToCart={handleAddToCart}
          onCardClick={handleCardClick}
        />
      ))}

      {pagination?.has_next && (
        <div className="flex col-span-4 justify-center max-md:col-span-2">
          <Button
            text="Показать еще"
            className="w-[282px] h-[54px] mt-6"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={loadingProducts}
          />
        </div>
      )}
    </div>
  );
}
