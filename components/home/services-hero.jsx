import React from 'react'
import Title from '../ui/title'
import Services_Cart from '../ui/services-cart'

export default function ServicesHero() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] '>
            <Title text='Услуги' cls="mb-8" />
            <div className="grid grid-cols-3 gap-6">
                <Services_Cart title={'Базовый пакет'} text={'Создание QR-кодов, ведение электронных журналов, формирование актов'} text2={'От 15 000 ₽/месяц'} button={'Заказать услугу'} />
                <Services_Cart title={'Профессиональный пакет'} text={'Базовый пакет + облачное хранилище, интеграция с ЭП, многопользовательский доступ'} text2={'От 25 000 ₽/месяц'} button={'Заказать услугу'} />
                <Services_Cart title={'Корпоративный пакет'} text={'Все возможности + CRM-интеграция, индивидуальная настройка, техническая поддержка 24/7'} text2={'От 50 000 ₽/месяц'} button={'Заказать услугу'} />
            </div>
        </div>
    )
}
