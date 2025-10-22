import React from 'react'
import Title from '../ui/title'

export default function Advent2() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px]  max-md:my-[50px] max-md:px-6'>
            <Title text={'В цифрах'} cls={'mb-8 max-md:mb-6'} />
            <div className="grid grid-cols-4 gap-6 max-md:grid-cols-1 ">
                <div className="rounded-[12px] p-6" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <Title text={'70%'} cls={'mb-0'} color={'text-[#2C5AA0]'} />
                    <p className='text-[#1E1E1E99] pr-[52px] max-md:pr-0 max-md:text-sm max-md:mt-3'>Быстрее обработка заявок</p>
                </div>
                <div className="rounded-[12px] p-6" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <Title text={'0%'} cls={'mb-0'} color={'text-[#2C5AA0]'} />
                    <p className='text-[#1E1E1E99] pr-[52px] max-md:pr-0 max-md:text-sm max-md:mt-3'>Риска потерять журнал или акт</p>
                </div>
                <div className="rounded-[12px] p-6" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <Title text={'до 40%'} cls={'mb-0'} color={'text-[#2C5AA0]'} />
                    <p className='text-[#1E1E1E99] pr-[52px] max-md:pr-0 max-md:text-sm max-md:mt-3'>Экономии бюджета на документообороте</p>
                </div>
                <div className="rounded-[12px] p-6" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                    <Title text={'24/7'} cls={'mb-0'} color={'text-[#2C5AA0]'} />
                    <p className='text-[#1E1E1E99] pr-[52px] max-md:pr-0 max-md:text-sm max-md:mt-3'>Доступ к системе и техподдержке</p>
                </div>
            </div>
        </div>
    )
}
