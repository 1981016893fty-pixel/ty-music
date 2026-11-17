import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createEmbeatClient, modifiedMD5 } = require('../gd-embeat.cjs');
const song = id => ({ id: String(id), name: `Song ${id}`, artist: ['Artist'], source: 'embeat', url_id: `url${id}`, lyric_id: `lyric${id}`, pic_id: `pic${id}`, extra_data: { duration: 120, isrc: 'ISRC' } });
const json = (value, status = 200) => new Response(JSON.stringify(value), { status });
test('current modified MD5 fixed vectors', () => {
  assert.equal(modifiedMD5('abc'), '4fda7bbf537d87d41a04b8299690eea4');
  assert.equal(modifiedMD5(''), '92e00fe1ad872948b605fe05b44dd578');
  assert.equal(modifiedMD5('中文'), '90c4748ebfeb4a2ca62f7090e1049bab');
  assert.equal(modifiedMD5('a'.repeat(64)), '8f7b4b8cc53dd4c738715eaf686e8d92');
});
test('request encodes once, signs official clock and preserves resource fields', async () => {
  const calls = [];
  const client = createEmbeatClient({ fetchImpl: async url => {
    calls.push(new URL(url)); return String(url).endsWith('/time') ? new Response('1794826800000') : json({ url: 'https://example.test/song', lyric: '[00:01]test', extra: 42 });
  } });
  const result = await client.request('lyric', { id: '周杰伦', source: 'embeat' }, '周杰伦');
  assert.equal(result.extra, 42); assert.equal(calls.length, 2);
  assert.equal(calls[1].searchParams.get('id'), '周杰伦'); assert.equal(calls[1].searchParams.get('s'), '7E101CFD');
  assert.equal(calls[1].hostname, 'music.gdstudio.xyz');
});
test('website seconds clock signs the same request as its millisecond equivalent', async () => {
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) return new Response('1794826800');
    assert.equal(new URL(url).searchParams.get('s'), '7E101CFD');
    return json([]);
  } });
  assert.deepEqual((await client.search('周杰伦')).songs, []);
});
test('search uses embeat page mapping, slices offset and preserves IDs', async () => {
  let params;
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) return new Response('1794826800000');
    params = new URL(url).searchParams; return json(Array.from({ length: 3 }, (_, i) => song(i)));
  } });
  const page = await client.search('名字 + % &', 3, 1);
  assert.equal(params.get('source'), 'embeat'); assert.equal(params.get('name'), '名字 + % &');
  assert.equal(params.get('pages'), '1'); assert.equal(params.get('count'), '3');
  assert.equal(page.total, null); assert.equal(page.nextOffset, 3); assert.equal(page.hasMore, true);
  assert.equal(page.songs[0].url_id, 'url1'); assert.equal(page.songs[0].extra_data.isrc, 'ISRC');
});
test('401 refreshes clock once; concurrent clock calls dedupe', async () => {
  let clocks = 0, api = 0;
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) { clocks++; await new Promise(r => setTimeout(r, 5)); return new Response('1794826800000'); }
    return ++api === 1 ? json({}, 401) : json([]);
  } });
  await Promise.all([client.search('one', 2, 0), client.search('two', 2, 0)]);
  assert.equal(clocks, 2); assert.equal(api, 3);
});
for (const value of [{}, [{ ...song(1), source: 'netease' }], [{ ...song(1), name: '' }], [{ ...song(1), artist: [] }]]) {
  test(`reject malformed search ${JSON.stringify(value)}`, async () => {
    const client = createEmbeatClient({ fetchImpl: async url => String(url).endsWith('/time') ? new Response('1794826800000') : json(value) });
    await assert.rejects(client.search('query', 2, 0), e => e.statusCode === 502);
  });
}
test('valid empty page, HTTP429, timeout and recovery are explicit', async () => {
  let mode = 'empty';
  const client = createEmbeatClient({ fetchImpl: async (url, options) => {
    if (String(url).endsWith('/time')) return new Response('1794826800000');
    if (mode === 'timeout') return new Promise((r, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));
    return mode === '429' ? json({}, 429) : json([]);
  } });
  assert.deepEqual(await client.search('none', 2, 4), { songs: [], total: null, hasMore: false, nextOffset: 4 });
  mode = '429'; await assert.rejects(client.search('rate', 2, 0), e => e.statusCode === 429 && e.code === 'GD_RATE_LIMITED');
  mode = 'timeout'; await assert.rejects(client.request('lyric', { id: 'x', source: 'embeat' }, 'x', { timeout: 20 }), e => e.statusCode === 504);
  mode = 'empty'; assert.equal((await client.search('retry', 2, 0)).songs.length, 0);
});
test('401 retry is finite and clock failure can recover', async () => {
  let clocks = 0, api = 0, failClock = true;
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) { clocks++; return failClock ? new Response('broken') : new Response('1794826800000'); }
    api++; return json({}, 401);
  } });
  await assert.rejects(client.search('query', 2, 0), e => e.code === 'GD_CLOCK_ERROR');
  failClock = false;
  await assert.rejects(client.search('query', 2, 0), e => e.statusCode === 502);
  assert.equal(clocks, 3); assert.equal(api, 2);
});
for (const status of [301, 403, 421, 429]) {
  test(`clock HTTP ${status} releases its response stream and can recover`, async () => {
    let cancelled = 0, failed = false;
    const client = createEmbeatClient({ fetchImpl: async url => {
      if (!String(url).endsWith('/time')) return json([]);
      if (failed) return new Response('1794826800');
      failed = true;
      return new Response(new ReadableStream({ cancel() { cancelled++; } }), { status });
    } });
    await assert.rejects(client.search('query'), e => e.code === (status === 429 ? 'GD_RATE_LIMITED' : 'GD_CLOCK_ERROR'));
    assert.equal(cancelled, 1);
    assert.deepEqual((await client.search('retry')).songs, []);
  });
}
test('cached clock advances across ten-second bucket rather than caching prefix', async () => {
  let clocks = 0; const signatures = [];
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) { clocks++; return new Response('1794826809990'); }
    signatures.push(new URL(url).searchParams.get('s')); return json([]);
  } });
  await client.search('hello', 2, 0); await new Promise(r => setTimeout(r, 30)); await client.search('hello', 2, 0);
  assert.equal(clocks, 1); assert.notEqual(signatures[0], signatures[1]);
});
test('total deadline includes clock and bounds a signal-ignoring transport', async () => {
  const client = createEmbeatClient({ fetchImpl: () => new Promise(() => {}) });
  const started = performance.now();
  await assert.rejects(client.request('url', { source: 'embeat', id: 'x' }, 'x', { timeout: 20 }), e => e.statusCode === 504);
  assert.ok(performance.now() - started < 200);
});
test('response cap, invalid JSON, unsupported source and parameter rejection', async () => {
  let mode = 'large';
  const client = createEmbeatClient({ fetchImpl: async url => String(url).endsWith('/time') ? new Response('1794826800000') : mode === 'large' ? new Response('x', { headers: { 'content-length': '2097153' } }) : new Response('{') });
  await assert.rejects(client.search('x', 2, 0), e => e.code === 'GD_RESPONSE_TOO_LARGE');
  mode = 'invalid'; await assert.rejects(client.search('x', 2, 0), e => e.code === 'GD_INVALID_RESPONSE');
  await assert.rejects(client.request('url', { source: 'unknown', id: 'x' }, 'x'), TypeError);
  await assert.rejects(client.request('url', { source: 'embeat', id: 'x', arbitrary: 'x' }, 'x'), TypeError);
});

test('resource requests preserve original response and autosource signs JSON name', async () => {
  const payload = JSON.stringify({ name: 'Song + 中文', artist: 'Artist', id: '42', isrc: 'ISRC' });
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) return new Response('1794826800000');
    const q = new URL(url).searchParams;
    if (q.get('types') === 'autosource') {
      assert.equal(q.get('name'), payload);
      assert.equal(q.get('s'), modifiedMD5(`179482680|music.gdstudio.xyz|20261111|${encodeURIComponent(payload)}`).slice(-8).toUpperCase());
    }
    return json({ url: 'https://resource.test', lyric: 'lyric', source: 'tidal', pic_id: 'pic', extra_data: { duration: 269, isrc: 'ISRC' } });
  } });
  for (const type of ['url', 'pic', 'lyric']) assert.equal((await client.request(type, { source: 'embeat', id: '42' }, '42')).extra_data.duration, 269);
  assert.equal((await client.request('autosource', { source: 'embeat', name: payload }, payload)).source, 'tidal');
});

test('response cancellation cannot defeat the total request deadline', async () => {
  let calls = 0;
  const client = createEmbeatClient({ fetchImpl: async url => {
    if (String(url).endsWith('/time')) return new Response('1794826800000');
    if (++calls === 1) return new Response(new ReadableStream({ cancel: () => new Promise(() => {}) }), { status: 401 });
    return json([]);
  } });
  const result = await Promise.race([
    client.search('query', 2, 0),
    new Promise(resolve => setTimeout(() => resolve('stalled'), 100)),
  ]);
  assert.notEqual(result, 'stalled');
  assert.equal(result.songs.length, 0);
});
test('pagination at the supported ceiling cannot loop onto the same page', async () => {
  const client = createEmbeatClient({ fetchImpl: async url => String(url).endsWith('/time') ? new Response('1794826800000') : json([song(0), song(1), song(2)]) });
  assert.equal((await client.search('query', 3, 100000)).hasMore, false);
  await assert.rejects(client.search('query', 3, 100002), e => e.statusCode === 400);
});
