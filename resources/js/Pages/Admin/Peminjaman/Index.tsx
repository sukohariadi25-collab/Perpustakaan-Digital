import React, { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import LencanaStatus from '@/Components/LencanaStatus';
import { Peminjaman } from '@/types/perpustakaan';
import {
    Plus,
    Clock,
    CheckCircle2,
    Layers,
    RotateCcw,
    X,
    Inbox,
    FileDown, // <-- Tambahan icon untuk Export PDF
} from 'lucide-react';

interface IndexProps {
    peminjaman: { data: Peminjaman[] } | Peminjaman[];
}

export default function Index({ peminjaman }: IndexProps) {
    const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat' | 'semua'>('aktif');
    const [selectedReturn, setSelectedReturn] = useState<Peminjaman | null>(null);

    // Form Pengembalian & Kondisi Buku
    const returnForm = useForm({
        kondisi_kembali: 'bagus',
        denda_kondisi: 0,
    });

    // Mendukung data array langsung maupun paginated (.data)
    const listData = Array.isArray(peminjaman) ? peminjaman : (peminjaman?.data || []);

    // Filter berdasarkan tab aktif
    const filteredData = listData.filter((item) => {
        const status = item.status?.toLowerCase();
        if (activeTab === 'aktif') {
            return status === 'dipinjam' || status === 'terlambat';
        }
        if (activeTab === 'riwayat') {
            return status === 'dikembalikan' || status === 'selesai';
        }
        return true;
    });

    // Hitung jumlah data per kategori
    const countAktif = listData.filter((i) => ['dipinjam', 'terlambat'].includes(i.status?.toLowerCase())).length;
    const countRiwayat = listData.filter((i) => ['dikembalikan', 'selesai'].includes(i.status?.toLowerCase())).length;

    // Kalkulator Denda Keterlambatan Real-time (Rp 1.000 / hari)
    const calculateLateFine = (item: Peminjaman | null) => {
        if (!item) return 0;
        const tenggatStr = item.batas_kembali || item.tanggal_tenggat || item.tanggal_kembali;
        if (!tenggatStr) return 0;

        const tenggat = new Date(tenggatStr);
        const now = new Date();

        // Samakan jam ke 00:00 agar perhitungan selisih hari presisi
        tenggat.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);

        if (now <= tenggat) return 0;

        const diffTime = Math.abs(now.getTime() - tenggat.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * 1000;
    };

    // Submit Pengembalian Buku
    const handleReturnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReturn) return;

        returnForm.post(`/admin/peminjaman/${selectedReturn.id}/kembali`, {
            onSuccess: () => {
                setSelectedReturn(null);
                returnForm.reset();
            },
        });
    };

    // Handler untuk Export PDF (Mengirimkan tab aktif ke backend)
    const handleExportPdf = () => {
        window.open(`/admin/peminjaman/export?tab=${activeTab}`, '_blank');
    };

    const lateFine = selectedReturn ? calculateLateFine(selectedReturn) : 0;
    const totalEstimatedFine = lateFine + Number(returnForm.data.denda_kondisi || 0);

    return (
        <AdminLayout>
            <Head title="Kelola Peminjaman Buku" />

            <div className="space-y-6">
                {/* Header Utama */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Kelola Peminjaman & Transaksi
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Pantau peminjaman aktif, keterlambatan, dan riwayat pengembalian buku.
                        </p>
                    </div>

                    {/* Tombol Aksi Header */}
                    <div className="flex items-center gap-2.5">
                        {/* Tombol Export PDF */}
                        <button
                            type="button"
                            onClick={handleExportPdf}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                            <FileDown className="w-4 h-4" /> Export PDF
                        </button>

                        {/* Tombol Transaksi Baru */}
                        <Link
                            href="/admin/peminjaman/transaksi"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Transaksi Baru
                        </Link>
                    </div>
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
                        <Layers className="w-3.5 h-3.5" /> Semua Transaksi
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                            {listData.length}
                        </span>
                    </button>
                </div>

                {/* Tabel Data Transaksi */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Siswa</th>
                                    <th className="p-4">Buku</th>
                                    <th className="p-4">Barcode / Kode</th>
                                    <th className="p-4">Tgl Pinjam</th>
                                    <th className="p-4">Batas Kembali</th>
                                    <th className="p-4">Denda</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => {
                                        const statusLower = item.status?.toLowerCase();
                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                    {item.user?.name || item.nama_siswa || '-'}
                                                </td>
                                                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                                                    {item.salinan_buku?.buku?.judul || item.buku?.judul || item.judul_buku || '-'}
                                                </td>
                                                <td className="p-4 font-mono text-xs text-slate-400">
                                                    {item.salinan_buku?.kode_barcode || '-'}
                                                </td>
                                                <td className="p-4 text-slate-500 dark:text-slate-400">
                                                    {item.tanggal_pinjam || '-'}
                                                </td>
                                                <td className="p-4 text-rose-600 dark:text-rose-400 font-medium">
                                                    {item.batas_kembali || item.tanggal_tenggat || item.tanggal_kembali || '-'}
                                                </td>
                                                <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                                                    {item.denda && item.denda > 0
                                                        ? `Rp ${item.denda.toLocaleString('id-ID')}`
                                                        : '-'}
                                                </td>
                                                <td className="p-4">
                                                    <LencanaStatus status={item.status} />
                                                </td>
                                                <td className="p-4 text-center">
                                                    {['dipinjam', 'terlambat'].includes(statusLower) ? (
                                                        <button
                                                            onClick={() => setSelectedReturn(item)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
                                                        >
                                                            <RotateCcw className="w-3.5 h-3.5" /> Proses Kembali
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 italic">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Tidak ada data transaksi pada kategori ini.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Pengembalian Buku & Kalkulator Denda */}
            {selectedReturn && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200/80 dark:border-slate-800">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <RotateCcw className="w-4 h-4 text-teal-500" />
                                Proses Pengembalian Buku
                            </h3>
                            <button
                                onClick={() => setSelectedReturn(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleReturnSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kondisi Fisik Buku Saat Dikembalikan
                                </label>
                                <select
                                    value={returnForm.data.kondisi_kembali}
                                    onChange={(e) => returnForm.setData('kondisi_kembali', e.target.value)}
                                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none py-2 px-3"
                                >
                                    <option value="bagus">Bagus / Normal</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="hilang">Hilang</option>
                                </select>
                            </div>

                            {returnForm.data.kondisi_kembali !== 'bagus' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                        Denda Kerusakan / Penggantian Buku (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={returnForm.data.denda_kondisi}
                                        onChange={(e) => returnForm.setData('denda_kondisi', Number(e.target.value))}
                                        className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none py-2 px-3"
                                        placeholder="0"
                                    />
                                </div>
                            )}

                            {/* Panel Ringkasan Kalkulator Denda */}
                            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Denda Keterlambatan (Rp1.000/hari):</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        Rp {lateFine.toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Denda Kondisi Buku:</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        Rp {Number(returnForm.data.denda_kondisi || 0).toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                                    <span>Total Denda Keseluruhan:</span>
                                    <span>Rp {totalEstimatedFine.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedReturn(null)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={returnForm.processing}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {returnForm.processing ? 'Memproses...' : 'Konfirmasi Pengembalian'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}