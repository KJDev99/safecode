import React from 'react'
import Title from '../ui/title'
import Services_Cart from '../ui/services-cart'
import Image from 'next/image'

export default function AdvantagesHero() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            <Title text='Преимущества системы' cls="mb-8 max-md:mb-6" />
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
                <Image src={'/advantages-hero.png'} alt='advantages-hero' width={384} height={400} className='w-full rounded-[12px] row-span-3 h-full max-md:order-1' />
                <Services_Cart title={'Экономия времени'} text={'Сокращение времени на ведение документооборота в 5 раз'} />
                <Services_Cart title={'Соответствие требованиям'} text={'Полное соответствие требованиям МЧС и нормативной базе'} />
                <Services_Cart title={'Исключение ошибок'} text={'Автоматизация исключает человеческий фактор при заполнении документов'} />
                <Services_Cart title={'Прозрачность'} text={'Заказчики могут отслеживать выполнение работ в режиме реального времени'} />
                <Services_Cart title={'Мобильность'} text={'Работа с системой прямо на объекте через смартфон'} />
                <Services_Cart title={'Электронная подпись'} text={'Интеграция с Госуслугами для подписания документов ЭП'} />
            </div>
        </div>
    )
}
