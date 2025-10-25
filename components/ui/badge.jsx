import Link from 'next/link'
import React from 'react'

export default function Badge({ link1 = 'Главная', link2, link3, adress1 = '/', adress2 = '/', className = "", color }) {
    return (
        <div className={`tracking-[-1%] flex text-nowrap overflow-x-hidden ${className} ${color ? color : 'text-white/60 '}`}>
            <Link href={`/${adress1}`}>{link1}</Link>
            <p>&nbsp;/&nbsp;</p>
            {
                adress2
                    ? <Link href={`/${adress2}`}>{link2}</Link>
                    : <p>{link2}</p>
            }

            {
                link3 && <Link href={''} className='flex'>&nbsp;<p>/</p>&nbsp;{link3}</Link>
            }
        </div>
    )
}
