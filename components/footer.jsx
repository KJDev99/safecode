import React from 'react'
import Button from './ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <div className='bg-[#1E1E1E]'>
            <div className='max-w-[1200px] mx-auto  pl-16  py-16 max-md:hidden '>
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
                        <Link href={'/'} className='text-lg text-white mb-6'>Главная</Link>
                        <Link href={'/advantages'} className='mb-4 text-white/60'>Преимущества</Link>
                        <Link href={'/services'} className='mb-4 text-white/60'>Услуги</Link>
                        <Link href={'/partners'} className='mb-4 text-white/60'>Партнерам</Link>
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
                        <Link href={'/contact'} className='text-xs cursor-pointer text-white/60'>Контакты</Link>
                    </div>
                </div>
            </div>
            <div className="md:hidden max-md:px-6 pt-8 pb-[50px]">
                <div className="flex flex-col items-center ">
                    <Image alt='' src='/logo.svg' width={134} height={44} className='mb-6' />
                    <div className="w-full grid grid-cols-2 mb-8">
                        <a href="tel:84957084213" className="flex flex-col">
                            <p className='text-sm text-[#fff]/60'>Номер для связи: </p>
                            <p className='text-[#fff]'>8 (495) 708-42-13</p>
                        </a>
                        <a href="mailto:safecode@sfcrm.ru" className="flex flex-col">
                            <p className='text-sm text-[#fff]/60'>Почта: </p>
                            <p className='text-[#fff]'>safecode@sfcrm.ru</p>
                        </a>
                        <div className="flex flex-col mt-6">
                            <Link href={'/'} className='mb-4 text-[#fff] '>Главная</Link >
                            <Link href={'/advantages'} className='mb-3 text-[#fff]/60 '>Преимущества</Link >
                            <Link href={'/services'} className='mb-3 text-[#fff]/60 '>Услуги</Link >
                            <Link href={'/partners'} className='mb-3 text-[#fff]/60 '>Партнерам</Link >
                            <Link href={'/contact'} className='mb-3 text-[#fff]/60 '>Контакты</Link >
                        </div>
                        <div className="flex flex-col mt-6">
                            <div className="mb-10 flex flex-col">
                                <Link href={'/'} className='text-nowrap mb-4 text-[#fff] '>CRM-сервис</Link >
                                <Link href={'/advantages'} className='text-nowrap mb-3 text-[#fff]/60 '>Техническая поддержка</Link >
                                <Link href={'/services'} className='text-nowrap text-[#fff]/60 '>Вход в личный кабинет</Link >
                            </div>
                            <div className="flex flex-col">
                                <Link href={'/'} className='text-nowrap mb-4 text-[#fff] '>QR-коды</Link >
                                <Link href={'/advantages'} className='text-nowrap mb-3 text-[#fff]/60 '>Создать QR-код</Link >
                            </div>
                        </div>
                    </div>
                    <p className='text-sm text-[#fff]/60 mb-6'>SafeCode © 2025. Все права защищены.</p>
                    <p className='text-sm text-[#fff]/60 mb-3'>Политика конфиденциальности</p>
                    <p className='text-sm text-[#fff]/60 '>Правовая информация</p>
                </div>
            </div>
        </div>
    )
}
