"use client"
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Input({ className, placeholder, text, label, type = 'text' }) {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleNumberInput = (e) => {
        const value = e.target.value;
        if (/^[0-9+]*$/.test(value)) {
            setInputValue(value);
        }
    };

    const getInputType = () => {
        if (type === 'password') {
            return showPassword ? 'text' : 'password';
        }
        return 'text';
    };

    const handleInputChange = (e) => {
        if (type === 'number') {
            handleNumberInput(e);
        } else {
            setInputValue(e.target.value);
        }
    };

    return (
        <div>
            {label && <label className='mb-4 text-[#1E1E1E80]'>{label}</label>}

            <div className="relative">
                <input
                    type={getInputType()}
                    className={`border-1 border-[#1E1E1E]/50 px-6 py-6 rounded-[12px] w-full h-[66px] outline-0 ${className}`}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={20} className='max-md:text-base' /> : <AiOutlineEye size={20} className='max-md:text-base' />}
                    </button>
                )}
            </div>

            {
                text && <p className='mt-2 text-xs text-[#1E1E1E99]'>{text}</p>
            }
        </div>
    );
}