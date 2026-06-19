/**
 * TY Music - Service Worker
 * PWA 离线缓存 + 桌面安装支持
 */

const CACHE_NAME = 'ty-music-v5';

// 安装事件：跳过等待，立即接管
self.addEventListener('install', event => {
  console.log('[SW] Installing v4...');
  self.skipWaiting();
});

// 激活事件：清理旧缓存并立即接管所有客户端
self.addEventListener('activate', event => {
  console.log('[SW] Activated v4');
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(names.map(name => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }))
    ).then(() => self.clients.claim())
  );
});

// 请求拦截：Network First，静态资源优先用网络，网络失败才回退缓存
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API 请求不拦截
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request).then(response => {
      // 网络成功，更新缓存（只缓存同源的基本资源）
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      }
      return response;
    }).catch(err => {
      console.log('[SW] Network failed, fallback to cache:', url.pathname, err);
      return caches.match(event.request).then(cached => {
        if (cached) return cached;
        // 如果连缓存也没有，返回一个离线提示
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
