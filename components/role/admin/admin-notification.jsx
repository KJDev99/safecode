import Button from '@/components/ui/button'
import Title from '@/components/ui/title'
import React, { useState, useEffect, useCallback } from 'react'
import { MdCheck } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useApiStore } from '@/store/useApiStore'
import { useRouter } from 'next/navigation'
// Notification turi bo'yicha icon va rang aniqlash

// Har bir role uchun tab mapping
const ROLE_TAB_MAPPINGS = {
    // Admin Panel
    'admin-panel': {
        'bills': 'bills-admin',
        'journals_and_acts': 'service-log',
        'user_object': 'menegnet',
        'orders': 'orders-admin',
        'tasks': 'tasks-admin',
        'incidents': 'incidents-admin',
        'equipment': 'equipment-admin',
        'documents': 'documents-admin',
        'reports': 'reports-admin',
        'users': 'users-admin',
        'settings': 'settings-admin',
        'default': 'notifications'
    },
    // Customer
    'customer': {
        'bills': '',
        'journals_and_acts': 'service-log',
        'user_object': 'objects',
        'orders': 'orders-cust',
        'tasks': 'tasks-cust',
        'incidents': 'incidents-cust',
        'equipment': 'equipment-cust',
        'documents': 'documents-cust',
        'reports': 'reports-cust',
        'settings': 'settings-cust',
        'default': 'notifications'
    },
    // Duty Engineer
    'duty-engineer': {
        'user_object': 'objects-duty',
        'tasks': 'tasks-duty',
        'incidents': 'incidents-duty',
        'reports': 'reports-duty',
        'settings': 'settings-duty',
        'default': 'notifications'
    },
    // Inspector MCHS
    'inspectors': {
        'user_object': 'objects-insp',
        'incidents': 'incidents-insp',
        'reports': 'reports-insp',
        'settings': 'settings-insp',
        'default': 'notifications'
    },
    // Performer
    'performer': {
        'user_object': 'objects-perf',
        'tasks': 'tasks-perf',
        'orders': 'orders-perf',
        'settings': 'settings-perf',
        'default': 'notifications'
    },
    // Manager
    'manager': {
        'bills': 'bills-manager',
        'journals_and_acts': 'service-log',
        'user_object': 'requests',
        'orders': 'orders-manager',
        'tasks': 'tasks-manager',
        'incidents': 'incidents-manager',
        'equipment': 'equipment-manager',
        'documents': 'documents-manager',
        'users': 'users-manager',
        'settings': 'settings-manager',
        'default': 'notifications'
    },
    // Service Engineer
    'service-engineer': {
        'user_object': 'objects-service',
        'tasks': 'tasks-service',
        'journals_and_acts': 'service-log-engineer',
        'equipment': 'equipment-service',
        'settings': 'settings-service',
        'default': 'notifications'
    }
};

// Har bir role uchun base URL
const ROLE_BASE_URLS = {
    'admin-panel': '/roles/admin-panel',
    'customer': '/roles/customer',
    'duty-engineer': '/roles/duty-engineer',
    'inspectors': '/roles/inspectors',
    'performer': '/roles/performer',
    'manager': '/roles/manager',
    'service-engineer': '/roles/service-engineer'
};

// Joriy role'ni aniqlash
const getCurrentRole = () => {
    if (typeof window === 'undefined') return 'admin-panel';

    const path = window.location.pathname;
    const roleMatch = path.match(/\/roles\/([^\/]+)/);

    if (!roleMatch) return 'admin-panel';

    const role = roleMatch[1];
    return role in ROLE_BASE_URLS ? role : 'admin-panel';
};

// Notification navigatsiyasini olish
const getNotificationNavigation = (notification) => {
    const { category } = notification;

    // Joriy role
    const currentRole = getCurrentRole();

    // Base URL
    const baseUrl = ROLE_BASE_URLS[currentRole] || '/roles/admin-panel';

    // Role uchun mapping
    const roleMapping = ROLE_TAB_MAPPINGS[currentRole] || ROLE_TAB_MAPPINGS['admin-panel'];

    // Tab ni aniqlash
    const tab = roleMapping[category] || roleMapping['default'] || 'notifications';

    return {
        url: `${baseUrl}?tab=${tab}`,
        role: currentRole,
        tab: tab,
        category: category
    };
};

// Sana formatlash
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${day}.${month}.${year}`;
};

// Vaqtni "N daqiqa oldin" formatida ko'rsatish
const formatTimeAgo = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;

    return formatDate(dateString);
};

const getLatestUpdateDate = (notifications) => {
    if (!notifications || notifications.length === 0) return '';

    const dates = notifications.map(n => new Date(n.created_at)).filter(d => !isNaN(d.getTime()));
    if (dates.length === 0) return '';

    const latestDate = new Date(Math.max(...dates));
    return formatDate(latestDate);
};

// Custom PATCH request funksiyasi
const patchDataToken = async (url, data = {}) => {
    try {
        const token = localStorage.getItem("access_token");
        if (!token) {
            console.error("No access token found");
            return null;
        }

        const response = await fetch(
            `https://api.safecode.flowersoptrf.ru${url}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("PATCH error:", errorData);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("PATCH request error:", error);
        return null;
    }
};

export default function AdminNotification() {
    const router = useRouter();
    const { getDataToken, deleteDataToken } = useApiStore();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [markingAsRead, setMarkingAsRead] = useState(false);

    // Notification'larni yuklash (pagination bilan)
    const loadNotifications = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDataToken(`/notification/?page=${page}`);

            if (response.success) {
                // Agar 1-sahifa bo'lsa, tozalab qo'yamiz, aks holda qo'shamiz
                if (page === 1) {
                    setNotifications(response.data);
                } else {
                    setNotifications(prev => [...prev, ...response.data]);
                }
                setPagination(response.pagination);
                setUnreadCount(response.unread_count || 0);
                setCurrentPage(page);
            } else {
                setError(response.message || 'Не удалось загрузить уведомления');
            }
        } catch (error) {
            setError(error?.message || 'Ошибка при загрузке уведомлений');
        } finally {
            setLoading(false);
        }
    }, [getDataToken]);

    // Komponent yuklanganda notification'larni olish
    useEffect(() => {
        loadNotifications(1);
    }, [loadNotifications]);

    // Notification'ni o'qilgan qilish
    const handleMarkAsRead = useCallback(async (notificationId) => {
        if (markingAsRead) return;

        setMarkingAsRead(true);
        try {
            const result = await patchDataToken(
                `/api/v1/notification/${notificationId}/read/`,
                {}
            );

            if (result?.success === true || result?.status === "success") {
                // Local state yangilash
                setNotifications(prev =>
                    prev.map((notif) =>
                        notif.id === notificationId ? { ...notif, is_read: true } : notif
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } else {
                console.log('Не удалось отметить уведомление как прочитанное');
            }
        } catch (error) {
            console.error("Error marking as read:", error);
        } finally {
            setMarkingAsRead(false);
        }
    }, [markingAsRead]);

    const handleNotificationClick = useCallback((notification) => {
        // Agar o'qilmagan bo'lsa, o'qilgan deb belgilash
        if (!notification.is_read) {
            handleMarkAsRead(notification.id);
        }

        const navigation = getNotificationNavigation(notification);

        setTimeout(() => {
            router.push(navigation.url);
        }, 500);

    }, [handleMarkAsRead, router]);

    const handleLoadMore = useCallback(() => {
        if (pagination?.has_next && !loading) {
            loadNotifications(currentPage + 1);
        }
    }, [pagination, loading, currentPage, loadNotifications]);

    // Yuklash holati
    if (loading && notifications.length === 0) {
        return (
            <div>
                <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                    <div className="flex flex-col">
                        <Title text={"Уведомления"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                        <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6">Загрузка...</p>
                    </div>
                    <Button
                        className="h-[54px] w-[185px] max-md:w-full max-md:rounded-[8px] max-md:h-[50px]"
                        text={"Убрать все"}
                        disabled={true}
                    />
                </div>
                <div className="text-center py-8">Загрузка уведомлений...</div>
            </div>
        );
    }

    // Xatolik holati
    if (error && notifications.length === 0) {
        return (
            <div>
                <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                    <div className="flex flex-col">
                        <Title text={"Уведомления"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                        <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6">Последнее обновление: Ошибка</p>
                    </div>
                    <Button
                        className="h-[54px] w-[185px] max-md:w-full max-md:rounded-[8px] max-md:h-[50px]"
                        text={"Убрать все"}
                        disabled={true}
                    />
                </div>
                <div className="text-center py-8 text-red-500">{error}</div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div>
                <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                    <div className="flex flex-col">
                        <Title text={"Уведомления"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                        <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6">Нет уведомлений</p>
                    </div>
                    <Button
                        className="h-[54px] w-[185px] max-md:w-full max-md:rounded-[8px] max-md:h-[50px]"
                        text={"Убрать все"}
                        disabled={true}
                    />
                </div>
                <div className="text-center py-8">У вас пока нет уведомлений</div>
            </div>
        );
    }

    const latestUpdate = getLatestUpdateDate(notifications);

    return (
        <div>
            <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                <div className="flex flex-col">
                    <Title text={"Уведомления"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6">
                        {latestUpdate ? `Последнее обновление ${latestUpdate}` : 'Загрузка даты...'}
                        {unreadCount > 0 && ` • Непрочитанных: ${unreadCount}`}
                    </p>
                </div>

            </div>

            {/* Notification'lar ro'yxati */}
            {notifications.map((notification) => {


                const isRead = notification.is_read;

                return (
                    <div
                        key={notification.id}
                        className={`p-6 mt-4 rounded-xl flex border border-blue-900 justify-between items-center max-md:flex-col cursor-pointer transition-all duration-200 ${isRead ? '' : 'hover:shadow-md'} ${markingAsRead ? 'pointer-events-none opacity-50' : ''}`}
                        style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
                        onClick={() => handleNotificationClick(notification)}
                    >
                        <div className="flex items-center gap-x-4 max-md:items-start max-md:mb-4 w-full">


                            <div className="flex flex-col flex-1 min-w-0">
                                <Title
                                    text={notification.message}
                                    size={"text-lg max-md:text-base max-md:leading-[110%]"}
                                    cls={`${isRead ? 'text-[#2C5AA0]/70' : 'text-[#2C5AA0]'}`}
                                />

                                {/* Time and info row */}
                                <div className="flex flex-wrap items-center gap-2 mt-2 max-md:gap-1">
                                    {/* Time */}
                                    <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-[#1E1E1E]/80">
                                            {formatTimeAgo(notification.created_at)}
                                        </p>
                                    </div>

                                    {/* Actor info if exists */}
                                    {notification.actor && (
                                        <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                                            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <p className="text-xs text-blue-600">
                                                {notification.actor.first_name} {notification.actor.last_name}
                                            </p>
                                        </div>
                                    )}

                                    {/* Object info if exists */}
                                    {notification.user_object?.name && (
                                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="text-xs text-green-600">
                                                {notification.user_object.name}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Unread indicator */}
                                {!isRead && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium text-blue-600">
                                            Новое уведомление • Нажмите, чтобы перейти
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Pagination / "Ko'proq ko'rsatish" tugmasi */}
            {pagination?.has_next && (
                <div className="flex justify-center mt-8">
                    <Button
                        className="h-[54px] w-[282px] max-md:w-full max-md:rounded-[8px] max-md:h-[50px]"
                        text={loading ? "Загрузка..." : "Показать еще"}
                        onClick={handleLoadMore}
                        disabled={loading}
                    />
                </div>
            )}

            {/* Pagination ma'lumotlari */}
            {pagination && (
                <div className="text-center mt-6 text-[#1E1E1E]/60 text-sm">
                    Показано {notifications.length} из {pagination.total_items} уведомлений
                    {pagination.total_pages > 1 && ` • Страница ${currentPage} из ${pagination.total_pages}`}
                </div>
            )}
        </div>
    );
}