import React, { useState, useEffect } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import QrScannerModal from '@/Components/QrScannerModal';
import {
    QrCode,
    CheckCircle2,
    AlertCircle,
    ScanLine,
    ArrowLeft,
    Camera,
    X
} from 'lucide-react';

export default function Transaksi() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    // State untuk Pop-up Modal Notifikasi (Sukses/Gagal)
    const [notificationModal, setNotificationModal] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        message: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm({
        kode_pemesanan: '',
    });

    // Otomatis memunculkan Pop-up Modal saat mendapat flash response dari backend
    useEffect(() => {
        if (flash?.success) {
            setNotificationModal({
                isOpen: true,
                type: 'success',
                message: flash.success,
            });
            reset('kode_pemesanan'); // Reset input setelah berhasil
        } else if (flash?.error) {
            setNotificationModal({
                isOpen: true,
                type: 'error',
                message: flash.error,
            });
        }
    }, [flash]);

   const handleProses = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data.kode_pemesanan.trim()) return;

    post('/admin/peminjaman/scan', {
        preserveScroll: true,
        onError: (err) => {
            console.error('Error Validasi / Request:', err);
        },
    });
};

    // Callback saat kamera berhasil membaca QR Code / Barcode
    const handleScanSuccess = (scannedText: string) => {
        const cleanCode = scannedText.trim().toUpperCase();
        setData('kode_pemesanan', cleanCode);
        setIsScannerOpen(false);
    };

    return (
        <AdminLayout>
            <Head title="Scan Transaksi Peminjaman" />

            <div className="max-w-xl mx-auto space-y-6 pt-4">
                {/* Tombol Kembali */}
                <div>
                    <Link
                        href="/admin/peminjaman"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Halaman Peminjaman
                    </Link>
                </div>

                <div className="bg-white dark:bg-[#111622] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-6">
                    <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <QrCode className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Scan / Input Kode Pemesanan
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Arahkan kamera/scanner ke QR Code siswa atau masukkan kode pesanan secara manual.
                        </p>
                    </div>

                    {/* Tombol Buka Scanner Kamera */}
                    <button
                        type="button"
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-teal-600 dark:text-teal-400 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Camera className="w-4 h-4" />
                        Buka Scanner Kamera QR
                    </button>

                    <div className="relative flex py-1 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Atau ketik manual / scanner gun
                        </span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    </div>

                    <form onSubmit={handleProses} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                autoFocus
                                placeholder="Contoh: PSN-CA949E"
                                value={data.kode_pemesanan}
                                onChange={(e) =>
                                    setData('kode_pemesanan', e.target.value.trim().toUpperCase())
                                }
                                className="w-full text-center text-xl font-mono tracking-widest py-3 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none uppercase"
                                required
                            />
                            {errors.kode_pemesanan && (
                                <p className="text-xs text-rose-500 mt-1.5">{errors.kode_pemesanan}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                        >
                            <ScanLine className="w-4 h-4" />
                            {processing ? 'Memproses...' : 'Proses Penyerahan Buku'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal Kamera Scanner */}
            <QrScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
                title="Scan QR Code Tiket Reservasi Siswa"
            />

            {/* Modal Pop-up Notifikasi Hasil Scan / Transaksi */}
            {notificationModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-center relative">
                        <button
                            onClick={() => setNotificationModal((prev) => ({ ...prev, isOpen: false }))}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex justify-center pt-2">
                            {notificationModal.type === 'success' ? (
                                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                            ) : (
                                <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                                    <AlertCircle className="w-12 h-12" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {notificationModal.type === 'success' ? 'Berhasil!' : 'Gagal!'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {notificationModal.message}
                            </p>
                        </div>

                        <button
                            onClick={() => setNotificationModal((prev) => ({ ...prev, isOpen: false }))}
                            className={`w-full py-2.5 font-bold text-xs rounded-xl text-white transition-all ${
                                notificationModal.type === 'success'
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-rose-500 hover:bg-rose-600'
                            }`}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}