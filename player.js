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

// Cache small catalog responses; leave media to the browser and edge cache.
const catalogApiPaths = new Set([
  '/api/discover/featured', '/api/discover/hot', '/api/music/hot', '/api/hot',
  '/api/album/new', '/api/album/search', '/api/album',
  '/api/music/album', '/api/music/artist', '/api/music/artist-info',
]);
const MAX_API_CACHE_ENTRIES = 48;
const MAX_API_CACHE_BYTES = 2 * 1024 * 1024;
const apiMemoryCache = new Map();
const apiInflight = new Map();
let apiCacheBytes = 0;
let apiExpiryTimer;
const rawFetch = window.fetch.bind(window);
window.tyMusicProvider = createBrowserMusicProvider({ fetchImpl: rawFetch, apiBase: window.__TY_MUSIC_API_BASE__ || '' });
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
function evictApiCache(key) {
  const item = apiMemoryCache.get(key);
  if (!item) return;
  apiCacheBytes -= item.body.length * 2;
  apiMemoryCache.delete(key);
}
function expireApiCache() {
  clearTimeout(apiExpiryTimer);
  let next = Infinity;
  const now = Date.now();
  for (const [key, item] of apiMemoryCache) {
    if (item.expires <= now) evictApiCache(key);
    else next = Math.min(next, item.expires);
  }
  apiExpiryTimer = Number.isFinite(next) ? setTimeout(expireApiCache, next - now) : undefined;
}
function setApiCache(key, item) {
  const bytes = item.body.length * 2;
  if (bytes > MAX_API_CACHE_BYTES) return;
  evictApiCache(key);
  apiMemoryCache.set(key, item);
  apiCacheBytes += bytes;
  while (apiMemoryCache.size > MAX_API_CACHE_ENTRIES || apiCacheBytes > MAX_API_CACHE_BYTES) {
    evictApiCache(apiMemoryCache.keys().next().value);
  }
  expireApiCache();
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
  const cacheable = method === 'GET' && !init?.signal && !(input instanceof Request) &&
    request.cache !== 'no-store' && (url.origin === window.location.origin || url.origin === apiOrigin) &&
    catalogApiPaths.has(url.pathname);
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
    setApiCache(key, persisted);
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
    if (response.ok && /application\/json/i.test(response.headers.get('content-type') || '')) {
      const cached = { body, status: response.status, expires: Date.now() + (desktopCacheEnabled ? 30 * 60 * 1000 : 5 * 60 * 1000) };
      setApiCache(key, cached);
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
        state.trackCache.set(rp.id, trackFromRecentEntry(rp));
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

// User references are durable data; only unreferenced browsing metadata is a cache.
// Keep the existing storage shape so old libraries and exports remain readable.
function referencedLibraryTrackIds() {
  const referenced = new Set([...state.favorites].map(String));
  state.playlists.forEach(playlist => (playlist.tracks || []).forEach(id => referenced.add(String(id))));
  return referenced;
}

function libraryTrackSnapshot(browsingLimit = 500) {
  const referenced = referencedLibraryTrackIds();
  const available = new Map([...state.trackCache].map(([id, track]) => [String(id), track]));
  for (const entry of [...state.queue, ...state.recentPlays]) {
    const id = String(entry.id);
    if (referenced.has(id) && !available.has(id)) available.set(id, trackFromRecentEntry(entry));
  }
  const durable = [...available].filter(([id]) => referenced.has(id));
  const browsing = [...available].filter(([id]) => !referenced.has(id));
  return Object.fromEntries([...durable, ...(browsingLimit ? browsing.slice(-browsingLimit) : [])]);
}

function saveRecentPlays() {
  localStorage.setItem('melodybox_rec', JSON.stringify(state.recentPlays.slice(0, 20)));
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
    saveRecentPlays();
  } catch(e) { errors.push('recents:' + e.message); }

  try {
    localStorage.setItem('melodybox_album_fav', JSON.stringify([...state.albumFavorites]));
  } catch(e) { errors.push('albumFavs:' + e.message); }

  // Never evict metadata still referenced by a favorite or playlist.
  try {
    try {
      localStorage.setItem('melodybox_tracks', JSON.stringify(libraryTrackSnapshot()));
    } catch (error) {
      if (error.name !== 'QuotaExceededError') throw error;
      // A smaller snapshot may fit, but it must still include every user reference.
      localStorage.setItem('melodybox_tracks', JSON.stringify(libraryTrackSnapshot(0)));
    }
  } catch(e) {
    errors.push('tracks:' + e.message);
    // localStorage 可能满了
    if (e.name === 'QuotaExceededError') {
      showToast('曲库保存失败：存储空间不足，请先导出备份');
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
  embeat: 'Embeat 综合搜索',
  netease: '网易云音乐',
  'netease-hot': '热门排行榜',
  'netease-new': '新歌速递',
};

let browseResultTitleOverride = '';

function resizeCoverUrl(value, size) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const raw = value.trim();
  if (raw.startsWith('data:')) return raw;

  try {
    const parsed = new URL(raw, window.location.href);
    const isProxyCover = parsed.pathname === '/api/cover' || parsed.pathname === '/api/music/cover';
    const isNeteaseCover = /(^|\.)music\.126\.net$/.test(parsed.hostname) || parsed.hostname === 'music.163.com';
    if (!isProxyCover && !isNeteaseCover) return raw;

    if (isProxyCover) parsed.searchParams.set('size', String(size));
    else {
      parsed.protocol = 'https:';
      parsed.searchParams.set('param', `${size}y${size}`);
    }
    return raw.startsWith('/') ? parsed.pathname + parsed.search : parsed.href;
  } catch (_) {
    return raw;
  }
}

function coverUrlForTrack(song, size, source) {
  const preferred = size <= 300 ? ['coverSmall', 'cover'] : ['cover', 'coverSmall'];
  for (const field of preferred) {
    const value = song?.[field];
    if (value) return resolveMusicResource(resizeCoverUrl(String(value), size));
  }

  const picId = song?.picId || song?.pic_id || '';
  if (!picId) return '';
  return resolveMusicResource(
    `/api/music/cover?picId=${encodeURIComponent(picId)}&source=${encodeURIComponent(source || 'netease')}&size=${size}`
  );
}

function directCoverUrl(cover) {
  if (cover && !window.__TY_MUSIC_DESKTOP__) {
    try {
      const proxy = new URL(cover, window.location.href);
      if (proxy.origin !== window.location.origin || !['/api/cover', '/api/music/cover'].includes(proxy.pathname) ||
          proxy.searchParams.get('source') === 'embeat') return '';
      const cdn = new URL(proxy.searchParams.get('url') || '');
      if (['https:', 'http:'].includes(cdn.protocol) && /^p\d+\.music\.126\.net$/.test(cdn.hostname) &&
          !cdn.username && !cdn.password && !cdn.port) {
        return resizeCoverUrl(cdn.href, Number(proxy.searchParams.get('size')) || 300);
      }
    } catch (_) { /* No trusted direct URL. */ }
  }
  return '';
}

// Use one route policy for compact images and keep fallbacks on the same artwork.
function compactCover(cover, size = 300) {
  const proxy = resolveMusicResource(resizeCoverUrl(cover, size));
  const direct = directCoverUrl(proxy);
  if (direct) return { src: direct, proxy };
  if (!window.__TY_MUSIC_DESKTOP__ && /^https:\/\/p\d+\.music\.126\.net\//i.test(proxy)) {
    return { src: proxy, proxy: '/api/cover?' + new URLSearchParams({ size, url: proxy }) };
  }
  return { src: proxy || '/icon.svg', proxy: '' };
}

function coverLookup(url) {
  try {
    const parsed = new URL(url, window.location.href);
    const origin = new URL(window.__TY_MUSIC_API_BASE__ || window.location.href).origin;
    const picId = parsed.searchParams.get('picId');
    if (parsed.origin !== origin || !['/api/cover', '/api/music/cover'].includes(parsed.pathname) || !picId) return null;
    return { picId, source: parsed.searchParams.get('source') || 'netease', size: Number(parsed.searchParams.get('size')) || 300 };
  } catch (_) {
    return null;
  }
}

// The visible-image probe and error handler share the same attempt. A player
// image can be reused even when two tracks happen to have the same primary URL.
const coverAttempts = new WeakMap();
let coverProbeObserver;
function unwatchCoverImage(image) {
  coverProbeObserver?.unobserve(image);
  coverAttempts.delete(image);
}

function watchCoverImage(image) {
  if (!image?.isConnected || !image.dataset.embeatCover || (image.complete && image.naturalWidth) ||
      !window.IntersectionObserver) return;
  coverProbeObserver ||= new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!target.isConnected) { unwatchCoverImage(target); continue; }
      if (!isIntersecting) continue;
      coverProbeObserver.unobserve(target);
      tryProviderCover(target);
    }
  });
  coverProbeObserver.observe(image);
}

function tryProviderCover(image, primaryFailed = false) {
  if (image.dataset.directCoverTried || !window.tyMusicProvider) return false;
  const primary = image.src;
  const lookup = coverLookup(primary);
  if (!lookup || (!primaryFailed && lookup.source !== 'embeat')) return false;
  if (lookup.source === 'embeat') image.dataset.embeatCover = '1';
  const existing = coverAttempts.get(image);
  if (existing?.primary === primary) {
    existing.primaryFailed ||= primaryFailed;
    return true;
  }
  const attempt = { primary, primaryFailed };
  coverAttempts.set(image, attempt);
  const current = () => image.isConnected && image.src === primary && coverAttempts.get(image) === attempt;
  const failed = () => {
    if (!current()) return;
    coverAttempts.delete(image);
    image.dataset.directCoverTried = '1';
    if (attempt.primaryFailed) fallbackCover(image);
  };
  const apply = cover => {
    if (!current() || (!attempt.primaryFailed && image.complete && image.naturalWidth)) return;
    coverAttempts.delete(image);
    image.dataset.directCoverTried = '1';
    image.referrerPolicy = 'no-referrer';
    image.src = cover;
  };
  window.tyMusicProvider.resource(lookup, 'pic', { size: lookup.size }).then(cover => {
    if (!current() || (!attempt.primaryFailed && image.complete && image.naturalWidth)) return;
    if (attempt.primaryFailed) { apply(cover); return; }
    const alternative = new Image();
    alternative.referrerPolicy = 'no-referrer';
    alternative.onload = () => apply(cover);
    alternative.onerror = failed;
    alternative.src = cover;
  }).catch(failed);
  return true;
}

function recentlyPlayedCoverUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password && !url.port &&
        ((url.hostname === 'resources.tidal.com' && url.pathname.startsWith('/images/')) ||
          /^p\d+\.music\.126\.net$/.test(url.hostname))) return url.href;
  } catch (_) {}
  return '';
}

let recentCoverSaveTimer;
function rememberRecentCoverImage(img) {
  if (!img.isConnected || !img.naturalWidth) return;
  rememberRecentCover(img.dataset.recentTrackId, img.currentSrc);
}

function rememberRecentCover(id, url) {
  const cover = recentlyPlayedCoverUrl(url);
  if (!cover) return;
  const entry = state.recentPlays.find(item => String(item.id) === String(id));
  if (!entry || entry.recentCover === cover) return;
  entry.recentCover = cover;
  if (recentCoverSaveTimer) return;
  recentCoverSaveTimer = setTimeout(() => {
    recentCoverSaveTimer = null;
    try { saveRecentPlays(); } catch (_) { /* The in-memory cover still works. */ }
  }, 250);
}

function trackCoverMarkup(track, className = '', lazy = true, alt = '', priority = false, recent = false) {
  const { src: compactSrc, proxy } = compactCover(track.coverSmall || track.cover);
  const saved = recent && recentlyPlayedCoverUrl(track.recentCover);
  const direct = saved || Boolean(proxy);
  const cover = saved ? resolveMusicResource(resizeCoverUrl(track.coverSmall || track.cover, 300)) : proxy;
  const src = saved || compactSrc;
  const embeat = track.source === 'embeat' && !saved && Boolean(track.picId);
  const loading = priority ? ' loading="eager" fetchpriority="high"' : lazy ? ' loading="lazy"' : '';
  const fallback = (cover && cover !== src ? ` data-proxy-cover="${escAttr(cover)}"` : '') +
    (embeat ? ' data-embeat-cover="1"' : '');

  const history = recent ? ` data-recent-track-id="${escAttr(track.id)}" onload="rememberRecentCoverImage(this)"` : '';
  return `<img class="${className}" src="${escAttr(src)}" alt="${escAttr(alt)}" decoding="async"${loading}${direct ? ' referrerpolicy="no-referrer"' : ''}${fallback}${history} data-artist="${escAttr(track.artist || '')}" data-album="${escAttr(track.album || '')}" data-name="${escAttr(track.title || track.name || '')}" onerror="fallbackCover(this)">`;
}

// Keep upstream resource IDs separate from the safe internal queue/storage identity.
function providerTrackId(track) {
  if (track.providerId != null && track.providerId !== '') return String(track.providerId);
  const id = String(track.id ?? '');
  if (track.source === 'embeat' && id.startsWith('embeat:')) {
    try { return decodeURIComponent(id.slice(7)); } catch (_) { return ''; }
  }
  return id;
}

function musicResourceQuery(track, kind) {
  const providerId = providerTrackId(track);
  const id = kind === 'lyric' ? track.lyricId || providerId : track.urlId || providerId;
  const params = new URLSearchParams({ id, source: track.source || 'netease' });
  if (track.source === 'embeat') {
    params.set('trackId', providerId);
    params.set('title', track.title || '');
    params.set('artist', track.artist || '');
    if (track.isrc) params.set('isrc', track.isrc);
  }
  return params.toString();
}

// 标准化歌曲对象（新音源）
function normalizeTrack(song) {
  var src = song.source || 'netease';
  var providerId = providerTrackId(song);
  var internalId = src === 'embeat' && providerId ? 'embeat:' + encodeURIComponent(providerId).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase()) : String(song.id ?? '');
  var pid = song.picId || song.pic_id || '';
  var albumId = song.albumId || song.album_id || '';
  var coverUrl = coverUrlForTrack(song, 1000, src);
  var coverSmallUrl = coverUrlForTrack(song, 300, src);

  return {
    id: internalId,
    providerId,
    urlId: song.urlId || song.url_id || '',
    lyricId: song.lyricId || song.lyric_id || '',
    isrc: song.isrc || '',
    title: song.name || song.title || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover: coverUrl,
    coverSmall: coverSmallUrl,
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
    console.warn('[Search] Failed:', e.message);
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
async function searchNetease(keywords, limit, source, signal) {
  limit = Math.min(limit || 20, 20);
  var ctrl = new AbortController();
  const cancel = () => ctrl.abort();
  if (signal?.aborted) cancel();
  else signal?.addEventListener('abort', cancel, { once: true });
  var timer = setTimeout(function() { ctrl.abort(); }, 15000);
  try {
    var url = '/api/music/search?keywords=' + encodeURIComponent(keywords) + '&limit=' + limit;
    if (source) url += '&source=' + encodeURIComponent(source);
    var res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    if (!data.songs || !data.songs.length) {
      return [];
    }
    return data.songs.map(function(s) { return normalizeTrack(s); });
  } catch (e) {
    if (!signal?.aborted) console.error('[Search] Failed:', e.message);
    throw e; // 抛出错误，让调用方处理
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
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
      var qtracks = await searchNetease(queries[qi], qi === 0 ? limit : Math.ceil(limit / 2), 'netease');
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
  // Keep both artwork sizes canonical even when an older API/cache entry only
  // contains one cover URL.
  const picId = song.picId || song.pic_id || '';
  const cover = coverUrlForTrack(song, 1000, 'netease');
  const coverSmall = coverUrlForTrack(song, 300, 'netease');
  return {
    id: String(song.id || ''),
    title: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover,
    coverSmall,
    albumId: song.albumId || song.album_id || '',
    picId: picId,
    duration: song.duration || 0,
    source: 'netease',
  };
}

// 通用搜索
async function universalSearch(query, limit, forceSource) {
  limit = limit || 80;
  var results = [];

  if (!forceSource) showToast('正在搜索...');

  results = await searchNetease(query, limit);

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

function escAttr(value) {
  return esc(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
    const nativePlayer = $('#playerBar');
    if (nativePlayer) {
      nativePlayer.style.setProperty('--mini-progress-rgb', `${r}, ${g}, ${b}`);
      nativePlayer.style.setProperty('--mini-progress-light-rgb', `${lift(r)}, ${lift(g)}, ${lift(b)}`);
    }
    const miniBg = $('#miniArtBg');
    if (miniBg) miniBg.style.background = `rgba(${r},${g},${b},0.8)`;
  };
}

// ========== Navigation ==========
function navigateTo(page) {
  if (state.currentPage === 'discover' && page !== 'discover') hideGenreDetail();
  // 关闭专辑详情侧面板
  const albumPanel = document.getElementById('albumDetailPanel');
  if (albumPanel) {
    albumPanel.classList.remove('show');
  }
  
  // 清理 Cover Flow 事件监听与动画
  if (state.currentPage === 'album-favorites' && page !== 'album-favorites') {
    cfStop();
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
  }
}

function goBack() {
  if (state.navHistory.length === 0) return;
  const prev = state.navHistory.pop();
  if (state.currentPage === 'discover' && prev !== 'discover') hideGenreDetail();
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
  state.trackCache.delete(track.id);
  state.trackCache.set(track.id, {
    id: track.id,
    title: track.title || '未知歌曲',
    artist: track.artist || '未知歌手',
    album: track.album || '',
    cover: track.cover || track.coverSmall || '',
    coverSmall: track.coverSmall || track.cover || '',
    picId: track.picId || '',
    providerId: providerTrackId(track),
    urlId: track.urlId || '',
    lyricId: track.lyricId || '',
    isrc: track.isrc || '',
    albumId: track.albumId || '',
    duration: track.duration || 0,
    source: track.source || 'netease',
  });
  if (state.trackCache.size <= 500) return;
  const referenced = referencedLibraryTrackIds();
  let remaining = state.trackCache.size - 500;
  for (const id of referenced) { if (state.trackCache.has(id)) remaining--; }
  if (remaining <= 0) return;
  for (const id of state.trackCache.keys()) {
    if (referenced.has(String(id))) continue;
    state.trackCache.delete(id);
    if (--remaining === 0) break;
  }
}

function trackFromRecentEntry(entry) {
  if (!entry) return null;
  const id = String(entry.id || '');
  if (!id) return null;
  const cached = state.trackCache.get(id) || state.trackCache.get(entry.id);
  const merged = { ...(cached || {}), id };
  for (const [field, value] of Object.entries(entry)) {
    if (field === 'cover' || field === 'coverSmall') {
      if (isRecentCoverPlaceholder(value)) continue;
    }
    if (value !== undefined && value !== null && value !== '') merged[field] = value;
  }
  for (const field of ['cover', 'coverSmall']) {
    if (isRecentCoverPlaceholder(merged[field])) delete merged[field];
  }
  merged.source ||= id.startsWith('embeat:') ? 'embeat' : 'netease';
  return { ...normalizeTrack(merged), previewUrl: merged.previewUrl || '', recentCover: merged.recentCover || '' };
}

function isRecentCoverPlaceholder(value) {
  return typeof value === 'string' &&
    /^(?:data:image\/svg\+xml|(?:https?:\/\/[^/]+)?\/(?:icon\.svg(?:[?#]|$)|assets\/demo\/|api\/(?:artist-photo|artist-avatar|album-cover)(?:[?#]|$)))/i.test(value);
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
  for (const row of document.querySelectorAll('.track-row[data-track-id]')) {
    if (row.dataset.trackId === String(track.id)) {
      paintSongLike(row.querySelector('.like-btn'), isFavorite(track.id));
    }
  }
  if (state.currentPage === 'favorites') renderFavorites();
}

function paintSongLike(button, liked) {
  if (!button) return;
  button.classList.toggle('liked', liked);
  button.setAttribute('aria-pressed', String(liked));
  button.title = liked ? '取消喜欢' : '喜欢歌曲';
  const icon = button.querySelector('i');
  if (icon) icon.className = `fa-${liked ? 'solid' : 'regular'} fa-heart`;
}

function updateLikeUI() {
  const liked = isFavorite(state.currentTrack?.id);
  paintSongLike($('#playerLike'), liked);
  paintSongLike($('#ampLikeBtn'), liked);
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
  if (track.source === 'embeat') { showToast('Embeat 目前仅支持在线播放，暂不提供下载'); return; }
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

let playbackRequestId = 0;
let playbackAbortController = null;
let pendingAudioResolution = 0;
let localPlaybackUrl = null;
const LOCAL_TRACK_COVER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%231a1a1a"/%3E%3Ctext x="50%25" y="55%25" text-anchor="middle" fill="%23666" font-size="80"%3E%E2%99%AB%3C/text%3E%3C/svg%3E';
function releaseLocalAudio() {
  if (!localPlaybackUrl) return;
  URL.revokeObjectURL(localPlaybackUrl);
  localPlaybackUrl = null;
}

// Every source crosses the same selection seam before any asynchronous work.
function beginPlaybackSelection() {
  const id = ++playbackRequestId;
  playbackAbortController?.abort();
  playbackAbortController = new AbortController();
  pendingAudioResolution = 0;
  audio.pause();
  audio.removeAttribute('src');
  audio.load();
  releaseLocalAudio();
  state.isPlaying = false;
  clearTimeout(playTimeout);
  return id;
}

function setPlaybackCover(img, track, size = 300) {
  unwatchCoverImage(img);
  const cover = coverUrlForTrack(track || {}, size, track?.source);
  const { src, proxy } = compactCover(cover, size);
  for (const key of ['fallback', 'albumTried', 'fallbackTried', 'directCoverTried', 'proxyCover', 'embeatCover', 'decorativeCover']) delete img.dataset[key];
  img.dataset.exactCover = '1';
  img.dataset.artist = track?.artist || '';
  img.dataset.album = track?.album || '';
  img.dataset.name = track?.title || '';
  img.onerror = track?.source === 'local' ? null : function() { fallbackCover(this); };
  img.referrerPolicy = proxy ? 'no-referrer' : '';
  if (proxy) img.dataset.proxyCover = proxy;
  if (track?.source === 'embeat' && track.picId) img.dataset.embeatCover = '1';
  img.src = src;
  if (track?.source !== 'local') watchCoverImage(img);
}

function presentPlaybackTrack(track) {
  // Remote and local selections publish the same metadata and lyric reset.
  state.currentTrack = track;
  // 切歌立即废弃上一首的歌词请求和渲染快照，避免异步回调串歌。
  state.lyrics = { lines: [], activeIndex: -1, expanded: false };
  ampLyricsRequestId += 1;
  ampLyricsRenderedFor = null;

  // Update UI
  const coverSrc = track.coverSmall || track.cover || '';
  setPlaybackCover($('#playerCover'), track);
  $('#playerTitle').textContent = track.title;
  const playerArtistEl = $('#playerArtist');
  playerArtistEl.textContent = track.artist;
  playerArtistEl.dataset.album = track.album || '';
  window.dispatchEvent(new CustomEvent('ty:trackchange', { detail: track }));
  // Pass the just-selected track explicitly. Reading the queue again here can
  // race with queue/index updates during automatic next-track playback.
  if (ampIsShowing) updateAmpFullscreenPlayer(track);
  syncNativeNowPlaying({ artwork: true });
  // 时长：先显示已有值，等音频加载后再从 audio.duration 更新
  $('#durationTime').textContent = track.duration > 0 ? formatTime(track.duration) : '0:00';
  document.title = `${track.title} - ${track.artist} | TY Music`;
  $('#playerPreviewBadge').style.display = 'none';

  // Mini player
  const mini = $('#nowPlayingMini');
  mini.style.display = 'flex';
  setPlaybackCover($('#miniCover'), track);
  $('#miniTitle').textContent = track.title;
  $('#miniArtist').textContent = track.artist;
  // 专辑名称（强制显示）
  try {
    var albumText = track.album || track.title || '未知专辑';
    var picId = track.picId || track.albumId || ''; // 优先使用 picId（100% 准确）
    var albumId = track.albumId || '';
    var songId = providerTrackId(track);
    
    // 迷你播放器
    var miniAlbumEl = $('#miniAlbum');
    if (miniAlbumEl) {
      miniAlbumEl.style.display = 'block';
      miniAlbumEl.textContent = '专辑: ' + albumText;
      miniAlbumEl.style.cursor = 'pointer';
      miniAlbumEl.title = '点击打开专辑';
      miniAlbumEl.onclick = function() {
        // 优先使用 picId，没有的话用 songId 让后端自动获取
        if (track.source === 'embeat') openEmbeatAlbum(track);
        else openAlbumByPicId(picId, songId, albumText, track.artist, track.source || 'netease', albumId);
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
          if (track.source === 'embeat') openEmbeatAlbum(track);
          else openAlbumByPicId(picId, songId, albumText, track.artist, track.source || 'netease', albumId);
        }, 400);
      };
    }
 } catch(e) { console.warn('Album display error:', e); }

  // 获取并显示专辑信息
  fetchAndDisplayAlbumInfo(track);

  updateDynamicGradient(track);
  // The native mini player follows the album palette too. Use the existing
  // multi-sample extractor rather than a generic neutral playback color.
  if (coverSrc) {
    extractAlbumColors(coverSrc, function(colors) {
      if (getActiveTrack()?.id !== track.id) return;
      const playerBar = $('#playerBar');
      if (!playerBar || !colors?.primary) return;
      const primary = colors.primary;
      const secondary = colors.secondary || primary;
      playerBar.style.setProperty('--mini-progress-rgb', `${primary.r}, ${primary.g}, ${primary.b}`);
      playerBar.style.setProperty('--mini-progress-light-rgb', `${secondary.r}, ${secondary.g}, ${secondary.b}`);
    });
  }

  // Reset progress
  setSliderValue('#progressBar', 0);
  $('#currentTime').textContent = '0:00';

  updateLikeUI();
  updatePlayBtn();
  updateQueueHighlight();
}

function playTrack(track, index, skipRecentUpdate) {
  if (!track) return;
  if (track.source === 'local' || String(track.id).startsWith('local_')) {
    playLocalTrack(track.id);
    return;
  }
  const playbackId = beginPlaybackSelection();
  const playbackController = playbackAbortController;
  selectQueueTrack(track);

  presentPlaybackTrack(track);

  // 只有 skipRecentUpdate 为 true 时（切歌），才跳过 recentPlays 更新
  if (!skipRecentUpdate) {

  // 调试：显示即将播放的歌曲
  console.log('[PlayTrack] Playing:', track.title, 'by', track.artist, 'album:', track.album);

  // 关键：在用户手势最前端初始化 AudioContext，确保 resume() 在手势中生效
  // 缓存歌曲数据到 trackCache 并立即持久化（不等异步回调）
  cacheTrack(track);

  // 保留最近 30 首，先淘汰最旧的记录
  const previousRecent = state.recentPlays.find(r => String(r.id) === String(track.id));
  state.recentPlays = state.recentPlays.filter(r => String(r.id) !== String(track.id));
  state.recentPlays.unshift({
    id: track.id, title: track.title, artist: track.artist,
    album: track.album || '',
    cover: track.cover || track.coverSmall || '', coverSmall: track.coverSmall || '', source: track.source,
    recentCover: previousRecent?.picId === (track.picId || '') ? previousRecent?.recentCover : undefined,
    picId: track.picId || '',
    providerId: providerTrackId(track),
    urlId: track.urlId || '',
    lyricId: track.lyricId || '',
    albumId: track.albumId || '',
    isrc: track.isrc || '',
    previewUrl: track.previewUrl, duration: track.duration || 0,
  });
  state.recentPlays.length = Math.min(30, state.recentPlays.length);

  // 【关键修复】立即同步保存，不依赖异步回调。防止页面关闭时数据丢失
  saveAll();

  // 实时刷新最近播放列表 UI（如果当前在主页，立刻能看到新歌加到顶部）
  refreshRecentTracksUI();
  } // end if (!skipRecentUpdate)

  if (!track.previewUrl && !track.id) {
    showToast('暂无可用音源');
    return;
  }

  // Resolve through the visitor network; keep the same-source server proxy as fallback.
  if (track.id && (track.source === 'embeat' || track.source === 'netease' || track.picId || !track.previewUrl)) {
    var proxyPath = '/api/music/proxy?' + musicResourceQuery(track, 'url');
    if (window.__TY_MUSIC_DESKTOP__) proxyPath += '&stream=1';
    var proxyUrl = resolveMusicResource(proxyPath);
    showToast('正在加载音频...');
    let audioAttempt = 0;
    function startAudio(url) {
      const attempt = ++audioAttempt;
      audio.src = url;
      audio.load();
      // Keep play() inside the original click for WebKit's media permission.
      return audio.play().then(function() {
        if (playbackId !== playbackRequestId || attempt !== audioAttempt) return;
        state.isPlaying = true;
        updatePlayBtn();
        var toast = document.querySelector('.toast');
        if (toast) toast.classList.remove('show');
      }).catch(function(e) {
        if (playbackId !== playbackRequestId || attempt !== audioAttempt || pendingAudioResolution === playbackId) return;
        console.warn('[Play] Audio failed:', e.message);
        showToast(e.name === 'NotAllowedError' ? '请点击播放按钮继续播放' : '播放失败，请换一首试试');
      });
    }
    const direct = window.tyMusicProvider && (!window.__TY_MUSIC_DESKTOP__ || track.source === 'embeat');
    pendingAudioResolution = direct ? playbackId : 0;
    // Start the existing path synchronously, preserving Safari and desktop
    // gesture behavior. Direct resolution can rescue a rejected server path.
    startAudio(proxyUrl);
    if (direct) {
      window.tyMusicProvider.resource(track, 'url', { signal: playbackController.signal }).then(url => {
        if (playbackId !== playbackRequestId) return;
        pendingAudioResolution = 0;
        if (!audio.paused && (audio.readyState >= 3 || audio.currentTime > 0)) return;
        return startAudio(url);
      }).catch(function() {
        if (playbackId !== playbackRequestId) return;
        pendingAudioResolution = 0;
        if (audio.error) showToast('播放失败，请换一首试试');
      });
    }
    updateLikeUI();
    updatePlayBtn();
    updateQueueHighlight();
    return;
  }

  // fallback
  if (track.previewUrl) {
    audio.src = resolveMusicResource(track.previewUrl);
    audio.load();
    audio.play().then(() => {
      if (playbackId !== playbackRequestId) return;
      state.isPlaying = true;
      updatePlayBtn();
    }).catch((e) => {
      if (playbackId !== playbackRequestId) return;
      console.warn('Play failed:', e.message);
      showToast('播放失败，请换一首试试');
    });
  }

  updateLikeUI();
  updatePlayBtn();
  updateQueueHighlight();

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
}

function togglePlay() {
  if (!state.currentTrack) return;
  if (state.currentTrack.source === 'local' && !localPlaybackUrl) {
    playLocalTrack(state.currentTrack.id);
    return;
  }
  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
    updatePlayBtn();
  } else {
    const playbackId = playbackRequestId;
    audio.play().then(() => {
      if (playbackId !== playbackRequestId) return;
      state.isPlaying = true;
      updatePlayBtn();
    }).catch(() => { if (playbackId === playbackRequestId) showToast('播放失败'); });
  }
}

$('#playBtn').addEventListener('click', togglePlay);
$('#miniPlayBtn').addEventListener('click', togglePlay);

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
  else {
    const endedPlaybackId = playbackRequestId;
    playNext();
    if (endedPlaybackId === playbackRequestId) {
      if (localPlaybackUrl) beginPlaybackSelection();
      state.isPlaying = false;
      updatePlayBtn();
    }
  }
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
  if (pendingAudioResolution === playbackRequestId) return;
  const err = audio.error;
  if (localPlaybackUrl) beginPlaybackSelection();
  console.warn('Audio error:', err?.code, err?.message, 'track:', state.currentTrack.title);
  if (state.queue.length > 1) {
    showToast('播放失败，自动切换下一首');
    const failedPlaybackId = playbackRequestId;
    setTimeout(() => { if (failedPlaybackId === playbackRequestId) playNext(); }, 500);
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
  const thumb = { style: {} };
  let dragging = false;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function applySeek(clientX) {
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // 拖拽期间实时更新 UI，不立刻跳转（减少音频跳动）
    setSliderValue('#progressBar', pct * 100);
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
    setSliderValue('#progressBar', pct * 100);
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
function syncQueueOrder() {
  if (state.isShuffled) {
    const byId = new Map(state.queue.map(track => [track.id, track]));
    const order = state.shuffledQueue.filter(track => byId.has(track.id)).map(track => {
      const current = byId.get(track.id);
      byId.delete(track.id);
      return current;
    });
    const added = [...byId.values()];
    for (let i = added.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [added[i], added[j]] = [added[j], added[i]];
    }
    state.shuffledQueue = [...order, ...added];
  }
  const queue = state.isShuffled ? state.shuffledQueue : state.queue;
  state.queueIndex = queue.findIndex(track => track.id === state.currentTrack?.id);
  return queue;
}

function selectQueueTrack(track) {
  state.currentTrack = track;
  syncQueueOrder();
}

function replaceQueue(tracks) {
  state.queue = [...tracks];
  state.shuffledQueue = [];
  syncQueueOrder();
}

function toggleShuffle() {
  state.isShuffled = !state.isShuffled;
  state.shuffledQueue = [];
  syncQueueOrder();
  $('#shuffleBtn')?.classList.toggle('active', state.isShuffled);
  $('#ampShuffleBtn')?.classList.toggle('active', state.isShuffled);
  showToast(state.isShuffled ? '随机播放已开启' : '顺序播放');
}

function getQueue() { return syncQueueOrder(); }

function playNext() {
  var q = getQueue();
  if (!q.length || q.length <= 1) return;
  var newIdx = (state.queueIndex + 1) % q.length;
  state.queueIndex = newIdx;
  const nextTrack = q[newIdx];
  playTrack(nextTrack, newIdx, true);
}

function playPrev() {
  var q = getQueue();
  if (!q.length || q.length <= 1) return;
  var newIdx = (state.queueIndex - 1 + q.length) % q.length;
  state.queueIndex = newIdx;
  const prevTrack = q[newIdx];
  playTrack(prevTrack, newIdx, true);
}

$('#nextBtn').addEventListener('click', playNext);
$('#prevBtn').addEventListener('click', playPrev);

// Shuffle
$('#shuffleBtn').addEventListener('click', toggleShuffle);

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
      ${trackCoverMarkup(t, 'row-cover')}
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
  if (track.source === 'local') { if (callback) callback([]); return; }
  let lrcText = null;
  let tlyricText = null;

  const tryFetch = async (fetchFn, budget = 5000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), budget);
    try {
      return await fetchFn(controller.signal);
    } catch (e) { return null; }
    finally { clearTimeout(timeout); }
  };

  // Step 1: 新音源歌词（通过新 API /api/music/lyric）
  if (track.id && (track.source === 'embeat' || track.source === 'netease' || track.picId)) {
    const data = await tryFetch(signal =>
      window.tyMusicProvider
        ? window.tyMusicProvider.resource(track, 'lyric', { signal }).catch(error => {
            if (signal.aborted) throw error;
            return fetch('/api/music/lyric?' + musicResourceQuery(track, 'lyric'), { signal }).then(r => r.json());
          })
        : fetch('/api/music/lyric?' + musicResourceQuery(track, 'lyric'), { signal }).then(r => r.json()),
      track.source === 'embeat' ? 25000 : 5000
    );
    if (data && data.lrc && data.lrc.length > 10) {
      lrcText = data.lrc;
      if (data.tlyric && data.tlyric.length > 10) tlyricText = data.tlyric;
    }
  }

  // Step 2: Try Netease LRC — first by direct song ID, then by search
  if (!lrcText && track.source !== 'embeat') {
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
  if (!lrcText && track.source !== 'embeat' && track.artist && track.title) {
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
      if (callback) callback(lines);
      return;
    }
  }

  // Embeat resource resolution is authoritative; do not guess another catalog.
  if (track.source === 'embeat') { if (callback) callback([]); return; }

  // Step 5: Fallback to lyrics.ovh
  const ovhData = await tryFetch(signal =>
    fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(track.artist)}/${encodeURIComponent(track.title)}`, { signal })
      .then(r => r.json())
  );
  if (ovhData && ovhData.lyrics && ovhData.lyrics.length > 10) {
    const dur = track.duration || audio.duration || 240;
    const lines = parsePlainLyrics(ovhData.lyrics, dur);
    if (lines.length) {
      if (callback) callback(lines);
      return;
    }
  }

  // No lyrics found
  if (callback) callback([]);
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
const GENRE_PRIORITY_COVERS = 4;

function createAMCard(track, wide = false, priorityCover = false, recent = false) {
  // 存储歌曲到全局Map
  trackMap.set(track.id, track);

  return `
    <div class="am-card ${wide ? 'wide' : ''}" data-track-id="${track.id}">
      <div class="am-artwork">
        ${trackCoverMarkup(track, '', true, '', priorityCover, recent)}
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
  const genre = containerId === '#genreTracks';
  const recent = containerId === '#recentTracks';
  container.innerHTML = tracks.map((track, index) => createAMCard(track, wide, genre && index < GENRE_PRIORITY_COVERS, recent)).join('');
  if (genre) trySlowGenreCovers(container);
  if (!recent) revealContainer(container);
}

function trySlowGenreCovers(row) {
  const cards = Array.from(row.children).slice(0, GENRE_PRIORITY_COVERS);
  const section = row.closest('#genreSection');
  const pendingImage = card => {
    if (document.hidden || !card.isConnected || state.currentPage !== 'discover' || section?.style.display === 'none') return;
    const image = card.querySelector('.am-artwork img[data-proxy-cover]');
    if (image?.dataset.proxyCover && !(image.complete && image.naturalWidth > 0)) return image;
  };

  // Keep a working CDN load. Start the site proxy only for slow lead covers.
  setTimeout(() => {
    for (const card of cards) {
      const image = pendingImage(card);
      if (!image) continue;
      const proxy = image.dataset.proxyCover;
      const alternative = new Image();
      alternative.referrerPolicy = image.referrerPolicy;
      alternative.onload = () => {
        const current = pendingImage(card);
        if (current?.dataset.proxyCover !== proxy) return;
        delete current.dataset.proxyCover;
        current.src = proxy;
      };
      alternative.src = proxy;
    }
  }, 400);
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
  var recentTracks = state.recentPlays.map(trackFromRecentEntry).filter(Boolean);
  renderScrollRow('#recentTracks', recentTracks, true);
}

// ========== Discover Page ==========
let hotCache;

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
      
      const qIdx = state.queue.findIndex(t => t.id === trackId);
      const entry = sel === '#recentTracks' && state.recentPlays.find(item => String(item.id) === trackId);
      const track = entry ? trackFromRecentEntry(entry) : state.queue[qIdx] || trackMap.get(trackId);
      if (!track) { showToast('歌曲加载失败，请重试'); return; }
      if (qIdx < 0) state.queue.push(track);
      else state.queue[qIdx] = track;
      playTrack(track);
    });
  });

  // Recent plays
  if (state.recentPlays.length) {
    const recentSection = $('#recentSection');
    if (recentSection) recentSection.style.display = '';
    const recentTracks = state.recentPlays.map(trackFromRecentEntry).filter(Boolean);
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
    applyHeroTrack(heroRes[0]);
    addToQueue(heroRes);
  } catch (e) {
    console.warn('[Discover] Hero failed:', e);
  }
}

function setHeroCover(coverUrl, trackId) {
  if (!coverUrl) return;
  const image = document.querySelector('.hero-art-fallback');
  if (image) image.src = resolveMusicResource(coverUrl);
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
}

function setShinyText(id, text) {
  var target = document.getElementById(id);
  if (target) target.textContent = text || '';
}

// Genre detail
const genreDetailCache = new Map();
let activeGenreLoad = null;
let genreScrollTimer;
async function loadGenreDetail(genreId) {
  const genreSection = $('#genreSection');
  const row = $('#genreTracks');
  if (!genreSection || !row || activeGenreLoad?.id === genreId) return;
  hideGenreDetail();
  genreSection.style.display = 'block';
  const genreNames = { pop: '流行乐', rock: '摇滚', electronic: '电子', hiphop: '嘻哈', jazz: '爵士', classical: '古典', rnb: 'R&B', country: '乡村', kpop: 'K-Pop', chinese: '华语', latin: '拉丁', anime: '动漫' };
  const genreTitle = genreNames[genreId] || genreId;
  const genrePixelNames = { pop: 'POP', rock: 'ROCK', electronic: 'ELECTRONIC', hiphop: 'HIP HOP', jazz: 'JAZZ', classical: 'CLASSICAL', rnb: 'R&B', country: 'COUNTRY', kpop: 'K-POP', chinese: 'CHINESE', latin: 'LATIN', anime: 'ANIME' };
  const title = $('#genreTitleMount');
  if (title) title.textContent = genrePixelNames[genreId] || genreTitle.toUpperCase();
  genreScrollTimer = setTimeout(() => genreSection.scrollIntoView({ behavior: 'smooth' }), 100);

  if (genreDetailCache.has(genreId)) { renderScrollRow('#genreTracks', genreDetailCache.get(genreId)); return; }

  const controller = new AbortController();
  activeGenreLoad = { id: genreId, controller };
  const { signal } = controller;
  row.innerHTML = '<div class="scroll-loading" aria-label="内容加载中"></div>';
  // Combine a broad genre query with artist seeds to keep the results varied.
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
  const tracks = [];
  const seen = new Set();
  let next = 0;
  let failed = false;
  async function loadBatches() {
    while (!signal.aborted && next < queries.length && tracks.length < 80) {
      const query = queries[next++];
      let batch;
      try {
        batch = await searchNetease(query, 20, 'netease', signal);
      } catch (error) {
        if (signal.aborted) return;
        failed = true;
        continue;
      }
      if (signal.aborted || tracks.length >= 80) return;
      const fresh = [];
      for (const track of batch) {
        const key = String(track.id || `${track.title}-${track.artist}`).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        fresh.push(track);
        if (tracks.length + fresh.length === 80) break;
      }
      if (!fresh.length) continue;
      addToQueue(fresh);
      if (!tracks.length) renderScrollRow('#genreTracks', fresh);
      else row.insertAdjacentHTML('beforeend', fresh.map(track => createAMCard(track)).join(''));
      tracks.push(...fresh);
    }
  }
  try {
    await Promise.all([loadBatches(), loadBatches()]);
    if (signal.aborted) return;
    if (!failed || tracks.length === 80) genreDetailCache.set(genreId, tracks);
    if (!tracks.length) renderScrollRow('#genreTracks', []);
    if (failed && !tracks.length) showToast('该流派暂时无法加载，请重试');
  } finally {
    if (activeGenreLoad?.controller === controller) activeGenreLoad = null;
  }
}

function hideGenreDetail() {
  activeGenreLoad?.controller.abort();
  activeGenreLoad = null;
  clearTimeout(genreScrollTimer);
  const section = $('#genreSection');
  if (section) section.style.display = 'none';
}

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
let autoIndex = -1;
let activeSearchTracks = [];
let activeSearchHasMore = false;
let searchResultsObserver = null;
let searchPaginationNode = null;
let activeSearchStatus = null;
const searchSession = createMusicSearchSession({
  searchPage: window.tyMusicProvider?.search,
  onChange(page) {
    activeSearchStatus = page;
    const previousCount = activeSearchTracks.length;
    activeSearchTracks.push(...page.added.map(normalizeTrack));
    activeSearchHasMore = page.hasMore;
    $('#searchSourceLabel').textContent = page.source
      ? '音源：' + (page.source === 'embeat' ? 'Embeat' : '网易云')
      : '正在选择可用音源…';
    renderPaginatedSearchResults(previousCount);
  },
});

function cancelSearch() {
  searchSession.cancel();
  activeSearchHasMore = false;
  searchResultsObserver?.disconnect();
  searchResultsObserver = null;
  searchPaginationNode?.remove();
  searchPaginationNode = null;
  activeSearchTracks = [];
  activeSearchStatus = null;
  const results = $('#searchResults');
  if (results) { results.onclick = null; results.innerHTML = ''; }
}

$('#searchInput').addEventListener('input', () => {
  cancelSearch();
  hideAutocomplete();
  const q = $('#searchInput').value.trim();
  $('#searchResultsSection').style.display = 'none';
  const quickStart = $('#page-search .browse-quick-section');
  if (quickStart) quickStart.style.display = '';
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

const autocompleteSession = createMusicSearchSession({
  searchPage: window.tyMusicProvider?.search,
  limit: 8,
  onChange(page) {
    if (page.songs.length) renderAutocomplete(page.songs);
  },
});

function fetchAutocomplete(query) {
  if (query) autocompleteSession.search(query);
}

function renderAutocomplete(songs) {
  const box = $('#searchAutocomplete');
  if (!box) return;
  
  autoIndex = -1;
  box.style.display = 'block';
  box.innerHTML = songs.map((s, i) => `
    <div class="auto-item" data-idx="${i}" data-query="${escAttr(s.name + ' ' + s.artist)}">
      ${trackCoverMarkup(s, 'auto-item-cover', false)}
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
  clearTimeout(searchTimeout);
  const box = $('#searchAutocomplete');
  if (box) { box.style.display = 'none'; box.innerHTML = ''; }
  autoIndex = -1;
  autocompleteSession.cancel();
}

async function performSearch(query, resultTitle = '') {
  if (!query) return;
  cancelSearch();
  browseResultTitleOverride = resultTitle || '';
  hideAutocomplete();
  const suggestions = $('#searchSuggestions');
  if (suggestions) suggestions.style.display = 'none';
  $('#searchResultsSection').style.display = 'block';
  const quickStart = $('#page-search .browse-quick-section');
  if (quickStart) quickStart.style.display = 'none';
  $('#searchResultTitle').textContent = resultTitle || '搜索结果';
  $('#searchResults').innerHTML = '<div class="loading" aria-label="搜索结果加载中"></div>';
  searchSession.search(query);
}

function renderPaginatedSearchResults(from = 0) {
  const container = $('#searchResults');
  if (!container) return;
  searchResultsObserver?.disconnect();
  searchResultsObserver = null;
  searchPaginationNode?.remove();
  searchPaginationNode = null;
  if (!activeSearchTracks.length) {
    if (activeSearchStatus?.loading) container.innerHTML = '<div class="loading" aria-label="搜索结果加载中"></div>';
    else {
      const message = activeSearchStatus?.error || (activeSearchHasMore ? '本页没有匹配的歌曲' : '没有找到相关歌曲');
      container.innerHTML = '<p class="empty-state">' + esc(message) + '</p>';
    }
  } else if (from < activeSearchTracks.length) {
    renderTrackList(container, activeSearchTracks, { from, search: true });
  }
  if (!activeSearchHasMore || activeSearchStatus?.loading) return;

  if (!activeSearchStatus?.added.length) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'suggestion-chip';
    button.textContent = '加载更多结果';
    button.addEventListener('click', loadMoreSearchResults);
    container.appendChild(button);
    searchPaginationNode = button;
    return;
  }

  const sentinel = document.createElement('div');
  sentinel.className = 'search-results-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  container.appendChild(sentinel);
  searchPaginationNode = sentinel;
  if (!('IntersectionObserver' in window)) return;

  if (searchResultsObserver) searchResultsObserver.disconnect();
  searchResultsObserver = new IntersectionObserver(function(entries) {
    if (entries.some(function(entry) { return entry.isIntersecting; })) loadMoreSearchResults();
  }, { rootMargin: '420px 0px' });
  searchResultsObserver.observe(sentinel);
}

function loadMoreSearchResults() {
  searchSession.loadMore();
}


function fallbackCover(img) {
  if (img.dataset.fallback) return;
  if (img.dataset.proxyCover) {
    const proxy = img.dataset.proxyCover;
    delete img.dataset.proxyCover;
    img.src = proxy;
    return;
  }
  if (tryProviderCover(img, true)) return;
  if (img.dataset.decorativeCover) {
    img.dataset.fallback = '1';
    img.src = '/icon.svg';
    return;
  }
  if (img.dataset.recentTrackId || img.dataset.embeatCover || img.dataset.exactCover) {
    img.dataset.fallback = '1';
    img.src = LOCAL_TRACK_COVER;
    img.onerror = null;
    return;
  }
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
function renderTrackList(containerId, tracks, { from = 0, search = false } = {}) {
  const container = typeof containerId === 'string' ? $(containerId) : containerId;
  const isMobile = window.innerWidth <= 768;
  const isBrowseResults = container.classList.contains('browse-results-list');
  const rows = tracks.slice(from).map((t, offset) => {
    const i = from + offset;
    const liked = isFavorite(t.id);
    return `
    <div class="track-row${isBrowseResults ? ' browse-result-row' : ''}" data-track-id="${t.id}" data-idx="${i}">
      ${isBrowseResults ? '<span class="browse-result-index">' + (i + 1) + '</span>' : ''}
      ${trackCoverMarkup(t, 'row-cover')}
      <div class="row-info">
        <div class="row-title">${esc(t.title)}</div>
        <div class="row-artist">${esc(t.artist)}${isBrowseResults ? '' : (t.album ? ' — ' + esc(t.album) : '')}</div>
      </div>
      ${isBrowseResults ? '<span class="browse-result-album">' + esc(t.album || '单曲') + '</span>' : ''}
      ${isMobile ? '' : '<span class="row-duration">' + formatTime(t.duration) + '</span>'}
      <div class="row-actions ${isMobile ? 'mobile' : ''}">
        <button class="row-action-btn like-btn ${liked ? 'liked' : ''}" data-track-action="like" aria-label="喜欢歌曲" aria-pressed="${liked}" title="${liked ? '取消喜欢' : '喜欢歌曲'}">
          <i class="fa-${liked ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <button class="row-action-btn" data-track-action="playlist" aria-label="添加到歌单">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>
  `;
  }).join('');
  if (from) container.insertAdjacentHTML('beforeend', rows);
  else container.innerHTML = rows;

  container.onclick = event => {
    const row = event.target.closest('.track-row');
    if (!row || !container.contains(row)) return;
    const track = tracks[Number(row.dataset.idx)];
    if (!track) return;
    const action = event.target.closest('[data-track-action]')?.dataset.trackAction;
    if (action === 'like') { toggleFavorite(track); return; }
    if (action === 'playlist') { addToPlaylist(track.id, track); return; }
    if (search) replaceQueue(tracks);
    const qIdx = state.queue.findIndex(t => t.id === track.id);
    if (qIdx >= 0) playTrack(state.queue[qIdx], qIdx);
    else { state.queue.push(track); playTrack(track, state.queue.length - 1); }
  };
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
        track = trackFromRecentEntry(rp);
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
      '<div class="fav-track-cover">' + (coverSrc ? trackCoverMarkup(track) : '<i class="fa-solid fa-music"></i>') + '</div>' +
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
        replaceQueue(favs);
        playTrack(track);
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
  replaceQueue(favoriteTracks);
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
          firstTrack = trackFromRecentEntry(rp);
        }
      }
      
      // 如果找到了第一首歌且有封面，显示封面图片
      if (firstTrack && (firstTrack.cover || firstTrack.coverSmall)) {
        coverHTML = trackCoverMarkup(firstTrack, '', true, pl.name);
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
      if (rp) t = trackFromRecentEntry(rp);
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

function addToPlaylist(trackId, track = state.queue.find(t => t.id === trackId)) {
  if (!state.playlists.length) { showToast('请先创建歌单'); return; }
  const pl = state.playlists[state.playlists.length - 1];
  if (pl.tracks.includes(trackId)) { showToast('已在歌单中'); return; }
  pl.tracks.push(trackId);
  // 缓存歌曲数据
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
if (sourceTabsEl) sourceTabsEl.remove();

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
const DEFAULT_ALBUM_COLORS = {
  primary: { r: 25, g: 25, b: 50 },
  secondary: { r: 40, g: 20, b: 60 },
  tertiary: { r: 15, g: 15, b: 35 },
};

// Fullscreen artwork belongs to one selection, even when revisiting the same ID.
let ampArtworkRequestId = 0;

function setAmpArtwork(artwork, cover) {
  artwork.style.backgroundImage = `url(${JSON.stringify(cover || LOCAL_TRACK_COVER)})`;
  window.ampCoverSrc = cover;
}

function updateAmpArtwork(track) {
  const artwork = $('#ampArtwork');
  if (!artwork) return;
  const requestId = ++ampArtworkRequestId;
  const isCurrent = () => requestId === ampArtworkRequestId;
  setAmpArtwork(artwork, '');
  if (window.ampGridColors) applyAlbumColors();
  const covers = new Map();
  let shown = false;
  for (const candidate of [track.cover, track.coverSmall]) {
    if (typeof candidate !== 'string' || !candidate.trim()) continue;
    let url;
    try { url = new URL(candidate, window.location.href); }
    catch (_) { continue; }
    const { pathname } = url;
    if (/^\/api\/(artist-photo|artist-avatar|album-cover)$/.test(pathname) ||
        pathname.startsWith('/assets/demo/') || pathname === '/icon.svg') continue;
    const resolved = resolveMusicResource(candidate);
    const direct = directCoverUrl(candidate);
    if (direct) covers.set(direct, resolved);
    covers.set(resolved, resolved);
  }

  function showCover(cover, colorSource) {
    if (!isCurrent() || shown) return;
    shown = true;
    setAmpArtwork(artwork, cover);
    if (track.source !== 'local') rememberRecentCover(track.id, cover);
    const applyPalette = colors => { if (isCurrent() && colors) applyAlbumColors(colors); };
    // A blocked CDN read can use the same track's proxy image for color sampling.
    extractAlbumColors(colorSource, colors => {
      if (!isCurrent()) return;
      if (colors) { applyPalette(colors); return; }
      if (colorSource === cover && /^https?:\/\//i.test(cover) && track.picId && track.source === 'embeat') {
        const query = new URLSearchParams({ picId: track.picId, source: 'embeat', size: '300' });
        extractAlbumColors(resolveMusicResource('/api/music/cover?' + query), applyPalette, { allowDefault: false });
      }
    }, { allowDefault: false });
  }

  const candidates = covers.entries();
  const provider = track.picId && track.source !== 'local' && !window.__TY_MUSIC_DESKTOP__ && window.tyMusicProvider;
  function requestProviderCover() {
    provider.resource(track, 'pic').then(cover => {
      if (isCurrent() && !shown) loadCover(cover, cover, null);
    }).catch(() => {});
  }
  function tryNextCover() {
    if (!isCurrent() || shown) return;
    const next = candidates.next();
    if (!next.done) {
      const [cover, colorSource] = next.value;
      loadCover(cover, colorSource, tryNextCover);
    } else if (provider && track.source !== 'embeat') requestProviderCover();
  }

  if (provider && track.source === 'embeat') requestProviderCover();
  function loadCover(cover, colorSource, onError) {
    const image = new Image();
    image.onload = () => showCover(cover, colorSource);
    image.onerror = onError;
    image.src = cover;
  }

  tryNextCover();
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
const ampColorExtractCache = new Map();

function extractAlbumColors(imageSrc, callback, { allowDefault = true } = {}) {
  // 使用缓存避免重复提取
  if (ampColorExtractCache.has(imageSrc)) {
    callback(ampColorExtractCache.get(imageSrc));
    return;
  }
  
  const img = new Image();
  const unavailable = () => callback(allowDefault ? DEFAULT_ALBUM_COLORS : null);
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const size = 100; // 小尺寸足够取色，性能好
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    let imageData;
    try {
      ctx.drawImage(img, 0, 0, size, size);
      imageData = ctx.getImageData(0, 0, size, size);
    } catch (_) { unavailable(); return; }
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
      unavailable();
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
    
    ampColorExtractCache.set(imageSrc, colors);
    if (ampColorExtractCache.size > 96) ampColorExtractCache.delete(ampColorExtractCache.keys().next().value);
    callback(colors);
  };
  img.onerror = unavailable;
  img.src = imageSrc;
}

function applyAlbumColors(colors) {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  window.ampGridColors = colors;
  if (!colors) {
    for (const property of ['--amp-accent', '--amp-accent-light', '--amp-accent-dark']) {
      player.style.removeProperty(property);
      player.style.removeProperty(property + '-rgb');
    }
    return;
  }
  const { primary, secondary, tertiary } = colors;
  
  // RGB 字符串
  const pRgb = `${primary.r}, ${primary.g}, ${primary.b}`;
  const sRgb = `${secondary.r}, ${secondary.g}, ${secondary.b}`;
  const tRgb = `${tertiary.r}, ${tertiary.g}, ${tertiary.b}`;
  
  // 设置 CSS 变量供 UI 使用
  player.style.setProperty('--amp-accent', `rgb(${pRgb})`);
  player.style.setProperty('--amp-accent-rgb', pRgb);
  player.style.setProperty('--amp-accent-light', `rgb(${sRgb})`);
  player.style.setProperty('--amp-accent-light-rgb', sRgb);
  player.style.setProperty('--amp-accent-dark', `rgb(${tRgb})`);
  player.style.setProperty('--amp-accent-dark-rgb', tRgb);
  
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
  const generation = albumDetailGeneration;
  if (!image) return;
  const source = image.currentSrc || image.src;
  if (!source) return;
  extractAlbumColors(source, colors => {
    if (generation === albumDetailGeneration && state.currentPage === 'album-detail') applyAlbumDetailColors(colors);
  });
}

function openAmpFullscreenPlayer() {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  ampIsShowing = true;
  
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
  
  document.body.style.overflow = 'hidden';

  // 启动音波动效（如果是电子乐且正在播放）
  if (state.isPlaying && state.currentTrack) {
  }
}
window.openNowPlaying = openAmpFullscreenPlayer;

function getActiveTrack() {
  return state.currentTrack || getQueue()[0] || null;
}

function closeAmpFullscreenPlayer() {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  
  ampArtworkRequestId += 1;
  ampIsShowing = false;
  player.classList.remove('show');
  setTimeout(() => {
    if (ampIsShowing) return;
    player.style.display = 'none';
    document.body.style.overflow = '';
  }, 400);
}

function updateAmpFullscreenPlayer(trackOverride) {
  const track = trackOverride || getActiveTrack();
  if (!track) return;

  // Keep the canonical state aligned before any asynchronous artwork/lyrics
  // work starts. This makes every caller (manual or automatic next) render the
  // same track identity immediately.
  if (state.currentTrack?.id !== track.id) state.currentTrack = track;
  
  updateAmpArtwork(track);

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
  paintSongLike($('#ampLikeBtn'), isFavorite(track.id));
  
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
let ampLyricsRequestId = 0;

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
  const requestId = ++ampLyricsRequestId;
  const trackId = track.id;
  
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
  
  loadLyrics(track, lines => {
    if (requestId !== ampLyricsRequestId || getActiveTrack()?.id !== trackId) return;
    state.lyrics.lines = Array.isArray(lines) ? lines : [];
    if (state.lyrics.lines.length > 0) {
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
    shuffleBtn.addEventListener('click', toggleShuffle);
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
      const track = getActiveTrack();
      if (track) toggleFavorite(track);
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
    const ampThumb = { style: {} };
    let ampDragging = false;

    function ampGetClientX(e) {
      return e.touches ? e.touches[0].clientX : e.clientX;
    }

    function ampApplySeek(clientX) {
      const rect = progressBar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setSliderValue('#ampProgressBar', pct * 100);
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
      setSliderValue('#ampProgressBar', pct * 100);
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
        replaceQueue(currentArtistTracks);
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

let localMusicDB = null;
let localMusicDBOpening = null;

function openLocalMusicDB() {
  if (localMusicDB) return Promise.resolve(localMusicDB);
  return localMusicDBOpening ||= LocalMusicDB.open().then(db => {
    const clear = () => { if (localMusicDB === db) localMusicDB = null; };
    db.addEventListener('versionchange', clear);
    db.addEventListener('close', clear);
    return localMusicDB = db;
  }).finally(() => { localMusicDBOpening = null; });
}

function getAllLocalTracks() {
  return LocalMusicDB.list(localMusicDB);
}

async function deleteLocalTrack(id) {
  await LocalMusicDB.remove(localMusicDB, id);
  if (state.currentTrack?.source === 'local' && state.currentTrack.id === id) {
    beginPlaybackSelection();
    updatePlayBtn();
  }
  replaceQueue(state.queue.filter(track => track.id !== id));
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
    let finished = false;
    function finish(duration) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      audioEl.removeEventListener('loadedmetadata', onMetadata);
      audioEl.removeEventListener('error', onError);
      audioEl.removeAttribute('src');
      audioEl.load();
      URL.revokeObjectURL(url);
      metadata.duration = Number.isFinite(duration) ? duration : 0;
      resolve(metadata);
    }
    const onMetadata = () => finish(audioEl.duration);
    const onError = () => finish(0);
    const timer = setTimeout(onError, 10000);
    audioEl.addEventListener('loadedmetadata', onMetadata);
    audioEl.addEventListener('error', onError);
    audioEl.src = url;
  });
}

async function handleLocalFileUpload(files) {
  let db;
  try { db = await openLocalMusicDB(); }
  catch (error) { showToast(error.message || '打开本地曲库失败'); return; }
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
      await LocalMusicDB.save(db, track);
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
  const container = document.getElementById('localTracksList');
  const localTracksCount = document.getElementById('localTracksCount');
  let tracks;
  try {
    await openLocalMusicDB();
    tracks = await getAllLocalTracks();
  } catch (error) {
    const message = document.createElement('p');
    message.className = 'empty-state';
    message.textContent = error.message || '读取本地曲库失败';
    container.replaceChildren(message);
    return;
  }
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
      try {
        await deleteLocalTrack(el.dataset.localId);
        renderLocalTracks();
        showToast('已删除');
      } catch (error) { showToast(error.message || '删除本地歌曲失败'); }
    });
  });
  
  // 更新存储信息显示
  updateStorageInfo();
}

function playLocalTrack(id) {
  const playbackId = beginPlaybackSelection();
  function fail(message) {
    if (playbackId !== playbackRequestId) return;
    releaseLocalAudio();
    state.isPlaying = false;
    updatePlayBtn();
    showToast(message);
  }
  function readTrack() {
    if (playbackId !== playbackRequestId) return;
    try {
      const tx = localMusicDB.transaction(['tracks'], 'readonly');
      const request = tx.objectStore('tracks').get(id);
      request.onsuccess = e => {
        if (playbackId !== playbackRequestId) return;
        const stored = e.target.result;
        if (!stored) { fail('歌曲不存在，可能已被删除'); return; }
        if (!stored.audioData?.byteLength) { fail('无法播放：音频数据丢失，请重新上传该文件'); return; }
        try {
          const { audioData, ...metadata } = stored;
          const track = { ...metadata, source: 'local', cover: LOCAL_TRACK_COVER, coverSmall: LOCAL_TRACK_COVER };
          const blob = new Blob([audioData], { type: stored.fileType || 'audio/mpeg' });
          localPlaybackUrl = URL.createObjectURL(blob);
          if (!state.queue.some(item => item.id === track.id)) state.queue.push(track);
          selectQueueTrack(track);
          presentPlaybackTrack(track);
          audio.src = localPlaybackUrl;
          audio.load();
          audio.play().then(() => {
            if (playbackId !== playbackRequestId) return;
            state.isPlaying = true;
            updatePlayBtn();
            showToast('正在播放: ' + track.title);
          }).catch(error => {
            if (playbackId !== playbackRequestId) return;
            // Permission rejection is retryable from the play button.
            if (error.name === 'NotAllowedError') showToast('请点击播放按钮继续播放');
            else fail('播放失败，请重试');
          });
        } catch (_) { fail('播放失败：音频数据损坏，请重新上传'); }
      };
      request.onerror = () => fail('读取失败，请刷新页面重试');
      tx.onabort = () => fail('读取失败，请刷新页面重试');
    } catch (_) { fail('读取失败，请刷新页面重试'); }
  }
  if (localMusicDB) readTrack();
  else openLocalMusicDB().then(readTrack).catch(() => fail('读取失败，请刷新页面重试'));
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
let albumDetailGeneration = 0;
async function openAlbumDetail(albumId) {
  albumDetailGeneration++;
  currentAlbumTracks = [];
  console.log('[Album] openAlbumDetail called', { albumId });
  
  // 存储当前专辑 ID
  window.currentAlbumId = albumId;
  window.currentAlbumData = null;
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  $('#albumFavBtn').hidden = false;
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
        replaceQueue(tracks);
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
}

// Embeat exposes a track and album metadata, not a verified album track list.
function openEmbeatAlbum(track) {
  albumDetailGeneration++;
  navigateTo('album-detail');
  resetAlbumDetailColors();
  window.currentAlbumId = null;
  window.currentAlbumData = null;
  currentAlbumTracks = [track];
  $('#albumFavBtn').hidden = true;
  setShinyText('albumDetailTitle', track.album || '专辑名称未知');
  $('#albumDetailArtist').textContent = track.artist || '';
  $('#albumDetailMeta').textContent = 'Embeat · 完整曲目暂不可用';
  const cover = $('#albumDetailCover');
  cover.onload = function() { syncAlbumDetailColorsFromCover(this); };
  setPlaybackCover(cover, track);
  renderAlbumTracks(currentAlbumTracks);
}

// 通过 picId 获取专辑信息（最准确）
async function openAlbumByPicId(picId, songId, albumName, artistName, source, albumId) {
  if (source === 'embeat') { showToast('Embeat 暂不提供完整专辑曲目'); return; }
  const generation = ++albumDetailGeneration;
  const isCurrent = () => generation === albumDetailGeneration && state.currentPage === 'album-detail';
  currentAlbumTracks = [];
  window.currentAlbumId = null;
  window.currentAlbumData = null;
  console.log('[Album] openAlbumByPicId', { picId, songId, albumName, artistName, source, albumId });
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  $('#albumFavBtn').hidden = false;
  
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
    if (!isCurrent()) return;
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
    
    const albumCoverEl = document.getElementById('albumDetailCover');
    albumCoverEl.onload = function() { syncAlbumDetailColorsFromCover(this); };
    setPlaybackCover(albumCoverEl, tracks[0], 500);
    if (albumCoverEl.complete) syncAlbumDetailColorsFromCover(albumCoverEl);
    
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
    if (!isCurrent()) return;
    console.error('[Album] Error loading album:', e);
    container.innerHTML = '<p class="empty-state">加载专辑失败</p>';
    document.getElementById('albumDetailMeta').textContent = '加载失败';
  }
}

// 通过专辑名称搜索曲目（向后兼容）
async function openAlbumByName(albumName, artistName, source, picId) {
  if (source === 'embeat') { showToast('Embeat 暂不提供完整专辑曲目'); return; }
  const generation = ++albumDetailGeneration;
  const isCurrent = () => generation === albumDetailGeneration && state.currentPage === 'album-detail';
  currentAlbumTracks = [];
  window.currentAlbumId = null;
  window.currentAlbumData = null;
  console.log('[Album] openAlbumByName (fallback)', { albumName, artistName, source, picId });
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  $('#albumFavBtn').hidden = false;
  
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
    if (!isCurrent()) return;
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

    const albumCoverEl = document.getElementById('albumDetailCover');
    albumCoverEl.onload = function() { syncAlbumDetailColorsFromCover(this); };
    setPlaybackCover(albumCoverEl, tracks[0], 500);
    if (albumCoverEl.complete) syncAlbumDetailColorsFromCover(albumCoverEl);

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
    if (!isCurrent()) return;
    console.error('[Album] Error loading album:', e);
    container.innerHTML = '<p class="empty-state">加载专辑失败</p>';
  }
}

function playAlbumAll() {
  if (!currentAlbumTracks.length) return;
  var track = currentAlbumTracks[0];
  playTrack(track, 0);
  replaceQueue(currentAlbumTracks);
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
var currentArtistGeneration = 0;
var currentArtistLoading = false;
const ARTIST_PAGE_SIZE = 20;

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
  if (track.source === 'embeat') { openEmbeatAlbum(track); return; }
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
  const generation = ++currentArtistGeneration;
  currentArtistLoading = true;
  currentArtistTracks = [];
  currentArtistFeaturedTracks = [];
  currentArtistLatestTracks = [];
  currentArtistOtherTracks = [];
  currentArtistName = artistName;
  currentArtistOffset = 0;
  currentArtistHasMore = false;
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
    var artistPage = await fetch('/api/music/search?keywords='+encodeURIComponent(artistName)+'&limit='+ARTIST_PAGE_SIZE, { cache: 'no-store', signal: AbortSignal.timeout(15000) }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    if (generation !== currentArtistGeneration) return;
    const songs = artistPage.songs || [];
    const seen = new Set();
    // Embeat supplies relevance order, not release dates.
    currentArtistTracks = songs.map(normalizeTrack).filter(track => {
      if (seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    });
    currentArtistFeaturedTracks = currentArtistTracks.slice(0, 6);
    currentArtistLatestTracks = currentArtistTracks.slice(6, 14);
    currentArtistOtherTracks = currentArtistTracks.slice(14);
    currentArtistOffset = Number.isFinite(Number(artistPage.nextOffset)) ? Number(artistPage.nextOffset) : songs.length;
    currentArtistHasMore = artistPage.hasMore === true;
    document.getElementById('artistDetailMeta').textContent = '';
    // 后台加载头像和简介（不阻塞歌曲列表）
    loadArtistPhoto(artistName, currentArtistTracks, generation);
    loadArtistBio(artistName, currentArtistTracks, generation);
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
    if (generation !== currentArtistGeneration) return;
    console.error('[Artist] Error:',e.message);
    document.getElementById('artistFeaturedList').innerHTML = '<p class="empty-state">加载失败</p>';
    document.getElementById('artistLatestList').innerHTML = '';
    document.getElementById('artistOtherList').innerHTML = '';
  } finally {
    if (generation === currentArtistGeneration) currentArtistLoading = false;
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
  if (currentArtistLoading || !currentArtistHasMore || !currentArtistName) return;
  const generation = currentArtistGeneration;
  const artistName = currentArtistName;
  const offset = currentArtistOffset;
  currentArtistLoading = true;
  
  var btn = document.getElementById('loadMoreArtistBtn');
  if (btn) {
    btn.querySelector('button').textContent = '';
    btn.querySelector('button').disabled = true;
  }
  
  try {
    var data = await fetch('/api/music/search?keywords='+encodeURIComponent(artistName)+'&limit='+ARTIST_PAGE_SIZE+'&offset='+offset, { cache: 'no-store', signal: AbortSignal.timeout(15000) }).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    if (generation !== currentArtistGeneration) return;
    var newSongs = data.songs || [];
    currentArtistOffset = Number.isFinite(Number(data.nextOffset)) ? Number(data.nextOffset) : offset + newSongs.length;
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
      const track = normalizeTrack(s);
      if (!seen.has(track.id)) {
        seen.add(track.id);
        newTracks.push(track);
      }
    });
    
    if (!newTracks.length) {
      if (currentArtistHasMore) addLoadMoreButton();
      else if (btn) btn.remove();
      return;
    }
    
    // 新分页结果属于“其他歌曲”，首页分组保持稳定。
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
    if (generation !== currentArtistGeneration) return;
    console.error('[Artist] Load more error:', e.message);
    if (btn) {
      btn.querySelector('button').textContent = '加载失败，点击重试';
      btn.querySelector('button').disabled = false;
    }
  } finally {
    if (generation === currentArtistGeneration) currentArtistLoading = false;
  }
}

async function loadArtistPhoto(artistName, tracks, generation = currentArtistGeneration) {
  var ai = document.getElementById('artistAvatar'), af = document.getElementById('artistAvatarFallback'), bg = document.getElementById('artistBg');
  // 优先通过网易云艺人详情 API 获取真实头像和背景
  try {
    var res = await fetch('/api/music/artist-info?name=' + encodeURIComponent(artistName));
    if (res.ok) {
      var info = await res.json();
      if (generation !== currentArtistGeneration) return;
      if (info.avatar && ai) {
        ai.src = info.avatar; ai.style.display = 'block';
        ai.onload = function(){if(generation !== currentArtistGeneration)return;if(af)af.style.display='none';};
        ai.onerror = function(){if(generation !== currentArtistGeneration)return;ai.style.display='none';if(af)af.style.display='flex';};
        var colorSource = '/api/cover?size=1000&url=' + encodeURIComponent(info.avatar);
        extractAlbumColors(colorSource, colors => { if (generation === currentArtistGeneration) applyArtistPageColors(colors); });
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
  if (generation !== currentArtistGeneration) return;
  // 降级：用第一首歌封面
  if (tracks.length && ai) {
    var cover = tracks[0].coverSmall || tracks[0].cover || '';
      if (cover) {
        ai.src = cover; ai.style.display = 'block';
        extractAlbumColors(cover, colors => { if (generation === currentArtistGeneration) applyArtistPageColors(colors); });
        ai.onload = function(){if(generation !== currentArtistGeneration)return;if(af)af.style.display='none';if(bg){bg.style.backgroundImage='url('+cover+')';bg.style.display='block';}};
      ai.onerror = function(){if(generation !== currentArtistGeneration)return;ai.style.display='none';if(af)af.style.display='flex';};
    }
  }
}

async function loadArtistBio(artistName, tracks, generation = currentArtistGeneration) {
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

    if (generation !== currentArtistGeneration) return;
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

    if (generation !== currentArtistGeneration) return;
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
    if (generation !== currentArtistGeneration) return;
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
  
  // 定位菜单
  var btn = trigger || (typeof event !== 'undefined' && event.target?.closest('.album-track-more'));
  if (btn) {
    var rect = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    const height = menu.offsetHeight;
    const below = rect.bottom + 8;
    const top = below + height <= window.innerHeight - 8 ? below : rect.top - height - 8;
    menu.style.top = Math.max(8, top) + 'px';
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
  
  const saved = isAlbumFavorited(albumId);
  btn.classList.toggle('favorited', saved);
  btn.setAttribute('aria-pressed', String(saved));
  btn.title = saved ? '取消收藏专辑' : '收藏专辑';
  const icon = btn.querySelector('i');
  if (icon) icon.className = `fa-${saved ? 'solid' : 'regular'} fa-bookmark`;
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
      trackCoverMarkup({ coverSmall: album.picUrl || album.cover, artist: typeof album.artist === 'object' ? album.artist?.name : album.artist, album: album.name, source: album.source, picId: album.picId }, 'album-card-cover') +
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
let cfRunning = false;
let cfItems = {};
let cfReflections = {};
let cfSpines = {};
let cfVisibleStart = 0;
let cfVisibleEnd = -1;
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
  cfSpines = {};
  cfVisibleStart = 0;
  cfVisibleEnd = -1;
  cfSnapTarget = null;
  cfSpringVelocity = 0;
  
  if (!cfAlbums.length) {
    stage.innerHTML = '<p class="empty-state" style="position:static;width:100%;color:var(--text-secondary)">还没有收藏专辑</p>';
    return;
  }
  
  cfAlbums.forEach((album, i) => {
    const artwork = trackCoverMarkup({
      coverSmall: album.picUrl || album.cover, source: album.source, picId: album.picId,
    }).replace('<img ', '<img draggable="false" ');
    var albumId = album.id || album.albumId;
    var albumName = album.name || '';

    // ---- 实体专辑封套 (vinyl sleeve) ----
    const item = document.createElement('div');
    item.className = 'cf-item';
    item.style.display = 'none';
    item.dataset.index = i;
    item.dataset.albumId = albumId;

    // 正面封面（先用小图快速显示）
    const front = document.createElement('div');
    front.className = 'cf-front';
    front.innerHTML = artwork;
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
    cfSpines[i] = [spineR, spineL, spineT, spineB];
    
    // 正面和倒影共用一张图，让浏览器复用下载和解码。
    const ref = document.createElement('div');
    ref.className = 'cf-reflection-item';
    ref.style.display = 'none';
    ref.innerHTML = artwork;
    reflection.appendChild(ref);
    cfReflections[i] = ref;
  });
  
  cfOffset = Math.floor(cfAlbums.length / 2);
  cfActiveIndex = Math.round(cfOffset);
  cfUpdateInfo();
  cfWake();
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
  cfWake();
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
  
  // Only the visible rail and the items leaving it need DOM updates.
  const first = Math.max(0, Math.ceil(cfOffset - CF_RANGE));
  const last = Math.min(cfAlbums.length - 1, Math.floor(cfOffset + CF_RANGE));
  for (let i = cfVisibleStart; i <= cfVisibleEnd; i++) {
    if (i >= first && i <= last) continue;
    cfItems[i].style.display = 'none';
    if (cfReflections[i]) cfReflections[i].style.display = 'none';
  }
  cfVisibleStart = first;
  cfVisibleEnd = last;
  for (let i = first; i <= last; i++) {
    const dist = i - cfOffset;
    const absDist = Math.abs(dist);
    const item = cfItems[i];
    const ref = cfReflections[i];
    if (!item) continue;
    
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
    cfSpines[i].forEach(s => {
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

function cfWake() {
  // Input/data/resize request one frame; only a moving spring keeps drawing.
  if (!cfRunning || document.hidden || state.currentPage !== 'album-favorites' || cfAnimId !== null) return;
  cfAnimId = requestAnimationFrame(cfLoop);
}

function cfLoop(time) {
  cfAnimId = null;
  if (!cfRunning || document.hidden || state.currentPage !== 'album-favorites') return;
  if (!cfLastFrameTime) cfLastFrameTime = time;
  const dt = Math.min(0.032, Math.max(0.001, (time - cfLastFrameTime) / 1000));
  cfLastFrameTime = time;
  cfRender(dt);
  if (cfSnapTarget !== null) cfWake();
  else cfLastFrameTime = 0;
}

function cfStart() {
  cfRunning = true;
  cfLoadAlbums();
  cfBuildStage();
  cfActiveIndex = -1;
  cfLastFrameTime = 0;
  cfWake();
  cfBindMouse();
}

function cfStop() {
  cfRunning = false;
  if (cfAnimId !== null) { cancelAnimationFrame(cfAnimId); cfAnimId = null; }
  cfUnbindMouse();
  const container = document.getElementById('coverFlowContainer');
  if (cfPointerId !== null && container?.hasPointerCapture?.(cfPointerId)) container.releasePointerCapture(cfPointerId);
  if (container) container.style.cursor = '';
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
    cfWake();
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
    cfWake();
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
  const onVisibility = () => {
    if (document.hidden) {
      if (cfAnimId !== null) { cancelAnimationFrame(cfAnimId); cfAnimId = null; }
      cfLastFrameTime = 0;
      if (cfDragging) {
        if (container.hasPointerCapture?.(cfPointerId)) container.releasePointerCapture(cfPointerId);
        container.style.cursor = '';
        cfPointerId = null;
        cfVelocity = 0;
        cfSnapTo(Math.round(cfOffset));
      }
    } else cfWake();
  };
  container.addEventListener('pointerdown', onDown);
  container.addEventListener('pointermove', onMove);
  container.addEventListener('pointerup', onUp);
  container.addEventListener('pointercancel', onCancel);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('resize', cfWake);
  cfCleanupHandlers = [
    { el: container, type: 'pointerdown', fn: onDown },
    { el: container, type: 'pointermove', fn: onMove },
    { el: container, type: 'pointerup', fn: onUp },
    { el: container, type: 'pointercancel', fn: onCancel },
    { el: document, type: 'visibilitychange', fn: onVisibility },
    { el: window, type: 'resize', fn: cfWake },
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
      trackCoverMarkup({ coverSmall: album.picUrl || album.cover, artist: album.artist?.name, album: album.name }) +
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
