<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pemesanan;
use App\Models\Peminjaman;
use App\Models\Buku;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    public function index()
    {
        // Otomatis ubah status jadi 'expired' jika melewati 24 jam & masih pending
        Pemesanan::where('status', 'pending')
            ->where('expired_at', '<', now())
            ->update(['status' => 'expired']);

        $pesanan = Pemesanan::with('buku')
            ->where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id'             => $item->id,
                    'kode_pemesanan' => $item->kode_pemesanan,
                    'nama_pemesan'   => $item->nama_pemesan,
                    'kelas_pemesan'  => $item->kelas_pemesan,
                    'catatan'        => $item->catatan,
                    'buku'           => $item->buku,
                    'tanggal_pesan'  => $item->created_at->translatedFormat('d M Y, H:i'),
                    'batas_ambil'    => $item->expired_at ? $item->expired_at->translatedFormat('d M Y, H:i') : $item->created_at->addHours(24)->translatedFormat('d M Y, H:i'), 
                    'status'         => strtoupper($item->status),
                ];
            });

        return Inertia::render('Siswa/Pesanan', [
            'pesanan' => $pesanan,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'buku_id'       => 'required|exists:buku,id',
        'nama_pemesan'  => 'required|string|max:255',
        'kelas_pemesan' => 'required|string|max:100',
        'catatan'       => 'nullable|string',
    ]);

    // Gunakan Database Transaction agar aman
    DB::transaction(function () use ($request) {
        $buku = Buku::lockForUpdate()->findOrFail($request->buku_id);

        // Cek apakah stok benar-benar masih ada
        if ($buku->stok <= 0) {
            throw new \Exception('Maaf, stok buku ini sudah habis.');
        }

        // Kurangi stok buku sebanyak 1 unit
        $buku->decrement('stok');

        $kodePemesanan = 'PSN-' . strtoupper(substr(uniqid(), -6));

        Pemesanan::create([
            'user_id'       => auth()->id(),
            'buku_id'       => $buku->id,
            'kode_pemesanan'=> $kodePemesanan,
            'nama_pemesan'  => $request->nama_pemesan,
            'kelas_pemesan' => $request->kelas_pemesan,
            'catatan'       => $request->catatan,
            'status'        => 'pending',
            'expired_at'    => now()->addDay(),
        ]);
    });

    return redirect()->route('siswa.pesanan.index')
        ->with('success', 'Reservasi berhasil! Stok buku telah diperbarui.');
}
    public function adminIndex()
    {
        // Otomatis ubah status jadi 'expired' untuk sisi admin juga
        Pemesanan::where('status', 'pending')
            ->where('expired_at', '<', now())
            ->update(['status' => 'expired']);

        $pemesanan = Pemesanan::with(['user', 'buku'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id'             => $item->id,
                    'kode_pemesanan' => $item->kode_pemesanan,
                    'nama_pemesan'   => $item->nama_pemesan ?? $item->user->name ?? 'N/A',
                    'kelas_pemesan'  => $item->kelas_pemesan ?? '-',
                    'catatan'        => $item->catatan,
                    'judul_buku'     => $item->buku->judul ?? 'N/A',
                    'buku_stok'      => $item->buku->stok ?? 0,
                    'tanggal_pesan'  => $item->created_at->translatedFormat('d M Y, H:i'),
                    'batas_ambil'    => $item->expired_at ? $item->expired_at->translatedFormat('d M Y, H:i') : '-',
                    'status'         => strtolower($item->status),
                ];
            });

        return Inertia::render('Admin/Pemesanan/Index', [
            'pemesanan' => $pemesanan,
        ]);
    }

    public function serahkanBuku($id)
    {
        $pemesanan = Pemesanan::with('buku')->findOrFail($id);

        if ($pemesanan->status !== 'pending') {
            return redirect()->back()->with('error', 'Pesanan ini sudah tidak dapat diproses.');
        }

        if ($pemesanan->buku->stok <= 0) {
            return redirect()->back()->with('error', 'Stok buku habis.');
        }

        DB::transaction(function () use ($pemesanan) {
            // 1. Buat data Peminjaman
            Peminjaman::create([
                'user_id'         => $pemesanan->user_id,
                'buku_id'         => $pemesanan->buku_id,
                'tanggal_pinjam'  => now()->toDateString(),
                'tanggal_kembali' => now()->addDays(7)->toDateString(),
                'status'          => 'dipinjam',
            ]);

            // 2. Kurangi stok buku
            $pemesanan->buku->decrement('stok');

            // 3. Ubah status pemesanan
            $pemesanan->update(['status' => 'selesai']);
        });

        return redirect()->back()->with('success', 'Buku berhasil diserahkan dan peminjaman telah aktif!');
    }

    public function batalkanPesanan($id)
{
    DB::transaction(function () use ($id) {
        $pemesanan = Pemesanan::findOrFail($id);

        if ($pemesanan->status !== 'pending') {
            // Jika menggunakan pengecualian atau redirect, sesuaikan. 
            // Untuk amannya, kita bisa return atau throw exception di dalam transaction.
            throw new \Exception('Hanya pesanan pending yang bisa dibatalkan.');
        }

        // 1. Kembalikan stok buku (+1) karena pesanan dibatalkan
        $buku = Buku::find($pemesanan->buku_id);
        if ($buku) {
            $buku->increment('stok');
        }

        // 2. Ubah status pesanan menjadi dibatalkan (atau langsung dihapus, sesuai kebutuhan)
        $pemesanan->update(['status' => 'dibatalkan']);
    });

    return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan dan stok dikembalikan.');
}
}