<?php

namespace Database\Seeders;

use App\Models\Buku;
use App\Models\Kategori;
use Illuminate\Database\Seeder;

class BukuSeeder extends Seeder
{
    public function run(): void
    {
        $novel = Kategori::firstOrCreate(['nama' => 'Novel'], ['slug' => 'novel']);
        $teknologi = Kategori::firstOrCreate(['nama' => 'Teknologi'], ['slug' => 'teknologi']);
        $sains = Kategori::firstOrCreate(['nama' => 'Sains'], ['slug' => 'sains']);

        $dataBuku = [
            [
                'kategori_id'  => $novel->id,
                'judul'        => 'Laskar Pelangi',
                'isbn'         => '9789793062792',
                'penulis'      => 'Andrea Hirata',
                'penerbit'     => 'Bentang Pustaka',
                'tahun_terbit' => 2005,
                'sampul'       => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
            ],
            [
                'kategori_id'  => $novel->id,
                'judul'        => 'Bumi Manusia',
                'isbn'         => '9789799731235',
                'penulis'      => 'Pramoedya Ananta Toer',
                'penerbit'     => 'Hasta Mitra',
                'tahun_terbit' => 1980,
                'sampul'       => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
            ],
            [
                'kategori_id'  => $teknologi->id,
                'judul'        => 'Pemrograman Web Modern dengan Laravel & React',
                'isbn'         => '9786020451234',
                'penulis'      => 'Budi Raharjo',
                'penerbit'     => 'Informatika',
                'tahun_terbit' => 2023,
                'sampul'       => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500',
            ],
            [
                'kategori_id'  => $sains->id,
                'judul'        => 'Kosmos',
                'isbn'         => '9786024241234',
                'penulis'      => 'Carl Sagan',
                'penerbit'     => 'KPG',
                'tahun_terbit' => 2016,
                'sampul'       => 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
            ],
        ];

        foreach ($dataBuku as $buku) {
            Buku::updateOrCreate(
                ['isbn' => $buku['isbn']],
                $buku
            );
        }
    }
}