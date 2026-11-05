<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\Pemesanan;
use Inertia\Inertia;

class SiswaDashboardController extends Controller
{
    public function index()
    {
        // Ambil SEMUA data peminjaman milik siswa yang sedang login tanpa membatasi statusnya
        $peminjaman = Peminjaman::with('buku')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        $pemesanan = Pemesanan::with('buku')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Siswa/Dashboard', [
            'peminjaman' => $peminjaman,
            'pemesanan'  => $pemesanan,
        ]);
    }
}