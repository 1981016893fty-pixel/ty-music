import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
test('install precaches the complete eager ESM graph and rejects off-site modules', async () => {
  for (const valid of [true, false]) {
    const handlers = {};
    let cached = [];
    let skipped = false;
    vm.runInNewContext(source, {
      self: { addEventListener: (name, handler) => { handlers[name] = handler; }, skipWaiting: () => { skipped = true; } },
      console,
      fetch: async () => ({ ok: true, json: async () => valid ? ['/soft-aurora-react.js', '/assets/aurora/chunk-ABC123.js'] : ['https://outside.test/injected.js'] }),
      caches: { open: async () => ({ addAll: async values => { cached = [...values]; } }) },
    });
    let installing;
    handlers.install({ waitUntil: promise => { installing = promise; } });
    if (valid) {
      await installing;
      assert.ok(cached.includes('/assets/aurora/chunk-ABC123.js'));
      for (const script of ['gd-embeat-core', 'browser-provider']) assert.ok(cached.some(path => path.startsWith('/' + script + '.js?')), 'direct provider dependencies are precached');
      assert.ok(cached.some(path => path.startsWith('/search-session.js?')), 'cached player requires its search session dependency');
      assert.equal(skipped, true);
    } else {
      await assert.rejects(installing, /Invalid UI module manifest/);
      assert.equal(cached.length, 0);
      assert.equal(skipped, false);
    }
  }
});

test('search and health bypass even a previously cached response', () => {
  const handlers = {};
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console,
    caches: { match() { throw new Error('search must not read cache'); } },
  });
  for (const path of ['/api/search', '/api/music/search', '/api/health']) {
    let intercepted = false;
    handlers.fetch({ request: { url: `https://example.test${path}?keywords=test`, method: 'GET' }, respondWith() { intercepted = true; } });
    assert.equal(intercepted, false, path);
  }
});

test('shell refresh stays alive until its cache write finishes', async () => {
  const handlers = {};
  let finishWrite;
  let written = false;
  const writing = new Promise(resolve => { finishWrite = () => { written = true; resolve(); }; });
  vm.runInNewContext(source, {
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => ({ status: 200, type: 'basic', clone: () => new Response('fresh-shell') }),
    caches: { match: async () => new Response('cached-shell'), open: async () => ({ put: () => writing }) },
  });
  let lifetime;
  let response;
  handlers.fetch({ request: { url: 'https://example.test/', method: 'GET', mode: 'navigate' }, respondWith(value) { response = value; }, waitUntil(value) { lifetime = value; } });
  assert.equal(await (await response).text(), 'cached-shell');
  let finished = false;
  lifetime.then(() => { finished = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false, 'worker must not terminate before cache.put');
  finishWrite();
  await lifetime;
  assert.equal(written, true);
});

test('returning visitors see the cached shell while a sleeping server is still waking', async () => {
  const handlers = {};
  vm.runInNewContext(source, {
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: () => new Promise(() => {}),
    caches: { match: async () => new Response('cached-shell') },
  });
  let response;
  handlers.fetch({ request: { url: 'https://example.test/', method: 'GET', mode: 'navigate' }, respondWith(value) { response = value; }, waitUntil() {} });
  const result = await Promise.race([response.then(value => value.text()), new Promise(resolve => setTimeout(() => resolve('blocked-by-upstream'), 50))]);
  assert.equal(result, 'cached-shell');
});
