import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const base = new URL(process.argv[2] || 'http://localhost:8788');
const expectedCommit = process.argv.slice(3).find(arg => arg.startsWith('--commit='))?.slice(9)
  ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' }).trim();
assert.match(expectedCommit, /^[a-f0-9]{40}$/, 'Expected a full Git commit SHA');
const get = (path, options) => fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), ...options });
const health = await get('/api/health');
assert.equal(health.status, 200);
const { runtime, commit } = await health.json();
assert.equal(runtime, 'cloudflare');
assert.equal(commit, expectedCommit, 'API must serve the expected Git commit');
assert.match(health.headers.get('cache-control'), /no-store/);
assert.equal((await get('/api/health', { method: 'OPTIONS' })).status, 204);
assert.equal((await get('/api/health', { method: 'POST' })).status, 405);
assert.equal((await get('/api/missing')).status, 404);
const index = await get('/');
assert.equal(index.status, 200);
const releaseTag = `<meta name="ty-music-commit" content="${expectedCommit}">`;
assert.ok((await index.text()).includes(releaseTag), 'Homepage must serve the expected Git commit');
const phone = { headers: { 'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' }, redirect: 'manual' };
for (const entry of ['/', '/index.html']) {
  const mobileRedirect = await get(entry, phone);
  assert.equal(mobileRedirect.status, 302, entry);
  assert.equal(mobileRedirect.headers.get('location'), '/mobile');
  assert.match(mobileRedirect.headers.get('cache-control'), /no-store/);
}
const mobile = await get('/mobile', phone);
assert.equal(mobile.status, 200);
assert.match(mobile.headers.get('content-type'), /text\/html/);
const mobileHtml = await mobile.text();
assert.match(mobileHtml, /id="search"/);
assert.doesNotMatch(mobileHtml, /player\.js|soft-aurora|font-awesome/);
// Browsers reject a redirected cached response for manual navigation.
const sw = await get('/service-worker.js').then(r => r.text());
const shellPath = sw.match(/const APP_SHELL = '([^']+)'/)?.[1];
assert.ok(shellPath, 'service worker declares its cached shell');
const shell = await get(shellPath, { redirect: 'manual' });
assert.equal((await get(shellPath, phone)).status, 200, 'old mobile service worker precache must not redirect');
assert.equal(shell.status, 200, 'precache URL must not redirect');
assert.match(shell.headers.get('content-type'), /text\/html/);
assert.ok((await shell.text()).includes(releaseTag), 'Precached homepage must serve the expected Git commit');
assert.equal((await get('/library-transfer.html')).status, 200);
assert.match((await get('/local-music-db.js')).headers.get('content-type'), /javascript/);
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
