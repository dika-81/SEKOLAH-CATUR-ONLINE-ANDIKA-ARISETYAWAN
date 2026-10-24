# Struktur aplikasi

Situs statis tanpa proses server aplikasi. Node.js hanya untuk pengembangan, pengujian, dan penyalinan berkas publik. Tidak ada rahasia atau kredensial di kode yang diterbitkan.

```text
index.html                  Kerangka navigasi sekolah
game.html                   Papan permainan dan analisis mandiri
css/
  school.css                Tampilan sekolah dan latihan
  game.css                  Tampilan papan warisan
js/
  school.js                 Router hash dan halaman sekolah
  board.js                  Papan interaktif untuk latihan terarah
  progress.js               Validasi, simpan, impor, dan reset kemajuan
  play.js                   Interaksi permainan dan analisis
  game.js                   Model aturan permainan
  stockfish.js              Antrean pencarian dan Worker Stockfish
data/
  curriculum.js             Tahap, pelajaran, kuis, tautan latihan
  exercises.js              Posisi, tujuan, petunjuk, dan solusi latihan
assets/
  vendor/chess.js            Validasi aturan
  engine/                   JavaScript dan WASM Stockfish
tests/                      Aturan, konten, penyimpanan, engine
scripts/                    Server lokal dan penyiapan dist
.github/workflows/pages.yml Pengujian dan publikasi Pages
```

## Aliran belajar

`#home` → `#learn` → `#learn/<module-id>` → `#lesson/<lesson-id>` → `#practice/<exercise-id>`.

Pelajaran selesai setelah kuis dijawab benar. Latihan selesai setelah sasaran petak atau langkah UCI yang ditentukan tercapai. Penyelesaian tidak dihitung ganda. Penyelesaian materi tidak dikonversi menjadi rating catur.

`#play` dan `#analysis` memuat `game.html` di iframe berjudul. Pemisahan ini mempertahankan komponen dari situs asal dan mencegah engine dimuat pada halaman materi. Perpindahan keluar dari halaman papan menghentikan konteks iframe. Halaman papan juga dapat dibuka sendiri.

## Menambahkan materi

Tambahkan objek pelajaran pada `data/curriculum.js`, gunakan ID unik yang stabil, rujuk tahap dan latihan yang ada, isi pertanyaan beserta indeks jawaban benar. Jangan mengganti ID konten yang sudah digunakan tanpa migrasi penyimpanan.

Tambahkan latihan pada `data/exercises.js`. `fen: 'start'` berarti posisi awal. Untuk latihan langkah gunakan FEN legal dan daftar solusi UCI pada `moves`. Versi awal hanya menangani satu langkah pengguna; promosi latihan otomatis menjadi menteri. Untuk latihan petak gunakan `type: 'square'` dan `target`.

Jalankan `npm test`; semua posisi dan solusi diperiksa dengan chess.js. Tinjau alasan pengajaran secara manual, karena legalitas langkah saja tidak membuktikan kualitas materi.

## Penyimpanan dan batas

`progress.js` menerima adapter storage agar dapat diuji tanpa DOM. Kegagalan storage menghasilkan pemberitahuan dan fallback memori. Cadangan divalidasi, dibatasi ukurannya, dan hanya diterapkan setelah pengguna memilih tombol Terapkan. ID tidak dikenal diabaikan pada impor UI. Reset tidak memanggil `localStorage.clear()` dan tidak menghapus data lain.

Posisi bot dan analisis memakai kunci berbeda ketika dibuka dari menu sekolah. Pemilihan mode di dalam papan tetap mempertahankan posisi aktif seperti aplikasi asal. Kemajuan antartab belum disinkronkan secara langsung.

Tidak ada backend, login, matchmaking, papan peringkat bersama, atau layanan chat. Banyak pengunjung menjalankan sesi masing-masing. Kapasitas pengiriman berkas mengikuti GitHub Pages dan kecepatan analisis mengikuti perangkat.
