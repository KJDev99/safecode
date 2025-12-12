'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PerformerDashboard from './performer-dashboard';
import AdminNotification from '../admin/admin-notification';
import LogOut from '../log-out';
import PerformerRequest from './performer-requeest';
import PerformerReports from './performer-reports';
import PerformerSettings from './performer-settings';
import Badge from '@/components/ui/badge';
import { useWebSocketNotification } from '@/components/ui/useWebSocketNotification';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

export default function PerformerContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeItem, setActiveItem] = useState('dashboard');

    // WebSocket notification hook'ni ishlatish
    const {
        notifications: wsNotifications,
        unreadCount: wsUnreadCount,
        isConnected,
        clearNotifications: clearWsNotifications,
        reconnect
    } = useWebSocketNotification();

    // Barcha item'larni bitta massivga yig'ib olamiz
    const allItems = [
        { id: 'dashboard', text: 'Дашборд' },
        { id: 'requests', text: 'Все заявки' },
        { id: 'reports', text: 'Отчеты' },
        { id: 'notifications', text: 'Уведомления' },
        { id: 'settings', text: 'Настройки' },
        { id: 'logout', text: 'Выйти', isDanger: true }
    ];

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

    // Aktiv bo'lgan itemning text'ini topish
    const getActiveItemText = () => {
        const activeItemData = allItems.find(item => item.id === activeItem);
        return activeItemData ? activeItemData.text : 'Дашборд';
    };

    // Clear all notifications handler (faqat bu qoldi)
    const handleClearAll = () => {
        clearWsNotifications();
    };

    return (
        <div>
            <div className="flex justify-between items-center">

                <Badge
                    link2={getActiveItemText()}
                    adress2='roles/performer'
                    color={'text-[#1E1E1E]/60'}
                />

                <NotificationDropdown
                    notifications={wsNotifications}
                    unreadCount={wsUnreadCount}
                    isConnected={isConnected}  // isConnected hali kerakmi? Agar yo'q bo'lsa, bu prop'ni o'chirishimiz mumkin
                    onClearAll={handleClearAll}
                />
            </div>
            <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0 max-md:mb-[50px]">
                <LayoutRole
                    sections={[
                        {
                            id: 'main',
                            title: 'Основное',
                            items: allItems.filter(item =>
                                ['dashboard', 'requests'].includes(item.id)
                            )
                        },
                        {
                            id: 'documents',
                            title: 'Документы',
                            items: allItems.filter(item =>
                                ['reports', 'notifications'].includes(item.id)
                            )
                        }
                    ]}
                    bottomItems={allItems.filter(item =>
                        ['settings', 'logout'].includes(item.id)
                    )}
                    activeItem={activeItem}
                    onItemClick={handleItemClick}
                />
                <div className="col-span-3 max-md:col-span-1">
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
        </div>
    );
}