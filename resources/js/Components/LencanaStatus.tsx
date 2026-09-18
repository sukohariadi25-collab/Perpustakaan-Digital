import React from 'react';

interface Props {
    status: string;
}

export default function LencanaStatus({ status }: Props) {
    const dapatkanGaya = (st: string) => {
        switch (st.toLowerCase()) {
            case 'tersedia':
            case 'kembali':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'dipinjam':
            case 'diambil':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'dipesan':
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'terlambat':
            case 'hilang':
            case 'kadaluarsa':
            case 'dibatalkan':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${dapatkanGaya(status)} uppercase tracking-wider`}>
            {status}
        </span>
    );
}