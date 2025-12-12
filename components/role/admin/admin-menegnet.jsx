import React, { useState, useEffect } from "react";
import { FaPlus, FaCheck, FaUsers, FaFileDownload, FaEye, FaBuilding, FaUser } from "react-icons/fa";
import { IoMdClose, IoMdDocument } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import { useApiStore } from "@/store/useApiStore";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function AdminManagement() {
    const { data, loading, error, getDataToken, postDataToken } = useApiStore();
    const [objects, setObjects] = useState([]);
    const [workers, setWorkers] = useState({});
    const [selectedObject, setSelectedObject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedWorkers, setSelectedWorkers] = useState([]);
    const [expandedRoles, setExpandedRoles] = useState({});
    const [statusObject, setStatusObject] = useState(null);
    const [detailsObject, setDetailsObject] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        await getDataToken("/user_objects/all/");
    };

    const loadWorkers = async () => {
        await getDataToken("/user_objects/workers/");
    };

    useEffect(() => {
        if (Array.isArray(data?.data)) {
            setObjects(data.data);
        } else if (data?.data && typeof data.data === "object") {
            setWorkers(data.data);
        }
    }, [data]);

    const openModal = async (object) => {
        setSelectedObject(object);
        const assignedWorkerIds = [];
        if (object.workers_document && Object.keys(object.workers_document).length > 0) {
            Object.values(object.workers_document).forEach(role => {
                if (role.user_info && Array.isArray(role.user_info)) {
                    role.user_info.forEach(user => {
                        assignedWorkerIds.push(user.id);
                    });
                }
            });
        }
        setSelectedWorkers(assignedWorkerIds);
        setIsModalOpen(true);
        await loadWorkers();
        if (assignedWorkerIds.length > 0) {
            const rolesToExpand = {};
            Object.keys(object.workers_document || {}).forEach(roleName => {
                rolesToExpand[roleName] = true;
            });
            setExpandedRoles(rolesToExpand);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedObject(null);
        setSelectedWorkers([]);
        setExpandedRoles({});
    };

    const openStatusModal = (object) => {
        setStatusObject(object);
        setSelectedStatus(object.status);
        setIsStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setIsStatusModalOpen(false);
        setStatusObject(null);
        setSelectedStatus("");
    };

    const openDetailsModal = (object) => {
        setDetailsObject(object);
        setIsDetailsModalOpen(true);
    };

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setDetailsObject(null);
    };

    const toggleRole = (roleName) => {
        setExpandedRoles(prev => ({
            ...prev,
            [roleName]: !prev[roleName]
        }));
    };

    const handleWorkerSelect = (workerId) => {
        setSelectedWorkers(prev => {
            if (prev.includes(workerId)) {
                return prev.filter(id => id !== workerId);
            } else {
                return [...prev, workerId];
            }
        });
    };

    const handleAssignWorkers = async () => {
        if (selectedWorkers.length === 0) {
            toast.error("Пожалуйста, выберите хотя бы одного исполнителя");
            return;
        }

        const loadingToast = toast.loading("Назначение исполнителей...");

        const payload = {
            user_objects_id: selectedObject.id,
            worker_list: selectedWorkers
        };

        const response = await postDataToken("/user_objects/workers/add/", payload);

        toast.dismiss(loadingToast);

        if (response && !response.error) {
            toast.success("Исполнители успешно назначены!");
            closeModal();
            loadObjects();
        } else {
            toast.error("Произошла ошибка. Попробуйте еще раз");
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedStatus || selectedStatus === statusObject.status) {
            toast.error("Выберите новый статус");
            return;
        }

        const loadingToast = toast.loading("Обновление статуса...");

        const payload = {
            object_id: statusObject.id,
            status: selectedStatus
        };

        const response = await postDataToken("/user_objects/status/update/", payload);

        toast.dismiss(loadingToast);

        if (response && !response.error) {
            toast.success("Статус успешно обновлен!");
            closeStatusModal();
            loadObjects();
        } else {
            toast.error("Произошла ошибка при обновлении статуса");
        }
    };

    const handleDownloadFile = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'document';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(2);
        return `${day}.${month}.${year}`;
    };

    const getAssignedWorkerCount = (obj) => {
        if (!obj.workers_document || Object.keys(obj.workers_document).length === 0) {
            return 0;
        }
        let count = 0;
        Object.values(obj.workers_document).forEach(role => {
            if (role.user_info && Array.isArray(role.user_info)) {
                count += role.user_info.length;
            }
        });
        return count;
    };

    const getTotalDocuments = (obj) => {
        if (!obj.workers_document || Object.keys(obj.workers_document).length === 0) {
            return 0;
        }
        let count = 0;
        Object.values(obj.workers_document).forEach(role => {
            if (role.document_list && Array.isArray(role.document_list)) {
                count += role.document_list.length;
            }
        });
        return count;
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            'active': { label: 'Активный', color: 'bg-[#2C5AA0] text-white' },
            'pending': { label: 'В ожидании', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
            'completed': { label: 'Завершен', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
            'on_hold': { label: 'Приостановлен', color: 'bg-orange-100 text-orange-700 border border-orange-200' },
            'cancelled': { label: 'Отменен', color: 'bg-red-100 text-red-700 border border-red-200' }
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-[#1E1E1E] border border-gray-200' };
    };

    const isWorkerAssigned = (workerId) => {
        if (!selectedObject?.workers_document) return false;
        for (const role of Object.values(selectedObject.workers_document)) {
            if (role.user_info && Array.isArray(role.user_info)) {
                if (role.user_info.some(user => user.id === workerId)) {
                    return true;
                }
            }
        }
        return false;
    };

    if (loading && !isModalOpen && !isStatusModalOpen && !isDetailsModalOpen) return <Loader />;
    if (error && !objects.length) return <div className="text-center py-8 text-red-500">Произошла ошибка: {error}</div>;

    return (
        <div className="pb-8">
            <div className="flex justify-between md:items-center max-md:flex-col max-md:gap-4">
                <div className="flex flex-col">
                    <Title text={"Управление объектами"} size={"text-[24px] max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
                        Назначение исполнителей и управление объектами
                        {objects.length > 0 && ` (${objects.length} объектов)`}
                    </p>
                </div>
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {objects.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Объекты не найдены</p>
                        <p className="text-gray-400 mt-2">Список объектов пуст</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {objects.map((object) => {
                            const statusInfo = getStatusInfo(object.status);
                            const workerCount = getAssignedWorkerCount(object);
                            const docCount = getTotalDocuments(object);

                            return (
                                <div key={object.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#2C5AA0]/30 transition-all duration-300 hover:shadow-lg">
                                    {/* Верхняя строка: Объект, Клиент, Площадь */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-100">
                                        {/* Объект */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <FaBuilding className="text-[#2C5AA0]" />
                                                <span className="font-medium">Объект</span>
                                            </div>
                                            <div>
                                                <p className="text-[#2C5AA0] font-bold text-lg">{object.name}</p>
                                                <p className="text-sm text-[#1E1E1E]/80 mt-1 flex items-start gap-1.5">
                                                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    </svg>
                                                    <span className="line-clamp-2">{object.address}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Клиент */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <FaUser className="text-[#2C5AA0]" />
                                                <span className="font-medium">Клиент</span>
                                            </div>
                                            <div>
                                                <p className="text-[#1E1E1E] font-semibold text-lg">
                                                    {object.user?.first_name} {object.user?.last_name}
                                                </p>
                                                <p className="text-sm text-[#1E1E1E]/80 mt-1 truncate">{object.user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Площадь */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <svg className="w-4 h-4 text-[#2C5AA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                                </svg>
                                                <span className="font-medium">Площадь</span>
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <span className="text-[#1E1E1E] font-bold text-2xl">{object.size}</span>
                                                <span className="text-[#1E1E1E]/60 text-lg mb-0.5">м²</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Вторая строка: Систем, Исполнители, Документы */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {/* Систем */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <svg className="w-4 h-4 text-[#2C5AA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span className="font-medium">Систем пожаротушения</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#2C5AA0] to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-bold text-2xl">
                                                        {object.number_of_fire_extinguishing_systems}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-[#1E1E1E] font-semibold">Количество систем</p>
                                                    <p className="text-sm text-[#1E1E1E]/60">Установлено на объекте</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Исполнители */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <FaUsers className="text-[#2C5AA0]" />
                                                <span className="font-medium">Исполнители</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg relative ${workerCount > 0 ? 'bg-gradient-to-br from-emerald-500 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                                                    <FaUsers className="text-white text-2xl" />
                                                    <span className="absolute text-white right-2 top-1 ">
                                                        {workerCount}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-[#1E1E1E] font-semibold">Назначено</p>
                                                    <p className="text-sm text-[#1E1E1E]/60">Исполнителей на объекте</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Документы */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[#1E1E1E]/60">
                                                <IoMdDocument className="text-[#2C5AA0] text-lg" />
                                                <span className="font-medium">Документы</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg relative ${docCount > 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
                                                    <IoMdDocument className="text-white text-2xl" />
                                                    <span className="absolute text-white right-2 top-1 ">
                                                        {docCount}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-[#1E1E1E] font-semibold">Загружено</p>
                                                    <p className="text-sm text-[#1E1E1E]/60">Документов по объекту</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Третья строка: Статус, Дата, Действия */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                        {/* Статус */}
                                        <div className="space-y-2">
                                            <div className="text-sm text-[#1E1E1E]/60 font-medium">Статус</div>
                                            <button
                                                onClick={() => openStatusModal(object)}
                                                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 ${statusInfo.color} w-full text-left flex justify-between items-center`}
                                            >
                                                <span>{statusInfo.label}</span>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Дата */}
                                        <div className="space-y-2">
                                            <div className="text-sm text-[#1E1E1E]/60 font-medium">Дата создания</div>
                                            <div className="bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-5 h-5 text-[#2C5AA0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span className="text-[#1E1E1E] font-semibold">{formatDate(object.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Действия */}
                                        <div className="space-y-2">
                                            <div className="text-sm text-[#1E1E1E]/60 font-medium">Действия</div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openDetailsModal(object)}
                                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                                                    title="Подробная информация"
                                                >
                                                    <FaEye className="text-lg" />
                                                    <span className="text-sm">Подробно</span>
                                                </button>
                                                <button
                                                    onClick={() => openModal(object)}
                                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#2C5AA0] to-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105"
                                                    title="Назначить исполнителей"
                                                >
                                                    <FaPlus className="text-lg" />
                                                    <span className="text-sm">Назначить</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* DETAILS MODAL */}
            <AnimatePresence>
                {isDetailsModalOpen && detailsObject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        onClick={closeDetailsModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2C5AA0] to-blue-800">
                                <div className="flex justify-between items-start">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold mb-2">Подробная информация</h2>
                                        <p className="text-blue-100 font-medium text-lg">{detailsObject.name}</p>
                                        <p className="text-sm text-blue-200 mt-1 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {detailsObject.address}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeDetailsModal}
                                        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                                    >
                                        <IoMdClose className="text-2xl text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                {/* Основная информация */}
                                <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-bold text-[#1E1E1E] mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Основная информация
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-[#1E1E1E]/60 mb-1">Клиент</p>
                                            <p className="text-[#1E1E1E] font-semibold">
                                                {detailsObject.user?.first_name} {detailsObject.user?.last_name}
                                            </p>
                                            <p className="text-sm text-[#1E1E1E]/60">{detailsObject.user?.email}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-[#1E1E1E]/60 mb-1">Площадь</p>
                                            <p className="text-[#1E1E1E] font-bold text-xl">{detailsObject.size} м²</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-[#1E1E1E]/60 mb-1">Систем пожаротушения</p>
                                            <p className="text-[#1E1E1E] font-bold text-xl">{detailsObject.number_of_fire_extinguishing_systems}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-[#1E1E1E]/60 mb-1">Дата создания</p>
                                            <p className="text-[#1E1E1E] font-semibold">{formatDate(detailsObject.created_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Исполнители и документы */}
                                {detailsObject.workers_document && Object.keys(detailsObject.workers_document).length > 0 ? (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-[#1E1E1E] flex items-center gap-2">
                                            <FaUsers className="text-[#2C5AA0]" />
                                            Исполнители и документы
                                        </h3>
                                        {Object.entries(detailsObject.workers_document).map(([roleName, roleData]) => (
                                            <div key={roleName} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                                                <div className="bg-gradient-to-r from-[#2C5AA0]/10 to-blue-100 px-6 py-4 border-b border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-bold text-[#2C5AA0] flex items-center gap-2">
                                                            <span className="w-8 h-8 bg-[#2C5AA0] text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                                                {roleData.user_info?.length || 0}
                                                            </span>
                                                            {roleName}
                                                        </h4>
                                                        {roleData.is_send && (
                                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium flex items-center gap-1">
                                                                <FaCheck className="text-xs" />
                                                                Отправлено
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    {/* Исполнители */}
                                                    {roleData.user_info && roleData.user_info.length > 0 && (
                                                        <div className="mb-6">
                                                            <h5 className="text-sm font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                                                                <FaUsers className="text-[#2C5AA0]" />
                                                                Назначенные исполнители
                                                            </h5>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {roleData.user_info.map((user) => (
                                                                    <div key={user.id} className="p-4 bg-gradient-to-r from-[#2C5AA0]/5 to-blue-50 rounded-xl border-2 border-blue-200 items-center col-span-2 grid grid-cols-3">
                                                                        <p className="font-semibold text-[#1E1E1E] text-base">
                                                                            {user.last_name} {user.first_name}
                                                                        </p>
                                                                        <p className="text-sm text-[#1E1E1E]/60 mt-1">{user.email}</p>
                                                                        <p className="text-sm text-[#1E1E1E]/60">+{user.phone_number}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Документы */}
                                                    {roleData.document_list && roleData.document_list.length > 0 && (
                                                        <div>
                                                            <h5 className="text-sm font-semibold text-[#1E1E1E] mb-3 flex items-center gap-2">
                                                                <IoMdDocument className="text-[#2C5AA0]" />
                                                                Документы
                                                            </h5>
                                                            <div className="space-y-3 grid grid-cols-2 gap-4">
                                                                {roleData.document_list.map((doc, docIndex) => (
                                                                    <div key={docIndex} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                                        {doc.comment && (
                                                                            <p className="text-sm text-[#1E1E1E] font-medium mb-3">
                                                                                <span className="text-[#1E1E1E]/60">Комментарий:</span> {doc.comment}
                                                                            </p>
                                                                        )}
                                                                        {doc.items && doc.items.length > 0 && (
                                                                            <div className="space-y-2 ">
                                                                                {doc.items.map((item, itemIndex) => (
                                                                                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-[#2C5AA0] transition-colors">
                                                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                                            <div className="w-10 h-10 bg-[#2C5AA0]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                                <IoMdDocument className="text-[#2C5AA0] text-xl" />
                                                                                            </div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="text-sm font-medium text-[#1E1E1E] truncate">
                                                                                                    Документ {itemIndex + 1}
                                                                                                </p>

                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex gap-2 flex-shrink-0">
                                                                                            <button
                                                                                                onClick={() => window.open(item.document_url, '_blank')}
                                                                                                className="px-3 py-2 bg-[#2C5AA0] text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                                                                                            >
                                                                                                <FaEye />
                                                                                                Просмотр
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => handleDownloadFile(item.document_url, `document_${itemIndex + 1}`)}
                                                                                                className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1"
                                                                                            >
                                                                                                <FaFileDownload />
                                                                                                Скачать
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {!roleData.user_info?.length && !roleData.document_list?.length && (
                                                        <p className="text-center text-[#1E1E1E]/60 py-4">
                                                            Нет данных для этой роли
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
                                        <FaUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-[#1E1E1E]/60 text-lg">Исполнители еще не назначены</p>
                                        <p className="text-sm text-[#1E1E1E]/60 mt-2">Назначьте исполнителей для этого объекта</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 bg-white">
                                <button
                                    onClick={closeDetailsModal}
                                    className="w-full px-6 py-3.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ASSIGN WORKERS MODAL - Оставить без изменений */}
            <AnimatePresence>
                {isModalOpen && selectedObject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2C5AA0] to-[#1e4073]">
                                <div className="flex justify-between items-start">
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold mb-2">Назначение исполнителей</h2>
                                        <p className="text-blue-100 font-medium text-lg">{selectedObject.name}</p>
                                        <p className="text-sm text-blue-200 mt-1 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {selectedObject.address}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all"
                                    >
                                        <IoMdClose className="text-2xl text-white" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader />
                                    </div>
                                ) : Object.keys(workers).length === 0 ? (
                                    <div className="text-center py-12 text-[#1E1E1E]/60">
                                        <FaUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-lg">Исполнители не найдены</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {Object.entries(workers).map(([roleName, workerList]) => (
                                            <motion.div
                                                key={roleName}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm"
                                            >
                                                <button
                                                    onClick={() => toggleRole(roleName)}
                                                    className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 flex justify-between items-center transition-all group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <motion.div
                                                            animate={{ rotate: expandedRoles[roleName] ? 90 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="text-[#2C5AA0]"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </motion.div>
                                                        <span className="font-semibold text-[#1E1E1E] text-lg">{roleName}</span>
                                                        <span className="px-3 py-1 bg-[#2C5AA0] text-white text-sm rounded-full font-medium">
                                                            {workerList?.length || 0}
                                                        </span>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {expandedRoles[roleName] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-4 space-y-3 bg-gray-50">
                                                                {workerList?.length === 0 ? (
                                                                    <p className="text-sm text-[#1E1E1E]/60 text-center py-4">
                                                                        Нет исполнителей в этой роли
                                                                    </p>
                                                                ) : (
                                                                    workerList.map((worker) => {
                                                                        const isAssigned = isWorkerAssigned(worker.id);
                                                                        const isSelected = selectedWorkers.includes(worker.id);

                                                                        return (
                                                                            <motion.label
                                                                                key={worker.id}
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all relative overflow-hidden ${isSelected
                                                                                    ? 'bg-gradient-to-r from-[#2C5AA0]/10 to-blue-100 border-2 border-[#2C5AA0] shadow-md'
                                                                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                                                    }`}
                                                                            >
                                                                                {isAssigned && (
                                                                                    <div className="absolute top-2 right-2">
                                                                                        <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
                                                                                            <FaCheck className="text-xs" />
                                                                                            Назначен
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                                <div className="relative">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={isSelected}
                                                                                        onChange={() => handleWorkerSelect(worker.id)}
                                                                                        className="w-6 h-6 rounded-lg border-2 border-gray-300 text-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0] focus:ring-offset-2 cursor-pointer transition-all"
                                                                                    />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className="font-semibold text-[#1E1E1E] text-base">
                                                                                        {worker.last_name} {worker.first_name}
                                                                                    </p>
                                                                                    <p className="text-sm text-[#1E1E1E]/60 mt-1">{worker.email}</p>
                                                                                    <p className="text-sm text-[#1E1E1E]/60">+{worker.phone_number}</p>
                                                                                </div>
                                                                                {isSelected && (
                                                                                    <motion.div
                                                                                        initial={{ scale: 0 }}
                                                                                        animate={{ scale: 1 }}
                                                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                                                    >
                                                                                        <FaCheck className="text-[#2C5AA0] text-xl" />
                                                                                    </motion.div>
                                                                                )}
                                                                            </motion.label>
                                                                        );
                                                                    })
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 bg-white">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-sm text-[#1E1E1E]/60">
                                        Выбрано исполнителей: <span className="font-bold text-[#2C5AA0] text-lg">{selectedWorkers.length}</span>
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-300 text-[#1E1E1E] rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleAssignWorkers}
                                        disabled={selectedWorkers.length === 0}
                                        className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${selectedWorkers.length === 0
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#2C5AA0] to-[#1e4073] text-white hover:shadow-lg hover:scale-[1.02]'
                                            }`}
                                    >
                                        <FaPlus />
                                        Назначить ({selectedWorkers.length})
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* STATUS UPDATE MODAL */}
            <AnimatePresence>
                {isStatusModalOpen && statusObject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
                        onClick={closeStatusModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#2C5AA0] to-[#1e4073]">
                                <div className="flex justify-between items-start">
                                    <div className="text-white">
                                        <h2 className="text-xl font-bold mb-1">Изменение статуса</h2>
                                        <p className="text-blue-100 text-sm">{statusObject.name}</p>
                                    </div>
                                    <button
                                        onClick={closeStatusModal}
                                        className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
                                    >
                                        <IoMdClose className="text-xl text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <label className="block text-sm font-medium text-[#1E1E1E] mb-3">
                                    Выберите новый статус
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'active', label: 'Активный', color: 'bg-[#2C5AA0] text-white' },
                                        { value: 'pending', label: 'В ожидании', color: 'bg-amber-100 text-amber-700 border border-amber-200' },
                                        { value: 'completed', label: 'Завершен', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
                                        { value: 'on_hold', label: 'Приостановлен', color: 'bg-orange-100 text-orange-700 border border-orange-200' },
                                        { value: 'cancelled', label: 'Отменен', color: 'bg-red-100 text-red-700 border border-red-200' }
                                    ].map((status) => (
                                        <label
                                            key={status.value}
                                            className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedStatus === status.value
                                                ? `${status.color} shadow-md`
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status.value}
                                                checked={selectedStatus === status.value}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                className="w-5 h-5 text-[#2C5AA0] focus:ring-[#2C5AA0]"
                                            />
                                            <span className="font-medium text-[#1E1E1E]">{status.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
                                <button
                                    onClick={closeStatusModal}
                                    className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-[#1E1E1E] rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2C5AA0] to-[#1e4073] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <MdEdit />
                                    Обновить
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}