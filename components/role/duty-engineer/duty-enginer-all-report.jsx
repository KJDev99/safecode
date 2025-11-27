import Button from '@/components/ui/button'
import Title from '@/components/ui/title'
import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { IoMdClose } from 'react-icons/io'
import { LiaDownloadSolid } from 'react-icons/lia'

export default function DutyEnginerAllReports() {
    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={"ВСЕ Заявки"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Последнее обновление 24.09.25</p>
                </div>
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#1E1E1E80] text-[#1E1E1E99] text-lg ">
                            <th className="p-3 text-left font-normal">
                                <input
                                    id="head-check-all"
                                    type="checkbox"

                                />
                            </th>
                            <th className="p-3 text-left font-normal">Объект</th>
                            <th className="p-3 text-left font-normal">Описание проблемы</th>
                            <th className="p-3 text-left font-normal">Дата</th>
                            <th className="p-3 text-left font-normal">Статус</th>
                            <th className="p-3 text-left font-normal">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99]">бул. Архитекторов, 35, </p>
                                <p className="text-sm text-[#1E1E1E99]">Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E99] max-w-[190px]">Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба </td>
                            <td className="p-3 text-[#1E1E1E] text-base">20.05.23</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Проверить
                                данные</td>

                            <td className="p-3">
                                <div className="flex gap-x-1 items-center justify-center">

                                    <button
                                        className="w-6 h-6 bg-[#2C5AA0] rounded-sm  flex items-center justify-center"
                                    >
                                        <LiaDownloadSolid className="text-sm text-[#fff]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#C5C5C5]/50 rounded-sm  flex items-center justify-center"
                                    >
                                        <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#E87D7D] rounded-sm  flex items-center justify-center"
                                    >
                                        <IoMdClose className="text-sm text-[#fff]" />
                                    </button>
                                </div>

                            </td>
                        </tr>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99]">бул. Архитекторов, 35, </p>
                                <p className="text-sm text-[#1E1E1E99]">Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E99] max-w-[190px]">Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба </td>
                            <td className="p-3 text-[#1E1E1E] text-base">20.05.23</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Проверить
                                данные</td>

                            <td className="p-3">
                                <div className="flex gap-x-1 items-center justify-center">

                                    <button
                                        className="w-6 h-6 bg-[#2C5AA0] rounded-sm  flex items-center justify-center"
                                    >
                                        <LiaDownloadSolid className="text-sm text-[#fff]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#C5C5C5]/50 rounded-sm  flex items-center justify-center"
                                    >
                                        <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#E87D7D] rounded-sm  flex items-center justify-center"
                                    >
                                        <IoMdClose className="text-sm text-[#fff]" />
                                    </button>
                                </div>

                            </td>
                        </tr>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99]">бул. Архитекторов, 35, </p>
                                <p className="text-sm text-[#1E1E1E99]">Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E99] max-w-[190px]">Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба Текст-Рыба </td>
                            <td className="p-3 text-[#1E1E1E] text-base">20.05.23</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Проверить
                                данные</td>

                            <td className="p-3">
                                <div className="flex gap-x-1 items-center justify-center">

                                    <button
                                        className="w-6 h-6 bg-[#2C5AA0] rounded-sm  flex items-center justify-center"
                                    >
                                        <LiaDownloadSolid className="text-sm text-[#fff]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#C5C5C5]/50 rounded-sm  flex items-center justify-center"
                                    >
                                        <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                    </button>
                                    <button
                                        className="w-6 h-6 bg-[#E87D7D] rounded-sm  flex items-center justify-center"
                                    >
                                        <IoMdClose className="text-sm text-[#fff]" />
                                    </button>
                                </div>

                            </td>
                        </tr>


                    </tbody>
                </table>
            </div >
        </div >
    )
}



