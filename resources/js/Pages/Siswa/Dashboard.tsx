import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import LencanaStatus from '@/Components/LencanaStatus';
import {
    BookOpen,
    Clock,
    Bookmark,
    Calendar,
    AlertCircle,
    ArrowRight,
    Search,
    Sparkles,
    Inbox,
    CheckCircle2,
} from 'lucide-react';

interface Buku {
    id?: number;
    judul?: string;
    penulis?: string;
    pengarang?: string;
    sampul?: string;
    cover?: string;
}

interface PeminjamanItem {
    id: number;
    buku?: Buku;
    tanggal_pinjam?: string;
    tanggal_kembali?: string;
    batas_kembali?: string;
    status: string;
}

interface PemesananItem {
    id: number;
    kode_pemesanan?: string;
    buku?: Buku;
    created_at?: string;
    tanggal_pesan?: string;
    batas_ambil?: string;
    status: string;
}

interface DashboardProps {
    peminjaman?: PeminjamanItem[];
    pemesanan?: PemesananItem[];
}

export default function Dashboard({ peminjaman = [], pemesanan = [] }: DashboardProps) {
    const { auth } = usePage<any>().props;
    const userName = auth?.user?.name || 'Siswa';

    const pinjamAktif = peminjaman.filter(
        (item) => ['dipinjam', 'terlambat'].includes(item.status?.toLowerCase())
    );
    const pesananAktif = pemesanan.filter(
        (item) => item.status?.toUpperCase() === 'PENDING'
    );
    const riwayatSelesai = peminjaman.filter(
        (item) => ['dikembalikan', 'selesai'].includes(item.status?.toLowerCase())
    );

    const tenggatDekatCount = pinjamAktif.filter((item) => {
        const tenggatStr = item.batas_kembali || item.tanggal_kembali;
        if (!tenggatStr) return false;
        const tenggat = new Date(tenggatStr);
        const now = new Date();
        const diffDays = Math.ceil((tenggat.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diffDays <= 2;
    }).length;

    return (
        <SiswaLayout>
            <Head title="Dashboard Siswa" />

            <div className="space-y-6">
                {/* Hero Banner Teal */}
                <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 space-y-3 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-teal-100 text-xs font-semibold rounded-full backdrop-blur-md border border-white/15">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Portal AksaraNet
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                            Halo, Selamat Datang Kembali, <br className="hidden sm:block" />
                            <span className="text-amber-300">{userName}</span>! 👋
                        </h1>
                        <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
                            Jelajahi koleksi buku terbaru, pantau sisa batas pengembalian buku pinjamanmu, dan kelola reservasi pemesanan dalam satu tempat.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3">
                            <Link
                                href="/buku"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-950 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all shadow-md"
                            >
                                <Search className="w-4 h-4 text-teal-700" /> Cari & Pinjam Buku
                            </Link>
                            <Link
                                href="/siswa/pesanan"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all border border-white/20"
                            >
                                <Bookmark className="w-4 h-4" /> Lihat Tiket Saya
                            </Link>
                        </div>
                    </div>

                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute right-20 -top-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Grid Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sedang Dipinjam</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {pinjamAktif.length} <span className="text-xs font-normal text-slate-400">buku</span>
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Reservasi Pending</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {pesananAktif.length} <span className="text-xs font-normal text-slate-400">tiket</span>
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mendekati Tenggat</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {tenggatDekatCount} <span className="text-xs font-normal text-slate-400">buku</span>
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111622] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Pernah Selesai</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                                {riwayatSelesai.length} <span className="text-xs font-normal text-slate-400">kali</span>
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                Buku Yang Sedang Dipinjam
                            </h2>
                            <span className="text-xs font-semibold text-slate-400">
                                {pinjamAktif.length} Item
                            </span>
                        </div>

                        <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-slate-800/60">
                            {pinjamAktif.length > 0 ? (
                                pinjamAktif.map((item) => {
                                    const judul = item.buku?.judul || 'Buku Tidak Diketahui';
                                    const penulis = item.buku?.penulis || item.buku?.pengarang || 'Penulis Tidak Diketahui';
                                    const cover = item.buku?.sampul || item.buku?.cover;
                                    const tglKembali = item.batas_kembali || item.tanggal_kembali || '-';

                                    return (
                                        <div
                                            key={item.id}
                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200/60 dark:border-slate-700">
                                                    {cover ? (
                                                        <img
                                                            src={`/storage/${cover}`}
                                                            alt={judul}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <BookOpen className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                                        {judul}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                        {penulis}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-0.5">
                                                        <LencanaStatus status={item.status} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80 pt-2 sm:pt-0">
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                                    Batas Kembali
                                                </span>
                                                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {tglKembali}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-slate-400 space-y-2">
                                    <Inbox className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                                    <p className="text-xs">Kamu belum meminjam buku apa pun saat ini.</p>
                                    <Link
                                        href="/buku"
                                        className="inline-block text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-1"
                                    >
                                        Mulai eksplorasi katalog →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bookmark className="w-4 h-4 text-amber-500" />
                                Tiket Pemesanan Aktif
                            </h2>
                            <Link
                                href="/siswa/pesanan"
                                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                            >
                                Semua Tiket <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-3 shadow-sm">
                            {pemesanan && pemesanan.length > 0 ? (
                                pemesanan.slice(0, 3).map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-2"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-mono text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded border border-teal-200/50 dark:border-teal-800/50">
                                                {item.kode_pemesanan || `#RES-${item.id}`}
                                            </span>
                                            <LencanaStatus status={item.status} />
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                                            {item.buku?.judul || 'Judul Buku'}
                                        </h4>
                                        <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                                            <span>
                                                Pesan:{' '}
                                                {item.tanggal_pesan ||
                                                    (item.created_at
                                                        ? new Date(item.created_at).toLocaleDateString('id-ID')
                                                        : '-')}
                                            </span>
                                            <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                                Batas: {item.batas_ambil || 'Hari ini'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-slate-400 space-y-1">
                                    <Clock className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-700" />
                                    <p className="text-xs">Tidak ada reservasi buku yang aktif.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SiswaLayout>
    );
}