<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pemesanan;
use App\Models\Peminjaman;
use App\Models\Buku;
use App\Notifications\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PemesananController extends Controller
{
    public function index()
    {
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

        try {
            $pemesanan = null;

            DB::transaction(function () use ($request, &$pemesanan) {
                $buku = Buku::lockForUpdate()->findOrFail($request->buku_id);

                if ($buku->stok <= 0) {
                    throw new \Exception('Maaf, stok buku ini sudah habis.');
                }

                $buku->decrement('stok');

                $kodePemesanan = 'PSN-' . strtoupper(substr(uniqid(), -6));

                $pemesanan = Pemesanan::create([
                    'user_id'       => auth()->id(),
                    'buku_id'       => $buku->id,
                    'kode_pemesanan'=> $kodePemesanan,
                    'nama_pemesan'  => $request->nama_pemesan,
                    'kelas_pemesan' => $request->kelas_pemesan,
                    'catatan'       => $request->catatan,
                    'status'        => 'pending',
                    'expired_at'    => now()->addDay(),
                ]);

                $pemesanan->load('buku');
            });

            // Notifikasi ke Siswa yang memesan
            auth()->user()?->notify(new AppNotification(
                'Reservasi Berhasil',
                "Reservasi buku '{$pemesanan->buku->judul}' berhasil dibuat (Kode: {$pemesanan->kode_pemesanan}). Silakan ambil di perpustakaan.",
                '/siswa/pesanan',
                'success'
            ));

            return redirect()->route('siswa.pesanan.index')
                ->with('success', 'Reservasi berhasil! Stok buku telah diperbarui.')
                ->with('reservasi', [
                    'kode_pemesanan' => $pemesanan->kode_pemesanan,
                    'judul_buku'     => $pemesanan->buku->judul ?? 'Buku Perpustakaan',
                    'batas_ambil'    => $pemesanan->expired_at ? $pemesanan->expired_at->translatedFormat('d M Y, H:i') : '-',
                ]);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function adminIndex()
    {
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
        $pemesanan = Pemesanan::with(['user', 'buku'])->findOrFail($id);

        if ($pemesanan->status !== 'pending') {
            return redirect()->back()->with('error', 'Pesanan ini sudah tidak dapat diproses.');
        }

        DB::transaction(function () use ($pemesanan) {
            Peminjaman::create([
                'user_id'         => $pemesanan->user_id,
                'buku_id'         => $pemesanan->buku_id,
                'tanggal_pinjam'  => now()->toDateString(),
                'tanggal_kembali' => now()->addDays(7)->toDateString(),
                'status'          => 'dipinjam',
            ]);

            $pemesanan->update(['status' => 'selesai']);
        });

        // Notifikasi ke Siswa
        if ($pemesanan->user) {
            $pemesanan->user->notify(new AppNotification(
                'Buku Telah Diserahkan',
                "Buku '{$pemesanan->buku->judul}' telah diserahkan. Selamat membaca!",
                '/peminjaman',
                'success'
            ));
        }

        return redirect()->back()->with('success', 'Buku berhasil diserahkan dan peminjaman telah aktif!');
    }

    public function batalkanPesanan($id)
    {
        DB::transaction(function () use ($id) {
            $pemesanan = Pemesanan::with(['user', 'buku'])->findOrFail($id);

            if ($pemesanan->status !== 'pending') {
                throw new \Exception('Hanya pesanan pending yang bisa dibatalkan.');
            }

            $buku = Buku::find($pemesanan->buku_id);
            if ($buku) {
                $buku->increment('stok');
            }

            $pemesanan->update(['status' => 'dibatalkan']);

            // Notifikasi ke Pemesan
            if ($pemesanan->user) {
                $pemesanan->user->notify(new AppNotification(
                    'Reservasi Dibatalkan',
                    "Reservasi buku '{$pemesanan->buku->judul}' telah dibatalkan.",
                    '/siswa/pesanan',
                    'warning'
                ));
            }
        });

        return redirect()->back()->with('success', 'Pesanan berhasil dibatalkan dan stok dikembalikan.');
    }
}