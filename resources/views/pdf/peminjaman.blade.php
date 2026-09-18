<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Peminjaman Buku</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; }
        h2 { margin-bottom: 5px; }
        .meta { color: #555; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #cccccc; padding: 7px 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <h2>Laporan Data Peminjaman Buku</h2>
    <p class="meta">Kategori: <strong>Semua Riwayat Peminjaman</strong> | Tanggal Cetak: {{ $tanggal }}</p>

    <table>
        <thead>
            <tr>
                <th width="5%" class="text-center">ID</th>
                <th width="20%">Nama Peminjam</th>
                <th width="25%">Judul Buku</th>
                <th width="12%">Tgl Pinjam</th>
                <th width="12%">Tenggat</th>
                <th width="12%">Tgl Kembali</th>
                <th width="10%">Status</th>
                <th width="14%" class="text-right">Denda</th>
            </tr>
        </thead>
        <tbody>
            @forelse($peminjamanList as $item)
            <tr>
                <td class="text-center">{{ $item->id }}</td>
                <td>{{ $item->user->name ?? '-' }}</td>
                <td>{{ $item->buku->judul ?? '-' }}</td>
                <td>{{ $item->tanggal_pinjam ?? '-' }}</td>
                <td>{{ $item->tanggal_tenggat ?? '-' }}</td>
                <td>{{ $item->tanggal_pengembalian ?? $item->tanggal_kembali ?? '-' }}</td>
                <td>{{ ucfirst($item->status ?? '-') }}</td>
                <td class="text-right">Rp {{ number_format($item->denda ?? 0, 0, ',', '.') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="8" class="text-center">Tidak ada data peminjaman.</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>