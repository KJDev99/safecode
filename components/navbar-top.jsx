"use client"
import React, { useEffect, useState } from 'react'
import Button from './ui/button'
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link';

export default function NavbarTop() {
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

    if (!isAuth) return null;

    return (
        <div className='h-25 max-w-[1200px] mx-auto flex items-center gap-4 max-md:hidden'>
            <Link href={'/catalog'}>
                <Button icon={<RxHamburgerMenu />} className='h-15 w-[340px] gap-2' text={"Каталог товаров"} />
            </Link>
            <div className="flex border border-[#1E1E1E99] px-8 py-4 rounded-[12px] grow-1 items-center">
                <input placeholder='Введите артикул, слово или фразу' className='text-[#1E1E1E99] grow-1 outline-0' />
                <IoSearchSharp className='text-[#1E1E1E99] text-xl' />
            </div>
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
    )
}
