import { Chess } from '../assets/vendor/chess.js';

const moveFromUci = uci => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

// Shuffle a complete bag: every challenge appears before the next cycle.
export function createPuzzlePicker(puzzles, random = Math.random) {
  let bag = [];
  let lastId = null;
  return () => {
    if (!puzzles.length) throw new Error('Bank tantangan kosong.');
    if (!bag.length) {
      bag = [...puzzles];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag.at(-1).id === lastId) {
        [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
      }
    }
    const puzzle = bag.pop();
    lastId = puzzle.id;
    return puzzle;
  };
}

function bestEntry(node, defending = false) {
  return Object.entries(node.moves).sort((a, b) => defending ? b[1].plies - a[1].plies : a[1].plies - b[1].plies)[0];
}

export function createMateSession(puzzle) {
  const game = new Chess(puzzle.fen);
  let node = puzzle.tree;
  let played = 0;
  let solved = false;
  return {
    game,
    get played() { return played; },
    get solved() { return solved; },
    hint() { return solved ? null : bestEntry(node)?.[0]; },
    reset() { game.load(puzzle.fen); node = puzzle.tree; played = 0; solved = false; },
    move(uci) {
      if (solved) return { ok: false, reason: 'finished' };
      const legal = game.moves({ verbose: true }).some(move => move.from + move.to + (move.promotion || '') === uci);
      if (!legal) return { ok: false, reason: 'illegal' };
      const next = node.moves[uci];
      if (!next) return { ok: false, reason: 'retry' };
      const white = game.move(moveFromUci(uci));
      played++;
      node = next;
      let black = null;
      if (!game.isCheckmate()) {
        // Always choose a defense that delays mate longest, never a random blunder.
        const [reply, afterReply] = bestEntry(node, true);
        black = game.move(moveFromUci(reply));
        node = afterReply;
      }
      solved = game.isCheckmate() && game.turn() === 'b' && played <= 3;
      return { ok: true, white, black, solved };
    },
  };
}

export function solutionLine(puzzle) {
  const game = new Chess(puzzle.fen);
  let node = puzzle.tree;
  const line = [];
  while (node.plies > 0) {
    const [uci, next] = bestEntry(node, game.turn() === 'b');
    line.push(game.move(moveFromUci(uci)).san);
    node = next;
  }
  return line.map((san, i) => i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ${san}` : san).join(' ');
}
