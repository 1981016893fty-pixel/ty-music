import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';

async function app(mode, run) {
  const child = fork(new URL('../server-simple.js', import.meta.url), [], {
    execArgv: ['--require', new URL('./embeat-transport-fixture.cjs', import.meta.url).pathname],
    env: { ...process.env, GD_EMBEAT_CONNECT_HOST: '', PORT: '0', EMBEAT_FIXTURE: mode }, silent: true,
  });
  let logs = '';
  child.stdout.on('data', chunk => { logs += chunk; }); child.stderr.on('data', chunk => { logs += chunk; });
  try {
    const [{ port }] = await once(child, 'message', { signal: AbortSignal.timeout(5000) });
    await run(async path => fetch(`http://127.0.0.1:${port}${path}${path.split('?')[0].endsWith('search') && !path.includes('source=') ? '&source=embeat' : ''}`, { redirect: 'manual' }), () => logs);
  } finally {
    if (child.exitCode === null && child.signalCode === null) { const done = once(child, 'exit'); child.kill('SIGKILL'); await done; }
  }
}
const metadata = new URLSearchParams({ id: 'url42', source: 'embeat', trackId: 'song42', title: 'Fixture song', artist: 'Fixture artist', isrc: 'ISRC42' });
test('search normalizes upstream millisecond duration to playback seconds', async () => app('duration-ms', async get => {
  const page = await (await get('/api/music/search?keywords=private-query&limit=20')).json();
  assert.equal(page.songs[0].duration, 270, '269746 milliseconds is approximately 4:30, never 4495 minutes');
}));
test('both search aliases explicitly select Embeat and preserve resource identity', async () => app('success', async get => {
  for (const alias of ['/api/search', '/api/music/search']) {
    const response = await get(`${alias}?keywords=private-query&limit=20`);
    assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
    const page = await response.json();
    assert.equal(page.total, null); assert.equal(page.hasMore, false); assert.equal(page.nextOffset, 1);
    assert.equal(page.songs[0].source, 'embeat'); assert.equal(page.songs[0].id, 'song42');
    assert.equal(page.songs[0].urlId, 'url42'); assert.equal(page.songs[0].lyricId, 'lrc42');
    assert.equal(page.songs[0].duration, 269); assert.equal(page.songs[0].isrc, 'ISRC42');
    assert.match(page.songs[0].cover, /source=embeat/);
  }
}));
for (const [mode, status] of [['malformed', 502], ['rate', 429], ['timeout', 504]]) {
  test(`${mode} is a failure, never empty search`, { timeout: 15000 }, async () => app(mode, async (get, logs) => {
    assert.equal((await get('/api/search?keywords=private-query')).status, status);
    assert.equal((await get('/api/health')).status, 200); assert.ok(!logs().includes('private-query'));
  }));
}
test('empty is truthful; failed search can recover', async () => {
  await app('empty', async get => assert.deepEqual(await (await get('/api/search?keywords=private-query')).json(), { songs: [], total: null, hasMore: false, nextOffset: 0 }));
  await app('recover', async get => {
    assert.equal((await get('/api/search?keywords=private-query')).status, 502);
    assert.equal((await get('/api/search?keywords=private-query')).status, 200);
  });
});
test('play and lyrics use original Embeat resources instead of a fuzzy replacement', async () => app('success', async get => {
  for (const alias of ['/api/music/url', '/api/play']) {
    const result = await (await get(`${alias}?${metadata}`)).json();
    const q = new URL(result.url, 'http://local').searchParams;
    for (const [key, value] of metadata) assert.equal(q.get(key), value);
  }
  const audio = await get(`/api/music/proxy?${metadata}`);
  assert.equal(audio.status, 302); assert.equal(audio.headers.get('location'), 'https://audio.tidal.com/fixture.flac');
  const lyric = new URLSearchParams(metadata); lyric.set('id', 'lrc42');
  const response = await get(`/api/music/lyric?${lyric}`);
  assert.equal(response.status, 200); assert.equal((await response.json()).lrc, '[00:01.00]Fixture lyric');
  assert.equal((await get(`/api/music/download?${metadata}`)).status, 422);
}));
test('bad source and missing Embeat metadata fail before upstream; absent audio is 404', async () => {
  await app('success', async get => {
    assert.equal((await get('/api/search?keywords=x&source=unknown')).status, 400);
    assert.equal((await get('/api/music/proxy?id=x&source=embeat')).status, 400);
    assert.equal((await get('/api/music/proxy?id=x&source=unknown')).status, 400);
    assert.equal((await get('/api/cover?source=embeat&url=http://127.0.0.1/test')).status, 400);
  });
  await app('missing-audio', async get => {
    assert.equal((await get(`/api/music/proxy?${metadata}`)).status, 404);
    const lyric = new URLSearchParams(metadata); lyric.set('id', 'lrc42');
    assert.equal((await get(`/api/music/lyric?${lyric}`)).status, 200, 'lyrics do not depend on audio availability');
  });
});
test('cover uses its Embeat identifier and rejects private provider URLs', async () => {
  await app('success', async get => {
    const cover = await get('/api/cover?source=embeat&picId=pic42&size=300');
    assert.equal(cover.status, 200); assert.equal(cover.headers.get('content-type'), 'image/png');
    assert.deepEqual([...new Uint8Array(await cover.arrayBuffer())], [0x89, 0x50, 0x4e, 0x47]);
  });
  await app('bad-cover', async get => assert.equal((await get('/api/cover?source=embeat&picId=pic42')).status, 404));
});
