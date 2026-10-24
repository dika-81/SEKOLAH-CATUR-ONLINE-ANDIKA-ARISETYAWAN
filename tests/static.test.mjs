import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

test('HTML dan semua import modul memakai aset lokal yang tersedia pada subpath Pages', async () => {
  const root = new URL('../', import.meta.url);
  const visited = new Set();
  async function checkModule(url) {
    const clean = new URL(url); clean.search = ''; clean.hash = '';
    if (visited.has(clean.href)) return;
    visited.add(clean.href);
    const source = await readFile(clean, 'utf8');
    for (const match of source.matchAll(/^\s*import\s+(?:[\s\S]*?\sfrom\s+)?['"]([^'"]+)['"]/gm)) {
      const specifier = match[1];
      assert.ok(specifier.startsWith('.'), `Import harus relatif: ${specifier}`);
      await checkModule(new URL(specifier, clean));
    }
  }
  for (const html of ['index.html', 'game.html']) {
    const url = new URL(html, root);
    const source = await readFile(url, 'utf8');
    for (const match of source.matchAll(/(?:src|href)="(\.\/[^"?#]+)(?:[^" ]*)"/g)) {
      const asset = new URL(match[1], url);
      await access(asset);
      if (asset.pathname.endsWith('.js')) await checkModule(asset);
    }
  }
  assert.ok(visited.size >= 7);
  const wasm = await readFile(new URL('assets/engine/stockfish-18-lite-single.wasm', root));
  assert.equal(wasm.subarray(0, 4).toString('hex'), '0061736d');
});
