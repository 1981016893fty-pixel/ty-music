import{a as It,b as St,c as Tt,d as Pt,e as qt}from"./chunk-O2GBFF22.js";import{c as vt,e as se,f as Ut}from"./chunk-D555T6QT.js";var Q=vt(se());var _t=vt(Ut()),K=4.6,mt=.96,ie=`
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
`,re=`
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
`;function D(Y){let N=(Y||"").replace("#","").trim();N.length===3&&(N=N.split("").map(j=>j+j).join(""));let S=parseInt(N||"000000",16);return[(S>>16&255)/255,(S>>8&255)/255,(S&255)/255]}var ce=({image:Y="",color1:N="#5227FF",color2:S="#B19EEF",highlight:j="#ffffff",showGrid:dt=!0,gridDensity:pt=20,gridOpacity:ht=.28,gridColor:yt="#ffffff",borderRadius:gt=25,stiffness:Bt=.05,damping:Xt=.2,grabRadius:Yt=.6,pull:jt=.4,wobble:Vt=5,tilt:xt=14,shading:wt=.5,resolution:bt=25,interaction:kt="hover",enabled:Wt=!0,className:zt="",style:$t,...Jt})=>{let At=(0,Q.useRef)(null),L=(0,Q.useRef)({});return L.current={color1:N,color2:S,highlight:j,showGrid:dt,gridDensity:pt,gridOpacity:ht,gridColor:yt,borderRadius:gt,stiffness:Bt,damping:Xt,grabRadius:Yt,pull:jt,wobble:Vt,tilt:xt,shading:wt,interaction:kt,enabled:Wt},(0,Q.useEffect)(()=>{let c=At.current;if(!c)return;let Kt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,ot=new Tt({alpha:!0,antialias:!0,dpr:Math.min(window.devicePixelRatio||1,2)}),v=ot.gl;v.clearColor(0,0,0,0),v.enable(v.BLEND),v.blendFunc(v.SRC_ALPHA,v.ONE_MINUS_SRC_ALPHA);let s=Math.max(6,Math.min(40,Math.round(bt))),y=s*s,V=new Float32Array(y*2),at=new Float32Array(y*2),Z=new Float32Array(y*3),k=new Float32Array(y*3);for(let t=0;t<s;t++)for(let n=0;n<s;n++){let o=t*s+n,a=n/(s-1),u=t/(s-1);V[o*2]=a,V[o*2+1]=u,at[o*2]=a,at[o*2+1]=u,k[o*3+2]=1}let Qt=(s-1)*(s-1),O=new Uint16Array(Qt*6),T=0;for(let t=0;t<s-1;t++)for(let n=0;n<s-1;n++){let o=t*s+n,a=o+1,u=o+s,p=u+1;O[T++]=o,O[T++]=u,O[T++]=a,O[T++]=a,O[T++]=u,O[T++]=p}let st=new It(v,{aGrid:{size:2,data:V},uv:{size:2,data:at},aOffset:{size:3,data:Z},aNormal:{size:3,data:k},index:{data:O}}),Mt=new qt(v,{generateMipmaps:!1,flipY:!1}),Zt=0;if(Y){let t=new Image;t.crossOrigin="anonymous",t.src=Y,t.onload=()=>{Mt.image=t,m.uniforms.uHasImage.value=1}}let m=new St(v,{vertex:ie,fragment:re,transparent:!0,cullFace:null,uniforms:{tMap:{value:Mt},uHasImage:{value:Zt},uColor1:{value:D(N)},uColor2:{value:D(S)},uHighlight:{value:D(j)},uGrid:{value:dt?1:0},uGridDensity:{value:pt},uGridOpacity:{value:ht},uGridColor:{value:D(yt)},uShading:{value:wt},uRes:{value:[1,1]},uRadius:{value:gt},uAspect:{value:1},uTilt:{value:xt*Math.PI/180},uDist:{value:K},uFit:{value:mt}}}),te=new Pt(v,{geometry:st,program:m}),P=new Float32Array(y),q=new Float32Array(y),e=new Float32Array(y*3),M=new Float32Array(y*3),_=new Float32Array(y*3),tt=1;function ee(){for(let t=0;t<y;t++)P[t]=(V[t*2]*2-1)*tt,q[t]=1-V[t*2+1]*2}function Rt(){let t=c.offsetWidth||1,n=c.offsetHeight||1;ot.setSize(t,n),tt=t/n,m.uniforms.uAspect.value=tt,m.uniforms.uRes.value=[t,n],ee()}let Et=new ResizeObserver(Rt);Et.observe(c),Rt();let r={x:0,y:0,tx:0,ty:0,active:!1,targetActive:!1};function it(t,n){let o=c.getBoundingClientRect(),a=(t-o.left)/o.width,u=(n-o.top)/o.height,p=a*2-1,R=1-u*2,g=(L.current.tilt||0)*Math.PI/180,h=Math.cos(g),i=Math.sin(g),f=R/(h*mt*K),d=f*K/(1+f*i),b=K/(K-d*i);r.tx=p*tt/(b*mt),r.ty=d}function Ft(t){it(t.clientX,t.clientY),L.current.interaction==="hover"&&(r.targetActive=!0)}function Lt(){L.current.interaction==="hover"&&(r.targetActive=!0)}function et(){r.targetActive=!1}function Gt(t){L.current.interaction==="drag"&&(it(t.clientX,t.clientY),r.x=r.tx,r.y=r.ty,r.targetActive=!0)}function Ct(){L.current.interaction==="drag"&&(r.targetActive=!1)}function nt(t){t.touches.length&&(it(t.touches[0].clientX,t.touches[0].clientY),r.targetActive=!0)}c.addEventListener("mousemove",Ft),c.addEventListener("mouseenter",Lt),c.addEventListener("mouseleave",et),c.addEventListener("mousedown",Gt),window.addEventListener("mouseup",Ct),c.addEventListener("touchstart",nt,{passive:!0}),c.addEventListener("touchmove",nt,{passive:!0}),c.addEventListener("touchend",et);let rt=1/120,ne=5,W=0,Dt=performance.now(),ct=0,lt=0;function oe(){let t=L.current,n=t.stiffness,o=1-t.damping,a=.06+t.wobble*.032,u=r.active&&t.enabled&&!Kt,R=1/(Math.max(.08,t.grabRadius)*1.4),g=t.pull*.009;for(let h=0;h<s;h++)for(let i=0;i<s;i++){let f=h*s+i,d=f*3,b=e[d],x=e[d+1],z=e[d+2],w=-n*b,$=-n*x,J=-n*z,H=0,U=0,G=0,A=0;if(i>0){let l=(f-1)*3;H+=e[l],U+=e[l+1],G+=e[l+2],A++}if(i<s-1){let l=(f+1)*3;H+=e[l],U+=e[l+1],G+=e[l+2],A++}if(h>0){let l=(f-s)*3;H+=e[l],U+=e[l+1],G+=e[l+2],A++}if(h<s-1){let l=(f+s)*3;H+=e[l],U+=e[l+1],G+=e[l+2],A++}if(w+=a*(H-A*b),$+=a*(U-A*x),J+=a*(G-A*z),u){let l=r.x-(P[f]+b),B=r.y-(q[f]+x),X=Math.sqrt(l*l+B*B),E=X*R;if(E<1){let C=1-E*E;if(J+=g*C*C*6,X>1e-4){let I=E*(1-E)*(1-E)*6.75,F=g*I*1.6/X;w+=l*F,$+=B*F}}}_[d]=w,_[d+1]=$,_[d+2]=J}for(let h=0;h<y;h++){let i=h*3,f=(M[i]+_[i])*o,d=(M[i+1]+_[i+1])*o,b=(M[i+2]+_[i+2])*o;M[i]=f,M[i+1]=d,M[i+2]=b;let x=e[i]+f,z=e[i+1]+d,w=e[i+2]+b;x>1.2?x=1.2:x<-1.2&&(x=-1.2),z>1.2?z=1.2:z<-1.2&&(z=-1.2),w>1.2?w=1.2:w<-1.2&&(w=-1.2),e[i]=x,e[i+1]=z,e[i+2]=w}}function ae(){ct=0,lt=0;for(let t=0;t<s;t++)for(let n=0;n<s;n++){let o=t*s+n,a=o*3,u=n>0?o-1:o,p=n<s-1?o+1:o,R=t>0?o-s:o,g=t<s-1?o+s:o,h=P[u]+e[u*3],i=q[u]+e[u*3+1],f=e[u*3+2],d=P[p]+e[p*3],b=q[p]+e[p*3+1],x=e[p*3+2],z=P[R]+e[R*3],w=q[R]+e[R*3+1],$=e[R*3+2],J=P[g]+e[g*3],H=q[g]+e[g*3+1],U=e[g*3+2],G=d-h,A=b-i,l=x-f,B=J-z,X=H-w,E=U-$,C=A*E-l*X,I=l*B-G*E,F=G*X-A*B;F<0&&(C=-C,I=-I,F=-F);let ft=Math.sqrt(C*C+I*I+F*F)||1;k[a]=C/ft,k[a+1]=I/ft,k[a+2]=F/ft,Z[a]=e[a],Z[a+1]=e[a+1],Z[a+2]=e[a+2];let Ot=Math.abs(e[a])+Math.abs(e[a+1])+Math.abs(e[a+2]);Ot>ct&&(ct=Ot);let Ht=Math.abs(M[a])+Math.abs(M[a+1])+Math.abs(M[a+2]);Ht>lt&&(lt=Ht)}st.attributes.aOffset.needsUpdate=!0,st.attributes.aNormal.needsUpdate=!0}let ut=0;function Nt(t){ut=requestAnimationFrame(Nt);let n=L.current;m.uniforms.uShading.value=n.shading,m.uniforms.uRadius.value=n.borderRadius,m.uniforms.uTilt.value=n.tilt*Math.PI/180,m.uniforms.uColor1.value=D(n.color1),m.uniforms.uColor2.value=D(n.color2),m.uniforms.uHighlight.value=D(n.highlight),m.uniforms.uGrid.value=n.showGrid?1:0,m.uniforms.uGridDensity.value=n.gridDensity,m.uniforms.uGridOpacity.value=n.gridOpacity,m.uniforms.uGridColor.value=D(n.gridColor);let o=(t-Dt)/1e3;Dt=t,o>.25&&(o=.25);let u=1-Math.exp(-Math.max(o,1e-4)/.06);r.x+=(r.tx-r.x)*u,r.y+=(r.ty-r.y)*u,r.active=r.targetActive,W+=o;let p=0;for(;W>=rt&&p<ne;)oe(),W-=rt,p++;W>rt&&(W=0),ae(),ot.render({scene:te})}return ut=requestAnimationFrame(Nt),c.appendChild(v.canvas),()=>{cancelAnimationFrame(ut),Et.disconnect(),c.removeEventListener("mousemove",Ft),c.removeEventListener("mouseenter",Lt),c.removeEventListener("mouseleave",et),c.removeEventListener("mousedown",Gt),window.removeEventListener("mouseup",Ct),c.removeEventListener("touchstart",nt),c.removeEventListener("touchmove",nt),c.removeEventListener("touchend",et),v.canvas.parentElement===c&&c.removeChild(v.canvas);let t=v.getExtension("WEBGL_lose_context");t&&t.loseContext()}},[Y,bt]),(0,_t.jsx)("div",{ref:At,className:`elastic-mesh${zt?` ${zt}`:""}`,style:$t,...Jt})},ue=ce;export{ue as default};
