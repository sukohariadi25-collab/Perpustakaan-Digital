<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    // 1. Tampilkan halaman utama notifikasi
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->paginate(10); // 10 notifikasi per halaman

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    // 2. Method tandai 1 dibaca (sudah ada sebelumnya)
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }
        return back();
    }

    // 3. Method tandai semua dibaca (sudah ada sebelumnya)
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return back();
    }

    // 4. Method hapus notifikasi
    public function destroy(Request $request, $id)
    {
        $request->user()->notifications()->where('id', $id)->delete();
        return back();
    }
}