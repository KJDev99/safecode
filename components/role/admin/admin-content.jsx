'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Users from './users';
import LogOut from '../log-out';
import AdminDashboard from './admin-dashboard';
import AdminRequests from './admin-requests';
import AdminStorage from './admin-storage';
import AdminNotification from './admin-notification';
import AdminSettings from './admin-settings';

export default function AdminContent() {
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
        router.push(`/roles/admin-panel?tab=${itemId}`);
    };

    return (
        <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0">
            <LayoutRole
                sections={[
                    {
                        id: 'main',
                        title: 'Основное',
                        items: [
                            { id: 'dashboard', text: 'Дашборд' },
                            { id: 'users', text: 'Пользователи и роли' },
                            { id: 'requests', text: 'Заявки и проекты' },
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
            <div className="col-span-3">
                {
                    activeItem == 'dashboard' && <AdminDashboard />
                }
                {
                    activeItem == 'users' && <Users />
                }
                {
                    activeItem == 'requests' && <AdminRequests />
                }
                {
                    activeItem == 'storage' && <AdminStorage />
                }
                {
                    activeItem == 'notifications' && <AdminNotification />
                }
                {
                    activeItem == 'settings' && <AdminSettings />
                }
                {
                    activeItem == 'logout' && <LogOut redirtUrl="/roles/admin-panel?tab=dashboard" />
                }
            </div>
        </div>
    );
}


