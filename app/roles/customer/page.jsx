'use client';

import NavbarTop from '@/components/navbar-top';
import LayoutRole from '@/components/role/layout-role';
import Badge from '@/components/ui/badge';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Customer() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeItem, setActiveItem] = useState('dashboard');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveItem(tab);
        }
    }, [searchParams]);


    const handleItemClick = (itemId) => {
        console.log('Tanlangan item:', itemId);
        setActiveItem(itemId);
        router.push(`/roles/customer?tab=${itemId}`);
    };

    return (
        <>
            <NavbarTop />
            <div className="max-w-[1200px] mx-auto mt-8">
                <Badge link2={'Дашборд'} adress2='roles/customer' color={'text-[#1E1E1E]/60'} />
                <div className="grid grid-cols-4 mt-8 mb-[100px]">
                    <LayoutRole
                        sections={[
                            {
                                id: 'main',
                                title: 'Основное',
                                items: [
                                    { id: 'dashboard', text: 'Дашборд' },
                                    { id: 'my-objects', text: 'Мои объекты' },
                                    { id: 'requests', text: 'Заявки' },
                                ]
                            },
                            {
                                id: 'documents',
                                title: 'Документы',
                                items: [
                                    { id: 'storage', text: 'Хранилище' },
                                    { id: 'notifications', text: 'Уведомления' }
                                ]
                            },
                            {
                                id: 'shop',
                                title: 'Магазин',
                                items: [
                                    { id: 'my-orders', text: 'Мои заказы' }
                                ]
                            }
                        ]}
                        activeItem={activeItem}
                        onItemClick={handleItemClick}
                    />
                </div>
            </div>
        </>
    );
}