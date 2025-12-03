'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Button from './ui/button'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileDropdown from './ui/ProfileDropdown'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'

export default function MobileNav({ show, setShow, role }) {

  // scroll block
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [show])

  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = () => {
    const auth = localStorage.getItem("isAuthenticated");
    setIsAuth(auth === "true");
  };

  useEffect(() => {
    checkAuth();

    window.addEventListener("authChanged", checkAuth);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="bg-[#fff] px-6 pt-12 pb-16
            h-[calc(100vh_-_75px)] w-full
            absolute left-0 top-[75px] !z-100"
        >
          <div className="flex flex-col items-center">
            <Image alt='' src='/logodark.svg' width={200} height={57} className='mb-9' />
            {
              !isAuth
                ? <Link href={'/auth/login'}>
                  <Button text="Регистрация / Вход" className='w-full mb-[100px] h-[60px]' />
                </Link>
                : <div className="w-full mb-[100px] flex justify-center gap-2">
                  <ProfileDropdown role={role} setShow={setShow} />
                  <div className="w-15 h-15 flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px]">
                    <FaHeart className='text-[#1E1E1E]/50' size={24} />
                  </div>
                  <div className="w-15 h-15 flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] relative">
                    <FaShoppingCart className='text-[#1E1E1E]/50' size={24} />
                    <div className="absolute w-4.5 h-4.5 flex items-center justify-center my-0 border bg-[#E1E2E2] border-[#1E1E1E]/50 rounded-full top-2.5 right-2 text-[#1E1E1E]/50 text-[10px]">
                      2
                    </div>
                  </div>
                </div>
            }


            <div className="w-full grid grid-cols-2 mb-16 gap-y-6">
              <a href="tel:84957084213" className="flex flex-col">
                <p className='text-sm text-[#1E1E1E]/60'>Номер для связи: </p>
                <p className='text-[#1E1E1E]'>8 (495) 708-42-13</p>
              </a>
              <a href="mailto:safecode@sfcrm.ru" className="flex flex-col">
                <p className='text-sm text-[#1E1E1E]/60'>Почта: </p>
                <p className='text-[#1E1E1E]'>safecode@sfcrm.ru</p>
              </a>

              <div className="flex flex-col mt-8">
                <Link onClick={() => setShow(false)} href={'/'} className='mb-4 text-[#1E1E1E] '>Главная</Link>
                <Link onClick={() => setShow(false)} href={'/advantages'} className='mb-3 text-[#1E1E1E]/60 '>Преимущества</Link>
                <Link onClick={() => setShow(false)} href={'/services'} className='mb-3 text-[#1E1E1E]/60 '>Услуги</Link>
                <Link onClick={() => setShow(false)} href={'/partners'} className='mb-3 text-[#1E1E1E]/60 '>Партнерам</Link>
                <Link onClick={() => setShow(false)} href={'/contact'} className='mb-3 text-[#1E1E1E]/60 '>Контакты</Link>
              </div>

              <div className="flex flex-col mt-8">
                <Link onClick={() => setShow(false)} href={'/'} className='text-nowrap mb-4 text-[#1E1E1E] '>CRM-сервис</Link>
                <Link onClick={() => setShow(false)} href={'/advantages'} className='text-nowrap mb-3 text-[#1E1E1E]/60 '>Техническая поддержка</Link>
                <Link onClick={() => setShow(false)} href={'/services'} className='text-nowrap text-[#1E1E1E]/60 '>Вход в личный кабинет</Link>


              </div>
            </div>

            <p className='text-sm text-[#1E1E1E]/60 mb-6'>SafeCode © 2025. Все права защищены.</p>
            <p className='text-sm text-[#1E1E1E]/60 mb-3'>Политика конфиденциальности</p>
            <p className='text-sm text-[#1E1E1E]/60'>Правовая информация</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
