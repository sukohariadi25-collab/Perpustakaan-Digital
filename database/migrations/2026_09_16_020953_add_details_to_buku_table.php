<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('buku', function (Blueprint $table) {
            $table->string('judul')->after('kategori_id');
            $table->string('isbn')->unique()->nullable()->after('judul');
            $table->string('penulis')->nullable()->after('isbn');
            $table->string('penerbit')->nullable()->after('penulis');
            $table->integer('tahun_terbit')->nullable()->after('penerbit');
            $table->string('sampul')->nullable()->after('tahun_terbit');
            $table->integer('stok')->default(1)->after('sampul');
        });
    }

    public function down(): void
    {
        Schema::table('buku', function (Blueprint $table) {
            $table->dropColumn([
                'judul',
                'isbn',
                'penulis',
                'penerbit',
                'tahun_terbit',
                'sampul',
                'stok',
            ]);
        });
    }
};