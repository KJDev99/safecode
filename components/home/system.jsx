import React from 'react'
import Title from '../ui/title'
import SystemCart from '../ui/system-cart'

export default function System() {
    return (
        <div className='max-w-[1200px] mx-auto mt-[100px] max-md:px-6 max-md:mt-[50px]'>
            <Title text='Ключевые возможности системы' cls="mb-8 max-md:mb-6" />
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
                <SystemCart
                    img="/hero-icons/hero-icon1.svg"
                    title="QR-коды для смартфонов"
                    text="Создание QR-кодов для быстрого доступа к карточкам объектов и формированию отчетов прямо с мобильного устройства" />
                <SystemCart
                    img="/hero-icons/hero-icon2.svg"
                    title="Электронные журналы"
                    text="Ведение электронного учета работ и услуг с автоматическим формированием записей и отчетов" />
                <SystemCart
                    img="/hero-icons/hero-icon3.svg"
                    title="Автоматические акты"
                    text="Формирование актов выполненных работ в автоматическом режиме
с возможностью скачивания и печати" />
                <SystemCart
                    img="/hero-icons/hero-icon4.svg"
                    title="Напоминания о ТО"
                    text="Система уведомлений о необходимости проведения технического обслуживания согласно регламенту" />
                <SystemCart
                    img="/hero-icons/hero-icon5.svg"
                    title="Ролевой доступ"
                    text="Разграничение прав доступа для инженеров, заказчиков, менеджеров
и инспекторов" />
                <SystemCart
                    img="/hero-icons/hero-icon6.svg"
                    title="Облачное хранение"
                    text="Безопасное хранение документации
и фотофиксации с возможностью доступа
с любого устройства" />
            </div>
        </div>
    )
}
