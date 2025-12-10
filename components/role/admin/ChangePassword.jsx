'use client'
import React, { useState } from 'react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useApiStore } from '@/store/useApiStore'
import toast from 'react-hot-toast'

export default function ChangePassword({ userId, onClose }) {
    const { putDataToken } = useApiStore()
    const [formData, setFormData] = useState({
        password: '',
        password_confirm: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.password) {
            newErrors.password = 'Введите новый пароль'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Пароль должен содержать минимум 8 символов'
        }

        if (!formData.password_confirm) {
            newErrors.password_confirm = 'Подтвердите пароль'
        } else if (formData.password !== formData.password_confirm) {
            newErrors.password_confirm = 'Пароли не совпадают'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const response = await putDataToken(
                `/accounts/users/${userId}/password/`,
                { password: formData.password }
            )

            if (response?.success) {
                toast.success('Пароль успешно изменен')
                setFormData({ password: '', password_confirm: '' })
                if (onClose) onClose()
            } else {
                const errorMessage = response?.response?.data?.detail ||
                    response?.response?.data?.message ||
                    response?.response?.data?.password?.[0] ||
                    'Ошибка при изменении пароля'
                toast.error(errorMessage)
            }
        } catch (error) {
            console.error('Change password error:', error)
            toast.error('Ошибка при изменении пароля')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Изменение пароля</h2>
            <p className="text-gray-600 mb-6">Введите новый пароль для пользователя</p>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                            Новый пароль *
                        </label>
                        <Input
                            placeholder="Введите новый пароль"
                            type="password"
                            value={formData.password}
                            onChange={(value) => handleChange('password', value)}
                            className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Минимум 8 символов
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-[#1E1E1E]">
                            Подтвердите пароль *
                        </label>
                        <Input
                            placeholder="Повторите новый пароль"
                            type="password"
                            value={formData.password_confirm}
                            onChange={(value) => handleChange('password_confirm', value)}
                            className={`w-full ${errors.password_confirm ? 'border-red-500' : ''}`}
                        />
                        {errors.password_confirm && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_confirm}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            className="flex-1 h-[48px]"
                            text={loading ? "Сохранение..." : "Изменить пароль"}
                            type="submit"
                            disabled={loading}
                        />
                        {onClose && (
                            <Button
                                className="flex-1 h-[48px] bg-gray-200 !text-gray-700 hover:bg-gray-300"
                                text="Отмена"
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                            />
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}