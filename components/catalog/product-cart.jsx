import React, { useState } from 'react'
import Image from 'next/image'
import Button from '../ui/button'
import { IoHeartOutline, IoHeart } from 'react-icons/io5'
import { LuMinus, LuPlus } from "react-icons/lu";

export default function ProductCart({
    isNew,
    isLike,
    img,
    title,
    item,
    size,
    price,
    initialQuantity = 1,
    buttonText = "В корзину"
}) {
    const [quantity, setQuantity] = useState(initialQuantity)
    const [isLiked, setIsLiked] = useState(isLike || false)
    const [isHovered, setIsHovered] = useState(false)

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const handleIncrement = () => {
        setQuantity(quantity + 1)
    }

    const toggleLike = () => {
        setIsLiked(!isLiked)
    }

    const handleAddToCart = () => {
        console.log('Product added to cart:', { title, quantity, price })
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price)
    }

    return (
        <div
            className='p-4 relative rounded-[12px] transition-all duration-300 cursor-pointer w-full max-md:p-2 max-md:rounded-[8px]'
            style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >

            {isNew && (
                <div className="absolute text-[#2C5AA0] py-2 px-4.5 max-md:py-1 max-md:px-4 border border-[#2C5AA099] rounded-[6px] max-md:rounded-[4px] bg-white hover:bg-[#D7E5FA] text-sm z-10 max-md:text-[10px]">
                    Новинка
                </div>
            )}


            <div
                className={`absolute right-4 max-md:right-2 border rounded-[6px] max-md:rounded-[4px] max-md:w-5.5 max-md:h-5.5 w-8 h-8 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 ${isLiked
                    ? 'text-red-500 border-red-500 bg-red-50'
                    : 'text-[#2C5AA0] border-[#2C5AA099] hover:bg-[#D7E5FA]'
                    }`}
                onClick={toggleLike}
            >
                {isLiked ? <IoHeart className='max-md:text-sm' /> : <IoHeartOutline className='max-md:text-sm' />}
            </div>


            <Image
                src={img || '/cart.png'}
                width={160}
                height={160}
                className='w-full transition-transform duration-300'
                alt='product'
            />


            <h3 className='mt-4 mb-3 text-base text-[#1E1E1E] max-md:mt-2 max-md:text-[12px]'>{title || 'Ящик для песка 1 м3'}</h3>
            <p className='text-[#1E1E1E]/60 text-sm max-md:text-[8px]'>Артикул: {item || 'ЯЩИ005'}</p>
            <p className='text-[#1E1E1E]/60 text-sm max-md:text-[8px]'>Размер: {size || '1023х1150х900'}</p>


            <div className="mt-6 mb-3 text-sm flex  max-md:mt-4 max-md:mb-3 max-md:text-sm">
                <p className='text-[#2C5AA0]'>{formatPrice(price || 17700.00)} ₽</p> &nbsp; / &nbsp;
                <p className='text-[#1E1E1E]/60'>шт</p>
            </div>

            <div className="flex gap-x-3 h-[54px] max-md:h-[33px] max-md:gap-x-2">
                {
                    buttonText == 'В корзину' &&
                    <div className="border border-[#1E1E1E80] rounded-[10px] flex items-center justify-between h-[54px] max-md:h-[33px] max-md:rounded-[6px] grow-1 px-4  max-md:gap-x-2 max-md:px-2">
                        <button
                            className={`text-xl font-medium transition-colors duration-200 max-md:text-base ${quantity <= 1 ? 'text-[#1E1E1E80] cursor-not-allowed' : 'text-[#1E1E1E80] hover:text-[#2C5AA0]'
                                }`}
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                        >
                            <LuMinus />
                        </button>
                        <span className="text-[#1E1E1E] font-medium flex items-center max-md:text-[8px]">{quantity}</span>
                        <button
                            className="text-xl font-medium text-[#1E1E1E80] hover:text-[#2C5AA0] transition-colors duration-200 max-md:text-base"
                            onClick={handleIncrement}
                        >
                            <LuPlus />
                        </button>
                    </div>
                }

                <Button
                    className={`h-[54px]  w-[135px] transition-all duration-300 max-md:h-[33px] max-md:w-[77px] max-md:rounded-[6px] max-md:text-[8px] ${isHovered
                        ? 'bg-[#2C5AA0] !text-white'
                        : 'bg-[#EFEFEF] !text-[#8E8E8E]'
                        } ${buttonText !== 'В корзину' ? 'grow' : 'grow-0'}`}

                    text={buttonText || 'В корзину'}
                    onClick={handleAddToCart}
                />
            </div>


        </div>
    )
}