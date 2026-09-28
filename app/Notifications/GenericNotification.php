<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class GenericNotification extends Notification
{
    use Queueable;

    protected string $title;
    protected string $message;
    protected string $url;
    protected string $type;

    /**
     * Parameter dinamis untuk semua jenis notifikasi
     */
    public function __construct(string $title, string $message, string $url = '#', string $type = 'info')
    {
        $this->title   = $title;
        $this->message = $message;
        $this->url     = $url;
        $this->type    = $type; // pilihan: 'info' | 'success' | 'warning' | 'danger'
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'title'   => $this->title,
            'message' => $this->message,
            'url'     => $this->url,
            'type'    => $this->type,
        ];
    }
}