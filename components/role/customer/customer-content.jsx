'use client';

import LayoutRole from '@/components/role/layout-role';
import Badge from '@/components/ui/badge';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CustomerDashboard from './customer-dashboard';
import CustomerSettings from './customer-settings';
import LogOut from '../log-out';
import AdminNotification from '../admin/admin-notification';
import CustomerService from './customer-service';
import CustomerApplication from './customer-application';
import CustomerMyorders from './customer-myorders';
import NotificationDropdown from '@/components/ui/NotificationDropdown';
import { useWebSocketNotification } from '@/components/ui/useWebSocketNotification';

export default function CustomerContent() {
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
        { id: 'objects', text: 'Мои объекты' },
        // { id: 'application', text: 'Заявки' },
        { id: 'service-log', text: 'Журнал обслуживания' },
        { id: 'notifications', text: 'Уведомления' },
        { id: 'myorders', text: 'Мои заказы' },
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
        router.push(`/roles/customer?tab=${itemId}`);
    };

    // Aktiv bo'lgan itemning text'ini topish
    const getActiveItemText = () => {
        const activeItemData = allItems.find(item => item.id === activeItem);
        return activeItemData ? activeItemData.text : 'Дашборд';
    };

    // Clear all notifications handler
    const handleClearAll = () => {
        clearWsNotifications();
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <Badge
                    link2={getActiveItemText()}
                    adress2='roles/customer'
                    color={'text-[#1E1E1E]/60'}
                />

                {/* Notification Dropdown - faqat clearAll tugmasi qoldi */}
                <NotificationDropdown
                    notifications={wsNotifications}
                    unreadCount={wsUnreadCount}
                    isConnected={isConnected}
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
                                ['dashboard', 'objects', 'application'].includes(item.id)
                            )
                        },
                        {
                            id: 'documents',
                            title: 'Документы',
                            items: allItems.filter(item =>
                                ['service-log', 'notifications'].includes(item.id)
                            )
                        },
                        {
                            id: 'shop',
                            title: 'Магазин',
                            items: allItems.filter(item =>
                                ['myorders'].includes(item.id)
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
        </div>
    );
}