import { httpServerHandler } from 'cloudflare:node';
import api from '../server-simple.js';
import { mobileHomepage } from '../mobile-route.cjs';

api.createServer({ staticFiles: false }).listen(8899);
const backend = httpServerHandler({ port: 8899 });

const artworkPaths = new Set(['/api/cover', '/api/music/cover', '/api/artist-photo']);

async function fetchArtwork(request, env, context) {
  const cache = caches.default;
  try {
    const cached = await cache.match(request);
    if (cached) return cached;
  } catch (error) {
    console.warn('[Artwork cache] Read failed:', error.message);
  }

  const response = await backend.fetch(request, env, context);
  const type = response.headers.get('content-type') || '';
  const location = response.headers.get('location') || '';
  let redirectHost = '';
  try { if (location) redirectHost = new URL(location, request.url).hostname; } catch {}
  const imageResponse = response.status === 200 && /^image\//i.test(type);
  const artistRedirect = response.status === 302 && /^p\d+\.music\.126\.net$/.test(redirectHost);
  if ((imageResponse || artistRedirect) && /public,\s*max-age=\d+/i.test(response.headers.get('cache-control') || '')) {
    context.waitUntil(cache.put(request, response.clone()).catch(error => {
      console.warn('[Artwork cache] Write failed:', error.message);
    }));
  }
  return response;
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    if (mobileHomepage(url, request.method, request.headers.get('User-Agent'))) {
      return new Response(null, {
        status: 302, headers: { Location: '/mobile', 'Cache-Control': 'no-store', Vary: 'User-Agent' },
      });
    }
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (request.method === 'GET' && artworkPaths.has(url.pathname)) return fetchArtwork(request, env, context);
    return backend.fetch(request, env, context);
  },
};
