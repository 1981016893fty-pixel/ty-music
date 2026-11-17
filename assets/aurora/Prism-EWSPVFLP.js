import{a as le}from"./chunk-UNAOL2ER.js";import{b as se,c as ie,d as re,g as ce}from"./chunk-O2GBFF22.js";import{c as z,e as Ge,f as ae}from"./chunk-D555T6QT.js";var H=z(Ge());var ue=z(ae()),Xe=5e5,Ye=({height:T=3.5,baseWidth:U=5.5,animationType:v="rotate",glow:W=1,offset:S={x:0,y:0},noise:_=.5,transparent:P=!0,scale:q=3.6,hueShift:N=0,colorFrequency:G=1,hoverStrength:X=2,inertia:Y=.05,bloom:D=1,suspendWhenOffscreen:V=!1,timeScale:Z=.5})=>{let k=(0,H.useRef)(null);return(0,H.useEffect)(()=>{let u=k.current;if(!u)return;let b,g=Math.max(.001,T),y=Math.max(.001,U)*.5,fe=Math.max(0,W),K=Math.max(0,_),me=S?.x??0,ve=S?.y??0,he=P?1.5:1,L=Math.max(.001,q),de=N||0,xe=Math.max(0,G||1),pe=Math.max(0,D||1),we=1,Me=1,Se=1,B=Math.max(0,Z??1),Q=Math.max(0,X||1),j=Math.max(0,Math.min(1,Y||.12)),R=new ie({dpr:1,alpha:P,antialias:!1}),e=R.gl;e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.disable(e.BLEND),Object.assign(e.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),u.appendChild(e.canvas);let be=`
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `,ge=`
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
    `,Be=new ce(e),A=new Float32Array(2),I=new Float32Array(2),i=new se(e,{vertex:be,fragment:ge,uniforms:{iResolution:{value:A},iTime:{value:0},uHeight:{value:g},uBaseHalf:{value:y},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:fe},uOffsetPx:{value:I},uNoise:{value:K},uSaturation:{value:he},uScale:{value:L},uHueShift:{value:de},uColorFreq:{value:xe},uBloom:{value:pe},uCenterShift:{value:g*.25},uInvBaseHalf:{value:1/y},uInvHeight:{value:1/g},uMinAxis:{value:Math.min(y,g)},uPxScale:{value:1/((e.drawingBufferHeight||1)*.1*L)},uTimeScale:{value:B}}}),Re=new re(e,{geometry:Be,program:i}),J=()=>{let n=u.clientWidth||1,a=u.clientHeight||1,o=Math.min(window.devicePixelRatio||1,1,Math.sqrt(Xe/(n*a)));R.dpr=o,R.setSize(n,a),A[0]=e.drawingBufferWidth,A[1]=e.drawingBufferHeight,I[0]=me*o,I[1]=ve*o,i.uniforms.uPxScale.value=1/((e.drawingBufferHeight||1)*.1*L),b?.request()},$=new ResizeObserver(J);$.observe(u),J();let s=new Float32Array(9),ee=(n,a,o,t)=>{let c=Math.cos(n),l=Math.sin(n),f=Math.cos(a),m=Math.sin(a),p=Math.cos(o),M=Math.sin(o),Fe=c*p+l*m*M,Oe=-c*M+l*m*p,ze=l*f,Te=f*M,Ue=f*p,We=-m,_e=-l*p+c*m*M,qe=l*M+c*m*p,Ne=c*f;return t[0]=Fe,t[1]=Te,t[2]=_e,t[3]=Oe,t[4]=Ue,t[5]=qe,t[6]=ze,t[7]=We,t[8]=Ne,t},Ee=K<1e-6,He=performance.now(),te=()=>b?.request(),w=()=>Math.random(),Pe=(.3+w()*.6)*we,ye=(.2+w()*.7)*Me,Le=(.1+w()*.5)*Se,Ae=w()*Math.PI*2,Ie=w()*Math.PI*2,h=0,d=0,x=0,C=0,F=0,O=(n,a,o)=>n+(a-n)*o,r={x:0,y:0,inside:!0},Ce=n=>{let a=Math.max(1,window.innerWidth),o=Math.max(1,window.innerHeight),t=a*.5,c=o*.5,l=(n.clientX-t)/(a*.5),f=(n.clientY-c)/(o*.5);r.x=Math.max(-1,Math.min(1,l)),r.y=Math.max(-1,Math.min(1,f)),r.inside=!0},oe=()=>{r.inside=!1},ne=()=>{r.inside=!1},E=null;return v==="hover"?(E=n=>{Ce(n),te()},window.addEventListener("pointermove",E,{passive:!0}),window.addEventListener("mouseleave",oe),window.addEventListener("blur",ne),i.uniforms.uUseBaseWobble.value=0):v==="3drotate"?i.uniforms.uUseBaseWobble.value=0:i.uniforms.uUseBaseWobble.value=1,b=le(u,n=>{let a=(n-He)*.001;i.uniforms.iTime.value=a;let o=!0;if(v==="hover"){let t=.6*Q,c=.6*Q;C=(r.inside?-r.x:0)*c,F=(r.inside?r.y:0)*t;let l=h,f=d,m=x;h=O(l,C,j),d=O(f,F,j),x=O(m,0,.1),i.uniforms.uRot.value=ee(h,d,x,s),Ee&&Math.abs(h-C)<1e-4&&Math.abs(d-F)<1e-4&&Math.abs(x)<1e-4&&(o=!1)}else if(v==="3drotate"){let t=a*B;h=t*ye,d=Math.sin(t*Pe+Ae)*.6,x=Math.sin(t*Le+Ie)*.5,i.uniforms.uRot.value=ee(h,d,x,s),B<1e-6&&(o=!1)}else s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=1,s[5]=0,s[6]=0,s[7]=0,s[8]=1,i.uniforms.uRot.value=s,B<1e-6&&(o=!1);return R.render({scene:Re}),o},{observe:V}),te(),()=>{b.dispose(),$.disconnect(),v==="hover"&&(E&&window.removeEventListener("pointermove",E),window.removeEventListener("mouseleave",oe),window.removeEventListener("blur",ne)),e.canvas.parentElement===u&&u.removeChild(e.canvas),e.getExtension("WEBGL_lose_context")?.loseContext()}},[T,U,v,W,_,S?.x,S?.y,q,P,N,G,Z,X,Y,D,V]),(0,ue.jsx)("div",{className:"prism-container",ref:k})},Ke=Ye;export{Ke as default};
