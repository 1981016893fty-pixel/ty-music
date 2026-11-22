import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const source = await fs.readFile(new URL('../player.js', import.meta.url), 'utf8');
const resizeStart = source.indexOf('function resizeCoverUrl');
const normalizeEnd = source.indexOf('// 通过本地服务器搜索');
const recentStart = source.indexOf('function trackFromRecentEntry');
const favoriteStart = source.indexOf('function toggleFavorite');
if (resizeStart < 0 || normalizeEnd < 0 || recentStart < 0 || favoriteStart < 0) {
  throw new Error('Player data helpers are missing');
}

const context = {
  URL,
  encodeURIComponent,
  String,
  window: {
    __TY_MUSIC_API_BASE__: 'https://api.example.test',
    location: { href: 'https://app.example.test/' },
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
  ${source.slice(resizeStart, normalizeEnd)}
  ${source.slice(recentStart, favoriteStart)}
  this.coverUrlForTrack = coverUrlForTrack;
  this.trackFromRecentEntry = trackFromRecentEntry;
`, context);

const cover = '/api/cover?size=1000&url=https%3A%2F%2Fp2.music.126.net%2Fcover.jpg';
const normalized = context.coverUrlForTrack({ cover }, 300, 'netease');
assert.equal(new URL(normalized).origin, 'https://api.example.test');
assert.equal(new URL(normalized).pathname, '/api/cover');
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

// Real seek controllers must work when the ESM slider mounts after player.js.
for (const fullscreen of [false, true]) {
  const handlers = new Map();
  const documentHandlers = new Map();
  const fill = { style: {} };
  let mounted = false;
  const host = fullscreen ? '#ampProgressBar' : '#progressBar';
  const bar = {
    classList: { add() {}, remove() {} },
    getBoundingClientRect: () => ({ left: 0, width: 100 }),
    addEventListener: (name, handler) => handlers.set(name, handler),
  };
  const audio = { duration: 100, currentTime: 0, addEventListener() {}, removeEventListener() {} };
  const seekContext = {
    document: {
      querySelector: selector => selector === host ? bar : selector.endsWith('.slider-range') ? mounted ? fill : null : { textContent: '' },
      addEventListener: (name, handler) => documentHandlers.set(name, handler),
    },
    audio, formatTime: String, setTimeout() {},
  };
  vm.createContext(seekContext);
  const start = source.indexOf(fullscreen ? "  const progressBar = $('#ampProgressBar');" : '// Progress bar —');
  const end = source.indexOf(fullscreen ? '  // 点击播放器栏打开全屏播放器' : '// ========== Volume ==========', start);
  assert.ok(start >= 0 && end > start);
  vm.runInContext(`${source.slice(source.indexOf('const $ ='), source.indexOf('function resolveMusicResource'))}\nlet _progressBarDragging = false;\n${source.slice(start, end)}`, seekContext);
  mounted = true;
  handlers.get('mousedown')({ clientX: 25, preventDefault() {} });
  documentHandlers.get('mousemove')({ clientX: 75, preventDefault() {} });
  assert.equal(fill.style.width, '75%', `${host} previews the drag after a late UI mount`);
  documentHandlers.get('mouseup')({ clientX: 75 });
  assert.equal(audio.currentTime, 75);
}
console.log('Verified mini and fullscreen seeking with sliders mounted after the player.');
