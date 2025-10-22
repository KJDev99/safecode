import React from "react";
import Badge from "./badge";
import Title from "./title";

export default function ServicesHomeBg({ title, link2, adress2, text }) {
    return (
        <div className="relative  bg-cover bg-[url('/hero.png')] pt-8 pb-16 max-md:pb-[42px] max-md:px-6">
            <div className="absolute inset-0 bg-gradient-to-t from-[#272727] to-[#27272733]"></div>
            <div className="relative z-10 text-white max-w-[1200px] mx-auto">
                <Badge link2={link2} adress2={adress2} className="pb-16 max-md:pb-8" />
                <Title size={"text-[48px] max-md:text-[22px]"} color={"text-white"} text={title} cls={"max-w-[670px] uppercase leading-[110%]"} />
                <p className="mt-6 text-white/60 text-lg leading-[115%] max-w-[670px] max-md:text-sm max-md:mt-4">{text}</p>
            </div>
        </div>
    );
}
