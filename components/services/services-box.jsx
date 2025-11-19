'use client'
import Image from 'next/image'
import React, { useEffect } from 'react'
import Title from '../ui/title'
import Button from '../ui/button'
import { useApiStore } from '@/store/useApiStore';

export default function ServicesBox() {
    const { data, loading, error, getData } = useApiStore();

    useEffect(() => {
        getData("/website/services/");
    }, []);

    if (loading) return <div className="text-center py-8">Yuklanmoqda...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Xatolik yuz berdi: {error}</div>;
    if (!data || !Array.isArray(data)) return <div className="text-center py-8">Ma'lumot topilmadi</div>;

    return (
        <div className='mt-12 mb-[100px] max-w-[1200px] mx-auto max-md:mt-8 max-md:mb-[50px] max-md:px-6'>
            {/* Desktop korinishi - grid bilan */}
            <div className="max-md:hidden grid grid-cols-2 gap-6">
                {data.map((service, index) => (
                    <React.Fragment key={service.id}>
                        {/* Juft indexlarda: text | rasm */}
                        {index % 2 === 0 ? (
                            <>
                                <div className="p-6 rounded-[12px]" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                                    <div className="px-2 pt-2 pb-0">
                                        <Title
                                            text={service.title}
                                            size={"text-[24px]"}
                                            color={"text-[#2C5AA0]"}
                                        />
                                        <p className='text-[#1E1E1E99] my-4 leading-[120%]'>
                                            {service.description}
                                        </p>
                                        <p className='text-[#1E1E1E99] my-4 leading-[120%]'>
                                            <span className='text-[#1E1E1E]'>Зачем:</span> {service.why_this_service}
                                        </p>
                                        <p className='text-[#1E1E1E99] leading-[120%]'>
                                            <span className='text-[#1E1E1E]'>Для кого:</span> {service.for_whom}
                                        </p>
                                        <div className="flex justify-between items-center h-[66px] mt-6">
                                            <p className='text-[#1E1E1E] text-[20px]'>
                                                От {parseFloat(service.price).toLocaleString('ru-RU')} ₽/месяц
                                            </p>
                                            <Button
                                                text={"Заказать услугу"}
                                                className='w-[324px] h-full'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Image
                                        src={service?.image || '/services/one.png'}
                                        alt={service.title}
                                        width={588}
                                        height={490}
                                        className='w-full h-auto object-cover rounded-[12px]'
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Toq indexlarda: rasm | text */}
                                <div>
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        width={588}
                                        height={490}
                                        className='w-full h-auto object-cover rounded-[12px]'
                                    />
                                </div>
                                <div className="p-6 rounded-[12px]" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                                    <div className="px-2 pt-2 pb-0">
                                        <Title
                                            text={service.title}
                                            size={"text-[24px]"}
                                            color={"text-[#2C5AA0]"}
                                        />
                                        <p className='text-[#1E1E1E99] my-4 leading-[120%]'>
                                            {service.description}
                                        </p>
                                        <p className='text-[#1E1E1E99] my-4 leading-[120%]'>
                                            <span className='text-[#1E1E1E]'>Зачем:</span> {service.why_this_service}
                                        </p>
                                        <p className='text-[#1E1E1E99] leading-[120%]'>
                                            <span className='text-[#1E1E1E]'>Для кого:</span> {service.for_whom}
                                        </p>
                                        <div className="flex justify-between items-center h-[66px] mt-6">
                                            <p className='text-[#1E1E1E] text-[20px]'>
                                                От {parseFloat(service.price).toLocaleString('ru-RU')} ₽/месяц
                                            </p>
                                            <Button
                                                text={"Заказать услугу"}
                                                className='w-[324px] h-full'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile korinishi - flex column bilan */}
            <div className="md:hidden flex flex-col gap-6">
                {data.map((service, index) => (
                    <React.Fragment key={service.id}>
                        {/* Mobile: rasm ikkinchi */}
                        <div>
                            <Image
                                src={service?.image || '/services/one.png'}
                                alt={service.title}
                                width={588}
                                height={490}
                                className='w-full h-auto object-cover rounded-[12px]'
                            />
                        </div>

                        {/* Mobile: text birinchi */}
                        <div className="p-6 rounded-[12px]" style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                            <div className="px-0 pt-0 pb-0">
                                <Title
                                    text={service.title}
                                    size={"text-[18px]"}
                                    color={"text-[#2C5AA0]"}
                                />
                                <p className='text-[#1E1E1E99] my-3 leading-[120%] text-sm'>
                                    {service.description}
                                </p>
                                <p className='text-[#1E1E1E99] my-3 leading-[120%] text-sm'>
                                    <span className='text-[#1E1E1E]'>Зачем:</span> {service.why_this_service}
                                </p>
                                <p className='text-[#1E1E1E99] leading-[120%] text-sm'>
                                    <span className='text-[#1E1E1E]'>Для кого:</span> {service.for_whom}
                                </p>
                                <div className="flex flex-col h-max mt-6">
                                    <p className='text-[#1E1E1E] text-lg mb-[18px]'>
                                        От {parseFloat(service.price).toLocaleString('ru-RU')} ₽/месяц
                                    </p>
                                    <Button
                                        text={"Заказать услугу"}
                                        className='h-[66px] w-full'
                                    />
                                </div>
                            </div>
                        </div>


                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}