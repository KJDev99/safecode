import React from 'react'
import Button from './button'
import Title from './title'

export default function Services_Cart({ title, text, text2, button }) {
    return (
        <div
            className='p-6 rounded-[12px] bg-white flex flex-col'
            style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
        >
            <Title text={title} color="text-[#2C5AA0]" size="text-lg" cls={"mb-3"} />
            <p className={`text-[#1E1E1E99] leading-[120%] grow ${text2 ? 'mb-8' : "mb-0"}`}> {text} </p>
            {
                text2 &&
                <p className='text-right leading-[120%] mb-6 text-[20px] text-[#1E1E1E]'>{text2}</p>
            }
            {
                button &&
                <Button text={button} className='h-[66px] w-full ' />
            }
        </div>
    )
}
