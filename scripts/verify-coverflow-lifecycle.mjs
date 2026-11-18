import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../player.js', import.meta.url), 'utf8');
const start = source.indexOf('let cfAlbums =');
const end = source.indexOf('// 更新 openAlbumDetail 函数以更新收藏按钮', start);
assert.ok(start >= 0 && end > start, 'Cover Flow implementation is available');

// Run the actual view entry points and browser events. Only DOM, time, and
// storage are adapted; spring, visibility, scheduling, and rendering are real.
function mount(count = 100) {
  const frames = new Map();
  let nextFrame = 0, now = 0, writes = 0, queries = 0;
  function element() {
    const listeners = new Map(), classes = new Set();
    let markup = '';
    return {
      children: [], dataset: {},
      style: new Proxy({}, { set(target, key, value) { writes++; target[key] = value; return true; } }),
      classList: { add(value) { classes.add(value); }, remove(value) { classes.delete(value); }, contains: value => classes.has(value) },
      set innerHTML(value) { markup = value; this.children = []; }, get innerHTML() { return markup; },
      appendChild(child) { this.children.push(child); },
      addEventListener(type, callback) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(callback); },
      removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
      emit(type, event = {}) { for (const callback of [...(listeners.get(type) || [])]) callback(event); },
      querySelectorAll(selector) { queries++; return selector === '.cf-spine' ? this.children.filter(child => child.className?.split(' ').includes('cf-spine')) : []; },
      setPointerCapture() {}, releasePointerCapture() {},
      get listenerCount() { return [...listeners.values()].reduce((total, list) => total + list.size, 0); },
    };
  }
  const ids = new Map(['coverFlowStage', 'coverFlowReflection', 'coverFlowInfo', 'coverFlowHint', 'coverFlowContainer', 'albumGrid', 'gridViewBtn', 'coverFlowViewBtn', 'page-album-favorites'].map(id => [id, element()]));
  const document = { ...element(), hidden: false, createElement: element, getElementById: id => ids.get(id) };
  const window = element();
  const context = vm.createContext({
    document, window, performance: { now: () => now },
    state: { currentPage: 'album-favorites', albumFavorites: new Set(Array.from({ length: count }, (_, i) => String(i + 1))) },
    localStorage: { getItem: key => JSON.stringify({ id: key.slice('melodybox_album_'.length), name: key, artist: 'Artist', cover: '/cover.jpg' }), setItem() {} },
    esc: String, openAlbumDetail() {}, clearTimeout() {},
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  vm.runInContext(source.slice(start, end), context);
  function frame() {
    now += 1000 / 60;
    const current = [...frames.values()]; frames.clear();
    current.forEach(callback => callback(now));
  }
  function settle() {
    for (let i = 0; i < 600 && frames.size; i++) frame();
    assert.equal(frames.size, 0, 'settled Cover Flow leaves no pending animation frame');
  }
  return { context, document, window, ids, frames, frame, settle, get writes() { return writes; }, get queries() { return queries; } };
}

test('Cover Flow keeps its settled layout without continuously rendering', () => {
  const view = mount();
  view.context.showCoverFlowView();
  view.settle();
  const center = view.ids.get('coverFlowStage').children[50];
  assert.equal(center.style.transform, 'translate3d(0.0px,0,0.0px) rotateY(0.00deg) scale(1.000)');
  const writes = view.writes;
  for (let i = 0; i < 60; i++) view.frame();
  assert.equal(view.writes, writes, 'static frames perform no DOM writes');
});

test('hidden Cover Flow releases scheduled work and resumes its selected spring', () => {
  const view = mount();
  view.context.showCoverFlowView();
  view.settle();
  view.document.emit('keydown', { key: 'ArrowRight' });
  view.frame();
  assert.equal(view.frames.size, 1, 'keyboard selection starts the spring');
  view.document.hidden = true;
  view.document.emit('visibilitychange');
  assert.equal(view.frames.size, 0, 'hiding cancels queued work immediately');
  const writes = view.writes;
  view.frame();
  assert.equal(view.writes, writes);
  view.document.hidden = false;
  view.document.emit('visibilitychange');
  view.settle();
  assert.ok(view.ids.get('coverFlowStage').children[51].classList.contains('cf-active'), 'resume reaches the keyboard-selected album');
  view.context.showAlbumGridView();
  assert.equal(view.document.listenerCount, 0, 'leaving removes keyboard and visibility handlers');
  view.document.emit('visibilitychange');
  assert.equal(view.frames.size, 0, 'a stopped view cannot be resurrected by visibility');
});

test('pointer changes, resize, and rebuilt album data wake a settled view once', () => {
  const view = mount();
  view.context.showCoverFlowView();
  view.settle();
  const container = view.ids.get('coverFlowContainer');
  const pointer = x => ({ pointerId: 7, pointerType: 'mouse', button: 0, clientX: x, target: { closest: () => null }, preventDefault() {} });
  container.emit('pointerdown', pointer(500));
  container.emit('pointermove', pointer(300));
  assert.equal(view.frames.size, 1);
  view.frame();
  assert.equal(view.frames.size, 0, 'a stationary held pointer does not spin an animation loop');
  container.emit('pointerup', pointer(300));
  view.settle();
  assert.equal(view.ids.get('coverFlowStage').children[50].classList.contains('cf-active'), false, 'dragging changes the selected album');
  assert.equal(view.queries, 0, 'the draw path uses existing spine references');
  view.window.emit('resize');
  view.window.emit('resize');
  assert.equal(view.frames.size, 1, 'resize requests coalesce');
  view.settle();
  view.context.cfMergeAlbums([{ id: 'new', name: 'New album', artist: 'Artist' }]);
  view.context.cfBuildStage();
  assert.equal(view.frames.size, 1, 'new album data is rendered after idle');
  view.settle();
  assert.equal(view.ids.get('coverFlowStage').children.length, 101);
  view.context.showAlbumGridView();
  assert.equal(container.listenerCount, 0);
  assert.equal(view.window.listenerCount, 0, 'leaving releases resize handlers');
  view.window.emit('resize');
  assert.equal(view.frames.size, 0);
});

test('dragging updates the visible rail rather than every stored album', () => {
  const costs = [100, 1000].map(count => {
    const view = mount(count);
    view.context.showCoverFlowView();
    view.settle();
    const container = view.ids.get('coverFlowContainer');
    const pointer = x => ({ pointerId: 1, pointerType: 'mouse', button: 0, clientX: x, target: { closest: () => null }, preventDefault() {} });
    container.emit('pointerdown', pointer(500));
    const writes = view.writes;
    container.emit('pointermove', pointer(400));
    view.frame();
    return view.writes - writes;
  });
  assert.equal(costs[1], costs[0], 'per-frame DOM updates depend on the visible rail, not collection size');
});

test('leaving mid-gesture releases input state and repeated entry stays bounded', () => {
  const view = mount();
  const container = view.ids.get('coverFlowContainer');
  view.context.showCoverFlowView();
  view.settle();
  const initialListeners = view.document.listenerCount + view.window.listenerCount + container.listenerCount;
  container.emit('pointerdown', { pointerId: 3, pointerType: 'touch', clientX: 300, target: { closest: () => null }, preventDefault() {} });
  view.context.showAlbumGridView();
  assert.equal(container.style.cursor, '', 'leaving clears the held-pointer cursor');
  assert.equal(view.frames.size, 0);
  for (let i = 0; i < 5; i++) {
    view.context.showCoverFlowView();
    assert.equal(view.frames.size, 1, 'entry schedules exactly one frame');
    assert.equal(view.document.listenerCount + view.window.listenerCount + container.listenerCount, initialListeners);
  }
  view.document.emit('keydown', { key: 'ArrowRight' });
  view.context.showAlbumGridView();
  assert.equal(view.frames.size, 0, 'leaving cancels an active spring');
});
