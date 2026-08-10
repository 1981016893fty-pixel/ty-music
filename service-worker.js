/**
 * TY Music - Service Worker
 * PWA 离线缓存 + 桌面安装支持
 * 策略：JS/CSS 用 Cache First（快速启动），HTML/API 用 Network First
 */

const CACHE_NAME = 'ty-music-v36-hero-layer-fix';
const API_WARMUP = [
  '/api/discover/featured?limit=6',
  '/api/discover/hot?limit=6',
  '/api/music/hot?source=netease&limit=6'
];
const STATIC_ASSETS = [
  '/index.html?v=20260810hero-layer-fix',
  '/style.css?v=20260810hero-layer-fix',
  '/player.js?v=20260810hero-layer-fix',
  '/soft-aurora-react.js?v=20260810hero-layer-fix',
  '/soft-aurora-react.css?v=20260810hero-layer-fix',
  '/assets/demo/cs1.webp',
  '/assets/demo/cs2.webp',
  '/assets/demo/cs3.webp',
  '/vendor/font-awesome/css/all.min.css',
  '/vendor/font-awesome/webfonts/fa-solid-900.woff2',
];

// 安装事件：预缓存静态资源，跳过等待立即接管
self.addEventListener('install', event => {
  console.log('[SW] Installing v36...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Precaching static assets');
      return cache.addAll(STATIC_ASSETS).then(() => Promise.allSettled(API_WARMUP.map(async url => {
        const response = await fetch(url, { credentials: 'same-origin' });
        if (response.ok) await cache.put(url, response.clone());
      })));
    }).then(() => self.skipWaiting())
  );
});

// 激活事件：清理旧缓存并立即接管所有客户端
self.addEventListener('activate', event => {
  console.log('[SW] Activated v36');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name !== CACHE_NAME) {
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

  // Audio and lyric streams must remain network-only. Catalog JSON can use
  // stale-while-revalidate so a page switch is instant after first load.
  const networkOnlyApi = /(?:\/proxy|\/play|\/download|\/music\/url|\/lyric|search-lyric)$/.test(url.pathname);
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
          fetchAndCache(event.request);
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
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>离线</title></head><body style="font-family:sans-serif;background:#000;color:#fff;text-align:center;padding:40px 20px"><h1>当前处于离线状态</h1><p>TY Music 需要网络连接才能播放歌曲。</p><button onclick="location.reload()" style="padding:12px 24px;border:none;border-radius:24px;background:linear-gradient(90deg,#b44dff,#ff4da6,#00d4ff);color:#fff;font-size:16px">重新加载</button></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
        throw err;
      });
    })
  );
});

// 辅助函数：获取并更新缓存
function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (response && response.status === 200 && response.type === 'basic') {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    }
    return response;
  });
}
