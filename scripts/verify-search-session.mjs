import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { setImmediate } from 'node:timers/promises';

const source = await readFile(new URL('../search-session.js', import.meta.url), 'utf8');
const sessions = [];
afterEach(() => { for (const session of sessions.splice(0)) session.cancel(); });
function setup(timers = {}) {
  const requests = [], updates = [];
  const context = vm.createContext({ AbortController, setTimeout, clearTimeout, URLSearchParams, ...timers });
  vm.runInContext(source, context);
  const session = context.createMusicSearchSession({
    fetchImpl: (url, options) => new Promise((resolve, reject) => requests.push({
      params: new URL(url, 'https://local.test').searchParams, ...options, resolve, reject,
    })),
    onChange: value => updates.push(value),
  });
  sessions.push(session);
  return { session, requests, updates, latest: () => updates.at(-1) };
}
const song = (id, source = 'netease') => ({ id, name: id, artist: 'Artist', source });
const response = (songs, nextOffset = songs.length, hasMore = false) => ({ ok: true, json: async () => ({ songs, nextOffset, hasMore }) });

test('basic results render and paginate while Embeat is still pending', async () => {
  const { session, requests, latest } = setup();
  session.search('first');
  assert.equal(requests.length, 2);
  const base = requests.find(r => r.params.get('source') === 'netease');
  base.resolve(response([song('base')], 20, true));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['base']);
  assert.equal(latest().loading, false, 'optional Embeat cannot keep the main spinner active');
  session.loadMore();
  assert.equal(requests.length, 3, 'the pending supplement cannot lock base pagination');
  assert.equal(requests[2].params.get('source'), 'netease');
  assert.equal(requests[2].params.get('offset'), '20');
  session.cancel();
});

test('early Embeat pages wait for the base batch without being overwritten', async () => {
  const { session, requests, latest } = setup();
  session.search('early');
  requests[1].resolve(response([song('extra', 'embeat')], 20, true));
  await setImmediate();
  assert.equal(latest().songs.length, 0);
  session.loadMore();
  assert.equal(requests.length, 2, 'buffered optional results cannot be replaced by another invisible page');
  requests[0].resolve(response([song('base')]));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['base', 'extra']);
  assert.deepEqual(Array.from(latest().added, s => s.id), ['base', 'extra']);
  session.cancel();
});

test('a supplement that ignores abort still settles within its deadline', async () => {
  const timers = new Map(); let id = 0;
  const { session, requests, latest } = setup({ setTimeout: fn => { timers.set(++id, fn); return id; }, clearTimeout: key => timers.delete(key) });
  session.search('timeout');
  requests[0].resolve(response([song('base')], 20, true));
  await setImmediate();
  assert.equal(latest().supplementLoading, true);
  [...timers.values()][0]();
  await setImmediate();
  assert.equal(latest().supplementLoading, false);
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['base']);
  assert.equal(latest().error, null);
  assert.equal(latest().hasMore, true);
  assert.equal(timers.size, 0);
});

test('source cursors stay independent, duplicates preserve identity, and displayed order only appends', async () => {
  const { session, requests, latest } = setup();
  session.search('overlap');
  requests[0].resolve(response([song('42')], 20, true));
  requests[1].resolve(response([{ ...song('42', 'embeat'), urlId: 'audio42', lyricId: 'lyric42', picId: 'pic42' }], 7, true));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => [s.source, s.id]), [['netease', '42'], ['embeat', '42']]);
  assert.equal(latest().songs[1].urlId, 'audio42');
  assert.equal(latest().songs[1].lyricId, 'lyric42');
  session.loadMore(); session.loadMore();
  assert.equal(requests.length, 4, 'one in-flight page per source');
  assert.equal(requests[2].params.get('offset'), '20');
  assert.equal(requests[3].params.get('offset'), '7');
  requests[2].resolve(response([song('42'), song('next')], 40));
  requests[3].resolve(response([song('42', 'embeat'), song('extra2', 'embeat')], 8));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['42', '42', 'next', 'extra2']);
  assert.deepEqual(Array.from(latest().added, s => s.id), ['extra2']);
  assert.equal(latest().hasMore, false);
});

for (const kind of ['http', 'malformed', 'rejected', 'stalled-cursor']) {
  test(`${kind} supplemental failure leaves the base results and pagination usable`, async () => {
    const { session, requests, latest } = setup();
    session.search('failure');
    requests[0].resolve(response([song('base')], 20, true));
    if (kind === 'rejected') requests[1].reject(new Error('network failure'));
    else requests[1].resolve(kind === 'http' ? { ok: false, status: 403 }
      : kind === 'malformed' ? { ok: true, json: async () => ({ songs: {} }) }
        : response([song('extra', 'embeat')], 0, true));
    await setImmediate();
    assert.deepEqual(Array.from(latest().songs, s => s.id), ['base']);
    assert.equal(latest().error, null);
    session.loadMore();
    assert.equal(requests.length, 3);
    assert.equal(requests[2].params.get('source'), 'netease');
  });
}

test('base failure releases early supplemental results, and valid empty differs from failure', async () => {
  const { session, requests, latest } = setup();
  session.search('extra-only');
  requests[1].resolve(response([song('extra', 'embeat')]));
  await setImmediate();
  requests[0].resolve({ ok: false, status: 502 });
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['extra']);
  assert.equal(latest().error, null);
  session.search('empty');
  requests[2].resolve(response([])); requests[3].resolve(response([]));
  await setImmediate();
  assert.equal(latest().songs.length, 0); assert.equal(latest().error, null);
  session.search('both-fail');
  requests[4].resolve({ ok: false, status: 502 }); requests[5].resolve({ ok: false, status: 403 });
  await setImmediate();
  assert.match(latest().error, /搜索失败/);
});

test('new queries and clearing abort both sources; late success and failure cannot publish or unlock new pages', async () => {
  const { session, requests, latest, updates } = setup();
  session.search('old'); session.search('new');
  assert.equal(requests[0].signal.aborted, true); assert.equal(requests[1].signal.aborted, true);
  const count = updates.length;
  requests[0].resolve(response([song('stale')])); requests[1].reject(new Error('stale failure'));
  await setImmediate();
  assert.equal(updates.length, count);
  session.loadMore(); assert.equal(requests.length, 4);
  requests[2].resolve(response([song('new')])); requests[3].resolve(response([]));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['new']);
  session.search('cleared'); session.cancel();
  const afterClear = updates.length;
  assert.equal(requests[4].signal.aborted, true); assert.equal(requests[5].signal.aborted, true);
  requests[4].resolve(response([song('cleared')])); requests[5].resolve(response([song('cleared-extra', 'embeat')]));
  await setImmediate();
  assert.equal(updates.length, afterClear);
});
