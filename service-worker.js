/**
 * TY Music - Service Worker
 * PWA 离线缓存 + 桌面安装支持
 * 策略：静态资源/图片缓存优先，目录缓存并刷新，搜索/播放仅网络
 */

const CACHE_NAME = 'ty-music-v53-quality';
// Pages redirects /index.html to /. A redirected cached response is invalid
// for a browser navigation whose redirect mode is manual.
const APP_SHELL = '/?v=20261118-quality-v53';
const STATIC_ASSETS = [
  APP_SHELL,
  '/style.css?v=20261118-quality-v53',
  '/player.js?v=20261118-genre-cover-v56',
  '/gd-embeat-core.js?v=20261118-quality-v53',
  '/browser-provider.js?v=20261118-quality-v53',
  '/search-session.js?v=20261118-quality-v53',
  '/soft-aurora-react.js?v=20261118-quality-v53',
  '/soft-aurora-react.css?v=20261118-quality-v53',
  '/assets/demo/cs1.webp',
  '/assets/demo/cs2.webp',
  '/assets/demo/cs3.webp',
  '/vendor/font-awesome/css/all.min.css',
  '/vendor/font-awesome/webfonts/fa-solid-900.woff2',
];

// 安装事件：预缓存静态资源，跳过等待立即接管
self.addEventListener('install', event => {
  console.log('[SW] Installing v53...');
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
  console.log('[SW] Activated v53');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name.startsWith('ty-music-') && name !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

// 请求拦截
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Use the CDN's HTTP cache for direct covers. Opaque images cannot be
  // validated before storing them in CacheStorage.
  if (event.request.destination === 'image' && /^p\d+\.music\.126\.net$/.test(url.hostname)) return;

  // A cached shell keeps navigation responsive during platform wake-up.
  // Refresh in the background; search and playback still require the network.
  if (event.request.mode === 'navigate' && url.origin === self.location.origin && ['/', '/index.html'].includes(url.pathname)) {
    const refresh = fetchAndCache(event.request);
    event.waitUntil(refresh.catch(() => {}));
    event.respondWith(navigationResponse(event.request, refresh));
    return;
  }

  const artworkApi = ['/api/cover', '/api/music/cover', '/api/artist-photo'].includes(url.pathname);
  if (artworkApi && event.request.method === 'GET') {
    let finishCacheWrite;
    const cacheWriteLifetime = new Promise(resolve => { finishCacheWrite = resolve; });
    event.waitUntil(cacheWriteLifetime);
    event.respondWith((async () => {
      let cache = null;
      try { cache = await caches.open(CACHE_NAME); } catch (_) {}
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
          Promise.resolve().then(() => cache.put(event.request, response.clone()))
            .catch(() => {})
            .then(finishCacheWrite);
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
  if (url.pathname.startsWith('/api/') && !networkOnlyApi && event.request.method === 'GET') {
    event.respondWith(caches.match(event.request).then(cached => {
      const refresh = fetch(event.request).then(response => {
        if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        return response;
      }).catch(() => cached || Response.error());
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
  if (event.request.method === 'GET' && event.request.destination === 'image') {
    event.respondWith(caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok || response.type === 'opaque') {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
    }));
    return;
  }

  // 静态资源（JS/CSS/字体）：Cache First
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.woff2') || url.pathname.endsWith('.woff')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // 后台更新缓存（stale-while-revalidate）
          event.waitUntil(fetchAndCache(event.request).catch(() => {}));
          return cached;
        }
        return fetchAndCache(event.request).catch(() => {
          return caches.match(event.request);
        });
      }).catch(() => fetch(event.request))
    );
    return;
  }

  // HTML 和其他资源：Network First
  event.respondWith(
    fetch(event.request).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
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
    for (const key of [request, APP_SHELL]) {
      const cached = await cache.match(key);
      if (cached?.ok && !cached.redirected) return cached;
    }
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
      const clone = response.clone();
      // Include persistence in waitUntil without turning storage pressure into
      // a network failure for an otherwise usable response.
      try { await (await caches.open(CACHE_NAME)).put(request, clone); } catch (_) {}
    }
    return response;
  });
}
