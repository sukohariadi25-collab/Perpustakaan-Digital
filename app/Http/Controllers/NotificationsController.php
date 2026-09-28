<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Pemesanan;
use App\Models\User;
use App\Notifications\GenericNotification; // 1. Import Class GenericNotification
use Illuminate\Support\Facades\Notification; // 2. Import Facade Notification
use Illuminate\Support\Facades\Log;

class NotificationsController extends Controller
{
    /**
     * Tampilkan halaman riwayat notifikasi pengguna.
     */
    public function index(Request $request)
{
    $user = $request->user();

    $notifications = $user->notifications()
        ->paginate(15)
        ->through(function ($n) {
            return [
                'id'         => $n->id,
                'read_at'    => $n->read_at,
                'is_read'    => $n->read_at !== null,
                'created_at' => $n->created_at ? $n->created_at->translatedFormat('d M Y, H:i') : '-',
                // Struktur 'data' agar sesuai dengan pemanggilan item.data.type di Index.tsx
                'data'       => [
                    'title'   => $n->data['title'] ?? 'Pemberitahuan',
                    'message' => $n->data['message'] ?? '',
                    'url'     => $n->data['url'] ?? '#',
                    'type'    => $n->data['type'] ?? 'info',
                ],
                // Properti langsung di root level
                'title'      => $n->data['title'] ?? 'Pemberitahuan',
                'message'    => $n->data['message'] ?? '',
                'url'        => $n->data['url'] ?? '#',
                'type'       => $n->data['type'] ?? 'info',
            ];
        });

    return Inertia::render('Notifications/Index', [
        'notifications' => $notifications,
    ]);
}

    // Sesuai dengan router.post(`/notifications/${item.id}/mark-as-read`)
    public function markAsRead(Request $request,$id)
    {
        $notification = $request->user()->unreadNotifications()->where('id',$id)->first();
        
        if ($notification) {
            $notification->markAsRead();
        }

        return back();
    }

    // Sesuai dengan router.post('/notifications/mark-all-read')
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back()->with('success', 'Semua notifikasi berhasil ditandai dibaca.');
    }

    /**
     * Hapus satu notifikasi tertentu dari database.
     */
    public function destroy(Request $request, string $id): RedirectResponse
    {
        $request->user()
            ->notifications()
            ->where('id', $id)
            ->delete();

        return back();
    }

    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'buku_id' => 'required|exists:buku,id',
        ]);

        try {
            // 1. Simpan data pemesanan ke database
            $pemesanan = Pemesanan::create([
                'user_id' => auth()->id(),
                'buku_id' => $request->buku_id,
                'status'  => 'pending',
            ]);

            // 2. Ambil semua akun yang memiliki role 'admin'
            $admins = User::where('role', 'admin')->get();

            // 3. Kirimkan notifikasi jika admin ditemukan
            if ($admins->isNotEmpty()) {
                Notification::send($admins, new GenericNotification(
                    'Pesanan Baru Masuk',
                    'Siswa ' . (auth()->user()->name ?? 'Siswa') . ' telah mengajukan pesanan buku.',
                    '/admin/pemesanan',
                    'info'
                ));
            }

            return back()->with('success', 'Pesanan berhasil dibuat.');

        } catch (\Exception $e) {
            // Catat error ke file storage/logs/laravel.log jika terjadi kegagalan
            Log::error('Gagal membuat pesanan atau mengirim notifikasi: ' . $e->getMessage());
            return back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}