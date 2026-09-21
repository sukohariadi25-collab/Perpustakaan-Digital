<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AppNotification extends Notification
{
    use Queueable;

    public string $title;
    public string $message;
    public string $url;
    public string $type; // 'info', 'success', 'warning', 'danger'
    public array $extraData;

    public function __construct(
        string $title,
        string $message,
        string $url = '#',
        string $type = 'info',
        array $extraData = []
    ) {
        $this->title = $title;
        $this->message = $message;
        $this->url = $url;
        $this->type = $type;
        $this->extraData = $extraData;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return array_merge([
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url,
            'type' => $this->type,
        ], $this->extraData);
    }
}