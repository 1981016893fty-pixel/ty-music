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

test('cached artwork API responses return without a background network refresh', async () => {
  const handlers = {};
  let networkCalls = 0;
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => { networkCalls++; return new Response('fresh-image', { headers: { 'content-type': 'image/jpeg' } }); },
    caches: { open: async () => ({ match: async () => new Response('cached-image', { headers: {
      'content-type': 'image/jpeg', 'cache-control': 'public, max-age=604800', date: new Date().toUTCString(),
    } }) }) },
  });
  let response;
  let lifetime;
  handlers.fetch({
    request: new Request('https://example.test/api/cover?picId=42'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetime = value; },
  });
  assert.equal(await (await response).text(), 'cached-image');
  await lifetime;
  assert.equal(networkCalls, 0);
});

test('artwork cache misses return immediately and write best-effort in the event lifetime', async () => {
  const handlers = {};
  let networkCalls = 0;
  let writes = 0;
  let finishWrite;
  const writing = new Promise(resolve => { finishWrite = resolve; });
  let fetchStarted = false;
  let lifetimeRegisteredBeforeFetch = false;
  const lifetimes = [];
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => { fetchStarted = true; networkCalls++; return new Response('first-image', { headers: {
      'content-type': 'image/webp', 'cache-control': 'public, max-age=604800', date: new Date().toUTCString(),
    } }); },
    caches: {
      open: async () => ({ match: async () => null, put: async (_request, response) => { writes++; assert.equal(await response.text(), 'first-image'); await writing; throw new Error('quota'); } }),
    },
  });
  let response;
  handlers.fetch({
    request: new Request('https://example.test/api/artist-photo?name=IU&size=640'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetimes.push(value); if (!fetchStarted) lifetimeRegisteredBeforeFetch = true; },
  });
  assert.equal(await (await response).text(), 'first-image', 'the image response does not wait for storage');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(writes, 1);
  assert.equal(lifetimeRegisteredBeforeFetch, true, 'the cache write lifetime is registered synchronously');
  finishWrite();
  await Promise.all(lifetimes);
  assert.equal(networkCalls, 1);
  assert.equal(writes, 1);
});

test('opaque artist redirects are served but not stored without inspectable cache expiry', async () => {
  const handlers = {};
  let writes = 0;
  const opaqueImage = { ok: false, type: 'opaque', status: 0, headers: new Headers(), clone() { return this; } };
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console,
    fetch: async () => opaqueImage,
    caches: {
      open: async () => ({ match: async () => null, put: async () => { writes++; } }),
    },
  });
  let response;
  let lifetime;
  handlers.fetch({
    request: new Request('https://example.test/api/artist-photo?name=IU&size=640'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetime = value; },
  });
  assert.equal((await response).type, 'opaque');
  await lifetime;
  assert.equal(writes, 0);
});

test('CacheStorage open failures fall back to the image network request', async () => {
  const handlers = {};
  let networkCalls = 0;
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => { networkCalls++; return new Response('image', { headers: { 'content-type': 'image/jpeg' } }); },
    caches: { open: async () => { throw new Error('storage unavailable'); } },
  });
  let response;
  let lifetime;
  handlers.fetch({
    request: new Request('https://example.test/api/cover?picId=43'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetime = value; },
  });
  assert.equal(await (await response).text(), 'image');
  await lifetime;
  assert.equal(networkCalls, 1);
});

test('default artist placeholders without a public TTL are never cached', async () => {
  const handlers = {};
  let writes = 0;
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => new Response('<svg/>', { headers: { 'content-type': 'image/svg+xml' } }),
    caches: { open: async () => ({ match: async () => null, put: async () => { writes++; } }) },
  });
  let response;
  let lifetime;
  handlers.fetch({
    request: new Request('https://example.test/api/artist-photo?name=Unknown&size=640'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetime = value; },
  });
  assert.match(await (await response).text(), /svg/);
  await lifetime;
  assert.equal(writes, 0);
});

test('expired CacheStorage artwork is deleted and fetched from the network', async () => {
  const handlers = {};
  let deleted = 0;
  let fetched = 0;
  const expired = new Response('old-image', { headers: {
    'content-type': 'image/jpeg', 'cache-control': 'public, max-age=3600',
    date: new Date(Date.now() - 7200_000).toUTCString(),
  } });
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => { fetched++; return new Response('new-image', { headers: { 'content-type': 'image/jpeg' } }); },
    caches: { open: async () => ({
      match: async () => expired.clone(), delete: async () => { deleted++; return true; }, put: async () => {},
    }) },
  });
  let response;
  let lifetime;
  handlers.fetch({
    request: new Request('https://example.test/api/cover?picId=44'),
    respondWith(value) { response = value; },
    waitUntil(value) { lifetime = value; },
  });
  assert.equal(await (await response).text(), 'new-image');
  await lifetime;
  assert.equal(deleted, 1);
  assert.equal(fetched, 1);
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
    caches: { open: async () => ({ match: async () => new Response('cached-shell'), put: () => writing }) },
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
    caches: { open: async () => ({ match: async () => new Response('cached-shell') }) },
  });
  let response;
  handlers.fetch({ request: { url: 'https://example.test/', method: 'GET', mode: 'navigate' }, respondWith(value) { response = value; }, waitUntil() {} });
  const result = await Promise.race([response.then(value => value.text()), new Promise(resolve => setTimeout(() => resolve('blocked-by-upstream'), 50))]);
  assert.equal(result, 'cached-shell');
});

test('an active release serves its installed shell even if the requested URL has an older copy', async () => {
  const handlers = {};
  const shell = source.match(/const APP_SHELL = '([^']+)'/)[1];
  vm.runInNewContext(source, {
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => { throw new Error('offline'); },
    caches: { open: async () => ({ match: async key => new Response(key === shell ? 'current shell' : 'previous shell') }) },
  });
  for (const path of ['/', '/?v=old-release']) {
    let response;
    handlers.fetch({ request: { url: 'https://example.test' + path, method: 'GET', mode: 'navigate' }, respondWith(value) { response = value; }, waitUntil() {} });
    assert.equal(await (await response).text(), 'current shell', path);
  }
});

test('navigating to the installed shell URL keeps its cached release intact', async () => {
  const handlers = {};
  const shell = source.match(/const APP_SHELL = '([^']+)'/)[1];
  let installed = 'installed release';
  vm.runInNewContext(source, {
    self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console, Response,
    fetch: async () => ({ status: 200, type: 'basic', clone: () => new Response('different release') }),
    caches: { open: async () => ({
      match: async () => new Response(installed),
      put: async (_key, value) => { installed = await value.text(); },
    }) },
  });
  const lifetimes = [];
  let response;
  handlers.fetch({ request: { url: 'https://example.test' + shell, method: 'GET', mode: 'navigate' }, respondWith(value) { response = value; }, waitUntil(value) { lifetimes.push(value); } });
  assert.equal(await (await response).text(), 'installed release');
  await Promise.all(lifetimes);
  assert.equal(installed, 'installed release');
});

test('navigation never returns a redirected cached shell and survives cache/network failures', async () => {
  for (const scenario of ['redirected', 'cache-failed', 'offline', 'cached-offline']) {
    const handlers = {};
    const redirected = new Response('redirected-shell');
    Object.defineProperty(redirected, 'redirected', { value: true });
    const match = async () => {
      if (scenario === 'cache-failed') throw new Error('cache unavailable');
      if (scenario === 'redirected') return redirected;
      if (scenario === 'cached-offline') return new Response('cached-shell');
    };
    vm.runInNewContext(source, {
      self: { location: { origin: 'https://example.test' }, addEventListener: (name, handler) => { handlers[name] = handler; } },
      URL, console, Response,
      fetch: async () => {
        if (scenario.endsWith('offline')) throw new Error('network unavailable');
        return new Response('fresh-shell');
      },
      caches: { match, open: async () => ({ match, put: async () => {} }) },
    });
    let response;
    const lifetimes = [];
    handlers.fetch({ request: { url: 'https://example.test/?launch=1', method: 'GET', mode: 'navigate', redirect: 'manual' }, respondWith(value) { response = value; }, waitUntil(value) { lifetimes.push(value); } });
    const result = await response;
    assert.equal(result.redirected, false, `${scenario}: browsers reject redirected responses for manual navigation`);
    if (scenario === 'offline') {
      assert.match(result.headers.get('content-type'), /text\/html/);
      assert.match(await result.text(), /离线/);
    } else {
      assert.equal(await result.text(), scenario === 'cached-offline' ? 'cached-shell' : 'fresh-shell', scenario);
    }
    await Promise.all(lifetimes);
  }
});

test('the precached shell uses the canonical root without the Pages index redirect', async () => {
  const handlers = {};
  let paths;
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; }, skipWaiting() {} },
    console,
    fetch: async () => ({ ok: true, json: async () => [] }),
    caches: { open: async () => ({ addAll: async values => { paths = values; } }) },
  });
  let installation;
  handlers.install({ waitUntil: value => { installation = value; } });
  await installation;
  assert.ok(paths.some(path => /^\/\?v=/.test(path)), 'cache canonical root');
  assert.ok(!paths.some(path => path.startsWith('/index.html')), 'Pages redirects index.html');
});
