/* ============================================
   TY Music — 全网音乐播放器
   ============================================ */

// ========== Shortcuts ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const sliderRangeFor = host => document.querySelector(`${host} .slider-range`);
const setSliderValue = (host, percentage) => {
  const range = sliderRangeFor(host);
  if (range) range.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
};

function resolveMusicResource(value) {
  if (typeof value !== 'string' || !value.startsWith('/api/')) return value || '';
  const base = window.__TY_MUSIC_API_BASE__ || '';
  return base ? base + value : value;
}

// Native macOS media bridge. It is intentionally a no-op in the browser, so
// the web player keeps the exact same playback path outside the Tauri shell.
const nativeMediaInvoke = (...args) => {
  const invoke = window.__TAURI__?.core?.invoke;
  return typeof invoke === 'function' ? invoke(...args).catch(() => {}) : Promise.resolve();
};
const nativeArtworkCache = new Map();
let nativeSyncTimer = 0;
function artworkAsBase64(source) {
  const resolved = resolveMusicResource(source);
  if (!resolved) return Promise.resolve(null);
  if (nativeArtworkCache.has(resolved)) return Promise.resolve(nativeArtworkCache.get(resolved));
  return fetch(resolved).then(response => response.ok ? response.blob() : null).then(blob => {
    if (!blob) return null;
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const value = typeof reader.result === 'string' ? reader.result.split(',')[1] : null;
        if (value) nativeArtworkCache.set(resolved, value);
        resolve(value);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  }).catch(() => null);
}
function syncNativeNowPlaying(options = {}) {
  if (!window.__TY_MUSIC_DESKTOP__ || !state?.currentTrack) return;
  const track = state.currentTrack;
  const send = artwork_data => nativeMediaInvoke('now_playing_update', {
    payload: {
      title: track.title || 'TY Music', artist: track.artist || null,
      album: track.album || null, duration: Number.isFinite(audio?.duration) && audio.duration > 0 ? audio.duration : (track.duration || null),
      position: Number.isFinite(audio?.currentTime) ? audio.currentTime : 0,
      isPlaying: Boolean(state.isPlaying), artworkData: artwork_data || null
    }
  });
  if (options.artwork) artworkAsBase64(track.coverSmall || track.cover || '').then(send);
  else send(null);
}
function scheduleNativePositionSync() {
  if (!window.__TY_MUSIC_DESKTOP__ || nativeSyncTimer) return;
  nativeSyncTimer = window.setTimeout(() => { nativeSyncTimer = 0; syncNativeNowPlaying(); }, 500);
}

// Keep API results alive for the lifetime of the tab. Navigation only swaps
// views, so returning to a page should reuse the already-rendered catalog
// instead of waking the server and upstream source again.
const apiMemoryCache = new Map();
const apiInflight = new Map();
const rawFetch = window.fetch.bind(window);
const desktopCacheEnabled = Boolean(window.__TY_MUSIC_DESKTOP__);
const desktopCachePrefix = 'ty-music-api-cache:';
function readDesktopApiCache(key) {
  if (!desktopCacheEnabled) return null;
  try {
    const raw = localStorage.getItem(desktopCachePrefix + key);
    if (!raw) return null;
    const item = JSON.parse(raw);
    if (!item || item.expires <= Date.now()) {
      localStorage.removeItem(desktopCachePrefix + key);
      return null;
    }
    return item;
  } catch (_) { return null; }
}
function writeDesktopApiCache(key, item) {
  if (!desktopCacheEnabled || item.body.length > 700000) return;
  try { localStorage.setItem(desktopCachePrefix + key, JSON.stringify(item)); } catch (_) {}
}
window.fetch = function cachedApiFetch(input, init) {
  let request = input instanceof Request ? input : new Request(input, init);
  const apiBase = window.__TY_MUSIC_API_BASE__ || '';
  const originalUrl = new URL(request.url, window.location.href);
  if (apiBase && originalUrl.pathname.startsWith('/api/')) {
    const rewrittenUrl = new URL(originalUrl.pathname + originalUrl.search, apiBase).href;
    request = new Request(rewrittenUrl, request);
  }
  const url = new URL(request.url, window.location.href);
  const method = (request.method || 'GET').toUpperCase();
  const apiOrigin = apiBase ? new URL(apiBase).origin : window.location.origin;
  const cacheable = method === 'GET' && (url.origin === window.location.origin || url.origin === apiOrigin) &&
    url.pathname.startsWith('/api/') &&
    !/(?:\/proxy|\/play|\/download|\/music\/url|\/lyric|search-lyric)$/.test(url.pathname);
  if (!cacheable) return rawFetch(request);

  const key = url.href;
  const now = Date.now();
  const hit = apiMemoryCache.get(key);
  if (hit && hit.expires > now) {
    return Promise.resolve(new Response(hit.body, {
      status: hit.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-TY-Cache': 'memory' }
    }));
  }
  const persisted = readDesktopApiCache(key);
  if (persisted) {
    apiMemoryCache.set(key, persisted);
    return Promise.resolve(new Response(persisted.body, {
      status: persisted.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-TY-Cache': 'disk' }
    }));
  }
  if (apiInflight.has(key)) return apiInflight.get(key).then(result => new Response(result.body, {
    status: result.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-TY-Cache': 'inflight' }
  }));

  const promise = rawFetch(request).then(async response => {
    const body = await response.text();
    if (response.ok) {
      const cached = { body, status: response.status, expires: now + (desktopCacheEnabled ? 30 * 60 * 1000 : 5 * 60 * 1000) };
      apiMemoryCache.set(key, cached);
      writeDesktopApiCache(key, cached);
    }
    return { body, status: response.status };
  }).finally(() => apiInflight.delete(key));
  apiInflight.set(key, promise);
  return promise.then(result => new Response(result.body, {
    status: result.status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  }));
};

// ========== Singleton audio ==========
const audio = $('#audioPlayer');

// ========== State ==========
const state = {
  currentPage: 'discover',
  currentTrack: null,
  heroTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  isShuffled: false,
  repeatMode: 0,
  volume: 0.7,
  isMuted: false,
  favorites: new Set(),
  playlists: [],
  currentPlaylistId: null,
  shuffledQueue: [],
  recentPlays: [],
  _discoverLoaded: false,
  currentSource: 'netease',
  // Dynamic lyrics
  lyrics: { lines: [], activeIndex: -1, expanded: false },
  // Album favorites
  albumFavorites: new Set(),
  // 歌曲数据缓存（ID → 完整 track 对象），用于跨会话持久化
  trackCache: new Map(),
  // 导航历史栈
  navHistory: [],
};

// ========== Local Storage ==========
function loadData() {
  console.log('[Storage] Loading data from localStorage...');
  
  // 每条数据独立加载，一条损坏不影响其他
  try {
    const favs = localStorage.getItem('melodybox_fav');
    if (favs) {
      const parsed = JSON.parse(favs);
      // 清理可能损坏的数据（如 undefined 条目）
      const cleaned = (Array.isArray(parsed) ? parsed : []).filter(function(id) { return id != null && id !== undefined; });
      state.favorites = new Set(cleaned);
      if (cleaned.length !== (Array.isArray(parsed) ? parsed.length : 0)) {
        console.warn('[Storage] Removed corrupted favorites entries, cleaning up...');
        // 写回清理后的数据
        try { localStorage.setItem('melodybox_fav', JSON.stringify(cleaned)); } catch(e) {}
      }
      console.log('[Storage] Favorites loaded:', state.favorites.size, 'items');
    }
  } catch (e) {
    console.error('[Storage] Failed to load favorites:', e);
    state.favorites = new Set();
  }
  
  try {
    const pls = localStorage.getItem('melodybox_pl');
    if (pls) {
      const parsed = JSON.parse(pls);
      state.playlists = Array.isArray(parsed) ? parsed : [];
      // 迁移旧格式：playlist.songs → playlist.tracks
      var migrated = false;
      state.playlists.forEach(function(pl) {
        if (pl.songs && !pl.tracks) {
          pl.tracks = pl.songs;
          delete pl.songs;
          migrated = true;
        }
        if (!pl.tracks) pl.tracks = [];
      });
      if (migrated) {
        console.log('[Storage] Migrated old playlist format');
        try { localStorage.setItem('melodybox_pl', JSON.stringify(state.playlists)); } catch(e) {}
      }
      console.log('[Storage] Playlists loaded:', state.playlists.length, 'items');
    }
  } catch (e) {
    console.error('[Storage] Failed to load playlists:', e);
    state.playlists = [];
  }
  
  try {
    const rec = localStorage.getItem('melodybox_rec');
    if (rec) {
      const parsed = JSON.parse(rec);
      state.recentPlays = Array.isArray(parsed) ? parsed : [];
      console.log('[Storage] Recent plays loaded:', state.recentPlays.length, 'items');
    }
  } catch (e) {
    console.error('[Storage] Failed to load recent plays:', e);
    state.recentPlays = [];
  }
  
  try {
    const albumFavs = localStorage.getItem('melodybox_album_fav');
    if (albumFavs) {
      const parsed = JSON.parse(albumFavs);
      state.albumFavorites = new Set(Array.isArray(parsed) ? parsed : []);
      console.log('[Storage] Album favorites loaded:', state.albumFavorites.size, 'items');
    }
  } catch (e) {
    console.error('[Storage] Failed to load album favorites:', e);
    state.albumFavorites = new Set();
  }
  
  // 加载歌曲数据缓存（用于跨会话恢复歌曲信息）
  try {
    const tc = localStorage.getItem('melodybox_tracks');
    if (tc) {
      const parsed = JSON.parse(tc);
      state.trackCache = new Map(Object.entries(parsed));
      console.log('[Storage] Track cache loaded:', state.trackCache.size, 'tracks');
    }
  } catch (e) {
    console.error('[Storage] Failed to load track cache:', e);
    state.trackCache = new Map();
  }

  // 数据完整性检查：favorites 有 ID 但 trackCache 为空 → 尝试从 recentPlays 恢复
  if (state.favorites.size > 0 && state.trackCache.size === 0 && state.recentPlays.length > 0) {
    console.warn('[Storage] Favorites exist but track cache is empty, attempting recovery from recent plays...');
    state.recentPlays.forEach(function(rp) {
      if (state.favorites.has(rp.id)) {
        state.trackCache.set(rp.id, {
          id: rp.id, title: rp.title, artist: rp.artist,
          album: '', cover: rp.cover || '', coverSmall: rp.cover || '',
          picId: '', duration: 0, source: rp.source || '',
          _gdSource: true,
        });
      }
    });
    if (state.trackCache.size > 0) {
      console.log('[Storage] Recovered', state.trackCache.size, 'tracks from recent plays');
      // 立即写回 localStorage
      try {
        var recoveredObj = Object.fromEntries(state.trackCache);
        localStorage.setItem('melodybox_tracks', JSON.stringify(recoveredObj));
      } catch(e) {}
    }
  }

  // 打印完整数据状态
  console.log('[Storage] === Data Load Summary ===');
  console.log('[Storage]   Favorites:', state.favorites.size, 'items');
  console.log('[Storage]   TrackCache:', state.trackCache.size, 'tracks');
  console.log('[Storage]   Playlists:', state.playlists.length, 'items');
  console.log('[Storage]   RecentPlays:', state.recentPlays.length, 'items');
  console.log('[Storage]   AlbumFavorites:', state.albumFavorites.size, 'items');
}

function saveAll() {
  var errors = [];

  // 每条数据独立保存——一条失败不影响其他
  try {
    localStorage.setItem('melodybox_fav', JSON.stringify([...state.favorites]));
  } catch(e) { errors.push('favorites:' + e.message); }

  try {
    localStorage.setItem('melodybox_pl', JSON.stringify(state.playlists));
  } catch(e) { errors.push('playlists:' + e.message); }

  try {
    localStorage.setItem('melodybox_rec', JSON.stringify(state.recentPlays.slice(0, 20)));
  } catch(e) { errors.push('recents:' + e.message); }

  try {
    localStorage.setItem('melodybox_album_fav', JSON.stringify([...state.albumFavorites]));
  } catch(e) { errors.push('albumFavs:' + e.message); }

  // 保存歌曲数据缓存（持久化歌曲标题、歌手、封面等信息）
  // 限制最大 500 首，防止超出 localStorage 5MB 限额
  try {
    var cacheObj = Object.fromEntries(state.trackCache);
    var keys = Object.keys(cacheObj);
    if (keys.length > 500) {
      var trimmed = {};
      keys.slice(-500).forEach(function(k) { trimmed[k] = cacheObj[k]; });
      cacheObj = trimmed;
    }
    localStorage.setItem('melodybox_tracks', JSON.stringify(cacheObj));
  } catch(e) {
    errors.push('tracks:' + e.message);
    // localStorage 可能满了
    if (e.name === 'QuotaExceededError') {
      showToast('存储空间不足，请清理部分数据');
    }
  }

  if (errors.length) {
    console.error('[Storage] Save errors:', errors.join(', '));
  } else {
    console.log('[Storage] Data saved successfully (favs:', state.favorites.size, 'tracks:', state.trackCache.size, ')');
  }
}

loadData();

// ========== Welcome screen ==========
const WELCOME_SEEN_KEY = 'ty-music-welcome-seen';
const WELCOME_COOLDOWN_MS = 24 * 60 * 60 * 1000;
function syncWelcomeScreen() {
  const screen = document.getElementById('welcomeScreen');
  if (!screen) return;
  let seenAt = 0;
  try { seenAt = Number(localStorage.getItem(WELCOME_SEEN_KEY) || 0); } catch (e) {}
  const navigation = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = navigation?.type === 'reload' || (performance.navigation && performance.navigation.type === 1);
  // A deliberate refresh is a preview gesture: show the welcome page again.
  // Normal reopen/navigation stays quiet during the cooldown window.
  const seen = !isReload && Number.isFinite(seenAt) && seenAt > 0 && Date.now() - seenAt < WELCOME_COOLDOWN_MS;
  if (seen) screen.classList.add('is-dismissed');

  const features = document.getElementById('welcomeFeatures');
  if (features) features.setAttribute('aria-hidden', 'true');
}

window.toggleWelcomeFeatures = function toggleWelcomeFeatures() {
  const features = document.getElementById('welcomeFeatures');
  const button = document.querySelector('#welcomeLearnMoreMount .specular-button');
  if (!features) return;
  const open = features.classList.toggle('is-open');
  features.setAttribute('aria-hidden', String(!open));
  if (button) button.setAttribute('aria-expanded', String(open));
};

window.enterMusicApp = function enterMusicApp() {
  const screen = document.getElementById('welcomeScreen');
  try { localStorage.setItem(WELCOME_SEEN_KEY, String(Date.now())); } catch (e) {}
  if (!screen) return;
  screen.classList.add('is-dismissed');
  window.setTimeout(() => screen.remove(), 620);
};

syncWelcomeScreen();

// ========== API 搜索 ==========

// ========== Search ==========
const SOURCE_LABELS = {
  netease: '全网搜索',
  'netease-hot': '热门排行榜',
  'netease-new': '新歌速递',
};

let browseResultTitleOverride = '';

// 标准化歌曲对象（新音源）
function normalizeTrack(song) {
  var src = song.source || 'netease';
  var pid = song.picId || song.pic_id || '';
  var albumId = song.albumId || song.album_id || '';
  var coverUrl = song.cover || '';
  var coverSmallUrl = song.coverSmall || song.cover || '';

  // 无直接封面URL时，通过picId构建代理URL
  if (!coverUrl && pid) {
    coverUrl = '/api/music/cover?picId=' + encodeURIComponent(pid) + '&source=' + src + '&size=1000';
  }
  if (!coverSmallUrl && pid) {
    coverSmallUrl = '/api/music/cover?picId=' + encodeURIComponent(pid) + '&source=' + src + '&size=300';
  }

  return {
    id: String(song.id || ''),
    title: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover: resolveMusicResource(coverUrl || song.cover || (pid ? '/api/music/cover?picId=' + encodeURIComponent(pid) + '&source=' + src + '&size=1000' : '')),
    coverSmall: resolveMusicResource(coverSmallUrl || song.coverSmall || ''),
    picId: pid,
    albumId: String(albumId || ''),
    duration: song.duration || 0,
    source: src,
  };
}

// 通过本地服务器搜索
async function searchLocal(keywords, limit) {
  limit = limit || 80;
  var ctrl = new AbortController();
  var timer = setTimeout(function() { ctrl.abort(); }, 30000);
  try {
    var url = '/api/search?keywords=' + encodeURIComponent(keywords) + '&limit=' + limit;
    var res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    var data = await res.json();
    if (!data.songs || !data.songs.length) return [];
    return data.songs.map(function(s) { return normalizeTrack(s); });
  } catch (e) {
    console.warn('[Search] Failed for "' + keywords + '":', e.message);
    return [];
  }
}

// 获取热门推荐（通过 /api/discover/hot）
async function fetchHotSongs(limit) {
  limit = limit || 80;
  var ctrl = new AbortController();
  var timer = setTimeout(function() { ctrl.abort(); }, 30000);
  try {
    var res = await fetch('/api/discover/hot?limit=' + limit, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    var data = await res.json();
    if (!data.songs || !data.songs.length) return [];
    return data.songs.map(function(s) { return normalizeTrack(s); });
  } catch (e) {
    console.warn('[Hot] Failed:', e.message);
    return [];
  }
}

// 获取抖音热歌
async function fetchDouyinSongs(limit) {
  return searchNetease('热门歌曲', limit);
}

// 获取新曲
async function fetchNewSongs(limit) {
  return fetchNeteaseHot(limit);
}

// 获取推荐歌单
async function fetchPlaylistSongs(limit) {
  return searchNetease('经典老歌', limit);
}

// 新音源搜索（通过 GD Studio API）
async function searchNetease(keywords, limit) {
  limit = limit || 80;
  var ctrl = new AbortController();
  var timer = setTimeout(function() { ctrl.abort(); }, 2500);
  try {
    var url = '/api/music/search?keywords=' + encodeURIComponent(keywords) + '&source=netease&limit=' + limit;
    console.log('[Search] fetching:', url);
    var res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (!data.songs || !data.songs.length) {
      console.warn('[Search] No results for "' + keywords + '"');
      return [];
    }
    console.log('[Search] Got', data.songs.length, 'tracks for "' + keywords + '"');
    return data.songs.map(function(s) { return normalizeNeteaseTrack(s); });
  } catch (e) {
    console.error('[Search] Failed for "' + keywords + '":', e.message);
    throw e; // 抛出错误，让调用方处理
  }
}

// 新音源热门推荐
async function fetchNeteaseHot(limit) {
  limit = limit || 80;
  var ctrl = new AbortController();
  var timer = setTimeout(function() { ctrl.abort(); }, 2500);
  try {
    var res = await fetch('/api/music/hot?source=netease&limit=' + limit, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    var data = await res.json();
    if (!data.songs || !data.songs.length) return [];
    return data.songs.map(function(s) { return normalizeNeteaseTrack(s); });
  } catch (e) {
    console.warn('[Hot] Failed:', e.message);
    return [];
  }
}

async function fetchFeaturedClassics(limit) {
  const ctrl = new AbortController();
  const timer = setTimeout(function() { ctrl.abort(); }, 5000);
  try {
    const res = await fetch('/api/discover/featured?limit=' + (limit || 1), { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return Array.isArray(data.songs) ? data.songs.map(function(song) { return normalizeNeteaseTrack(song); }) : [];
  } catch (e) {
    clearTimeout(timer);
    console.warn('[Featured] Failed:', e.message);
    throw e;
  }
}

// 新音源新歌
async function fetchNeteaseNew(limit) {
  limit = limit || 80;
  var queries = ['新歌 2026', '新歌推荐', '最新单曲', '新歌首发'];
  var seen = new Set();
  var allTracks = [];
  for (var qi = 0; qi < queries.length; qi++) {
    if (allTracks.length >= limit) break;
    try {
      var qtracks = await searchNetease(queries[qi], qi === 0 ? limit : Math.ceil(limit / 2));
      for (var ti = 0; ti < qtracks.length; ti++) {
        if (allTracks.length >= limit) break;
        if (!seen.has(qtracks[ti].id)) {
          seen.add(qtracks[ti].id);
          allTracks.push(qtracks[ti]);
        }
      }
      if (qi === 0 && allTracks.length >= 30) break;
    } catch(e) { continue; }
  }
  return allTracks;
}

// 标准化新音源歌曲
function normalizeNeteaseTrack(song) {
  // 直接使用后端返回的 cover 和 coverSmall（已包含正确的 albumId）
  // 关键修复：当 coverSmall 为空时，用 cover 填充，确保所有位置都能显示封面
  const cover = song.cover || (song.picId || song.pic_id ? '/api/music/cover?picId=' + encodeURIComponent(song.picId || song.pic_id) + '&source=netease&size=1000' : '');
  const coverSmall = song.coverSmall || cover || '';
  const picId = song.picId || song.pic_id || '';
  return {
    id: String(song.id || ''),
    title: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover: resolveMusicResource(cover),
    coverSmall: resolveMusicResource(coverSmall),
    albumId: song.albumId || song.album_id || '',
    picId: picId,
    duration: song.duration || 0,
    source: 'netease',
  };
}

// 通用搜索
async function universalSearch(query, limit, forceSource) {
  limit = limit || 80;
  var source = forceSource || state.currentSource;
  var results = [];

  if (!forceSource) showToast('正在搜索...');

  switch (source) {
    case 'netease':
      results = await searchNetease(query, limit);
      break;
    case 'netease-hot':
      results = await fetchNeteaseHot(limit);
      break;
    case 'netease-new':
      results = await fetchNeteaseNew(limit);
      break;
    default:
      results = await searchNetease(query, limit);
  }

  if (!results.length) {
    if (!forceSource) showToast('未找到歌曲，请尝试其他关键词');
    return [];
  }
  return results;
}

// ========== Helpers ==========
function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// 格式化歌手名，支持多人合唱显示
function formatArtists(artistStr) {
  if (!artistStr) return '未知歌手';
  // 按常见分隔符拆分
  var parts = artistStr.split(/[,，、&/\/、&]+/).map(function(s){return s.trim();}).filter(Boolean);
  if (parts.length <= 1) return esc(artistStr);
  // 多人协作时显示标签
  return parts.map(function(a){return '<span style="display:inline-block;background:rgba(180,94,255,0.12);color:var(--neon-purple);padding:1px 8px;border-radius:10px;font-size:12px;margin:1px 2px">'+esc(a)+'</span>';}).join('');
}

function formatTime(sec) {
  if (!sec || isNaN(sec) || !isFinite(sec) || sec <= 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function addToQueue(tracks) {
  const ids = new Set(state.queue.map(t => t.id));
  let added = 0;
  tracks.forEach(t => {
    if (!ids.has(t.id)) { state.queue.push(t); ids.add(t.id); added++; }
  });
  return added;
}

// ========== Toast ==========
let toastTimer;
function showToast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

// ========== Dynamic Gradient ==========
function updateDynamicGradient(track) {
  if (!track) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = track.coverSmall || track.cover;
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    // Keep a visible ambient wash even when the selected cover is nearly black.
    const lift = value => Math.max(34, Math.min(255, Math.round(value * 1.12 + 18)));
    const color = `rgba(${lift(r)},${lift(g)},${lift(b)},0.28)`;
    const gradientEl = $('#bgGradient');
    if (gradientEl) {
      gradientEl.style.background = [
        `radial-gradient(ellipse 900px 680px at 50% 24%, ${color} 0%, transparent 70%)`,
        'radial-gradient(ellipse 760px 560px at 18% 76%, rgba(180, 94, 255, 0.16) 0%, transparent 72%)',
        'radial-gradient(ellipse 720px 520px at 84% 54%, rgba(0, 224, 255, 0.11) 0%, transparent 72%)',
        'radial-gradient(ellipse 620px 460px at 46% 92%, rgba(255, 61, 161, 0.10) 0%, transparent 74%)'
      ].join(',');
    }
    const shadowEl = $('#playerCoverShadow');
    if (shadowEl) shadowEl.style.background = `rgba(${r},${g},${b},0.6)`;
    const miniBg = $('#miniArtBg');
    if (miniBg) miniBg.style.background = `rgba(${r},${g},${b},0.8)`;
  };
}

// ========== Navigation ==========
function navigateTo(page) {
  // 关闭专辑详情侧面板
  const albumPanel = document.getElementById('albumDetailPanel');
  if (albumPanel) {
    albumPanel.classList.remove('show');
  }
  
  // 清理 Cover Flow 事件监听与动画
  if (state.currentPage === 'album-favorites' && page !== 'album-favorites') {
    cfStop();
    if (driftWallRefreshTimer) clearTimeout(driftWallRefreshTimer);
    driftWallRefreshTimer = null;
  }
  
  // 压入导航历史栈（同页不重复记录）
  if (state.currentPage !== page) {
    state.navHistory.push(state.currentPage);
  }
  
  state.currentPage = page;
  document.body.classList.toggle('library-gradient-active', page === 'local' || page === 'playlists');
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = $(`#page-${page}`);
  if (pageEl) pageEl.classList.add('active');

  // Detail pages should open at their hero/header rather than inheriting the
  // discover page's previous scroll position.
  const mainContent = document.querySelector('.main-content');
  if (mainContent) mainContent.scrollTop = 0;
  if (typeof window !== 'undefined') window.scrollTo(0, 0);

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  if (page === 'discover') loadDiscover();
  if (page === 'favorites') renderFavorites();
  if (page === 'playlists') renderPlaylists();
  if (page === 'search') setTimeout(() => $('#searchInput')?.focus(), 100);
  if (page === 'local') renderLocalTracks();
  if (page === 'album-favorites') {
    renderAlbumFavorites();
    showAlbumGridView();
    // The sidebar can open the album library directly, before any album detail
    // has been visited. Prime the DriftWall with covers from the live sources.
    loadDriftWallSourceCovers([]);
  }
}

function goBack() {
  if (state.navHistory.length === 0) return;
  const prev = state.navHistory.pop();
  // 跳过当前页检测，直接切回去
  if (state.currentPage === 'album-favorites') cfStop();
  state.currentPage = prev;
  document.body.classList.toggle('library-gradient-active', prev === 'local' || prev === 'playlists');
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = $(`#page-${prev}`);
  if (pageEl) pageEl.classList.add('active');
  const navEl = document.querySelector(`.nav-item[data-page="${prev}"]`);
  if (navEl) navEl.classList.add('active');
  if (prev === 'discover') loadDiscover();
  if (prev === 'favorites') renderFavorites();
  if (prev === 'playlists') renderPlaylists();
  if (prev === 'search') setTimeout(() => $('#searchInput')?.focus(), 100);
  if (prev === 'local') renderLocalTracks();
  if (prev === 'album-favorites') {
    renderAlbumFavorites();
    showAlbumGridView();
    loadDriftWallSourceCovers([]);
  }
}

$$('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// ========== Favorites ==========
function isFavorite(id) { return state.favorites.has(id); }

// 缓存歌曲完整信息到 trackCache（用于跨会话持久化）
function cacheTrack(track) {
  if (!track || !track.id) return;
  state.trackCache.set(track.id, {
    id: track.id,
    title: track.title || '未知歌曲',
    artist: track.artist || '未知歌手',
    album: track.album || '',
    cover: track.cover || track.coverSmall || '',
    coverSmall: track.coverSmall || track.cover || '',
    picId: track.picId || '',
    duration: track.duration || 0,
    source: track.source || 'netease',
  });
}

function toggleFavorite(track) {
  if (!track) return;
  
  // 兼容传入纯 ID 的情况
  if (typeof track === 'string' || typeof track === 'number') {
    console.warn('[Favorites] toggleFavorite received a plain ID, searching queue...');
    var found = state.queue.find(function(t) { return t.id === track; });
    if (found) track = found;
    else {
      showToast('无法收藏：歌曲信息丢失');
      return;
    }
  }
  
  if (state.favorites.has(track.id)) {
    state.favorites.delete(track.id);
    showToast('已取消喜爱');
  } else {
    state.favorites.add(track.id);
    // 缓存完整的歌曲数据到 trackCache，确保刷新后仍可显示
    cacheTrack(track);
    showToast('已添加喜爱');
  }
  saveAll();
  updateLikeUI();
  if (state.currentPage === 'favorites') renderFavorites();
}

function updateLikeUI() {
  const pl = $('#playerLike');
  if (state.currentTrack && isFavorite(state.currentTrack.id)) {
    pl.classList.add('active');
    pl.querySelector('i').className = 'fa-solid fa-heart';
  } else {
    pl.classList.remove('active');
    pl.querySelector('i').className = 'fa-regular fa-heart';
  }
}

$('#playerLike').addEventListener('click', () => {
  if (state.currentTrack) toggleFavorite(state.currentTrack);
});

// ========== 下载歌曲 ==========
$('#playerDownload').addEventListener('click', async () => {
  if (!state.currentTrack || !state.currentTrack.id) {
    showToast('没有可下载的歌曲');
    return;
  }
  const track = state.currentTrack;
  showToast('正在获取下载链接...');
  try {
    const res = await fetch('/api/music/download?id=' + encodeURIComponent(track.id) + '&title=' + encodeURIComponent(track.title + ' - ' + track.artist));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data.url) throw new Error('未获取到下载链接');

    // 创建隐藏的 a 标签触发下载
    const a = document.createElement('a');
    a.href = data.url;
    a.download = data.filename || (track.title + '.mp3');
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('开始下载: ' + track.title);
  } catch (e) {
    console.error('[Download] Error:', e);
    showToast('下载失败，请稍后重试');
  }
});

// ========== Playback ==========

// 获取歌曲的专辑信息并更新UI
async function fetchAndDisplayAlbumInfo(track) {
  if (!track) return;
  
  // 调试信息
  console.log('[Album] fetchAndDisplayAlbumInfo called', track);
  
  // 如果歌曲已经有专辑ID，直接使用
  if (track.albumId) {
    console.log('[Album] Using existing albumId:', track.albumId);
    displayAlbumInfo(track.albumId, track.album);
    return;
  }
  
  // 直接显示已有专辑信息
  displayAlbumInfo(track.albumId, track.album);
  return;
}

// 显示专辑信息到UI
function displayAlbumInfo(albumId, albumName) {
  // 已由 playTrack 直接处理，此函数保留为空以兼容旧调用
}

function playTrack(track, index, skipRecentUpdate) {
  if (!track) return;
  if (index !== undefined) state.queueIndex = index;
  else if (state.queueIndex < 0) state.queueIndex = state.queue.indexOf(track);

  // 当前播放项始终要切换；skipRecentUpdate 只控制是否写入最近播放记录。
  state.currentTrack = track;
  
  // 只有 skipRecentUpdate 为 true 时（切歌），才跳过 recentPlays 更新
  if (!skipRecentUpdate) {
  
  // 调试：显示即将播放的歌曲
  console.log('[PlayTrack] Playing:', track.title, 'by', track.artist, 'album:', track.album);
  
  // 关键：在用户手势最前端初始化 AudioContext，确保 resume() 在手势中生效
  // 缓存歌曲数据到 trackCache 并立即持久化（不等异步回调）
  cacheTrack(track);

  // Record recent play，最多 30 首，超出清空
  if (state.recentPlays.length >= 30) state.recentPlays = [];
  state.recentPlays = state.recentPlays.filter(r => r.id !== track.id);
  state.recentPlays.unshift({
    id: track.id, title: track.title, artist: track.artist,
    album: track.album || '',
    cover: track.cover || track.coverSmall || '', source: track.source,
    picId: track.picId || '',
    previewUrl: track.previewUrl,
  });

  // 【关键修复】立即同步保存，不依赖异步回调。防止页面关闭时数据丢失
  saveAll();

  // 实时刷新最近播放列表 UI（如果当前在主页，立刻能看到新歌加到顶部）
  refreshRecentTracksUI();
  } // end if (!skipRecentUpdate)

  // Update UI
  const coverSrc = track.coverSmall || track.cover || '';
  const playerCoverImg = $('#playerCover');
  playerCoverImg.dataset.artist = track.artist || '';
  playerCoverImg.dataset.album = track.album || '';
  playerCoverImg.dataset.name = track.title || '';
  if (coverSrc) {
    playerCoverImg.src = coverSrc;
    playerCoverImg.onerror = function() { fallbackCover(this); };
  } else {
    // 封面为空，立即触发 fallback
    playerCoverImg.src = '';
    fallbackCover(playerCoverImg);
  }
  $('#playerTitle').textContent = track.title;
  $('#playerArtist').textContent = track.artist;
  window.dispatchEvent(new CustomEvent('ty:trackchange', { detail: track }));
  // 全屏播放器订阅同一事件，确保浏览器端自动切歌也立即刷新标题、歌手和封面。
  if (ampIsShowing) updateAmpFullscreenPlayer();
  syncNativeNowPlaying({ artwork: true });
  // 时长：先显示已有值，等音频加载后再从 audio.duration 更新
  $('#durationTime').textContent = track.duration > 0 ? formatTime(track.duration) : '0:00';
  document.title = `${track.title} - ${track.artist} | TY Music`;
  $('#playerPreviewBadge').style.display = 'none';

  // Mini player
  const mini = $('#nowPlayingMini');
  mini.style.display = 'flex';
  const miniCoverImg = $('#miniCover');
  miniCoverImg.dataset.artist = track.artist || '';
  miniCoverImg.dataset.album = track.album || '';
  miniCoverImg.dataset.name = track.title || '';
  if (coverSrc) {
    miniCoverImg.src = coverSrc;
    miniCoverImg.onerror = function() { fallbackCover(this); };
  } else {
    miniCoverImg.src = '';
    fallbackCover(miniCoverImg);
  }
  $('#miniTitle').textContent = track.title;
  $('#miniArtist').textContent = track.artist;
  // 专辑名称（强制显示）
  try {
    var albumText = track.album || track.title || '未知专辑';
    var picId = track.picId || track.albumId || ''; // 优先使用 picId（100% 准确）
    var albumId = track.albumId || '';
    var songId = track.id || ''; // 歌曲ID（用来获取 picId）
    
    // 迷你播放器
    var miniAlbumEl = $('#miniAlbum');
    if (miniAlbumEl) {
      miniAlbumEl.style.display = 'block';
      miniAlbumEl.textContent = '专辑: ' + albumText;
      miniAlbumEl.style.cursor = 'pointer';
      miniAlbumEl.title = '点击打开专辑';
      miniAlbumEl.onclick = function() {
        // 优先使用 picId，没有的话用 songId 让后端自动获取
        openAlbumByPicId(picId, songId, albumText, track.artist, 'netease', albumId);
      };
    }
    // 全屏播放器
    var ampAlbumEl = document.getElementById('ampAlbum');
    if (ampAlbumEl) {
      ampAlbumEl.style.display = 'block';
      ampAlbumEl.textContent = '专辑: ' + albumText;
      ampAlbumEl.style.cursor = 'pointer';
      ampAlbumEl.title = '点击查看专辑详情';
      ampAlbumEl.onclick = function() {
        closeAmpFullscreenPlayer();
        setTimeout(function() {
          // 优先使用 picId，没有的话用 songId 让后端自动获取
          openAlbumByPicId(picId, songId, albumText, track.artist, 'netease', albumId);
        }, 400);
      };
    }
 } catch(e) { console.warn('Album display error:', e); }

  // 获取并显示专辑信息
  fetchAndDisplayAlbumInfo(track);

  updateDynamicGradient(track);

  // Reset progress
  setSliderValue('#progressBar', 0);
  $('#currentTime').textContent = '0:00';

  if (!track.previewUrl && !track.id) {
    showToast('暂无可用音源');
    return;
  }

  // 通过代理播放（服务器中转，绕过 CDN 防盗链）
  if (track.id && (track.source === 'netease' || track.picId || !track.previewUrl)) {
    var proxyUrl = '/api/music/proxy?id=' + encodeURIComponent(track.id);
    console.log('[Play] Using proxy URL for', track.title);
    audio.src = proxyUrl;
    audio.load();
    showToast('正在加载音频...');
    audio.play().then(function() {
      state.isPlaying = true;
      updatePlayBtn();
      var toast = document.querySelector('.toast');
      if (toast) toast.classList.remove('show');
    }).catch(function(e) {
      console.warn('[Play] Proxy play failed:', e.message);
      showToast('播放失败，请换一首试试');
    }).finally(function() {
      updateLikeUI();
      updatePlayBtn();
      updateQueueHighlight();
      if (ampIsShowing) updateAmpFullscreenPlayer();
      state.lyrics = { lines: [], activeIndex: -1, expanded: false };
    });
    return;
  }

  // fallback
  if (track.previewUrl) {
    audio.src = track.previewUrl;
    audio.load();
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayBtn();
    }).catch((e) => {
      console.warn('Play failed:', e.message);
      showToast('播放失败，请换一首试试');
    });
  }

  updateLikeUI();
  updatePlayBtn();
  updateQueueHighlight();

  // 如果全屏播放器正在显示，同步更新
  if (ampIsShowing) {
    updateAmpFullscreenPlayer();
  }

  // Auto-load lyrics if panel is open
  state.lyrics = { lines: [], activeIndex: -1, expanded: false };
  
  // 如果正在显示专辑详情页，更新专辑列表的"正在播放"指示器
  const albumPanel = document.getElementById('albumDetailPanel');
  if (albumPanel && albumPanel.classList.contains('show') && currentAlbumTracks.length > 0) {
    console.log('[PlayTrack] Updating album tracks playing indicator');
    renderAlbumTracks(currentAlbumTracks);
  }
}

// ========== Play/Pause ==========
function updatePlayBtn() {
  const icon = $('#playBtn').querySelector('i');
  const miniIcon = $('#miniPlayBtn').querySelector('i');
  const cls = state.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  icon.className = cls;
  miniIcon.className = cls;
  scheduleNativePositionSync();
}

function updateQueueHighlight() {
  $$('.track-row.playing').forEach(r => r.classList.remove('playing'));
  if (state.currentTrack) {
    $$(`.track-row[data-track-id="${state.currentTrack.id}"]`).forEach(r => r.classList.add('playing'));
  }
  if (window.mountGlassSurfaces) window.mountGlassSurfaces();
}

function togglePlay() {
  if (!state.currentTrack) return;
  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    updatePlayBtn();
  } else {
    audio.play().then(() => {
      state.isPlaying = true;
      updatePlayBtn();
    }).catch(() => showToast('播放失败'));
  }
}

$('#playBtn').addEventListener('click', togglePlay);
$('#miniPlayBtn').addEventListener('click', togglePlay);
$('#nativeMiniBtn')?.addEventListener('click', () => {
  if (!window.__TY_MUSIC_DESKTOP__) return;
  nativeMediaInvoke('toggle_native_mini');
});

// HTML5 audio events
audio.addEventListener('play', () => {
  state.isPlaying = true;
  updatePlayBtn();
  syncNativeNowPlaying();
  // AudioContext 已在 togglePlay 用户手势中初始化，这里只管全屏可视化
  if (ampIsShowing) updateAmpPlayBtn();
});

audio.addEventListener('pause', () => { state.isPlaying = false; updatePlayBtn(); syncNativeNowPlaying(); if (ampIsShowing) updateAmpPlayBtn(); });
audio.addEventListener('ended', () => {
  if (state.repeatMode === 2) { audio.currentTime = 0; audio.play(); }
  else playNext();
});

// Audio progress
let _progressBarDragging = false; // 拖拽进度条时阻止 timeupdate 覆盖 UI
audio.addEventListener('timeupdate', () => {
  const d = audio.duration || 0;
  // 保护：duration 为 Infinity 或 NaN 时跳过
  if (!isFinite(d) || d <= 0) return;
  // 保护：currentTime 为 NaN 时跳过
  if (!isFinite(audio.currentTime)) return;
  // 动态更新总时长（防止 loadedmetadata 未触发时时长一直为 0:00）
  if (state.currentTrack && state.currentTrack.duration !== d) {
    state.currentTrack.duration = d;
    $('#durationTime').textContent = formatTime(d);
  }
  // 拖拽期间不写进度条 UI（避免与拖拽位置互相打架）
  if (!_progressBarDragging) {
    const pct = Math.min(100, Math.max(0, (audio.currentTime / d) * 100));
    setSliderValue('#progressBar', pct);
  }
  $('#currentTime').textContent = formatTime(audio.currentTime);
  scheduleNativePositionSync();

  // Sync dynamic lyrics
  syncLyrics();
  
  // 更新全屏播放器进度条和歌词高亮
  if (ampIsShowing) {
    updateAmpProgress();
    updateAmpLyricsHighlight();
  }
});

// Duration detection
audio.addEventListener('loadedmetadata', () => {
  if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
    $('#durationTime').textContent = formatTime(audio.duration);
    state.currentTrack.duration = audio.duration;
  }
});

// Error handling — auto skip on playback failure
let playTimeout = null;
audio.addEventListener('error', () => {
  if (!state.currentTrack) return;
  const err = audio.error;
  console.warn('Audio error:', err?.code, err?.message, 'track:', state.currentTrack.title);
  if (state.queue.length > 1) {
    showToast('播放失败，自动切换下一首');
    setTimeout(() => playNext(), 500);
  } else {
    showToast('播放失败：该歌曲暂时不可用');
  }
});

// Timeout: if song doesn't start playing within 30s, skip (Render 免费版首次加载慢)
audio.addEventListener('waiting', () => {
  if (playTimeout) clearTimeout(playTimeout);
  playTimeout = setTimeout(() => {
    if (state.currentTrack && !state.isPlaying && audio.readyState < 3) {
      console.warn('Playback timed out:', state.currentTrack.title);
      if (state.queue.length > 1) {
        showToast('加载超时，自动切换下一首');
        playNext();
      }
    }
  }, 30000);
});

audio.addEventListener('playing', () => {
  if (playTimeout) { clearTimeout(playTimeout); playTimeout = null; }
});

audio.addEventListener('canplay', () => {
  if (playTimeout) { clearTimeout(playTimeout); playTimeout = null; }
});

// Progress bar — 支持点击 + 拖拽（鼠标 & 触摸）
(function () {
  const bar = $('#progressBar');
  const fill = sliderRangeFor('#progressBar');
  const thumb = { style: {} };
  let dragging = false;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function applySeek(clientX) {
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // 拖拽期间实时更新 UI，不立刻跳转（减少音频跳动）
    if (fill) fill.style.width = (pct * 100) + '%';
    thumb.style.left = (pct * 100) + '%';
    return pct;
  }

  function onStart(e) {
    if (!audio.duration) return;
    dragging = true;
    _progressBarDragging = true; // 阻止 timeupdate 覆盖 UI
    bar.classList.add('seeking');
    thumb.style.opacity = '1';
    applySeek(getClientX(e));
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    applySeek(getClientX(e));
    e.preventDefault();
  }

  function onEnd(e) {
    if (!dragging) return;
    dragging = false;
    bar.classList.remove('seeking');
    thumb.style.opacity = '';
    const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const targetTime = pct * (audio.duration || 0);
    // 先更新 UI 到目标位置（立刻显示，seeked 前就显示正确位置）
    if (fill) fill.style.width = (pct * 100) + '%';
    thumb.style.left = (pct * 100) + '%';
    $('#currentTime').textContent = formatTime(targetTime);
    // 设 currentTime，seeked 事件后再允许 timeupdate 写 UI
    audio.currentTime = targetTime;
    // 一次性 seeked 监听器：跳转完成后才恢复 timeupdate 的 UI 写入
    const onSeeked = () => {
      _progressBarDragging = false;
      audio.removeEventListener('seeked', onSeeked);
    };
    audio.addEventListener('seeked', onSeeked);
    // 兜底：1秒后强制恢复（防止 seeked 不触发）
    setTimeout(() => {
      _progressBarDragging = false;
      audio.removeEventListener('seeked', onSeeked);
    }, 1000);
  }

  // 鼠标事件
  bar.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);

  // 触摸事件（移动端）
  bar.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
})();

// ========== Volume ==========
function setVolume(v) {
  state.volume = Math.max(0, Math.min(1, v));
  audio.volume = state.volume;
  setSliderValue('#volumeBar', state.volume * 100);
  const icon = $('#volumeBtn')?.querySelector('i');
  if (!icon) return;
  if (state.volume === 0) { icon.className = 'fa-solid fa-volume-xmark'; state.isMuted = true; }
  else if (state.volume < 0.5) { icon.className = 'fa-solid fa-volume-low'; state.isMuted = false; }
  else { icon.className = 'fa-solid fa-volume-high'; state.isMuted = false; }
}
window.setVolume = setVolume;

// Volume bar — 支持点击 + 拖拽（鼠标 & 触摸）
(function () {
  const bar = $('#volumeBar');
  let dragging = false;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function applyVolume(clientX) {
    const rect = bar.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setVolume(v);
    return v;
  }

  function onStart(e) {
    dragging = true;
    applyVolume(getClientX(e));
    e.preventDefault();
  }

  function onMove(e) {
    if (!dragging) return;
    applyVolume(getClientX(e));
    e.preventDefault();
  }

  function onEnd() { dragging = false; }

  bar.addEventListener('mousedown', onStart);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  bar.addEventListener('touchstart', onStart, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onEnd);
})();

$('#volumeBtn').addEventListener('click', () => {
  if (state.isMuted) setVolume(state._prevVol || 0.7);
  else { state._prevVol = state.volume; setVolume(0); }
});

setVolume(0.7);

// ========== Queue Navigation ==========
function getQueue() { return state.isShuffled ? state.shuffledQueue : state.queue; }

function playNext() {
  var q = getQueue();
  if (!q.length || q.length <= 1) return;
  var newIdx = (state.queueIndex + 1) % q.length;
  state.queueIndex = newIdx;
  playTrack(q[newIdx], newIdx, true);
}

function playPrev() {
  var q = getQueue();
  if (!q.length || q.length <= 1) return;
  var newIdx = (state.queueIndex - 1 + q.length) % q.length;
  state.queueIndex = newIdx;
  playTrack(q[newIdx], newIdx, true);
}

$('#nextBtn').addEventListener('click', playNext);
$('#prevBtn').addEventListener('click', playPrev);

// Shuffle
$('#shuffleBtn').addEventListener('click', () => {
  state.isShuffled = !state.isShuffled;
  if (state.isShuffled) {
    state.shuffledQueue = [...state.queue].sort(() => Math.random() - 0.5);
    $('#shuffleBtn').classList.add('active');
    showToast('随机播放已开启');
  } else {
    $('#shuffleBtn').classList.remove('active');
    showToast('顺序播放');
  }
});

// Repeat
$('#repeatBtn').addEventListener('click', () => {
  state.repeatMode = (state.repeatMode + 1) % 3;
  const icon = $('#repeatBtn').querySelector('i');
  $('#repeatBtn').classList.remove('active');
  if (state.repeatMode === 1) { icon.className = 'fa-solid fa-repeat'; $('#repeatBtn').classList.add('active'); showToast('列表循环'); }
  else if (state.repeatMode === 2) { icon.className = 'fa-solid fa-1'; $('#repeatBtn').classList.add('active'); showToast('单曲循环'); }
  else { icon.className = 'fa-solid fa-repeat'; }
});

// ========== Queue Panel ==========
$('#fullscreenBtn').addEventListener('click', () => {
  $('#queuePanel').classList.toggle('show');
  
  if ($('#queuePanel').classList.contains('show')) renderQueue();
});

$('#queueClose').addEventListener('click', () => $('#queuePanel').classList.remove('show'));

function renderQueue() {
  if (!state.queue.length) {
    $('#queueList').innerHTML = '<p class="empty-state">播放列表为空</p>';
    $('#queueCount').textContent = '0 首';
    return;
  }
  $('#queueCount').textContent = `${state.queue.length} 首`;
  $('#queueList').innerHTML = state.queue.map((t, i) => `
    <div class="track-row ${state.currentTrack?.id === t.id ? 'playing' : ''}" data-track-id="${t.id}" data-idx="${i}">
      <img class="row-cover" src="${t.coverSmall || t.cover || ''}" data-artist="${esc(t.artist || '')}" data-album="${esc(t.album || '')}" data-name="${esc(t.title || '')}" onerror="fallbackCover(this)" loading="lazy">
      <div class="row-info">
        <div class="row-title">${esc(t.title)}</div>
        <div class="row-artist">${esc(t.artist)}</div>
      </div>
      <span class="row-duration">${formatTime(t.duration)}</span>
    </div>
  `).join('');
  revealContainer($('#queueList'));
  $('#queueList').querySelectorAll('.track-row').forEach(r => {
    r.addEventListener('click', () => {
      state.queueIndex = parseInt(r.dataset.idx);
      playTrack(state.queue[state.queueIndex]);
    });
  });
}

// ========== Lyrics ==========
// Parses LRC text into array of { time: seconds, text: string }
function parseLRC(lrcText) {
  const lines = [];
  const regex = /\[(\d{2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/;
  const raw = lrcText.split('\n');
  for (const line of raw) {
    const m = line.match(regex);
    if (!m) continue;
    const mins = parseInt(m[1], 10);
    const secs = parseInt(m[2], 10);
    let ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) / 1000 : 0;
    const time = mins * 60 + secs + ms;
    const text = m[4].trim();
    if (!text) continue;
    // Skip meta lines
    if (/^(作曲|作词|编曲|制作|混音|吉他|贝斯|键盘|弦乐|鼓|和声|录音|母带|OP|SP|ISRC)/.test(text)) continue;
    lines.push({ time, text });
  }
  return lines.sort((a, b) => a.time - b.time);
}

// Parse bilingual LRC: merges original LRC with translated LRC (tlyric)
// Returns array of { time: seconds, text: original, ttext: translated }
function parseBilingualLRC(lrcText, tlyricText) {
  const originalLines = [];
  const translatedLines = [];

  // Parse original LRC
  const regex = /\[(\d{2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/;
  const raw = lrcText.split('\n');
  for (const line of raw) {
    const m = line.match(regex);
    if (!m) continue;
    const mins = parseInt(m[1], 10);
    const secs = parseInt(m[2], 10);
    let ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) / 1000 : 0;
    const time = mins * 60 + secs + ms;
    const text = m[4].trim();
    if (!text) continue;
    if (/^(作曲|作词|编曲|制作|混音|吉他|贝斯|键盘|弦乐|鼓|和声|录音|母带|OP|SP|ISRC)/.test(text)) continue;
    originalLines.push({ time, text });
  }
  originalLines.sort((a, b) => a.time - b.time);

  // Parse translated LRC (tlyric)
  if (tlyricText) {
    const traw = tlyricText.split('\n');
    for (const line of traw) {
      const m = line.match(regex);
      if (!m) continue;
      const mins = parseInt(m[1], 10);
      const secs = parseInt(m[2], 10);
      let ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) / 1000 : 0;
      const time = mins * 60 + secs + ms;
      const text = m[4].trim();
      if (!text) continue;
      translatedLines.push({ time, text });
    }
    translatedLines.sort((a, b) => a.time - b.time);
  }

  // Merge by timestamp: for each original line, find the closest translated line
  const merged = originalLines.map((orig) => {
    let ttext = '';
    if (translatedLines.length) {
      // Find the translated line with the closest timestamp
      let closest = translatedLines[0];
      let minDiff = Math.abs(translatedLines[0].time - orig.time);
      for (const t of translatedLines) {
        const diff = Math.abs(t.time - orig.time);
        if (diff < minDiff) {
          minDiff = diff;
          closest = t;
        }
      }
      // Only use translation if timestamps are within 2 seconds
      if (minDiff < 2) {
        ttext = closest.text;
      }
    }
    return { time: orig.time, text: orig.text, ttext };
  });

  return merged;
}

// Parse plain text lyrics (from lyrics.ovh fallback) — assign evenly spaced timestamps
function parsePlainLyrics(text, duration) {
  if (!duration || duration <= 0) duration = 240;
  const raw = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('.'));
  if (!raw.length) return [];
  const interval = duration / raw.length;
  return raw.map((text, i) => ({ time: i * interval, text }));
}

// Load lyrics for a track
async function loadLyrics(track, callback) {
  state.lyrics = { lines: [], activeIndex: -1, expanded: false };
  let lrcText = null;
  let tlyricText = null;

  const tryFetch = async (fetchFn) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const data = await fetchFn(controller.signal);
      clearTimeout(timeout);
      return data;
    } catch (e) { return null; }
  };

  // Step 1: 新音源歌词（通过新 API /api/music/lyric）
  if (track.id && (track.source === 'netease' || track.picId)) {
    const data = await tryFetch(signal =>
      fetch(`/api/music/lyric?id=${encodeURIComponent(track.id)}&source=${track.source || 'netease'}`, { signal })
        .then(r => r.json())
    );
    if (data && data.lrc && data.lrc.length > 10) {
      lrcText = data.lrc;
      if (data.tlyric && data.tlyric.length > 10) tlyricText = data.tlyric;
    }
  }

  // Step 2: Try Netease LRC — first by direct song ID, then by search
  if (!lrcText) {
    const idMatch1 = track.previewUrl && track.previewUrl.match(/[?&]id=([^&]+)/);
    const idMatch2 = track.lyricsUrl && track.lyricsUrl.match(/[?&]id=([^&]+)/);
    const songId = idMatch1 ? idMatch1[1] : (idMatch2 ? idMatch2[1] : null);

    if (songId) {
      const data = await tryFetch(signal =>
        fetch(`/api/lyric?id=${encodeURIComponent(songId)}`, { signal }).then(r => r.json())
      );
      if (data && data.lrc && data.lrc.length > 10) {
        lrcText = data.lrc;
        if (data.tlyric && data.tlyric.length > 10) tlyricText = data.tlyric;
      }
    }
  }

  // Step 3: If no lyrics yet, try search by artist+title
  if (!lrcText && track.artist && track.title) {
    const data = await tryFetch(signal =>
      fetch(`/api/search-lyric?artist=${encodeURIComponent(track.artist)}&title=${encodeURIComponent(track.title)}`, { signal })
        .then(r => r.json())
    );
    if (data && data.lrc && data.lrc.length > 10) {
      lrcText = data.lrc;
      if (data.tlyric && data.tlyric.length > 10) tlyricText = data.tlyric;
    }
  }

  // Step 4: Parse and render if we have LRC
  if (lrcText) {
    const lines = parseBilingualLRC(lrcText, tlyricText);
    if (lines.length) {
      state.lyrics.lines = lines;
      if (callback) callback();
      return;
    }
  }

  // Step 5: Fallback to lyrics.ovh
  const ovhData = await tryFetch(signal =>
    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(track.artist)}/${encodeURIComponent(track.title)}`, { signal })
      .then(r => r.json())
  );
  if (ovhData && ovhData.lyrics && ovhData.lyrics.length > 10) {
    const dur = track.duration || audio.duration || 240;
    const lines = parsePlainLyrics(ovhData.lyrics, dur);
    if (lines.length) {
      state.lyrics.lines = lines;
      if (callback) callback();
      return;
    }
  }

  // No lyrics found
  state.lyrics.lines = [];
  if (callback) callback();
}

// Render lyrics lines into the panel
function renderLyrics() {}

// Sync lyrics with audio playback
function syncLyrics() {
  // Sidebar lyrics removed, kept for AMP fullscreen
}



// 存储所有渲染的歌曲，用于快速查找
const trackMap = new Map();

// ========== Render Cards ==========
function createAMCard(track, wide = false) {
  // 存储歌曲到全局Map
  trackMap.set(track.id, track);
  
  return `
    <div class="am-card ${wide ? 'wide' : ''}" data-track-id="${track.id}">
      <div class="am-artwork">
        <img src="${track.coverSmall || track.cover || ''}" alt="" loading="lazy" data-artist="${esc(track.artist || '')}" data-album="${esc(track.album || '')}" data-name="${esc(track.title || '')}" onerror="fallbackCover(this)">
        <div class="am-play-overlay">
          <div class="am-play-circle"><i class="fa-solid fa-play"></i></div>
        </div>
      </div>
      ${wide ? '<div class="am-card-info">' : ''}
      <div class="am-card-title">${esc(track.title)}</div>
      <div class="am-card-subtitle">${esc(track.artist)}</div>
      ${wide ? '</div>' : ''}
    </div>
  `;
}

function renderScrollRow(containerId, tracks, wide = false) {
  const container = $(containerId);
  if (!container) return;
  if (!tracks || !tracks.length) {
    container.innerHTML = '<div style="padding:40px 0;text-align:center;color:var(--text-secondary)">暂无歌曲</div>';
    return;
  }
  container.innerHTML = tracks.map(t => createAMCard(t, wide)).join('');
  revealContainer(container);
}

function revealContainer(container) {
  if (!container) return;
  container.classList.remove('content-reveal');
  void container.offsetWidth;
  container.classList.add('content-reveal');
}

// 实时刷新最近播放列表 UI，每次播放新歌时调用
function refreshRecentTracksUI() {
  var container = $('#recentTracks');
  if (!container) return;
  var section = $('#recentSection');
  if (!state.recentPlays || !state.recentPlays.length) {
    if (section) section.style.display = 'none';
    container.innerHTML = '<div style="padding:20px 0;text-align:center;color:var(--text-secondary);font-size:13px">暂无播放记录</div>';
    return;
  }
  if (section) section.style.display = '';
  var recentTracks = state.recentPlays.map(function(r) {
    var cached = state.trackCache.get(r.id);
    if (cached) return {
      id: r.id, title: cached.title || r.title, artist: cached.artist || r.artist,
      album: cached.album || r.album || '', cover: cached.cover || r.cover || '',
      coverSmall: cached.coverSmall || r.cover || '', picId: cached.picId || r.picId || '',
      duration: cached.duration || 0, previewUrl: cached.previewUrl || r.previewUrl || '',
      source: cached.source || r.source || 'netease',
    };
    return {
      id: r.id, title: r.title, artist: r.artist, album: r.album || '',
      cover: r.cover || '', coverSmall: r.cover || '', picId: r.picId || '',
      duration: 0, previewUrl: r.previewUrl || '', source: r.source || 'netease',
    };
  });
  container.innerHTML = recentTracks.map(function(t) { return createAMCard(t, true); }).join('');
}

// ========== Discover Page ==========
let hotCache;
let heroRotationTracks = [];
let heroRotationIndex = 0;
let heroRotationTimer = null;

// First paint data is bundled with the static shell, so a sleeping API never
// leaves the homepage blank. Live data replaces it in the background.
const FIRST_PAINT_TRACKS = Object.freeze([
  { id: '1406633327', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', picId: '1406633327', source: 'netease' },
  { id: '32337668', title: 'The Hills', artist: 'The Weeknd', album: 'Beauty Behind the Madness', picId: '32337668', source: 'netease' },
  { id: '442867526', title: 'Die For You', artist: 'The Weeknd', album: 'Starboy', picId: '442867526', source: 'netease' },
  { id: '32507839', title: "Can't Feel My Face", artist: 'The Weeknd', album: 'Beauty Behind the Madness', picId: '32507839', source: 'netease' },
  { id: '548785552', title: 'Call Out My Name', artist: 'The Weeknd', album: 'My Dear Melancholy,', picId: '548785552', source: 'netease' },
  { id: '2670864154', title: 'Timeless', artist: 'The Weeknd', album: 'Hurry Up Tomorrow', picId: '2670864154', source: 'netease' }
].map(function(track) {
  // Use local artwork for the first paint; live cover URLs replace these as
  // soon as the catalog responds, without leaving an empty image state.
  const localCover = '/assets/demo/cs' + ((Number(track.id) % 3) + 1) + '.webp';
  track.cover = localCover;
  track.coverSmall = localCover;
  track.liveCover = '/api/music/cover?picId=' + encodeURIComponent(track.picId) + '&source=netease&size=1000';
  return track;
}));

function renderFirstPaintDiscover() {
  const fallback = FIRST_PAINT_TRACKS.slice();
  addToQueue(fallback);
  renderScrollRow('#hotTracks', fallback);
  scheduleHeroRotation(fallback);
  applyHeroTrack(fallback[0]);
}

function applyHeroTrack(track) {
  if (!track) return;
  state.heroTrack = track;
  setShinyText('heroTitle', track.title);
  $('#heroArtist').innerHTML = formatArtists(track.artist);
  $('#heroAlbum').textContent = track.album || '';
  setHeroCover(track.cover || track.coverSmall || '', track.id);
  updateDynamicGradient(track);
  addToQueue([track]);
}

function scheduleHeroRotation(tracks) {
  heroRotationTracks = Array.isArray(tracks) ? tracks.filter(Boolean) : [];
  heroRotationIndex = 0;
  if (heroRotationTimer) clearInterval(heroRotationTimer);
  if (heroRotationTracks.length < 2) return;
  heroRotationTimer = setInterval(function() {
    heroRotationIndex = (heroRotationIndex + 1) % heroRotationTracks.length;
    applyHeroTrack(heroRotationTracks[heroRotationIndex]);
  }, 10 * 60 * 1000);
}

async function loadDiscover() {
  // Render/API requests are expensive on a cold start. Keep the first
  // rendered home state and its live result when navigating away and back.
  if (state._discoverLoaded) return;
  state._discoverLoaded = true;

  // Genre cards
  const genres = [
    { id: 'pop', name: '流行乐', tint: '255,45,149' },
    { id: 'rock', name: '摇滚', tint: '124,77,255' },
    { id: 'electronic', name: '电子', tint: '0,229,255' },
    { id: 'hiphop', name: '嘻哈', tint: '255,23,68' },
    { id: 'jazz', name: '爵士', tint: '255,109,0' },
    { id: 'classical', name: '古典', tint: '0,230,118' },
    { id: 'kpop', name: 'K-Pop', tint: '255,64,129' },
    { id: 'chinese', name: '华语', tint: '224,64,251' },
    { id: 'rnb', name: 'R&B', tint: '68,138,255' },
    { id: 'latin', name: '拉丁', tint: '255,171,0' },
    { id: 'anime', name: '动漫', tint: '179,136,255' },
    { id: 'country', name: '乡村', tint: '255,215,64' },
  ];

  // ChromaGrid owns the genre DOM now. Keep the legacy host empty so the
  // previous card renderer cannot layer a second design underneath it.
  const genreCardsEl = $('#genreCards');
  if (genreCardsEl) genreCardsEl.replaceChildren();

  // Card click delegation
  ['#hotTracks', '#newTracks', '#recentTracks', '#genreTracks'].forEach(sel => {
    const el = $(sel);
    if (!el || el._cardBound) return;
    el._cardBound = true;
    el.addEventListener('click', (e) => {
      const card = e.target.closest('.am-card');
      if (!card) return;
      
      const trackId = card.dataset.trackId;
      
      // 首先尝试从队列中查找
      const qIdx = state.queue.findIndex(t => t.id === trackId);
      if (qIdx >= 0) {
        state.queueIndex = qIdx;
        playTrack(state.queue[qIdx], qIdx);
        return;
      }
      
      // 如果不在队列中，从 trackMap 中获取
      const track = trackMap.get(trackId);
      if (track) {
        // 添加到队列并播放
        state.queue.push(track);
        const newIdx = state.queue.length - 1;
        state.queueIndex = newIdx;
        playTrack(track, newIdx);
      } else {
        showToast('歌曲加载失败，请重试');
      }
    });
  });

  // Recent plays
  if (state.recentPlays.length) {
    const recentSection = $('#recentSection');
    if (recentSection) recentSection.style.display = '';
    const recentTracks = state.recentPlays.map(r => {
      // 优先从 trackCache 拿完整信息（含 album、picId）
      const cached = state.trackCache.get(r.id);
      if (cached) {
        return {
          id: r.id,
          title: cached.title || r.title,
          artist: cached.artist || r.artist,
          album: cached.album || r.album || '',      // ✅ 补全 album
          cover: cached.cover || r.cover || '',
          coverSmall: cached.coverSmall || r.cover || '',
          picId: cached.picId || r.picId || '', // ✅ 补全 picId
          duration: cached.duration || 0,
          previewUrl: cached.previewUrl || r.previewUrl || '',
          source: cached.source || r.source || 'netease',
        };
      }
      // 没有缓存，直接用 recentPlays 的数据（可能缺 album）
      return { 
        id: r.id, 
        title: r.title, 
        artist: r.artist, 
        album: r.album || '',       // ✅ 已有 album 字段
        cover: r.cover || '', 
        coverSmall: r.cover || '', 
        picId: r.picId || '',     // ✅ 已有 picId 字段
        duration: 0, 
        previewUrl: '', 
        source: r.source || 'netease',
      };
    });
    addToQueue(recentTracks);
    renderScrollRow('#recentTracks', recentTracks, true);
  } else {
    const recentSection = $('#recentSection');
    if (recentSection) recentSection.style.display = 'none';
    const recentTracksEl = $('#recentTracks');
    if (recentTracksEl) {
      recentTracksEl.innerHTML = '<div style="padding:20px 0;text-align:center;color:var(--text-secondary);font-size:13px">暂无播放记录</div>';
    }
  }

  renderFirstPaintDiscover();
  loadDiscoverData();
  // 加载新专辑推荐
}

async function loadDiscoverData(retryCount) {
  retryCount = retryCount || 0;
  // Live requests run after the static fallback has painted.
  try {
    var hotTracks = await fetchNeteaseHot(6);
    if (hotTracks && hotTracks.length) {
      hotCache = hotTracks;
      if (hotCache.length) addToQueue(hotCache);
      renderScrollRow('#hotTracks', hotCache);
    }
  } catch (e) {
    console.warn('[Discover] Hot failed:', e);
  }

  // Hero：only use the curated Chinese-classics collection.
  try {
    var heroRes = await fetchFeaturedClassics(6);
    if (!heroRes || !heroRes.length) throw new Error('No curated hero track');
    scheduleHeroRotation(heroRes);
    applyHeroTrack(heroRes[0]);
    addToQueue(heroRes);
  } catch (e) {
    console.warn('[Discover] Hero failed:', e);
  }
}

function setHeroCover(coverUrl, trackId) {
  if (!coverUrl) return;
  window.heroMeshCover = coverUrl;
  window.dispatchEvent(new CustomEvent('ty:herochange', { detail: { cover: coverUrl } }));
  extractAlbumColors(coverUrl, function(colors) {
    if (trackId && String(state.heroTrack?.id) !== String(trackId)) return;
    applyHeroColors(colors);
  });
}

function applyHeroColors(colors) {
  const primary = colors?.primary || { r: 98, g: 241, b: 243 };
  const secondary = colors?.secondary || primary;
  const luminance = color => (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  // Use the brighter extracted swatch for the narrow electric line, preserving
  // the album palette while guaranteeing that it remains visible on the glass.
  const accent = luminance(secondary) >= luminance(primary) ? secondary : primary;
  const rgb = `${accent.r}, ${accent.g}, ${accent.b}`;
  const card = $('#heroCard');
  if (card) {
    card.style.setProperty('--hero-accent-rgb', rgb);
    card.style.setProperty('--hero-accent-soft-rgb', `${primary.r}, ${primary.g}, ${primary.b}`);
  }
  window.heroAccentHex = `rgb(${rgb})`;
  window.dispatchEvent(new CustomEvent('ty:herocolors', { detail: { accent: window.heroAccentHex } }));
}

function setShinyText(id, text) {
  var target = document.getElementById(id);
  if (!target) return;
  if (target.dataset && Object.prototype.hasOwnProperty.call(target.dataset, 'shinyText')) {
    target.dataset.shinyText = text || '';
  } else {
    target.textContent = text || '';
  }
}

// Genre detail
let genreDetailCache = {};
async function loadGenreDetail(genreId) {
  const genreSection = $('#genreSection');
  if (!genreSection) return;
  genreSection.style.display = 'block';
  const genreNames = { pop: '流行乐', rock: '摇滚', electronic: '电子', hiphop: '嘻哈', jazz: '爵士', classical: '古典', rnb: 'R&B', country: '乡村', kpop: 'K-Pop', chinese: '华语', latin: '拉丁', anime: '动漫' };
  const genreTitle = genreNames[genreId] || genreId;
  const genrePixelNames = { pop: 'POP', rock: 'ROCK', electronic: 'ELECTRONIC', hiphop: 'HIP HOP', jazz: 'JAZZ', classical: 'CLASSICAL', rnb: 'R&B', country: 'COUNTRY', kpop: 'K-POP', chinese: 'CHINESE', latin: 'LATIN', anime: 'ANIME' };
  window.setGenreShuffleTitle?.(genrePixelNames[genreId] || genreTitle.toUpperCase());
  setTimeout(() => genreSection.scrollIntoView({ behavior: 'smooth' }), 100);

  if (genreDetailCache[genreId]) { renderScrollRow('#genreTracks', genreDetailCache[genreId]); return; }

  $('#genreTracks').innerHTML = '<div class="scroll-loading" aria-label="内容加载中"></div>';
  try {
    // Search with canonical genre terms plus well-known artists. The public
    // catalog search can rank broad genre phrases unpredictably, so artist
    // seeds keep the first viewport recognizable while retaining variety.
    const genreSearches = {
      pop: ['流行音乐', 'Taylor Swift', 'The Weeknd', 'Adele', 'Bruno Mars'],
      rock: ['摇滚音乐', 'Queen', 'Oasis', 'Coldplay', 'Linkin Park'],
      electronic: ['电子音乐', 'Avicii', 'Daft Punk', 'Calvin Harris', 'Alan Walker'],
      hiphop: ['嘻哈说唱', 'Eminem', 'Drake', 'Kendrick Lamar', 'Travis Scott'],
      jazz: ['爵士音乐', 'Miles Davis', 'Ella Fitzgerald', 'Louis Armstrong', 'Norah Jones'],
      classical: ['古典音乐', 'Beethoven', 'Mozart', 'Chopin', 'Tchaikovsky'],
      rnb: ['R&B', 'Beyonce', 'Usher', 'Frank Ocean', 'SZA'],
      country: ['乡村音乐', 'John Denver', 'Johnny Cash', 'Dolly Parton', 'Luke Combs'],
      kpop: ['K-pop', 'BTS', 'BLACKPINK', 'NewJeans', 'IU'],
      chinese: ['华语流行', '周杰伦', '陈奕迅', '邓丽君', '王菲'],
      latin: ['拉丁音乐', 'Shakira', 'Bad Bunny', 'Luis Fonsi', 'J Balvin'],
      anime: ['动漫歌曲', 'Anime songs', 'LiSA', 'Aimer', 'YOASOBI']
    };
    const queries = genreSearches[genreId] || [genreId];
    const merged = [];
    const seen = new Set();
    for (const query of queries) {
      if (merged.length >= 80) break;
      try {
        const batch = await universalSearch(query, Math.min(24, 80 - merged.length), 'netease');
        for (const track of batch || []) {
          const key = String(track.id || `${track.title}-${track.artist}`).toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          merged.push(track);
          if (merged.length >= 80) break;
        }
      } catch (queryError) {
        console.warn('[Genre] query failed:', genreId, query, queryError.message);
      }
    }
    const visibleTracks = merged;
    genreDetailCache[genreId] = visibleTracks;
    addToQueue(visibleTracks);
    renderScrollRow('#genreTracks', visibleTracks);
  } catch (e) {
    console.error('[Genre] load failed:', genreId, e);
    genreDetailCache[genreId] = [];
    renderScrollRow('#genreTracks', []);
    showToast('该流派暂时没有可用数据');
  }
}

function hideGenreDetail() { $('#genreSection').style.display = 'none'; }

// 主页"热门排行榜" → 显示全部列表
function showHotList() {
  navigateTo('search');
  // 切换到热门推荐 Tab
  const hotTab = document.querySelector('.source-tab[data-source="netease-hot"]');
  if (hotTab) hotTab.click();
}

function playHeroTrack() {
  if (!state.heroTrack) return;
  let idx = state.queue.indexOf(state.heroTrack);
  if (idx < 0) {
    state.queue.push(state.heroTrack);
    idx = state.queue.length - 1;
  }
  state.queueIndex = idx;
  playTrack(state.heroTrack, idx);
}
window.playHeroTrack = playHeroTrack;

// ========== Search Page ==========
const searchSuggestions = ['周杰伦', 'Taylor Swift', '林俊杰', '邓紫棋', '告五人', '陈奕迅', '五月天', 'BTS', 'Ed Sheeran', 'Bruno Mars', 'Adele', '蔡依林'];

const suggestionChips = $('#suggestionChips');
if (suggestionChips) {
  suggestionChips.innerHTML = searchSuggestions.map(s => `<button class="suggestion-chip">${s}</button>`).join('');
  suggestionChips.addEventListener('click', (e) => {
    const chip = e.target.closest('.suggestion-chip');
    if (chip) { $('#searchInput').value = chip.textContent; performSearch(chip.textContent); }
  });
}

// Browse landing actions keep discovery controls on one page while reusing
// the existing source loaders and search result renderer.
const browseQuickGrid = $('#browseQuickGrid');
if (browseQuickGrid) {
  browseQuickGrid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-browse-source],[data-browse-query]');
    if (!card) return;
    const source = card.dataset.browseSource;
    const query = card.dataset.browseQuery;
    const resultTitle = card.dataset.browseTitle || '';
    if (source) {
      browseResultTitleOverride = resultTitle;
      const tab = document.querySelector(`#sourceTabs .source-tab[data-source="${source}"]`);
      if (tab) tab.click();
      else {
        state.currentSource = source;
        const resSec = $('#searchResultsSection');
        if (resSec) resSec.style.display = 'block';
        loadSourceSongs(source);
      }
    } else if (query) {
      $('#searchInput').value = query;
      performSearch(query, resultTitle);
    }
  });
}

let searchTimeout;
let autoAbortCtrl = null;
let autoIndex = -1;
const SEARCH_PAGE_SIZE = 60;
let activeSearchQuery = '';
let activeSearchTracks = [];
let activeSearchOffset = 0;
let activeSearchHasMore = false;
let activeSearchLoading = false;
let searchResultsObserver = null;

$('#searchInput').addEventListener('input', () => {
  const q = $('#searchInput').value.trim();
  $('#searchBtn').style.display = q ? 'flex' : 'none';
  clearTimeout(searchTimeout);
  autoIndex = -1;
  if (!q) {
    hideAutocomplete();
    const suggestions = $('#searchSuggestions');
    if (suggestions) suggestions.style.display = '';
    $('#searchResultsSection').style.display = 'none';
    return;
  }
  // 输入时显示自动补全
  searchTimeout = setTimeout(() => fetchAutocomplete(q), 200);
});

$('#searchInput').addEventListener('keydown', (e) => {
  const autoEl = $('#searchAutocomplete');
  const items = autoEl ? autoEl.querySelectorAll('.auto-item') : [];
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (items.length) {
      autoIndex = Math.min(autoIndex + 1, items.length - 1);
      updateAutoHighlight(items);
    }
    return;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (items.length) {
      autoIndex = Math.max(autoIndex - 1, 0);
      updateAutoHighlight(items);
    }
    return;
  }
  if (e.key === 'Enter') {
    if (autoIndex >= 0 && items.length) {
      // 选中自动补全项
      e.preventDefault();
      selectAutoItem(items[autoIndex]);
      return;
    }
    // 没有选中任何项 → 直接搜索
    clearTimeout(searchTimeout);
    hideAutocomplete();
    performSearch($('#searchInput').value.trim());
  }
  if (e.key === 'Escape') {
    hideAutocomplete();
  }
});

$('#searchBtn').addEventListener('click', (event) => {
  event.preventDefault();
  const input = $('#searchInput');
  if (!input) return;
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
});

// 点击页面其他地方关闭自动补全
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-box')) hideAutocomplete();
});

function updateAutoHighlight(items) {
  items.forEach((it, i) => it.classList.toggle('active', i === autoIndex));
  // 滚动到可见区域
  if (autoIndex >= 0) items[autoIndex].scrollIntoView({ block: 'nearest' });
}

function selectAutoItem(item) {
  const q = item.dataset.query || item.querySelector('.auto-item-name')?.textContent || '';
  $('#searchInput').value = q;
  hideAutocomplete();
  performSearch(q);
}

async function fetchAutocomplete(query) {
  if (!query || query.length < 1) { hideAutocomplete(); return; }
  // 取消上一次请求
  if (autoAbortCtrl) autoAbortCtrl.abort();
  autoAbortCtrl = new AbortController();
  
  try {
    const res = await fetch('/api/music/search?keywords=' + encodeURIComponent(query) + '&source=netease&limit=8', { signal: autoAbortCtrl.signal });
    const data = await res.json();
    const songs = data.songs || [];
    if (!songs.length) { hideAutocomplete(); return; }
    renderAutocomplete(songs);
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('[Autocomplete]', e.message);
  }
}

function renderAutocomplete(songs) {
  const box = $('#searchAutocomplete');
  if (!box) return;
  
  autoIndex = -1;
  box.style.display = 'block';
  box.innerHTML = songs.map((s, i) => `
    <div class="auto-item" data-idx="${i}" data-query="${esc(s.name + ' ' + s.artist)}">
      <img class="auto-item-cover" src="${s.coverSmall || s.cover || ''}" data-artist="${esc(s.artist || '')}" data-album="${esc(s.album || '')}" data-name="${esc(s.name || '')}" onerror="fallbackCover(this)">
      <div class="auto-item-info">
        <span class="auto-item-name">${esc(s.name)}</span>
        <span class="auto-item-artist">${esc(s.artist)}</span>
      </div>
    </div>
  `).join('');
  
  box.querySelectorAll('.auto-item').forEach(item => {
    item.addEventListener('click', () => selectAutoItem(item));
    item.addEventListener('mousedown', (e) => e.preventDefault()); // 防止点击时先 blur
  });
}

function hideAutocomplete() {
  const box = $('#searchAutocomplete');
  if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  autoIndex = -1;
  if (autoAbortCtrl) { autoAbortCtrl.abort(); autoAbortCtrl = null; }
}

async function performSearch(query, resultTitle = '') {
  if (!query) return;
  browseResultTitleOverride = resultTitle || '';
  hideAutocomplete();
  const suggestions = $('#searchSuggestions');
  if (suggestions) suggestions.style.display = 'none';
  $('#searchResultsSection').style.display = 'block';
  $('#searchResults').innerHTML = '<div class="loading" aria-label="搜索结果加载中"></div>';
  activeSearchQuery = query;
  activeSearchTracks = [];
  activeSearchOffset = 0;
  activeSearchHasMore = true;
  if (searchResultsObserver) { searchResultsObserver.disconnect(); searchResultsObserver = null; }

  await loadMoreSearchResults();
}

function renderPaginatedSearchResults() {
  const container = $('#searchResults');
  if (!container) return;
  if (!activeSearchTracks.length) {
    container.innerHTML = '<p class="empty-state">没有找到相关歌曲</p>';
    return;
  }

  renderTrackList(container, activeSearchTracks);
  if (!activeSearchHasMore) return;

  const sentinel = document.createElement('div');
  sentinel.className = 'search-results-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  container.appendChild(sentinel);
  if (!('IntersectionObserver' in window)) return;

  if (searchResultsObserver) searchResultsObserver.disconnect();
  searchResultsObserver = new IntersectionObserver(function(entries) {
    if (entries.some(function(entry) { return entry.isIntersecting; })) loadMoreSearchResults();
  }, { rootMargin: '420px 0px' });
  searchResultsObserver.observe(sentinel);
}

async function loadMoreSearchResults() {
  if (activeSearchLoading || !activeSearchQuery || !activeSearchHasMore) return;
  activeSearchLoading = true;

  try {
    const res = await fetch('/api/music/search?keywords=' + encodeURIComponent(activeSearchQuery) +
      '&source=netease&limit=' + SEARCH_PAGE_SIZE + '&offset=' + activeSearchOffset);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const incoming = (data.songs || []).map(function(song) { return normalizeTrack(song); });
    const seen = new Set(activeSearchTracks.map(function(track) { return track.id; }));
    const additions = incoming.filter(function(track) {
      if (!track.id || seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    });
    activeSearchTracks = activeSearchTracks.concat(additions);
    activeSearchOffset = Number.isFinite(Number(data.nextOffset)) ? Number(data.nextOffset) : activeSearchOffset + incoming.length;
    activeSearchHasMore = data.hasMore === true;

    $('#searchResultTitle').textContent = browseResultTitleOverride || '搜索结果';
    $('#searchSourceLabel').textContent = `音源：${SOURCE_LABELS[state.currentSource]}`;
    if (additions.length) addToQueue(additions);
    renderPaginatedSearchResults();
  } catch (e) {
    if (!activeSearchTracks.length) $('#searchResults').innerHTML = '<p class="empty-state">搜索失败，请稍后重试</p>';
    activeSearchHasMore = false;
  } finally {
    activeSearchLoading = false;
  }
}


function fixCoverUrl(url) {
  if (!url) return '';
  // 已经是完整 http URL 且不含 ? — 追加 ?param=640y640（网易云 CDN，更高清）
  if (url.startsWith('http') && !url.includes('?')) {
    return url + '?param=640y640';
  }
  // 已经是完整 http URL 且含 ? — 直接用
  if (url.startsWith('http')) {
    return url;
  }
  // 本服代理 URL — 直接用（已有 size 参数）
  return url;
}

function fallbackCover(img) {
  if (img.dataset.fallback) return;
  const artist = img.dataset.artist || '';
  const album = img.dataset.album || '';
  const name = img.dataset.name || '';
  
  // 第一次失败：尝试用 album-cover 搜索专辑封面（有 artist + album 时）
  if (artist && (album || name) && !img.dataset.albumTried) {
    img.dataset.albumTried = '1';
    const primaryArtist = artist.split(',')[0].trim();
    let url = '/api/album-cover?artist=' + encodeURIComponent(primaryArtist);
    if (album) url += '&album=' + encodeURIComponent(album);
    if (name) url += '&name=' + encodeURIComponent(name);
    img.src = url;
    return;
  }
  
  // 第二次失败：尝试用歌手照片
  if (artist && !img.dataset.fallbackTried) {
    const primaryArtist = artist.split(',')[0].trim();
    img.dataset.fallbackTried = '1';
    img.src = '/api/artist-photo?name=' + encodeURIComponent(primaryArtist);
    return;
  }
  
  // 全部失败，显示默认图标
  img.dataset.fallback = '1';
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+QvjwvdGV4dD48L3N2Zz4=';
  img.style.display = '';
  img.onerror = null;
}
function renderTrackList(containerId, tracks) {
  const container = typeof containerId === 'string' ? $(containerId) : containerId;
  const isMobile = window.innerWidth <= 768;
  const isBrowseResults = container.classList.contains('browse-results-list');
  container.innerHTML = tracks.map((t, i) => `
    <div class="track-row${isBrowseResults ? ' browse-result-row' : ''}" data-track-id="${t.id}" data-idx="${i}">
      ${isBrowseResults ? '<span class="browse-result-index">' + (i + 1) + '</span>' : ''}
      <img class="row-cover" src="${t.coverSmall || t.cover || ''}" data-artist="${esc(t.artist || '')}" data-album="${esc(t.album || '')}" data-name="${esc(t.title || '')}" onerror="fallbackCover(this)" loading="lazy">
      <div class="row-info">
        <div class="row-title">${esc(t.title)}</div>
        <div class="row-artist">${esc(t.artist)}${isBrowseResults ? '' : (t.album ? ' — ' + esc(t.album) : '')}</div>
      </div>
      ${isBrowseResults ? '<span class="browse-result-album">' + esc(t.album || '单曲') + '</span>' : ''}
      ${isMobile ? '' : '<span class="row-duration">' + formatTime(t.duration) + '</span>'}
      <div class="row-actions ${isMobile ? 'mobile' : ''}">
        <button class="row-action-btn like-btn ${isFavorite(t.id) ? 'liked' : ''}" onclick="event.stopPropagation(); toggleFavById('${t.id}')">
          <i class="fa-${isFavorite(t.id) ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <button class="row-action-btn" onclick="event.stopPropagation(); addToPlaylist('${t.id}')">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.track-row').forEach(row => {
    row.addEventListener('click', () => {
      const idx = parseInt(row.dataset.idx);
      const track = tracks[idx];
      if (!track) return;
      const qIdx = state.queue.findIndex(t => t.id === track.id);
      if (qIdx >= 0) { state.queueIndex = qIdx; playTrack(state.queue[qIdx], qIdx); }
      else { state.queue.push(track); state.queueIndex = state.queue.length - 1; playTrack(track, state.queueIndex); }
    });
  });
  revealContainer(container);
  updateQueueHighlight();
}

// All song rows share one compact, expandable detail treatment. Playback keeps
// its existing row handler; this delegated handler only reveals extra metadata.
function toggleSongRowDetails(row) {
  if (!row) return;
  var panel = row.querySelector(':scope > .song-row-expand');
  if (!panel) {
    var titleEl = row.querySelector('.row-title, .album-track-title, .fav-track-title, .track-title');
    var artistEl = row.querySelector('.row-artist, .album-track-artist, .fav-track-artist, .track-artist');
    var durationEl = row.querySelector('.row-duration, .album-track-duration, .fav-track-duration, .track-duration');
    panel = document.createElement('div');
    panel.className = 'song-row-expand';
    panel.innerHTML = '<span>' + esc(titleEl?.textContent || '歌曲') + '</span>' +
      '<span>' + esc(artistEl?.textContent || '未知歌手') + '</span>' +
      '<span>' + esc(durationEl?.textContent || '时长未知') + '</span>';
    row.appendChild(panel);
  }
  var expanded = row.classList.toggle('is-expanded');
  row.setAttribute('aria-expanded', expanded ? 'true' : 'false');
}

document.addEventListener('click', function(event) {
  var row = event.target.closest && event.target.closest('.track-row, .album-track-row, .fav-track-row, .local-track-row');
  if (!row || event.target.closest('button, a, input, .song-row-expand')) return;
  // Selecting a song must remain a compact, single-row action everywhere.
  // Playback owns the click; no secondary disclosure is attached here.
}, { passive: true });

function toggleFavById(id) {
  const t = state.queue.find(q => q.id === id);
  if (t) toggleFavorite(t);
}

// ========== Favorites Page ==========
function renderFavorites() {
  // 从队列、trackCache 和 recentPlays 中查找收藏的歌曲
  var favs = [];
  
  // 诊断日志：显示当前数据源状态
  console.log('[Favorites] Rendering: fav set=' + state.favorites.size + 
    ', queue=' + state.queue.length + 
    ', trackCache=' + state.trackCache.size + 
    ', recentPlays=' + state.recentPlays.length);
  
  state.favorites.forEach(function(id) {
    var track = state.queue.find(function(t) { return t.id === id; });
    if (!track) {
      track = state.trackCache.get(id);
    }
    // 最后尝试从 recentPlays 中查找（作为数据恢复的后备）
    if (!track) {
      var rp = state.recentPlays.find(function(r) { return r.id === id; });
      if (rp) {
        track = { id: rp.id, title: rp.title, artist: rp.artist, cover: rp.cover || '', coverSmall: rp.cover || '', duration: 0, source: rp.source || '' };
      }
    }
    if (track) favs.push(track);
  });

  var favoritesCount = $('#favoritesCount');
  if (favoritesCount) favoritesCount.textContent = favs.length + ' 首歌曲';
  var playFavoritesBtn = $('#playFavoritesBtn');
  if (playFavoritesBtn) playFavoritesBtn.disabled = favs.length === 0;

  // 如果 trackCache 为空但 favorites 不为空，说明之前的数据未能缓存——自动从 favs 列表重建 trackCache
  if (state.trackCache.size === 0 && state.favorites.size > 0 && favs.length > 0) {
    console.warn('[Favorites] Track cache is empty, rebuilding from available data...');
    favs.forEach(function(t) { cacheTrack(t); });
    saveAll();
  }
  
  if (!favs.length) { 
    renderEmptyFavorites(); 
    return; 
  }
  
  // 渲染为列表
  var html = '<div class="album-tracks-list">';
  html += favs.map(function(track, i) {
    var duration = track.duration || 0;
    var coverSrc = track.coverSmall || track.cover || '';
    return '<div class="fav-track-row" data-id="' + track.id + '">' +
      '<div class="fav-track-index">' + (i + 1) + '</div>' +
      '<div class="fav-track-cover">' + (coverSrc ? '<img src="' + coverSrc + '" alt="" loading="lazy" data-artist="' + esc(track.artist || '') + '" data-album="' + esc(track.album || '') + '" data-name="' + esc(track.title || '') + '" onerror="fallbackCover(this)">' : '<i class="fa-solid fa-music"></i>') + '</div>' +
      '<div class="fav-track-copy">' +
        '<div class="fav-track-title">' + esc(track.title) + '</div>' +
        '<div class="fav-track-artist">' + esc(track.artist) + '</div>' +
      '</div>' +
      '<span class="fav-track-duration">' + formatTime(duration) + '</span>' +
      '<button class="fav-remove-btn" data-id="' + track.id + '" title="取消收藏" aria-label="取消收藏"><i class="fa-solid fa-heart"></i></button>' +
    '</div>';
  }).join('');
  html += '</div>';
  
  $('#favoritesList').innerHTML = html;
  revealContainer($('#favoritesList'));
  
  // 点击行播放
  $('#favoritesList').querySelectorAll('.fav-track-row').forEach(function(el) {
    el.addEventListener('click', function(e) {
      if (e.target.closest('.fav-remove-btn')) return;
      var id = el.dataset.id;
      var track = state.queue.find(function(t) { return t.id === id; }) || state.trackCache.get(id);
      if (track) {
        playTrack(track);
        state.queue = favs;
        state.queueIndex = favs.indexOf(track);
      }
    });
  });
  
  // 取消收藏按钮
  $('#favoritesList').querySelectorAll('.fav-remove-btn').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var id = btn.dataset.id;
      state.favorites.delete(id);
      saveAll();
      renderFavorites();
      updateLikeUI();
      showToast('已取消喜爱');
    });
  });
}

var playFavoritesButton = $('#playFavoritesBtn');
if (playFavoritesButton) playFavoritesButton.addEventListener('click', function() {
  var favoriteTracks = [];
  state.favorites.forEach(function(id) {
    var track = state.queue.find(function(item) { return item.id === id; }) || state.trackCache.get(id);
    if (track) favoriteTracks.push(track);
  });
  if (!favoriteTracks.length) return;
  state.queue = favoriteTracks;
  state.queueIndex = 0;
  playTrack(favoriteTracks[0], 0);
});

function renderEmptyFavorites() {
  $('#favoritesList').innerHTML = `
    <div class="empty-state">
      <i class="fa-regular fa-heart"></i>
      <p>还没有收藏歌曲</p>
      <span>在歌曲播放页或专辑中点击心形按钮即可收藏。</span>
    </div>`;
}

// ========== Playlists ==========
function renderPlaylists() {
  var playlistCount = $('#playlistCount');
  if (playlistCount) playlistCount.textContent = state.playlists.length + ' 个歌单';
  if (!state.playlists.length) { $('#playlistGrid').innerHTML = '<div class="empty-state"><i class="fa-regular fa-square-plus"></i><p>还没有歌单</p><span>新建一个歌单，开始整理喜欢的音乐。</span></div>'; return; }
  
  // 为每个播放列表获取第一首歌的封面
  const playlistHTML = state.playlists.map((pl, i) => {
    let coverHTML = '<i class="fa-solid fa-music"></i>'; // 默认图标
    
    // 如果有歌曲，尝试获取第一首歌的封面
    if (pl.tracks && pl.tracks.length > 0) {
      const firstTrackId = pl.tracks[0];
      let firstTrack = null;
      
      // 从 queue 中查找
      if (state.queue && state.queue.length > 0) {
        firstTrack = state.queue.find(t => t.id === firstTrackId);
      }
      
      // 从 trackCache 中查找
      if (!firstTrack && state.trackCache) {
        firstTrack = state.trackCache.get ? state.trackCache.get(firstTrackId) : null;
      }
      
      // 从 recentPlays 中查找
      if (!firstTrack && state.recentPlays && state.recentPlays.length > 0) {
        const rp = state.recentPlays.find(r => r.id === firstTrackId);
        if (rp) {
          firstTrack = { 
            id: rp.id, 
            title: rp.title, 
            artist: rp.artist, 
            cover: rp.cover || '', 
            coverSmall: rp.cover || '', 
            duration: 0, 
            source: rp.source || '' 
          };
        }
      }
      
      // 如果找到了第一首歌且有封面，显示封面图片
      if (firstTrack && (firstTrack.cover || firstTrack.coverSmall)) {
        const coverUrl = firstTrack.cover || firstTrack.coverSmall;
        coverHTML = `<img src="${coverUrl}" alt="${esc(pl.name)}" onerror="fallbackCover(this)">`;
      }
    }
    
    return `
      <div class="playlist-card" data-idx="${i}">
        <div class="pl-cover">${coverHTML}</div>
        <div class="pl-copy"><div class="pl-name">${esc(pl.name)}</div><div class="pl-count">${pl.tracks.length} 首歌曲</div></div>
        <button class="pl-delete" onclick="event.stopPropagation(); deletePlaylist(${i})" title="删除歌单" aria-label="删除歌单"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
  }).join('');
  
  $('#playlistGrid').innerHTML = playlistHTML;
  
  $('#playlistGrid').querySelectorAll('.playlist-card').forEach(card => {
    card.addEventListener('click', () => openPlaylist(parseInt(card.dataset.idx)));
  });
}

$('#createPlaylistBtn').addEventListener('click', () => {
  $('#playlistNameInput').value = '';
  $('#playlistModal').classList.add('show');
  $('#playlistNameInput').focus();
});

$('#cancelPlaylist').addEventListener('click', () => $('#playlistModal').classList.remove('show'));

$('#savePlaylist').addEventListener('click', () => {
  const name = $('#playlistNameInput').value.trim();
  if (!name) { showToast('请输入名称'); return; }
  state.playlists.push({ id: Date.now().toString(), name, tracks: [] });
  saveAll();
  $('#playlistModal').classList.remove('show');
  renderPlaylists();
  showToast(`「${name}」已创建`);
});

function deletePlaylist(idx) {
  if (!confirm(`确定要删除「${state.playlists[idx].name}」吗？`)) return;
  state.playlists.splice(idx, 1);
  saveAll(); renderPlaylists();
  showToast('歌单已删除');
}

let currentPlaylistDetailTracks = [];

function openPlaylist(idx) {
  const pl = state.playlists[idx];
  if (!pl) return;
  state.currentPlaylistId = pl.id;
  navigateTo('playlist-detail');
  setShinyText('playlistDetailTitle', pl.name);
  
  // 从 queue、trackCache 和 recentPlays 中查找歌曲
  const tracks = pl.tracks.map(id => {
    var t = state.queue.find(function(t2) { return t2.id === id; });
    if (!t) t = state.trackCache.get(id);
    if (!t) {
      var rp = state.recentPlays.find(function(r) { return r.id === id; });
      if (rp) t = { id: rp.id, title: rp.title, artist: rp.artist, cover: rp.cover || '', coverSmall: rp.cover || '', duration: 0, source: rp.source || '' };
    }
    return t;
  }).filter(Boolean);
  currentPlaylistDetailTracks = tracks;
  const meta = $('#playlistDetailMeta');
  if (meta) meta.textContent = `${tracks.length} 首歌曲 · 你的个人歌单`;
  const playAll = $('#playlistPlayAllBtn');
  if (playAll) playAll.disabled = !tracks.length;
  
  if (!tracks.length) { $('#playlistTracks').innerHTML = '<p class="empty-state">歌单为空</p>'; }
  else renderTrackList('#playlistTracks', tracks);
}

$('#backToPlaylists').addEventListener('click', () => goBack());
$('#playlistPlayAllBtn').addEventListener('click', () => {
  if (!currentPlaylistDetailTracks.length) return;
  addToQueue(currentPlaylistDetailTracks);
  const firstIndex = state.queue.findIndex(track => track.id === currentPlaylistDetailTracks[0].id);
  state.queueIndex = firstIndex >= 0 ? firstIndex : state.queue.length - currentPlaylistDetailTracks.length;
  playTrack(currentPlaylistDetailTracks[0], state.queueIndex);
});
$('#backFromArtist').addEventListener('click', () => goBack());

function addToPlaylist(trackId) {
  if (!state.playlists.length) { showToast('请先创建歌单'); return; }
  const pl = state.playlists[state.playlists.length - 1];
  if (pl.tracks.includes(trackId)) { showToast('已在歌单中'); return; }
  pl.tracks.push(trackId);
  // 缓存歌曲数据
  var track = state.queue.find(function(t) { return t.id === trackId; });
  if (track) cacheTrack(track);
  saveAll();
  showToast(`已添加到「${pl.name}」`);
}

// ========== Sidebar Search ==========
$('.search-mini').addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT') return;
  navigateTo('search');
  setTimeout(() => $('#searchInput')?.focus(), 150);
});

// ========== Settings ==========
$('#settingsGear').addEventListener('click', () => $('#settingsModal').classList.add('show'));
$('#cancelSettings').addEventListener('click', () => $('#settingsModal').classList.remove('show'));

// ========== 音源 Tabs ==========
const sourceTabsEl = $('#sourceTabs');
if (sourceTabsEl) {
  sourceTabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.source-tab');
    if (!tab) return;
    state.currentSource = tab.dataset.source;
    sourceTabsEl.querySelectorAll('.source-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const label = $('#searchSourceLabel');
    if (label) label.textContent = `音源：${SOURCE_LABELS[state.currentSource] || state.currentSource}`;

    // 热门推荐/新歌速递：无需搜索词，自动加载
    if (['netease-hot', 'netease-new'].includes(state.currentSource)) {
      const sugg = $('#searchSuggestions');
      const resSec = $('#searchResultsSection');
      if (sugg) sugg.style.display = 'none';
      if (resSec) resSec.style.display = 'block';
      const si = $('#searchInput');
      if (si) si.value = '';
      loadSourceSongs(state.currentSource);
    } else {
      // 有搜索词就搜，没搜索词就显示搜索提示
      const query = $('#searchInput')?.value?.trim() || '';
      if (query) {
        performSearch(query);
      } else {
        const sugg = $('#searchSuggestions');
        const resSec = $('#searchResultsSection');
        if (sugg) sugg.style.display = 'block';
        if (resSec) resSec.style.display = 'none';
      }
    }
  });
}

async function loadSourceSongs(source) {
  $('#searchResults').innerHTML = '<div class="loading" aria-label="内容加载中"></div>';
  try {
    let tracks = [];
    switch (source) {
      case 'netease-hot': tracks = await fetchNeteaseHot(80); break;
      case 'netease-new': tracks = await fetchNeteaseNew(80); break;
    }
    if (!tracks.length) {
      $('#searchResults').innerHTML = '<p class="empty-state">暂无歌曲，请稍后重试</p>';
      return;
    }
    $('#searchResultTitle').textContent = SOURCE_LABELS[source] || source;
    addToQueue(tracks);
    renderTrackList('#searchResults', tracks);
  } catch (e) {
    $('#searchResults').innerHTML = '<p class="empty-state">加载失败，请稍后重试</p>';
  }
}

// ========== Keyboard Shortcuts ==========
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  switch (e.code) {
    case 'Space': e.preventDefault(); togglePlay(); break;
    case 'ArrowLeft': audio.currentTime = Math.max(0, audio.currentTime - 5); break;
    case 'ArrowRight': audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5); break;
    case 'ArrowUp': setVolume(state.volume + 0.1); break;
    case 'ArrowDown': setVolume(state.volume - 0.1); break;
    case 'KeyN': playNext(); break;
    case 'KeyP': playPrev(); break;
    case 'KeyM': $('#volumeBtn').click(); break;
  }
});

// ========== 主题切换 (深浅色自动切换) ==========
function initTheme() {
  localStorage.removeItem('melodybox_theme');
  setTheme('dark');
  updateThemeToggleButton();
}

function autoSetThemeByTime() {
  setTheme('dark');
}

function setTheme(theme) {
  document.body.removeAttribute('data-theme');
}

function toggleTheme() {
  setTheme('dark');
}

function updateThemeToggleButton() {
  const btn = $('#themeToggleBtn');
  if (!btn) return;
  
  const currentTheme = document.body.getAttribute('data-theme');
  const isLight = currentTheme === 'light';
  
  // 更新按钮图标
  btn.innerHTML = isLight ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
  
  // 更新按钮提示
  btn.title = isLight ? '切换到深色主题' : '切换到浅色主题';
}

function resetThemeToAuto() {
  // 清除手动设置的主题，恢复根据时间自动切换
  localStorage.removeItem('melodybox_theme');
  autoSetThemeByTime();
  updateThemeToggleButton();
  showToast('已恢复根据时间自动切换主题');
}

// ========== Apple Music 风格全屏播放器 ==========
let ampIsShowing = false;

// ========== 全屏封面预加载 + 错误回退 ==========
function applyAmpArtwork(artwork, urls, idx) {
  if (idx >= urls.length) {
    artwork.style.backgroundImage = '';
    return;
  }
  const img = new Image();
  img.onload = function() {
    artwork.style.backgroundImage = `url(${urls[idx]})`;
    artwork.style.backgroundSize = 'cover';
    artwork.style.backgroundPosition = 'center';
    window.ampCoverSrc = urls[idx];
    window.dispatchEvent(new CustomEvent('ty:ampcoverchange', { detail: { cover: urls[idx] } }));
  };
  img.onerror = function() {
    applyAmpArtwork(artwork, urls, idx + 1);
  };
  img.src = urls[idx];
}

// 辅助：在圆角矩形路径上画圆角矩形（用于未来剪裁）
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ========== 专辑取色引擎 ==========
let ampColorExtractCache = {};

function extractAlbumColors(imageSrc, callback) {
  // 使用缓存避免重复提取
  if (ampColorExtractCache[imageSrc]) {
    callback(ampColorExtractCache[imageSrc]);
    return;
  }
  
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const size = 100; // 小尺寸足够取色，性能好
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    
    // 采样策略：边缘 + 四角 + 中心
    const samples = [];
    const step = 8;
    
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const i = (y * size + x) * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        if (a > 128) {
          samples.push({ r, g, b });
        }
      }
    }
    
    if (samples.length === 0) {
      const fallback = { r: 25, g: 25, b: 50 };
      const colors = {
        primary: fallback,
        secondary: { r: 40, g: 20, b: 60 },
        tertiary: { r: 15, g: 15, b: 35 }
      };
      ampColorExtractCache[imageSrc] = colors;
      callback(colors);
      return;
    }
    
    // K-means 聚类获取 3 个主色调
    const k = 3;
    let centroids = [
      samples[Math.floor(Math.random() * samples.length)],
      samples[Math.floor(Math.random() * samples.length)],
      samples[Math.floor(Math.random() * samples.length)]
    ];
    
    for (let iter = 0; iter < 5; iter++) {
      const clusters = [[], [], []];
      samples.forEach(s => {
        let minDist = Infinity, minIdx = 0;
        centroids.forEach((c, i) => {
          const dr = s.r - c.r, dg = s.g - c.g, db = s.b - c.b;
          const dist = dr * dr + dg * dg + db * db;
          if (dist < minDist) { minDist = dist; minIdx = i; }
        });
        clusters[minIdx].push(s);
      });
      
      centroids = clusters.map(cluster => {
        if (cluster.length === 0) return centroids[0];
        const avg = { r: 0, g: 0, b: 0 };
        cluster.forEach(s => { avg.r += s.r; avg.g += s.g; avg.b += s.b; });
        avg.r = Math.round(avg.r / cluster.length);
        avg.g = Math.round(avg.g / cluster.length);
        avg.b = Math.round(avg.b / cluster.length);
        return avg;
      });
    }
    
    // 按亮度排序：最暗 → 最亮
    centroids.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
    
    const colors = {
      primary: centroids[1] || centroids[0],     // 中间亮度 → 主色调
      secondary: centroids[2] || centroids[0],    // 最亮 → 辅助色
      tertiary: centroids[0]                      // 最暗 → 背景/阴影
    };
    
    ampColorExtractCache[imageSrc] = colors;
    callback(colors);
  };
  img.onerror = () => {
    const fallback = { primary: { r: 25, g: 25, b: 50 }, secondary: { r: 40, g: 20, b: 60 }, tertiary: { r: 15, g: 15, b: 35 } };
    callback(fallback);
  };
  img.src = imageSrc;
}

function applyAlbumColors(colors) {
  const { primary, secondary, tertiary } = colors;
  
  // RGB 字符串
  const pRgb = `${primary.r}, ${primary.g}, ${primary.b}`;
  const sRgb = `${secondary.r}, ${secondary.g}, ${secondary.b}`;
  const tRgb = `${tertiary.r}, ${tertiary.g}, ${tertiary.b}`;
  
  // HSB 亮度判断：浅色专辑用深色文字
  const primaryLum = (primary.r * 299 + primary.g * 587 + primary.b * 114) / 1000;
  const isLightAlbum = primaryLum > 150;
  
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  
  // 设置 CSS 变量供 UI 使用
  player.style.setProperty('--amp-accent', `rgb(${pRgb})`);
  player.style.setProperty('--amp-accent-rgb', pRgb);
  player.style.setProperty('--amp-accent-light', `rgb(${sRgb})`);
  player.style.setProperty('--amp-accent-light-rgb', sRgb);
  player.style.setProperty('--amp-accent-dark', `rgb(${tRgb})`);
  player.style.setProperty('--amp-accent-dark-rgb', tRgb);
  window.ampGridColors = colors;
  window.dispatchEvent(new CustomEvent('ty:ampgridcolors', { detail: colors }));
  
  // 标题/艺术家颜色：浅色封面用深色，深色封面用白色
  const textColor = isLightAlbum ? `rgb(${Math.max(0, primary.r - 60)}, ${Math.max(0, primary.g - 60)}, ${Math.max(0, primary.b - 60)})` : 'white';
  const textSecondary = isLightAlbum ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)';
  
  const title = $('#ampTitle');
  const artist = $('#ampArtist');
  if (title) title.style.color = textColor;
  if (artist) artist.style.color = textSecondary;
  
  // 进度条使用 CSS 变量自动适配主题色（无需 JS 内联覆盖）
  
  // 控制按钮文本颜色
  const ctrlBtns = player.querySelectorAll('.amp-ctrl-btn, .amp-action-btn');
  ctrlBtns.forEach(btn => {
    if (isLightAlbum) {
      btn.style.color = `rgba(${pRgb}, 0.7)`;
    }
  });

  // 同步更新音波动效颜色

}

function applyAlbumDetailColors(colors) {
  const page = document.getElementById('page-album-detail');
  if (!page || !colors) return;
  const shell = document.querySelector('.main-content');
  const { primary, secondary, tertiary } = colors;
  const p = `${primary.r}, ${primary.g}, ${primary.b}`;
  const s = `${secondary.r}, ${secondary.g}, ${secondary.b}`;
  const t = `${tertiary.r}, ${tertiary.g}, ${tertiary.b}`;
  const luminance = (primary.r * 299 + primary.g * 587 + primary.b * 114) / 1000;
  const light = luminance > 150;
  page.style.setProperty('--album-primary-rgb', p);
  page.style.setProperty('--album-secondary-rgb', s);
  page.style.setProperty('--album-tertiary-rgb', t);
  page.style.setProperty('--album-text-color', light ? '#342b24' : '#fffaf4');
  page.style.setProperty('--album-muted-color', light ? '#594a3b' : 'rgba(255, 250, 244, .72)');
  page.style.setProperty('--album-line-color', light ? 'rgba(93, 72, 47, .16)' : 'rgba(255, 255, 255, .16)');
  if (shell) {
    shell.style.setProperty('--album-primary-rgb', p);
    shell.style.setProperty('--album-secondary-rgb', s);
    shell.style.setProperty('--album-tertiary-rgb', t);
  }
}

function resetAlbumDetailColors() {
  const page = document.getElementById('page-album-detail');
  if (!page) return;
  const shell = document.querySelector('.main-content');
  page.style.removeProperty('--album-primary-rgb');
  page.style.removeProperty('--album-secondary-rgb');
  page.style.removeProperty('--album-tertiary-rgb');
  page.style.removeProperty('--album-text-color');
  page.style.removeProperty('--album-muted-color');
  page.style.removeProperty('--album-line-color');
  if (shell) {
    shell.style.removeProperty('--album-primary-rgb');
    shell.style.removeProperty('--album-secondary-rgb');
    shell.style.removeProperty('--album-tertiary-rgb');
  }
}

function syncAlbumDetailColorsFromCover(image) {
  if (!image) return;
  const source = image.currentSrc || image.src;
  if (!source) return;
  extractAlbumColors(source, applyAlbumDetailColors);
}

function openAmpFullscreenPlayer() {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  
  // 双栏全屏默认同时呈现封面与歌词
  const artworkWrapper = $('#ampArtworkWrapper');
  const lyricsView = $('#ampLyricsView');
  const lyricsBtn = $('#ampLyricsBtn');
  if (artworkWrapper && lyricsView) {
    artworkWrapper.classList.remove('hidden');
    lyricsView.classList.remove('hidden');
    ampLyricsShowing = true;
    if (lyricsBtn) lyricsBtn.classList.remove('active');
  }
  
  updateAmpFullscreenPlayer();
  updateAmpProgress();
  requestAnimationFrame(() => loadAmpLyrics());
  
  player.style.display = 'flex';
  requestAnimationFrame(() => {
    player.classList.add('show');
  });
  
  ampIsShowing = true;
  document.body.style.overflow = 'hidden';

  // 启动音波动效（如果是电子乐且正在播放）
  if (state.isPlaying && state.currentTrack) {
  }
}
window.openNowPlaying = openAmpFullscreenPlayer;

function getActiveTrack() {
  return state.currentTrack || (state.queueIndex >= 0 ? state.queue[state.queueIndex] : null) || state.queue[0] || null;
}

function closeAmpFullscreenPlayer() {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  
  player.classList.remove('show');
  setTimeout(() => {
    player.style.display = 'none';
    ampIsShowing = false;
    document.body.style.overflow = '';
  }, 400);
}

function updateAmpFullscreenPlayer() {
  const track = getActiveTrack();
  if (!track) return;
  
  // 封面 URL（全屏用大图 track.cover，小图用 coverSmall）
  const ampCoverUrl = track.cover || track.coverSmall || '';
  const primaryArtist = (track.artist || '').split(',')[0].trim();
  const artistPhotoUrl = primaryArtist ? '/api/artist-photo?name=' + encodeURIComponent(primaryArtist) : '';
  // 无直接封面时，优先尝试专辑封面搜索，再退到歌手照片
  const albumCoverUrl = (primaryArtist && track.album) ? '/api/album-cover?artist=' + encodeURIComponent(primaryArtist) + '&album=' + encodeURIComponent(track.album) : '';
  const fallbackBg = ampCoverUrl || albumCoverUrl || artistPhotoUrl || '';

  // 从专辑封面提取颜色，供全屏 GridDistortion 生成无图案混色纹理。
  if (fallbackBg) {
    extractAlbumColors(fallbackBg, (colors) => {
      // Image loading is async. Ignore a stale cover after the user changes track.
      if (getActiveTrack()?.id === track.id) applyAlbumColors(colors);
    });
  }

  // 更新专辑封面（用 Image 预加载 + 错误回退）
  const artwork = $('#ampArtwork');
  if (artwork) {
    const coverCandidates = [];
    if (ampCoverUrl) coverCandidates.push(ampCoverUrl);
    if (albumCoverUrl) coverCandidates.push(albumCoverUrl);
    if (artistPhotoUrl) coverCandidates.push(artistPhotoUrl);
    
    if (coverCandidates.length > 0) {
      applyAmpArtwork(artwork, coverCandidates, 0);
    } else {
      artwork.style.backgroundImage = '';
    }
  }
  
  // 更新歌曲信息
  const title = $('#ampTitle');
  if (title) title.textContent = track.title;
  
  const artist = $('#ampArtist');
  if (artist) {
    artist.textContent = track.artist;
    if (track.artist) {
      artist.style.cursor = 'pointer';
      artist.title = '查看 ' + track.artist + ' 的歌曲';
      artist.onclick = function() {
        closeAmpFullscreenPlayer();
        setTimeout(function() { openArtistPage(track.artist); }, 400);
      };
    }
  }
  
  // 更新喜欢按钮
  const likeBtn = $('#ampLikeBtn');
  if (likeBtn) {
    if (isFavorite(track.id)) {
      likeBtn.classList.add('liked');
      likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    } else {
      likeBtn.classList.remove('liked');
      likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    }
  }
  
  // 更新播放按钮
  updateAmpPlayBtn();
  
  // 同步随机/循环按钮状态
  const shuffleBtn = $('#ampShuffleBtn');
  if (shuffleBtn) shuffleBtn.classList.toggle('active', state.isShuffled);
  
  const repeatBtn = $('#ampRepeatBtn');
  if (repeatBtn) {
    repeatBtn.classList.toggle('active', state.repeatMode > 0);
    if (state.repeatMode === 2) {
      repeatBtn.innerHTML = '<i class="fa-solid fa-1"></i>';
    } else {
      repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
    }
  }
  
  // 更新进度条
  // 更新进度条
  // 注意：不再每次切歌强制重置歌词视图 — 保留用户当前选择
  if (ampLyricsShowing) {
    loadAmpLyrics();
  }

  // 切歌时重新判断音波动效
  if (state.isPlaying && ampIsShowing) {
  } else {
  }
}

function updateAmpPlayBtn() {
  const playBtn = $('#ampPlayBtn');
  if (!playBtn) return;
  
  if (state.isPlaying) {
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playBtn.title = '暂停';
  } else {
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playBtn.title = '播放';
  }
}

function updateAmpProgress() {
  const currentTime = $('#ampCurrentTime');
  const duration = $('#ampDuration');
  const progressFill = sliderRangeFor('#ampProgressBar');
  const progressThumb = { style: {} };
  
  if (currentTime) {
    currentTime.textContent = formatTime(audio.currentTime || 0);
  }
  
  if (duration) {
    duration.textContent = formatTime(audio.duration || 0);
  }
  
  if (progressFill && audio.duration && !_progressBarDragging) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    if (progressThumb) {
      progressThumb.style.left = pct + '%';
    }
  }
}

// 切换全屏播放器的歌词视图
let ampLyricsShowing = false;

function toggleAmpLyricsView() {
  const artworkWrapper = $('#ampArtworkWrapper');
  const lyricsView = $('#ampLyricsView');
  const lyricsBtn = $('#ampLyricsBtn');
  
  if (!artworkWrapper || !lyricsView) return;
  
  ampLyricsShowing = !ampLyricsShowing;
  
  if (ampLyricsShowing) {
    artworkWrapper.classList.add('hidden');
    lyricsView.classList.remove('hidden');
    if (lyricsBtn) lyricsBtn.classList.add('active');
    
    // 已渲染过当前歌曲的歌词 → 只刷新高亮和滚动，不重建 DOM
    const track = getActiveTrack();
    if (ampLyricsRenderedFor === (track && track.id)) {
      requestAnimationFrame(() => {
        // 强制重新定位（即使 index 不变也要滚动到当前行）
        ampLyricsFirstScroll = true;
        ampLyricsLastActiveIdx = -1;
        updateAmpLyricsHighlight();
      });
      return;
    }
    
    // 首次或切歌后：需要完整加载
    requestAnimationFrame(() => {
      loadAmpLyrics();
    });
  } else {
    artworkWrapper.classList.remove('hidden');
    lyricsView.classList.add('hidden');
    if (lyricsBtn) lyricsBtn.classList.remove('active');
  }
}

function loadAmpLyrics() {
  const track = getActiveTrack();
  if (!track) return;
  
  const stage = $('#ampLyricsStage');
  if (!stage) return;
  
  // 已有歌词 → 直接渲染
  if (state.lyrics.lines && state.lyrics.lines.length > 0) {
    renderAmpLyrics();
    return;
  }
  
  // 加载中
  if (stage.querySelector('.amp-lyrics-empty')) {
    stage.querySelector('.amp-lyrics-empty').textContent = '';
  } else {
    stage.innerHTML = '<p class="amp-lyrics-empty"></p>';
  }
  
  loadLyrics(track, () => {
    if (state.lyrics.lines && state.lyrics.lines.length > 0) {
      renderAmpLyrics();
    } else {
      stage.innerHTML = '<p class="amp-lyrics-empty">暂无歌词</p>';
      // 重置 spacers
      const top = stage.querySelector('.amp-lyrics-spacer-top');
      const bottom = stage.querySelector('.amp-lyrics-spacer-bottom');
      if (top) top.remove();
      if (bottom) bottom.remove();
    }
  });
}

function renderAmpLyrics() {
  const stage = $('#ampLyricsStage');
  const view = $('#ampLyricsView');
  if (!stage || !view) return;
  
  const lyricLines = state.lyrics.lines;
  if (!lyricLines || lyricLines.length === 0) {
    stage.innerHTML = '<p class="amp-lyrics-empty">暂无歌词</p>';
    return;
  }
  
  // 构建 HTML：顶部 spacer → 歌词行 → 底部 spacer
  const halfH = Math.max(view.clientHeight, 400) / 2;
  const linesHtml = lyricLines.map((line, i) =>
    `<div class="amp-lyrics-line" data-lyric-idx="${i}">
      <span class="lyric-text">${esc(line.text)}</span>
      ${line.ttext ? `<span class="lyric-ttext">${esc(line.ttext)}</span>` : ''}
    </div>`
  ).join('');
  
  stage.innerHTML = 
    `<div class="amp-lyrics-spacer amp-lyrics-spacer-top" style="height:${halfH}px"></div>` +
    `<div class="amp-lyrics-intro-wait" aria-label="前奏"><i></i><i></i><i></i></div>` +
    linesHtml +
    `<div class="amp-lyrics-spacer amp-lyrics-spacer-bottom" style="height:${halfH}px"></div>`;
  
  // 首次渲染 → 重置状态，等布局完成后瞬间定位
  ampLyricsFirstScroll = true;
  ampLyricsLastActiveIdx = -1;
  const track = getActiveTrack();
  ampLyricsRenderedFor = track ? track.id : null;
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateAmpLyricsHighlight();
    });
  });
}

// ========== scrollIntoView 居中 ==========
let ampLyricsFirstScroll = false;
let ampLyricsLastActiveIdx = -1;
let ampLyricsRenderedFor = null;  // 已渲染歌词对应的 track id，避免重复重建 DOM
let ampLyricsScrollFrame = 0;

function scrollAmpLyricsToLine(line, lineDuration, immediate = false) {
  const view = $('#ampLyricsView');
  if (!view || !line) return;
  const target = Math.max(0, line.offsetTop - view.clientHeight / 2 + line.offsetHeight / 2);
  cancelAnimationFrame(ampLyricsScrollFrame);
  if (immediate) {
    view.scrollTop = target;
    return;
  }

  const start = view.scrollTop;
  const distance = target - start;
  // Fast lyrics hand off quicker; longer vocal phrases settle more gently.
  const duration = Math.max(180, Math.min(560, Math.round((lineDuration || 2.5) * 140)));
  const startedAt = performance.now();
  const tick = now => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    view.scrollTop = start + distance * eased;
    if (progress < 1) ampLyricsScrollFrame = requestAnimationFrame(tick);
    else ampLyricsScrollFrame = 0;
  };
  ampLyricsScrollFrame = requestAnimationFrame(tick);
}

function updateAmpLyricsHighlight() {
  if (!ampLyricsShowing) return;

  const lines = $$('.amp-lyrics-line');
  if (!lines || lines.length === 0) return;

  const currentTime = audio.currentTime || 0;
  let activeIdx = -1;

  for (let i = 0; i < state.lyrics.lines.length; i++) {
    if (state.lyrics.lines[i].time <= currentTime) activeIdx = i;
    else break;
  }

  const stage = $('#ampLyricsStage');
  if (stage) {
    const firstLineTime = state.lyrics.lines[0]?.time || 0;
    stage.classList.toggle('is-waiting-for-first-line', !audio.paused && activeIdx < 0 && firstLineTime > 0);
  }

  // 计算当前行进度
  if (activeIdx >= 0 && activeIdx < state.lyrics.lines.length) {
    var lineStart = state.lyrics.lines[activeIdx].time;
    var lineEnd = (activeIdx + 1 < state.lyrics.lines.length) ? state.lyrics.lines[activeIdx + 1].time : (audio.duration || lineStart + 5);
    var progress = lineEnd > lineStart ? ((currentTime - lineStart) / (lineEnd - lineStart)) * 100 : 0;
    progress = Math.max(0, Math.min(100, progress));
    if (lines[activeIdx]) {
      lines[activeIdx].style.setProperty('--lyric-progress', progress);
      lines[activeIdx].style.setProperty('--lyric-transition-ms', `${Math.max(90, Math.min(260, Math.round((lineEnd - lineStart) * 90)))}ms`);
    }
  }

  // 同一个行 → 只更新进度，不做其他操作
  if (activeIdx === ampLyricsLastActiveIdx) {
    if (ampLyricsFirstScroll && activeIdx >= 0) {
      ampLyricsFirstScroll = false;
      if (lines[activeIdx]) scrollAmpLyricsToLine(lines[activeIdx], 0, true);
    }
    return;
  }
  const wasFirstScroll = ampLyricsFirstScroll;
  ampLyricsLastActiveIdx = activeIdx;
  ampLyricsFirstScroll = false;

  // 更新 CSS 类 → active > near > far-2 > 隐藏
  lines.forEach((line, i) => {
    line.classList.remove('active', 'near', 'far-2');
    const dist = Math.abs(i - activeIdx);
    if (dist === 0) line.classList.add('active');
    else if (dist === 1) {
      line.classList.add('near');
    }
    else if (dist === 2) line.classList.add('far-2');
  });

  // 滚动到当前行（居中）
  if (activeIdx >= 0 && lines[activeIdx]) {
    const nextTime = state.lyrics.lines[activeIdx + 1]?.time;
    const lineDuration = nextTime ? nextTime - state.lyrics.lines[activeIdx].time : 2.5;
    scrollAmpLyricsToLine(lines[activeIdx], lineDuration, wasFirstScroll);
  }
}

// 初始化全屏播放器事件
function initAmpFullscreenPlayer() {
  // 关闭按钮
  const closeBtn = $('#ampCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAmpFullscreenPlayer);
  }
  
  // 播放/暂停按钮
  const playBtn = $('#ampPlayBtn');
  if (playBtn) {
    playBtn.addEventListener('click', togglePlay);
  }
  
  // 上一首/下一首
  const prevBtn = $('#ampPrevBtn');
  if (prevBtn) {
    prevBtn.addEventListener('click', playPrev);
  }
  
  const nextBtn = $('#ampNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', playNext);
  }
  
  // 随机播放
  const shuffleBtn = $('#ampShuffleBtn');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      state.isShuffled = !state.isShuffled;
      if (state.isShuffled) {
        state.shuffledQueue = [...state.queue].sort(() => Math.random() - 0.5);
      }
      shuffleBtn.classList.toggle('active', state.isShuffled);
      showToast(state.isShuffled ? '随机播放已开启' : '随机播放已关闭');
    });
  }
  
  // 循环模式
  const repeatBtn = $('#ampRepeatBtn');
  if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
      state.repeatMode = (state.repeatMode + 1) % 3;
      repeatBtn.classList.toggle('active', state.repeatMode > 0);
      if (state.repeatMode === 2) {
        repeatBtn.innerHTML = '<i class="fa-solid fa-1"></i>';
      } else {
        repeatBtn.innerHTML = '<i class="fa-solid fa-repeat"></i>';
      }
      const labels = ['循环已关闭', '列表循环', '单曲循环'];
      showToast(labels[state.repeatMode]);
    });
  }
  
  // 喜欢按钮
  const likeBtn = $('#ampLikeBtn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const track = state.queue[state.queueIndex];
      if (track) {
        toggleFavById(track.id);
        // 更新按钮状态
        if (isFavorite(track.id)) {
          likeBtn.classList.add('liked');
          likeBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        } else {
          likeBtn.classList.remove('liked');
          likeBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
        }
      }
    });
  }
  
  // 歌词按钮
  const lyricsBtn = $('#ampLyricsBtn');
  if (lyricsBtn) {
    lyricsBtn.addEventListener('click', () => {
      toggleAmpLyricsView();
    });
  }
  
  // 双栏布局下封面与歌词均保持常驻，不再通过点击封面切换视图。
  const ampContent = $('#ampContent');
  if (ampContent) {
    ampContent.addEventListener('click', (e) => {
      if (e.target.closest('.amp-info-section') ||
          e.target.closest('.amp-header') ||
          e.target.closest('#ampLyricsBtn')) return;
    });
  }
  
  // 队列按钮
  const queueBtn = $('#ampQueueBtn');
  if (queueBtn) {
    queueBtn.addEventListener('click', () => {
      closeAmpFullscreenPlayer();
      setTimeout(() => {
        $('#fullscreenBtn').click();
      }, 400);
    });
  }
  
  // 全屏进度条 — 支持点击 + 拖拽（鼠标 & 触摸）
  const progressBar = $('#ampProgressBar');
  if (progressBar) {
    const ampFill = sliderRangeFor('#ampProgressBar');
    const ampThumb = { style: {} };
    let ampDragging = false;

    function ampGetClientX(e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
    }

    function ampApplySeek(clientX) {
      const rect = progressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      if (ampFill) ampFill.style.width = (pct * 100) + '%';
      if (ampThumb) ampThumb.style.left = (pct * 100) + '%';
      return pct;
    }

    function ampOnStart(e) {
      if (!audio.duration) return;
      ampDragging = true;
      _progressBarDragging = true; // 阻止 timeupdate 覆盖 UI
      if (ampThumb) ampThumb.style.opacity = '1';
      ampApplySeek(ampGetClientX(e));
      e.preventDefault();
    }

    function ampOnMove(e) {
      if (!ampDragging) return;
      ampApplySeek(ampGetClientX(e));
      e.preventDefault();
    }

    function ampOnEnd(e) {
      if (!ampDragging) return;
      ampDragging = false;
      // 不立刻清除 _progressBarDragging，等 seeked 事件
      if (ampThumb) ampThumb.style.opacity = '';
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const rect = progressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      if (!audio.duration) return;
      const targetTime = pct * audio.duration;
      // 先更新 UI 到目标位置
      if (ampFill) ampFill.style.width = (pct * 100) + '%';
      if (ampThumb) ampThumb.style.left = (pct * 100) + '%';
      audio.currentTime = targetTime;
      // 一次性 seeked 监听器
      const onAmpSeeked = () => {
        _progressBarDragging = false;
        audio.removeEventListener('seeked', onAmpSeeked);
      };
      audio.addEventListener('seeked', onAmpSeeked);
      // 兜底：1秒后强制恢复
      setTimeout(() => {
        _progressBarDragging = false;
        audio.removeEventListener('seeked', onAmpSeeked);
      }, 1000);
    }

    progressBar.addEventListener('mousedown', ampOnStart);
    document.addEventListener('mousemove', ampOnMove);
    document.addEventListener('mouseup', ampOnEnd);
    progressBar.addEventListener('touchstart', ampOnStart, { passive: false });
    document.addEventListener('touchmove', ampOnMove, { passive: false });
    document.addEventListener('touchend', ampOnEnd);
  }
  
  // 点击播放器栏打开全屏播放器
  const playerBar = $('#playerBar');
  if (playerBar) {
    playerBar.addEventListener('click', (e) => {
      // 避免点击按钮时触发
      if (e.target.closest('.ctrl-btn') || e.target.closest('.player-like') || e.target.closest('.player-more')) {
        return;
      }
      if (state.queue.length > 0) {
        openAmpFullscreenPlayer();
      }
    });
  }
  
  // 注意：时间更新和播放状态变化已通过主监听器（line ~394-418）同步到全屏播放器
  // 避免重复注册 event listener
}

// 在 player.js 的 init() 函数中调用 initAmpFullscreenPlayer()
// ========== Init ==========
async function init() {
  initTheme(); // 初始化主题
  initAmpFullscreenPlayer(); // 初始化全屏播放器
  
  // 请求持久化存储权限，确保本地音乐不会丢失
  try {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      console.log("[MelodyBox] 持久化存储:", isPersisted ? "已启用" : "未启用");
    }
  } catch(e) {
    console.warn("[MelodyBox] 持久化存储请求失败（不影响使用）:", e.message);
  }
  
  // 本地音乐上传事件
  const localFileInput = $('#localFileInput');
  const localUploadArea = $('#localUploadArea');
  const uploadLink = $('#uploadLink');
  
  if (uploadLink) {
    uploadLink.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      localFileInput.click();
    });
  }
  
  if (localUploadArea) {
    localUploadArea.addEventListener('click', (e) => {
      if (e.target.closest('.upload-link')) return;
      localFileInput.click();
    });
    
    // 拖拽上传
    localUploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      localUploadArea.style.borderColor = 'var(--neon-purple)';
      localUploadArea.style.background = 'rgba(180, 77, 255, 0.08)';
    });
    localUploadArea.addEventListener('dragleave', () => {
      localUploadArea.style.borderColor = '';
      localUploadArea.style.background = '';
    });
    localUploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      localUploadArea.style.borderColor = '';
      localUploadArea.style.background = '';
      if (e.dataTransfer.files.length) {
        handleLocalFileUpload(e.dataTransfer.files);
      }
    });
  }
  
  if (localFileInput) {
    localFileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        handleLocalFileUpload(e.target.files);
        e.target.value = ''; // Reset for re-upload
      }
    });
  }
  
  // 专辑详情侧面板关闭按钮
  const closeAlbumPanel = $('#closeAlbumPanel');
  if (closeAlbumPanel) {
    closeAlbumPanel.addEventListener('click', () => {
      const panel = document.getElementById('albumDetailPanel');
      if (panel) {
        panel.classList.remove('show');
      }
    });
  }
  
  // 专辑播放全部按钮
  const albumPlayAllBtn = $('#albumPlayAllBtn');
  if (albumPlayAllBtn) {
    albumPlayAllBtn.addEventListener('click', playAlbumAll);
  }
  const artistPlayAllBtn = document.getElementById('artistPlayAllBtn');
  if (artistPlayAllBtn) {
    artistPlayAllBtn.addEventListener('click', function() {
      if (currentArtistTracks.length) {
        playTrack(currentArtistTracks[0], 0);
        state.queue = currentArtistTracks;
        state.queueIndex = 0;
      }
    });
  }
  
  // 专辑收藏按钮
  const albumFavBtn = $('#albumFavBtn');
  if (albumFavBtn) {
    albumFavBtn.addEventListener('click', () => {
      // 获取当前专辑 ID（从全局变量或页面元素）
      const albumId = window.currentAlbumId;
      if (albumId) {
        toggleAlbumFavorite(albumId, window.currentAlbumData);
      }
    });
  }
  
  // 专辑收藏页面视图切换按钮
  const gridViewBtn = $('#gridViewBtn');
  const coverFlowViewBtn = $('#coverFlowViewBtn');
  
  if (gridViewBtn) {
    gridViewBtn.addEventListener('click', showAlbumGridView);
  }
  
  if (coverFlowViewBtn) {
    coverFlowViewBtn.addEventListener('click', showCoverFlowView);
  }
  
  // ========== 页面导航 - 侧边栏点击跳转 ==========
  $$('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) {
        console.log('[Nav] Sidebar click, navigate to:', page);
        navigateTo(page);
      }
    });
  });
  
  // ========== 返回按钮 - 返回上一个操作 ==========
  const backFromAlbumBtn = $('#backFromAlbum');
  if (backFromAlbumBtn) {
    backFromAlbumBtn.addEventListener('click', () => {
      console.log('[Nav] Back from album, going back');
      goBack();
    });
  }
  
  // 导航到本地音乐页时渲染列表
  navigateTo('discover');
}

init();

// 全局错误处理
window.addEventListener('error', function(e) {
  console.error('[Global Error]', e.error || e.message, 'at', e.filename, 'line', e.lineno);
});

// 未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', function(e) {
  console.error('[Unhandled Rejection]', e.reason);
});
// ============================================
// 本地音乐功能 (Local Music Upload)
// ============================================

const LOCAL_MUSIC_DB_NAME = 'melodybox_local';
let localMusicDB = null;

function openLocalMusicDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(LOCAL_MUSIC_DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { localMusicDB = e.target.result; resolve(localMusicDB); };
    req.onerror = (e) => reject(e);
  });
}

function saveLocalTrack(track) {
  return new Promise((resolve, reject) => {
    const tx = localMusicDB.transaction(['tracks'], 'readwrite');
    const store = tx.objectStore('tracks');
    const req = store.put(track);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e);
  });
}

function getAllLocalTracks() {
  return new Promise((resolve, reject) => {
    const tx = localMusicDB.transaction(['tracks'], 'readonly');
    const store = tx.objectStore('tracks');
    const req = store.getAll();
    req.onsuccess = (e) => resolve(e.target.result || []);
    req.onerror = (e) => reject(e);
  });
}

function deleteLocalTrack(id) {
  return new Promise((resolve, reject) => {
    const tx = localMusicDB.transaction(['tracks'], 'readwrite');
    const store = tx.objectStore('tracks');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e);
  });
}

// Minimal ID3v2 parser
function parseID3v2(buffer) {
  const view = new DataView(buffer);
  const tags = {};
  if (view.getUint8(0) !== 0x49 || view.getUint8(1) !== 0x44 || view.getUint8(2) !== 0x33) return tags;
  const version = view.getUint8(3);
  const size = (view.getUint8(6) << 21) | (view.getUint8(7) << 14) | (view.getUint8(8) << 7) | view.getUint8(9);
  let offset = 10;
  while (offset < size + 10) {
    const frameId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset+1), view.getUint8(offset+2), view.getUint8(offset+3));
    if (frameId === '\0\0\0\0') break;
    let frameSize;
    if (version === 3) {
      frameSize = (view.getUint8(offset+4) << 24) | (view.getUint8(offset+5) << 16) | (view.getUint8(offset+6) << 8) | view.getUint8(offset+7);
    } else if (version === 4) {
      frameSize = (view.getUint8(offset+4) << 21) | (view.getUint8(offset+5) << 14) | (view.getUint8(offset+6) << 7) | view.getUint8(offset+7);
    } else { break; }
    const frameData = new Uint8Array(buffer, offset + 10, frameSize);
    const enc = frameData[0];
    let text = '';
    try {
      if (enc === 0 || enc === 3) {
        text = new TextDecoder(enc === 0 ? 'iso-8859-1' : 'utf-8').decode(frameData.slice(1)).replace(/\0/g, '').trim();
      } else if (enc === 1) {
        const pairs = [];
        for (let j = 1; j < frameData.length - 1; j += 2) pairs.push(frameData[j+1] << 8 | frameData[j]);
        text = String.fromCharCode(...pairs).replace(/\0/g, '').trim();
      }
    } catch(e) {}
    if (frameId === 'TIT2' || frameId === 'TT2') tags.title = text;
    else if (frameId === 'TPE1' || frameId === 'TP1') tags.artist = text;
    else if (frameId === 'TALB' || frameId === 'TAL') tags.album = text;
    else if (frameId === 'TYER' || frameId === 'TYE' || frameId === 'TDRC') tags.year = text ? text.substring(0,4) : '';
    offset += 10 + frameSize;
  }
  return tags;
}

async function extractAudioMetadata(file) {
  const arrayBuffer = await file.arrayBuffer();
  const metadata = {};
  if (file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')) {
    const id3 = parseID3v2(arrayBuffer);
    if (id3.title) metadata.title = id3.title;
    if (id3.artist) metadata.artist = id3.artist;
    if (id3.album) metadata.album = id3.album;
  }
  const fileName = file.name.replace(/\.[^/.]+$/, '');
  if (!metadata.title) {
    const match = fileName.match(/^(.+?)\s*[-–—]\s*(.+)$/);
    if (match) {
      if (!metadata.artist) metadata.artist = match[1].trim();
      metadata.title = match[2].trim();
    } else {
      metadata.title = fileName;
      if (!metadata.artist) metadata.artist = '未知歌手';
    }
  }
  if (!metadata.artist) metadata.artist = '未知歌手';
  if (!metadata.album) metadata.album = '未知专辑';

  // 保存音频数据到 metadata 中，用于持久化
  metadata.audioData = arrayBuffer;
  metadata.fileType = file.type || 'audio/mpeg';

  return new Promise((resolve) => {
    const blob = new Blob([arrayBuffer], { type: file.type || 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audioEl = new Audio();
    audioEl.addEventListener('loadedmetadata', () => {
      metadata.duration = audioEl.duration;
      metadata.objectURL = url;
      resolve(metadata);
    });
    audioEl.addEventListener('error', () => {
      metadata.duration = 0;
      metadata.objectURL = url;
      resolve(metadata);
    });
    audioEl.src = url;
  });
}

async function handleLocalFileUpload(files) {
  await openLocalMusicDB();
  const container = document.getElementById('localTracksList');
  container.innerHTML = '<p class="empty-state">正在解析音乐文件...</p>';
  let addedCount = 0;
  let failedCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|flac|wav|m4a|aac|ogg|wma)$/i)) continue;
    
    try {
      const metadata = await extractAudioMetadata(file);
      const id = 'local_' + Date.now() + '_' + i;
      const track = {
        id: id,
        title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
        artist: metadata.artist || '未知歌手',
        album: metadata.album || '未知专辑',
        duration: metadata.duration || 0,
        fileName: file.name,
        addedAt: Date.now(),
        // 保存音频数据到 IndexedDB，实现持久化
        audioData: metadata.audioData,
        fileType: metadata.fileType,
        fileSize: file.size
      };
      await saveLocalTrack(track);
      addedCount++;
    } catch (e) { 
      console.error('Error processing:', file.name, e); 
      failedCount++;
      
      // 如果是配额超出错误，提示用户
      if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
        showToast('存储空间不足！请删除一些已上传的歌曲后再试');
        break;
      }
    }
  }
  
  let msg = '已添加 ' + addedCount + ' 首本地音乐';
  if (failedCount > 0) {
    msg += '\n(' + failedCount + ' 首失败，可能是存储空间不足)';
  }
  msg += '\n✅ 已永久保存到浏览器，下次打开网页仍在';
  
  // 显示当前存储使用情况
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate();
    const usedMB = (estimate.usage / 1024 / 1024).toFixed(1);
    const quotaMB = (estimate.quota / 1024 / 1024).toFixed(1);
    msg += '\n📦 已用存储: ' + usedMB + 'MB / ' + quotaMB + 'MB';
  }
  
  showToast(msg);
  renderLocalTracks();
}

async function renderLocalTracks() {
  await openLocalMusicDB();
  const tracks = await getAllLocalTracks();
  const container = document.getElementById('localTracksList');
  const localTracksCount = document.getElementById('localTracksCount');
  if (localTracksCount) localTracksCount.textContent = tracks.length + ' 首歌曲';
  if (!tracks.length) {
    container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-music"></i><p>还没有本地歌曲</p><span>把音频文件拖到上方区域即可添加。</span></div>';
    return;
  }
  const html = tracks.map((t, i) => '<div class="track-item local-track-row" data-local-id="' + esc(t.id) + '">' +
    '<div class="track-num local-track-index">' + (i + 1) + '</div>' +
    '<div class="local-track-icon"><i class="fa-solid fa-wave-square"></i></div>' +
    '<div class="track-info local-track-copy">' +
      '<div class="track-title">' + esc(t.title) + '</div>' +
      '<div class="track-artist">' + esc(t.artist) + (t.album ? ' · ' + esc(t.album) : '') + '</div>' +
    '</div>' +
    '<div class="track-duration">' + formatTime(t.duration || 0) + '</div>' +
    '<button class="track-delete" data-local-id="' + esc(t.id) + '" title="删除" aria-label="删除本地歌曲"><i class="fa-solid fa-xmark"></i></button>' +
  '</div>').join('');
  container.innerHTML = html;
  container.querySelectorAll('.track-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.track-delete')) return;
      playLocalTrack(el.dataset.localId);
    });
  });
  container.querySelectorAll('.track-delete').forEach(el => {
    el.addEventListener('click', async (e) => {
      e.stopPropagation();
      await deleteLocalTrack(el.dataset.localId);
      renderLocalTracks();
      showToast('已删除');
    });
  });
  
  // 更新存储信息显示
  updateStorageInfo();
}

function playLocalTrack(id) {
  if (!localMusicDB) { openLocalMusicDB().then(() => playLocalTrack(id)); return; }
  const tx = localMusicDB.transaction(['tracks'], 'readonly');
  const store = tx.objectStore('tracks');
  store.get(id).onsuccess = (e) => {
    const track = e.target.result;
    if (!track) {
      showToast('歌曲不存在，可能已被删除');
      return;
    }

    // 从 audioData 创建 ObjectURL（持久化，刷新页面后仍可播放）
    if (track.audioData && track.audioData.byteLength > 0) {
      try {
        // 将 ArrayBuffer 转换为 Blob
        const blob = new Blob([track.audioData], { type: track.fileType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        
        audio.src = url;
        audio.load();
        audio.play().then(() => {
          state.isPlaying = true;
          state.currentTrack = track;
          updatePlayBtn();
          updatePlayerUI(track);
          showToast('正在播放: ' + track.title);
        }).catch((err) => {
          console.error('播放失败:', err);
          showToast('播放失败，请重试');
        });
        
        // 播放结束后释放 URL
        audio.onended = () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error('播放本地音乐失败:', err);
        showToast('播放失败：音频数据损坏，请重新上传');
      }
    } else {
      showToast('无法播放：音频数据丢失，请重新上传该文件');
    }
  };
  
  store.get(id).onerror = (e) => {
    console.error('读取本地音乐失败:', e);
    showToast('读取失败，请刷新页面重试');
  };
}

// 更新存储信息显示
async function updateStorageInfo() {
  const storageInfo = document.getElementById('storageInfo');
  const storageFill = document.getElementById('storageFill');
  const storageText = document.getElementById('storageText');
  
  if (!storageInfo || !storageFill || !storageText) return;
  
  // 显示存储信息区域
  storageInfo.style.display = 'block';
  
  // 获取存储使用情况
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const usedMB = (used / 1024 / 1024).toFixed(1);
      const quotaMB = (quota / 1024 / 1024).toFixed(1);
      const percentage = quota > 0 ? (used / quota * 100) : 0;
      
      // 更新进度条
      storageFill.style.width = percentage + '%';
      
      // 更新文本
      storageText.textContent = '已用 ' + usedMB + 'MB / 可用 ' + quotaMB + 'MB (' + percentage.toFixed(1) + '%)';
      
      // 如果使用率超过 80%，显示警告颜色
      if (percentage > 80) {
        storageFill.style.background = 'linear-gradient(90deg, #ff2d95, #ff6b6b)';
      } else {
        storageFill.style.background = 'linear-gradient(90deg, var(--neon-purple), var(--neon-pink))';
      }
    } catch (e) {
      console.error('获取存储信息失败:', e);
      storageInfo.style.display = 'none';
    }
  } else {
    storageInfo.style.display = 'none';
  }
}

// ============================================
// 专辑详情页功能
// ============================================

let currentAlbumTracks = [];
let driftSourceTracksPromise = null;
let driftWallSourceTracks = [];
let driftWallRefreshTimer = null;
let driftWallRefreshIndex = 0;
const driftWallSearches = ['新歌 2026', '华语 新歌', '欧美 新歌', '日韩 新歌', '独立音乐', '电子音乐'];

function driftWallAlbumKey(track) {
  if (!track) return '';
  const albumId = track.albumId || track.album_id || track.album?.id;
  if (albumId) return 'id:' + String(albumId);
  const albumName = typeof track.album === 'string' ? track.album : (track.title || '');
  const artist = track.artist || '';
  return 'name:' + String(albumName).trim().toLowerCase() + '|artist:' + String(artist).trim().toLowerCase();
}

function updateAlbumDriftWallCovers(extraTracks) {
  var pool = [];
  var seenAlbums = new Set();
  var seenCovers = new Set();
  var sources = [].concat(extraTracks || [], currentAlbumTracks || [], state.queue || [], Array.from(state.trackCache.values()), hotCache || [], driftWallSourceTracks || []);
  sources.forEach(function(track) {
    var cover = track && (track.cover || track.coverSmall);
    var albumKey = driftWallAlbumKey(track);
    if (!cover || !albumKey || seenAlbums.has(albumKey) || seenCovers.has(cover)) return;
    seenAlbums.add(albumKey);
    seenCovers.add(cover);
    pool.push({ image: cover, title: ((track.album || track.title || '专辑封面') + ' · ' + (track.artist || '')) });
  });
  for (var i = pool.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = pool[i]; pool[i] = pool[j]; pool[j] = swap;
  }
  var items = pool.slice(0, 96);
  if (!items.length && Array.isArray(window.albumDriftWallItems)) items = window.albumDriftWallItems;
  if (!items.length) return;
  window.albumDriftWallItems = items;
  window.dispatchEvent(new CustomEvent('ty:albumdriftcovers', { detail: { items: items } }));
}

function scheduleDriftWallRefresh() {
  if (driftWallRefreshTimer) clearTimeout(driftWallRefreshTimer);
  driftWallRefreshTimer = null;
  if (state.currentPage !== 'album-favorites') return;
  driftWallRefreshTimer = setTimeout(function() {
    driftWallRefreshTimer = null;
    refreshDriftWallSourceCovers();
  }, 45000);
}

function refreshDriftWallSourceCovers() {
  if (state.currentPage !== 'album-favorites') return;
  var offset = driftWallRefreshIndex * 80;
  var search = driftWallSearches[driftWallRefreshIndex % driftWallSearches.length];
  driftWallRefreshIndex += 1;
  Promise.all([
    fetch('/api/music/hot?source=netease&limit=80&offset=' + offset).then(function(res) { return res.ok ? res.json() : { songs: [] }; }).catch(function() { return { songs: [] }; }),
    fetch('/api/album/new?limit=40&offset=' + offset).then(function(res) { return res.ok ? res.json() : { songs: [] }; }).catch(function() { return { songs: [] }; }),
    fetch('/api/music/search?keywords=' + encodeURIComponent(search) + '&limit=30').then(function(res) { return res.ok ? res.json() : { songs: [] }; }).catch(function() { return { songs: [] }; })
  ]).then(function(results) {
    var songs = results[0].songs || [];
    var newSongs = (results[1].songs || []).concat(results[2].songs || []).map(function(song) { return normalizeNeteaseTrack(song); });
    driftWallSourceTracks = driftWallSourceTracks.concat(songs.map(normalizeNeteaseTrack), newSongs).slice(-240);
    updateAlbumDriftWallCovers([]);
  }).finally(scheduleDriftWallRefresh);
}

function loadDriftWallSourceCovers(extraTracks) {
  if (!driftSourceTracksPromise) {
    driftSourceTracksPromise = Promise.all([
      fetch('/api/music/hot?source=netease&limit=80').then(function(res) { return res.ok ? res.json() : { songs: [] }; }).catch(function() { return { songs: [] }; }),
      fetch('/api/album/new?limit=40').then(function(res) { return res.ok ? res.json() : { albums: [] }; }).catch(function() { return { albums: [] }; })
    ]).then(function(results) {
      var songs = (results[0].songs || []).map(function(song) { return normalizeNeteaseTrack(song); });
      var newSongs = (results[1].songs || []).map(function(song) { return normalizeNeteaseTrack(song); });
      return songs.concat(newSongs);
    });
  }
  driftSourceTracksPromise.then(function(sourceTracks) {
    driftWallSourceTracks = driftWallSourceTracks.concat(sourceTracks || []).slice(-240);
    updateAlbumDriftWallCovers((extraTracks || []).concat(sourceTracks));
    scheduleDriftWallRefresh();
  });
}

async function openAlbumDetail(albumId) {
  console.log('[Album] openAlbumDetail called', { albumId });
  
  // 存储当前专辑 ID
  window.currentAlbumId = albumId;
  window.currentAlbumData = null;
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  resetAlbumDetailColors();
  
  document.getElementById('albumTrackList').innerHTML = '<div class="scroll-loading" aria-label="曲目加载中"></div>';

  // 从 localStorage 恢复专辑数据
  const saved = localStorage.getItem('melodybox_album_' + albumId);
  if (!saved) {
    document.getElementById('albumDetailCover').src = '';
    setShinyText('albumDetailTitle', '未知专辑');
    document.getElementById('albumDetailArtist').textContent = '';
    document.getElementById('albumDetailMeta').textContent = '';
    document.getElementById('albumTrackList').innerHTML = 
      '<p class="empty-state">专辑数据丢失，请重新收藏</p>';
    return;
  }

  let album;
  try { album = JSON.parse(saved); } catch (e) { album = {}; }

  const name = album.name || '未知专辑';
  const artist = typeof album.artist === 'object' ? (album.artist.name || '') : (album.artist || '');
  const picId = album.picId || ''; // 从保存的专辑数据中提取 picId
  const source = album.source || 'netease';
  const verifiedAlbumId = String(album.albumId || album.id || '');

  // 新收藏保存的是网易云真实 albumId，直接使用专辑端点，避免同名专辑被搜索结果混入。
  if (/^\d+$/.test(verifiedAlbumId)) {
    updateAlbumFavButton(verifiedAlbumId);
    await openAlbumByPicId(picId, '', name, artist, source, verifiedAlbumId);
    return;
  }
  
  // 旧收藏没有 albumId，只能保留按名称的兼容路径。
  if (picId) {
    updateAlbumFavButton(albumId);
    await openAlbumByName(name, artist, source, picId);
    return;
  }
  
  // 没有 picId，调用 openAlbumByName 重新从 API 获取
  updateAlbumFavButton(albumId);
  await openAlbumByName(name, artist, source, '');
  // openAlbumByName 会自己渲染曲目列表和设置封面，直接返回
  return;
}
function renderAlbumTracks(tracks) {
  var container = document.getElementById('albumTrackList');
  var html = '<div class="album-tracks-header">' +
    '<div class="album-tracks-header-left">' +
      '<span class="album-tracks-count">' + tracks.length + ' 首歌曲</span>' +
    '</div>' +
    '<div class="album-tracks-header-right" aria-hidden="true"></div>' +
  '</div>' +
  '<div class="album-tracks-list">';
  
  html += tracks.map(function(t, i) {
    var isPlaying = state.currentTrack && state.currentTrack.id == t.id;
    var playingClass = isPlaying ? ' playing' : '';
    var playingIndicator = isPlaying ? '<div class="track-playing-indicator"><span></span><span></span><span></span></div>' : '';
    var trackNum = isPlaying ? playingIndicator : '<span class="track-number">' + (i + 1) + '</span>';
    
    return '<div class="album-track-row' + playingClass + '" data-track-idx="' + i + '">' +
      '<div class="album-track-left">' +
        '<div class="album-track-number">' + trackNum + '</div>' +
        '<div class="album-track-info">' +
          '<div class="album-track-title">' + esc(t.title) + '</div>' +
          '<div class="album-track-artist">' + esc(t.artist) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="album-track-right">' +
        '<span class="album-track-duration">' + formatTime(t.duration || 0) + '</span>' +
        '<button class="album-track-more" onclick="event.stopPropagation(); showTrackOptions(' + i + ', this)">' +
          '<i class="fa-solid fa-ellipsis"></i>' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
  
  html += '</div>';
  container.innerHTML = html;
  revealContainer(container);
  
  container.querySelectorAll('.album-track-row').forEach(function(el) {
    el.addEventListener('click', function() {
      var idx = parseInt(el.dataset.trackIdx);
      var track = tracks[idx];
      if (track) {
        playTrack(track, idx);
        state.queue = tracks;
        state.queueIndex = idx;
      }
    });
    
    // 悬停效果：显示播放图标
    el.addEventListener('mouseenter', function() {
      var numEl = el.querySelector('.album-track-number');
      if (numEl && !el.classList.contains('playing')) {
        numEl.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });
    
    el.addEventListener('mouseleave', function() {
      var numEl = el.querySelector('.album-track-number');
      if (numEl && !el.classList.contains('playing')) {
        var idx = parseInt(el.dataset.trackIdx);
        numEl.innerHTML = '<span class="track-number">' + (idx + 1) + '</span>';
      }
    });
  });
  if (window.mountGlassSurfaces) window.mountGlassSurfaces();
}

// 通过 picId 获取专辑信息（最准确）
async function openAlbumByPicId(picId, songId, albumName, artistName, source, albumId) {
  console.log('[Album] openAlbumByPicId', { picId, songId, albumName, artistName, source, albumId });
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  
  const container = document.getElementById('albumTrackList');
  resetAlbumDetailColors();
  container.innerHTML = '<div class="scroll-loading" aria-label="曲目加载中"></div>';
  document.getElementById('albumDetailCover').src = '';
  setShinyText('albumDetailTitle', albumName || '专辑');
  document.getElementById('albumDetailArtist').textContent = artistName || '';
  document.getElementById('albumDetailMeta').textContent = '';
  
  try {
    // 构建API URL：优先使用 picId，没有的话用 songId
    let apiUrl = '/api/music/album?source=' + (source || 'netease') + '&limit=50';
    if (albumId) {
      apiUrl = '/api/album?id=' + encodeURIComponent(albumId) +
        '&name=' + encodeURIComponent(albumName || '') +
        '&artist=' + encodeURIComponent(artistName || '') +
        '&songId=' + encodeURIComponent(songId || '');
    } else if (picId) {
      apiUrl = '/api/music/album?picId=' + encodeURIComponent(picId) + '&album=' + encodeURIComponent(albumName || '') + '&artist=' + encodeURIComponent(artistName || '') + '&source=' + (source || 'netease') + '&limit=50';
    } else if (songId) {
      apiUrl = '/api/music/album?songId=' + encodeURIComponent(songId) + '&album=' + encodeURIComponent(albumName || '') + '&artist=' + encodeURIComponent(artistName || '') + '&source=' + (source || 'netease') + '&limit=50';
    } else {
      // 都没有，用专辑名搜索
      apiUrl = '/api/music/album?album=' + encodeURIComponent(albumName || '') + '&artist=' + encodeURIComponent(artistName || '') + '&source=' + (source || 'netease') + '&limit=30';
    }
    
    console.log('[Album] API URL:', apiUrl);
    
    const res = await fetch(apiUrl);
    
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const songs = data.songs || [];
    
    if (songs.length === 0) {
      container.innerHTML = '<p class="empty-state">未找到该专辑的曲目</p>';
      document.getElementById('albumDetailMeta').textContent = '未找到专辑信息';
      return;
    }
    
    // 标准化为 track 对象，并去重
    const seenIds = new Set();
    const tracks = [];
    for (const s of songs) {
      const tid = String(s.id || '');
      if (!tid || seenIds.has(tid)) continue;
      seenIds.add(tid);
      s.source = source || 'netease';
      s.picId = s.picId || '';
      tracks.push(normalizeTrack(s));
    }
    
    currentAlbumTracks = tracks;
    updateAlbumDriftWallCovers(tracks);
    loadDriftWallSourceCovers(tracks);
    
    // 专辑详情使用高分辨率封面，列表缩略图仍然使用 coverSmall。
    const albumCoverEl = document.getElementById('albumDetailCover');
    albumCoverEl.onload = function() { syncAlbumDetailColorsFromCover(this); };
    if (tracks[0] && (tracks[0].cover || tracks[0].coverSmall)) {
      albumCoverEl.src = tracks[0].cover || tracks[0].coverSmall;
    } else if (tracks[0] && tracks[0].picId) {
      albumCoverEl.src = '/api/music/cover?picId=' +
        encodeURIComponent(tracks[0].picId) + '&source=' + (source || 'netease') + '&size=1000';
    }
    if (albumCoverEl.complete) syncAlbumDetailColorsFromCover(albumCoverEl);
    albumCoverEl.dataset.artist = artistName || (tracks[0] && tracks[0].artist) || '';
    albumCoverEl.onerror = function() { fallbackCover(this); };
    
    // 更新专辑标题（使用API返回的准确专辑名）
    const accurateAlbumName = tracks[0].album || albumName;
    setShinyText('albumDetailTitle', accurateAlbumName);
    document.getElementById('albumDetailArtist').textContent = artistName || tracks[0].artist || '';
    document.getElementById('albumDetailMeta').textContent = tracks.length + ' 首';
    
    // 设置专辑收藏按钮
    const resolvedAlbumId = String(albumId || tracks[0]?.albumId || accurateAlbumName);
    window.currentAlbumId = resolvedAlbumId;
    window.currentAlbumData = {
      id: resolvedAlbumId,
      albumId: resolvedAlbumId,
      name: accurateAlbumName,
      artist: { name: artistName || tracks[0].artist || '' },
      cover: tracks[0] ? tracks[0].cover || tracks[0].coverSmall || '' : '',
      picId: tracks[0] ? tracks[0].picId || '' : '',
      source: source || 'netease',
      trackCount: tracks.length,
      tracks: tracks.map(function(t) { return { id: t.id, title: t.title, artist: t.artist }; }),
    };
    updateAlbumFavButton(resolvedAlbumId);
    
    // 渲染曲目列表
    renderAlbumTracks(tracks);
  } catch (e) {
    console.error('[Album] Error loading album:', e);
    container.innerHTML = '<p class="empty-state">加载专辑失败</p>';
    document.getElementById('albumDetailMeta').textContent = '加载失败';
  }
}

// 通过专辑名称搜索曲目（向后兼容）
async function openAlbumByName(albumName, artistName, source, picId) {
  console.log('[Album] openAlbumByName (fallback)', { albumName, artistName, source, picId });
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  
  const container = document.getElementById('albumTrackList');
  resetAlbumDetailColors();
  container.innerHTML = '<div class="scroll-loading" aria-label="曲目加载中"></div>';
  document.getElementById('albumDetailCover').src = '';
  setShinyText('albumDetailTitle', albumName || '专辑');
  document.getElementById('albumDetailArtist').textContent = artistName || '';
  document.getElementById('albumDetailMeta').textContent = '';
  
  try {
    // 向后兼容：没有 songId 时用专辑名
    const url = '/api/music/album?album=' + encodeURIComponent(albumName) +
      '&artist=' + encodeURIComponent(artistName || '') +
      '&source=' + (source || 'netease') + '&limit=30';
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const songs = data.songs || [];

    if (songs.length === 0) {
      container.innerHTML = '<p class="empty-state">未找到该专辑的曲目</p>';
      return;
    }

    // 标准化为 track 对象，并去重
    const seenIds = new Set();
    const tracks = [];
    for (const s of songs) {
      const tid = String(s.id || '');
      if (!tid || seenIds.has(tid)) continue;
      seenIds.add(tid);
      s.source = source || 'netease';
      s.picId = s.picId || '';
      tracks.push(normalizeTrack(s));
    }

    currentAlbumTracks = tracks;
    updateAlbumDriftWallCovers(tracks);
    loadDriftWallSourceCovers(tracks);

    // 旧收藏兼容路径同样优先使用高分辨率封面。
    const albumCoverEl = document.getElementById('albumDetailCover');
    albumCoverEl.onload = function() { syncAlbumDetailColorsFromCover(this); };
    if (tracks[0] && (tracks[0].cover || tracks[0].coverSmall)) {
      albumCoverEl.src = tracks[0].cover || tracks[0].coverSmall;
    } else if (tracks[0] && tracks[0].picId) {
      albumCoverEl.src = '/api/music/cover?picId=' +
        encodeURIComponent(tracks[0].picId) + '&source=' + (source || 'netease') + '&size=1000';
    }
    if (albumCoverEl.complete) syncAlbumDetailColorsFromCover(albumCoverEl);
    albumCoverEl.dataset.artist = artistName || (tracks[0] && tracks[0].artist) || '';
    albumCoverEl.onerror = function() { fallbackCover(this); };

    setShinyText('albumDetailTitle', albumName);
    document.getElementById('albumDetailArtist').textContent = artistName || tracks[0].artist || '';
    document.getElementById('albumDetailMeta').textContent = tracks.length + ' 首';

    // 设置专辑收藏按钮
    const resolvedAlbumId = String(tracks[0]?.albumId || albumName);
    window.currentAlbumId = resolvedAlbumId;
    window.currentAlbumData = {
      id: resolvedAlbumId,
      albumId: resolvedAlbumId,
      name: albumName,
      artist: { name: artistName || tracks[0].artist || '' },
      cover: tracks[0] ? tracks[0].cover || tracks[0].coverSmall || '' : '',
      picId: tracks[0] ? tracks[0].picId || '' : '',
      source: source || 'netease',
      trackCount: tracks.length,
      tracks: tracks.map(function(t) { return { id: t.id, title: t.title, artist: t.artist }; }),
    };
    updateAlbumFavButton(resolvedAlbumId);

    // 渲染曲目列表
    renderAlbumTracks(tracks);
  } catch (e) {
    console.error('[Album] Error loading album:', e);
    container.innerHTML = '<p class="empty-state">加载专辑失败</p>';
  }
}

function playAlbumAll() {
  if (!currentAlbumTracks.length) return;
  var track = currentAlbumTracks[0];
  playTrack(track, 0);
  state.queue = currentAlbumTracks;
  state.queueIndex = 0;
}

// 打开艺人详情页
var currentArtistTracks = [];
var currentArtistFeaturedTracks = [];
var currentArtistLatestTracks = [];
var currentArtistOtherTracks = [];
var currentArtistName = '';
var currentArtistOffset = 0;
var currentArtistHasMore = true;
const ARTIST_PAGE_SIZE = 60;

function resetArtistPageColors() {
  var page = document.getElementById('page-artist-detail');
  var shell = document.querySelector('.main-content');
  [page, shell].forEach(function(el) {
    if (!el) return;
    ['--artist-primary-rgb', '--artist-secondary-rgb', '--artist-tertiary-rgb', '--artist-text-color', '--artist-muted-color', '--artist-line-color'].forEach(function(name) {
      el.style.removeProperty(name);
    });
  });
}

function applyArtistPageColors(colors) {
  if (!colors) return;
  var page = document.getElementById('page-artist-detail');
  var shell = document.querySelector('.main-content');
  if (!page) return;
  var primary = colors.primary || { r: 70, g: 70, b: 80 };
  var secondary = colors.secondary || primary;
  var tertiary = colors.tertiary || { r: 18, g: 18, b: 24 };
  var p = primary.r + ', ' + primary.g + ', ' + primary.b;
  var s = secondary.r + ', ' + secondary.g + ', ' + secondary.b;
  var t = tertiary.r + ', ' + tertiary.g + ', ' + tertiary.b;
  var luminance = (primary.r * 299 + primary.g * 587 + primary.b * 114) / 1000;
  var light = luminance > 150;
  var text = light ? '#241f2a' : '#ffffff';
  var muted = light ? 'rgba(36, 31, 42, .68)' : 'rgba(255, 255, 255, .72)';
  var line = light ? 'rgba(36, 31, 42, .16)' : 'rgba(255, 255, 255, .16)';
  [page, shell].forEach(function(el) {
    if (!el) return;
    el.style.setProperty('--artist-primary-rgb', p);
    el.style.setProperty('--artist-secondary-rgb', s);
    el.style.setProperty('--artist-tertiary-rgb', t);
    el.style.setProperty('--artist-text-color', text);
    el.style.setProperty('--artist-muted-color', muted);
    el.style.setProperty('--artist-line-color', line);
  });
}

function renderArtistSections() {
  renderScrollRow('#artistFeaturedList', currentArtistFeaturedTracks);
  renderTrackList('#artistLatestList', currentArtistLatestTracks);
  renderTrackList('#artistOtherList', currentArtistOtherTracks);
  bindArtistFeaturedCards();
}

function openRepresentativeAlbum(track) {
  if (!track) return;
  var albumName = track.album || track.title || '专辑';
  var artistName = track.artist || '';
  if (track.picId || track.albumId) {
    openAlbumByPicId(track.picId || '', track.id || '', albumName, artistName, track.source || 'netease', track.albumId || '');
  } else {
    openAlbumByName(albumName, artistName, track.source || 'netease', '');
  }
}

function bindArtistFeaturedCards() {
  var container = document.getElementById('artistFeaturedList');
  if (!container || container._albumBound) return;
  container._albumBound = true;
  container.addEventListener('click', function(event) {
    var card = event.target.closest('.am-card');
    if (!card) return;
    var track = trackMap.get(card.dataset.trackId);
    if (!track) return;
    event.preventDefault();
    openRepresentativeAlbum(track);
  });
}

async function openArtistPage(artistName) {
  if (!artistName) return;
  currentArtistName = artistName;
  currentArtistOffset = 0;
  currentArtistHasMore = true;
  resetArtistPageColors();
  navigateTo('artist-detail');
  setShinyText('artistDetailName', artistName);
  document.getElementById('artistDetailMeta').textContent = '';
  document.getElementById('artistFeaturedList').innerHTML = '<div class="scroll-loading" aria-label="代表作加载中"></div>';
  document.getElementById('artistLatestList').innerHTML = '<div class="scroll-loading" aria-label="歌曲加载中"></div>';
  document.getElementById('artistOtherList').innerHTML = '<div class="scroll-loading" aria-label="歌曲加载中"></div>';
  document.getElementById('artistBioSummary').textContent = '';
  document.getElementById('artistBioContent').innerHTML = '';
  document.getElementById('artistBioDetails').open = false;
  var ai = document.getElementById('artistAvatar'), af = document.getElementById('artistAvatarFallback');
  if (ai) ai.style.display = 'none';
  if (af) af.style.display = 'flex';
  var bg = document.getElementById('artistBg');
  if (bg) {
    bg.style.backgroundImage = '';
    bg.style.display = 'block';
  }
  try {
    var data = await Promise.all([
      fetch('/api/music/search?keywords='+encodeURIComponent(artistName)+'&source=netease&limit='+ARTIST_PAGE_SIZE).then(r=>r.json()).then(d=>d.songs||[]).catch(()=>[]),
      fetch('/api/music/artist?name='+encodeURIComponent(artistName)+'&source=netease&limit='+ARTIST_PAGE_SIZE).then(r=>r.json()).catch(()=>({ songs: [], hasMore: false }))
    ]);
    var fs = data[0], artistPage = data[1] || {}, as = artistPage.songs || [];
    var normalizeArtistTracks = function(list) {
      var localSeen = new Set();
      return list.map(function(s) {
        if (localSeen.has(s.id)) return null;
        localSeen.add(s.id);
        s.source = 'netease';
        s.picId = s.picId || '';
        return normalizeTrack(s);
      }).filter(Boolean);
    };
    // Search results provide representative works; the artist endpoint provides
    // the source's latest ordering. Remaining unique songs form the full list.
    var searchTracks = normalizeArtistTracks(fs);
    var artistTracks = normalizeArtistTracks(as);
    currentArtistFeaturedTracks = searchTracks.slice(0, 6);
    var featuredIds = new Set(currentArtistFeaturedTracks.map(function(track) { return track.id; }));
    // Some artists are missing from the upstream artist endpoint. Keep the
    // latest section useful by falling back to the ordered search response.
    var latestPool = artistTracks.length ? artistTracks : searchTracks;
    currentArtistLatestTracks = latestPool.filter(function(track) { return !featuredIds.has(track.id); }).slice(0, 8);
    var sectionIds = new Set(currentArtistFeaturedTracks.concat(currentArtistLatestTracks).map(function(track) { return track.id; }));
    currentArtistOtherTracks = artistTracks.concat(searchTracks).filter(function(track) {
      if (sectionIds.has(track.id)) return false;
      sectionIds.add(track.id);
      return true;
    });
    currentArtistTracks = currentArtistFeaturedTracks.concat(currentArtistLatestTracks, currentArtistOtherTracks);
    currentArtistOffset = Number.isFinite(Number(artistPage.nextOffset)) ? Number(artistPage.nextOffset) : as.length;
    currentArtistHasMore = artistPage.hasMore === true;
    document.getElementById('artistDetailMeta').textContent = '';
    // 后台加载头像和简介（不阻塞歌曲列表）
    loadArtistPhoto(artistName, currentArtistTracks);
    loadArtistBio(artistName, currentArtistTracks);
    if (!currentArtistTracks.length) {
      renderArtistSections();
      return;
    }
    addToQueue(currentArtistTracks);
    renderArtistSections();
    // 添加"加载更多"按钮
    if (currentArtistHasMore) {
      addLoadMoreButton();
    }
  } catch(e) {
    console.error('[Artist] Error:',e.message);
    document.getElementById('artistFeaturedList').innerHTML = '<p class="empty-state">加载失败</p>';
    document.getElementById('artistLatestList').innerHTML = '';
    document.getElementById('artistOtherList').innerHTML = '';
  }
}

// 添加"加载更多"按钮
function addLoadMoreButton() {
  var container = document.getElementById('artistOtherList');
  if (!container) return;
  
  // 移除已有的"加载更多"按钮
  var existingBtn = document.getElementById('loadMoreArtistBtn');
  if (existingBtn) existingBtn.remove();
  
  // 创建"加载更多"按钮
  var loadMoreBtn = document.createElement('div');
  loadMoreBtn.id = 'loadMoreArtistBtn';
  loadMoreBtn.className = 'load-more-btn';
  loadMoreBtn.innerHTML = '<button class="btn-save" style="width:100%;padding:12px;margin-top:16px;background:var(--neon-cyan);color:#000;font-weight:600;border:none;border-radius:8px;cursor:pointer;">加载更多歌曲</button>';
  loadMoreBtn.querySelector('button').addEventListener('click', loadMoreArtistSongs);
  container.appendChild(loadMoreBtn);
}

// 加载更多艺人歌曲
async function loadMoreArtistSongs() {
  if (!currentArtistHasMore || !currentArtistName) return;
  
  var btn = document.getElementById('loadMoreArtistBtn');
  if (btn) {
    btn.querySelector('button').textContent = '';
    btn.querySelector('button').disabled = true;
  }
  
  try {
    var data = await fetch('/api/music/artist?name='+encodeURIComponent(currentArtistName)+'&source=netease&limit='+ARTIST_PAGE_SIZE+'&offset='+currentArtistOffset).then(r=>r.json()).catch(()=>({ songs: [], hasMore: false }));
    var newSongs = data.songs || [];
    currentArtistOffset = Number.isFinite(Number(data.nextOffset)) ? Number(data.nextOffset) : currentArtistOffset + newSongs.length;
    currentArtistHasMore = data.hasMore === true;
    
    if (!newSongs.length) {
      if (currentArtistHasMore) addLoadMoreButton();
      else if (btn) btn.remove();
      return;
    }
    
    // 过滤掉已存在的歌曲
    var seen = new Set(currentArtistTracks.map(function(t) { return t.id; }));
    var newTracks = [];
    newSongs.forEach(function(s) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        s.source = 'netease';
        s.picId = s.picId || '';
        newTracks.push(normalizeTrack(s));
      }
    });
    
    if (!newTracks.length) {
      if (currentArtistHasMore) addLoadMoreButton();
      else if (btn) btn.remove();
      return;
    }
    
    // 新分页结果属于“其他歌曲”，代表作和最新歌曲保持稳定。
    currentArtistOtherTracks = currentArtistOtherTracks.concat(newTracks);
    currentArtistTracks = currentArtistFeaturedTracks.concat(currentArtistLatestTracks, currentArtistOtherTracks);
    document.getElementById('artistDetailMeta').textContent = '';
    
    // 重新渲染整个列表
    renderArtistSections();
    
    // 添加到播放队列
    addToQueue(newTracks);
    
    // 重新添加"加载更多"按钮
    if (currentArtistHasMore) {
      addLoadMoreButton();
    }
  } catch(e) {
    console.error('[Artist] Load more error:', e.message);
    if (btn) {
      btn.querySelector('button').textContent = '加载失败，点击重试';
      btn.querySelector('button').disabled = false;
    }
  }
}

async function loadArtistPhoto(artistName, tracks) {
  var ai = document.getElementById('artistAvatar'), af = document.getElementById('artistAvatarFallback'), bg = document.getElementById('artistBg');
  // 优先通过网易云艺人详情 API 获取真实头像和背景
  try {
    var res = await fetch('/api/music/artist-info?name=' + encodeURIComponent(artistName));
    if (res.ok) {
      var info = await res.json();
      if (info.avatar && ai) {
        ai.src = info.avatar; ai.style.display = 'block';
        ai.onload = function(){if(af)af.style.display='none';};
        ai.onerror = function(){ai.style.display='none';if(af)af.style.display='flex';};
        var colorSource = '/api/cover?size=1000&url=' + encodeURIComponent(info.avatar);
        extractAlbumColors(colorSource, applyArtistPageColors);
      }
      // 背景使用网易云艺人艺术大图，回退到头像；它只存在于奶油白 hero 层内。
      var bgUrl = '/api/artist-photo?name=' + encodeURIComponent(artistName);
      if (bgUrl && bg) {
        bg.style.backgroundImage = 'url(' + bgUrl + ')';
        bg.style.display = 'block';
      }
      if (info.avatar && ai) return;
    }
  } catch(e) {}
  // 降级：用第一首歌封面
  if (tracks.length && ai) {
    var cover = tracks[0].coverSmall || tracks[0].cover || '';
      if (cover) {
        ai.src = cover; ai.style.display = 'block';
        extractAlbumColors(cover, applyArtistPageColors);
        ai.onload = function(){if(af)af.style.display='none';if(bg){bg.style.backgroundImage='url('+cover+')';bg.style.display='block';}};
      ai.onerror = function(){ai.style.display='none';if(af)af.style.display='flex';};
    }
  }
}

async function loadArtistBio(artistName, tracks) {
  try {
    var bioParts = [];
    // 网易云简介通常较短，但能保证中文歌手有准确的一手描述。
    try {
      var infoRes = await fetch('/api/music/artist-info?name=' + encodeURIComponent(artistName));
      if (infoRes.ok) {
        var info = await infoRes.json();
        if (info.desc && info.desc.length >= 10) bioParts.push(info.desc.trim());
      }
    } catch(e) {}

    // 使用 Wikipedia 完整 extract，不再只取一段导语。
    var ac = new AbortController(), t = setTimeout(function(){ac.abort();}, 8000), bio = null;
    try {
      var wikiUrl = 'https://zh.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&exchars=30000&format=json&origin=*&titles=' + encodeURIComponent(artistName);
      var r = await fetch(wikiUrl,{signal:ac.signal}); clearTimeout(t);
      if (r.ok) { var d = await r.json(), pages = d.query && d.query.pages; if (pages) { var p = Object.values(pages)[0]; if (p && !p.missing && p.extract) bio = p.extract.replace(/<[^>]*>/g,'').trim(); } }
    } catch(e) { clearTimeout(t); }
    if (bio && bio.length >= 20 && !bioParts.some(function(part){ return part === bio; })) bioParts.push(bio);

    if (!bioParts.length) {
      var titles = tracks.slice(0, 8).map(function(t){return t.title;}).join('、');
      bioParts.push(artistName + '的代表作品包括《' + titles + '》。');
    }

    var summary = bioParts[0].replace(/\s+/g, ' ').trim();
    var summaryEl = document.getElementById('artistBioSummary');
    var contentEl = document.getElementById('artistBioContent');
    if (summaryEl) summaryEl.textContent = summary.length > 420 ? summary.slice(0, 420) + '…' : summary;
    if (contentEl) {
      contentEl.innerHTML = bioParts.join('\n\n').split(/\n{2,}/).map(function(paragraph){
        return '<p>' + esc(paragraph.trim()) + '</p>';
      }).join('');
    }
    var detailsEl = document.getElementById('artistBioDetails');
    if (detailsEl && contentEl && contentEl.textContent.trim()) detailsEl.open = true;
  } catch(e) {
    var summaryFallback = document.getElementById('artistBioSummary');
    if (summaryFallback) summaryFallback.textContent = '暂无简介';
  }
}

// 显示歌曲选项菜单
function showTrackOptions(trackIndex, trigger) {
  var track = currentAlbumTracks[trackIndex];
  if (!track) return;

  // Clicking the same ellipsis toggles its menu; another row replaces it.
  var existingMenu = document.querySelector('.track-options-menu');
  if (existingMenu && existingMenu.dataset.trackIndex === String(trackIndex)) {
    if (existingMenu._closeHandler) document.removeEventListener('click', existingMenu._closeHandler);
    existingMenu.remove();
    return;
  }
  if (existingMenu) {
    if (existingMenu._closeHandler) document.removeEventListener('click', existingMenu._closeHandler);
    existingMenu.remove();
  }
  
  // 创建选项菜单
  var menu = document.createElement('div');
  menu.className = 'track-options-menu';
  menu.dataset.trackIndex = String(trackIndex);
  menu.innerHTML = `
    <div class="track-options-item" onclick="addAlbumTrackToQueue(${trackIndex}); this.parentElement.remove();">
      <i class="fa-solid fa-plus"></i> 添加到队列
    </div>
    <div class="track-options-item" onclick="addToPlaylistPrompt(${trackIndex}); this.parentElement.remove();">
      <i class="fa-solid fa-list"></i> 添加到播放列表
    </div>
    <div class="track-options-item" onclick="var t=currentAlbumTracks[${trackIndex}]; if(t) toggleFavorite(t); this.parentElement.remove();">
      <i class="fa-regular fa-heart"></i> 收藏歌曲
    </div>
    <div class="track-options-item" onclick="navigator.share ? navigator.share({title: '${esc(track.title)}', text: '${esc(track.artist)}', url: window.location.href}) : showToast('分享链接已复制'); this.parentElement.remove();">
      <i class="fa-solid fa-share"></i> 分享
    </div>
  `;
  
  // 添加到页面
  document.body.appendChild(menu);
  if (window.mountGlassSurfaces) window.mountGlassSurfaces();
  
  // 定位菜单
  var btn = trigger || (typeof event !== 'undefined' && event.target?.closest('.album-track-more'));
  if (btn) {
    var rect = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 8 + 'px';
    menu.style.right = '20px';
  }
  
  // 点击其他地方关闭菜单；切换到另一行时同步清理旧监听器。
  var closeMenu = function(e) {
    if (e.target.closest && (e.target.closest('.track-options-menu') || e.target.closest('.album-track-more'))) return;
    menu.remove();
    document.removeEventListener('click', closeMenu);
  };
  menu._closeHandler = closeMenu;
  setTimeout(() => document.addEventListener('click', closeMenu), 10);
}

// 添加到队列
function addAlbumTrackToQueue(trackIndex) {
  var track = currentAlbumTracks[trackIndex];
  if (!track) return;
  
  if (!state.queue.includes(track)) {
    state.queue.push(track);
    showToast('已添加到队列');
  } else {
    showToast('歌曲已在队列中');
  }
}

// 添加到播放列表提示
function addToPlaylistPrompt(trackIndex) {
  var track = currentAlbumTracks[trackIndex];
  if (!track) return;
  
  if (state.playlists.length === 0) {
    showToast('请先创建播放列表');
    return;
  }
  
  // 添加到第一个播放列表
  var playlist = state.playlists[0];
  if (!playlist.tracks) playlist.tracks = [];
  if (!playlist.tracks.includes(track.id)) {
    playlist.tracks.push(track.id);
    cacheTrack(track);  // 缓存歌曲数据
    showToast('已添加到 "' + playlist.name + '"');
    saveAll();
  } else {
    showToast('歌曲已在播放列表中');
  }
}

// ============================================
// 专辑收藏功能 (Album Favorites)
// ============================================

// 检查专辑是否已收藏
function isAlbumFavorited(albumId) {
  return state.albumFavorites.has(String(albumId));
}

// 切换专辑收藏状态
function toggleAlbumFavorite(albumId, albumData) {
  albumId = String(albumId);
  
  if (state.albumFavorites.has(albumId)) {
    // 取消收藏：只从 Set 中移除，保留 localStorage 数据以便再收藏时恢复封面
    state.albumFavorites.delete(albumId);
    showToast('已取消收藏');
  } else {
    // 添加收藏
    state.albumFavorites.add(albumId);
    // 保存专辑数据：如果没有传入数据，尝试从 localStorage 恢复
    if (!albumData) {
      try {
        const saved = localStorage.getItem('melodybox_album_' + albumId);
        if (saved) albumData = JSON.parse(saved);
      } catch (e) {}
    }
    if (albumData) {
      localStorage.setItem('melodybox_album_' + albumId, JSON.stringify(albumData));
    }
    showToast('已收藏到专辑');
  }
  
  saveAll();
  updateAlbumFavButton(albumId);
}

// 更新专辑收藏按钮状态
function updateAlbumFavButton(albumId) {
  const btn = document.getElementById('albumFavBtn');
  if (!btn) return;
  
  if (isAlbumFavorited(albumId)) {
    btn.classList.add('favorited');
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    btn.title = '取消收藏';
  } else {
    btn.classList.remove('favorited');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    btn.title = '收藏专辑';
  }
}

// 渲染专辑收藏页面（网格视图）
async function renderAlbumFavorites() {
  const container = document.getElementById('albumGrid');
  if (!container) return;
  
  // 获取所有收藏的专辑 ID
  const albumIds = [...state.albumFavorites];
  const albumCount = document.getElementById('albumCount');
  if (albumCount) albumCount.textContent = albumIds.length + ' 张专辑';
  
  if (!albumIds.length) {
    container.innerHTML = '<div class="empty-state"><i class="fa-regular fa-bookmark"></i><p>还没有收藏专辑</p><span>在专辑详情页点击心形按钮即可收藏。</span></div>';
    return;
  }
  
  // 从 localStorage 获取专辑数据
  const albums = [];
  for (const id of albumIds) {
    const data = localStorage.getItem('melodybox_album_' + id);
    if (data) {
      try {
        albums.push(JSON.parse(data));
      } catch (e) {}
    }
  }
  
  if (!albums.length) {
    container.innerHTML = '<p class="empty-state">专辑数据加载失败</p>';
    return;
  }
  
  // 渲染网格
  const html = albums.map(album => {
    const albumId = album.id || album.albumId;
    return '<div class="album-card" data-album-id="' + albumId + '">' +
      '<img class="album-card-cover" src="' + fixCoverUrl(album.picUrl || album.cover || '') + '" alt="" loading="lazy" data-artist="' + esc(typeof album.artist === 'object' ? album.artist.name || '' : album.artist || '') + '" data-album="' + esc(album.name || '') + '" onerror="fallbackCover(this)">' +
      '<div class="album-card-info">' +
        '<div class="album-card-title">' + esc(album.name || '未知专辑') + '</div>' +
        '<div class="album-card-artist">' + esc((album.artist || {}).name || album.artist || '未知歌手') + '</div>' +
        '<div class="album-card-meta">' + (album.size || album.trackCount || 0) + ' 首歌曲</div>' +
      '</div>' +
      '<button class="album-card-delete" data-album-id="' + albumId + '" title="取消收藏">' +
        '<i class="fa-solid fa-xmark"></i>' +
      '</button>' +
    '</div>';
  }).join('');
  
  container.innerHTML = html;
  
  // 添加点击事件
  container.querySelectorAll('.album-card').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.closest('.album-card-delete')) return;
      const albumId = el.dataset.albumId;
      if (albumId) openAlbumDetail(albumId);
    });
  });
  
  // 添加删除按钮事件
  container.querySelectorAll('.album-card-delete').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const albumId = el.dataset.albumId;
      toggleAlbumFavorite(albumId);
      renderAlbumFavorites();
    });
  });
}

// ==================== Cover Flow — iPod 风格交互式 3D 轮播 ====================
let cfAlbums = [];
let cfOffset = 0;
let cfVelocity = 0;
let cfDragging = false;
let cfDragStartX = 0;
let cfDragStartOffset = 0;
let cfLastX = 0;
let cfLastTime = 0;
let cfAnimId = null;
let cfItems = {};
let cfReflections = {};
let cfHoverTimer = null;
let cfActiveIndex = -1;
let cfCleanupHandlers = [];
let cfDragMoved = false;
let cfPointerId = null;
let cfSnapTarget = null;
let cfSpringVelocity = 0;
let cfLastFrameTime = 0;
// Keep the center cover readable while tightening the rail around it. The
// drag step follows the visual width so a one-cover swipe still feels 1:1.
const CF_ITEM_W = 200;
const CF_ITEM_H = 200;
const CF_DRAG_STEP = 138;
const CF_RANGE = 8;

function cfRubberband(value, dimension = 1, constant = 0.55) {
  return (value * dimension * constant) / (dimension + constant * Math.abs(value));
}

function cfAlbumKey(album) {
  if (!album) return '';
  const id = album.id || album.albumId;
  if (id) return 'id:' + String(id);
  const name = album.name || album.album || '';
  const artist = typeof album.artist === 'object' ? album.artist.name : album.artist;
  return 'name:' + String(name).trim().toLowerCase() + '|artist:' + String(artist || '').trim().toLowerCase();
}

function cfMergeAlbums(albums) {
  const merged = new Map(cfAlbums.map(album => [cfAlbumKey(album), album]));
  (albums || []).forEach(album => {
    const key = cfAlbumKey(album);
    if (key && !merged.has(key)) {
      merged.set(key, album);
      const albumId = album.id || album.albumId;
      if (albumId) {
        try { localStorage.setItem('melodybox_album_' + albumId, JSON.stringify(album)); } catch (e) {}
      }
    }
  });
  cfAlbums = Array.from(merged.values());
}

function cfLoadAlbums() {
  const albums = [];
  const albumIds = [...state.albumFavorites];
  for (const id of albumIds) {
    const data = localStorage.getItem('melodybox_album_' + id);
    if (data) {
      try { albums.push(JSON.parse(data)); } catch (e) {}
    }
  }
  cfAlbums = [];
  cfMergeAlbums(albums);
}

function cfBuildStage() {
  const stage = document.getElementById('coverFlowStage');
  const reflection = document.getElementById('coverFlowReflection');
  const info = document.getElementById('coverFlowInfo');
  const hint = document.getElementById('coverFlowHint');
  
  stage.innerHTML = '';
  reflection.innerHTML = '';
  info.innerHTML = '';
  hint.style.opacity = '0';
  cfItems = {};
  cfReflections = {};
  cfSnapTarget = null;
  cfSpringVelocity = 0;
  
  if (!cfAlbums.length) {
    stage.innerHTML = '<p class="empty-state" style="position:static;width:100%;color:var(--text-secondary)">还没有收藏专辑</p>';
    return;
  }
  
  cfAlbums.forEach((album, i) => {
    // 封面 URL：一次准备好足够清晰的正面图，切换时不再临时换源。
    var cover = (album.picUrl || album.cover || '');
    // 初始加载用 640px（2x/3x Retina 屏幕下 240px 容器需要更高分辨率）
    var coverSmall = cover;
    if (cover && cover.indexOf('/api/music/cover') === -1 && cover.indexOf('?') === -1) {
      coverSmall = cover + '?param=640y640';
    }
    // 倒影使用更高分辨率资源；正面保持单一来源，避免切换时解码卡顿。
    var coverLarge = cover;
    if (cover && cover.indexOf('/api/music/cover') === -1 && cover.indexOf('?') === -1) {
      coverLarge = cover + '?param=1280y1280';
    }
    var albumId = album.id || album.albumId;
    var albumName = album.name || '';

    // ---- 实体专辑封套 (vinyl sleeve) ----
    const item = document.createElement('div');
    item.className = 'cf-item';
    item.dataset.index = i;
    item.dataset.albumId = albumId;
    item.dataset.coverLarge = coverLarge; // 保存大图 URL

    // 正面封面（先用小图快速显示）
    const front = document.createElement('div');
    front.className = 'cf-front';
    front.innerHTML = '<img src="' + coverSmall + '" alt="" draggable="false">';
    item.appendChild(front);
    
    // 右侧脊 (可见于左旋)
    const spineR = document.createElement('div');
    spineR.className = 'cf-spine cf-spine-r';
    spineR.innerHTML = '<span class="cf-spine-text">' + esc(albumName) + '</span>';
    item.appendChild(spineR);
    
    // 左侧脊 (可见于右旋)
    const spineL = document.createElement('div');
    spineL.className = 'cf-spine cf-spine-l';
    spineL.innerHTML = '<span class="cf-spine-text">' + esc(albumName) + '</span>';
    item.appendChild(spineL);
    
    // 顶脊
    const spineT = document.createElement('div');
    spineT.className = 'cf-spine cf-spine-t';
    item.appendChild(spineT);
    
    // 底脊
    const spineB = document.createElement('div');
    spineB.className = 'cf-spine cf-spine-b';
    item.appendChild(spineB);
    
    // 外层塑料封套高光
    const glare = document.createElement('div');
    glare.className = 'cf-glare';
    item.appendChild(glare);
    
    // 内页纸张纹理
    const paperEdge = document.createElement('div');
    paperEdge.className = 'cf-paper-edge';
    item.appendChild(paperEdge);
    
    item.addEventListener('click', (e) => {
      // 只处理非拖动情况：点击居中的专辑
      if (cfDragging || cfDragMoved) return;
      const dist = Math.abs(i - cfOffset);
      if (dist < 0.7) {
        cfSnapTo(i);
      }
    });
    stage.appendChild(item);
    cfItems[i] = item;
    
    // 倒影（用高清大图，和正面保持同步）
    const ref = document.createElement('div');
    ref.className = 'cf-reflection-item';
    ref.dataset.coverLarge = coverLarge;
    ref.innerHTML = '<img src="' + coverLarge + '" alt="" draggable="false">';
    reflection.appendChild(ref);
    cfReflections[i] = ref;
  });
  
  cfOffset = Math.floor(cfAlbums.length / 2);
  cfActiveIndex = Math.round(cfOffset);
  cfUpdateInfo();
}

function cfOpenAlbum(albumId) {
  if (!albumId) return;
  // 停止 cover flow 动画
  cfStop();
  openAlbumDetail(albumId);
}

function cfSnapTo(index) {
  cfSnapTarget = Math.max(0, Math.min(cfAlbums.length - 1, index));
  // Keep a small amount of the current gesture velocity when keyboard/buttons
  // retarget the rail, so an interrupted motion does not hit a hard stop.
  cfSpringVelocity = Math.max(-10, Math.min(10, cfVelocity * 60));
  cfVelocity = 0;
  cfDragging = false;
}

function cfUpdateInfo() {
  const info = document.getElementById('coverFlowInfo');
  const hint = document.getElementById('coverFlowHint');
  if (!info) return;
  
  const idx = Math.round(cfOffset);
  if (idx === cfActiveIndex && info.innerHTML) return;
  cfActiveIndex = idx;
  
  if (idx >= 0 && idx < cfAlbums.length) {
    const album = cfAlbums[idx];
    info.innerHTML = '<h2>' + esc(album.name || '未知专辑') + '</h2>' +
      '<p>' + esc((album.artist || {}).name || album.artist || '未知歌手') + '</p>';
  }
  
  // 重置 hover 提示
  if (hint) hint.style.opacity = '0';
  if (cfHoverTimer) { clearTimeout(cfHoverTimer); cfHoverTimer = null; }
}

function cfRender(dt = 1 / 60) {
  if (!cfAlbums.length) return;
  
  // Critically damped, time-based spring. This keeps the same feel at 60Hz
  // and 120Hz and lets a release velocity flow directly into the snap.
  if (!cfDragging && cfSnapTarget !== null) {
    const diff = cfSnapTarget - cfOffset;
    cfSpringVelocity += (diff * 150 - cfSpringVelocity * 24) * dt;
    cfOffset += cfSpringVelocity * dt;
    if (Math.abs(diff) < 0.0008 && Math.abs(cfSpringVelocity) < 0.01) {
      cfOffset = cfSnapTarget;
      cfSnapTarget = null;
      cfSpringVelocity = 0;
    }
  }
  if (!cfDragging) cfOffset = Math.max(0, Math.min(cfAlbums.length - 1, cfOffset));
  
  // 渲染每个 item
  for (let i = 0; i < cfAlbums.length; i++) {
    const dist = i - cfOffset;
    const absDist = Math.abs(dist);
    const item = cfItems[i];
    const ref = cfReflections[i];
    if (!item) continue;
    
    if (absDist > CF_RANGE) {
      item.style.display = 'none';
      if (ref) ref.style.display = 'none';
      continue;
    }
    
    item.style.display = '';
    if (ref) ref.style.display = '';
    
    const sign = dist < 0 ? -1 : dist > 0 ? 1 : 0;
    // 经典 Cover Flow：中心封面正面，侧面封面沿一条水平轨道旋入。
    const ry = -sign * 68 * (1 - Math.exp(-absDist * 2.35));
    const tx = sign * (CF_ITEM_W * 0.52 + Math.max(0, absDist - 1) * 25);

    // 深度：越远越往后
    const tz = -absDist * 110;

    // 缩放：侧面时略小
    const s = Math.max(0.56, 1 - absDist * 0.085);

    // 透明度
    const op = Math.max(0.2, 1 - absDist * 0.16);

    // Depth is expressed through geometry and opacity. Avoid changing image
    // filters every frame; that forces repeated GPU filter passes while drag.
    
    const t = 'translate3d(' + tx.toFixed(1) + 'px,0,' + tz.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
    item.style.transform = t;
    item.style.opacity = op.toFixed(3);
    item.style.zIndex = Math.round(1000 - absDist * 180);
    
    // 脊的模糊随角度增大，正面完全隐藏
    const spineOpacity = Math.max(0, Math.min(1, (absDist - 0.08) / 0.45));
    const spines = item.querySelectorAll('.cf-spine');
    spines.forEach(s => {
      s.style.opacity = spineOpacity.toFixed(3);
    });
    
    if (absDist < 0.55) {
      item.classList.add('cf-active');
    } else {
      item.classList.remove('cf-active');
    }
    
    // 倒影
    if (ref) {
      const rt = 'translate3d(' + tx.toFixed(1) + 'px,0,' + tz.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) scaleY(' + (-s).toFixed(3) + ') scaleX(' + s.toFixed(3) + ')';
      ref.style.transform = rt;
      ref.style.opacity = (op * 0.4).toFixed(3);
      ref.style.zIndex = Math.round(900 - absDist * 180);
    }
  }
  
  cfUpdateInfo();
}

function cfLoop(time) {
  if (!cfLastFrameTime) cfLastFrameTime = time;
  const dt = Math.min(0.032, Math.max(0.001, (time - cfLastFrameTime) / 1000));
  cfLastFrameTime = time;
  cfRender(dt);
  cfAnimId = requestAnimationFrame(cfLoop);
}

function cfStart() {
  cfLoadAlbums();
  cfBuildStage();
  cfActiveIndex = -1;
  cfLastFrameTime = 0;
  cfAnimId = requestAnimationFrame(cfLoop);
  cfBindMouse();
}

function cfStop() {
  if (cfAnimId) { cancelAnimationFrame(cfAnimId); cfAnimId = null; }
  cfUnbindMouse();
  cfDragging = false;
  cfPointerId = null;
  cfVelocity = 0;
  cfSnapTarget = null;
  cfSpringVelocity = 0;
  cfLastFrameTime = 0;
  if (cfHoverTimer) { clearTimeout(cfHoverTimer); cfHoverTimer = null; }
}

function cfBindMouse() {
  cfUnbindMouse();
  const container = document.getElementById('coverFlowContainer');
  if (!container) return;

  const onDown = (e) => {
    if (e.target.closest('.cf-nav-btn') || (e.pointerType === 'mouse' && e.button !== 0)) return;
    cfDragging = true;
    cfDragMoved = false;
    cfPointerId = e.pointerId;
    cfDragStartX = e.clientX;
    cfDragStartOffset = cfOffset;
    cfLastX = cfDragStartX;
    cfLastTime = performance.now();
    cfVelocity = 0;
    cfSnapTarget = null;
    cfSpringVelocity = 0;
    container.style.cursor = 'grabbing';
    container.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const onMove = (e) => {
    if (!cfDragging || e.pointerId !== cfPointerId) return;
    const x = e.clientX;
    const dx = x - cfDragStartX;
    if (Math.abs(dx) > 8) cfDragMoved = true;
    cfOffset = cfDragStartOffset - dx / CF_DRAG_STEP;

    const now = performance.now();
    const dt = now - cfLastTime;
    if (dt > 0) {
      const instantaneous = -(x - cfLastX) / CF_DRAG_STEP / (dt / 16.67);
      cfVelocity = cfVelocity * 0.65 + instantaneous * 0.35;
    }
    cfLastX = x;
    cfLastTime = now;
    if (cfOffset < 0) cfOffset = -cfRubberband(-cfOffset, 1, 0.42);
    if (cfOffset > cfAlbums.length - 1) {
      cfOffset = cfAlbums.length - 1 + cfRubberband(cfOffset - (cfAlbums.length - 1), 1, 0.42);
    }
    e.preventDefault();
  };

  const onUp = (e) => {
    if (!cfDragging || e.pointerId !== cfPointerId) return;
    cfDragging = false;
    cfPointerId = null;
    container.style.cursor = '';
    container.releasePointerCapture?.(e.pointerId);
    const projected = cfOffset + cfVelocity * 8;
    cfSnapTarget = Math.max(0, Math.min(cfAlbums.length - 1, Math.round(projected)));
    cfSpringVelocity = Math.max(-10, Math.min(10, cfVelocity * 60));
    cfVelocity = 0;
    // 如果几乎没有拖动，触发点击当前居中专辑
    if (!cfDragMoved) {
      const idx = Math.round(cfOffset);
      if (idx >= 0 && idx < cfAlbums.length) {
        const album = cfAlbums[idx];
        const albumId = album.id || album.albumId;
        if (albumId) cfOpenAlbum(albumId);
      }
    }
  };

  const onCancel = onUp;
  container.addEventListener('pointerdown', onDown);
  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerup', onUp);
  container.addEventListener('pointercancel', onCancel);
  cfCleanupHandlers = [
    { el: container, type: 'pointerdown', fn: onDown },
    { el: container, type: 'pointermove', fn: onMove },
    { el: container, type: 'pointerup', fn: onUp },
    { el: container, type: 'pointercancel', fn: onCancel },
  ];
}

function cfUnbindMouse() {
  cfCleanupHandlers.forEach(h => h.el.removeEventListener(h.type, h.fn));
  cfCleanupHandlers = [];
}

// 显示专辑网格视图
function showAlbumGridView() {
  const grid = document.getElementById('albumGrid');
  const coverFlow = document.getElementById('coverFlowContainer');
  const gridBtn = document.getElementById('gridViewBtn');
  const coverFlowBtn = document.getElementById('coverFlowViewBtn');
  
  if (grid) grid.style.display = 'grid';
  if (coverFlow) coverFlow.style.display = 'none';
  if (gridBtn) gridBtn.classList.add('active');
  if (coverFlowBtn) coverFlowBtn.classList.remove('active');
  document.getElementById('page-album-favorites')?.classList.remove('cover-flow-active');
  
  cfStop();
}

// 显示 Cover Flow 视图
function showCoverFlowView() {
  const grid = document.getElementById('albumGrid');
  const coverFlow = document.getElementById('coverFlowContainer');
  const gridBtn = document.getElementById('gridViewBtn');
  const coverFlowBtn = document.getElementById('coverFlowViewBtn');
  
  if (grid) grid.style.display = 'none';
  if (coverFlow) coverFlow.style.display = 'flex';
  if (gridBtn) gridBtn.classList.remove('active');
  if (coverFlowBtn) coverFlowBtn.classList.add('active');
  document.getElementById('page-album-favorites')?.classList.add('cover-flow-active');
  
  cfStop();
  cfStart();
  
  // 键盘导航
  const keyHandler = (e) => {
    if (state.currentPage !== 'album-favorites') return;
    if (document.getElementById('coverFlowContainer').style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') { cfSnapTo(Math.round(cfOffset) - 1); }
    if (e.key === 'ArrowRight') { cfSnapTo(Math.round(cfOffset) + 1); }
    if (e.key === 'Enter') { const idx = Math.round(cfOffset); if (cfAlbums[idx]) cfOpenAlbum(cfAlbums[idx].id || cfAlbums[idx].albumId); }
  };
  document.addEventListener('keydown', keyHandler);
  cfCleanupHandlers.push({ el: document, type: 'keydown', fn: keyHandler });
}

// 更新 openAlbumDetail 函数以更新收藏按钮
const originalOpenAlbumDetail = openAlbumDetail;

// ============================================
// 新专辑推荐 (New Albums Section)
// ============================================

function createAlbumCard(album) {
  return '<div class="am-card album-card" data-album-id="' + (album.id || '') + '">' +
    '<div class="am-artwork">' +
      '<img src="' + fixCoverUrl(album.picUrl || album.cover || '') + '" alt="" loading="lazy" onerror="this.parentElement.style.background=\'linear-gradient(135deg,#1a1a30,#15152a)\'">' +
      '<div class="am-play-overlay">' +
        '<div class="am-play-circle"><i class="fa-solid fa-compact-disc"></i></div>' +
      '</div>' +
    '</div>' +
    '<div class="am-card-title">' + esc(album.name || '未知专辑') + '</div>' +
    '<div class="am-card-subtitle">' + esc((album.artist || {}).name || '未知歌手') + '</div>' +
  '</div>';
}

async function fetchNewAlbums() {
  try {
    const data = await fetch('/api/album/new?limit=12').then(r => r.json());
    const albums = (data && data.albums) || [];
    const container = document.getElementById('newAlbums');
    if (!albums.length) {
      document.getElementById('newAlbumsSection').style.display = 'none';
      return;
    }
    document.getElementById('newAlbumsSection').style.display = 'block';
    container.innerHTML = albums.map(function(a) { return createAlbumCard(a); }).join('');
    container.querySelectorAll('.album-card').forEach(function(el) {
      el.addEventListener('click', function() {
        var albumId = el.dataset.albumId;
        if (albumId) openAlbumDetail(albumId);
      });
    });
  } catch (e) {
    console.error('Fetch new albums error:', e);
    document.getElementById('newAlbumsSection').style.display = 'none';
  }
}

/* ============================================
   移动端侧边栏切换
   ============================================ */
function toggleMobileSidebar() {
  var sidebar = document.getElementById('sidebar');
  var isOpen = sidebar.classList.contains('show');
  if (isOpen) {
    sidebar.classList.remove('show');
  } else {
    sidebar.classList.add('show');
  }
}

/* 桌面固定面板折叠：保留玻璃材质和图标入口，状态跨刷新保存。 */
(function initCompactPanelToggles() {
  var sidebar = document.getElementById('sidebar');
  var sidebarBtn = document.getElementById('sidebarCollapseBtn');
  var playerBar = document.getElementById('playerBar');
  var playerBtn = document.getElementById('playerCollapseBtn');
  if (!sidebar || !sidebarBtn || !playerBar || !playerBtn) return;

  var savedSidebar = localStorage.getItem('ty-sidebar-collapsed') === '1';
  var savedPlayer = localStorage.getItem('ty-player-collapsed') === '1';

  function setSidebarCollapsed(collapsed) {
    sidebar.classList.toggle('is-collapsed', collapsed);
    sidebarBtn.title = collapsed ? '展开侧边栏' : '收起侧边栏';
    sidebarBtn.setAttribute('aria-label', sidebarBtn.title);
    sidebarBtn.innerHTML = '<i class="fa-solid fa-chevron-' + (collapsed ? 'right' : 'left') + '"></i>';
    localStorage.setItem('ty-sidebar-collapsed', collapsed ? '1' : '0');
  }

  function setPlayerCollapsed(collapsed) {
    playerBar.classList.toggle('is-collapsed', collapsed);
    document.body.classList.toggle('player-is-collapsed', collapsed);
    playerBtn.title = collapsed ? '展开播放栏' : '收起播放栏';
    playerBtn.setAttribute('aria-label', playerBtn.title);
    playerBtn.innerHTML = '<i class="fa-solid fa-chevron-' + (collapsed ? 'up' : 'down') + '"></i>';
    localStorage.setItem('ty-player-collapsed', collapsed ? '1' : '0');
  }

  sidebarBtn.addEventListener('click', function() {
    setSidebarCollapsed(!sidebar.classList.contains('is-collapsed'));
  });
  playerBtn.addEventListener('click', function() {
    setPlayerCollapsed(!playerBar.classList.contains('is-collapsed'));
  });

  setSidebarCollapsed(savedSidebar);
  setPlayerCollapsed(savedPlayer);
})();

/* 点击主内容区时关闭侧边栏（移动端） */
document.addEventListener('click', function(e) {
  var sidebar = document.getElementById('sidebar');
  var btn = document.getElementById('mobileMenuBtn');
  if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
    if (!sidebar.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      sidebar.classList.remove('show');
    }
  }
});

/* 在 navigateTo 执行后更新移动端标题 + 关闭侧边栏 */
// 保存原始 navigateTo 引用
var _originalNavigateTo = navigateTo;
navigateTo = function(page) {
  _originalNavigateTo(page);
  updateMobileTitle(page);
  if (window.innerWidth <= 768) {
    var sb = document.getElementById('sidebar');
    if (sb) sb.classList.remove('show');
  }
};

function updateMobileTitle(page) {
  var titles = {
    'discover': 'TY Music',
    'search': '浏览',
    'local': '本地音乐',
    'favorites': '喜爱',
    'album-favorites': '专辑',
    'playlists': '播放列表'
  };
  var el = document.getElementById('mobilePageTitle');
  if (el) el.textContent = titles[page] || 'TY Music';
}

/* ============================================
   液态玻璃动态高光（跟随鼠标）
   ============================================ */
(function initLiquidGlass() {
  // 给播放栏加一个动态高光层
  var playerBar = document.querySelector('.player-bar');
  if (!playerBar) return;

  // 创建高光元素
  var highlight = document.createElement('div');
  highlight.className = 'liquid-glass-highlight';
  highlight.style.cssText = `
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
    background: radial-gradient(
      ellipse 120px 60px at 50% 50%,
      rgba(255, 255, 255, 0.12) 0%,
      rgba(255, 255, 255, 0.04) 40%,
      transparent 70%
    );
  `;
  playerBar.appendChild(highlight);

  // 鼠标移动时更新高光位置
  document.addEventListener('mousemove', function(e) {
    var rect = playerBar.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      highlight.style.opacity = '1';
      highlight.style.background = `radial-gradient(
        ellipse 150px 80px at ${x}px ${y}px,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0.05) 30%,
        transparent 70%
      )`;
    } else {
      highlight.style.opacity = '0';
    }
  });

  // 鼠标离开窗口时隐藏高光
  document.addEventListener('mouseleave', function() {
    highlight.style.opacity = '0';
  });
})();
