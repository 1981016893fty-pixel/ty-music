import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import * as THREE from 'three';

// Bundle the actual component and local helpers. Only React and browser/GPU
// boundaries are substituted; a scheduler helper must execute its real code.
const compiled = new Map(await Promise.all(['ElasticMesh', 'Prism', 'ElectricBorder', 'SpecularButton', 'ShinyText', 'FloatingLines', 'LiquidEther'].map(async name => {
  const result = await build({
    entryPoints: [fileURLToPath(new URL(`../src/${name}.jsx`, import.meta.url))],
    bundle: true, write: false, platform: 'node', format: 'cjs',
    external: ['react', 'ogl', 'three', '*.css'],
  });
  return [name, result.outputFiles[0].text];
})));

function mount(name, props = {}, { intersectionObserver = true, width = 800, height = 500, dpr = 2 } = {}) {
  let now = 0, nextFrame = 0, draws = 0, lostContexts = 0, hookIndex = 0, sineCalls = 0, floorCalls = 0;
  let renderProps = props;
  let lastUniforms;
  let createdTargets = 0;
  const passes = [];
  const frames = new Map(), hooks = [], pendingEffects = [], images = [];
  const resizeObservers = [], intersectionObservers = [], canvases = [];
  const paths = [];
  const animations = [];
  let currentPath = [];
  const canvas2d = { style: {}, parentElement: null, getContext: () => ({
    scale() {}, setTransform() {}, clearRect() {},
    beginPath() { currentPath = []; }, closePath() {},
    moveTo(x, y) { currentPath.push([x, y]); },
    lineTo(x, y) { currentPath.push([x, y]); },
    stroke() { draws++; paths.push(currentPath); },
  }) };
  function eventTarget() {
    const listeners = new Map();
    return {
      addEventListener(type, callback) {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type).add(callback);
      },
      removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
      emit(type, event = {}) { for (const callback of [...(listeners.get(type) || [])]) callback(event); },
      get listenerCount() { return [...listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0); },
    };
  }
  const container = {
    ...eventTarget(),
    style: {},
    animate(keyframes, options) {
      const animation = { keyframes, options, playState: 'running', currentTime: 0,
        pause() { this.playState = 'paused'; }, play() { this.playState = 'running'; }, cancel() { this.playState = 'idle'; } };
      animations.push(animation);
      return animation;
    },
    offsetWidth: width, offsetHeight: height, clientWidth: width, clientHeight: height,
    getBoundingClientRect() { return { left: 0, top: 0, width: this.clientWidth, height: this.clientHeight, right: this.clientWidth, bottom: this.clientHeight }; },
    appendChild(canvas) { canvas.parentElement = canvas.parentNode = this; canvases.push(canvas); },
    prepend(canvas) { this.appendChild(canvas); },
    removeChild(canvas) { assert.equal(canvas.parentElement, this); canvas.parentElement = canvas.parentNode = null; },
  };
  const media = { ...eventTarget(), matches: false };
  const window = { ...eventTarget(), innerWidth: width, innerHeight: height, devicePixelRatio: dpr,
    matchMedia: () => media };
  const document = { ...eventTarget(), hidden: false };
  const three = {
    ...THREE,
    Clock: class { getElapsedTime() { return now / 1000; } },
    WebGLRenderTarget: class extends THREE.WebGLRenderTarget {
      constructor(...options) { super(...options); createdTargets++; }
    },
    WebGLRenderer: class {
      domElement = { style: {} };
      setClearColor() {}
      setDrawingBufferSize(w, h, dpr) {
        this.domElement.width = Math.floor(w * dpr);
        this.domElement.height = Math.floor(h * dpr);
      }
      setRenderTarget(target) { this.target = target; }
      render(scene) {
        const material = scene.children[0].material;
        lastUniforms = material.uniforms;
        if (this.target) {
          passes.push({ fragment: material.fragmentShader, format: this.target.texture.format });
        } else draws++;
      }
      dispose() {}
      forceContextLoss() { lostContexts++; }
    },
  };
  const ogl = {
    Renderer: class {
      constructor({ dpr = 1 } = {}) {
        this.dpr = dpr;
        let lost = false;
        this.gl = {
          canvas: { style: {}, parentElement: null },
          clearColor() {}, enable() {}, disable() {}, blendFunc() {},
          getExtension: name => name === 'WEBGL_lose_context' ? { loseContext() {
            if (!lost) lostContexts++;
            lost = true;
          } } : null,
        };
        this.render = () => { assert.equal(lost, false, 'a released GPU context cannot draw'); draws++; };
      }
      setSize(width, height) {
        // OGL assigns fractional width*dpr directly to the HTMLCanvasElement;
        // its unsigned-long dimensions truncate rather than round.
        this.gl.drawingBufferWidth = this.gl.canvas.width = Math.floor(width * this.dpr);
        this.gl.drawingBufferHeight = this.gl.canvas.height = Math.floor(height * this.dpr);
      }
    },
    Geometry: class { constructor(gl, attributes) { this.attributes = attributes; } },
    Triangle: class { attributes = {}; },
    Color: class { set() { this.r = this.g = this.b = 1; return this; } },
    Program: class { constructor(gl, { uniforms }) { this.uniforms = lastUniforms = uniforms; } },
    Mesh: class { constructor(gl, options) { Object.assign(this, options); } },
    Texture: class {},
  };
  const react = {
    useSyncExternalStore(subscribe, snapshot) { return snapshot(); },
    createElement(type, props) {
      if (props?.ref) {
        props.ref.current = type === 'canvas' ? canvas2d : container;
        if (type === 'canvas' && !canvases.includes(canvas2d)) container.appendChild(canvas2d);
      }
      return null;
    },
    useRef(initial) {
      const index = hookIndex++;
      if (!hooks[index]) hooks[index] = { current: index === 0 ? container : initial };
      return hooks[index];
    },
    useEffect(effect, dependencies) {
      const index = hookIndex++;
      const previous = hooks[index];
      if (!previous || !dependencies || dependencies.some((value, i) => !Object.is(value, previous.dependencies?.[i]))) {
        pendingEffects.push(() => {
          previous?.cleanup?.();
          hooks[index] = { dependencies, cleanup: effect() };
        });
      }
    },
    useCallback(callback, dependencies) {
      const index = hookIndex++;
      const previous = hooks[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        hooks[index] = { callback, dependencies };
      }
      return hooks[index].callback;
    },
  };
  class Observer {
    constructor(callback, list) { this.callback = callback; this.targets = new Set(); this.disconnected = false; list.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.disconnected = true; this.targets.clear(); }
  }
  const ResizeObserver = class extends Observer { constructor(callback) { super(callback, resizeObservers); } };
  const IntersectionObserver = class extends Observer { constructor(callback) { super(callback, intersectionObservers); } };
  Object.assign(window, { ResizeObserver, ...(intersectionObserver ? { IntersectionObserver } : {}) });
  const module = { exports: {} };
  const context = {
    module, exports: module.exports, React: react, window, document,
    navigator: { userAgent: 'desktop test' },
    Math: Object.assign(Object.create(Math), { sin(value) { sineCalls++; return Math.sin(value); }, floor(value) { floorCalls++; return Math.floor(value); } }),
    performance: { now: () => now }, ResizeObserver,
    ...(intersectionObserver ? { IntersectionObserver } : {}),
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    Image: class { constructor() { this.width = 800; this.height = 500; images.push(this); } },
    require(specifier) {
      if (specifier === 'react') return react;
      if (specifier === 'ogl') return ogl;
      if (specifier === 'three') return three;
      if (specifier.endsWith('.css')) return {};
      throw Error(`Unexpected unbundled dependency: ${specifier}`);
    },
  };
  Object.assign(window, { requestAnimationFrame: context.requestAnimationFrame, cancelAnimationFrame: context.cancelAnimationFrame });
  vm.runInNewContext(compiled.get(name), context);
  function render(next = renderProps) {
    renderProps = next;
    hookIndex = 0;
    module.exports.default(renderProps);
    while (pendingEffects.length) pendingEffects.shift()();
  }
  function intersect(visible) {
    for (const observer of intersectionObservers) {
      if (!observer.disconnected) observer.callback([...observer.targets].map(target => ({ target, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 })));
    }
  }
  render();
  intersect(true); // Deliver the browser's asynchronous initial observation.
  return {
    get uniforms() { return lastUniforms; },
    globalPointer(x = 200, y = 100) { window.emit('pointermove', { clientX: x, clientY: y }); },
    globalMouse(x = 200, y = 100) { window.emit('mousemove', { clientX: x, clientY: y }); },
    globalLeave() { window.emit('mouseleave'); },
    captureIntersection() { const observer = intersectionObservers.at(-1); return visible => observer?.callback([{ target: container, isIntersecting: visible }]); },
    get animations() { return animations; },
    hover(active) { container.emit(active ? 'mouseenter' : 'mouseleave'); },
    motionPreference(reduce) { media.matches = reduce; media.emit('change'); },
    get pending() { return frames.size; }, get draws() { return draws; },
    get sineCalls() { return sineCalls; }, get floorCalls() { return floorCalls; }, get paths() { return paths; },
    get lostContexts() { return lostContexts; },
    get targets() { return createdTargets; },
    get passes() { return passes; },
    get listenerCount() { return container.listenerCount + window.listenerCount + document.listenerCount + media.listenerCount; },
    get liveObservers() { return [...resizeObservers, ...intersectionObservers].filter(observer => !observer.disconnected).length; },
    get attachedCanvases() { return canvases.filter(canvas => canvas.parentElement).length; },
    get canvasSize() {
      const canvas = canvases.find(canvas => canvas.parentElement);
      return { width: canvas?.width, height: canvas?.height };
    },
    step(count = 1) {
      for (let i = 0; i < count; i++) {
        now += 1000 / 60;
        const callbacks = [...frames.entries()];
        for (const [id, callback] of callbacks) if (frames.delete(id)) callback(now);
      }
    },
    pointer(x = 500, y = 150) { container.emit('mousemove', { clientX: x, clientY: y }); },
    leave() { container.emit('mouseleave'); },
    resize(width = 900, height = 550) {
      container.offsetWidth = container.clientWidth = width;
      container.offsetHeight = container.clientHeight = height;
      for (const observer of resizeObservers) if (!observer.disconnected) observer.callback([{ target: container }]);
    },
    captureImageLoad() { const image = images.at(-1); const callback = image?.onload; return () => callback?.call(image); },
    captureResize() { const observer = resizeObservers.at(-1); return () => observer?.callback([{ target: container }]); },
    visibility(hidden) { document.hidden = hidden; document.emit('visibilitychange'); },
    intersect, render,
    cleanup() {
      for (const hook of hooks) hook?.cleanup?.();
      // React removes its own JSX canvas after passive cleanup. OGL canvases
      // are imperative children and must be removed by their component effect.
      if (canvas2d.parentElement) container.removeChild(canvas2d);
    },
  };
}

test('ElasticMesh settles without pointer input and stops scheduling and drawing', () => {
  const effect = mount('ElasticMesh');
  try {
    effect.step(500);
    assert.ok(effect.draws > 0, 'initial artwork must render');
    assert.equal(effect.pending, 0, 'settled artwork must have no scheduled frame');
    const draws = effect.draws;
    effect.step(120);
    assert.equal(effect.draws, draws, 'idle artwork must not redraw');
  } finally { effect.cleanup(); }
});

test('Prism with timeScale zero draws once and stays idle', () => {
  const effect = mount('Prism', { timeScale: 0, suspendWhenOffscreen: true });
  try {
    effect.step(500);
    assert.equal(effect.draws, 1, 'a static prism must render exactly one initial frame');
    assert.equal(effect.pending, 0);
  } finally { effect.cleanup(); }
});

test('SpecularButton without auto animation settles with no idle GPU draws', () => {
  const effect = mount('SpecularButton');
  try {
    effect.step(500);
    assert.ok(effect.draws > 0, 'the resting rim must remain visible');
    assert.equal(effect.pending, 0, 'an unlit button must not retain a permanent frame loop');
    const before = effect.draws;
    effect.step(120);
    assert.equal(effect.draws, before);
    effect.resize();
    effect.step(500);
    assert.ok(effect.draws > before, 'resize must redraw the resting rim');
    assert.equal(effect.pending, 0);
  } finally { effect.cleanup(); }
});

test('SpecularButton auto animation pauses offscreen and hidden and disposes cleanly', () => {
  const effect = mount('SpecularButton', { autoAnimate: true });
  try {
    effect.step(10);
    const before = effect.draws;
    effect.intersect(false);
    effect.resize();
    effect.step(100);
    assert.equal(effect.draws, before);
    assert.equal(effect.pending, 0);
    effect.intersect(true);
    effect.step(10);
    assert.ok(effect.draws > before);
    effect.visibility(true);
    const hidden = effect.draws;
    effect.step(100);
    assert.equal(effect.draws, hidden);
    effect.visibility(false);
    effect.step(10);
    assert.ok(effect.draws > hidden);
  } finally { effect.cleanup(); }
  assert.equal(effect.pending, 0);
  assert.equal(effect.liveObservers, 0);
  assert.equal(effect.listenerCount, 0);
  assert.equal(effect.attachedCanvases, 0);
  assert.equal(effect.lostContexts, 1);
});

test('ElasticMesh wakes on pointer movement and settles after leaving', () => {
  const effect = mount('ElasticMesh');
  try {
    effect.step(500);
    assert.equal(effect.pending, 0);
    const idleDraws = effect.draws;
    effect.pointer();
    effect.step(30);
    assert.ok(effect.draws > idleDraws, 'pointer movement must wake the artwork');
    effect.leave();
    effect.step(500);
    assert.equal(effect.pending, 0, 'released deformation must eventually settle');
    const settledDraws = effect.draws;
    effect.step(120);
    assert.equal(effect.draws, settledDraws);
  } finally { effect.cleanup(); }
});

test('ElasticMesh redraws after resize, image completion, and visual prop changes', () => {
  const props = { image: '/fixture-cover.webp' };
  const effect = mount('ElasticMesh', props);
  try {
    effect.step(500);
    assert.equal(effect.pending, 0);
    for (const [reason, wake] of [
      ['resize', () => effect.resize()],
      ['image completion', effect.captureImageLoad()],
      ['visual prop change', () => effect.render({ ...props, shading: 0.8 })],
    ]) {
      const before = effect.draws;
      wake();
      effect.step(500);
      assert.ok(effect.draws > before, `${reason} must invalidate a static artwork`);
      assert.equal(effect.pending, 0, `${reason} must not create a permanent loop`);
    }
  } finally { effect.cleanup(); }
});

test('ElasticMesh pauses offscreen, defers invalidations, and resumes onscreen', () => {
  const effect = mount('ElasticMesh', { image: '/fixture-cover.webp' });
  try {
    effect.pointer();
    effect.step(10);
    assert.ok(effect.draws > 0);
    effect.intersect(false);
    const before = effect.draws;
    effect.pointer(550, 200);
    effect.resize();
    effect.captureImageLoad()();
    effect.step(120);
    assert.equal(effect.pending, 0, 'offscreen invalidations must not schedule work');
    assert.equal(effect.draws, before);
    effect.intersect(true);
    effect.step(10);
    assert.ok(effect.draws > before, 'visible artwork must resume');
  } finally { effect.cleanup(); }
});

test('ElasticMesh releases its resources and ignores an already queued image callback after unmount', () => {
  const effect = mount('ElasticMesh', { image: '/fixture-cover.webp' });
  const lateLoad = effect.captureImageLoad();
  effect.step(1);
  const before = effect.draws;
  effect.cleanup();
  lateLoad();
  effect.pointer();
  effect.step(120);
  assert.equal(effect.pending, 0);
  assert.equal(effect.draws, before);
  assert.equal(effect.listenerCount, 0);
  assert.equal(effect.liveObservers, 0);
  assert.equal(effect.attachedCanvases, 0);
  assert.equal(effect.lostContexts, 1);
});

test('static Prism redraws once after resize without restarting idle work', () => {
  const effect = mount('Prism', { timeScale: 0, suspendWhenOffscreen: true });
  try {
    effect.step(500);
    assert.equal(effect.pending, 0);
    const before = effect.draws;
    effect.resize();
    effect.step(500);
    assert.equal(effect.draws, before + 1, 'resizing a static canvas needs one new frame');
    assert.equal(effect.pending, 0);
  } finally { effect.cleanup(); }
});

test('animated Prism stops offscreen and resumes without duplicate loops', () => {
  const effect = mount('Prism', { timeScale: 0.22, suspendWhenOffscreen: true });
  try {
    effect.step(5);
    assert.ok(effect.draws > 0);
    effect.intersect(false);
    const before = effect.draws;
    effect.resize();
    effect.step(120);
    assert.equal(effect.draws, before);
    assert.equal(effect.pending, 0);
    effect.intersect(true);
    effect.intersect(true);
    effect.step(5);
    assert.ok(effect.draws > before);
    assert.equal(effect.pending, 1, 'repeated visible notifications must share one loop');
  } finally { effect.cleanup(); }
  assert.equal(effect.pending, 0);
  assert.equal(effect.liveObservers, 0);
  assert.equal(effect.attachedCanvases, 0);
  assert.equal(effect.lostContexts, 1);
});

for (const name of ['ElasticMesh', 'Prism']) {
  test(`${name} remains usable when IntersectionObserver is unavailable`, () => {
    const effect = mount(name, name === 'Prism' ? { timeScale: 0, suspendWhenOffscreen: true } : {}, { intersectionObserver: false });
    try {
      effect.step(500);
      assert.ok(effect.draws > 0, 'missing visibility API must not prevent first render');
      assert.equal(effect.pending, 0);
    } finally { effect.cleanup(); }
  });
}

test('Prism bounds Retina and external-monitor canvas pixels on initialization and resize', () => {
  const effect = mount('Prism', { timeScale: 0 }, { width: 2096, height: 1392, dpr: 2 });
  try {
    function checkSize(width, height) {
      const actual = effect.canvasSize;
      assert.ok(actual.width > 0 && actual.height > 0, 'the canvas must remain drawable');
      assert.ok(actual.width * actual.height <= 500000, `background pixel budget exceeded: ${actual.width}×${actual.height}`);
      assert.ok(actual.width <= width && actual.height <= height, 'Retina must not increase background pixel density above 1');
      assert.ok(Math.abs(actual.width / actual.height - width / height) < 0.01, 'pixel reduction must preserve the viewport aspect ratio');
    }
    effect.step(2);
    checkSize(2096, 1392);
    for (const [width, height] of [[3840, 2160], [1440, 2560], [400, 300]]) {
      const before = effect.draws;
      effect.resize(width, height);
      effect.step(2);
      checkSize(width, height);
      assert.equal(effect.draws, before + 1, 'resizing must repaint the bounded buffer');
      assert.equal(effect.pending, 0);
    }
    assert.deepEqual(effect.canvasSize, { width: 400, height: 300 }, 'small canvases need no pixel reduction');
  } finally { effect.cleanup(); }
});

for (const name of ['ElasticMesh', 'Prism']) {
  test(`${name} stops while the document is hidden and resumes only if onscreen`, () => {
    const effect = mount(name, name === 'Prism' ? { timeScale: 0.22, suspendWhenOffscreen: true } : {});
    try {
      if (name === 'ElasticMesh') effect.pointer();
      effect.step(8);
      assert.ok(effect.draws > 0);
      effect.visibility(true);
      const before = effect.draws;
      effect.resize();
      effect.pointer(550, 200);
      effect.step(120);
      assert.equal(effect.pending, 0, 'hidden documents must not retain an animation frame');
      assert.equal(effect.draws, before, 'input and resize must not draw in a hidden document');
      effect.visibility(false);
      effect.step(8);
      assert.ok(effect.draws > before, 'showing an onscreen document must resume rendering');
      effect.intersect(false);
      const offscreen = effect.draws;
      effect.visibility(true);
      effect.visibility(false);
      effect.step(120);
      assert.equal(effect.draws, offscreen, 'showing the document must preserve offscreen suspension');
      assert.equal(effect.pending, 0);
    } finally { effect.cleanup(); }
    effect.visibility(false);
    effect.step(10);
    assert.equal(effect.pending, 0, 'unmounted effects must not restart on visibility events');
    assert.equal(effect.listenerCount, 0);
    assert.equal(effect.liveObservers, 0);
  });
}

test('ElectricBorder pauses offscreen and hidden, resumes, and ignores resize after unmount', () => {
  const effect = mount('ElectricBorder');
  const lateResize = effect.captureResize();
  try {
    effect.step(10);
    assert.ok(effect.draws > 0, 'visible border must stroke its animated path');
    for (const [reason, pause, resume] of [
      ['offscreen', () => effect.intersect(false), () => effect.intersect(true)],
      ['hidden document', () => effect.visibility(true), () => effect.visibility(false)],
    ]) {
      pause();
      const before = effect.draws;
      effect.resize();
      effect.step(120);
      assert.equal(effect.pending, 0, `${reason} border must not schedule frames`);
      assert.equal(effect.draws, before, `${reason} border must not stroke`);
      resume();
      effect.step(10);
      assert.ok(effect.draws > before, `border must resume after ${reason}`);
      assert.equal(effect.pending, 1);
    }
  } finally { effect.cleanup(); }
  const before = effect.draws;
  lateResize();
  effect.visibility(false);
  effect.step(120);
  assert.equal(effect.pending, 0);
  assert.equal(effect.draws, before);
  assert.equal(effect.listenerCount, 0);
  assert.equal(effect.liveObservers, 0);
  assert.equal(effect.attachedCanvases, 0);
});

test('ElectricBorder preserves its 640-sample path while bounding first-frame sine work', () => {
  const options = { width: 1800, height: 500, dpr: 2 };
  const effect = mount('ElectricBorder', {}, options);
  try {
    effect.step(2);
    assert.equal(effect.draws, 1);
    assert.equal(effect.paths[0].length, 641, 'retain all 640 segments, including the closing sample');
    assert.ok(effect.sineCalls < 5000, `first-frame sine budget exceeded: ${effect.sineCalls}`);
    // Captured from the unmodified component at commit 8c73d87, after the
    // first two 60 Hz ticks. A one-time execution compared all 641 old/new
    // coordinates exactly (old sine calls: 51304; cached: 2096). Keep a fixed
    // numeric baseline so CI neither needs Git history nor compares HEAD to
    // itself. Tolerances allow platform math rounding, not visual drift.
    const samples = [
      [0, 81.6138538605067, 51.40148162862364],
      [1, 93.53656320900964, 54.094360018447446],
      [128, 997.2633892069448, 57.818428748332614],
      [256, 1861.5504241621693, 118.37343151649917],
      [384, 1377.9319438017656, 560.6776017811488],
      [512, 464.75839417740605, 555.5775818298324],
      [640, 81.613853860507, 51.40148162862364],
    ];
    for (const [index, x, y] of samples) {
      assert.ok(Math.abs(effect.paths[0][index][0] - x) < 1e-8, `path X changed at sample ${index}`);
      assert.ok(Math.abs(effect.paths[0][index][1] - y) < 1e-8, `path Y changed at sample ${index}`);
    }
    const sums = effect.paths[0].reduce((totals, point, index) => [
      totals[0] + point[0], totals[1] + point[1],
      totals[2] + point[0] * (index + 1), totals[3] + point[1] * (index + 1),
    ], [0, 0, 0, 0]);
    const expected = [614486.441356541, 198486.35907780143, 175955545.990897, 83351418.22148266];
    sums.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < (index < 2 ? 1e-6 : 1e-3), `path aggregate ${index} changed`));
  } finally { effect.cleanup(); }
});

test('ElectricBorder caches spatial noise work instead of repeating it every frame', () => {
  const effect = mount('ElectricBorder', {}, { width: 1800, height: 500 });
  try {
    effect.step(4);
    const before = effect.floorCalls;
    const draws = effect.draws;
    effect.step(60);
    assert.ok(effect.draws > draws + 15, 'keep the existing animation cadence');
    assert.ok(effect.floorCalls - before < 1000, `repeated lattice decomposition: ${effect.floorCalls - before}`);
  } finally { effect.cleanup(); }
});

test('ShinyText delegates its sweep to a native timeline and suspends when invisible', () => {
  const props = { text: 'Music', speed: 2, delay: 1, yoyo: true, direction: 'right', pauseOnHover: true };
  const effect = mount('ShinyText', props);
  try {
    assert.equal(effect.pending, 0, 'a text sweep must not register a JavaScript animation loop');
    assert.equal(effect.animations.length, 1);
    const animation = effect.animations[0];
    assert.equal(animation.options.duration, 6000);
    assert.deepEqual(Array.from(animation.keyframes, frame => [frame.offset, frame.backgroundPosition]), [
      [0, '-50% center'], [1/3, '150% center'], [0.5, '150% center'], [5/6, '-50% center'], [1, '-50% center']
    ]);
    animation.currentTime = 1200;
    for (const [pause, resume] of [
      [() => effect.intersect(false), () => effect.intersect(true)],
      [() => effect.visibility(true), () => effect.visibility(false)],
      [() => effect.hover(true), () => effect.hover(false)],
      [() => effect.motionPreference(true), () => effect.motionPreference(false)],
      [() => effect.render({ ...props, disabled: true }), () => effect.render(props)],
    ]) {
      pause(); assert.equal(animation.playState, 'paused');
      resume(); assert.equal(animation.playState, 'running');
      assert.equal(animation.currentTime, 1200, 'pause/resume must preserve the current sweep');
    }
    effect.intersect(false);
    effect.visibility(true); effect.visibility(false);
    assert.equal(animation.playState, 'paused', 'a visible tab must not restart an offscreen label');
  } finally { effect.cleanup(); }
  assert.equal(effect.animations[0].playState, 'idle');
  assert.equal(effect.listenerCount, 0);
  assert.equal(effect.liveObservers, 0);
});

test('ShinyText avoids an invisible timeline when the text and shine colors match', () => {
  const effect = mount('ShinyText', { text: 'Client', color: '#FFFFFF', shineColor: '#FFFFFF' });
  try {
    assert.equal(effect.pending, 0);
    assert.equal(effect.animations.length, 0);
  } finally { effect.cleanup(); }
});

test('SpecularButton keeps proximity brightness when angle tracking is disabled', () => {
  const effect = mount('SpecularButton', { followMouse: false });
  try {
    effect.step(500);
    effect.globalPointer(); effect.step(100);
    assert.ok(effect.uniforms.uIntensity.value > 0, 'hover proximity must still light the rim');
    effect.globalLeave(); effect.step(500);
    assert.equal(effect.uniforms.uIntensity.value, 0);
    assert.equal(effect.pending, 0);
  } finally { effect.cleanup(); }
});

test('ShinyText ignores already queued observer deliveries after unmount', () => {
  const effect = mount('ShinyText', { text: 'Music' });
  const lateIntersection = effect.captureIntersection();
  effect.cleanup();
  lateIntersection(true);
  assert.equal(effect.animations[0].playState, 'idle', 'a released native timeline must never restart');
});

test('FloatingLines keeps its motion and pointer response with a bounded backing buffer', () => {
  const effect = mount('FloatingLines', { maxFps: 30 }, { width: 3840, height: 2160, dpr: 2 });
  try {
    effect.globalPointer(1920, 1080);
    effect.step(60);
    assert.ok(effect.draws >= 28 && effect.draws <= 31, 'retain the 30 fps motion budget');
    assert.ok(effect.canvasSize.width * effect.canvasSize.height <= 2000000);
    assert.ok(effect.uniforms.bendInfluence.value > 0, 'retain cursor bending');
    effect.intersect(false);
    const draws = effect.draws;
    effect.globalPointer(300, 250);
    effect.step(60);
    assert.equal(effect.draws, draws);
    assert.equal(effect.pending, 0);
    effect.intersect(true);
    effect.step(2);
    assert.ok(effect.draws > draws);
  } finally { effect.cleanup(); }
  assert.equal(effect.lostContexts, 1);
  assert.equal(effect.listenerCount, 0);
});

test('LiquidEther retains the full fluid solve and only draws force when the pointer moves', () => {
  const effect = mount('LiquidEther', {
    autoDemo: false, iterationsPoisson: 16, resolution: 0.34, BFECC: false,
  }, { width: 1920, height: 1080, dpr: 2 });
  const lateResize = effect.captureResize();
  try {
    effect.step();
    assert.equal(effect.draws, 1);
    assert.equal(effect.targets, 5, 'viscosity is off; skip its two render targets');
    assert.equal(effect.passes.length, 19, 'retain advection, divergence, all pressure iterations and projection');
    const scalarPasses = effect.passes.filter(pass => pass.format === THREE.RedFormat);
    assert.equal(scalarPasses.length, 17, 'divergence and pressure only need one channel');
    assert.ok(effect.canvasSize.width * effect.canvasSize.height <= 2000000);
    effect.globalMouse(1295, 652);
    effect.step();
    assert.equal(effect.passes.length, 39, 'pointer motion adds the force pass');
    effect.visibility(true);
    effect.step(60);
    assert.equal(effect.draws, 2);
    assert.equal(effect.pending, 0);
  } finally { effect.cleanup(); }
  lateResize();
  effect.visibility(false);
  effect.step(2);
  assert.equal(effect.draws, 2);
  assert.equal(effect.lostContexts, 1);
  assert.equal(effect.listenerCount, 0);
  assert.equal(effect.liveObservers, 0);
});
