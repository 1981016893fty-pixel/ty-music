import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';
import { setImmediate } from 'node:timers/promises';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const sessionSource = await readFile(new URL('../search-session.js', import.meta.url), 'utf8');

function playerSearch(fetch, timers = {}) {
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
      ? Promise.resolve({ ok: false, status: 502 }) : fetch(url, options),
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

function response(name) {
  return { ok: true, json: async () => ({ songs: [{ id: name, name, source: 'netease' }], nextOffset: 1, hasMore: false }) };
}

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
  const second = player.search('second');
  assert.equal(pending.length, 2, 'the second search must actually be sent');
  pending[1].resolve(response('second result'));
  await second;
  pending[0].resolve(response('stale first result'));
  await first;
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
  let fireTimeout;
  let count = 0;
  const player = playerSearch((url, { signal }) => ++count === 1 ? new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) : Promise.resolve(response('recovered')), {
    setTimeout: callback => { fireTimeout ||= callback; return 1; }, clearTimeout() {},
  });
  const pending = player.search('timeout');
  fireTimeout(); await pending;
  assert.match(player.output(), /搜索超时/);
  await player.search('retry'); assert.equal(player.output(), 'recovered');
});

test('clearing input invalidates a response that ignores abort', async () => {
  let resolve;
  const player = playerSearch(() => new Promise(done => { resolve = done; }));
  const pending = player.search('old');
  player.cancel(); resolve(response('old result')); await pending;
  assert.doesNotMatch(player.output(), /old result/);
});
