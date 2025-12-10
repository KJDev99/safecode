'use client'
import Loader from '@/components/Loader'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useApiStore } from '@/store/useApiStore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Login() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    })

    const router = useRouter()
    const { data, loading, error, postData } = useApiStore(); // getData kerak emas
    const [newLoading, setNewLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const saveToLocalStorage = (userData, tokens) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            localStorage.setItem('isAuthenticated', 'true');

            // Debug uchun console
            console.log('Saved to localStorage:', {
                user: userData,
                access_token: tokens.access,
                refresh_token: tokens.refresh
            });

        } catch (error) {
            console.error('LocalStorage ga saqlashda xatolik:', error);
        }
    }

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation
        if (!formData.identifier.trim()) {
            toast.error('Введите номер телефона или e-mail');
            return;
        }

        if (!formData.password) {
            toast.error('Введите пароль');
            return;
        }

        // Prepare login data
        const loginData = {
            identifier: formData.identifier,
            password: formData.password,
        }

        try {
            setNewLoading(true);
            console.log('Sending login request:', loginData);

            // postData natijasini debug qilish
            const result = await postData("/accounts/login/", loginData);
            console.log('Login result:', result);
            console.log('Result type:', typeof result);
            console.log('Result structure:', result);

            // ===================================================
            // 1-CHI HOLAT: Agar postData {success, data} qaytarsa
            // ===================================================
            if (result && typeof result === 'object' && 'success' in result) {
                // Sizning yangi API store versiyangizda
                if (result.success === true) {
                    toast.success('Вход выполнен успешно!');
                    console.log('Success! Data:', result.data);

                    // Save to localStorage
                    if (result.data?.user && result.data?.tokens) {
                        saveToLocalStorage(result.data.user, result.data.tokens);
                    }

                    // Reset form
                    setFormData({
                        identifier: '',
                        password: '',
                    });

                    // User role bo'yicha redirect qilish
                    const userRole = result.data?.user?.groups[0]?.name;
                    console.log('User role:', userRole);

                    const roleRoutes = {
                        "Дежурный инженер": '/roles/duty-engineer',
                        "Заказчик": '/roles/customer',
                        "Инспектор МЧС": '/roles/inspectors',
                        "Исполнителя": '/roles/performer',
                        "Менеджер": '/roles/manager',
                        "Обслуживающий инженер": '/roles/service-engineer'
                    };

                    const route = roleRoutes[userRole] || '/roles/admin-panel';
                    console.log('Redirecting to:', route);
                    router.push(route);

                    window.dispatchEvent(new Event("authChanged"));

                } else {
                    // Error handling
                    const errorMessage = result?.response?.data?.message ||
                        result?.response?.data?.detail ||
                        'Ошибка входа';

                    console.log('Login error:', errorMessage);

                    // Agar user email tasdiqlamagan bo'lsa
                    if (errorMessage.includes('email') || errorMessage.includes('подтвержден') || errorMessage.includes('verify')) {
                        toast.error('Пожалуйста, подтвердите ваш email перед входом. Проверьте вашу почту.');
                    } else {
                        toast.error(errorMessage);
                    }
                }
            }
            // ===================================================
            // 2-CHI HOLAT: Agar postData to'g'ridan-to'g'ri backend response qaytarsa
            // ===================================================
            else if (result && typeof result === 'object' && result.data) {
                // Bu sizning eski API store versiyangiz uchun
                console.log('Old API store structure detected');

                toast.success('Вход выполнен успешно!');

                // Save to localStorage
                if (result.data?.user && result.data?.tokens) {
                    saveToLocalStorage(result.data.user, result.data.tokens);
                }

                // Reset form
                setFormData({
                    identifier: '',
                    password: '',
                });

                // User role bo'yicha redirect qilish
                const userRole = result.data?.user?.groups[0]?.name;
                console.log('User role:', userRole);

                const roleRoutes = {
                    "Дежурный инженер": '/roles/duty-engineer',
                    "Заказчик": '/roles/customer',
                    "Инспектор МЧС": '/roles/inspectors',
                    "Исполнителя": '/roles/performer',
                    "Менеджер": '/roles/manager',
                    "Обслуживающий инженер": '/roles/service-engineer'
                };

                const route = roleRoutes[userRole] || '/roles/admin-panel';
                console.log('Redirecting to:', route);
                router.push(route);

                window.dispatchEvent(new Event("authChanged"));
            }
            // ===================================================
            // 3-CHI HOLAT: Boshqa format
            // ===================================================
            else {
                console.log('Unknown result format:', result);
                toast.error('Ошибка при входе. Неизвестный формат ответа.');
                setNewLoading(false);
            }

        } catch (error) {
            console.error('Login error:', error);
            toast.error('Ошибка при входе. Попробуйте снова.');
            setNewLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    if (loading || newLoading) {
        return <Loader />;
    }

    return (
        <div className='grid grid-cols-2 h-[720px] max-md:grid-cols-1'>
            <div className='flex flex-col items-center justify-center '>
                <div className="w-[400px] max-md:w-full max-md:px-6">
                    <div className="relative mb-8">
                        <Link href={'/auth/registration'} className='absolute text-lg text-[#1E1E1E4D] top-1/2 left-0 -translate-y-1/2 max-md:text-base'>Регистрация</Link>
                        <h2 className='text-[#1E1E1E] text-[32px] text-center uppercase max-md:text-[22px]'>Вход</h2>
                    </div>

                    <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
                        <Input
                            placeholder={"Номер телефона или e-mail"}
                            className={'mb-6 max-md:mb-4 max-md:text-sm max-md:h-[50px]'}
                            value={formData.identifier}
                            onChange={(value) => handleInputChange('identifier', value)}
                            required
                        />
                        <Input
                            placeholder={"Введите пароль *"}
                            type='password'
                            className={"max-md:text-sm max-md:h-[50px]"}
                            value={formData.password}
                            onChange={(value) => handleInputChange('password', value)}
                            required
                        />
                        <Button
                            type="submit"
                            text={loading ? 'Вход...' : 'Войти'}
                            className='h-[66px] w-full text-lg mt-6 max-md:text-sm'
                            disabled={loading}
                        />
                    </form>

                    <div className="mt-4">
                        <Link
                            href="/auth/email-reg"
                            className="text-sm text-blue-600 hover:text-blue-800 block text-center"
                        >
                            Забыли пароль?
                        </Link>
                    </div>

                    <p className='mt-4 text-xs text-[#1E1E1E99] leading-[100%] tracking-[0%] max-md:text-center'>
                        Входя в аккаунт или создавая новый, вы соглашаетесь с нашими Правилами и условиями и Положением о конфиденциальности
                    </p>
                </div>
            </div>
            <div className="bg-[url(/authbg.png)] bg-center bg-cover max-md:hidden"></div>
        </div>
    )
}