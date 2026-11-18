'use strict';

const fault = (message, code = 'UPSTREAM_ERROR', statusCode = 502) => Object.assign(new Error(message), { code, statusCode });

// Complete JSON/images have one deadline across headers, redirects and body.
// Audio streaming deliberately does not use this buffered transport.
function createBufferedRequester({ http, https, httpAgent, httpsAgent }) {
  return function requestBuffered(url, { headers = {}, timeout = 10000, maxBytes = 4 * 1024 * 1024, maxRedirects = 5, signal, acceptType } = {}) {
    return new Promise((resolve, reject) => {
      let settled = false, activeRequest, activeResponse, generation = 0;
      const timer = setTimeout(() => finish(fault('Upstream timed out', 'UPSTREAM_TIMEOUT', 504)), timeout);
      const abort = () => finish(fault('Upstream request cancelled', 'UPSTREAM_ABORTED'));
      function finish(error, value) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        signal?.removeEventListener('abort', abort);
        if (error) {
          activeResponse?.destroy?.();
          activeRequest?.destroy();
          reject(error);
        } else resolve(value);
      }
      function visit(raw, remaining) {
        if (settled) return;
        const version = ++generation;
        let redirected = false;
        let parsed;
        try {
          parsed = new URL(raw);
          if (!['https:', 'http:'].includes(parsed.protocol)) throw fault('Unsupported upstream protocol');
        } catch (error) { finish(error); return; }
        const secure = parsed.protocol === 'https:';
        try {
          activeRequest = (secure ? https : http).get({
            hostname: parsed.hostname, port: parsed.port || (secure ? 443 : 80),
            path: parsed.pathname + parsed.search, headers, agent: secure ? httpsAgent : httpAgent,
          }, response => {
            if (settled) { response.destroy?.(); return; }
            activeResponse = response;
            response.on('error', error => { if (!redirected && version === generation) finish(error); });
            response.on('aborted', () => { if (!redirected && version === generation) finish(fault('Upstream response interrupted', 'UPSTREAM_TRUNCATED')); });
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
              if (!remaining) { finish(fault('Too many upstream redirects', 'UPSTREAM_REDIRECT_LIMIT')); return; }
              let next;
              try { next = new URL(response.headers.location, parsed).href; }
              catch (error) { finish(error); return; }
              // Never leave an unconsumed redirect body occupying an agent socket.
              redirected = true;
              response.destroy?.();
              activeResponse = null;
              visit(next, remaining - 1);
              return;
            }
            if (response.statusCode < 200 || response.statusCode >= 300) {
              finish(Object.assign(fault(`Upstream HTTP ${response.statusCode}`), { upstreamStatus: response.statusCode }));
              return;
            }
            if (acceptType && !acceptType(response.headers['content-type'] || '')) {
              finish(fault('Invalid upstream content type')); return;
            }
            if (Number(response.headers['content-length']) > maxBytes) {
              finish(fault('Upstream response too large', 'UPSTREAM_TOO_LARGE')); return;
            }
            const chunks = []; let bytes = 0;
            response.on('data', chunk => {
              if (settled) return;
              bytes += chunk.length;
              if (bytes > maxBytes) { finish(fault('Upstream response too large', 'UPSTREAM_TOO_LARGE')); return; }
              chunks.push(chunk);
            });
            response.on('end', () => finish(null, { body: Buffer.concat(chunks), headers: response.headers }));
            response.on('close', () => {
              if (!settled && response.complete === false) finish(fault('Upstream response interrupted', 'UPSTREAM_TRUNCATED'));
            });
          });
          activeRequest.on('error', error => { if (!redirected && version === generation) finish(error); });
        } catch (error) { finish(error); }
      }
      if (signal?.aborted) { abort(); return; }
      signal?.addEventListener('abort', abort, { once: true });
      visit(url, maxRedirects);
    });
  };
}

async function readFetchBody(response, maxBytes) {
  if (Number(response.headers.get('content-length')) > maxBytes || !response.body) {
    response.body?.cancel().catch(() => {});
    throw fault('Invalid or oversized upstream body', 'UPSTREAM_TOO_LARGE');
  }
  const reader = response.body.getReader();
  const chunks = []; let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return Buffer.concat(chunks);
      bytes += value.byteLength;
      if (bytes > maxBytes) throw fault('Upstream response too large', 'UPSTREAM_TOO_LARGE');
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(() => {}); }
}

module.exports = { createBufferedRequester, readFetchBody };
