<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('salinan_buku', function (Blueprint $table) {
            $table->foreignId('buku_id')->after('id')->constrained('buku')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('salinan_buku', function (Blueprint $table) {
            $table->dropForeign(['buku_id']);
            $table->dropColumn('buku_id');
        });
    }
};