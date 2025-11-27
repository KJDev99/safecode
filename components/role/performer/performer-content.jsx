'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PerformerDashboard from './performer-dashboard';
import AdminNotification from '../admin/admin-notification';
import DutyEnginerNewReport from '../duty-engineer/duty-enginer-new-report';
import DutyEnginerReports from '../duty-engineer/duty-enginer-reports';
import AdminSettings from '../admin/admin-settings';
import LogOut from '../log-out';
import PerformerRequest from './performer-requeest';
import PerformerReports from './performer-reports';
import PerformerSettings from './performer-settings';

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
        <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0">
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
            <div className="col-span-3">
                {
                    activeItem == 'dashboard' && <PerformerDashboard />
                }
                {
                    activeItem == 'requests' && <PerformerRequest />
                }
                {
                    activeItem == 'reports' && <PerformerReports />
                }
                {
                    activeItem == 'notifications' && <AdminNotification />
                }
                {
                    activeItem == 'settings' && <PerformerSettings />
                }
                {
                    activeItem == 'logout' && <LogOut redirtUrl="/roles/performer?tab=dashboard" />
                }

            </div>
        </div>
    );
}


