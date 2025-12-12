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

export default function ManagerBills() {
    const { loading, getDataToken, deleteDataToken, postFormDataToken, putFormDataToken } = useApiStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billToDelete, setBillToDelete] = useState(null);
    const [userObjects, setUserObjects] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [bills, setBills] = useState([]);
    const [formData, setFormData] = useState({
        object_id: '',
        comment: '',
        price: ''
    });

    useEffect(() => {
        loadBills();
        loadUserObjects();
    }, []);

    const loadBills = async () => {
        try {
            const response = await getDataToken("/documents/bills/");
            if (response?.data && Array.isArray(response.data)) {
                setBills(response.data);
            } else if (response?.success && Array.isArray(response.data)) {
                setBills(response.data);
            }
        } catch (err) {
            console.error("Bills yuklashda xatolik:", err);
            setBills([]);
        }
    };

    const loadUserObjects = async () => {
        try {
            const res = await getDataToken("/user_objects/");
            if (res?.data) {
                setUserObjects(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Obyektlarni yuklashda xatolik:", err);
            setUserObjects([]);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
    };

    const handleCreateBill = async () => {
        if (!formData.object_id || !formData.comment || !formData.price) {
            toast.error('Заполните все обязательные поля');
            return;
        }

        if (selectedFiles.length === 0) {
            toast.error('Выберите хотя бы один файл');
            return;
        }

        const loadingToast = toast.loading('Создание счета...');

        try {
            const multipartFormData = new FormData();
            multipartFormData.append('object_id', formData.object_id);
            multipartFormData.append('comment', formData.comment);
            multipartFormData.append('price', formData.price);

            selectedFiles.forEach((file) => {
                multipartFormData.append('document_list', file);
            });

            const response = await postFormDataToken('/documents/bills/', multipartFormData);

            toast.dismiss(loadingToast);

            if (response && !response.error && (response.success || response.id || response.data)) {
                toast.success('Счет успешно создан');
                setShowCreateModal(false);
                resetFormData();
                setSelectedFiles([]);
                await loadBills();
            } else {
                toast.error(response?.detail || response?.message || response?.error || 'Ошибка при создании счета');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Create error:', error);
            toast.error('Ошибка при создании счета');
        }
    };

    const handleEditBill = async () => {
        if (!selectedBill) return;

        if (!formData.object_id || !formData.comment || !formData.price) {
            toast.error('Заполните все обязательные поля');
            return;
        }

        const loadingToast = toast.loading('Обновление счета...');

        try {
            const multipartFormData = new FormData();
            multipartFormData.append('object_id', formData.object_id);
            multipartFormData.append('comment', formData.comment);
            multipartFormData.append('price', formData.price);

            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    multipartFormData.append('document_list', file);
                });
            }

            const response = await putFormDataToken(`/documents/bills/${selectedBill.id}/`, multipartFormData);

            toast.dismiss(loadingToast);

            if (response && !response.error && (response.success || response.id || response.data)) {
                toast.success('Счет успешно обновлен');
                setShowEditModal(false);
                setSelectedBill(null);
                resetFormData();
                setSelectedFiles([]);
                await loadBills();
            } else {
                toast.error(response?.detail || response?.message || response?.error || 'Ошибка при обновлении счета');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Update error:', error);
            toast.error('Ошибка при обновлении счета');
        }
    };

    const openDeleteModal = (bill) => {
        setBillToDelete(bill);
        setShowDeleteModal(true);
    };

    const handleDeleteBill = async () => {
        if (!billToDelete) return;

        const loadingToast = toast.loading('Удаление счета...');

        try {
            const response = await deleteDataToken(`/documents/bills/${billToDelete.id}/`);

            toast.dismiss(loadingToast);

            if (response?.success) {
                toast.success('Счет успешно удален');
                await loadBills();
            } else {
                toast.error(response?.message || 'Ошибка при удалении счета');
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error('Delete error:', error);
            toast.error('Ошибка при удалении счета');
        } finally {
            setShowDeleteModal(false);
            setBillToDelete(null);
        }
    };

    const resetFormData = () => {
        setFormData({
            object_id: '',
            comment: '',
            price: ''
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetFormData();
        setSelectedFiles([]);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBill(null);
        resetFormData();
        setSelectedFiles([]);
    };

    const openEditModal = (bill) => {
        setSelectedBill(bill);

        // Obyektni to'g'ri tanlash uchun - object_id ni number ga convert qilish
        const objectId = bill.object_id || bill.object?.id;

        setFormData({
            object_id: objectId ? objectId.toString() : '',
            comment: bill.comment || '',
            price: bill.price || ''
        });
        setSelectedFiles([]);
        setShowEditModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownloadFile = (fileUrl, fileName) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}.${month}.${year}`;
    };

    if (loading && bills.length === 0) {
        return <Loader />;
    }

    return (
        <div>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && billToDelete && (
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
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl"
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <IoMdClose className="text-3xl text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                                    Удалить счет?
                                </h3>
                                <p className="text-[#1E1E1E]/60 mb-6">
                                    Вы уверены, что хотите удалить счет на сумму <span className="font-semibold">
                                        {parseFloat(billToDelete.price).toLocaleString('ru-RU')} ₽
                                    </span>?
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
                                        onClick={handleDeleteBill}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={handleCloseCreateModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Title text={"Создать счет"} size={"text-xl font-bold"} />
                                <button
                                    onClick={handleCloseCreateModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                        Объект * {userObjects.length > 0 && `(${userObjects.length} доступно)`}
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
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Описание *</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        rows="3"
                                        placeholder="Введите описание счета"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Сумма (₽) *</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Например: 12000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                        Файлы * (загрузите документы)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#2C5AA0] transition-colors">
                                        <input
                                            type="file"
                                            id="file-upload-create"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        />
                                        <label
                                            htmlFor="file-upload-create"
                                            className="cursor-pointer block"
                                        >
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-[#2C5AA0] font-medium">Нажмите для загрузки файлов</p>
                                                <p className="text-sm text-gray-500 mt-1">или перетащите файлы сюда</p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
                                            </div>
                                        </label>
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">Выбранные файлы ({selectedFiles.length}):</p>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center">
                                                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                                            <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <IoMdClose />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Создать"
                                        onClick={handleCreateBill}
                                        disabled={loading || !formData.object_id || !formData.comment || !formData.price || selectedFiles.length === 0}
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

            {/* Edit Modal */}
            <AnimatePresence>
                {showEditModal && selectedBill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={handleCloseEditModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <Title text={"Редактировать счет"} size={"text-xl font-bold"} />
                                <button
                                    onClick={handleCloseEditModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Объект *</label>
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
                                    {!formData.object_id && (
                                        <p className="text-sm text-red-500 mt-1">Пожалуйста, выберите объект</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Описание *</label>
                                    <textarea
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        rows="3"
                                        placeholder="Введите описание счета"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Сумма (₽) *</label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Например: 12000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                        Файлы (новые файлы для замены)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-[#2C5AA0] transition-colors">
                                        <input
                                            type="file"
                                            id="file-upload-edit"
                                            multiple
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                                        />
                                        <label
                                            htmlFor="file-upload-edit"
                                            className="cursor-pointer block"
                                        >
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-[#2C5AA0] font-medium">Нажмите для загрузки файлов</p>
                                                <p className="text-sm text-gray-500 mt-1">Выберите новые файлы (необязательно)</p>
                                            </div>
                                        </label>
                                    </div>

                                    {selectedFiles.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">Новые файлы ({selectedFiles.length}):</p>
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {selectedFiles.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                                        <div className="flex items-center">
                                                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFile(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <IoMdClose />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {selectedBill?.document_list && selectedBill.document_list.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm font-medium mb-2">Текущие файлы:</p>
                                            <div className="space-y-2">
                                                {selectedBill.document_list.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                                        <div className="flex items-center">
                                                            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="text-sm truncate max-w-xs">
                                                                {file.document.split('/').pop()}
                                                            </span>
                                                        </div>
                                                        <a
                                                            href={file.document}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                                        >
                                                            Просмотреть
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Сохранить"
                                        onClick={handleEditBill}
                                        disabled={loading || !formData.object_id || !formData.comment || !formData.price}
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

            {/* Header */}
            <div className="flex justify-between md:items-center max-md:flex-col max-md:gap-4">
                <div className="flex flex-col">
                    <Title text={"Счета"} size={"text-[24px] max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
                        Формирование и отправка счетов заказчикам
                        {bills.length > 0 && ` (${bills.length} счетов)`}
                    </p>
                </div>
                <Button
                    className="h-[54px] w-[250px] gap-2.5 max-md:w-full"
                    icon={<FaPlus />}
                    text={"Создать счет"}
                    onClick={() => setShowCreateModal(true)}
                />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {bills.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Счета не найдены</p>
                        <p className="text-gray-400 mt-2">Создайте свой первый счет</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 text-[#1E1E1E99] text-base">
                                <th className="p-4 text-left font-semibold">Объект</th>
                                <th className="p-4 text-left font-semibold">Описание</th>
                                <th className="p-4 text-left font-semibold">Сумма</th>
                                <th className="p-4 text-left font-semibold">Файлы</th>
                                <th className="p-4 text-center font-semibold">Дата создания</th>
                                <th className="p-4 text-center font-semibold">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-4">
                                        <p className="text-[#2C5AA0] font-semibold">
                                            {bill.object?.name || 'Неизвестный объект'}
                                        </p>
                                        <p className="text-sm text-[#1E1E1E99] mt-0.5">
                                            {bill.object?.address || ''}
                                        </p>
                                    </td>
                                    <td className="p-4 max-w-[250px]">
                                        <p className="text-[#1E1E1E] font-medium line-clamp-2">
                                            {bill.comment}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[#1E1E1E] font-bold text-nowrap">
                                            {parseFloat(bill.price).toLocaleString('ru-RU')} ₽
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {bill.document_list && bill.document_list.length > 0 ? (
                                                bill.document_list.map((file, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDownloadFile(file.document, file.document.split('/').pop())}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-[#1E1E1E] transition-colors"
                                                        title={file.document.split('/').pop()}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span className="truncate max-w-xs">Файл {index + 1}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-sm">Нет файлов</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-[#1E1E1E99] text-sm">
                                            {formatDate(bill.created_at)}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center justify-center">
                                            <button
                                                className="w-9 h-9 bg-[#2C5AA0] rounded-lg flex items-center justify-center hover:bg-[#234a85] transition-colors"
                                                title="Скачать все файлы"
                                                onClick={() => {
                                                    if (bill.document_list && bill.document_list.length > 0) {
                                                        bill.document_list.forEach((file, index) => {
                                                            handleDownloadFile(file.document, `file_${index + 1}.pdf`);
                                                        });
                                                    } else {
                                                        toast.error('Нет файлов для скачивания');
                                                    }
                                                }}
                                            >
                                                <LiaDownloadSolid className="text-lg text-white" />
                                            </button>
                                            <button
                                                className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                onClick={() => openEditModal(bill)}
                                                title="Редактировать"
                                            >
                                                <FiEdit2 className="text-base text-[#1E1E1E]" />
                                            </button>
                                            <button
                                                className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                                                onClick={() => openDeleteModal(bill)}
                                                title="Удалить"
                                            >
                                                <IoMdClose className="text-lg text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}