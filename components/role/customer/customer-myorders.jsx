import ProductCart from '@/components/catalog/product-cart'
import Title from '@/components/ui/title'
import React from 'react'

export default function CustomerMyorders() {
    return (
        <div>
            <div className="flex flex-col">
                <Title text={'Мои заказы'} size={'text-[24px]'} cls="uppercase" />
                <p className='text-[#1E1E1E]/60 mt-4'>24.09.25</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
            </div>
            <div className="flex flex-col">
                <p className='text-[#1E1E1E]/60 mt-4 mb-6'>23.09.25</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
                <ProductCart
                    isNew={false}
                    isLike={false}
                    initialQuantity='0'
                    buttonText="Заказать еще раз"
                />
            </div>
        </div>
    )
}
