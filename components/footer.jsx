import React from 'react'
import Button from './ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <div className='bg-[#1E1E1E]'>
            <div className='max-w-[1200px] mx-auto  pl-16  py-16 '>
                <div className="grid grid-cols-5 mb-8">
                    <div className="col-span-2">
                        <Image alt='' src='/logo.svg' width={134} height={44} className='mb-6' />
                        <a href="tel:84957084213" className="flex flex-col mb-4">
                            <p className='text-sm text-white/60'>Номер для связи: </p>
                            <p className='text-white'>8 (495) 708-42-13</p>
                        </a>
                        <a href="mailto:safecode@sfcrm.ru" className="flex flex-col">
                            <p className='text-sm text-white/60'>Почта: </p>
                            <p className='text-white'>safecode@sfcrm.ru</p>
                        </a>
                    </div>
                    <div className="flex flex-col">
                        <h2 className='text-lg text-white mb-6'>Главная</h2>
                        <p className='mb-4 text-white/60'>Преимущества</p>
                        <p className='mb-4 text-white/60'>Услуги</p>
                        <p className='mb-4 text-white/60'>Партнерам</p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className='text-lg text-white mb-6'>CRM-сервис</h2>
                        <p className='mb-4 text-white/60'>Техническая поддержка</p>
                        <p className='mb-4 text-white/60'>Вход в личный кабинет</p>
                    </div>
                    <div className="flex flex-col">
                        <h2 className='text-lg text-white mb-6'>QR-коды</h2>
                        <p className='mb-4 text-white/60'>Создать QR-код</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <p className='text-xs cursor-pointer text-white/60'>SafeCode © 2025. Все права защищены.</p>
                    <div className="flex gap-x-8">
                        <p className='text-xs cursor-pointer text-white/60'>Политика конфиденциальности</p>
                        <p className='text-xs cursor-pointer text-white/60'>Правовая информация</p>
                        <p className='text-xs cursor-pointer text-white/60'>Контакты</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
