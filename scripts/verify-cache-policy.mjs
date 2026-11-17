import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../service-worker.js', import.meta.url), 'utf8');
test('both search aliases bypass even a previously cached empty response', () => {
  const handlers = {};
  vm.runInNewContext(source, {
    self: { addEventListener: (name, handler) => { handlers[name] = handler; } },
    URL, console,
    caches: { match() { throw new Error('search must not read cache'); } },
  });
  for (const path of ['/api/search', '/api/music/search']) {
    let intercepted = false;
    handlers.fetch({ request: { url: `https://example.test${path}?keywords=test`, method: 'GET' }, respondWith() { intercepted = true; } });
    assert.equal(intercepted, false, path);
  }
});
