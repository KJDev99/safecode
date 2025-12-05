'use client'
import React, { useEffect, useState } from 'react'
import Title from '../ui/title'
import Button from '../ui/button'
import { motion } from 'framer-motion'

export default function FinallySection() {
    const [isAuth, setIsAuth] = useState(false);

    const checkAuth = () => {
        const auth = localStorage.getItem("isAuthenticated");
        setIsAuth(auth === "true");
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("authChanged", checkAuth);
        return () => window.removeEventListener("authChanged", checkAuth);
    }, []);

    // Animatsiya variantlari
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.25,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" }
        },
        whileHover: { scale: 1.05, transition: { duration: 0.2 } },
        whileTap: { scale: 0.95 }
    };

    return (
        <div className="bg-[#2C5AA0] bg-no-repeat bg-center bg-auto bg-[url('/heroendbg.png')] max-md:bg-[url('/heroendbg2.png')] overflow-hidden">
            <div className='max-w-[1200px] mx-auto max-md:px-6'>
                <motion.div
                    className="flex flex-col md:justify-center h-[392px] max-md:h-[410px] max-md:pt-8 max-md:pb-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <motion.div variants={itemVariants}>
                        <Title
                            text='Готовы перейти на цифровой учет?'
                            color='text-white max-w-[454px]'
                            cls='mb-4'
                            size={'text-[42px] uppercase leading-[110%] max-md:text-[22px]'}
                        />
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className='leading-[120%] text-white max-w-[454px] max-md:text-sm max-md:mr-10'
                    >
                        Начните использовать современную систему управления пожарной безопасностью уже сегодня
                    </motion.p>

                    <motion.div
                        className="flex justify-between mt-8 max-md:flex-col max-md:mt-6"
                        variants={itemVariants}
                    >
                        <div className="flex gap-6 max-md:flex-col max-md:gap-4">
                            {/* Agar login bo'lmasa — "Войти" tugmasi */}
                            {!isAuth && (
                                <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                                    <Button
                                        className='h-[54px] w-[174px] bg-white !text-[#1E1E1E] max-md:w-full max-md:mb-6'
                                        text={'Войти'}
                                    />
                                </motion.div>
                            )}

                            {/* Har doim ko'rinadigan tugma */}
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                                <Button
                                    text="Заказать демонстрацию"
                                    className='w-[313px] h-[54px] bg-transparent max-md:w-full border border-white'
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}