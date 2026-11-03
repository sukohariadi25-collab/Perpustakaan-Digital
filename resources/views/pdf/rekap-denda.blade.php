<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Rekapitulasi Denda AksaraNet</title>
    <style>
        body { font-family: sans-serif; font-size: 11px; color: #333; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .header h2 { margin: 0; font-size: 16px; text-transform: uppercase; }
        .header p { margin: 3px 0; font-size: 10px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
        th { background-color: #f4f4f4; font-weight: bold; text-transform: uppercase; font-size: 10px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .footer { margin-top: 30px; width: 100%; display: table; }
        .footer-left { display: table-cell; width: 70%; }
        .footer-right { display: table-cell; width: 30%; text-align: center; }
        .signature-space { height: 50px; }
    </style>
</head>
<body>

    <div class="header">
        <h2>Laporan Rekapitulasi Denda Keterlambatan</h2>
        <p>Perpustakaan Digital AksaraNet • Dicetak pada: {{ $tanggal }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th class="text-center" width="5%">No</th>
                <th width="22%">Nama Siswa</th>
                <th width="25%">Judul Buku</th>
                <th class="text-center" width="12%">Batas Kembali</th>
                <th class="text-center" width="12%">Tgl Dikembalikan</th>
                <th class="text-center" width="12%">Status</th>
                <th class="text-right" width="12%">Nominal Denda</th>
            </tr>
        </thead>
        <tbody>
            @forelse($peminjamanList as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>{{ $item->user->name ?? $item->nama_siswa ?? '-' }}</td>
                    <td>{{ $item->buku->judul ?? $item->judul_buku ?? '-' }}</td>
                    <td class="text-center">{{ $item->tanggal_kembali ?? $item->tanggal_tenggat ?? '-' }}</td>
                    <td class="text-center">{{ $item->tanggal_pengembalian ?? '-' }}</td>
                    <td class="text-center" style="text-transform: uppercase;">{{ $item->status ?? '-' }}</td>
                    <td class="text-right" style="font-weight: bold;">
                        {{ $item->denda_calculated > 0 ? 'Rp ' . number_format($item->denda_calculated, 0, ',', '.') : '-' }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center">Tidak ada data denda yang tersedia.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top: 15px; font-weight: bold; font-size: 12px; text-align: right;">
        Total Akumulasi Denda Tercatat: Rp {{ number_format($totalDendaTerkumpul, 0, ',', '.') }}
    </div>

    <div class="footer">
        <div class="footer-left">
            <p><strong>Catatan:</strong> Laporan ini digenerate secara otomatis oleh sistem AksaraNet.</p>
        </div>
        <div class="footer-right">
            <p>Mengetahui,</p>
            <p><strong>Kepala Pustakawan</strong></p>
            <div class="signature-space"></div>
            <p>___________________</p>
        </div>
    </div>

</body>
</html>