import { mateThreePuzzles } from '../data/mate-three.js';
import { createMateSession, createPuzzlePicker, solutionLine } from './mate-three.js';
import { drawPositionBoard } from './board.js';

// Keep the bag across route changes so returning to the quiz continues the cycle.
const pickPuzzle = createPuzzlePicker(mateThreePuzzles);

export function mountMateQuiz(main, progress, onSolved) {
  main.innerHTML = `<div class="page-head"><p class="eyebrow">KUIS SKAKMAT · ${mateThreePuzzles.length} TANTANGAN</p><h1>Temukan mat dalam 3 langkah.</h1><p class="intro">Kamu memainkan putih. Paksa skakmat dalam tiga langkah putih, diselingi dua balasan hitam otomatis. Hitam memilih pertahanan yang paling lama menunda mat.</p></div>
    <div class="exercise-layout mate-layout"><div><div id="mate-board" class="training-board" role="group" aria-label="Papan kuis mat tiga langkah, dilihat dari sisi putih"></div><div class="board-caption"><span id="mate-turn" role="status"></span><span>Tanpa batas waktu</span></div><p class="board-legend"><span>● Tujuan kosong</span><span>◯ Bisa menangkap</span></p><p class="muted">Klik buah putih, lalu petak tujuan. Bisa juga memakai Tab dan Enter.</p></div>
    <aside class="panel"><p class="eyebrow" id="mate-number"></p><h2 id="mate-title"></h2><p class="muted" id="mate-saved"></p><ol class="mate-steps" aria-label="Tiga langkah putih"><li>Langkah 1</li><li>Langkah 2</li><li>Skakmat</li></ol><div class="actions"><button class="button primary" id="mate-random">Acak Tantangan ↻</button><button class="button" id="mate-reset">Ulangi posisi</button><button class="button" id="mate-hint">Petunjuk</button></div><p class="muted mate-random-note">Semua tantangan diacak tanpa pengulangan sampai satu putaran selesai.</p><div id="mate-feedback" class="feedback" role="status" hidden></div><h3 class="mate-history-title">Catatan langkah</h3><ol id="mate-history" class="mate-history" aria-label="Langkah putih dan balasan hitam"></ol><p class="muted">Notasi: K = raja, Q = menteri, R = benteng, B = gajah, N = kuda; + = skak, # = skakmat.</p><details id="mate-solution"><summary>Lihat contoh solusi</summary><p id="mate-solution-line"></p><p class="muted">Ini satu variasi melawan pertahanan terlama. Langkah alternatif yang tetap memaksa mat dalam batas langkah juga diterima.</p></details><p class="muted" id="mate-total"></p></aside></div>`;
  const el = id => main.querySelector(`#mate-${id}`);
  let puzzle, session, selected = null, hintLevel = 0;

  function feedback(message, error = false) {
    el('feedback').hidden = false;
    el('feedback').className = `feedback${error ? ' error' : ''}`;
    el('feedback').textContent = message;
  }
  function savedStatus() {
    const saved = progress.get().exercises;
    el('saved').textContent = saved.includes(puzzle.id) ? 'Tantangan ini sudah pernah kamu selesaikan ✓' : 'Tantangan ini belum diselesaikan.';
    el('total').textContent = `${mateThreePuzzles.filter(p => saved.includes(p.id)).length} dari ${mateThreePuzzles.length} tantangan selesai. Kemajuan tersimpan di peramban ini.`;
  }
  function draw(focusSquare) {
    drawPositionBoard(el('board'), session.game, selected, choose, focusSquare);
    el('turn').textContent = session.solved ? 'Skakmat! Tiga langkah tuntas.' : `Putih melangkah · ${session.played + 1} dari 3`;
    main.querySelectorAll('.mate-steps li').forEach((step, i) => {
      step.classList.toggle('complete', i < session.played);
      if (i === session.played && !session.solved) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    el('hint').disabled = session.solved;
  }
  function choose(square) {
    if (session.solved) return;
    const game = session.game;
    if (selected && square !== selected && game.get(square)?.color !== 'w') {
      const result = session.move(selected + square);
      if (result.ok) {
        selected = null; hintLevel = 0;
        const row = document.createElement('li');
        row.textContent = `${result.white.san}${result.black ? ` · ${result.black.san}` : ''}`;
        el('history').append(row);
        if (result.solved) {
          onSolved(puzzle.id); savedStatus();
          feedback('Tepat! Kamu berhasil melakukan skakmat dalam 3 langkah. Klik Acak Tantangan untuk soal berikutnya.');
        } else feedback(`Tepat: ${result.white.san}. Hitam membalas ${result.black.san}. Temukan langkah putih berikutnya.`);
        draw(square); return;
      }
      feedback(result.reason === 'retry' ? 'Langkah itu legal, tetapi hitam dapat menghindari mat dalam batas langkah. Posisi tetap; coba langkah lain atau buka petunjuk.' : 'Buah itu tidak dapat menuju petak tersebut. Pilih tujuan yang ditandai.', true);
      draw(square); return;
    }
    selected = game.get(square)?.color === 'w' && selected !== square ? square : null;
    draw(square);
  }
  function start(nextPuzzle) {
    puzzle = nextPuzzle; session = createMateSession(puzzle); selected = null; hintLevel = 0;
    el('number').textContent = `TANTANGAN ${mateThreePuzzles.indexOf(puzzle) + 1} / ${mateThreePuzzles.length}`;
    el('title').textContent = puzzle.title;
    el('feedback').hidden = true;
    el('history').replaceChildren();
    el('solution').open = false;
    el('solution-line').textContent = solutionLine(puzzle);
    savedStatus(); draw();
  }
  el('random').addEventListener('click', () => { start(pickPuzzle()); feedback('Tantangan baru siap. Putih melangkah; temukan mat dalam 3 langkah.'); });
  el('reset').addEventListener('click', () => { start(puzzle); feedback('Posisi dikembalikan ke awal. Coba kembali dari langkah pertama.'); });
  el('hint').addEventListener('click', () => {
    const move = session.hint();
    if (!move) return;
    feedback(hintLevel++ === 0 ? `Perhatikan buah putih di ${move.slice(0, 2)}. Pertimbangkan jalan lari raja hitam sebelum melangkah.` : `Coba gerakkan buah dari ${move.slice(0, 2)} ke ${move.slice(2, 4)}.`);
  });
  start(pickPuzzle());
}
