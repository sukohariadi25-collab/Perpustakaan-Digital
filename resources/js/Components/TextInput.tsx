import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function TextInput({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:focus:border-teal-500 transition-all outline-none ${className}`}
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
        </div>
    );
}