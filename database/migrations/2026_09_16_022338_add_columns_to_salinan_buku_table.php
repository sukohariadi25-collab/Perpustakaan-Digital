<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salinan_buku', function (Blueprint $table) {
            $table->string('kode_eksemplar')->unique()->after('buku_id');
            $table->enum('status', ['tersedia', 'dipinjam', 'rusak'])->default('tersedia')->after('kode_eksemplar');
        });
    }

    public function down(): void
    {
        Schema::table('salinan_buku', function (Blueprint $table) {
            $table->dropColumn(['kode_eksemplar', 'status']);
        });
    }
};