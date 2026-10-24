import { Chess } from '../assets/vendor/chess.js';
import { PIECES } from './game.js';
const names = { p: 'pion', n: 'kuda', b: 'gajah', r: 'benteng', q: 'menteri', k: 'raja' };
export function exerciseIcon(exercise) {
  if (exercise.type === 'square') return '▦';
  const from = exercise.moves?.[0]?.slice(0, 2);
  if (!from) return '◇';
  const position = exercise.fen === 'start' ? new Chess() : new Chess(exercise.fen);
  const piece = position.get(from);
  return piece ? PIECES[piece.color + piece.type] : '◇';
}

export function drawPositionBoard(container, game, selected, choose, focusSquare) {
  container.replaceChildren();
  const legal = selected ? game.moves({ square: selected, verbose: true }) : [];
  game.board().forEach((rank, row) => rank.forEach((piece, col) => {
    const square = 'abcdefgh'[col] + (8 - row);
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.square = square;
    button.className = `square${(row + col) % 2 ? ' dark' : ''}${selected === square ? ' selected' : ''}${legal.some(m => m.to === square) ? (piece ? ' capture-target' : ' target') : ''}`;
    button.setAttribute('aria-label', `${square}, ${piece ? names[piece.type] + (piece.color === 'w' ? ' putih' : ' hitam') : 'kosong'}`);
    button.setAttribute('aria-pressed', String(selected === square));
    if (piece) {
      const glyph = document.createElement('span');
      glyph.className = `piece ${piece.color === 'w' ? 'white' : ''}`;
      glyph.textContent = PIECES[piece.color + piece.type];
      glyph.setAttribute('aria-hidden', 'true');
      button.append(glyph);
    }
    if (col === 0 || row === 7) {
      const coordinate = document.createElement('span');
      coordinate.className = 'coord';
      coordinate.textContent = square;
      coordinate.setAttribute('aria-hidden', 'true');
      button.append(coordinate);
    }
    button.addEventListener('click', () => choose(square));
    container.append(button);
  }));
  if (focusSquare) container.querySelector(`[data-square="${focusSquare}"]`)?.focus({ preventScroll: true });
}

export function createTrainingBoard(container, exercise, onSolved, onFeedback) {
  const game = exercise.fen === 'start' ? new Chess() : new Chess(exercise.fen);
  let selected = exercise.startSquare || null;
  let done = false;
  function draw(focusSquare) { drawPositionBoard(container, game, selected, choose, focusSquare); }
  function choose(square) {
    if (done) return;
    if (exercise.type === 'square') {
      if (square === exercise.target) { done = true; selected = square; draw(square); onSolved(); }
      else onFeedback(`${square} belum tepat. Ingat: huruf menunjukkan kolom, angka menunjukkan baris.`, true);
      return;
    }
    if (selected) {
      const legal = game.moves({ square: selected, verbose: true }).find(m => m.to === square && (!m.promotion || m.promotion === 'q'));
      if (legal) {
        const uci = legal.from + legal.to + (legal.promotion || '');
        if (exercise.moves.includes(uci)) {
          game.move({ from: legal.from, to: legal.to, promotion: legal.promotion });
          selected = null; done = true; draw(square); onSolved(); return;
        }
        onFeedback('Langkah itu legal, tetapi belum mencapai tujuan latihan. Periksa instruksi atau gunakan petunjuk.', true);
        selected = null; draw(square); return;
      }
    }
    const piece = game.get(square);
    if (piece?.color === game.turn()) selected = selected === square ? null : square;
    else { selected = null; onFeedback('Pilih buah putih, lalu pilih petak tujuan yang legal.', true); }
    draw(square);
  }
  draw();
  return { reset() { game.load(exercise.fen === 'start' ? new Chess().fen() : exercise.fen); selected = exercise.startSquare || null; done = false; draw(); } };
}
