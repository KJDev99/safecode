import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Link from 'next/link'
import React from 'react'

export default function Login() {
    return (
        <div className='grid grid-cols-2 h-[720px] max-md:grid-cols-1'>
            <div className='flex flex-col items-center justify-center '>
                <div className="w-[400px] max-md:w-full max-md:px-6">
                    <div className="relative mb-8">
                        <Link href={'/auth/registration'} className='absolute text-lg text-[#1E1E1E4D] top-1/2 left-0 -translate-y-1/2 max-md:text-base'>Регистрация</Link>
                        <h2 className='text-[#1E1E1E] text-[32px] text-center uppercase max-md:text-[22px]'>Вход</h2>
                    </div>
                    <Input placeholder={"Номер телефона или e-mail"} className={'mb-6 max-md:mb-4 max-md:text-sm max-md:h-[50px]'} />
                    <Input placeholder={"Номер телефона или e-mail"} type='password' className={"max-md:text-sm max-md:h-[50px]"} />
                    <Button text={'Войти'} className='h-[66px] w-full text-lg mt-6 max-md:text-sm ' />
                    <p className='mt-4 text-xs text-[#1E1E1E99] leading-[100%] tracking-[0%] max-md:text-center'>Входя в аккаунт или создавая новый, вы соглашаетесь с нашими Правилами и условиями и Положением о конфиденциальности</p>
                </div>
            </div>
            <div className="bg-[url(/authbg.png)] bg-center bg-cover max-md:hidden"></div>
        </div>
    )
}
