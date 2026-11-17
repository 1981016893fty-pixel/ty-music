import test from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';

async function app(mode, run) {
  const child = fork(new URL('../server-simple.js', import.meta.url), [], {
    execArgv: ['--require', new URL('./search-transport-fixture.cjs', import.meta.url).pathname],
    env: { ...process.env, GD_EMBEAT_CONNECT_HOST: '', PORT: '0', SEARCH_FIXTURE: mode }, silent: true,
  });
  let logs = '';
  child.stdout.on('data', data => { logs += data; }); child.stderr.on('data', data => { logs += data; });
  try {
    const startup = new AbortController();
    const startupTimer = setTimeout(() => startup.abort(), 5000);
    let port;
    try {
      [{ port }] = await once(child, 'message', { signal: startup.signal });
    } finally { clearTimeout(startupTimer); }
    // No source parameter: both public aliases must retain the base catalog
    // even when optional Embeat is unavailable.
    const get = async path => { const response = await fetch(`http://127.0.0.1:${port}${path}`); return { status: response.status, data: await response.json() }; };
    await run(get, () => logs);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, 'exit'); child.kill('SIGKILL'); await exited;
    }
  }
}
for (const mode of ['business', 'http', 'malformed', 'transport', 'timeout']) {
  test(`${mode} returns structured upstream failure and keeps server healthy`, { timeout: 16000 }, async () => app(mode, async (get, logs) => {
    const response = await get('/api/music/search?keywords=private-query');
    assert.equal(response.status, mode === 'timeout' ? 504 : 502);
    assert.equal(response.data.code, mode === 'timeout' ? 'SEARCH_TIMEOUT' : 'SEARCH_UPSTREAM_ERROR');
    assert.equal((await get('/api/health')).data.status, 'ok');
    assert.ok(!logs().includes('private-query'));
  }));
}
test('both public search aliases default to the base Netease catalog', async () => app('success', async get => {
  for (const alias of ['/api/search', '/api/music/search']) {
    const result = await get(alias + '?keywords=Fixture');
    assert.equal(result.status, 200);
    assert.equal(result.data.songs[0].source, 'netease');
  }
}));
test('GD public Netease catalog preserves source and non-aligned paging when official endpoints fail', async () => app('gd-fallback', async get => {
  const { status, data } = await get('/api/search?keywords=Fixture&limit=3&offset=4');
  assert.equal(status, 200);
  assert.deepEqual(data.songs.map(s => s.id), ['42', '43']);
  assert.ok(data.songs.every(s => s.source === 'netease'));
  assert.equal(data.total, null, 'GD cannot invent an official total count');
  assert.equal(data.hasMore, true);
  assert.equal(data.nextOffset, 6);
}));
test('official HTTP failures release their bodies before switching to the GD base catalog', async () => app('gd-http-cancel', async get => {
  const { status, data } = await get('/api/search?keywords=Fixture&limit=3&offset=4');
  assert.equal(status, 200, 'the fixture rejects GD access while failed official bodies are unclosed');
  assert.equal(data.songs[0].id, '42');
}));
test('validated alternate preserves query pagination and metadata', async () => app('alternate', async get => {
  const { status, data } = await get('/api/search?keywords=Fixture&limit=1&offset=2');
  assert.equal(status, 200); assert.equal(data.songs[0].id, '42');
  assert.equal(data.total, 5); assert.equal(data.hasMore, true); assert.equal(data.nextOffset, 3);
  assert.ok(data.songs[0].cover.includes('fixture.jpg')); assert.equal(data.songs[0].duration, 180);
}));
test('validated zero is a successful empty page', async () => app('zero', async get => {
  assert.deepEqual((await get('/api/music/search?keywords=none')).data, { songs: [], total: 0, hasMore: false, nextOffset: 0 });
  assert.deepEqual((await get('/api/search?keywords=none&offset=4')).data, { songs: [], total: 0, hasMore: false, nextOffset: 4 });
}));
for (const mode of ['minimal', 'cover-timeout']) {
  test(`${mode}: optional metadata cannot remove real songs`, { timeout: 4000 }, async () => app(mode, async get => {
    const { status, data } = await get('/api/music/search?keywords=Fixture');
    assert.equal(status, 200); assert.equal(data.songs.length, 1); assert.equal(data.songs[0].name, 'Fixture song');
    assert.ok(data.songs[0].cover); assert.equal(data.nextOffset, 1);
  }));
}

test('failure does not poison subsequent requests in the same process', async () => app('recover', async get => {
  assert.equal((await get('/api/music/search?keywords=Fixture')).status, 502);
  const response = await get('/api/music/search?keywords=Fixture');
  assert.equal(response.status, 200); assert.equal(response.data.songs[0].id, '42');
}));
test('missing query is 400 and numerical pagination is bounded', async () => app('success', async get => {
  assert.equal((await get('/api/search?keywords=%20%20')).status, 400);
  const { data } = await get('/api/search?keywords=Fixture&limit=Infinity&offset=Infinity');
  assert.equal(data.nextOffset, 1); assert.equal(data.songs[0].id, '42');
}));

for (const value of ['null', 'blank', 'boolean']) {
  test(`malformed ${value} count fails rather than pretending zero`, async () => app(`count-${value}`, async get => {
    const response = await get('/api/search?keywords=Fixture');
    assert.equal(response.status, 502); assert.equal(response.data.code, 'SEARCH_UPSTREAM_ERROR');
  }));
  test(`malformed ${value} count tries the validated fallback`, async () => app(`count-${value}-fallback`, async get => {
    const response = await get('/api/music/search?keywords=Fixture');
    assert.equal(response.status, 200); assert.equal(response.data.songs[0].id, '42');
  }));
}
