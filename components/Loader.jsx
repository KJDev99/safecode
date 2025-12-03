import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

export default function Loader() {
    return (
        <div className='fixed left-0 top-0 h-screen w-full bg-[#1E1E1E]/80 flex items-center justify-center' >
            <InfinitySpin
                width="200"
                color="#2C5AA0"
            /></div>
    )
}
