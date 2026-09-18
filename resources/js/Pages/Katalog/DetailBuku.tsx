import React, { useState } from 'react';
import { useForm, usePage, Head, Link } from '@inertiajs/react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import {
    ArrowLeft,
    BookOpen,
    User,
    Building,
    Calendar,
    Hash,
    CheckCircle2,
    X,
    Bookmark,
} from 'lucide-react';

interface Kategori {
    id: number;
    nama: string;
}

interface Buku {
    id: number;
    judul: string;
    penulis: string;
    penerbit?: string;
    tahun_terbit?: number;
    isbn?: string;
    deskripsi?: string;
    sampul?: string;
    stok: number;
    kategori?: Kategori;
}

export default function DetailBuku({ buku }: { buku: Buku }) {
    const { auth } = usePage<any>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        buku_id: buku.id,
        nama_pemesan: auth?.user?.name || '',
        kelas_pemesan: '',
        catatan: '',
    });

    const handleSubmitPesan = (e: React.FormEvent) => {
        e.preventDefault();
        post('/siswa/pesanan', {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const stokTersedia = buku.stok ?? 0;

    return (
        <SiswaLayout>
            <Head title={`Detail Buku - ${buku.judul}`} />

            <div className="space-y-6">
                {/* Tombol Kembali */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
                    </Link>
                </div>

                {/* Card Detail Utama */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 grid md:grid-cols-12 gap-8 shadow-sm">
                    {/* Sampul Buku */}
                    <div className="md:col-span-4 h-80 sm:h-96 bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-200/80 dark:border-slate-800 relative">
                        {buku.sampul ? (
                            <img
                                src={`/storage/${buku.sampul}`}
                                alt={buku.judul}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center p-4 space-y-2">
                                <BookOpen className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
                                <span className="text-xs text-slate-400 font-medium block">Tanpa Sampul</span>
                            </div>
                        )}
                    </div>

                    {/* Informasi Buku */}
                    <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            {buku.kategori && (
                                <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
                                    {buku.kategori.nama}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                {buku.judul}
                            </h1>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl text-xs border border-slate-200/60 dark:border-slate-800">
                                <div className="space-y-1">
                                    <p className="text-slate-400 flex items-center gap-1">
                                        <User className="w-3.5 h-3.5" /> Penulis
                                    </p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{buku.penulis}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 flex items-center gap-1">
                                        <Building className="w-3.5 h-3.5" /> Penerbit
                                    </p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{buku.penerbit || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" /> Tahun
                                    </p>
                                    <p className="font-bold text-slate-800 dark:text-slate-200">{buku.tahun_terbit || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 flex items-center gap-1">
                                        <Hash className="w-3.5 h-3.5" /> ISBN
                                    </p>
                                    <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{buku.isbn || '-'}</p>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="space-y-2 pt-2">
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                    Deskripsi / Sinopsis
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                                    {buku.deskripsi || 'Belum ada deskripsi untuk buku ini.'}
                                </p>
                            </div>
                        </div>

                        {/* Panel Reservasi Footer */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                                    Ketersediaan Stok
                                </span>
                                {stokTersedia > 0 ? (
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                        <CheckCircle2 className="w-4 h-4" /> Tersedia ({stokTersedia} unit)
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
                                        Stok Habis
                                    </span>
                                )}
                            </div>

                            {auth?.user && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={stokTersedia === 0}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    <Bookmark className="w-4 h-4" /> Reservasi Buku Ini
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form Pemesanan / Reservasi */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Bookmark className="w-4 h-4 text-indigo-500" />
                                Form Reservasi Buku
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPesan} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.nama_pemesan}
                                    onChange={(e) => setData('nama_pemesan', e.target.value)}
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none py-2 px-3"
                                />
                                {errors.nama_pemesan && (
                                    <p className="text-[11px] text-rose-500 mt-1">{errors.nama_pemesan}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Kelas
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.kelas_pemesan}
                                    onChange={(e) => setData('kelas_pemesan', e.target.value)}
                                    placeholder="Contoh: XI IPA 1"
                                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none py-2 px-3"
                                />
                                {errors.kelas_pemesan && (
                                    <p className="text-[11px] text-rose-500 mt-1">{errors.kelas_pemesan}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Catatan (Opsional)
                                </label>
                                <textarea
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    placeholder="Contoh: Diambil saat jam istirahat kedua"
                                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none py-2 px-3"
                                    rows={2}
                                />
                                {errors.catatan && (
                                    <p className="text-[11px] text-rose-500 mt-1">{errors.catatan}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                                >
                                    {processing ? 'Mengirim...' : 'Konfirmasi Reservasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SiswaLayout>
    );
}