import { modules, lessons } from '../data/curriculum.js';
import { exercises } from '../data/exercises.js';
import { pieces } from '../data/pieces.js';
import { createProgressStore, validateProgress } from './progress.js';
import { createTrainingBoard } from './board.js';
import { Chess } from '../assets/vendor/chess.js';
import { PIECES } from './game.js';

const main = document.querySelector('#main');
const storageNotice = message => {
  const notice = document.querySelector('#storage-notice');
  notice.hidden = false; notice.textContent = message;
};
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { throw Error(); }, setItem() { throw Error(); } }; }
const progress = createProgressStore(storage, storageNotice);
const button = (text, href, primary = false) => `<a class="button${primary ? ' primary' : ''}" href="${href}">${text}</a>`;
const head = (eyebrow, title, intro) => `<div class="page-head"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="intro">${intro}</p></div>`;
const back = (href, label) => `<a class="back" href="${href}">← ${label}</a>`;
function counts() {
  const saved = progress.get();
  return { lessons: lessons.filter(l => saved.lessons.includes(l.id)).length, exercises: exercises.filter(e => saved.exercises.includes(e.id)).length };
}
function updateTop() { document.querySelector('#top-progress').textContent = `${counts().lessons}/${lessons.length} pelajaran selesai`; }
function mark(kind, id) { progress.complete(kind, id); updateTop(); }
function miniBoard() {
  return `<div class="hero-art" aria-hidden="true"><div class="mini-board">${new Chess().board().flatMap((rank, row) => rank.map((p, col) => `<span class="${(row + col) % 2 ? 'dark ' : ''}${p?.color === 'w' ? 'white' : ''}">${p ? PIECES[p.color + p.type] : ''}</span>`)).join('')}</div><span class="art-caption">Setiap langkah adalah kesempatan belajar.</span></div>`;
}
function moduleCard(module) {
  const items = lessons.filter(l => l.module === module.id);
  const completed = items.filter(l => progress.get().lessons.includes(l.id)).length;
  return `<a class="card" href="#learn/${module.id}"><div class="card-top"><span class="module-icon" aria-hidden="true">${module.icon}</span><span class="tag">${module.level}</span></div><h3>${module.number}. ${module.title}</h3><p>${module.description}</p><div class="track" aria-hidden="true"><span style="width:${completed / items.length * 100}%"></span></div><small>${completed}/${items.length} pelajaran selesai <span aria-hidden="true">↗</span></small></a>`;
}
function home() {
  const saved = progress.get();
  const next = lessons.find(l => l.id === saved.lastLesson && !saved.lessons.includes(l.id)) || lessons.find(l => !saved.lessons.includes(l.id));
  const count = counts();
  main.innerHTML = `<section class="hero"><div><p class="eyebrow">SEKOLAH CATUR ONLINE</p><h1>Langkah kecil.<br><em>Permainan besar.</em></h1><p class="intro">Kenali papanmu, temukan strategimu. Belajar catur selangkah demi selangkah, dengan ritmemu sendiri.</p><div class="hero-actions">${button(next ? (count.lessons ? 'Lanjutkan belajar →' : 'Mulai dari nol →') : 'Ulangi pelajaran →', `#lesson/${next?.id || lessons[0].id}`, true)}<a class="text-link" href="#play">Coba bermain</a></div></div>${miniBoard()}</section>
    <section class="stats" aria-label="Ringkasan belajar"><div class="stat"><strong>${count.lessons}<small> / ${lessons.length}</small></strong><span>Pelajaran diselesaikan</span></div><div class="stat"><strong>${count.exercises}<small> / ${exercises.length}</small></strong><span>Latihan dituntaskan</span></div><div class="stat"><strong>6</strong><span>Tahap perjalanan belajar</span></div></section>
    <div class="section-top"><h2>Perjalanan belajarmu</h2><a class="text-link" href="#learn">Lihat semua pelajaran →</a></div><div class="grid">${modules.map(moduleCard).join('')}</div><p class="bottom-note">Mulai dari dasar atau pilih topik yang ingin kamu pelajari. Versi awal ini berisi pelajaran pengantar dan latihan terpilih; keterampilan tumbuh lewat praktik yang berulang.</p>`;
}
function pieceCatalog() {
  main.innerHTML = head('KENALI BUAH CATUR', 'Kenali pasukanmu satu per satu.', 'Pelajari raja, menteri, benteng, gajah, kuda, dan pion: nilai relatif, posisi awal, cara bergerak, serta cara menangkap.') + `<div class="grid piece-catalog">${pieces.map(piece => `<a class="card" href="#lesson/kenali-${piece.id}"><div class="card-top"><span class="module-icon" aria-hidden="true">${PIECES['w' + piece.type]} ${PIECES['b' + piece.type]}</span><span class="tag">${piece.value === null ? 'Keselamatan utama' : '≈ ' + piece.value + ' poin'}</span></div><h2>${piece.name}</h2><p>${piece.summary}</p><small>${progress.get().lessons.includes('kenali-' + piece.id) ? 'Pelajaran selesai ✓ · Ulangi' : 'Pelajari & coba di papan →'}</small></a>`).join('')}</div><p class="bottom-note">Nilai materi adalah patokan: pion ≈ 1, kuda ≈ 3, gajah ≈ 3, benteng ≈ 5, menteri ≈ 9. Raja tidak memiliki nilai tukar. Aktivitas buah, ancaman, dan keselamatan raja dapat lebih penting daripada angka.</p>`;
}
function mountPieceLesson(pieceId) {
  const piece = pieces.find(p => p.id === pieceId);
  const exercise = exercises.find(e => e.id === `gerak-${pieceId}`);
  const aside = main.querySelector('.lesson-layout > aside');
  aside.innerHTML = `<section class="panel piece-demo"><div class="piece-heading"><span class="module-icon" aria-hidden="true">${PIECES['w' + piece.type]} ${PIECES['b' + piece.type]}</span><strong>${piece.valueLabel}</strong></div><h2>Coba gerak ${piece.name.toLowerCase()}.</h2><p class="muted">${exercise.instruction}</p><div id="piece-board" class="training-board" role="group" aria-label="Latihan gerak ${piece.name.toLowerCase()}, dilihat dari sisi putih"></div><p class="board-legend"><span>● Tujuan kosong</span><span>◯ Bisa menangkap</span></p><p class="muted">Buah sudah dipilih. Klik tujuan yang ditandai, atau pilih kembali buahnya. Gunakan Tab dan Enter untuk bermain dengan keyboard.</p><div id="piece-feedback" class="feedback" role="status" hidden></div><div class="actions"><button id="piece-hint" class="button">Petunjuk</button><button id="piece-reset" class="button">Ulangi posisi</button></div></section><div class="actions">${button('← Semua buah', '#pieces')}</div>`;
  const feedback = document.querySelector('#piece-feedback');
  const show = (message, error = false) => { feedback.hidden = false; feedback.className = `feedback${error ? ' error' : ''}`; feedback.textContent = message; };
  let hint = 0;
  const board = createTrainingBoard(document.querySelector('#piece-board'), exercise, () => {
    mark('exercises', exercise.id); show(exercise.explanation); document.querySelector('#piece-hint').disabled = true;
  }, show);
  document.querySelector('#piece-hint').addEventListener('click', () => show(exercise.hints[Math.min(hint++, exercise.hints.length - 1)]));
  document.querySelector('#piece-reset').addEventListener('click', () => { board.reset(); hint = 0; feedback.hidden = true; document.querySelector('#piece-hint').disabled = false; });
}
function learn(id) {
  const module = modules.find(m => m.id === id);
  if (!module) {
    main.innerHTML = head('KURIKULUM', 'Satu konsep, satu langkah.', 'Enam tahap untuk membangun pemahaman. Semua materi terbuka; kamu bebas memilih titik awal.') + `<a class="lesson-row" href="#pieces"><span class="module-icon" aria-hidden="true">♔</span><div class="lesson-info"><h3>Kenali setiap buah catur</h3><p>Enam buah, nilai relatif, cara bergerak, dan latihan langsung di papan.</p></div><span aria-hidden="true">→</span></a><div class="grid">${modules.map(moduleCard).join('')}</div>`; return;
  }
  main.innerHTML = back('#learn', 'Semua tahap') + head(`TAHAP ${module.number} · ${module.level.toUpperCase()}`, module.title, module.description) + lessons.filter(l => l.module === id).map((l, index) => `<a class="lesson-row" href="#lesson/${l.id}"><span class="number">${index + 1}</span><div class="lesson-info"><h3>${l.title}</h3><p>${l.minutes} menit · Materi, kuis, dan latihan terkait</p></div><span class="tag">${progress.get().lessons.includes(l.id) ? 'Selesai ✓' : 'Pelajari →'}</span></a>`).join('');
}
function lesson(id) {
  const item = lessons.find(l => l.id === id);
  if (!item) return notFound();
  progress.visit(id);
  const module = modules.find(m => m.id === item.module);
  const next = lessons[lessons.indexOf(item) + 1];
  main.innerHTML = back(`#learn/${module.id}`, module.title) + head(`${module.level.toUpperCase()} · ${item.minutes} MENIT`, item.title, 'Baca konsepnya, jawab pertanyaannya, kemudian coba di papan.') + `<div class="lesson-layout"><div><article class="reading">${item.paragraphs.map(p => `<p>${p}</p>`).join('')}</article><section class="panel quiz"><form id="quiz"><fieldset><legend>${item.question}</legend>${item.options.map((option, i) => `<label><input type="radio" name="answer" value="${i}" required><span>${option}</span></label>`).join('')}</fieldset><button class="button primary" type="submit">Periksa jawaban</button></form><div id="feedback" role="status" class="feedback" hidden></div><div id="lesson-next" class="actions" hidden>${button('Coba di papan →', `#practice/${item.exercise}`, true)}${next ? button('Pelajaran berikutnya', `#lesson/${next.id}`) : button('Lihat kemajuanku', '#progress')}</div></section></div><aside><div class="panel"><p class="eyebrow">BELAJAR DENGAN MELAKUKAN</p><h2>Coba konsepnya.</h2><p class="muted">Latihan singkat membantumu menghubungkan penjelasan dengan posisi nyata.</p>${button('Buka latihan →', `#practice/${item.exercise}`)}</div><div class="bottom-note">Pelajaran ditandai selesai setelah jawaban kuis benar. Kamu tetap boleh mengulang kapan saja.</div></aside></div>`;
  if (item.pieceId) mountPieceLesson(item.pieceId);
  document.querySelector('#quiz').addEventListener('submit', event => {
    event.preventDefault();
    const correct = Number(new FormData(event.currentTarget).get('answer')) === item.answer;
    showFeedback(correct ? `Tepat. ${item.explanation}` : 'Belum tepat. Baca kembali konsep di atas, lalu coba sekali lagi.', !correct);
    if (correct) { mark('lessons', id); document.querySelector('#lesson-next').hidden = false; }
  });
}
function showFeedback(message, error = false) {
  const feedback = document.querySelector('#feedback');
  feedback.hidden = false; feedback.className = `feedback${error ? ' error' : ''}`; feedback.textContent = message;
}
function practice(id, theme = 'Semua') {
  const exercise = exercises.find(e => e.id === id);
  if (id && !exercise) return notFound();
  if (!exercise) {
    const themes = ['Semua', ...new Set(exercises.map(e => e.theme))];
    main.innerHTML = head('RUANG LATIHAN', 'Pemahaman menjadi kebiasaan.', 'Latihan terarah di papan. Pilih tema, coba sendiri, dan buka petunjuk ketika dibutuhkan.') + `<div class="filters" aria-label="Tema latihan">${themes.map(t => `<button class="filter" data-theme="${t}" aria-pressed="${theme === t}">${t}</button>`).join('')}</div><div class="grid">${exercises.filter(e => theme === 'Semua' || e.theme === theme).map((e, i) => `<a class="card" href="#practice/${e.id}"><div class="card-top"><span class="module-icon" aria-hidden="true">${['♘', '♖', '♗'][i % 3]}</span><span class="tag">${e.theme}</span></div><h3>${e.title}</h3><p>${e.instruction}</p><small>${progress.get().exercises.includes(e.id) ? 'Sudah diselesaikan ✓' : 'Mulai latihan →'}</small></a>`).join('')}</div>`;
    document.querySelectorAll('[data-theme]').forEach(el => el.addEventListener('click', () => practice(null, el.dataset.theme))); return;
  }
  const next = exercises[(exercises.indexOf(exercise) + 1) % exercises.length];
  main.innerHTML = back('#practice', 'Semua latihan') + head(exercise.theme.toUpperCase(), exercise.title, 'Klik buah, lalu klik tujuan. Kamu juga bisa menggunakan Tab dan Enter.') + `<div class="exercise-layout"><div><div id="training-board" class="training-board" role="group" aria-label="Papan latihan, dilihat dari sisi putih"></div><div class="board-caption"><span>Putih melangkah</span><span>Tanpa batas waktu</span></div></div><aside class="panel"><p class="eyebrow">TANTANGANMU</p><h2>Perhatikan posisi.</h2><p class="muted">${exercise.instruction}</p><div class="actions"><button class="button" id="hint">Petunjuk</button><button class="button" id="retry">Ulangi</button></div><div id="feedback" class="feedback" role="status" hidden></div><div id="exercise-next" class="actions" hidden>${button('Latihan berikutnya →', `#practice/${next.id}`, true)}</div></aside></div>`;
  let hintIndex = 0;
  const board = createTrainingBoard(document.querySelector('#training-board'), exercise, () => {
    mark('exercises', exercise.id); showFeedback(exercise.explanation); document.querySelector('#exercise-next').hidden = false; document.querySelector('#hint').disabled = true;
  }, showFeedback);
  document.querySelector('#hint').addEventListener('click', () => { showFeedback(exercise.hints[Math.min(hintIndex++, exercise.hints.length - 1)]); });
  document.querySelector('#retry').addEventListener('click', () => { board.reset(); hintIndex = 0; document.querySelector('#feedback').hidden = true; document.querySelector('#exercise-next').hidden = true; document.querySelector('#hint').disabled = false; });
}
function gamePage(analysis) {
  main.innerHTML = head(analysis ? 'LABORATORIUM CATUR' : 'ARENA BERMAIN', analysis ? 'Coba. Amati. Pahami.' : 'Saatnya mencoba langkahmu.', analysis ? 'Gerakkan kedua warna, urungkan langkah, dan periksa saran Stockfish. Nilai positif menguntungkan putih.' : 'Bermain sebagai putih melawan Stockfish. Pilih tingkat pencarian dan gunakan mode tanpa jam untuk belajar.') + `<p class="muted">Posisi permainan tersimpan pada perangkat ini. <a class="text-link" href="./game.html?mode=${analysis ? 'analysis' : 'bot'}">Buka papan layar penuh ↗</a></p><iframe class="game-frame" title="${analysis ? 'Papan analisis Stockfish' : 'Permainan melawan Stockfish'}" src="./game.html?embedded=1&mode=${analysis ? 'analysis' : 'bot'}"></iframe>`;
}
function progressPage() {
  const count = counts();
  main.innerHTML = head('CATATAN PRIBADIMU', 'Setiap langkah berarti.', 'Kemajuan ini milikmu, tersimpan hanya di peramban ini. Tidak ada akun atau pengiriman hasil belajar ke server.') + `<section class="stats"><div class="stat"><strong>${count.lessons}/${lessons.length}</strong><span>Pelajaran selesai</span></div><div class="stat"><strong>${count.exercises}/${exercises.length}</strong><span>Latihan selesai</span></div><div class="stat"><strong>${Math.round(count.lessons / lessons.length * 100)}%</strong><span>Materi pengantar dituntaskan</span></div></section><div class="progress-layout"><section class="panel"><h2>Perjalanan per tahap</h2><ul class="progress-list">${modules.map(m => { const ls = lessons.filter(l => l.module === m.id); return `<li><span class="count">${ls.filter(l => progress.get().lessons.includes(l.id)).length}/${ls.length}</span>${m.title}</li>`; }).join('')}</ul><p class="muted">Penyelesaian kuis menunjukkan materi yang pernah dipelajari, bukan rating atau jaminan tingkat kemahiran.</p></section><div><section class="panel"><h2>Cadangan kemajuan</h2><p class="muted">Unduh berkas cadangan untuk berpindah perangkat. Impor akan mengganti catatan pelajaran dan latihan di perangkat ini. Posisi permainan dicatat terpisah dan tidak termasuk cadangan.</p><button id="export" class="button primary">Ekspor cadangan</button><label class="file-input" for="import">Pilih cadangan untuk diperiksa</label><input class="file-input" id="import" type="file" accept=".json,application/json"><div id="feedback" role="status" class="feedback" hidden></div><button id="apply-import" class="button" hidden>Terapkan cadangan</button></section><section class="panel"><h2>Mulai kembali</h2><p class="muted">Menghapus catatan pelajaran dan latihan pada peramban ini. Permainan tersimpan tidak ikut dihapus.</p><button id="reset" class="button danger">Reset kemajuan</button><div id="reset-confirm" class="actions" hidden><button id="confirm-reset" class="button danger">Ya, hapus kemajuan</button><button id="cancel-reset" class="button">Batal</button></div></section></div></div>`;
  document.querySelector('#export').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(progress.get(), null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'kemajuan-sekolah-catur.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  let pending = null;
  document.querySelector('#import').addEventListener('change', async event => {
    pending = null; document.querySelector('#apply-import').hidden = true;
    try {
      const file = event.target.files[0]; if (!file) return;
      if (file.size > 200000) throw new Error('Berkas terlalu besar. Batas cadangan adalah 200 KB.');
      pending = validateProgress(JSON.parse(await file.text()));
      const knownLessons = new Set(lessons.map(l => l.id)); const knownExercises = new Set(exercises.map(e => e.id));
      pending.lessons = pending.lessons.filter(id => knownLessons.has(id)); pending.exercises = pending.exercises.filter(id => knownExercises.has(id));
      if (!knownLessons.has(pending.lastLesson)) pending.lastLesson = null;
      showFeedback(`Cadangan valid: ${pending.lessons.length} pelajaran dan ${pending.exercises.length} latihan. Terapkan untuk mengganti kemajuan saat ini.`);
      document.querySelector('#apply-import').hidden = false;
    } catch (error) { showFeedback(error instanceof SyntaxError ? 'Berkas bukan JSON yang valid.' : error.message, true); }
  });
  document.querySelector('#apply-import').addEventListener('click', () => { if (pending) { progress.import(pending); updateTop(); progressPage(); showFeedback('Cadangan telah diterapkan.'); } });
  document.querySelector('#reset').addEventListener('click', () => { document.querySelector('#reset-confirm').hidden = false; });
  document.querySelector('#cancel-reset').addEventListener('click', () => { document.querySelector('#reset-confirm').hidden = true; });
  document.querySelector('#confirm-reset').addEventListener('click', () => { progress.reset(); updateTop(); progressPage(); showFeedback('Kemajuan pelajaran dan latihan telah direset.'); });
}
function guide() {
  main.innerHTML = head('PANDUAN', 'Belajar nyaman, data tetap milikmu.', 'Kenali cara menggunakan sekolah catur dan batas versi awal ini.') + `<article class="reading guide"><h2>Mulai dari mana?</h2><p>Pilih Belajar untuk mengikuti enam tahap. Setiap pelajaran memiliki penjelasan, kuis, dan tautan ke latihan papan. Menu Latihan dapat digunakan tanpa menyelesaikan materi terlebih dahulu.</p><h2>Bermain dan analisis</h2><p>Mode Bermain menggunakan Stockfish di perangkatmu. Pemain menggunakan putih. Tingkat kesulitan membatasi kedalaman pencarian, bukan rating resmi; level terendah pun belum tentu mudah bagi pemula. Mode Analisis membolehkanmu menggerakkan kedua warna dan mengurungkan langkah.</p><h2>Penyimpanan lokal</h2><p>Kemajuan belajar dan posisi permainan disimpan dalam localStorage peramban. Data tidak disinkronkan ke perangkat lain. Mode privat, pembatasan penyimpanan, atau penghapusan data situs dapat menghilangkannya. Gunakan ekspor pada Kemajuanku untuk mencadangkan pelajaran dan latihan.</p><p>Aplikasi tidak memiliki akun, pelacak analitik, atau API pengiriman hasil belajar. Hosting GitHub Pages tetap dapat mencatat informasi akses seperti alamat IP untuk keamanannya. Baca <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection" target="_blank" rel="noopener noreferrer">keterangan GitHub Pages</a>.</p><h2>Apa yang sudah tersedia?</h2><p>Fondasi ini menyediakan ${lessons.length} pelajaran pengantar, ${exercises.length} latihan terarah, menu Kenali Buah dengan nilai dan gerak setiap buah, permainan dan analisis Stockfish, serta ekspor–impor kemajuan. Mesin baru dimuat ketika papan permainan dibuka agar materi belajar lebih ringan.</p><h2>Pengembangan berikutnya</h2><p>Bank soal bertingkat, penjelasan kesalahan otomatis, ulasan partai, pilihan warna pemain, impor PGN/FEN, kurikulum akhir permainan mendalam, dan bot khusus pemula belum menjadi fitur versi ini. Struktur modul sudah disiapkan agar fitur tersebut dapat dikembangkan bertahap.</p><h2>Kredit</h2><p>Dikembangkan dari fondasi <a href="https://github.com/dika-81/game-catur">game-catur karya Andika Arisetyawan</a>. Aturan langkah menggunakan chess.js dan analisis menggunakan Stockfish 18. Lisensi dan sumber komponen tercantum dalam repositori.</p></article>`;
}
function notFound() { main.innerHTML = head('HALAMAN TIDAK DITEMUKAN', 'Kembali ke papan awal.', 'Tautan ini tidak cocok dengan materi yang tersedia.') + button('Kembali ke beranda', '#home', true); }
function render() {
  const [route = 'home', id] = (location.hash.slice(1) || 'home').split('/');
  const active = route === 'lesson' ? (lessons.find(l => l.id === id)?.pieceId ? 'pieces' : 'learn') : route;
  document.querySelectorAll('[data-route]').forEach(a => { if (a.dataset.route === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  ({ home, learn, pieces: pieceCatalog, lesson, practice, play: () => gamePage(false), analysis: () => gamePage(true), progress: progressPage, guide }[route] || notFound)(id);
  document.title = `${main.querySelector('h1')?.textContent || 'Sekolah Catur'} · Andika Arisetyawan`;
  updateTop();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', render);
render();
