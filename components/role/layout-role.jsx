'use client';

import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Button from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayoutRole({
    sections,
    activeItem: externalActiveItem,
    onItemClick,
    bottomItems = []
}) {
    const currentSections = sections;
    const [openSections, setOpenSections] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Ekran o'lchamini kuzatish
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (currentSections.length > 0) {
            setOpenSections(currentSections.map(s => s.id));
        }
    }, [currentSections]);

    // Item tanlanganida mobil menyu yopiladi
    useEffect(() => {
        if (isMobile && externalActiveItem) {
            setIsMobileMenuOpen(false);
        }
    }, [externalActiveItem, isMobile]);

    const toggleSection = (sectionId) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleItemClick = (itemId) => {
        onItemClick?.(itemId);
        // Mobil bo'lsa va item tanlansa menyu yopiladi
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    const getButtonClass = (item, isActive) => {
        const baseClass = 'w-full h-[60px] justify-start px-6 transition-all duration-200';

        if (item.isDanger) {
            return `${baseClass} bg-transparent !text-[#D9272799] border border-[#D9272799]`;
        }
        if (isActive) {
            return `${baseClass} bg-[#1E1E1E] !text-white border border-[#1E1E1E]`;
        }
        return `${baseClass} bg-transparent !text-[#1E1E1E99] border border-[#1E1E1E99]`;
    };

    // Faol bo'lgan itemni topish
    const findActiveItem = () => {
        for (let section of currentSections) {
            const activeItem = section.items.find(item => item.id === externalActiveItem);
            if (activeItem) return activeItem;
        }

        const bottomActiveItem = bottomItems.find(item => item.id === externalActiveItem);
        if (bottomActiveItem) return bottomActiveItem;

        return null;
    };

    const activeItem = findActiveItem();

    return (
        <div className='w-full rounded-[12px] h-max p-8 space-y-4 relative' style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
            {/* Mobile uchun - faqat tanlangan item */}
            {isMobile && !isMobileMenuOpen && activeItem && (
                <div className="space-y-4">
                    <div className="cursor-pointer">
                        <Button
                            text={activeItem.text}
                            className={getButtonClass(activeItem, true)}
                        />
                    </div>
                </div>
            )}

            {/* Asosiy kontent - PC uchun har doim, mobil uchun faqat menyu ochiq bo'lganda */}
            {(isMobileMenuOpen || !isMobile) && (
                <div className="space-y-4">
                    {currentSections.map((section) => (
                        <div key={section.id} className="space-y-4">
                            <motion.div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection(section.id)}
                            >
                                <h2 className='text-[#1E1E1E] font-medium'>{section.title}</h2>
                                <motion.div
                                    animate={{ rotate: openSections.includes(section.id) ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <IoIosArrowDown className='text-[#1E1E1E]' />
                                </motion.div>
                            </motion.div>

                            <AnimatePresence>
                                {openSections.includes(section.id) && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {section.items.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleItemClick(item.id)}
                                                className="cursor-pointer"
                                            >
                                                <Button
                                                    text={item.text}
                                                    className={getButtonClass(item, externalActiveItem === item.id)}
                                                />
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    <div className="flex flex-col mt-8 space-y-4">
                        {bottomItems.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className="cursor-pointer"
                            >
                                <Button
                                    text={item.text}
                                    className={getButtonClass(item, externalActiveItem === item.id)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobil menyu - absolute positionda, ustiga chiqadi */}
            <AnimatePresence>
                {isMobile && isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0 left-0 right-0 bg-white rounded-[12px] p-8 space-y-4 z-50"
                        style={{ boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.2)" }}
                    >
                        {currentSections.map((section) => (
                            <div key={section.id} className="space-y-4">
                                <motion.div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection(section.id)}
                                >
                                    <h2 className='text-[#1E1E1E] font-medium'>{section.title}</h2>
                                    <motion.div
                                        animate={{ rotate: openSections.includes(section.id) ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IoIosArrowDown className='text-[#1E1E1E]' />
                                    </motion.div>
                                </motion.div>

                                <AnimatePresence>
                                    {openSections.includes(section.id) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-2 overflow-hidden"
                                        >
                                            {section.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleItemClick(item.id)}
                                                    className="cursor-pointer"
                                                >
                                                    <Button
                                                        text={item.text}
                                                        className={getButtonClass(item, externalActiveItem === item.id)}
                                                    />
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        <div className="flex flex-col mt-8 space-y-4">
                            {bottomItems.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className="cursor-pointer"
                                >
                                    <Button
                                        text={item.text}
                                        className={getButtonClass(item, externalActiveItem === item.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='flex flex-col md:hidden'>
                <motion.div
                    className="flex items-center justify-center  gap-2 cursor-pointer"
                    onClick={toggleMobileMenu}
                    whileTap={{ scale: 0.95 }}
                >

                    <p className='text-sm text-[#1E1E1E]'>{isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}</p>

                    <motion.div
                        animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IoIosArrowDown className='text-[#1E1E1E] text-xl' />
                    </motion.div>
                </motion.div>
            </div>

        </div>
    );
}