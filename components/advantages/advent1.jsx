import React from 'react'
import Title from '../ui/title'

export default function Advent1() {
    return (
        <div
            className="bg-[#2C5AA0] bg-no-repeat bg-right-bottom max-md:bg-none"

        >
            <div className='max-w-[1200px] mx-auto py-[82px] max-md:pt-8 max-md:pb-0 max-md:px-6'>
                <Title text='Для кого подходит SafeCode' color='text-white' cls='mb-8 max-md:mb-6' />
                <div className="grid grid-cols-2 gap-x-16 max-md:grid-cols-1 max-md:gap-x-0">
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[73px] font-[300] text-white max-md:text-[64px]'>1</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Управляющие компании (ЖКХ, бизнес-центры, ТРЦ)</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Ведение журналов и актов для десятков объектов одновременно.</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8 max-md:order-1">
                        <p className='text-[73px] font-[300] text-white max-md:text-[64px]'>4</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Производственные предприятия и склады</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Контроль сроков годности спецсредств (огнетушителей, датчиков).</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[73px] font-[300] text-white max-md:text-[64px]'>2</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Ритейл и торговые сети</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Контроль состояния пожарных систем сразу по всем торговым точкам.</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8 max-md:order-2">
                        <p className='text-[73px] font-[300] text-white max-md:text-[64px]'>5</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Госучреждения и объекты</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Соответствие требованиям МЧС и других надзорных органов.</p>
                        </div>
                    </div>
                    <div className="flex gap-x-6 max-md:gap-x-4 items-center max-md:mb-8">
                        <p className='text-[73px] font-[300] text-white max-md:text-[64px]'>3</p>
                        <div className="flex flex-col">
                            <h3 className='text-white text-lg mb-3 max-md:text-base'>Образовательные учреждения</h3>
                            <p className='leading-[120%] text-white/60 max-md:text-sm'>Удобная система хранения журналов проверок.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
