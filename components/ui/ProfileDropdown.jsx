"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { IoIosArrowDown } from 'react-icons/io';

export default function ProfileDropdown({ role, setShow }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    console.log(role);


    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className={`w-[185px] h-15 bg-[#2C5AA0]  flex items-center justify-center text-[#fff] font-medium gap-[13px]
                     ${open ? 'rounded-t-[12px]' : 'rounded-[12px]'}
                    `}
            >
                <div className="h-[34px] w-[34px] rounded-[8px]" style={{ background: "linear-gradient(154.11deg, #6BA5FF 9.13%, #0963EB 92.31%)" }}>

                </div>
                <div className="flex items-center text-sm gap-1.5">
                    Ваш профиль
                    <IoIosArrowDown />
                </div>

            </button>

            {/* Dropdown */}
            <div className={`absolute left-0 mt-0 w-[185px] bg-[#2C5AA0] rounded-b-[12px] 
                ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 hidden'}
            `}>


                {
                    role == "Дежурный инженер"
                        ? <div className="flex flex-col">
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=dashboard">Дашборд</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=new-application">Новые заявки</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=all-application">Все заявки</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=objects">Объекты</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=reports">Отчеты</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=notifications">Уведомления</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=myorders">Мои заказы</Link>
                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/duty-engineer?tab=settings">Настройки</Link>
                        </div>
                        : role == "Заказчик"
                            ? <div className="flex flex-col">
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=dashboard">Дашборд</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=objects">Мои объекты</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=application">Заявки</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=service-log">Журнал обслуживания</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=notifications">Уведомления</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=myorders">Мои заказы</Link>
                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/customer?tab=settings">Настройки</Link>
                            </div>
                            : role == "Инспектор МЧС"
                                ? <div className="flex flex-col">
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=dashboard">Дашборд</Link>
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=access-object">Доступ к объекту</Link>
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=objects">Мои объекты</Link>
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=document">Документы</Link>
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=notifications">Уведомления</Link>
                                    <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/inspectors?tab=settings">Настройки</Link>
                                </div>
                                : role == "Исполнителя"
                                    ? <div className="flex flex-col">
                                        <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/performer?tab=dashboard">Дашборд</Link>
                                        <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/performer?tab=requests">Мои заявки</Link>
                                        <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/performer?tab=reports">Отчеты</Link>
                                        <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/performer?tab=notifications">Уведомления</Link>
                                        <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/performer?tab=settings">Настройки</Link>
                                    </div>
                                    : role == "Менеджер"
                                        ? <div className="flex flex-col">
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=dashboard">Дашборд</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=requests">Заявки</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=bills">Счета</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=jurnals">Журналы и акты</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=storage">Хранилище</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=notifications">Уведомления</Link>
                                            <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=settings">Настройки</Link>
                                        </div>
                                        : role == "Обслуживающий инженер"
                                            ? <div className="flex flex-col">
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=dashboard">Дашборд</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=requests">Заявки</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=bills">Счета</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=jurnals">Журналы и акты</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=storage">Хранилище</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=notifications">Уведомления</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/manager?tab=settings">Настройки</Link>
                                            </div>
                                            : <div className="flex flex-col">
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=dashboard">Дашборд</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=users">Пользователи и роли</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=requests">Заявки и проекты</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=storage">Хранилище</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=notifications">Уведомления</Link>
                                                <Link onClick={() => setShow(false)} className="px-4 py-2 hover:text-white text-sm text-[white]/60" href="/roles/admin-panel?tab=settings">Настройки</Link>
                                            </div>
                }


            </div>
        </div>
    );
}
