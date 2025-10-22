import React from 'react'
import Button from '../ui/button'
import Badge from '../ui/badge'

export default function Hero() {
    return (
        <div className="relative h-[794px] max-md:h-[769px] bg-cover bg-center bg-[url('/hero.png')] flex flex-col items-center md:justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#40404080] to-[rgba(67,67,67,0.2)]"></div>

            <div className="relative z-10 text-center px-4 max-md:px-8">
                <h1 className="text-white text-[48px] max-md:text-[28px] leading-[110%] tracking-[-1%] uppercase max-w-[700px] mx-auto font-bold max-md:mt-[260px]">
                    Электронный учет пожарной безопасности
                </h1>

                <p className="mt-6 mb-12 text-white leading-[114%] tracking-[-1%] text-lg max-w-[670px] mx-auto max-md:text-sm max-md:mb-[130px]">
                    Современная система управления QR-кодами для ведения журналов, формирования актов и контроля состояния систем пожарной безопасности
                </p>
                <div className="flex gap-6 justify-center max-md:flex-col-reverse">
                    <Button text="Заказать услугу" className='w-[270px] h-15 max-md:w-full' />
                    <Button text="Войти" className='w-[170px] h-15 bg-transparent border border-white max-md:w-full' />
                </div>
            </div>
        </div>
    )
}
