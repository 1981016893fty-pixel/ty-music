/**
 * TY Music - Service Worker
 * PWA 离线缓存 + 桌面安装支持
 * 策略：静态资源/图片缓存优先，目录缓存并刷新，搜索/播放仅网络
 */

const CACHE_NAME = 'ty-music-v79-exclusive-search';
const RUNTIME_CACHE_NAME = 'ty-music-runtime-v1';
const RUNTIME_CACHE_LIMIT = 128;
// Pages redirects /index.html to /. A redirected cached response is invalid
// for a browser navigation whose redirect mode is manual.
const APP_SHELL = '/?v=20261122-exclusive-search-v79';
const mobileBrowser = /Android|iPhone|iPad|iPod/i.test(self.navigator?.userAgent || '');
const STATIC_ASSETS = [
  APP_SHELL,
  '/style.css?v=20261122-original-ui-v72',
  '/player.js?v=20261122-original-ui-v72',
  '/local-music-db.js?v=20261121-memory-v64',
  '/gd-embeat-core.js?v=20261118-quality-v53',
  '/browser-provider.js?v=20261121-artwork-v65',
  '/search-session.js?v=20261122-exclusive-search-v79',
  '/soft-aurora-react.js?v=20261122-original-ui-v72',
  '/soft-aurora-react.css?v=20261122-original-ui-v72',
  '/assets/demo/cs1.webp',
  '/assets/demo/cs2.webp',
  '/assets/demo/cs3.webp',
  '/vendor/font-awesome/css/all.min.css',
  '/vendor/font-awesome/webfonts/fa-solid-900.woff2',
];

// 安装事件：预缓存静态资源，跳过等待立即接管
self.addEventListener('install', event => {
  if (mobileBrowser) {
    event.waitUntil(self.skipWaiting());
    return;
  }
  console.log('[SW] Installing', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('[SW] Precaching static assets');
      const manifest = await fetch('/assets/aurora/manifest.json', { cache: 'no-store' });
      if (!manifest.ok) throw new Error('UI module manifest unavailable');
      const modules = await manifest.json();
      if (!Array.isArray(modules) || modules.some(path => typeof path !== 'string' || !/^\/(?:soft-aurora-react\.js|assets\/aurora\/[\w-]+\.js)$/.test(path))) throw new Error('Invalid UI module manifest');
      return cache.addAll([...new Set([...STATIC_ASSETS, ...modules])]);
    }).then(() => self.skipWaiting())
  );
});

// 激活事件：清理旧缓存并立即接管所有客户端
self.addEventListener('activate', event => {
  console.log('[SW] Activated', CACHE_NAME);
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name.startsWith('ty-music-') && name !== CACHE_NAME && name !== RUNTIME_CACHE_NAME) {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        }
      }))
    ).catch(() => {}).then(removeLegacyRuntimeEntries).then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  // A phone with an older worker must reach the server's mobile redirect.
  if (mobileBrowser && event.request.mode === 'navigate') return;

  // A cached shell keeps navigation responsive during platform wake-up.
  // Refresh in the background; search and playback still require the network.
  if (event.request.mode === 'navigate' && url.origin === self.location.origin && ['/', '/index.html'].includes(url.pathname)) {
    // Only installation writes the versioned shell. A later deployment can
    // serve different HTML at that same URL while this worker is still active.
    const refresh = url.pathname + url.search === APP_SHELL ? fetch(event.request) : fetchAndCache(event.request);
    event.waitUntil(refresh.catch(() => {}));
    event.respondWith(navigationResponse(event.request, refresh));
    return;
  }

  const artworkApi = ['/api/cover', '/api/music/cover', '/api/artist-photo'].includes(url.pathname);
  if (artworkApi) {
    let finishCacheWrite;
    const cacheWriteLifetime = new Promise(resolve => { finishCacheWrite = resolve; });
    event.waitUntil(cacheWriteLifetime);
    event.respondWith((async () => {
      let cache = null;
      try { cache = await caches.open(RUNTIME_CACHE_NAME); } catch (_) {}
      try {
        const cached = await cache?.match(event.request).catch(() => null);
        if (cached) {
          const cacheControl = cached.headers.get('cache-control') || '';
          const maxAge = Number(cacheControl.match(/max-age=(\d+)/i)?.[1]);
          const date = Date.parse(cached.headers.get('date') || '');
          if (/public/i.test(cacheControl) && maxAge > 0 && Number.isFinite(date) && Date.now() - date < maxAge * 1000) {
            finishCacheWrite();
            return cached;
          }
          await cache.delete(event.request).catch(() => {});
        }
        const response = await fetch(event.request);
        const type = response.headers.get('content-type') || '';
        const cacheControl = response.headers.get('cache-control') || '';
        const expiresPublicly = /public,\s*max-age=\d*[1-9]\d*/i.test(cacheControl);
        const validImage = response.ok && /^image\//i.test(type) && response.headers.get('content-length') !== '0' && expiresPublicly;
        if (cache && validImage) {
          writeRuntimeCache(event.request, response.clone(), cache).then(finishCacheWrite);
        } else {
          finishCacheWrite();
        }
        return response;
      } catch (error) {
        finishCacheWrite();
        throw error;
      }
    })());
    return;
  }

  // Audio and lyric streams must remain network-only. Catalog JSON can use
  // stale-while-revalidate so a page switch is instant after first load.
  const networkOnlyApi = /(?:\/proxy|\/play|\/download|\/music\/url|\/lyric|search-lyric|\/search|\/health)$/.test(url.pathname);
  if (url.pathname.startsWith('/api/') && !networkOnlyApi) {
    event.respondWith(caches.match(event.request).catch(() => null).then(cached => {
      const refresh = fetch(event.request).catch(() => cached || Response.error());
      event.waitUntil(refresh.then(response => {
        if (response.ok && response !== cached) return writeRuntimeCache(event.request, response.clone());
      }));
      return cached || refresh;
    }));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Artwork and artist photos are immutable enough for a cache-first policy.
  // This keeps already-seen covers visible when users switch pages or reopen
  // the app, while failed requests still fall back to the network.
  if (event.request.destination === 'image') {
    // Use the browser's HTTP cache for direct CDN covers. Opaque responses
    // cannot be validated and browsers may charge large quota padding.
    if (url.origin !== self.location.origin) return;
    event.respondWith(caches.match(event.request).catch(() => null).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          event.waitUntil(writeRuntimeCache(event.request, response.clone()));
        }
        return response;
      });
    }));
    return;
  }

  // 静态资源（JS/CSS/字体）：Cache First
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff')) {
    event.respondWith((async () => {
      const installed = await caches.open(CACHE_NAME).then(cache => cache.match(event.request)).catch(() => null);
      if (installed) return installed;
      const cached = await caches.match(event.request).catch(() => null);
      if (cached) {
        event.waitUntil(fetchAndCache(event.request).catch(() => {}));
        return cached;
      }
      return fetchAndCache(event.request);
    })());
    return;
  }

  // HTML 和其他资源：Network First
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        event.waitUntil(writeRuntimeCache(event.request, response.clone()));
      }
      return response;
    }).catch(err => {
      console.log('[SW] Network failed, fallback to cache:', url.pathname, err);
      return caches.match(event.request).then(cached => {
        if (cached) return cached;
        // 如果连缓存也没有（离线且没有预缓存），返回离线提示
        if (url.pathname === '/' || url.pathname === '/index.html') {
          return offlineResponse();
        }
        throw err;
      });
    })
  );
});

async function navigationResponse(request, refresh) {
  try {
    const cache = await caches.open(CACHE_NAME);
    // The installed shell belongs to this worker; an exact URL may still
    // contain HTML from the previous release in our shared cache.
    for (const key of [APP_SHELL, request]) {
      const cached = await cache.match(key);
      if (cached?.ok && !cached.redirected) return cached;
    }
    const cached = await caches.match(request, { cacheName: RUNTIME_CACHE_NAME });
    if (cached?.ok && !cached.redirected) return cached;
  } catch (_) { /* Cache storage may be unavailable; the network still works. */ }
  try { return await refresh; } catch (_) { return offlineResponse(); }
}

function offlineResponse() {
  return new Response(
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>离线</title></head><body style="font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:40px 20px"><h1>当前处于离线状态</h1><p>TY Music 需要网络连接才能播放歌曲。</p><button onclick="location.reload()" style="padding:12px 24px;border:none;border-radius:24px;background:linear-gradient(90deg,#b44dff,#ff4da6,#00d4ff);color:#fff;font-size:16px">重新加载</button></body></html>',
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

// 辅助函数：获取并更新缓存
function fetchAndCache(request) {
  return fetch(request).then(async response => {
    if (response && response.status === 200 && response.type === 'basic') {
      await writeRuntimeCache(request, response.clone());
    }
    return response;
  });
}

async function writeRuntimeCache(request, response, cache) {
  try {
    cache ||= await caches.open(RUNTIME_CACHE_NAME);
    await cache.put(request, response);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - RUNTIME_CACHE_LIMIT)).map(key => cache.delete(key)));
  } catch (_) { /* Storage pressure must not block the network response. */ }
}

async function removeLegacyRuntimeEntries() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const assets = new Set(STATIC_ASSETS);
    const keys = await cache.keys();
    // Keep earlier release scripts and shell URLs for open tabs and offline startup.
    await Promise.all(keys.filter(({ url }) => {
      const { pathname, search } = new URL(url);
      return !assets.has(pathname + search) &&
        !/\.(?:js|css|woff2?)$/.test(pathname) &&
        !(pathname === '/' && /^\?v=\d{8}-[\w-]+$/.test(search));
    }).map(key => cache.delete(key)));
  } catch (_) { /* Older storage may already be gone. */ }
}
