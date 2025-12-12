'use client'
import Loader from '@/components/Loader'
import { useApiStore } from '@/store/useApiStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, Suspense } from 'react'
import toast from 'react-hot-toast'

// useSearchParams bilan komponent
function VerifyEmailContent() {
    const router = useRouter()
    const { verifyEmail } = useApiStore()
    const [loading, setLoading] = useState(true)
    const [verificationStatus, setVerificationStatus] = useState(null)

    useEffect(() => {
        // Client-side da URL parametrlarini olish
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const token = params.get('token')

            if (!token) {
                toast.error('Недействительная ссылка подтверждения')
                router.push('/auth/login')
                return
            }

            verifyEmailFunc(token)
        }
    }, [])

    const verifyEmailFunc = async (token) => {
        try {
            setLoading(true)

            const result = await verifyEmail(token)

            if (result?.success) {
                setVerificationStatus('success')
                toast.success('Email успешно подтвержден! Теперь вы можете войти в систему.')

                setTimeout(() => {
                    router.push('/auth/login')
                }, 3000)
            } else {
                setVerificationStatus('error')

                const errorMessage = result?.response?.data?.message ||
                    result?.response?.data?.detail ||
                    'Ошибка подтверждения email'

                toast.error(errorMessage)

                setTimeout(() => {
                    router.push('/auth/registration')
                }, 3000)
            }
        } catch (error) {
            console.error('Email verification error:', error)
            setVerificationStatus('error')
            toast.error('Ошибка при подтверждении email')

            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
                {verificationStatus === 'success' ? (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Успешное подтверждение!
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Ваш email успешно подтвержден. Теперь вы можете войти в систему
                            с вашими учетными данными.
                        </p>
                        <div className="animate-pulse">
                            <p className="text-sm text-gray-500">
                                Перенаправление на страницу входа...
                            </p>
                        </div>

                        <button
                            onClick={() => router.push('/auth/login')}
                            className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Войти сейчас
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                className="w-10 h-10 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Ошибка подтверждения
                        </h1>
                        <p className="text-gray-600 mb-6">
                            Не удалось подтвердить ваш email. Возможно, ссылка устарела
                            или уже была использована.
                        </p>
                        <div className="animate-pulse">
                            <p className="text-sm text-gray-500">
                                Перенаправление на страницу регистрации...
                            </p>
                        </div>

                        <div className="mt-4 space-y-3">
                            <button
                                onClick={() => router.push('/auth/registration')}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Зарегистрироваться снова
                            </button>
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Перейти ко входу
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

// Asosiy komponent
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}