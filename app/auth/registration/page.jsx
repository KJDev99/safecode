'use client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import SelectInput from '@/components/ui/selectInput'
import { useApiStore } from '@/store/useApiStore'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Registration() {
    const [position, setPosition] = useState('')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        id_organization: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirm: ''
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const { data, loading: rolesLoading, error, getData, postData } = useApiStore();

    useEffect(() => {
        getData("/accounts/roles/");
    }, []);

    // Format API roles to match SelectInput expected format - xatolikni oldini olish
    const formattedRoles = React.useMemo(() => {
        if (!data || !data.data || !Array.isArray(data.data)) {
            return [];
        }
        return data.data.map(role => ({
            value: role.id?.toString() || '',
            label: role.name || 'Unnamed Role'
        }));
    }, [data]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // LocalStorage ga saqlash funksiyasi
    const saveToLocalStorage = (userData, tokens) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            console.error('LocalStorage ga saqlashda xatolik:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Validation
        if (formData.password !== formData.password_confirm) {
            toast.error('Пароли не совпадают')
            setLoading(false)
            return
        }
        if (formData.password.length < 8) {
            toast.error('Пароль должен содержать минимум 8 символов, включать большие и маленькие буквы и цифры.')
            setLoading(false)
            return
        }
        const requiredFields = [
            { field: 'first_name', name: 'Имя' },
            { field: 'last_name', name: 'Фамилия' },
            { field: 'id_organization', name: 'Организация' },
            { field: 'phone_number', name: 'Номер телефона' },
            { field: 'email', name: 'Email' },
            { field: 'password', name: 'Пароль' },
            { field: 'password_confirm', name: 'Подтверждение пароля' }
        ]

        for (const { field, name } of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                toast.error(`Пожалуйста, заполните все поля`)
                setLoading(false)
                return
            }
        }

        if (!position) {
            toast.error('Пожалуйста, выберите должность')
            setLoading(false)
            return
        }

        if (formData.password !== formData.password_confirm) {
            toast.error('Пароли не совпадают')
            setLoading(false)
            return
        }

        if (formData.password.length < 8) {
            toast.error('Пароль должен содержать минимум 6 символов')
            setLoading(false)
            return
        }

        // Prepare registration data according to backend API
        const registrationData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            id_organization: formData.id_organization,
            phone_number: formData.phone_number,
            email: formData.email,
            password: formData.password,
            password_confirm: formData.password_confirm,
            groups: [parseInt(position)] // Convert to number array
        }

        try {
            const result = await postData("/accounts/register/", registrationData)
            console.log(result);

            if (result?.success) {
                toast.success('Регистрация успешна!')

                // LocalStorage ga user va token ma'lumotlarini saqlash
                if (result.data?.user && result.data?.tokens) {
                    saveToLocalStorage(result.data.user, result.data.tokens);
                }

                // Reset form
                setFormData({
                    first_name: '',
                    last_name: '',
                    id_organization: '',
                    phone_number: '',
                    email: '',
                    password: '',
                    password_confirm: ''
                })
                setPosition('')

                switch (result?.data?.user?.groups[0]?.name) {
                    case "Дежурный инженер":
                        router.push('/roles/duty-engineer');
                        break;
                    case "Заказчик":
                        router.push('/roles/customer');
                        break;
                    case "Инспектор МЧС":
                        router.push('/roles/inspectors');
                        break;
                    case "Исполнителя":
                        router.push('/roles/performer');
                        break;
                    case "Менеджер":
                        router.push('/roles/manager');
                        break;
                    case "Обслуживающий инженер":
                        router.push('/roles/service-engineer');
                        break;
                    default: router.push('/roles/admin-panel');
                }
                window.dispatchEvent(new Event("authChanged"));

            } else {
                toast.error(result?.response?.data?.message || 'Ошибка входа');
                setLoading(false)
            }
        } catch (error) {
            console.error('Registration error:', error)
            toast.error('Ошибка при регистрации. Попробуйте снова.')
            setLoading(false)
        }
    }

    return (
        <div className='grid grid-cols-2 h-[720px] max-md:h-[769px] max-md:grid-cols-1'>
            <div className='flex flex-col items-center justify-center '>
                <div className="w-[624px] max-md:w-full max-md:px-6">
                    <div className="relative mb-8">
                        <Link href={'/auth/login'} className='absolute text-lg text-[#1E1E1E4D] top-1/2 left-0 -translate-y-1/2 max-md:text-base'>Вход</Link>
                        <h2 className='text-[#1E1E1E] text-[32px] text-center uppercase max-md:text-[22px]'>Регистрация</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1 max-md:gap-4">
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Ваше имя *"}
                                value={formData.first_name}
                                onChange={(value) => handleInputChange('first_name', value)}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Ваша фамилия *"}
                                value={formData.last_name}
                                onChange={(value) => handleInputChange('last_name', value)}
                                required
                            />
                            <SelectInput
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder="Ваша должность *"
                                options={formattedRoles}
                                value={position}
                                onChange={setPosition}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Id организации *"}
                                value={formData.id_organization}
                                onChange={(value) => handleInputChange('id_organization', value)}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Номер телефона *"}
                                type='tel'
                                value={formData.phone_number}
                                onChange={(value) => handleInputChange('phone_number', value)}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"E-mail *"}
                                type='email'
                                text={'На почту придет код для подтверждения'}
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Введите пароль *"}
                                type='password'
                                value={formData.password}
                                onChange={(value) => handleInputChange('password', value)}
                                required
                            />
                            <Input
                                className={"max-md:text-sm max-md:h-[50px]"}
                                placeholder={"Повторите пароль *"}
                                type='password'
                                value={formData.password_confirm}
                                onChange={(value) => handleInputChange('password_confirm', value)}
                                required
                            />
                        </div>

                        <Button
                            text={loading ? 'Регистрация...' : 'Зарегистрироваться'}
                            className='h-[66px] w-full text-lg mt-6 max-md:text-sm'
                            type="submit"
                            disabled={loading || rolesLoading}
                        />
                    </form>

                    <p className='mt-4 text-xs text-[#1E1E1E99] leading-[100%] tracking-[0%] max-md:text-center'>
                        Входя в аккаунт или создавая новый, вы соглашаетесь с нашими Правилами и условиями и Положением о конфиденциальности
                    </p>
                </div>
            </div>
            <div className="bg-[url(/authbg.png)] bg-center bg-cover max-md:hidden"></div>
        </div>
    )
}