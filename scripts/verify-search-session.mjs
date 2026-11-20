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

for (const kind of ['http', 'malformed', 'rejected', 'stalled-cursor', 'timeout']) {
  test(`${kind} Embeat failure selects NetEase and keeps its pagination`, async () => {
    const timers = new Map(); let id = 0;
    const { session, requests, latest } = setup({
      setTimeout: (fn, delay) => { timers.set(++id, { fn, delay }); return id; },
      clearTimeout: key => timers.delete(key),
    });
    session.search('failure');
    requests[0].resolve(response([song('base')], 20, true));
    if (kind === 'timeout') [...timers.values()].find(timer => timer.delay === 6000).fn();
    else if (kind === 'rejected') requests[1].reject(new Error('network failure'));
    else requests[1].resolve(kind === 'http' ? { ok: false, status: 403 }
      : kind === 'malformed' ? { ok: true, json: async () => ({ songs: {} }) }
        : response([song('extra', 'embeat')], 0, true));
    await setImmediate();
    assert.equal(latest().source, 'netease');
    assert.deepEqual(Array.from(latest().songs, s => s.id), ['base']);
    assert.equal(latest().error, null);
    assert.equal(timers.size, 0);
    session.loadMore(); session.loadMore();
    assert.equal(requests.length, 3);
    assert.equal(requests[2].params.get('source'), 'netease');
    assert.equal(requests[2].params.get('offset'), '20');
    requests[2].resolve(response([song('base'), song('next')], 40));
    await setImmediate();
    assert.deepEqual(Array.from(latest().songs, s => s.id), ['base', 'next']);
    assert.deepEqual(Array.from(latest().added, s => s.id), ['next']);
  });
}

test('an Embeat pagination error does not mix sources', async () => {
  const { session, requests, latest } = setup();
  session.search('more');
  requests[1].resolve(response([song('original', 'embeat')], 20, true));
  await setImmediate();
  session.loadMore();
  requests[2].reject(new Error('network failure'));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['original']);
  assert.equal(latest().hasMore, false);
  assert.equal(requests.length, 3);
});

test('new queries and clearing abort both catalogs and discard late results', async () => {
  const { session, requests, latest, updates } = setup();
  session.search('old'); session.search('new');
  assert.ok(requests.slice(0, 2).every(request => request.signal.aborted));
  const count = updates.length;
  requests[0].resolve(response([song('stale')])); requests[1].reject(new Error('stale failure'));
  await setImmediate();
  assert.equal(updates.length, count);
  session.loadMore(); assert.equal(requests.length, 4);
  requests[2].resolve(response([song('new')])); requests[3].reject(new Error('unreachable'));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['new']);
  session.search('cleared'); session.cancel();
  const afterClear = updates.length;
  assert.ok(requests.slice(4).every(request => request.signal.aborted));
  requests[4].resolve(response([song('cleared')])); requests[5].resolve(response([song('cleared-extra', 'embeat')]));
  await setImmediate();
  assert.equal(updates.length, afterClear);
});

test('Embeat wins without waiting for or publishing NetEase', async () => {
  const { session, requests, latest } = setup();
  session.search('November Rain Kris Wu');
  const embeat = requests.find(r => r.params.get('source') === 'embeat');
  const netease = requests.find(r => r.params.get('source') === 'netease');
  embeat.resolve(response([song('original', 'embeat')], 20, true));
  await setImmediate();
  assert.deepEqual(Array.from(latest().songs, s => s.id), ['original']);
  assert.equal(latest().source, 'embeat');
  assert.equal(netease.signal.aborted, true);
  session.loadMore();
  assert.equal(requests.length, 3);
  assert.equal(requests[2].params.get('source'), 'embeat');
  assert.equal(requests[2].params.get('offset'), '20');
});

test('valid empty Embeat result suppresses even faster NetEase results', async () => {
  const { session, requests, latest, updates } = setup();
  session.search('empty');
  requests.find(r => r.params.get('source') === 'netease').resolve(response([song('unwanted')]));
  await setImmediate();
  assert.equal(latest().loading, true);
  assert.ok(updates.every(update => !update.songs.length && !update.added.length));
  requests.find(r => r.params.get('source') === 'embeat').resolve(response([]));
  await setImmediate();
  assert.equal(latest().source, 'embeat');
  assert.equal(latest().error, null);
  assert.equal(latest().loading, false);
  assert.equal(latest().songs.length, 0);
});
