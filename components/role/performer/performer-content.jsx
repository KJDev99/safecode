'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PerformerDashboard from './performer-dashboard';

export default function PerformerContent() {
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
        router.push(`/roles/performer?tab=${itemId}`);
    };

    return (
        <div className="grid grid-cols-4 mt-8 mb-[100px]">
            <LayoutRole
                sections={[
                    {
                        id: 'main',
                        title: 'Основное',
                        items: [
                            { id: 'dashboard', text: 'Дашборд' },
                            { id: 'requests', text: 'Мои заявки' },
                        ]
                    },
                    {
                        id: 'documents',
                        title: 'Документы',
                        items: [
                            { id: 'reports', text: 'Отчеты' },
                            { id: 'notifications', text: 'Уведомления' }
                        ]
                    }
                ]}
                bottomItems={[
                    { id: 'settings', text: 'Настройки' },
                    { id: 'logout', text: 'Выйти', isDanger: true }
                ]}
                activeItem={activeItem}
                onItemClick={handleItemClick}
            />
            {
                activeItem == 'dashboard' && <PerformerDashboard />
            }
        </div>
    );
}


