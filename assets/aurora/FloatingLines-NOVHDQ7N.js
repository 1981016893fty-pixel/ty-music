import{B as J,F as Q,J as Z,K as $,P as W,R as ee,S as te,v as d,w as v}from"./chunk-WN2A7VKE.js";import{c as G,e as be,f as j}from"./chunk-D555T6QT.js";var l=G(be());var ne=G(j()),Ce=`
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,xe=`
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

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

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

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * 0.2;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      );
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
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
`,oe=8;function Le(p){let e=p.trim();e.startsWith("#")&&(e=e.slice(1));let a=255,c=255,s=255;return e.length===3?(a=parseInt(e[0]+e[0],16),c=parseInt(e[1]+e[1],16),s=parseInt(e[2]+e[2],16)):e.length===6&&(a=parseInt(e.slice(0,2),16),c=parseInt(e.slice(2,4),16),s=parseInt(e.slice(4,6),16)),new v(a/255,c/255,s/255)}function we({linesGradient:p,enabledWaves:e=["top","middle","bottom"],lineCount:a=[6],lineDistance:c=[5],topWavePosition:s,middleWavePosition:g,bottomWavePosition:b={x:2,y:-.7,rotate:-1},animationSpeed:B=1,interactive:h=!0,bendRadius:O=5,bendStrength:A=-.5,mouseDamping:C=.05,parallax:x=!0,parallaxStrength:L=.2,maxFps:S=60,mixBlendMode:ie="screen"}){let T=(0,l.useRef)(null),_=(0,l.useRef)(new d(-1e3,-1e3)),z=(0,l.useRef)(new d(-1e3,-1e3)),w=(0,l.useRef)(0),E=(0,l.useRef)(0),D=(0,l.useRef)(new d(0,0)),F=(0,l.useRef)(new d(0,0)),M=n=>{if(typeof a=="number")return a;if(!e.includes(n))return 0;let u=e.indexOf(n);return a[u]??6},P=n=>{if(typeof c=="number")return c;if(!e.includes(n))return .1;let u=e.indexOf(n);return c[u]??.1},re=e.includes("top")?M("top"):0,le=e.includes("middle")?M("middle"):0,ae=e.includes("bottom")?M("bottom"):0,ce=e.includes("top")?P("top")*.01:.01,se=e.includes("middle")?P("middle")*.01:.01,ue=e.includes("bottom")?P("bottom")*.01:.01;return(0,l.useEffect)(()=>{let n=T.current;if(!n)return;let u=!0,K=new J,k=new W(-1,1,1,-1,0,1);k.position.z=1;let o=new te({antialias:!0,alpha:!1}),ye=window.matchMedia("(hover: none), (pointer: coarse)").matches;o.setPixelRatio(Math.min(window.devicePixelRatio||1,1)),o.domElement.style.width="100%",o.domElement.style.height="100%",n.appendChild(o.domElement);let f={iTime:{value:0},iResolution:{value:new v(1,1,1)},animationSpeed:{value:B},enableTop:{value:e.includes("top")},enableMiddle:{value:e.includes("middle")},enableBottom:{value:e.includes("bottom")},topLineCount:{value:re},middleLineCount:{value:le},bottomLineCount:{value:ae},topLineDistance:{value:ce},middleLineDistance:{value:se},bottomLineDistance:{value:ue},topWavePosition:{value:new v(s?.x??10,s?.y??.5,s?.rotate??-.4)},middleWavePosition:{value:new v(g?.x??5,g?.y??0,g?.rotate??.2)},bottomWavePosition:{value:new v(b?.x??2,b?.y??-.7,b?.rotate??.4)},iMouse:{value:new d(-1e3,-1e3)},interactive:{value:h},bendRadius:{value:O},bendStrength:{value:A},bendInfluence:{value:0},parallax:{value:x},parallaxStrength:{value:L},parallaxOffset:{value:new d(0,0)},lineGradient:{value:Array.from({length:oe},()=>new v(1,1,1))},lineGradientCount:{value:0}};if(p&&p.length>0){let i=p.slice(0,oe);f.lineGradientCount.value=i.length,i.forEach((t,m)=>{let r=Le(t);f.lineGradient.value[m].set(r.x,r.y,r.z)})}let N=new $({uniforms:f,vertexShader:Ce,fragmentShader:xe}),V=new Z(2,2),fe=new Q(V,N);K.add(fe);let me=new ee,X=()=>{if(!u)return;let i=n.clientWidth||1,t=n.clientHeight||1;o.setSize(i,t,!1);let m=o.domElement.width,r=o.domElement.height;f.iResolution.value.set(m,r,1)};X();let y=typeof ResizeObserver<"u"?new ResizeObserver(()=>{u&&X()}):null;y&&y.observe(n);let q=i=>{let t=n.getBoundingClientRect();if(!t.width||!t.height)return;let m=i.clientX-t.left,r=i.clientY-t.top,H=o.getPixelRatio();if(m<0||m>t.width||r<0||r>t.height){w.current=0;return}if(_.current.set(m*H,(t.height-r)*H),w.current=1,x){let ve=t.width/2,pe=t.height/2,he=(m-ve)/t.width,ge=-(r-pe)/t.height;D.current.set(he*L,ge*L)}},U=()=>{w.current=0};h&&(window.addEventListener("pointermove",q,{passive:!0}),window.addEventListener("blur",U),document.addEventListener("visibilitychange",U));let R=0,Y=0,de=1e3/Math.max(1,S),I=i=>{if(u){if(i-Y<de){R=requestAnimationFrame(I);return}Y=i,f.iTime.value=me.getElapsedTime(),h&&(z.current.lerp(_.current,C),f.iMouse.value.copy(z.current),E.current+=(w.current-E.current)*C,f.bendInfluence.value=E.current),x&&(F.current.lerp(D.current,C),f.parallaxOffset.value.copy(F.current)),o.render(K,k),R=requestAnimationFrame(I)}};return R=requestAnimationFrame(I),()=>{u=!1,cancelAnimationFrame(R),y&&y.disconnect(),h&&(window.removeEventListener("pointermove",q),window.removeEventListener("blur",U),document.removeEventListener("visibilitychange",U)),V.dispose(),N.dispose(),o.dispose(),o.forceContextLoss(),o.domElement.parentElement&&o.domElement.parentElement.removeChild(o.domElement)}},[p,e,a,c,s,g,b,B,h,O,A,C,x,L,S]),(0,ne.jsx)("div",{ref:T,className:"floating-lines-container",style:{mixBlendMode:ie}})}export{we as default};
