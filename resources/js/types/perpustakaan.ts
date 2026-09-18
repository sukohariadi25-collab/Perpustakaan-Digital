export interface Pengguna {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'siswa';
}


export interface Kategori {
    id: number;
    nama: string;
    slug: string;
}

export interface Buku {
    id: number;
    kategori_id: number;
    judul: string;
    isbn: string;
    penulis: string;
    penerbit: string;
    tahun_terbit: number;
    sampul?: string;
    jumlah_salinan?: number | string;
    stok: number;
    kategori?: Kategori;
    salinan?: SalinanBuku[];
}

export interface SalinanBuku {
    id: number;
    buku_id: number;
    kode_barcode: string;
    status: 'tersedia' | 'dipesan' | 'dipinjam';
    buku?: Buku;
}

export interface Pemesanan {
    id: number;
    user_id: number;
    buku_id: number;
    tanggal_pemesanan: string;
    batas_pengambilan: string;
    status: 'menunggu' | 'diambil' | 'batal';
    buku?: Buku;
    user?: Pengguna;
}

export interface Peminjaman {
    id: number;
    user_id: number;
    nama_siswa: string;
    judul_buku: string;
    salinan_buku_id: number;
    tanggal_pinjam: string;
    batas_kembali: string;
    tanggal_kembali?: string;
    denda: number;
    status: 'dipinjam' | 'kembali' | 'terlambat';
    salinan_buku?: SalinanBuku;
    buku?: Buku;
    user?: Pengguna;
    tanggal_tenggat?: string;
}