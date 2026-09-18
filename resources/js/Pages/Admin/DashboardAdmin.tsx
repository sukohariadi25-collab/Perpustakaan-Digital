import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    BookOpen,
    Users,
    ArrowLeftRight,
    Clock,
    AlertTriangle,
    DollarSign,
    Plus,
    ArrowRight,
    BookPlus,
    Layers,
} from 'lucide-react';

interface PeminjamanItem {
    id: number;
    status: 'pending' | 'dipinjam' | 'dikembalikan' | 'canceled';
    created_at: string;
    tanggal_tenggat?: string;
    user?: { name: string; email: string };
    buku?: { judul: string; isbn: string };
}

interface DashboardProps {
    stats: {
        total_buku: number;
        total_siswa: number;
        buku_dipinjam: number;
        pemesanan_aktif: number;
        jumlah_terlambat: number;
        total_denda: number;
    };
    peminjamanTerbaru: PeminjamanItem[];
}

export default function Dashboard({ stats, peminjamanTerbaru }: DashboardProps) {
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
                        Pending
                    </span>
                );
            case 'dipinjam':
                return (
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20">
                        Dipinjam
                    </span>
                );
            case 'dikembalikan':
                return (
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                        Selesai
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400 rounded-full border border-slate-500/20">
                        Batal
                    </span>
                );
        }
    };

    const statCards = [
        {
            title: 'Total Koleksi Buku',
            value: stats.total_buku,
            unit: 'Judul',
            icon: BookOpen,
            color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
        },
        {
            title: 'Anggota Siswa',
            value: stats.total_siswa,
            unit: 'Siswa',
            icon: Users,
            color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        },
        {
            title: 'Sedang Dipinjam',
            value: stats.buku_dipinjam,
            unit: 'Unit',
            icon: ArrowLeftRight,
            color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        },
        {
            title: 'Pesanan Pending',
            value: stats.pemesanan_aktif,
            unit: 'Antrean',
            icon: Clock,
            color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        },
        {
            title: 'Terlambat Kembali',
            value: stats.jumlah_terlambat,
            unit: 'Siswa',
            icon: AlertTriangle,
            color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
        },
        {
            title: 'Denda Terkumpul',
            value: formatRupiah(stats.total_denda),
            unit: '',
            icon: DollarSign,
            color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
            isCurrency: true,
        },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Ringkasan Perpustakaan</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Pantau aktivitas, statistik, dan transaksi peminjaman terbaru.
                    </p>
                </div>

                {/* Grid Statistik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {statCards.map((card, idx) => {
                        const IconComponent = card.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-teal-500/40 transition-all duration-200"
                            >
                                <div className="space-y-1">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        {card.title}
                                    </p>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {card.value}{' '}
                                        {card.unit && (
                                            <span className="text-xs font-normal text-slate-400">
                                                {card.unit}
                                            </span>
                                        )}
                                    </h3>
                                </div>
                                <div
                                    className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${card.color}`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Section Transaksi & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tabel Transaksi Terbaru */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Transaksi Peminjaman Terbaru
                                </h2>
                                <p className="text-xs text-slate-400">5 aktivitas terakhir pengguna</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="p-3 rounded-l-xl">Siswa</th>
                                        <th className="p-3">Buku</th>
                                        <th className="p-3 rounded-r-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {peminjamanTerbaru.length > 0 ? (
                                        peminjamanTerbaru.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="p-3">
                                                    <p className="font-bold text-slate-800 dark:text-slate-200">
                                                        {item.user?.name || 'Siswa'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">{item.user?.email}</p>
                                                </td>
                                                <td className="p-3 font-medium text-slate-700 dark:text-slate-300">
                                                    {item.buku?.judul || '-'}
                                                </td>
                                                <td className="p-3">{getStatusBadge(item.status)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className="p-6 text-center text-slate-400 text-xs"
                                            >
                                                Belum ada aktivitas peminjaman.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Action Panel */}
                    <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-4">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                            Aksi Cepat Admin
                        </h2>

                        <div className="space-y-2.5">
                            <Link
                                href={route('admin.buku.create')}
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-teal-500/10 dark:hover:bg-teal-500/10 hover:border-teal-500/30 rounded-xl border border-slate-100 dark:border-slate-800 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                        <BookPlus className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                        Tambah Buku Baru
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={route('admin.buku.index')}
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-teal-500/10 dark:hover:bg-teal-500/10 hover:border-teal-500/30 rounded-xl border border-slate-100 dark:border-slate-800 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                        Kelola Inventaris Buku
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link
                                href={route('admin.peminjaman.transaksi')}
                                className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-teal-500/10 dark:hover:bg-teal-500/10 hover:border-teal-500/30 rounded-xl border border-slate-100 dark:border-slate-800 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                        Buat Transaksi Baru
                                    </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}