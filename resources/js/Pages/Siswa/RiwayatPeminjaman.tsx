import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import LencanaStatus from '@/Components/LencanaStatus';
import { BookOpen, Clock, CheckCircle2, Layers, Inbox } from 'lucide-react';

interface PeminjamanItem {
    id: number;
    buku?: {
        judul: string;
        penulis?: string;
    };
    tanggal_pinjam: string;
    tanggal_kembali: string;
    tanggal_pengembalian?: string;
    status: string;
    denda: number;
}

export default function RiwayatPeminjaman({ peminjaman = [] }: { peminjaman: PeminjamanItem[] }) {
    const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat' | 'semua'>('aktif');

    // Filter data berdasarkan tab aktif
    const filteredData = useMemo(() => {
        return peminjaman.filter((item) => {
            const status = item.status?.toLowerCase();
            if (activeTab === 'aktif') {
                return status === 'dipinjam' || status === 'terlambat';
            }
            if (activeTab === 'riwayat') {
                return status === 'dikembalikan' || status === 'selesai';
            }
            return true;
        });
    }, [peminjaman, activeTab]);

    const countAktif = peminjaman.filter((i) => ['dipinjam', 'terlambat'].includes(i.status?.toLowerCase())).length;
    const countRiwayat = peminjaman.filter((i) => ['dikembalikan', 'selesai'].includes(i.status?.toLowerCase())).length;

    return (
        <SiswaLayout>
            <Head title="Riwayat Peminjaman & Denda" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        Riwayat Peminjaman & Denda Saya
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Pantau buku yang sedang dipinjam, batas pengembalian, serta rincian denda keterlambatan.
                    </p>
                </div>

                {/* Tab Navigasi Filter */}
                <div className="flex border-b border-slate-200/80 dark:border-slate-800 gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('aktif')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'aktif'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" /> Peminjaman Aktif
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20">
                            {countAktif}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('riwayat')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'riwayat'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Riwayat Selesai
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                            {countRiwayat}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('semua')}
                        className={`pb-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                            activeTab === 'semua'
                                ? 'text-teal-600 dark:text-teal-400 border-teal-500 font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent'
                        }`}
                    >
                        <Layers className="w-3.5 h-3.5" /> Semua Riwayat
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                            {peminjaman.length}
                        </span>
                    </button>
                </div>

                {/* Tabel Riwayat Peminjaman & Denda */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Judul Buku</th>
                                    <th className="p-4">Tgl Pinjam</th>
                                    <th className="p-4">Batas Kembali</th>
                                    <th className="p-4">Tgl Dikembalikan</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Denda</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                {item.buku?.judul || 'Buku Tidak Diketahui'}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pinjam || '-'}
                                            </td>
                                            <td className="p-4 font-medium text-rose-600 dark:text-rose-400">
                                                {item.tanggal_kembali || '-'}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pengembalian || '-'}
                                            </td>
                                            <td className="p-4">
                                                <LencanaStatus status={item.status} />
                                            </td>
                                            <td className="p-4 font-mono font-bold">
                                                {item.denda && item.denda > 0 ? (
                                                    <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                                                        Rp {item.denda.toLocaleString('id-ID')}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-10 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs font-medium">Tidak ada data riwayat peminjaman pada kategori ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </SiswaLayout>
    );
}