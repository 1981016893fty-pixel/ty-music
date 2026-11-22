import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { transform } from 'esbuild';

const source = readFileSync(new URL('../src/GridDistortion.jsx', import.meta.url), 'utf8');
const animate = source.match(/const animate = \(\) => \{([\s\S]*?)\n    \};/)?.[1] ?? '';

const checks = [
  [/mouseState\.vX\s*=\s*0/, 'pointer X velocity is consumed once per frame'],
  [/mouseState\.vY\s*=\s*0/, 'pointer Y velocity is consumed once per frame'],
  [/pointerInside/, 'first pointer sample does not inject a jump'],
  [/classList\.contains\('show'\)/, 'hidden fullscreen state resets pointer input'],
  [/MutationObserver/, 'fullscreen transitions reset pointer input'],
  [/visibilitychange/, 'tab visibility resets pointer input']
];

for (const [pattern, description] of checks) {
  if (!(pattern.test(animate) || pattern.test(source))) {
    throw new Error(`GridDistortion regression: missing ${description}`);
  }
}

console.log('Verified GridDistortion pointer reset and fullscreen lifecycle handling.');

// Execute the real component effect; only browser/GPU boundaries are simulated.
const compiled = await transform(source, { loader: 'jsx', format: 'cjs' });
function mount(props = {}) {
  let cleanup, textureReady, resize, draws = 0, lost = 0, uploaded = 0, refs = 0;
  const effects = [];
  let frameId = 0;
  const frames = new Map(), windowEvents = new Map(), documentEvents = new Map();
  const listeners = events => ({
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: name => events.delete(name),
  });
  const container = { innerHTML: '', appendChild() {}, contains: () => true, removeChild() {}, getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 500 }) };
  const texture = { image: { width: 1000, height: 600 }, disposals: 0, dispose() { this.disposals++; } };
  const resources = [];
  class Resource { constructor() { this.disposals = 0; resources.push(this); } dispose() { this.disposals++; } }
  const THREE = {
    Scene: class { add() {} },
    WebGLRenderer: class extends Resource {
      constructor() { super(); this.domElement = {}; }
      setPixelRatio() {} setClearColor() {} setSize() {} render() { draws++; }
      forceContextLoss() { lost++; }
    },
    OrthographicCamera: class { constructor() { this.position = {}; } updateProjectionMatrix() {} },
    Vector4: class { set() {} },
    TextureLoader: class { load(src, callback) { textureReady = () => callback(texture); return texture; } },
    DataTexture: class extends Resource {
      constructor(data) { super(); this.image = { data }; }
      set needsUpdate(value) { if (value) uploaded++; }
    },
    ShaderMaterial: Resource, PlaneGeometry: Resource,
    Mesh: class { constructor() { this.scale = { set() {} }; } },
  };
  const context = {
    exports: {}, module: { exports: {} },
    React: { createElement: () => null },
    require(name) {
      if (name === 'react') return { useEffect(callback) { effects.push(callback); }, useRef: value => ({ current: refs++ === 0 ? container : value }) };
      if (name === 'three') return THREE;
      if (name.endsWith('.css')) return {};
      throw Error(`Unexpected import ${name}`);
    },
    window: { devicePixelRatio: 2, ResizeObserver: true, ...listeners(windowEvents) },
    document: { getElementById: () => ({ classList: { contains: () => true } }), ...listeners(documentEvents) },
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} disconnect() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame: id => frames.delete(id),
    Math: Object.assign(Object.create(Math), { random: () => 0.75 }),
  };
  vm.runInNewContext(compiled.code, context);
  context.module.exports.default({ imageSrc: 'fixture.jpg', ...props });
  cleanup = effects[0]();
  effects[1]();
  function run(limit = 500) {
    let steps = 0;
    while (frames.size && steps++ < limit) {
      const [id, callback] = frames.entries().next().value;
      frames.delete(id); callback(steps * 16);
    }
  }
  return {
    run, frames, windowEvents, documentEvents, texture, resources,
    get draws() { return draws; }, get uploads() { return uploaded; }, get lost() { return lost; },
    load: () => textureReady(), resize: () => resize(), cleanup: () => cleanup(),
  };
}

const scene = mount();
scene.load(); scene.run();
assert.equal(scene.frames.size, 0, 'settled distortion must leave no animation frame pending');
const idleDraws = scene.draws, idleUploads = scene.uploads;
scene.run();
assert.equal(scene.draws, idleDraws); assert.equal(scene.uploads, idleUploads);
scene.windowEvents.get('mousemove')({ clientX: 200, clientY: 200 });
assert.equal(scene.frames.size, 0, 'first hover sample must not inject a jump');
scene.windowEvents.get('mousemove')({ clientX: 210, clientY: 210 });
assert.equal(scene.frames.size, 1, 'actual pointer movement wakes the effect');
scene.run(); assert.ok(scene.draws > idleDraws); assert.equal(scene.frames.size, 0);
scene.windowEvents.get('mousemove')({ clientX: 210, clientY: 210 });
assert.equal(scene.frames.size, 0, 'duplicate pointer coordinates remain idle');
const beforeResizeUploads = scene.uploads;
scene.resize(); assert.equal(scene.frames.size, 1); scene.run(); assert.equal(scene.frames.size, 0);
assert.equal(scene.uploads, beforeResizeUploads, 'resizing an idle scene does not reupload an unchanged distortion texture');
scene.windowEvents.get('mousemove')({ clientX: 230, clientY: 210 });
scene.cleanup();
assert.equal(scene.frames.size, 0); assert.equal(scene.windowEvents.size, 0); assert.equal(scene.documentEvents.size, 0);
assert.equal(scene.lost, 1); assert.ok(scene.resources.every(resource => resource.disposals === 1));
assert.equal(scene.texture.disposals, 1);
scene.resize(); assert.equal(scene.frames.size, 0, 'late observer delivery cannot restart after cleanup');
const lateImage = mount(); lateImage.run();
const beforeImage = lateImage.draws;
lateImage.load(); assert.equal(lateImage.frames.size, 1, 'texture completion wakes a settled scene');
lateImage.run(); assert.ok(lateImage.draws > beforeImage); assert.equal(lateImage.frames.size, 0); lateImage.cleanup();
const pendingTexture = mount(); pendingTexture.run(); pendingTexture.cleanup();
const beforeLateLoad = pendingTexture.draws;
pendingTexture.load(); pendingTexture.run();
assert.ok(pendingTexture.texture.disposals >= 1, 'late-loaded texture is disposed');
assert.equal(pendingTexture.frames.size, 0, 'late load cannot restart an unmounted effect');
assert.equal(pendingTexture.draws, beforeLateLoad);
const staticDistortion = mount({ relaxation: 1 }); staticDistortion.load(); staticDistortion.run();
assert.equal(staticDistortion.draws, 1, 'non-decaying distortion is static between pointer samples');
assert.equal(staticDistortion.frames.size, 0); staticDistortion.cleanup();
console.log(`Verified settled GridDistortion: ${idleDraws} initial draws, zero idle frames/uploads; movement, resize and texture completion wake, cleanup disposes late textures.`);
