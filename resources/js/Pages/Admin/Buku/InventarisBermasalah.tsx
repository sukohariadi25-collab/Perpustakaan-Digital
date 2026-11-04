import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertTriangle, ShieldAlert, Wrench, Search, Inbox, BookX, CheckCircle } from 'lucide-react';

interface BermasalahItem {
    id: number;
    nama_siswa: string;
    judul_buku: string;
    kode_buku: string;
    tanggal_pengembalian: string;
    kondisi: 'rusak' | 'rusak_ringan' | 'rusak_berat' | 'hilang';
    denda: number;
}

interface Props {
    listBermasalah: BermasalahItem[];
}

export default function InventarisBermasalah({ listBermasalah = [] }: Props) {
    const [filterKondisi, setFilterKondisi] = useState<'semua' | 'rusak_ringan' | 'rusak_berat' | 'hilang'>('semua');
    const [searchQuery, setSearchQuery] = useState('');

    // Fungsi untuk memproses buku rusak ringan yang selesai diperbaiki
    const handleSelesaiPerbaikan = (id: number) => {
        if (confirm('Apakah Anda yakin buku ini sudah selesai diperbaiki dan siap dikembalikan ke rak stok?')) {
            router.post(`/admin/peminjaman/${id}/selesai-perbaikan`, {}, {
                preserveScroll: true,
            });
        }
    };

    const filteredData = listBermasalah.filter((item) => {
        const matchesFilter = filterKondisi === 'semua' || item.kondisi === filterKondisi;
        const matchesQuery =
            item.judul_buku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nama_siswa?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesQuery;
    });

    const countRusakRingan = listBermasalah.filter((i) => i.kondisi === 'rusak_ringan' || i.kondisi === 'rusak').length;
    const countRusakBerat = listBermasalah.filter((i) => i.kondisi === 'rusak_berat').length;
    const countHilang = listBermasalah.filter((i) => i.kondisi === 'hilang').length;

    return (
        <AdminLayout>
            <Head title="Inventaris Buku Rusak & Hilang" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BookX className="w-5 h-5 text-rose-500" />
                        Inventaris Buku Rusak & Hilang
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Daftar dan rekapitulasi buku yang mengalami kerusakan fisik (ringan/berat) atau dihilangkan oleh peminjam.
                    </p>
                </div>

                {/* Ringkasan KPI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Rusak Ringan (Dalam Perbaikan)</p>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                {countRusakRingan} Buku
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400">Rusak Berat / Hilang (Stok Permanen)</p>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                                {countRusakBerat + countHilang} Buku
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                        <button
                            onClick={() => setFilterKondisi('semua')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                                filterKondisi === 'semua'
                                    ? 'bg-white dark:bg-[#111622] text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            Semua ({listBermasalah.length})
                        </button>
                        <button
                            onClick={() => setFilterKondisi('rusak_ringan')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                                filterKondisi === 'rusak_ringan'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-amber-500'
                            }`}
                        >
                            Rusak Ringan ({countRusakRingan})
                        </button>
                        <button
                            onClick={() => setFilterKondisi('rusak_berat')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                                filterKondisi === 'rusak_berat'
                                    ? 'bg-rose-500 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-rose-500'
                            }`}
                        >
                            Rusak Berat ({countRusakBerat})
                        </button>
                        <button
                            onClick={() => setFilterKondisi('hilang')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                                filterKondisi === 'hilang'
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-red-500'
                            }`}
                        >
                            Hilang ({countHilang})
                        </button>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-[#111622] px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-sm w-full">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari judul buku / peminjam..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none border-none p-0"
                        />
                    </div>
                </div>

                {/* Tabel Inventaris */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Judul Buku</th>
                                    <th className="p-4">Peminjam Terakhir</th>
                                    <th className="p-4">Tgl Pengembalian</th>
                                    <th className="p-4">Status Fisik</th>
                                    <th className="p-4">Denda Dibebankan</th>
                                    <th className="p-4 text-center">Aksi / Status Stok</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                {item.judul_buku}
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-300">
                                                {item.nama_siswa}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pengembalian || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                                                    item.kondisi === 'rusak_ringan' || item.kondisi === 'rusak'
                                                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                                        : item.kondisi === 'rusak_berat'
                                                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                                        : 'bg-red-500/10 text-red-600 border border-red-500/20'
                                                }`}>
                                                    {item.kondisi === 'rusak_ringan' || item.kondisi === 'rusak' ? (
                                                        <Wrench className="w-3 h-3" />
                                                    ) : (
                                                        <AlertTriangle className="w-3 h-3" />
                                                    )}
                                                    {item.kondisi.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                                                {item.denda > 0 ? `Rp ${item.denda.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="p-4 text-center">
                                                {item.kondisi === 'rusak_ringan' || item.kondisi === 'rusak' ? (
                                                    <button
                                                        onClick={() => handleSelesaiPerbaikan(item.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-[11px] transition-all shadow-sm"
                                                        title="Kembalikan stok ke rak karena sudah diperbaiki"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Selesai Diperbaiki
                                                    </button>
                                                ) : item.kondisi === 'rusak_berat' ? (
                                                    <span className="text-[11px] font-semibold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                                                        Stok Dikurangi Permanen (Musnah)
                                                    </span>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20">
                                                        Menunggu Penggantian Buku Baru
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Tidak ada riwayat buku rusak atau hilang.</p>
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