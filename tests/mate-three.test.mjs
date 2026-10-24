import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from '../assets/vendor/chess.js';
import { mateThreePuzzles as puzzles } from '../data/mate-three.js';
import { createMateSession, createPuzzlePicker, solutionLine } from '../js/mate-three.js';
import { createProgressStore } from '../js/progress.js';

const uci = move => move.from + move.to + (move.promotion || '');
const asMove = move => ({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: move[4] });

function verifyProof(game, node, budget) {
  if (node.plies === 0) {
    assert.equal(game.isCheckmate(), true);
    assert.equal(game.turn(), 'b');
    assert.deepEqual(node.moves, {});
    return;
  }
  assert.ok(budget > 0);
  const legal = game.moves({ verbose: true }).map(uci);
  const stored = Object.keys(node.moves);
  assert.ok(stored.length > 0);
  if (game.turn() === 'b') assert.deepEqual(stored.toSorted(), legal.toSorted(), 'Semua pertahanan hitam harus tercakup');
  const distances = [];
  for (const [move, child] of Object.entries(node.moves)) {
    assert.ok(legal.includes(move), `Langkah legal: ${move}`);
    game.move(asMove(move));
    verifyProof(game, child, budget - 1);
    game.undo();
    distances.push(child.plies + 1);
  }
  assert.equal(node.plies, (game.turn() === 'w' ? Math.min : Math.max)(...distances));
}

// Independent chess.js search checks that these are not mate-in-one/two puzzles.
function forcesMate(game, budget) {
  if (game.isCheckmate()) return game.turn() === 'b';
  if (!budget) return false;
  const moves = game.moves({ verbose: true });
  if (!moves.length) return false;
  const attacking = game.turn() === 'w';
  for (const move of moves) {
    game.move(move);
    const wins = forcesMate(game, budget - 1);
    game.undo();
    if (wins === attacking) return attacking;
  }
  return !attacking;
}

test('36 posisi berbeda, enam tema, seluruh cabang memaksa mat tepat tiga langkah', { timeout: 120000 }, () => {
  assert.equal(puzzles.length, 36);
  assert.equal(new Set(puzzles.map(p => p.id)).size, puzzles.length);
  assert.equal(new Set(puzzles.map(p => p.fen)).size, puzzles.length);
  assert.equal(new Set(puzzles.map(p => p.theme)).size, 6);
  for (const puzzle of puzzles) {
    const game = new Chess(puzzle.fen);
    assert.equal(game.turn(), 'w');
    const king = game.board().flat().find(p => p?.type === 'k' && p.color === 'b');
    assert.equal(game.isAttacked(king.square, 'w'), false, puzzle.id);
    assert.equal(forcesMate(game, 3), false, `Tidak boleh ada mat lebih cepat: ${puzzle.id}`);
    assert.equal(puzzle.tree.plies, 5);
    verifyProof(game, puzzle.tree, 5);
    assert.match(solutionLine(puzzle), /^1\. .+ 2\. .+ 3\. .+#$/);
  }
});

test('setiap alternatif langkah awal diterima dan hitam menunda mat sampai langkah ketiga', () => {
  for (const puzzle of puzzles) {
    for (const first of Object.keys(puzzle.tree.moves)) {
      const session = createMateSession(puzzle);
      const one = session.move(first);
      assert.ok(one.ok && one.black && !one.solved, puzzle.id);
      const two = session.move(session.hint());
      assert.ok(two.ok && two.black && !two.solved, puzzle.id);
      const three = session.move(session.hint());
      assert.ok(three.ok && !three.black && three.solved, puzzle.id);
      assert.equal(session.game.history().length, 5);
      assert.equal(session.played, 3);
      const endFen = session.game.fen();
      assert.equal(session.move(first).reason, 'finished');
      assert.equal(session.game.fen(), endFen);
      assert.equal(session.hint(), null);
      session.reset();
      assert.equal(session.game.fen(), puzzle.fen);
      assert.equal(session.played, 0);
      assert.equal(session.solved, false);
    }
  }
});

test('langkah salah tidak mengubah papan atau jumlah langkah; petunjuk tetap bekerja', () => {
  const puzzle = puzzles[0];
  const session = createMateSession(puzzle);
  assert.equal(session.move('a1a1').reason, 'illegal');
  const wrong = session.game.moves({ verbose: true }).map(uci).find(move => !puzzle.tree.moves[move]);
  assert.ok(wrong);
  assert.equal(session.move(wrong).reason, 'retry');
  assert.equal(session.game.fen(), puzzle.fen);
  assert.equal(session.played, 0);
  assert.ok(session.move(session.hint()).ok);
});

test('acak tidak mengulang dalam satu putaran ataupun di perbatasan putaran', () => {
  for (const random of [() => 0, () => 0.5, () => 0.99999]) {
    const pick = createPuzzlePicker(puzzles, random);
    let last = null;
    for (let round = 0; round < 4; round++) {
      const ids = [];
      for (let i = 0; i < puzzles.length; i++) {
        const id = pick().id;
        assert.notEqual(id, last);
        ids.push(id); last = id;
      }
      assert.equal(new Set(ids).size, puzzles.length);
    }
  }
  assert.throws(createPuzzlePicker([]));
  const only = createPuzzlePicker([puzzles[0]]);
  assert.equal(only().id, only().id);
});

test('kemajuan kuis bertahan setelah reload dan ekspor-impor, tanpa duplikasi', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  const store = createProgressStore(storage);
  store.complete('exercises', puzzles[0].id);
  store.complete('exercises', puzzles[0].id);
  const reloaded = createProgressStore(storage);
  assert.deepEqual(reloaded.get().exercises, [puzzles[0].id]);
  const backup = JSON.parse(JSON.stringify(reloaded.get()));
  reloaded.reset(); reloaded.import(backup);
  assert.deepEqual(reloaded.get().exercises, [puzzles[0].id]);
});
