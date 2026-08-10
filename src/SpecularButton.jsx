import { useEffect, useRef } from 'react';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import './SpecularButton.css';

const PAD = 20;
const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;
const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter, uHalfSize;
uniform float uRadius, uAngle, uPx, uIntensity, uShineSize, uShineFade, uThickness, uBaseWidth;
uniform vec3 uLineColor, uBaseColor;
out vec4 fragColor;
float roundedRect(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float gaussian(float d, float sigma) { float x = d / (sigma + 1e-6); return exp(-mix(1.0, 1.6, smoothstep(0.0, 1.5, x)) * x * x); }
void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = roundedRect(p, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(normal, light)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float edge = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float shine = gaussian(d, uThickness) * rim * edge * uIntensity;
  float alpha = clamp(base + shine, 0.0, 1.0);
  fragColor = vec4(uBaseColor * base + uLineColor * shine, alpha);
}
`;

export default function SpecularButton({
  children = '播放', onClick, className = '', size = 'lg', radius = 18,
  tint = 'rgba(255,255,255,0.08)', tintOpacity = 0, blur = 0, textColor = '#f5f5f5',
  lineColor = '#ffffff', baseColor = '#525252', intensity = 1,
  shineSize = 10, shineFade = 40, thickness = 1, speed = 0.35,
  followMouse = true, proximity = 250, autoAnimate = false
}) {
  const buttonRef = useRef(null);
  const effectRef = useRef(null);
  const propsRef = useRef({ radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate });
  propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

  useEffect(() => {
    const button = buttonRef.current;
    const effect = effectRef.current;
    if (!button || !effect) return undefined;
    const dpr = window.devicePixelRatio || 1;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;
    const program = new Program(gl, { vertex: VERTEX, fragment: FRAGMENT, uniforms: {
      uCenter: { value: [0, 0] }, uHalfSize: { value: [1, 1] }, uRadius: { value: 0 }, uAngle: { value: 2.4 }, uPx: { value: dpr },
      uLineColor: { value: [1, 1, 1] }, uBaseColor: { value: [0.32, 0.32, 0.32] }, uIntensity: { value: 1 }, uShineSize: { value: 0.17 },
      uShineFade: { value: 0.7 }, uThickness: { value: 1 }, uBaseWidth: { value: dpr }
    }});
    const mesh = new Mesh(gl, { geometry, program });
    effect.appendChild(gl.canvas);
    const sizeRef = { width: 1, height: 1 };
    const resize = () => {
      const rect = button.getBoundingClientRect();
      sizeRef.width = rect.width; sizeRef.height = rect.height;
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2);
      program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr];
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr];
    };
    const observer = new ResizeObserver(resize);
    observer.observe(button); resize();
    let pointerAngle = null; let proximityT = 0;
    const onPointerMove = event => {
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2; const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
      const distance = Math.hypot(dx, dy);
      pointerAngle = distance === 0 ? Math.atan2(2 / rect.height, -2 / rect.width) + ((event.clientX - cx) / (rect.width / 2)) * 0.3 + ((cy - event.clientY) / (rect.height / 2)) * 0.15 : Math.atan2(cy - event.clientY, event.clientX - cx);
      const t = Math.max(0, 1 - distance / Math.max(propsRef.current.proximity, 1));
      proximityT = t * t * (3 - 2 * t);
    };
    window.addEventListener('pointermove', onPointerMove);
    let angle = 2.4; let idleAngle = 2.4; let brightness = 0; let last = performance.now(); let frame = 0;
    const line = new Color(); const base = new Color();
    const update = now => {
      frame = requestAnimationFrame(update);
      const dt = Math.min((now - last) / 1000, 0.05); last = now; const props = propsRef.current;
      idleAngle += props.speed * dt;
      const target = props.followMouse && pointerAngle !== null && (!props.autoAnimate || proximityT > 0) ? pointerAngle : idleAngle;
      const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * 7));
      const brightTarget = props.autoAnimate ? 1 : proximityT;
      brightness += (brightTarget - brightness) * (1 - Math.exp(-dt * 8));
      line.set(props.lineColor); base.set(props.baseColor);
      program.uniforms.uAngle.value = angle; program.uniforms.uRadius.value = Math.min(props.radius, Math.min(sizeRef.width, sizeRef.height) / 2) * dpr;
      program.uniforms.uLineColor.value = [line.r, line.g, line.b]; program.uniforms.uBaseColor.value = [base.r, base.g, base.b];
      program.uniforms.uIntensity.value = props.intensity * brightness; program.uniforms.uShineSize.value = (props.shineSize * Math.PI) / 180;
      program.uniforms.uShineFade.value = (props.shineFade * Math.PI) / 180; program.uniforms.uThickness.value = props.thickness * dpr;
      renderer.render({ scene: mesh });
    };
    frame = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('pointermove', onPointerMove); if (gl.canvas.parentNode === effect) effect.removeChild(gl.canvas); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
  }, []);

  return <button ref={buttonRef} type="button" className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`} onClick={onClick}
    style={{ '--sb-radius': `${radius}px`, '--sb-tint': tint, '--sb-tint-opacity': tintOpacity, '--sb-blur': `${blur}px`, '--sb-text-color': textColor }}>
    <span ref={effectRef} className="specular-button__fx" aria-hidden="true" />
    <span className="specular-button__label">{children}</span>
  </button>;
}
