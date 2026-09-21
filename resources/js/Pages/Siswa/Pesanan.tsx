import React, { useState, useEffect } from 'react';
import { usePage, Head, router } from '@inertiajs/react';
import SiswaLayout from '@/Layouts/SiswaLayout';
import LencanaStatus from '@/Components/LencanaStatus';
import QRCode from 'react-qr-code';
import {
    Ticket,
    X,
    Trash2,
    Inbox,
    CheckCircle2,
    XCircle,
    QrCode,
    Clock,
} from 'lucide-react';

interface PesananItem {
    id: number;
    kode_pemesanan: string;
    nama_pemesan: string;
    kelas_pemesan: string;
    buku?: {
        judul: string;
        penulis: string;
    };
    tanggal_pesan: string;
    batas_ambil: string;
    status: string;
}

export default function PesananIndex({ pesanan = [] }: { pesanan: PesananItem[] }) {
    const [selectedPesanan, setSelectedPesanan] = useState<PesananItem | null>(null);
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
            reservasi?: {
                kode_pemesanan: string;
                judul_buku: string;
                batas_ambil: string;
            };
        };
    };

    // Otomatis buka modal tiket QR saat reservasi baru berhasil dibuat
    useEffect(() => {
        if (flash?.reservasi) {
            const newPesanan = pesanan.find(
                (p) => p.kode_pemesanan === flash.reservasi?.kode_pemesanan
            );
            if (newPesanan) {
                setSelectedPesanan(newPesanan);
            }
        }
    }, [flash, pesanan]);

    const handleBatalkan = (id: number) => {
        if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini? Stok buku akan dikembalikan.')) {
            router.delete(route('siswa.pesanan.batalkan', id), {
                onSuccess: () => {
                    setSelectedPesanan(null);
                },
            });
        }
    };

    return (
        <SiswaLayout>
            <Head title="Tiket Pemesanan Buku" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                            Tiket Pemesanan Saya
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Tunjukkan QR Code atau kode acak ke pustakawan saat mengambil buku.
                        </p>
                    </div>
                </div>

                {/* Flash Messages */}
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

                {/* Tabel Data Tiket */}
                <div className="bg-white dark:bg-[#111622] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200/80 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="p-4">Buku</th>
                                    <th className="p-4">Kode Tiket</th>
                                    <th className="p-4">Tgl Pesan</th>
                                    <th className="p-4">Batas Ambil</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {pesanan.length > 0 ? (
                                    pesanan.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                {item.buku?.judul || '-'}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                {item.kode_pemesanan}
                                            </td>
                                            <td className="p-4 text-slate-500 dark:text-slate-400">
                                                {item.tanggal_pesan}
                                            </td>
                                            <td className="p-4 font-medium text-amber-600 dark:text-amber-400">
                                                {item.batas_ambil}
                                            </td>
                                            <td className="p-4">
                                                <LencanaStatus status={item.status} />
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedPesanan(item)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold rounded-lg text-[11px] transition-colors"
                                                    >
                                                        <QrCode className="w-3.5 h-3.5" /> Lihat QR
                                                    </button>
                                                    {item.status?.toUpperCase() === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleBatalkan(item.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-semibold rounded-lg text-[11px] transition-colors"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" /> Batal
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs">Belum ada riwayat tiket pemesanan buku.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tiket Pemesanan & QR Code */}
            {selectedPesanan && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl p-6 w-full max-w-sm shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-5 text-center relative">
                        {/* Header Modal */}
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div className="text-left">
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <QrCode className="w-4 h-4 text-indigo-500" /> Tiket Pengambilan Buku
                                </h2>
                                <p className="text-[10px] text-slate-400">Tunjukkan QR Code ini ke petugas perpustakaan</p>
                            </div>
                            <button
                                onClick={() => setSelectedPesanan(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tampilan Gambar QR Code */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner mx-auto">
                            <QRCode
                                value={selectedPesanan.kode_pemesanan}
                                size={160}
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>

                        {/* Kode Acak Reservasi */}
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-0.5">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KODE RESERVASI</p>
                            <p className="text-xl font-mono font-black tracking-widest text-indigo-600 dark:text-indigo-400">
                                {selectedPesanan.kode_pemesanan}
                            </p>
                        </div>

                        {/* Detail Informasi */}
                        <div className="text-left text-xs space-y-2 text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-slate-400 text-[10px] block font-medium">Judul Buku:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPesanan.buku?.judul || '-'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-[10px] block font-medium">Pemesan:</span>
                                <span className="font-semibold">{selectedPesanan.nama_pemesan} ({selectedPesanan.kelas_pemesan})</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 dark:border-slate-800">
                                <span className="text-slate-400 text-[10px]">Batas Ambil:</span>
                                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {selectedPesanan.batas_ambil}
                                </span>
                            </div>
                        </div>

                        {/* Tombol Aksi Modal */}
                        <div className="space-y-2 pt-1">
                            {selectedPesanan.status?.toUpperCase() === 'PENDING' && (
                                <button
                                    onClick={() => handleBatalkan(selectedPesanan.id)}
                                    className="w-full py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                                >
                                    Batalkan Pesanan Ini
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedPesanan(null)}
                                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SiswaLayout>
    );
}