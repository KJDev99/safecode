'use client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import SelectInput from '@/components/ui/selectInput'
import Link from 'next/link'
import React, { useState } from 'react'

export default function Registration() {
    const [position, setPosition] = useState()
    const positions = [
        { value: 'frontend', label: 'Фронтенд разработчик' },
        { value: 'backend', label: 'Бэкенд разработчик' },
        { value: 'designer', label: 'UI/UX дизайнер' },
        { value: 'manager', label: 'Проект менеджер' },
    ];

    return (
        <div className='grid grid-cols-2 h-[720px] max-md:h-[769px] max-md:grid-cols-1'>
            <div className='flex flex-col items-center justify-center '>
                <div className="w-[624px] max-md:w-full max-md:px-6">
                    <div className="relative mb-8">
                        <Link href={'/auth/login'} className='absolute text-lg text-[#1E1E1E4D] top-1/2 left-0 -translate-y-1/2 max-md:text-base'>Вход</Link>
                        <h2 className='text-[#1E1E1E] text-[32px] text-center uppercase max-md:text-[22px]'>Регистрация</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4">
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Ваше имя *"} />
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Ваша фамилия *"} />
                        <SelectInput
                            className={"max-md:text-sm max-md:h-[50px]"}
                            placeholder="Ваша должность *"
                            options={positions}
                            value={position}
                            onChange={setPosition}
                        />
                        {/* <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Ваша должность *"} /> */}
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Id организации *"} />
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Номер телефона *"} type='number' />
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"E-mail *"} text={'На почту придет код для подтверждения'} />
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Введите пароль *"} type='password' />
                        <Input className={"max-md:text-sm max-md:h-[50px]"} placeholder={"Повторите пароль *"} type='password' />
                    </div>
                    <Button text={'Зарегистрироваться'} className='h-[66px] w-full text-lg mt-6 max-md:text-sm' />
                    <p className='mt-4 text-xs text-[#1E1E1E99] leading-[100%] tracking-[0%] max-md:text-center'>Входя в аккаунт или создавая новый, вы соглашаетесь с нашими Правилами и условиями и Положением о конфиденциальности</p>
                </div>
            </div>
            <div className="bg-[url(/authbg.png)] bg-center bg-cover max-md:hidden"></div>
        </div>
    )
}
