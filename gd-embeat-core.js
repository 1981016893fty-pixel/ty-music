(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GDMusicProtocol = factory();
})(globalThis, function () {
'use strict';

// GD音乐台 protocol, inspected 2026-11-16. crc32.min.js SHA-256:
// ed8dac33e9e79d70c5701bb9602cb66a0841c1fbfb0e46038579ba3dc6576da0
// Independent MD5 compressor: current protocol changes only standard T[49].
const encoder = new TextEncoder();
const SHIFTS = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
const TABLE = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32));
TABLE[49] = 0xB893382C;
function modifiedMD5(text) {
  const bytes = encoder.encode(text);
  const data = new Uint8Array(Math.ceil((bytes.length + 9) / 64) * 64);
  const view = new DataView(data.buffer);
  data.set(bytes); data[bytes.length] = 128;
  view.setBigUint64(data.length - 8, BigInt(bytes.length) * 8n, true);
  let state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  for (let offset = 0; offset < data.length; offset += 64) {
    let [a, b, c, d] = state;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const n = (a + f + TABLE[i] + view.getUint32(offset + g * 4, true)) >>> 0;
      const shift = SHIFTS[Math.floor(i / 16) * 4 + i % 4];
      [a, b, c, d] = [d, (b + ((n << shift) | (n >>> (32 - shift)))) >>> 0, b, c];
    }
    state = state.map((n, i) => (n + [a, b, c, d][i]) >>> 0);
  }
  const out = new Uint8Array(16); const result = new DataView(out.buffer);
  state.forEach((n, i) => result.setUint32(i * 4, n, true));
  return Array.from(out, byte => byte.toString(16).padStart(2, '0')).join('');
}
const HOST = 'music.gdstudio.xyz';
const SOURCES = new Set(['netease', 'joox', 'kuwo', 'tidal', 'qobuz', 'apple', 'bilibili', 'ytmusic', 'embeat', 'tencent', 'spotify', 'deezer']);
const TYPES = new Set(['search', 'url', 'pic', 'lyric', 'autosource']);
const PARAMS = new Set(['source', 'id', 'name', 'count', 'pages', 'br', 'size', 'extra_data']);
function fault(statusCode, code) {
  return Object.assign(new Error(code === 'GD_TIMEOUT' ? 'GD音乐台 request timed out' : 'GD音乐台 unavailable'), { statusCode, code });
}
// This race also bounds injected/custom transports that ignore AbortSignal.
async function abortable(promise, signal) {
  if (signal.aborted) throw fault(504, 'GD_TIMEOUT');
  let onAbort;
  const aborted = new Promise((resolve, reject) => { onAbort = () => reject(fault(504, 'GD_TIMEOUT')); signal.addEventListener('abort', onAbort, { once: true }); });
  try { return await Promise.race([promise, aborted]); }
  finally { signal.removeEventListener('abort', onAbort); }
}
async function boundedText(response, signal, maximum) {
  if (Number(response.headers.get('content-length')) > maximum) { response.body?.cancel().catch(() => {}); throw fault(502, 'GD_RESPONSE_TOO_LARGE'); }
  if (!response.body) return '';
  const reader = response.body.getReader(); const chunks = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await abortable(reader.read(), signal);
      if (done) break;
      size += value.byteLength;
      if (size > maximum) throw fault(502, 'GD_RESPONSE_TOO_LARGE');
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return new TextDecoder().decode(bytes);
  } finally { reader.cancel().catch(() => {}); }
}
function createEmbeatClient({ fetchImpl = globalThis.fetch, version = '2026.11.11', headers = { Accept: 'application/json' } } = {}) {
  if (typeof fetchImpl !== 'function' || !/^\d{4}\.\d{1,2}\.\d{1,2}$/.test(version)) throw new TypeError('Invalid GD configuration');
  const normalizedVersion = version.split('.').map(part => part.padStart(2, '0')).join('');
  let clock, pendingClock;
  async function getClock(signal, refresh = false) {
    if (signal.aborted) throw fault(504, 'GD_TIMEOUT');
    if (refresh) clock = null;
    if (clock && performance.now() - clock.sampledAt < 30000) return clock;
    if (!pendingClock) {
      pendingClock = (async () => {
        const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 4000);
        try {
          const response = await abortable(fetchImpl(`https://${HOST}/time`, { headers, signal: controller.signal, redirect: 'error', credentials: 'omit' }), controller.signal);
          if (!response.ok) {
            response.body?.cancel().catch(() => {});
            console.warn('[Embeat clock]', { kind: 'http', status: response.status, contentType: response.headers.get('content-type'), encoding: response.headers.get('content-encoding') });
            throw fault(response.status === 429 ? 429 : 502, response.status === 429 ? 'GD_RATE_LIMITED' : 'GD_CLOCK_ERROR');
          }
          const text = (await boundedText(response, controller.signal, 128)).trim();
          if (!/^\d{10}(?:\d{3})?$/.test(text)) {
            console.warn('[Embeat clock]', { kind: 'invalid-timestamp', status: response.status, contentType: response.headers.get('content-type'), encoding: response.headers.get('content-encoding'), bytes: encoder.encode(text).byteLength });
            throw fault(502, 'GD_CLOCK_ERROR');
          }
          clock = { serverMs: Number(text) * (text.length === 10 ? 1000 : 1), sampledAt: performance.now() };
          return clock;
        } finally { clearTimeout(timer); }
      })().finally(() => { pendingClock = null; });
    }
    return abortable(pendingClock, signal);
  }
  async function request(type, params, payload, { timeout = 12000, signal } = {}) {
    if (!TYPES.has(type) || !params || typeof params !== 'object' || Array.isArray(params) || typeof payload !== 'string' || encoder.encode(payload).byteLength > 16384) throw new TypeError('Invalid GD request');
    for (const [key, value] of Object.entries(params)) {
      if (!PARAMS.has(key) || !['string', 'number'].includes(typeof value) || String(value).length > 16384 || (typeof value === 'number' && !Number.isFinite(value))) throw new TypeError('Invalid GD parameter');
    }
    for (const [key, maximum] of [['count', 100], ['pages', 100001], ['br', 9999], ['size', 4000]]) {
      if (params[key] !== undefined && (!Number.isInteger(Number(params[key])) || Number(params[key]) < 1 || Number(params[key]) > maximum)) throw new TypeError('Invalid GD numeric parameter');
    }
    if (!SOURCES.has(params.source) || (type === 'search' || type === 'autosource' ? !params.name : !params.id)) throw new TypeError('Missing GD source or identifier');
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(() => controller.abort(), Math.max(1, Math.min(Number(timeout) || 12000, 12000)));
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const sample = await getClock(controller.signal, attempt === 1);
        const prefix = String(Math.floor(sample.serverMs + performance.now() - sample.sampledAt)).slice(0, 9);
        const signature = modifiedMD5(`${prefix}|${HOST}|${normalizedVersion}|${encodeURIComponent(payload)}`).slice(-8).toUpperCase();
        const query = new URLSearchParams({ types: type, ...params, s: signature });
        const response = await abortable(fetchImpl(`https://${HOST}/api.php?${query}`, { headers, signal: controller.signal, redirect: 'error', credentials: 'omit' }), controller.signal);
        if (response.status === 401 && attempt === 0) { response.body?.cancel().catch(() => {}); continue; }
        if (!response.ok) { response.body?.cancel().catch(() => {}); throw fault(response.status === 429 ? 429 : 502, response.status === 429 ? 'GD_RATE_LIMITED' : 'GD_UPSTREAM_ERROR'); }
        const text = await boundedText(response, controller.signal, 2 * 1024 * 1024);
        try { return JSON.parse(text); } catch { throw fault(502, 'GD_INVALID_RESPONSE'); }
      }
    } catch (error) {
      if (controller.signal.aborted || error.name === 'AbortError') throw fault(504, 'GD_TIMEOUT');
      if (error.statusCode) throw error;
      throw fault(502, 'GD_UPSTREAM_ERROR');
    } finally { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); }
  }
  async function search(keywords, limit = 20, offset = 0, options = {}) {
    if (typeof keywords !== 'string' || !keywords.trim() || keywords.length > 512) throw new TypeError('Invalid GD keywords');
    limit = Math.max(1, Math.min(100, Number.isFinite(Number(limit)) ? Math.trunc(Number(limit)) || 20 : 20));
    offset = Math.max(0, Number.isFinite(Number(offset)) ? Math.trunc(Number(offset)) : 0);
    if (offset > 100000) throw fault(400, 'GD_INVALID_OFFSET');
    const data = await request('search', { source: 'embeat', name: keywords, count: limit, pages: Math.floor(offset / limit) + 1 }, keywords, options);
    if (!Array.isArray(data) || data.length > 100 || data.some(song => !song || typeof song !== 'object' ||
      !['number', 'string'].includes(typeof song.id) || (typeof song.id === 'number' && (!Number.isFinite(song.id) || song.id <= 0)) || !String(song.id).trim() || typeof song.name !== 'string' || !song.name.trim() || song.source !== 'embeat' ||
      !(typeof song.artist === 'string' ? song.artist.trim() : Array.isArray(song.artist) && song.artist.length && song.artist.every(artist => typeof artist === 'string' && artist.trim())))) throw fault(502, 'GD_INVALID_RESPONSE');
    const songs = data.slice(offset % limit, offset % limit + limit);
    return { songs, total: null, hasMore: data.length >= limit && offset + songs.length <= 100000, nextOffset: offset + songs.length };
  }
  return { request, search };
}
return { createEmbeatClient, modifiedMD5, abortable, boundedText };
});
