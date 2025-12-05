'use client'
import React from 'react'
import Title from '../ui/title'
import SystemCart from '../ui/system-cart'
import { motion } from "framer-motion"

const features = [
    {
        img: "/hero-icons/hero-icon2.svg",
        title: "Электронные журналы",
        text: "Ведение электронного учета работ и услуг с автоматическим формированием записей и отчетов"
    },
    {
        img: "/hero-icons/hero-icon3.svg",
        title: "Автоматические акты",
        text: "Формирование актов выполненных работ в автоматическом режиме\nс возможностью скачивания и печати"
    },
    {
        img: "/hero-icons/hero-icon4.svg",
        title: "Напоминания о ТО",
        text: "Система уведомлений о необходимости проведения технического обслуживания согласно регламенту"
    },
    {
        img: "/hero-icons/hero-icon5.svg",
        title: "Ролевой доступ",
        text: "Разграничение прав доступа для инженеров, заказчиков, менеджеров\nи инспекторов"
    },
    {
        img: "/hero-icons/hero-icon6.svg",
        title: "Облачное хранение",
        text: "Безопасное хранение документации\nи фотофиксации с возможностью доступа\nс любого устройства"
    }
]

export default function System() {
    return (
        <div className='max-w-[1200px] mx-auto mt-[100px] max-md:px-6 max-md:mt-[50px]'>
            {/* Animated Title */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Title text='Ключевые возможности системы' cls="mb-8 max-md:mb-6" />
            </motion.div>

            {/* Stagger Grid */}
            <motion.div
                className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    visible: {
                        transition: {
                            staggerChildren: 0.15
                        }
                    }
                }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 60 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.7,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        whileHover={{
                            y: -12,
                            transition: { duration: 0.3 }
                        }}
                        className="transform-gpu"
                    >
                        <SystemCart
                            img={feature.img}
                            title={feature.title}
                            text={feature.text}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}