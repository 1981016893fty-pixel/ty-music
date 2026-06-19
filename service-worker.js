/**
 * TY Music - Service Worker
 * PWA 离线缓存 + 桌面安装支持
 */

const CACHE_NAME = 'ty-music-v1';

// 安装事件：预缓存核心资源
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }))
    ).then(() => self.clients.claim())
  );
});

// 请求拦截：Network First（API 走网络，静态资源优先缓存）
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API 请求不缓存
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      // 缓存命中直接返回
      if (cached) return cached;

      // 走网络
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        // 缓存静态资源
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
