# Sekolah Catur Online · Andika Arisetyawan

Fondasi sekolah catur berbahasa Indonesia yang berjalan di peramban. Dibangun dari [game-catur](https://github.com/dika-81/game-catur) pada commit `ced7cccf236b5333e8f813b2301c7c9f272b4604`, dengan tampilan hijau–emas dan mesin Stockfish lokal. Repositori asal tidak diubah.

## Tersedia pada versi 0.1

- Beranda, Belajar, Latihan, Bermain, Analisis, Kemajuanku, dan Panduan.
- 18 pelajaran pengantar dalam enam tahap, masing-masing dilengkapi kuis dan tautan latihan.
- Menu **Kenali Buah**: raja, menteri, benteng, gajah, kuda, dan pion; nilai relatif, posisi awal, gerak, tangkapan, aturan khusus, dan papan latihan langsung di tiap pelajaran.
- 15 latihan papan terarah dengan validasi chess.js, petunjuk bertahap, dan penjelasan solusi. Papan membedakan tujuan kosong dari petak tangkapan.
- Bermain sebagai putih melawan Stockfish 18; empat kedalaman pencarian, pilihan tanpa jam atau jam 10 menit, validasi langkah, dan promosi.
- Papan analisis kedua warna, evaluasi, langkah terbaik, variasi, dan urungkan langkah.
- Kemajuan dan posisi permainan disimpan di localStorage perangkat pengguna.
- Ekspor–impor cadangan kemajuan pelajaran/latihan; validasi berkas dan konfirmasi sebelum mengganti data.
- Tata letak responsif, navigasi keyboard, dan pemberitahuan ketika penyimpanan tidak tersedia.

Ini fondasi yang dapat digunakan, bukan kurikulum lengkap sampai tingkat mahir. Cakupan berikutnya tercantum dalam [roadmap](docs/ROADMAP.md).

## Jalankan dan periksa

Memerlukan Node.js 24. Tidak ada paket npm yang perlu diinstal untuk menjalankan aplikasi.

```sh
npm start
```

Buka `http://127.0.0.1:4173`. Jangan membuka HTML langsung melalui `file://`, karena modul dan WebAssembly Worker memerlukan HTTP.

```sh
npm test
npm run build
```

Hasil build berada dalam `dist/`. Pengujian meliputi aturan catur, solusi latihan, struktur kurikulum, cadangan kemajuan, serta eksekusi Stockfish WASM dalam Worker.

## GitHub Pages

Workflow [pages.yml](.github/workflows/pages.yml) menguji, menyiapkan `dist/`, dan menerbitkan setiap push ke `main`.

1. Pada repositori ini, buka **Settings → Pages**.
2. Pilih **GitHub Actions** sebagai Source pada Build and deployment.
3. Jalankan ulang workflow **Test and deploy GitHub Pages** jika push pertama terjadi sebelum Pages diaktifkan.

Alamat yang dituju setelah deployment berhasil:
`https://dika-81.github.io/SEKOLAH-CATUR-ONLINE-ANDIKA-ARISETYAWAN/`

Seluruh aset memakai path relatif; navigasi memakai hash agar tidak memerlukan fallback server. Lihat [dokumentasi workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Privasi dan data

Tidak ada akun, database, analytics, atau permintaan API eksternal dari aplikasi. Pengguna hanya mengunduh berkas statis. Stockfish dihitung pada perangkat pengguna dan baru dimuat ketika membuka permainan/analisis. Penyimpanan lokal berbeda antarperamban/perangkat dan dapat hilang ketika data situs dibersihkan. Ekspor hanya memuat kemajuan pelajaran dan latihan, bukan posisi permainan. GitHub Pages sebagai penyedia hosting dapat menyimpan log akses untuk keamanan.

Kunci penyimpanan:

- `sekolah-catur:progress:v1`
- `sekolah-catur:game:bot:v1`
- `sekolah-catur:game:analysis:v1`

Tab yang sama-sama membuka kemajuan tidak melakukan penggabungan otomatis. Gunakan satu tab belajar aktif untuk menghindari pembaruan saling mengganti.

## Struktur dan pengembangan

Lihat [ARCHITECTURE.md](docs/ARCHITECTURE.md) untuk tanggung jawab modul dan cara menambah materi.

## Kredit komponen

- Aturan catur: chess.js 1.4.0, BSD-2-Clause, [lisensi](licenses/CHESSJS-BSD-2-CLAUSE.txt), [sumber](https://github.com/jhlywa/chess.js/tree/v1.4.0).
- Engine: Stockfish.js 18 lite single-thread, GPL-3.0, [lisensi](licenses/STOCKFISH-GPL-3.0.txt), [sumber distribusi](https://github.com/nmrugg/stockfish.js), [sumber Stockfish](https://github.com/official-stockfish/Stockfish).
- Berkas engine dan vendor disalin tanpa perubahan dari commit repositori asal di atas. Komentar asal pada berkas tetap dipertahankan. Rincian versi/build ada pada [THIRD_PARTY.md](licenses/THIRD_PARTY.md).
