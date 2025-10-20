import React from 'react'
import Title from '../ui/title'

export default function WorksHero() {
    return (
        <div
            className='bg-[#2C5AA0] '
            style={{
                backgroundImage: 'url("/hero-work-bg.png")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right bottom',
                backgroundSize: 'auto',
            }}
        >
            <div className='max-w-[1200px] mx-auto py-[82px]'>
                <Title text='Как это работает' color='text-white' cls='mb-8' />
                <div className="grid grid-cols-3 gap-x-16">
                    <div className="flex gap-x-6 items-center">
                        <p className='text-[100px] font-[300] text-white'>1</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 '>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 items-center">
                        <p className='text-[100px] font-[300] text-white'>2</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 '>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div></div>
                    <div className="flex gap-x-6 items-center">
                        <p className='text-[100px] font-[300] text-white'>3</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 '>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 items-center">
                        <p className='text-[100px] font-[300] text-white'>4</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 '>Сканирование QR-кода</h3>
                            <p className='leading-[120%] text-white/60'>Инженер наводит камеру смартфона на QR-код объекта или системы</p>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
