import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('../player.js', import.meta.url), 'utf8');
const resizeStart = source.indexOf('function resizeCoverUrl');
const normalizeStart = source.indexOf('// 标准化歌曲对象（新音源）');
const recentStart = source.indexOf('function trackFromRecentEntry');
const favoriteStart = source.indexOf('function toggleFavorite');
if (resizeStart < 0 || normalizeStart < 0 || recentStart < 0 || favoriteStart < 0) {
  throw new Error('Player data helpers are missing');
}

const context = {
  URL,
  encodeURIComponent,
  String,
  window: {
    __TY_MUSIC_API_BASE__: 'https://ty-music.onrender.com',
    location: { href: 'https://ty-music.onrender.com/' },
  },
  state: { trackCache: new Map() },
};
vm.createContext(context);
vm.runInContext(`
  function resolveMusicResource(value) {
    if (typeof value !== 'string' || !value.startsWith('/api/')) return value || '';
    const base = window.__TY_MUSIC_API_BASE__ || '';
    return base ? base + value : value;
  }
  ${source.slice(resizeStart, normalizeStart)}
  ${source.slice(recentStart, favoriteStart)}
  this.coverUrlForTrack = coverUrlForTrack;
  this.trackFromRecentEntry = trackFromRecentEntry;
`, context);

const cover = '/api/cover?size=1000&url=https%3A%2F%2Fp2.music.126.net%2Fcover.jpg';
const normalized = context.coverUrlForTrack({ cover }, 300, 'netease');
assert.match(normalized, /^https:\/\/ty-music\.onrender\.com\/api\/cover\?/);
assert.match(normalized, /[?&]size=300(?:&|$)/);
assert.doesNotMatch(normalized, /size=1000/);

const recent = context.trackFromRecentEntry({
  id: 123,
  title: 'Test track',
  artist: 'Test artist',
  album: 'Test album',
  cover,
});
assert.equal(recent.id, '123');
assert.equal(recent.coverSmall, normalized);
assert.match(recent.cover, /size=1000/);

assert.match(source, /if \(window\.__TY_MUSIC_DESKTOP__\) proxyPath \+= '&stream=1';/);
console.log('Verified desktop stream routing and recent-play cover normalization.');
