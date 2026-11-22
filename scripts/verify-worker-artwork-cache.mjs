import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { mobileHomepage } from '../mobile-route.cjs';

const source = (await readFile(new URL('../cloudflare/worker.mjs', import.meta.url), 'utf8'))
  .replace("import { httpServerHandler } from 'cloudflare:node';", '')
  .replace("import api from '../server-simple.js';", '')
  .replace("import { mobileHomepage } from '../mobile-route.cjs';", '')
  .replace('export default {', 'globalThis.worker = {');

function setup({ response = new Response('image', { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=604800' } }), cacheError = false } = {}) {
  let originCalls = 0;
  const entries = new Map();
  const writes = [];
  const context = {
    api: { createServer: () => ({ listen() {} }) },
    httpServerHandler: () => ({ fetch: async request => { originCalls++; return response.clone(); } }),
    caches: { default: {
      match: async request => { if (cacheError) throw new Error('cache unavailable'); return entries.get(request.url)?.clone(); },
      put: async (request, value) => { writes.push(request.url); entries.set(request.url, value); },
    } },
    URL, Response, console, mobileHomepage,
  };
  vm.runInNewContext(source, context);
  return {
    worker: context.worker,
    entries,
    writes,
    originCalls: () => originCalls,
  };
}

test('successful image responses are cached by URL and served on the next request', async () => {
  const state = setup();
  const request = new Request('https://music.test/api/cover?picId=42&size=300');
  const context = { waitUntil: promise => promise };
  for (let index = 0; index < 2; index++) {
    const response = await state.worker.fetch(request, {}, context);
    assert.equal(response.status, 200);
    await response.arrayBuffer();
  }
  assert.equal(state.originCalls(), 1);
  assert.deepEqual(state.writes, [request.url]);
});

test('trusted artist redirects are cached, but errors, other APIs and non-GET requests bypass artwork cache', async () => {
  const redirect = new Response(null, { status: 302, headers: { location: 'https://p2.music.126.net/photo.jpg', 'cache-control': 'public, max-age=604800' } });
  const state = setup({ response: redirect });
  const request = new Request('https://music.test/api/artist-photo?name=IU&size=640');
  await state.worker.fetch(request, {}, { waitUntil: promise => promise });
  await state.worker.fetch(request, {}, { waitUntil: promise => promise });
  assert.equal(state.originCalls(), 1);

  const failed = setup({ response: new Response('failed', { status: 502, headers: { 'content-type': 'image/jpeg' } }) });
  await failed.worker.fetch(new Request('https://music.test/api/cover?picId=bad'), {}, { waitUntil() {} });
  assert.equal(failed.writes.length, 0);

  const bypass = setup();
  await bypass.worker.fetch(new Request('https://music.test/api/search?keywords=x'), {}, { waitUntil() {} });
  await bypass.worker.fetch(new Request('https://music.test/api/cover?picId=42', { method: 'HEAD' }), {}, { waitUntil() {} });
  assert.equal(bypass.writes.length, 0);
  assert.equal(bypass.originCalls(), 2);
});

test('cache read failures fall back to the upstream image', async () => {
  const state = setup({ cacheError: true });
  const response = await state.worker.fetch(new Request('https://music.test/api/cover?picId=42'), {}, { waitUntil: promise => promise });
  assert.equal(response.status, 200);
  assert.equal(state.originCalls(), 1);
});

test('malformed artist redirect locations are returned without breaking the request', async () => {
  const state = setup({ response: new Response(null, { status: 302, headers: { location: 'http://[invalid', 'cache-control': 'public, max-age=604800' } }) });
  const response = await state.worker.fetch(new Request('https://music.test/api/artist-photo?name=IU'), {}, { waitUntil() {} });
  assert.equal(response.status, 302);
  assert.equal(state.writes.length, 0);
});
