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
    const contentType = { 'html': 'text/html; charset=utf-8', 'js': 'application/javascript; charset=utf-8', 'css': 'text/css; charset=utf-8' }[ext] || 'application/octet-stream';
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
  const picId = s.pic_id || '';

  return {
    id: String(s.id || ''),
    name: s.name || '未知歌曲',
    artist: artistStr,
    album: s.album || '',
    albumId: picId,
    cover: picId ? `/api/cover?albumId=${picId}&size=300` : `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    coverSmall: picId ? `/api/cover?albumId=${picId}&size=200` : `/api/artist-photo?name=${encodeURIComponent(artistStr)}`,
    picId: picId,
    duration: 0,
    source: 'netease'
  };
}

// =========================== API 逻辑 ===========================

// GD Studio API 搜索（按歌名搜索）
async function gdSearch(keywords, limit = 30) {
  const cacheKey = `search:${keywords}:${limit}`;
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  try {
    const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(keywords)}&count=${limit}`;
    const data = await dedupedGetJSON(url, 15000);
    if (Array.isArray(data) && data.length > 0) {
      const result = data.map(formatGDSong);
      cacheSet(cacheKey, result, CACHE_TTL.search);
      return result;
    }
    console.log(`[GD Search] Empty result for "${keywords}"`);
    return [];
  } catch (e) {
    console.error('[GD Search] Error:', e.message);
    return [];
  }
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
    // 使用 netease_album 搜索，直接返回专辑内的所有歌曲
    const results = await gdSearchAlbum(albumName, Math.max(limit, 50));
    
    if (results.length === 0) {
      // 回退：用普通搜索（兼容性）
      console.log(`[Album] "${albumName}" album search empty, fallback to regular search`);
      return await gdSearch(albumName, limit);
    }
    
    // 如果有歌手名，过滤出该歌手的歌（同一专辑可能有不同歌手的版本）
    if (artistName) {
      const artistFiltered = results.filter(function(s) {
        const songArtist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || '');
        return songArtist.indexOf(artistName) !== -1 || artistName.indexOf(songArtist) !== -1;
      });
      if (artistFiltered.length > 0) {
        console.log(`[Album] "${albumName}" by "${artistName}": ${artistFiltered.length} tracks`);
        return artistFiltered.slice(0, limit);
      }
    }
    
    console.log(`[Album] "${albumName}": ${results.length} tracks`);
    return results.slice(0, limit);
  } catch (e) {
    console.error('[Album] Error:', e.message);
    return [];
  }
}

// 获取艺人歌曲
async function getArtistSongs(artistName, limit = 100, offset = 0) {
  try {
    // 搜索该艺人的歌曲，增加数量
    const results = await gdSearch(artistName, limit + offset);
    // 返回从 offset 开始的 limit 首歌曲
    return results.slice(offset, offset + limit);
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
  if (staticCache.has(pathname)) {
    serveStatic(req, res, pathname);
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

  // 7. 音频直链重定向（302 redirect，让浏览器直连网易云 CDN，无需 Render 中转）
  // 这是解决播放卡顿的根本方案：Render 服务器在美国，中转音频会引入 1-2 跳国际延迟
  // 直接 302 → CDN，中国用户直连网易云国内 CDN 节点，速度最快
  if (pathname === '/api/music/proxy') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    try {
      const audioUrl = await gdGetSongUrl(id);
      if (!audioUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Audio not found' })); return; }
      console.log('[Redirect] Direct CDN for id:', id, '->', audioUrl.substring(0, 80));
      // 302 重定向到音频直链，浏览器直接连接 CDN，完全绕过 Render 中转
      res.statusCode = 302;
      res.setHeader('Location', audioUrl);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.end();
    } catch (e) {
      console.error('[Redirect] Exception:', e.message);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: e.message }));
      }
    }
    return;
  }

  // 7.5 音频直链 JSON（前端可直接用于 audio.src）
  if (pathname === '/api/music/url') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    try {
      const audioUrl = await gdGetSongUrl(id);
      if (!audioUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Audio not found' })); return; }
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ url: audioUrl }));
    } catch (e) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 8. 播放（返回 JSON URL）
  if (pathname === '/api/play') {
    const id = params.get('id');
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    const audioUrl = await gdGetSongUrl(id);
    if (!audioUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Audio not found' })); return; }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: audioUrl }));
    return;
  }

  // 8.5 下载歌曲（返回直链，前端触发下载）
  if (pathname === '/api/music/download') {
    const id = params.get('id');
    const title = params.get('title') || 'song';
    if (!id) { res.statusCode = 400; res.end(JSON.stringify({ error: 'Missing id' })); return; }
    const audioUrl = await gdGetSongUrl(id);
    if (!audioUrl) { res.statusCode = 404; res.end(JSON.stringify({ error: 'Audio not found' })); return; }
    // 返回直链，前端用 a.download 触发下载
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ url: audioUrl, filename: title + '.mp3' }));
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
      console.log('[Cover] Proxying:', coverUrl.substring(0, 80));

      const imgRes = await smartGet(coverUrl, {
        'User-Agent': UA,
        'Referer': 'https://music.126.com/'
      });

      res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.statusCode = imgRes.statusCode || 200;
      imgRes.pipe(res);

      imgRes.on('error', (e) => {
        console.error('[Cover] Stream error:', e.message);
        if (!res.headersSent) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
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
      
      // 代理图片
      console.log(`[Artist Photo] Proxying photo for ${name}: ${photoUrl.substring(0, 80)}...`);
      const imgRes = await smartGet(photoUrl, {
        'User-Agent': UA,
        'Referer': 'https://music.163.com/'
      });
      
      res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=604800');
      res.statusCode = imgRes.statusCode || 200;
      imgRes.pipe(res);
      
      imgRes.on('error', (e) => {
        console.error('[Artist Photo] Stream error:', e.message);
        if (!res.headersSent) {
          res.statusCode = 502;
          res.end(JSON.stringify({ error: e.message }));
        }
      });
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
