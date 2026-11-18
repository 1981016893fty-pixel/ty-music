import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, fork } from 'node:child_process';
import { once } from 'node:events';

test('API can be imported without listening or reading static files', () => {
  const output = execFileSync(process.execPath, ['-e', `
    const http = require('node:http');
    http.Server.prototype.listen = () => { throw Error('Import opened a listener'); };
    const { createServer } = require('./server-simple.js');
    if (typeof createServer !== 'function') throw Error('Missing server factory');
    console.log('imported');
  `], { cwd: new URL('..', import.meta.url), encoding: 'utf8' });
  assert.equal(output.trim(), 'imported');
});

test('API-only server preserves search and returns CORS, fallback artwork and JSON errors', async () => {
  const child = fork(new URL('./api-handler-fixture.cjs', import.meta.url), [], {
    execArgv: ['--require', new URL('./search-transport-fixture.cjs', import.meta.url).pathname],
    env: { ...process.env, GD_EMBEAT_CONNECT_HOST: '', SEARCH_FIXTURE: 'success' }, silent: true,
  });
  child.stdout.resume(); child.stderr.resume();
  try {
    const [{ port }] = await once(child, 'message', { signal: AbortSignal.timeout(5000) });
    const get = (path, init) => fetch(`http://127.0.0.1:${port}${path}`, init);
    assert.equal((await get('/api/music/search?keywords=Fixture').then(r => r.json())).songs[0].source, 'netease');
    const preflight = await get('/api/music/proxy', { method: 'OPTIONS', headers: { 'Access-Control-Request-Headers': 'Range' } });
    assert.equal(preflight.status, 204);
    assert.match(preflight.headers.get('Access-Control-Allow-Headers'), /range/i);
    const avatar = await get('/api/artist-avatar?name=%3Cscript%3E');
    assert.equal(avatar.status, 200);
    assert.match(avatar.headers.get('Content-Type'), /image\/svg/);
    assert.ok(!(await avatar.text()).includes('<script>'));
    assert.equal((await get('/index.html')).status, 404, 'API build must not expose repository files');
    const missing = await get('/api/missing');
    assert.equal(missing.status, 404);
    assert.match(missing.headers.get('Content-Type'), /json/);
    assert.equal((await get('/api/health').then(r => r.json())).status, 'ok');
  } finally {
    if (child.exitCode === null && child.signalCode === null) { const done = once(child, 'exit'); child.kill(); await done; }
  }
});
