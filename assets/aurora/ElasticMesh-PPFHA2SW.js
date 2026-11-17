import{a as Qt}from"./chunk-UNAOL2ER.js";import{a as kt,b as Wt,c as $t,d as Jt,e as Kt}from"./chunk-O2GBFF22.js";import{c as bt,e as le,f as Vt}from"./chunk-D555T6QT.js";var q=bt(le());var Zt=bt(Vt()),et=4.6,Mt=.96,ue=`
precision highp float;
attribute vec2 aGrid;
attribute vec2 uv;
attribute vec3 aOffset;
attribute vec3 aNormal;

uniform float uAspect;
uniform float uTilt;
uniform float uDist;
uniform float uFit;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

void main() {
  vUv = uv;

  vec2 base = vec2((aGrid.x * 2.0 - 1.0) * uAspect, 1.0 - aGrid.y * 2.0);
  vec3 p = vec3(base + aOffset.xy, aOffset.z);

  float ct = cos(uTilt);
  float st = sin(uTilt);
  float ry = p.y * ct - p.z * st;
  float rz = p.y * st + p.z * ct;
  p.y = ry;
  p.z = rz;

  float persp = uDist / (uDist - p.z);
  vec2 clip = vec2(p.x / uAspect, p.y) * persp * uFit;

  vNormal = aNormal;
  vDepth = aOffset.z;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`,fe=`
precision highp float;

varying vec2 vUv;
varying vec3 vNormal;
varying float vDepth;

uniform sampler2D tMap;
uniform float uHasImage;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uHighlight;
uniform float uShading;
uniform vec2 uRes;
uniform float uRadius;
uniform float uGrid;
uniform float uGridDensity;
uniform float uGridOpacity;
uniform vec3 uGridColor;

void main() {
  vec3 base;
  if (uHasImage > 0.5) {
    base = texture2D(tMap, vUv).rgb;
  } else {
    base = mix(uColor1, uColor2, clamp(vUv.y, 0.0, 1.0));
  }

  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(-0.35, 0.55, 0.78));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  float diff = clamp(dot(N, L), 0.0, 1.0);
  float specRaw = pow(clamp(dot(N, H), 0.0, 1.0), 26.0);
  float specFlat = pow(clamp(H.z, 0.0, 1.0), 26.0);
  float spec = clamp((specRaw - specFlat) / (1.0 - specFlat), 0.0, 1.0);
  float ao = clamp(1.0 + vDepth * 0.45, 0.65, 1.25);

  vec3 lit = base * (1.0 - uShading * 0.28);
  lit += base * diff * uShading * 0.55;
  lit *= ao;
  lit += uHighlight * spec * uShading * 0.25;

  if (uGrid > 0.5) {
    vec2 g = vUv * uGridDensity;
    vec2 w = uGridDensity / max(uRes, vec2(1.0));
    vec2 d = abs(fract(g - 0.5) - 0.5) / max(w * 1.5, vec2(1e-4));
    float line = 1.0 - clamp(min(d.x, d.y), 0.0, 1.0);
    lit = mix(lit, uGridColor, line * uGridOpacity * (0.45 + diff * 0.55));
  }

  vec2 p = (vUv - 0.5) * uRes;
  vec2 halfRes = uRes * 0.5;
  float r = min(uRadius, min(halfRes.x, halfRes.y));
  vec2 q = abs(p) - (halfRes - r);
  float sd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  float alpha = 1.0 - smoothstep(-1.25, 1.25, sd);
  if (alpha <= 0.002) discard;

  gl_FragColor = vec4(lit, alpha);
}
`;function H(k){let G=(k||"").replace("#","").trim();G.length===3&&(G=G.split("").map(P=>P+P).join(""));let O=parseInt(G||"000000",16);return[(O>>16&255)/255,(O>>8&255)/255,(O&255)/255]}var ve=({image:k="",color1:G="#5227FF",color2:O="#B19EEF",highlight:P="#ffffff",showGrid:it=!0,gridDensity:ct=20,gridOpacity:lt=.28,gridColor:ut="#ffffff",borderRadius:ft=25,stiffness:zt=.05,damping:Rt=.2,grabRadius:At=.6,pull:Et=.4,wobble:Lt=5,tilt:vt=14,shading:mt=.5,resolution:Gt=25,interaction:Ft="hover",enabled:Ct=!0,className:Dt="",style:te,...ee})=>{let Nt=(0,q.useRef)(null),F=(0,q.useRef)({}),dt=(0,q.useRef)(null);return F.current={color1:G,color2:O,highlight:P,showGrid:it,gridDensity:ct,gridOpacity:lt,gridColor:ut,borderRadius:ft,stiffness:zt,damping:Rt,grabRadius:At,pull:Et,wobble:Lt,tilt:vt,shading:mt,interaction:Ft,enabled:Ct},(0,q.useEffect)(()=>{let c=Nt.current;if(!c)return;let Ht=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Ot=!1,W,C=()=>W?.request(),pt=new $t({alpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),v=pt.gl;v.clearColor(0,0,0,0),v.enable(v.BLEND),v.blendFunc(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA);let r=Math.max(6,Math.min(40,Math.round(Gt))),g=r*r,$=new Float32Array(g*2),ht=new Float32Array(g*2),nt=new Float32Array(g*3),J=new Float32Array(g*3);for(let t=0;t<r;t++)for(let n=0;n<r;n++){let o=t*r+n,s=n/(r-1),u=t/(r-1);$[o*2]=s,$[o*2+1]=u,ht[o*2]=s,ht[o*2+1]=u,J[o*3+2]=1}let ne=(r-1)*(r-1),U=new Uint16Array(ne*6),_=0;for(let t=0;t<r-1;t++)for(let n=0;n<r-1;n++){let o=t*r+n,s=o+1,u=o+r,h=u+1;U[_++]=o,U[_++]=u,U[_++]=s,U[_++]=s,U[_++]=u,U[_++]=h}let yt=new kt(v,{aGrid:{size:2,data:$},uv:{size:2,data:ht},aOffset:{size:3,data:nt},aNormal:{size:3,data:J},index:{data:U}}),Ut=new Kt(v,{generateMipmaps:!1,flipY:!1}),oe=0;if(k){let t=new Image;t.crossOrigin="anonymous",t.onload=()=>{Ot||(Ut.image=t,m.uniforms.uHasImage.value=1,C())},t.src=k}let m=new Wt(v,{vertex:ue,fragment:fe,transparent:!0,cullFace:null,uniforms:{tMap:{value:Ut},uHasImage:{value:oe},uColor1:{value:H(G)},uColor2:{value:H(O)},uHighlight:{value:H(P)},uGrid:{value:it?1:0},uGridDensity:{value:ct},uGridOpacity:{value:lt},uGridColor:{value:H(ut)},uShading:{value:mt},uRes:{value:[1,1]},uRadius:{value:ft},uAspect:{value:1},uTilt:{value:vt*Math.PI/180},uDist:{value:et},uFit:{value:Mt}}}),ae=new Jt(v,{geometry:yt,program:m}),B=new Float32Array(g),X=new Float32Array(g),e=new Float32Array(g*3),M=new Float32Array(g*3),Y=new Float32Array(g*3),ot=1;function se(){for(let t=0;t<g;t++)B[t]=($[t*2]*2-1)*ot,X[t]=1-$[t*2+1]*2}function It(){let t=c.offsetWidth||1,n=c.offsetHeight||1;pt.setSize(t,n),ot=t/n,m.uniforms.uAspect.value=ot,m.uniforms.uRes.value=[t,n],se(),C()}let St=new ResizeObserver(It);St.observe(c),It();let a={x:0,y:0,tx:0,ty:0,active:!1,targetActive:!1};function xt(t,n){let o=c.getBoundingClientRect(),s=(t-o.left)/o.width,u=(n-o.top)/o.height,h=s*2-1,x=1-u*2,d=(F.current.tilt||0)*Math.PI/180,y=Math.cos(d),i=Math.sin(d),f=x/(y*Mt*et),p=f*et/(1+f*i),z=et/(et-p*i);a.tx=h*ot/(z*Mt),a.ty=p}function Tt(t){xt(t.clientX,t.clientY),F.current.interaction==="hover"&&(a.targetActive=!0),C()}function qt(){F.current.interaction==="hover"&&(a.targetActive=!0),C()}function at(){a.targetActive=!1,C()}function Pt(t){F.current.interaction==="drag"&&(xt(t.clientX,t.clientY),a.x=a.tx,a.y=a.ty,a.targetActive=!0,C())}function _t(){F.current.interaction==="drag"&&(a.targetActive=!1),C()}function st(t){t.touches.length&&(xt(t.touches[0].clientX,t.touches[0].clientY),a.targetActive=!0,C())}c.addEventListener("mousemove",Tt),c.addEventListener("mouseenter",qt),c.addEventListener("mouseleave",at),c.addEventListener("mousedown",Pt),window.addEventListener("mouseup",_t),c.addEventListener("touchstart",st,{passive:!0}),c.addEventListener("touchmove",st,{passive:!0}),c.addEventListener("touchend",at);let gt=1/120,re=5,K=0,Bt=performance.now(),Q=0,rt=0;function ie(){let t=F.current,n=t.stiffness,o=1-t.damping,s=.06+t.wobble*.032,u=a.active&&t.enabled&&!Ht,x=1/(Math.max(.08,t.grabRadius)*1.4),d=t.pull*.009;for(let y=0;y<r;y++)for(let i=0;i<r;i++){let f=y*r+i,p=f*3,z=e[p],w=e[p+1],R=e[p+2],b=-n*z,Z=-n*w,tt=-n*R,I=0,S=0,D=0,A=0;if(i>0){let l=(f-1)*3;I+=e[l],S+=e[l+1],D+=e[l+2],A++}if(i<r-1){let l=(f+1)*3;I+=e[l],S+=e[l+1],D+=e[l+2],A++}if(y>0){let l=(f-r)*3;I+=e[l],S+=e[l+1],D+=e[l+2],A++}if(y<r-1){let l=(f+r)*3;I+=e[l],S+=e[l+1],D+=e[l+2],A++}if(b+=s*(I-A*z),Z+=s*(S-A*w),tt+=s*(D-A*R),u){let l=a.x-(B[f]+z),j=a.y-(X[f]+w),V=Math.sqrt(l*l+j*j),E=V*x;if(E<1){let N=1-E*E;if(tt+=d*N*N*6,V>1e-4){let T=E*(1-E)*(1-E)*6.75,L=d*T*1.6/V;b+=l*L,Z+=j*L}}}Y[p]=b,Y[p+1]=Z,Y[p+2]=tt}for(let y=0;y<g;y++){let i=y*3,f=(M[i]+Y[i])*o,p=(M[i+1]+Y[i+1])*o,z=(M[i+2]+Y[i+2])*o;M[i]=f,M[i+1]=p,M[i+2]=z;let w=e[i]+f,R=e[i+1]+p,b=e[i+2]+z;w>1.2?w=1.2:w<-1.2&&(w=-1.2),R>1.2?R=1.2:R<-1.2&&(R=-1.2),b>1.2?b=1.2:b<-1.2&&(b=-1.2),e[i]=w,e[i+1]=R,e[i+2]=b}}function Xt(){Q=0,rt=0;for(let t=0;t<r;t++)for(let n=0;n<r;n++){let o=t*r+n,s=o*3,u=n>0?o-1:o,h=n<r-1?o+1:o,x=t>0?o-r:o,d=t<r-1?o+r:o,y=B[u]+e[u*3],i=X[u]+e[u*3+1],f=e[u*3+2],p=B[h]+e[h*3],z=X[h]+e[h*3+1],w=e[h*3+2],R=B[x]+e[x*3],b=X[x]+e[x*3+1],Z=e[x*3+2],tt=B[d]+e[d*3],I=X[d]+e[d*3+1],S=e[d*3+2],D=p-y,A=z-i,l=w-f,j=tt-R,V=I-b,E=S-Z,N=A*E-l*V,T=l*j-D*E,L=D*V-A*j;L<0&&(N=-N,T=-T,L=-L);let wt=Math.sqrt(N*N+T*T+L*L)||1;J[s]=N/wt,J[s+1]=T/wt,J[s+2]=L/wt,nt[s]=e[s],nt[s+1]=e[s+1],nt[s+2]=e[s+2];let Yt=Math.abs(e[s])+Math.abs(e[s+1])+Math.abs(e[s+2]);Yt>Q&&(Q=Yt);let jt=Math.abs(M[s])+Math.abs(M[s+1])+Math.abs(M[s+2]);jt>rt&&(rt=jt)}yt.attributes.aOffset.needsUpdate=!0,yt.attributes.aNormal.needsUpdate=!0}function ce(t){let n=F.current;m.uniforms.uShading.value=n.shading,m.uniforms.uRadius.value=n.borderRadius,m.uniforms.uTilt.value=n.tilt*Math.PI/180,m.uniforms.uColor1.value=H(n.color1),m.uniforms.uColor2.value=H(n.color2),m.uniforms.uHighlight.value=H(n.highlight),m.uniforms.uGrid.value=n.showGrid?1:0,m.uniforms.uGridDensity.value=n.gridDensity,m.uniforms.uGridOpacity.value=n.gridOpacity,m.uniforms.uGridColor.value=H(n.gridColor);let o=(t-Bt)/1e3;Bt=t,o>.25&&(o=.25);let u=1-Math.exp(-Math.max(o,1e-4)/.06);a.x+=(a.tx-a.x)*u,a.y+=(a.ty-a.y)*u,a.active=a.targetActive,K+=o;let h=0;for(;K>=gt&&h<re;)ie(),K-=gt,h++;K>gt&&(K=0),Xt();let x=!a.targetActive||!n.enabled||Ht,d=rt<1e-5&&(x?Q<1e-4:Math.abs(a.tx-a.x)+Math.abs(a.ty-a.y)<1e-4);return d&&x&&Q>0&&(e.fill(0),M.fill(0),Xt()),pt.render({scene:ae}),!d}return W=Qt(c,ce),dt.current=W,W.request(),c.appendChild(v.canvas),()=>{Ot=!0,W.dispose(),dt.current=null,St.disconnect(),c.removeEventListener("mousemove",Tt),c.removeEventListener("mouseenter",qt),c.removeEventListener("mouseleave",at),c.removeEventListener("mousedown",Pt),window.removeEventListener("mouseup",_t),c.removeEventListener("touchstart",st),c.removeEventListener("touchmove",st),c.removeEventListener("touchend",at),v.canvas.parentElement===c&&c.removeChild(v.canvas);let t=v.getExtension("WEBGL_lose_context");t&&t.loseContext()}},[k,Gt]),(0,q.useEffect)(()=>dt.current?.request(),[G,O,P,it,ct,lt,ut,ft,zt,Rt,At,Et,Lt,vt,mt,Ft,Ct]),(0,Zt.jsx)("div",{ref:Nt,className:`elastic-mesh${Dt?` ${Dt}`:""}`,style:te,...ee})},pe=ve;export{pe as default};
