import Contact1 from '@/components/contact/Contact1'
import ServicesHomeBg from '@/components/ui/services-hero'
import React from 'react'

export default function Conctact() {
    return (
        <div>
            <ServicesHomeBg title={"Контакты"} link2={"Контакты"} adress2={"contact"} />
            <Contact1 />
        </div>
    )
}
