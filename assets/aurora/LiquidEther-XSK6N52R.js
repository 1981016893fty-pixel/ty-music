import{A as ee,B as te,C as S,D as b,E as se,F as ie,H as g,I as oe,J as re,L as y,N as m,P as R,U as ne,e as j,h as p,i as f,k as J,l as K,n as Q,p as Z,q as P,x as n}from"./chunk-373ON3IH.js";import{a as q}from"./chunk-UNAOL2ER.js";import{a as Ae,b as $}from"./chunk-Y4TZAYY2.js";import{d as T}from"./chunk-LN3IJP7D.js";var x=T(Ae());var ae=T($()),Le=2e6,Ve=["#5227FF","#FF9FFC","#B497CF"];function Be({mouseForce:D=20,cursorSize:H=100,isViscous:z=!1,viscous:C=30,iterationsViscous:M=32,iterationsPoisson:F=32,dt:A=.014,BFECC:L=!0,resolution:V=.5,isBounce:B=!1,colors:k=Ve,style:ce={},className:ue="",autoDemo:I=!0,autoSpeed:O=.5,autoIntensity:U=2.2,takeoverDuration:G=.25,autoResumeDelay:W=1e3,autoRampDuration:X=.6}){let w=(0,x.useRef)(null);return(0,x.useEffect)(()=>{if(!w.current)return;function le(r){let e;Array.isArray(r)&&r.length>0?r.length===1?e=[r[0],r[0]]:e=r:e=["#ffffff","#ffffff"];let t=e.length,s=new Uint8Array(t*4);for(let o=0;o<t;o++){let a=new S(e[o]);s[o*4+0]=Math.round(a.r*255),s[o*4+1]=Math.round(a.g*255),s[o*4+2]=Math.round(a.b*255),s[o*4+3]=255}let i=new oe(s,t,1,Q);return i.magFilter=f,i.minFilter=f,i.wrapS=p,i.wrapT=p,i.generateMipmaps=!1,i.needsUpdate=!0,i}let N=le(k),he=new ee(0,0,0,0);class ve{constructor(){this.width=0,this.height=0,this.container=null,this.renderer=null}init(e){this.container=e,this.renderer=new ne({antialias:!1,alpha:!0,depth:!1}),this.renderer.autoClear=!1,this.renderer.setClearColor(new S(0),0),this.resize(),this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.display="block"}resize(){let e=this.container.getBoundingClientRect(),t=Math.max(1,Math.floor(e.width)),s=Math.max(1,Math.floor(e.height)),i=Math.min(window.devicePixelRatio||1,1,Math.sqrt(Le/(t*s))),o=this.renderer.domElement;(o.width!==Math.floor(t*i)||o.height!==Math.floor(s*i))&&this.renderer.setDrawingBufferSize(t,s,i);let a=t!==this.width||s!==this.height;return this.width=t,this.height=s,a}}let u=new ve;class de{constructor(){this.coords=new n,this.coords_old=new n,this.diff=new n,this.container=null,this.docTarget=null,this.listenerTarget=null,this.isHoverInside=!1,this.hasUserControl=!1,this.isAutoActive=!1,this.autoIntensity=2,this.takeoverActive=!1,this.takeoverStartTime=0,this.takeoverDuration=.25,this.takeoverFrom=new n,this.takeoverTo=new n,this.onInteract=null,this._onMouseMove=this.onDocumentMouseMove.bind(this),this._onTouchStart=this.onDocumentTouchStart.bind(this),this._onTouchMove=this.onDocumentTouchMove.bind(this),this._onTouchEnd=this.onTouchEnd.bind(this),this._onDocumentLeave=this.onDocumentLeave.bind(this)}init(e){this.container=e,this.docTarget=e.ownerDocument||null;let t=this.docTarget&&this.docTarget.defaultView||(typeof window<"u"?window:null);t&&(this.listenerTarget=t,this.listenerTarget.addEventListener("mousemove",this._onMouseMove),this.listenerTarget.addEventListener("touchstart",this._onTouchStart,{passive:!0}),this.listenerTarget.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this.listenerTarget.addEventListener("touchend",this._onTouchEnd),this.docTarget&&this.docTarget.addEventListener("mouseleave",this._onDocumentLeave))}dispose(){this.listenerTarget&&(this.listenerTarget.removeEventListener("mousemove",this._onMouseMove),this.listenerTarget.removeEventListener("touchstart",this._onTouchStart),this.listenerTarget.removeEventListener("touchmove",this._onTouchMove),this.listenerTarget.removeEventListener("touchend",this._onTouchEnd)),this.docTarget&&this.docTarget.removeEventListener("mouseleave",this._onDocumentLeave),this.listenerTarget=null,this.docTarget=null,this.container=null}isPointInside(e,t){if(!this.container)return!1;let s=this.container.getBoundingClientRect();return s.width===0||s.height===0?!1:e>=s.left&&e<=s.right&&t>=s.top&&t<=s.bottom}updateHoverState(e,t){return this.isHoverInside=this.isPointInside(e,t),this.isHoverInside}setCoords(e,t){if(!this.container)return;let s=this.container.getBoundingClientRect();if(s.width===0||s.height===0)return;let i=(e-s.left)/s.width,o=(t-s.top)/s.height;this.coords.set(i*2-1,-(o*2-1))}setNormalized(e,t){this.coords.set(e,t)}onDocumentMouseMove(e){if(this.updateHoverState(e.clientX,e.clientY)){if(this.onInteract&&this.onInteract(),this.isAutoActive&&!this.hasUserControl&&!this.takeoverActive){if(!this.container)return;let t=this.container.getBoundingClientRect();if(t.width===0||t.height===0)return;let s=(e.clientX-t.left)/t.width,i=(e.clientY-t.top)/t.height;this.takeoverFrom.copy(this.coords),this.takeoverTo.set(s*2-1,-(i*2-1)),this.takeoverStartTime=performance.now(),this.takeoverActive=!0,this.hasUserControl=!0,this.isAutoActive=!1;return}this.setCoords(e.clientX,e.clientY),this.hasUserControl=!0}}onDocumentTouchStart(e){if(e.touches.length!==1)return;let t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoords(t.clientX,t.clientY),this.hasUserControl=!0)}onDocumentTouchMove(e){if(e.touches.length!==1)return;let t=e.touches[0];this.updateHoverState(t.clientX,t.clientY)&&(this.onInteract&&this.onInteract(),this.setCoords(t.clientX,t.clientY))}onTouchEnd(){this.isHoverInside=!1}onDocumentLeave(){this.isHoverInside=!1}update(){if(this.takeoverActive){let e=(performance.now()-this.takeoverStartTime)/(this.takeoverDuration*1e3);if(e>=1)this.takeoverActive=!1,this.coords.copy(this.takeoverTo),this.coords_old.copy(this.coords),this.diff.set(0,0);else{let t=e*e*(3-2*e);this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo,t)}}this.diff.subVectors(this.coords,this.coords_old),this.coords_old.copy(this.coords),this.coords_old.x===0&&this.coords_old.y===0&&this.diff.set(0,0),this.isAutoActive&&!this.takeoverActive&&this.diff.multiplyScalar(this.autoIntensity)}}let c=new de;class pe{constructor(e,t,s){this.mouse=e,this.manager=t,this.enabled=s.enabled,this.speed=s.speed,this.resumeDelay=s.resumeDelay||3e3,this.rampDurationMs=(s.rampDuration||0)*1e3,this.active=!1,this.current=new n(0,0),this.target=new n,this.lastTime=performance.now(),this.activationTime=0,this.margin=.2,this._tmpDir=new n,this.pickNewTarget()}pickNewTarget(){let e=Math.random;this.target.set((e()*2-1)*(1-this.margin),(e()*2-1)*(1-this.margin))}forceStop(){this.active=!1,this.mouse.isAutoActive=!1}update(){if(!this.enabled)return;let e=performance.now();if(e-this.manager.lastUserInteraction<this.resumeDelay){this.active&&this.forceStop();return}if(this.mouse.isHoverInside){this.active&&this.forceStop();return}if(this.active||(this.active=!0,this.current.copy(this.mouse.coords),this.lastTime=e,this.activationTime=e),!this.active)return;this.mouse.isAutoActive=!0;let s=(e-this.lastTime)/1e3;this.lastTime=e,s>.2&&(s=.016);let i=this._tmpDir.subVectors(this.target,this.current),o=i.length();if(o<.01){this.pickNewTarget();return}i.normalize();let a=1;if(this.rampDurationMs>0){let _=Math.min(1,(e-this.activationTime)/this.rampDurationMs);a=_*_*(3-2*_)}let E=this.speed*s*a,d=Math.min(E,o);this.current.addScaledVector(i,d),this.mouse.setNormalized(this.current.x,this.current.y)}}let l=`
  attribute vec3 position;
  uniform vec2 px;
  uniform vec2 boundarySpace;
  varying vec2 uv;
  precision highp float;
  void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}
`,fe=`
  attribute vec3 position;
  uniform vec2 px;
  precision highp float;
  varying vec2 uv;
  void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}
`,me=`
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 pos = position.xy * scale * 2.0 * px + center;
    vUv = uv;
    gl_Position = vec4(pos, 0.0, 1.0);
}
`,Y=`
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform bool isBFECC;
    uniform vec2 fboSize;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
    if(isBFECC == false){
        vec2 vel = texture2D(velocity, uv).xy;
        vec2 uv2 = uv - vel * dt * ratio;
        vec2 newVel = texture2D(velocity, uv2).xy;
        gl_FragColor = vec4(newVel, 0.0, 0.0);
    } else {
        vec2 spot_new = uv;
        vec2 vel_old = texture2D(velocity, uv).xy;
        vec2 spot_old = spot_new - vel_old * dt * ratio;
        vec2 vel_new1 = texture2D(velocity, spot_old).xy;
        vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
        vec2 error = spot_new2 - spot_new;
        vec2 spot_new3 = spot_new - error / 2.0;
        vec2 vel_2 = texture2D(velocity, spot_new3).xy;
        vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
        vec2 newVel2 = texture2D(velocity, spot_old2).xy; 
        gl_FragColor = vec4(newVel2, 0.0, 0.0);
    }
}
`,ge=`
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D palette;
    uniform vec4 bgColor;
    varying vec2 uv;
    void main(){
    vec2 vel = texture2D(velocity, uv).xy;
    float lenv = clamp(length(vel), 0.0, 1.0);
    vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
    vec3 outRGB = mix(bgColor.rgb, c, lenv);
    float outA = mix(bgColor.a, 1.0, lenv);
    gl_FragColor = vec4(outRGB, outA);
}
`,ye=`
    precision highp float;
    uniform sampler2D velocity;
    uniform float dt;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
    float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
    float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
    float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
    float divergence = (x1 - x0 + y1 - y0) / 2.0;
    gl_FragColor = vec4(divergence / dt);
}
`,xe=`
    precision highp float;
    uniform vec2 force;
    uniform vec2 center;
    uniform vec2 scale;
    uniform vec2 px;
    varying vec2 vUv;
    void main(){
    vec2 circle = (vUv - 0.5) * 2.0;
    float d = 1.0 - min(length(circle), 1.0);
    d *= d;
    gl_FragColor = vec4(force * d, 0.0, 1.0);
}
`,we=`
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D divergence;
    uniform vec2 px;
    varying vec2 uv;
    void main(){
    float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
    float div = texture2D(divergence, uv).r;
    float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
    gl_FragColor = vec4(newP);
}
`,Ee=`
    precision highp float;
    uniform sampler2D pressure;
    uniform sampler2D velocity;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    float step = 1.0;
    float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
    float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
    float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
    float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
    vec2 v = texture2D(velocity, uv).xy;
    vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
    v = v - gradP * dt;
    gl_FragColor = vec4(v, 0.0, 1.0);
}
`,_e=`
    precision highp float;
    uniform sampler2D velocity;
    uniform sampler2D velocity_new;
    uniform float v;
    uniform vec2 px;
    uniform float dt;
    varying vec2 uv;
    void main(){
    vec2 old = texture2D(velocity, uv).xy;
    vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
    vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
    vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
    vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
    vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
    newv /= 4.0 * (1.0 + v * dt);
    gl_FragColor = vec4(newv, 0.0, 0.0);
}
`;class h{constructor(e){this.props=e||{},this.uniforms=this.props.material?.uniforms,this.scene=null,this.camera=null,this.material=null,this.geometry=null,this.plane=null}init(){this.scene=new b,this.camera=new R,this.uniforms&&(this.material=new m({depthTest:!1,depthWrite:!1,...this.props.material}),this.geometry=new y(2,2),this.plane=new g(this.geometry,this.material),this.scene.add(this.plane))}update(){u.renderer.setRenderTarget(this.props.output||null),u.renderer.render(this.scene,this.camera)}dispose(){for(let e of this.scene.children)e.geometry?.dispose(),e.material?.dispose()}}class Te extends h{constructor(e){super({material:{vertexShader:l,fragmentShader:Y,uniforms:{boundarySpace:{value:e.cellScale},px:{value:e.cellScale},fboSize:{value:e.fboSize},velocity:{value:e.src.texture},dt:{value:e.dt},isBFECC:{value:!0}}},output:e.dst}),this.uniforms=this.props.material.uniforms,this.init()}init(){super.init(),this.createBoundary()}createBoundary(){let e=new ie,t=new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]);e.setAttribute("position",new se(t,3));let s=new m({vertexShader:fe,fragmentShader:Y,depthTest:!1,depthWrite:!1,uniforms:this.uniforms});this.line=new re(e,s),this.scene.add(this.line)}update({dt:e,isBounce:t,BFECC:s}){this.uniforms.dt.value=e,this.line.visible=t,this.uniforms.isBFECC.value=s,super.update()}}class Se extends h{constructor(e){super({output:e.dst}),this.init(e)}init(e){super.init();let t=new y(1,1),s=new m({vertexShader:me,fragmentShader:xe,blending:j,depthTest:!1,depthWrite:!1,uniforms:{px:{value:e.cellScale},force:{value:new n(0,0)},center:{value:new n(0,0)},scale:{value:new n(e.cursor_size,e.cursor_size)}}});this.mouse=new g(t,s),this.scene.add(this.mouse)}update(e){let t=c.diff.x/2*e.mouse_force,s=c.diff.y/2*e.mouse_force;if(t===0&&s===0)return;let i=e.cursor_size*e.cellScale.x,o=e.cursor_size*e.cellScale.y,a=Math.min(Math.max(c.coords.x,-1+i+e.cellScale.x*2),1-i-e.cellScale.x*2),E=Math.min(Math.max(c.coords.y,-1+o+e.cellScale.y*2),1-o-e.cellScale.y*2),d=this.mouse.material.uniforms;d.force.value.set(t,s),d.center.value.set(a,E),d.scale.value.set(e.cursor_size,e.cursor_size),super.update()}}class be extends h{constructor(e){super({material:{vertexShader:l,fragmentShader:_e,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},velocity_new:{value:e.dst_.texture},v:{value:e.viscous},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({viscous:e,iterations:t,dt:s}){let i,o;this.uniforms.v.value=e;for(let a=0;a<t;a++)a%2===0?(i=this.props.output0,o=this.props.output1):(i=this.props.output1,o=this.props.output0),this.uniforms.velocity_new.value=i.texture,this.props.output=o,this.uniforms.dt.value=s,super.update();return o}}class Re extends h{constructor(e){super({material:{vertexShader:l,fragmentShader:ye,uniforms:{boundarySpace:{value:e.boundarySpace},velocity:{value:e.src.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e}){this.uniforms.velocity.value=e.texture,super.update()}}class De extends h{constructor(e){super({material:{vertexShader:l,fragmentShader:we,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.dst_.texture},divergence:{value:e.src.texture},px:{value:e.cellScale}}},output:e.dst,output0:e.dst_,output1:e.dst}),this.init()}update({iterations:e}){let t,s;for(let i=0;i<e;i++)i%2===0?(t=this.props.output0,s=this.props.output1):(t=this.props.output1,s=this.props.output0),this.uniforms.pressure.value=t.texture,this.props.output=s,super.update();return s}}class He extends h{constructor(e){super({material:{vertexShader:l,fragmentShader:Ee,uniforms:{boundarySpace:{value:e.boundarySpace},pressure:{value:e.src_p.texture},velocity:{value:e.src_v.texture},px:{value:e.cellScale},dt:{value:e.dt}}},output:e.dst}),this.init()}update({vel:e,pressure:t}){this.uniforms.velocity.value=e.texture,this.uniforms.pressure.value=t.texture,super.update()}}class ze{constructor(e){this.options={iterations_poisson:32,iterations_viscous:32,mouse_force:20,resolution:.5,cursor_size:100,viscous:30,isBounce:!1,dt:.014,isViscous:!1,BFECC:!0,...e},this.fbos={vel_0:null,vel_1:null,vel_viscous0:null,vel_viscous1:null,div:null,pressure_0:null,pressure_1:null},this.fboSize=new n,this.cellScale=new n,this.boundarySpace=new n,this.init()}init(){this.calcSize(),this.createAllFBO(),this.createShaderPass()}getFloatType(){return/(iPad|iPhone|iPod)/i.test(navigator.userAgent)?K:J}createAllFBO(){let t={type:this.getFloatType(),depthBuffer:!1,stencilBuffer:!1,minFilter:f,magFilter:f,wrapS:p,wrapT:p};for(let s in this.fbos){if(!this.options.isViscous&&s.startsWith("vel_viscous"))continue;let i=s.startsWith("vel_")?P:Z;this.fbos[s]=new te(this.fboSize.x,this.fboSize.y,{...t,format:i})}}createShaderPass(){this.advection=new Te({cellScale:this.cellScale,fboSize:this.fboSize,dt:this.options.dt,src:this.fbos.vel_0,dst:this.fbos.vel_1}),this.externalForce=new Se({cellScale:this.cellScale,cursor_size:this.options.cursor_size,dst:this.fbos.vel_1}),this.options.isViscous&&(this.viscous=new be({cellScale:this.cellScale,boundarySpace:this.boundarySpace,viscous:this.options.viscous,src:this.fbos.vel_1,dst:this.fbos.vel_viscous1,dst_:this.fbos.vel_viscous0,dt:this.options.dt})),this.divergence=new Re({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.vel_viscous0??this.fbos.vel_1,dst:this.fbos.div,dt:this.options.dt}),this.poisson=new De({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src:this.fbos.div,dst:this.fbos.pressure_1,dst_:this.fbos.pressure_0}),this.pressure=new He({cellScale:this.cellScale,boundarySpace:this.boundarySpace,src_p:this.fbos.pressure_0,src_v:this.fbos.vel_viscous0??this.fbos.vel_1,dst:this.fbos.vel_0,dt:this.options.dt})}calcSize(){let e=Math.max(1,Math.round(this.options.resolution*u.width)),t=Math.max(1,Math.round(this.options.resolution*u.height)),s=1/e,i=1/t;this.cellScale.set(s,i),this.fboSize.set(e,t)}resize(){this.calcSize();for(let e of Object.values(this.fbos))e?.setSize(this.fboSize.x,this.fboSize.y)}dispose(){for(let e of[this.advection,this.externalForce,this.viscous,this.divergence,this.poisson,this.pressure])e?.dispose();for(let e of Object.values(this.fbos))e?.dispose()}update(){this.options.isBounce?this.boundarySpace.set(0,0):this.boundarySpace.copy(this.cellScale),this.advection.update({dt:this.options.dt,isBounce:this.options.isBounce,BFECC:this.options.BFECC}),this.externalForce.update({cursor_size:this.options.cursor_size,mouse_force:this.options.mouse_force,cellScale:this.cellScale});let e=this.fbos.vel_1;this.options.isViscous&&(e=this.viscous.update({viscous:this.options.viscous,iterations:this.options.iterations_viscous,dt:this.options.dt})),this.divergence.update({vel:e});let t=this.poisson.update({iterations:this.options.iterations_poisson});this.pressure.update({vel:e,pressure:t})}}class Ce{constructor(e){this.simulation=new ze(e),this.scene=new b,this.camera=new R,this.output=new g(new y(2,2),new m({vertexShader:l,fragmentShader:ge,transparent:!0,depthTest:!1,depthWrite:!1,uniforms:{velocity:{value:this.simulation.fbos.vel_0.texture},boundarySpace:{value:new n},palette:{value:N},bgColor:{value:he}}})),this.scene.add(this.output)}dispose(){this.simulation.dispose(),this.output.geometry.dispose(),this.output.material.dispose()}resize(){this.simulation.resize()}render(){u.renderer.setRenderTarget(null),u.renderer.render(this.scene,this.camera)}update(){this.simulation.update(),this.render()}}class Me{constructor(e){this.props=e,u.init(e.$wrapper),c.init(e.$wrapper),c.autoIntensity=e.autoIntensity,c.takeoverDuration=e.takeoverDuration,this.lastUserInteraction=performance.now(),c.onInteract=()=>{this.lastUserInteraction=performance.now(),this.autoDriver&&this.autoDriver.forceStop()},this.autoDriver=new pe(c,this,{enabled:e.autoDemo,speed:e.autoSpeed,resumeDelay:e.autoResumeDelay,rampDuration:e.autoRampDuration}),this.output=new Ce(e.simulationOptions),this.props.$wrapper.prepend(u.renderer.domElement),this.loop=q(e.$wrapper,()=>(this.render(),!0)),this._resize=()=>this.resize(),this.resizeObserver=typeof ResizeObserver<"u"?new ResizeObserver(this._resize):null,this.resizeObserver?this.resizeObserver.observe(e.$wrapper):window.addEventListener("resize",this._resize),this.loop.request()}resize(){this.disposed||u.resize()&&this.output.resize()}render(){this.autoDriver.update(),c.update(),this.output.update()}dispose(){this.disposed=!0,this.loop.dispose(),this.resizeObserver?this.resizeObserver.disconnect():window.removeEventListener("resize",this._resize),c.dispose(),this.output.dispose(),N.dispose();let e=u.renderer,t=e.domElement;t.parentNode&&t.parentNode.removeChild(t),e.dispose(),e.forceContextLoss()}}let v=w.current;v.style.position=v.style.position||"relative",v.style.overflow=v.style.overflow||"hidden";let Fe=new Me({$wrapper:v,autoDemo:I,autoSpeed:O,autoIntensity:U,takeoverDuration:G,autoResumeDelay:W,autoRampDuration:X,simulationOptions:{mouse_force:D,cursor_size:H,isViscous:z,viscous:C,iterations_viscous:M,iterations_poisson:F,dt:A,BFECC:L,resolution:V,isBounce:B}});return()=>Fe.dispose()},[L,H,A,B,z,F,M,D,V,C,k,I,O,U,G,W,X]),(0,ae.jsx)("div",{ref:w,className:`liquid-ether-container ${ue||""}`,style:ce})}export{Be as default};
