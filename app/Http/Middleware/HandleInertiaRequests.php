<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user,
                // Format agar pas dengan interface NotificationItem di NotificationBell.tsx
                'unreadNotifications' => $user ? $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return [
                        'id'         => $n->id,
                        'read_at'    => $n->read_at,
                        'data'       => [
                            'title'   => $n->data['title'] ?? 'Pemberitahuan',
                            'message' => $n->data['message'] ?? '',
                            'url'     => $n->data['url'] ?? '#',
                            'type'    => $n->data['type'] ?? 'info',
                        ],
                        'created_at' => $n->created_at->toISOString(),
                    ];
                }) : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}