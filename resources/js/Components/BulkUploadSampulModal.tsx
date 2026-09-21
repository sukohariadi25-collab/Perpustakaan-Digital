import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { UploadCloud, Image as ImageIcon, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function BulkUploadSampulModal({ isOpen, onClose }: Props) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const { setData, post, processing, errors, reset } = useForm({
        sampul_files: [] as File[],
    });

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
            setData('sampul_files', filesArray);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        post(route('admin.buku.bulk-sampul'), {
            onSuccess: () => {
                setSelectedFiles([]);
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
                {/* Header Modal */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-teal-500" /> Import Sampul Massal
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Petunjuk Ketentuan Nama File */}
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" /> Ketentuan Nama File Gambar:
                    </p>
                    <p className="pl-5 leading-relaxed">
                        Sistem mencocokkan gambar secara otomatis jika nama file sesuai dengan **ISBN** atau **ID Buku**.
                    </p>
                    <p className="pl-5 text-[11px] opacity-80">
                        Contoh: <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">9786020332956.jpg</code> atau <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">12.png</code>
                    </p>
                </div>

                {/* Form Upload */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 rounded-2xl p-6 text-center cursor-pointer transition-colors relative bg-slate-50 dark:bg-slate-900/40">
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Pilih atau Tarik Banyak Gambar Sampul
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            Mendukung JPG, PNG, WEBP (Bisa pilih sekaligus banyak file)
                        </p>
                    </div>

                    {/* Ringkasan File Terpilih */}
                    {selectedFiles.length > 0 && (
                        <div className="bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-3 flex items-center justify-between text-xs text-teal-700 dark:text-teal-300">
                            <span className="font-medium flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-teal-500" />
                                {selectedFiles.length} file gambar siap diproses
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelectedFiles([])}
                                className="text-[11px] text-rose-500 hover:underline font-semibold"
                            >
                                Hapus Semua
                            </button>
                        </div>
                    )}

                    {errors.sampul_files && (
                        <p className="text-xs text-rose-500 font-semibold">{errors.sampul_files}</p>
                    )}

                    {/* Tombol Aksi */}
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing || selectedFiles.length === 0}
                            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-sm"
                        >
                            {processing ? 'Memproses Import...' : `Proses ${selectedFiles.length} Sampul`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}