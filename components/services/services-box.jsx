import Image from 'next/image'
import React from 'react'
import Title from '../ui/title'
import Button from '../ui/button'

export default function ServicesBox() {
    return (
        <div className='mt-12 mb-[100px] max-w-[1200px] mx-auto max-md:mt-8 max-md:mb-[50px] max-md:px-6' >
            <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                <div className="p-6 rounded-[12px]" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <div className="px-2 pt-2 pb-0 max-md:px-0 max-md:pt-0">
                        <Title text={'Базовый пакет'} size={"text-[24px] max-md:text-[18px]"} color={"text-[#2C5AA0]"} />
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'>Подходит для небольших компаний и организаций, где важно вести учёт в простом и удобном формате.</p>
                        <h3 className='text-[#1E1E1E] mb-2 max-md:text-sm'>Включает в себя:</h3>
                        <ul>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Создание уникальных QR-кодов для систем и объектов;</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Электронные журналы технического обслуживания (вместо бумажных);</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Автоматическое формирование актов выполненных работ;</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Удобный личный кабинет для заказчика и инженеров.</li>
                        </ul>
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'><span className='text-[#1E1E1E]'>Зачем:</span> Экономия времени на документации, упрощение контроля за объектами.</p>
                        <p className='text-[#1E1E1E99] leading-[120%]'><span className='text-[#1E1E1E]'>Для кого:</span> управляющие компании, небольшие ТЦ, школы, офисы.</p>
                        <div className="flex justify-between md:items-center h-[66px] mt-6 max-md:flex-col max-md:h-max ">
                            <p className='text-[#1E1E1E] text-[20px] max-md:text-lg max-md:mb-[18px]'>От 15 000 ₽/месяц</p>
                            <Button text={"Заказать услугу"} className='w-[324px] h-full max-md:h-[66px] max-md:w-full' />
                        </div>
                    </div>
                </div>
                <Image src={'/services/one.png'} alt='services' width={588} height={490} className='w-full max-md:' />
                <Image src={'/services/two.png'} alt='services' width={588} height={490} className='w-full max-md:order-1' />
                <div className="p-6 rounded-[12px]" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <div className="px-2 pt-2 pb-0 max-md:px-0 max-md:pt-0">
                        <Title text={'Профессиональный пакет'} size={"text-[24px] max-md:text-[18px]"} color={"text-[#2C5AA0]"} />
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'>Решение для компаний со средней инфраструктурой и большим документооборотом.</p>
                        <h3 className='text-[#1E1E1E] mb-2 max-md:text-sm'>Включает все возможности базового пакета, а также:</h3>
                        <ul>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Облачное хранилище документов (доступ из любой точки, защита данных);</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Интеграция с электронной подписью (подписание актов и журналов без печати);</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Многопользовательский доступ (несколько инженеров и заказчиков работают параллельно);</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Автоматические уведомления о сроках годности средств и датах проверок.</li>
                        </ul>
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'><span className='text-[#1E1E1E]'>Зачем:</span> Избавляет от риска потери документов, ускоряет согласование актов и счетов.</p>
                        <p className='text-[#1E1E1E99] leading-[120%]'><span className='text-[#1E1E1E]'>Для кого:</span> строительные компании, сети магазинов, крупные бизнес-центры.</p>
                        <div className="flex justify-between md:items-center h-[66px] mt-6 max-md:flex-col max-md:h-max ">
                            <p className='text-[#1E1E1E] text-[20px] max-md:text-lg max-md:mb-[18px]'>От 25 000 ₽/месяц</p>
                            <Button text={"Заказать услугу"} className='w-[324px] h-full max-md:h-[66px] max-md:w-full' />
                        </div>
                    </div>
                </div>
                <div className="p-6 rounded-[12px] max-md:order-2" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <div className="px-2 pt-2 pb-0 max-md:px-0 max-md:pt-0">
                        <Title text={'Базовый пакет'} size={"text-[24px] max-md:text-[18px]"} color={"text-[#2C5AA0]"} />
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'>Подходит для небольших компаний и организаций, где важно вести учёт в простом и удобном формате.</p>
                        <h3 className='text-[#1E1E1E] mb-2 max-md:text-sm'>Включает в себя:</h3>
                        <ul>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Создание уникальных QR-кодов для систем и объектов;</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Электронные журналы технического обслуживания (вместо бумажных);</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Автоматическое формирование актов выполненных работ;</li>
                            <li className='text-[#1E1E1E99] list-disc ml-6 max-md:text-sm'>Удобный личный кабинет для заказчика и инженеров.</li>
                        </ul>
                        <p className='text-[#1E1E1E99] my-4 leading-[120%] max-md:text-sm max-md:my-3'><span className='text-[#1E1E1E]'>Зачем:</span> Экономия времени на документации, упрощение контроля за объектами.</p>
                        <p className='text-[#1E1E1E99] leading-[120%]'><span className='text-[#1E1E1E]'>Для кого:</span> управляющие компании, небольшие ТЦ, школы, офисы.</p>
                        <div className="flex justify-between md:items-center h-[66px] mt-6 max-md:flex-col max-md:h-max ">
                            <p className='text-[#1E1E1E] text-[20px] max-md:text-lg max-md:mb-[18px]'>От 15 000 ₽/месяц</p>
                            <Button text={"Заказать услугу"} className='w-[324px] h-full max-md:h-[66px] max-md:w-full' />
                        </div>
                    </div>
                </div>
                <Image src={'/services/three.png'} alt='services' width={588} height={490} className='w-full max-md:order-3' />
            </div>
        </div>
    )
}
