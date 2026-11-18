import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'pages-dist');

test('Pages publishes only public assets, a complete module graph and the API worker', async () => {
  execFileSync(process.execPath, ['scripts/build-pages.mjs'], { cwd: root, stdio: 'pipe' });
  const publicFiles = [
    'index.html', 'library-transfer.html', 'library-transfer.js', 'player.js', 'gd-embeat-core.js', 'browser-provider.js', 'search-session.js',
    'soft-aurora-react.js', 'soft-aurora-react.css', 'style.css', 'liquid-glass.js',
    'manifest.json', 'service-worker.js', 'icon-192.png', 'icon-512.png', 'icon.svg',
  ];
  assert.deepEqual((await readdir(out)).sort(), [...publicFiles, 'assets', 'vendor', '_worker.js', '_headers', '_routes.json'].sort());
  for (const name of publicFiles) assert.deepEqual(await readFile(path.join(out, name)), await readFile(path.join(root, name)), name);
  assert.deepEqual(JSON.parse(await readFile(path.join(out, '_routes.json'), 'utf8')), { version: 1, include: ['/api/*'], exclude: [] });
  const worker = await readFile(path.join(out, '_worker.js'), 'utf8');
  assert.match(worker, /cloudflare:node/);
  assert.doesNotMatch(worker, /(?:from\s*|require\s*\()\s*["'](?:node:)?(?:fs|http2)["']/);
  assert.doesNotMatch(worker, /createStaticHandler|createEmbeatTransport/);
  assert.ok(Buffer.byteLength(worker) < 1024 * 1024, 'API bundle remains within a conservative 1 MiB budget');
  const initial = JSON.parse(await readFile(path.join(out, 'assets/aurora/manifest.json'), 'utf8'));
  for (const file of initial) assert.ok((await stat(path.join(out, file.slice(1)))).isFile(), file);
  const entry = await readFile(path.join(out, 'soft-aurora-react.js'), 'utf8');
  for (const [, file] of entry.matchAll(/(?:from\s*|import\s*\()\s*["'](\.\/assets\/aurora\/[^"']+)["']/g)) {
    assert.ok((await stat(path.join(out, file))).isFile(), file);
  }
  const headers = await readFile(path.join(out, '_headers'), 'utf8');
  assert.match(headers, /\/service-worker\.js\n  Cache-Control: no-cache/);
  assert.match(headers, /\/index\.html\n  Cache-Control: no-cache/);
  assert.match(headers, /\/assets\/aurora\/manifest\.json\n  Cache-Control: no-cache/);
  assert.match(headers, /\/assets\/aurora\/[\w-]+-[A-Z0-9]{8}\.js\n  Cache-Control: public, max-age=31536000, immutable/);
});
