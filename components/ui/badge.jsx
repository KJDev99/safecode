import Link from 'next/link'
import React from 'react'

export default function Badge({ link1 = 'Главная', link2, link3, adress1 = '/', adress2 = '/', className = "" }) {
    return (
        <div className={`text-white/60 tracking-[-1%] flex gap-[2px]  ${className}`}>
            <Link href={`/${adress1}`}>{link1}</Link>
            <p>/</p>
            {
                adress2
                    ? <Link href={`/${adress2}`}>{link2}</Link>
                    : <p>{link2}</p>
            }

            {
                link3 && <Link>{link3}</Link>
            }
        </div>
    )
}
