import React from 'react'
import Title from '../ui/title'
import Button from '../ui/button'

export default function FinallySection() {
    return (
        <div
            className="
    bg-[#2C5AA0]
    bg-no-repeat bg-center bg-auto
    bg-[url('/heroendbg.png')]        
    max-md:bg-[url('/heroendbg2.png')]
  "
        >
            <div className='max-w-[1200px] mx-auto max-md:px-6'>
                <div className=" flex flex-col md:justify-center h-[392px] max-md:h-[410px] max-md:pt-8 max-md:pb-12 ">
                    <Title text='Готовы перейти на цифровой учет?' color='text-white max-w-[454px]' cls='mb-4' size={'text-[42px] uppercase leading-[110%] max-md:text-[22px]'} />
                    <p className='leading-[120%] text-white max-w-[454px]  max-md:text-sm max-md:mr-10'>Начните использовать современную систему управления пожарной безопасностью уже сегодня</p>
                    <div className="flex justify-between mt-8 max-md:flex-col max-md:mt-6">
                        <Button className='h-[54px] w-[174px] bg-white !text-[#1E1E1E] max-md:w-full max-md:mb-6' text={'Войти'} />
                        <div className="flex gap-6 max-md:flex-col max-md:gap-4">
                            <Button text="Заказать демонстрацию" className='w-[313px] h-[54px] bg-transparent max-md:w-full border border-white' />
                            <Button text="Создать QR-код" className='w-[250px] h-[54px] bg-transparent max-md:w-full border border-white' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
