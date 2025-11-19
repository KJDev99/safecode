// app/roles/customer/page.js
'use client';

import NavbarTop from '@/components/navbar-top';
import CustomerContent from '@/components/role/customer/customer-content';
import Badge from '@/components/ui/badge';
import { Suspense } from 'react';

// Loading komponenti
function CustomerLoading() {
    return (
        <div className="grid grid-cols-4 mt-8 mb-[100px]">
            <div className="col-span-1 bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
            </div>
        </div>
    );
}

export default function Customer() {
    return (
        <>
            <NavbarTop />
            <div className="max-w-[1200px] mx-auto mt-8">
                <Badge link2={'Дашборд'} adress2='roles/customer' color={'text-[#1E1E1E]/60'} />
                <Suspense fallback={<CustomerLoading />}>
                    <CustomerContent />
                </Suspense>
            </div>
        </>
    );
}