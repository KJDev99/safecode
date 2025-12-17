'use client'
import React from 'react'
import Title from '../ui/title'
import Services_Cart from '../ui/services-cart'
import Image from 'next/image'
import { motion } from "framer-motion"

const advantages = [
    { title: 'Экономия времени', text: 'Сокращение времени на ведение документооборота в 5 раз' },
    { title: 'Соответствие требованиям', text: 'Полное соответствие требованиям МЧС и нормативной базе' },
    { title: 'Исключение ошибок', text: 'Автоматизация исключает человеческий фактор при заполнении документов' },
    { title: 'Прозрачность', text: 'Заказчики могут отслеживать выполнение работ в режиме реального времени' },
    { title: 'Мобильность', text: 'Работа с системой прямо на объекте через смартфон' },
    { title: 'Электронная подпись', text: 'Интеграция с Госуслугами для подписания документов ЭП' },
]

export default function AdvantagesHero() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            {/* Title animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Title text='Преимущества системы' cls="mb-8 max-md:mb-6" />
            </motion.div>

            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
                {/* Big image – scale + fade */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className='row-span-3 max-md:order-1'
                >
                    <Image
                        src={'/advantages-hero.png'}
                        alt='advantages-hero'
                        width={384}
                        height={400}
                        className='w-full rounded-[12px] h-full object-cover max-md:order-1'
                    />
                </motion.div>

                {/* Cards with stagger animation */}
                {advantages.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.15 + 0.3, // stagger effect
                            ease: "easeOut"
                        }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }} // kartani ko'tarish
                    >
                        <Services_Cart title={item.title} text={item.text} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}