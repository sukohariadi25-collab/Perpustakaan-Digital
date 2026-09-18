import React from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { QrCode, CheckCircle2, AlertCircle, ScanLine, ArrowRight, ArrowLeft} from 'lucide-react';

export default function Transaksi() {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const { data, setData, post, processing, errors } = useForm({
        kode_pemesanan: '',
    });

    const handleProses = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/peminjaman/scan');
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
                {/* Alert Notifikasi */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold shadow-sm flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold shadow-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                <div className="bg-white dark:bg-[#111622] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-6">
                    <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                        <QrCode className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Scan / Input Kode Pemesanan
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Arahkan scanner ke QR Code siswa atau masukkan kode pesanan secara manual.
                        </p>
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
                            className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <ScanLine className="w-4 h-4" />
                            {processing ? 'Memproses...' : 'Proses Penyerahan Buku'}
                        </button>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}