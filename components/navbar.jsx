import Image from 'next/image'
import React from 'react'
import Button from './ui/button.jsx'
import Link from 'next/link.js'

export default function Navbar() {
    return (
        <div className='bg-[#1E1E1E]'>
            <div className='max-w-[1200px] mx-auto'>
                <div className='flex justify-between items-center h-[106px] gap-11'>
                    <Image alt='' src='/logo.svg' width={134} height={44} />

                    <ul className="flex gap-5 items-center">
                        <Link href={'/'} className='text-white/60 '>Главная</Link >
                        <select className='text-white/60 '>
                            <option value="Услуги">Услуги</option>
                            <option value="Услуги">Услуги1</option>
                            <option value="Услуги">Услуги2</option>
                        </select >
                        <Link href={'/advantages'} className='text-white/60 '>Преимущества</Link >
                        <Link href={'/'} className='text-white/60 '>Партнерам</Link >
                        <Link href={'/'} className='text-white/60 '>Контакты</Link >
                    </ul>
                    <div className="flex gap-8 items-center">
                        <div className="flex gap-4">
                            <a href="tel:84957084213" className="flex flex-col">
                                <p className='text-sm text-white/60'>Номер для связи: </p>
                                <p className='text-white'>8 (495) 708-42-13</p>
                            </a>
                            <a href="mailto:safecode@sfcrm.ru" className="flex flex-col">
                                <p className='text-sm text-white/60'>Почта: </p>
                                <p className='text-white'>safecode@sfcrm.ru</p>
                            </a>
                        </div>
                        <Button text="Регистрация / Вход" className='w-40 h-15 ' />
                    </div>
                </div>
            </div>
        </div>
    )
}
