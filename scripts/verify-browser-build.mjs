import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { browserBuild } from '../build.mjs';

test('initial UI does not eagerly download every optional graphics engine', async () => {
  const outputs = browserBuild.metafile.outputs;
  const initial = new Set();
  function visit(name) {
    if (initial.has(name)) return;
    assert.ok(outputs[name], `missing emitted import: ${name}`);
    initial.add(name);
    for (const dependency of outputs[name].imports) {
      if (dependency.kind === 'import-statement' && !dependency.external) visit(dependency.path);
    }
  }
  visit('soft-aurora-react.js');
  const bytes = [...initial].reduce((sum, name) => sum + outputs[name].bytes, 0);
  assert.ok(bytes < 900_000, `initial UI JavaScript is ${bytes} bytes; budget is 900000`);
  const manifest = JSON.parse(await readFile(new URL('../assets/aurora/manifest.json', import.meta.url), 'utf8'));
  assert.deepEqual(new Set(manifest), new Set([...initial].map(path => '/' + path)), 'offline shell precaches all eager module imports');
  console.log(`Initial UI JavaScript: ${bytes} bytes across ${initial.size} files.`);
});
