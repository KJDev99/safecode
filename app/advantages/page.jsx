import Advent1 from '@/components/advantages/advent1'
import Advent2 from '@/components/advantages/advent2'
import AdvantagesHero from '@/components/home/advantages-hero'
import FinallySection from '@/components/home/finally-section'
import ServicesHomeBg from '@/components/ui/services-hero'
import React from 'react'

export default function Advantages() {
    return (
        <div>
            <ServicesHomeBg title={"Почему клиенты выбирают SafeCode?"} link2={"Преимущества"} adress2={"advantages"} text={"Мы сделали систему, которая избавляет от бумажной рутины, ускоряет работу инженеров и делает контроль пожарной безопасности прозрачным и удобным."} />
            <AdvantagesHero />
            <Advent1 />
            <Advent2 />
            <FinallySection />
        </div>
    )
}
