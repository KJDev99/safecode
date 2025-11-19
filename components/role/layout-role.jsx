'use client';

import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import Button from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function LayoutRole({
    sections,
    activeItem: externalActiveItem,
    onItemClick,
    bottomItems = [
        { id: 'settings', text: 'Настройки' },
        { id: 'logout', text: 'Выйти', isDanger: true }
    ]
}) {
    const currentSections = sections
    const [openSections, setOpenSections] = useState([]);

    useEffect(() => {
        if (currentSections.length > 0) {
            setOpenSections(currentSections.map(s => s.id));
        }
    }, [currentSections]);

    const toggleSection = (sectionId) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
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

    return (
        <div className='w-full rounded-[12px] p-8 space-y-4' style={{ boxShadow: "0px 0px 4px 0px #76767626" }}>
            {currentSections.map((section) => (
                <div key={section.id} className="space-y-4">
                    <motion.div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection(section.id)}
                    >
                        <h2 className='text-[#1E1E1E] font-medium'>{section.title}</h2>
                        <motion.div
                            animate={{ rotate: openSections.includes(section.id) ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
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
                                className="space-y-2 overflow-hidden"
                            >
                                {section.items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => onItemClick?.(item.id)}
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
                        onClick={() => onItemClick?.(item.id)}
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
    );
}