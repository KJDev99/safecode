import React from 'react'
import Button from './button'
import Title from './title'
import Link from 'next/link'

export default function Services_Cart({ title, text, text2, button }) {
    return (
        <div
            className='p-6 rounded-[12px] bg-white flex flex-col'
            style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
        >
            <Title text={title} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mb-3"} />
            <p className={`text-[#1E1E1E99] leading-[120%] grow max-md:text-sm ${text2 ? 'mb-8 max-md:mb-[18px]' : "mb-0"}`}> {text} </p>
            {
                text2 &&
                <p className='text-right leading-[120%] mb-6 text-[20px] max-md:text-[18px] text-[#1E1E1E] max-md:mb-[18px]'>{text2}</p>
            }
            {
                button &&
                <Link href={'/auth/login'}>
                    <Button text={button} className='h-[66px] w-full max-md:h-[56px] max-md:text-sm' />
                </Link>
            }
        </div>
    )
}
