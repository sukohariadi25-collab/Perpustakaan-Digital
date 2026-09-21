import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { X, Camera, QrCode } from 'lucide-react';

interface QrScannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanSuccess: (decodedText: string) => void;
    title?: string;
}

export default function QrScannerModal({
    isOpen,
    onClose,
    onScanSuccess,
    title = 'Scan QR / Barcode Kode Buku atau Siswa',
}: QrScannerModalProps) {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Inisialisasi Html5QrcodeScanner saat modal terbuka
            const scanner = new Html5QrcodeScanner(
                'qr-reader-container',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                    formatsToSupport: [
                        Html5QrcodeSupportedFormats.QR_CODE,
                        Html5QrcodeSupportedFormats.CODE_128,
                        Html5QrcodeSupportedFormats.CODE_39,
                        Html5QrcodeSupportedFormats.EAN_13,
                        Html5QrcodeSupportedFormats.EAN_8,
                        Html5QrcodeSupportedFormats.UPC_A,
                    ],
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    // Ketika scan berhasil
                    onScanSuccess(decodedText);
                    scanner.clear();
                    onClose();
                },
                (errorMessage) => {
                    // Mengabaikan error pemindaian per frame
                }
            );

            scannerRef.current = scanner;
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err) => console.error(err));
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#111622] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200/80 dark:border-slate-800 relative">
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-teal-500" />
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Container Kamera */}
                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900">
                    <div id="qr-reader-container" className="w-full text-white text-xs"></div>
                </div>

                {/* Petunjuk */}
                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl text-[11px] text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <Camera className="w-4 h-4 flex-shrink-0" />
                    <span>Arahkan kamera ke QR Code atau Barcode pada kartu anggota / fisik buku.</span>
                </div>
            </div>
        </div>
    );
}