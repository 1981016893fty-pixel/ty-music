/* ============================================
   TY Music — 全网音乐播放器
   ============================================ */

// ========== Shortcuts ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

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

// ========== API 搜索 ==========

// ========== Search ==========
const SOURCE_LABELS = {
  netease: '全网搜索',
  'netease-hot': '热门推荐',
  'netease-new': '新歌速递',
};

// 标准化歌曲对象（新音源）
function normalizeTrack(song) {
  var src = song.source || 'netease';
  var pid = song.picId || '';
  var coverUrl = song.cover || '';
  var coverSmallUrl = song.coverSmall || song.cover || '';

  // 无直接封面URL时，通过picId构建代理URL
  if (!coverUrl && pid) {
    coverUrl = '/api/music/cover?picId=' + encodeURIComponent(pid) + '&source=' + src + '&size=500';
  }
  if (!coverSmallUrl && pid) {
    coverSmallUrl = '/api/music/cover?picId=' + encodeURIComponent(pid) + '&source=' + src + '&size=200';
  }

  return {
    id: String(song.id || ''),
    title: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover: coverUrl || song.cover || '',
    coverSmall: coverSmallUrl || song.coverSmall || '',
    picId: pid,
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
  var timer = setTimeout(function() { ctrl.abort(); }, 30000);
  try {
    var res = await fetch('/api/music/search?keywords=' + encodeURIComponent(keywords) + '&source=netease&limit=' + limit, { signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return [];
    var data = await res.json();
    if (!data.songs || !data.songs.length) return [];
    return data.songs.map(function(s) { return normalizeNeteaseTrack(s); });
  } catch (e) {
    console.warn('[Search] Failed for "' + keywords + '":', e.message);
    return [];
  }
}

// 新音源热门推荐
async function fetchNeteaseHot(limit) {
  limit = limit || 80;
  var ctrl = new AbortController();
  var timer = setTimeout(function() { ctrl.abort(); }, 30000);
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
  const cover = song.cover || '';
  const coverSmall = song.coverSmall || cover || '';
  const picId = song.albumId || song.picId || '';
  return {
    id: String(song.id || ''),
    title: song.name || '未知歌曲',
    artist: song.artist || '未知歌手',
    album: song.album || '',
    cover: cover,
    coverSmall: coverSmall,
    albumId: song.albumId || '',
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
    const color = `rgba(${r},${g},${b},0.15)`;
    $('#bgGradient').style.background = `radial-gradient(ellipse at 50% 30%, ${color} 0%, transparent 70%)`;
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
  }
  
  // 压入导航历史栈（同页不重复记录）
  if (state.currentPage !== page) {
    state.navHistory.push(state.currentPage);
  }
  
  state.currentPage = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = $(`#page-${page}`);
  if (pageEl) pageEl.classList.add('active');

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
  // 跳过当前页检测，直接切回去
  if (state.currentPage === 'album-favorites') cfStop();
  state.currentPage = prev;
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

function playTrack(track, index) {
  if (!track) return;
  if (index !== undefined) state.queueIndex = index;
  else if (state.queueIndex < 0) state.queueIndex = state.queue.indexOf(track);
  
  state.currentTrack = track;
  
  // 调试：显示即将播放的歌曲
  console.log('[PlayTrack] Playing:', track.title, 'by', track.artist, 'album:', track.album);
  
  // 关键：在用户手势最前端初始化 AudioContext，确保 resume() 在手势中生效
  // 缓存歌曲数据到 trackCache 并立即持久化（不等异步回调）
  cacheTrack(track);

  // Record recent play
  state.recentPlays = state.recentPlays.filter(r => r.id !== track.id);
  state.recentPlays.unshift({
    id: track.id, title: track.title, artist: track.artist,
    album: track.album || '',  // ✅ 保存专辑名
    cover: track.cover || track.coverSmall || '', source: track.source,
    picId: track.picId || '',  // ✅ 保存picId（100%准确）
    previewUrl: track.previewUrl,
  });

  // 【关键修复】立即同步保存，不依赖异步回调。防止页面关闭时数据丢失
  saveAll();

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
        openAlbumByPicId(picId, songId, albumText, track.artist, 'netease');
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
          openAlbumByPicId(picId, songId, albumText, track.artist, 'netease');
        }, 400);
      };
    }
 } catch(e) { console.warn('Album display error:', e); }

  // 获取并显示专辑信息
  fetchAndDisplayAlbumInfo(track);

  updateDynamicGradient(track);

  // Reset progress
  $('#progressFill').style.width = '0%';
  $('#progressThumb').style.left = '0%';
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
}

function updateQueueHighlight() {
  $$('.track-row.playing').forEach(r => r.classList.remove('playing'));
  if (state.currentTrack) {
    $$(`.track-row[data-track-id="${state.currentTrack.id}"]`).forEach(r => r.classList.add('playing'));
  }
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

// HTML5 audio events
audio.addEventListener('play', () => {
  state.isPlaying = true;
  updatePlayBtn();
  // AudioContext 已在 togglePlay 用户手势中初始化，这里只管全屏可视化
  if (ampIsShowing) updateAmpPlayBtn();
});

audio.addEventListener('pause', () => { state.isPlaying = false; updatePlayBtn(); if (ampIsShowing) updateAmpPlayBtn(); });
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
    $('#progressFill').style.width = pct + '%';
    $('#progressThumb').style.left = pct + '%';
  }
  $('#currentTime').textContent = formatTime(audio.currentTime);

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
  const fill = $('#progressFill');
  const thumb = $('#progressThumb');
  let dragging = false;

  function getClientX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function applySeek(clientX) {
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // 拖拽期间实时更新 UI，不立刻跳转（减少音频跳动）
    fill.style.width = (pct * 100) + '%';
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
    fill.style.width = (pct * 100) + '%';
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
  $('#volumeFill').style.width = (state.volume * 100) + '%';
  $('#volumeThumb').style.left = (state.volume * 100) + '%';
  const icon = $('#volumeBtn').querySelector('i');
  if (state.volume === 0) { icon.className = 'fa-solid fa-volume-xmark'; state.isMuted = true; }
  else if (state.volume < 0.5) { icon.className = 'fa-solid fa-volume-low'; state.isMuted = false; }
  else { icon.className = 'fa-solid fa-volume-high'; state.isMuted = false; }
}

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
  const q = getQueue();
  if (!q.length) return;
  const idx = state.isShuffled
    ? state.shuffledQueue.findIndex(t => t.id === state.currentTrack?.id) + 1
    : state.queueIndex + 1;
  if (idx >= q.length) {
    if (state.repeatMode === 1) {
      if (state.isShuffled) state.shuffledQueue = [...state.queue].sort(() => Math.random() - 0.5);
      playTrack(state.isShuffled ? state.shuffledQueue[0] : state.queue[0], 0);
    } else {
      state.isPlaying = false; updatePlayBtn();
    }
    return;
  }
  const track = q[idx];
  state.queueIndex = state.isShuffled ? state.queue.indexOf(track) : idx;
  playTrack(track);
}

function playPrev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  const q = getQueue();
  if (!q.length) return;
  const idx = state.isShuffled
    ? state.shuffledQueue.findIndex(t => t.id === state.currentTrack?.id) - 1
    : state.queueIndex - 1;
  if (idx < 0) { audio.currentTime = 0; return; }
  const track = q[idx];
  state.queueIndex = state.isShuffled ? state.queue.indexOf(track) : idx;
  playTrack(track);
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
}

// ========== Discover Page ==========
let hotCache;

async function loadDiscover() {
  if (state._discoverLoaded) return;
  state._discoverLoaded = true;

  // Genre cards
  const genres = [
    { id: 'pop', name: '流行乐', color: 'linear-gradient(135deg, #ff2d95, #ff6bb5)' },
    { id: 'rock', name: '摇滚', color: 'linear-gradient(135deg, #b44dff, #7c4dff)' },
    { id: 'electronic', name: '电子', color: 'linear-gradient(135deg, #00e5ff, #18ffff)' },
    { id: 'hiphop', name: '嘻哈', color: 'linear-gradient(135deg, #ff1744, #ff5252)' },
    { id: 'jazz', name: '爵士', color: 'linear-gradient(135deg, #ff6d00, #ff9100)' },
    { id: 'classical', name: '古典', color: 'linear-gradient(135deg, #00e676, #69f0ae)' },
    { id: 'kpop', name: 'K-Pop', color: 'linear-gradient(135deg, #ff4081, #ff80ab)' },
    { id: 'chinese', name: '华语', color: 'linear-gradient(135deg, #e040fb, #ea80fc)' },
    { id: 'rnb', name: 'R&B', color: 'linear-gradient(135deg, #448aff, #82b1ff)' },
    { id: 'latin', name: '拉丁', color: 'linear-gradient(135deg, #ffab00, #ffd740)' },
    { id: 'anime', name: '动漫', color: 'linear-gradient(135deg, #b388ff, #7c4dff)' },
    { id: 'country', name: '乡村', color: 'linear-gradient(135deg, #ffd740, #ffe57f)' },
  ];

  const genreCardsEl = $('#genreCards');
  if (!genreCardsEl._genreBound) {
    genreCardsEl._genreBound = true;
    genreCardsEl.addEventListener('click', (e) => {
      const card = e.target.closest('.genre-card');
      if (!card) return;
      loadGenreDetail(card.dataset.genre);
    });
  }
  genreCardsEl.innerHTML = genres.map(g => `
    <div class="genre-card" data-genre="${g.id}" style="background: ${g.color};">
      <span class="genre-name">${g.name}</span>
    </div>
  `).join('');

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
    $('#recentTracks').innerHTML = '<div style="padding:20px 0;text-align:center;color:var(--text-secondary);font-size:13px">暂无播放记录</div>';
  }

  loadDiscoverData();
  // 加载新专辑推荐
}

async function loadDiscoverData() {
  // 渲染骨架屏占位
  $('#heroTitle').textContent = '加载中...';
  $('#heroArtist').textContent = '正在连接服务器...';
  $('#heroAlbum').textContent = '';
  // 热门骨架屏
  var skeletonHTML = '';
  for (var i = 0; i < 6; i++) {
    skeletonHTML += '<div class="am-card"><div class="am-artwork" style="background:var(--bg-tertiary);animation:pulse 1.5s ease-in-out infinite"></div><div class="am-card-title" style="background:var(--bg-tertiary);height:14px;width:70%;margin:8px 12px 4px;border-radius:4px;animation:pulse 1.5s ease-in-out infinite"></div><div class="am-card-subtitle" style="background:var(--bg-tertiary);height:12px;width:50%;margin:0 12px;border-radius:4px;animation:pulse 1.5s ease-in-out infinite"></div></div>';
  }
  $('#hotTracks').innerHTML = skeletonHTML;

  // Render 免费服务冷启动需要约 30 秒，提前 8 秒后提示用户等待
  var wakeTimer = setTimeout(function() {
    var h = $('#heroArtist');
    if (h && h.textContent === '正在连接服务器...') {
      h.textContent = '服务唤醒中，请稍候（约 30 秒）...';
    }
  }, 8000);

  // 只拉 6 首热门（减少网络传输量），hero 独立拉 1 首
  try {
    var hotTracks = await fetchNeteaseHot(6);
    clearTimeout(wakeTimer);
    if (!hotCache) {
      hotCache = (hotTracks && hotTracks.length) ? hotTracks : [];
      if (hotCache.length) addToQueue(hotCache);
    }
    renderScrollRow('#hotTracks', hotCache);
  } catch (e) {
    clearTimeout(wakeTimer);
    console.warn('[Discover] Hot failed:', e);
    $('#hotTracks').innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-secondary)">热门加载失败，请刷新重试</div>';
  }

  // Hero：只拉 1 首
  try {
    var heroRes = await universalSearch('热门歌曲', 1, 'netease');
    if (heroRes && heroRes.length) {
      var h = heroRes[0];
      state.heroTrack = h;
      $('#heroTitle').textContent = h.title;
      $('#heroArtist').innerHTML = formatArtists(h.artist);
      $('#heroAlbum').textContent = h.album || '';
      var heroCoverUrl = h.coverSmall || h.cover || '';
      if (heroCoverUrl) $('#heroCover').src = heroCoverUrl;
      updateDynamicGradient(h);
      addToQueue(heroRes);
    } else {
      $('#heroTitle').textContent = '暂无推荐';
      $('#heroArtist').textContent = '试试搜索你想听的歌曲';
    }
  } catch (e) {
    console.warn('[Discover] Hero failed:', e);
    $('#heroTitle').textContent = '暂无推荐';
    $('#heroArtist').textContent = '试试搜索你想听的歌曲';
  }
}

// Genre detail
let genreDetailCache = {};
async function loadGenreDetail(genreId) {
  const genreSection = $('#genreSection');
  if (!genreSection) return;
  genreSection.style.display = 'block';
  const genreNames = { pop: '流行乐', rock: '摇滚', electronic: '电子', hiphop: '嘻哈', jazz: '爵士', classical: '古典', rnb: 'R&B', country: '乡村', kpop: 'K-Pop', chinese: '华语', latin: '拉丁', anime: '动漫' };
  $('#genreTitle').textContent = genreNames[genreId] || genreId;
  setTimeout(() => genreSection.scrollIntoView({ behavior: 'smooth' }), 100);

  if (genreDetailCache[genreId]) { renderScrollRow('#genreTracks', genreDetailCache[genreId]); return; }

  $('#genreTracks').innerHTML = '<div style="padding:20px;text-align:center">加载中...</div>';
  try {
    const queryMap = { pop: '热门流行', rock: '经典摇滚', electronic: '电子舞曲', hiphop: '嘻哈说唱', jazz: '爵士经典', classical: '古典音乐', rnb: 'R&B节奏蓝调', country: '乡村音乐', kpop: 'K-pop韩国流行', chinese: '华语热门', latin: '拉丁音乐', anime: '动漫主题曲' };
    const tracks = await universalSearch(queryMap[genreId] || genreId, 80, 'netease');
    genreDetailCache[genreId] = tracks;
    addToQueue(tracks);
    renderScrollRow('#genreTracks', tracks);
  } catch (e) { $('#genreTracks').innerHTML = '<div style="padding:20px;text-align:center">加载失败</div>'; }
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
  if (state.heroTrack) {
    const idx = state.queue.indexOf(state.heroTrack);
    if (idx >= 0) { state.queueIndex = idx; playTrack(state.heroTrack, idx); }
  }
}

// ========== Search Page ==========
const searchSuggestions = ['周杰伦', 'Taylor Swift', '林俊杰', '邓紫棋', '告五人', '陈奕迅', '五月天', 'BTS', 'Ed Sheeran', 'Bruno Mars', 'Adele', '蔡依林'];

$('#suggestionChips').innerHTML = searchSuggestions.map(s => `<button class="suggestion-chip">${s}</button>`).join('');
$('#suggestionChips').addEventListener('click', (e) => {
  const chip = e.target.closest('.suggestion-chip');
  if (chip) { $('#searchInput').value = chip.textContent; performSearch(chip.textContent); }
});

let searchTimeout;
let autoAbortCtrl = null;
let autoIndex = -1;

$('#searchInput').addEventListener('input', () => {
  const q = $('#searchInput').value.trim();
  $('#searchBtn').style.display = q ? 'flex' : 'none';
  clearTimeout(searchTimeout);
  autoIndex = -1;
  if (!q) {
    hideAutocomplete();
    $('#searchSuggestions').style.display = '';
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

$('#searchBtn').addEventListener('click', () => {
  const query = $('#searchInput').value.trim();
  if (query) { hideAutocomplete(); performSearch(query); }
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

async function performSearch(query) {
  if (!query) return;
  hideAutocomplete();
  $('#searchSuggestions').style.display = 'none';
  $('#searchResultsSection').style.display = 'block';
  $('#searchResults').innerHTML = '<div class="loading">搜索中...</div>';

  try {
    const tracks = await universalSearch(query, 80);
    if (!tracks.length) { $('#searchResults').innerHTML = '<p class="empty-state">没有找到相关歌曲</p>'; return; }
    $('#searchResultTitle').textContent = `"${query}" 的搜索结果`;
    $('#searchSourceLabel').textContent = `音源：${SOURCE_LABELS[state.currentSource]}`;
    addToQueue(tracks);
    renderTrackList('#searchResults', tracks);
  } catch (e) { $('#searchResults').innerHTML = '<p class="empty-state">搜索失败，请稍后重试</p>'; }
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
  container.innerHTML = tracks.map((t, i) => `
    <div class="track-row" data-track-id="${t.id}" data-idx="${i}">
      <img class="row-cover" src="${t.coverSmall || t.cover || ''}" data-artist="${esc(t.artist || '')}" data-album="${esc(t.album || '')}" data-name="${esc(t.title || '')}" onerror="fallbackCover(this)" loading="lazy">
      <div class="row-info">
        <div class="row-title">${esc(t.title)}</div>
        <div class="row-artist">${esc(t.artist)}${t.album ? ' — ' + esc(t.album) : ''}</div>
      </div>
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
  updateQueueHighlight();
}

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
    return '<div class="fav-track-row" data-id="' + track.id + '" style="display:flex;align-items:center;padding:10px 20px;cursor:pointer;border-radius:8px;margin:0 12px;transition:background 0.15s">' +
      '<div style="width:40px;text-align:center;font-size:14px;color:var(--text-tertiary);flex-shrink:0">' + (i + 1) + '</div>' +
      (coverSrc ? '<div style="width:40px;height:40px;border-radius:4px;overflow:hidden;margin-right:12px;flex-shrink:0"><img src="' + coverSrc + '" alt="" style="width:100%;height:100%;object-fit:cover" loading="lazy" data-artist="' + esc(track.artist || '') + '" data-album="' + esc(track.album || '') + '" data-name="' + esc(track.title || '') + '" onerror="fallbackCover(this)"></div>' : '') +
      '<div style="flex:1;min-width:0">' +
        '<div style="font-size:15px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(track.title) + '</div>' +
        '<div style="font-size:13px;color:var(--text-secondary)">' + esc(track.artist) + '</div>' +
      '</div>' +
      '<span style="font-size:14px;color:var(--text-tertiary);margin-right:12px">' + formatTime(duration) + '</span>' +
      '<button class="fav-remove-btn" data-id="' + track.id + '" style="background:none;border:none;color:var(--text-secondary);cursor:pointer;font-size:14px;padding:6px;border-radius:50%" title="取消收藏"><i class="fa-solid fa-heart" style="color:var(--neon-pink)"></i></button>' +
    '</div>';
  }).join('');
  html += '</div>';
  
  $('#favoritesList').innerHTML = html;
  
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

function renderEmptyFavorites() {
  $('#favoritesList').innerHTML = `
    <div class="empty-state">
      <i class="fa-regular fa-heart" style="font-size:48px;color:var(--text-tertiary);margin-bottom:16px;display:block"></i>
      <p style="font-size:18px;margin-bottom:8px">还没有收藏歌曲</p>
      <p style="font-size:13px;color:var(--text-secondary)">在歌曲播放页或专辑中点击 ♡ 来添加收藏</p>
    </div>`;
}

// ========== Playlists ==========
function renderPlaylists() {
  if (!state.playlists.length) { $('#playlistGrid').innerHTML = '<p class="empty-state">还没有歌单</p>'; return; }
  
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
        coverHTML = `<img src="${coverUrl}" alt="${esc(pl.name)}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.onerror=null;this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjgwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+QvjwvdGV4dD48L3N2Zz4='">`;
      }
    }
    
    return `
      <div class="playlist-card" data-idx="${i}">
        <div class="pl-cover">${coverHTML}</div>
        <div class="pl-name">${esc(pl.name)}</div>
        <div class="pl-count">${pl.tracks.length} 首歌曲</div>
        <button class="pl-delete" onclick="event.stopPropagation(); deletePlaylist(${i})"><i class="fa-solid fa-trash"></i></button>
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

function openPlaylist(idx) {
  const pl = state.playlists[idx];
  state.currentPlaylistId = pl.id;
  navigateTo('playlist-detail');
  $('#playlistDetailTitle').textContent = pl.name;
  
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
  
  if (!tracks.length) { $('#playlistTracks').innerHTML = '<p class="empty-state">歌单为空</p>'; }
  else renderTrackList('#playlistTracks', tracks);
}

$('#backToPlaylists').addEventListener('click', () => goBack());
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

// ========== 主题切换 ==========
$('#themeToggleBtn').addEventListener('click', toggleTheme);

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
  $('#searchResults').innerHTML = '<div class="loading">加载中...</div>';
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
    $('#searchResultTitle').textContent = `${SOURCE_LABELS[source]}推荐`;
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
  // 检查本地存储中是否有手动设置的主题
  const savedTheme = localStorage.getItem('melodybox_theme');
  
  if (savedTheme) {
    // 如果手动设置过主题，使用保存的主题
    setTheme(savedTheme);
  } else {
    // 否则根据时间自动切换
    autoSetThemeByTime();
  }
  
  // 更新主题切换按钮的图标
  updateThemeToggleButton();
  
  // 每分钟检查一次时间，自动切换主题
  setInterval(() => {
    if (!localStorage.getItem('melodybox_theme')) {
      autoSetThemeByTime();
    }
  }, 60000); // 60000ms = 1分钟
}

function autoSetThemeByTime() {
  const now = new Date();
  const hour = now.getHours();
  
  // 白天：6:00-18:00 使用浅色主题
  // 夜晚：18:00-6:00 使用深色主题
  if (hour >= 6 && hour < 18) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

function setTheme(theme) {
  if (theme === 'light') {
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.removeAttribute('data-theme');
  }
  
  // 保存当前主题到本地存储（仅当手动切换时调用）
  // 自动切换时不保存，以便下次打开时仍能根据时间自动切换
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // 手动切换时，保存到本地存储
  localStorage.setItem('melodybox_theme', newTheme);
  
  setTheme(newTheme);
  updateThemeToggleButton();
  
  // 显示提示
  const themeNames = { light: '浅色主题 (白天模式)', dark: '深色主题 (夜晚模式)' };
  showToast(`已切换到${themeNames[newTheme]}`);
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
  player.style.setProperty('--amp-accent-dark', `rgb(${tRgb})`);
  
  // 动态调整叠加层透明度：暗色封面不需要过深遮罩
  const overlay = player.querySelector('.amp-overlay');
  if (overlay) {
    if (isLightAlbum) {
      overlay.style.background = `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(${tRgb}, 0.3) 40%, rgba(${tRgb}, 0.6) 100%)`;
    } else {
      overlay.style.background = `linear-gradient(180deg, rgba(${tRgb}, 0.1) 0%, rgba(${tRgb}, 0.35) 40%, rgba(${tRgb}, 0.65) 100%)`;
    }
  }
  
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

function openAmpFullscreenPlayer() {
  const player = $('#ampFullscreenPlayer');
  if (!player) return;
  
  // 每次打开时重置为封面视图
  const artworkWrapper = $('#ampArtworkWrapper');
  const lyricsView = $('#ampLyricsView');
  const lyricsBtn = $('#ampLyricsBtn');
  if (artworkWrapper && lyricsView) {
    artworkWrapper.classList.remove('hidden');
    lyricsView.classList.add('hidden');
    ampLyricsShowing = false;
    if (lyricsBtn) lyricsBtn.classList.remove('active');
  }
  
  updateAmpFullscreenPlayer();
  updateAmpProgress();
  
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
  const track = state.queueIndex >= 0 ? state.queue[state.queueIndex] : (state.currentTrack || state.queue[0]);
  if (!track) return;
  
  // 封面 URL（全屏用大图 track.cover，小图用 coverSmall）
  const ampCoverUrl = track.cover || track.coverSmall || '';
  const primaryArtist = (track.artist || '').split(',')[0].trim();
  const artistPhotoUrl = primaryArtist ? '/api/artist-photo?name=' + encodeURIComponent(primaryArtist) : '';
  // 无直接封面时，优先尝试专辑封面搜索，再退到歌手照片
  const albumCoverUrl = (primaryArtist && track.album) ? '/api/album-cover?artist=' + encodeURIComponent(primaryArtist) + '&album=' + encodeURIComponent(track.album) : '';
  const fallbackBg = ampCoverUrl || albumCoverUrl || artistPhotoUrl || '';

  // 更新背景
  const bgBlur = $('#ampBgBlur');
  if (bgBlur && fallbackBg) {
    bgBlur.style.backgroundImage = `url(${fallbackBg})`;
    // 提取专辑封面主色调并应用到 UI
    extractAlbumColors(fallbackBg, (colors) => {
      applyAlbumColors(colors);
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
  const progressFill = $('#ampProgressFill');
  const progressThumb = $('#ampProgressThumb');
  
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
    const track = state.queueIndex >= 0 ? state.queue[state.queueIndex] : (state.currentTrack || state.queue[0]);
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
  const track = state.queueIndex >= 0 ? state.queue[state.queueIndex] : (state.currentTrack || state.queue[0]);
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
    stage.querySelector('.amp-lyrics-empty').textContent = '加载中...';
  } else {
    stage.innerHTML = '<p class="amp-lyrics-empty">加载中...</p>';
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
    linesHtml +
    `<div class="amp-lyrics-spacer amp-lyrics-spacer-bottom" style="height:${halfH}px"></div>`;
  
  // 首次渲染 → 重置状态，等布局完成后瞬间定位
  ampLyricsFirstScroll = true;
  ampLyricsLastActiveIdx = -1;
  const track = state.queueIndex >= 0 ? state.queue[state.queueIndex] : (state.currentTrack || state.queue[0]);
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

  // 计算当前行进度
  if (activeIdx >= 0 && activeIdx < state.lyrics.lines.length) {
    var lineStart = state.lyrics.lines[activeIdx].time;
    var lineEnd = (activeIdx + 1 < state.lyrics.lines.length) ? state.lyrics.lines[activeIdx + 1].time : (audio.duration || lineStart + 5);
    var progress = lineEnd > lineStart ? ((currentTime - lineStart) / (lineEnd - lineStart)) * 100 : 0;
    progress = Math.max(0, Math.min(100, progress));
    if (lines[activeIdx]) {
      lines[activeIdx].style.setProperty('--lyric-progress', progress);
    }
  }

  // 同一个行 → 只更新进度，不做其他操作
  if (activeIdx === ampLyricsLastActiveIdx) {
    if (ampLyricsFirstScroll && activeIdx >= 0) {
      ampLyricsFirstScroll = false;
      if (lines[activeIdx]) lines[activeIdx].scrollIntoView({ block: 'center' });
    }
    return;
  }
  ampLyricsLastActiveIdx = activeIdx;
  ampLyricsFirstScroll = false;

  // 更新 CSS 类 → active > near > far-2 > 隐藏
  lines.forEach((line, i) => {
    line.classList.remove('active', 'near', 'far-2');
    const dist = Math.abs(i - activeIdx);
    if (dist === 0) line.classList.add('active');
    else if (dist === 1) line.classList.add('near');
    else if (dist === 2) line.classList.add('far-2');
  });

  // 滚动到当前行（居中）
  if (activeIdx >= 0 && lines[activeIdx]) {
    lines[activeIdx].scrollIntoView({ block: 'center' });
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
  
  // 点击内容区（封面/歌词）切换 — 统一 handler，避免多 handler 竞态
  const ampContent = $('#ampContent');
  if (ampContent) {
    ampContent.addEventListener('click', (e) => {
      // 不在控制区触发：header、按钮、进度条等
      if (e.target.closest('.amp-info-section') || 
          e.target.closest('.amp-header') ||
          e.target.closest('#ampLyricsBtn')) return;
      toggleAmpLyricsView();
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
    const ampFill = $('#ampProgressFill');
    const ampThumb = $('#ampProgressThumb');
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
  if (!tracks.length) {
    container.innerHTML = '<p class="empty-state">还没有上传本地音乐，点击上方区域或拖拽文件添加</p>';
    return;
  }
  const html = tracks.map((t, i) => '<div class="track-item" data-local-id="' + esc(t.id) + '">' +
    '<div class="track-num">' + (i + 1) + '</div>' +
    '<div class="track-info">' +
      '<div class="track-title">' + esc(t.title) + '</div>' +
      '<div class="track-artist">' + esc(t.artist) + '</div>' +
    '</div>' +
    '<div class="track-duration">' + formatTime(t.duration || 0) + '</div>' +
    '<button class="track-delete" data-local-id="' + esc(t.id) + '" title="删除"><i class="fa-solid fa-xmark"></i></button>' +
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

async function openAlbumDetail(albumId) {
  console.log('[Album] openAlbumDetail called', { albumId });
  
  // 存储当前专辑 ID
  window.currentAlbumId = albumId;
  window.currentAlbumData = null;
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  
  document.getElementById('albumTrackList').innerHTML = '<div class="scroll-loading">加载中...</div>';

  // 从 localStorage 恢复专辑数据
  const saved = localStorage.getItem('melodybox_album_' + albumId);
  if (!saved) {
    document.getElementById('albumDetailCover').src = '';
    document.getElementById('albumDetailTitle').textContent = '未知专辑';
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
  const cover = album.cover || album.picUrl || '';
  const picId = album.picId || ''; // 从保存的专辑数据中提取 picId
  const source = album.source || 'netease';
  
  // 如果有 picId，尝试从网易云API获取准确的专辑信息
  if (picId) {
    // 用 picId 作为 albumId 调用新的API
    // 注意：这里需要先把 picId 转换为网易云的 albumId
    // 但我们现在没有这个映射，所以还是用旧的方法
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
    '<div class="album-tracks-header-right">' +
      '<button class="album-play-all-btn" onclick="playAlbumAll()">' +
        '<i class="fa-solid fa-play"></i> 播放全部' +
      '</button>' +
    '</div>' +
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
        '<button class="album-track-more" onclick="event.stopPropagation(); showTrackOptions(' + i + ')">' +
          '<i class="fa-solid fa-ellipsis"></i>' +
        '</button>' +
      '</div>' +
    '</div>';
  }).join('');
  
  html += '</div>';
  container.innerHTML = html;
  
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
}

// 通过 picId 获取专辑信息（最准确）
async function openAlbumByPicId(picId, songId, albumName, artistName, source) {
  console.log('[Album] openAlbumByPicId', { picId, songId, albumName, artistName, source });
  
  // 导航到专辑详情页
  navigateTo('album-detail');
  
  const container = document.getElementById('albumTrackList');
  container.innerHTML = '<div class="scroll-loading">加载中...</div>';
  document.getElementById('albumDetailCover').src = '';
  document.getElementById('albumDetailTitle').textContent = albumName || '专辑';
  document.getElementById('albumDetailArtist').textContent = artistName || '';
  document.getElementById('albumDetailMeta').textContent = '正在获取专辑信息...';
  
  try {
    // 构建API URL：优先使用 picId，没有的话用 songId
    let apiUrl = '/api/music/album?source=' + (source || 'netease') + '&limit=50';
    if (picId) {
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
    
    // 设置专辑封面（使用第一首歌的封面）
    const albumCoverEl = document.getElementById('albumDetailCover');
    if (tracks[0] && tracks[0].coverSmall) {
      albumCoverEl.src = tracks[0].coverSmall;
    } else if (tracks[0] && tracks[0].picId) {
      albumCoverEl.src = '/api/music/cover?picId=' +
        encodeURIComponent(tracks[0].picId) + '&source=' + (source || 'netease') + '&size=500';
    }
    albumCoverEl.dataset.artist = artistName || (tracks[0] && tracks[0].artist) || '';
    albumCoverEl.onerror = function() { fallbackCover(this); };
    
    // 更新专辑标题（使用API返回的准确专辑名）
    const accurateAlbumName = tracks[0].album || albumName;
    document.getElementById('albumDetailTitle').textContent = accurateAlbumName;
    document.getElementById('albumDetailArtist').textContent = artistName || tracks[0].artist || '';
    document.getElementById('albumDetailMeta').textContent = (source || 'netease') + ' · ' + tracks.length + ' 首';
    
    // 设置专辑收藏按钮
    window.currentAlbumId = accurateAlbumName;
    window.currentAlbumData = {
      id: accurateAlbumName,
      name: accurateAlbumName,
      artist: { name: artistName || tracks[0].artist || '' },
      cover: tracks[0] ? tracks[0].coverSmall || tracks[0].cover || '' : '',
      picId: tracks[0] ? tracks[0].picId || '' : '',
      source: source || 'netease',
      trackCount: tracks.length,
      tracks: tracks.map(function(t) { return { id: t.id, title: t.title, artist: t.artist }; }),
    };
    updateAlbumFavButton(accurateAlbumName);
    
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
  container.innerHTML = '<div class="scroll-loading">加载中...</div>';
  document.getElementById('albumDetailCover').src = '';
  document.getElementById('albumDetailTitle').textContent = albumName || '专辑';
  document.getElementById('albumDetailArtist').textContent = artistName || '';
  document.getElementById('albumDetailMeta').textContent = source || 'netease';
  
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

    // 设置专辑封面（使用第一首歌的封面）
    const albumCoverEl = document.getElementById('albumDetailCover');
    if (tracks[0] && tracks[0].coverSmall) {
      albumCoverEl.src = tracks[0].coverSmall;
    } else if (tracks[0] && tracks[0].picId) {
      albumCoverEl.src = '/api/music/cover?picId=' +
        encodeURIComponent(tracks[0].picId) + '&source=' + (source || 'netease') + '&size=500';
    }
    albumCoverEl.dataset.artist = artistName || (tracks[0] && tracks[0].artist) || '';
    albumCoverEl.onerror = function() { fallbackCover(this); };

    document.getElementById('albumDetailTitle').textContent = albumName;
    document.getElementById('albumDetailArtist').textContent = artistName || tracks[0].artist || '';
    document.getElementById('albumDetailMeta').textContent = (source || 'netease') + ' · ' + tracks.length + ' 首';

    // 设置专辑收藏按钮
    window.currentAlbumId = albumName;
    window.currentAlbumData = {
      id: albumName,
      name: albumName,
      artist: { name: artistName || tracks[0].artist || '' },
      cover: tracks[0] ? tracks[0].coverSmall || tracks[0].cover || '' : '',
      picId: tracks[0] ? tracks[0].picId || '' : '',
      source: source || 'netease',
      trackCount: tracks.length,
      tracks: tracks.map(function(t) { return { id: t.id, title: t.title, artist: t.artist }; }),
    };
    updateAlbumFavButton(albumName);

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
var currentArtistName = '';
var currentArtistOffset = 0;
var currentArtistHasMore = true;
async function openArtistPage(artistName) {
  if (!artistName) return;
  currentArtistName = artistName;
  currentArtistOffset = 0;
  currentArtistHasMore = true;
  navigateTo('artist-detail');
  document.getElementById('artistDetailName').textContent = artistName;
  document.getElementById('artistDetailMeta').textContent = '加载中...';
  document.getElementById('artistTrackList').innerHTML = '<div class="scroll-loading">加载中...</div>';
  document.getElementById('artistBio').innerHTML = '<p style="color:var(--text-tertiary);font-size:13px">加载中...</p>';
  var ai = document.getElementById('artistAvatar'), af = document.getElementById('artistAvatarFallback');
  if (ai) ai.style.display = 'none';
  if (af) af.style.display = 'flex';
  var bg = document.getElementById('artistBg');
  if (bg) bg.style.backgroundImage = '';
  try {
    var data = await Promise.all([
      fetch('/api/music/search?keywords='+encodeURIComponent(artistName)+'&source=netease&limit=100').then(r=>r.json()).then(d=>d.songs||[]).catch(()=>[]),
      fetch('/api/music/artist?name='+encodeURIComponent(artistName)+'&source=netease&limit=100').then(r=>r.json()).then(d=>d.songs||[]).catch(()=>[])
    ]);
    var fs = data[0], as = data[1], seen = new Set(), tracks = [];
    fs.forEach(function(s){if(!seen.has(s.id)){seen.add(s.id);s.source='netease';s.picId=s.picId||'';tracks.push(normalizeTrack(s));}});
    as.forEach(function(s){if(!seen.has(s.id)){seen.add(s.id);s.source='netease';s.picId=s.picId||'';tracks.push(normalizeTrack(s));}});
    currentArtistTracks = tracks;
    currentArtistOffset = tracks.length;
    currentArtistHasMore = as.length >= 50;
    document.getElementById('artistDetailMeta').textContent = tracks.length + ' 首歌曲';
    // 后台加载头像和简介（不阻塞歌曲列表）
    loadArtistPhoto(artistName, tracks);
    loadArtistBio(artistName, tracks);
    if (!tracks.length) { document.getElementById('artistTrackList').innerHTML = '<p class="empty-state">暂无歌曲</p>'; return; }
    addToQueue(tracks);
    renderTrackList('#artistTrackList', tracks);
    // 添加"加载更多"按钮
    if (currentArtistHasMore) {
      addLoadMoreButton();
    }
  } catch(e) { console.error('[Artist] Error:',e.message); document.getElementById('artistTrackList').innerHTML = '<p class="empty-state">加载失败</p>'; }
}

// 添加"加载更多"按钮
function addLoadMoreButton() {
  var container = document.getElementById('artistTrackList');
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
    btn.querySelector('button').textContent = '加载中...';
    btn.querySelector('button').disabled = true;
  }
  
  try {
    var data = await fetch('/api/music/artist?name='+encodeURIComponent(currentArtistName)+'&source=netease&limit=100&offset='+currentArtistOffset).then(r=>r.json()).catch(()=>[]);
    var newSongs = data.songs || [];
    
    if (!newSongs.length) {
      currentArtistHasMore = false;
      if (btn) btn.remove();
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
      currentArtistHasMore = false;
      if (btn) btn.remove();
      return;
    }
    
    // 添加到现有列表
    currentArtistTracks = currentArtistTracks.concat(newTracks);
    currentArtistOffset += newSongs.length;
    currentArtistHasMore = data.hasMore !== false;
    
    // 更新歌曲数量显示
    document.getElementById('artistDetailMeta').textContent = currentArtistTracks.length + ' 首歌曲';
    
    // 重新渲染整个列表
    renderTrackList('#artistTrackList', currentArtistTracks);
    
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
        // 背景使用 background 字段（网易云艺人封面大图），回退到 avatar
        var bgUrl = info.background || info.avatar;
        if (bgUrl && bg) {
          bg.style.backgroundImage = 'url(' + bgUrl + ')';
        }
        return;
      }
    }
  } catch(e) {}
  // 降级：用第一首歌封面
  if (tracks.length && ai) {
    var cover = tracks[0].coverSmall || tracks[0].cover || '';
    if (cover) {
      ai.src = cover; ai.style.display = 'block';
      ai.onload = function(){if(af)af.style.display='none';if(bg)bg.style.backgroundImage='url('+cover+')';};
      ai.onerror = function(){ai.style.display='none';if(af)af.style.display='flex';};
    }
  }
}

async function loadArtistBio(artistName, tracks) {
  try {
    // 优先从网易云艺人详情获取简介
    var neteaseBio = null;
    try {
      var infoRes = await fetch('/api/music/artist-info?name=' + encodeURIComponent(artistName));
      if (infoRes.ok) {
        var info = await infoRes.json();
        if (info.desc) neteaseBio = info.desc;
      }
    } catch(e) {}
    
    if (neteaseBio && neteaseBio.length >= 10) {
      document.getElementById('artistBio').innerHTML = '<p>' + esc(neteaseBio) + '</p>';
      return;
    }
    
    // 回退：Wikipedia
    var ac = new AbortController(), t = setTimeout(function(){ac.abort();}, 5000), bio = null;
    try {
      var r = await fetch('https://zh.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&titles='+encodeURIComponent(artistName),{signal:ac.signal}); clearTimeout(t);
      if (r.ok) { var d = await r.json(), pages = d.query && d.query.pages; if (pages) { var p = Object.values(pages)[0]; if (p && !p.missing && p.extract) bio = p.extract.replace(/<[^>]*>/g,'').trim(); } }
    } catch(e) { clearTimeout(t); }
    if (bio && bio.length >= 20) { document.getElementById('artistBio').innerHTML = '<p>' + esc(bio) + '</p>'; }
    else { var tt = tracks.slice(0,5).map(function(t){return t.title;}).join('、'); document.getElementById('artistBio').innerHTML = '<p>' + esc(artistName) + '，代表作品包括《' + tt + '》等。</p>'; }
  } catch(e) { document.getElementById('artistBio').innerHTML = '<p style="color:var(--text-tertiary)">暂无简介</p>'; }
}

// 显示歌曲选项菜单
function showTrackOptions(trackIndex) {
  var track = currentAlbumTracks[trackIndex];
  if (!track) return;
  
  // 创建选项菜单
  var menu = document.createElement('div');
  menu.className = 'track-options-menu';
  menu.innerHTML = `
    <div class="track-options-item" onclick="addToQueue(${trackIndex}); this.parentElement.remove();">
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
  
  // 移除已存在的菜单
  var existingMenu = document.querySelector('.track-options-menu');
  if (existingMenu) existingMenu.remove();
  
  // 添加到页面
  document.body.appendChild(menu);
  
  // 定位菜单
  var btn = event.target.closest('.album-track-more');
  if (btn) {
    var rect = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = rect.bottom + 8 + 'px';
    menu.style.right = '20px';
  }
  
  // 点击其他地方关闭菜单
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 10);
}

// 添加到队列
function addToQueue(trackIndex) {
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
  
  if (!albumIds.length) {
    container.innerHTML = '<p class="empty-state">还没有收藏专辑，去专辑详情页收藏吧</p>';
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
        '<div class="album-card-meta">' + (album.size || album.trackCount || '') + ' 首歌曲</div>' +
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
const CF_ITEM_W = 240;
const CF_ITEM_H = 240;
const CF_RANGE = 6;

function cfLoadAlbums() {
  cfAlbums = [];
  const albumIds = [...state.albumFavorites];
  for (const id of albumIds) {
    const data = localStorage.getItem('melodybox_album_' + id);
    if (data) {
      try { cfAlbums.push(JSON.parse(data)); } catch (e) {}
    }
  }
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
  
  if (!cfAlbums.length) {
    stage.innerHTML = '<p class="empty-state" style="position:static;width:100%;color:var(--text-secondary)">还没有收藏专辑</p>';
    return;
  }
  
  cfAlbums.forEach((album, i) => {
    // 封面 URL：先用大图快速加载，居中后再换更高清大图
    var cover = (album.picUrl || album.cover || '');
    // 初始加载用 640px（2x/3x Retina 屏幕下 240px 容器需要更高分辨率）
    var coverSmall = cover;
    if (cover && cover.indexOf('/api/music/cover') === -1 && cover.indexOf('?') === -1) {
      coverSmall = cover + '?param=640y640';
    }
    // 大图用于居中后替换（1280px，4x Retina 完全够用）
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
  cfOffset = index;
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
  
  // 居中专辑自动换大图
  if (cfItems[idx]) {
    const item = cfItems[idx];
    const coverLarge = item.dataset.coverLarge;
    if (coverLarge) {
      const frontImg = item.querySelector('.cf-front img');
      if (frontImg) frontImg.src = coverLarge;
      // 同步更新倒影大图
      const refItem = cfReflections[idx];
      if (refItem) {
        const refImg = refItem.querySelector('img');
        if (refImg) refImg.src = coverLarge;
      }
    }
  }
  
  if (idx >= 0 && idx < cfAlbums.length) {
    const album = cfAlbums[idx];
    info.innerHTML = '<h2>' + esc(album.name || '未知专辑') + '</h2>' +
      '<p>' + esc((album.artist || {}).name || album.artist || '未知歌手') + '</p>';
  }
  
  // 重置 hover 提示
  if (hint) hint.style.opacity = '0';
  if (cfHoverTimer) { clearTimeout(cfHoverTimer); cfHoverTimer = null; }
}

function cfRender() {
  if (!cfAlbums.length) return;
  
  // 物理更新
  if (!cfDragging) {
    cfOffset += cfVelocity;
    cfVelocity *= 0.91;
    
    if (Math.abs(cfVelocity) < 0.0008) {
      cfVelocity = 0;
      const nearest = Math.round(cfOffset);
      const diff = nearest - cfOffset;
      if (Math.abs(diff) > 0.0005) {
        cfOffset += diff * 0.18;
      } else {
        cfOffset = nearest;
      }
    }
  }
  cfOffset = Math.max(0, Math.min(cfAlbums.length - 1, cfOffset));
  
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
    const halfW = CF_ITEM_W / 2; // 120
    
    // 旋转曲线：中心=0°(正面)，边缘→渐近 75°(几乎完全侧面)
    const ry = -sign * 75 * (1 - Math.exp(-absDist * 1.9));

    // 水平位移：紧凑重叠
    const tx = sign * (absDist * 85);

    // 深度：越远越往后
    const tz = -absDist * 110;

    // 缩放：侧面时略小
    const s = Math.max(0.5, 1 - absDist * 0.075);

    // 透明度
    const op = Math.max(0.2, 1 - absDist * 0.18);

    // 模糊（减少）
    const blur = Math.min(absDist * 3, 8);

    // 亮度
    const bright = Math.max(0.4, 1 - absDist * 0.12);
    
    const t = 'translate3d(' + tx.toFixed(1) + 'px,0,' + tz.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
    item.style.transform = t;
    item.style.opacity = op.toFixed(3);
    item.style.zIndex = Math.round(1000 - absDist * 180);
    
    // 滤镜应用于封面图和脊
    const imgFilter = 'brightness(' + bright.toFixed(2) + ') blur(' + blur.toFixed(1) + 'px)';
    const frontImg = item.querySelector('.cf-front img');
    if (frontImg) frontImg.style.filter = imgFilter;
    
    // 脊的模糊随角度增大，正面完全隐藏
    const spineOpacity = Math.max(0, Math.min(1, (absDist - 0.08) / 0.45));
    const spineBlur = blur * Math.min(1, absDist * 0.8);
    const spines = item.querySelectorAll('.cf-spine');
    spines.forEach(s => {
      s.style.filter = 'brightness(' + (bright * 0.85).toFixed(2) + ') blur(' + spineBlur.toFixed(1) + 'px)';
      s.style.opacity = spineOpacity.toFixed(3);
    });
    
    // 高光的模糊
    const glare = item.querySelector('.cf-glare');
    if (glare) glare.style.filter = 'blur(' + (blur * 0.5).toFixed(1) + 'px)';
    
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
      ref.style.filter = 'brightness(' + (bright * 0.55).toFixed(2) + ') blur(' + (blur * 0.85).toFixed(1) + 'px)';
      ref.style.zIndex = Math.round(900 - absDist * 180);
    }
  }
  
  cfUpdateInfo();
}

function cfLoop() {
  cfRender();
  cfAnimId = requestAnimationFrame(cfLoop);
}

function cfStart() {
  cfLoadAlbums();
  cfBuildStage();
  cfActiveIndex = -1;
  cfAnimId = requestAnimationFrame(cfLoop);
  cfBindMouse();
}

function cfStop() {
  if (cfAnimId) { cancelAnimationFrame(cfAnimId); cfAnimId = null; }
  cfUnbindMouse();
  if (cfHoverTimer) { clearTimeout(cfHoverTimer); cfHoverTimer = null; }
}

function cfBindMouse() {
  cfUnbindMouse();
  const container = document.getElementById('coverFlowContainer');
  if (!container) return;
  
  let cfDragMoved = false;
  const onDown = (e) => {
    if (e.target.closest('.cf-nav-btn')) return;
    cfDragging = true;
    cfDragMoved = false;
    cfDragStartX = e.touches ? e.touches[0].clientX : e.clientX;
    cfDragStartOffset = cfOffset;
    cfLastX = cfDragStartX;
    cfLastTime = performance.now();
    cfVelocity = 0;
    container.style.cursor = 'grabbing';
    // 只有 touch 事件需要 preventDefault，mouse 事件不需要
    if (e.touches) e.preventDefault();
  };
  
  const onMove = (e) => {
    if (!cfDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = x - cfDragStartX;
    if (Math.abs(dx) > 5) cfDragMoved = true;
    cfOffset = cfDragStartOffset - dx / 65;
    
    const now = performance.now();
    const dt = now - cfLastTime;
    if (dt > 0) {
      cfVelocity = -(x - cfLastX) / 65 / (dt / 16.67);
    }
    cfLastX = x;
    cfLastTime = now;
    cfOffset = Math.max(-0.3, Math.min(cfAlbums.length - 0.7, cfOffset));
  };
  
  const onUp = (e) => {
    if (!cfDragging) return;
    cfDragging = false;
    container.style.cursor = '';
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
  
  const onHover = (e) => {
    const stage = document.getElementById('coverFlowStage');
    if (!stage || cfDragging) return;
    const rect = stage.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const x = e.clientX;
    const relX = (x - cx) / (rect.width / 2); // -1 到 1
    // 如果鼠标靠近中心，缓慢靠近最近专辑
    if (!cfDragging && Math.abs(cfVelocity) < 0.001) {
      const nearest = Math.round(cfOffset);
      if (Math.abs(cfOffset - nearest) < 0.1) {
        cfOffset = nearest;
      }
    }
  };
  
  container.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
  container.addEventListener('touchstart', onDown, { passive: false });
  container.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend', onUp);
  container.addEventListener('mousemove', onHover);
  
  cfCleanupHandlers = [
    { el: container, type: 'mousedown', fn: onDown },
    { el: document, type: 'mousemove', fn: onMove },
    { el: document, type: 'mouseup', fn: onUp },
    { el: container, type: 'touchstart', fn: onDown },
    { el: container, type: 'touchmove', fn: onMove },
    { el: document, type: 'touchend', fn: onUp },
    { el: container, type: 'mousemove', fn: onHover },
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
  
  cfStart();
  
  // 键盘导航
  const keyHandler = (e) => {
    if (state.currentPage !== 'album-favorites') return;
    if (document.getElementById('coverFlowContainer').style.display !== 'flex') return;
    if (e.key === 'ArrowLeft') { cfOffset = Math.max(0, cfOffset - 1); cfVelocity = 0; cfDragging = false; }
    if (e.key === 'ArrowRight') { cfOffset = Math.min(cfAlbums.length - 1, cfOffset + 1); cfVelocity = 0; cfDragging = false; }
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
