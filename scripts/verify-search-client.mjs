import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';
import { setImmediate } from 'node:timers/promises';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const sessionSource = await readFile(new URL('../search-session.js', import.meta.url), 'utf8');

function playerSearch(fetch, timers = {}, embeat = async () => ({ ok: false, status: 502 })) {
  const elements = new Map();
  const queued = [];
  const rendered = [];
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      style: {}, innerHTML: '', textContent: '', value: '',
      appendChild() {}, querySelectorAll: () => [],
    });
    return elements.get(selector);
  };
  const context = vm.createContext({
    fetch: (url, options) => url.includes('source=embeat')
      ? embeat(url, options) : fetch(url, options),
    AbortController, setTimeout, clearTimeout, ...timers, URL, URLSearchParams, console,
    $: element, state: { currentSource: 'netease' },
    SOURCE_LABELS: { netease: '全网搜索' }, browseResultTitleOverride: '',
    window: {}, document: { createElement: () => ({ setAttribute() {}, remove() {} }) },
    resolveMusicResource: value => value,
    esc: value => value,
    addToQueue: tracks => queued.push(...tracks),
    // A minimal DOM adapter: the real search/pagination functions select
    // which tracks are rendered; this only makes that output observable.
    renderTrackList: (container, tracks, { from = 0 } = {}) => {
      const titles = tracks.slice(from).map(t => t.title).join('|');
      rendered.push(titles);
      container.innerHTML = from ? container.innerHTML + '|' + titles : titles;
    },
    hideAutocomplete() {},
  });
  vm.runInContext(sessionSource + source.slice(source.indexOf('function resizeCoverUrl'), source.indexOf('// 通过本地服务器搜索')) +
    source.slice(source.indexOf('let searchTimeout;'), source.indexOf("$('#searchInput').addEventListener('input'")) +
    source.slice(source.indexOf('async function performSearch('), source.indexOf('function fallbackCover(')), context);
  return { search: async query => { await context.performSearch(query); await setImmediate(); },
    more: async () => { context.loadMoreSearchResults(); await setImmediate(); }, queued, rendered,
    cancel: () => context.cancelSearch(), quickStartVisible: () => element('#page-search .browse-quick-section').style.display !== 'none', output: () => element('#searchResults').innerHTML };
}

function response(name, source = 'netease') {
  return { ok: true, json: async () => ({ songs: [{ id: name, name, source }], nextOffset: 1, hasMore: false }) };
}

test('desktop search renders only Embeat and does not request NetEase when Embeat responds', async () => {
  let fallbackRequests = 0;
  const player = playerSearch(async () => { fallbackRequests++; return response('NetEase result'); }, {},
    async () => response('Embeat result', 'embeat'));
  await player.search('song');
  assert.equal(player.output(), 'Embeat result');
  assert.equal(fallbackRequests, 0);
});

test('a slow Embeat response replaces every provisional NetEase row with the Embeat page', async () => {
  let resolveEmbeat;
  const deadlines = new Map();
  let timer = 0;
  const player = playerSearch(async () => response('NetEase preview'), {
    setTimeout: (callback, delay) => { deadlines.set(++timer, { callback, delay }); return timer; },
    clearTimeout: id => deadlines.delete(id),
  }, () => new Promise(resolve => { resolveEmbeat = resolve; }));
  await player.search('song');
  const preview = [...deadlines.values()].find(({ delay }) => delay < 12000);
  assert.ok(preview, 'slow searches should offer a provisional result');
  preview.callback();
  await setImmediate();
  assert.equal(player.output(), 'NetEase preview');
  resolveEmbeat(response('Embeat original', 'embeat'));
  await setImmediate();
  assert.equal(player.output(), 'Embeat original');
  assert.equal(deadlines.size, 0);
});

test('search pagination renders only newly added rows without changing the queue', async () => {
  let index = 0;
  const player = playerSearch(async () => {
    index++;
    return { ok: true, json: async () => ({
      songs: [{ id: String(index), name: 'song ' + index, source: 'netease' }],
      nextOffset: index, hasMore: index === 1,
    }) };
  });
  await player.search('artist');
  await player.more();
  assert.deepEqual(player.queued, []);
  assert.deepEqual(player.rendered, ['song 1', 'song 2']);
  assert.equal(player.output(), 'song 1|song 2');
});
test('a later query wins even if an earlier server ignores cancellation', async () => {
  const pending = [];
  const player = playerSearch((url, options) => new Promise(resolve => pending.push({ url, options, resolve })));
  const first = player.search('first');
  assert.equal(player.quickStartVisible(), false, 'search results replace the tall browse introduction');
  await first;
  const second = player.search('second');
  await second;
  assert.equal(pending.length, 2, 'the second search must actually be sent');
  pending[1].resolve(response('second result'));
  await setImmediate();
  pending[0].resolve(response('stale first result'));
  await setImmediate();
  assert.equal(player.output(), 'second result');
});

test('an upstream failure is visible and a retry can recover', async () => {
  let count = 0;
  const player = playerSearch(async () => ++count === 1 ? { ok: false, status: 502 } : response('recovered'));
  await player.search('same');
  assert.match(player.output(), /搜索失败/);
  await player.search('same');
  assert.equal(player.output(), 'recovered');
});

test('a valid empty search is distinct from an upstream failure', async () => {
  const player = playerSearch(async () => ({ ok: true, json: async () => ({ songs: [], nextOffset: 0, hasMore: false }) }));
  await player.search('no match');
  assert.match(player.output(), /没有找到相关歌曲/);
});

test('a timed out request ends loading and the next search can recover', async () => {
  const deadlines = new Map();
  let timer = 0;
  let count = 0;
  const player = playerSearch((url, { signal }) => ++count === 1 ? new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) : Promise.resolve(response('recovered')), {
    setTimeout: callback => { deadlines.set(++timer, callback); return timer; },
    clearTimeout: key => deadlines.delete(key),
  });
  const pending = player.search('timeout');
  await pending;
  assert.ok(deadlines.size > 0);
  deadlines.values().next().value();
  await setImmediate();
  assert.match(player.output(), /搜索超时/);
  await player.search('retry'); assert.equal(player.output(), 'recovered');
});

test('clearing input invalidates a response that ignores abort', async () => {
  let resolve;
  const player = playerSearch(() => new Promise(done => { resolve = done; }));
  const pending = player.search('old');
  await pending;
  player.cancel(); resolve(response('old result')); await setImmediate();
  assert.doesNotMatch(player.output(), /old result/);
});
