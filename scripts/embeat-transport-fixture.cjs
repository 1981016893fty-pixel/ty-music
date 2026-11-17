// Stub only outbound HTTP. Tests still use the application's real routes.
const http = require('node:http');
const mode = process.env.EMBEAT_FIXTURE;
const song = { id: 'song42', name: 'Fixture song', artist: ['Fixture artist'], album: 'Fixture album', source: 'embeat', url_id: 'url42', lyric_id: 'lrc42', pic_id: 'pic42', extra_data: { duration: 269, isrc: 'ISRC42' } };
let searches = 0;
global.fetch = async (raw, options = {}) => {
  const url = new URL(raw), q = url.searchParams;
  if (url.hostname === 'resources.tidal.com') return new Response(Buffer.from([0x89, 0x50, 0x4e, 0x47]), { headers: { 'content-type': 'image/png' } });
  if (url.pathname === '/time') return new Response(String(Date.now()));
  const type = q.get('types');
  if (type === 'search') {
    searches++;
    if (mode === 'recover' && searches === 1 || mode === 'malformed') return Response.json({ code: 500 });
    if (mode === 'rate') return new Response('', { status: 429 });
    if (mode === 'timeout') return new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true }));
    if (q.get('source') !== 'embeat' || q.get('name') !== 'private-query') throw Error('Incorrect search source/query');
    return Response.json(mode === 'empty' ? [] : [{ ...song, extra_data: { ...song.extra_data, duration: mode === 'duration-ms' ? 269746 : 269 } }]);
  }
  if (type === 'url') {
    if (q.get('source') !== 'embeat' || q.get('id') !== 'url42' || q.get('br') !== '999') throw Error('Lost audio resource identity or quality');
    return Response.json(mode === 'missing-audio' ? { url: '' } : { url: 'https://audio.tidal.com/fixture.flac', br: 1411, size: 123456 });
  }
  if (type === 'autosource') {
    return Response.json({ id: 'unrelated42', source: 'netease', name: 'Unrelated song', url: 'https://audio.example.test/wrong-song.mp3', br: 320, size: 123456 });
  }
  if (type === 'lyric') {
    if (q.get('source') !== 'embeat' || q.get('id') !== 'lrc42') throw Error('Lost lyric resource identity');
    return Response.json({ lyric: '[00:01.00]Fixture lyric', tlyric: '' });
  }
  if (type === 'pic') {
    if (q.get('source') !== 'embeat' || q.get('id') !== 'pic42') throw Error('Lost cover identity');
    return Response.json({ url: mode === 'bad-cover' ? 'http://127.0.0.1/private' : 'https://resources.tidal.com/images/fixture/500x500.jpg' });
  }
  throw Error('Unexpected outbound request');
};
const listen = http.Server.prototype.listen;
http.Server.prototype.listen = function (...args) {
  this.once('listening', () => process.send?.({ port: this.address().port }));
  return listen.apply(this, args);
};
