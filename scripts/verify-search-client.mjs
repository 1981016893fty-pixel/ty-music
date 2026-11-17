import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');

function playerSearch(fetch, timers = {}) {
  const elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      style: {}, innerHTML: '', textContent: '', value: '',
      appendChild() {}, querySelectorAll: () => [],
    });
    return elements.get(selector);
  };
  const context = vm.createContext({
    fetch, AbortController, setTimeout, clearTimeout, ...timers, URL, console,
    $: element, state: { currentSource: 'netease' },
    SOURCE_LABELS: { netease: '全网搜索' }, browseResultTitleOverride: '',
    normalizeTrack: song => ({ ...song, title: song.name }),
    addToQueue() {},
    // A minimal DOM adapter: the real search/pagination functions select
    // which tracks are rendered; this only makes that output observable.
    renderTrackList: (container, tracks) => { container.innerHTML = tracks.map(t => t.title).join('|'); },
    hideAutocomplete() {},
  });
  vm.runInContext(source.slice(source.indexOf('let searchTimeout;'), source.indexOf("$('#searchInput').addEventListener('input'")) +
    source.slice(source.indexOf('async function performSearch('), source.indexOf('function fixCoverUrl(')), context);
  return { search: query => context.performSearch(query), cancel: () => context.cancelSearch(), quickStartVisible: () => element('#page-search .browse-quick-section').style.display !== 'none', output: () => element('#searchResults').innerHTML };
}

function response(name) {
  return { ok: true, json: async () => ({ songs: [{ id: name, name }], hasMore: false }) };
}

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
  const player = playerSearch(async () => ({ ok: true, json: async () => ({ songs: [], hasMore: false }) }));
  await player.search('no match');
  assert.match(player.output(), /没有找到相关歌曲/);
});

test('a timed out request ends loading and the next search can recover', async () => {
  let fireTimeout;
  let count = 0;
  const player = playerSearch((url, { signal }) => ++count === 1 ? new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
  }) : Promise.resolve(response('recovered')), {
    setTimeout: callback => { fireTimeout = callback; return 1; }, clearTimeout() {},
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
