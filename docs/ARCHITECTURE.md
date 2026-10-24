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
  mate-three.js             Model kuis, pemilihan pertahanan, dan pengacak tanpa pengulangan
  mate-quiz.js              Antarmuka kuis mat tiga langkah
  progress.js               Validasi, simpan, impor, dan reset kemajuan
  play.js                   Interaksi permainan dan analisis
  game.js                   Model aturan permainan
  stockfish.js              Antrean pencarian dan Worker Stockfish
data/
  curriculum.js             Tahap, pelajaran, kuis, tautan latihan
  exercises.js              Posisi, tujuan, petunjuk, dan solusi latihan
  pieces.js                 Profil enam buah; menghasilkan pelajaran dan latihan gerak
  mate-three.js             36 posisi beserta pohon solusi semua pertahanan
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

`#pieces` membuka katalog Kenali Buah. Profil di `data/pieces.js` menghasilkan enam pelajaran ber-ID `kenali-*` dan enam latihan `gerak-*`. Pelajaran ini memiliki papan latihan langsung, nilai relatif, dan penjelasan individual. `startSquare` pada latihan memilih buah awal untuk memperlihatkan tujuan legal; titik menunjukkan tujuan kosong dan lingkaran menunjukkan tangkapan. Nilai raja memakai `null`, bukan nol, karena tidak mempunyai nilai tukar. ID materi lama tetap dipertahankan untuk menjaga kemajuan yang sudah tersimpan.

`#play` dan `#analysis` memuat `game.html` di iframe berjudul. Pemisahan ini mempertahankan komponen dari situs asal dan mencegah engine dimuat pada halaman materi. Perpindahan keluar dari halaman papan menghentikan konteks iframe. Halaman papan juga dapat dibuka sendiri.

## Menambahkan materi

Tambahkan objek pelajaran pada `data/curriculum.js`, gunakan ID unik yang stabil, rujuk tahap dan latihan yang ada, isi pertanyaan beserta indeks jawaban benar. Jangan mengganti ID konten yang sudah digunakan tanpa migrasi penyimpanan.

Tambahkan latihan pada `data/exercises.js`. `fen: 'start'` berarti posisi awal. Untuk latihan langkah gunakan FEN legal dan daftar solusi UCI pada `moves`. Versi awal hanya menangani satu langkah pengguna; promosi latihan otomatis menjadi menteri. Untuk latihan petak gunakan `type: 'square'` dan `target`.

Jalankan `npm test`; semua posisi dan solusi diperiksa dengan chess.js. Tinjau alasan pengajaran secara manual, karena legalitas langkah saja tidak membuktikan kualitas materi.

## Kuis mat tiga langkah

Rute `#mate3` tersedia di navigasi, beranda, dan Latihan. Kuis berisi 36 posisi akhir permainan: raja–menteri, raja–benteng, dua benteng, menteri–kuda, benteng–gajah, dan dua gajah. Putih memainkan tiga langkah dan hitam membalas dua kali. `drawPositionBoard` dipakai bersama dengan latihan lama, sehingga penanda tujuan dan akses keyboard tetap konsisten.

`data/mate-three.js` menyimpan pohon pembuktian, bukan satu jalur contoh. Pada giliran putih, semua langkah yang tetap memaksa mat dalam sisa batas langkah disimpan. Pada giliran hitam, semua balasan legal disimpan. `plies` menyatakan jarak mat dengan putih mempercepat dan hitam menunda. Antarmuka memilih pertahanan dengan jarak terpanjang; langkah salah ditolak tanpa mengubah posisi. Tidak ada unduhan mesin atau pencarian mahal saat bermain kuis.

Bank dibuat secara deterministik dengan `python scripts/generate-mate-three.py` (alat pengembangan opsional, memerlukan `python-chess` 1.999 / modul chess 1.11.2). Skrip mencoba posisi legal lalu melakukan pencarian semua langkah hingga lima ply. Posisi yang memiliki mat paksa dalam tiga ply ditolak. Regenerasi dapat memerlukan beberapa menit; jangan mengubah ID atau seed bank yang sudah diterbitkan tanpa mempertimbangkan kemajuan pengguna. Berkas hasil sudah disertakan sehingga Python tidak diperlukan untuk menjalankan situs, npm test, build, atau deployment.

Pengujian memakai chess.js secara independen untuk memeriksa setiap cabang solusi, kelengkapan semua balasan hitam, skakmat pada setiap daun, dan tidak adanya mat yang lebih cepat. Pemilih soal menggunakan pengacakan satu putaran penuh serta mencegah pengulangan langsung pada pergantian putaran. Putaran diingat selama tab aktif; pemuatan ulang memulai putaran baru.

Penyelesaian kuis menggunakan ID `mat3-*` dalam daftar `exercises` yang sudah ada. Halaman Kemajuanku menghitung kuis terpisah dari latihan lama, dan filter impor mengenali kedua jenis ID. Format cadangan versi 1 tetap kompatibel.

## Penyimpanan dan batas

`progress.js` menerima adapter storage agar dapat diuji tanpa DOM. Kegagalan storage menghasilkan pemberitahuan dan fallback memori. Cadangan divalidasi, dibatasi ukurannya, dan hanya diterapkan setelah pengguna memilih tombol Terapkan. ID tidak dikenal diabaikan pada impor UI. Reset tidak memanggil `localStorage.clear()` dan tidak menghapus data lain.

Posisi bot dan analisis memakai kunci berbeda ketika dibuka dari menu sekolah. Pemilihan mode di dalam papan tetap mempertahankan posisi aktif seperti aplikasi asal. Kemajuan antartab belum disinkronkan secara langsung.

Tidak ada backend, login, matchmaking, papan peringkat bersama, atau layanan chat. Banyak pengunjung menjalankan sesi masing-masing. Kapasitas pengiriman berkas mengikuti GitHub Pages dan kecepatan analisis mengikuti perangkat.
