'use client'
import React from 'react'
import Title from '../ui/title'
import Image from 'next/image'
import { motion } from "framer-motion"

const partners = [
    { id: 1, src: '/partners/partners1.png', alt: 'partners1' },
    { id: 2, src: '/partners/partners2.png', alt: 'partners2' },
    { id: 3, src: '/partners/partners3.png', alt: 'partners3' },
    { id: 4, src: '/partners/partners4.png', alt: 'partners4' },
    { id: 5, src: '/partners/partners5.png', alt: 'partners5' },
]

export default function PartnersHero() {
    return (
        <div className='max-w-[1200px] mx-auto my-[100px] max-md:my-[50px] max-md:px-6'>
            <Title text='Партнеры' cls='mb-8 max-md:mb-6' />
            <div className="relative">
                <div className="overflow-hidden">
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: '-100%' }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
                        whileHover={{ animationPlayState: 'paused' }}
                        className="flex gap-4"
                    >
                        {[...partners, ...partners].map((partner, index) => (
                            <div key={`first-${partner.id}-${index}`} className="flex-shrink-0">
                                <Image
                                    src={partner.src}
                                    alt={partner.alt}
                                    width={221}
                                    height={89}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="overflow-hidden max-md:hidden mt-6">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
                        whileHover={{ animationPlayState: 'paused' }}
                        className="flex gap-4"
                    >
                        {[...partners, ...partners].map((partner, index) => (
                            <div key={`second-${partner.id}-${index}`} className="flex-shrink-0">
                                <Image
                                    src={partner.src}
                                    alt={partner.alt}
                                    width={221}
                                    height={89}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}