import test from 'node:test';
import assert from 'node:assert/strict';
import http2 from 'node:http2';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { gzipSync, brotliCompressSync, deflateSync } from 'node:zlib';
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

for (const [encoding, compress] of [['gzip', gzipSync], ['br', brotliCompressSync], ['deflate', deflateSync]]) {
  test(`HTTP/2 ${encoding} responses decode before clock and API validation`, async () => {
    await upstream(async fetchImpl => {
      const client = createEmbeatClient({ fetchImpl });
      assert.equal((await client.search('compressed', 1, 0)).songs[0].id, 'original-id');
    }, (stream, headers) => {
      const body = headers[':path'] === '/time' ? '1794826800' : JSON.stringify([
        { id: 'original-id', source: 'embeat', name: 'Fixture', artist: ['Artist'] },
      ]);
      const compressed = compress(body);
      stream.respond({ ':status': 200, 'content-encoding': encoding, 'content-length': compressed.length });
      stream.end(compressed);
    });
  });
}

test('decoded bodies retain diagnostic encoding headers and cancellation closes only their stream', async () => {
  let closed;
  const streamClosed = new Promise(resolve => { closed = resolve; });
  await upstream(async (transport, sessions) => {
    const response = await transport('https://music.gdstudio.xyz/api.php?slow=1');
    assert.equal(response.headers.get('content-encoding'), 'gzip');
    await response.body.cancel();
    let timer;
    try { await Promise.race([streamClosed, new Promise((resolve, reject) => { timer = setTimeout(() => reject(Error('Canceled decoder left HTTP/2 stream open')), 1000); })]); }
    finally { clearTimeout(timer); }
    const healthy = await transport('https://music.gdstudio.xyz/time');
    assert.equal(await healthy.text(), '1794826800');
    assert.equal(sessions.size, 1, 'canceling a body must preserve the shared HTTP/2 session');
  }, (stream, headers) => {
    if (headers[':path'].includes('slow')) {
      stream.once('close', closed);
      stream.respond({ ':status': 200, 'content-encoding': 'gzip' });
      stream.write(gzipSync('partial response')); // Leave the upstream stream open until cancellation.
    } else { stream.respond({ ':status': 200 }); stream.end('1794826800'); }
  });
});

test('decoded byte limits reject a small gzip response that expands beyond the API cap', async () => {
  await upstream(async fetchImpl => {
    const client = createEmbeatClient({ fetchImpl });
    await assert.rejects(client.search('oversized', 1, 0), error => error.code === 'GD_RESPONSE_TOO_LARGE');
  }, (stream, headers) => {
    if (headers[':path'] === '/time') { stream.respond({ ':status': 200 }); return stream.end('1794826800'); }
    const body = gzipSync(' '.repeat(2 * 1024 * 1024 + 1));
    stream.respond({ ':status': 200, 'content-encoding': 'gzip', 'content-length': body.length });
    stream.end(body);
  });
});

test('corrupt compressed data fails explicitly instead of returning a successful empty page', async () => {
  await upstream(async fetchImpl => {
    const client = createEmbeatClient({ fetchImpl });
    await assert.rejects(client.search('corrupt', 1, 0), error => error.statusCode === 502 && error.code === 'GD_UPSTREAM_ERROR');
  }, (stream, headers) => {
    if (headers[':path'] === '/time') { stream.respond({ ':status': 200 }); return stream.end('1794826800'); }
    stream.respond({ ':status': 200, 'content-encoding': 'gzip' }); stream.end('invalid gzip bytes');
  });
});
