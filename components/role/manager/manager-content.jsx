'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ManagerDashboard from './menejer-dashboard';
import LogOut from '../log-out';
import ManagerRequest from './manager-request';
import ManagerBills from './manager-bills';
import ManagerJurnals from './manager-jurnals';
import ManagerStore from './manager-store';
import AdminNotification from '../admin/admin-notification';
import ManagerSettings from './manager-settings';
import Badge from '@/components/ui/badge';
import { useWebSocketNotification } from '@/components/ui/useWebSocketNotification';
import NotificationDropdown from '@/components/ui/NotificationDropdown';

export default function ManagerContent() {
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

    const allItems = [
        { id: 'dashboard', text: 'Дашборд' },
        { id: 'requests', text: 'Заявки' },
        { id: 'bills', text: 'Счета' },
        { id: 'jurnals', text: 'Журналы и акты' },
        { id: 'storage', text: 'Хранилище' },
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
        router.push(`/roles/manager?tab=${itemId}`);
    };

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
                    adress2='roles/manager'
                    color={'text-[#1E1E1E]/60'}
                />

                {/* ✅ TO'G'RI: NotificationDropdown faqat kerakli prop'lar bilan */}
                <NotificationDropdown
                    notifications={wsNotifications}
                    unreadCount={wsUnreadCount}
                    isConnected={isConnected}  // isConnected hali kerakmi? Agar yo'q bo'lsa, bu prop'ni o'chirishimiz mumkin
                    onClearAll={handleClearAll}
                />
            </div>

            <div className="grid grid-cols-4 mt-8 mb-[100px] gap-x-6 max-md:grid-cols-1 max-md:gap-0 max-md:mb-[50px]">
                <LayoutRole
                    sections={[
                        {
                            id: 'main',
                            title: 'Основное',
                            items: allItems.filter(item =>
                                ['dashboard', 'requests', 'bills', 'jurnals'].includes(item.id)
                            )
                        },
                        {
                            id: 'documents',
                            title: 'Документы',
                            items: allItems.filter(item =>
                                ['storage', 'notifications'].includes(item.id)
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
                    {activeItem == 'dashboard' && <ManagerDashboard />}
                    {activeItem == 'requests' && <ManagerRequest />}
                    {activeItem == 'bills' && <ManagerBills />}
                    {activeItem == 'jurnals' && <ManagerJurnals />}
                    {activeItem == 'storage' && <ManagerStore />}
                    {activeItem == 'notifications' && <AdminNotification />}
                    {activeItem == 'settings' && <ManagerSettings />}
                    {activeItem == 'logout' && <LogOut redirtUrl="/roles/manager?tab=dashboard" />}
                </div>
            </div>
        </div>
    );
}