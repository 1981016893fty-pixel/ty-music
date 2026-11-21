// Keep the application HTTP handler real; replace only its external transport.
const http = require('node:http');
const https = require('node:https');
let requests = 0;
const upstream = http.createServer((req, res) => {
  requests++;
  if (process.env.RESILIENCE_FIXTURE === 'artist-photo') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ result: { artists: [{ picUrl: `https://p1.music.126.net/photo/${requests}.jpg` }] } }));
  } else if (process.env.RESILIENCE_FIXTURE === 'lyric-truncated' && requests === 1) {
    res.write('{"lyric":'); setImmediate(() => res.destroy());
  } else if (['lyric-recover', 'lyric-truncated'].includes(process.env.RESILIENCE_FIXTURE)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(requests === 1 && process.env.RESILIENCE_FIXTURE === 'lyric-recover' ? { code: 500, error: 'unavailable' } : { lyric: '[00:01]Recovered', tlyric: '' }));
  } else if (process.env.RESILIENCE_FIXTURE === 'lyric-empty') {
    res.end(JSON.stringify({ lyric: '', tlyric: '' }));
  } else {
    res.statusCode = process.env.RESILIENCE_FIXTURE === 'cover-error' ? 403 : 200;
    res.setHeader('Content-Type', process.env.RESILIENCE_FIXTURE === 'cover-jpg' ? 'image/jpg' : ['cover-ok', 'cover-empty'].includes(process.env.RESILIENCE_FIXTURE) ? 'image/jpeg' : 'text/html');
    res.end(process.env.RESILIENCE_FIXTURE === 'cover-empty' ? '' : 'fixture-body');
  }
});
upstream.listen(0, '127.0.0.1', () => {
  if (process.env.TY_MUSIC_RUNTIME === 'cloudflare') {
    const request = globalThis.fetch;
    globalThis.fetch = (input, options) => request(new URL(new URL(input).pathname, `http://127.0.0.1:${upstream.address().port}`), options);
    https.get = () => { throw new Error('Workers artwork must use native fetch'); };
  } else {
    https.get = (options, callback) => http.get({ ...options, hostname: '127.0.0.1', port: upstream.address().port, agent: false }, callback);
  }
  const { createServer } = require('../server-simple.js');
  const app = createServer({ staticFiles: false });
  app.listen(0, '127.0.0.1', () => process.send?.({ port: app.address().port }));
});
