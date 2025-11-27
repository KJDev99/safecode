import Button from '@/components/ui/button'
import Title from '@/components/ui/title'
import React from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdCheck } from 'react-icons/md'
import { RiQuestionMark } from 'react-icons/ri'
import 'leaflet/dist/leaflet.css'

import dynamic from 'next/dynamic'

const MapWithNoSSR = dynamic(() => import('../duty-engineer/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-[188px] w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p>Karta yuklanmoqda...</p>
        </div>
    )
})

export default function InspectorsAccessObject() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={"Доступ к объекту"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Последнее обновление 24.09.25</p>
                </div>
            </div>

            {/* 1-karta bilan blok */}
            <div className="p-6 mt-6 rounded-xl" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="h-[188px] w-full mb-6 rounded-lg overflow-hidden">
                    <MapWithNoSSR />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <div className="h-[50px] w-[50px] bg-[#29C77C] rounded-lg flex items-center justify-center">
                            <MdCheck className='text-white size-6' />
                        </div>
                        <div className="flex flex-col">
                            <Title text={"Заявка завершена"} size={"text-lg"} cls="text-[#2C5AA0]" />
                            <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Мега”</p>
                        </div>
                    </div>
                    <Button className="h-[54px] w-[176px]" text={"Убрать из списка"} />
                </div>
            </div>

            {/* 2-blok */}
            <div className="p-6 mt-6 rounded-xl " style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="h-[188px] w-full mb-6 rounded-lg overflow-hidden">
                    <MapWithNoSSR />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <div className="h-[50px] w-[50px] bg-[#E2E2E2] rounded-lg flex items-center justify-center">
                            <RiQuestionMark className='text-[#1E1E1E99] size-6' />
                        </div>
                        <div className="flex flex-col">
                            <Title text={"Заявка на рассмотрении"} size={"text-lg"} cls="text-[#2C5AA0]" />
                            <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Галлерея"</p>
                        </div>
                    </div>
                    <Button className="h-[54px] w-[211px] bg-[#E2E2E2] !text-[#8E8E8E]" text={"Назначить приоритет"} />
                </div>
            </div>
            <div className="p-6 mt-6 rounded-xl " style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="h-[188px] w-full mb-6 rounded-lg overflow-hidden">
                    <MapWithNoSSR />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <div className="h-[50px] w-[50px] bg-[#E2E2E2] rounded-lg flex items-center justify-center">
                            <RiQuestionMark className='text-[#1E1E1E99] size-6' />
                        </div>
                        <div className="flex flex-col">
                            <Title text={"Заявка на рассмотрении"} size={"text-lg"} cls="text-[#2C5AA0]" />
                            <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - Дом</p>
                        </div>
                    </div>
                    <Button className="h-[54px] w-[211px] bg-[#E2E2E2] !text-[#8E8E8E]" text={"Отправить менеджеру"} />
                </div>
            </div>
            <div className="p-6 mt-6 rounded-xl " style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="h-[188px] w-full mb-6 rounded-lg overflow-hidden">
                    <MapWithNoSSR />
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-x-4">
                        <div className="h-[50px] w-[50px] bg-[#D9272799] rounded-lg flex items-center justify-center">
                            <IoMdClose className='text-[#fff] size-6' />
                        </div>
                        <div className="flex flex-col">
                            <Title text={"Заявка не решилась"} size={"text-lg"} cls="text-[#2C5AA0]" />
                            <p className="text-[#1E1E1E]/60 mt-2">Проверка системы пожаротушения - ТЦ "Мега"</p>
                        </div>
                    </div>
                    <Button className="h-[54px] w-[253px] bg-[#D9272799] !text-[#FFFFFF]" text={"Вернуть заказчику на уточнение"} />
                </div>
            </div>
        </div>
    )
}