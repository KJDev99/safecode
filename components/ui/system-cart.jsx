import Image from 'next/image'
import React from 'react'
import Title from './title'

export default function SystemCart({ img, title, text }) {
    return (
        <div
            className='p-6 rounded-2xl bg-white'
            style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
        >
            <Image src={img} alt='icon' width={24} height={24} />
            <Title text={title} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mt-6 mb-3 max-md:mt-4"} />
            <p className='text-[#1E1E1E99] leading-[120%] max-md:text-sm'> {text} </p>
        </div>
    )
}
