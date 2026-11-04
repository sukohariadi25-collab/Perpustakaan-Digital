<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Mengubah kolom enum kondisi_kembali agar mencakup rusak_ringan dan rusak_berat
        DB::statement("ALTER TABLE peminjaman MODIFY COLUMN kondisi_kembali ENUM('bagus', 'rusak', 'rusak_ringan', 'rusak_berat', 'hilang') DEFAULT 'bagus'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE peminjaman MODIFY COLUMN kondisi_kembali ENUM('bagus', 'rusak', 'hilang') DEFAULT 'bagus'");
    }
};