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
import Badge from '@/components/ui/badge';
import AdminMenegnet from './admin-menegnet';
import AdminTovar from './admin-tovar';
import { useWebSocketNotification } from '@/components/ui/useWebSocketNotification';
import NotificationDropdown from '@/components/ui/NotificationDropdown';


export default function AdminContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeItem, setActiveItem] = useState('dashboard');

    // WebSocket notification hook'ni ishlatish
    const {
        notifications: wsNotifications,
        unreadCount: wsUnreadCount,
        isConnected,
        markAllAsRead: markAllWsAsRead,
        clearNotifications: clearWsNotifications,
        reconnect
    } = useWebSocketNotification();

    // Barcha item'larni bitta massivga yig'ib olamiz
    const allItems = [
        { id: 'dashboard', text: 'Дашборд' },
        { id: 'users', text: 'Пользователи и роли' },
        // { id: 'requests', text: 'Заявки и проекты' },
        { id: 'menegnet', text: 'Управление' },
        { id: 'tovar', text: 'Товаров' },
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
        router.push(`/roles/admin-panel?tab=${itemId}`);
    };

    // Aktiv bo'lgan itemning text'ini topish
    const getActiveItemText = () => {
        const activeItemData = allItems.find(item => item.id === activeItem);
        return activeItemData ? activeItemData.text : 'Дашборд';
    };

    // Mark all as read handler
    const handleMarkAllAsRead = () => {
        markAllWsAsRead();
        // Bu yerda server API'ga ham so'rov yuborishingiz mumkin
    };

    // Clear all notifications handler
    const handleClearAll = () => {
        clearWsNotifications();
        // Bu yerda server API'ga ham so'rov yuborishingiz mumkin
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <Badge
                    link2={getActiveItemText()}
                    adress2='roles/admin-panel'
                    color={'text-[#1E1E1E]/60'}
                />

                {/* Notification Dropdown - isConnected prop'ni qo'shamiz */}
                <NotificationDropdown
                    notifications={wsNotifications}
                    unreadCount={wsUnreadCount}
                    isConnected={isConnected}  // ✅ isConnected prop'ni o'tkazamiz
                    onMarkAllAsRead={handleMarkAllAsRead}
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
                                ['dashboard', 'users', 'requests', 'menegnet', 'tovar'].includes(item.id)
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
                        activeItem == 'menegnet' && <AdminMenegnet />
                    }
                    {
                        activeItem == 'tovar' && <AdminTovar />
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
        </div>
    );
}