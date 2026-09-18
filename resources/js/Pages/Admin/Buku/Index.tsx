import React, { useState } from 'react';
import { Link, router, useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Buku } from '@/types/perpustakaan';
import { Upload, Download, Plus, Edit, Trash2, X, BookOpen, FileSpreadsheet } from 'lucide-react';

interface IndexProps {
    buku: {
        data: (Buku & { salinan_count?: number; kategori?: { nama: string } })[];
    } | (Buku & { salinan_count?: number; kategori?: { nama: string } })[];
}

export default function Index({ buku }: IndexProps) {
    const listBuku = Array.isArray(buku) ? buku : (buku?.data || []);
    const [isModalImportOpen, setIsModalImportOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus buku ini? Seluruh data terkait juga akan terhapus.')) {
            router.delete(route('admin.buku.destroy', id));
        }
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.buku.import'), {
            onSuccess: () => {
                setIsModalImportOpen(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Inventaris Buku" />

            <div className="space-y-6">
                {/* Header & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Daftar Inventaris Buku
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola koleksi buku, jumlah stok unit, dan pembaruan data CSV.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <button
                            onClick={() => setIsModalImportOpen(true)}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all"
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Import CSV
                        </button>
                        <a
                            href={route('admin.buku.export')}
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-xs rounded-xl border border-slate-200/80 dark:border-slate-700 transition-all"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                        </a>
                        <Link
                            href={route('admin.buku.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Buku
                        </Link>
                    </div>
                </div>

                {/* Tabel Inventaris Buku */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Judul Buku</th>
                                    <th className="p-4">ISBN</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">Jumlah Salinan</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {listBuku.length > 0 ? (
                                    listBuku.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                {item.judul}
                                            </td>
                                            <td className="p-4 font-mono text-slate-500 dark:text-slate-400">
                                                {item.isbn || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                                    {item.kategori?.nama || '-'}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-teal-600 dark:text-teal-400">
                                                {item.salinan_count ?? item.stok ?? 0} unit
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link
                                                        href={route('admin.buku.edit', item.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-semibold rounded-lg text-[11px] transition-colors border border-amber-500/20"
                                                    >
                                                        <Edit className="w-3 h-3" /> Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-semibold rounded-lg text-[11px] transition-colors border border-rose-500/20"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Belum ada data buku.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Import CSV */}
            {isModalImportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200/80 dark:border-slate-800">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Import Data Buku (CSV)
                            </h3>
                            <button
                                onClick={() => setIsModalImportOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Banner Unduh Template CSV */}
                        <div className="flex justify-between items-center text-xs bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 text-teal-600 dark:text-teal-400">
                            <span>Belum punya formatnya?</span>
                            <a
                                href={route('admin.buku.template')}
                                className="font-bold hover:underline flex items-center gap-1"
                            >
                                <Download className="w-3 h-3" /> Unduh Template
                            </a>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                    Pilih File CSV (.csv)
                                </label>
                                <input
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    className="block w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-500/10 file:text-teal-600 dark:file:text-teal-400 hover:file:bg-teal-500/20 transition-all cursor-pointer"
                                    required
                                />
                                {errors.file && <p className="text-xs text-rose-500 mt-1">{errors.file}</p>}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                Format kolom CSV: <br />
                                <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                                    ID, Judul Buku, ISBN, Penulis, Penerbit, Kategori, Stok
                                </span>
                            </p>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalImportOpen(false)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Mengunggah...' : 'Proses Import'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}