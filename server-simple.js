/**
 * TY Music Server - GD Studio API Version
 * 网易云基础搜索，Embeat 可用时由客户端独立补充。
 * 无需本地 NCM API 进程，更简单更稳定
 */
const http = require('http');
const https = require('https');
const { createStaticHandler } = require('./static-files.cjs');
const serveStatic = createStaticHandler();
const { URL } = require('url');
const { createEmbeatClient } = require('./gd-embeat.cjs');
const embeat = createEmbeatClient();

// =========================== HTTP Keep-Alive Agent ===========================
// 复用 TCP 连接，避免每次请求都重新握手（对 GD API 延迟高的情况尤其重要）
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50, timeout: 30000 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, timeout: 30000 });

// =========================== 请求去重 ===========================
// 同一 URL 同时只请求一次，避免并发时重复调用 GD API
const pendingRequests = new Map(); // url → Promise

const PORT = process.env.PORT || 8899;
const GD_API = 'https://music-api.gdstudio.xyz/api.php';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const HOT_CHART = Object.freeze({
  provider: '网易云音乐',
  playlistId: '3778678',
  name: '云音乐热歌榜',
});

// Curated, canonical editions only. Do not replace these with fuzzy title searches.
const FEATURED_THE_WEEKND = Object.freeze([
  { id: '1406633327', name: 'Blinding Lights', artist: 'The Weeknd' },
  { id: '32337668', name: 'The Hills', artist: 'The Weeknd' },
  { id: '442867526', name: 'Die For You', artist: 'The Weeknd' },
  { id: '32507839', name: "Can't Feel My Face", artist: 'The Weeknd' },
  { id: '548785552', name: 'Call Out My Name', artist: 'The Weeknd' },
  { id: '2670864154', name: 'Timeless', artist: 'The Weeknd' },
]);

// =========================== API 结果缓存 ===========================
// 缓存搜索/热门结果，避免重复请求 GD API（公网访问延迟高，缓存很重要）
const apiCache = new Map(); // key → { data, expiry }
const CACHE_TTL = {
  search: 5 * 60 * 1000,   // 搜索结果缓存 5 分钟
  hot: 10 * 60 * 1000,     // 热门缓存 10 分钟
  featured: 60 * 60 * 1000, // 精选曲库缓存 1 小时
  album: 30 * 60 * 1000,    // 专辑曲目缓存 30 分钟
  cover: 30 * 60 * 1000,   // 封面 URL 缓存 30 分钟
  lyric: 60 * 60 * 1000,   // 歌词缓存 1 小时
  audio: 60 * 60 * 1000,   // 音频 URL 缓存 1 小时
};

function cacheGet(key) {
  const entry = apiCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) { apiCache.delete(key); return null; }
  return entry.data;
}
function cacheSet(key, data, ttl) {
  apiCache.set(key, { data, expiry: Date.now() + ttl });
  // 定期清理过期条目（超过 500 条时）
  if (apiCache.size > 500) {
    const now = Date.now();
    for (const [k, v] of apiCache) { if (now > v.expiry) apiCache.delete(k); }
  }
}

// =========================== 工具函数 ===========================

// HTTPS GET JSON（带自动重试，使用 keep-alive）
async function httpsGetJSON(url, timeout = 10000, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const data = await _httpsGetJSONOnce(url, timeout);
      return data;
    } catch (e) {
      if (i < retries) {
        console.log(`[HTTPS] Retry ${i+1}/${retries} for ${url.substring(0, 60)}... (${e.message})`);
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      } else {
        throw e;
      }
    }
  }
}

function _httpsGetJSONOnce(url, timeout) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const client = isHttps ? https : http;
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': UA,
        'Referer': 'https://music.163.com/',
        'Accept': 'application/json',
        'Connection': 'keep-alive',
      },
      agent: isHttps ? httpsAgent : httpAgent,
    };
    const req = client.get(opts, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(_httpsGetJSONOnce(res.headers.location, timeout));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        try {
          const data = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(data));
        }
        catch (e) { reject(new Error('JSON parse error: ' + (Buffer.concat(chunks).toString('utf8')).slice(0, 100))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// Render's outbound network can handle the GD API more reliably through
// Node's built-in fetch than through the legacy https client. Keep the latter
// as a fallback when fetch is unavailable or transiently fails.
async function fetchJSONWithFetch(url, timeout = 10000) {
  if (typeof fetch !== 'function') throw new Error('fetch is unavailable');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Referer': 'https://music.163.com/',
        'Accept': 'application/json',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) {
      response.body?.cancel().catch(() => {});
      throw Object.assign(new Error(`HTTP ${response.status}`), { upstreamStatus: response.status });
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function gdGetJSON(url, timeout = 10000, isUsable = data => Boolean(data)) {
  let lastError = null;
  const requesters = [
    () => fetchJSONWithFetch(url, timeout),
    () => httpsGetJSON(url, timeout),
  ];
  for (const request of requesters) {
    try {
      const data = await request();
      if (data && typeof data === 'object' && isUsable(data)) return data;
      lastError = new Error('Unusable GD API response');
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) console.warn(`[GD API] Request failed: ${lastError.message}`);
  return null;
}

// HTTP/HTTPS GET (支持重定向，使用 keep-alive 连接复用)
// timeout 仅用于连接阶段，流式传输不设超时
function smartGet(url, headers, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const client = isHttps ? https : http;
    const opts = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: headers || {},
      agent: isHttps ? httpsAgent : httpAgent,
    };
    let resolved = false;
    const req = client.get(opts, (res) => {
      // 处理重定向
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolved = true;
        smartGet(res.headers.location, headers, timeout).then(resolve).catch(reject);
        return;
      }
      // 流式响应直接返回
      resolved = true;
      resolve(res);
    });
    req.on('error', (err) => {
      if (!resolved) { resolved = true; reject(err); }
    });
    // 只设置连接超时
    req.setTimeout(timeout, function() {
      if (!resolved) { resolved = true; req.destroy(); reject(new Error('connection timeout')); }
    });
    // 连接建立后取消超时，后续由流自行管理
    req.once('socket', function(socket) {
      socket.once('connect', function() {
        if (!resolved) req.setTimeout(0);
      });
    });
  });
}

// 请求去重包装：同一 URL 同时只请求一次
function dedupedGetJSON(url, timeout, retries) {
  const key = url;
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending;
  }
  const promise = httpsGetJSON(url, timeout, retries).finally(() => {
    pendingRequests.delete(key);
  });
  pendingRequests.set(key, promise);
  return promise;
}

// 默认封面 (base64 编码的简单的音乐图标)
const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+QvjwvdGV4dD48L3N2Zz4=';

// 歌手照片缓存（避免重复请求）
const artistPhotoCache = new Map();

// 获取歌手真实照片 URL（从网易云音乐 API）
async function getArtistPhotoUrl(artistName) {
  if (!artistName || artistName === '未知歌手') return null;
  
  // 检查缓存
  if (artistPhotoCache.has(artistName)) {
    return artistPhotoCache.get(artistName);
  }
  
  try {
    const url = `https://music.163.com/api/search/get?s=${encodeURIComponent(artistName)}&type=100&limit=1`;
    const data = await httpsGetJSON(url, 8000);
    
    if (data && data.result && data.result.artists && data.result.artists.length > 0) {
      const artist = data.result.artists[0];
      const photoUrl = artist.picUrl || artist.img1v1Url || null;
      
      if (photoUrl) {
        // 缓存结果（有效期 1 小时）
        artistPhotoCache.set(artistName, photoUrl);
        setTimeout(() => artistPhotoCache.delete(artistName), 3600000);
        console.log(`[Artist Photo] ${artistName}: ${photoUrl.substring(0, 60)}...`);
        return photoUrl;
      }
    }
  } catch (e) {
    console.error(`[Artist Photo] Failed to get photo for ${artistName}:`, e.message);
  }
  
  // 缓存空结果（避免重复请求）
  artistPhotoCache.set(artistName, null);
  setTimeout(() => artistPhotoCache.delete(artistName), 3600000);
  
  return null;
}

function artistNames(artists) {
  if (!Array.isArray(artists)) {
    if (artists && typeof artists === 'object') return String(artists.name || '').trim();
    return String(artists || '').trim();
  }
  return artists.map(artist => typeof artist === 'string' ? artist : artist?.name).filter(Boolean).join(', ');
}

function coverProxyUrl(picId, coverUrl, size) {
  const query = new URLSearchParams({ size: String(size) });
  if (coverUrl) query.set('url', coverUrl);
  else if (picId) query.set('picId', String(picId));
  else return '';
  return `/api/cover?${query.toString()}`;
}

function isUsableTrack(track) {
  return Boolean(
    track.id && track.name && track.artist && track.album && track.albumId &&
    track.picId && track.cover && track.coverSmall && Number(track.duration) > 0
  );
}

function formatNeteaseCatalogSong(song) {
  const album = song.al || song.album || {};
  const artists = song.ar || song.artists || [];
  return formatGDSong({
    id: song.id,
    name: song.name,
    artist: artistNames(artists) || '未知歌手',
    album: album.name || '',
    albumId: String(album.id || ''),
    albumTrackCount: Number(album.size || 0),
    pic_id: String(album.picId || album.id || ''),
    coverUrl: album.picUrl || '',
    dt: song.dt || song.duration || 0,
    source: 'netease'
  });
}

// 格式化网易云 / GD Studio 搜索结果为 player.js 格式。
// 优先保留网易云返回的原始 picUrl，避免 18 位 picId 被 JSON Number 舍入后取错封面。
function formatGDSong(s) {
  const artistStr = artistNames(s.artist) || '未知歌手';
  const picId = String(s.pic_id || s.picId || s.albumId || '');
  const coverUrl = String(s.coverUrl || s.picUrl || s.pic_url || '');
  const rawDuration = Number(s.duration || s.dt || 0);
  const duration = rawDuration > 10000 ? Math.round(rawDuration / 1000) : Math.round(rawDuration);

  return {
    id: String(s.id || ''),
    name: s.name || '未知歌曲',
    artist: artistStr,
    album: s.album || '',
    albumId: String(s.albumId || ''),
    albumTrackCount: Number(s.albumTrackCount || 0),
    cover: coverProxyUrl(picId, coverUrl, 1000) || `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    coverSmall: coverProxyUrl(picId, coverUrl, 300) || `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    picId: picId,
    duration,
    source: 'netease'
  };
}

function formatEmbeatSong(song) {
  const id = String(song.id);
  const picId = String(song.pic_id || '');
  // GD can return milliseconds for an Embeat page and seconds for another.
  const rawDuration = Number(song.extra_data?.duration);
  const duration = Number.isFinite(rawDuration) && rawDuration > 0 ? Math.round(rawDuration > 10000 ? rawDuration / 1000 : rawDuration) : 0;
  const cover = size => picId ? `/api/cover?${new URLSearchParams({ source: 'embeat', picId, size: String(size) })}` : '/icon.svg';
  return {
    id, providerId: id, source: 'embeat', name: song.name, artist: artistNames(song.artist),
    album: typeof song.album === 'string' ? song.album : '', albumId: '',
    urlId: String(song.url_id || id), lyricId: String(song.lyric_id || id), picId,
    duration,
    isrc: typeof song.extra_data?.isrc === 'string' ? song.extra_data.isrc : '',
    cover: cover(1000), coverSmall: cover(300),
  };
}

function mediaFault(statusCode, message, code = 'MEDIA_UPSTREAM_ERROR') {
  return Object.assign(new Error(message), { statusCode, code });
}
function trackSource(params) {
  const source = params.get('source') || 'netease';
  if (!['netease', 'embeat'].includes(source)) throw mediaFault(400, 'Unsupported source', 'INVALID_SOURCE');
  return source;
}
function embeatIdentity(params) {
  const identity = { id: params.get('trackId') || params.get('id') || '', name: params.get('title') || '', artist: params.get('artist') || '', isrc: params.get('isrc') || '' };
  if (!identity.id || !identity.name || !identity.artist || Object.values(identity).some(value => value.length > 1024)) throw mediaFault(400, 'Missing or invalid Embeat metadata', 'INVALID_TRACK');
  return identity;
}
// Only URLs returned by the fixed provider endpoint enter this path.
function validMediaUrl(raw) {
  try {
    const url = new URL(raw);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password && !url.port &&
      !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[)/i.test(url.hostname) ? url.toString() : '';
  } catch { return ''; }
}
async function resolveEmbeatAudio(params) {
  const identity = embeatIdentity(params);
  const id = params.get('id') || identity.id;
  if (id.length > 1024) throw mediaFault(400, 'Invalid audio identifier', 'INVALID_TRACK');
  const key = `embeat:audio:${JSON.stringify({ ...identity, resourceId: id })}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  if (pendingRequests.has(key)) return pendingRequests.get(key);
  const pending = (async () => {
    const data = await embeat.request('url', { source: 'embeat', id, br: 999 }, id);
    if (!data || !validMediaUrl(data.url) || !Number.isFinite(Number(data.br)) || Number(data.br) < 0 || !Number.isFinite(Number(data.size)) || Number(data.size) <= 0) throw mediaFault(404, 'Audio not found', 'MEDIA_NOT_FOUND');
    const resolved = { ...data, url: validMediaUrl(data.url) };
    cacheSet(key, resolved, 5 * 60 * 1000);
    return resolved;
  })().finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, pending);
  return pending;
}
function proxyPath(params) {
  trackSource(params);
  if (!params.get('id') || params.get('id').length > 1024) throw mediaFault(400, 'Missing or invalid id', 'INVALID_TRACK');
  if (params.get('source') === 'embeat') embeatIdentity(params);
  const query = new URLSearchParams();
  for (const key of ['id', 'source', 'trackId', 'title', 'artist', 'isrc']) if (params.has(key)) query.set(key, params.get(key));
  return `/api/music/proxy?${query}`;
}

async function hydrateNeteaseCoverUrls(songs, budget) {
  const missing = songs.filter(song => {
    const album = song.al || song.album || {};
    return !album.picUrl && song.id;
  }).slice(0, 100);
  if (!missing.length) return songs;

  try {
    const ids = missing.map(song => song.id);
    const url = 'https://music.163.com/api/song/detail/?ids=' + encodeURIComponent(JSON.stringify(ids));
    const data = budget ? await fetchJSONWithFetch(url, budget) : await dedupedGetJSON(url, 15000);
    const covers = new Map((data?.songs || []).map(song => {
      const album = song.al || song.album || {};
      return [String(song.id), { picId: album.picId, picUrl: album.picUrl }];
    }));

    songs.forEach(song => {
      const cover = covers.get(String(song.id));
      if (!cover?.picUrl) return;
      const album = song.al || song.album || {};
      album.picUrl = cover.picUrl;
      if (!album.picId && cover.picId) album.picId = cover.picId;
      if (song.al) song.al = album;
      else song.album = album;
    });
  } catch (e) {
    console.warn('[Cover hydration] Unavailable');
  }
  return songs;
}

// =========================== API 逻辑 ===========================

// 批量补全 GD API 原始数据中 pic_id 为空的歌曲封面
// 必须在 formatGDSong 之前调用（直接修改原始数据的 pic_id 字段）
async function fillMissingPicIdsRaw(songsRaw) {
  const missing = songsRaw.filter(s => !s.pic_id);
  if (missing.length === 0) return songsRaw;

  try {
    const ids = missing.map(s => s.id).join(',');
    const url = `https://music.163.com/api/song/detail?ids=[${ids}]`;
    const data = await httpsGetJSON(url, 8000);
    if (data && Array.isArray(data.songs)) {
      const picMap = {};
      const picUrlMap = {};
      data.songs.forEach(s => {
        const album = s.al || s.album || {};
        const picId = album.picId ? String(album.picId) : '';
        if (picId) picMap[String(s.id)] = picId;
        if (album.picUrl) picUrlMap[String(s.id)] = album.picUrl;
      });
      // 直接修改原始数据；pic_url 是精确的字符串 URL，不受 picId 数值精度影响。
      songsRaw.forEach(s => {
        if (!s.pic_id && picMap[s.id]) {
          s.pic_id = picMap[s.id];
        }
        if (!s.pic_url && picUrlMap[s.id]) s.pic_url = picUrlMap[s.id];
      });
      console.log(`[PicFill] Filled ${Object.keys(picMap).length}/${missing.length} missing pic_ids`);
    }
  } catch (e) {
    console.warn('[PicFill] Failed to fill pic_ids:', e.message);
  }
  return songsRaw;
}

// GD Studio API 搜索（按歌名搜索）
async function gdSearch(keywords, limit = 30) {
  const cacheKey = `search:${keywords}:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // 网易云官方搜索返回真实的 song / artist / album / picId 关联。
  // 将它作为主路径，避免第三方搜索空响应时让流派展示错误的兜底歌曲。
  try {
    const official = await searchNeteaseCatalog(keywords, limit);
    if (official.length > 0) {
      cacheSet(cacheKey, official, CACHE_TTL.search);
      return official;
    }
  } catch (e) {
    console.warn('[Netease Search] Upstream unavailable');
  }

  // 搜索失败时保持为空，不能把第三方模糊搜索结果伪装成该流派的数据。
  console.warn('[Netease Search] No verified results');
  return [];
}

// Two official endpoints, then GD's public Netease catalog. They share a
// 12-second budget; never switch catalogs or replace a valid empty response.
async function searchNeteaseCatalogPage(keywords, limit, offset = 0) {
  const requestedLimit = Number(limit);
  const requestedOffset = Number(offset);
  const safeLimit = Math.max(1, Math.min(Number.isFinite(requestedLimit) ? Math.trunc(requestedLimit) || 30 : 30, 100));
  const safeOffset = Math.max(0, Number.isFinite(requestedOffset) ? Math.trunc(requestedOffset) : 0);
  const query = new URLSearchParams({ s: keywords, type: '1', limit: String(safeLimit), offset: String(safeOffset) });
  const started = Date.now();
  const deadline = started + 12000;
  let lastError;
  for (const source of ['cloudsearch/pc', 'search/get']) {
    try {
      const data = await fetchJSONWithFetch(`https://music.163.com/api/${source}?${query}`, 4000);
      const result = data?.result;
      const total = result?.songCount;
      // A business error, malformed response or missing count is not zero hits.
      if (data?.code !== 200 || !result || !Number.isInteger(total) || total < 0 ||
          (total > 0 && !Array.isArray(result.songs)) ||
          (result.songs !== undefined && !Array.isArray(result.songs))) {
        console.warn(`[Search] source=${source} code=${Number(data?.code) || 0} status=invalid elapsed=${Date.now() - started}`);
        throw new Error('Invalid upstream search response');
      }
      const songs = result.songs || [];
      if (songs.some(song => !song || !song.id || typeof song.name !== 'string' || !song.name.trim()) ||
          (!songs.length && total > safeOffset)) throw new Error('Incomplete upstream search response');
      if (!songs.length) return { songs: [], total, hasMore: false, nextOffset: safeOffset };
      await hydrateNeteaseCoverUrls(songs, 800);
      const tracks = songs.map(song => {
        const track = formatNeteaseCatalogSong(song);
        const album = song.al || song.album || {};
        if (!track.picId && !album.picUrl) {
          track.cover = track.coverSmall = `/api/artist-avatar?name=${encodeURIComponent(track.artist)}`;
        }
        return track;
      });
      console.log(`[Search] source=${source} status=ok count=${tracks.length} elapsed=${Date.now() - started}`);
      return {
        songs: tracks,
        total: Math.max(total, safeOffset + songs.length),
        hasMore: safeOffset + songs.length < total,
        nextOffset: safeOffset + songs.length,
      };
    } catch (error) {
      lastError = error;
      console.warn(`[Search] source=${source} status=${error.upstreamStatus || (error.name === 'AbortError' ? 'timeout' : 'failed')} elapsed=${Date.now() - started}`);
    }
  }
  try {
    if (Date.now() >= deadline) throw Object.assign(new Error('Search deadline'), { name: 'AbortError' });
    const query = new URLSearchParams({ types: 'search', source: 'netease', name: keywords, count: String(safeLimit), pages: String(Math.floor(safeOffset / safeLimit) + 1) });
    const data = await fetchJSONWithFetch(`${GD_API}?${query}`, Math.min(4000, deadline - Date.now()));
    if (!Array.isArray(data) || data.length > safeLimit || data.some(song => !song || song.source !== 'netease' ||
        !['string', 'number'].includes(typeof song.id) || !String(song.id).trim() || typeof song.name !== 'string' || !song.name.trim())) throw new Error('Invalid GD Netease response');
    const songs = data.slice(safeOffset % safeLimit).map(formatGDSong);
    console.log(`[Search] source=gd-netease status=ok count=${songs.length} elapsed=${Date.now() - started}`);
    return { songs, total: null, hasMore: data.length >= safeLimit, nextOffset: safeOffset + songs.length };
  } catch (error) {
    lastError = error;
    console.warn(`[Search] source=gd-netease status=${error.upstreamStatus || (error.name === 'AbortError' ? 'timeout' : 'failed')} elapsed=${Date.now() - started}`);
  }
  const error = new Error(lastError?.name === 'AbortError' ? 'Search upstream timed out' : 'Search upstream unavailable');
  error.statusCode = lastError?.name === 'AbortError' ? 504 : 502;
  error.code = error.statusCode === 504 ? 'SEARCH_TIMEOUT' : 'SEARCH_UPSTREAM_ERROR';
  throw error;
}

async function searchNeteaseCatalog(keywords, limit) {
  const page = await searchNeteaseCatalogPage(keywords, limit, 0);
  return page.songs;
}

function normalizedFeaturedText(value) {
  return String(value || '').replace(/\s+/g, '').toLowerCase();
}

function isExactFeaturedTrack(song, featured) {
  if (String(song?.id || '') !== featured.id) return false;
  if (normalizedFeaturedText(song.name) !== normalizedFeaturedText(featured.name)) return false;
  const artists = song.ar || song.artists || [];
  return artists.some(artist => normalizedFeaturedText(artist?.name || artist) === normalizedFeaturedText(featured.artist));
}

async function getFeaturedClassics(limit = 1) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 1, FEATURED_THE_WEEKND.length));
  const dayIndex = Math.floor(Date.now() / 86_400_000) % FEATURED_THE_WEEKND.length;
  const ordered = FEATURED_THE_WEEKND.map((_, index) => FEATURED_THE_WEEKND[(dayIndex + index) % FEATURED_THE_WEEKND.length]);
  const selected = ordered.slice(0, safeLimit);
  const cacheKey = `featured:${selected.map(track => track.id).join(',')}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  const ids = selected.map(track => track.id);
  const url = 'https://music.163.com/api/song/detail/?ids=' + encodeURIComponent(JSON.stringify(ids));
  const data = await dedupedGetJSON(url, 15000);
  const songs = Array.isArray(data?.songs) ? data.songs : [];
  await hydrateNeteaseCoverUrls(songs);
  const byId = new Map(songs.map(song => [String(song.id), song]));

  const result = selected.map(featured => {
    const song = byId.get(featured.id);
    if (!song || !isExactFeaturedTrack(song, featured)) {
      console.warn(`[Featured] Rejected unexpected catalog result for ${featured.artist} - ${featured.name}`);
      return null;
    }
    return formatNeteaseCatalogSong(song);
  }).filter(isUsableTrack);

  cacheSet(cacheKey, result, CACHE_TTL.featured);
  return result;
}

// 搜索备用关键词映射
function getSearchFallbacks(keywords) {
  const fallbacks = {
    '嘻哈说唱': ['嘻哈', '说唱', 'hiphop', 'rap', '热门说唱'],
    '热门流行': ['流行', '热门', '流行歌曲', '华语流行'],
    '经典摇滚': ['摇滚', 'rock', '经典摇滚乐'],
    '电子舞曲': ['电子', 'EDM', '电子音乐', '电音'],
    '爵士经典': ['爵士', 'jazz', '经典爵士'],
    '古典音乐': ['古典', 'classical', '古典音乐推荐'],
    'R&B节奏蓝调': ['R&B', 'rnb', '节奏蓝调'],
    '乡村音乐': ['乡村', 'country', '民谣'],
    'K-pop韩国流行': ['K-pop', 'kpop', '韩国流行'],
    '华语热门': ['华语', '中文歌', '华语热门歌曲'],
    '拉丁音乐': ['拉丁', 'latin', '拉丁音乐推荐'],
    '动漫主题曲': ['动漫', 'anime', '动漫歌曲', '日本动漫'],
  };
  // 精确匹配
  if (fallbacks[keywords]) {
    return [keywords, ...fallbacks[keywords]];
  }
  // 部分匹配（如"嘻哈说唱 2026"）
  for (const key of Object.keys(fallbacks)) {
    if (keywords.includes(key) || key.includes(keywords)) {
      return [keywords, ...fallbacks[key]];
    }
  }
  // 无匹配，返回原始关键词
  return [keywords];
}

// GD Studio API 搜索专辑曲目（使用 netease_album，返回专辑内所有歌曲）
async function gdSearchAlbum(albumName, limit = 50) {
  const cacheKey = `album_search:${albumName}:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=search&source=netease_album&name=${encodeURIComponent(albumName)}&count=${limit}`;
    const data = await dedupedGetJSON(url, 15000);
    if (Array.isArray(data) && data.length > 0) {
      // 先批量补全 pic_id，再格式化
      await fillMissingPicIdsRaw(data);
      const result = data.map(formatGDSong).filter(isUsableTrack);
      cacheSet(cacheKey, result, CACHE_TTL.album);
      console.log(`[GD AlbumSearch] "${albumName}" returned ${result.length} tracks`);
      return result;
    }
    console.log(`[GD AlbumSearch] Empty result for album "${albumName}"`);
    return [];
  } catch (e) {
    console.error('[GD AlbumSearch] Error:', e.message);
    return [];
  }
}

// 获取热门歌曲（多关键词回退策略，避免 GD API 空返回）
async function getHotSongs(limit = 20) {
  const cacheKey = `hot:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // 网易云热歌榜（3778678）是可验证的排行榜数据，不能用“流行”搜索结果冒充榜单。
  try {
    const chart = await dedupedGetJSON('https://music.163.com/api/playlist/detail?id=3778678', 15000);
    const chartTracks = chart && chart.result && Array.isArray(chart.result.tracks) ? chart.result.tracks : [];
    if (chartTracks.length > 0) {
      const result = chartTracks.slice(0, limit).map(track => {
        const album = track.al || track.album || {};
        const artists = track.ar || track.artists || [];
        return formatGDSong({
          id: track.id,
          name: track.name,
          artist: artistNames(artists) || '未知歌手',
          album: album.name || '',
          albumId: String(album.id || ''),
          albumTrackCount: Number(album.size || 0),
          pic_id: String(album.picId || album.id || ''),
          coverUrl: album.picUrl || '',
          dt: track.dt || track.duration || 0,
          source: 'netease'
        });
      }).filter(isUsableTrack);
      cacheSet(cacheKey, result, CACHE_TTL.hot);
      console.log(`[Hot] Loaded ${result.length} tracks from 网易云热歌榜`);
      return result;
    }
  } catch (e) {
    console.warn('[Hot] Netease chart request failed:', e.message);
  }
  
  // 榜单不可用时不展示搜索结果，避免把“热门”关键词结果误标为排行榜。
  console.error('[Hot] 网易云热歌榜 unavailable');
  return [];
}

// GD Studio API 获取音频 URL
async function gdGetSongUrl(id) {
  const cacheKey = `audio:${id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=url&id=${id}&source=netease&br=320`;
    const data = await gdGetJSON(url, 15000, response => Boolean(response?.url));
    if (data && data.url) {
      cacheSet(cacheKey, data.url, CACHE_TTL.audio);
      return data.url;
    }
  } catch (e) { console.error('[GD SongUrl] Error:', e.message); }
  return null;
}

// GD Studio API 获取歌词
async function gdGetLyric(id) {
  const cacheKey = `lyric:${id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=lyric&id=${id}&source=netease`;
    const data = await dedupedGetJSON(url, 15000);
    const result = {
      lrc: (data && data.lyric) || '',
      tlyric: (data && data.tlyric) || ''
    };
    cacheSet(cacheKey, result, CACHE_TTL.lyric);
    return result;
  } catch (e) {
    return { lrc: '', tlyric: '' };
  }
}

// GD Studio API 获取封面 URL
async function gdGetCoverUrl(picId) {
  const cacheKey = `cover:${picId}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=pic&id=${picId}&source=netease`;
    const data = await gdGetJSON(url, 15000, response => Boolean(response?.url));
    if (data && data.url) {
      cacheSet(cacheKey, data.url, CACHE_TTL.cover);
      return data.url;
    }
  } catch (e) { console.error('[GD Cover] Error:', e.message); }
  return null;
}

function sizedNeteaseCoverUrl(rawUrl, size) {
  const coverUrl = new URL(rawUrl);
  const allowedHost = /^p\d+\.music\.126\.net$/.test(coverUrl.hostname) || coverUrl.hostname === 'music.163.com';
  if (!allowedHost) throw new Error('Unsupported cover host');
  coverUrl.protocol = 'https:';
  coverUrl.searchParams.set('param', `${size}y${size}`);
  return coverUrl.toString();
}

async function embeatCover(picId, size) {
  if (!picId || picId.length > 1024) throw mediaFault(400, 'Invalid cover identifier', 'INVALID_TRACK');
  const key = `embeat:cover:${picId}:${size}`;
  let url = cacheGet(key);
  if (!url) {
    const data = await embeat.request('pic', { source: 'embeat', id: picId, size }, picId);
    url = validMediaUrl(data?.url);
    if (!url) throw mediaFault(404, 'Cover not found', 'MEDIA_NOT_FOUND');
    const host = new URL(url).hostname;
    if (host !== 'resources.tidal.com' && !/^p\d+\.music\.126\.net$/.test(host)) throw mediaFault(502, 'Unsupported provider cover host');
    cacheSet(key, url, CACHE_TTL.cover);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, { redirect: 'error', signal: controller.signal });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !/^image\/(jpeg|png|webp|avif)(?:;|$)/i.test(contentType) || Number(response.headers.get('content-length')) > 8 * 1024 * 1024 || !response.body) {
      response.body?.cancel().catch(() => {});
      throw mediaFault(502, 'Invalid cover response');
    }
    const reader = response.body.getReader();
    const chunks = []; let bytes = 0;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 8 * 1024 * 1024) throw mediaFault(502, 'Cover too large');
        chunks.push(Buffer.from(value));
      }
    } finally { reader.cancel().catch(() => {}); }
    if (!bytes) throw mediaFault(502, 'Empty cover');
    return { image: Buffer.concat(chunks), contentType };
  } catch (error) {
    if (controller.signal.aborted) throw mediaFault(504, 'Cover timed out', 'GD_TIMEOUT');
    throw error;
  } finally { clearTimeout(timer); }
}

// 搜索歌词（通过 artist + title）
async function searchLyric(artist, title) {
  try {
    const query = `${artist} ${title}`.trim();
    const searchUrl = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(query)}&count=1`;
    const searchData = await httpsGetJSON(searchUrl);
    if (Array.isArray(searchData) && searchData.length > 0) {
      return await gdGetLyric(searchData[0].id);
    }
  } catch (e) {}
  return { lrc: '', tlyric: '' };
}

// 获取专辑歌曲（使用 netease_album 搜索，返回专辑内所有歌曲）
async function getAlbumSongs(albumName, artistName, limit = 30) {
  try {
    // 【优先方案】用网易云专辑搜索 API 精确匹配专辑名+歌手名，获取真实 albumId
    // 避免同名专辑（不同歌手的专辑叫同一个名字）导致混淆
    if (artistName && albumName) {
      try {
        const searchQuery = albumName + ' ' + artistName;
        const albumSearchUrl = `https://music.163.com/api/search/get?s=${encodeURIComponent(searchQuery)}&type=10&limit=5`;
        const albumSearchData = await httpsGetJSON(albumSearchUrl, 10000);
        
        if (albumSearchData && albumSearchData.code === 200 && albumSearchData.result && albumSearchData.result.albums) {
          const albums = albumSearchData.result.albums;
          // 精确匹配：专辑名完全一致 + 歌手名匹配
          const matched = albums.find(function(a) {
            const nameMatch = a.name === albumName;
            const albumArtist = a.artist && a.artist.name ? a.artist.name : '';
            const artistMatch = albumArtist.indexOf(artistName) !== -1 || artistName.indexOf(albumArtist) !== -1;
            return nameMatch && artistMatch;
          });
          
          if (matched && matched.id) {
            console.log(`[Album] Precise match: "${albumName}" by "${artistName}" → albumId=${matched.id}`);
            // 用真实 albumId 获取专辑内歌曲
            const albumDetailUrl = `https://music.163.com/api/album/${matched.id}`;
            const albumDetail = await httpsGetJSON(albumDetailUrl, 10000);
            
            if (albumDetail && albumDetail.code === 200 && albumDetail.album && albumDetail.album.songs) {
              const officialAlbum = albumDetail.album;
              const songs = officialAlbum.songs.map(function(s) {
                const songAlbum = s.al || s.album || officialAlbum;
                return formatGDSong({
                  id: s.id,
                  name: s.name,
                  artist: artistNames(s.ar || s.artists || []),
                  album: officialAlbum.name || songAlbum.name || albumName,
                  albumId: String(officialAlbum.id || matched.id),
                  pic_id: String(officialAlbum.picId || songAlbum.picId || ''),
                  coverUrl: officialAlbum.picUrl || songAlbum.picUrl || '',
                  dt: s.dt || s.duration || 0,
                  source: 'netease'
                });
              }).filter(isUsableTrack);
              console.log(`[Album] Got ${songs.length} songs from albumId=${matched.id}`);
              return songs.slice(0, limit);
            }
          }
        }
      } catch (e) {
        console.log(`[Album] Precise search failed, fallback: ${e.message}`);
      }
    }
    
    // 【回退方案】使用 GD API netease_album 搜索
    const results = await gdSearchAlbum(albumName, Math.max(limit, 50));
    
    if (results.length === 0) {
      console.log(`[Album] "${albumName}" album search empty, fallback to regular search`);
      return await gdSearch(albumName, limit);
    }
    
    // GD 的搜索结果可能混入同名专辑；只接受专辑名和歌手都能核对上的曲目。
    const expectedAlbum = String(albumName).trim().toLowerCase();
    const albumExact = results.filter(function(s) {
      return String(s.album || '').trim().toLowerCase() === expectedAlbum;
    });
    const verified = artistName ? albumExact.filter(function(s) {
      const songArtist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || '');
      return songArtist.indexOf(artistName) !== -1 || artistName.indexOf(songArtist) !== -1;
    }) : albumExact;
    if (verified.length > 0) {
      // A GD album search can still contain several catalog editions with the
      // same title. Keep only the dominant album ID; never return a mixed list.
      const idCounts = new Map();
      verified.forEach(song => {
        const songAlbumId = String(song.albumId || '');
        if (songAlbumId) idCounts.set(songAlbumId, (idCounts.get(songAlbumId) || 0) + 1);
      });
      let canonicalId = '';
      let canonicalCount = 0;
      idCounts.forEach((count, songAlbumId) => {
        if (count > canonicalCount) { canonicalId = songAlbumId; canonicalCount = count; }
      });
      const canonical = canonicalId ? verified.filter(song => String(song.albumId) === canonicalId) : [];
      if (canonical.length && (verified.length === 1 || canonicalCount >= 2)) {
        console.log(`[Album] "${albumName}" by "${artistName}": ${canonical.length} verified GD fallback tracks`);
        return canonical.slice(0, limit);
      }
    }
    console.warn(`[Album] Rejecting unverified search results for "${albumName}"`);
    return [];
  } catch (e) {
    console.error('[Album] Error:', e.message);
    return [];
  }
}

async function getVerifiedAlbumBySearch(albumId, albumName, artistName) {
  const id = String(albumId || '');
  const name = String(albumName || '').trim();
  const artist = String(artistName || '').trim();
  if (!id || !name) return { album: null, songs: [] };

  // Prefer the canonical album endpoint. It preserves all tracks and avoids
  // losing compilation albums whose artist list differs from the clicked song.
  try {
    const detail = await httpsGetJSON(`https://music.163.com/api/album/${encodeURIComponent(id)}`, 12000);
    const officialAlbum = detail?.album;
    const rawSongs = Array.isArray(officialAlbum?.songs) ? officialAlbum.songs : [];
    if (detail?.code === 200 && officialAlbum && rawSongs.length) {
      const songs = rawSongs.map(song => formatNeteaseCatalogSong({
        ...song,
        // The album endpoint can return stale per-song `al` metadata. The
        // enclosing album response is authoritative for this detail page.
        al: {
          id: officialAlbum.id,
          name: officialAlbum.name,
          picId: officialAlbum.picId,
          picUrl: officialAlbum.picUrl,
          size: officialAlbum.size,
        },
      })).filter(isUsableTrack);
      if (songs.length) {
        return {
          album: {
            id,
            name: officialAlbum.name || name,
            artist: officialAlbum.artist?.name || artist,
            picId: String(officialAlbum.picId || ''),
            cover: officialAlbum.picUrl || songs[0].cover,
            coverSmall: officialAlbum.picUrl || songs[0].coverSmall,
            trackCount: Number(officialAlbum.size || songs.length),
          },
          songs,
        };
      }
    }
  } catch (e) {
    console.warn(`[Album] Direct lookup failed for id=${id}: ${e.message}`);
  }

  const query = [name, artist].filter(Boolean).join(' ');
  const candidates = await searchNeteaseCatalog(query, 100);
  const songs = candidates.filter(song => String(song.albumId) === id);
  if (!songs.length) return { album: null, songs: [] };

  const expectedCount = Number(songs[0].albumTrackCount || 0);
  if (expectedCount > songs.length) console.warn(`[Album] id=${id}: using ${songs.length}/${expectedCount} verified fallback tracks`);

  const first = songs[0];
  return {
    album: {
      id,
      name: first.album,
      artist: artist || first.artist,
      picId: first.picId,
      cover: first.cover,
      coverSmall: first.coverSmall,
      trackCount: expectedCount || songs.length,
    },
    songs,
  };
}

// 获取艺人歌曲。网易云目录搜索支持 offset，因而可以持续拉取而不受
// GD Studio 单页结果和前端首屏条数的限制。
async function getArtistSongs(artistName, limit = 60, offset = 0) {
  try {
    const page = await searchNeteaseCatalogPage(artistName, limit, offset);
    console.log(`[Artist] Returning ${page.songs.length} tracks (offset=${offset}, next=${page.nextOffset}, hasMore=${page.hasMore})`);
    return page;
  } catch (e) {
    console.error('[Artist] Error:', e.message);
    return { songs: [], total: 0, hasMore: false, nextOffset: Math.max(0, Number(offset) || 0) };
  }
}

// 获取艺人信息（头像 + 背景 + 简介）
async function getArtistInfo(artistName) {
  try {
    // 从网易云 API 获取艺人详细信息
    const searchUrl = `https://music.163.com/api/search/get?s=${encodeURIComponent(artistName)}&type=100&limit=1`;
    const searchData = await httpsGetJSON(searchUrl, 15000);
    
    if (searchData && searchData.result && searchData.result.artists && searchData.result.artists.length > 0) {
      const artist = searchData.result.artists[0];
      const avatar = artist.picUrl || artist.img1v1Url || '';
      const artistId = artist.id;
      
      let background = '';
      let desc = '';
      
      // 获取艺人详情（包含背景大图、简介等）
      if (artistId) {
        try {
          const detailUrl = `https://music.163.com/api/artist/${artistId}`;
          const detailData = await httpsGetJSON(detailUrl, 10000);
          if (detailData && detailData.code === 200) {
            // This endpoint returns artist at the top level. Older variants
            // used data.artist, so support both response shapes.
            const a = detailData.artist || detailData.data?.artist || {};
            // 网易云艺人背景大图
            background = a.picUrl || a.cover || a.img1v1Url || '';
            // 简介
            desc = a.briefDesc || '';
          }
        } catch (e) {
          console.log('[Artist Detail] Failed to get detail for', artistName, ':', e.message);
        }
      }

      // The detailed introduction endpoint carries the long-form biography;
      // /api/artist/:id often has only an empty briefDesc.
      if (artistId) {
        try {
          const introduction = await httpsGetJSON(`https://music.163.com/api/artist/introduction?id=${encodeURIComponent(artistId)}`, 12000);
          const sections = Array.isArray(introduction?.introduction) ? introduction.introduction : [];
          const longDesc = [introduction?.briefDesc, ...sections.map(section => section?.txt || section?.text || '')]
            .filter(Boolean)
            .join('\n\n')
            .trim();
          if (longDesc) desc = longDesc;
        } catch (e) {
          console.log('[Artist Introduction] Failed for', artistName, ':', e.message);
        }
      }
      
      // 如果没有背景图，用头像代替
      if (!background) background = avatar;
      
      return {
        name: artistName,
        avatar: avatar,
        background: background,
        desc: desc,
        songCount: artist.musicSize || artist.albumSize || 0
      };
    }
    
    return { name: artistName, avatar: '', background: '', desc: '', songCount: 0 };
  } catch (e) {
    console.error('[Artist Info] Error for', artistName, ':', e.message);
    return { name: artistName, avatar: '', background: '', desc: '', songCount: 0 };
  }
}

// 获取新歌
async function getNewSongs(limit = 12) {
  try {
    return await gdSearch('新歌 2026', limit);
  } catch (e) {
    return [];
  }
}

// =========================== HTTP 服务器 ===========================

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const params = parsedUrl.searchParams;

  // 日志所有请求
  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // CORS + Keep-Alive + Timing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Timing-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');

  // Static files share asynchronous IO, bounded caching and HTTP negotiation.
  if (await serveStatic(req, res, pathname)) return;

  // ========== API 端点 ==========

  // Both public search aliases share validation and failure semantics.
  if (pathname === '/api/search' || pathname === '/api/music/search') {
    const keywords = params.get('keywords')?.trim();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (!keywords || keywords.length > 512) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing or invalid keywords' })); return; }
    try {
      const source = params.get('source') || 'netease';
      if (!['netease', 'embeat'].includes(source)) throw mediaFault(400, 'Unsupported source', 'INVALID_SOURCE');
      const page = source === 'netease'
        ? await searchNeteaseCatalogPage(keywords, params.get('limit'), params.get('offset'))
        : await embeat.search(keywords, params.get('limit'), params.get('offset'));
      if (source === 'embeat') page.songs = page.songs.map(formatEmbeatSong);
      res.end(JSON.stringify(page));
    } catch (error) {
      res.statusCode = error.statusCode || 502;
      res.end(JSON.stringify({ error: error.message, code: error.code || 'SEARCH_UPSTREAM_ERROR' }));
    }
    return;
  }

  // 3. 热门推荐（发现页）
  if (pathname === '/api/discover/featured') {
    const limit = parseInt(params.get('limit') || '1');
    try {
      const songs = await getFeaturedClassics(limit);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({
        songs,
        collection: { name: 'The Weeknd', type: 'curated' }
      }));
    } catch (e) {
      console.error('[Featured] Failed:', e.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Featured collection unavailable', songs: [] }));
    }
    return;
  }

  if (pathname === '/api/discover/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, chart: HOT_CHART }));
    return;
  }

  // 4. 热门推荐（搜索页）
  if (pathname === '/api/music/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, chart: HOT_CHART }));
    return;
  }

  // 5. 基本热门
  if (pathname === '/api/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, chart: HOT_CHART }));
    return;
  }

  // 6. 新歌
  if (pathname === '/api/album/new') {
    const limit = parseInt(params.get('limit') || '12');
    const songs = await getNewSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs }));
    return;
  }

  // 7. 音频代理播放
  // - 默认：302 重定向到 CDN（浏览器直连，Render 零带宽）
  // - stream=1：服务器中转流式传输（用于微信小程序等需要绕过域名白名单限制的场景）
  if (pathname === '/api/music/proxy') {
    const id = params.get('id');
    const streamMode = params.get('stream') === '1';
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    try {
      const source = trackSource(params);
      const audioUrl = source === 'embeat' ? (await resolveEmbeatAudio(params)).url : await gdGetSongUrl(id);
      if (!audioUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Audio not found' })); return; }

      if (streamMode) {
        // 流式代理：服务器下载音频然后管道传输给客户端，域名始终是 ty-music.onrender.com
        const parsedUrl = new URL(audioUrl);
        const proto = parsedUrl.protocol === 'https:' ? https : http;
        const reqOptions = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': source === 'embeat' ? 'https://music.gdstudio.xyz/' : 'https://music.163.com/',
            'Accept': '*/*'
          },
          timeout: 30000
        };
        // 转发客户端的 Range 请求头（支持 seek）
        if (req.headers.range) {
          reqOptions.headers['Range'] = req.headers.range;
        }
        const proxyReq = proto.request(reqOptions, (audioRes) => {
          const code = audioRes.statusCode;
          // 处理重定向（CDN 可能再跳一层）
          if (code >= 300 && code < 400 && audioRes.headers.location) {
            res.statusCode = 302;
            res.setHeader('Location', audioRes.headers.location);
            res.end();
            return;
          }
          res.statusCode = code;
          res.setHeader('Content-Type', audioRes.headers['content-type'] || 'audio/mpeg');
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Cache-Control', 'public, max-age=600');
          if (audioRes.headers['content-length']) {
            res.setHeader('Content-Length', audioRes.headers['content-length']);
          }
          if (audioRes.headers['content-range']) {
            res.setHeader('Content-Range', audioRes.headers['content-range']);
          }
          audioRes.pipe(res);
          audioRes.on('error', (err) => {
            console.error('[Stream Proxy] Audio response error:', err.message);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Stream failed' }));
            }
          });
        });
        proxyReq.on('error', (err) => {
          console.error('[Stream Proxy] Request error:', err.message);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'Upstream unreachable' }));
          }
        });
        proxyReq.on('timeout', () => {
          proxyReq.destroy();
          if (!res.headersSent) {
            res.statusCode = 504;
            res.end(JSON.stringify({ error: 'Upstream timeout' }));
          }
        });
        proxyReq.end();
      } else {
        // 默认模式：302 重定向到 CDN 直链
        res.statusCode = 302;
        res.setHeader('Location', audioUrl);
        res.setHeader('Cache-Control', 'public, max-age=600');
        res.end();
      }
    } catch (e) {
      console.error('[Proxy] Exception:', e.message);
      if (!res.headersSent) {
        res.statusCode = e.statusCode || 502;
        res.end(JSON.stringify({ error: 'Audio unavailable', code: e.code || 'MEDIA_UPSTREAM_ERROR' }));
      }
    }
    return;
  }

  // 7.5 音频直链 JSON（返回代理 URL，前端直接用于 audio.src）
  if (pathname === '/api/music/url' || pathname === '/api/play') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    // 返回代理 URL（由服务器中转，绕过 CDN 防盗链）
    let proxyUrl;
    try { proxyUrl = proxyPath(params); }
    catch (e) { res.statusCode = e.statusCode; res.end(JSON.stringify({ error: e.message, code: e.code })); return; }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: proxyUrl }));
    return;
  }

  // 8.5 下载歌曲（返回代理 URL，前端触发下载）
  if (pathname === '/api/music/download') {
    const id = params.get('id');
    const title = params.get('title') || 'song';
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    let proxyUrl;
    try {
      if (trackSource(params) === 'embeat') throw mediaFault(422, 'Embeat supports online playback only', 'DOWNLOAD_UNAVAILABLE');
      proxyUrl = proxyPath(params);
    } catch (e) { res.statusCode = e.statusCode; res.end(JSON.stringify({ error: e.message, code: e.code })); return; }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: proxyUrl, filename: title + '.mp3' }));
    return;
  }

  // 9. 歌词（通过 id）
  if (pathname === '/api/lyric' || pathname === '/api/music/lyric') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    try {
      const source = trackSource(params);
      let lyric;
      if (source === 'embeat') {
        embeatIdentity(params);
        if (id.length > 1024) throw mediaFault(400, 'Invalid lyric identifier', 'INVALID_TRACK');
        const data = await embeat.request('lyric', { source: 'embeat', id }, id);
        if (!data || typeof data.lyric !== 'string') throw mediaFault(502, 'Invalid lyric response');
        lyric = { lrc: data.lyric, tlyric: typeof data.tlyric === 'string' ? data.tlyric : '' };
      } else lyric = await gdGetLyric(id);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(lyric));
    } catch (e) { res.statusCode = e.statusCode || 502; res.end(JSON.stringify({ error: 'Lyrics unavailable', code: e.code || 'MEDIA_UPSTREAM_ERROR' })); }
    return;
  }

  // 10. 搜索歌词（通过 artist + title）
  if (pathname === '/api/search-lyric') {
    const artist = params.get('artist') || '';
    const title = params.get('title') || '';
    const lyric = await searchLyric(artist, title);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(lyric));
    return;
  }

  // 11. 专辑
  if (pathname === '/api/music/album') {
    const album = params.get('album') || '';
    const artist = params.get('artist') || '';
    const limit = parseInt(params.get('limit') || '100');
    const cacheKey = `album-songs:${album}:${artist}:${limit}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
      res.end(JSON.stringify({ songs: cached }));
      return;
    }
    const songs = await getAlbumSongs(album, artist, limit);
    cacheSet(cacheKey, songs, CACHE_TTL.album);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
    res.end(JSON.stringify({ songs }));
    return;
  }

  // 12. 艺人歌曲
  if (pathname === '/api/music/artist') {
    const name = params.get('name') || '';
    const limit = parseInt(params.get('limit') || '60');
    const offset = parseInt(params.get('offset') || '0');
    console.log(`[Artist] Fetching songs for: ${name}, limit=${limit}, offset=${offset}`);
    const page = await getArtistSongs(name, limit, offset);
    console.log(`[Artist] Found ${page.songs.length} songs`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(page));
    return;
  }

  // 13. 艺人信息
  if (pathname === '/api/music/artist-info') {
    const name = params.get('name') || '';
    const info = await getArtistInfo(name);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(info));
    return;
  }

  // 14. 封面代理（通过 picId / albumId）
  if (pathname === '/api/cover' || pathname === '/api/music/cover') {
    const picId = params.get('albumId') || params.get('picId') || '';
    const sourceUrl = params.get('url') || '';
    const requestedSize = parseInt(params.get('size') || '500');
    const size = Number.isFinite(requestedSize) ? Math.max(50, Math.min(2000, requestedSize)) : 500;
    if (!picId && !sourceUrl) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing cover source' })); return; }
    try {
      const source = trackSource(params);
      if (source === 'embeat') {
        // Clients supply an identifier, never an arbitrary remote image URL.
        if (sourceUrl) throw mediaFault(400, 'Embeat requires picId', 'INVALID_TRACK');
        const { image, contentType } = await embeatCover(picId, size);
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(image);
        return;
      }
      let coverUrl = sourceUrl ? sizedNeteaseCoverUrl(sourceUrl, size) : await gdGetCoverUrl(picId);
      if (!coverUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Cover not found' })); return; }
      if (!sourceUrl) coverUrl = sizedNeteaseCoverUrl(coverUrl, size);
      // 中转图片内容，不能 302 到 CDN：页面截图会因此变成跨域污染，
      // FluidGlass 无法把精选卡片上传到 WebGL 纹理。
      const upstream = await smartGet(coverUrl, { 'User-Agent': UA, Referer: 'https://music.163.com/' }, 15000);
      const chunks = [];
      for await (const chunk of upstream) chunks.push(chunk);
      const image = Buffer.concat(chunks);
      if (!image.length) throw new Error('Empty cover response');
      res.statusCode = 200;
      res.setHeader('Content-Type', upstream.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(image);
    } catch (e) {
      console.error('[Cover] Exception:', e.message);
      if (!res.headersSent) {
        res.statusCode = e.statusCode || 502;
        res.end(JSON.stringify({ error: 'Cover unavailable', code: e.code || 'MEDIA_UPSTREAM_ERROR' }));
      }
    }
    return;
  }

  // 15. 歌手头像（基于名字生成 SVG）
  if (pathname === '/api/artist-avatar') {
    const name = params.get('name') || '未知歌手';
    const avatarBase64 = generateArtistAvatar(name);
    const svgBuffer = Buffer.from(avatarBase64, 'base64');
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(svgBuffer);
    return;
  }

  // 15. 歌手照片（代理网易云音乐的歌手真实照片）
  if (pathname === '/api/artist-photo') {
    const name = params.get('name') || '';
    if (!name) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing name' }));
      return;
    }
    
    try {
      const photoUrl = await getArtistPhotoUrl(name);
      if (!photoUrl) {
        // 没有找到歌手照片，返回默认封面
        res.setHeader('Content-Type', 'image/svg+xml');
        res.end(Buffer.from(DEFAULT_COVER.split(',')[1], 'base64'));
        return;
      }
      
      // 302 重定向到 CDN 直链，不经过服务器中转
      res.statusCode = 302;
      res.setHeader('Location', photoUrl);
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.end();
    } catch (e) {
      console.error('[Artist Photo] Exception:', e.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e.message }));
      }
    }
    return;
  }

  // ========== 健康检查 ==========
  if (pathname === '/api/health') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now(), commit: process.env.RENDER_GIT_COMMIT || null, node: process.versions.node, searchSource: 'netease', supplementalSearchSource: 'embeat' }));
    return;
  }

  // ========== 测试接口 ==========
  if (pathname === '/api/test') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ 
      message: '服务器正常运行',
      version: 'v20260618g',
      gd_api: GD_API,
      test_song: { id: 'test123', name: '测试歌曲', artist: '测试歌手' }
    }));
    return;
  }

  // ============================================
  // 专辑详情 — 按官方搜索结果的真实 albumId 精确筛选
  // 参数: id, name, artist。网易云公开专辑详情端点会间歇性返回 404/-462，
  // 因此不接受无法完整核实的部分列表。
  // ============================================
  if (pathname === '/api/album') {
    const id = params.get('id') || '';
    const name = params.get('name') || '';
    const artist = params.get('artist') || '';
    if (!id) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Missing id' }));
      return;
    }
    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Missing album name for verification' }));
      return;
    }
    try {
      const cacheKey = `album-detail:${id}:${name}:${artist}`;
      const cached = cacheGet(cacheKey);
      if (cached) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
        res.end(JSON.stringify(cached));
        return;
      }
      const result = await getVerifiedAlbumBySearch(id, name, artist);
      const primaryArtist = artist.split(/[,，、/&]/)[0].trim();
      const fallbackSongs = await getAlbumSongs(name, primaryArtist, 100);
      const normalizeAlbumName = value => String(value || '').trim().toLowerCase().replace(/[\s·•]/g, '');
      // A stale/reassigned catalog ID can return a different album. Never
      // render that response under the clicked album's title.
      if (result.album && normalizeAlbumName(result.album.name) !== normalizeAlbumName(name)) {
        console.warn(`[Album] Rejecting mismatched canonical album "${result.album.name}" for "${name}"`);
        result.album = null;
        result.songs = [];
      }
      const verifiedFallback = fallbackSongs.filter(song =>
        String(song.albumId || '') === id
      );

      // The catalog lookup can contain only the clicked single from a larger
      // compilation. Prefer the larger exact-album set, never a fuzzy mix.
      if (verifiedFallback.length > result.songs.length) {
        result.album = {
          id,
          name,
          artist: primaryArtist || artist,
          picId: verifiedFallback[0].picId || '',
          cover: verifiedFallback[0].cover || '',
          coverSmall: verifiedFallback[0].coverSmall || '',
          trackCount: verifiedFallback.length,
        };
        result.songs = verifiedFallback;
      } else if (!result.songs.length && fallbackSongs.length) {
        // The ID may be stale, but getAlbumSongs only returns exact
        // name/artist matches, so this remains a verified recovery path.
        const fallbackAlbumId = String(fallbackSongs[0].albumId || id);
        result.album = {
          id: fallbackAlbumId,
          name,
          artist: primaryArtist || artist,
          picId: fallbackSongs[0].picId || '',
          cover: fallbackSongs[0].cover || '',
          coverSmall: fallbackSongs[0].coverSmall || '',
          trackCount: fallbackSongs.length,
        };
        result.songs = fallbackSongs;
      }
      console.log(`[Album] id=${id}: verified ${result.songs.length} tracks`);
      cacheSet(cacheKey, result, CACHE_TTL.album);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');
      res.end(JSON.stringify(result));
    } catch (e) {
      console.error('[Album] Error:', e.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ============================================
  // 根据专辑名搜索歌曲（备用方案，不需要专辑ID）
  // 参数: name=专辑名&artist=艺人名
  // ============================================
  if (pathname === '/api/album/search') {
    const name = params.get('name') || '';
    const artist = params.get('artist') || '';
    if (!name) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: 'Missing name' }));
      return;
    }
    try {
      // 搜索专辑名
      const keywords = artist ? `${name} ${artist}` : name;
      const results = await gdSearch(keywords, false);
      if (!results || !results.length) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ songs: [] }));
        return;
      }
      // 过滤出匹配专辑名的歌曲
      const filtered = results.filter(s => {
        if (!s.album) return false;
        const hay = s.album.toLowerCase();
        const needle = name.toLowerCase();
        return hay.includes(needle) || needle.includes(hay);
      });
      // 去重
      const seen = new Set();
      const unique = filtered.filter(s => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      });
      console.log(`[Album/Search] "${name}": ${results.length} searched → ${unique.length} matched`);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ songs: unique }));
    } catch (e) {
      console.error('[Album/Search] Error:', e.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // ========== 404 ==========
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: 'Not found: ' + pathname }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] TY Music 运行在 http://localhost:${PORT}`);
  console.log('[Server] 默认搜索：网易云；Embeat 独立补充，不阻塞基础结果');
  console.log('[Server] API 端点:');
  console.log('  /api/discover/hot       - 发现页热门')
  console.log('  /api/music/search       - 搜索歌曲')
  console.log('  /api/music/hot          - 热门歌曲')
  console.log('  /api/music/proxy        - 音频代理播放')
  console.log('  /api/music/lyric        - 歌词')
  console.log('  /api/music/album        - 专辑')
  console.log('  /api/music/artist       - 艺人歌曲')
  console.log('  /api/music/artist-info  - 艺人信息')
  console.log('  /api/cover              - 封面代理')
  console.log('  /api/artist-photo      - 歌手真实照片（代理网易云）')
  console.log('  /api/album/new          - 新歌')
});
