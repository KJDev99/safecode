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

export default function ManagerBills() {
    const { data, loading, error, getDataToken, postDataToken, putDataToken, deleteDataToken } = useApiStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [userObjects, setUserObjects] = useState([]);
    const [formData, setFormData] = useState({
        object_id: '',
        comment: '',
        price: '',
        status: 'pending'
    });

    const bills = Array.isArray(data?.data) ? data.data : [];

    useEffect(() => {
        getDataToken("/documents/bills/");
        loadUserObjects();
    }, []);

    const loadUserObjects = async () => {
        try {
            const res = await getDataToken("/user_objects/");
            if (res?.data) {
                setUserObjects(Array.isArray(res.data) ? res.data : []);
            }
        } catch (err) {
            console.error("Obyektlarni yuklashda xatolik:", err);
        }
    };

    const handleCreateBill = async () => {
        const payload = {
            object_id: parseInt(formData.object_id),
            comment: formData.comment,
            price: formData.price,
            status: formData.status
        };

        const response = await postDataToken('/documents/bills/', payload);

        if (response?.success) {
            toast.success('Счет успешно создан');
            setShowCreateModal(false);
            resetFormData();
            getDataToken("/documents/bills/");
        } else {
            toast.error(response?.message || 'Ошибка при создании счета');
        }
    };

    const handleEditBill = async () => {
        if (!selectedBill) return;

        const payload = {
            object_id: parseInt(formData.object_id),
            comment: formData.comment,
            price: formData.price,
            status: formData.status
        };

        const response = await putDataToken(`/documents/bills/${selectedBill.id}/`, payload);

        if (response?.success) {
            toast.success('Счет успешно обновлен');
            setShowEditModal(false);
            setSelectedBill(null);
            resetFormData();
            getDataToken("/documents/bills/");
        } else {
            toast.error(response?.message || 'Ошибка при обновлении счета');
        }
    };

    const handleDeleteBill = async (billId) => {
        if (!confirm('Вы уверены, что хотите удалить этот счет?')) return;

        const response = await deleteDataToken(`/documents/bills/${billId}/`);

        if (response?.success) {
            toast.success('Счет успешно удален');
            getDataToken("/documents/bills/");
        } else {
            toast.error(response?.message || 'Ошибка при удалении счета');
        }
    };

    const resetFormData = () => {
        setFormData({
            object_id: '',
            comment: '',
            price: '',
            status: 'pending'
        });
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetFormData();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedBill(null);
        resetFormData();
    };

    const openEditModal = (bill) => {
        setSelectedBill(bill);
        setFormData({
            object_id: bill.object_id?.toString() || '',
            comment: bill.comment || '',
            price: bill.price || '',
            status: bill.status || 'pending'
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
        const obj = userObjects.find(o => o.id === objectId);
        return obj ? obj.name : 'Неизвестный объект';
    };

    const getObjectAddress = (objectId) => {
        const obj = userObjects.find(o => o.id === objectId);
        return obj ? obj.address : '';
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Проверить данные';
            case 'verified':
                return 'Проверено';
            case 'paid':
                return 'Оплачено';
            default:
                return 'Проверить данные';
        }
    };

    if (loading && bills.length === 0) {
        return <Loader />;
    }

    return (
        <div>
            {/* Modal - Yangi schyot yaratish */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Создать счет"} size={"text-lg"} />
                            <button onClick={handleCloseCreateModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Объект</label>
                                <select
                                    name="object_id"
                                    value={formData.object_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите объект</option>
                                    {userObjects.map(obj => (
                                        <option key={obj.id} value={obj.id}>
                                            {obj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Описание</label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Сумма (₽)</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="17 700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Статус</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="pending">Проверить данные</option>
                                    <option value="verified">Проверено</option>
                                    <option value="paid">Оплачено</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 h-[45px]"
                                    text="Создать"
                                    onClick={handleCreateBill}
                                    disabled={loading || !formData.object_id || !formData.comment || !formData.price}
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

            {/* Modal - Schyotni tahrirlash */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Редактировать счет"} size={"text-lg"} />
                            <button onClick={handleCloseEditModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Объект</label>
                                <select
                                    name="object_id"
                                    value={formData.object_id}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Выберите объект</option>
                                    {userObjects.map(obj => (
                                        <option key={obj.id} value={obj.id}>
                                            {obj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Описание</label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows="4"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Сумма (₽)</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="17 700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Статус</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="pending">Проверить данные</option>
                                    <option value="verified">Проверено</option>
                                    <option value="paid">Оплачено</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    className="flex-1 h-[45px]"
                                    text="Сохранить"
                                    onClick={handleEditBill}
                                    disabled={loading || !formData.object_id || !formData.comment || !formData.price}
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
                    <Title text={"Счета"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Формирование и отправка счетов заказчикам</p>
                </div>
                <Button
                    className="h-[54px] w-[250px] gap-2.5"
                    icon={<FaPlus />}
                    text={"Создать счет"}
                    onClick={() => setShowCreateModal(true)}
                />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {bills.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Счета не найдены</p>
                        <p className="text-gray-400 mt-2">Создайте свой первый счет</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-[#1E1E1E80] text-[#1E1E1E99] text-lg">
                                <th className="p-3 text-left font-normal">
                                    <input id="head-check-all" type="checkbox" />
                                </th>
                                <th className="p-3 text-left font-normal">Объект</th>
                                <th className="p-3 text-left font-normal">Описание</th>
                                <th className="p-3 text-left font-normal">Сумма</th>
                                <th className="p-3 text-left font-normal">Статус</th>
                                <th className="p-3 text-left font-normal">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill) => (
                                <tr key={bill.id} className="border-b border-gray-100">
                                    <td className="p-3">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="p-3">
                                        <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                            {getObjectName(bill.object_id)}
                                        </p>
                                        <p className="text-sm text-[#1E1E1E99]">
                                            {getObjectAddress(bill.object_id)}
                                        </p>
                                    </td>
                                    <td className="p-3 text-[#1E1E1E99] max-w-[190px]">
                                        {bill.comment}
                                    </td>
                                    <td className="p-3 text-[#1E1E1E] text-base">
                                        {bill.price} ₽
                                    </td>
                                    <td className="p-3 text-[#1E1E1E] text-base">
                                        {getStatusText(bill.status)}
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
                                                onClick={() => openEditModal(bill)}
                                                title="Редактировать"
                                            >
                                                <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                            </button>
                                            <button
                                                className="w-6 h-6 bg-[#E87D7D] rounded-sm flex items-center justify-center"
                                                onClick={() => handleDeleteBill(bill.id)}
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