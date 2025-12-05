'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Button from './ui/button.jsx'
import Link from 'next/link.js'
import { IoIosMenu, IoIosCloseCircleOutline } from "react-icons/io";
import MobileNav from './mobile-nav.jsx'
import { useRouter } from 'next/navigation.js'
import ProfileDropdown from './ui/ProfileDropdown.jsx'
export default function Navbar() {
    const [showMenu, setShowMenu] = useState(false)
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState()
    const checkAuth = () => {
        const auth = localStorage.getItem("isAuthenticated");
        const group = localStorage.getItem("user");
        setIsAuth(auth === "true");
        if (group) {


            setRole(JSON.parse(group)?.groups[0]?.name);
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("authChanged", checkAuth);

        return () => {
            window.removeEventListener("authChanged", checkAuth);
        };

    }, []);
    return (
        <div className='bg-[#1E1E1E] relative z-50'>
            <div className='max-w-[1200px] mx-auto max-md:px-6'>
                <div className='flex justify-between items-center h-[106px] max-md:h-[75px] gap-11'>
                    <Link href={'/'}>
                        <Image alt='' src='/logo.svg' width={134} height={44} className='max-md:w-[117px] max-md:h-[33px]' />
                    </Link>
                    <ul className="flex gap-5 items-center max-md:hidden">
                        <Link href={'/'} className='text-white/60 '>Главная</Link >
                        <Link href={'/services'} className='text-white/60 '>Услуги</Link >
                        <Link href={'/advantages'} className='text-white/60 '>Преимущества</Link >
                        <Link href={'/partners'} className='text-white/60 '>Партнерам</Link >
                        <Link href={'/contact'} className='text-white/60 '>Контакты</Link >
                    </ul>
                    <div className="flex gap-8 items-center max-md:hidden">
                        <div className="flex gap-4">
                            <a href="tel:84957084213" className="flex flex-col">
                                <p className='text-sm text-white/60'>Номер для связи: </p>
                                <p className='text-white'>8 (495) 708-42-13</p>
                            </a>
                            <a href="mailto:safecode@sfcrm.ru" className="flex flex-col">
                                <p className='text-sm text-white/60'>Почта: </p>
                                <p className='text-white'>safecode@sfcrm.ru</p>
                            </a>
                        </div>
                        {
                            !isAuth
                                ? <Link href={'/auth/login'}>
                                    <Button text="Регистрация / Вход" className='w-40 h-15 ' />
                                </Link>
                                : <ProfileDropdown role={role} setShow={setShowMenu} />
                        }

                    </div>

                    {
                        showMenu ?
                            <IoIosCloseCircleOutline onClick={() => setShowMenu(false)} className='text-white text-3xl cursor-pointer md:hidden' />
                            :
                            <IoIosMenu onClick={() => setShowMenu(true)} className='text-white text-3xl cursor-pointer md:hidden' />
                    }
                    <MobileNav show={showMenu} setShow={setShowMenu} role={role} />
                </div>
            </div>
        </div>
    )
}
