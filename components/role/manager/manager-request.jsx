'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';
import { IoMdClose } from 'react-icons/io';
import { MdCheck } from 'react-icons/md';
import { RiQuestionMark } from 'react-icons/ri';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useApiStore } from '@/store/useApiStore';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

const MapWithNoSSR = dynamic(() => import('../duty-engineer/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-[188px] w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p>Карта загружается...</p>
        </div>
    )
});

export default function ManagerRequest() {
    const { data, loading, error, getDataToken } = useApiStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [objects, setObjects] = useState([]);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        loadObjects(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (data?.data && Array.isArray(data.data)) {
            setObjects(data.data);
            setPagination(data.pagination);
        }
    }, [data]);

    const loadObjects = async (page = 1) => {
        await getDataToken(`/user_objects/?page=${page}`);
    };

    // Status bo'yicha icon va rang
    const getStatusInfo = (status) => {
        switch (status) {
            case 'active':
            case 'completed':
            case 'verified':
                return {
                    icon: <MdCheck className='text-white size-6' />,
                    bgColor: 'bg-[#29C77C]',
                    title: 'Заявка завершена',
                    buttonText: 'Убрать из списка',
                    buttonClass: 'h-[54px] w-[176px]'
                };
            case 'pending':
                return {
                    icon: <RiQuestionMark className='text-[#1E1E1E99] size-6' />,
                    bgColor: 'bg-[#E2E2E2]',
                    title: 'Заявка на рассмотрении',
                    buttonText: 'Назначить приоритет',
                    buttonClass: 'h-[54px] w-[211px] bg-[#E2E2E2] !text-[#8E8E8E]'
                };
            case 'on_hold':
                return {
                    icon: <RiQuestionMark className='text-[#1E1E1E99] size-6' />,
                    bgColor: 'bg-[#E2E2E2]',
                    title: 'Заявка приостановлена',
                    buttonText: 'Отправить менеджеру',
                    buttonClass: 'h-[54px] w-[211px] bg-[#E2E2E2] !text-[#8E8E8E]'
                };
            case 'cancelled':
            case 'not_verified':
                return {
                    icon: <IoMdClose className='text-[#fff] size-6' />,
                    bgColor: 'bg-[#D9272799]',
                    title: 'Заявка не решилась',
                    buttonText: 'Вернуть заказчику на уточнение',
                    buttonClass: 'h-[54px] w-[253px] bg-[#D9272799] !text-[#FFFFFF]'
                };
            default:
                return {
                    icon: <RiQuestionMark className='text-[#1E1E1E99] size-6' />,
                    bgColor: 'bg-[#E2E2E2]',
                    title: 'Заявка на рассмотрении',
                    buttonText: 'Назначить приоритет',
                    buttonClass: 'h-[54px] w-[211px] bg-[#E2E2E2] !text-[#8E8E8E]'
                };
        }
    };

    // Sana formatlash
    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        return `${day}.${month}.${year}`;
    };

    // Sahifani o'zgartirish
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination?.total_pages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading && objects.length === 0) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 text-lg">Произошла ошибка при загрузке данных</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between md:items-center max-md:flex-col">
                <div className="flex flex-col">
                    <Title text={"Заявки"} size={"text-[24px] max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
                        Последнее обновление {data?.data?.[0] ? formatDate(data.data[0].updated_at) : '—'}
                    </p>
                </div>
                {pagination && (
                    <div className="flex items-center gap-2 max-md:mt-4">
                        <span className="text-sm text-[#1E1E1E]/60">
                            Страница {pagination.current_page} из {pagination.total_pages}
                        </span>
                        <span className="text-sm text-[#1E1E1E]/60">
                            (Всего объектов: {pagination.total_items})
                        </span>
                    </div>
                )}
            </div>

            {/* Obyektlar ro'yxati */}
            {objects.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <RiQuestionMark className="text-gray-400 text-4xl" />
                    </div>
                    <p className="text-gray-500 text-lg">Заявки не найдены</p>
                </div>
            ) : (
                <>
                    {objects.map((object) => {
                        const statusInfo = getStatusInfo(object.status);

                        return (
                            <div
                                key={object.id}
                                className="p-6 mt-6 rounded-xl hover:shadow-lg transition-shadow"
                                style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
                            >
                                <div className="h-[188px] w-full mb-6 rounded-lg overflow-hidden">
                                    <MapWithNoSSR
                                        customLocations={[{
                                            id: object.id,
                                            name: object.name,
                                            lat: parseFloat(object.latitude) || 41.2995,
                                            lng: parseFloat(object.longitude) || 69.2401,
                                            address: object.address
                                        }]}
                                        center={[
                                            parseFloat(object.latitude) || 41.2995,
                                            parseFloat(object.longitude) || 69.2401
                                        ]}
                                    />
                                </div>
                                <div className="flex justify-between md:items-center max-md:flex-col max-md:gap-4">
                                    <div className="flex items-center gap-x-4">
                                        <div className={`h-[50px] w-[50px] ${statusInfo.bgColor} rounded-lg flex items-center justify-center flex-shrink-0 max-md:hidden`}>
                                            {statusInfo.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <Title text={statusInfo.title} size={"text-lg"} cls="text-[#2C5AA0]" />
                                            <p className="text-[#1E1E1E]/60 mt-2">
                                                Проверка системы пожаротушения - {object.name}
                                            </p>
                                            <div className="flex gap-4 mt-2 text-sm text-[#1E1E1E]/60">
                                                <span>📍 {object.address}</span>
                                                <span>📏 {object.size} м²</span>
                                            </div>

                                        </div>
                                    </div>
                                    <Button
                                        className={`${statusInfo.buttonClass} max-md:w-full`}
                                        text={statusInfo.buttonText}
                                    // onClick={() => toast.info('Функция в разработке')}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {pagination && pagination.total_pages > 1 && (
                        <div className="mt-8 flex justify-center items-center gap-3">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.has_previous}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${pagination.has_previous
                                    ? 'bg-[#2C5AA0] text-white hover:bg-[#234a85]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <FaChevronLeft />
                                Назад
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => {
                                    // Показываем только первую, последнюю и соседние страницы
                                    if (
                                        pageNum === 1 ||
                                        pageNum === pagination.total_pages ||
                                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${pageNum === currentPage
                                                    ? 'bg-[#2C5AA0] text-white shadow-md'
                                                    : 'bg-white text-[#1E1E1E] hover:bg-gray-100 border border-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (
                                        pageNum === currentPage - 2 ||
                                        pageNum === currentPage + 2
                                    ) {
                                        return <span key={pageNum} className="px-2 py-2">...</span>;
                                    }
                                    return null;
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.has_next}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${pagination.has_next
                                    ? 'bg-[#2C5AA0] text-white hover:bg-[#234a85]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Вперёд
                                <FaChevronRight />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}