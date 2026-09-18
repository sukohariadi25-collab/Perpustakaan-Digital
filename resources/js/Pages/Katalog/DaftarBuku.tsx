import React, { useState, useMemo } from 'react';
import { usePage, Head, Link } from '@inertiajs/react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import {
    Search,
    BookOpen,
    CheckCircle2,
    XCircle,
    Sparkles,
    Check,
    Layers,
    Inbox,
} from 'lucide-react';

interface Kategori {
    id: number;
    nama: string;
}

interface Buku {
    id: number;
    judul: string;
    pengarang?: string;
    penulis?: string;
    cover?: string;
    sampul?: string;
    stok_tersedia?: number;
    stok?: number;
    kategori?: Kategori;
    isbn?: string;
}

interface KatalogProps {
    buku?: any;
    kategoriList?: Kategori[];
    kategori?: Kategori[];
}

export default function DaftarBuku({ buku, kategoriList, kategori }: KatalogProps) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    const listKategori = kategoriList || kategori || [];

    const listBuku = useMemo<Buku[]>(() => {
        if (Array.isArray(buku)) return buku;
        if (buku && typeof buku === 'object' && 'data' in buku && Array.isArray((buku as any).data)) {
            return (buku as any).data;
        }
        return [];
    }, [buku]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKategori, setSelectedKategori] = useState<string>('semua');
    const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

    const filteredBuku = useMemo(() => {
        return listBuku.filter((item) => {
            const namaPengarang = item.pengarang || item.penulis || '';
            const jumlahStok = item.stok_tersedia ?? item.stok ?? 0;

            const matchesSearch =
                item.judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                namaPengarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.isbn && item.isbn.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesKategori =
                selectedKategori === 'semua' ||
                item.kategori?.id.toString() === selectedKategori ||
                item.kategori?.nama?.toLowerCase() === selectedKategori.toLowerCase();

            const matchesAvailability = !onlyAvailable || jumlahStok > 0;

            return matchesSearch && matchesKategori && matchesAvailability;
        });
    }, [listBuku, searchQuery, selectedKategori, onlyAvailable]);

    return (
        <SiswaLayout>
            <Head title="Katalog Buku Perpustakaan" />

            <div className="space-y-6">
                {/* Hero Banner Teal */}
                <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 dark:from-slate-900 dark:via-teal-950 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                    <div className="relative z-10 space-y-3 max-w-2xl">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-teal-100 text-xs font-semibold rounded-full backdrop-blur-md border border-white/15">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Katalog Digital
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                            Eksplorasi & Reservasi Koleksi Buku
                        </h1>
                        <p className="text-teal-100/90 text-xs sm:text-sm leading-relaxed">
                            Temukan ribuan judul buku favoritmu. Pesan secara online dan ambil buku di perpustakaan tanpa perlu mengantre.
                        </p>
                    </div>

                    <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
                </div>

                {/* Alert Flash Messages */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                        <XCircle className="w-4 h-4 flex-shrink-0" /> {flash.error}
                    </div>
                )}

                {/* Filter & Search Bar */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-6 relative">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul buku, pengarang, atau ISBN..."
                                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                            />
                        </div>

                        <div className="md:col-span-3 relative">
                            <Layers className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={selectedKategori}
                                onChange={(e) => setSelectedKategori(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none cursor-pointer appearance-none"
                            >
                                <option value="semua">Semua Kategori</option>
                                {listKategori.map((kat) => (
                                    <option key={kat.id} value={kat.id.toString()}>
                                        {kat.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-3 flex items-center justify-start md:justify-end">
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
                                <div
                                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                        onlyAvailable
                                            ? 'bg-teal-600 border-teal-600 text-white'
                                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                                    }`}
                                >
                                    {onlyAvailable && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                Hanya Stok Tersedia
                            </label>
                        </div>
                    </div>
                </div>

                {/* Grid Katalog Buku */}
                {filteredBuku.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {filteredBuku.map((item) => {
                            const namaPengarang = item.pengarang || item.penulis || '-';
                            const gambarCover = item.cover || item.sampul;
                            const jumlahStok = item.stok_tersedia ?? item.stok ?? 0;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="relative h-56 bg-slate-100 dark:bg-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800">
                                            {gambarCover ? (
                                                <img
                                                    src={`/storage/${gambarCover}`}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="text-center p-4">
                                                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                                    <span className="text-[10px] text-slate-400 font-medium">Tanpa Sampul</span>
                                                </div>
                                            )}

                                            {item.kategori && (
                                                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                    {item.kategori.nama}
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-4 space-y-2">
                                            <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {item.judul}
                                            </h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Oleh: <span className="font-medium text-slate-700 dark:text-slate-300">{namaPengarang}</span>
                                            </p>

                                            <div className="pt-1">
                                                {jumlahStok > 0 ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersedia: {jumlahStok}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Stok Habis
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 pt-0">
                                        <Link
                                            href={`/buku/${item.id}`}
                                            className="w-full block text-center py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                        >
                                            Lihat Detail Buku
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-[#111622] rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Buku Tidak Ditemukan</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Coba kata kunci lain atau ubah filter pencarian Anda.</p>
                    </div>
                )}
            </div>
        </SiswaLayout>
    );
}