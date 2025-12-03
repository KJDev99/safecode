import React, { useState, useEffect } from "react";
import { FaPlus, FaCheck, FaUsers } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
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
    const [selectedWorkers, setSelectedWorkers] = useState([]);
    const [expandedRoles, setExpandedRoles] = useState({});
    const [statusObject, setStatusObject] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    // Obyektlarni yuklash
    useEffect(() => {
        loadObjects();
    }, []);

    const loadObjects = async () => {
        await getDataToken("/user_objects/all/");
    };

    // Workerlarni yuklash
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

        // Avvalgi tayinlangan workerlarni olish
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

        // Agar tayinlangan workerlar bo'lsa, ularning rolelarini ochish
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

    const getStatusInfo = (status) => {
        const statusMap = {
            'active': { label: 'Активный', color: 'bg-green-100 text-green-700 border-green-200' },
            'pending': { label: 'В ожидании', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
            'completed': { label: 'Завершен', color: 'bg-blue-100 text-blue-700 border-blue-200' },
            'on_hold': { label: 'Приостановлен', color: 'bg-orange-100 text-orange-700 border-orange-200' },
            'cancelled': { label: 'Отменен', color: 'bg-red-100 text-red-700 border-red-200' }
        };
        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
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

    if (loading && !isModalOpen && !isStatusModalOpen) return <Loader />;
    if (error && !objects.length) return <div className="text-center py-8 text-red-500">Произошла ошибка: {error}</div>;

    return (
        <div>
            <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                <div className="flex flex-col">
                    <Title text={"Управление объектами"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6">Назначение исполнителей на объекты</p>
                </div>
            </div>

            {/* CARDS */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {objects.map((object) => {
                    const statusInfo = getStatusInfo(object.status);
                    return (
                        <motion.div
                            key={object.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[#1E1E1E] mb-1 line-clamp-1">{object.name}</h3>

                                </div>
                                <button
                                    onClick={() => openStatusModal(object)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all hover:scale-105 ${statusInfo.color}`}
                                >
                                    {statusInfo.label}
                                </button>
                            </div>
                            <p className="text-sm text-[#1E1E1E99] flex items-center gap-1  mb-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="line-clamp-1">

                                    {object.address}
                                </span>
                            </p>
                            <div className="space-y-2.5 mb-5">
                                <div className="flex justify-between text-sm items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-[#1E1E1E99]">Клиент:</span>
                                    <span className="text-[#2C5AA0] font-medium">
                                        {object.user?.first_name} {object.user?.last_name}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-[#1E1E1E99]">Площадь:</span>
                                    <span className="text-[#1E1E1E] font-medium">{object.size} м²</span>
                                </div>
                                <div className="flex justify-between text-sm items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-[#1E1E1E99]">Систем:</span>
                                    <span className="text-[#1E1E1E] font-medium">{object.number_of_fire_extinguishing_systems}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center p-2 bg-gray-50 rounded-lg">
                                    <span className="text-[#1E1E1E99]">Создан:</span>
                                    <span className="text-[#1E1E1E] font-medium">{formatDate(object.created_at)}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                                    <span className="text-[#2C5AA0] flex items-center gap-1.5">
                                        <FaUsers />
                                        Исполнители:
                                    </span>
                                    <span className="text-[#2C5AA0] font-bold text-base">{getAssignedWorkerCount(object)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => openModal(object)}
                                className="w-full h-[46px] gap-2 text-sm shadow-sm hover:shadow-md transition-shadow"
                                icon={<FaPlus />}
                                text={"Назначить исполнителя"}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {objects.length === 0 && !loading && (
                <div className="text-center py-16 text-[#1E1E1E99]">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg">Объекты не найдены</p>
                </div>
            )}

            {/* ASSIGN WORKERS MODAL */}
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
                                    <div className="text-center py-12 text-[#1E1E1E99]">
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
                                                            {workerList?.length}
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
                                                                    <p className="text-sm text-[#1E1E1E99] text-center py-4">
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
                                                                                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-[#2C5AA0] shadow-md'
                                                                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                                                                    }`}
                                                                            >
                                                                                {isAssigned && (
                                                                                    <div className="absolute top-2 right-2">
                                                                                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium flex items-center gap-1">
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
                                                                                    <p className="text-sm text-[#1E1E1E99] mt-1">{worker.email}</p>
                                                                                    <p className="text-sm text-[#1E1E1E99]">+{worker.phone_number}</p>
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
                                    <p className="text-sm text-[#1E1E1E99]">
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
                            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
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
                                        { value: 'completed', label: 'Завершен', color: 'border-blue-500 bg-blue-50 hover:bg-blue-100' },
                                        { value: 'on_hold', label: 'Приостановлен', color: 'border-orange-500 bg-orange-50 hover:bg-orange-100' },
                                        { value: 'cancelled', label: 'Отменен', color: 'border-red-500 bg-red-50 hover:bg-red-100' }
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
    )
};