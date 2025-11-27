'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogOut from '../log-out';
import DutyEnginerDashboard from './duty-enginer-dashboard';
import DutyEnginerNewReport from './duty-enginer-new-report';
import DutyEnginerAllReport from './duty-enginer-all-report';
import DutyEnginerObjects from './duty-enginer-objects';
import DutyEnginerReports from './duty-enginer-reports';
import AdminNotification from '../admin/admin-notification';
import DutyEnginerSettings from './duty-enginer-settings';

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
        <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0">
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
            <div className="col-span-3">

                {
                    activeItem == 'dashboard' && <DutyEnginerDashboard />
                }
                {
                    activeItem == 'new-application' && <DutyEnginerNewReport />
                }
                {
                    activeItem == 'all-application' && <DutyEnginerAllReport />
                }
                {
                    activeItem == 'objects' && <DutyEnginerObjects />
                }
                {
                    activeItem == 'reports' && <DutyEnginerReports />
                }
                {
                    activeItem == 'notifications' && <AdminNotification />
                }
                {
                    activeItem == 'settings' && <DutyEnginerSettings />
                }
                {
                    activeItem == 'logout' && <LogOut redirtUrl="/roles/duty-engineer?tab=dashboard" />
                }
            </div>
        </div>
    );
}


