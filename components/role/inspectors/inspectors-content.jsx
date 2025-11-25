'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogOut from '../log-out';

export default function InspectorsContent() {
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
        router.push(`/roles/inspectors?tab=${itemId}`);
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
                            { id: 'access-object', text: 'Доступ к объекту' },
                            { id: 'objects', text: 'Мои объекты' },
                        ]
                    },
                    {
                        id: 'documents',
                        title: 'Документы',
                        items: [
                            { id: 'document', text: 'Документы' },
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
                activeItem == 'logout' && <LogOut redirtUrl="/roles/inspectors?tab=dashboard" />
            }
        </div>
    );
}


