import assert from 'node:assert/strict';
const base = new URL(process.argv[2] || 'http://localhost:8788');
const get = (path, options) => fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), ...options });
const health = await get('/api/health');
assert.equal(health.status, 200);
assert.equal((await health.json()).runtime, 'cloudflare');
assert.match(health.headers.get('cache-control'), /no-store/);
assert.equal((await get('/api/health', { method: 'OPTIONS' })).status, 204);
assert.equal((await get('/api/health', { method: 'POST' })).status, 405);
assert.equal((await get('/api/missing')).status, 404);
const index = await get('/');
assert.match(await index.text(), /20261118-cloudflare-v50/);
assert.equal((await get('/library-transfer.html')).status, 200);
for (const path of ['/server-simple.js', '/users.json', '/.env']) {
  const text = await get(path).then(r => r.text());
  assert.match(text, /<!DOCTYPE html>/i, 'Private files must resolve to the public SPA fallback');
}
if (process.argv.includes('--network')) {
  // Identical cold searches must each own their request I/O context.
  const responses = await Promise.all(Array.from({ length: 2 }, () => get('/api/search?keywords=Hello%20Adele&limit=2').then(r => r.json())));
  for (const result of responses) { assert.ok(result.songs.length > 0); assert.equal(result.songs[0].source, 'netease'); }
  const cover = await get(responses[0].songs[0].coverSmall);
  assert.equal(cover.status, 200); assert.match(cover.headers.get('content-type'), /image\//); await cover.arrayBuffer();
  const audio = await get('/api/music/proxy?id=1406633327', { redirect: 'manual' });
  assert.equal(audio.status, 302); assert.match(audio.headers.get('location'), /^https?:\/\//);
  const ranged = await get('/api/music/proxy?id=1406633327&stream=1', { headers: { Range: 'bytes=0-1023' } });
  assert.equal(ranged.status, 206); assert.match(ranged.headers.get('content-range'), /^bytes 0-1023\//); assert.equal((await ranged.arrayBuffer()).byteLength, 1024);
}
console.log(`Verified Cloudflare routing, release assets and API boundaries${process.argv.includes('--network') ? ', concurrent search, artwork and audio Range' : ''}: ${base.origin}`);
