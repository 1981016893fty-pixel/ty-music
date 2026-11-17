'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { gzip, createGzip } = require('node:zlib');
const { promisify } = require('node:util');
const { pipeline } = require('node:stream/promises');
const compress = promisify(gzip);

const FILES = new Map([
  ['/', 'index.html'], ['/index.html', 'index.html'], ['/desktop.html', 'desktop.html'],
  ...['player.js', 'gd-embeat-core.js', 'browser-provider.js', 'search-session.js', 'soft-aurora-react.js', 'soft-aurora-react.css', 'style.css',
    'liquid-glass.js', 'manifest.json', 'service-worker.js', 'icon-192.png', 'icon-512.png', 'icon.svg']
    .map(file => ['/' + file, file]),
]);
const MIME = {
  html: 'text/html; charset=utf-8', js: 'application/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8', svg: 'image/svg+xml',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp',
  avif: 'image/avif', glb: 'model/gltf-binary', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf',
};
function acceptsGzip(header = '') {
  const encodings = new Map(String(header).toLowerCase().split(',').map(part => {
    const [name, ...params] = part.trim().split(';');
    const q = params.map(value => value.trim()).find(value => value.startsWith('q='));
    return [name, q === undefined ? 1 : Number(q.slice(2))];
  }));
  return (encodings.get('gzip') ?? encodings.get('*') ?? 0) > 0;
}
function matchesEtag(header, etag) {
  return typeof header === 'string' && header.split(',').some(value =>
    value.trim() === '*' || value.trim().replace(/^W\//, '') === etag.replace(/^W\//, ''));
}

// Cache only small files; larger images/bundles stream with backpressure.
// The byte limit includes both raw and compressed representations.
function createStaticHandler({ root = __dirname, maxCacheBytes = 8 * 1024 * 1024, maxFileBytes = 2 * 1024 * 1024 } = {}) {
  root = path.resolve(root);
  const cache = new Map(), pending = new Map();
  let cacheBytes = 0;
  async function prepare(file, stat, text) {
    const version = `${stat.size}-${stat.mtimeMs}-${stat.ctimeMs}`;
    const previous = cache.get(file);
    if (previous?.version === version) {
      cache.delete(file); cache.set(file, previous);
      return previous;
    }
    const key = `${file}:${version}`;
    if (pending.has(key)) return pending.get(key);
    const loading = (async () => {
      const raw = await fs.promises.readFile(file);
      const zipped = text ? await compress(raw) : null;
      const entry = { raw, zipped, version, bytes: raw.length + (zipped?.length || 0) };
      const old = cache.get(file);
      if (old) { cacheBytes -= old.bytes; cache.delete(file); }
      if (entry.bytes <= maxCacheBytes) {
        while (cacheBytes + entry.bytes > maxCacheBytes && cache.size) {
          const first = cache.keys().next().value;
          cacheBytes -= cache.get(first).bytes; cache.delete(first);
        }
        cache.set(file, entry); cacheBytes += entry.bytes;
      }
      return entry;
    })().finally(() => pending.delete(key));
    pending.set(key, loading);
    return loading;
  }
  return async function serveStatic(req, res, pathname) {
    let decoded;
    try { decoded = decodeURIComponent(pathname); }
    catch {
      if (!/^\/(?:assets|vendor)\//.test(pathname)) return false;
      res.statusCode = 400; res.end('Invalid path'); return true;
    }
    const directory = decoded.startsWith('/assets/') ? 'assets' : decoded.startsWith('/vendor/') ? 'vendor' : null;
    const relative = FILES.get(decoded) || (directory ? decoded.slice(1) : null);
    if (!relative) return false;
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); res.end(); return true;
    }
    try {
      const boundary = path.join(root, directory || '');
      const candidate = path.resolve(root, relative);
      if (decoded.includes('\0') || decoded.includes('\\') || !candidate.startsWith(boundary + path.sep)) {
        res.statusCode = 403; res.end('Forbidden'); return true;
      }
      // Resolve symlinks too: lexical containment alone is not sufficient.
      const [file, realBoundary, realRoot] = await Promise.all([
        fs.promises.realpath(candidate), fs.promises.realpath(boundary), fs.promises.realpath(root),
      ]);
      if ((realBoundary !== realRoot && !realBoundary.startsWith(realRoot + path.sep)) || !file.startsWith(realBoundary + path.sep)) {
        res.statusCode = 403; res.end('Forbidden'); return true;
      }
      const stat = await fs.promises.stat(file);
      if (!stat.isFile()) { res.statusCode = 404; res.end('Not found'); return true; }
      const ext = path.extname(file).slice(1).toLowerCase();
      const text = ['html', 'js', 'css', 'json', 'svg'].includes(ext);
      const zipped = text && acceptsGzip(req.headers['accept-encoding']);
      const etag = `W/"${stat.size.toString(16)}-${stat.mtimeMs}-${stat.ctimeMs}"`;
      const hashedChunk = /^\/assets\/aurora\/[^/]+-[a-z0-9]{8}\.(?:js|css)$/i.test(decoded);
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', hashedChunk ? 'public, max-age=31536000, immutable' : directory ? 'public, max-age=2592000' : 'no-cache');
      if (zipped) res.setHeader('Content-Encoding', 'gzip');
      if (matchesEtag(req.headers['if-none-match'], etag)) { res.statusCode = 304; res.end(); return true; }
      if (stat.size <= maxFileBytes) {
        const entry = await prepare(file, stat, text);
        const body = zipped ? entry.zipped : entry.raw;
        res.setHeader('Content-Length', body.length);
        res.end(req.method === 'HEAD' ? undefined : body);
      } else {
        if (!zipped) res.setHeader('Content-Length', stat.size);
        if (req.method === 'HEAD') res.end();
        else if (zipped) await pipeline(fs.createReadStream(file), createGzip(), res);
        else await pipeline(fs.createReadStream(file), res);
      }
    } catch (error) {
      if (res.headersSent) res.destroy();
      else {
        for (const name of ['Content-Encoding', 'Content-Length', 'ETag', 'Cache-Control']) res.removeHeader(name);
        res.statusCode = ['ENOENT', 'ENOTDIR', 'EACCES'].includes(error.code) ? 404 : 500;
        res.end(res.statusCode === 404 ? 'Not found' : 'Static resource unavailable');
      }
    }
    return true;
  };
}

module.exports = { createStaticHandler };
