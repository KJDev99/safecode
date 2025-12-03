// components/ui/NotificationDropdown.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoNotifications, IoTrash } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function NotificationDropdown({
  notifications,
  unreadCount,
  isConnected,
  onClearAll,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [serverNotifications, setServerNotifications] = useState([]);
  const [serverUnreadCount, setServerUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // PATCH request funksiyasi
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

  // GET request funksiyasi
  const getDataToken = async (url) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.error("No access token found");
        return null;
      }

      const response = await fetch(
        `https://api.safecode.flowersoptrf.ru${url}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("GET error:", errorData);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("GET request error:", error);
      return null;
    }
  };

  // Serverdan notification'larni yuklash
  const loadServerNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await getDataToken(
        `/api/v1/notification/?is_read=false`
      );
      console.log("Notifications API response:", response);

      if (response?.data && Array.isArray(response.data)) {
        setServerNotifications(response.data);
        setServerUnreadCount(response.unread_count || 0);
      } else if (Array.isArray(response)) {
        // Agar response to'g'ridan-to'g'ri array bo'lsa
        setServerNotifications(response);
        // Unread count'ni hisoblaymiz
        const unread = response.filter((n) => !n.read).length;
        setServerUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Single notification'ni read qilish
  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await patchDataToken(
        `/api/v1/notification/${notificationId}/read/`,
        {}
      );
      console.log("Mark as read result:", result);

      if (result?.success === true || result?.status === "success") {
        // Local state yangilash
        setServerNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setServerUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isOpen) {
      loadServerNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Dropdowndan tashqariga bosilsa yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // WebSocket yangilanishlarini kuzatish
  useEffect(() => {
    console.log("new rtesrtse");

    // Agar WebSocket orqali yangi notification kelgan bo'lsa
    if (isConnected) {
      // Dropdown ochiq bo'lsa, yangi notification'larni ko'rsatish uchun serverdan qayta yuklash
      loadServerNotifications();
    }
  }, [notifications, isOpen, isConnected]);

  // Vaqtni formatlash
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "только что";
      if (diffMins < 60) return `${diffMins} мин. назад`;
      if (diffHours < 24) return `${diffHours} ч. назад`;
      if (diffDays < 7) return `${diffDays} дн. назад`;

      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch (error) {
      return "недавно";
    }
  };

  // Barcha notification'lar (WebSocket + Server)
  const wsNotifications = notifications || [];
  const totalUnreadCount = unreadCount + serverUnreadCount;
  const allNotifications = [...wsNotifications, ...serverNotifications];
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Icon Button */}
      <button
        onClick={toggleDropdown}
        className="relative w-[42px] h-[42px] flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] hover:bg-[#C5C5C5]/70 transition-colors group max-md:w-12 max-md:h-12"
      >
        <IoNotifications className="text-[18px] text-[#1E1E1E]/50" />

        {/* Unread Counter Badge - har doim ko'rinib turadi */}
        {totalUnreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-bold bg-[#FF6B6B] text-white">
            {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-md:w-80 max-md:right-0 max-md:left-auto"
            style={{ boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.1)" }}
          >
            {/* Dropdown Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[#1E1E1E] text-lg">
                  Уведомления
                </h3>
                {allNotifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IoTrash className="text-base" />
                    Очистить
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#2C5AA0]"></div>
                  <p className="mt-2 text-sm text-gray-500">Загрузка...</p>
                </div>
              ) : allNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <IoNotifications className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Нет уведомлений</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Здесь появятся новые сообщения
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {allNotifications.slice(0, 20).map((notification, index) => (
                    <div
                      key={
                        notification.id ||
                        notification._id ||
                        `notification-${index}`
                      }
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-blue-50/30" : ""
                      }`}
                      onClick={() => {
                        if (!notification.read && notification.id) {
                          handleMarkAsRead(notification.id);
                        }
                        setIsOpen(false);
                        // Admin panel yoki Customer panel'ga o'tish
                        const isAdmin =
                          window.location.pathname.includes("admin-panel");
                        if (isAdmin) {
                          router.push("/roles/admin-panel?tab=notifications");
                        } else {
                          router.push("/roles/customer?tab=notifications");
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Notification Icon */}
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                          <IoNotifications className="text-sm text-blue-600" />
                        </div>

                        {/* Notification Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-[#1E1E1E] text-sm line-clamp-1">
                              {notification.title || "Новое уведомление"}
                            </h4>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                              {formatTime(
                                notification.created_at ||
                                  notification.timestamp ||
                                  new Date()
                              )}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {notification.message ||
                              notification.description ||
                              ""}
                          </p>

                          {/* Unread Indicator */}
                          {!notification.read && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="text-xs text-blue-600 font-medium">
                                Новое
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Chevron */}
                        <FiChevronRight className="text-gray-400 flex-shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Footer - faqat bitta tugma */}
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Admin panel yoki Customer panel'ga o'tish
                  const isAdmin =
                    window.location.pathname.includes("admin-panel");
                  if (isAdmin) {
                    router.push("/roles/admin-panel?tab=notifications");
                  } else {
                    router.push("/roles/customer?tab=notifications");
                  }
                }}
                className="w-full py-2.5 text-center text-blue-600 font-medium text-sm hover:bg-blue-50 rounded-lg transition-colors"
              >
                Показать все уведомления
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
