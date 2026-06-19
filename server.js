/**
 * TY Music Server - Fixed Version
 * Robust error handling for all endpoints
 */

// === CRITICAL: Unset proxy env vars ===
// 小火箭等代理工具会设置系统代理环境变量，导致 Node.js HTTPS 请求走代理 → 502
// new https.Agent() 理论上不继承代理，但某些 Node 版本/系统组合下仍受影响
// 最稳妥的方案：启动时就清除代理环境变量
['http_proxy', 'HTTP_PROXY', 'https_proxy', 'HTTPS_PROXY', 'no_proxy', 'NO_PROXY'].forEach(k => {
  delete process.env[k];
});

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 8899;

// ========== 专辑纠正映射表 ==========
// 当 API 返回的 album 错误时，强制使用正确的值
// 格式: "artist|songName" → { album: "正确专辑名", picId: "正确picId" }
const ALBUM_CORRECTIONS = {
  "Michael Jackson|Heartbreaker": { album: "Invincible", picId: "109951165992940172" },
  "Michael Jackson|Heartbreaker (Funtastik's Digitized Mix)": { album: "700 songs Remixes", picId: "" },
};

// 同步获取纠正后的专辑信息（从映射表）
function getCorrectAlbumSync(artist, songName) {
  const key1 = `${artist}|${songName}`;
  const key2 = `${artist.split(',')[0].trim()}|${songName}`;
  return ALBUM_CORRECTIONS[key1] || ALBUM_CORRECTIONS[key2] || null;
}

const GD_API = 'https://music-api.gdstudio.xyz/api.php';
const NETEASE_API = 'https://music.163.com/api';
const PUBLIC_DIR = __dirname;

// === 预压缩 + 缓存文件内容（避免每次请求都读磁盘） ===
const COMPRESSIBLE_TYPES = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);
const CACHED_FILES = {};     // { path: { raw: Buffer, gzip: Buffer, mime: str, mtime: num } }
const CACHE_MAX_AGE = 60 * 60 * 1000; // 1小时磁盘缓存

function getCachedFile(fullPath) {
  const now = Date.now();
  const entry = CACHED_FILES[fullPath];
  if (entry && (now - entry.cachedAt) < CACHE_MAX_AGE) return entry;
  
  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) return null;
    const ext = path.extname(fullPath);
    const raw = fs.readFileSync(fullPath);
    let gzip = null;
    if (COMPRESSIBLE_TYPES.has(ext)) {
      gzip = zlib.gzipSync(raw, { level: 6 });
    }
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf'
    };
    const entry = { raw, gzip, mime: mimeTypes[ext] || 'application/octet-stream', mtime: stat.mtimeMs, cachedAt: now };
    CACHED_FILES[fullPath] = entry;
    return entry;
  } catch (e) {
    return null;
  }
}

// Serve static files (with gzip + in-memory cache + smart caching headers)
function serveStatic(req, res) {
  const parsed = new URL(req.url, `http://localhost:${PORT}`);
  let filePath = parsed.pathname;
  if (filePath === '/') filePath = '/index.html';
  
  const fullPath = path.join(PUBLIC_DIR, filePath);
  
  // Security check: prevent directory traversal
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return false;
  }
  
  const entry = getCachedFile(fullPath);
  if (!entry) return false;
  
  // Smart caching:
  // - Versioned assets (?v=...) → cache 7 days (immutable)
  // - index.html → no-cache (always revalidate)
  // - Other static → cache 1 hour
  const hasVersion = parsed.searchParams.has('v');
  if (filePath === '/index.html') {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (hasVersion) {
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  res.setHeader('ETag', `"${entry.mtime}"`);
  res.setHeader('Content-Type', entry.mime);
  
  // If client supports gzip AND we have compressed version, send it
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (entry.gzip && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Content-Length', entry.gzip.length);
    res.end(entry.gzip);
  } else {
    res.setHeader('Content-Length', entry.raw.length);
    res.end(entry.raw);
  }
  return true;
}

// Simple API request with timeout and error handling — bypasses system proxy
const httpsAgent = new https.Agent({ keepAlive: true });
const httpAgent = new http.Agent({ keepAlive: true });

function getAgentForUrl(urlStr) {
  return urlStr.startsWith('https') ? httpsAgent : httpAgent;
}

function requestGD(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      req.destroy();
      reject(new Error('Request timeout'));
    }, 10000);
    
    const req = https.get(url, {
      agent: httpsAgent,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const data = Buffer.concat(chunks).toString('utf-8');
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('[GD] Parse error:', data.substring(0, 100));
          reject(new Error('Parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      clearTimeout(timeout);
      console.error('[GD] Request error:', e.message);
      reject(e);
    });
  });
}

// 调用网易云音乐 API（直接访问，获取准确的专辑信息）
function requestNetease(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://music.163.com/',
      }
    };
    
    options.agent = getAgentForUrl(url);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('[Netease] Parse error:', data.substring(0, 100));
          reject(new Error('Parse error'));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error('[Netease] Request error:', e.message);
      reject(e);
    });
    
    req.end();
  });
}

// Artist photo cache and function
const artistPhotoCache = new Map();

async function getArtistPhotoUrl(artistName) {
  if (!artistName || artistName === 'Unknown') return null;
  
  // 处理多艺人（如 "Taylor Swift, Bon Iver"），只取第一个艺人来搜索
  const primaryArtist = artistName.split(',')[0].trim();
  
  // 用第一个艺人名做缓存，避免因合作艺人名缓存错误结果
  const cacheKey = primaryArtist;
  if (artistPhotoCache.has(cacheKey)) {
    return artistPhotoCache.get(cacheKey);
  }
  
  try {
    const url = `https://music.163.com/api/search/get?s=${encodeURIComponent(primaryArtist)}&type=100&limit=1`;
    const data = await requestGD(url);
    
    if (data && data.result && data.result.artists && data.result.artists.length > 0) {
      const photoUrl = data.result.artists[0].picUrl || data.result.artists[0].img1v1Url || null;
      if (photoUrl) {
        artistPhotoCache.set(cacheKey, photoUrl);
        setTimeout(() => artistPhotoCache.delete(cacheKey), 3600000);
        console.log(`[Artist Photo] ${primaryArtist}: cached`);
        return photoUrl;
      }
    }
  } catch (e) {
    console.error(`[Artist Photo] Failed for ${primaryArtist}:`, e.message);
  }
  
  artistPhotoCache.set(cacheKey, null);
  setTimeout(() => artistPhotoCache.delete(cacheKey), 3600000);
  return null;
}

// Artist info cache (avatar + background + desc from Netease)
const artistInfoCache = new Map();

async function getArtistInfoNetease(artistName) {
  if (!artistName || artistName === 'Unknown') return null;
  
  const primaryArtist = artistName.split(',')[0].trim();
  const cacheKey = primaryArtist;
  
  if (artistInfoCache.has(cacheKey)) {
    return artistInfoCache.get(cacheKey);
  }
  
  try {
    // 1) 搜索艺人获取 ID
    const searchUrl = `https://music.163.com/api/search/get?s=${encodeURIComponent(primaryArtist)}&type=100&limit=1`;
    const searchData = await requestGD(searchUrl);
    
    if (!searchData || !searchData.result || !searchData.result.artists || !searchData.result.artists.length) {
      console.log(`[Artist Info] No artist found for: ${primaryArtist}`);
      artistInfoCache.set(cacheKey, null);
      setTimeout(() => artistInfoCache.delete(cacheKey), 3600000);
      return null;
    }
    
    const artist = searchData.result.artists[0];
    const artistId = artist.id;
    
    // 2) 获取艺人详情
    const detailUrl = `https://music.163.com/api/artist/${artistId}`;
    const detailData = await requestGD(detailUrl);
    
    if (!detailData || !detailData.artist) {
      console.log(`[Artist Info] No detail for: ${primaryArtist} (id=${artistId})`);
      artistInfoCache.set(cacheKey, null);
      setTimeout(() => artistInfoCache.delete(cacheKey), 3600000);
      return null;
    }
    
    const a = detailData.artist;
    const info = {
      avatar: a.picUrl || a.img1v1Url || artist.picUrl || '',
      background: a.picUrl || a.img1v1Url || artist.picUrl || '',  // 背景用大图
      desc: a.briefDesc || '',
      artistId: String(artistId),
    };
    
    artistInfoCache.set(cacheKey, info);
    setTimeout(() => artistInfoCache.delete(cacheKey), 3600000);
    console.log(`[Artist Info] ${primaryArtist}: cached (avatar=${!!info.avatar}, desc=${!!info.desc})`);
    return info;
  } catch (e) {
    console.error(`[Artist Info] Failed for ${primaryArtist}:`, e.message);
  }
  
  artistInfoCache.set(cacheKey, null);
  setTimeout(() => artistInfoCache.delete(cacheKey), 3600000);
  return null;
}

// Format song data
function formatSong(s) {
  if (!s) return null;
  const artist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || 'Unknown');
  const songName = s.name || '';
  const primaryArtist = artist.split(',')[0].trim();
  
  // === 核心修复：强制纠正专辑信息 ===
  let album = s.album || '';
  let picId = s.pic_id || '';
  
  // 1. 先查映射表（最高优先级）
  const corrected = getCorrectAlbumSync(primaryArtist, songName);
  if (corrected) {
    album = corrected.album || '';
    picId = corrected.picId || picId; // 如果映射表有 picId，用映射表的
    console.log(`[AlbumFix] Corrected: "${songName}" → album="${album}", picId="${picId}"`);
  }
  
  // 2. 如果映射表没有，且 album 看起来不可信，尝试智能纠正
  if (!corrected && album && songName) {
    const albumLower = album.toLowerCase().trim();
    const songLower = songName.toLowerCase().trim();
    
    // album 和 songName 一样 → 肯定错了
    if (albumLower === songLower) {
      console.log(`[AlbumFix] Album "${album}" same as song "${songName}", marking as unreliable`);
      album = ''; // 设为空，让后面用 artist + songName 重新搜索
    }
  }
  
  // pic_id 有值 → 直接用封面代理
  let coverUrl;
  if (picId) {
    coverUrl = '/api/music/cover?picId=' + picId;
  } else {
    // 没有 picId，需要用 album-cover API 获取
    // 如果 album 不可信，传空字符串（让 API 只用 artist + songName 搜索）
    const searchAlbum = album || '';
    const cacheKey = primaryArtist + '|' + searchAlbum + '|' + songName;
    const cachedPicId = albumCoverCache.get(cacheKey);
    if (cachedPicId) {
      coverUrl = '/api/music/cover?picId=' + cachedPicId;
    } else {
      coverUrl = '/api/album-cover?artist=' + encodeURIComponent(primaryArtist) + 
                 '&album=' + encodeURIComponent(searchAlbum) + 
                 '&name=' + encodeURIComponent(songName);
    }
  }
  
  return {
    id: String(s.id || ''),
    name: songName || 'Unknown',
    artist: artist,
    album: album,  // ✅ 使用纠正后的 album
    albumId: picId,  // 保留兼容性
    picId: picId,    // ✅ 前端实际读取的字段
    cover: coverUrl,
    coverSmall: coverUrl,
    duration: 0,
    source: 'netease'
  };
}

// Search songs
async function searchSongs(keywords, limit, source) {
  try {
    const src = source || 'netease';
    const url = `${GD_API}?types=search&source=${src}&name=${encodeURIComponent(keywords)}&count=${limit}`;
    console.log(`[Search] "${keywords}" (limit=${limit})`);
    const data = await requestGD(url);
    if (Array.isArray(data)) {
      // Fire-and-forget: pre-warm album cover cache in background (non-blocking)
      const missingCovers = data.filter(s => !s.pic_id && (s.album || s.name));
      if (missingCovers.length > 0) {
        console.log(`[Search] Background pre-warming ${missingCovers.length} album covers...`);
        // Don't await — let it run in background while we return results
        Promise.all(missingCovers.map(s => {
          const artist = Array.isArray(s.artist) ? s.artist.join(', ') : (s.artist || 'Unknown');
          const primaryArtist = artist.split(',')[0].trim();
          
          // 智能判断 album 是否可信
          const album = s.album || '';
          const songName = s.name || '';
          let reliableAlbum = album;
          
          // 判断逻辑（与 formatSong 一致）
          const albumLower = album.toLowerCase().trim();
          const songLower = songName.toLowerCase().trim();
          const isReliable = album && 
                           album.trim().length >= 2 &&
                           albumLower !== songLower &&
                           !(songLower && albumLower && songLower.includes(albumLower) && Math.abs(album.length - songName.length) < 5);
          
          if (!isReliable) reliableAlbum = ''; // 不可信时传空
          
          return findAlbumCoverPicId(primaryArtist, reliableAlbum, songName);
        })).then(() => console.log('[Search] Album cover pre-warm complete'));
      }
      const seen = new Set();
      return data
        .map(formatSong)
        .filter(s => {
          if (!s) return false;
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
    }
    return [];
  } catch (e) {
    console.error('[Search] Failed:', e.message);
    return [];
  }
}

// Get song URL
async function getSongUrl(id, source) {
  try {
    const src = source || 'netease';
    const url = `${GD_API}?types=url&source=${src}&id=${id}&br=320`;
    const data = await requestGD(url);
    return data && data.url ? data.url : null;
  } catch (e) {
    console.error('[URL] Failed:', e.message);
    return null;
  }
}

// ========== Lyric Translation ==========
// Translation cache: songId → translated LRC text
const lyricTranslationCache = new Map();

// Check if text is primarily Chinese (no translation needed)
function isChineseText(text) {
  var chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  var latin = (text.match(/[a-zA-Z]/g) || []).length;
  return chinese > latin;
}

// Translate LRC lyrics to Chinese using Google Translate free API
async function translateLrcToChinese(lrcText) {
  if (!lrcText || lrcText.length < 10) return '';

  // Parse LRC to extract lines with timestamps
  var regex = /\[(\d{2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)/;
  var lines = [];
  var raw = lrcText.split('\n');
  for (var i = 0; i < raw.length; i++) {
    var m = raw[i].match(regex);
    if (!m) continue;
    var time = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + (m[3] ? parseInt(m[3].padEnd(3, '0'), 10) / 1000 : 0);
    var text = m[4].trim();
    if (!text) continue;
    if (/^(作曲|作词|编曲|制作|混音|吉他|贝斯|键盘|弦乐|鼓|和声|录音|母带|OP|SP|ISRC)/.test(text)) continue;
    lines.push({ time: time, text: text });
  }

  if (!lines.length) return '';

  // Skip if lyrics are already primarily Chinese
  var allText = lines.map(function(l) { return l.text; }).join('');
  if (isChineseText(allText)) return '';

  // Batch translate (10 lines per batch to keep URL short)
  var BATCH = 10;
  var translated = [];

  for (var bi = 0; bi < lines.length; bi += BATCH) {
    var batch = lines.slice(bi, bi + BATCH);
    var batchText = batch.map(function(l) { return l.text; }).join('\n');

    try {
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=' + encodeURIComponent(batchText);
      var data = await requestGD(url);

      if (data && data[0] && Array.isArray(data[0])) {
        var translations = data[0].map(function(item) { return item[0]; });

        for (var j = 0; j < batch.length; j++) {
          if (j < translations.length) {
            // If original line is already Chinese, keep original (avoid re-translating)
            if (isChineseText(batch[j].text)) {
              translated.push({ time: batch[j].time, text: batch[j].text });
            } else {
              translated.push({ time: batch[j].time, text: translations[j] });
            }
          } else {
            translated.push({ time: batch[j].time, text: batch[j].text });
          }
        }
      } else {
        batch.forEach(function(l) { translated.push({ time: l.time, text: l.text }); });
      }
    } catch (e) {
      console.error('[Translate] Batch error:', e.message);
      batch.forEach(function(l) { translated.push({ time: l.time, text: l.text }); });
    }
  }

  // Reconstruct LRC with timestamps
  return translated.map(function(l) {
    var mins = Math.floor(l.time / 60);
    var secs = Math.floor(l.time % 60);
    var ms = Math.floor((l.time % 1) * 1000);
    return '[' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0') + '.' + String(ms).padStart(3, '0') + ']' + l.text;
  }).join('\n');
}

// Get lyric
async function getLyric(id, source) {
  try {
    var src = source || 'netease';
    var url = GD_API + '?types=lyric&source=' + src + '&id=' + id;
    var data = await requestGD(url);

    var lrc = data && data.lyric ? data.lyric : '';
    var tlyric = data && data.tlyric ? data.tlyric : '';

    // If no translation from API, auto-translate to Chinese
    if (lrc && !tlyric) {
      var cacheKey = String(id);
      if (lyricTranslationCache.has(cacheKey)) {
        tlyric = lyricTranslationCache.get(cacheKey);
      } else {
        try {
          console.log('[Lyric] Auto-translating for song:', id);
          tlyric = await translateLrcToChinese(lrc);
          lyricTranslationCache.set(cacheKey, tlyric);
          setTimeout(function() { lyricTranslationCache.delete(cacheKey); }, 86400000);
        } catch (e) {
          console.error('[Lyric] Translation failed for', id, ':', e.message);
        }
      }
    }

    return { lrc: lrc, tlyric: tlyric };
  } catch (e) {
    return { lrc: '', tlyric: '' };
  }
}

// Album cover cache: "artist|album" → picId (avoids repeated GD API searches)
const albumCoverCache = new Map();
const ALBUM_COVER_TTL = 3600000; // 1 hour

// Find album cover picId by trying multiple search strategies on GD API (parallel)
async function findAlbumCoverPicId(artist, album, songName) {
  const cacheKey = artist + '|' + album + '|' + (songName || '');
  
  // Check cache
  const cached = albumCoverCache.get(cacheKey);
  if (cached !== undefined) return cached; // null is also cached
  

  // 智能判断：album 字段是否可信
  // 如果 album 和 songName 完全一样，或者 album 为空/太短，认为是错误数据
  function isAlbumReliable(album, songName) {
    if (!album || album.trim().length < 2) return false;
    
    const albumLower = album.toLowerCase().trim();
    const songLower = (songName || '').toLowerCase().trim();
    
    // album 和 songName 完全一样 → 可疑（应该是不同的）
    if (albumLower === songLower) return false;
    
    // album 包含在 songName 中，且长度接近 → 可疑（可能是数据错误）
    if (songLower && albumLower && songLower.includes(albumLower) && Math.abs(album.length - songName.length) < 5) {
      return false;
    }
    
    // album 太短（< 2个字符）-> 不可信
    if (album.trim().length < 2) return false;
    
    return true;
  }
  
  const albumReliable = isAlbumReliable(album, songName);
  if (!albumReliable) {
    console.log(`[AlbumCover] Album "${album}" seems unreliable for song "${songName}", ignoring album field`);
  }
  
  try {
    // Build list of search queries to try (in priority order)
    const queries = [];
    const coreAlbum = albumReliable ? album.replace(/\s*[\(（].*[\)）]\s*/g, '').trim() : '';
    const coreSong = songName ? songName.replace(/\s*[\(（].*[\)）]\s*/g, '').trim() : '';
    
    // 优先使用可靠的组合
    if (artist && coreAlbum) queries.push(artist + ' ' + coreAlbum);
    if (artist && coreSong) queries.push(artist + ' ' + coreSong);
    if (coreSong) queries.push(coreSong);
    if (artist) queries.push(artist);
    
    // Fire all queries in parallel, pick first one with a pic_id AND matching album
    const searchOne = async (query) => {
      const url = `${GD_API}?types=search&source=netease&name=${encodeURIComponent(query)}&count=10`;
      try {
        const data = await requestGD(url);
        if (Array.isArray(data) && data.length > 0) {
          // 优先查找专辑名完全匹配的
          for (const s of data) {
            if (!s.pic_id) continue;
            
            // 验证专辑是否匹配（仅当 album 可靠时）
            if (albumReliable) {
              const sAlbum = (s.album || '').toLowerCase();
              const reqAlbum = (album || '').toLowerCase();
              const reqCoreAlbum = coreAlbum.toLowerCase();
              
              // 专辑名完全匹配或包含
              const albumMatch = sAlbum && (
                sAlbum === reqAlbum ||
                sAlbum.includes(reqCoreAlbum) ||
                reqCoreAlbum.includes(sAlbum)
              );
              
              if (albumMatch) {
                console.log(`[AlbumCover] Found picId ${s.pic_id} via "${query}" (album: "${s.album}")`);
                return s.pic_id;
              }
            } else {
              // album 不可靠时，只验证艺人是否匹配
              if (artist && s.artist) {
                const sArtist = Array.isArray(s.artist) ? s.artist.join(', ') : s.artist;
                if (sArtist.toLowerCase().includes(artist.toLowerCase().split(',')[0].trim())) {
                  console.log(`[AlbumCover] Found picId ${s.pic_id} via "${query}" (artist match, album ignored)`);
                  return s.pic_id;
                }
              } else if (!artist) {
                // 没有艺人信息，直接用第一个有 pic_id 的结果
                console.log(`[AlbumCover] Found picId ${s.pic_id} via "${query}" (no artist filter)`);
                return s.pic_id;
              }
            }
          }
          
          // 如果没找到严格匹配的，退而求其次：用第一首有 pic_id 的（但记录警告）
          if (query === queries[0]) {
            const fallback = data.find(s => s.pic_id);
            if (fallback) {
              console.log(`[AlbumCover] WARNING: No exact match for "${songName}", using fallback picId ${fallback.pic_id} from "${fallback.album}" (artist: ${fallback.artist})`);
              return fallback.pic_id;
            }
          }
        }
      } catch (e) { /* ignore individual query errors */ }
      return null;
    };
    
    const results = await Promise.all(queries.map(searchOne));
    const picId = results.find(r => r !== null) || null;
    
    albumCoverCache.set(cacheKey, picId);
    setTimeout(() => albumCoverCache.delete(cacheKey), ALBUM_COVER_TTL);
    if (!picId) console.log(`[AlbumCover] No cover found for artist="${artist}" album="${album}" song="${songName}"`);
    return picId;
  } catch (e) {
    console.error('[AlbumCover] Error:', e.message);
    albumCoverCache.set(cacheKey, null);
    setTimeout(() => albumCoverCache.delete(cacheKey), ALBUM_COVER_TTL);
    return null;
  }
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;
  const params = urlObj.searchParams;
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  console.log(`${req.method} ${pathname}`);
  
  // Try serving static files first
  if (pathname === '/' || pathname.endsWith('.html') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.woff') || pathname.endsWith('.woff2') || pathname.endsWith('.ttf') || pathname.endsWith('.svg') || pathname.endsWith('.ico') || pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.gif')) {
    if (serveStatic(req, res)) return;
  }
  
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  try {
    // Health check
    if (pathname === '/api/health') {
      res.end(JSON.stringify({ status: 'ok', version: 'v20260618t' }));
      return;
    }
    
    // Search - support both /api/search and /api/music/search
    if (pathname === '/api/search' || pathname === '/api/music/search') {
      const keywords = params.get('keywords') || '';
      const limit = parseInt(params.get('limit') || '30');
      const source = params.get('source') || 'netease';
      const songs = await searchSongs(keywords, limit, source);
      res.end(JSON.stringify({ songs, total: songs.length }));
      return;
    }
    
    // Hot/Discover
    if (pathname === '/api/discover/hot' || pathname === '/api/music/hot') {
      const limit = parseInt(params.get('limit') || '30');
      // 用多个中文关键词搜索，合并去重，保证多样性
      const hotKeywords = ['热门歌曲', '华语流行', '经典老歌', '抖音热歌'];
      const perKeyword = Math.ceil(limit / hotKeywords.length) + 5;
      const allSongs = [];
      const seenIds = new Set();
      for (const kw of hotKeywords) {
        const results = await searchSongs(kw, perKeyword, 'netease');
        for (const s of results) {
          if (!seenIds.has(s.id)) {
            seenIds.add(s.id);
            allSongs.push(s);
          }
        }
        if (allSongs.length >= limit) break;
      }
      // 打乱顺序
      for (let i = allSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allSongs[i], allSongs[j]] = [allSongs[j], allSongs[i]];
      }
      res.end(JSON.stringify({ songs: allSongs.slice(0, limit) }));
      return;
    }
    
    // Audio proxy
    if (pathname === '/api/music/proxy') {
      const id = params.get('id');
      const source = params.get('source') || 'netease';
      
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing id' }));
        return;
      }
      
      (async () => {
        try {
          // 获取音频URL
          const gdUrl = `${GD_API}?types=url&source=${source}&id=${id}&br=320`;
          const audioInfo = await requestGD(gdUrl);
          
          if (!audioInfo || !audioInfo.url) {
            if (!res.headersSent) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Audio not found' }));
            }
            return;
          }
          
          const audioUrl = audioInfo.url;
          const fileSize = audioInfo.size || 0;
          
          console.log(`[Proxy] ${id}, size: ${fileSize}`);
          
          const parsedUrl = new URL(audioUrl);
          const proto = parsedUrl.protocol === 'https:' ? https : http;
          
          // 解析 range 请求
          const range = req.headers.range;
          let options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': 'https://music.163.com/'
            }
          };
          
          if (range) {
            options.headers['Range'] = range;
          }
          options.agent = getAgentForUrl(audioUrl);
          
          const proxyReq = proto.get(options, (audioRes) => {
            // 转发状态码
            res.statusCode = audioRes.statusCode || 200;
            
            // 转发响应头
            res.setHeader('Content-Type', 'audio/mpeg');
            res.setHeader('Accept-Ranges', 'bytes');
            
            if (audioRes.headers['content-range']) {
              res.setHeader('Content-Range', audioRes.headers['content-range']);
            }
            if (audioRes.headers['content-length']) {
              res.setHeader('Content-Length', audioRes.headers['content-length']);
            } else if (fileSize > 0 && !range) {
              res.setHeader('Content-Length', fileSize);
            }
            
            // CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            audioRes.pipe(res);
          });
          
          proxyReq.on('error', (e) => {
            console.error('[Proxy] Error:', e.message);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          
        } catch (e) {
          console.error('[Proxy] Failed:', e.message);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        }
      })();
      return;
    }
    
    // Lyric - support both /api/music/lyric and /api/lyric
    if (pathname === '/api/music/lyric' || pathname === '/api/lyric') {
      const id = params.get('id');
      const source = params.get('source') || 'netease';
      
      if (!id) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Missing id' }));
        return;
      }
      
      const lyric = await getLyric(id, source);
      res.end(JSON.stringify(lyric));
      return;
    }
    
    // Search lyric by artist+title
    if (pathname === '/api/search-lyric') {
      const artist = params.get('artist') || '';
      const title = params.get('title') || '';
      
      const songs = await searchSongs(title + ' ' + artist, 1, 'netease');
      if (songs.length > 0) {
        const lyric = await getLyric(songs[0].id, 'netease');
        res.end(JSON.stringify(lyric));
      } else {
        res.end(JSON.stringify({ lrc: '', tlyric: '' }));
      }
      return;
    }
    
    // Cover image - fetch from GD API then proxy actual cover
    if (pathname === '/api/music/cover' || pathname === '/api/cover') {
      const picId = params.get('picId') || params.get('albumId') || '';
      
      if (!picId) {
        res.statusCode = 400;
        res.end('Missing picId');
        return;
      }
      
      try {
        // Step 1: Get cover URL from GD API
        const gdCoverUrl = `${GD_API}?types=pic&id=${picId}&source=netease`;
        const coverData = await requestGD(gdCoverUrl);
        let coverUrl = coverData && coverData.url ? coverData.url : null;
        
        if (!coverUrl) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Cover not found' }));
          return;
        }
        
        // Step 2: Proxy the actual cover image
        const parsedUrl = new URL(coverUrl);
        const options = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com/'
          }
        };
        
        const proto = parsedUrl.protocol === 'https:' ? https : http;
        options.agent = getAgentForUrl(coverUrl);
        proto.get(options, (imgRes) => {
          res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.statusCode = imgRes.statusCode || 200;
          imgRes.pipe(res);
        }).on('error', () => {
          res.statusCode = 404;
          res.end('Not found');
        });
      } catch (e) {
        console.error('[Cover] Error:', e.message);
        res.statusCode = 404;
        res.end('Not found');
      }
      return;
    }
    
    // Album cover - search by artist+album when pic_id is unknown
    if (pathname === '/api/album-cover') {
      const artist = params.get('artist') || '';
      const album = params.get('album') || '';
      const songName = params.get('name') || '';
      
      if (!artist && !album && !songName) {
        res.statusCode = 400;
        res.end('Missing artist, album or name');
        return;
      }
      
      try {
        // Step 1: Find picId by searching
        const picId = await findAlbumCoverPicId(artist, album, songName);
        
        if (!picId) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Album cover not found' }));
          return;
        }
        
        // Step 2: Get cover URL from GD API
        const gdCoverUrl = `${GD_API}?types=pic&id=${picId}&source=netease`;
        const coverData = await requestGD(gdCoverUrl);
        let coverUrl = coverData && coverData.url ? coverData.url : null;
        
        if (!coverUrl) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Cover URL not found' }));
          return;
        }
        
        // Step 3: Proxy the actual cover image
        const parsedUrl = new URL(coverUrl);
        const options = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com/'
          }
        };
        options.agent = getAgentForUrl(coverUrl);
        
        const proto = parsedUrl.protocol === 'https:' ? https : http;
        proto.get(options, (imgRes) => {
          res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.statusCode = imgRes.statusCode || 200;
          imgRes.pipe(res);
        }).on('error', () => {
          res.statusCode = 404;
          res.end('Not found');
        });
      } catch (e) {
        console.error('[AlbumCover] Proxy error:', e.message);
        res.statusCode = 404;
        res.end('Not found');
      }
      return;
    }
    
    // Album - 使用网易云API获取准确的专辑信息
    // 参数：
    //   - songId: 歌曲ID（用来获取专辑ID）
    //   - albumId: 专辑ID（直接获取专辑信息，优先使用）
    //   - album: 专辑名称（向后兼容）
    //   - artist: 艺人名称（向后兼容）
    if (pathname === '/api/music/album') {
      const songId = params.get('songId') || '';
      const albumId = params.get('albumId') || '';
      const album = params.get('album') || '';
      const artist = params.get('artist') || '';
      const limit = parseInt(params.get('limit') || '50');
      
      try {
        let targetAlbumId = albumId;
        
        // 如果没有 albumId，但有 songId，先用 songId 获取专辑ID
        if (!targetAlbumId && songId) {
          console.log(`[Album] Getting albumId from songId=${songId}`);
          const detailUrl = `${NETEASE_API}/song/detail?id=${songId}&ids=[${songId}]`;
          const detailData = await requestNetease(detailUrl);
          
          if (detailData && detailData.songs && detailData.songs.length > 0) {
            targetAlbumId = String(detailData.songs[0].album.id);
            console.log(`[Album] Got albumId=${targetAlbumId} from songId=${songId}`);
          }
        }
        
        // 如果有 albumId，直接用网易云API获取专辑信息
        if (targetAlbumId) {
          console.log(`[Album] Fetching album from Netease API: albumId=${targetAlbumId}`);
          const albumUrl = `${NETEASE_API}/album?id=${targetAlbumId}`;
          const albumData = await requestNetease(albumUrl);
          
          if (albumData && albumData.album && albumData.songs) {
            const albumInfo = albumData.album;
            const songs = albumData.songs.slice(0, limit);
            
            console.log(`[Album] Netease API returned: album="${albumInfo.name}", ${songs.length} songs`);
            
            // 转换为我们的格式
            const formattedSongs = songs.map(s => ({
              id: String(s.id),
              name: s.name || '',
              artist: s.artists.map(a => a.name).join(', '),
              album: albumInfo.name || '',
              albumId: String(albumInfo.picId || ''),
              picId: String(albumInfo.picId || ''),
              cover: '/api/music/cover?picId=' + (albumInfo.picId || ''),
              coverSmall: '/api/music/cover?picId=' + (albumInfo.picId || ''),
              duration: Math.round((s.duration || 0) / 1000),
              source: 'netease'
            }));
            
            res.end(JSON.stringify({ songs: formattedSongs }));
            return;
          } else {
            console.log(`[Album] Netease API failed, falling back to search`);
          }
        }
        
        // 向后兼容：没有 songId 或 albumId 时，用专辑名搜索
        if (!album) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing songId, albumId, or album parameter' }));
          return;
        }
        
        console.log(`[Album] Fallback: searching by album="${album}", artist="${artist}"`);
        
        // 用 "artist album" 搜索，然后按 picId 分组
        const query = artist ? `${artist} ${album}` : album;
        const allSongs = await searchSongs(query, 50, 'netease');
        
        if (allSongs.length === 0) {
          res.end(JSON.stringify({ songs: [] }));
          return;
        }
        
        // 按 picId 分组，找到出现次数最多的 picId
        const picIdCounts = {};
        allSongs.forEach(s => {
          const pid = s.picId || s.albumId || '';
          if (pid) {
            picIdCounts[pid] = (picIdCounts[pid] || 0) + 1;
          }
        });
        
        // 找到最多的 picId
        let mainPicId = '';
        let maxCount = 0;
        for (const [pid, count] of Object.entries(picIdCounts)) {
          if (count > maxCount) {
            maxCount = count;
            mainPicId = pid;
          }
        }
        
        console.log(`[Album] picId counts:`, picIdCounts, `→ main picId: ${mainPicId}`);
        
        // 过滤出 picId 匹配的歌曲
        let filtered = [];
        if (mainPicId) {
          filtered = allSongs.filter(s => (s.picId || s.albumId || '') === mainPicId);
        }
        
        // 如果按 picId 过滤后为空，用 album 字段模糊匹配
        if (filtered.length === 0) {
          const coreAlbum = album.replace(/\s*[\(（].*[\)）]\s*/g, '').trim().toLowerCase();
          filtered = allSongs.filter(s => {
            if (!s.album) return false;
            const sCore = s.album.replace(/\s*[\(（].*[\)）]\s*/g, '').trim().toLowerCase();
            return sCore === coreAlbum || s.album.toLowerCase().includes(coreAlbum);
          });
        }
        
        // 按艺人二次过滤（可选）
        let finalSongs = filtered;
        if (artist && filtered.length > 0) {
          const artistLower = artist.toLowerCase().split(',')[0].trim();
          const artistFiltered = filtered.filter(s => {
            if (!s.artist) return false;
            return s.artist.toLowerCase().includes(artistLower) ||
                   artistLower.includes(s.artist.toLowerCase().split(',')[0].trim());
          });
          if (artistFiltered.length > 0) {
            finalSongs = artistFiltered;
          }
        }
        
        // 去重
        const seen = new Set();
        finalSongs = finalSongs.filter(s => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
        
        console.log(`[Album] "${album}": ${allSongs.length} total → ${finalSongs.length} filtered`);
        res.end(JSON.stringify({ songs: finalSongs.slice(0, limit) }));
        return;
        
      } catch (e) {
        console.error('[Album] Error:', e.message);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Failed to fetch album info' }));
        return;
      }
    }
    
    // Artist songs
    if (pathname === '/api/music/artist') {
      const name = params.get('name') || '';
      const limit = parseInt(params.get('limit') || '50');
      const offset = parseInt(params.get('offset') || '0');
      
      const songs = await searchSongs(name, limit + offset, 'netease');
      const pagedSongs = songs.slice(offset, offset + limit);
      res.end(JSON.stringify({ songs: pagedSongs, hasMore: songs.length >= limit + offset }));
      return;
    }
    
    // Artist info - fetch from Netease API
    if (pathname === '/api/music/artist-info') {
      const name = params.get('name') || '';
      const info = await getArtistInfoNetease(name);
      if (info) {
        res.end(JSON.stringify(info));
      } else {
        res.end(JSON.stringify({
          name: name,
          avatar: '',
          background: '',
          desc: ''
        }));
      }
      return;
    }
    
    // New albums
    if (pathname === '/api/album/new') {
      const limit = parseInt(params.get('limit') || '12');
      const songs = await searchSongs('new', limit, 'netease');
      res.end(JSON.stringify({ songs }));
      return;
    }
    
    // Artist photo - fetch real artist photos from Netease API
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
          // Return a default music SVG icon as fallback
          res.setHeader('Content-Type', 'image/svg+xml');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#1a1a2e" width="200" height="200"/><circle cx="100" cy="100" r="60" fill="#b44dff" opacity="0.3"/><text x="100" y="110" text-anchor="middle" fill="#fff" font-size="40">♪</text></svg>`;
          res.end(svg);
          return;
        }
        
        const parsedUrl = new URL(photoUrl);
        const proto = parsedUrl.protocol === 'https:' ? https : http;
        const options = {
          hostname: parsedUrl.hostname,
          path: parsedUrl.pathname + parsedUrl.search,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://music.163.com/'
          }
        };
        options.agent = getAgentForUrl(photoUrl);
        
        proto.get(options, (imgRes) => {
          res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.statusCode = imgRes.statusCode || 200;
          imgRes.pipe(res);
        }).on('error', () => {
          res.statusCode = 404;
          res.end('Not found');
        });
      } catch (e) {
        console.error('[Artist Photo] Endpoint error:', e.message);
        res.statusCode = 404;
        res.end('Not found');
      }
      return;
    }
    
    // 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: `Not found: ${pathname}` }));
    
  } catch (e) {
    console.error('[Error]', e.message);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(PORT, () => {
  console.log(`TY Music Server running on http://localhost:${PORT}`);
  console.log('Version: v20260618v (gzip+keepalive)');
  console.log('API: GD Studio');
  console.log('Status: Ready');
});

// Keep-alive: 让同一连接的多个请求复用 TCP，节省握手开销
server.keepAliveTimeout = 65000;  // 略大于浏览器默认 60s
server.headersTimeout = 66000;    // 略大于 keepAliveTimeout

// 防止未捕获异常导致进程崩溃
process.on('uncaughtException', (err) => {
  console.error('[FATAL] uncaughtException:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] unhandledRejection:', reason);
});
// Graceful shutdown
process.on('SIGTERM', () => { console.log('Server shutting down'); process.exit(0); });
process.on('SIGINT', () => { console.log('Server shutting down'); process.exit(0); });
