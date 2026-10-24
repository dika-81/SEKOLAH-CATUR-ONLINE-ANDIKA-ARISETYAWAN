# Pemeriksaan versi awal

Dilakukan pada 24 Oktober 2026 dengan Node.js 24.

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
