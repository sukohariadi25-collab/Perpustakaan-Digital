<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Buku extends Model
{
    protected $table = 'buku';
    protected $fillable = [
        'kategori_id',
        'judul',
        'isbn',
        'penulis',
        'penerbit',
        'tahun_terbit',
        'sampul',
        'stok',];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function salinan(): HasMany
    {
        return $this->hasMany(SalinanBuku::class, 'buku_id');
    }
}