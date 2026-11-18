import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSceneStore, sceneActive } from '../src/sceneStore.mjs';

test('only the visible scene renders and reduced motion suppresses decoration', () => {
  const app = 'visible|app|page-discover|||motion';
  assert.equal(sceneActive('discover', app), true);
  assert.equal(sceneActive('aurora', app), false, 'homepage CSS hides the older aurora host');
  for (const page of ['favorites', 'playlist-detail', 'album-detail', 'artist-detail']) assert.equal(sceneActive('aurora', `visible|app|page-${page}|||motion`), true);
  for (const page of ['search', 'local', 'playlists', 'album-favorites']) assert.equal(sceneActive('aurora', `visible|app|page-${page}|||motion`), false);
  for (const hidden of ['search', 'library', 'coverflow', 'fullscreen', 'welcome']) assert.equal(sceneActive(hidden, app), false);
  assert.equal(sceneActive('discover', app.replace('visible', 'hidden')), false);
  assert.equal(sceneActive('discover', app.replace('motion', 'reduced'), true), false);
  assert.equal(sceneActive('discover', app.replace('motion', 'reduced')), true, 'controls remain available');
  assert.equal(sceneActive('fullscreen', 'visible|app|page-discover|fullscreen||motion'), true);
  assert.equal(sceneActive('discover', 'visible|app|page-discover|fullscreen||motion'), false);
  assert.equal(sceneActive('coverflow', 'visible|app|page-album-favorites||coverflow|motion'), true);
  assert.equal(sceneActive('coverflow', 'visible|app|page-album-favorites|||motion'), false);
  assert.equal(sceneActive('welcome', 'visible|welcome|page-discover|||motion'), true);
  assert.equal(sceneActive('discover', 'visible|welcome|page-discover|||motion'), false);
});

test('navigation and visibility changes notify subscribers and release all observers', () => {
  const events = new Map();
  const motionEvents = new Map();
  let observed = 0;
  let disconnects = 0;
  let mutation;
  const saved = global.MutationObserver;
  global.MutationObserver = class {
    constructor(fn) { mutation = fn; }
    observe() { observed++; }
    disconnect() { disconnects++; }
  };
  try {
    const classes = new Set();
    const page = { id: 'page-discover', classList: { contains: value => classes.has(value) } };
    const document = {
      hidden: false, getElementById: id => id === 'page-album-favorites' ? page : null,
      querySelector: () => page, querySelectorAll: () => [page],
      addEventListener: (name, fn) => events.set(name, fn), removeEventListener: name => events.delete(name),
    };
    const motion = { matches: false, addEventListener: (name, fn) => motionEvents.set(name, fn), removeEventListener: name => motionEvents.delete(name) };
    const store = createSceneStore(document, motion);
    let calls = 0;
    const disposeA = store.subscribe(() => calls++);
    const disposeB = store.subscribe(() => calls++);
    assert.equal(observed, 1, 'one shared observer across roots');
    page.id = 'page-search'; mutation();
    assert.equal(sceneActive('search', store.snapshot()), true);
    document.hidden = true; events.get('visibilitychange')();
    assert.equal(sceneActive('search', store.snapshot()), false);
    document.hidden = false; events.get('visibilitychange')();
    assert.equal(sceneActive('search', store.snapshot()), true, 'restored tabs resume');
    motion.matches = true; motionEvents.get('change')();
    assert.equal(sceneActive('search', store.snapshot(), true), false);
    assert.equal(calls, 8);
    disposeA(); assert.equal(disconnects, 0);
    disposeB(); assert.equal(disconnects, 1);
    assert.equal(events.size + motionEvents.size, 0);
  } finally { global.MutationObserver = saved; }
});

// Execute the real page wiring and genre component; only DOM mounts and other
// independently tested widgets are replaced at the browser boundary.
test('homepage keeps all genre choices through navigation and reduced motion', async () => {
  const { build } = await import('esbuild');
  const { createRequire } = await import('node:module');
  const vm = await import('node:vm');
  const require = createRequire(import.meta.url);
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const [entry, grid] = await Promise.all([
    build({ entryPoints: ['src/mount.jsx'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'react-dom/*', './*'] }),
    build({ entryPoints: ['src/ChromaGrid.jsx'], bundle: true, write: false, platform: 'node', format: 'cjs', external: ['react', 'gsap'], loader: { '.css': 'empty' } }),
  ]);
  const gridModule = { exports: {} };
  vm.runInNewContext(grid.outputFiles[0].text, { module: gridModule, exports: gridModule.exports, require, React });
  let snapshot = 'visible|app|page-discover|||motion';
  let mounted, selected;
  const host = {};
  const document = { body: {}, getElementById: id => id === 'chromaGridMount' ? host : null, querySelectorAll: () => [] };
  const window = { matchMedia: () => ({ matches: false }), addEventListener() {}, setTimeout() {}, loadGenreDetail: id => { selected = id; } };
  function Scene({ name, decorative, children }) { return sceneActive(name, snapshot, decorative) ? children : null; }
  const unused = new Proxy({}, { get: () => () => null });
  vm.runInNewContext(entry.outputFiles[0].text, {
    React, document, window, Element: class {}, MutationObserver: class { observe() {} },
    require(name) {
      if (name === 'react') return React;
      if (name === 'react-dom/client') return { createRoot: target => ({ render: element => { if (target === host) mounted = element; } }) };
      if (name === 'react-dom') return { flushSync: callback => callback() };
      if (name === './Scene') return { __esModule: true, default: Scene };
      if (name === './ChromaGrid') return { __esModule: true, default: gridModule.exports.default };
      return unused;
    },
  });
  const expected = ['流行乐', '摇滚', '电子', '嘻哈', '爵士', '古典', 'K-Pop', '华语', 'R&B', '拉丁', '动漫', '乡村'];
  for (const next of ['visible|app|page-discover|||motion', 'visible|app|page-search|||motion', 'hidden|app|page-discover|||motion', 'visible|app|page-discover|||reduced', 'visible|app|page-discover|||motion']) {
    snapshot = next;
    const html = renderToStaticMarkup(mounted);
    if (next.includes('page-search') || next.startsWith('hidden')) {
      assert.equal(html, '', 'inactive homepage releases its widgets');
    } else {
      assert.equal((html.match(/class="chroma-card"/g) || []).length, 12, 'homepage renders every genre');
      const labels = [...html.matchAll(/<h3 class="name">(.*?)<\/h3>/g)].map(match => match[1].replaceAll('&amp;', '&'));
      assert.deepEqual(labels, expected);
    }
  }
  mounted.props.children.props.onGenreClick('jazz');
  assert.equal(selected, 'jazz', 'genre selection reaches the existing detail loader');
});
