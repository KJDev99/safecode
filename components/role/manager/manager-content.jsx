'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ManagerDashboard from './menejer-dashboard';
import LogOut from '../log-out';
import ManagerRequest from './manager-request';
import ManagerBills from './manager-bills';
import ManagerJurnals from './manager-jurnals';
import ManagerStore from './manager-store';
import AdminNotification from '../admin/admin-notification';
import ManagerSettings from './manager-settings';

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
        <div className="grid grid-cols-4 mt-8 mb-[100px] gap-x-6 max-md:grid-cols-1 max-md:gap-0">
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
            <div className="col-span-3">

                {
                    activeItem == 'dashboard' && <ManagerDashboard />
                }
                {
                    activeItem == 'requests' && <ManagerRequest />
                }
                {
                    activeItem == 'bills' && <ManagerBills />
                }
                {
                    activeItem == 'jurnals' && <ManagerJurnals />
                }
                {
                    activeItem == 'storage' && <ManagerStore />
                }
                {
                    activeItem == 'notifications' && <AdminNotification />
                }
                {
                    activeItem == 'settings' && <ManagerSettings />
                }
                {
                    activeItem == 'logout' && <LogOut redirtUrl="/roles/manager?tab=dashboard" />
                }
            </div>
        </div>
    );
}


