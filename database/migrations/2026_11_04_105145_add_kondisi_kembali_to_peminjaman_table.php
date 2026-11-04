<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peminjaman', function (Blueprint $table) {
            // Menambahkan kolom kondisi_kembali dengan opsi nilai default 'bagus'
            if (!Schema::hasColumn('peminjaman', 'kondisi_kembali')) {
                $table->enum('kondisi_kembali', ['bagus', 'rusak', 'hilang'])->default('bagus')->after('status');
            }
        });
    }

    public function down(): void
    {
        Schema::table('peminjaman', function (Blueprint $table) {
            $table->dropColumn('kondisi_kembali');
        });
    }
};