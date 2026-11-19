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
    resolveMusicResource: x => x, musicResourceQuery: () => 'source=embeat&id=resource',
    fallbackCover() {}, syncNativeNowPlaying() {}, formatTime: String, fetchAndDisplayAlbumInfo() {},
    directCoverUrl: () => '', updateDynamicGradient() {}, setSliderValue() {}, updateLikeUI() {}, updatePlayBtn() {}, updateQueueHighlight() {},
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
  const img = { src: 'https://site.example/api/music/cover?source=embeat&picId=original', dataset: { artist: 'Artist', album: 'Album', name: 'Song' }, style: {} };
  const context = vm.createContext({ URL, location: { href: 'https://site.example' }, window: { tyMusicProvider: { resource: async () => 'https://cdn.example/broken.jpg' } } });
  vm.runInContext(source.slice(source.indexOf('function fallbackCover('), source.indexOf('function renderTrackList(')), context);
  context.fallbackCover(img);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(img.src, 'https://cdn.example/broken.jpg');
  context.fallbackCover(img);
  assert.match(img.src, /^data:image\/svg\+xml/);
});
