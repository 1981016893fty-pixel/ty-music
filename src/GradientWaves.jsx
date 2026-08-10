import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';
import './GradientWaves.css';

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  if (!result) return [1, 1, 1];
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uParallax;
uniform bool uEnableMouse;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;
const float MAX_DIST = 20000.0;
float hash21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float plasma(vec3 r, vec2 freq, vec4 tc) { float mx = r.x + tc.x; mx += uSwell * sin((r.y + mx) / 20.0 + tc.y); float my = r.y - tc.z; my += uTurbulence * cos(r.x / 23.0 + tc.w); return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight); }
float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) { float dist = 0.0; for (int i = 0; i < 128; i++) { if (float(i) >= uSteps) break; float dscene = plasma(pos + dist * dir, freq, tc); if (abs(dscene) < 0.1) break; dist += 0.9 * dscene; if (!(abs(dist) < MAX_DIST)) return MAX_DIST; } return dist; }
void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s, vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y; uv.y *= -1.0;
  vec3 dir = vec3(0.0, 0.0, -1.0); float ulen = length(uv); float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot); dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0); c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt); dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;
  if (uEnableMouse) { float yaw = (uMouse.x - 0.5) * uParallax * 0.4; float pitch = (uMouse.y - 0.5) * uParallax * 0.4; c = cos(yaw); s = sin(yaw); dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir; c = cos(pitch); s = sin(pitch); dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir; }
  float dist = raymarch(cam, dir, freq, tc); vec3 pos = cam + dist * dir;
  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0); vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0)); vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness; col = clamp(col, 0.0, 1.0); float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) { float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0); alpha += (g - 0.5) * uGrainIntensity; }
  alpha = clamp(alpha, 0.0, 1.0); fragColor = vec4(col * alpha, alpha);
}
`;

const detailToSteps = detail => detail === 'low' ? 40 : detail === 'high' ? 110 : 70;

export default function GradientWaves({
  horizonColor = '#141125', waveColor = '#6d46ff', crestColor = '#ffd2f6', speed = 0.34,
  amplitude = 2.5, waveScale = 0.6, waveRatio = 0.9, swell = 35, turbulence = 20,
  tilt = 1.11, zoom = 1, height = 5.5, fogDepth = 15, detail = 'medium', brightness = 0.92,
  opacity = 0.78, mouseInteraction = false, parallaxStrength = 0.5, grain = true, grainIntensity = 0.035
}) {
  const containerRef = useRef(null);
  const mouseEnabled = useRef(mouseInteraction);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none';
    container.appendChild(canvas);
    const geometry = new Triangle(gl);
    const program = new Program(gl, { vertex, fragment, uniforms: {
      iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uSpeed: { value: speed }, uAmplitude: { value: amplitude },
      uWaveScale: { value: waveScale }, uWaveRatio: { value: waveRatio }, uSwell: { value: swell }, uTurbulence: { value: turbulence },
      uTilt: { value: tilt }, uZoom: { value: zoom }, uHeight: { value: height }, uFogDepth: { value: fogDepth }, uSteps: { value: detailToSteps(detail) },
      uBrightness: { value: brightness }, uOpacity: { value: opacity }, uGrain: { value: grain ? 1 : 0 }, uGrainIntensity: { value: grainIntensity },
      uMouse: { value: new Float32Array([0.5, 0.5]) }, uParallax: { value: parallaxStrength }, uEnableMouse: { value: mouseInteraction },
      uHorizonColor: { value: new Float32Array(hexToRgb(horizonColor)) }, uWaveColor: { value: new Float32Array(hexToRgb(waveColor)) }, uCrestColor: { value: new Float32Array(hexToRgb(crestColor)) }
    }});
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => { const rect = container.getBoundingClientRect(); renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height)); const r = program.uniforms.iResolution.value; r[0] = gl.drawingBufferWidth; r[1] = gl.drawingBufferHeight; };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    const current = [0.5, 0.5], target = [0.5, 0.5];
    const onMove = event => { const rect = canvas.getBoundingClientRect(); target[0] = (event.clientX - rect.left) / rect.width; target[1] = 1 - (event.clientY - rect.top) / rect.height; };
    const onLeave = () => { target[0] = 0.5; target[1] = 0.5; };
    if (mouseInteraction) { window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('pointerleave', onLeave); }
    let raf = 0, pageVisible = !document.hidden, active = true, start = performance.now();
    const isLibraryPage = () => document.querySelector('#page-local.active, #page-playlists.active');
    const loop = time => { if (!active || !pageVisible || !isLibraryPage()) { raf = 0; return; } program.uniforms.iTime.value = (time - start) * 0.001; const tx = mouseEnabled.current ? target[0] : 0.5; const ty = mouseEnabled.current ? target[1] : 0.5; current[0] += 0.05 * (tx - current[0]); current[1] += 0.05 * (ty - current[1]); program.uniforms.uMouse.value[0] = current[0]; program.uniforms.uMouse.value[1] = current[1]; renderer.render({ scene: mesh }); raf = requestAnimationFrame(loop); };
    const startLoop = () => { if (!raf && pageVisible && isLibraryPage()) raf = requestAnimationFrame(loop); };
    const observer = new MutationObserver(startLoop); observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
    const onVisibility = () => { pageVisible = !document.hidden; pageVisible ? startLoop() : (raf && cancelAnimationFrame(raf), raf = 0); };
    document.addEventListener('visibilitychange', onVisibility); startLoop();
    return () => { active = false; if (raf) cancelAnimationFrame(raf); ro.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); if (mouseInteraction) { window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerleave', onLeave); } canvas.remove(); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, []);

  return <div ref={containerRef} className="gradient-waves-container" aria-hidden="true" />;
}
