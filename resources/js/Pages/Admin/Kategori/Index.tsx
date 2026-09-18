import React, { FormEvent } from 'react';
import { useForm, router, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputTeks from '@/Components/TextInput';
import Button from '@/Components/Button';
import { Kategori } from '@/types/perpustakaan';
import { FolderPlus, Trash2, Folder, Layers } from 'lucide-react';

export default function Index({ kategori }: { kategori: (Kategori & { buku_count: number })[] }) {
    const { data, setData, post, processing, reset, errors } = useForm({ nama: '' });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(route('admin.kategori.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout>
            <Head title="Kelola Kategori Buku" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                        Kategori Buku
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Kelola kelompok dan pengelompokan jenis buku perpustakaan.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Form Tambah Kategori */}
                    <div className="bg-white dark:bg-[#111622] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                <FolderPlus className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                Tambah Kategori
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <InputTeks
                                label="Nama Kategori"
                                placeholder="Contoh: Pemrograman, Novel"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                error={errors.nama}
                            />
                            <Button
                                type="submit"
                                isLoading={processing}
                                className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <FolderPlus className="w-4 h-4" /> Simpan Kategori
                            </Button>
                        </form>
                    </div>

                    {/* Tabel Daftar Kategori */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                    <tr>
                                        <th className="p-4">Kategori</th>
                                        <th className="p-4">Slug</th>
                                        <th className="p-4">Total Buku</th>
                                        <th className="p-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {kategori.length > 0 ? (
                                        kategori.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                            >
                                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Folder className="w-4 h-4 text-teal-500 shrink-0" />
                                                        <span>{item.nama}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-xs font-mono text-slate-400">
                                                    {item.slug}
                                                </td>
                                                <td className="p-4 font-bold text-teal-600 dark:text-teal-400">
                                                    {item.buku_count} Judul
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() =>
                                                            router.delete(
                                                                route('admin.kategori.destroy', item.id)
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 font-semibold rounded-lg text-[11px] transition-colors border border-rose-500/20"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-400">
                                                <div className="flex flex-col items-center justify-center gap-2">
                                                    <Layers className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                                    <p className="text-xs">Belum ada kategori yang dibuat.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}