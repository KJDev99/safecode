import FinallySection from '@/components/home/finally-section'
import ServicesBox from '@/components/services/services-box'
import ServicesHomeBg from '@/components/ui/services-hero'
import React from 'react'

export default function Services() {
    return (
        <div>
            <ServicesHomeBg title={"Услуги"} link2={"Услуги"} adress2={"services"} />
            <ServicesBox />
            <FinallySection />
        </div>
    )
}
