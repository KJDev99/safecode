'use client'
import React, { useEffect, useState } from 'react'
import Button from '../ui/button'
import Badge from '../ui/badge'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
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
                staggerChildren: 0.3,
                delayChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        },
        whileHover: {
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        whileTap: { scale: 0.95 }
    };

    return (
        <div className="relative h-[794px] max-md:h-[769px] bg-cover bg-center bg-[url('/hero.png')] flex flex-col items-center md:justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#40404080] to-[rgba(67,67,67,0.2)]"></div>

            <motion.div
                className="relative z-10 text-center px-4 max-md:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-white text-[48px] max-md:text-[28px] leading-[110%] tracking-[-1%] uppercase max-w-[700px] mx-auto font-bold max-md:mt-[260px]"
                    variants={titleVariants}
                >
                    Электронный учет пожарной безопасности
                </motion.h1>

                <motion.p
                    className="mt-6 mb-12 text-white leading-[114%] tracking-[-1%] text-lg max-w-[670px] mx-auto max-md:text-sm max-md:mb-[130px]"
                    variants={textVariants}
                >
                    Современная система управления QR-кодами для ведения журналов, формирования актов и контроля состояния систем пожарной безопасности
                </motion.p>

                {!isAuth ? (
                    <motion.div
                        className="flex gap-6 justify-center max-md:flex-col-reverse"
                        variants={buttonVariants}
                    >
                        <Link href={'/auth/login'}>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                                <Button text="Заказать услугу" className='w-[270px] h-15 max-md:w-full' />
                            </motion.div>
                        </Link>
                        <Link href={'/auth/login'}>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                                <Button text="Войти" className='w-[170px] h-15 bg-transparent border border-white max-md:w-full' />
                            </motion.div>
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex gap-6 justify-center max-md:flex-col-reverse"
                        variants={buttonVariants}
                    >
                        <Link href={'/services'}>
                            <motion.div variants={buttonVariants} whileHover="whileHover" whileTap="whileTap">
                                <Button text="Заказать услугу" className='w-[270px] h-15 max-md:w-full' />
                            </motion.div>
                        </Link>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}