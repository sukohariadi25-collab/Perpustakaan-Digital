<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SalinanBuku extends Model
{
    protected $table = 'salinan_buku';
    protected $fillable = ['buku_id',
        'kode_eksemplar',
        'status',];

    public function buku(): BelongsTo
    {
        return $this->belongsTo(Buku::class, 'buku_id');
    }
}
