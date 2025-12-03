// components/ui/useWebSocketNotification.js
import { useEffect, useState, useRef, useCallback } from 'react';

export const useWebSocketNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const ws = useRef(null);
    const reconnectTimeout = useRef(null);

    const connectWebSocket = useCallback(() => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                console.log('No access token found');
                return;
            }

            // Token'ni tozalash
            const cleanToken = token.replace('Bearer ', '').trim();

            // Eski connection'ni yopish
            if (ws.current) {
                ws.current.close();
            }

            // URL'ni to'g'ri formatlash
            const wsUrl = `wss://api.safecode.flowersoptrf.ru/ws/notifications/?token=${encodeURIComponent(cleanToken)}`;
            console.log('Connecting to WebSocket:', wsUrl);

            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('✅ WebSocket connected successfully');
                setIsConnected(true);

                // Connection bo'lganda serverdan notification'larni so'rash
                const subscribeMessage = {
                    type: 'subscribe',
                    channel: 'notifications'
                };
                ws.current.send(JSON.stringify(subscribeMessage));

                // Reconnect timeout'ni tozalash
                if (reconnectTimeout.current) {
                    clearTimeout(reconnectTimeout.current);
                    reconnectTimeout.current = null;
                }
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('📨 WebSocket message received:', data);

                    // Yangi notification kelganda
                    if (data.type === 'notification' || data.notification) {
                        const notificationData = data.notification || data.data || data;

                        const newNotification = {
                            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            ...notificationData,
                            read: false,
                            timestamp: new Date().toISOString()
                        };

                        console.log('➕ New notification:', newNotification);

                        // Yangi notification qo'shamiz
                        setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
                        setUnreadCount(prev => prev + 1);

                        // Audio notification (agar kerak bo'lsa)
                        try {
                            const audio = new Audio('/notification.mp3');
                            audio.volume = 0.3;
                            audio.play().catch(e => console.log('Audio play error:', e));
                        } catch (audioError) {
                            console.log('Audio error:', audioError);
                        }

                        // Browser notification (agar ruxsat bo'lsa)
                        if (Notification.permission === 'granted' &&
                            notificationData.title &&
                            document.visibilityState === 'hidden') {
                            new Notification(notificationData.title, {
                                body: notificationData.message || '',
                                icon: '/favicon.ico',
                                tag: 'safecode-notification',
                                silent: true
                            });
                        }
                    }

                    // Unread count yangilash
                    if (data.unread_count !== undefined) {
                        console.log('🔢 Updating unread count:', data.unread_count);
                        setUnreadCount(data.unread_count);
                    }

                    // Real-time yangilash
                    if (data.action === 'new_notification') {
                        console.log('🔄 Real-time notification update');
                        // Page yangilashni emas, faqat state yangilash
                        setUnreadCount(prev => prev + 1);
                    }

                    // Ping-pong
                    if (data.type === 'ping') {
                        ws.current.send(JSON.stringify({ type: 'pong' }));
                    }

                } catch (error) {
                    console.error('❌ Error parsing WebSocket message:', error, event.data);
                }
            };

            ws.current.onclose = (event) => {
                console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                setIsConnected(false);

                // Auto reconnect
                if (!reconnectTimeout.current) {
                    reconnectTimeout.current = setTimeout(() => {
                        console.log('🔄 Reconnecting WebSocket...');
                        connectWebSocket();
                    }, 5000); // 5 sekunddan keyin reconnect
                }
            };

            ws.current.onerror = (error) => {
                console.error('❌ WebSocket error:', error);
                setIsConnected(false);
            };

        } catch (error) {
            console.error('❌ WebSocket connection error:', error);
        }
    }, []);

    const disconnectWebSocket = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
        }
        setIsConnected(false);
    }, []);

    const markAsRead = useCallback((notificationId) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
        setUnreadCount(0);
    }, []);

    const clearNotifications = useCallback(() => {
        setNotifications([]);
        setUnreadCount(0);
    }, []);

    useEffect(() => {
        // Browser notification permission so'rash
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Sahifa yuklanganda WebSocket'ga ulanish
        connectWebSocket();

        // Page visibility change bo'lganda
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isConnected) {
                console.log('👁️ Page visible, reconnecting WebSocket');
                connectWebSocket();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            disconnectWebSocket();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [connectWebSocket, disconnectWebSocket]);

    // Debug uchun: har 10 sekundda connection holatini log qilish
    useEffect(() => {
        const interval = setInterval(() => {
            if (ws.current) {
                const state = ws.current.readyState;
                const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
                console.log(`🔍 WebSocket state: ${states[state]} (${state})`);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        reconnect: connectWebSocket
    };
};