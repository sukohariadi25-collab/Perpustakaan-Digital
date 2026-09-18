import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Check, X, Clock, CheckCircle2, XCircle, Ticket, Inbox } from 'lucide-react';

interface PemesananItem {
    id: number;
    kode_pemesanan: string;
    nama_pemesan: string;
    kelas_pemesan: string;
    judul_buku: string;
    buku_stok: number;
    tanggal_pesan: string;
    status: string;
}

export default function PemesananIndex({ pemesanan = [] }: { pemesanan: PemesananItem[] }) {
    const [activeTab, setActiveTab] = useState<'pending' | 'selesai' | 'dibatalkan' | 'semua'>('pending');

    const handleSerahkan = (id: number) => {
        if (confirm('Konfirmasi penyerahan buku fisik kepada siswa?')) {
            router.post(`/admin/pemesanan/${id}/serahkan`);
        }
    };

    const handleBatalkan = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
            router.post(`/admin/pemesanan/${id}/batalkan`);
        }
    };

    const filteredData = pemesanan.filter((item) => {
        if (activeTab === 'semua') return true;
        return item.status === activeTab;
    });

    const countPending = pemesanan.filter((i) => i.status === 'pending').length;
    const countSelesai = pemesanan.filter((i) => i.status === 'selesai').length;
    const countDibatalkan = pemesanan.filter((i) => i.status === 'dibatalkan').length;

    return (
        <AdminLayout>
            <Head title="Daftar Pemesanan Buku" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        Daftar Pemesanan Buku
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola permohonan reservasi buku sebelum diambil oleh siswa di perpustakaan.
                    </p>
                </div>

                {/* Tab Filter */}
                <div className="flex border-b border-slate-200/80 dark:border-slate-800 gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'pending'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" /> Pending / Menunggu
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
                            {countPending}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('selesai')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'selesai'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai (Diambil)
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                            {countSelesai}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('dibatalkan')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'dibatalkan'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <XCircle className="w-3.5 h-3.5" /> Dibatalkan
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
                            {countDibatalkan}
                        </span>
                    </button>
                </div>

                {/* Tabel Data Pemesanan */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Kode Tiket</th>
                                    <th className="p-4">Pemesan</th>
                                    <th className="p-4">Judul Buku</th>
                                    <th className="p-4">Waktu Pesan</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Ticket className="w-3.5 h-3.5 text-teal-500" />
                                                    {item.kode_pemesanan}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 dark:text-white">
                                                    {item.nama_pemesan}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    Kelas: {item.kelas_pemesan}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                                                {item.judul_buku}
                                            </td>
                                            <td className="p-4 text-slate-400 text-[11px]">
                                                {item.tanggal_pesan}
                                            </td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                                        item.status === 'pending'
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                            : item.status === 'selesai'
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                                                    }`}
                                                >
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.status === 'pending' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleSerahkan(item.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
                                                        >
                                                            <Check className="w-3.5 h-3.5" /> Serahkan
                                                        </button>
                                                        <button
                                                            onClick={() => handleBatalkan(item.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-semibold rounded-lg text-[11px] transition-colors border border-rose-500/20"
                                                        >
                                                            <X className="w-3.5 h-3.5" /> Batalkan
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">
                                                        Tidak ada aksi
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Tidak ada pemesanan pada status ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}