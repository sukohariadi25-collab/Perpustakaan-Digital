<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Peminjaman; // Sesuaikan dengan model peminjaman bukumu
use App\Notifications\GenericNotification;
use Carbon\Carbon;

class CheckPeminjamanDeadline extends Command
{
    protected $signature = 'peminjaman:check-deadline';
    protected $description = 'Mengecek tenggat waktu pengembalian buku dan mengirimkan notifikasi warning atau danger';

    public function handle()
    {
        $today = Carbon::today()->toDateString();
        
        // 1. Ambil peminjaman yang jatuh tempo HARI INI (Warning - Kuning)
        $warningPeminjamans = Peminjaman::where('status', 'dipinjam')
            ->whereDate('tanggal_kembali', $today)
            ->get();

        foreach ($warningPeminjamans as $peminjaman) {
            $peminjaman->user->notify(new GenericNotification(
                'Peringatan Tenggat Pengembalian',
                'Buku "' . $peminjaman->buku->judul . '" harus dikembalikan hari ini!',
                '/siswa/pesanan-saya',
                'warning' // Menghasilkan ikon kuning (AlertTriangle)
            ));
        }

        // 2. Ambil peminjaman yang SUDAH LEWAT dari hari ini (Danger - Merah)
        $dangerPeminjamans = Peminjaman::where('status', 'dipinjam')
            ->whereDate('tanggal_kembali', '<', $today)
            ->get();

        foreach ($dangerPeminjamans as $peminjaman) {
            $peminjaman->user->notify(new GenericNotification(
                'Buku Telat Dikembalikan!',
                'Tenggat waktu buku "' . $peminjaman->buku->judul . '" sudah lewat. Anda akan dikenakan denda.',
                '/siswa/pesanan-saya',
                'danger' // Menghasilkan ikon merah (AlertCircle)
            ));
        }

        $this->info('Pengecekan tenggat peminjaman buku berhasil dijalankan.');
    }
}