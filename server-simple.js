/**
 * TY Music Server - GD Studio API Version
 * 使用 GD Studio API 作为音源（网易云音乐）
 * 无需本地 NCM API 进程，更简单更稳定
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { URL } = require('url');

// =========================== HTTP Keep-Alive Agent ===========================
// 复用 TCP 连接，避免每次请求都重新握手（对 GD API 延迟高的情况尤其重要）
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50, timeout: 30000 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, timeout: 30000 });

// =========================== 请求去重 ===========================
// 同一 URL 同时只请求一次，避免并发时重复调用 GD API
const pendingRequests = new Map(); // url → Promise

// =========================== 静态文件内存缓存 ===========================

// 静态文件配置：[路径名, 文件名, Content-Type]
const STATIC_FILES = [
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/player.js', 'player.js'],
  ['/style.css', 'style.css'],
  ['/liquid-glass.js', 'liquid-glass.js'],
  ['/manifest.json', 'manifest.json'],
  ['/service-worker.js', 'service-worker.js'],
  ['/icon-192.png', 'icon-192.png'],
  ['/icon-512.png', 'icon-512.png'],
];

// 内存缓存：{ raw: Buffer, gzip: Buffer, etag: string, contentType: string }
const staticCache = new Map();

function calcEtag(buf) {
  // 简单取前 8 字节的 hash 作为 ETag（无需 crypto，够用）
  const h = require('crypto').createHash('md5').update(buf).digest('hex');
  return '"' + h + '"';
}

function preloadStaticFiles() {
  for (const [urlPath, fileName] of STATIC_FILES) {
    const filePath = path.join(__dirname, fileName);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath);
    const gzip = zlib.gzipSync(raw, { level: 6 });
    const etag = calcEtag(raw);
    const ext = fileName.split('.').pop();
    const contentType = { 
      'html': 'text/html; charset=utf-8', 
      'js': 'application/javascript; charset=utf-8', 
      'css': 'text/css; charset=utf-8',
      'json': 'application/json; charset=utf-8',
      'png': 'image/png'
    }[ext] || 'application/octet-stream';
    staticCache.set(urlPath, { raw, gzip, etag, contentType });
    console.log(`[Cache] Preloaded ${fileName}: ${raw.length}B → gzip ${gzip.length}B (etag: ${etag})`);
  }
}

// 启动时预加载
preloadStaticFiles();

// 提供静态文件（支持 gzip + ETag 协商缓存）
function serveStatic(req, res, urlPath) {
  const cached = staticCache.get(urlPath);
  if (!cached) {
    res.statusCode = 404;
    res.end('Not found');
    return true;
  }
  const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');
  const etag = cached.etag;
  const clientEtag = req.headers['if-none-match'];

  res.setHeader('Content-Type', cached.contentType);
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('ETag', etag);
  // JS/CSS 禁止强缓存，保证每次都能协商更新
  if (cached.contentType && (cached.contentType.includes('javascript') || cached.contentType.includes('css'))) {
    res.setHeader('Cache-Control', 'no-cache');
  }

  // 协商缓存：如果客户端已有最新版本，返回 304
  if (clientEtag === etag) {
    res.statusCode = 304;
    res.end();
    return true;
  }

  if (acceptGzip) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', cached.gzip.length);
    res.end(cached.gzip);
  } else {
    res.setHeader('Content-Length', cached.raw.length);
    res.end(cached.raw);
  }
  return true;
}

const PORT = process.env.PORT || 8899;
const GD_API = 'https://music-api.gdstudio.xyz/api.php';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

// =========================== API 结果缓存 ===========================
// 缓存搜索/热门结果，避免重复请求 GD API（公网访问延迟高，缓存很重要）
const apiCache = new Map(); // key → { data, expiry }
const CACHE_TTL = {
  search: 5 * 60 * 1000,   // 搜索结果缓存 5 分钟
  hot: 10 * 60 * 1000,     // 热门缓存 10 分钟
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
      headers: { 'User-Agent': UA, 'Connection': 'keep-alive' },
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

// 格式化 GD API 搜索结果为 player.js 格式
function formatGDSong(s) {
  const artistStr = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || '未知歌手');
  const picId = s.pic_id || s.albumId || '';

  return {
    id: String(s.id || ''),
    name: s.name || '未知歌曲',
    artist: artistStr,
    album: s.album || '',
    albumId: s.albumId || '',   // 优先用真实 albumId，GD API 不一定有
    cover: picId ? `/api/cover?albumId=${picId}&size=300` : `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    coverSmall: picId ? `/api/cover?albumId=${picId}&size=200` : `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    picId: picId,
    duration: 0,
    source: 'netease'
  };
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
      data.songs.forEach(s => {
        const picId = s.album && s.album.picId ? String(s.album.picId) : '';
        if (picId) picMap[String(s.id)] = picId;
      });
      // 直接修改原始 GD 数据的 pic_id 字段
      songsRaw.forEach(s => {
        if (!s.pic_id && picMap[s.id]) {
          s.pic_id = picMap[s.id];
        }
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

  // 备用关键词：主关键词搜不到时自动换词
  const fallbackKeywords = getSearchFallbacks(keywords);

  for (const kw of fallbackKeywords) {
    try {
      const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(kw)}&count=${limit}`;
      console.log(`[GD Search] Trying: "${kw}"`);
      const data = await dedupedGetJSON(url, 15000);
      if (Array.isArray(data) && data.length > 0) {
        // 先批量补全 pic_id，再格式化
        await fillMissingPicIdsRaw(data);
        const result = data.map(formatGDSong);
        // 只缓存原始关键词的结果
        if (kw === keywords) {
          cacheSet(cacheKey, result, CACHE_TTL.search);
        }
        console.log(`[GD Search] Got ${result.length} tracks for "${kw}"`);
        return result;
      }
      console.log(`[GD Search] Empty result for "${kw}", trying fallback...`);
    } catch (e) {
      console.warn(`[GD Search] Error for "${kw}":`, e.message);
      // 继续尝试下一个备用关键词
    }
  }
  console.log(`[GD Search] All fallbacks failed for "${keywords}"`);
  return [];
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
      const result = data.map(formatGDSong);
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
  
  const fallbackKeywords = ['热门', '热门歌曲', '华语', '流行', '经典', '2025', '抖音'];
  
  for (const kw of fallbackKeywords) {
    try {
      const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(kw)}&count=${limit}`;
      const data = await httpsGetJSON(url, 15000);
      if (Array.isArray(data) && data.length > 0) {
        // 先批量补全 pic_id，再格式化
        await fillMissingPicIdsRaw(data);
        const result = data.map(formatGDSong);
        cacheSet(cacheKey, result, CACHE_TTL.hot);
        console.log(`[Hot] Got ${result.length} songs from keyword "${kw}"`);
        return result;
      }
    } catch (e) {
      console.log(`[Hot] Keyword "${kw}" failed:`, e.message);
    }
  }
  
  console.error('[Hot] All fallback keywords failed');
  return [];
}

// GD Studio API 获取音频 URL
async function gdGetSongUrl(id) {
  const cacheKey = `audio:${id}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=url&id=${id}&source=netease&br=320`;
    const data = await dedupedGetJSON(url, 15000);
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
    const data = await dedupedGetJSON(url, 15000);
    if (data && data.url) {
      cacheSet(cacheKey, data.url, CACHE_TTL.cover);
      return data.url;
    }
  } catch (e) { console.error('[GD Cover] Error:', e.message); }
  return null;
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
              const songs = albumDetail.album.songs.map(function(s) {
                return {
                  id: String(s.id),
                  name: s.name,
                  artist: s.artists ? s.artists.map(function(a) { return a.name; }).join(', ') : '未知歌手',
                  album: s.album ? s.album.name : albumName,
                  pic_id: s.album ? String(s.album.picId || '') : '',
                  albumId: matched.id,
                  picId: s.album ? String(s.album.picId || '') : '',
                  duration: 0,
                  source: 'netease'
                };
              });
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
    
    // 如果有歌手名，过滤出该歌手的歌
    if (artistName) {
      const artistFiltered = results.filter(function(s) {
        const songArtist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || '');
        return songArtist.indexOf(artistName) !== -1 || artistName.indexOf(songArtist) !== -1;
      });
      if (artistFiltered.length > 0) {
        console.log(`[Album] "${albumName}" by "${artistName}": ${artistFiltered.length} tracks (GD fallback)`);
        return artistFiltered.slice(0, limit);
      }
    }
    
    console.log(`[Album] "${albumName}": ${results.length} tracks (GD fallback, no artist filter)`);
    return results.slice(0, limit);
  } catch (e) {
    console.error('[Album] Error:', e.message);
    return [];
  }
}

// 获取艺人歌曲
async function getArtistSongs(artistName, limit = 100, offset = 0) {
  try {
    // GD API 单次最多 99 条，用 pages 参数翻页
    // 计算需要几页才能满足 limit + offset
    const PAGE_SIZE = 99;
    const totalNeeded = offset + limit;
    const pagesNeeded = Math.ceil(totalNeeded / PAGE_SIZE);
    
    let allResults = [];
    const pagePromises = [];
    for (let p = 1; p <= pagesNeeded; p++) {
      const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(artistName)}&count=${PAGE_SIZE}&pages=${p}`;
      pagePromises.push(dedupedGetJSON(url, 15000).catch(() => []));
    }
    const pagesResults = await Promise.all(pagePromises);
    pagesResults.forEach(page => {
      if (Array.isArray(page)) allResults = allResults.concat(page);
    });
    
    // 去重（按 id），然后批量补全 pic_id
    const seen = new Set();
    const unique = [];
    allResults.forEach(s => {
      const id = String(s.id || '');
      if (id && !seen.has(id)) { seen.add(id); unique.push(s); }
    });
    
    // 先批量补全 pic_id（在 formatGDSong 之前）
    await fillMissingPicIdsRaw(unique);
    
    // 格式化为标准格式（包含 cover/coverSmall/picId 等字段）
    const formatted = unique.map(formatGDSong);
    
    // 按 offset 切片
    const sliced = formatted.slice(offset, offset + limit);
    console.log(`[Artist] Fetched ${formatted.length} total, returning ${sliced.length} (offset=${offset}, limit=${limit})`);
    
    return sliced;
  } catch (e) {
    console.error('[Artist] Error:', e.message);
    return [];
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
          if (detailData && detailData.code === 200 && detailData.data && detailData.data.artist) {
            const a = detailData.data.artist;
            // 网易云艺人背景大图
            background = a.picUrl || a.cover || a.img1v1Url || '';
            // 简介
            desc = a.briefDesc || '';
          }
        } catch (e) {
          console.log('[Artist Detail] Failed to get detail for', artistName, ':', e.message);
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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // CORS + Keep-Alive + Timing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Timing-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');

  // ========== 静态文件（gzip 压缩 + 内存缓存）==========

  // 1. 精确匹配的内存缓存（STATIC_FILES）
  if (staticCache.has(pathname)) {
    serveStatic(req, res, pathname);
    return;
  }

  // 2. /vendor/ 目录：直接从磁盘读取（Font Awesome 等第三方库）
  if (pathname.startsWith('/vendor/')) {
    const filePath = path.join(__dirname, pathname);
    // 安全检查：防止路径穿越
    if (!filePath.startsWith(__dirname + '/vendor/')) {
      res.statusCode = 403; res.end('Forbidden'); return;
    }
    try {
      const data = fs.readFileSync(filePath);
      const ext = path.extname(filePath).slice(1);
      const contentType = {
        'html': 'text/html; charset=utf-8',
        'js': 'application/javascript; charset=utf-8',
        'css': 'text/css; charset=utf-8',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'woff2': 'font/woff2',
        'woff': 'font/woff',
        'ttf': 'font/ttf',
        'json': 'application/json; charset=utf-8',
      }[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天
      const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');
      if (acceptGzip && (ext === 'css' || ext === 'js' || ext === 'html')) {
        const gzipped = zlib.gzipSync(data);
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', gzipped.length);
        res.end(gzipped);
      } else {
        res.setHeader('Content-Length', data.length);
        res.end(data);
      }
    } catch (e) {
      res.statusCode = 404; res.end('Not found');
    }
    return;
  }

  // ========== API 端点 ==========

  // 1. 搜索（基本）
  if (pathname === '/api/search') {
    const keywords = params.get('keywords');
    const limit = parseInt(params.get('limit') || '30');
    if (!keywords) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing keywords' })); return; }
    const songs = await gdSearch(keywords, limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, total: songs.length }));
    return;
  }

  // 2. 搜索（音乐 API，带 source 参数）
  if (pathname === '/api/music/search') {
    const keywords = params.get('keywords');
    const limit = parseInt(params.get('limit') || '30');
    if (!keywords) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing keywords' })); return; }
    const songs = await gdSearch(keywords, limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, total: songs.length }));
    return;
  }

  // 3. 热门推荐（发现页）
  if (pathname === '/api/discover/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs }));
    return;
  }

  // 4. 热门推荐（搜索页）
  if (pathname === '/api/music/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs }));
    return;
  }

  // 5. 基本热门
  if (pathname === '/api/hot') {
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getHotSongs(limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs }));
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
      const audioUrl = await gdGetSongUrl(id);
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
            'Referer': 'https://music.163.com/',
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
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e.message }));
      }
    }
    return;
  }

  // 7.5 音频直链 JSON（返回代理 URL，前端直接用于 audio.src）
  if (pathname === '/api/music/url') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    // 返回代理 URL（由服务器中转，绕过 CDN 防盗链）
    const proxyUrl = `/api/music/proxy?id=${encodeURIComponent(id)}`;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: proxyUrl }));
    return;
  }

  // 8. 播放（返回代理 URL，服务器中转绕过防盗链）
  if (pathname === '/api/play') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    const proxyUrl = `/api/music/proxy?id=${encodeURIComponent(id)}`;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: proxyUrl }));
    return;
  }

  // 8.5 下载歌曲（返回代理 URL，前端触发下载）
  if (pathname === '/api/music/download') {
    const id = params.get('id');
    const title = params.get('title') || 'song';
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    const proxyUrl = `/api/music/proxy?id=${encodeURIComponent(id)}`;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: proxyUrl, filename: title + '.mp3' }));
    return;
  }

  // 9. 歌词（通过 id）
  if (pathname === '/api/lyric' || pathname === '/api/music/lyric') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    const lyric = await gdGetLyric(id);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(lyric));
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
    const limit = parseInt(params.get('limit') || '30');
    const songs = await getAlbumSongs(album, artist, limit);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs }));
    return;
  }

  // 12. 艺人歌曲
  if (pathname === '/api/music/artist') {
    const name = params.get('name') || '';
    const limit = parseInt(params.get('limit') || '100');
    const offset = parseInt(params.get('offset') || '0');
    console.log(`[Artist] Fetching songs for: ${name}, limit=${limit}, offset=${offset}`);
    const songs = await getArtistSongs(name, limit, offset);
    console.log(`[Artist] Found ${songs.length} songs`);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ songs, hasMore: songs.length >= limit }));
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
    const size = parseInt(params.get('size') || '500');
    if (!picId) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing albumId' })); return; }
    try {
      let coverUrl = await gdGetCoverUrl(picId);
      if (!coverUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Cover not found' })); return; }
      // 调整封面尺寸
      coverUrl = coverUrl.replace(/\?param=\d+y\d+/, '') + `?param=${size}y${size}`;
      // 302 重定向到网易云 CDN 直链，不经过服务器中转
      res.statusCode = 302;
      res.setHeader('Location', coverUrl);
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.end();
    } catch (e) {
      console.error('[Cover] Exception:', e.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e.message }));
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
    res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
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

  // ========== 404 ==========
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({ error: 'Not found: ' + pathname }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] TY Music 运行在 http://localhost:${PORT}`);
  console.log('[Server] 音源：GD Studio API (网易云音乐)');
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
