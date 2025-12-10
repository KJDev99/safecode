'use client';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button';
import Title from '@/components/ui/title';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { FiEdit2 } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';
import { useApiStore } from '@/store/useApiStore';

const MapWithNoSSR = dynamic(() => import('../duty-engineer/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="h-[188px] w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p>Карта загружается...</p>
        </div>
    )
})

export default function CustomerApplication() {
    const { data, loading, error, getDataToken, postDataToken, putDataToken, deleteDataToken } = useApiStore();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        size: '',
        number_of_fire_extinguishing_systems: ''
    });

    const objects = Array.isArray(data?.data) ? data.data : [];

    useEffect(() => {
        getDataToken("/user_objects/");
    }, []);

    // Nominatim API orqali qidiruv
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast.error('Введите адрес для поиска');
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();

            if (data.length === 0) {
                toast.error('Локация не найдена');
                setSearchResults([]);
            } else {
                setSearchResults(data);
            }
        } catch (error) {
            toast.error('Ошибка при поиске');
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    // Qidiruv natijasini tanlash
    const handleSelectLocation = (result) => {
        const position = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        };

        setSelectedPosition(position);
        setFormData(prev => ({
            ...prev,
            address: result.display_name,
            latitude: result.lat,
            longitude: result.lon
        }));
        setSearchResults([]);
        setSearchQuery('');
        toast.success('Локация выбрана');
    };

    // Xaritadan pozitsiyani tanlash
    const handleMapPositionSelect = (latlng) => {
        setSelectedPosition(latlng);
        setFormData(prev => ({
            ...prev,
            latitude: latlng.lat.toFixed(6),
            longitude: latlng.lng.toFixed(6)
        }));
        toast.success('Координаты обновлены');
    };

    const handleCreateObject = async (e) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            toast.error('Пожалуйста, выберите локацию на карте');
            return;
        }

        const payload = {
            ...formData,
            number_of_fire_extinguishing_systems: parseInt(formData.number_of_fire_extinguishing_systems)
        };

        const response = await postDataToken('/user_objects/', payload);

        if (response?.success) {
            toast.success('Объект успешно создан');
            setShowCreateModal(false);
            resetFormData();
            getDataToken("/user_objects/");
        } else {
            toast.error(response?.message || 'Ошибка при создании объекта');
        }
    };

    const handleEditObject = async (e) => {
        e.preventDefault();
        if (!selectedObject) return;

        if (!formData.latitude || !formData.longitude) {
            toast.error('Пожалуйста, выберите локацию на карте');
            return;
        }

        const payload = {
            ...formData,
            number_of_fire_extinguishing_systems: parseInt(formData.number_of_fire_extinguishing_systems)
        };

        const response = await putDataToken(`/user_objects/${selectedObject.id}/`, payload);

        if (response?.success) {
            toast.success('Объект успешно обновлен');
            setShowEditModal(false);
            setSelectedObject(null);
            resetFormData();
            getDataToken("/user_objects/");
        } else {
            toast.error(response?.message || 'Ошибка при обновлении объекта');
        }
    };

    const handleDeleteObject = async (objectId) => {
        if (!confirm('Вы уверены, что хотите удалить этот объект?')) return;

        const response = await deleteDataToken(`/user_objects/${objectId}/`);

        if (response?.success) {
            toast.success('Объект успешно удален');
            getDataToken("/user_objects/");
        } else {
            toast.error(response?.message || 'Ошибка при удалении объекта');
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            address: '',
            latitude: '',
            longitude: '',
            size: '',
            number_of_fire_extinguishing_systems: ''
        });
        setSelectedPosition(null);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        resetFormData();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedObject(null);
        resetFormData();
    };

    const openEditModal = (object) => {
        setSelectedObject(object);
        const position = {
            lat: parseFloat(object.latitude),
            lng: parseFloat(object.longitude)
        };
        setSelectedPosition(position);
        setFormData({
            name: object.name,
            address: object.address,
            latitude: object.latitude,
            longitude: object.longitude,
            size: object.size,
            number_of_fire_extinguishing_systems: object.number_of_fire_extinguishing_systems.toString()
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

    const getStatusButton = (object) => {
        const status = object.status || 'not_verified';

        switch (status) {
            case 'verified':
                return (
                    <Button
                        className="h-[51px] w-[196px] bg-transparent max-md:w-full max-md:col-span-2 !text-[#2C5AA0] border border-[#2C5AA0]"
                        text={"Объект проверен"}
                    />
                );
            case 'pending':
                return (
                    <Button
                        className="h-[51px] w-[196px] bg-transparent max-md:w-full max-md:col-span-2 !text-[#8E8E8E] border border-[#8E8E8E]"
                        text={"На проверке"}
                    />
                );
            default:
                return (
                    <Button
                        className="h-[51px] w-[196px] bg-transparent max-md:w-full max-md:col-span-2 !text-[#E87D7D] border border-[#E87D7D]"
                        text={"Не проверен"}
                    />
                );
        }
    };

    if (loading && objects.length === 0) {
        return <Loader />;
    }

    return (
        <div>
            {/* Modal - Yangi obyekt yaratish */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Добавление Объекта"} size={"text-lg"} />
                            <button onClick={handleCloseCreateModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Qidiruv paneli */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Поиск локации</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Введите адрес"
                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="h-[42px] w-[120px]"
                                    icon={<FaSearch />}
                                    text={isSearching ? "Поиск..." : "Найти"}
                                />
                            </div>

                            {/* Qidiruv natijalari */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectLocation(result)}
                                            className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-[#2C5AA0]">{result.display_name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Координаты: {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Interaktiv xarita */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Укажите точное местоположение на карте
                                <span className="text-xs text-gray-500 ml-2">(кликните на карту или перетащите маркер)</span>
                            </label>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-gray-300">
                                <MapWithNoSSR
                                    isEditable={true}
                                    selectedPosition={selectedPosition}
                                    onPositionSelect={handleMapPositionSelect}
                                    center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : [41.2995, 69.2401]}
                                />
                            </div>
                        </div>

                        <form onSubmit={handleCreateObject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название объекта</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Адрес</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Широта</label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                        readOnly
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Долгота</label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Размер (м²)</label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Количество систем пожаротушения</label>
                                <input
                                    type="number"
                                    name="number_of_fire_extinguishing_systems"
                                    value={formData.number_of_fire_extinguishing_systems}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 h-[45px]"
                                    text="Отправить на проверку менеджеру"
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    className="flex-1 h-[45px] bg-gray-500"
                                    text="Отмена"
                                    onClick={handleCloseCreateModal}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal - Obyektni tahrirlash */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <Title text={"Редактировать объект"} size={"text-lg"} />
                            <button onClick={handleCloseEditModal}>
                                <IoMdClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Qidiruv paneli */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Поиск новой локации</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Введите адрес"
                                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                                />
                                <Button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="h-[42px] w-[120px]"
                                    icon={<FaSearch />}
                                    text={isSearching ? "Поиск..." : "Найти"}
                                />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="mt-2 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                                    {searchResults.map((result, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectLocation(result)}
                                            className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-[#2C5AA0]">{result.display_name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Координаты: {parseFloat(result.lat).toFixed(4)}, {parseFloat(result.lon).toFixed(4)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Interaktiv xarita */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Измените местоположение на карте
                                <span className="text-xs text-gray-500 ml-2">(кликните на карту или перетащите маркер)</span>
                            </label>
                            <div className="h-[400px] w-full rounded-lg overflow-hidden border-2 border-gray-300">
                                <MapWithNoSSR
                                    isEditable={true}
                                    selectedPosition={selectedPosition}
                                    onPositionSelect={handleMapPositionSelect}
                                    center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : [41.2995, 69.2401]}
                                />
                            </div>
                        </div>

                        <form onSubmit={handleEditObject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Название объекта</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Адрес</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Широта</label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                        readOnly
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Долгота</label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude}
                                        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                                        readOnly
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Размер (м²)</label>
                                <input
                                    type="text"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Количество систем пожаротушения</label>
                                <input
                                    type="number"
                                    name="number_of_fire_extinguishing_systems"
                                    value={formData.number_of_fire_extinguishing_systems}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 h-[45px]"
                                    text="Сохранить"
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    className="flex-1 h-[45px] bg-gray-500"
                                    text="Отмена"
                                    onClick={handleCloseEditModal}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Asosiy kontent */}
            <div className="flex justify-between md:items-center max-md:mt-6 max-md:flex-col">
                <div className="flex flex-col ">
                    <Title text={"Мои объекты"} size={"text-[24px] max-md:text-[22px] "} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3 max-md:text-sm">Сюда вы можете добавить объекты для проверок</p>
                </div>
                <Button
                    className="h-[54px] w-[250px] gap-2.5 max-md:h-[50px] max-md:w-full max-md:mt-6"
                    icon={<FaPlus />}
                    text={"Создать заявку"}
                    onClick={() => setShowCreateModal(true)}
                />
            </div>

            {/* Obyektlar ro'yxati */}
            {objects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Объекты не найдены</p>
                    <p className="text-gray-400 mt-2">Создайте свой первый объект</p>
                </div>
            ) : (
                objects.map((object) => (
                    <div key={object.id} className="p-6 mt-6 rounded-xl" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                        <div className={`h-[188px] w-full mb-6 rounded-lg overflow-hidden ${showEditModal || showCreateModal ? 'opacity-50' : ''}`}>
                            <MapWithNoSSR
                                customLocations={[{
                                    id: object.id,
                                    name: object.name,
                                    lat: parseFloat(object.latitude) || 41.2995,
                                    lng: parseFloat(object.longitude) || 69.2401,
                                    address: object.address
                                }]}
                                center={[parseFloat(object.latitude) || 41.2995, parseFloat(object.longitude) || 69.2401]}
                            />
                        </div>
                        <div className="flex justify-between md:items-center max-md:flex-col">
                            <div className="flex items-center gap-x-4">
                                <div className="flex flex-col">
                                    <Title text={object.name} size={"text-lg"} cls="text-[#2C5AA0]" />
                                    <div className="flex w-[400px] justify-between max-md:w-full max-md:flex-col">
                                        <p className="text-[#1E1E1E] mt-2">Адрес:</p>
                                        <p className="text-[#1E1E1E]/60 mt-2 md:text-right">{object.address}</p>
                                    </div>
                                    <div className="flex w-[400px] justify-between max-md:w-full max-md:flex-col">
                                        <p className="text-[#1E1E1E]">Размер:</p>
                                        <p className="text-[#1E1E1E]/60 md:text-right">{object.size} м²</p>
                                    </div>
                                    <div className="flex w-[400px] justify-between max-md:w-full max-md:flex-col ">
                                        <p className="text-[#1E1E1E]">Систем пожаротушения:</p>
                                        <p className="text-[#1E1E1E]/60 md:text-right">{object.number_of_fire_extinguishing_systems}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-x-3 items-center max-md:mt-6 max-md:grid max-md:grid-cols-2">
                                {getStatusButton(object)}
                                <button
                                    className="w-[51px] rounded-xl h-[51px] max-md:w-full max-md:mt-3 bg-[#C5C5C5]/50 flex items-center justify-center"
                                    onClick={() => openEditModal(object)}
                                >
                                    <FiEdit2 className="text-[20px] text-[#1E1E1E]/60" />
                                </button>
                                <button
                                    className="w-[51px] rounded-xl h-[51px] max-md:w-full max-md:mt-3 bg-[#E87D7D] flex items-center justify-center"
                                    onClick={() => handleDeleteObject(object.id)}
                                >
                                    <IoMdClose className="text-[20px] text-[#fff]" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}