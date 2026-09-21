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
            'user' => $user ? array_merge($user->toArray(), [
                'notifications' => $user->unreadNotifications()->take(10)->get()->map(function ($n) {
                    return [
                        'id' => $n->id,
                        'title' => $n->data['title'] ?? 'Pemberitahuan',
                        'message' => $n->data['message'] ?? '',
                        'url' => $n->data['url'] ?? '#',
                        'type' => $n->data['type'] ?? 'info',
                        'created_at' => $n->created_at->diffForHumans(),
                    ];
                }),
                'unread_notifications_count' => $user->unreadNotifications()->count(),
            ]) : null,
        ],
    ]);
}
}