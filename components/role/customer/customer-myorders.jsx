import ProductCart from '@/components/catalog/product-cart'
import Title from '@/components/ui/title'
import React, { useState, useEffect, useCallback } from 'react'
import { useApiStore } from '@/store/useApiStore'
import toast from 'react-hot-toast'

// Sana formatlash funksiyasi
const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });
};

// Kun bo'yicha guruhlash funksiyasi
const groupOrdersByDate = (orders) => {
    const grouped = {};

    orders.forEach(order => {
        const dateKey = order.created_at.split('T')[0]; // YYYY-MM-DD formatida
        const formattedDate = formatDate(order.created_at);

        if (!grouped[formattedDate]) {
            grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(order);
    });

    return grouped;
};

export default function CustomerMyorders() {
    const { getDataToken } = useApiStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedOrders, setGroupedOrders] = useState({});
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Buyurtmalarni yuklash
    const loadOrders = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getDataToken(`/orders/?page=${page}`);

            if (response.success) {
                setOrders(response.data);
                setPagination(response.pagination);

                // Buyurtmalarni kun bo'yicha guruhlash
                const grouped = groupOrdersByDate(response.data);
                setGroupedOrders(grouped);
            } else {
                setError(response.message || 'Не удалось загрузить заказы');
                toast.error(response.message || 'Не удалось загрузить заказы');
            }
        } catch (error) {
            setError(error?.message || 'Ошибка при загрузке заказов');
            toast.error('Ошибка при загрузке заказов');
        } finally {
            setLoading(false);
        }
    }, [getDataToken]);

    // Komponent yuklanganda buyurtmalarni olish
    useEffect(() => {
        loadOrders(currentPage);
    }, [currentPage, loadOrders]);

    // "Заказать еще раз" tugmasi bosilganda
    const handleReorder = useCallback(async (productId) => {
        try {
            // Bu yerda siz yangi buyurtma yaratish yoki savatga qo'shish logikasini yozasiz
            // Masalan: cart store'ga mahsulot qo'shish
            toast.success('Товар добавлен в корзину для повторного заказа');
        } catch (error) {
            toast.error('Не удалось добавить товар в корзину');
        }
    }, []);

    // Yuklash holati
    if (loading && orders.length === 0) {
        return (
            <div>
                <div className="flex flex-col">
                    <Title text={'Мои заказы'} size={'text-[24px]'} cls="uppercase" />
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">Загрузка заказов...</div>
                </div>
            </div>
        );
    }

    // Xatolik holati
    if (error && orders.length === 0) {
        return (
            <div>
                <div className="flex flex-col">
                    <Title text={'Мои заказы'} size={'text-[24px]'} cls="uppercase" />
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    // Buyurtmalar bo'sh holati
    if (orders.length === 0) {
        return (
            <div>
                <div className="flex flex-col">
                    <Title text={'Мои заказы'} size={'text-[24px]'} cls="uppercase" />
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">У вас пока нет заказов</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col">
                <Title text={'Мои заказы'} size={'text-[24px]'} cls="uppercase" />
            </div>

            {/* Gruppalangan buyurtmalarni chiqarish */}
            {Object.entries(groupedOrders).map(([date, dateOrders]) => (
                <div key={date}>
                    <div className="flex flex-col">
                        <p className='text-[#1E1E1E]/60 mt-4'>{date}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {dateOrders.flatMap(order =>
                            order.items.map(item => (
                                <ProductCart
                                    key={`${order.id}-${item.id}`}
                                    productId={item.product.id}
                                    isNew={false}
                                    isLike={false}
                                    initialQuantity={item.quantity.toString()}
                                    buttonText="Заказать еще раз"
                                    img="/cart.png" // Mahsulot rasmi uchun standart rasm
                                    title={item.product.name}
                                    item={item.product.article}
                                    size="" // Agar mahsulot o'lchami kerak bo'lsa, API dan qo'shishingiz mumkin
                                    price={item.product.price}
                                    // "Заказать еще раз" tugmasi bosilganda
                                    onCardClick={() => handleReorder(item.product.id)}
                                    // Agar ProductCart komponenti button uchun alohida onClick prop'ini qabul qilsa:
                                    onButtonClick={() => handleReorder(item.product.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            ))}

            {/* Paginatsiya (agar kerak bo'lsa) */}
            {pagination?.has_next && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Загрузка...' : 'Показать еще'}
                    </button>
                </div>
            )}
        </div>
    )
}