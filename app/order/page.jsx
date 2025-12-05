"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Title from '@/components/ui/title';
import { useApiStore } from '@/store/useApiStore';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';
import { IoCheckmarkCircle } from 'react-icons/io5';

export default function CheckoutPage() {
    const router = useRouter();
    const { getDataToken, postDataToken } = useApiStore();
    const { cartItems, getTotalPrice, clearCart } = useCartStore();

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        postal_index: ''
    });

    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    // Load profile and delivery/payment methods
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load profile data
            const profileResponse = await getDataToken("/accounts/profile/");
            if (profileResponse?.data) {
                setProfileData({
                    first_name: profileResponse.data.first_name || '',
                    last_name: profileResponse.data.last_name || '',
                    email: profileResponse.data.email || '',
                    phone_number: profileResponse.data.phone_number || '',
                    city: profileResponse.data.city || '',
                    street: profileResponse.data.street || '',
                    house: profileResponse.data.house || '',
                    apartment: profileResponse.data.apartment || '',
                    postal_index: profileResponse.data.postal_index || ''
                });
            }

            // Load delivery methods
            const deliveryResponse = await getDataToken("/orders/delivery-methods/");
            const deliveryData = Array.isArray(deliveryResponse?.data)
                ? deliveryResponse.data
                : [];
            setDeliveryMethods(deliveryData);
            if (deliveryData.length > 0) {
                setSelectedDelivery(deliveryData[0].id);
            }

            // Load payment methods
            const paymentResponse = await getDataToken("/orders/payment-methods/");
            const paymentData = Array.isArray(paymentResponse?.data)
                ? paymentResponse.data
                : [];
            setPaymentMethods(paymentData);
            if (paymentData.length > 0) {
                setSelectedPayment(paymentData[0].id);
            }
        } catch (error) {
            toast.error("Ошибка загрузки данных");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value) => {
        return new Intl.NumberFormat("ru-RU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(value) || 0);
    };

    const handleSubmitOrder = async () => {
        // Validation
        if (!profileData.city || !profileData.street || !profileData.house) {
            toast.error("Заполните данные профиля (адрес обязателен)");
            return;
        }

        if (!selectedDelivery) {
            toast.error("Выберите способ доставки");
            return;
        }

        if (!selectedPayment) {
            toast.error("Выберите способ оплаты");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Корзина пуста");
            return;
        }

        setSubmitting(true);

        try {
            const orderData = {
                city: profileData.city,
                street: profileData.street,
                house: profileData.house,
                apartment: profileData.apartment || '',
                postal_index: profileData.postal_index || '',
                delivery_method_id: selectedDelivery,
                payment_method_id: selectedPayment,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            };

            const response = await postDataToken("/orders/", orderData);

            // Generate order number
            const orderNum = `ORD-${Date.now()}`;
            setOrderNumber(orderNum);

            // Clear cart
            clearCart();

            // Show success modal
            setShowSuccessModal(true);

            toast.success("Заказ успешно оформлен!");
        } catch (error) {
            toast.error("Ошибка при оформлении заказа");
        } finally {
            setSubmitting(false);
        }
    };

    const totalPrice = getTotalPrice();
    const deliveryPrice = deliveryMethods.find(d => d.id === selectedDelivery)?.price || 0;
    const finalTotal = parseFloat(totalPrice) + parseFloat(deliveryPrice);

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-lg">Загрузка...</div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0 && !showSuccessModal) {
        return (
            <div className="max-w-[1200px] mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-[#1E1E1E] mb-8">Оформление заказа</h1>
                <div className="flex flex-col items-center justify-center py-20">
                    <h2 className="text-2xl font-semibold text-[#1E1E1E] mb-2">
                        Корзина пуста
                    </h2>
                    <p className="text-[#1E1E1E]/60 mb-8">
                        Добавьте товары для оформления заказа
                    </p>
                    <Button
                        text="Перейти в каталог"
                        onClick={() => router.push("/catalog")}
                        className="w-[250px] h-14"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8">
            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-[20px] p-8 max-w-[500px] w-full text-center">
                        <IoCheckmarkCircle className="text-green-500 text-7xl mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#1E1E1E] mb-2">
                            Заказ успешно оформлен!
                        </h2>
                        <p className="text-[#1E1E1E]/60 mb-2">
                            Номер заказа: <strong>{orderNumber}</strong>
                        </p>
                        <p className="text-[#1E1E1E]/60 mb-6">
                            Мы свяжемся с вами в ближайшее время для подтверждения заказа.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button
                                text="На главную"
                                onClick={() => router.push("/")}
                                className="w-[180px] h-14"
                            />
                            <Button
                                text="В каталог"
                                onClick={() => router.push("/catalog")}
                                className="w-[180px] h-14 bg-[#E2E2E2] !text-[#1E1E1E]"
                            />
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-[#1E1E1E] mb-8">Оформление заказа</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Profile Data */}
                <div className="space-y-6">
                    {/* Personal Info */}
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <Title text={"Заполните личные данные"} size={"text-[24px]"} cls="uppercase" />
                                <p className="text-[#1E1E1E]/60 mt-3">
                                    Проверьте правильность данных
                                </p>
                            </div>
                        </div>

                        <div className="p-8 mt-6 rounded-2xl grid grid-cols-2 gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                            <Input
                                label='Имя'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.first_name}
                                onChange={(value) => setProfileData(prev => ({ ...prev, first_name: value }))}
                                disabled
                            />
                            <Input
                                label='Фамилия'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.last_name}
                                onChange={(value) => setProfileData(prev => ({ ...prev, last_name: value }))}
                                disabled
                            />
                            <Input
                                label='Email'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.email}
                                onChange={(value) => setProfileData(prev => ({ ...prev, email: value }))}
                                disabled
                            />
                            <Input
                                label='Телефон'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.phone_number}
                                onChange={(value) => setProfileData(prev => ({ ...prev, phone_number: value }))}
                                type="tel"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Address Info */}
                    <div>
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col mt-6">
                                <Title text={"Заполните адрес"} size={"text-[24px]"} cls="uppercase" />
                            </div>
                        </div>

                        <div className="p-8 mt-6 rounded-2xl grid grid-cols-2 gap-4" style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
                            <div className="col-span-2">
                                <Input
                                    label='Город'
                                    placeholder="Не указано"
                                    className={'h-[50px]'}
                                    value={profileData.city}
                                    onChange={(value) => setProfileData(prev => ({ ...prev, city: value }))}
                                    disabled
                                />
                            </div>
                            <Input
                                label='Улица'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.street}
                                onChange={(value) => setProfileData(prev => ({ ...prev, street: value }))}
                                disabled
                            />
                            <Input
                                label='Дом'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.house}
                                onChange={(value) => setProfileData(prev => ({ ...prev, house: value }))}
                                disabled
                            />
                            <Input
                                label='Квартира'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.apartment}
                                onChange={(value) => setProfileData(prev => ({ ...prev, apartment: value }))}
                                disabled
                            />
                            <Input
                                label='Индекс'
                                placeholder="Не указано"
                                className={'h-[50px]'}
                                value={profileData.postal_index}
                                onChange={(value) => setProfileData(prev => ({ ...prev, postal_index: value }))}
                                disabled
                            />
                        </div>


                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        {/* Delivery Methods */}
                        <div className='col-span-2'>
                            <Title text={"Способ доставки"} size={"text-[18px]"} cls="uppercase mb-4" />
                            <div className="space-y-3">
                                {deliveryMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedDelivery === method.id
                                            ? 'border-[#2C5AA0] bg-[#2C5AA0]/5'
                                            : 'border-gray-200 hover:border-[#2C5AA0]/50'
                                            }`}
                                        onClick={() => setSelectedDelivery(method.id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-[#1E1E1E] mb-1">
                                                    {method.name}
                                                </h3>
                                                <p className="text-sm text-[#1E1E1E]/60">
                                                    {method.details}
                                                </p>
                                            </div>
                                            <div className="text-[#2C5AA0] font-bold">
                                                {formatPrice(method.price)} ₽
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className='col-span-3'>
                            <Title text={"Способ оплаты"} size={"text-[18px]"} cls="uppercase mb-4" />
                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${selectedPayment === method.id
                                            ? 'border-[#2C5AA0] bg-[#2C5AA0]/5'
                                            : 'border-gray-200 hover:border-[#2C5AA0]/50'
                                            }`}
                                        onClick={() => setSelectedPayment(method.id)}
                                    >
                                        <h3 className="font-semibold text-[#1E1E1E] mb-1">
                                            {method.name}
                                        </h3>
                                        <p className="text-sm text-[#1E1E1E]/60">
                                            {method.details}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Cart Items & Summary */}
                <div className="space-y-6">
                    {/* Cart Items */}
                    <div>
                        <Title text={"Товары в заказе"} size={"text-[24px]"} cls="uppercase mb-4" />
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 rounded-xl border border-gray-200 flex gap-4"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image || "/cart.png"}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-contain p-2"
                                            alt={item.name}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#1E1E1E] mb-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-sm text-[#1E1E1E]/60 mb-2">
                                            Артикул: {item.article}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-[#1E1E1E]/60">
                                                {item.quantity} шт × {formatPrice(item.price)} ₽
                                            </span>
                                            <span className="font-bold text-[#2C5AA0]">
                                                {formatPrice(parseFloat(item.price) * item.quantity)} ₽
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 rounded-2xl bg-[#2C5AA0]/5 sticky top-4">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-[#1E1E1E]/60">
                                <span>Товары ({cartItems.length}):</span>
                                <span>{formatPrice(totalPrice)} ₽</span>
                            </div>
                            <div className="flex justify-between text-[#1E1E1E]/60">
                                <span>Доставка:</span>
                                <span>{formatPrice(deliveryPrice)} ₽</span>
                            </div>
                            <div className="border-t border-gray-300 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold text-[#1E1E1E]">
                                        К оплате:
                                    </span>
                                    <span className="text-2xl font-bold text-[#2C5AA0]">
                                        {formatPrice(finalTotal)} ₽
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button
                            text={submitting ? "Оформление..." : "Оформить заказ"}
                            onClick={handleSubmitOrder}
                            disabled={submitting}
                            className="w-full h-[54px] mb-3"
                        />

                        <button
                            onClick={() => router.push("/cart")}
                            className="w-full h-[54px] border border-[#2C5AA0] text-[#2C5AA0] rounded-[10px] hover:bg-[#2C5AA0]/5 transition-all"
                            disabled={submitting}
                        >
                            Вернуться в корзину
                        </button>

                        <p className="text-xs text-[#1E1E1E]/60 text-center mt-4">
                            Нажимая кнопку "Оформить заказ", вы соглашаетесь с условиями обработки персональных данных
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}