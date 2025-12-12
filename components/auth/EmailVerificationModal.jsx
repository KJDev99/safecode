'use client'
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EmailVerificationModal({ isOpen, onClose }) {
    const [countdown, setCountdown] = useState(5)
    const [redirecting, setRedirecting] = useState(false)

    useEffect(() => {
        if (!isOpen) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleRedirect()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen])

    const handleRedirect = () => {
        setRedirecting(true)
        window.location.href = '/auth/login'
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
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
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Проверьте вашу почту!
                    </h3>
                    <p className="text-gray-600">
                        Мы отправили ссылку для подтверждения на вашу электронную почту.
                        Пожалуйста, проверьте ваш почтовый ящик и нажмите на ссылку,
                        чтобы завершить регистрацию.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-medium">Важно:</span> Проверьте папку "Спам",
                            если письмо не пришло в течение 5 минут.
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-gray-500 text-sm">
                            Автоматический переход на страницу входа через:
                            <span className="font-bold text-lg ml-2 text-green-600">
                                {countdown} сек
                            </span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            text={redirecting ? 'Перенаправление...' : `Перейти к входу (${countdown})`}
                            className="h-[50px] w-full"
                            onClick={handleRedirect}
                            disabled={redirecting}
                        />
                        <Button
                            text="Закрыть"
                            className="h-[50px] w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                            onClick={onClose}
                        />
                    </div>

                    <div className="text-center mt-4">
                        <Link
                            href="/auth/login"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                            Уже подтвердили email? Войти сейчас
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}