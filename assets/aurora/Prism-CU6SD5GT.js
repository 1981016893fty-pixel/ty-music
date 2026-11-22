import{a as le}from"./chunk-UNAOL2ER.js";import{b as se,c as ie,d as re,f as ce}from"./chunk-BRQDMJ6T.js";import{a as Ge,b as ae}from"./chunk-Y4TZAYY2.js";import{d as T}from"./chunk-LN3IJP7D.js";var E=T(Ge());var ue=T(ae()),Xe=5e5,Ye=({height:U=3.5,baseWidth:W=5.5,animationType:v="rotate",glow:_=1,offset:b={x:0,y:0},noise:q=.5,transparent:H=!0,scale:z=3.6,hueShift:N=0,colorFrequency:G=1,hoverStrength:X=2,inertia:Y=.05,bloom:D=1,suspendWhenOffscreen:V=!1,timeScale:Z=.5})=>{let k=(0,E.useRef)(null);return(0,E.useEffect)(()=>{let u=k.current;if(!u)return;let S,g=Math.max(.001,U),P=Math.max(.001,W)*.5,fe=Math.max(0,_),K=Math.max(0,q),me=b?.x??0,ve=b?.y??0,he=H?1.5:1,L=Math.max(.001,z),de=N||0,xe=Math.max(0,G||1),we=Math.max(0,D||1),pe=1,Me=1,be=1,y=Math.max(0,Z??1),Q=Math.max(0,X||1),j=Math.max(0,Math.min(1,Y||.12)),B=new ie({dpr:1,alpha:H,antialias:!1,depth:!1}),e=B.gl;e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.disable(e.BLEND),Object.assign(e.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",display:"block"}),u.appendChild(e.canvas);let Se=`
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

        // The wobble and rotation are linear; only the distance along the ray changes.
        vec3 rayOrigin = uRot * vec3(f.x * wob[0].x, f.y, f.x * wob[1].x);
        vec3 rayDirection = uRot * vec3(wob[0].y, 0.0, wob[1].y);
        const int STEPS = 100;
        for (int i = 0; i < STEPS; i++) {
          vec3 p = rayOrigin + z * rayDirection;
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
    `,ye=new ce(e),A=new Float32Array(2),I=new Float32Array(2),i=new se(e,{vertex:Se,fragment:ge,uniforms:{iResolution:{value:A},iTime:{value:0},uHeight:{value:g},uBaseHalf:{value:P},uUseBaseWobble:{value:1},uRot:{value:new Float32Array([1,0,0,0,1,0,0,0,1])},uGlow:{value:fe},uOffsetPx:{value:I},uNoise:{value:K},uSaturation:{value:he},uScale:{value:L},uHueShift:{value:de},uColorFreq:{value:xe},uBloom:{value:we},uCenterShift:{value:g*.25},uInvBaseHalf:{value:1/P},uInvHeight:{value:1/g},uMinAxis:{value:Math.min(P,g)},uPxScale:{value:1/((e.drawingBufferHeight||1)*.1*L)},uTimeScale:{value:y}}}),Be=new re(e,{geometry:ye,program:i}),J=()=>{let n=u.clientWidth||1,a=u.clientHeight||1,o=Math.min(window.devicePixelRatio||1,1,Math.sqrt(Xe/(n*a)));B.dpr=o,B.setSize(n,a),A[0]=e.drawingBufferWidth,A[1]=e.drawingBufferHeight,I[0]=me*o,I[1]=ve*o,i.uniforms.uPxScale.value=1/((e.drawingBufferHeight||1)*.1*L),S?.request()},$=new ResizeObserver(J);$.observe(u),J();let s=new Float32Array(9),ee=(n,a,o,t)=>{let c=Math.cos(n),l=Math.sin(n),f=Math.cos(a),m=Math.sin(a),w=Math.cos(o),M=Math.sin(o),Oe=c*w+l*m*M,Fe=-c*M+l*m*w,Te=l*f,Ue=f*M,We=f*w,_e=-m,qe=-l*w+c*m*M,ze=l*M+c*m*w,Ne=c*f;return t[0]=Oe,t[1]=Ue,t[2]=qe,t[3]=Fe,t[4]=We,t[5]=ze,t[6]=Te,t[7]=_e,t[8]=Ne,t},Re=K<1e-6,Ee=performance.now(),te=()=>S?.request(),p=()=>Math.random(),He=(.3+p()*.6)*pe,Pe=(.2+p()*.7)*Me,Le=(.1+p()*.5)*be,Ae=p()*Math.PI*2,Ie=p()*Math.PI*2,h=0,d=0,x=0,C=0,O=0,F=(n,a,o)=>n+(a-n)*o,r={x:0,y:0,inside:!0},Ce=n=>{let a=Math.max(1,window.innerWidth),o=Math.max(1,window.innerHeight),t=a*.5,c=o*.5,l=(n.clientX-t)/(a*.5),f=(n.clientY-c)/(o*.5);r.x=Math.max(-1,Math.min(1,l)),r.y=Math.max(-1,Math.min(1,f)),r.inside=!0},oe=()=>{r.inside=!1},ne=()=>{r.inside=!1},R=null;return v==="hover"?(R=n=>{Ce(n),te()},window.addEventListener("pointermove",R,{passive:!0}),window.addEventListener("mouseleave",oe),window.addEventListener("blur",ne),i.uniforms.uUseBaseWobble.value=0):v==="3drotate"?i.uniforms.uUseBaseWobble.value=0:i.uniforms.uUseBaseWobble.value=1,S=le(u,n=>{let a=(n-Ee)*.001;i.uniforms.iTime.value=a;let o=!0;if(v==="hover"){let t=.6*Q,c=.6*Q;C=(r.inside?-r.x:0)*c,O=(r.inside?r.y:0)*t;let l=h,f=d,m=x;h=F(l,C,j),d=F(f,O,j),x=F(m,0,.1),i.uniforms.uRot.value=ee(h,d,x,s),Re&&Math.abs(h-C)<1e-4&&Math.abs(d-O)<1e-4&&Math.abs(x)<1e-4&&(o=!1)}else if(v==="3drotate"){let t=a*y;h=t*Pe,d=Math.sin(t*He+Ae)*.6,x=Math.sin(t*Le+Ie)*.5,i.uniforms.uRot.value=ee(h,d,x,s),y<1e-6&&(o=!1)}else s[0]=1,s[1]=0,s[2]=0,s[3]=0,s[4]=1,s[5]=0,s[6]=0,s[7]=0,s[8]=1,i.uniforms.uRot.value=s,y<1e-6&&(o=!1);return B.render({scene:Be}),o},{observe:V}),te(),()=>{S.dispose(),$.disconnect(),v==="hover"&&(R&&window.removeEventListener("pointermove",R),window.removeEventListener("mouseleave",oe),window.removeEventListener("blur",ne)),e.canvas.parentElement===u&&u.removeChild(e.canvas),e.getExtension("WEBGL_lose_context")?.loseContext()}},[U,W,v,_,q,b?.x,b?.y,z,H,N,G,Z,X,Y,D,V]),(0,ue.jsx)("div",{className:"prism-container",ref:k})},Ke=Ye;export{Ke as default};
