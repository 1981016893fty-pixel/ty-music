import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const localDatabaseSource = await readFile(new URL('../local-music-db.js', import.meta.url), 'utf8');
function section(start, end) {
  const a = source.indexOf(start), b = source.indexOf(end, a);
  assert.ok(a >= 0 && b > a, `missing player section: ${start}`);
  return source.slice(a, b);
}
const track = id => ({ id: String(id), title: `Song ${id}`, artist: 'Artist', source: 'netease' });
function storagePlayer() {
  const saved = new Map(), notices = [];
  const context = vm.createContext({
    window: {},
    console: { log() {}, warn() {}, error() {} },
    state: { favorites: new Set(['1']), playlists: [{ tracks: ['2', 'embeat:kept'] }],
      recentPlays: [], albumFavorites: new Set(), queue: [], trackCache: new Map() },
    localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) },
    showToast: message => notices.push(message),
    providerTrackId: item => item.providerId || item.id,
    coverUrlForTrack: item => item.cover || '',
  });
  vm.runInContext(section('function loadData()', '\nloadData();') +
    section('function cacheTrack(', 'function toggleFavorite(') +
    section('function providerTrackId(', 'function normalizeTrack(') +
    section('function normalizeTrack(', '// 通过本地服务器搜索'), context);
  return { context, saved, notices };
}

test('saved favorites and playlist metadata survive browsing more than 500 other songs and reload', () => {
  const { context, saved } = storagePlayer();
  for (let id = 1; id <= 1100; id++) context.cacheTrack(track(id));
  context.cacheTrack({ ...track('embeat:kept'), source: 'embeat', providerId: 'kept', urlId: 'play', lyricId: 'words', picId: 'art' });
  assert.ok(context.state.trackCache.size <= 503, 'live browsing metadata is bounded too');
  context.saveAll();
  const persisted = JSON.parse(saved.get('melodybox_tracks'));
  assert.equal(persisted['1']?.title, 'Song 1');
  assert.equal(persisted['2']?.title, 'Song 2');
  assert.equal(persisted['embeat:kept']?.urlId, 'play');
  assert.ok(Object.keys(persisted).length <= 503, 'only unreferenced browsing metadata is evictable');
  context.state.trackCache.clear();
  context.loadData();
  assert.equal(context.state.trackCache.get('1')?.title, 'Song 1');
  assert.equal(context.state.trackCache.get('embeat:kept')?.lyricId, 'words');
});

test('a large personal library is never trimmed to the browsing cache limit', () => {
  const { context, saved } = storagePlayer();
  context.state.favorites = new Set();
  for (let id = 1; id <= 750; id++) {
    context.state.favorites.add(String(id));
    context.cacheTrack(track(id));
  }
  context.saveAll();
  context.state.trackCache.clear();
  context.loadData();
  assert.equal(context.state.trackCache.size, 750);
  assert.equal(JSON.parse(saved.get('melodybox_fav')).length, 750);
});

test('quota fallback removes browsing metadata only; a failed durable write preserves the previous snapshot and reports failure', () => {
  const { context, saved, notices } = storagePlayer();
  for (let id = 1; id <= 20; id++) context.cacheTrack(track(id));
  const write = context.localStorage.setItem;
  context.localStorage.setItem = (key, value) => {
    if (key === 'melodybox_tracks' && Object.keys(JSON.parse(value)).length > 2) {
      throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
    }
    write(key, value);
  };
  context.saveAll();
  assert.deepEqual(Object.keys(JSON.parse(saved.get('melodybox_tracks'))), ['1', '2']);
  const before = saved.get('melodybox_tracks');
  context.localStorage.setItem = (key, value) => {
    if (key === 'melodybox_tracks') throw Object.assign(new Error('quota'), { name: 'QuotaExceededError' });
    write(key, value);
  };
  context.saveAll();
  assert.equal(saved.get('melodybox_tracks'), before);
  assert.match(notices.at(-1), /保存失败/);
});

function playbackPlayer() {
  const nodes = new Map(), reads = new Map(), resources = [], created = [], revoked = [], notices = [], audioEvents = new Map(), coverLookups = [];
  const node = selector => {
    if (!nodes.has(selector)) nodes.set(selector, { dataset: {}, style: { setProperty() {} },
      classList: { add() {}, remove() {}, toggle() {}, contains: () => false }, querySelector: () => ({}), addEventListener() {} });
    return nodes.get(selector);
  };
  const audio = { src: '', paused: true, currentTime: 0, load() {}, pause() { this.paused = true; },
    removeAttribute() { this.src = ''; }, play() { this.paused = false; return Promise.resolve(); },
    addEventListener(name, fn) { audioEvents.set(name, fn); } };
  const noop = () => {};
  const context = vm.createContext({
    console: { log() {}, warn() {}, error() {} }, AbortController, Blob, clearTimeout, setTimeout,
    URL: { createObjectURL() { const url = `blob:${created.length}`; created.push(url); return url; }, revokeObjectURL: url => revoked.push(url) },
    CustomEvent: class { constructor(type, data) { this.type = type; this.detail = data?.detail; } },
    $: node, $$: () => [], document: { querySelector: () => null, getElementById: node, title: '' },
    window: { dispatchEvent() {}, tyMusicProvider: { resource(item, kind, options) {
      return new Promise((resolve, reject) => resources.push({ item, resolve, reject, signal: options.signal }));
    } } },
    state: { queue: [track('remote')], queueIndex: 0, recentPlays: [], trackCache: new Map(), isShuffled: false, shuffledQueue: [], lyrics: {} },
    audio, playTimeout: null, ampIsShowing: false, ampLyricsRequestId: 0, ampLyricsRenderedFor: null,
    localMusicDB: { transaction: () => ({ objectStore: () => ({ get(id) { const request = {}; reads.set(id, request); return request; } }) }) },
    showToast: message => notices.push(message),
    updateLikeUI: noop, updatePlayBtn: noop, updateQueueHighlight: noop, syncNativeNowPlaying: noop,
    updateAmpFullscreenPlayer: noop, fetchAndDisplayAlbumInfo: noop, updateDynamicGradient: noop,
    coverUrlForTrack: track => track.coverSmall || track.cover, compactCover: cover => ({ src: cover }), watchCoverImage: noop, unwatchCoverImage: noop,
    extractAlbumColors: noop, fallbackCover: image => coverLookups.push(image), formatTime: String, setSliderValue: noop,
    providerTrackId: item => item.id, resolveMusicResource: value => value, musicResourceQuery: item => `id=${item.id}`,
    requestAnimationFrame: fn => fn(),
  });
  vm.runInContext(localDatabaseSource + '\n' + section('let playbackRequestId =', '// ========== Play/Pause') +
    section('async function deleteLocalTrack(', '// Minimal ID3v2 parser') +
    section('function playLocalTrack(', '// 更新存储信息显示') +
    section('function syncQueueOrder()', '// Repeat') +
    section('function togglePlay()', '// HTML5 audio events') +
    section("audio.addEventListener('ended'", '// Audio progress'), context);
  function finishLocal(id) {
    const request = reads.get(id);
    request.onsuccess({ target: { result: { id, title: id, artist: 'Local artist', audioData: new Uint8Array([1, 2]), fileType: 'audio/wav' } } });
  }
  return { context, audio, resources, finishLocal, created, revoked, notices, audioEvents, coverLookups };
}

test('selecting local music invalidates pending remote resolution and keeps audio and metadata on the last selection', async () => {
  const { context, audio, resources, finishLocal } = playbackPlayer();
  context.playTrack(track('remote'), 0, true);
  context.playLocalTrack('localL');
  finishLocal('localL');
  const selectedAudio = audio.src;
  resources[0].resolve('https://audio.test/remote.mp3');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(audio.src, selectedAudio);
  assert.equal(context.state.currentTrack.id, 'localL');
  assert.equal(resources[0].signal.aborted, true);
});

test('desktop Embeat can recover from a failed stream while NetEase retains proxy playback', async () => {
  const { context, audio, resources } = playbackPlayer();
  context.window.__TY_MUSIC_DESKTOP__ = true;
  audio.play = function () {
    if (this.src.startsWith('/api/') && this.src.includes('id=embeat:')) {
      return Promise.reject(new Error('stream failed'));
    }
    this.paused = false;
    return Promise.resolve();
  };
  context.playTrack({ ...track('embeat:1'), source: 'embeat' }, 0, true);
  assert.equal(audio.src, '/api/music/proxy?id=embeat:1&stream=1');
  assert.equal(resources[0]?.item.id, 'embeat:1');
  resources[0].resolve('https://audio.test/embeat.mp4');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(audio.src, 'https://audio.test/embeat.mp4');
  assert.equal(context.state.isPlaying, true);

  context.playTrack({ ...track('123'), source: 'netease' }, 0, true);
  assert.equal(resources.length, 1);
  assert.equal(audio.src, '/api/music/proxy?id=123&stream=1');
});

test('metadata probing releases its temporary audio URL on success and failure', async () => {
  for (const event of ['loadedmetadata', 'error']) {
    const revoked = [], probes = [];
    class Audio {
      constructor() { this.events = new Map(); this.duration = 12; probes.push(this); }
      addEventListener(name, fn) { this.events.set(name, fn); }
      removeEventListener(name) { this.events.delete(name); }
      removeAttribute() {} load() {} pause() {}
    }
    const context = vm.createContext({ Blob, Audio, clearTimeout() {}, setTimeout: () => 1,
      URL: { createObjectURL: () => 'blob:probe', revokeObjectURL: url => revoked.push(url) } });
    vm.runInContext(section('async function extractAudioMetadata(', 'async function handleLocalFileUpload('), context);
    const promise = context.extractAudioMetadata({ name: 'Artist - Song.wav', type: 'audio/wav', arrayBuffer: async () => new ArrayBuffer(4) });
    await new Promise(resolve => setImmediate(resolve));
    probes[0].events.get(event)();
    const metadata = await promise;
    assert.deepEqual(revoked, ['blob:probe']);
    assert.equal(metadata.objectURL, undefined);
    assert.equal(metadata.duration, event === 'error' ? 0 : 12);
  }
});

test('local audio URLs are released on replacement and final end, with replay and single-repeat remaining usable', async () => {
  const { context, audio, finishLocal, created, revoked, audioEvents } = playbackPlayer();
  context.replaceQueue([]);
  context.playLocalTrack('localL'); finishLocal('localL');
  context.playLocalTrack('localM'); finishLocal('localM');
  assert.deepEqual(revoked, ['blob:0']);
  context.state.repeatMode = 2;
  audioEvents.get('ended')();
  assert.deepEqual(revoked, ['blob:0'], 'single repeat retains its currently used resource');
  context.state.repeatMode = 0;
  audioEvents.get('ended')();
  assert.deepEqual(revoked, created, 'a completed local track does not retain its blob');
  context.togglePlay();
  finishLocal('localM');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(context.state.currentTrack.id, 'localM');
  assert.equal(audio.src, 'blob:2');
});

test('late local reads and play promises cannot replace a newer local or remote selection', async () => {
  const { context, audio, finishLocal, created, revoked } = playbackPlayer();
  context.playLocalTrack('localL');
  context.playLocalTrack('localM');
  finishLocal('localM');
  finishLocal('localL');
  assert.equal(context.state.currentTrack.id, 'localM');
  assert.equal(created.length, 1, 'stale DB reads do not allocate audio resources');
  let rejectLocalPlay;
  audio.play = () => new Promise((resolve, reject) => { rejectLocalPlay = reject; });
  context.playLocalTrack('localN'); finishLocal('localN');
  audio.play = () => Promise.resolve();
  context.playTrack(track('new-remote'), 0, true);
  const selectedAudio = audio.src;
  rejectLocalPlay(new Error('late local failure'));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(audio.src, selectedAudio);
  assert.equal(context.state.currentTrack.id, 'new-remote');
  assert.deepEqual(revoked, created);
  assert.equal(context.state.isPlaying, true, 'old failure cannot pause the newer track');
});

test('deleting the playing local track releases audio only after the deletion commits', async () => {
  const { context, audio, finishLocal, created, revoked } = playbackPlayer();
  context.playLocalTrack('localL'); finishLocal('localL');
  await new Promise(resolve => setImmediate(resolve));
  let tx;
  const deletes = [];
  context.localMusicDB.transaction = (stores, mode) => {
    assert.deepEqual(Array.from(stores), ['tracks', 'trackMetadata']);
    assert.equal(mode, 'readwrite');
    return tx = { objectStore: name => ({ delete: id => deletes.push([name, id]) }) };
  };
  const deletion = context.deleteLocalTrack('localL');
  assert.deepEqual(deletes, [['tracks', 'localL'], ['trackMetadata', 'localL']]);
  assert.deepEqual(revoked, [], 'an uncommitted deletion must not interrupt playback');
  assert.equal(typeof tx.oncomplete, 'function');
  tx.oncomplete();
  await deletion;
  assert.deepEqual(revoked, created);
  assert.equal(audio.src, '');
  assert.equal(context.state.isPlaying, false);
  assert.equal(context.getQueue().some(item => item.id === 'localL'), false);
  const failed = context.deleteLocalTrack('other');
  tx.onabort({ target: { error: new Error('quota') } });
  await assert.rejects(failed);
});

test('shuffle follows the selected song when replacing queues, toggling modes and selecting a queue row', () => {
  const { context } = playbackPlayer();
  const oldTracks = ['A', 'B', 'C'].map(track);
  context.replaceQueue(oldTracks);
  context.selectQueueTrack(oldTracks[1]);
  context.toggleShuffle();
  assert.equal(context.getQueue()[context.state.queueIndex].id, 'B');
  const newTracks = ['X', 'Y'].map(track);
  context.replaceQueue(newTracks);
  context.playTrack(newTracks[0], 0, true);
  context.playNext();
  assert.equal(context.state.currentTrack.id, 'Y');
  context.playPrev();
  assert.equal(context.state.currentTrack.id, 'X');
  context.toggleShuffle();
  assert.equal(context.state.queueIndex, 0);
  context.playTrack(newTracks[1], 1, true);
  context.toggleShuffle();
  assert.equal(context.getQueue()[context.state.queueIndex].id, 'Y');
  context.playNext();
  assert.equal(context.state.currentTrack.id, 'X');
});

test('local selection preserves the prior queue and does not search for artwork with uploaded metadata', async () => {
  const { context, finishLocal, coverLookups } = playbackPlayer();
  context.playLocalTrack('localL'); finishLocal('localL');
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(Array.from(context.getQueue(), item => item.id), ['remote', 'localL']);
  assert.deepEqual(coverLookups, []);
  context.playNext();
  assert.equal(context.state.currentTrack.id, 'remote');
});

test('local lyrics remain offline without disclosing file metadata', async () => {
  const context = vm.createContext({ fetch() { assert.fail('local metadata must not be sent online'); } });
  vm.runInContext(section('async function loadLyrics(', '\n// =========='), context);
  let lines;
  await context.loadLyrics({ source: 'local', title: 'Private recording', artist: 'Filename' }, value => { lines = value; });
  assert.equal(lines.length, 0);
});

function fullscreenArtworkPlayer() {
  const requests = [], nodes = new Map(), events = [];
  const node = selector => {
    if (!nodes.has(selector)) {
      const style = { setProperty(key, value) { this[key] = value; }, removeProperty(key) { delete this[key]; } };
      const classes = new Set();
      nodes.set(selector, { style, classList: { add: key => classes.add(key), remove: key => classes.delete(key),
        contains: key => classes.has(key) }, querySelectorAll: () => [] });
    }
    return nodes.get(selector);
  };
  const context = vm.createContext({
    $: node, URL, URLSearchParams, location: new URL('https://music.test/'),
    Image: class { set src(value) { this.url = value; requests.push(this); } },
    CustomEvent: class { constructor(type, { detail }) { this.type = type; this.detail = detail; } },
    window: { location: new URL('https://music.test/'), dispatchEvent: event => events.push(event) },
    state: {}, getQueue: () => [], directCoverUrl: () => '',
    resolveMusicResource: url => url, updateAmpPlayBtn() {}, ampLyricsShowing: false,
    extractAlbumColors() {}, rememberRecentCover() {}, setTimeout() {},
  });
  for (const selector of ['#ampLikeBtn', '#ampShuffleBtn', '#ampRepeatBtn']) nodes.set(selector, null);
  vm.runInContext(section('const LOCAL_TRACK_COVER =', 'function releaseLocalAudio()') +
    section('let ampIsShowing = false;', '// 辅助：在圆角矩形路径上') +
    section('function applyAlbumColors(', 'function applyAlbumDetailColors(') +
    section('function getActiveTrack()', 'function updateAmpPlayBtn()'), context);
  const select = (id, cover, coverSmall = '') =>
    context.updateAmpFullscreenPlayer({ ...track(id), album: 'Album', cover, coverSmall });
  const settle = (request, success) => {
    const img = typeof request === 'string' ? requests.find(item => item.url === request) : request;
    assert.ok(img, 'the selected track artwork must be requested');
    img[success ? 'onload' : 'onerror']();
  };
  return { context, requests, events, select, settle, artwork: node('#ampArtwork'), title: node('#ampTitle') };
}

test('fullscreen drops the previous cover at song change and shows the same song thumbnail if the large cover fails', () => {
  const { context, requests, select, settle, artwork, title } = fullscreenArtworkPlayer();
  select('a', '/a.jpg');
  settle('/a.jpg', true);
  assert.equal(context.window.ampCoverSrc, '/a.jpg');
  select('b', '/b-large.jpg', '/b-small.jpg');
  assert.equal(title.textContent, 'Song b');
  assert.doesNotMatch(artwork.style.backgroundImage, /\/a\.jpg/);
  settle('/b-large.jpg', false);
  settle('/b-small.jpg', true);
  assert.equal(context.window.ampCoverSrc, '/b-small.jpg');
  assert.ok(!requests.some(img => img.url.startsWith('/api/artist-photo') || img.url.startsWith('/api/album-cover')));
});

test('fullscreen ignores stale successes and failures after revisiting the same track', () => {
  const { context, requests, select, settle } = fullscreenArtworkPlayer();
  select('same', '/old.jpg', '/old-small.jpg');
  const old = requests.find(img => img.url === '/old.jpg');
  select('other', '/other.jpg');
  const other = requests.find(img => img.url === '/other.jpg');
  select('same', '/new.jpg');
  settle('/new.jpg', true);
  const count = requests.length;
  settle(old, true);
  settle(other, false);
  assert.equal(context.window.ampCoverSrc, '/new.jpg');
  assert.equal(requests.length, count);
});

test('fullscreen keeps a neutral placeholder when metadata only has a portrait or demo image', () => {
  const { context, requests, select, artwork } = fullscreenArtworkPlayer();
  select('missing', '/api/artist-photo?name=Artist', '/assets/demo/cs1.webp');
  assert.equal(requests.length, 0);
  assert.match(artwork.style.backgroundImage, /data:image\/svg\+xml/);
  assert.equal(context.window.ampCoverSrc, '');
});

test('fullscreen skips a malformed stored cover and can still show the song thumbnail', () => {
  const { context, select, settle } = fullscreenArtworkPlayer();
  select('imported', 'https://[', '/valid.jpg');
  settle('/valid.jpg', true);
  assert.equal(context.window.ampCoverSrc, '/valid.jpg');
});

test('fullscreen leaves the original grid visible when the palette cannot be read', () => {
  const { context, select, settle } = fullscreenArtworkPlayer();
  let settlePalette;
  context.extractAlbumColors = (_url, callback) => { settlePalette = callback; };
  select('cross-origin', '/cross-origin.jpg');
  settle('/cross-origin.jpg', true);
  const mount = context.$('#ampGridDistortionMount');
  const backdrop = mount.style;
  assert.equal(backdrop['--amp-cover-backdrop'], undefined);
  settlePalette(null);
  assert.equal(backdrop['--amp-cover-backdrop'], undefined);
  select('next', '/next.jpg');
  assert.equal(backdrop['--amp-cover-backdrop'], undefined);
  settle('/next.jpg', true);
  const red = { r: 110, g: 20, b: 10 };
  settlePalette({ primary: red, secondary: red, tertiary: red });
  assert.equal(backdrop['--amp-cover-backdrop'], undefined);
});

test('fullscreen discards the previous song palette before showing a song without cover art', () => {
  const { context, select, settle } = fullscreenArtworkPlayer();
  const red = { r: 110, g: 20, b: 10 };
  context.extractAlbumColors = (_url, callback) => callback({ primary: red, secondary: red, tertiary: red });
  select('red', '/red.jpg');
  settle('/red.jpg', true);
  const player = context.$('#ampFullscreenPlayer');
  assert.equal(player.style['--amp-accent-rgb'], '110, 20, 10');
  select('missing', '');
  assert.equal(player.style['--amp-accent-rgb'], undefined);
  assert.equal(context.window.ampGridColors, undefined);
});

test('legacy recent entries keep the Embeat provider and recover missing resource identifiers from cache', () => {
  const { context } = storagePlayer();
  context.cacheTrack({ ...track('embeat:kept'), source: 'embeat', providerId: 'kept',
    urlId: 'play', lyricId: 'words', picId: 'art', cover: '/same-song.webp' });
  const restored = context.trackFromRecentEntry({ id: 'embeat:kept', urlId: '', lyricId: '', cover: '' });
  assert.equal(restored.source, 'embeat');
  assert.equal(restored.urlId, 'play');
  assert.equal(restored.lyricId, 'words');
  assert.equal(restored.cover, '/same-song.webp');
  const legacy = context.trackFromRecentEntry({ id: 'embeat:track%3A42', title: 'Original' });
  assert.equal(legacy.source, 'embeat');
  assert.equal(legacy.providerId, 'track:42');
});

test('recent artwork remembers a decoded CDN thumbnail and retries its original source when the URL expires', () => {
  const { context, saved } = storagePlayer();
  const cover = '/api/music/cover?picId=art&source=embeat&size=300';
  const cdn = 'https://resources.tidal.com/images/example/320x320.jpg';
  context.URL = URL;
  context.escAttr = String;
  context.resolveMusicResource = String;
  context.window.location = new URL('https://music.test/');
  const timers = [];
  context.setTimeout = callback => timers.push(callback);
  vm.runInContext(section('function resizeCoverUrl(', '// Keep upstream resource IDs separate'), context);
  context.state.recentPlays = [{ id: 'embeat:kept', picId: 'art', cover: '/icon.svg', title: 'Original' }];
  let restored = context.trackFromRecentEntry(context.state.recentPlays[0]);
  assert.equal(restored.coverSmall, cover, 'legacy placeholder must not hide the saved picture ID');
  const img = { dataset: { recentTrackId: 'embeat:kept' }, currentSrc: cdn, naturalWidth: 320, isConnected: true };
  context.rememberRecentCoverImage(img);
  context.rememberRecentCoverImage({ ...img, currentSrc: 'https://other.example/wrong.jpg' });
  assert.equal(timers.length, 1);
  timers[0]();
  context.state.recentPlays = [];
  context.loadData();
  restored = context.trackFromRecentEntry(context.state.recentPlays[0]);
  const markup = context.trackCoverMarkup(restored, '', true, '', false, true);
  assert.ok(markup.includes(`src="${cdn}"`));
  assert.ok(markup.includes(`data-proxy-cover="${cover}"`));
  assert.match(markup, /loading="lazy"/);
});

test('Embeat fullscreen shows direct artwork and retries blocked palette reads with its own thumbnail ID', async () => {
  const { context, requests, settle } = fullscreenArtworkPlayer();
  const palettes = [];
  context.extractAlbumColors = (url, callback) => { palettes.push({ url, callback }); };
  context.window.tyMusicProvider = { resource: async () => 'https://art.test/embeat.jpg' };
  context.updateAmpFullscreenPlayer({ ...track('embeat:42'), source: 'embeat', picId: '42', cover: '/slow.webp' });
  await new Promise(resolve => setImmediate(resolve));
  settle('https://art.test/embeat.jpg', true);
  assert.equal(context.window.ampCoverSrc, 'https://art.test/embeat.jpg');
  assert.equal(palettes[0].url, 'https://art.test/embeat.jpg');
  palettes[0].callback(null);
  assert.match(palettes[1]?.url || '', /picId=42&source=embeat&size=300$/);
  assert.equal(context.$('#ampGridDistortionMount').style['--amp-cover-backdrop'], undefined);
  settle('/slow.webp', true);
  assert.equal(context.window.ampCoverSrc, 'https://art.test/embeat.jpg');
  context.updateAmpFullscreenPlayer(track('next'));
  const red = { r: 110, g: 20, b: 10 };
  palettes[1].callback({ primary: red, secondary: red, tertiary: red });
  assert.equal(context.window.ampGridColors, undefined);
  assert.equal(context.$('#ampGridDistortionMount').style['--amp-cover-backdrop'], undefined);
  assert.equal(requests.length, 2);
});

test('direct audio resolution does not restart a proxy that has buffered enough to start', async () => {
  const { context, audio, resources } = playbackPlayer();
  context.playTrack(track('remote'), 0, true);
  const proxy = audio.src;
  audio.readyState = 3;
  resources[0].resolve('https://audio.test/remote.mp3');
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(audio.src, proxy);
});
