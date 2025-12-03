'use client';

import LayoutRole from '@/components/role/layout-role';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LogOut from '../log-out';
import InspectorsDashboard from './inspectors-dashboard';
import InspectorsAccessObject from './inspectors-access-object';
import InspectorsObject from './inspectors-objects';
import InspectorsDocument from './inspectors-document';
import AdminNotification from '../admin/admin-notification';
import InspectorsSettings from './inspectors-settings';
import Badge from '@/components/ui/badge';

export default function InspectorsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeItem, setActiveItem] = useState('dashboard');

    // Barcha item'larni bitta massivga yig'ib olamiz
    const allItems = [
        { id: 'dashboard', text: 'Дашборд' },
        { id: 'access-object', text: 'Доступ к объекту' },
        { id: 'objects', text: 'Мои объекты' },
        { id: 'document', text: 'Документы' },
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
        router.push(`/roles/inspectors?tab=${itemId}`);
    };

    // Aktiv bo'lgan itemning text'ini topish
    const getActiveItemText = () => {
        const activeItemData = allItems.find(item => item.id === activeItem);
        return activeItemData ? activeItemData.text : 'Дашборд';
    };

    return (
        <div>
            <Badge
                link2={getActiveItemText()}
                adress2='roles/inspectors'
                color={'text-[#1E1E1E]/60'}
            />
            <div className="grid grid-cols-4 mt-8 gap-6 mb-[100px] max-md:grid-cols-1 max-md:gap-0 max-md:mb-[50px]">
                <LayoutRole
                    sections={[
                        {
                            id: 'main',
                            title: 'Основное',
                            items: allItems.filter(item =>
                                ['dashboard', 'access-object', 'objects'].includes(item.id)
                            )
                        },
                        {
                            id: 'documents',
                            title: 'Документы',
                            items: allItems.filter(item =>
                                ['document', 'notifications'].includes(item.id)
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
                        activeItem == 'dashboard' && <InspectorsDashboard />
                    }
                    {
                        activeItem == 'access-object' && <InspectorsAccessObject />
                    }
                    {
                        activeItem == 'objects' && <InspectorsObject />
                    }
                    {
                        activeItem == 'document' && <InspectorsDocument />
                    }
                    {
                        activeItem == 'notifications' && <AdminNotification />
                    }
                    {
                        activeItem == 'settings' && <InspectorsSettings />
                    }
                    {
                        activeItem == 'logout' && <LogOut redirtUrl="/roles/inspectors?tab=dashboard" />
                    }
                </div>
            </div>
        </div>
    );
}