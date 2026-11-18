import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';

async function app(mode, run) {
  const child = fork(new URL('./resilience-transport-fixture.cjs', import.meta.url), [], {
    env: { ...process.env, GD_EMBEAT_CONNECT_HOST: '', RESILIENCE_FIXTURE: mode }, silent: true,
  });
  child.stdout.resume(); child.stderr.resume();
  try {
    const [{ port }] = await once(child, 'message', { signal: AbortSignal.timeout(5000) });
    await run(path => fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(3000) }));
  } finally {
    if (child.exitCode === null && child.signalCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
  }
}
for (const mode of ['lyric-recover', 'lyric-truncated']) test(`${mode}: failed lyrics do not poison the next response`, async () => app(mode, async get => {
  assert.equal((await get('/api/music/lyric?id=42')).status, 502);
  const recovered = await get('/api/music/lyric?id=42');
  assert.equal(recovered.status, 200);
  assert.equal((await recovered.json()).lrc, '[00:01]Recovered');
}));
test('valid explicitly empty lyrics remain a successful empty result', async () => app('lyric-empty', async get => {
  const response = await get('/api/music/lyric?id=42');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { lrc: '', tlyric: '' });
}));
for (const mode of ['cover-error', 'cover-type', 'cover-empty']) {
  test(`${mode} never becomes a successful cached image`, async () => app(mode, async get => {
    const response = await get('/api/cover?url=https%3A%2F%2Fp1.music.126.net%2Ffixture.jpg');
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('cache-control'), null);
    assert.equal((await get('/api/health')).status, 200);
  }));
}
for (const mode of ['cover-ok', 'cover-jpg']) test(`${mode}: validated cover remains same-origin image content with success cache headers`, async () => app(mode, async get => {
  const response = await get('/api/cover?url=https%3A%2F%2Fp1.music.126.net%2Ffixture.jpg');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /image\/jpe?g/);
  assert.match(response.headers.get('cache-control'), /max-age=604800/);
  assert.equal(await response.text(), 'fixture-body');
}));

const { createBufferedRequester, readFetchBody } = await import('../buffered-request.cjs');
const { createBoundedCache } = await import('../bounded-cache.cjs');
const http = await import('node:http');
const https = await import('node:https');
const request = createBufferedRequester({ http, https });
async function upstream(run) {
  const server = http.createServer((req, res) => {
    if (req.url === '/headers') return;
    if (req.url === '/body') { res.write('{'); return; }
    if (req.url === '/truncated') { res.write('{'); setImmediate(() => res.destroy()); return; }
    if (req.url === '/slow') {
      const interval = setInterval(() => res.write('x'), 10);
      res.on('close', () => clearInterval(interval)); return;
    }
    if (req.url === '/large') { res.setHeader('Content-Length', '10000'); res.write('x'); return; }
    if (req.url === '/chunked') { res.write('x'.repeat(200)); res.end(); return; }
    if (req.url === '/relative') { res.writeHead(302, { Location: '/json' }); res.end(); return; }
    if (req.url.startsWith('/loop')) { res.writeHead(302, { Location: '/loop' }); res.end(); return; }
    if (req.url.startsWith('/delayed')) {
      const timer = setTimeout(() => { res.writeHead(302, { Location: '/delayed' }); res.end(); }, 35);
      res.on('close', () => clearTimeout(timer)); return;
    }
    res.setHeader('Content-Type', 'application/json'); res.end('{"ok":true}');
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  try { await run(`http://127.0.0.1:${server.address().port}`, server); }
  finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
}
for (const path of ['/headers', '/body', '/slow', '/delayed']) {
  test(`absolute deadline covers ${path} and disposes the request`, { timeout: 2000 }, () => upstream(async (base, server) => {
    const closed = new Promise(resolve => server.once('connection', socket => socket.once('close', resolve)));
    const before = performance.now();
    await assert.rejects(request(base + path, { timeout: 70 }), { code: 'UPSTREAM_TIMEOUT', statusCode: 504 });
    assert.ok(performance.now() - before < 700, 'slow progress and redirects must not reset the deadline');
    await closed;
    assert.equal((await request(base + '/json')).body.toString(), '{"ok":true}', 'failure must not block later work');
  }));
}
test('truncated response fails and same URL can be retried without a stuck promise', { timeout: 2000 }, () => upstream(async base => {
  for (let i = 0; i < 2; i++) await assert.rejects(request(base + '/truncated'), /interrupted|aborted|reset/i);
  assert.equal((await request(base + '/json')).body.toString(), '{"ok":true}');
}));
test('relative redirects work; redirect cycles are bounded', () => upstream(async base => {
  assert.equal((await request(base + '/relative')).body.toString(), '{"ok":true}');
  await assert.rejects(request(base + '/loop', { maxRedirects: 2 }), { code: 'UPSTREAM_REDIRECT_LIMIT' });
}));
for (const path of ['/large', '/chunked']) {
  test(`body limit rejects ${path}`, () => upstream(async base => {
    await assert.rejects(request(base + path, { maxBytes: 100 }), { code: 'UPSTREAM_TOO_LARGE' });
  }));
}
test('caller cancellation stops a request awaiting response headers', () => upstream(async base => {
  const controller = new AbortController();
  const pending = request(base + '/headers', { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, { code: 'UPSTREAM_ABORTED' });
}));
test('fetch JSON body is bounded both by declared length and actual bytes', async () => {
  await assert.rejects(readFetchBody(new Response('x', { headers: { 'Content-Length': '1000' } }), 100), { code: 'UPSTREAM_TOO_LARGE' });
  await assert.rejects(readFetchBody(new Response('x'.repeat(101)), 100), { code: 'UPSTREAM_TOO_LARGE' });
  assert.equal((await readFetchBody(new Response('{"ok":true}'), 100)).toString(), '{"ok":true}');
});
test('cache capacity, LRU promotion, update and expiry stay bounded without discarding hot entries', () => {
  const cache = createBoundedCache(3);
  cache.set('A', 'a', 60000); cache.set('B', 'b', 60000); cache.set('C', 'c', 60000);
  assert.equal(cache.get('A'), 'a');
  cache.set('D', 'd', 60000);
  assert.equal(cache.get('B'), null, 'least recently used completed value is evicted');
  cache.set('A', 'updated', 60000); cache.set('E', 'e', 60000);
  assert.equal(cache.get('C'), null);
  assert.equal(cache.get('A'), 'updated');
  for (let i = 0; i < 5000; i++) cache.set(String(i), i, 60000);
  assert.equal(cache.get('4996'), null);
  assert.equal(cache.get('4997'), 4997);
  assert.equal(cache.get('4999'), 4999);
  cache.set('4999', 'expired', 0);
  assert.equal(cache.get('4999'), null);
});

test('cache expiration removes values at the deadline', t => {
  let now = 100;
  t.mock.method(Date, 'now', () => now);
  const cache = createBoundedCache(3);
  cache.set('A', 'a', 10);
  now = 109; assert.equal(cache.get('A'), 'a');
  now = 110; assert.equal(cache.get('A'), null);
});
