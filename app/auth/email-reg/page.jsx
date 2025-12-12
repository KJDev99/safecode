'use client'
import React, { useState, useEffect, Suspense } from 'react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Loader from '@/components/Loader'
import { useApiStore } from '@/store/useApiStore'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'

// Asosiy kontent komponenti
function VerifyEmailCodeContent() {
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: '',
        code: ''
    })
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [emailError, setEmailError] = useState('')

    const { postData } = useApiStore()

    useEffect(() => {
        // Client-side da URL parametrlarini olish (useSearchParams'siz)
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const emailFromUrl = params.get('email')

            if (emailFromUrl) {
                // Email URL parametrdan kelgan bo'lsa, avtomatik to'ldirish
                setFormData(prev => ({ ...prev, email: emailFromUrl }))
            }

            setPageLoading(false)
        }
    }, [])

    // Email validatsiyasi
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Email validatsiyasi
        if (field === 'email') {
            if (value && !validateEmail(value)) {
                setEmailError('Введите корректный email адрес')
            } else {
                setEmailError('')
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validatsiya
        if (!formData.email.trim()) {
            toast.error('Введите email адрес')
            return
        }

        if (!validateEmail(formData.email)) {
            toast.error('Введите корректный email адрес')
            return
        }

        if (!formData.code.trim()) {
            toast.error('Введите код подтверждения')
            return
        }

        if (formData.code.length !== 6) {
            toast.error('Код должен содержать 6 цифр')
            return
        }

        // Faqat raqamlardan iboratligini tekshirish
        if (!/^\d+$/.test(formData.code)) {
            toast.error('Код должен содержать только цифры')
            return
        }

        setLoading(true)

        try {
            const result = await postData("/accounts/users/verify-email-code/", formData)

            if (result?.success) {
                toast.success('Email успешно подтвержден!')

                // LocalStorage ga saqlash (agar user ma'lumotlari qaytsa)
                if (result.data?.user) {
                    try {
                        localStorage.setItem('user', JSON.stringify(result.data.user))
                        localStorage.setItem('isAuthenticated', 'true')
                    } catch (err) {
                        console.error('LocalStorage error:', err)
                    }
                }

                setTimeout(() => {
                    router.push('/auth/login')
                }, 2000)
            } else {
                const errorMessage = result?.response?.data?.detail ||
                    result?.response?.data?.message ||
                    result?.response?.data?.code?.[0] ||
                    result?.response?.data?.email?.[0] ||
                    'Ошибка подтверждения кода'

                if (errorMessage.includes('неверный') || errorMessage.includes('invalid') || errorMessage.includes('Invalid')) {
                    toast.error('Неверный код подтверждения')
                } else if (errorMessage.includes('истек') || errorMessage.includes('expired')) {
                    toast.error('Срок действия кода истек')
                } else if (errorMessage.includes('email') || errorMessage.includes('почт')) {
                    toast.error('Пользователь с таким email не найден')
                } else {
                    toast.error(errorMessage)
                }
            }
        } catch (error) {
            console.error('Verification error:', error)
            toast.error('Ошибка при подтверждении кода')
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (!formData.email.trim()) {
            toast.error('Введите email адрес для отправки кода')
            return
        }

        if (!validateEmail(formData.email)) {
            toast.error('Введите корректный email адрес')
            return
        }

        setLoading(true)

        try {
            const result = await postData("/accounts/users/resend-verification-code/", {
                email: formData.email
            })

            if (result?.success) {
                toast.success('Новый код отправлен на вашу почту')
            } else {
                const errorMessage = result?.response?.data?.detail ||
                    result?.response?.data?.message ||
                    'Ошибка при отправке кода'
                toast.error(errorMessage)
            }
        } catch (error) {
            console.error('Resend error:', error)
            toast.error('Ошибка при отправке кода')
        } finally {
            setLoading(false)
        }
    }

    if (pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-10 h-10 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Подтверждение Email
                    </h1>

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                Email адрес *
                            </label>
                            <Input
                                placeholder="Введите ваш email"
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                type="email"
                                className="w-full h-14"
                                required
                            />
                            {emailError && (
                                <p className="text-red-500 text-sm mt-1">{emailError}</p>
                            )}
                        </div>

                        {/* Code Input */}
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                                6-значный код подтверждения *
                            </label>
                            <Input
                                placeholder="Введите 6-значный код"
                                value={formData.code}
                                onChange={(value) => handleInputChange('code', value)}
                                type="text"
                                maxLength={6}
                                pattern="[0-9]*"
                                inputMode="numeric"

                                required
                            />

                        </div>



                        {/* Submit Button */}
                        <Button
                            type="submit"
                            text={loading ? 'Проверка...' : 'Подтвердить Email'}
                            className="h-[56px] w-full text-lg mt-2"
                            disabled={
                                loading ||
                                !formData.email ||
                                !formData.code ||
                                formData.code.length !== 6 ||
                                emailError ||
                                !validateEmail(formData.email)
                            }
                        />

                        {/* Links */}
                        <div className="space-y-3 pt-0">
                            <div className="text-center">
                                <Link
                                    href="/auth/login"
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-block"
                                >
                                    Вернуться к входу
                                </Link>
                            </div>

                        </div>
                    </div>
                </form>


            </div>
        </div>
    )
}

// Loading komponenti
function VerifyEmailCodeLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Загрузка...</p>
            </div>
        </div>
    )
}

// Asosiy page komponenti
export default function VerifyEmailCodePage() {
    return (
        <Suspense fallback={<VerifyEmailCodeLoading />}>
            <VerifyEmailCodeContent />
        </Suspense>
    )
}