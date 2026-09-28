<?php

namespace App\Http\Controllers;

use App\Models\Buku;
use App\Models\Kategori;
use App\Models\SalinanBuku;
use App\Models\User;
use App\Notifications\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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
            'sampul'         => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'jumlah_salinan' => 'required|integer|min:1',
        ]);

        if ($request->hasFile('sampul')) {
            $validated['sampul'] = $request->file('sampul')->store('sampul-buku', 'public');
        }

        $buku = Buku::create($validated);

        for ($i = 1; $i <= $request->jumlah_salinan; $i++) {
            SalinanBuku::create([
                'buku_id'      => $buku->id,
                'kode_barcode' => 'BK-' . $buku->id . '-' . Str::padLeft((string)$i, 3, '0'),
                'status'       => 'tersedia',
            ]);
        }

        // Notifikasi ke Admin
        auth()->user()?->notify(new AppNotification(
            'Buku Berhasil Ditambahkan',
            "Buku '{$buku->judul}' dengan {$request->jumlah_salinan} salinan berhasil ditambahkan.",
            '/admin/buku',
            'success'
        ));

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

        $rules = [
            'kategori_id'    => 'required|exists:kategori,id',
            'judul'          => 'required|string|max:255',
            'isbn'           => ['required', 'string', Rule::unique('buku', 'isbn')->ignore($buku->id)],
            'penulis'        => 'required|string|max:255',
            'penerbit'       => 'required|string|max:255',
            'tahun_terbit'   => 'required|integer|digits:4',
            'jumlah_salinan' => 'nullable|integer|min:1',
        ];

        if ($request->hasFile('sampul')) {
            $rules['sampul'] = 'image|mimes:jpg,jpeg,png,webp|max:2048';
        }

        $validated = $request->validate($rules);

        if ($request->hasFile('sampul')) {
            if ($buku->sampul && Storage::disk('public')->exists($buku->sampul)) {
                Storage::disk('public')->delete($buku->sampul);
            }

            $validated['sampul'] = $request->file('sampul')->store('sampul-buku', 'public');
        } else {
            unset($validated['sampul']);
        }

        $buku->update($validated);

        return redirect()->route('admin.buku.index')->with('success', 'Data buku berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $buku = Buku::findOrFail($id);

        if ($buku->sampul && Storage::disk('public')->exists($buku->sampul)) {
            Storage::disk('public')->delete($buku->sampul);
        }

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
            
            fputs($file, "\xEF\xBB\xBF");

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

        $bom = fread($file, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($file);
        }

        $firstLine = fgets($file);
        $delimiter = (substr_count($firstLine, ';') >= substr_count($firstLine, ',')) ? ';' : ',';

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

        // Notifikasi ke Admin
        auth()->user()?->notify(new AppNotification(
            'Import Data Buku Selesai',
            'Data buku dari file CSV berhasil diimport ke sistem.',
            '/admin/buku',
            'info'
        ));

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
            
            fputs($file, "\xEF\xBB\xBF");

            fputcsv($file, ['ID', 'Judul Buku', 'ISBN', 'Penulis', 'Penerbit', 'Kategori', 'Stok'], ';');
            fputcsv($file, ['', 'Laskar Pelangi', '978-979-3062-79-2', 'Andrea Hirata', 'Bentang Pustaka', 'Novel', 10], ';');
            fputcsv($file, ['', 'Bumi Manusia', '978-979-97312-3-4', 'Pramoedya Ananta Toer', 'Lentera Dipantara', 'Fiksi', 5], ';');

            fclose($file);
        }, 200, $headers);
    }

    public function bulkUploadSampul(Request $request)
    {
        $request->validate([
            'sampul_files'   => 'required|array',
            'sampul_files.*' => 'image|mimes:jpeg,png,jpg,webp|max:3072',
        ]);

        $berhasil = 0;
        $gagal = 0;
        $fileGagal = [];

        foreach ($request->file('sampul_files') as $file) {
            $namaFile = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

            $buku = Buku::where('isbn', $namaFile)
                ->orWhere('id', $namaFile)
                ->first();

            if ($buku) {
                if ($buku->sampul && Storage::disk('public')->exists($buku->sampul)) {
                    Storage::disk('public')->delete($buku->sampul);
                }

                $path = $file->store('sampul-buku', 'public');

                $buku->update([
                    'sampul' => $path,
                ]);

                $berhasil++;
            } else {
                $gagal++;
                $fileGagal[] = $file->getClientOriginalName();
            }
        }

        $pesan = "Berhasil memperbarui {$berhasil} sampul buku.";
        if ($gagal > 0) {
            $pesan .= " {$gagal} file tidak ditemukan kecocokannya (" . implode(', ', $fileGagal) . ").";
        }

        // Notifikasi ke Admin
        auth()->user()?->notify(new AppNotification(
            'Upload Sampul Massal',
            $pesan,
            '/admin/buku',
            $berhasil > 0 ? 'success' : 'warning'
        ));

        return redirect()->back()->with($berhasil > 0 ? 'success' : 'error', $pesan);
    }
}