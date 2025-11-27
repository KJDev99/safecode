import React, { useEffect } from 'react'
import ProductCart from './product-cart'
import Button from '../ui/button'
import { useApiStore } from '@/store/useApiStore';

export default function CatalogCart() {
    const { data, loading, error, getDataToken } = useApiStore();

    useEffect(() => {
        getDataToken("/products/");
    }, []);

    // Handle loading state
    if (loading) {
        return (
            <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
                <div className="flex col-span-4 justify-center">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
                <div className="flex col-span-4 justify-center">
                    <div className="text-center text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    // Handle case when no data is available
    if (!data || !data.data || data.data.length === 0) {
        return (
            <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
                <div className="flex col-span-4 justify-center">
                    <div className="text-center">Нет доступных продуктов</div>
                </div>
            </div>
        );
    }

    return (
        <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
            {data.data.map((product, index) => (
                <ProductCart
                    key={product.article || index}
                    isNew={index < 2} // Example: first 2 products are marked as new
                    isLike={false} // You might want to get this from product data or user preferences
                    img={product.images_list && product.images_list.length > 0 ? product.images_list[0] : "/cart.png"}
                    title={product.name}
                    item={product.article}
                    size={`${product.width}х${product.height}х${product.depth}`}
                    price={product.price}
                    initialQuantity={1}
                    description={product.description}
                    category={product.category}
                    stock={product.stock}
                    isActive={product.is_active}
                />
            ))}

            {data.pagination && data.pagination.has_next && (
                <div className="flex col-span-4 justify-center max-md:col-span-2">
                    <Button
                        text={`Показать еще ${data.pagination.limit || 16} товаров`}
                        className='w-[282px] h-[54px] mt-6'
                    />
                </div>
            )}
        </div>
    )
}