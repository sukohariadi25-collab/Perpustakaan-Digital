<?php

namespace App\Http\Controllers;

use App\Models\Peminjaman;
use App\Models\Pemesanan;
use App\Models\Buku;
use App\Models\User;
use App\Notifications\AppNotification;
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
        $peminjaman = Peminjaman::with(['user', 'buku'])
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
                    'batas_kembali'        => $tenggat,
                    'tanggal_tenggat'      => $tenggat,
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

        $peminjaman = Peminjaman::create([
            'user_id'         => $request->user_id,
            'buku_id'         => $request->buku_id,
            'tanggal_pinjam'  => now()->toDateString(),
            'tanggal_kembali' => now()->addDays(7)->toDateString(),
            'status'          => 'dipinjam',
        ]);

        $user = User::find($request->user_id);
        $buku = Buku::find($request->buku_id);

        // 1. Notifikasi ke Siswa Peminjam
        if ($user && $buku) {
            $user->notify(new AppNotification(
                'Peminjaman Baru Dibuat',
                "Peminjaman buku '{$buku->judul}' berhasil dicatat. Tanggal kembali: {$peminjaman->tanggal_kembali}.",
                '/peminjaman',
                'info'
            ));
        }

        // 2. Notifikasi ke Admin (Pengajuan Peminjaman Baru)
        $admins = User::whereIn('role', ['admin', 'Admin', 'pustakawan'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new AppNotification(
                'Pengajuan Peminjaman Baru',
                "Peminjaman buku '{$buku->judul}' telah dicatat untuk siswa {$user->name}.",
                '/admin/peminjaman',
                'info'
            ));
        }

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
                'tanggal_kembali'=> Carbon::now()->addDays(7),
            ]);

            $this->kurangiStokBuku($peminjaman->buku_id);
        });

        // Notifikasi ke Siswa: Peminjaman Disetujui
        if ($peminjaman->user) {
            $peminjaman->user->notify(new AppNotification(
                'Peminjaman Disetujui',
                "Pengajuan peminjaman buku '{$peminjaman->buku->judul}' telah disetujui.",
                '/peminjaman',
                'success'
            ));
        }

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

            $this->tambahStokBuku($peminjaman->buku_id);
        });

        // Notifikasi ke Siswa: Peminjaman Ditolak
        if ($peminjaman->user) {
            $peminjaman->user->notify(new AppNotification(
                'Peminjaman Ditolak',
                "Pengajuan peminjaman buku '{$peminjaman->buku->judul}' ditolak. Catatan: {$request->catatan}",
                '/peminjaman',
                'danger'
            ));
        }

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

            if ($request->kondisi_kembali !== 'hilang') {
                $this->tambahStokBuku($peminjaman->buku_id);
            }
        });

        // Notifikasi ke Siswa: Buku Berhasil Dikembalikan
        if ($peminjaman->user) {
            $pesanDenda = $totalDenda > 0 ? " Total denda: Rp " . number_format($totalDenda, 0, ',', '.') : '';
            $peminjaman->user->notify(new AppNotification(
                'Pengembalian Buku Berhasil',
                "Buku '{$peminjaman->buku->judul}' telah berhasil dikembalikan.{$pesanDenda}",
                '/peminjaman',
                $totalDenda > 0 ? 'warning' : 'success'
            ));
        }

        return back()->with('success', 'Buku berhasil dikembalikan dan stok diperbarui.');
    }

    public function processScan(Request $request)
    {
        $request->validate([
            'kode_pemesanan' => 'required|string',
        ]);

        $kode = strtoupper(trim($request->kode_pemesanan));

        $pemesanan = Pemesanan::with(['user', 'buku'])->whereRaw('UPPER(kode_pemesanan) = ?', [$kode])->first();

        if (!$pemesanan) {
            return redirect()->back()->with('error', 'Kode pemesanan "' . $kode . '" tidak ditemukan!');
        }

        if (strtoupper($pemesanan->status) === 'SELESAI') {
            return redirect()->back()->with('error', 'Pesanan ini sudah pernah diproses!');
        }

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

                Pemesanan::where('id', $pemesanan->id)->update(['status' => 'SELESAI']);
            });

            // Notifikasi ke Siswa saat scan berhasil
            if ($pemesanan->user) {
                $pemesanan->user->notify(new AppNotification(
                    'Buku Diserahkan (Scan)',
                    "Buku '{$pemesanan->buku->judul}' telah berhasil diserahkan melalui scan barcode.",
                    '/peminjaman',
                    'success'
                ));
            }

            return redirect()->back()->with('success', 'Buku berhasil diserahkan! Data peminjaman telah masuk.');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menyimpan transaksi: ' . $e->getMessage());
        }
    }

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
        $peminjamanList = Peminjaman::with(['user', 'buku'])
            ->latest()
            ->get();

        $pdf = Pdf::loadView('pdf.peminjaman', [
            'peminjamanList' => $peminjamanList,
            'tanggal'        => date('d-m-Y'),
        ])->setPaper('a4', 'landscape');

        return $pdf->stream('laporan-seluruh-peminjaman-' . date('Y-m-d') . '.pdf');
    }
}