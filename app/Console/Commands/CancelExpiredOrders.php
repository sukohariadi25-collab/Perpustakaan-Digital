<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Peminjaman;
use App\Models\Buku;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CancelExpiredOrders extends Command
{
    protected $signature = 'orders:cancel-expired';
    protected $description = 'Membatalkan otomatis pesanan pending yang melewati batas waktu 24 jam';

    public function handle()
    {
        $expiredTime = Carbon::now()->subHours(24);

        // Ambil pesanan berstatus pending yang dibuat lebih dari 24 jam lalu
        $expiredOrders = Peminjaman::where('status', 'pending')
            ->where('created_at', '<=', $expiredTime)
            ->get();

        if ($expiredOrders->isEmpty()) {
            $this->info('Tidak ada pesanan expired.');
            return 0;
        }

        $count = 0;
        DB::transaction(function () use ($expiredOrders, &$count) {
            foreach ($expiredOrders as $order) {
                // Kembalikan stok buku jika di-lock saat booking
                if ($order->buku_id) {
                    Buku::where('id', $order->buku_id)->increment('stok');
                }

                $order->update([
                    'status' => 'canceled',
                    'catatan' => 'Dibatalkan otomatis oleh sistem (Expired 24 Jam)',
                ]);

                $count++;
            }
        });

        $this->info("Berhasil membatalkan {$count} pesanan expired.");
        return 0;
    }
}