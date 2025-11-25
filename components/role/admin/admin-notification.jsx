import Button from '@/components/ui/button'
import Title from '@/components/ui/title'
import React from 'react'
import { MdCheck } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
export default function AdminNotification() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={"Уведомления"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Последнее обновление 24.09.25</p>
                </div>
                <Button className="h-[54px] w-[185px]" text={"Убрать все"} />
            </div>
            <div className="p-6 mt-6 rounded-xl flex justify-between items-center" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="flex items-center gap-x-4">
                    <div className="h-[50px] w-[50px] bg-[#29C77C] rounded-lg flex items-center justify-center">
                        <MdCheck className='text-white size-6' />
                    </div>
                    <div className="flex flex-col">
                        <Title text={"Ваш отчет принят менеджером"} size={"text-lg"} cls="text-[#2C5AA0]" />
                        <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Мега”</p>
                    </div>
                </div>
                <Button className="h-[54px] w-[176px]" text={"Убрать из списка"} />
            </div>
            <div className="p-6 mt-6 rounded-xl flex justify-between items-center" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="flex items-center gap-x-4">
                    <div className="h-[50px] w-[50px] bg-[#E2E2E2] rounded-lg flex items-center justify-center">
                        <RiQuestionMark className='text-[#1E1E1E99] size-6' />
                    </div>
                    <div className="flex flex-col">
                        <Title text={"Назначена новая заявка на объект ТЦ Мега"} size={"text-lg"} cls="text-[#2C5AA0]" />
                        <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Галлерея”</p>
                    </div>
                </div>
                <Button className="h-[54px] w-[176px] bg-[#E2E2E2] !text-[#8E8E8E]" text={"Смотреть"} />
            </div>
            <div className="p-6 mt-6 rounded-xl flex justify-between items-center" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="flex items-center gap-x-4">
                    <div className="h-[50px] w-[50px] bg-[#D9272799] rounded-lg flex items-center justify-center">
                        <IoMdClose className='text-[#fff] size-6' />
                    </div>
                    <div className="flex flex-col">
                        <Title text={"Заказчик оставил комментарий к заявке №123"} size={"text-lg"} cls="text-[#2C5AA0]" />
                        <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Мега”</p>
                    </div>
                </div>
                <Button className="h-[54px] w-[176px] bg-[#E2E2E2] !text-[#8E8E8E]" text={"Смотреть"} />
            </div>

        </div>
    )
}
