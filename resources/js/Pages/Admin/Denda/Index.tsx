import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Coins, 
    AlertCircle, 
    CheckCircle2, 
    FileDown, 
    Inbox, 
    Calendar,
    Search
} from 'lucide-react';

interface DendaItem {
    id: number;
    nama_siswa: string;
    judul_buku: string;
    tanggal_pinjam: string;
    batas_kembali: string;
    tanggal_pengembalian?: string;
    status: string;
    denda: number;
}

interface DendaIndexProps {
    peminjamanDenda: DendaItem[];
}

export default function Index({ peminjamanDenda = [] }: DendaIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter pencarian berdasarkan nama siswa atau judul buku
    const filteredData = peminjamanDenda.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.nama_siswa?.toLowerCase().includes(query) ||
            item.judul_buku?.toLowerCase().includes(query)
        );
    });

   // Kalkulasi Statistik Ringkas yang aman dari error TypeScript
    const totalDendaNominal = peminjamanDenda.reduce((acc: number, curr: DendaItem) => {
        return acc + (Number(curr.denda) || 0);
    }, 0);

    const jumlahKasusDenda = peminjamanDenda.length;

    // Handler Export PDF Laporan Denda
    const handleExportPdf = () => {
        window.open('/admin/denda/export', '_blank');
    };

    return (
        <AdminLayout>
            <Head title="Rekapitulasi & Manajemen Denda" />

            <div className="space-y-6">
                {/* Header & Tombol Export */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Coins className="w-5 h-5 text-amber-500" />
                            Rekapitulasi & Manajemen Denda
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Pusat pemantauan sanksi keterlambatan, denda kerusakan, dan rekapitulasi keuangan perpustakaan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleExportPdf}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold text-xs rounded-xl transition-all shadow-sm"
                    >
                        <FileDown className="w-4 h-4" /> Cetak Laporan Denda (PDF)
                    </button>
                </div>

                {/* Kartu Statistik Ringkas (KPI Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Total Akumulasi Denda Tercatat</p>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                                Rp {totalDendaNominal.toLocaleString('id-ID')}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Total Kasus Keterlambatan / Denda</p>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                {jumlahKasusDenda} Transaksi
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Input Pencarian */}
                <div className="flex items-center gap-2 bg-white dark:bg-[#111622] px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-sm">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama siswa atau judul buku..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none border-none p-0"
                    />
                </div>

                {/* Tabel Data Denda */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Nama Siswa</th>
                                    <th className="p-4">Judul Buku</th>
                                    <th className="p-4">Tgl Pinjam</th>
                                    <th className="p-4">Batas Kembali</th>
                                    <th className="p-4">Tgl Dikembalikan</th>
                                    <th className="p-4">Status Buku</th>
                                    <th className="p-4">Nominal Denda</th>
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
                                                {item.nama_siswa}
                                            </td>
                                            <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                                {item.judul_buku}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pinjam || '-'}
                                            </td>
                                            <td className="p-4 font-medium text-rose-600 dark:text-rose-400">
                                                {item.batas_kembali || '-'}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pengembalian || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    item.status === 'terlambat'
                                                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                                                {item.denda > 0 ? `Rp ${item.denda.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs font-medium">Tidak ada data denda atau keterlambatan yang ditemukan.</p>
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