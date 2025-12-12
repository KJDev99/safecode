import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Title from '@/components/ui/title'
import React, { useState, useEffect } from 'react'
import { useApiStore } from '@/store/useApiStore'
import toast from 'react-hot-toast'

export default function CustomerSettings() {
    const { data, loading, error, getDataToken, putDataToken, postDataToken } = useApiStore();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        id_organization: '',
        position: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        postal_index: ''
    });
    const [passwordData, setPasswordData] = useState({
        new_password: '',
        new_password_confirm: ''
    });
    const [servicesData, setServicesData] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [extendingServiceId, setExtendingServiceId] = useState(null);

    // Load profile data on component mount
    useEffect(() => {
        getDataToken("/accounts/profile/");
        loadPurchasedServices();
    }, []);

    // Load purchased services
    const loadPurchasedServices = async () => {
        setServicesLoading(true);
        try {
            const response = await getDataToken("/accounts/purchased-services/");
            if (response && response.data) {
                setServicesData(response.data);
            }
        } catch (err) {
            console.error('Error loading purchased services:', err);
            toast.error('Ошибка при загрузке услуг');
        } finally {
            setServicesLoading(false);
        }
    };

    // Update form data when API data is loaded
    useEffect(() => {
        if (data && data.data) {
            setFormData({
                first_name: data.data.first_name || '',
                last_name: data.data.last_name || '',
                email: data.data.email || '',
                phone_number: data.data.phone_number || '',
                id_organization: data.data.id_organization || '',
                position: data.data.position || '',
                city: data.data.city || '',
                street: data.data.street || '',
                house: data.data.house || '',
                apartment: data.data.apartment || '',
                postal_index: data.data.postal_index || ''
            });
        }
    }, [data]);

    // Handle input changes for profile data
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle password input changes
    const handlePasswordChange = (field, value) => {
        setPasswordData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Save profile changes
    const handleSaveProfile = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            await putDataToken("/accounts/profile/", formData);
            setMessage('Профиль успешно обновлен');

            // Refresh profile data
            getDataToken("/accounts/profile/");
        } catch (err) {
            setMessage('Ошибка при обновлении профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        // Validatsiya
        if (!passwordData.new_password) {
            toast.error('Введите новый пароль');
            return;
        }

        if (passwordData.new_password.length < 8) {
            toast.error('Пароль должен содержать минимум 8 символов');
            return;
        }

        if (passwordData.new_password !== passwordData.new_password_confirm) {
            toast.error('Пароли не совпадают');
            return;
        }

        setIsLoading(true);

        try {
            // Endpoint: /accounts/users/{id}/password/
            // Bu endpoint faqat new_password qabul qiladi
            const response = await putDataToken(
                `/accounts/users/${data?.data?.id}/password/`,
                { password: passwordData.new_password }
            );

            if (response?.success) {
                toast.success('Пароль успешно изменен');
                setPasswordData({
                    new_password: '',
                    new_password_confirm: ''
                });
                setShowPasswordFields(false);
            } else {
                const errorMessage = response?.response?.data?.detail ||
                    response?.response?.data?.message ||
                    response?.response?.data?.password?.[0] ||
                    'Ошибка при изменении пароля';
                toast.error(errorMessage);
            }
        } catch (err) {
            console.error('Change password error:', err);
            toast.error('Ошибка при изменении пароля');
        } finally {
            setIsLoading(false);
        }
    };

    // Extend service for next month
    const handleExtendService = async (serviceId, serviceTitle, finishedDate) => {
        setExtendingServiceId(serviceId);
        const loadingToast = toast.loading(`Продление услуги "${serviceTitle}"...`);

        try {
            const response = await postDataToken("/accounts/purchased-services/", {
                service: serviceId,
                start_date: finishedDate,
            });

            toast.dismiss(loadingToast);

            if (response && !response.error) {
                toast.success(`Услуга "${serviceTitle}" успешно продлена!`);
                // Reload services
                await loadPurchasedServices();
            } else {
                toast.error('Ошибка при продлении услуги');
            }
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error('Error extending service:', err);
            toast.error('Ошибка при продлении услуги');
        } finally {
            setExtendingServiceId(null);
        }
    };

    const togglePasswordFields = () => {
        setShowPasswordFields(!showPasswordFields);
        setPasswordData({
            new_password: '',
            new_password_confirm: ''
        });
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);
        return `${day}.${month}.${year}`;
    };

    if (loading) return <div className="text-center py-8">Загрузка...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Ошибка: {error}</div>;

    return (
        <div>
            {/* Success/Error Message */}
            {message && (
                <div className={`p-4 mb-4 rounded-lg ${message.includes('Ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <Title text={"Личные данные"} size={"text-[24px]"} cls="uppercase" />
                    <p className="text-[#1E1E1E]/60 mt-3">Последнее обновление {data?.data?.updated_at ? new Date(data.data.updated_at).toLocaleDateString('ru-RU') : '24.09.25'}</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="p-8 mt-6 rounded-2xl grid grid-cols-2 gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <Input
                    label='Имя'
                    placeholder="Введите имя"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.first_name}
                    onChange={(value) => handleInputChange('first_name', value)}
                />
                <Input
                    label='Фамилия'
                    placeholder="Введите фамилию"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.last_name}
                    onChange={(value) => handleInputChange('last_name', value)}
                />
                <Input
                    label='Email'
                    placeholder="Введите email"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                />
                <Input
                    label='Телефон'
                    placeholder="Введите номер телефона"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.phone_number}
                    onChange={(value) => handleInputChange('phone_number', value)}
                    type="tel"
                />
                <Input
                    label='Должность'
                    placeholder="Введите должность"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.position}
                    onChange={(value) => handleInputChange('position', value)}
                />
                <Input
                    label='Организация'
                    placeholder="Введите организацию"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.id_organization}
                    onChange={(value) => handleInputChange('id_organization', value)}
                />
            </div>

            {/* Address Information */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col mt-6">
                    <Title text={"Адрес"} size={"text-[24px]"} cls="uppercase" />
                </div>
            </div>
            <div className="p-8 mt-6 rounded-2xl grid grid-cols-2 gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <div className="col-span-2">
                    <Input
                        label='Город'
                        placeholder="Введите город"
                        className={'max-md:text-sm h-[50px]'}
                        value={formData.city}
                        onChange={(value) => handleInputChange('city', value)}
                    />
                </div>
                <Input
                    label='Улица'
                    placeholder="Введите улицу"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.street}
                    onChange={(value) => handleInputChange('street', value)}
                />
                <Input
                    label='Дом'
                    placeholder="Введите номер дома"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.house}
                    onChange={(value) => handleInputChange('house', value)}
                />
                <Input
                    label='Квартира'
                    placeholder="Введите номер квартиры"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.apartment}
                    onChange={(value) => handleInputChange('apartment', value)}
                />
                <Input
                    label='Индекс'
                    placeholder="Введите почтовый индекс"
                    className={'max-md:text-sm h-[50px]'}
                    value={formData.postal_index}
                    onChange={(value) => handleInputChange('postal_index', value)}
                />
            </div>

            {/* Services Information */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col mt-6">
                    <Title text={"Услуги"} size={"text-[24px]"} cls="uppercase" />
                </div>
            </div>

            <div className="p-8 mt-6 rounded-2xl flex flex-col gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                {servicesLoading ? (
                    <div className="text-center py-4 text-[#1E1E1E99]">
                        Загрузка услуг...
                    </div>
                ) : servicesData.length === 0 ? (
                    <div className="text-center py-4 text-[#1E1E1E99]">
                        Нет активных услуг
                    </div>
                ) : (
                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {servicesData
                            .filter(service => service.is_active) // Faqat aktiv xizmatlarni ko'rsatish
                            .map((purchasedService) => {
                                const isActive = purchasedService.is_active;
                                const finishedDate = purchasedService.finished_date;
                                const serviceTitle = purchasedService.service?.title || 'Услуга';

                                return (
                                    <div
                                        key={purchasedService.id}
                                        className=""
                                    >
                                        <div className="flex mb-4 justify-between">
                                            <p className='text-[#1E1E1E99]'>Пакеты</p>
                                            <p className='text-[#1E1E1E]'>
                                                Активен до {formatDate(finishedDate)}
                                            </p>
                                        </div>
                                        <div className="w-full h-[50px] border border-[#1E1E1E80] px-6 rounded-[12px] mb-6 flex items-center text-[#1E1E1E]">
                                            {serviceTitle}

                                        </div>



                                        {isActive && finishedDate && (
                                            <>

                                                <button
                                                    className="w-full h-[64px] bg-[#2C5AA0] text-white flex items-center justify-center rounded-[12px] text-sm cursor-pointer transition-all duration-200 tracking-[-1%] hover:bg-[#1e4073] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    onClick={() => handleExtendService(purchasedService.service.id, serviceTitle, finishedDate)}
                                                    disabled={extendingServiceId === purchasedService.id}
                                                >
                                                    {extendingServiceId === purchasedService.id
                                                        ? 'Продление...'
                                                        : 'Продлить на следующий месяц'
                                                    }
                                                </button>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        }
                    </div>
                )}
            </div>

            {/* Settings */}
            <div className="flex justify-between items-center">
                <div className="flex flex-col mt-6">
                    <Title text={"Настройки"} size={"text-[24px]"} cls="uppercase" />
                </div>
            </div>
            <div className="p-8 mt-6 rounded-2xl gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                <h3 className='mb-4 text-[#1E1E1E] text-lg'>Безопасность</h3>

                {!showPasswordFields ? (
                    <button
                        className="h-[64px] w-[194px] bg-[#E2E2E2] !text-[#8E8E8E] flex items-center justify-center rounded-[12px] text-sm cursor-pointer transition-all duration-200 tracking-[-1%]"
                        onClick={togglePasswordFields}
                    >Изменить пароль</button>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Введите новый пароль. Старый пароль не требуется.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label='Новый пароль'
                                type='password'
                                placeholder="Введите новый пароль"
                                className={'max-md:text-sm h-[50px]'}
                                value={passwordData.new_password}
                                onChange={(value) => handlePasswordChange('new_password', value)}
                            />
                            <Input
                                label='Подтвердите пароль'
                                type='password'
                                placeholder="Повторите новый пароль"
                                className={'max-md:text-sm h-[50px]'}
                                value={passwordData.new_password_confirm}
                                onChange={(value) => handlePasswordChange('new_password_confirm', value)}
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                className="h-[64px] w-[194px] bg-[#2C5AA0] text-[white] flex items-center justify-center rounded-[12px] text-sm cursor-pointer transition-all duration-200 tracking-[-1%]"
                                onClick={handleChangePassword}
                                disabled={isLoading}
                            >Сохранить пароль</button>
                            <button
                                className="h-[64px] w-[194px] bg-[#E2E2E2] !text-[#8E8E8E] flex items-center justify-center rounded-[12px] text-sm cursor-pointer transition-all duration-200 tracking-[-1%]"
                                onClick={togglePasswordFields}
                                disabled={isLoading}
                            >Отмена</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Changes Button */}
            <Button
                className="h-[66px] w-[300px] mt-12"
                text={isLoading ? "Сохранение..." : "Сохранить изменения"}
                onClick={handleSaveProfile}
                disabled={isLoading}
            />
        </div>
    )
}