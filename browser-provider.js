'use strict';

// Use the site catalog for cover URLs. Direct requests, including Embeat,
// use the visitor's network.
function createBrowserMusicProvider({ fetchImpl = globalThis.fetch, apiBase = '' } = {}) {
  const embeat = GDMusicProtocol.createEmbeatClient({ fetchImpl });
  function sourceOf(source) {
    if (!['netease', 'embeat'].includes(source)) throw new TypeError('Invalid music source');
    return source;
  }
  function mediaUrl(raw) {
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' && !url.username && !url.password && !url.port &&
        !/^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[)/i.test(url.hostname) ? url.href : '';
    } catch { return ''; }
  }
  async function requestJson(url, init, { signal, timeout = 5000 } = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) throw signal.reason;
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimeout(abort, timeout);
    try {
      const response = await GDMusicProtocol.abortable(
        fetchImpl(url, { ...init, signal: controller.signal, cache: 'no-store' }), controller.signal);
      if (!response.ok) { response.body?.cancel().catch(() => {}); throw new Error('Music provider unavailable'); }
      return JSON.parse(await GDMusicProtocol.boundedText(response, controller.signal, 2097152));
    } finally {
      clearTimeout(timer); signal?.removeEventListener('abort', abort);
    }
  }
  function publicRequest(type, params, options) {
    const query = new URLSearchParams({ types: type, source: 'netease', ...params });
    return requestJson('https://music-api.gdstudio.xyz/api.php?' + query, {
      credentials: 'omit', redirect: 'error', headers: { Accept: 'application/json' },
    }, options);
  }
  function request(type, source, params, options) {
    sourceOf(source);
    return source === 'embeat' ? embeat.request(type, { source, ...params }, String(params.name || params.id), options)
      : publicRequest(type, params, options);
  }
  function format(song, source) {
    const id = String(song.id), picId = String(song.pic_id || '');
    const rawDuration = Number(song.extra_data?.duration || song.duration || song.dt || 0);
    return {
      id, providerId: id, source, name: song.name,
      artist: Array.isArray(song.artist) ? song.artist.join(', ') : song.artist,
      album: typeof song.album === 'string' ? song.album : '',
      urlId: String(song.url_id || id), lyricId: String(song.lyric_id || id), picId,
      duration: Number.isFinite(rawDuration) && rawDuration > 0 ? Math.round(rawDuration > 10000 ? rawDuration / 1000 : rawDuration) : 0,
      isrc: typeof song.extra_data?.isrc === 'string' ? song.extra_data.isrc : '',
      cover: picId ? '/api/music/cover?' + new URLSearchParams({ source, picId, size: '1000' }) : '/icon.svg',
      coverSmall: picId ? '/api/music/cover?' + new URLSearchParams({ source, picId, size: '300' }) : '/icon.svg',
    };
  }
  async function search(keywords, source, limit = 20, offset = 0, options = {}) {
    sourceOf(source);
    if (typeof keywords !== 'string' || !keywords.trim() || keywords.length > 512 ||
        !Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0 || offset > 100000) throw new TypeError('Invalid search');
    if (source === 'netease') {
      const query = new URLSearchParams({ keywords, source, limit: String(limit), offset: String(offset) });
      try {
        // The site catalog budgets 12 s. Leave time for a direct retry inside
        // the search session's 15 s deadline.
        return await requestJson(apiBase + '/api/music/search?' + query, {}, { timeout: 12500, ...options });
      } catch (error) {
        if (options.signal?.aborted) throw error;
      }
    }
    const data = await request('search', source, { name: keywords, count: limit, pages: Math.floor(offset / limit) + 1 }, options);
    if (!Array.isArray(data) || data.length > 100 || data.some(song => !song || song.source !== source ||
        !['string', 'number'].includes(typeof song.id) || !String(song.id).trim() ||
        (source === 'netease' && !/^[1-9]\d*$/.test(String(song.id))) ||
        (typeof song.id === 'number' && (!Number.isSafeInteger(song.id) || song.id <= 0)) ||
        typeof song.name !== 'string' || !song.name.trim() ||
        !(typeof song.artist === 'string' ? song.artist.trim() : Array.isArray(song.artist) && song.artist.length && song.artist.every(a => typeof a === 'string' && a.trim())))) throw new Error('Invalid music results');
    const songs = data.slice(offset % limit, offset % limit + limit).map(song => format(song, source));
    return { songs, total: null, hasMore: data.length >= limit && offset + songs.length <= 100000, nextOffset: offset + songs.length };
  }
  async function resource(track, kind, options = {}) {
    if (!['url', 'lyric', 'pic'].includes(kind)) throw new TypeError('Invalid resource type');
    const source = sourceOf(track.source || 'netease');
    const providerId = String(track.providerId || track.id || '');
    const id = String((kind === 'lyric' ? track.lyricId : kind === 'pic' ? track.picId : track.urlId) || providerId);
    if (!id || id.length > 16384) throw new TypeError('Invalid music resource');
    const params = { id };
    if (kind === 'url') params.br = 999;
    if (kind === 'pic') params.size = 1000;
    const data = await request(kind, source, params, options);
    if (kind === 'lyric') {
      if (typeof data?.lyric !== 'string') throw new Error('Lyrics unavailable');
      return { lrc: data.lyric.replace(/\\n/g, '\n'), tlyric: typeof data.tlyric === 'string' ? data.tlyric.replace(/\\n/g, '\n') : '' };
    }
    const url = mediaUrl(data?.url);
    if (!url) throw new Error('Music resource unavailable');
    return url;
  }
  return { search, resource };
}
