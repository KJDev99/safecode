'use client'
import React, { useEffect } from 'react'
import Title from '../ui/title'
import Services_Cart from '../ui/services-cart'
import { useApiStore } from '@/store/useApiStore';

export default function ServicesHero() {
    const { data, loading, error, getData } = useApiStore();

    useEffect(() => {
        getData("/website/services/");
    }, []);
    if (loading) return <div className="text-center py-8">Yuklanmoqda...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Xatolik yuz berdi: {error}</div>;
    if (!data || !Array.isArray(data)) return <div className="text-center py-8">Ma'lumot topilmadi</div>;
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            <Title text='Услуги' cls="mb-8 max-md:mb-6" />
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-md:gap-4">
                {
                    data.map((service) => {
                        return <Services_Cart key={service.id} title={service.title || ""} text={service.description || ''} text2={`От ${parseFloat(service.price).toLocaleString('ru-RU')} ₽/месяц`} button={'Заказать услугу'} />
                    })
                }
            </div>
        </div>
    )
}
