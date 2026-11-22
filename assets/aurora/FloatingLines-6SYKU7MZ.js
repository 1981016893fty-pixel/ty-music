import{D as j,H as J,L as Q,M as Z,R as $,T as W,U as ee,x as m,y as v}from"./chunk-373ON3IH.js";import{a as H}from"./chunk-UNAOL2ER.js";import{a as be,b as F}from"./chunk-Y4TZAYY2.js";import{d as G}from"./chunk-LN3IJP7D.js";var c=G(be());var oe=G(F()),ge=2e6,Ce=`
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Le=`
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  return gradientColor * 0.5;
}

float wave(vec2 uv, float offset, float time, float bendOffset) {
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + offset + x_movement) * amp + bendOffset;

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  float bendOffset = 0.0;
  if (interactive && bendInfluence > 0.0) {
    vec2 mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
    vec2 d = baseUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    bendOffset = (mouseUv.y - baseUv.y) * influence * bendStrength * bendInfluence;
  }
  float radialAngle = log(length(baseUv) + 1.0);
  float time = iTime * animationSpeed;
  
  if (enableBottom) {
    vec2 ruv = baseUv * rotate(bottomWavePosition.z * radialAngle);
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi, time, bendOffset
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    vec2 ruv = baseUv * rotate(middleWavePosition.z * radialAngle);
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi, time, bendOffset
      );
    }
  }

  if (enableTop) {
    vec2 ruv = baseUv * rotate(topWavePosition.z * radialAngle);
    ruv.x *= -1.0;
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi, time, bendOffset
      ) * 0.1;
    }
  }

  fragColor = vec4(col, 1.0);
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`,te=8;function xe(p){let e=p.trim();e.startsWith("#")&&(e=e.slice(1));let s=255,f=255,u=255;return e.length===3?(s=parseInt(e[0]+e[0],16),f=parseInt(e[1]+e[1],16),u=parseInt(e[2]+e[2],16)):e.length===6&&(s=parseInt(e.slice(0,2),16),f=parseInt(e.slice(2,4),16),u=parseInt(e.slice(4,6),16)),new v(s/255,f/255,u/255)}function we({linesGradient:p,enabledWaves:e=["top","middle","bottom"],lineCount:s=[6],lineDistance:f=[5],topWavePosition:u,middleWavePosition:g,bottomWavePosition:C={x:2,y:-.7,rotate:-1},animationSpeed:I=1,interactive:h=!0,bendRadius:A=5,bendStrength:T=-.5,mouseDamping:L=.05,parallax:x=!0,parallaxStrength:w=.2,maxFps:B=60,mixBlendMode:ne="screen"}){let S=(0,c.useRef)(null),_=(0,c.useRef)(new m(-1e3,-1e3)),M=(0,c.useRef)(new m(-1e3,-1e3)),y=(0,c.useRef)(0),O=(0,c.useRef)(0),D=(0,c.useRef)(new m(0,0)),z=(0,c.useRef)(new m(0,0)),P=o=>{if(typeof s=="number")return s;if(!e.includes(o))return 0;let d=e.indexOf(o);return s[d]??6},U=o=>{if(typeof f=="number")return f;if(!e.includes(o))return .1;let d=e.indexOf(o);return f[d]??.1},ie=e.includes("top")?P("top"):0,re=e.includes("middle")?P("middle"):0,le=e.includes("bottom")?P("bottom"):0,ae=e.includes("top")?U("top")*.01:.01,ce=e.includes("middle")?U("middle")*.01:.01,se=e.includes("bottom")?U("bottom")*.01:.01;return(0,c.useEffect)(()=>{let o=S.current;if(!o)return;let d=!0,X=new j,q=new $(-1,1,1,-1,0,1);q.position.z=1;let r=new ee({antialias:!1,alpha:!1,depth:!1});r.domElement.style.width="100%",r.domElement.style.height="100%",o.appendChild(r.domElement);let l={iTime:{value:0},iResolution:{value:new v(1,1,1)},animationSpeed:{value:I},enableTop:{value:e.includes("top")},enableMiddle:{value:e.includes("middle")},enableBottom:{value:e.includes("bottom")},topLineCount:{value:ie},middleLineCount:{value:re},bottomLineCount:{value:le},topLineDistance:{value:ae},middleLineDistance:{value:ce},bottomLineDistance:{value:se},topWavePosition:{value:new v(u?.x??10,u?.y??.5,u?.rotate??-.4)},middleWavePosition:{value:new v(g?.x??5,g?.y??0,g?.rotate??.2)},bottomWavePosition:{value:new v(C?.x??2,C?.y??-.7,C?.rotate??.4)},iMouse:{value:new m(-1e3,-1e3)},interactive:{value:h},bendRadius:{value:A},bendStrength:{value:T},bendInfluence:{value:0},parallax:{value:x},parallaxStrength:{value:w},parallaxOffset:{value:new m(0,0)},lineGradient:{value:Array.from({length:te},()=>new v(1,1,1))},lineGradientCount:{value:0}};if(p&&p.length>0){let i=p.slice(0,te);l.lineGradientCount.value=i.length,i.forEach((t,a)=>{let n=xe(t);l.lineGradient.value[a].set(n.x,n.y,n.z)})}let K=new Z({uniforms:l,vertexShader:Ce,fragmentShader:Le,depthTest:!1,depthWrite:!1}),N=new Q(2,2),fe=new J(N,K);X.add(fe);let ue=new W,b,k=()=>{if(!d)return;let i=o.clientWidth||1,t=o.clientHeight||1,a=Math.min(window.devicePixelRatio||1,1,Math.sqrt(ge/(i*t))),n=r.domElement;(n.width!==Math.floor(i*a)||n.height!==Math.floor(t*a))&&r.setDrawingBufferSize(i,t,a),l.iResolution.value.set(n.width,n.height,1),b?.request()};k();let R=typeof ResizeObserver<"u"?new ResizeObserver(()=>{d&&k()}):null;R&&R.observe(o);let V=i=>{let t=o.getBoundingClientRect();if(!t.width||!t.height)return;let a=i.clientX-t.left,n=i.clientY-t.top;if(a<0||a>t.width||n<0||n>t.height){y.current=0;return}if(_.current.set(a/t.width,1-n/t.height),y.current=1,x){let me=t.width/2,ve=t.height/2,pe=(a-me)/t.width,he=-(n-ve)/t.height;D.current.set(pe*w,he*w)}b?.request()},E=()=>{y.current=0,b?.request()};h&&(window.addEventListener("pointermove",V,{passive:!0}),window.addEventListener("blur",E),document.addEventListener("visibilitychange",E));let Y=-1/0,de=1e3/Math.max(1,B);return b=H(o,i=>i-Y+.25<de?!0:(Y=i,l.iTime.value=ue.getElapsedTime(),h&&(M.current.lerp(_.current,L),l.iMouse.value.set(M.current.x*l.iResolution.value.x,M.current.y*l.iResolution.value.y),O.current+=(y.current-O.current)*L,l.bendInfluence.value=O.current),x&&(z.current.lerp(D.current,L),l.parallaxOffset.value.copy(z.current)),r.render(X,q),I!==0||h)),b.request(),()=>{d=!1,b.dispose(),R&&R.disconnect(),h&&(window.removeEventListener("pointermove",V),window.removeEventListener("blur",E),document.removeEventListener("visibilitychange",E)),N.dispose(),K.dispose(),r.dispose(),r.forceContextLoss(),r.domElement.parentElement&&r.domElement.parentElement.removeChild(r.domElement)}},[p,e,s,f,u,g,C,I,h,A,T,L,x,w,B]),(0,oe.jsx)("div",{ref:S,className:"floating-lines-container",style:{mixBlendMode:ne}})}export{we as default};
