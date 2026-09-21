<?php

use App\Http\Controllers\AdminBukuController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\KatalogController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\NotificationsController;
use App\Http\Controllers\PeminjamanController;
use App\Http\Controllers\PemesananController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiswaDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes - Publik & Katalog
|--------------------------------------------------------------------------
*/
Route::get('/', [KatalogController::class, 'index'])->name('katalog.index');
Route::get('/buku/{buku}', [KatalogController::class, 'show'])->name('katalog.detail');

/*
|--------------------------------------------------------------------------
| Rute Pengarah Utama (Dashboard Redirect)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    if (auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return redirect()->route('siswa.dashboard');
})->name('dashboard');

/*
|--------------------------------------------------------------------------
| Portal Siswa (Memerlukan Autentikasi & Role Siswa)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:siswa'])->prefix('siswa')->name('siswa.')->group(function () {
    Route::get('/dashboard', [SiswaDashboardController::class, 'index'])->name('dashboard');
    Route::get('/pesanan', [PemesananController::class, 'index'])->name('pesanan.index');
    Route::post('/pesanan', [PemesananController::class, 'store'])->name('pesanan.store');
    Route::delete('/pesanan/{id}/batalkan', [PemesananController::class, 'batalkanPesanan'])->name('pesanan.batalkan');
});

/*
|--------------------------------------------------------------------------
| Portal Admin / Pustakawan (Memerlukan Autentikasi & Role Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard Admin
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Kelola Buku (Custom route sebelum Resource route)
    Route::get('/buku/template', [AdminBukuController::class, 'template'])->name('buku.template');
    Route::get('/buku/export', [AdminBukuController::class, 'export'])->name('buku.export');
    Route::post('/buku/import', [AdminBukuController::class, 'import'])->name('buku.import');
    Route::post('/buku/bulk-sampul', [AdminBukuController::class, 'bulkUploadSampul'])->name('buku.bulk-sampul');
    Route::resource('buku', AdminBukuController::class);
    
    // Kelola Kategori
    Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

    // Kelola Pemesanan
    Route::get('/pemesanan', [PemesananController::class, 'adminIndex'])->name('pemesanan.index');
    Route::post('/pemesanan/{id}/serahkan', [PemesananController::class, 'serahkanBuku'])->name('pemesanan.serahkan');
    Route::post('/pemesanan/{id}/batalkan', [PemesananController::class, 'batalkanPesanan'])->name('pemesanan.batalkan');

    // Kelola Transaksi & Peminjaman
    Route::get('/peminjaman/export', [PeminjamanController::class, 'export'])->name('peminjaman.export');
    Route::get('/peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::post('/peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
    Route::post('/peminjaman/scan', [PeminjamanController::class, 'processScan'])->name('peminjaman.scan');
    Route::post('/peminjaman/{peminjaman}/approve', [PeminjamanController::class, 'approve'])->name('peminjaman.approve');
    Route::post('/peminjaman/{peminjaman}/reject', [PeminjamanController::class, 'reject'])->name('peminjaman.reject');
    Route::post('/peminjaman/{peminjaman}/kembali', [PeminjamanController::class, 'kembali'])->name('peminjaman.kembali');
    Route::get('/peminjaman/transaksi', function () {
        return Inertia::render('Admin/Peminjaman/Transaksi');
    })->name('peminjaman.transaksi');
});

/*
|--------------------------------------------------------------------------
| Fitur Shared: Notifikasi & Profile (Siswa & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Kelola Notifikasi
    Route::get('/notifications', [NotificationsController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/mark-as-read', [NotificationsController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-read', [NotificationsController::class, 'markAllRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/{id}', [NotificationsController::class, 'destroy'])->name('notifications.destroy');

    // Profil Pengguna
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';