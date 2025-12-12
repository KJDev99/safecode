'use client';
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import { useApiStore } from "@/store/useApiStore";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Users() {
    const { data, loading, error, getDataToken, postDataToken, putDataToken, deleteDataToken } = useApiStore();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        groups: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Users olish
            const usersRes = await getDataToken("/accounts/users/");
            if (usersRes?.data && Array.isArray(usersRes.data)) {
                setUsers(usersRes.data.map(user => ({ ...user, _checked: false })));
            }

            // Rollarni olish (registr page'dagi kabi)
            const rolesRes = await getDataToken("/accounts/roles/");
            if (rolesRes?.data && Array.isArray(rolesRes.data)) {
                setRoles(rolesRes.data);
            }
        } catch (err) {
            console.error("Data yuklashda xatolik:", err);
            toast.error("Ma'lumotlarni yuklashda xatolik");
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone_number: user.phone_number || "",
            password: "", // Yangi parol uchun bo'sh qoldiramiz
            groups: user.groups?.map(g => g.id) || []
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setSelectedUser(null);
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            groups: []
        });
        setIsCreateModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            groups: []
        });
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        const roleId = parseInt(e.target.value);
        setFormData(prev => ({
            ...prev,
            groups: [roleId] // Faqat bitta role tanlash mumkin
        }));
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        setUsers(users.map(user => ({ ...user, _checked: checked })));
    };

    const handleUserCheck = (e, userId) => {
        const checked = e.target.checked;

        const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, _checked: checked } : user
        );

        setUsers(updatedUsers);

        const allChecked = updatedUsers.every(user => user._checked);
        setSelectAll(allChecked);
    };

    const handleCreateUser = async () => {
        // Validatsiya
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || !formData.password || formData.groups.length === 0) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        if (formData.password.length < 8) {
            toast.error("Пароль должен содержать минимум 8 символов");
            return;
        }

        const loadingToast = toast.loading("Создание пользователя...");

        try {
            const response = await postDataToken("/accounts/users/create/", formData);

            toast.dismiss(loadingToast);

            if (response?.success) {
                toast.success("Пользователь успешно создан");
                closeCreateModal();
                await loadData(); // Yangilash
            } else {
                const errorMessage = response?.response?.data?.detail ||
                    response?.response?.data?.message ||
                    response?.error ||
                    "Ошибка при создании пользователя";
                toast.error(errorMessage);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error("Create user error:", err);
            toast.error("Ошибка при создании пользователя");
        }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        // Validatsiya
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || formData.groups.length === 0) {
            toast.error("Пожалуйста, заполните все обязательные поля");
            return;
        }

        const loadingToast = toast.loading("Обновление пользователя...");

        try {
            // Parol o'zgartirilmagan bo'lsa, uni o'chirib tashlaymiz
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await putDataToken(`/accounts/users/${selectedUser.id}/update/`, updateData);

            toast.dismiss(loadingToast);

            if (response?.success) {
                toast.success("Пользователь успешно обновлен");
                closeModal();
                await loadData(); // Yangilash
            } else {
                const errorMessage = response?.response?.data?.detail ||
                    response?.response?.data?.message ||
                    response?.error ||
                    "Ошибка при обновлении пользователя";
                toast.error(errorMessage);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error("Update user error:", err);
            toast.error("Ошибка при обновлении пользователя");
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        const loadingToast = toast.loading("Удаление пользователя...");

        try {
            const response = await deleteDataToken(`/accounts/users/${userToDelete.id}/delete/`);

            toast.dismiss(loadingToast);

            if (response?.success) {
                toast.success("Пользователь успешно удален");
                closeDeleteModal();
                await loadData(); // Yangilash
            } else {
                const errorMessage = response?.response?.data?.detail ||
                    response?.response?.data?.message ||
                    response?.error ||
                    "Ошибка при удалении пользователя";
                toast.error(errorMessage);
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error("Delete user error:", err);
            toast.error("Ошибка при удалении пользователя");
        }
    };

    const formatDate = (iso) => {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = String(d.getFullYear()).slice(2);
            return `${day}.${month}.${year}`;
        } catch {
            return iso;
        }
    };

    if (loading && users.length === 0) return <Loader />;

    return (
        <div>
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && userToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={closeDeleteModal}
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
                                <h3 className="text-xl font-bold text-[#1E1E1E] mb-2">
                                    Удалить пользователя?
                                </h3>
                                <p className="text-[#1E1E1E]/60 mb-6">
                                    Вы уверены, что хотите удалить пользователя <span className="font-semibold">
                                        {userToDelete.last_name} {userToDelete.first_name}
                                    </span>?
                                    <br />Это действие нельзя отменить.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={closeDeleteModal}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-red-500 hover:bg-red-600"
                                        text="Удалить"
                                        onClick={handleDeleteUser}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create User Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={closeCreateModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Создание нового пользователя</h2>
                                <button
                                    onClick={closeCreateModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Имя *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите имя"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Фамилия *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите фамилию"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Номер телефона *</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите номер телефона"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Пароль * (минимум 8 символов)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите пароль"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Роль *</label>
                                    <select
                                        value={formData.groups[0] || ""}
                                        onChange={handleRoleChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите роль</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Создать"
                                        onClick={handleCreateUser}
                                        disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || !formData.password || formData.groups.length === 0}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={closeCreateModal}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Редактирование пользователя</h2>
                                <button
                                    onClick={closeModal}
                                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <IoMdClose className="text-xl" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Имя *</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите имя"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Фамилия *</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите фамилию"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Номер телефона *</label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите номер телефона"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Новый пароль (оставьте пустым, чтобы не менять)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                        placeholder="Введите новый пароль"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">Роль *</label>
                                    <select
                                        value={formData.groups[0] || ""}
                                        onChange={handleRoleChange}
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#2C5AA0] focus:outline-none transition-colors"
                                    >
                                        <option value="">Выберите роль</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        className="flex-1 h-[48px]"
                                        text="Сохранить"
                                        onClick={handleUpdateUser}
                                        disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.phone_number || formData.groups.length === 0}
                                    />
                                    <Button
                                        className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                        text="Отмена"
                                        onClick={closeModal}
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
                    <Title text={"Пользователи и роли"} size={"text-[24px] max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">
                        Формирование списка пользователей
                        {users.length > 0 && ` (${users.length} пользователей)`}
                    </p>
                </div>
                <Button
                    className="h-[54px] w-[285px] gap-2.5 max-md:w-full"
                    icon={<FaPlus />}
                    text={"Создать пользователя"}
                    onClick={openCreateModal}
                />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {users.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Пользователи не найдены</p>
                        <p className="text-gray-400 mt-2">Создайте первого пользователя</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200 text-[#1E1E1E99] text-base">

                                <th className="p-4 text-left font-semibold">Id</th>
                                <th className="p-4 text-left font-semibold">ФИО</th>
                                <th className="p-4 text-left font-semibold">Роль</th>
                                <th className="p-4 text-left font-semibold">Дата регистрации</th>
                                <th className="p-4 text-left font-semibold">Последний вход</th>
                                <th className="p-4 text-center font-semibold">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                                    <td className="p-4 text-[#1E1E1E] font-medium">{index + 1}</td>
                                    <td className="p-4">
                                        <p className="text-[#2C5AA0] font-semibold cursor-pointer hover:underline"
                                            onClick={() => openEditModal(user)}>
                                            {user.last_name} {user.first_name}
                                        </p>
                                        <p className="text-sm text-[#1E1E1E99]">{user.email}</p>
                                        <p className="text-sm text-[#1E1E1E99]">{user.phone_number || "Телефон не указан"}</p>
                                    </td>
                                    <td className="p-4 text-nowrap  ">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {user.groups && user.groups[0]?.name || "Не назначено"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[#1E1E1E]">{formatDate(user.created_at)}</td>
                                    <td className="p-4 text-[#1E1E1E]">
                                        {user.last_login ? formatDate(user.last_login) : "Никогда"}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 items-center justify-center">
                                            {/* <button
                                                onClick={() => openEditModal(user)}
                                                className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                                                title="Редактировать"
                                            >
                                                <FiEdit2 className="text-base text-[#1E1E1E]" />
                                            </button> */}
                                            <button
                                                onClick={() => openDeleteModal(user)}
                                                className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
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