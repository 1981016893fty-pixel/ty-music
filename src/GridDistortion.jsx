import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './GridDistortion.css';

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}`;

const GridDistortion = ({ grid = 15, mouse = 0.1, strength = 0.15, relaxation = 0.9, imageSrc, className = '' }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planeRef = useRef(null);
  const imageAspectRef = useRef(1);
  const animationIdRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const textureUpdateRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let disposed = false;

    const wake = () => {
      if (!disposed && animationIdRef.current === null) animationIdRef.current = requestAnimationFrame(animate);
    };

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power'
    });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;
    cameraRef.current = camera;

    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector4() },
      uTexture: { value: null },
      uDataTexture: { value: null }
    };

    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
      data[i * 4] = Math.random() * 255 - 125;
      data[i * 4 + 1] = Math.random() * 255 - 125;
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const plane = new THREE.Mesh(geometry, material);
    planeRef.current = plane;
    scene.add(plane);

    const handleResize = () => {
      if (disposed) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const containerAspect = width / height;

      renderer.setSize(width, height);

      if (plane) {
        plane.scale.set(containerAspect, 1, 1);
      }

      const frustumHeight = 1;
      const frustumWidth = frustumHeight * containerAspect;
      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      uniforms.resolution.value.set(width, height, 1, 1);
      wake();
    };

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
      resizeObserverRef.current = resizeObserver;
    } else {
      window.addEventListener('resize', handleResize);
    }

    const mouseState = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      vX: 0,
      vY: 0,
      pointerInside: false
    };

    const resetMouseState = () => {
      Object.assign(mouseState, {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0,
        pointerInside: false
      });
    };

    const handleMouseMove = e => {
      const fullscreenPlayer = document.getElementById('ampFullscreenPlayer');
      if (fullscreenPlayer && !fullscreenPlayer.classList.contains('show')) {
        resetMouseState();
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        resetMouseState();
        return;
      }

      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;

      // Window-level pointer tracking is needed because the content sits above
      // the canvas. Ignore coordinates outside the active fullscreen surface.
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        resetMouseState();
        return;
      }

      if (!mouseState.pointerInside) {
        Object.assign(mouseState, {
          x,
          y,
          prevX: x,
          prevY: y,
          vX: 0,
          vY: 0,
          pointerInside: true
        });
        return;
      }

      mouseState.vX = x - mouseState.prevX;
      mouseState.vY = y - mouseState.prevY;
      Object.assign(mouseState, { x, y, prevX: x, prevY: y });
      if (mouseState.vX || mouseState.vY) wake();
    };

    const handleMouseLeave = () => {
      resetMouseState();
    };

    // The fullscreen content sits above the canvas, so receive pointer motion
    // from the window while retaining the official distortion algorithm.
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('blur', handleMouseLeave);
    document.addEventListener('visibilitychange', handleMouseLeave);

    const fullscreenPlayer = document.getElementById('ampFullscreenPlayer');
    const fullscreenObserver = fullscreenPlayer && new MutationObserver(() => {
      if (!fullscreenPlayer.classList.contains('show')) handleMouseLeave();
    });
    fullscreenObserver?.observe(fullscreenPlayer, { attributes: true, attributeFilter: ['class', 'style'] });

    let lastDrawAt;
    function animate(now) {
      animationIdRef.current = null;
      if (disposed) return;

      uniforms.time.value += 0.05;
      const frameMs = 1000 / 60;
      const decay = relaxation ** (lastDrawAt == null ? 1 : Math.max(1, (now - lastDrawAt) / frameMs));
      lastDrawAt = now;

      const data = dataTexture.image.data;
      let peak = 0;
      let changed = false;
      for (let i = 0; i < size * size; i++) {
        changed ||= data[i * 4] !== 0 || data[i * 4 + 1] !== 0;
        data[i * 4] *= decay;
        data[i * 4 + 1] *= decay;
        peak = Math.max(peak, Math.abs(data[i * 4]), Math.abs(data[i * 4 + 1]));
      }

      const gridMouseX = size * mouseState.x;
      const gridMouseY = size * mouseState.y;
      const maxDist = size * mouse;

      if (mouseState.vX !== 0 || mouseState.vY !== 0) {
        for (let i = Math.max(0, Math.ceil(gridMouseX - maxDist)); i <= Math.min(size - 1, gridMouseX + maxDist); i++) {
          for (let j = Math.max(0, Math.ceil(gridMouseY - maxDist)); j <= Math.min(size - 1, gridMouseY + maxDist); j++) {
            const distSq = (gridMouseX - i) ** 2 + (gridMouseY - j) ** 2;
            if (distSq < maxDist * maxDist) {
              const index = 4 * (i + size * j);
              const power = Math.min(maxDist / Math.sqrt(distSq), 10);
              data[index] += strength * 100 * mouseState.vX * power;
              data[index + 1] -= strength * 100 * mouseState.vY * power;
              peak = Math.max(peak, Math.abs(data[index]), Math.abs(data[index + 1]));
              changed = true;
            }
          }
        }
      }

      // Consume each pointer delta once. Without this reset the last hover
      // keeps injecting force into one grid cell forever.
      mouseState.vX = 0;
      mouseState.vY = 0;
      // At this amplitude the UV displacement is below 0.00002 (0.04px at
      // 2000px). Snap to the undistorted image rather than drawing forever.
      const settled = peak < 0.001;
      if (settled && changed) data.fill(0);
      if (changed) dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
      if (!settled && relaxation !== 1) wake();
      else lastDrawAt = undefined;
    }

    const textureLoader = new THREE.TextureLoader();
    let pendingTexture;
    textureUpdateRef.current = source => {
      pendingTexture?.dispose();
      const candidate = textureLoader.load(source, texture => {
        if (disposed || pendingTexture !== texture) return;
        pendingTexture = null;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        imageAspectRef.current = texture.image.width / texture.image.height;
        uniforms.uTexture.value?.dispose();
        uniforms.uTexture.value = texture;
        wake();
      }, undefined, () => {
        if (pendingTexture === candidate) {
          pendingTexture = null;
          candidate.dispose();
        }
      });
      pendingTexture = candidate;
    };

    handleResize();

    return () => {
      disposed = true;
      textureUpdateRef.current = null;
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      } else {
        window.removeEventListener('resize', handleResize);
      }

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleMouseLeave);
      fullscreenObserver?.disconnect();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (dataTexture) dataTexture.dispose();
      pendingTexture?.dispose();
      pendingTexture = null;
      uniforms.uTexture.value?.dispose();

      sceneRef.current = null;
      rendererRef.current = null;
      cameraRef.current = null;
      planeRef.current = null;
    };
  }, [grid, mouse, strength, relaxation]);
  useEffect(() => {
    textureUpdateRef.current?.(imageSrc);
  }, [grid, mouse, strength, relaxation, imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`distortion-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minWidth: '0',
        minHeight: '0'
      }}
    />
  );
};

export default GridDistortion;
