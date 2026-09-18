<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use App\Models\Buku;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_buku'       => Buku::count(),
            'total_siswa'      => User::where('role', 'siswa')->count(),
            'buku_dipinjam'    => Peminjaman::where('status', 'dipinjam')->count(),
            'pemesanan_aktif'  => Peminjaman::where('status', 'pending')->count(),
            'jumlah_terlambat' => Peminjaman::where('status', 'dipinjam')
                                    ->where('tanggal_tenggat', '<', Carbon::now())
                                    ->count(),
            'total_denda'      => (int) Peminjaman::where('status', 'dikembalikan')->sum('denda'),
        ];

        $peminjamanTerbaru = Peminjaman::with(['user', 'buku'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/DashboardAdmin', [
            'stats'              => $stats,
            'peminjamanTerbaru' => $peminjamanTerbaru,
        ]);
    }
}