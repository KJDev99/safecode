import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Title from '@/components/ui/title'
import React, { useState, useEffect } from 'react'
import { useApiStore } from '@/store/useApiStore'

export default function DutyEnginerSettings() {
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
        old_password: '',
        new_password: '',
        new_password_confirm: ''
    });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Load profile data on component mount
    useEffect(() => {
        getDataToken("/accounts/profile/");
    }, []);

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

    // Change password
    const handleChangePassword = async () => {
        if (passwordData.new_password !== passwordData.new_password_confirm) {
            setMessage('Новые пароли не совпадают');
            return;
        }

        if (passwordData.new_password.length < 6) {
            setMessage('Пароль должен содержать минимум 6 символов');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            await postDataToken("/accounts/profile/change-password/", {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });

            setMessage('Пароль успешно изменен');
            setPasswordData({
                old_password: '',
                new_password: '',
                new_password_confirm: ''
            });
            setShowPasswordFields(false);
        } catch (err) {
            setMessage('Ошибка при изменении пароля. Проверьте текущий пароль.');
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle password fields visibility
    const togglePasswordFields = () => {
        console.log(showPasswordFields);

        setShowPasswordFields(!showPasswordFields);
        setPasswordData({
            old_password: '',
            new_password: '',
            new_password_confirm: ''
        });
        setMessage('');
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



            {/* Security Settings */}
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
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label='Текущий пароль'
                                type='password'
                                placeholder="Введите текущий пароль"
                                className={'max-md:text-sm h-[50px]'}
                                value={passwordData.old_password}
                                onChange={(value) => handlePasswordChange('old_password', value)}
                            />
                            <div></div>
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