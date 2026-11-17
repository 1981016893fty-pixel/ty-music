import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { createRequire } from 'node:module';
const { createStaticHandler } = createRequire(import.meta.url)('../static-files.cjs');
const work = fileURLToPath(new URL('../work/', import.meta.url));

function request(port, path, { method = 'GET', headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path, method, headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('error', reject);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject); req.end();
  });
}

test('real application respects gzip refusal and emits a cache variation header', async () => {
  const child = fork(new URL('../server-simple.js', import.meta.url), [], {
    execArgv: ['--require', new URL('./search-transport-fixture.cjs', import.meta.url).pathname],
    env: { ...process.env, GD_EMBEAT_CONNECT_HOST: '', PORT: '0', SEARCH_FIXTURE: 'success' }, silent: true,
  });
  child.stdout.resume(); child.stderr.resume();
  try {
    const [{ port }] = await once(child, 'message', { signal: AbortSignal.timeout(5000) });
    for (const path of ['/player.js', '/search-session.js', '/vendor/font-awesome/css/all.min.css']) {
      const response = await request(port, path, { headers: { 'accept-encoding': 'gzip;q=0, identity' } });
      assert.equal(response.status, 200);
      assert.equal(response.headers['content-encoding'], undefined, path);
      assert.match(response.headers.vary, /Accept-Encoding/i);
    }
    const health = JSON.parse((await request(port, '/api/health')).body);
    assert.equal(health.status, 'ok');
    assert.equal(health.searchSource, 'netease');
    assert.equal(health.supplementalSearchSource, 'embeat');
  } finally {
    if (child.exitCode === null && child.signalCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
  }
});

async function fixture(run, options = {}) {
  await fs.promises.mkdir(work, { recursive: true });
  const root = await fs.promises.mkdtemp(path.join(work, 'static-files-test-'));
  let server;
  try {
    await fs.promises.mkdir(path.join(root, 'assets/aurora'), { recursive: true });
    await fs.promises.mkdir(path.join(root, 'vendor'), { recursive: true });
    await Promise.all([
      fs.promises.writeFile(path.join(root, 'index.html'), '<h1>Static fixture</h1>'),
      fs.promises.writeFile(path.join(root, 'assets/aurora/scene-ABCDEFGH.js'), 'export const scene = "aurora";\n'.repeat(100)),
      fs.promises.writeFile(path.join(root, 'assets/picture.jpg'), Buffer.alloc(4096, 42)),
      fs.promises.writeFile(path.join(root, 'vendor/style.css'), '.fixture { color: red; }'),
    ]);
    const serve = createStaticHandler({ root, ...options });
    server = http.createServer(async (req, res) => {
      if (!await serve(req, res, req.url.split('?')[0])) { res.statusCode = 404; res.end('API fallback'); }
    });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    await run((url, options) => request(server.address().port, url, options), root);
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
    // Preview and delete only this fixture's exact, freshly allocated directory.
    const entries = await fs.promises.readdir(root);
    assert.ok(entries.every(name => ['index.html', 'vendor', 'assets'].includes(name)));
    await fs.promises.rm(root, { recursive: true });
  }
}

test('hashed ESM chunks have JavaScript MIME, gzip bytes and long-lived versioned caching', async () => fixture(async get => {
  const response = await get('/assets/aurora/scene-ABCDEFGH.js', { headers: { 'accept-encoding': 'gzip' } });
  assert.equal(response.status, 200);
  assert.match(response.headers['content-type'], /^application\/javascript/);
  assert.equal(response.headers['content-encoding'], 'gzip');
  assert.match(response.headers['cache-control'], /immutable/);
  assert.equal(gunzipSync(response.body).toString(), 'export const scene = "aurora";\n'.repeat(100));
}));

test('HEAD and conditional requests retain representation headers without sending a body', async () => fixture(async get => {
  const url = '/assets/aurora/scene-ABCDEFGH.js';
  const headers = { 'accept-encoding': 'gzip' };
  const full = await get(url, { headers });
  const head = await get(url, { method: 'HEAD', headers });
  assert.equal(head.status, 200); assert.equal(head.body.length, 0);
  for (const key of ['content-type', 'content-length', 'content-encoding', 'etag', 'vary', 'cache-control']) assert.equal(head.headers[key], full.headers[key], key);
  const cached = await get(url, { headers: { ...headers, 'if-none-match': '"different", ' + full.headers.etag } });
  assert.equal(cached.status, 304); assert.equal(cached.body.length, 0);
  assert.equal(cached.headers.vary, 'Accept-Encoding');
  assert.equal(cached.headers.etag, full.headers.etag);
  const identity = await get(url, { headers: { 'accept-encoding': '*;q=1, gzip;q=0' } });
  assert.equal(identity.headers['content-encoding'], undefined);
  assert.equal(identity.headers.etag, full.headers.etag, 'weak validators may cover both encodings');
}));

test('namespace traversal, malformed escapes, NUL and escaping symlinks never expose files', async () => fixture(async (get, root) => {
  await fs.promises.symlink(path.join(root, 'index.html'), path.join(root, 'assets/escape.js'));
  for (const url of ['/assets/../index.html', '/assets/%2e%2e%2findex.html', '/vendor/../index.html', '/assets/%00.js', '/assets/escape.js', '/assets/..%5cindex.html']) {
    assert.equal((await get(url)).status, 403, url);
  }
  assert.equal((await get('/assets/%FF.js')).status, 400);
  assert.equal((await get('/assets/missing.js')).status, 404);
  assert.equal((await get('/assets/')).status, 403);
  assert.equal((await get('/vendor/style.css', { method: 'POST' })).status, 405);
}));

test('large resources stream correctly and HEAD avoids transferring their bodies', async () => fixture(async get => {
  const picture = await get('/assets/picture.jpg');
  assert.equal(picture.status, 200); assert.equal(picture.headers['content-type'], 'image/jpeg');
  assert.equal(picture.body.length, 4096); assert.ok(picture.body.every(byte => byte === 42));
  const head = await get('/assets/picture.jpg', { method: 'HEAD' });
  assert.equal(head.body.length, 0); assert.equal(head.headers['content-length'], '4096');
  const script = await get('/assets/aurora/scene-ABCDEFGH.js', { headers: { 'accept-encoding': 'gzip' } });
  assert.equal(gunzipSync(script.body).toString(), 'export const scene = "aurora";\n'.repeat(100));
}, { maxFileBytes: 32 }));

test('a symlinked public directory cannot move its boundary outside the configured root', async () => fixture(async (get, root) => {
  await fs.promises.rm(path.join(root, 'assets'), { recursive: true });
  await fs.promises.symlink(path.dirname(root), path.join(root, 'assets'));
  assert.equal((await get(`/assets/${path.basename(root)}/index.html`)).status, 403);
}));

test('concurrent requests share a filesystem read and cached aliases share one prepared file', async () => fixture(async (get, root) => {
  const original = fs.promises.readFile;
  let reads = 0;
  fs.promises.readFile = async function (file, ...args) {
    if (file === path.join(root, 'index.html')) { reads++; await new Promise(resolve => setTimeout(resolve, 10)); }
    return original.call(this, file, ...args);
  };
  try {
    const results = await Promise.all(Array.from({ length: 12 }, (_, i) => get(i % 2 ? '/' : '/index.html')));
    assert.ok(results.every(response => response.status === 200)); assert.equal(reads, 1);
    assert.equal((await get('/')).body.toString(), '<h1>Static fixture</h1>'); assert.equal(reads, 1);
  } finally { fs.promises.readFile = original; }
}));

test('cache capacity evicts old files and changed files are served fresh', async () => fixture(async (get, root) => {
  const original = fs.promises.readFile;
  let reads = 0;
  fs.promises.readFile = async function (file, ...args) { if (file === path.join(root, 'index.html')) reads++; return original.call(this, file, ...args); };
  try {
    const before = await get('/');
    await get('/vendor/style.css');
    await get('/'); assert.equal(reads, 2, 'raw+gzip capacity evicts the older entry');
    await fs.promises.writeFile(path.join(root, 'index.html'), '<h1>Changed fixture content</h1>');
    const after = await get('/');
    assert.equal(after.body.toString(), '<h1>Changed fixture content</h1>');
    assert.notEqual(after.headers.etag, before.headers.etag);
  } finally { fs.promises.readFile = original; }
}, { maxCacheBytes: 100 }));
