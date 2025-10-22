'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Button from './ui/button'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function MobileNav({ show, setShow }) {

  // scroll block
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [show])

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
            absolute left-0 top-[75px] z-[60]"
        >
          <div className="flex flex-col items-center">
            <Image alt='' src='/logodark.svg' width={200} height={57} className='mb-9' />
            <Button text="Регистрация / Вход" className='w-full mb-[100px] h-[60px]' />

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

                <div className="mt-8 flex flex-col">
                  <Link onClick={() => setShow(false)} href={'/'} className='text-nowrap mb-4 text-[#1E1E1E] '>QR-коды</Link>
                  <Link onClick={() => setShow(false)} href={'/advantages'} className='text-nowrap mb-3 text-[#1E1E1E]/60 '>Создать QR-код</Link>
                </div>
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
