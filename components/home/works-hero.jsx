'use client'
import React from 'react'
import Title from '../ui/title'
import Image from 'next/image'
import { motion } from "framer-motion"

const steps = [
    { number: "1", title: "Сканирование QR-кода", text: "Инженер наводит камеру смартфона на QR-код объекта или системы" },
    { number: "2", title: "Заполнение чек-листа", text: "Выполняет проверку по готовому чек-листу с фотофиксацией" },
    { number: "3", title: "Формирование отчета", text: "Система автоматически формирует акт выполненных работ" },
    { number: "4", title: "Подпись и отправка", text: "Заказчик подписывает документ ЭП прямо в приложении" },
]

export default function WorksHero() {
    return (
        <div className="bg-[#2C5AA0] bg-[url('/hero-work-bg.png')] bg-no-repeat bg-right-bottom max-md:bg-none overflow-hidden">
            <div className='max-w-[1200px] mx-auto py-[82px] max-md:pt-8 max-md:pb-0 max-md:px-6'>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <Title text='Как это работает' color='text-white' cls='mb-8 max-md:mb-6' />
                </motion.div>

                {/* BITTA OTA DIV + to‘g‘ri grid joylashuvi */}
                <motion.div
                    className="grid grid-cols-3 gap-x-16 max-md:grid-cols-1 max-md:gap-x-0 max-md:gap-y-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.25,
                                delayChildren: 0.3
                            }
                        }
                    }}
                >
                    {/* 1-qadam */}
                    <StepItem step={steps[0]} />

                    {/* 2-qadam */}
                    <StepItem step={steps[1]} />

                    {/* Bo‘sh joy — 3 pastga tushishi uchun */}
                    <div className='max-md:hidden' />

                    {/* 3-qadam */}
                    <StepItem step={steps[2]} />

                    {/* 4-qadam */}
                    <StepItem step={steps[3]} />

                    {/* Qo‘shimcha bo‘sh joy (agar kerak bo‘lsa) */}
                    <div />
                </motion.div>
            </div>

            {/* Mobile background */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 1 }}
            >
                <Image
                    src={'/hero-work-bg.png'}
                    alt='Background'
                    width={450}
                    height={260}
                    className='w-full max-w-[450px] h-[260px] object-cover md:hidden mx-auto'
                    priority
                />
            </motion.div>
        </div>
    )
}

// Reusable Step komponenti — kod toza bo‘lishi uchun
function StepItem({ step }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, x: -80, y: 60 },
                visible: { opacity: 1, x: 0, y: 0 }
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex gap-x-6 max-md:gap-x-4 items-center"
        >
            <motion.p
                variants={{
                    hidden: { scale: 0 },
                    visible: { scale: 1 }
                }}
                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                className='text-[100px] font-[300] text-white max-md:text-[64px] leading-none'
            >
                {step.number}
            </motion.p>

            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6 }}
                className="flex flex-col"
            >
                <h3 className='text-white text-lg mb-3 max-md:text-base font-medium'>
                    {step.title}
                </h3>
                <p className='leading-[120%] text-white/60 max-md:text-sm'>
                    {step.text}
                </p>
            </motion.div>
        </motion.div>
    )
}