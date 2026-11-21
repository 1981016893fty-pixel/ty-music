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


test('track thumbnails use the known sized CDN image and fall back to the original proxy once', () => {
  const ctx = vm.createContext({ URL, location: { href: 'https://music.test/' },
    window: { location: new URL('https://music.test/'), tyMusicProvider: {} },
    trackMap: new Map(), esc: String,
    escAttr: value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;'),
  });
  vm.runInContext(slice('function resolveMusicResource(', '// Native macOS media bridge') +
    slice('function resizeCoverUrl(', '// Keep upstream resource IDs') +
    slice('function setPlaybackCover(', 'function presentPlaybackTrack(') +
    slice('function createAMCard(', 'function renderScrollRow(') +
    slice('function fallbackCover(', 'function renderTrackList('), ctx);
  const proxy = '/api/cover?size=300&url=http%3A%2F%2Fp2.music.126.net%2Falbum.jpg';
  const track = { id: '1', source: 'netease', coverSmall: proxy, artist: 'Artist', title: 'Song' };
  const direct = 'https://p2.music.126.net/album.jpg?param=300y300';
  const genreCard = ctx.createAMCard(track);
  assert.ok(genreCard.includes(`src="${direct}"`));
  assert.ok(genreCard.includes(`data-proxy-cover="${proxy.replace('&', '&amp;')}"`));
  assert.ok(ctx.trackCoverMarkup(track, 'row-cover').includes(direct));
  for (const coverSmall of ['/api/cover?picId=42', '/api/cover?url=https://p2.music.126.net.example.org/x',
    '/api/cover?url=https://user@p2.music.126.net/x', 'https://other.test/api/cover?url=https://p2.music.126.net/x']) {
    assert.ok(!ctx.createAMCard({ ...track, coverSmall }).includes('data-proxy-cover'));
  }
  ctx.window.__TY_MUSIC_DESKTOP__ = true;
  assert.ok(!ctx.createAMCard(track).includes(direct), 'desktop keeps its existing cover path');
  const image = { src: direct, dataset: { proxyCover: proxy, artist: 'Artist', name: 'Song' } };
  ctx.fallbackCover(image);
  assert.equal(image.src, proxy);
  ctx.fallbackCover(image);
  assert.match(image.src, /^\/api\/album-cover\?/);
  assert.equal(image.dataset.proxyCover, undefined);
  ctx.window.__TY_MUSIC_DESKTOP__ = false;
  ctx.setPlaybackCover(image, track);
  assert.equal(image.src, direct);
  ctx.setPlaybackCover(image, { source: 'local', cover: '/icon.svg' });
  assert.equal(image.src, '/icon.svg');
  assert.equal(image.dataset.proxyCover, undefined, 'switching track clears the old proxy');
});

test('genre artwork starts eagerly for the first four cards and switches only a still-pending cover', () => {
  const probeImages = [];
  const callbacks = [];
  const proxy = '/api/cover?size=300&url=https%3A%2F%2Fp1.music.126.net%2Falbum.jpg';
  const cdn = 'https://p1.music.126.net/album.jpg?param=300y300';
  const pictures = Array.from({ length: 5 }, (_, i) => ({
    src: cdn, naturalWidth: i <= 1 ? 300 : 0, complete: i === 0, dataset: { proxyCover: proxy },
  }));
  const cards = pictures.map(pic => ({ querySelector: () => pic, isConnected: true }));
  const row = { children: cards, closest: () => ({ style: { display: 'block' } }) };
  const ctx = vm.createContext({
    URL, window: { location: new URL('https://music.test/') },
    state: { currentPage: 'discover' }, esc: String, escAttr: String, trackMap: new Map(),
    document: { hidden: false }, resolveMusicResource: value => value,
    Image: class { constructor() { probeImages.push(this); } },
    setTimeout: (fn, delay) => { callbacks.push(fn); assert.equal(delay, 400); },
    $: () => row,
  });
  vm.runInContext(slice('function resizeCoverUrl(', '// Keep upstream resource IDs') +
    slice('const GENRE_PRIORITY_COVERS', 'function revealContainer('), ctx);
  ctx.revealContainer = () => {};
  ctx.renderScrollRow('#genreTracks', pictures.map((_, i) => ({ id: i, coverSmall: proxy })));
  assert.equal(row.innerHTML.match(/fetchpriority="high"/g)?.length, 4);
  assert.equal(row.innerHTML.match(/loading="lazy"/g)?.length, 1);
  assert.equal(probeImages.length, 0);
  callbacks[0]();
  assert.equal(probeImages.length, 3);
  assert.ok(probeImages.every(image => image.src === proxy));
  pictures[2].naturalWidth = 300;
  pictures[2].complete = true;
  cards[3].isConnected = false;
  probeImages.forEach(image => image.onload());
  assert.deepEqual(pictures.map(pic => pic.src), [cdn, proxy, cdn, cdn, cdn]);
  pictures[1].src = cdn;
  pictures[1].dataset.proxyCover = proxy;
  ctx.renderScrollRow('#genreTracks', [{ id: 'background', coverSmall: proxy }]);
  ctx.document.hidden = true;
  callbacks[1]();
  assert.equal(probeImages.length, 3, 'background tabs do not start alternative downloads');
});

test('the album wall renders the first catalog independently and never requests full-sized tiles', async () => {
  const requests = [], painted = [];
  const ctx = vm.createContext({
    URL, URLSearchParams, window: { location: new URL('https://music.test/'), dispatchEvent: event => painted.push(event.detail.items) },
    CustomEvent: class { constructor(_, { detail }) { this.detail = detail; } },
    state: { currentPage: 'album-favorites', queue: [], trackCache: new Map() },
    hotCache: [], normalizeNeteaseTrack: track => track, setTimeout() {}, resolveMusicResource: value => value,
    fetch: url => new Promise(resolve => requests.push({ url, resolve })),
  });
  vm.runInContext("const LOCAL_TRACK_COVER = '/icon.svg';" +
    slice('function resizeCoverUrl(', 'function recentlyPlayedCoverUrl(') +
    slice('let currentAlbumTracks =', 'async function openAlbumDetail(') +
    slice('function fallbackCover(', 'function renderTrackList('), ctx);
  const respond = (request, tracks) => request.resolve({ ok: true, json: async () => ({ songs: tracks }) });
  ctx.loadDriftWallSourceCovers([]);
  respond(requests[1], [{ albumId: 'first', cover: 'https://p2.music.126.net/first.jpg?param=1000y1000' }]);
  await tick();
  const [first] = painted[0];
  assert.equal(first.image, 'https://p2.music.126.net/first.jpg?param=300y300');
  const tile = { src: first.image, dataset: { proxyCover: first.proxy, decorativeCover: '1' } };
  ctx.fallbackCover(tile);
  assert.equal(new URL(tile.src, ctx.window.location.href).searchParams.get('url'), first.image);
  ctx.fallbackCover(tile);
  assert.equal(tile.src, '/icon.svg');

  respond(requests[0], Array.from({ length: 40 }, (_, i) => ({ albumId: i, cover: 'https://p2.music.126.net/' + i + '.jpg' })));
  await tick();
  assert.equal(painted.at(-1).length, 30);
  assert.ok(painted.at(-1).every(item => item.image.endsWith('?param=300y300')));
});
