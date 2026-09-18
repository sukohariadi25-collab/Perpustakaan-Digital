<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\SalinanBuku;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminBukuController extends Controller
{
    public function index()
    {
        $buku = Buku::with('kategori')
            ->withCount('salinan')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Buku/Index', [
            'buku' => $buku,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Buku/Form', [
            'kategori' => Kategori::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategori_id'    => 'required|exists:kategori,id',
            'judul'          => 'required|string|max:255',
            'isbn'           => 'required|string|unique:buku,isbn',
            'penulis'        => 'required|string|max:255',
            'penerbit'       => 'required|string|max:255',
            'tahun_terbit'   => 'required|integer|digits:4',
            'sampul'         => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'jumlah_salinan' => 'required|integer|min:1',
        ]);

        if ($request->hasFile('sampul')) {
            $validated['sampul'] = $request->file('sampul')->store('sampul-buku', 'public');
        }

        $buku = Buku::create($validated);

        // Generasi barcode salinan buku otomatis
        for ($i = 1; $i <= $request->jumlah_salinan; $i++) {
            SalinanBuku::create([
                'buku_id'      => $buku->id,
                'kode_barcode' => 'BK-' . $buku->id . '-' . Str::padLeft((string)$i, 3, '0'),
                'status'       => 'tersedia',
            ]);
        }

        return redirect()->route('admin.buku.index')->with('success', 'Buku dan salinan barcode berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $buku = Buku::findOrFail($id);
        $kategori = Kategori::all();

        return Inertia::render('Admin/Buku/Form', [
            'buku'     => $buku,
            'kategori' => $kategori,
        ]);
    }

    public function update(Request $request, $id)
    {
        $buku = Buku::findOrFail($id);

        $validated = $request->validate([
            'judul'       => 'required|string|max:255',
            'isbn'        => 'nullable|string|max:50',
            'kategori_id' => 'required|exists:kategori,id',
            'penulis'     => 'nullable|string|max:255',
            'penerbit'    => 'nullable|string|max:255',
        ]);

        $buku->update($validated);

        return redirect()->route('admin.buku.index')->with('success', 'Data buku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $buku = Buku::findOrFail($id);
        $buku->delete();

        return redirect()->route('admin.buku.index')->with('success', 'Buku berhasil dihapus.');
    }

    public function export()
    {
        $fileName = 'data-buku-' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        return response()->stream(function () {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM untuk kompatibilitas Microsoft Excel
            fputs($file, "\xEF\xBB\xBF");

            // Menggunakan pemisah titik koma (;) agar data otomatis terpisah menjadi tabel teratur
            fputcsv($file, ['ID', 'Judul Buku', 'ISBN', 'Penulis', 'Penerbit', 'Kategori', 'Stok'], ';');

            Buku::with('kategori')->chunk(100, function ($bukuList) use ($file) {
                foreach ($bukuList as $buku) {
                    fputcsv($file, [
                        $buku->id,
                        $buku->judul,
                        $buku->isbn ?? '-',
                        $buku->penulis ?? '-',
                        $buku->penerbit ?? '-',
                        $buku->kategori->nama ?? '-',
                        $buku->stok ?? 0,
                    ], ';');
                }
            });

            fclose($file);
        }, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $path = $request->file('file')->getRealPath();
        $file = fopen($path, 'r');

        // Lewati BOM UTF-8 jika ada
        $bom = fread($file, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($file);
        }

        // Deteksi pemisah kolom otomatis (titik koma atau koma)
        $firstLine = fgets($file);
        $delimiter = (substr_count($firstLine, ';') >= substr_count($firstLine, ',')) ? ';' : ',';

        // Reset pointer & lewati baris header
        rewind($file);
        if ($bom === "\xEF\xBB\xBF") {
            fread($file, 3);
        }
        fgetcsv($file, 0, $delimiter);

        DB::transaction(function () use ($file, $delimiter) {
            while (($row = fgetcsv($file, 0, $delimiter)) !== false) {
                if (isset($row[1]) && !empty(trim($row[1]))) {
                    $kategoriNama = isset($row[5]) && trim($row[5]) !== '-' && !empty(trim($row[5])) ? trim($row[5]) : 'Umum';
                    $kategori = Kategori::firstOrCreate(['nama' => $kategoriNama]);

                    Buku::create([
                        'judul'       => trim($row[1]),
                        'isbn'        => isset($row[2]) && trim($row[2]) !== '-' ? trim($row[2]) : null,
                        'penulis'     => isset($row[3]) && trim($row[3]) !== '-' ? trim($row[3]) : null,
                        'penerbit'    => isset($row[4]) && trim($row[4]) !== '-' ? trim($row[4]) : null,
                        'kategori_id' => $kategori->id,
                        'stok'        => isset($row[6]) ? (int) $row[6] : 0,
                    ]);
                }
            }
        });

        fclose($file);

        return redirect()->back()->with('success', 'Data buku berhasil diimport!');
    }

    public function template()
    {
        $fileName = 'template-import-buku.csv';

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        return response()->stream(function () {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM
            fputs($file, "\xEF\xBB\xBF");

            // Menggunakan pemisah titik koma (;)
            fputcsv($file, ['ID', 'Judul Buku', 'ISBN', 'Penulis', 'Penerbit', 'Kategori', 'Stok'], ';');
            fputcsv($file, ['', 'Laskar Pelangi', '978-979-3062-79-2', 'Andrea Hirata', 'Bentang Pustaka', 'Novel', 10], ';');
            fputcsv($file, ['', 'Bumi Manusia', '978-979-97312-3-4', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 'Fiksi', 5], ';');

            fclose($file);
        }, 200, $headers);
    }
}