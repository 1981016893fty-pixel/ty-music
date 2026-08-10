import { useEffect, useRef } from 'react';
import './SplashCursor.css';

// React Bits SplashCursor, scoped to the browse surface so it never owns the page.
export default function SplashCursor({ active = true }) {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !active) return undefined;
    const canvas = document.createElement('canvas');
    canvas.className = 'splash-cursor__canvas';
    host.appendChild(canvas);

    const gl = canvas.getContext('webgl2', { alpha: true, antialias: false }) || canvas.getContext('webgl', { alpha: true, antialias: false });
    if (!gl) return () => canvas.remove();

    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    const halfFloat = isWebGL2 ? gl.HALF_FLOAT : gl.getExtension('OES_texture_half_float')?.HALF_FLOAT_OES;
    const linear = isWebGL2 ? gl.getExtension('OES_texture_float_linear') : gl.getExtension('OES_texture_half_float_linear');
    if (!halfFloat) return () => canvas.remove();
    if (isWebGL2) gl.getExtension('EXT_color_buffer_float');

    const vertex = `attribute vec2 a; varying vec2 v; void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
    const splat = `precision highp float; varying vec2 v; uniform sampler2D t; uniform vec2 p; uniform float aspect; uniform vec3 c; uniform float r; void main(){vec2 q=v-p;q.x*=aspect;vec3 s=exp(-dot(q,q)/r)*c;gl_FragColor=vec4(texture2D(t,v).rgb+s,1.);}`;
    const advect = `precision highp float; varying vec2 v; uniform sampler2D u,vv; uniform vec2 texel; uniform float dt,d; void main(){vec2 p=v-dt*texture2D(vv,v).xy*texel;gl_FragColor=texture2D(u,p)/(1.+d*dt);}`;
    const display = `precision highp float; varying vec2 v; uniform sampler2D t; void main(){vec3 c=texture2D(t,v).rgb;gl_FragColor=vec4(c,max(c.r,max(c.g,c.b)));}`;
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'SplashCursor shader compile failed');
      return shader;
    };
    const program = source => {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, source));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'SplashCursor program link failed');
      return p;
    };

    let splatProgram;
    let advectionProgram;
    let displayProgram;
    try {
      splatProgram = program(splat);
      advectionProgram = program(advect);
      displayProgram = program(display);
    } catch (error) {
      console.warn(error);
      return () => canvas.remove();
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const resources = [];
    const bindQuad = p => {
      gl.useProgram(p);
      const location = gl.getAttribLocation(p, 'a');
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    };
    const textureType = halfFloat;
    const format = gl.RGBA;
    const internal = isWebGL2 ? gl.RGBA16F : gl.RGBA;
    const makeTarget = (width, height) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, textureType, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      resources.push(texture, fbo);
      return { texture, fbo, width, height };
    };

    let dye = null;
    let velocity = null;
    const disposeTargets = () => {
      resources.splice(0).forEach(resource => {
        if (resource instanceof WebGLTexture) gl.deleteTexture(resource);
        else gl.deleteFramebuffer(resource);
      });
    };
    const resize = () => {
      // This is an ambient effect; a 1x simulation keeps browsing responsive
      // on high-density screens without changing the visual footprint.
      const scale = 1;
      const width = Math.max(1, Math.floor(host.clientWidth * scale));
      const height = Math.max(1, Math.floor(host.clientHeight * scale));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      disposeTargets();
      const ratio = width / height;
      const dyeHeight = Math.min(384, Math.max(128, Math.round(360 * scale)));
      const dyeWidth = Math.round(dyeHeight * ratio);
      const simHeight = Math.min(80, Math.max(48, Math.round(72 * scale)));
      const simWidth = Math.round(simHeight * ratio);
      dye = [makeTarget(dyeWidth, dyeHeight), makeTarget(dyeWidth, dyeHeight)];
      velocity = [makeTarget(simWidth, simHeight), makeTarget(simWidth, simHeight)];
      gl.clearColor(0, 0, 0, 0);
      [...dye, ...velocity].forEach(target => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        gl.viewport(0, 0, target.width, target.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
    };
    const draw = (p, target, uniforms) => {
      bindQuad(p);
      Object.entries(uniforms).forEach(([name, value]) => {
        const location = gl.getUniformLocation(p, name);
        if (!location) return;
        if (typeof value === 'number') gl.uniform1f(location, value);
        else if (value.length === 2) gl.uniform2f(location, value[0], value[1]);
        else if (value.length === 3) gl.uniform3f(location, value[0], value[1], value[2]);
        else if (value.texture) {
          const unit = value.unit || 0;
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, value.texture);
          gl.uniform1i(location, unit);
        }
      });
      gl.bindFramebuffer(gl.FRAMEBUFFER, target?.fbo || null);
      gl.viewport(0, 0, target?.width || canvas.width, target?.height || canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const hue = h => {
      const i = Math.floor(h * 6);
      const f = h * 6 - i;
      const q = 1 - f;
      return [[1, f, 0], [q, 1, 0], [0, 1, f], [0, q, 1], [f, 0, 1], [1, 0, q]][i % 6].map(value => value * 0.16);
    };
    let frame = 0;
    let running = false;
    let lastInputAt = 0;
    const pointer = { x: 0.5, y: 0.5, lastX: 0.5, lastY: 0.5, dx: 0, dy: 0, moved: false, hue: 0 };
    const requestTick = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    };
    const handleMove = event => {
      if (!document.querySelector('#page-search')?.classList.contains('active')) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height || event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      pointer.lastX = pointer.x;
      pointer.lastY = pointer.y;
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
      pointer.dx = pointer.x - pointer.lastX;
      pointer.dy = pointer.y - pointer.lastY;
      // Ignore click/focus jitter. SplashCursor only splats after a real drag.
      pointer.moved = Math.abs(pointer.dx) + Math.abs(pointer.dy) > 0.004;
      pointer.hue = (pointer.hue + 0.008) % 1;
      if (pointer.moved) {
        lastInputAt = performance.now();
        requestTick();
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    window.addEventListener('pointermove', handleMove, { passive: true });
    let last = performance.now();
    const tick = now => {
      const browseActive = document.querySelector('#page-search')?.classList.contains('active');
      canvas.style.display = browseActive ? 'block' : 'none';
      if (!browseActive) {
        running = false;
        frame = 0;
        return;
      }
      resize();
      if (!dye || !velocity) return;
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      if (pointer.moved) {
        const force = 1150;
        const color = hue(pointer.hue);
        draw(splatProgram, velocity[1], { t: velocity[0], p: [pointer.x, pointer.y], aspect: canvas.width / canvas.height, c: [pointer.dx * force, pointer.dy * force, 0], r: 0.0011 });
        [velocity[0], velocity[1]] = [velocity[1], velocity[0]];
        draw(splatProgram, dye[1], { t: dye[0], p: [pointer.x, pointer.y], aspect: canvas.width / canvas.height, c: color, r: 0.00165 });
        [dye[0], dye[1]] = [dye[1], dye[0]];
        pointer.moved = false;
      }
      draw(advectionProgram, velocity[1], { u: velocity[0], vv: velocity[0], texel: [1 / velocity[0].width, 1 / velocity[0].height], dt, d: 1.8 });
      [velocity[0], velocity[1]] = [velocity[1], velocity[0]];
      draw(advectionProgram, dye[1], { u: dye[0], vv: { ...velocity[0], unit: 1 }, texel: [1 / velocity[0].width, 1 / velocity[0].height], dt, d: 4.8 });
      [dye[0], dye[1]] = [dye[1], dye[0]];
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      draw(displayProgram, null, { t: dye[0] });
      gl.disable(gl.BLEND);
      if (now - lastInputAt < 850) {
        frame = requestAnimationFrame(tick);
      } else {
        // Avoid a permanent WebGL render loop after the trail has dissipated.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        running = false;
        frame = 0;
      }
    };
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', handleMove);
      disposeTargets();
      gl.deleteBuffer(quad);
      [splatProgram, advectionProgram, displayProgram].forEach(item => gl.deleteProgram(item));
      canvas.remove();
    };
  }, [active]);

  return <div ref={hostRef} className="splash-cursor" aria-hidden="true" />;
}
