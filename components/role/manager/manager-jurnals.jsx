'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { LiaDownloadSolid } from 'react-icons/lia';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { useApiStore } from '@/store/useApiStore';

export default function ManagerJurnalsv() {
    const { loading, data, getDataToken, postDataToken, putDataToken, deleteDataToken } = useApiStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentToDelete, setDocumentToDelete] = useState(null);
    const [userObjects, setUserObjects] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [formData, setFormData] = useState({
        type: '',
        object_id: '',
        date: ''
    });

    useEffect(() => {
        const loadAllData = async () => {
            // User objects yuklash
            const userObjectsData = await getDataToken("/user_objects/");
            console.log('User objects data:', userObjectsData);

            if (userObjectsData && Array.isArray(userObjectsData)) {
                setUserObjects(userObjectsData);
            } else if (userObjectsData?.data && Array.isArray(userObjectsData.data)) {
                setUserObjects(userObjectsData.data);
            } else if (userObjectsData?.success && Array.isArray(userObjectsData.data)) {
                setUserObjects(userObjectsData.data);
            }

            // Documents yuklash
            const documentsData = await getDataToken("/documents/journals-and-acts/");
            console.log('Documents data:', documentsData);

            if (documentsData && Array.isArray(documentsData)) {
                setDocuments(documentsData);
            } else if (documentsData?.data && Array.isArray(documentsData.data)) {
                setDocuments(documentsData.data);
            } else if (documentsData?.success && Array.isArray(documentsData.data)) {
                setDocuments(documentsData.data);
            }
        };

        loadAllData();
    }, []);

    const handleCreateDocument = async () => {
        if (!formData.type || !formData.object_id || !formData.date) {
            toast.error('Заполните все поля');
            return;
        }

        const loadingToast = toast.loading('Создание документа...');

        const payload = {
            object_id: parseInt(formData.object_id),
            type: formData.type,
            date: formData.date
        };

        console.log('Creating document with payload:', payload);

        const response = await postDataToken('/documents/journals-and-acts/', payload);

        console.log('Create response:', response);

        toast.dismiss(loadingToast);

        if (response && !response.error && (response.success || response.id || response.data)) {
            toast.success('Документ успешно создан');
            setShowCreateModal(false);
            resetFormData();
            await loadDocuments();
        } else {
            toast.error(response?.message || response?.error || 'Ошибка при создании документа');
        }
    };

    const handleEditDocument = async () => {
        if (!selectedDocument) return;
        if (!formData.type || !formData.object_id || !formData.date) {
            toast.error('Заполните все поля');
            return;
        }

        const loadingToast = toast.loading('Обновление документа...');

        const payload = {
            object_id: parseInt(formData.object_id),
            type: formData.type,
            date: formData.date
        };

        console.log('Updating document with payload:', payload);

        const response = await putDataToken(`/documents/journals-and-acts/${selectedDocument.id}/`, payload);

        console.log('Update response:', response);

        toast.dismiss(loadingToast);

        if (response && !response.error && (response.success || response.id || response.data)) {
            toast.success('Документ успешно обновлен');
            setShowEditModal(false);
            setSelectedDocument(null);
            resetFormData();
            await loadDocuments();
        } else {
            toast.error(response?.message || response?.error || 'Ошибка при обновлении документа');
        }
    };

    const confirmDeleteDocument = (doc) => {
        setDocumentToDelete(doc);
        setShowDeleteModal(true);
    };

    const handleDeleteDocument = async () => {
        if (!documentToDelete) return;

        const loadingToast = toast.loading('Удаление документа...');

        const response = await deleteDataToken(`/documents/journals-and-acts/${documentToDelete.id}/`);

        console.log('Delete response:', response);

        toast.dismiss(loadingToast);

        if (response && !response.error) {
            toast.success('Документ успешно удален');
            setShowDeleteModal(false);
            setDocumentToDelete(null);
            await loadDocuments();
        } else {
            toast.error(response?.message || response?.error || 'Ошибка при удалении документа');
        }
    };

    const resetFormData = () => {
        setFormData({
            type: '',
            object_id: '',
            date: ''
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetFormData();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedDocument(null);
        resetFormData();
    };

    const openEditModal = (document) => {
        console.log('Opening edit modal for document:', document);
        setSelectedDocument(document);
        setFormData({
            type: document.type || '',
            object_id: document.object_id?.toString() || document.object?.id?.toString() || '',
            date: document.date || ''
        });
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getObjectName = (objectId) => {
        if (!objectId) return 'Неизвестный объект';
        const obj = userObjects.find(o => o.id === objectId);
        return obj ? obj.name : 'Неизвестный объект';
    };

    const getObjectAddress = (objectId) => {
        if (!objectId) return '';
        const obj = userObjects.find(o => o.id === objectId);
        return obj ? obj.address : '';
    };

    const getTypeText = (type) => {
        const types = {
            'estimate': 'Смета',
            'act': 'Акт',
            'form': 'Форма',
            'journal': 'Журнал'
        };
        return types[type] || type;
    };

    const getStatusInfo = (status) => {
        const statuses = {
            'pending': { text: 'Проверить данные', color: 'text-yellow-600 bg-yellow-50' },
            'verified': { text: 'Проверено', color: 'text-green-600 bg-green-50' },
            'completed': { text: 'Завершено', color: 'text-blue-600 bg-blue-50' }
        };
        return statuses[status] || { text: 'Проверить данные', color: 'text-gray-600 bg-gray-50' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}.${month}.${year}`;
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            {/* Modal - Создание документа */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={handleCloseCreateModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Title text={"Создать документ"} size={"text-xl font-bold"} />
                                <button
                                    onClick={handleCloseCreateModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Тип документа</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите тип</option>
                                        <option value="estimate">Смета</option>
                                        <option value="act">Акт</option>
                                        <option value="form">Форма</option>
                                        <option value="journal">Журнал</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                        Объект {userObjects.length > 0 && `(${userObjects.length} доступно)`}
                                    </label>
                                    <select
                                        name="object_id"
                                        value={formData.object_id}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите объект</option>
                                        {userObjects.map(obj => (
                                            <option key={obj.id} value={obj.id}>
                                                {obj.name || 'Без названия'} - {obj.address || 'Без адреса'}
                                            </option>
                                        ))}
                                    </select>
                                    {userObjects.length === 0 && (
                                        <p className="text-sm text-red-500 mt-1">Объекты не найдены</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Дата</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Создать"
                                        onClick={handleCreateDocument}
                                        disabled={loading || !formData.type || !formData.object_id || !formData.date}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={handleCloseCreateModal}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal - Редактирование документа */}
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={handleCloseEditModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Title text={"Редактировать документ"} size={"text-xl font-bold"} />
                                <button
                                    onClick={handleCloseEditModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Тип документа</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите тип</option>
                                        <option value="estimate">Смета</option>
                                        <option value="act">Акт</option>
                                        <option value="form">Форма</option>
                                        <option value="journal">Журнал</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Объект</label>
                                    <select
                                        name="object_id"
                                        value={formData.object_id}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите объект</option>
                                        {userObjects.map(obj => (
                                            <option key={obj.id} value={obj.id}>
                                                {obj.name || 'Без названия'} - {obj.address || 'Без адреса'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Дата</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Сохранить"
                                        onClick={handleEditDocument}
                                        disabled={loading || !formData.type || !formData.object_id || !formData.date}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={handleCloseEditModal}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal - Подтверждение удаления */}
            <AnimatePresence>
                {showDeleteModal && documentToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IoMdClose className="text-3xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">Удалить документ?</h3>
                                <p className="text-[#1E1E1E]/60 mb-6">
                                    Вы уверены, что хотите удалить документ <span className="font-semibold">"{getTypeText(documentToDelete.type)}"</span>?
                                    <br />Это действие нельзя отменить.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={() => setShowDeleteModal(false)}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-red-500 hover:bg-red-600"
                                        text="Удалить"
                                        onClick={handleDeleteDocument}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between md:items-center max-md:flex-col max-md:gap-4">
                <div className="flex flex-col">
                    <Title text={"Журналы и акты"} size={"text-[24px] max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
                        Работа с актами, сметами и другими формами
                        {documents.length > 0 && ` (${documents.length} документов)`}
                    </p>
                </div>
                <Button
                    className="h-[54px] w-[200px] gap-2.5 max-md:w-full"
                    icon={<FaPlus />}
                    text={"Создать документ"}
                    onClick={() => setShowCreateModal(true)}
                />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {documents.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Документы не найдены</p>
                        <p className="text-gray-400 mt-2">Создайте свой первый документ</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 text-[#1E1E1E99] text-base">
                                <th className="p-4 text-left font-semibold">Тип</th>
                                <th className="p-4 text-left font-semibold">Объект</th>
                                <th className="p-4 text-left font-semibold">Дата</th>
                                <th className="p-4 text-left font-semibold">Статус</th>
                                <th className="p-4 text-center font-semibold">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => {
                                const statusInfo = getStatusInfo(doc.status);
                                const objectId = doc.object_id || doc.object?.id;

                                return (
                                    <motion.tr
                                        key={doc.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <span className="inline-block px-3 py-1.5 bg-blue-50 text-[#2C5AA0] rounded-lg font-medium text-sm">
                                                {getTypeText(doc.type)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[#2C5AA0] font-semibold">
                                                {getObjectName(objectId)}
                                            </p>
                                            <p className="text-sm text-[#1E1E1E99] mt-0.5">
                                                {getObjectAddress(objectId)}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-[#1E1E1E] font-medium">
                                                {formatDate(doc.date)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block px-3 py-1.5 rounded-lg font-medium text-sm ${statusInfo.color}`}>
                                                {statusInfo.text}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button
                                                    className="w-9 h-9 bg-[#2C5AA0] rounded-lg flex items-center justify-center hover:bg-[#234a85] transition-colors"
                                                    title="Скачать"
                                                    onClick={() => toast.info('Функция загрузки в разработке')}
                                                >
                                                    <LiaDownloadSolid className="text-lg text-white" />
                                                </button>
                                                <button
                                                    className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                    onClick={() => openEditModal(doc)}
                                                    title="Редактировать"
                                                >
                                                    <FiEdit2 className="text-base text-[#1E1E1E]" />
                                                </button>
                                                <button
                                                    className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    onClick={() => confirmDeleteDocument(doc)}
                                                    title="Удалить"
                                                >
                                                    <IoMdClose className="text-lg text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}