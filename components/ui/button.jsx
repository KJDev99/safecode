import React from "react";

export default function Button({ text, icon, className = "", onClick }) {
    const baseClasses =
        "flex items-center justify-center bg-[#2C5AA0] text-[white] rounded-[12px] text-sm cursor-pointer transition-all duration-200 tracking-[-1%]";

    return (
        <button
            className={`${baseClasses} ${className}`}
            onClick={onClick}
        >
            {icon && <span className="text-base">{icon}</span>}
            {text}
        </button>
    );
}
