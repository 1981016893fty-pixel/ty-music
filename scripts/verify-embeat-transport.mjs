import test from 'node:test';
import assert from 'node:assert/strict';
import http2 from 'node:http2';
import { once } from 'node:events';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createEmbeatTransport } = require('../gd-transport.cjs');
const { createEmbeatClient } = require('../gd-embeat.cjs');

async function upstream(run, respond) {
  const server = http2.createServer();
  const sessions = new Set();
  server.on('session', session => { sessions.add(session); session.on('error', () => {}); });
  server.on('stream', (stream, headers) => { stream.on('error', () => {}); respond(stream, headers); });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const transport = createEmbeatTransport({
    connectHost: 'music-api.gdstudio.xyz',
    connectImpl: () => http2.connect(`http://127.0.0.1:${server.address().port}`),
  });
  try { await run(transport, sessions); }
  finally { transport.close(); for (const session of sessions) session.destroy(); await new Promise(resolve => server.close(resolve)); }
}

test('HTTP/2 transport keeps website authority and reuses one connection for signed search', async () => {
  const requests = [];
  await upstream(async (fetchImpl, sessions) => {
    const client = createEmbeatClient({ fetchImpl });
    assert.equal((await client.search('周杰伦')).songs[0].id, 'original-id');
    assert.equal(sessions.size, 1);
  }, (stream, headers) => {
    requests.push(headers);
    assert.equal(headers[':authority'], 'music.gdstudio.xyz');
    stream.respond({ ':status': 200 });
    if (headers[':path'] === '/time') return stream.end('1794826800');
    const q = new URL(headers[':path'], 'https://music.gdstudio.xyz').searchParams;
    assert.equal(q.get('source'), 'embeat'); assert.equal(q.get('s'), '7E101CFD');
    stream.end(JSON.stringify([{ id: 'original-id', source: 'embeat', name: '晴天', artist: ['周杰伦'] }]));
  });
  assert.equal(requests.length, 2);
});

test('aborting one stream preserves another request and redirects are not followed', async () => {
  await upstream(async transport => {
    const controller = new AbortController();
    const pending = transport('https://music.gdstudio.xyz/api.php?slow=1', { signal: controller.signal });
    controller.abort();
    await assert.rejects(pending, error => error.name === 'AbortError');
    const response = await transport('https://music.gdstudio.xyz/api.php');
    assert.equal(response.status, 302);
    assert.equal(response.headers.get('location'), 'http://127.0.0.1/private');
  }, (stream, headers) => {
    if (headers[':path'].includes('slow')) return;
    stream.respond({ ':status': 302, location: 'http://127.0.0.1/private' }); stream.end();
  });
});

test('transport rejects arbitrary targets and unsupported connection hosts before connecting', async () => {
  let connections = 0;
  const transport = createEmbeatTransport({ connectImpl: () => { connections++; throw Error('must not connect'); } });
  for (const url of ['http://music.gdstudio.xyz/time', 'https://evil.test/time', 'https://music.gdstudio.xyz/private', 'https://music.gdstudio.xyz:8443/time']) {
    await assert.rejects(transport(url), TypeError);
  }
  assert.equal(connections, 0);
  assert.throws(() => createEmbeatTransport({ connectHost: 'evil.test' }), TypeError);
  transport.close();
});

test('a connection dropped before headers reconnects once within the caller deadline', async () => {
  let requests = 0;
  await upstream(async transport => {
    const response = await transport('https://music.gdstudio.xyz/time', { signal: AbortSignal.timeout(1000) });
    assert.equal(await response.text(), '1794826800');
    assert.equal(requests, 2);
  }, stream => {
    if (++requests === 1) return stream.session.destroy();
    stream.respond({ ':status': 200 }); stream.end('1794826800');
  });
});
