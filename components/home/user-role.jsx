import React from 'react'
import Title from '../ui/title'

export default function UserRole() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            <Title text='Роли пользователей системы' cls="mb-8 max-md:mb-6" />
            <div className='p-12 rounded-[12px] relative max-md:p-6' style={{ boxShadow: '0px 0px 4px 0px #76767626' }}>
                <div className="border-l-2 border-[rgba(30,30,30,0.2)] h-[535px] absolute max-md:h-[620px]">
                </div>
                <div className="">
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-7 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[22px] max-md:w-[22px]"></div>
                            <Title text='Администратор' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[46px] max-md:ml-[46px]`}> Управляет системой, настраивает роли, контролирует техническое состояние, обрабатывает заявки поддержки </p>
                    </div>
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-7 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[172px] max-md:w-[22px]"></div>
                            <Title text='Дежурный инженер' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[196px] max-md:ml-[46px]`}> Координирует работу бригад, создает QR-коды, распределяет задачи, контролирует загрузку инженеров</p>
                    </div>
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-7 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[322px] max-md:w-[22px]"></div>
                            <Title text='Обслуживающий инженер' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[346px] max-md:ml-[46px]`}> Ведет карточки объектов, формирует дефективные ведомости, получает и выполняет заявки от заказчиков</p>
                    </div>
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-7 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[472px] max-md:w-[22px]"></div>
                            <Title text='Менеджер' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[496px] max-md:ml-[46px]`}> Формирует коммерческие предложения, контролирует договора, взаимодействует с инспекторами МЧС</p>
                    </div>
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-7 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[622px] max-md:w-[22px]"></div>
                            <Title text='Заказчик' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[646px] max-md:ml-[46px]`}> Отслеживает активность по своим объектам, создает заявки на обслуживание, контролирует выполнение работ</p>
                    </div>
                    <div className="flex flex-col  min-h-[70px] max-md:min-h-[98px] max-md:mb-6 mb-0 translate-y-[-12px]">
                        <div className="flex items-center gap-6">
                            <div className="border-1 border-[rgba(30,30,30,0.2)] w-[22px] max-md:w-[22px]"></div>
                            <Title text='Инспектор МЧС' color="text-[#2C5AA0]" size="text-lg max-md:text-base" cls={"my-0"} />
                        </div>
                        <p className={`text-[#1E1E1E99] max-md:text-sm max-w-[455px] leading-[120%] grow mt-3 ml-[46px] max-md:ml-[46px]`}> Получает доступ к данным по объектам, проверяет документооборот, контролирует соблюдение требований</p>
                    </div>


                </div>
            </div>
        </div>
    )
}
