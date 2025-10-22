import FinallySection from '@/components/home/finally-section'
import PartnersHero from '@/components/home/partners-hero'
import UserRole from '@/components/home/user-role'
import Partners1 from '@/components/partners/partners1'
import Partners2 from '@/components/partners/partners2'
import ServicesHomeBg from '@/components/ui/services-hero'
import React from 'react'

export default function Partners() {
    return (
        <div>
            <ServicesHomeBg title={"Партнерам"} link2={"Партнерам"} adress2={"partners"} />
            <Partners1 />
            <UserRole />
            <Partners2 />
            <PartnersHero />
            <FinallySection />
        </div>
    )
}
