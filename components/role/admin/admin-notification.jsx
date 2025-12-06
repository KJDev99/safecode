import Button from '@/components/ui/button'
import Title from '@/components/ui/title'
import React, { useState, useEffect, useCallback } from 'react'
import { MdCheck } from "react-icons/md";
import { RiQuestionMark } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useApiStore } from '@/store/useApiStore'
import toast from 'react-hot-toast'

// Notification turi bo'yicha icon va rang aniqlash
const getNotificationTypeInfo = (verb, category) => {
    if (verb === 'object_sent_for_review') {
        return {
            icon: RiQuestionMark,
            bgColor: '#E2E2E2',
            iconColor: '#1E1E1E99',
            buttonType: 'view'
        };
    } else if (verb === 'bill_created') {
        return {
            icon: MdCheck,
            bgColor: '#29C77C',
            iconColor: 'white',
            buttonType: 'view'
        };
    } else if (verb === 'journal_and_act_created') {
        return {
            icon: MdCheck,
            bgColor: '#29C77C',
            iconColor: 'white',
            buttonType: 'view'
        };
    } else {
        // Default holat
        return {
            icon: IoMdClose,
            bgColor: '#D9272799',
            iconColor: '#fff',
            buttonType: 'view'
        };
    }
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
                toast.error(response.message || 'Не удалось загрузить уведомления');
            }
        } catch (error) {
            setError(error?.message || 'Ошибка при загрузке уведомлений');
            toast.error('Ошибка при загрузке уведомлений');
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
                console.log('Уведомление отмечено как прочитанное');
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

        // Bu yerda notification turiga qarab navigation qo'shishingiz mumkin
        // Masalan:
        // if (notification.target?.type === 'bill') {
        //     router.push(`/bills/${notification.target.id}`);
        // }
    }, [handleMarkAsRead]);

    // Keyingi sahifani yuklash
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
                const { icon: Icon, bgColor, iconColor } = getNotificationTypeInfo(
                    notification.verb,
                    notification.category
                );

                const isRead = notification.is_read;

                return (
                    <div
                        key={notification.id}
                        className={`p-6 mt-6 rounded-xl flex justify-between items-center max-md:flex-col cursor-pointer transition-all duration-200 ${isRead ? 'opacity-80 hover:opacity-100' : 'hover:shadow-md'} ${markingAsRead ? 'pointer-events-none opacity-50' : ''}`}
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
                                <div className="flex flex-wrap items-center gap-2 mt-2 max-md:gap-1">
                                    <p className="text-[#1E1E1E]/60 max-md:text-sm max-md:leading-[120%]">
                                        {formatTimeAgo(notification.created_at)}
                                    </p>
                                    <span className="text-[#1E1E1E]/40">•</span>
                                    <p className="text-[#1E1E1E]/60 max-md:text-sm max-md:leading-[120%]">
                                        {notification.actor?.first_name} {notification.actor?.last_name}
                                    </p>
                                    {notification.user_object?.name && (
                                        <>
                                            <span className="text-[#1E1E1E]/40">•</span>
                                            <p className="text-[#1E1E1E]/60 max-md:text-sm max-md:leading-[120%]">
                                                {notification.user_object.name}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {!isRead && (
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium text-blue-600">
                                            Новое уведомление • Нажмите, чтобы прочитать
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