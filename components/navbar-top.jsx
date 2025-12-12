"use client"
import React, { useEffect, useState, useCallback, useRef } from 'react'
import Button from './ui/button'
import { IoSearchSharp } from "react-icons/io5";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useRouter } from 'next/navigation';
import { useApiStore } from '@/store/useApiStore';
import debounce from 'lodash/debounce';

export default function NavbarTop() {
    const [isAuth, setIsAuth] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { getDataToken } = useApiStore();
    const searchRef = useRef(null);

    const totalItems = useCartStore((state) => state.getTotalItems());
    const totalFavorites = useFavoritesStore((state) => state.getTotalFavorites());

    const checkAuth = () => {
        const auth = localStorage.getItem("isAuthenticated");
        setIsAuth(auth === "true");
    };

    // Click outside to close results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounced search function
    const performSearch = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSearchResults([]);
                setShowResults(false);
                return;
            }

            setLoading(true);
            try {
                const response = await getDataToken(`/products/?name=${encodeURIComponent(query)}&limit=8`);

                if (Array.isArray(response?.data)) {
                    setSearchResults(response.data);
                    setShowResults(true);
                } else if (Array.isArray(response)) {
                    setSearchResults(response.slice(0, 8));
                    setShowResults(true);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        [getDataToken]
    );

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        performSearch(query);
    };

    // Handle search result click
    const handleResultClick = (productId) => {
        router.push(`/products/${productId}`);
        setShowResults(false);
        setSearchQuery('');
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowResults(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        checkAuth();

        window.addEventListener("authChanged", checkAuth);

        return () => {
            window.removeEventListener("authChanged", checkAuth);
            performSearch.cancel();
        };
    }, [performSearch]);

    if (!isAuth) return null;

    return (
        <div className='h-25 w-[1200px] mx-auto flex items-center gap-4 max-md:hidden'>
            <Link href={'/catalog'}>
                <Button icon={<RxHamburgerMenu />} className='h-15 w-[340px] gap-2' text={"Каталог товаров"} />
            </Link>

            <div className="relative grow-1" ref={searchRef}>
                <div className="flex border border-[#1E1E1E99] px-8 py-4 rounded-[12px] grow-1 items-center">
                    <input
                        placeholder='Введите артикул, слово или фразу'
                        className='text-[#1E1E1E99] grow-1 outline-0 bg-transparent'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress}
                        onFocus={() => searchQuery.trim() && setShowResults(true)}
                    />
                    <IoSearchSharp className='text-[#1E1E1E99] text-xl' />
                </div>

                {/* Search Results Dropdown */}
                {showResults && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">
                                Поиск...
                            </div>
                        ) : searchResults.length > 0 ? (
                            <div>
                                {searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                                        onClick={() => handleResultClick(product.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Product Image */}
                                            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                                {product?.images_list?.[0] || product?.images?.[0] ? (
                                                    <img
                                                        src={typeof product.images_list?.[0] === 'string'
                                                            ? product.images_list[0]
                                                            : product.images_list?.[0]?.image ||
                                                            product.images_list?.[0]?.image_url ||
                                                            product.images?.[0]?.image ||
                                                            "/cart.png"
                                                        }
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                        <span className="text-xs text-gray-400">Нет фото</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-gray-600">
                                                        Арт: {product.article || 'Нет'}
                                                    </span>
                                                    <span className="text-sm text-gray-600">
                                                        • {product.price ? `${product.price} ₽` : 'Цена не указана'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Show more link */}
                                {/* {searchQuery.trim() && (
                                    <div
                                        className="p-4 text-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => {
                                            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                            setShowResults(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <span className="text-blue-600 hover:text-blue-800 font-medium">
                                            Показать все результаты для "{searchQuery}"
                                        </span>
                                    </div>
                                )} */}
                            </div>
                        ) : searchQuery.trim() ? (
                            <div className="p-4 text-center text-gray-500">
                                Ничего не найдено по запросу "{searchQuery}"
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            <Link href="/favorites">
                <div className="w-15 h-15 flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] relative cursor-pointer hover:bg-[#C5C5C5]/70 transition-all">
                    <FaHeart className='text-[#1E1E1E]/50' size={24} />
                    {totalFavorites > 0 && (
                        <div className="absolute w-4.5 h-4.5 flex items-center justify-center my-0 border bg-[#E1E2E2] border-[#1E1E1E]/50 rounded-full top-2.5 right-2 text-[#1E1E1E]/50 text-[10px]">
                            {totalFavorites > 99 ? '99+' : totalFavorites}
                        </div>
                    )}
                </div>
            </Link>
            <div
                className="w-15 h-15 flex items-center justify-center bg-[#C5C5C5]/50 rounded-[10px] relative cursor-pointer hover:bg-[#C5C5C5]/70 transition-all"
                onClick={() => router.push('/cart')}
            >
                <FaShoppingCart className='text-[#1E1E1E]/50' size={24} />
                {totalItems > 0 && (
                    <div className="absolute w-4.5 h-4.5 flex items-center justify-center my-0 border bg-[#E1E2E2] border-[#1E1E1E]/50 rounded-full top-2.5 right-2 text-[#1E1E1E]/50 text-[10px]">
                        {totalItems > 99 ? '99+' : totalItems}
                    </div>
                )}
            </div>
        </div>
    )
}