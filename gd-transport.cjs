'use strict';

const http2 = require('node:http2');
const { Readable } = require('node:stream');
const WEBSITE = 'music.gdstudio.xyz';

// Connection routing is separate from the website authority and signed payload.
// Only GD's two verified hosts are allowed; TLS validation remains enabled.
function createEmbeatTransport({ connectHost = WEBSITE, connectImpl = http2.connect } = {}) {
  if (![WEBSITE, 'music-api.gdstudio.xyz'].includes(connectHost)) throw new TypeError('Invalid GD connection host');
  let current;
  function connection() {
    if (!current || current.session.closed || current.session.destroyed) {
      const state = { session: connectImpl(`https://${connectHost}`), active: 0 };
      current = state;
      state.session.on('error', () => {}); // Active streams receive the connection error.
      state.session.setTimeout(30000, () => state.session.close());
      state.session.on('goaway', () => state.session.close());
    }
    return current;
  }
  async function send(raw, { headers = {}, signal } = {}) {
    const url = new URL(raw);
    if (url.origin !== `https://${WEBSITE}` || url.username || url.password || !['/time', '/api.php'].includes(url.pathname)) throw new TypeError('Invalid GD request target');
    signal?.throwIfAborted();
    const state = connection();
    state.session.ref(); state.active++;
    let stream;
    try {
      stream = state.session.request({ ...headers, ':method': 'GET', ':authority': WEBSITE, ':path': url.pathname + url.search }, { signal });
    } catch (error) {
      if (--state.active === 0) state.session.unref();
      throw error;
    }
    stream.once('close', () => { if (--state.active === 0) state.session.unref(); });
    return new Promise((resolve, reject) => {
      let received = false;
      stream.once('error', reject);
      stream.once('close', () => { if (!received) reject(Object.assign(new Error('GD connection closed before headers'), { code: 'ECONNRESET' })); });
      stream.once('response', incoming => {
        received = true;
        const status = incoming[':status'];
        const responseHeaders = Object.fromEntries(Object.entries(incoming).filter(([name]) => !name.startsWith(':')));
        try {
          resolve(new Response([204, 205, 304].includes(status) ? null : Readable.toWeb(stream), { status, headers: responseHeaders }));
        } catch (error) { stream.close(); reject(error); }
      });
      stream.end();
    });
  }
  async function transport(raw, options = {}) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try { return await send(raw, options); }
      catch (error) {
        if (attempt || options.signal?.aborted || !['ECONNRESET', 'ERR_HTTP2_GOAWAY_SESSION', 'ERR_HTTP2_INVALID_SESSION', 'ERR_HTTP2_STREAM_CANCEL'].includes(error.code)) throw error;
        current?.session.close(); current = null;
      }
    }
  }
  transport.close = () => { current?.session.destroy(); current = null; };
  return transport;
}

module.exports = { createEmbeatTransport };
