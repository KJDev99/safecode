import Button from '@/components/ui/button';
import SystemCart from '@/components/ui/system-cart';
import Title from '@/components/ui/title'
import React from 'react'
import { IoNotifications } from 'react-icons/io5';
import { LuPlus } from 'react-icons/lu';
import { CiEdit } from "react-icons/ci";
import { FiEdit3 } from 'react-icons/fi';

export default function ManagerDashboard() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={'Добро пожаловатать, User!'} size={'text-[24px]'} />
                    <p className='text-[#1E1E1E]/60 mt-4'>Обзор текущей активности и задач на сегодня</p>
                </div>
                <div className="w-[54px] h-[54px] flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] relative">
                    <IoNotifications className='text-[#1E1E1E]/50' size={24} />
                    <div className="absolute w-4.5 h-4.5 flex items-center justify-center my-0 border bg-[#E1E2E2] border-[#1E1E1E]/50 rounded-full top-2.5 right-2 text-[#1E1E1E]/50 text-[10px]">
                        3
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
                <SystemCart
                    img="/admin/icon1.svg"
                    title="122"
                    text="Заявки, ожидающие
выставления счёта"
                    imgSize="size-[38px]"
                />
                <SystemCart
                    img="/admin/icon2.svg"
                    title="222"
                    text="Счета, ожидающие оплаты"
                    imgSize="size-[38px]"
                />
                <SystemCart
                    img="/admin/icon3.svg"
                    title="12"
                    text="Акты на подпись"
                    imgSize="size-[38px]"
                />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-6">
                <div
                    className='p-6 rounded-[12px] bg-white flex flex-col'
                    style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
                >
                    <Title text={'Новая договор'} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mb-3"} />
                    <p className={`text-[#1E1E1E99] leading-[120%] grow max-md:text-sm mb-6`}>Быстро создать новый договор для услуги по обслуживанию объекта</p>
                    <Button icon={<LuPlus />} text={'Создать договор'} className='h-[66px] w-full max-md:h-[56px] max-md:text-sm gap-x-2' />
                </div>

                <div
                    className='p-6 rounded-[12px] bg-white flex flex-col'
                    style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
                >
                    <Title text={'Журнал обслуживания'} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mb-3"} />
                    <p className={`text-[#1E1E1E99] leading-[120%] grow max-md:text-sm mb-6`}>Подписать электронный журнал  <br />
                        выполненных работ по объекту </p>
                    <Button icon={<FiEdit3 />} text={'Подписать акты'} className='h-[66px] w-full max-md:h-[56px] max-md:text-sm gap-2 bg-[#E2E2E2] !text-[#8E8E8E]' />
                </div>
            </div>
            <div className='px-6 pt-6 pb-8 w-full rounded-[12px] bg-white flex flex-col mt-6'
                style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                <Title text={'Последняя активность'} size="text-lg" />
                <div className="flex gap-4 items-center mt-6">
                    <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#E2E2E2] rounded-[12px] text-[#1E1E1E99] text-[24px]">?</div>
                    <div className="flex flex-col">
                        <h3 className='text-[#2C5AA0] mb-2 text-lg'>Счет, ожидающий оплаты</h3>
                        <p className='text-[#1E1E1E99] mt-0'>Проверка системы пожаротушения - ТЦ "Мега”</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
