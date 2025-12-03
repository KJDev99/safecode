'use client';

import InspectorsContent from '@/components/role/inspectors/inspectors-content';
import ManagerContent from '@/components/role/manager/manager-content';
import Badge from '@/components/ui/badge';
import { Suspense } from 'react';

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

export default function Manager() {
    return (
        <>
            <div className="max-w-[1200px] mx-auto mt-8 max-md:px-6">
                <Suspense fallback={<CustomerLoading />}>
                    <ManagerContent />
                </Suspense>
            </div>
        </>
    );
}