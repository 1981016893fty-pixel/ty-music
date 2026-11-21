import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const between = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const nodes = new Map();
const element = () => ({ style: {}, innerHTML: '', textContent: '', querySelectorAll: () => [] });
const document = {
  getElementById(id) { if (id === 'loadMoreArtistBtn') return null; if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); },
  // HTML serialization of a text node escapes markup, not attribute quotes.
  createElement() { return { textContent: '', get innerHTML() { return String(this.textContent).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); } }; },
};
const box = element();
const context = vm.createContext({ document, console, AbortSignal, encodeURIComponent, URL, URLSearchParams,
  window: { location: new URL('https://music.test/') },
  $: () => box, resolveMusicResource: value => value, resetArtistPageColors() {}, navigateTo() {}, setShinyText() {},
  loadArtistPhoto() {}, loadArtistBio() {}, renderArtistSections() {}, addLoadMoreButton() {}, addToQueue() {},
});
vm.runInContext(between('function esc(', '// 格式化歌手名') + between('function directCoverUrl(', '// Keep upstream resource IDs') +
  between('function renderAutocomplete(', 'function hideAutocomplete('), context);
context.autoIndex = -1;
const title = 'Say "Hello" & stay';
const artist = 'Artist" onmouseover="globalThis.injected=1';
context.renderAutocomplete([{ name: title, artist, album: '" album', cover: '/icon.svg' }]);
const firstTag = box.innerHTML.match(/<div[^>]*>/)[0];
const attributes = Object.fromEntries([...firstTag.matchAll(/\s([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
assert.equal(attributes.onmouseover, undefined, 'external names cannot create an event attribute');
const decode = value => value.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
assert.equal(decode(attributes['data-query']), title + ' ' + artist, 'autocomplete selection retains quotes and ampersands');
vm.runInContext(between('function resizeCoverUrl', 'function directCoverUrl(') +
  between('// Keep upstream resource IDs', '// 通过本地服务器搜索') + between('var currentArtistTracks', 'function resetArtistPageColors(') +
  between('async function openArtistPage(', 'function addLoadMoreButton(') + between('async function loadMoreArtistSongs(', 'async function loadArtistPhoto('), context);
const requests = [];
context.fetch = url => new Promise((resolve, reject) => requests.push({ url, resolve, reject }));
const response = (id, hasMore = false, nextOffset = 20) => ({ ok: true, json: async () => ({ songs: [{ id, source: 'embeat', name: id, artist: id }], hasMore, nextOffset }) });
const a = context.openArtistPage('A');
const b = context.openArtistPage('B');
requests[1].resolve(response('B')); await b;
requests[0].resolve(response('A')); await a;
assert.equal(context.currentArtistTracks[0].providerId, 'B', 'latest artist wins when older response arrives last');
const c = context.openArtistPage('C'); const d = context.openArtistPage('D');
requests[3].resolve(response('D', true)); await d;
requests[2].reject(new Error('old failure')); await c;
assert.doesNotMatch(document.getElementById('artistFeaturedList').innerHTML, /加载失败/, 'stale errors cannot replace the latest artist');
const page = context.loadMoreArtistSongs();
const count = requests.length;
await context.loadMoreArtistSongs();
assert.equal(requests.length, count, 'double pagination clicks share one in-flight page');
const e = context.openArtistPage('E');
requests.at(-1).resolve(response('E', true)); await e;
const newPage = context.loadMoreArtistSongs();
assert.equal(requests.length, count + 2, 'new artist can paginate while an old artist page is still pending');
requests.at(-1).resolve(response('E2', false, 40)); await newPage;
requests[count - 1].resolve(response('D2', true, 60)); await page;
assert.deepEqual(Array.from(context.currentArtistTracks, track => track.providerId), ['E', 'E2']);
assert.equal(context.currentArtistOffset, 40, 'old page cannot corrupt the latest offset');
assert.equal(context.currentArtistHasMore, false, 'old page cannot change the latest hasMore');
console.log('Verified external metadata attribute isolation and latest-artist/page concurrency.');
// Render the actual result-card and row metadata with the same hostile strings.
vm.runInContext('var trackMap = new Map();' + between('function createAMCard(', 'function renderScrollRow('), context);
const hostileTrack = { id: 'embeat:safe', title, artist, album: 'Album" onmouseover="bad', cover: '/icon.svg' };
const card = context.createAMCard(hostileTrack);
const assertSafeImageAttributes = html => {
  const tag = html.match(/<img[^>]*>/)[0];
  const attrs = Object.fromEntries([...tag.matchAll(/\s([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
  assert.equal(attrs.onmouseover, undefined);
  assert.equal(decode(attrs['data-name']), title);
  assert.equal(decode(attrs['data-artist']), artist);
};
assertSafeImageAttributes(card);
context.window = { innerWidth: 1200 };
context.isFavorite = () => false;
context.formatTime = () => '';
context.revealContainer = () => {};
context.updateQueueHighlight = () => {};
box.classList = { contains: () => false };
vm.runInContext(between('function renderTrackList(', '// All song rows share'), context);
context.renderTrackList(box, [hostileTrack]);
assertSafeImageAttributes(box.innerHTML);
// Metadata started by an older artist also cannot repaint the current hero.
vm.runInContext(between('async function loadArtistPhoto(', '// 显示歌曲选项菜单'), context);
let finishPhoto;
context.fetch = () => new Promise(resolve => { finishPhoto = resolve; });
const photoGeneration = context.currentArtistGeneration;
const photo = context.loadArtistPhoto('old', [], photoGeneration);
context.currentArtistGeneration++;
const avatar = document.getElementById('artistAvatar');
avatar.src = 'current-avatar';
finishPhoto({ ok: true, json: async () => ({ avatar: 'old-avatar' }) });
await photo;
assert.equal(avatar.src, 'current-avatar');
let finishBio;
let bioRequests = 0;
context.fetch = () => { bioRequests++; return new Promise(resolve => { finishBio = resolve; }); };
const bio = context.loadArtistBio('old', [], context.currentArtistGeneration);
context.currentArtistGeneration++;
document.getElementById('artistBioSummary').textContent = 'Current biography';
finishBio({ ok: true, json: async () => ({ desc: 'Old artist biography that must not render' }) });
await bio;
assert.equal(document.getElementById('artistBioSummary').textContent, 'Current biography');
assert.equal(bioRequests, 1, 'stale artist biography does not start another metadata fetch');
console.log('Verified card/list metadata and stale artist photo/biography isolation.');
