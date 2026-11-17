// External transport only: the application still handles real HTTP requests.
const { EventEmitter } = require('node:events');
const http = require('node:http');
const https = require('node:https');
const mode = process.env.SEARCH_FIXTURE;
const song = { id: 42, name: 'Fixture song', artists: [{ name: 'Fixture artist' }], album: { id: 8, name: 'Fixture album', picUrl: 'https://p1.music.126.net/fixture.jpg' }, duration: 180000 };
let searches = 0;
function reply(url) {
  const parsed = new URL(url);
  const alternate = parsed.pathname.includes('cloudsearch');
  if (parsed.pathname.includes('detail')) return { code: 200, songs: [] };
  searches++;
  if (mode === 'recover' && searches <= 2) return { code: -462 };
  if (mode === 'business' || (mode === 'alternate' && alternate)) return { code: -462 };
  if (mode === 'alternate' && (parsed.searchParams.get('s') !== 'Fixture' || parsed.searchParams.get('offset') !== '2' || parsed.searchParams.get('limit') !== '1')) throw new Error('Query/paging changed');
  if (mode === 'zero') return { code: 200, result: { songCount: 0 } };
  const malformedCounts = { null: null, blank: '', boolean: false };
  const countMode = mode.replace('count-', '').replace('-fallback', '');
  if (Object.hasOwn(malformedCounts, countMode) && (!mode.endsWith('-fallback') || alternate)) return { code: 200, result: { songCount: malformedCounts[countMode] } };
  if (mode === 'malformed') return { code: 200, result: {} };
  if (mode === 'minimal' || mode === 'cover-timeout') return { code: 200, result: { songCount: 5, songs: [{ id: 42, name: 'Fixture song', artists: [{ name: 'Fixture artist' }] }] } };
  return { code: 200, result: { songCount: 5, songs: [song] } };
}
global.fetch = async (url, options) => {
  if (mode === 'timeout' || (mode === 'cover-timeout' && String(url).includes('detail'))) {
    return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })), { once: true }));
  }
  if (mode === 'transport') throw new Error('external network failed');
  return { ok: mode !== 'http', status: mode === 'http' ? 503 : 200, json: async () => reply(url) };
};
https.get = (options, callback) => {
  const req = new EventEmitter();
  req.setTimeout = () => req;
  req.destroy = () => {};
  process.nextTick(() => {
    if (mode === 'transport') return req.emit('error', new Error('external network failed'));
    const res = new EventEmitter(); res.statusCode = mode === 'http' ? 503 : 200; res.headers = {};
    callback(res);
    res.emit('data', Buffer.from(JSON.stringify(reply(`https://${options.hostname}${options.path}`))));
    res.emit('end');
  });
  return req;
};
const listen = http.Server.prototype.listen;
http.Server.prototype.listen = function (...args) {
  this.once('listening', () => process.send?.({ port: this.address().port }));
  return listen.apply(this, args);
};
