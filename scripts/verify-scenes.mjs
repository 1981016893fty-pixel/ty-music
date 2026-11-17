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
