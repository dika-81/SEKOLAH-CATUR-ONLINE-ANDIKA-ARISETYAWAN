import { cp, mkdir } from 'node:fs/promises';
// Hanya aset publik. Metadata Git, pengujian, dan dokumentasi tidak ikut diterbitkan.
await mkdir('dist', { recursive: true });
for (const path of ['index.html', 'game.html', '.nojekyll', 'css', 'js', 'data', 'assets', 'licenses']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log('Situs statis siap di dist/');
