'use client'
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
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const { data, loading: rolesLoading, error, getData, postData } = useApiStore();

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

        } catch (error) {
            console.error('LocalStorage ga saqlashda xatolik:', error);
        }
    }

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }

        setLoading(true)

        // Validation
        if (!formData.identifier.trim()) {
            toast.error('Введите номер телефона или e-mail');
            setLoading(false);
            return;
        }

        if (!formData.password) {
            toast.error('Введите пароль');
            setLoading(false);
            return;
        }

        // if (formData.password.length < 8) {
        //     toast.error('Пароль должен содержать минимум 8 символов');
        //     setLoading(false);
        //     return;
        // }

        // Prepare login data according to backend API
        const loginData = {
            identifier: formData.identifier,
            password: formData.password,
        }

        try {
            const result = await postData("/accounts/login/", loginData);

            if (result?.success) {
                toast.success('Вход выполнен успешно!');

                // LocalStorage ga user va token ma'lumotlarini saqlash
                if (result.data?.user && result.data?.tokens) {
                    saveToLocalStorage(result.data.user, result.data.tokens);
                }

                // Reset form
                setFormData({
                    identifier: '',
                    password: '',
                });


                // setTimeout(() => {
                //     switch (result?.data?.user?.groups[0]?.name) {
                //         case "Дежурный инженер":
                //             router.push('/roles/duty-engineer');
                //             break;
                //         case "Заказчик":
                //             router.push('/roles/customer');
                //             break;
                //         case "Инспектор МЧС":
                //             router.push('/roles/inspectors');
                //             break;
                //         case "Исполнителя":
                //             router.push('/roles/performer');
                //             break;
                //         case "Менеджер":
                //             router.push('/roles/manager');
                //             break;
                //         case "Обслуживающий инженер":
                //             router.push('/roles/service-engineer');
                //             break;
                //         default: router.push('/roles/admin-panel');
                //     }
                // }, 1000);

                setTimeout(() => {
                    router.push('/')
                    window.dispatchEvent(new Event("authChanged"));
                }, 1000);

            } else {

                toast.error(result?.response?.data?.message || 'Ошибка входа');
            }
        } catch (error) {
            console.error('Login error:', error);

            // Batafsil xato ma'lumotlari
            if (error && typeof error === 'object') {
                if (error.message) {
                    toast.error(error.message);
                } else if (error.detail) {
                    toast.error(error.detail);
                } else {
                    toast.error('Ошибка при входе. Проверьте данные и попробуйте снова.');
                }
            } else {
                toast.error('Ошибка при входе. Попробуйте снова.');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
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

                    <p className='mt-4 text-xs text-[#1E1E1E99] leading-[100%] tracking-[0%] max-md:text-center'>
                        Входя в аккаунт или создавая новый, вы соглашаетесь с нашими Правилами и условиями и Положением о конфиденциальности
                    </p>
                </div>
            </div>
            <div className="bg-[url(/authbg.png)] bg-center bg-cover max-md:hidden"></div>
        </div>
    )
}