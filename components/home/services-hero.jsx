'use client'
import React, { useEffect } from 'react'
import Title from '../ui/title'
import Services_Cart from '../ui/services-cart'
import { useApiStore } from '@/store/useApiStore'
import { motion } from "framer-motion"

export default function ServicesHero() {
    const { data, loading, error, getData } = useApiStore()

    useEffect(() => {
        getData("/website/services/")
    }, [getData])

    if (loading) return <div className="text-center py-16 text-gray-500">Yuklanmoqda...</div>
    if (error) return <div className="text-center py-16 text-red-500">Xatolik yuz berdi: {error}</div>
    if (!data || !Array.isArray(data)) return <div className="text-center py-16">Ma'lumot topilmadi</div>

    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            {/* Title Animation */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
            >
                <Title text='Услуги' cls="mb-8 max-md:mb-6" />
            </motion.div>

            {/* Cards Grid with Stagger Animation */}
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
                {data.map((service, index) => (
                    <motion.div
                        key={service.id}
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.6,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        whileHover={{
                            y: -10,
                            transition: { duration: 0.3 }
                        }}
                        className="transform-gpu" // GPU acceleration uchun
                    >
                        <Services_Cart
                            title={service.title || ""}
                            text={service.description || ''}
                            text2={`От ${parseFloat(service.price).toLocaleString('ru-RU')} ₽/месяц`}
                            button={'Заказать услугу'}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}