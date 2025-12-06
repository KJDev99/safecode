import Button from '@/components/ui/button';
import SystemCart from '@/components/ui/system-cart';
import Title from '@/components/ui/title'
import React, { useEffect } from 'react'
import { IoNotifications } from 'react-icons/io5';
import { LuPlus } from 'react-icons/lu';
import { CiEdit } from "react-icons/ci";
import { FiEdit3 } from 'react-icons/fi';
import { useApiStore } from '@/store/useApiStore';
import Loader from '@/components/Loader';
import Link from 'next/link';

export default function ManagerDashboard() {
    const { data, loading, error, getDataToken } = useApiStore();

    useEffect(() => {
        getDataToken("/accounts/profile/");
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
                <div className="flex col-span-4 justify-center">
                    <div className="text-center text-red-500">Xatolik: {error.message || "Ma'lumotlarni yuklab bo'lmadi"}</div>
                </div>
            </div>
        );
    }

    if (!data || !data.data) {
        return (
            <div className='mb-[100px] grid grid-cols-4 gap-6 max-md:grid-cols-2 max-md:gap-3.5 max-md:px-4'>
                <div className="flex col-span-4 justify-center">
                    <div className="text-center">Ma'lumotlar topilmadi</div>
                </div>
            </div>
        );
    }

    const userData = data.data;

    return (
        <div>
            <div className="flex justify-between items-center">
                <div className="flex flex-col max-md:mt-6">
                    <Title
                        text={`Добро пожаловать, ${userData.first_name} ${userData.last_name}!`}
                        size={'text-[24px]'}
                        cls={"max-md:leading-[24px]"}
                    />
                    <p className='text-[#1E1E1E]/60 mt-4 max-md:text-sm max-md:leading-[120%]'>
                        Обзор текущей активности и задач на сегодня
                    </p>
                </div>
                {/* <div className="w-[54px] h-[54px] flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] relative !max-md:w-12 max-md:h-12">
                    <IoNotifications className='text-[#1E1E1E]/50' size={24} />
                    <div className="absolute w-4.5 h-4.5 flex items-center justify-center my-0 border bg-[#E1E2E2] border-[#1E1E1E]/50 rounded-full top-2.5 right-2 text-[#1E1E1E]/50 text-[10px]">
                        3
                    </div>
                </div> */}
            </div>

            <div className="grid grid-cols-3 gap-6 mt-6 max-md:grid-cols-1 max-md:gap-4">
                <SystemCart
                    img="/admin/icon1.svg"
                    title={userData.active_applications?.toString() || "0"}
                    text="Заявки, ожидающие выставления счёта"
                    imgSize="size-[38px]"
                />
                <SystemCart
                    img="/admin/icon2.svg"
                    title={userData.completed_this_month?.toString() || "0"}
                    text="Счета, ожидающие оплаты"
                    imgSize="size-[38px]"
                />
                <SystemCart
                    img="/admin/icon3.svg"
                    title={userData.awaiting_payment?.toString() || "0"}
                    text="Акты на подпись"
                    imgSize="size-[38px]"
                />
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6 max-md:grid-cols-1 max-md:gap-4">
                <div
                    className='p-6 rounded-[12px] bg-white flex flex-col'
                    style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
                >
                    <Title text={'Новый договор'} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mb-3"} />
                    <p className={`text-[#1E1E1E99] leading-[120%] grow max-md:text-sm mb-6`}>
                        Быстро создать новый договор для услуги по обслуживанию объекта
                    </p>
                    <Link href={'/roles/manager?tab=bills'}>
                        <Button
                            icon={<LuPlus />}
                            text={'Создать договор'}
                            className='h-[66px] w-full max-md:h-[56px] max-md:text-sm gap-x-2'
                        />
                    </Link>
                </div>

                <div
                    className='p-6 rounded-[12px] bg-white flex flex-col'
                    style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
                >
                    <Title text={'Журнал обслуживания'} color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"mb-3"} />
                    <p className={`text-[#1E1E1E99] leading-[120%] grow max-md:text-sm mb-6`}>
                        Подписать электронный журнал <br className="max-md:hidden" />
                        выполненных работ по объекту
                    </p>
                    <Link href={"/roles/manager?tab=jurnals"}>
                        <Button
                            icon={<FiEdit3 />}
                            text={'Подписать акты'}
                            className='h-[66px] w-full max-md:h-[56px] max-md:text-sm gap-2 bg-[#E2E2E2] !text-[#8E8E8E]'
                        />
                    </Link>
                </div>
            </div>

            <div
                className='px-6 pt-6 pb-8 w-full rounded-[12px] bg-white flex flex-col mt-6'
                style={{ boxShadow: '0px 0px 4px 0px #76767626' }}
            >
                <Title text={'Последняя активность'} size="text-lg max-md:text-base" />
                <div className="flex gap-4 items-center mt-6">
                    <div className="w-[50px] h-[50px] flex items-center justify-center bg-[#E2E2E2] rounded-[12px] text-[#1E1E1E99] text-[24px] max-md:hidden">?</div>
                    <div className="flex flex-col">
                        <h3 className='text-[#2C5AA0] mb-2 text-lg max-md:text-base'>Счет, ожидающий оплаты</h3>
                        <p className='text-[#1E1E1E99] mt-0 max-md:text-sm'>
                            Проверка системы пожаротушения - ТЦ "Мега"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}