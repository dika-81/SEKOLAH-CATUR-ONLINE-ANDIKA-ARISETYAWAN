import test from 'node:test';
import assert from 'node:assert/strict';
import { Chess } from '../assets/vendor/chess.js';
import { lessons, modules } from '../data/curriculum.js';
import { exercises } from '../data/exercises.js';
import { createProgressStore, validateProgress, STORAGE_KEY } from '../js/progress.js';

test('setiap materi memiliki identitas unik, kuis valid, dan latihan yang tersedia', () => {
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  assert.equal(new Set(exercises.map(l => l.id)).size, exercises.length);
  for (const lesson of lessons) {
    assert.ok(modules.some(m => m.id === lesson.module));
    assert.ok(exercises.some(e => e.id === lesson.exercise));
    assert.ok(Number.isInteger(lesson.answer) && lesson.answer >= 0 && lesson.answer < lesson.options.length);
  }
  for (const module of modules) assert.ok(lessons.some(l => l.module === module.id));
});
test('solusi latihan legal dan tujuan khusus benar', () => {
  for (const exercise of exercises.filter(e => e.moves)) {
    for (const solution of exercise.moves) {
      const game = exercise.fen === 'start' ? new Chess() : new Chess(exercise.fen);
      assert.ok(!game.isGameOver(), exercise.id);
      const move = game.move({ from: solution.slice(0, 2), to: solution.slice(2, 4), promotion: solution[4] });
      assert.ok(move, exercise.id);
      if (exercise.id === 'mat') assert.equal(game.isCheckmate(), true);
      if (exercise.id === 'rokade') assert.equal(game.get('f1').type, 'r');
      if (exercise.id === 'promosi') assert.equal(game.get('a8').type, 'q');
      if (exercise.id === 'enpassant') assert.equal(game.get('d5'), undefined);
      if (exercise.id === 'garpu') { assert.ok(game.inCheck()); assert.ok(game.isAttacked('d8', 'w')); }
    }
  }
});
test('kemajuan bertahan saat dimuat ulang, tidak terduplikasi, dan reset hanya memakai kunci aplikasi', () => {
  const values = new Map([['unrelated', 'keep']]);
  const storage = { getItem: k => values.get(k), setItem: (k, v) => values.set(k, v) };
  const first = createProgressStore(storage);
  first.complete('lessons', 'papan'); first.complete('lessons', 'papan'); first.visit('buah');
  const second = createProgressStore(storage);
  assert.deepEqual(second.get().lessons, ['papan']); assert.equal(second.get().lastLesson, 'buah');
  second.reset(); assert.deepEqual(second.get().lessons, []); assert.equal(values.get('unrelated'), 'keep');
  assert.equal(JSON.parse(values.get(STORAGE_KEY)).version, 1);
});
test('penyimpanan diblokir tidak menghentikan sesi belajar', () => {
  const warnings = [];
  const store = createProgressStore({ getItem() { throw Error(); }, setItem() { throw Error(); } }, m => warnings.push(m));
  store.complete('exercises', 'mat');
  assert.deepEqual(store.get().exercises, ['mat']); assert.equal(warnings.length, 2);
});
test('cadangan salah format tidak merusak kemajuan yang sudah ada', () => {
  const store = createProgressStore({ getItem: () => null, setItem() {} });
  store.complete('lessons', 'papan');
  for (const invalid of [null, [], { version: 2, lessons: [], exercises: [] }, { version: 1, lessons: ['<script>'], exercises: [], lastLesson: null }]) {
    assert.throws(() => store.import(invalid));
  }
  assert.deepEqual(store.get().lessons, ['papan']);
  const valid = validateProgress(JSON.parse(JSON.stringify(store.get())));
  assert.deepEqual(valid.lessons, ['papan']);
});
