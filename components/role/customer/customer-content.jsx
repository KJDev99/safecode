'use client';

import NavbarTop from '@/components/navbar-top';
import LayoutRole from '@/components/role/layout-role';
import Badge from '@/components/ui/badge';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomerDashboard from './customer-dashboard';
import CustomerSettings from './customer-settings';
import LogOut from '../log-out';
import AdminNotification from '../admin/admin-notification';
import CustomerService from './customer-service';
import CustomerApplication from './customer-application';
import CustomerMyorders from './customer-myorders';

export default function CustomerContent() {
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
        <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0">
            <LayoutRole
                sections={[
                    {
                        id: 'main',
                        title: 'Основное',
                        items: [
                            { id: 'dashboard', text: 'Дашборд' },
                            { id: 'objects', text: 'Мои объекты' },
                            { id: 'application', text: 'Заявки' },
                        ]
                    },
                    {
                        id: 'documents',
                        title: 'Документы',
                        items: [
                            { id: 'service-log', text: 'Журнал обслуживания' },
                            { id: 'notifications', text: 'Уведомления' }
                        ]
                    },
                    {
                        id: 'shop',
                        title: 'Магазин',
                        items: [
                            { id: 'myorders', text: 'Мои заказы' }
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
                    activeItem == 'dashboard' && <CustomerDashboard />
                }
                {
                    activeItem == 'objects' && <CustomerApplication />
                }
                {
                    activeItem == 'application' && <CustomerApplication />
                }
                {
                    activeItem == 'service-log' && <CustomerService />
                }
                {
                    activeItem == 'notifications' && <AdminNotification />
                }
                {
                    activeItem == 'myorders' && <CustomerMyorders />
                }
                {
                    activeItem == 'settings' && <CustomerSettings />
                }
                {
                    activeItem == 'logout' && <LogOut redirtUrl="/roles/customer?tab=dashboard" />
                }
            </div>
        </div>
    );
}


