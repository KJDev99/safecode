"use client";
import React from "react";

export default function Contact1() {
    return (
        <div
            className="max-w-[1200px] mt-12 mb-[100px] mx-auto max-md:px-6 max-md:mt-8 max-md:mb-[50px]"

        >
            <div className="grid grid-cols-3 gap-x-12 items-center p-6 rounded-[12px] max-md:grid-cols-1 max-md:gap-y-8" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="col-span-2 max-md:h-[202px] h-[291px]">
                    <iframe
                        src="https://yandex.uz/map-widget/v1/?ll=64.421725%2C39.767968&mode=poi&poi%5Bpoint%5D=64.475083%2C39.767206&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D145088961305&z=12"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allowFullScreen
                        style={{ position: "relative", borderRadius: "12px" }}
                    />
                </div>

                <div className="col-span-1">
                    <h3 className="text-lg text-[#1E1E1E] mb-[18px]">Наш офис</h3>
                    <p className="mb-2 text-[#1E1E1E]/60 text-sm max-md:text-xs">Находится по адресу:</p>
                    <p className="text-[#1E1E1E] mb-[18px] max-md:text-sm">г. Санкт-Петербург, ул. Новорощинская
                        д. 4, оф. 403-1</p>
                    <div className="grid grid-cols-2 gap-x-12 max-md:gap-x-6">
                        <div className="flex flex-col">
                            <a href="tel:+8 (495) 708-42-13" className="mb-3">
                                <h4 className="text-[#1E1E1E]/60 text-sm max-md:text-xs">Телефон:</h4>
                                <p className="text-[#1E1E1E] max-md:text-sm">8 (495) 708-42-13</p>
                            </a>
                            <a href="mailto:safecode@sfcrm.ru">
                                <h4 className="text-[#1E1E1E]/60 text-sm max-md:text-xs">E-mail:</h4>
                                <p className="text-[#1E1E1E] max-md:text-sm">safecode@sfcrm.ru</p>
                            </a>
                        </div>
                        <div>
                            <h4 className="text-[#1E1E1E]/60 text-sm max-md:text-xs">Режим работы</h4>
                            <p className="text-[#1E1E1E] max-md:text-sm text-nowrap">Пн - Чт: 9.00 - 18.00</p>
                            <p className="text-[#1E1E1E] max-md:text-sm text-nowrap">Пт: 9.00 – 17.00</p>
                            <p className="text-[#1E1E1E] max-md:text-sm text-nowrap">Сб - Вс: выходные</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
