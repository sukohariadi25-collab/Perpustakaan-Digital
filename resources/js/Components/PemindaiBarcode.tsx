import React, { useState } from 'react';

interface Props {
    onScan: (code: string) => void;
}

export default function PemindaiBarcode({ onScan }: Props) {
    const [inputKode, setInputKode] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputKode.trim()) {
                onScan(inputKode.trim());
                setInputKode('');
            }
        }
    };

    return (
        <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pemindai Barcode / RFID</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <input
                type="text"
                value={inputKode}
                onChange={(e) => setInputKode(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Arahkan pemindai ke barcode atau ketik kode lalu tekan Enter..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                autoFocus
            />
        </div>
    );
}