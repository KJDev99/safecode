import React from 'react'
import Title from '../ui/title'
import Image from 'next/image'

export default function Partners2() {
    return (
        <div className='max-w-[1200px] mx-auto mt-12 mb-[100px] max-md:my-[50px] max-md:px-6'>
            <Title text='Отрасли наших клиентов' cls="mb-8 max-md:mb-6" />
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
                <div className="flex flex-col p-4 rounded-[12px]" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                    <Image src={'/partners/partnorpage1.png'} alt='partnor' width={336} height={154} className='w-full' />
                    <h3 className='mt-6 mb-3 text-lg text-[#1E1E1E]'>Управляющие компании</h3>
                    <p className='text-[#1E1E1E99]'>более 100 компаний</p>
                </div>
                <div className="flex flex-col p-4 rounded-[12px]" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                    <Image src={'/partners/partnorpage2.png'} alt='partnor' width={336} height={154} className='w-full' />
                    <h3 className='mt-6 mb-3 text-lg text-[#1E1E1E]'>Ритейл и торговые сети</h3>
                    <p className='text-[#1E1E1E99]'>более 60 компаний</p>
                </div>
                <div className="flex flex-col p-4 rounded-[12px]" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                    <Image src={'/partners/partnorpage3.png'} alt='partnor' width={336} height={154} className='w-full' />
                    <h3 className='mt-6 mb-3 text-lg text-[#1E1E1E]'>Образовательные учреждения</h3>
                    <p className='text-[#1E1E1E99]'>более 20 компаний</p>
                </div>
                <div className="flex flex-col p-4 rounded-[12px]" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                    <Image src={'/partners/partnorpage4.png'} alt='partnor' width={336} height={154} className='w-full' />
                    <h3 className='mt-6 mb-3 text-lg text-[#1E1E1E]'>Производственные предприятия</h3>
                    <p className='text-[#1E1E1E99]'>более 10 компаний</p>
                </div>
                <div className="flex flex-col p-4 rounded-[12px]" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                    <Image src={'/partners/partnorpage5.png'} alt='partnor' width={336} height={154} className='w-full' />
                    <h3 className='mt-6 mb-3 text-lg text-[#1E1E1E]'>Госучреждения и объекты</h3>
                    <p className='text-[#1E1E1E99]'>более 5 компаний</p>
                </div>
            </div>
        </div>
    )
}
