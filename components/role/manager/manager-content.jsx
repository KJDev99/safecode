'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ManagerDashboard from './menejer-dashboard';

export default function ManagerContent() {
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
        router.push(`/roles/manager?tab=${itemId}`);
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
                            { id: 'requests', text: 'Заявки' },
                            { id: 'bills', text: 'Счета' },
                            { id: 'jurnals', text: 'Журналы и акты' },
                        ]
                    },
                    {
                        id: 'documents',
                        title: 'Документы',
                        items: [
                            { id: 'storage', text: 'Хранилище' },
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
                activeItem == 'dashboard' && <ManagerDashboard />
            }
        </div>
    );
}


