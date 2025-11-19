"use client"
import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

export default function SelectInput({
    className,
    placeholder,
    text,
    label,
    options = [],
    value,
    onChange,
    required = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        setIsOpen(false);
        if (onChange) {
            onChange(option.value);
        }
    };

    const getSelectedLabel = () => {
        const selectedOption = options.find(opt => opt.value === value);
        return selectedOption ? selectedOption.label : '';
    };

    return (
        <div ref={selectRef} className="w-full">
            {label && <label className='mb-4 text-[#1E1E1E80] block'>{label}</label>}

            <div className="relative">
                <div
                    className={`border-1 border-[#1E1E1E]/50 px-6 py-6 rounded-[12px] w-full h-[66px] outline-0 flex items-center cursor-pointer bg-white ${className} ${required && !value ? '' : ''
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={`flex-1 ${!value ? 'text-gray-400' : 'text-black'}`}>
                        {value ? getSelectedLabel() : placeholder}
                    </span>

                    <IoIosArrowDown
                        size={20}
                        className={`transition-transform duration-200 text-[#1E1E1E80] ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-[100] top-full left-0 right-0 mt-1 bg-white border-1 border-[#1E1E1E]/50 rounded-[12px] shadow-lg max-h-60 overflow-y-auto">
                        {options.length > 0 ? (
                            options.map((option, index) => (
                                <div
                                    key={option.value}
                                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${value === option.value ? 'bg-blue-50 text-blue-600' : ''
                                        } ${index !== options.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-4 text-gray-500 text-center">
                                Нет доступных опций
                            </div>
                        )}
                    </div>
                )}
            </div>

            {text && <p className='mt-2 text-xs text-[#1E1E1E99]'>{text}</p>}
        </div>
    );
}