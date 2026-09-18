<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\Pemesanan;
use App\Models\Buku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PeminjamanController extends Controller
{
    public function index()
{
    $peminjaman = Peminjaman::with(['user', 'buku',])
        ->latest()
        ->get()
        ->map(function ($item) {
            $tenggat = $item->tanggal_kembali ?? $item->tanggal_tenggat;

            return [
                'id'                   => $item->id,
                'user'                 => $item->user,
                'buku'                 => $item->buku,
                'nama_siswa'           => $item->user->name ?? 'N/A',
                'judul_buku'           => $item->buku->judul ?? 'N/A',
                'tanggal_pinjam'       => $item->tanggal_pinjam,
                'tanggal_kembali'      => $tenggat,
                'batas_kembali'        => $tenggat, // Ditambahkan agar dibaca Index.tsx
                'tanggal_tenggat'      => $tenggat, // Ditambahkan agar dibaca Index.tsx
                'tanggal_pengembalian' => $item->tanggal_pengembalian,
                'status'               => $item->status,
                'denda'                => $item->denda,
            ];
        });

    return Inertia::render('Admin/Peminjaman/Index', [
        'peminjaman' => [
            'data' => $peminjaman
        ],
    ]);
}

    public function store(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'buku_id' => 'required|exists:buku,id',
    ]);

    Peminjaman::create([
        'user_id'         => $request->user_id,
        'buku_id'         => $request->buku_id,
        'tanggal_pinjam'  => now()->toDateString(),
        'tanggal_kembali' => now()->addDays(7)->toDateString(),
        'status'          => 'dipinjam',
    ]);

    return redirect()->back()->with('success', 'Peminjaman manual berhasil dibuat.');
}

    public function approve(Peminjaman $peminjaman)
    {
        if ($peminjaman->status !== 'pending') {
            return back()->with('error', 'Pesanan tidak dalam status pending.');
        }

        DB::transaction(function () use ($peminjaman) {
            $peminjaman->update([
                'status'         => 'dipinjam',
                'tanggal_pinjam' => Carbon::now(),
                'tanggal_kembali'=> Carbon::now()->addDays(7), // Tenggat pinjam 7 hari
            ]);

            // Kurangi stok buku saat peminjaman disetujui
            $this->kurangiStokBuku($peminjaman->buku_id);
        });

        return back()->with('success', 'Pesanan berhasil disetujui.');
    }

    public function reject(Request $request, Peminjaman $peminjaman)
    {
        $request->validate(['catatan' => 'required|string|max:255']);

        DB::transaction(function () use ($peminjaman, $request) {
            $peminjaman->update([
                'status'  => 'canceled',
                'catatan' => $request->catatan,
            ]);

            // Kembalikan stok buku jika sebelumnya sudah terpotong
            $this->tambahStokBuku($peminjaman->buku_id);
        });

        return back()->with('success', 'Pesanan berhasil ditolak.');
    }

    public function kembali(Request $request, Peminjaman $peminjaman)
    {
        if ($peminjaman->status === 'dikembalikan') {
            return back()->with('error', 'Buku ini sudah dikembalikan.');
        }

        $request->validate([
            'kondisi_kembali' => 'required|in:bagus,rusak,hilang',
            'denda_kondisi'   => 'nullable|numeric|min:0',
        ]);

        $tanggalPengembalian = Carbon::now();
        $tanggalTenggat      = Carbon::parse($peminjaman->tanggal_kembali ?? $peminjaman->tanggal_tenggat);

        // Kalkulasi denda keterlambatan (Rp 1.000 / hari)
        $hariTerlambat = $tanggalPengembalian->greaterThan($tanggalTenggat) 
            ? (int) ceil($tanggalPengembalian->diffInHours($tanggalTenggat) / 24)
            : 0;
            
        $dendaKeterlambatan = $hariTerlambat * 1000;
        $dendaKondisi       = (int) ($request->denda_kondisi ?? 0);
        $totalDenda         = $dendaKeterlambatan + $dendaKondisi;

        DB::transaction(function () use ($peminjaman, $tanggalPengembalian, $totalDenda, $request) {
            $peminjaman->update([
                'status'               => 'dikembalikan',
                'tanggal_pengembalian' => $tanggalPengembalian->toDateString(),
                'denda'                => $totalDenda,
                'kondisi_kembali'      => $request->kondisi_kembali,
            ]);

            // Jika kondisi buku tidak hilang, kembalikan stok buku (+1)
            if ($request->kondisi_kembali !== 'hilang') {
                $this->tambahStokBuku($peminjaman->buku_id);
            }
        });

        return back()->with('success', 'Buku berhasil dikembalikan dan stok diperbarui.');
    }

 

public function processScan(Request $request)
{
    $request->validate([
        'kode_pemesanan' => 'required|string',
    ]);

    // 1. Cari data pemesanan
    $pemesanan = Pemesanan::where('kode_pemesanan', trim($request->kode_pemesanan))->first();

    if (!$pemesanan) {
        return response()->json([
            'success' => false,
            'message' => 'Kode pemesanan ' . $request->kode_pemesanan . ' tidak ditemukan!'
        ], 404);
    }

    // 2. Cek jika pesanan sudah pernah diproses
    if (strtoupper($pemesanan->status) === 'SELESAI') {
        return response()->json([
            'success' => false,
            'message' => 'Pesanan ini sudah pernah diproses/dikembalikan!'
        ], 400);
    }

    // 3. Eksekusi simpan transaksi
    try {
        DB::transaction(function () use ($pemesanan) {
            Peminjaman::create([
                'user_id'         => $pemesanan->user_id,
                'buku_id'         => $pemesanan->buku_id,
                'tanggal_pinjam'  => now()->toDateString(),
                'tanggal_kembali' => now()->addDays(7)->toDateString(),
                'tanggal_tenggat' => now()->addDays(7)->toDateString(),
                'status'          => 'dipinjam',
                'denda'           => 0,
            ]);

            // Ubah status pemesanan agar tidak bisa di-scan dua kali
            $pemesanan->update(['status' => 'SELESAI']);
        });

        return response()->json([
            'success' => true,
            'message' => 'Buku berhasil diserahkan! Data peminjaman telah masuk.'
        ]);

    } catch (\Exception $e) {
        // Jika ada kolom DB yang kurang / error relasi, pesan aslinya akan dikirim ke frontend
        return response()->json([
            'success' => false,
            'message' => 'Gagal menyimpan ke DB: ' . $e->getMessage()
        ], 500);
    }
}
    /**
     * Helper Privat: Menambah stok buku (Aman untuk kolom 'stok' maupun 'stok_tersedia')
     */
    private function tambahStokBuku($bukuId)
    {
        $buku = Buku::find($bukuId);
        if (!$buku) return;

        if (Schema::hasColumn('bukus', 'stok_tersedia')) {
            $buku->increment('stok_tersedia');
        }
        if (Schema::hasColumn('bukus', 'stok')) {
            $buku->increment('stok');
        }
    }

    /**
     * Helper Privat: Mengurangi stok buku (Aman untuk kolom 'stok' maupun 'stok_tersedia')
     */
    private function kurangiStokBuku($bukuId)
    {
        $buku = Buku::find($bukuId);
        if (!$buku) return;

        if (Schema::hasColumn('bukus', 'stok_tersedia')) {
            $buku->decrement('stok_tersedia');
        }
        if (Schema::hasColumn('bukus', 'stok')) {
            $buku->decrement('stok');
        }
    }

    public function export(Request $request)
{
    // Mengambil SELURUH data peminjaman beserta relasinya tanpa filter tab
    $peminjamanList = Peminjaman::with(['user', 'buku'])
        ->latest()
        ->get();

    // Generate PDF menggunakan Blade View
    $pdf = Pdf::loadView('pdf.peminjaman', [
        'peminjamanList' => $peminjamanList,
        'tanggal'        => date('d-m-Y'),
    ])->setPaper('a4', 'landscape');

    return $pdf->stream('laporan-seluruh-peminjaman-' . date('Y-m-d') . '.pdf');
}
}