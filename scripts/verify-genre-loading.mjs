import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const player = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const slice = (start, end) => player.slice(player.indexOf(start), player.indexOf(end));
const tick = () => new Promise(resolve => setImmediate(resolve));

function fixture() {
  const requests = [];
  const section = { style: {}, scrollIntoView() {} };
  const row = { ids: [], set innerHTML(_) { this.ids = []; }, insertAdjacentHTML(_, markup) { this.ids.push(...markup.split(',').filter(Boolean)); } };
  const queued = [];
  const ctx = vm.createContext({
    AbortController, AbortSignal, window: {}, state: { currentPage: 'discover' },
    setTimeout: () => 1, clearTimeout() {}, console: { warn() {}, error() {} },
    normalizeTrack: track => track,
    $: selector => selector === '#genreSection' ? section : row,
    createAMCard: track => `${track.id},`,
    renderScrollRow: (_, tracks) => { row.ids = Array.from(tracks, track => track.id); },
    revealContainer() {},
    addToQueue: tracks => queued.push(...Array.from(tracks, track => track.id)),
    showToast() {},
    fetch: (input, { signal }) => new Promise((resolve, reject) => {
      requests.push({
        url: new URL(input, 'https://music.test'), signal,
        finish: (...ids) => resolve({ ok: true, json: async () => ({ songs: ids.map(id => ({ id })) }) }),
        reject,
      });
    }),
  });
  vm.runInContext(slice('async function searchNetease(', '// 新音源热门推荐') +
    slice('async function universalSearch(', '// ========== Helpers') +
    slice('// Genre detail', '// 主页"热门排行榜"'), ctx);
  return { ctx, requests, row, queued, section };
}

test('a fast genre batch shows before the slow batch, then appends without duplicates', async () => {
  const { ctx, requests, row } = fixture();
  const loading = ctx.loadGenreDetail('pop');
  assert.equal(requests.length, 2, 'only two lookups start together');
  requests[1].finish('first', 'shared');
  await tick();
  assert.deepEqual(row.ids, ['first', 'shared']);
  requests[0].finish('shared', 'second');
  await tick();
  assert.deepEqual(row.ids, ['first', 'shared', 'second']);
  requests.slice(2).forEach(request => request.finish());
  await tick();
  requests.at(-1).finish();
  await loading;
  const before = requests.length;
  await ctx.loadGenreDetail('pop');
  assert.equal(requests.length, before);
  assert.deepEqual(row.ids, ['first', 'shared', 'second']);
});

test('switching and closing cancels pending requests and excludes late tracks', async () => {
  const { ctx, requests, row, queued, section } = fixture();
  const pop = ctx.loadGenreDetail('pop');
  const first = requests.slice();
  const rock = ctx.loadGenreDetail('rock');
  const second = requests.slice(first.length);
  assert.ok(first.every(request => request.signal.aborted));
  second[0].finish('rock');
  first.forEach(request => request.finish('stale-pop'));
  await tick();
  assert.deepEqual(row.ids, ['rock']);
  ctx.hideGenreDetail();
  requests.slice(first.length + 1).forEach(request => {
    assert.equal(request.signal.aborted, true);
    request.finish('stale-rock');
  });
  await Promise.all([pop, rock]);
  assert.equal(section.style.display, 'none');
  assert.deepEqual(queued, ['rock']);
});

test('a failed genre is retried on the next click', async () => {
  const { ctx, requests, row } = fixture();
  const first = ctx.loadGenreDetail('jazz');
  for (let i = 0; i < 5; i++) {
    assert.ok(requests[i]);
    requests[i].reject(new Error('upstream failed'));
    await tick();
  }
  await first;
  assert.deepEqual(row.ids, []);
  const second = ctx.loadGenreDetail('jazz');
  assert.equal(requests.length, 7);
  ctx.hideGenreDetail();
  requests.slice(5).forEach(request => request.finish());
  await second;
});

test('an in-flight batch cannot exceed the 80-track limit', async () => {
  const { ctx, requests, row, queued } = fixture();
  const loading = ctx.loadGenreDetail('pop');
  for (let i = 0; i < 2; i++) {
    for (const [offset, request] of requests.slice(i * 2, i * 2 + 2).entries()) {
      const start = (i * 2 + offset) * 20;
      request.finish(...Array.from({ length: 20 }, (_, j) => String(start + j)));
    }
    await tick();
  }
  requests[4].finish();
  await loading;
  assert.equal(row.ids.length, 80);
  assert.equal(queued.length, 80);
});
