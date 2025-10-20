import React from 'react'
import Title from '../ui/title'
import Image from 'next/image'

export default function PartnersHero() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] '>
            <Title text='Партнеры' cls="mb-8" />
            <div className="grid grid-cols-5 gap-6">
                <div className="">
                    <Image src={'/partners/partners1.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners2.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners3.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners4.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners5.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners1.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners2.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners3.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners4.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
                <div className="">
                    <Image src={'/partners/partners5.png'} alt='partners1' height={89} width={221} className='h-22 w-full' />
                </div>
            </div>
        </div>
    )
}
