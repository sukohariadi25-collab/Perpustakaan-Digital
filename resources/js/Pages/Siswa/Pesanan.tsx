import React, { useState, useEffect, useMemo } from 'react';
import { usePage, Head, Link, router } from '@inertiajs/react';
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
    Layers,
    ArrowRight,
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
    const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat' | 'semua'>('aktif');
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

    // Filter berdasarkan tab aktif
    const filteredPesanan = useMemo(() => {
        return pesanan.filter((item) => {
            const status = item.status?.toLowerCase();
            if (activeTab === 'aktif') {
                return status === 'pending';
            }
            if (activeTab === 'riwayat') {
                return status === 'selesai' || status === 'dibatalkan' || status === 'canceled';
            }
            return true;
        });
    }, [pesanan, activeTab]);

    const countAktif = pesanan.filter((i) => i.status?.toLowerCase() === 'pending').length;
    const countRiwayat = pesanan.filter((i) => ['selesai', 'dibatalkan', 'canceled'].includes(i.status?.toLowerCase())).length;

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
                            <Ticket className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                            Tiket Pemesanan & Riwayat Saya
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Tunjukkan QR Code atau kode reservasi ke pustakawan saat mengambil buku di perpustakaan.
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
                        <Clock className="w-3.5 h-3.5" /> Pesanan Aktif (Pending)
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
                        <CheckCircle2 className="w-3.5 h-3.5" /> Riwayat Selesai / Batal
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
                        <Layers className="w-3.5 h-3.5" /> Semua Pesanan
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
                            {pesanan.length}
                        </span>
                    </button>
                </div>

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
                                {filteredPesanan.length > 0 ? (
                                    filteredPesanan.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="p-4 font-bold text-slate-900 dark:text-white">
                                                {item.buku?.judul || '-'}
                                            </td>
                                            <td className="p-4 font-mono font-bold text-teal-600 dark:text-teal-400">
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
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
                                                    >
                                                        <QrCode className="w-3.5 h-3.5" /> Lihat QR
                                                    </button>
                                                    {item.status?.toUpperCase() === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleBatalkan(item.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 font-semibold rounded-lg text-[11px] transition-colors shadow-sm"
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
                                        <td colSpan={6} className="p-10 text-center text-slate-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Inbox className="w-10 h-10 text-slate-300 dark:text-slate-700" />
                                                <p className="text-xs font-medium">Tidak ada data tiket pada kategori ini.</p>
                                                {activeTab === 'aktif' && (
                                                    <Link
                                                        href="/"
                                                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                                                    >
                                                        Cari & Reservasi Buku <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tiket Pemesanan & QR Code (Dioptimalkan agar pas di Mobile & bisa scroll) */}
            {selectedPesanan && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#111622] rounded-2xl p-4 sm:p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-center relative custom-scrollbar">
                        
                        {/* Header Modal */}
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5">
                            <div className="text-left">
                                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                    <QrCode className="w-4 h-4 text-teal-500" /> Tiket Pengambilan Buku
                                </h2>
                                <p className="text-[10px] text-slate-400">Tunjukkan QR Code ini ke petugas</p>
                            </div>
                            <button
                                onClick={() => setSelectedPesanan(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tampilan Gambar QR Code (Disesuaikan ukurannya agar pas di mobile) */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200 dark:border-slate-700 inline-block shadow-inner mx-auto">
                            <QRCode
                                value={selectedPesanan.kode_pemesanan}
                                size={130}
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                                viewBox={`0 0 256 256`}
                            />
                        </div>

                        {/* Kode Acak Reservasi */}
                        <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-0.5">
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">KODE RESERVASI</p>
                            <p className="text-lg sm:text-xl font-mono font-black tracking-widest text-teal-600 dark:text-teal-400">
                                {selectedPesanan.kode_pemesanan}
                            </p>
                        </div>

                        {/* Detail Informasi */}
                        <div className="text-left text-xs space-y-1.5 text-slate-600 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div>
                                <span className="text-slate-400 text-[10px] block font-medium">Judul Buku:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{selectedPesanan.buku?.judul || '-'}</span>
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
                        <div className="space-y-1.5 pt-1">
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