import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import { useApiStore } from "@/store/useApiStore";

export default function AdminRequests() {
    return (
        <div>
            <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                <div className="flex flex-col">
                    <Title text={"Заявки и проекты"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6 ">Место, где хранятся все отчеты, акты, смета, форма</p>
                </div>
            </div>

            {/* TABLE */}
            <div className="md:mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto max-md:py-0" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#1E1E1E80] text-[#1E1E1E99] text-lg ">
                            <th className="p-3 text-left font-normal">
                                <input
                                    id="head-check-all"
                                    type="checkbox"

                                />
                            </th>
                            <th className="p-3 text-left font-normal">Тип</th>
                            <th className="p-3 text-left font-normal">Объект</th>
                            <th className="p-3 text-left font-normal">Дата</th>
                            <th className="p-3 text-left font-normal">Этап</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">Проект</td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap">бул. Архитекторов, 35,</p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap"> Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E] text-base">22.03.22</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Исполнитель</td>
                        </tr>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">Проект</td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap">бул. Архитекторов, 35,</p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap"> Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E] text-base">22.03.22</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Исполнитель</td>
                        </tr>
                        <tr className="">
                            <td className="p-3">
                                < input
                                    type="checkbox"
                                />
                            </td>
                            <td className="p-3">Проект</td>
                            <td className="p-3">
                                <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                    ТЦ "Мега”
                                </p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap">бул. Архитекторов, 35,</p>
                                <p className="text-sm text-[#1E1E1E99] max-md:text-nowrap"> Омск</p>
                            </td>
                            <td className="p-3 text-[#1E1E1E] text-base">22.03.22</td>
                            <td className="p-3 text-[#1E1E1E] text-base">Исполнитель</td>
                        </tr>
                    </tbody>
                </table>
            </div >


        </div >
    );
}