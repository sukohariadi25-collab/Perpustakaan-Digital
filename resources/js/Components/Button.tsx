import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export default function Tombol({ children, isLoading, className = '', ...props }: Props) {
    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
        >
            {isLoading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Memproses...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}