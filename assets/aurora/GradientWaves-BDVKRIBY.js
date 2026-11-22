import{b as M,c as R,d as F,f as W}from"./chunk-BRQDMJ6T.js";import{a as V,b as A}from"./chunk-Y4TZAYY2.js";import{d}from"./chunk-LN3IJP7D.js";var l=d(V());var z=d(A()),p=a=>{let r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a||"");return r?[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]:[1,1,1]},j=`#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`,ee=`#version 300 es
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
`,oe=a=>a==="low"?40:a==="high"?110:70;function te({horizonColor:a="#141125",waveColor:r="#6d46ff",crestColor:E="#ffd2f6",speed:q=.34,amplitude:B=2.5,waveScale:G=.6,waveRatio:_=.9,swell:D=35,turbulence:H=20,tilt:I=1.11,zoom:L=1,height:P=5.5,fogDepth:O=15,detail:X="medium",brightness:k=.92,opacity:Z=.78,mouseInteraction:s=!1,parallaxStrength:N=.5,grain:Y=!0,grainIntensity:$=.035}){let h=(0,l.useRef)(null),g=(0,l.useRef)(s);return(0,l.useEffect)(()=>{let c=h.current;if(!c)return;let v=new R({webgl:2,alpha:!0,premultipliedAlpha:!0,antialias:!1,dpr:1}),t=v.gl;t.clearColor(0,0,0,0);let f=t.canvas;f.style.cssText="width:100%;height:100%;display:block;pointer-events:none",c.appendChild(f);let J=new W(t),u=new M(t,{vertex:j,fragment:ee,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uSpeed:{value:q},uAmplitude:{value:B},uWaveScale:{value:G},uWaveRatio:{value:_},uSwell:{value:D},uTurbulence:{value:H},uTilt:{value:I},uZoom:{value:L},uHeight:{value:P},uFogDepth:{value:O},uSteps:{value:oe(X)},uBrightness:{value:k},uOpacity:{value:Z},uGrain:{value:Y?1:0},uGrainIntensity:{value:$},uMouse:{value:new Float32Array([.5,.5])},uParallax:{value:N},uEnableMouse:{value:s},uHorizonColor:{value:new Float32Array(p(a))},uWaveColor:{value:new Float32Array(p(r))},uCrestColor:{value:new Float32Array(p(E))}}}),K=new F(t,{geometry:J,program:u}),x=()=>{let e=c.getBoundingClientRect();v.setSize(Math.max(1,e.width),Math.max(1,e.height));let o=u.uniforms.iResolution.value;o[0]=t.drawingBufferWidth,o[1]=t.drawingBufferHeight},y=new ResizeObserver(x);y.observe(c),x();let i=[.5,.5],n=[.5,.5],w=e=>{let o=f.getBoundingClientRect();n[0]=(e.clientX-o.left)/o.width,n[1]=1-(e.clientY-o.top)/o.height},T=()=>{n[0]=.5,n[1]=.5};s&&(window.addEventListener("pointermove",w,{passive:!0}),window.addEventListener("pointerleave",T));let m=0,C=!0,Q=performance.now(),b=-1/0,S=e=>{if(!C||(m=requestAnimationFrame(S),document.hidden||e-b+.25<1e3/30))return;b=e,u.uniforms.iTime.value=(e-Q)*.001;let o=g.current?n[0]:.5,U=g.current?n[1]:.5;i[0]+=.05*(o-i[0]),i[1]+=.05*(U-i[1]),u.uniforms.uMouse.value[0]=i[0],u.uniforms.uMouse.value[1]=i[1],v.render({scene:K})};return m=requestAnimationFrame(S),()=>{C=!1,cancelAnimationFrame(m),y.disconnect(),s&&(window.removeEventListener("pointermove",w),window.removeEventListener("pointerleave",T)),f.remove(),t.getExtension("WEBGL_lose_context")?.loseContext()}},[]),(0,z.jsx)("div",{ref:h,className:"gradient-waves-container","aria-hidden":"true"})}export{te as default};
