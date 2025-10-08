import React from 'react'
import Button from '../ui/button'
import Badge from '../ui/badge'

export default function Hero() {
    return (
        <div className="relative h-[794px] bg-cover bg-center bg-[url('/hero.png')] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-[#40404080] to-[rgba(67,67,67,0.2)]"></div>

            <div className="relative z-10 text-center px-4">
                <h1 className="text-white text-[48px] leading-[110%] tracking-[-1%] uppercase max-w-[700px] mx-auto font-bold">
                    Электронный учет пожарной безопасности
                </h1>
                <Badge link2={"About"} />
                <p className="mt-6 mb-12 text-white leading-[114%] tracking-[-1%] text-lg max-w-[670px] mx-auto">
                    Современная система управления QR-кодами для ведения журналов, формирования актов и контроля состояния систем пожарной безопасности
                </p>
                <div className="flex gap-6 justify-center">
                    <Button text="Заказать услугу" className='w-[270px] h-15 ' />
                    <Button text="Войти" className='w-[170px] h-15 bg-transparent border border-white' />
                </div>
            </div>
        </div>
    )
}
