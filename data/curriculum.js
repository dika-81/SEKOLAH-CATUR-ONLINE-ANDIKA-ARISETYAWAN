// Konten terkurasi. ID harus tetap stabil karena dipakai oleh kemajuan lokal.
import { pieceLessons } from './pieces.js';
export const modules = [
  { id: 'dasar', number: '01', title: 'Kenali papanmu', level: 'Mulai dari nol', icon: '♙', description: 'Kenali arena, buah catur, dan langkah pertamamu.' },
  { id: 'aturan', number: '02', title: 'Pahami permainan', level: 'Dasar', icon: '♔', description: 'Skak, skakmat, dan aturan khusus yang perlu kamu tahu.' },
  { id: 'aman', number: '03', title: 'Bermain dengan aman', level: 'Pemula', icon: '♘', description: 'Jaga buahmu dan perhatikan rencana lawan.' },
  { id: 'taktik', number: '04', title: 'Temukan peluang', level: 'Menengah', icon: '♗', description: 'Kenali pola serangan dan hitung akibat langkahmu.' },
  { id: 'strategi', number: '05', title: 'Bangun rencana', level: 'Menengah', icon: '♕', description: 'Kembangkan buah dan pahami kebutuhan posisi.' },
  { id: 'akhir', number: '06', title: 'Tuntaskan permainan', level: 'Menuju lanjutan', icon: '♖', description: 'Aktifkan raja dan ubah keunggulan menjadi hasil.' },
];
export const lessons = [
  { id: 'papan', module: 'dasar', title: 'Papan dan koordinat', minutes: 4, exercise: 'petak', paragraphs: [
    'Papan catur memiliki 64 petak: delapan kolom dan delapan baris. Saat menyusun papan, petak sudut kanan terdekat harus berwarna terang.',
    'Kolom diberi huruf a sampai h, sedangkan baris bernomor 1 sampai 8. Nama petak ditulis dengan huruf lalu angka, misalnya e4. Dari sisi putih, a1 berada di kiri bawah.',
    'Tujuan permainan adalah membuat raja lawan skakmat. Raja tidak ditangkap: permainan berakhir ketika ancaman terhadap raja tidak dapat diatasi.'
  ], question: 'Dari sisi putih, apa nama petak di sudut kiri bawah?', options: ['a1', 'h1', 'a8'], answer: 0, explanation: 'Kolom paling kiri adalah a dan baris terdekat adalah 1: a1.' },
  { id: 'buah', module: 'dasar', title: 'Cara bergerak setiap buah', minutes: 6, exercise: 'kuda', paragraphs: [
    'Benteng bergerak lurus; gajah diagonal; menteri menggabungkan keduanya. Ketiganya tidak boleh melompati buah lain. Kuda bergerak membentuk huruf L dan dapat melompat.',
    'Raja bergerak satu petak ke segala arah, tetapi tidak boleh menuju petak yang diserang lawan. Kamu tidak boleh meninggalkan rajamu sendiri dalam skak.',
    'Pion maju satu petak ke depan dan menangkap satu petak diagonal ke depan. Dari petak awal, pion boleh maju dua petak jika jalurnya kosong. Pion tidak berjalan mundur.'
  ], question: 'Buah mana yang dapat melompati buah lain?', options: ['Gajah', 'Kuda', 'Benteng'], answer: 1, explanation: 'Kuda melompat dengan pola dua petak pada satu arah dan satu petak tegak lurus.' },
  ...pieceLessons,
  { id: 'skak', module: 'aturan', title: 'Skak, skakmat, dan pat', minutes: 5, exercise: 'mat', paragraphs: [
    'Skak berarti raja sedang diserang. Atasi dengan memindahkan raja, menangkap penyerang, atau menutup jalur serangan jika memungkinkan. Serangan kuda tidak bisa ditutup.',
    'Skakmat terjadi ketika raja diserang dan tidak ada langkah legal untuk menyelamatkannya. Pihak yang memberi skakmat menang.',
    'Pat terjadi ketika pemain yang mendapat giliran tidak sedang skak tetapi tidak memiliki langkah legal. Hasilnya remis, meskipun salah satu pihak memiliki lebih banyak buah.'
  ], question: 'Raja tidak skak, tetapi pihak yang mendapat giliran tidak punya langkah legal. Hasilnya?', options: ['Skakmat', 'Permainan dilanjutkan', 'Pat: remis'], answer: 2, explanation: 'Tanpa skak dan tanpa langkah legal, posisi adalah pat, sehingga permainan remis.' },
  { id: 'khusus', module: 'aturan', title: 'Rokade, promosi, dan en passant', minutes: 7, exercise: 'rokade', paragraphs: [
    'Rokade memindahkan raja dua petak ke arah benteng, lalu benteng melintasi raja ke petak di sampingnya. Raja dan benteng terkait belum boleh pernah bergerak; petak di antaranya kosong.',
    'Rokade tidak boleh dilakukan saat raja skak, melewati petak yang diserang, atau berakhir pada petak yang diserang. Pada rokade panjang, b1 atau b8 harus kosong tetapi boleh diserang.',
    'Pion yang mencapai baris terakhir wajib menjadi menteri, benteng, gajah, atau kuda. En passant adalah tangkapan khusus atas pion yang baru maju dua petak dan mendarat di samping pionmu; kesempatan ini hanya pada giliran berikutnya.'
  ], question: 'Apakah raja boleh melewati petak yang diserang saat rokade?', options: ['Boleh jika benteng aman', 'Tidak boleh', 'Boleh jika belum pernah bergerak'], answer: 1, explanation: 'Selain belum pernah bergerak, raja harus aman di petak awal, petak lintasan, dan tujuan.' },
  { id: 'nilai', module: 'aman', title: 'Nilai buah dan perlindungan', minutes: 5, exercise: 'benteng', paragraphs: [
    'Sebagai patokan awal: pion bernilai 1, kuda dan gajah sekitar 3, benteng 5, serta menteri 9. Raja tidak memiliki nilai tukar karena keselamatannya menentukan permainan.',
    'Angka ini bukan hukum mutlak. Aktivitas buah, keselamatan raja, dan ancaman konkret dapat lebih penting daripada jumlah materi.',
    'Sebelum melangkah, periksa buah yang diserang dan siapa yang menjaganya. Penjaga yang terikat pada raja mungkin tidak bisa membalas tangkapan.'
  ], question: 'Menurut patokan materi dasar, pertukaran mana yang biasanya menguntungkan?', options: ['Menteri untuk pion', 'Benteng untuk kuda tanpa kompensasi', 'Kuda untuk benteng'], answer: 2, explanation: 'Kuda bernilai sekitar 3, benteng sekitar 5. Tetap periksa ancaman konkret sebelum menukar.' },
  { id: 'ancaman', module: 'aman', title: 'Kebiasaan sebelum melangkah', minutes: 4, exercise: 'gajah', paragraphs: [
    'Setiap lawan melangkah, tanyakan: apa yang berubah? Adakah serangan baru terhadap raja, menteri, atau buah tanpa penjagaan?',
    'Periksa skak, tangkapan, dan ancaman untuk kedua pihak. Pilih beberapa calon langkah lalu bayangkan jawaban terbaik lawan.',
    'Sebelum menjalankan pilihanmu, lakukan pemeriksaan terakhir: apakah raja tetap aman dan apakah ada buah yang terlepas?' 
  ], question: 'Apa kebiasaan yang baik setelah lawan melangkah?', options: ['Langsung menjalankan rencana lama', 'Memeriksa ancaman yang berubah', 'Selalu menggerakkan menteri'], answer: 1, explanation: 'Langkah lawan mengubah posisi. Periksa ancamannya sebelum meneruskan rencanamu.' },
  { id: 'garpu', module: 'taktik', title: 'Serangan ganda', minutes: 5, exercise: 'garpu', paragraphs: [
    'Serangan ganda menyerang dua sasaran sekaligus. Kuda sering membuat pola ini karena arah serangannya berbeda dari benteng dan gajah.',
    'Serangan ganda yang memberi skak biasanya memaksa lawan menyelamatkan raja terlebih dahulu. Buah lain dapat menjadi sasaran tangkapan berikutnya.',
    'Jangan berhenti menghitung setelah melihat dua sasaran. Pastikan buah penyerang tidak dapat ditangkap dan periksa apakah lawan punya jawaban yang lebih kuat.'
  ], question: 'Mengapa serangan ganda sambil skak sering kuat?', options: ['Lawan harus menangani skak dahulu', 'Kuda tidak dapat ditangkap', 'Lawan kehilangan giliran'], answer: 0, explanation: 'Lawan wajib mengatasi skak, sehingga sasaran lainnya mungkin tidak sempat diselamatkan.' },
  { id: 'ikatan', module: 'taktik', title: 'Ikatan dan menghitung variasi', minutes: 6, exercise: 'mat', paragraphs: [
    'Ikatan terjadi ketika memindahkan sebuah buah membuka serangan terhadap sasaran di belakangnya. Jika sasaran itu raja, buah tersebut tidak boleh bergerak dengan cara yang meninggalkan raja skak.',
    'Dalam ikatan relatif, sasaran di belakang bisa berupa menteri. Buah yang terikat masih boleh bergerak secara aturan; keputusan bergantung pada hasil pertukarannya.',
    'Hitung dengan urutan: langkahmu, jawaban terbaik lawan, lalu langkah lanjutannya. Jangan menganggap lawan selalu memilih jawaban yang kamu harapkan.'
  ], question: 'Buah yang terikat terhadap rajanya boleh bergerak jika…', options: ['Menangkap sesuatu apa pun', 'Raja tetap tidak terkena skak', 'Pemain rela kehilangan raja'], answer: 1, explanation: 'Legalitas langkah ditentukan oleh keselamatan raja setelah langkah tersebut.' },
  { id: 'pembukaan', module: 'strategi', title: 'Pembukaan dengan tujuan', minutes: 5, exercise: 'kuda', paragraphs: [
    'Pada awal permainan, usahakan mengendalikan pusat, mengembangkan kuda dan gajah, serta menjaga raja. Rokade sering membantu keselamatan raja dan menghubungkan benteng.',
    'Menggerakkan buah yang sama berkali-kali tanpa alasan memberi lawan waktu untuk berkembang. Membawa menteri terlalu cepat juga dapat membuatnya dikejar.',
    'Prinsip ini membantu memilih langkah, tetapi ancaman konkret tetap didahulukan. Pahami alasan suatu langkah sebelum menghafal variasi pembukaan.'
  ], question: 'Apa tujuan yang baik di pembukaan?', options: ['Mengembangkan buah dan menjaga raja', 'Menggerakkan menteri setiap giliran', 'Mendorong semua pion sebelum buah lain'], answer: 0, explanation: 'Buah aktif, pengaruh di pusat, dan raja aman memberi dasar permainan yang sehat.' },
  { id: 'rencana', module: 'strategi', title: 'Dari posisi menuju rencana', minutes: 6, exercise: 'garpu', paragraphs: [
    'Nilai keselamatan raja, jumlah materi, aktivitas buah, dan struktur pion. Temukan buahmu yang paling pasif dan pikirkan petak yang lebih baik baginya.',
    'Benteng sering aktif pada kolom terbuka, sedangkan kuda menyukai petak kuat yang sulit diusir pion. Kelemahan pion lawan dapat menjadi sasaran jangka panjang.',
    'Rencana harus berubah mengikuti jawaban lawan. Sebelum memperbaiki posisi secara perlahan, pastikan tidak ada ancaman taktis yang mendesak.'
  ], question: 'Jika tidak ada ancaman mendesak, langkah perencanaan yang berguna adalah…', options: ['Menukar semua buah tanpa alasan', 'Mencari perbaikan untuk buah paling pasif', 'Mengabaikan keselamatan raja'], answer: 1, explanation: 'Mengaktifkan buah pasif dapat meningkatkan kerja sama seluruh pasukan.' },
  { id: 'promosi', module: 'akhir', title: 'Raja aktif dan pion bebas', minutes: 5, exercise: 'promosi', paragraphs: [
    'Saat buah berat berkurang, raja sering dapat berperan aktif. Tetap periksa serangan lawan; raja tidak pernah boleh masuk petak yang diserang.',
    'Pion bebas tidak menghadapi pion lawan pada kolomnya atau kolom di sebelahnya di jalur menuju promosi. Dukung kemajuannya dengan raja atau buah lain.',
    'Menteri sering menjadi pilihan promosi terkuat, tetapi kadang promosi kuda memberi skak yang dibutuhkan atau promosi lain menghindari pat.'
  ], question: 'Apakah pion wajib promosi menjadi menteri?', options: ['Ya, selalu', 'Tidak, boleh juga benteng, gajah, atau kuda', 'Tidak, boleh menjadi raja'], answer: 1, explanation: 'Pilihan promosi adalah menteri, benteng, gajah, atau kuda, sesuai kebutuhan posisi.' },
  { id: 'konversi', module: 'akhir', title: 'Menang tanpa membuat pat', minutes: 6, exercise: 'mat', paragraphs: [
    'Dalam akhir raja dan menteri melawan raja, batasi ruang raja lawan, dekatkan rajamu dengan aman, lalu susun skakmat dengan dukungan raja.',
    'Saat tidak memberi skak, pastikan raja lawan masih memiliki langkah legal. Mengurung seluruh petaknya tanpa skak justru menghasilkan pat.',
    'Setelah bermain, tinjau momen penting: ancaman yang terlewat, kesempatan yang tidak dipakai, dan rencana yang berhasil. Pilih satu hal untuk diperbaiki pada permainan berikutnya.'
  ], question: 'Saat unggul menteri, apa yang harus dicegah?', options: ['Raja sendiri aktif', 'Lawan pat ketika tidak sedang skak', 'Memberi skakmat'], answer: 1, explanation: 'Pat menghasilkan remis. Keunggulan materi tidak mengubah aturan ini.' },
];
