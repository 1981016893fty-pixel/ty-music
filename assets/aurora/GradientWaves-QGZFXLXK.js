import{b as M,c as R,d as A,g as F}from"./chunk-O2GBFF22.js";import{c as d,e as U,f as S}from"./chunk-D555T6QT.js";var l=d(U());var W=d(S()),p=a=>{let r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a||"");return r?[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]:[1,1,1]},V=`#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,j=`#version 300 es
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
`,ee=a=>a==="low"?40:a==="high"?110:70;function oe({horizonColor:a="#141125",waveColor:r="#6d46ff",crestColor:z="#ffd2f6",speed:E=.34,amplitude:q=2.5,waveScale:B=.6,waveRatio:G=.9,swell:_=35,turbulence:H=20,tilt:P=1.11,zoom:D=1,height:I=5.5,fogDepth:L=15,detail:O="medium",brightness:X=.92,opacity:k=.78,mouseInteraction:s=!1,parallaxStrength:Z=.5,grain:N=!0,grainIntensity:Y=.035}){let h=(0,l.useRef)(null),g=(0,l.useRef)(s);return(0,l.useEffect)(()=>{let c=h.current;if(!c)return;let v=new R({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)}),o=v.gl;o.clearColor(0,0,0,0);let f=o.canvas;f.style.cssText="width:100%;height:100%;display:block;pointer-events:none",c.appendChild(f);let $=new F(o),u=new M(o,{vertex:V,fragment:j,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:E},uAmplitude:{value:q},uWaveScale:{value:B},uWaveRatio:{value:G},uSwell:{value:_},uTurbulence:{value:H},uTilt:{value:P},uZoom:{value:D},uHeight:{value:I},uFogDepth:{value:L},uSteps:{value:ee(O)},uBrightness:{value:X},uOpacity:{value:k},uGrain:{value:N?1:0},uGrainIntensity:{value:Y},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:Z},uEnableMouse:{value:s},uHorizonColor:{value:new Float32Array(p(a))},uWaveColor:{value:new Float32Array(p(r))},uCrestColor:{value:new Float32Array(p(z))}}}),J=new A(o,{geometry:$,program:u}),x=()=>{let t=c.getBoundingClientRect();v.setSize(Math.max(1,t.width),Math.max(1,t.height));let e=u.uniforms.iResolution.value;e[0]=o.drawingBufferWidth,e[1]=o.drawingBufferHeight},y=new ResizeObserver(x);y.observe(c),x();let i=[.5,.5],n=[.5,.5],w=t=>{let e=f.getBoundingClientRect();n[0]=(t.clientX-e.left)/e.width,n[1]=1-(t.clientY-e.top)/e.height},T=()=>{n[0]=.5,n[1]=.5};s&&(window.addEventListener("pointermove",w,{passive:!0}),window.addEventListener("pointerleave",T));let m=0,C=!0,K=performance.now(),b=t=>{if(!C)return;u.uniforms.iTime.value=(t-K)*.001;let e=g.current?n[0]:.5,Q=g.current?n[1]:.5;i[0]+=.05*(e-i[0]),i[1]+=.05*(Q-i[1]),u.uniforms.uMouse.value[0]=i[0],u.uniforms.uMouse.value[1]=i[1],v.render({scene:J}),m=requestAnimationFrame(b)};return m=requestAnimationFrame(b),()=>{C=!1,cancelAnimationFrame(m),y.disconnect(),s&&(window.removeEventListener("pointermove",w),window.removeEventListener("pointerleave",T)),f.remove(),o.getExtension("WEBGL_lose_context")?.loseContext()}},[]),(0,W.jsx)("div",{ref:h,className:"gradient-waves-container","aria-hidden":"true"})}export{oe as default};
