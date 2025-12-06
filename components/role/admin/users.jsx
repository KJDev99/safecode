import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import Button from "@/components/ui/button";
import Title from "@/components/ui/title";
import { useApiStore } from "@/store/useApiStore";
import Loader from "@/components/Loader";

export default function Users() {
    const { data, loading, error, getDataToken } = useApiStore();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        getDataToken("/accounts/users/");
    }, []);

    useEffect(() => {
        if (Array.isArray(data?.data)) {
            setUsers(data.data.map(user => ({ ...user, _checked: false })));
        }
    }, [data]);


    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
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

    const formatDate = (iso) => {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(2);
        return `${day}.${month}.${year}`;
    };


    if (loading) return <Loader />;
    if (error) return <div className="text-center py-8 text-red-500">Xatolik yuz berdi: {error}</div>;
    if (!data) return <div className="text-center py-8">Ma'lumot topilmadi</div>;

    return (
        <div>
            <div className="flex justify-between md:items-center max-md:flex-col max-md:mt-8">
                <div className="flex flex-col">
                    <Title text={"Пользователи и роли"} size={"text-[24px] max-md:mb-3 max-md:text-[22px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 md:mt-3 max-md:text-sm max-md:mb-6 ">Формирование списка пользователей</p>
                </div>
                <Button className="h-[54px] w-[285px] gap-2.5 max-md:w-full" icon={<FaPlus />} text={"Назначить исполнителя"} />
            </div>

            {/* TABLE */}
            <div className="mt-6 bg-white rounded-2xl p-4 max-md:overflow-x-auto max-md:py-0" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-[#1E1E1E80] text-[#1E1E1E99] text-lg ">
                            <th className="p-x-3 text-left font-normal max-md:text-nowrap">
                                <input
                                    id="head-check-all"
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">Id</th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">ФИО</th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">Статус</th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">Дата регистрации</th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">Последний заход</th>
                            <th className="p-3 text-left font-normal max-md:text-nowrap">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id} className="">
                                <td className="p-3">
                                    < input
                                        type="checkbox"
                                        checked={user._checked || false}
                                        onChange={(e) => handleUserCheck(e, user.id)}
                                    />
                                </td>
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">
                                    <p className="text-[#2C5AA0] font-medium cursor-pointer">
                                        {user.last_name} {user.first_name}
                                    </p>
                                    <p className="text-sm text-[#1E1E1E99]">{user.groups && user.groups[0]?.name || ""}</p>
                                    <p className="text-sm text-[#1E1E1E99]">{user.email}</p>
                                </td>
                                <td className="p-3 text-[#2C5AA0] text-nowrap">{user.groups && user.groups[0]?.name || ""}</td>
                                <td className="p-3 text-[#1E1E1E] text-base">{formatDate(user.created_at)}</td>

                                <td className="p-3 text-[#1E1E1E] text-base">{user.last_login ? user.last_login.slice(0, 10) : "-"}</td>
                                <td className="p-3">
                                    <div className="flex gap-x-1 items-center justify-center">

                                        <button
                                            onClick={() => openModal(user)}
                                            className="w-6 h-6 bg-[#C5C5C5]/50 rounded-sm  flex items-center justify-center"
                                        >
                                            <FiEdit2 className="text-sm text-[#1E1E1E]" />
                                        </button>
                                        <button
                                            className="w-6 h-6 bg-[#E87D7D] rounded-sm  flex items-center justify-center"
                                        >
                                            <IoMdClose className="text-sm text-[#fff]" />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-2xl w-[450px] shadow-xl">
                            <h2 className="text-xl font-bold mb-4">Редактирование Пользователя</h2>

                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="text-sm text-[#1E1E1E99]">Имя</label>
                                    <input className="w-full border p-2 rounded-lg" defaultValue={selectedUser.first_name} />
                                </div>
                                <div>
                                    <label className="text-sm text-[#1E1E1E99]">Фамилия</label>
                                    <input className="w-full border p-2 rounded-lg" defaultValue={selectedUser.last_name} />
                                </div>
                                <div>
                                    <label className="text-sm text-[#1E1E1E99]">Email</label>
                                    <input className="w-full border p-2 rounded-lg" defaultValue={selectedUser.email} />
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 gap-3">
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded-lg">Отмена</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Сохранить</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}