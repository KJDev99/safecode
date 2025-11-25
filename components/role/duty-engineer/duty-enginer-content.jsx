'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogOut from '../log-out';

export default function DutyEnginerContent() {
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
        setActiveItem(itemId);
        router.push(`/roles/duty-engineer?tab=${itemId}`);
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
                            { id: 'new-application', text: 'Новые заявки' },
                            { id: 'all-application', text: 'Все заявки' },
                            { id: 'objects', text: 'Объекты' },
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
                activeItem == 'logout' && <LogOut redirtUrl="/roles/duty-engineer?tab=dashboard" />
            }
        </div>
    );
}


