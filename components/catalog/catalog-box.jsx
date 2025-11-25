'use client'
import NavbarTop from '@/components/navbar-top'
import Badge from '@/components/ui/badge'
import SelectInput from '@/components/ui/selectInput'
import Title from '@/components/ui/title'
import React, { useState } from 'react'
import CatalogCart from './catalog-cart'

export default function CatalogBox() {

    const [position, setPosition] = useState()
    const positions = [
        { value: 'frontend', label: 'Фронтенд разработчик' },
        { value: 'backend', label: 'Бэкенд разработчик' },
        { value: 'designer', label: 'UI/UX дизайнер' },
        { value: 'manager', label: 'Проект менеджер' },
    ];

    return (
        <div className='mx-auto max-w-[1200px]'>
            <div className="py-8 max-md:px-6">
                <Badge link2={'Каталог товаров'} adress2={'catalog'} link3={'Пожарная безопасность'} className="pb-0 max-md:pb-0" color="text-[#1E1E1E]/60" />
            </div>
            <div className="flex justify-between items-center mb-8 max-md:flex-col">
                <Title text='Каталог' />
                <div className="w-[285px] max-md:w-full max-md:px-6 max-md:mt-4">
                    <SelectInput
                        className={"max-md:text-sm !h-[56px] max-md:h-[50px]"}
                        placeholder="Сортировка по умолчанию"
                        options={positions}
                        value={position}
                        onChange={setPosition}
                    />
                </div>
            </div>
            <CatalogCart />
        </div>
    )
}
