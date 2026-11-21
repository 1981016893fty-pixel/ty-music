import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

async function browser(fetch) {
  const context = vm.createContext({ fetch, URL, URLSearchParams, AbortController, TextEncoder, TextDecoder, performance, setTimeout, clearTimeout, console });
  for (const name of ['gd-embeat-core.js', 'browser-provider.js']) vm.runInContext(await readFile(new URL('../' + name, import.meta.url), 'utf8'), context);
  return context.createBrowserMusicProvider({ fetchImpl: fetch });
}
const json = value => new Response(JSON.stringify(value));
test('the base catalog returns its cover URLs and cursor while Embeat uses the visitor network', async () => {
  const track = { id: '42', source: 'netease', name: 'Song', coverSmall: '/api/cover?size=300&url=https%3A%2F%2Fp1.music.126.net%2Fcover.jpg' };
  const calls = [];
  const provider = await browser(async raw => {
    const url = new URL(raw, 'https://site.example');
    calls.push(url);
    if (url.pathname === '/api/music/search') {
      assert.equal(url.searchParams.get('offset'), '20');
      assert.equal(url.searchParams.get('limit'), '20');
      assert.equal(url.searchParams.get('source'), 'netease');
      return json({ songs: [track], total: 21, nextOffset: 21, hasMore: false });
    }
    if (url.pathname === '/time') return new Response('1794826800');
    if (url.searchParams.get('source') === 'netease') {
      return json([{ id: '42', name: 'Song', artist: ['Artist'], source: 'netease', pic_id: 'art' }]);
    }
    assert.equal(url.searchParams.get('source'), 'embeat');
    return json([{ id: 'extra', name: 'Extra', artist: ['Artist'], source: 'embeat', pic_id: 'art' }]);
  });
  const [base, extra] = await Promise.all([
    provider.search('周杰伦', 'netease', 20, 20),
    provider.search('周杰伦', 'embeat'),
  ]);
  assert.equal(base.songs[0].coverSmall, track.coverSmall);
  assert.equal(base.songs[0].id, track.id);
  assert.equal(base.total, 21);
  assert.equal(base.nextOffset, 21);
  assert.equal(base.hasMore, false);
  assert.equal(extra.songs[0].providerId, 'extra');
  assert.equal(calls.filter(url => url.origin === 'https://site.example').length, 1);
  assert.equal(calls.filter(url => url.hostname === 'music-api.gdstudio.xyz').length, 0);
});

test('direct catalog pagination preserves resource identity', async () => {
  const calls = [];
  const provider = await browser(async (raw, options) => {
    if (String(raw).startsWith('/api/music/search?')) return new Response(null, { status: 502 });
    const url = new URL(raw); calls.push(url);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.cache, 'no-store');
    if (url.pathname === '/time') return new Response('1794826800');
    assert.equal(url.pathname, '/api.php');
    const source = url.searchParams.get('source');
    assert.equal(url.searchParams.get('pages'), '2');
    if (source === 'embeat') assert.equal(url.searchParams.get('s'), '7E101CFD');
    return json([1, 2, 3].map(id => ({ id: String(id), name: 'Song', artist: ['Artist'], source, url_id: 'audio' + id, lyric_id: 'lyric' + id, pic_id: 'pic' + id })));
  });
  for (const source of ['netease', 'embeat']) {
    const page = await provider.search('周杰伦', source, 3, 4);
    assert.deepEqual(Array.from(page.songs, s => s.id), ['2', '3']);
    assert.equal(page.songs[0].source, source);
    assert.equal(page.songs[0].urlId, 'audio2');
    assert.equal(page.songs[0].lyricId, 'lyric2');
    assert.equal(page.nextOffset, 6); assert.equal(page.hasMore, true);
  }
  assert.equal(calls.filter(u => u.hostname === 'music-api.gdstudio.xyz').length, 1);
});

test('a failed base search falls back to GD Netease even when Embeat is unavailable', async () => {
  const calls = [];
  const provider = await browser(async (url, options) => {
    calls.push(String(url));
    if (String(url).startsWith('/api/music/search?')) return new Response(null, { status: 502 });
    if (new URL(url).searchParams.get('source') === 'netease') {
      return json([{ id: '42', name: 'Song', artist: ['Artist'], source: 'netease' }]);
    }
    throw new TypeError('Failed to fetch');
  });
  assert.equal((await provider.search('test', 'netease')).songs[0].id, '42');
  await assert.rejects(provider.search('test', 'embeat'));
  assert.equal(calls.filter(url => url.startsWith('/api/')).length, 1);
});

test('resource requests use resource IDs, reject unsafe URLs and normalize literal lyric newlines', async () => {
  const calls = [];
  const provider = await browser(async (raw, options) => {
    const url = new URL(raw); calls.push(url);
    if (url.pathname === '/time') return new Response('1794826800');
    const type = url.searchParams.get('types');
    if (type === 'lyric') return json({ lyric: '[00:00.00]first\\n[00:02.00]second' });
    return json({ url: url.searchParams.get('id') === 'unsafe' ? 'javascript:alert(1)' : 'https://cdn.example/song.flac' });
  });
  for (const source of ['netease', 'embeat']) {
    const track = { id: 'internal', providerId: 'original', source, urlId: 'audio', lyricId: 'lyrics', picId: 'cover' };
    assert.equal(await provider.resource(track, 'url'), 'https://cdn.example/song.flac');
    assert.equal((await provider.resource(track, 'lyric')).lrc, '[00:00.00]first\n[00:02.00]second');
    await provider.resource(track, 'pic');
    await assert.rejects(provider.resource({ ...track, urlId: 'unsafe' }, 'url'));
  }
  assert.deepEqual(calls.filter(u => u.pathname === '/api.php').map(u => u.searchParams.get('id')), ['audio', 'lyrics', 'cover', 'unsafe', 'audio', 'lyrics', 'cover', 'unsafe']);
});

test('cancelling a query does not fall back or wait for an uncooperative transport', async () => {
  const calls = [];
  const provider = await browser(url => { calls.push(String(url)); return new Promise(() => {}); });
  const controller = new AbortController();
  const pending = provider.search('test', 'netease', 20, 0, { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending);
  assert.equal(calls.length, 1);
});

test('late audio resolution cannot replace a later choice or reset its lyrics, even for the same ID', async () => {
  const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
  const pending = [], notices = [];
  let playCalls = 0;
  const element = { dataset: {}, style: { setProperty() {} }, classList: { remove() {} } };
  const audio = { src: '', pause() {}, load() {}, removeAttribute() { this.src = ''; }, play() { playCalls++; return Promise.resolve(); } };
  const context = vm.createContext({
    URLSearchParams, AbortController, clearTimeout, setTimeout, console,
    state: { queueIndex: 0, queue: [], isPlaying: false }, audio,
    window: { dispatchEvent() {}, tyMusicProvider: { resource: (...args) => new Promise((resolve, reject) => pending.push({ resolve, reject, args })) } },
    document: { title: '', getElementById: () => null, querySelector: () => element },
    CustomEvent: class {}, $: () => element, showToast: text => notices.push(text),
    providerTrackId: item => item.id, resolveMusicResource: x => x, musicResourceQuery: () => 'source=embeat&id=resource',
    fallbackCover() {}, syncNativeNowPlaying() {}, formatTime: String, fetchAndDisplayAlbumInfo() {},
    coverUrlForTrack: () => '', compactCover: () => ({ src: '/icon.svg' }), watchCoverImage() {}, unwatchCoverImage() {}, updateDynamicGradient() {}, setSliderValue() {}, updateLikeUI() {}, updatePlayBtn() {}, updateQueueHighlight() {},
    ampLyricsRequestId: 0, ampLyricsRenderedFor: null, ampIsShowing: false, playTimeout: null,
  });
  vm.runInContext(source.slice(source.indexOf('let playbackRequestId ='), source.indexOf('// ========== Play/Pause')) +
    source.slice(source.indexOf('function syncQueueOrder()'), source.indexOf('function playNext()')), context);
  const track = { id: 'embeat:same', source: 'embeat', title: 'Song', artist: 'Artist' };
  context.playTrack(track, 0, true);
  assert.equal(playCalls, 1, 'Safari receives a play call synchronously in the click handler');
  context.playTrack(track, 0, true);
  assert.equal(pending[0].args[2].signal.aborted, true);
  pending[1].resolve('https://cdn.example/current.flac');
  await new Promise(resolve => setTimeout(resolve, 0));
  context.state.lyrics = { lines: ['current lyrics'] };
  pending[0].resolve('https://cdn.example/old.flac');
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(audio.src, 'https://cdn.example/current.flac');
  assert.deepEqual(context.state.lyrics.lines, ['current lyrics']);
  assert.equal(context.state.isPlaying, true);
});

test('Embeat CDN image failure falls back to the icon without guessing another catalog', async () => {
  const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
  const img = { isConnected: true, src: 'https://site.example/api/music/cover?source=embeat&picId=original', dataset: { artist: 'Artist', album: 'Album', name: 'Song' }, style: {} };
  const context = vm.createContext({ URL, location: { href: 'https://site.example' }, window: { location: new URL('https://site.example'), tyMusicProvider: { resource: async () => 'https://cdn.example/broken.jpg' } } });
  vm.runInContext("const LOCAL_TRACK_COVER = '/icon.svg';" + source.slice(source.indexOf('function coverLookup('), source.indexOf('function recentlyPlayedCoverUrl(')) + source.slice(source.indexOf('function fallbackCover('), source.indexOf('function renderTrackList(')), context);
  context.fallbackCover(img);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(img.src, 'https://cdn.example/broken.jpg');
  context.fallbackCover(img);
  assert.equal(img.src, '/icon.svg');
});

test('concurrent Embeat cover lookups share the same provider request and can retry failures', async () => {
  let pictureRequests = 0;
  const provider = await browser(async raw => {
    const url = new URL(raw);
    if (url.pathname === '/time') return new Response('1794826800');
    if (++pictureRequests === 1) return new Response(null, { status: 502 });
    return json({ url: 'https://cdn.example/current.webp' });
  });
  const track = { source: 'embeat', picId: 'cover' };
  const first = await Promise.allSettled([provider.resource(track, 'pic'), provider.resource(track, 'pic')]);
  assert.ok(first.every(result => result.status === 'rejected'));
  assert.equal(pictureRequests, 1);
  assert.equal(await provider.resource(track, 'pic'), 'https://cdn.example/current.webp');
  assert.equal(pictureRequests, 2);
});

test('visible Embeat artwork takes the first usable path and does not repaint a reused image', async () => {
  const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
  const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
  const requests = [], probes = [], observed = new Set();
  const primary = 'https://site.example/api/music/cover?source=embeat&picId=original&size=300';
  const alternate = 'https://cdn.example/alternate.jpg';
  let onIntersection;
  class Observer {
    constructor(callback) { onIntersection = callback; }
    observe(image) { observed.add(image); }
    unobserve(image) { observed.delete(image); }
  }
  const context = vm.createContext({
    URL, IntersectionObserver: Observer,
    Image: class { constructor() { probes.push(this); } },
    window: { location: new URL('https://site.example/'), IntersectionObserver: Observer,
      tyMusicProvider: { resource: (lookup, kind, options) => new Promise((resolve, reject) => requests.push({ lookup, kind, options, resolve, reject })) } },
    coverUrlForTrack: track => track.coverSmall,
    compactCover: src => ({ src }),
  });
  vm.runInContext("const LOCAL_TRACK_COVER = '/icon.svg';" +
    section('function coverLookup(', 'function recentlyPlayedCoverUrl(') +
    section('function setPlaybackCover(', 'function presentPlaybackTrack(') +
    section('function fallbackCover(', 'function renderTrackList('), context);
  const track = { source: 'embeat', picId: 'original', coverSmall: primary };
  const image = { isConnected: true, dataset: {} };
  const select = () => {
    image.complete = false;
    image.naturalWidth = 0;
    context.setPlaybackCover(image, track);
    assert.ok(observed.has(image));
  };
  const visible = () => onIntersection([{ target: image, isIntersecting: true }]);
  const flush = async () => new Promise(resolve => setImmediate(resolve));

  select();
  assert.equal(requests.length, 0);
  visible();
  requests[0].resolve(alternate);
  await flush();
  assert.equal(image.src, primary, 'keeps the first image in flight until the alternate decodes');
  assert.equal(requests[0].lookup.picId, track.picId);
  assert.equal(requests[0].options.size, 300);
  probes[0].onload();
  assert.equal(image.src, alternate);

  select(); visible();
  requests[1].resolve(alternate);
  await flush();
  image.complete = true;
  image.naturalWidth = 300;
  probes[1].onload();
  assert.equal(image.src, primary, 'a successful primary is never overwritten');

  select(); visible();
  image.onerror.call(image);
  assert.equal(requests.length, 3, 'image error joins the pending visible lookup');
  requests[2].resolve(alternate);
  await flush();
  assert.equal(image.src, alternate, 'a failed primary need not wait for a second download');

  select(); visible();
  select(); visible();
  requests[3].resolve(alternate);
  await flush();
  assert.equal(probes.length, 2, 'an earlier selection cannot start a download for the reused DOM node');
  assert.equal(image.src, primary);
  image.onerror.call(image);
  requests[4].reject(new Error('unavailable'));
  await flush();
  assert.equal(image.src, '/icon.svg');
});
