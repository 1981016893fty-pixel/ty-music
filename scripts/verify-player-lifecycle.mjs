import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
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
    section('function cacheTrack(', 'function toggleFavorite('), context);
  return { context, saved, notices };
}

test('saved favorites and playlist metadata survive browsing more than 500 other songs and reload', () => {
  const { context, saved } = storagePlayer();
  for (let id = 1; id <= 1100; id++) context.cacheTrack(track(id));
  context.cacheTrack({ ...track('embeat:kept'), source: 'embeat', providerId: 'kept', urlId: 'play', lyricId: 'words', picId: 'art' });
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
    directCoverUrl: () => '',
    extractAlbumColors: noop, fallbackCover: image => coverLookups.push(image), formatTime: String, setSliderValue: noop,
    resolveMusicResource: value => value, musicResourceQuery: item => `id=${item.id}`,
    requestAnimationFrame: fn => fn(),
  });
  vm.runInContext(section('let playbackRequestId =', '// ========== Play/Pause') +
    section('function deleteLocalTrack(', '// Minimal ID3v2 parser') +
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
  context.localMusicDB.transaction = () => (tx = { objectStore: () => ({ delete: () => ({}) }) });
  const deletion = context.deleteLocalTrack('localL');
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
