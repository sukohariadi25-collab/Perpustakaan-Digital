<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KatalogController extends Controller
{
    public function index(Request $request)
{
    // Cukup with kategori saja, tidak perlu salinan
    $query = Buku::with('kategori');

    if ($request->filled('cari')) {
        $query->where(function ($q) use ($request) {
            $q->where('judul', 'like', '%' . $request->cari . '%')
              ->orWhere('penulis', 'like', '%' . $request->cari . '%')
              ->orWhere('pengarang', 'like', '%' . $request->cari . '%');
        });
    }

    if ($request->filled('kategori') && $request->kategori !== 'semua') {
        $query->where('kategori_id', $request->kategori);
    }

    $bukuData = $query->paginate(12)->withQueryString();

    // Langsung ambil dari kolom stok di tabel buku
    $bukuData->through(function ($buku) {
        $jumlahStok = $buku->stok_tersedia ?? $buku->stok ?? 0;

        return [
            'id'            => $buku->id,
            'judul'         => $buku->judul,
            'pengarang'     => $buku->pengarang ?? $buku->penulis ?? '-',
            'cover'         => $buku->cover ?? $buku->sampul ?? null,
            'stok_tersedia' => (int) $jumlahStok,
            'stok'          => (int) $jumlahStok,
            'kategori'      => $buku->kategori,
        ];
    });

    return Inertia::render('Katalog/DaftarBuku', [
        'buku'         => $bukuData,
        'kategoriList' => Kategori::all(),
        'filters'      => $request->only(['cari', 'kategori']),
    ]);
}

    public function show($id)
    {
        $buku = Buku::with(['kategori', 'salinan'])->findOrFail($id);

        return Inertia::render('Katalog/DetailBuku', [
            'buku' => $buku,
        ]);
    }
}