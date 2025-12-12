export default function SkeletonCard() {
    return (
        <div className="relative group animate-pulse">
            <div
                className="p-4 relative rounded-[12px] transition-all duration-300 w-full max-md:p-2 max-md:rounded-[8px] bg-white"
                style={{ boxShadow: "0px 0px 4px 0px #76767626" }}
            >
                {/* New Badge Skeleton */}
                <div className="absolute top-4 left-4 w-16 h-6 bg-gray-200 rounded-[6px] max-md:rounded-[4px]"></div>

                {/* Edit/Delete Buttons Skeleton */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                </div>

                {/* Product Image Skeleton */}
                <div className="w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-200"></div>

                {/* Product Info Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>

                {/* Stock Skeleton */}
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>

                {/* Price Skeleton */}
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
        </div>
    );
}