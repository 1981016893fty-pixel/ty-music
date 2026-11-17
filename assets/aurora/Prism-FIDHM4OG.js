import{b as re,c as le,d as ue,g as fe}from"./chunk-O2GBFF22.js";import{c as U,e as Xe,f as ce}from"./chunk-D555T6QT.js";var H=U(Xe());var me=U(ce()),Ve=({height:W=3.5,baseWidth:q=5.5,animationType:h="rotate",glow:N=1,offset:b={x:0,y:0},noise:Y=.5,transparent:P=!0,scale:G=3.6,hueShift:X=0,colorFrequency:V=1,hoverStrength:Z=2,inertia:D=.05,bloom:k=1,suspendWhenOffscreen:I=!1,timeScale:Q=.5})=>{let j=(0,H.useRef)(null);return(0,H.useEffect)(()=>{let i=j.current;if(!i)return;let g=Math.max(.001,W),y=Math.max(.001,q)*.5,ve=Math.max(0,N),J=Math.max(0,Y),he=b?.x??0,de=b?.y??0,xe=P?1.5:1,A=Math.max(.001,G),we=X||0,pe=Math.max(0,V||1),Me=Math.max(0,k||1),Se=1,be=1,ge=1,B=Math.max(0,Q||1),K=Math.max(0,Z||1),$=Math.max(0,Math.min(1,D||.12)),F=Math.min(2,window.devicePixelRatio||1),L=new le({dpr:F,alpha:P,antialias:!1}),o=L.gl;o.disable(o.DEPTH_TEST),o.disable(o.CULL_FACE),o.disable(o.BLEND),Object.assign(o.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),i.appendChild(o.canvas);let Be=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,Re=`
      precision highp float;

      uniform vec2  iResolution;
      uniform float iTime;

      uniform float uHeight;
      uniform float uBaseHalf;
      uniform mat3  uRot;
      uniform int   uUseBaseWobble;
      uniform float uGlow;
      uniform vec2  uOffsetPx;
      uniform float uNoise;
      uniform float uSaturation;
      uniform float uScale;
      uniform float uHueShift;
      uniform float uColorFreq;
      uniform float uBloom;
      uniform float uCenterShift;
      uniform float uInvBaseHalf;
      uniform float uInvHeight;
      uniform float uMinAxis;
      uniform float uPxScale;
      uniform float uTimeScale;

      vec4 tanh4(vec4 x){
        vec4 e2x = exp(2.0*x);
        return (e2x - 1.0) / (e2x + 1.0);
      }

      float rand(vec2 co){
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float sdOctaAnisoInv(vec3 p){
        vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
        float m = q.x + q.y + q.z - 1.0;
        return m * uMinAxis * 0.5773502691896258;
      }

      float sdPyramidUpInv(vec3 p){
        float oct = sdOctaAnisoInv(p);
        float halfSpace = -p.y;
        return max(oct, halfSpace);
      }

      mat3 hueRotation(float a){
        float c = cos(a), s = sin(a);
        mat3 W = mat3(
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114,
          0.299, 0.587, 0.114
        );
        mat3 U = mat3(
           0.701, -0.587, -0.114,
          -0.299,  0.413, -0.114,
          -0.300, -0.588,  0.886
        );
        mat3 V = mat3(
           0.168, -0.331,  0.500,
           0.328,  0.035, -0.500,
          -0.497,  0.296,  0.201
        );
        return W + U * c + V * s;
      }

      void main(){
        vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;

        float z = 5.0;
        float d = 0.0;

        vec3 p;
        vec4 o = vec4(0.0);

        float centerShift = uCenterShift;
        float cf = uColorFreq;

        mat2 wob = mat2(1.0);
        if (uUseBaseWobble == 1) {
          float t = iTime * uTimeScale;
          float c0 = cos(t + 0.0);
          float c1 = cos(t + 33.0);
          float c2 = cos(t + 11.0);
          wob = mat2(c0, c1, c2, c0);
        }

        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          p = vec3(f, z);
          p.xz = p.xz * wob;
          p = uRot * p;
          vec3 q = p;
          q.y += centerShift;
          d = 0.1 + 0.2 * abs(sdPyramidUpInv(q));
          z -= d;
          o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
        }

        o = tanh4(o * o * (uGlow * uBloom) / 1e5);

        vec3 col = o.rgb;
        float n = rand(gl_FragCoord.xy + vec2(iTime));
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);

        float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

        if(abs(uHueShift) > 0.0001){
          col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
        }

        gl_FragColor = vec4(col, o.a);
      }
    `,Ee=new fe(o),_=new Float32Array(2),C=new Float32Array(2),c=new re(o,{vertex:Be,fragment:Re,uniforms:{iResolution:{value:_},iTime:{value:0},uHeight:{value:g},uBaseHalf:{value:y},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:ve},uOffsetPx:{value:C},uNoise:{value:J},uSaturation:{value:xe},uScale:{value:A},uHueShift:{value:we},uColorFreq:{value:pe},uBloom:{value:Me},uCenterShift:{value:g*.25},uInvBaseHalf:{value:1/y},uInvHeight:{value:1/g},uMinAxis:{value:Math.min(y,g)},uPxScale:{value:1/((o.drawingBufferHeight||1)*.1*A)},uTimeScale:{value:B}}}),He=new ue(o,{geometry:Ee,program:c}),ee=()=>{let e=i.clientWidth||1,n=i.clientHeight||1;L.setSize(e,n),_[0]=o.drawingBufferWidth,_[1]=o.drawingBufferHeight,C[0]=he*F,C[1]=de*F,c.uniforms.uPxScale.value=1/((o.drawingBufferHeight||1)*.1*A)},te=new ResizeObserver(ee);te.observe(i),ee();let s=new Float32Array(9),oe=(e,n,a,t)=>{let l=Math.cos(e),u=Math.sin(e),f=Math.cos(n),v=Math.sin(n),p=Math.cos(a),S=Math.sin(a),Oe=l*p+u*v*S,ze=-l*S+u*v*p,Te=u*f,Ue=f*S,We=f*p,qe=-v,Ne=-u*p+l*v*S,Ye=u*S+l*v*p,Ge=l*f;return t[0]=Oe,t[1]=Ue,t[2]=Ne,t[3]=ze,t[4]=We,t[5]=Ye,t[6]=Te,t[7]=qe,t[8]=Ge,t},Pe=J<1e-6,m=0,Ie=performance.now(),R=()=>{m||(m=requestAnimationFrame(ie))},ne=()=>{m&&(cancelAnimationFrame(m),m=0)},M=()=>Math.random(),ye=(.3+M()*.6)*Se,Ae=(.2+M()*.7)*be,Fe=(.1+M()*.5)*ge,Le=M()*Math.PI*2,_e=M()*Math.PI*2,d=0,x=0,w=0,O=0,z=0,T=(e,n,a)=>e+(n-e)*a,r={x:0,y:0,inside:!0},Ce=e=>{let n=Math.max(1,window.innerWidth),a=Math.max(1,window.innerHeight),t=n*.5,l=a*.5,u=(e.clientX-t)/(n*.5),f=(e.clientY-l)/(a*.5);r.x=Math.max(-1,Math.min(1,u)),r.y=Math.max(-1,Math.min(1,f)),r.inside=!0},ae=()=>{r.inside=!1},se=()=>{r.inside=!1},E=null;h==="hover"?(E=e=>{Ce(e),R()},window.addEventListener("pointermove",E,{passive:!0}),window.addEventListener("mouseleave",ae),window.addEventListener("blur",se),c.uniforms.uUseBaseWobble.value=0):h==="3drotate"?c.uniforms.uUseBaseWobble.value=0:c.uniforms.uUseBaseWobble.value=1;let ie=e=>{let n=(e-Ie)*.001;c.uniforms.iTime.value=n;let a=!0;if(h==="hover"){let t=.6*K,l=.6*K;O=(r.inside?-r.x:0)*l,z=(r.inside?r.y:0)*t;let u=d,f=x,v=w;d=T(u,O,$),x=T(f,z,$),w=T(v,0,.1),c.uniforms.uRot.value=oe(d,x,w,s),Pe&&Math.abs(d-O)<1e-4&&Math.abs(x-z)<1e-4&&Math.abs(w)<1e-4&&(a=!1)}else if(h==="3drotate"){let t=n*B;d=t*Ae,x=Math.sin(t*ye+Le)*.6,w=Math.sin(t*Fe+_e)*.5,c.uniforms.uRot.value=oe(d,x,w,s),B<1e-6&&(a=!1)}else s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=1,s[5]=0,s[6]=0,s[7]=0,s[8]=1,c.uniforms.uRot.value=s,B<1e-6&&(a=!1);L.render({scene:He}),a?m=requestAnimationFrame(ie):m=0};if(I){let e=new IntersectionObserver(n=>{n.some(t=>t.isIntersecting)?R():ne()});e.observe(i),R(),i.__prismIO=e}else R();return()=>{if(ne(),te.disconnect(),h==="hover"&&(E&&window.removeEventListener("pointermove",E),window.removeEventListener("mouseleave",ae),window.removeEventListener("blur",se)),I){let e=i.__prismIO;e&&e.disconnect(),delete i.__prismIO}o.canvas.parentElement===i&&i.removeChild(o.canvas),o.getExtension("WEBGL_lose_context")?.loseContext()}},[W,q,h,N,Y,b?.x,b?.y,G,P,X,V,Q,Z,D,k,I]),(0,me.jsx)("div",{className:"prism-container",ref:j})},ke=Ve;export{ke as default};
