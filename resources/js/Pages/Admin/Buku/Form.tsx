import React, { FormEvent } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputTeks from '@/Components/TextInput';
import Button from '@/Components/Button';
import { Kategori, Buku } from '@/types/perpustakaan';
import { BookPlus, ArrowLeft, Upload, Save } from 'lucide-react';

interface Props {
    kategori: Kategori[];
    buku?: Buku | null; // Receive prop buku optional
}

export default function Form({ kategori, buku }: Props) {
    const isEdit = Boolean(buku);

    const { data, setData, post, processing, errors } = useForm({
        kategori_id: buku?.kategori_id ? String(buku.kategori_id) : '',
        judul: buku?.judul || '',
        isbn: buku?.isbn || '',
        penulis: buku?.penulis || '',
        penerbit: buku?.penerbit || '',
        tahun_terbit: buku?.tahun_terbit ? String(buku.tahun_terbit) : '',
        jumlah_salinan: buku?.jumlah_salinan ? String(buku.jumlah_salinan) : '1',
        sampul: null as File | null,
        _method: isEdit ? 'put' : 'post', // Method Spoofing untuk File Upload saat Update
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (isEdit && buku) {
            // Gunakan request POST dengan _method: 'put' agar FormData/File terbaca oleh Laravel
            post(route('admin.buku.update', buku.id));
        } else {
            post(route('admin.buku.store'));
        }
    };

    return (
        <AdminLayout>
            <Head title={isEdit ? `Edit Buku - ${buku?.judul}` : "Tambah Buku Baru"} />

            <div className="max-w-3xl space-y-6">
                <div className="flex items-center gap-3">
                    <Link
                        href={route('admin.buku.index')}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            {isEdit ? 'Edit Informasi Buku' : 'Tambah Buku & Barcode Salinan'}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isEdit 
                                ? 'Perbarui informasi detail katalog buku.' 
                                : 'Isi informasi detail katalog buku baru ke sistem.'}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#111622] p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                Kategori Buku
                            </label>
                            <select
                                value={data.kategori_id}
                                onChange={(e) => setData('kategori_id', e.target.value)}
                                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                            >
                                <option value="">Pilih Kategori</option>
                                {kategori.map((k) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.kategori_id && (
                                <p className="text-xs text-rose-500 mt-1">{errors.kategori_id}</p>
                            )}
                        </div>

                        <InputTeks
                            label="Judul Buku"
                            value={data.judul}
                            onChange={(e) => setData('judul', e.target.value)}
                            error={errors.judul}
                        />

                        <InputTeks
                            label="ISBN"
                            value={data.isbn}
                            onChange={(e) => setData('isbn', e.target.value)}
                            error={errors.isbn}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputTeks
                                label="Penulis"
                                value={data.penulis}
                                onChange={(e) => setData('penulis', e.target.value)}
                                error={errors.penulis}
                            />
                            <InputTeks
                                label="Penerbit"
                                value={data.penerbit}
                                onChange={(e) => setData('penerbit', e.target.value)}
                                error={errors.penerbit}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputTeks
                                label="Tahun Terbit"
                                type="number"
                                value={data.tahun_terbit}
                                onChange={(e) => setData('tahun_terbit', e.target.value)}
                                error={errors.tahun_terbit}
                            />
                            <InputTeks
                                label="Jumlah Stok Unit Physical"
                                type="number"
                                value={data.jumlah_salinan}
                                onChange={(e) => setData('jumlah_salinan', e.target.value)}
                                error={errors.jumlah_salinan}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Sampul Buku (Opsional)
                            </label>
                            <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/30">
                                <input
                                    type="file"
                                    id="sampul-upload"
                                    onChange={(e) =>
                                        setData('sampul', e.target.files ? e.target.files[0] : null)
                                    }
                                    className="hidden"
                                />
                                <label
                                    htmlFor="sampul-upload"
                                    className="cursor-pointer inline-flex flex-col items-center gap-2"
                                >
                                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Klik untuk {isEdit ? 'mengganti' : 'unggah'} gambar sampul
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        PNG, JPG, atau WEBP (Maks. 2MB)
                                    </span>
                                </label>
                                {data.sampul && (
                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-2">
                                        File terpilih: {data.sampul.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-3">
                            <Button
                                type="submit"
                                isLoading={processing}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
                            >
                                {isEdit ? (
                                    <>
                                        <Save className="w-4 h-4" /> Simpan Perubahan
                                    </>
                                ) : (
                                    <>
                                        <BookPlus className="w-4 h-4" /> Simpan Buku
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}