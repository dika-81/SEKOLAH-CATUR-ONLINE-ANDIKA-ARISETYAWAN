# Pemeriksaan versi awal

Dilakukan pada 24 Oktober 2026 dengan Node.js 24.

## Pembaruan Kuis Mat 3 Langkah

- `npm.cmd test`: **28 pengujian lulus**, termasuk 36 posisi unik dari enam tema, semua pertahanan hitam legal pada pohon solusi, serta tidak adanya mat paksa yang lebih cepat dari tiga langkah.
- Semua alternatif langkah pertama dalam bank diterima, hitam bertahan sampai langkah putih ketiga, dan papan terkunci setelah skakmat. Langkah salah tidak mengubah posisi; ulangi mengembalikan posisi awal.
- Pengacakan diuji selama empat putaran dengan tiga sumber acak deterministik: tidak ada pengulangan dalam putaran atau pada batas dua putaran.
- Kemajuan kuis diuji setelah reload, ekspor–impor, dan penyelesaian berulang.
- `npm.cmd run build` berhasil. Modul kuis dan bank soal ikut dalam `dist/`; pemeriksaan aset relatif/subpath lulus.
- Pemeriksaan visual/interaksi langsung belum berhasil: alat browser mengalami timeout saat membuka tab lokal, lalu gagal dengan `Debugger unattached`. Server lokal mengembalikan HTTP 200. Hasil tes otomatis tidak menggantikan pemeriksaan visual desktop/ponsel.

## Pemeriksaan fondasi

- `npm test`: aturan permainan, solusi latihan, kemajuan/cadangan, URL aset relatif, serta eksekusi Stockfish WebAssembly dalam Worker.
- `npm run build`: penyalinan aset publik ke `dist/`.
- `node --check` untuk modul antarmuka.
- Server lokal mengembalikan halaman utama melalui HTTP.

Pemeriksaan visual dan interaksi browser belum selesai: peluncuran Chrome headless pada lingkungan kerja ditolak dengan `spawn EPERM`. Karena itu ukuran papan/iframe pada berbagai perangkat dan alur klik menyeluruh tetap perlu diperiksa melalui browser. Pengujian aturan dan engine tidak menggantikan pemeriksaan visual.

Checklist pemeriksaan browser berikutnya:

1. Beranda pada desktop dan ponsel; navigasi tanpa halaman terpotong.
2. Jawaban salah/benar, lanjut pelajaran, dan kemajuan setelah reload.
3. Sembilan latihan papan, petunjuk, dan tombol ulangi.
4. Ekspor, impor valid/tidak valid, dan konfirmasi reset.
5. Langkah bot, promosi, opsi jam, analisis, dan urungkan langkah.
6. Publikasi pada subpath GitHub Pages serta pemuatan Worker/WASM.
