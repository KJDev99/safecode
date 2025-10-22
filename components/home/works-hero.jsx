import React from 'react'
import Title from '../ui/title'
import Image from 'next/image'

export default function WorksHero() {
    return (
        <div
            className="bg-[#2C5AA0] bg-[url('/hero-work-bg.png')] bg-no-repeat bg-right-bottom max-md:bg-none"

        >
            <div className='max-w-[1200px] mx-auto py-[82px] max-md:pt-8 max-md:pb-0 max-md:px-6'>
                <Title text='Как это работает' color='text-white' cls='mb-8 max-md:mb-6' />
                <div className="grid grid-cols-3 gap-x-16 max-md:grid-cols-1 max-md:gap-x-0">
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[100px] font-[300] text-white max-md:text-[64px]'>1</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[100px] font-[300] text-white max-md:text-[64px]'>2</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div></div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[100px] font-[300] text-white max-md:text-[64px]'>3</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[100px] font-[300] text-white max-md:text-[64px]'>4</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
            <Image src={'/hero-work-bg.png'} alt='Background Image' layout='responsive' objectFit='cover' width={450} height={260} className='max-w-[450px] h-[260px] md:hidden' />
        </div>
    )
}
