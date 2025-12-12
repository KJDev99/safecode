'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { LiaDownloadSolid } from 'react-icons/lia';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { useApiStore } from '@/store/useApiStore';

export default function AdminStorage() {
    const { data, loading, error, getDataToken, postDataToken, putDataToken, deleteDataToken } = useApiStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedStorage, setSelectedStorage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        date: ''
    });

    const storages = Array.isArray(data?.data) ? data.data : [];

    useEffect(() => {
        getDataToken("/accounts/storage/");
    }, []);

    const handleCreateStorage = async () => {
        const payload = {
            name: formData.name,
            date: formData.date
        };

        const response = await postDataToken('/accounts/storage/', payload);

        if (response?.success) {
            toast.success('Хранилище успешно создано');
            setShowCreateModal(false);
            resetFormData();
            getDataToken("/accounts/storage/");
        } else {
            toast.error(response?.message || 'Ошибка при создании хранилища');
        }
    };

    const handleEditStorage = async () => {
        if (!selectedStorage) return;

        const payload = {
            name: formData.name,
            date: formData.date
        };

        const response = await putDataToken(`/accounts/storage/${selectedStorage.id}/`, payload);

        if (response?.success) {
            toast.success('Хранилище успешно обновлено');
            setShowEditModal(false);
            setSelectedStorage(null);
            resetFormData();
            getDataToken("/accounts/storage/");
        } else {
            toast.error(response?.message || 'Ошибка при обновлении хранилища');
        }
    };

    const handleDeleteStorage = async (storageId) => {
        if (!confirm('Вы уверены, что хотите удалить это хранилище?')) return;

        const response = await deleteDataToken(`/accounts/storage/${storageId}/`);

        if (response?.success) {
            toast.success('Хранилище успешно удалено');
            getDataToken("/accounts/storage/");
        } else {
            toast.error(response?.message || 'Ошибка при удалении хранилища');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            date: ''
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetFormData();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedStorage(null);
        resetFormData();
    };

    const openEditModal = (storage) => {
        setSelectedStorage(storage);
        setFormData({
            name: storage.name || '',
            date: storage.date || ''
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        return `${day}.${month}.${year}`;
    };

    const getStatusText = (storage) => {
        // Files array mavjud va bo'sh emasligini tekshirish
        if (storage.files && storage.files.length > 0) {
            return 'Подписан';
        }
        return 'Не подписан';
    };

    if (loading && storages.length === 0) {
        return <Loader />;
    }

    return (
        <div>
            {/* Modal - Yangi storage yaratish */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Создать договор"} size={"text-lg"} />
                            <button onClick={handleCloseCreateModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Акт проверки системы пожарной автоматики"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Дата</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 h-[45px]"
                                    text="Создать"
                                    onClick={handleCreateStorage}
                                    disabled={loading || !formData.name || !formData.date}
                                />
                                <Button
                                    className="flex-1 h-[45px] bg-gray-500"
                                    text="Отмена"
                                    onClick={handleCloseCreateModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal - Storage tahrirlash */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Редактировать хранилище"} size={"text-lg"} />
                            <button onClick={handleCloseEditModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Акт проверки системы пожарной автоматики"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Дата</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 h-[45px]"
                                    text="Сохранить"
                                    onClick={handleEditStorage}
                                    disabled={loading || !formData.name || !formData.date}
                                />
                                <Button
                                    className="flex-1 h-[45px] bg-gray-500"
                                    text="Отмена"
                                    onClick={handleCloseEditModal}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={"Хранилище"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Здесь вы найдете журналы и акты по вашим объектам</p>
                </div>
                <Button
                    className="h-[54px] w-[200px] gap-2.5"
                    icon={<FaPlus />}
                    text={"Создать договор"}
                    onClick={() => setShowCreateModal(true)}
                />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {storages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Хранилище пусто</p>
                        <p className="text-gray-400 mt-2">Создайте свой первый документ</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#1E1E1E80] text-[#1E1E1E99] text-lg">
                                <th className="p-3 text-left font-normal">
                                    <input id="head-check-all" type="checkbox" />
                                </th>
                                <th className="p-3 text-left font-normal">Название</th>
                                <th className="p-3 text-left font-normal">Дата</th>
                                <th className="p-3 text-left font-normal">Состояние</th>
                                <th className="p-3 text-left font-normal">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {storages.map((storage) => (
                                <tr key={storage.id} className="border-b border-gray-100">
                                    <td className="p-3">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="p-3">
                                        <p className="text-sm text-[#1E1E1E99]">
                                            {storage.name}
                                        </p>
                                    </td>
                                    <td className="p-3 text-[#1E1E1E] text-base">
                                        {formatDate(storage.date)}
                                    </td>
                                    <td className="p-3 text-[#1E1E1E] text-base">
                                        {getStatusText(storage)}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-x-1 items-center justify-center">
                                            <button
                                                className="w-6 h-6 bg-[#2C5AA0] rounded-sm flex items-center justify-center"
                                                title="Скачать"
                                            >
                                                <LiaDownloadSolid className="text-sm text-[#fff]" />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-[#C5C5C5]/50 rounded-sm flex items-center justify-center"
                                                onClick={() => openEditModal(storage)}
                                                title="Редактировать"
                                            >
                                                <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-[#E87D7D] rounded-sm flex items-center justify-center"
                                                onClick={() => handleDeleteStorage(storage.id)}
                                                title="Удалить"
                                            >
                                                <IoMdClose className="text-sm text-[#fff]" />
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