import React from 'react'
import Title from '../ui/title'
import Button from '../ui/button'

export default function FinallySection() {
    return (
        <div
            className='bg-[#2C5AA0]'
            style={{
                backgroundImage: 'url("/heroendbg.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'auto',
            }}
        >
            <div className='max-w-[1200px] mx-auto '>
                <div className=" flex flex-col justify-center h-[392px]">
                    <Title text='Готовы перейти на цифровой учет?' color='text-white max-w-[454px]' cls='mb-4' size={'text-[42px] uppercase leading-[110%]'} />
                    <p className='leading-[120%] text-white max-w-[454px]'>Начните использовать современную систему управления пожарной безопасностью уже сегодня</p>
                    <div className="flex justify-between mt-8">
                        <Button className='h-[54px] w-[174px] bg-white !text-[#1E1E1E] ' text={'Войти'} />
                        <div className="flex gap-6">
                            <Button text="Заказать демонстрацию" className='w-[313px] h-[54px] bg-transparent border border-white' />
                            <Button text="Создать QR-код" className='w-[250px] h-[54px] bg-transparent border border-white' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
