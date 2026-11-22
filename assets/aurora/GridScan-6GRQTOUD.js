import{A as Ze,B as I,C as Ue,D as fe,E as je,F as Ct,G as Pe,H as Re,K as Bt,L as Mt,M as U,Q as yt,R as be,S as d,U as It,a as At,b as ce,c as ue,d as N,f as xt,g as Et,i as re,j as L,k as Dt,m as Tt,o as wt,r as K,s as Me,t as T,u as ye,v as ie,w as F,x as A,y as St,z as Ie}from"./chunk-373ON3IH.js";import{a as cr,b as mt}from"./chunk-Y4TZAYY2.js";import{d as Ke}from"./chunk-LN3IJP7D.js";var ur=(()=>{let e=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),r=new Ct;return r.setAttribute("position",new je(e,3)),r.setAttribute("uv",new je(t,2)),r})(),G=class et{static get fullscreenGeometry(){return ur}constructor(t="Pass",r=new fe,i=new be){this.name=t,this.renderer=null,this.scene=r,this.camera=i,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthBlit=!1,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(t){if(this.rtt===t){let r=this.fullscreenMaterial;r!==null&&(r.needsUpdate=!0),this.rtt=!t}}set mainScene(t){}set mainCamera(t){}setRenderer(t){this.renderer=t}isEnabled(){return this.enabled}setEnabled(t){this.enabled=t}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(t){let r=this.screen;r!==null?r.material=t:(r=new Re(et.fullscreenGeometry,t),r.frustumCulled=!1,this.scene===null&&(this.scene=new fe),this.scene.add(r),this.screen=r)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(t){this.fullscreenMaterial=t}getDepthTexture(){return null}setDepthTexture(t,r=K){}render(t,r,i,a,s){throw new Error("Render method not implemented!")}setSize(t,r){}initialize(t,r,i){}dispose(){for(let t of Object.keys(this)){let r=this[t];(r instanceof I||r instanceof Pe||r instanceof Ie||r instanceof et)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},fr=class extends G{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,r,i,a){let s=e.state.buffers.stencil;s.setLocked(!1),s.setTest(!1)}},dr=`#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`,bt="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",Lt=class extends U{constructor(){super({name:"CopyMaterial",defines:{COLOR_SPACE_CONVERSION:"1",DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new d(null),depthBuffer:new d(null),channelWeights:new d(null),opacity:new d(1)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:dr,vertexShader:bt}),this.depthFunc=xt}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(e){let t=e!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){let t=e!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(e){this.colorSpaceConversion!==e&&(e?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(e){e!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=e):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}},hr=class extends G{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new Lt,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new I(1,1,{minFilter:re,magFilter:re,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,r,i,a){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,r){r!==void 0&&(this.renderTarget.texture.type=r,r!==L?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":e!==null&&e.outputColorSpace===T&&(this.renderTarget.texture.colorSpace=T))}},Ut=new Ue,Ft=class extends G{constructor(e=!0,t=!0,r=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=r,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,r){this.color=e,this.depth=t,this.stencil=r}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,r,i,a){let s=this.overrideClearColor,n=this.overrideClearAlpha,l=e.getClearAlpha(),c=s!==null,u=n>=0;c?(e.getClearColor(Ut),e.setClearColor(s,u?n:l)):u&&e.setClearAlpha(n),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),c?e.setClearColor(Ut,l):u&&e.setClearAlpha(l)}},vr=class extends G{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new Ft(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,r,i,a){let s=e.getContext(),n=e.state.buffers,l=this.scene,c=this.camera,u=this.clearPass,m=this.inverted?0:1,h=1-m;n.color.setMask(!1),n.depth.setMask(!1),n.color.setLocked(!0),n.depth.setLocked(!0),n.stencil.setTest(!0),n.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),n.stencil.setFunc(s.ALWAYS,m,4294967295),n.stencil.setClear(h),n.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?u.render(e,null):(u.render(e,t),u.render(e,r))),this.renderToScreen?(e.setRenderTarget(null),e.render(l,c)):(e.setRenderTarget(t),e.render(l,c),e.setRenderTarget(r),e.render(l,c)),n.color.setLocked(!1),n.depth.setLocked(!1),n.stencil.setLocked(!1),n.stencil.setFunc(s.EQUAL,1,4294967295),n.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),n.stencil.setLocked(!0)}},Je=1/1e3,gr=1e3,pr=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document<"u"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*Je}get fixedDelta(){return this._fixedDelta*Je}set fixedDelta(e){this._fixedDelta=e*gr}get elapsed(){return this._elapsed*Je}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e!==void 0?e:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},Ot=class{constructor(e=null,{depthBuffer:t=!0,stencilBuffer:r=!1,multisampling:i=0,frameBufferType:a}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,r,a,i),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new hr,this.depthRenderTarget=null,this.passes=[],this.timer=new pr,this.autoRenderToScreen=!0,this.setRenderer(e)}get stableDepthTexture(){return this.depthRenderTarget===null?null:this.depthRenderTarget.depthTexture}get multisampling(){return this.inputBuffer.samples}set multisampling(e){this.multisampling!==e&&(this.inputBuffer.samples=e,this.outputBuffer.samples=e,this.inputBuffer.dispose(),this.outputBuffer.dispose())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(e){if(this.renderer=e,e!==null){let t=e.getSize(new A),r=e.getContext().getContextAttributes().alpha,i=this.inputBuffer.texture.type;i===L&&e.outputColorSpace===T&&(this.inputBuffer.texture.colorSpace=T,this.outputBuffer.texture.colorSpace=T,this.inputBuffer.dispose(),this.outputBuffer.dispose()),e.autoClear=!1,this.setSize(t.width,t.height);for(let a of this.passes)a.initialize(e,r,i)}}replaceRenderer(e,t=!0){let r=this.renderer,i=r.domElement.parentNode;return this.setRenderer(e),t&&i!==null&&(i.removeChild(r.domElement),i.appendChild(e.domElement)),r}createDepthTexture(){let e=new Bt;e.name="EffectComposer.InputDepth",this.inputBuffer.stencilBuffer?(e.format=wt,e.type=Tt):e.type=Dt;let t=e.clone();t.name="EffectComposer.OutputDepth";let r=e.clone();r.name="EffectComposer.StableDepth",this.inputBuffer.depthTexture=e,this.outputBuffer.depthTexture=t,this.inputBuffer.dispose(),this.outputBuffer.dispose();let{width:i,height:a}=this.inputBuffer;this.depthRenderTarget=new I(i,a,{depthBuffer:!0,stencilBuffer:this.inputBuffer.stencilBuffer,depthTexture:r})}blitDepthBuffer(e){let t=this.renderer,r=this.depthRenderTarget,i=t.properties,a=t.getContext();t.setRenderTarget(r);let s=i.get(e).__webglFramebuffer,n=i.get(r).__webglFramebuffer,l=e.stencilBuffer?a.DEPTH_BUFFER_BIT|a.STENCIL_BUFFER_BIT:a.DEPTH_BUFFER_BIT;a.bindFramebuffer(a.READ_FRAMEBUFFER,s),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,n),a.blitFramebuffer(0,0,e.width,e.height,0,0,r.width,r.height,l,a.NEAREST),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),t.setRenderTarget(null)}deleteDepthTexture(){let e=this.stableDepthTexture;for(let t of this.passes)t.getDepthTexture()===e&&t.setDepthTexture(null);this.depthRenderTarget!==null&&(this.depthRenderTarget.dispose(),this.depthRenderTarget=null),this.inputBuffer.depthTexture!==null&&(this.inputBuffer.depthTexture.dispose(),this.inputBuffer.depthTexture=null),this.outputBuffer.depthTexture!==null&&(this.outputBuffer.depthTexture.dispose(),this.outputBuffer.depthTexture=null)}createBuffer(e,t,r,i){let a=this.renderer,s=a===null?new A:a.getDrawingBufferSize(new A),n=new I(s.width,s.height,{minFilter:re,magFilter:re,samples:i,stencilBuffer:t,depthBuffer:e,type:r});return r===L&&a!==null&&a.outputColorSpace===T&&(n.texture.colorSpace=T),n.texture.name="EffectComposer.Buffer",n.texture.generateMipmaps=!1,n}setMainScene(e){for(let t of this.passes)t.mainScene=e}setMainCamera(e){for(let t of this.passes)t.mainCamera=e}addPass(e,t){let r=this.passes,i=this.renderer,a=i.getDrawingBufferSize(new A),s=i.getContext().getContextAttributes().alpha,n=this.inputBuffer.texture.type;if(e.renderer=i,e.setSize(a.width,a.height),e.initialize(i,s,n),this.autoRenderToScreen&&(r.length>0&&(r[r.length-1].renderToScreen=!1),e.renderToScreen&&(this.autoRenderToScreen=!1)),t!==void 0?r.splice(t,0,e):r.push(e),this.autoRenderToScreen&&(r[r.length-1].renderToScreen=!0),e.needsDepthTexture||this.depthRenderTarget!==null)if(this.depthRenderTarget===null){this.createDepthTexture();for(let l of r)l.setDepthTexture(this.stableDepthTexture)}else e.setDepthTexture(this.stableDepthTexture)}removePass(e){let t=this.passes,r=t.indexOf(e);if(r!==-1&&t.splice(r,1).length>0){let s=this.stableDepthTexture;if(s!==null){let n=(c,u)=>c||u.needsDepthTexture;t.reduce(n,!1)||(e.getDepthTexture()===s&&e.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&r===t.length&&(e.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){let e=this.passes;this.deleteDepthTexture(),e.length>0&&(this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!1),this.passes=[])}render(e){let t=this.renderer,r=this.copyPass,i=this.inputBuffer,a=this.outputBuffer,s,n=!1;e===void 0&&(this.timer.update(),e=this.timer.getDelta());for(let l of this.passes)if(l.enabled){if(l.render(t,i,a,e,n),l.needsDepthBlit&&this.depthRenderTarget!==null&&this.blitDepthBuffer(i),l.needsSwap){if(n){r.renderToScreen=l.renderToScreen;let c=t.getContext(),u=t.state.buffers.stencil;u.setFunc(c.NOTEQUAL,1,4294967295),r.render(t,i,a,e,n),u.setFunc(c.EQUAL,1,4294967295)}s=i,i=a,a=s}l instanceof vr?n=!0:l instanceof fr&&(n=!1)}}setSize(e,t,r){let i=this.renderer,a=i.getSize(new A);(e===void 0||t===void 0)&&(e=a.width,t=a.height),(a.width!==e||a.height!==t)&&i.setSize(e,t,r);let s=i.getDrawingBufferSize(new A);this.inputBuffer.setSize(s.width,s.height),this.outputBuffer.setSize(s.width,s.height),this.depthRenderTarget!==null&&this.depthRenderTarget.setSize(s.width,s.height);for(let n of this.passes)n.setSize(s.width,s.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(let e of this.passes)e.dispose();this.deleteDepthTexture(),this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.copyPass.dispose(),this.timer.dispose(),this.passes=[],G.fullscreenGeometry.dispose()}},j={NONE:0,DEPTH:1,CONVOLUTION:2},p={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},mr=class{constructor(){this.shaderParts=new Map([[p.FRAGMENT_HEAD,null],[p.FRAGMENT_MAIN_UV,null],[p.FRAGMENT_MAIN_IMAGE,null],[p.VERTEX_HEAD,null],[p.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=j.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=ye}};var qe=!1,Pt=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let r;if(t.material.flatShading)switch(t.material.side){case ue:r=this.materialsFlatShadedDoubleSide;break;case ce:r=this.materialsFlatShadedBackSide;break;default:r=this.materialsFlatShaded;break}else switch(t.material.side){case ue:r=this.materialsDoubleSide;break;case ce:r=this.materialsBackSide;break;default:r=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=r[2]:t.isInstancedMesh?t.material=r[1]:t.material=r[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof U))return e.clone();let t=e.uniforms,r=new Map;for(let a in t){let s=t[a].value;s.isRenderTargetTexture&&(t[a].value=null,r.set(a,s))}let i=e.clone();for(let a of r)t[a[0]].value=a[1],i.uniforms[a[0]].value=a[1];return i}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){let t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(let r of t)r.uniforms=Object.assign({},e.uniforms),r.side=At;t[2].skinning=!0,this.materialsBackSide=t.map(r=>{let i=this.cloneMaterial(r);return i.uniforms=Object.assign({},e.uniforms),i.side=ce,i}),this.materialsDoubleSide=t.map(r=>{let i=this.cloneMaterial(r);return i.uniforms=Object.assign({},e.uniforms),i.side=ue,i}),this.materialsFlatShaded=t.map(r=>{let i=this.cloneMaterial(r);return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i}),this.materialsFlatShadedBackSide=t.map(r=>{let i=this.cloneMaterial(r);return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i.side=ce,i}),this.materialsFlatShadedDoubleSide=t.map(r=>{let i=this.cloneMaterial(r);return i.uniforms=Object.assign({},e.uniforms),i.flatShading=!0,i.side=ue,i})}}render(e,t,r){let i=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,qe){let a=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,r);for(let s of a)s[0].material=s[1];this.meshCount!==a.size&&a.clear()}else{let a=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,r),t.overrideMaterial=a}e.shadowMap.enabled=i}disposeMaterials(){if(this.material!==null){let e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return qe}static set workaroundEnabled(e){qe=e}};var Z=-1,V=class extends ie{constructor(e=null,t=Z,r=Z,i=1){super(),e!==null&&this.addEventListener("change",()=>e.setSize(this.baseSize.width,this.baseSize.height)),this.baseSize=new A(1,1),this.preferredSize=new A(t,r),this.target=this.preferredSize,this.s=i,this.effectiveSize=new A,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){let e=this.baseSize,t=this.preferredSize,r=this.effectiveSize,i=this.scale;t.width!==Z?r.width=t.width:t.height!==Z?r.width=Math.round(t.height*(e.width/Math.max(e.height,1))):r.width=Math.round(e.width*i),t.height!==Z?r.height=t.height:t.width!==Z?r.height=Math.round(t.width/Math.max(e.width/Math.max(e.height,1),1)):r.height=Math.round(e.height*i)}get width(){return this.effectiveSize.width}set width(e){this.preferredWidth=e}get height(){return this.effectiveSize.height}set height(e){this.preferredHeight=e}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(e){this.s!==e&&(this.s=e,this.preferredSize.setScalar(Z),this.dispatchEvent({type:"change"}))}getScale(){return this.scale}setScale(e){this.scale=e}get baseWidth(){return this.baseSize.width}set baseWidth(e){this.baseSize.width!==e&&(this.baseSize.width=e,this.dispatchEvent({type:"change"}))}getBaseWidth(){return this.baseWidth}setBaseWidth(e){this.baseWidth=e}get baseHeight(){return this.baseSize.height}set baseHeight(e){this.baseSize.height!==e&&(this.baseSize.height=e,this.dispatchEvent({type:"change"}))}getBaseHeight(){return this.baseHeight}setBaseHeight(e){this.baseHeight=e}setBaseSize(e,t){(this.baseSize.width!==e||this.baseSize.height!==t)&&(this.baseSize.set(e,t),this.dispatchEvent({type:"change"}))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(e){this.preferredSize.width!==e&&(this.preferredSize.width=e,this.dispatchEvent({type:"change"}))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(e){this.preferredWidth=e}get preferredHeight(){return this.preferredSize.height}set preferredHeight(e){this.preferredSize.height!==e&&(this.preferredSize.height=e,this.dispatchEvent({type:"change"}))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(e){this.preferredHeight=e}setPreferredSize(e,t){(this.preferredSize.width!==e||this.preferredSize.height!==t)&&(this.preferredSize.set(e,t),this.dispatchEvent({type:"change"}))}copy(e){this.s=e.scale,this.baseSize.set(e.baseWidth,e.baseHeight),this.preferredSize.set(e.preferredWidth,e.preferredHeight),this.dispatchEvent({type:"change"})}static get AUTO_SIZE(){return Z}};var v={SKIP:9,SET:30,ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Ar="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",xr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}",Er="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Dr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Tr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",wr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Sr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Cr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Br="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Mr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",yr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ir="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ur="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Pr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Rr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",br="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Lr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Fr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Or="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Nr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Hr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Gr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",kr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}",zr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",_r="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Vr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Qr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Wr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Yr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Xr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}",Kr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Zr="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",jr=new Map([[v.ADD,Ar],[v.ALPHA,xr],[v.AVERAGE,Er],[v.COLOR,Dr],[v.COLOR_BURN,Tr],[v.COLOR_DODGE,wr],[v.DARKEN,Sr],[v.DIFFERENCE,Cr],[v.DIVIDE,Br],[v.DST,null],[v.EXCLUSION,Mr],[v.HARD_LIGHT,yr],[v.HARD_MIX,Ir],[v.HUE,Ur],[v.INVERT,Pr],[v.INVERT_RGB,Rr],[v.LIGHTEN,br],[v.LINEAR_BURN,Lr],[v.LINEAR_DODGE,Fr],[v.LINEAR_LIGHT,Or],[v.LUMINOSITY,Nr],[v.MULTIPLY,Hr],[v.NEGATION,Gr],[v.NORMAL,kr],[v.OVERLAY,zr],[v.PIN_LIGHT,_r],[v.REFLECT,Vr],[v.SATURATION,Qr],[v.SCREEN,Wr],[v.SOFT_LIGHT,Yr],[v.SRC,Xr],[v.SUBTRACT,Kr],[v.VIVID_LIGHT,Zr]]),Jr=class extends ie{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new d(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return jr.get(this.blendFunction)}};var Nt=class extends ie{constructor(e,t,{attributes:r=j.NONE,blendFunction:i=v.NORMAL,defines:a=new Map,uniforms:s=new Map,extensions:n=null,vertexShader:l=null}={}){super(),this.name=e,this.renderer=null,this.attributes=r,this.fragmentShader=t,this.vertexShader=l,this.defines=a,this.uniforms=s,this.extensions=n,this.blendMode=new Jr(i),this.blendMode.addEventListener("change",c=>this.setChanged()),this._inputColorSpace=ye,this._outputColorSpace=Me}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(e,t=K){}update(e,t,r){}setSize(e,t){}initialize(e,t,r){}dispose(){for(let e of Object.keys(this)){let t=this[e];(t instanceof I||t instanceof Pe||t instanceof Ie||t instanceof G)&&this[e].dispose()}}};var tt={VERY_SMALL:0,SMALL:1,MEDIUM:2,LARGE:3,VERY_LARGE:4,HUGE:5},qr=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`,$r="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",ei=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],ti=class extends U{constructor(e=new Ze){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new d(null),texelSize:new d(new Ze),scale:new d(1),kernel:new d(0)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:qr,vertexShader:$r}),this.setTexelSize(e.x,e.y),this.kernelSize=tt.MEDIUM}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.inputBuffer=e}get kernelSequence(){return ei[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(e){this.uniforms.scale.value=e}getScale(){return this.uniforms.scale.value}setScale(e){this.uniforms.scale.value=e}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(e){this.uniforms.kernel.value=e}setKernel(e){this.kernel=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t,e*.5,t*.5)}setSize(e,t){let r=1/e,i=1/t;this.uniforms.texelSize.value.set(r,i,r*.5,i*.5)}},ri=class extends G{constructor({kernelSize:e=tt.MEDIUM,resolutionScale:t=.5,width:r=V.AUTO_SIZE,height:i=V.AUTO_SIZE,resolutionX:a=r,resolutionY:s=i}={}){super("KawaseBlurPass"),this.renderTargetA=new I(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";let n=this.resolution=new V(this,a,s,t);n.addEventListener("change",l=>this.setSize(n.baseWidth,n.baseHeight)),this._blurMaterial=new ti,this._blurMaterial.kernelSize=e,this.copyMaterial=new Lt}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(e){this._blurMaterial=e}get dithering(){return this.copyMaterial.dithering}set dithering(e){this.copyMaterial.dithering=e}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(e){this.blurMaterial.kernelSize=e}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get scale(){return this.blurMaterial.scale}set scale(e){this.blurMaterial.scale=e}getScale(){return this.blurMaterial.scale}setScale(e){this.blurMaterial.scale=e}getKernelSize(){return this.kernelSize}setKernelSize(e){this.kernelSize=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,r,i,a){let s=this.scene,n=this.camera,l=this.renderTargetA,c=this.renderTargetB,u=this.blurMaterial,m=u.kernelSequence,h=t;this.fullscreenMaterial=u;for(let E=0,x=m.length;E<x;++E){let M=(E&1)===0?l:c;u.kernel=m[E],u.inputBuffer=h.texture,e.setRenderTarget(M),e.render(s,n),h=M}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=h.texture,e.setRenderTarget(this.renderToScreen?null:r),e.render(s,n)}setSize(e,t){let r=this.resolution;r.setBaseSize(e,t);let i=r.width,a=r.height;this.renderTargetA.setSize(i,a),this.renderTargetB.setSize(i,a),this.blurMaterial.setSize(e,t)}initialize(e,t,r){r!==void 0&&(this.renderTargetA.texture.type=r,this.renderTargetB.texture.type=r,r!==L?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):e!==null&&e.outputColorSpace===T&&(this.renderTargetA.texture.colorSpace=T,this.renderTargetB.texture.colorSpace=T))}static get AUTO_SIZE(){return V.AUTO_SIZE}},ii=`#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);float mask=1.0;
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);mask=low*high;
#elif defined(THRESHOLD)
mask=smoothstep(threshold,threshold+smoothing,l);
#endif
#ifdef COLOR
gl_FragColor=texel*mask;
#else
gl_FragColor=vec4(l*mask);
#endif
}`,ai=class extends U{constructor(e=!1,t=null){super({name:"LuminanceMaterial",defines:{THREE_REVISION:"185".replace(/\D+/g,"")},uniforms:{inputBuffer:new d(null),threshold:new d(0),smoothing:new d(1),range:new d(null)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ii,vertexShader:bt}),this.colorOutput=e,this.luminanceRange=t}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get threshold(){return this.uniforms.threshold.value}set threshold(e){this.smoothing>0||e>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.threshold.value=e}getThreshold(){return this.threshold}setThreshold(e){this.threshold=e}get smoothing(){return this.uniforms.smoothing.value}set smoothing(e){this.threshold>0||e>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.smoothing.value=e}getSmoothingFactor(){return this.smoothing}setSmoothingFactor(e){this.smoothing=e}get useThreshold(){return this.threshold>0||this.smoothing>0}set useThreshold(e){}get colorOutput(){return this.defines.COLOR!==void 0}set colorOutput(e){e?this.defines.COLOR="1":delete this.defines.COLOR,this.needsUpdate=!0}isColorOutputEnabled(e){return this.colorOutput}setColorOutputEnabled(e){this.colorOutput=e}get useRange(){return this.luminanceRange!==null}set useRange(e){this.luminanceRange=null}get luminanceRange(){return this.uniforms.range.value}set luminanceRange(e){e!==null?this.defines.RANGE="1":delete this.defines.RANGE,this.uniforms.range.value=e,this.needsUpdate=!0}getLuminanceRange(){return this.luminanceRange}setLuminanceRange(e){this.luminanceRange=e}},si=class extends G{constructor({renderTarget:e,luminanceRange:t,colorOutput:r,resolutionScale:i=1,width:a=V.AUTO_SIZE,height:s=V.AUTO_SIZE,resolutionX:n=a,resolutionY:l=s}={}){super("LuminancePass"),this.fullscreenMaterial=new ai(r,t),this.needsSwap=!1,this.renderTarget=e,this.renderTarget===void 0&&(this.renderTarget=new I(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="LuminancePass.Target");let c=this.resolution=new V(this,n,l,i);c.addEventListener("change",u=>this.setSize(c.baseWidth,c.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}render(e,t,r,i,a){let s=this.fullscreenMaterial;s.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){let r=this.resolution;r.setBaseSize(e,t),this.renderTarget.setSize(r.width,r.height)}initialize(e,t,r){r!==void 0&&r!==L&&(this.renderTarget.texture.type=r,this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},ni=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.05556
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`,oi="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",li=class extends U{constructor(){super({name:"DownsamplingMaterial",uniforms:{inputBuffer:new d(null),texelSize:new d(new A)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ni,vertexShader:oi})}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},ci=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`,ui="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",fi=class extends U{constructor(){super({name:"UpsamplingMaterial",uniforms:{inputBuffer:new d(null),supportBuffer:new d(null),texelSize:new d(new A),radius:new d(.85)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:ci,vertexShader:ui})}set inputBuffer(e){this.uniforms.inputBuffer.value=e}set supportBuffer(e){this.uniforms.supportBuffer.value=e}get radius(){return this.uniforms.radius.value}set radius(e){this.uniforms.radius.value=e}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},di=class extends G{constructor(){super("MipmapBlurPass"),this.needsSwap=!1,this.renderTarget=new I(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Upsampling.Mipmap0",this.downsamplingMipmaps=[],this.upsamplingMipmaps=[],this.downsamplingMaterial=new li,this.upsamplingMaterial=new fi,this.resolution=new A}get texture(){return this.renderTarget.texture}get levels(){return this.downsamplingMipmaps.length}set levels(e){if(this.levels!==e){let t=this.renderTarget;this.dispose(),this.downsamplingMipmaps=[],this.upsamplingMipmaps=[];for(let r=0;r<e;++r){let i=t.clone();i.texture.name="Downsampling.Mipmap"+r,this.downsamplingMipmaps.push(i)}this.upsamplingMipmaps.push(t);for(let r=1,i=e-1;r<i;++r){let a=t.clone();a.texture.name="Upsampling.Mipmap"+r,this.upsamplingMipmaps.push(a)}this.setSize(this.resolution.x,this.resolution.y)}}get radius(){return this.upsamplingMaterial.radius}set radius(e){this.upsamplingMaterial.radius=e}render(e,t,r,i,a){let{scene:s,camera:n}=this,{downsamplingMaterial:l,upsamplingMaterial:c}=this,{downsamplingMipmaps:u,upsamplingMipmaps:m}=this,h=t;this.fullscreenMaterial=l;for(let E=0,x=u.length;E<x;++E){let M=u[E];l.setSize(h.width,h.height),l.inputBuffer=h.texture,e.setRenderTarget(M),e.render(s,n),h=M}this.fullscreenMaterial=c;for(let E=m.length-1;E>=0;--E){let x=m[E];c.setSize(h.width,h.height),c.inputBuffer=h.texture,c.supportBuffer=u[E].texture,e.setRenderTarget(x),e.render(s,n),h=x}}setSize(e,t){let r=this.resolution;r.set(e,t);let i=r.width,a=r.height;for(let s=0,n=this.downsamplingMipmaps.length;s<n;++s)i=Math.round(i*.5),a=Math.round(a*.5),this.downsamplingMipmaps[s].setSize(i,a),s<this.upsamplingMipmaps.length&&this.upsamplingMipmaps[s].setSize(i,a)}initialize(e,t,r){if(r!==void 0){let i=this.downsamplingMipmaps.concat(this.upsamplingMipmaps);for(let a of i)a.texture.type=r;if(r!==L)this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1";else if(e!==null&&e.outputColorSpace===T)for(let a of i)a.texture.colorSpace=T}}dispose(){super.dispose();for(let e of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))e.dispose()}},hi=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv)*intensity;}`,Ht=class extends Nt{constructor({blendFunction:e=v.SCREEN,luminanceThreshold:t=1,luminanceSmoothing:r=.03,mipmapBlur:i=!0,intensity:a=1,radius:s=.85,levels:n=8,kernelSize:l=tt.LARGE,resolutionScale:c=.5,width:u=V.AUTO_SIZE,height:m=V.AUTO_SIZE,resolutionX:h=u,resolutionY:E=m}={}){super("BloomEffect",hi,{blendFunction:e,uniforms:new Map([["map",new d(null)],["intensity",new d(a)]])}),this.renderTarget=new I(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Bloom.Target",this.blurPass=new ri({kernelSize:l}),this.luminancePass=new si({colorOutput:!0}),this.luminanceMaterial.threshold=t,this.luminanceMaterial.smoothing=r,this.mipmapBlurPass=new di,this.mipmapBlurPass.enabled=i,this.mipmapBlurPass.radius=s,this.mipmapBlurPass.levels=n,this.uniforms.get("map").value=i?this.mipmapBlurPass.texture:this.renderTarget.texture;let x=this.resolution=new V(this,h,E,c);x.addEventListener("change",M=>this.setSize(x.baseWidth,x.baseHeight))}get texture(){return this.mipmapBlurPass.enabled?this.mipmapBlurPass.texture:this.renderTarget.texture}getTexture(){return this.texture}getResolution(){return this.resolution}getBlurPass(){return this.blurPass}getLuminancePass(){return this.luminancePass}get luminanceMaterial(){return this.luminancePass.fullscreenMaterial}getLuminanceMaterial(){return this.luminancePass.fullscreenMaterial}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get dithering(){return this.blurPass.dithering}set dithering(e){this.blurPass.dithering=e}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(e){this.blurPass.kernelSize=e}get distinction(){return console.warn(this.name,"distinction was removed"),1}set distinction(e){console.warn(this.name,"distinction was removed")}get intensity(){return this.uniforms.get("intensity").value}set intensity(e){this.uniforms.get("intensity").value=e}getIntensity(){return this.intensity}setIntensity(e){this.intensity=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}update(e,t,r){let i=this.renderTarget,a=this.luminancePass;a.enabled?(a.render(e,t),this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(e,a.renderTarget):this.blurPass.render(e,a.renderTarget,i)):this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(e,t):this.blurPass.render(e,t,i)}setSize(e,t){let r=this.resolution;r.setBaseSize(e,t),this.renderTarget.setSize(r.width,r.height),this.blurPass.resolution.copy(r),this.luminancePass.setSize(e,t),this.mipmapBlurPass.setSize(e,t)}initialize(e,t,r){this.blurPass.initialize(e,t,r),this.luminancePass.initialize(e,t,r),this.mipmapBlurPass.initialize(e,t,r),r!==void 0&&(this.renderTarget.texture.type=r,e!==null&&e.outputColorSpace===T&&(this.renderTarget.texture.colorSpace=T))}};var vi=`#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`,gi="uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}",Gt=class extends Nt{constructor({offset:e=new A(.001,5e-4),radialModulation:t=!1,modulationOffset:r=.15}={}){super("ChromaticAberrationEffect",vi,{vertexShader:gi,attributes:j.CONVOLUTION,uniforms:new Map([["offset",new d(e)],["modulationOffset",new d(r)]])}),this.radialModulation=t}get offset(){return this.uniforms.get("offset").value}set offset(e){this.uniforms.get("offset").value=e}get radialModulation(){return this.defines.has("RADIAL_MODULATION")}set radialModulation(e){e?this.defines.set("RADIAL_MODULATION","1"):this.defines.delete("RADIAL_MODULATION"),this.setChanged()}get modulationOffset(){return this.uniforms.get("modulationOffset").value}set modulationOffset(e){this.uniforms.get("modulationOffset").value=e}getOffset(){return this.offset}setOffset(e){this.offset=e}};var kt=class extends G{constructor(e,t,r=null){super("RenderPass",e,t),this.needsSwap=!1,this.needsDepthBlit=!0,this.clearPass=new Ft,this.overrideMaterialManager=r===null?null:new Pt(r),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){let e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){let t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new Pt(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,r,i,a){let s=this.scene,n=this.camera,l=this.selection,c=n.layers.mask,u=s.background,m=e.shadowMap.autoUpdate,h=this.renderToScreen?null:t;l!==null&&n.layers.set(l.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(s.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(h),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,s,n):e.render(s,n),n.layers.mask=c,s.background=u,e.shadowMap.autoUpdate=m}};var _i=Math.PI*.5;var pi=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,mi="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",Ai=class extends U{constructor(e,t,r,i,a=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:"185".replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new d(null),depthBuffer:new d(null),resolution:new d(new A),texelSize:new d(new A),cameraNear:new d(.3),cameraFar:new d(1e3),aspect:new d(1),time:new d(0)},blending:N,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:a}),e&&this.setShaderParts(e),t&&this.setDefines(t),r&&this.setUniforms(r),this.copyCameraSettings(i)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=K){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=pi.replace(p.FRAGMENT_HEAD,e.get(p.FRAGMENT_HEAD)||"").replace(p.FRAGMENT_MAIN_UV,e.get(p.FRAGMENT_MAIN_UV)||"").replace(p.FRAGMENT_MAIN_IMAGE,e.get(p.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=mi.replace(p.VERTEX_HEAD,e.get(p.VERTEX_HEAD)||"").replace(p.VERTEX_MAIN_SUPPORT,e.get(p.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(e){for(let t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(let t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(let t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof yt?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){let r=this.uniforms;r.resolution.value.set(e,t),r.texelSize.value.set(1/e,1/t),r.aspect.value=e/t}static get Section(){return p}};var Qi=Number("185".replace(/\D+/g,"")),$=255/256,Wi=new Float32Array([$/256**3,$/256**2,$/256,$]),Yi=new Float32Array([$,$/256,$/256**2,1/256**3]);function Rt(e,t,r){for(let i of t){let a="$1"+e+i.charAt(0).toUpperCase()+i.slice(1),s=new RegExp("([^\\.])(\\b"+i+"\\b)","g");for(let n of r.entries())n[1]!==null&&r.set(n[0],n[1].replace(s,a))}}function xi(e,t,r){let i=t.getFragmentShader(),a=t.getVertexShader(),s=i!==void 0&&/mainImage/.test(i),n=i!==void 0&&/mainUv/.test(i);if(r.attributes|=t.getAttributes(),i===void 0)throw new Error(`Missing fragment shader (${t.name})`);if(n&&(r.attributes&j.CONVOLUTION)!==0)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!s&&!n)throw new Error(`Could not find mainImage or mainUv function (${t.name})`);{let l=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,c=r.shaderParts,u=c.get(p.FRAGMENT_HEAD)||"",m=c.get(p.FRAGMENT_MAIN_UV)||"",h=c.get(p.FRAGMENT_MAIN_IMAGE)||"",E=c.get(p.VERTEX_HEAD)||"",x=c.get(p.VERTEX_MAIN_SUPPORT)||"",M=new Set,C=new Set;if(n&&(m+=`	${e}MainUv(UV);
`,r.uvTransformation=!0),a!==null&&/mainSupport/.test(a)){let S=/mainSupport *\([\w\s]*?uv\s*?\)/.test(a);x+=`	${e}MainSupport(`,x+=S?`vUv);
`:`);
`;for(let B of a.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(let Y of B[1].split(/\s*,\s*/))r.varyings.add(Y),M.add(Y),C.add(Y);for(let B of a.matchAll(l))C.add(B[1])}for(let S of i.matchAll(l))C.add(S[1]);for(let S of t.defines.keys())C.add(S.replace(/\([\w\s,]*\)/g,""));for(let S of t.uniforms.keys())C.add(S);C.delete("while"),C.delete("for"),C.delete("if"),t.uniforms.forEach((S,B)=>r.uniforms.set(e+B.charAt(0).toUpperCase()+B.slice(1),S)),t.defines.forEach((S,B)=>r.defines.set(e+B.charAt(0).toUpperCase()+B.slice(1),S));let k=new Map([["fragment",i],["vertex",a]]);Rt(e,C,r.defines),Rt(e,C,k),i=k.get("fragment"),a=k.get("vertex");let Q=t.blendMode;if(r.blendModes.set(Q.blendFunction,Q),s){t.inputColorSpace!==null&&t.inputColorSpace!==r.colorSpace&&(h+=t.inputColorSpace===T?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace!==Me?r.colorSpace=t.outputColorSpace:t.inputColorSpace!==null&&(r.colorSpace=t.inputColorSpace);let S=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;h+=`${e}MainImage(color0, UV, `,(r.attributes&j.DEPTH)!==0&&S.test(i)&&(h+="depth, ",r.readDepth=!0),h+=`color1);
	`;let B=e+"BlendOpacity";r.uniforms.set(B,Q.opacity),h+=`color0 = blend${Q.blendFunction}(color0, color1, ${B});

	`,u+=`uniform float ${B};

`}if(u+=i+`
`,a!==null&&(E+=a+`
`),c.set(p.FRAGMENT_HEAD,u),c.set(p.FRAGMENT_MAIN_UV,m),c.set(p.FRAGMENT_MAIN_IMAGE,h),c.set(p.VERTEX_HEAD,E),c.set(p.VERTEX_MAIN_SUPPORT,x),t.extensions!==null)for(let S of t.extensions)r.extensions.add(S)}}var zt=class extends G{constructor(e,...t){super("EffectPass"),this.fullscreenMaterial=new Ai(null,null,null,e),this.listener=r=>this.handleEvent(r),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(e){for(let t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(let t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){let t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(let t of this.effects)t.removeEventListener("change",this.listener);this.effects=e.sort((t,r)=>r.attributes-t.attributes);for(let t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){let e=new mr,t=0;for(let n of this.effects)if(n.blendMode.blendFunction===v.DST)e.attributes|=n.getAttributes()&j.DEPTH;else{if((e.attributes&n.getAttributes()&j.CONVOLUTION)!==0)throw new Error(`Convolution effects cannot be merged (${n.name})`);xi("e"+t++,n,e)}let r=e.shaderParts.get(p.FRAGMENT_HEAD),i=e.shaderParts.get(p.FRAGMENT_MAIN_IMAGE),a=e.shaderParts.get(p.FRAGMENT_MAIN_UV),s=/\bblend\b/g;for(let n of e.blendModes.values())r+=n.getShaderCode().replace(s,`blend${n.blendFunction}`)+`
`;(e.attributes&j.DEPTH)!==0?(e.readDepth&&(i=`float depth = readDepth(UV);

	`+i),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,e.colorSpace===T&&(i+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(a=`vec2 transformedUv = vUv;
`+a,e.defines.set("UV","transformedUv")):e.defines.set("UV","vUv"),e.shaderParts.set(p.FRAGMENT_HEAD,r),e.shaderParts.set(p.FRAGMENT_MAIN_IMAGE,i),e.shaderParts.set(p.FRAGMENT_MAIN_UV,a);for(let[n,l]of e.shaderParts)l!==null&&e.shaderParts.set(n,l.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=K){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(let r of this.effects)r.setDepthTexture(e,t)}render(e,t,r,i,a){for(let s of this.effects)s.update(e,t,i);if(!this.skipRendering||this.renderToScreen){let s=this.fullscreenMaterial;s.inputBuffer=t.texture,s.time+=i*this.timeScale,e.setRenderTarget(this.renderToScreen?null:r),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(let r of this.effects)r.setSize(e,t)}initialize(e,t,r){this.renderer=e;for(let i of this.effects)i.initialize(e,t,r);this.updateMaterial(),r!==void 0&&r!==L&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(let e of this.effects)e.removeEventListener("change",this.listener),e.dispose()}handleEvent(e){e.type==="change"&&this.recompile()}};var Ki=[new Float32Array(3),new Float32Array(3)],Zi=[new Float32Array(3),new Float32Array(3),new Float32Array(3),new Float32Array(3)],ji=[[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1])]];var Ji=[new Float32Array(2),new Float32Array(2)];var qi=new Float32Array([0,-.25,.25,-.125,.125,-.375,.375]),$i=[new Float32Array([0,0]),new Float32Array([.25,-.25]),new Float32Array([-.25,.25]),new Float32Array([.125,-.125]),new Float32Array([-.125,.125])],ea=[new Uint8Array([0,0]),new Uint8Array([3,0]),new Uint8Array([0,3]),new Uint8Array([3,3]),new Uint8Array([1,0]),new Uint8Array([4,0]),new Uint8Array([1,3]),new Uint8Array([4,3]),new Uint8Array([0,1]),new Uint8Array([3,1]),new Uint8Array([0,4]),new Uint8Array([3,4]),new Uint8Array([1,1]),new Uint8Array([4,1]),new Uint8Array([1,4]),new Uint8Array([4,4])],ta=[new Uint8Array([0,0]),new Uint8Array([1,0]),new Uint8Array([0,2]),new Uint8Array([1,2]),new Uint8Array([2,0]),new Uint8Array([3,0]),new Uint8Array([2,2]),new Uint8Array([3,2]),new Uint8Array([0,1]),new Uint8Array([1,1]),new Uint8Array([0,3]),new Uint8Array([1,3]),new Uint8Array([2,1]),new Uint8Array([3,1]),new Uint8Array([2,3]),new Uint8Array([3,3])];var ra=new Map([[P(0,0,0,0),new Float32Array([0,0,0,0])],[P(0,0,0,1),new Float32Array([0,0,0,1])],[P(0,0,1,0),new Float32Array([0,0,1,0])],[P(0,0,1,1),new Float32Array([0,0,1,1])],[P(0,1,0,0),new Float32Array([0,1,0,0])],[P(0,1,0,1),new Float32Array([0,1,0,1])],[P(0,1,1,0),new Float32Array([0,1,1,0])],[P(0,1,1,1),new Float32Array([0,1,1,1])],[P(1,0,0,0),new Float32Array([1,0,0,0])],[P(1,0,0,1),new Float32Array([1,0,0,1])],[P(1,0,1,0),new Float32Array([1,0,1,0])],[P(1,0,1,1),new Float32Array([1,0,1,1])],[P(1,1,0,0),new Float32Array([1,1,0,0])],[P(1,1,0,1),new Float32Array([1,1,0,1])],[P(1,1,1,0),new Float32Array([1,1,1,0])],[P(1,1,1,1),new Float32Array([1,1,1,1])]]);function $e(e,t,r){return e+(t-e)*r}function P(e,t,r,i){let a=$e(e,t,.75),s=$e(r,i,1-.25);return $e(a,s,1-.125)}var g=Ke(cr());var ae=Ke(mt()),Ei=`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Di=`
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec2 uSkew;
uniform float uTilt;
uniform float uYaw;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineStyle;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanDirection;
uniform float uNoise;
uniform float uBloomOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uPhaseTaper;
uniform float uScanDuration;
uniform float uScanDelay;
varying vec2 vUv;

uniform float uScanStarts[8];
uniform float uScanCount;

const int MAX_SCANS = 8;

float smoother01(float a, float b, float x){
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0);
    vec3 rd = normalize(vec3(p, 2.0));

    float cR = cos(uTilt), sR = sin(uTilt);
    rd.xy = mat2(cR, -sR, sR, cR) * rd.xy;

    float cY = cos(uYaw), sY = sin(uYaw);
    rd.xz = mat2(cY, -sY, sY, cY) * rd.xz;

    vec2 skew = clamp(uSkew, vec2(-0.7), vec2(0.7));
    rd.xy += skew * rd.z;

    vec3 color = vec3(0.0);
  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
    float fadeStrength = 2.0;
    vec2 gridUV = vec2(0.0);

  float hitIsY = 1.0;
    for (int i = 0; i < 4; i++)
    {
        float isY = float(i < 2);
        float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
        float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
        float den = isY * rd.y + (1.0 - isY) * rd.x;
        float t = num / den;
        vec3 h = ro + rd * t;

        float depthBoost = smoothstep(0.0, 3.0, h.z);
        h.xy += skew * 0.15 * depthBoost;

    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
    }

    vec3 hit = ro + rd * minT;
    float dist = length(hit - ro);

  float jitterAmt = clamp(uLineJitter, 0.0, 1.0);
  if (jitterAmt > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * jitterAmt);
    gridUV += j;
  }
  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;

  float tx = halfPx * wx;
  float ty = halfPx * wy;

  float aax = wx;
  float aay = wy;

  float lineX = 1.0 - smoothstep(tx, tx + aax, ax);
  float lineY = 1.0 - smoothstep(ty, ty + aay, ay);
  if (uLineStyle > 0.5) {
    float dashRepeat = 4.0;
    float dashDuty = 0.5;
    float vy = fract(gridUV.y * dashRepeat);
    float vx = fract(gridUV.x * dashRepeat);
    float dashMaskY = step(vy, dashDuty);
    float dashMaskX = step(vx, dashDuty);
    if (uLineStyle < 1.5) {
      lineX *= dashMaskY;
      lineY *= dashMaskX;
    } else {
      float dotRepeat = 6.0;
      float dotWidth = 0.18;
      float cy = abs(fract(gridUV.y * dotRepeat) - 0.5);
      float cx = abs(fract(gridUV.x * dotRepeat) - 0.5);
      float dotMaskY = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.y * dotRepeat), cy);
      float dotMaskX = 1.0 - smoothstep(dotWidth, dotWidth + fwidth(gridUV.x * dotRepeat), cx);
      lineX *= dotMaskY;
      lineY *= dotMaskX;
    }
  }
  float primaryMask = max(lineX, lineY);

  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (jitterAmt > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * jitterAmt);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float aax2 = wx2;
  float aay2 = wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + aax2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + aay2, ay2);
  if (uLineStyle > 0.5) {
    float dashRepeat2 = 4.0;
    float dashDuty2 = 0.5;
    float vy2m = fract(gridUV2.y * dashRepeat2);
    float vx2m = fract(gridUV2.x * dashRepeat2);
    float dashMaskY2 = step(vy2m, dashDuty2);
    float dashMaskX2 = step(vx2m, dashDuty2);
    if (uLineStyle < 1.5) {
      lineX2 *= dashMaskY2;
      lineY2 *= dashMaskX2;
    } else {
      float dotRepeat2 = 6.0;
      float dotWidth2 = 0.18;
      float cy2 = abs(fract(gridUV2.y * dotRepeat2) - 0.5);
      float cx2 = abs(fract(gridUV2.x * dotRepeat2) - 0.5);
      float dotMaskY2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.y * dotRepeat2), cy2);
      float dotMaskX2 = 1.0 - smoothstep(dotWidth2, dotWidth2 + fwidth(gridUV2.x * dotRepeat2), cx2);
      lineX2 *= dotMaskY2;
      lineY2 *= dotMaskX2;
    }
  }
    float altMask = max(lineX2, lineY2);

    float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
    float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
    float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
    float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
    altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);

    float fade = exp(-dist * fadeStrength);

    float dur = max(0.05, uScanDuration);
    float del = max(0.0, uScanDelay);
    float scanZMax = 2.0;
    float widthScale = max(0.1, uScanGlow);
    float sigma = max(0.001, 0.18 * widthScale * uScanSoftness);
    float sigmaA = sigma * 2.0;

    float combinedPulse = 0.0;
    float combinedAura = 0.0;

    float cycle = dur + del;
    float tCycle = mod(iTime, cycle);
    float scanPhase = clamp((tCycle - del) / dur, 0.0, 1.0);
    float phase = scanPhase;
    if (uScanDirection > 0.5 && uScanDirection < 1.5) {
      phase = 1.0 - phase;
    } else if (uScanDirection > 1.5) {
      float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
      phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);
    }
    float scanZ = phase * scanZMax;
    float dz = abs(hit.z - scanZ);
    float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
    float taper = clamp(uPhaseTaper, 0.0, 0.49);
    float headW = taper;
    float tailW = taper;
    float headFade = smoother01(0.0, headW, phase);
    float tailFade = 1.0 - smoother01(1.0 - tailW, 1.0, phase);
    float phaseWindow = headFade * tailFade;
    float pulseBase = lineBand * phaseWindow;
    combinedPulse += pulseBase * clamp(uScanOpacity, 0.0, 1.0);
    float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));
    combinedAura += (auraBand * 0.25) * phaseWindow * clamp(uScanOpacity, 0.0, 1.0);

    for (int i = 0; i < MAX_SCANS; i++) {
      if (float(i) >= uScanCount) break;
      float tActiveI = iTime - uScanStarts[i];
      float phaseI = clamp(tActiveI / dur, 0.0, 1.0);
      if (uScanDirection > 0.5 && uScanDirection < 1.5) {
        phaseI = 1.0 - phaseI;
      } else if (uScanDirection > 1.5) {
        phaseI = (phaseI < 0.5) ? (phaseI * 2.0) : (1.0 - (phaseI - 0.5) * 2.0);
      }
      float scanZI = phaseI * scanZMax;
      float dzI = abs(hit.z - scanZI);
      float lineBandI = exp(-0.5 * (dzI * dzI) / (sigma * sigma));
      float headFadeI = smoother01(0.0, headW, phaseI);
      float tailFadeI = 1.0 - smoother01(1.0 - tailW, 1.0, phaseI);
      float phaseWindowI = headFadeI * tailFadeI;
      combinedPulse += lineBandI * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
      float auraBandI = exp(-0.5 * (dzI * dzI) / (sigmaA * sigmaA));
      combinedAura += (auraBandI * 0.25) * phaseWindowI * clamp(uScanOpacity, 0.0, 1.0);
    }

  float lineVis = lineMask;
  vec3 gridCol = uLinesColor * lineVis * fade;
  vec3 scanCol = uScanColor * combinedPulse;
  vec3 scanAura = uScanColor * combinedAura;

    color = gridCol + scanCol + scanAura;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;
  color = clamp(color, 0.0, 1.0);
  float alpha = clamp(max(lineVis, combinedPulse), 0.0, 1.0);
  float gx = 1.0 - smoothstep(tx * 2.0, tx * 2.0 + aax * 2.0, ax);
  float gy = 1.0 - smoothstep(ty * 2.0, ty * 2.0 + aay * 2.0, ay);
  float halo = max(gx, gy) * fade;
  alpha = max(alpha, halo * clamp(uBloomOpacity, 0.0, 1.0));
  fragColor = vec4(color, alpha);
}

void main(){
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`,Ua=({enableWebcam:e=!1,showPreview:t=!1,modelsPath:r="https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights",sensitivity:i=.55,lineThickness:a=1,linesColor:s="#2F293A",scanColor:n="#FF9FFC",scanOpacity:l=.4,gridScale:c=.1,lineStyle:u="solid",lineJitter:m=.1,scanDirection:h="pingpong",enablePost:E=!0,bloomIntensity:x=0,bloomThreshold:M=0,bloomSmoothing:C=0,chromaticAberration:k=.002,noiseIntensity:Q=.01,scanGlow:S=.5,scanSoftness:B=2,scanPhaseTaper:Y=.9,scanDuration:de=2,scanDelay:he=2,enableGyro:ve=!1,scanOnClick:ge=!1,snapBackDelay:rt=250,className:it,style:Wt})=>{let He=(0,g.useRef)(null),at=(0,g.useRef)(null),Yt=(0,g.useRef)(null),pe=(0,g.useRef)(null),X=(0,g.useRef)(null),se=(0,g.useRef)(null),Ge=(0,g.useRef)(null),me=(0,g.useRef)(null),[ke,ze]=(0,g.useState)(!1),[ee,_e]=(0,g.useState)(!1),ne=(0,g.useRef)(new A(0,0)),Ae=(0,g.useRef)(0),Ve=(0,g.useRef)(0),xe=(0,g.useRef)(new A(0,0)),Xt=(0,g.useRef)(new A(0,0)),Qe=(0,g.useRef)(0),st=(0,g.useRef)(0),We=(0,g.useRef)(0),nt=(0,g.useRef)(0),Ee=8,ot=(0,g.useRef)([]),Kt=f=>{let o=ot.current.slice();if(o.length>=Ee&&o.shift(),o.push(f),ot.current=o,pe.current){let D=pe.current.uniforms,y=new Array(Ee).fill(0);for(let w=0;w<o.length&&w<Ee;w++)y[w]=o[w];D.uScanStarts.value=y,D.uScanCount.value=o.length}},lt=(0,g.useRef)([]),ct=(0,g.useRef)([]),ut=(0,g.useRef)([]),ft=(0,g.useRef)([]),te=F.clamp(i,0,1),Ye=F.lerp(.06,.2,te),dt=F.lerp(.12,.3,te),ht=F.lerp(.1,.28,te),vt=F.lerp(.25,.45,te),De=F.lerp(.45,.12,te),Te=1/0,gt=F.lerp(1.2,1.6,te);return(0,g.useEffect)(()=>{let f=He.current;if(!f)return;let o=null,D=H=>{if(ee)return;o&&(clearTimeout(o),o=null);let R=f.getBoundingClientRect(),b=(H.clientX-R.left)/R.width*2-1,oe=-((H.clientY-R.top)/R.height*2-1);ne.current.set(b,oe)},y=async()=>{let H=performance.now()/1e3;if(ge&&Kt(H),ve&&typeof window<"u"&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)try{await DeviceOrientationEvent.requestPermission()}catch{}},w=()=>{o&&(clearTimeout(o),o=null)},O=()=>{ee||(o&&clearTimeout(o),o=window.setTimeout(()=>{ne.current.set(0,0),Ae.current=0,Ve.current=0},Math.max(0,rt||0)))};return f.addEventListener("mousemove",D),f.addEventListener("mouseenter",w),ge&&f.addEventListener("click",y),f.addEventListener("mouseleave",O),()=>{f.removeEventListener("mousemove",D),f.removeEventListener("mouseenter",w),f.removeEventListener("mouseleave",O),ge&&f.removeEventListener("click",y),o&&clearTimeout(o)}},[ee,rt,ge,ve]),(0,g.useEffect)(()=>{let f=He.current;if(!f)return;let o=new It({antialias:!0,alpha:!0});Yt.current=o,o.setPixelRatio(1),o.setSize(f.clientWidth,f.clientHeight),o.outputColorSpace=T,o.toneMapping=Et,o.autoClear=!1,o.setClearColor(0,0),f.appendChild(o.domElement);let D={iResolution:{value:new St(f.clientWidth,f.clientHeight,o.getPixelRatio())},iTime:{value:0},uSkew:{value:new A(0,0)},uTilt:{value:0},uYaw:{value:0},uLineThickness:{value:a},uLinesColor:{value:Fe(s)},uScanColor:{value:Fe(n)},uGridScale:{value:c},uLineStyle:{value:u==="dashed"?1:u==="dotted"?2:0},uLineJitter:{value:Math.max(0,Math.min(1,m||0))},uScanOpacity:{value:l},uNoise:{value:Q},uBloomOpacity:{value:x},uScanGlow:{value:S},uScanSoftness:{value:B},uPhaseTaper:{value:Y},uScanDuration:{value:de},uScanDelay:{value:he},uScanDirection:{value:h==="backward"?1:h==="pingpong"?2:0},uScanStarts:{value:new Array(Ee).fill(0)},uScanCount:{value:0}},y=new U({uniforms:D,vertexShader:Ei,fragmentShader:Di,transparent:!0,depthWrite:!1,depthTest:!1});pe.current=y;let w=new fe,O=new be(-1,1,1,-1,0,1),H=new Re(new Mt(2,2),y);w.add(H);let R=null;if(E){R=new Ot(o),X.current=R;let W=new kt(w,O);R.addPass(W);let _=new Ht({intensity:1,luminanceThreshold:M,luminanceSmoothing:C});_.blendMode.opacity.value=Math.max(0,x),se.current=_;let J=new Gt({offset:new A(k,k),radialModulation:!0,modulationOffset:0});Ge.current=J;let q=new zt(O,_,J);q.renderToScreen=!0,R.addPass(q)}let b=()=>{o.setSize(f.clientWidth,f.clientHeight),y.uniforms.iResolution.value.set(f.clientWidth,f.clientHeight,o.getPixelRatio()),X.current&&X.current.setSize(f.clientWidth,f.clientHeight)},oe=typeof ResizeObserver<"u"?new ResizeObserver(b):null;oe?.observe(f),window.addEventListener("resize",b);let z=performance.now(),le=W=>{if(me.current=requestAnimationFrame(le),document.hidden||W-z+.25<1e3/30)return;let _=Math.max(0,Math.min(.1,(W-z)/1e3));z=W,xe.current.copy(Ti(xe.current,ne.current,Xt.current,De,Te,_));let J=_t(Qe.current,Ae.current,{v:st.current},De,Te,_);Qe.current=J.value,st.current=J.v;let q=_t(We.current,Ve.current,{v:nt.current},De,Te,_);We.current=q.value,nt.current=q.v,y.uniforms.uSkew.value.set(xe.current.x*Ye,-xe.current.y*gt*Ye),y.uniforms.uTilt.value=Qe.current*dt,y.uniforms.uYaw.value=F.clamp(We.current*ht,-.6,.6),y.uniforms.iTime.value=W/1e3,o.clear(!0,!0,!0),X.current?X.current.render(_):o.render(w,O)};return me.current=requestAnimationFrame(le),()=>{me.current&&cancelAnimationFrame(me.current),window.removeEventListener("resize",b),oe?.disconnect(),y.dispose(),H.geometry.dispose(),X.current&&(X.current.dispose(),X.current=null),o.dispose(),o.forceContextLoss(),f.removeChild(o.domElement)}},[i,a,s,n,l,c,u,m,h,E,Q,x,S,B,Y,de,he,M,C,k,De,Te,Ye,gt,dt,ht]),(0,g.useEffect)(()=>{let f=pe.current;if(f){let o=f.uniforms;o.uLineThickness.value=a,o.uLinesColor.value.copy(Fe(s)),o.uScanColor.value.copy(Fe(n)),o.uGridScale.value=c,o.uLineStyle.value=u==="dashed"?1:u==="dotted"?2:0,o.uLineJitter.value=Math.max(0,Math.min(1,m||0)),o.uBloomOpacity.value=Math.max(0,x),o.uNoise.value=Math.max(0,Q),o.uScanGlow.value=S,o.uScanOpacity.value=Math.max(0,Math.min(1,l)),o.uScanDirection.value=h==="backward"?1:h==="pingpong"?2:0,o.uScanSoftness.value=B,o.uPhaseTaper.value=Y,o.uScanDuration.value=Math.max(.05,de),o.uScanDelay.value=Math.max(0,he)}se.current&&(se.current.blendMode.opacity.value=Math.max(0,x),se.current.luminanceMaterial.threshold=M,se.current.luminanceMaterial.smoothing=C),Ge.current&&Ge.current.offset.set(k,k)},[a,s,n,c,u,m,x,M,C,k,Q,S,l,h,B,Y,de,he]),(0,g.useEffect)(()=>{if(!ve)return;let f=o=>{if(ee)return;let D=o.gamma??0,y=o.beta??0,w=F.clamp(D/45,-1,1),O=F.clamp(-y/30,-1,1);ne.current.set(w,O),Ae.current=F.degToRad(D)*.4};return window.addEventListener("deviceorientation",f),()=>{window.removeEventListener("deviceorientation",f)}},[ve,ee]),(0,g.useEffect)(()=>{if(!e){ze(!1);return}let f=!1;return(async()=>{try{let D=await import("./es6-L3E73FCY.js");if(f)return;await Promise.all([D.nets.tinyFaceDetector.loadFromUri(r),D.nets.faceLandmark68TinyNet.loadFromUri(r)]),f||ze(!0)}catch{f||ze(!1)}})(),()=>{f=!0}},[e,r]),(0,g.useEffect)(()=>{let f=!1,o=0,D=at.current;return(async()=>{if(!e||!ke||!D)return;let w;try{if(w=await import("./es6-L3E73FCY.js"),f)return;let R=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:720}},audio:!1});if(f){R.getTracks().forEach(b=>b.stop());return}D.srcObject=R,await D.play()}catch{return}let O=new w.TinyFaceDetectorOptions({inputSize:320,scoreThreshold:.5}),H=async R=>{if(!f){if(R-o>=33){o=R;try{let b=await w.detectSingleFace(D,O).withFaceLandmarks(!0);if(b&&b.detection){let z=b.detection.box,le=D.videoWidth||1,W=D.videoHeight||1,_=z.x+z.width*.5,J=z.y+z.height*.5,q=_/le*2-1,Zt=J/W*2-1;Oe(lt.current,q,5),Oe(ct.current,Zt,5);let jt=Ne(lt.current),Jt=Ne(ct.current),qt=new A(Math.tanh(jt),Math.tanh(Jt)),$t=Math.min(1,Math.hypot(z.width/le,z.height/W)),er=1+vt*($t-.25);ne.current.copy(qt.multiplyScalar(er));let tr=b.landmarks.getLeftEye(),rr=b.landmarks.getRightEye(),we=Vt(tr),Se=Vt(rr),ir=Math.atan2(Se.y-we.y,Se.x-we.x);Oe(ut.current,ir,5),Ae.current=Ne(ut.current);let Ce=b.landmarks.getNose(),pt=Ce[Ce.length-1]||Ce[Math.floor(Ce.length/2)],Be=b.landmarks.getJawOutline(),ar=Be[3]||Be[2],sr=Be[13]||Be[14],nr=Qt(pt,ar),or=Qt(pt,sr),lr=Math.hypot(Se.x-we.x,Se.y-we.y)+1e-6,Xe=F.clamp((or-nr)/(lr*1.6),-1,1);Xe=Math.tanh(Xe),Oe(ft.current,Xe,5),Ve.current=Ne(ft.current),_e(!0)}else _e(!1)}catch{_e(!1)}}"requestVideoFrameCallback"in HTMLVideoElement.prototype?D.requestVideoFrameCallback(()=>H(performance.now())):requestAnimationFrame(H)}};requestAnimationFrame(H)})(),()=>{if(f=!0,D){let w=D.srcObject;w&&w.getTracks().forEach(O=>O.stop()),D.pause(),D.srcObject=null}}},[e,ke,vt]),(0,ae.jsx)("div",{ref:He,className:`gridscan${it?` ${it}`:""}`,style:Wt,children:t&&(0,ae.jsxs)("div",{className:"gridscan__preview",children:[(0,ae.jsx)("video",{ref:at,muted:!0,playsInline:!0,autoPlay:!0,className:"gridscan__video"}),(0,ae.jsx)("div",{className:"gridscan__badge",children:e?ke?ee?"Face: tracking":"Face: searching":"Loading models":"Webcam disabled"})]})})};function Fe(e){return new Ue(e).convertSRGBToLinear()}function Ti(e,t,r,i,a,s){let n=e.clone();i=Math.max(1e-4,i);let l=2/i,c=l*s,u=1/(1+c+.48*c*c+.235*c*c*c),m=e.clone().sub(t),h=t.clone(),E=a*i;m.length()>E&&m.setLength(E),t=e.clone().sub(m);let x=r.clone().addScaledVector(m,l).multiplyScalar(s);r.sub(x.clone().multiplyScalar(l)),r.multiplyScalar(u),n.copy(t.clone().add(m.add(x).multiplyScalar(u)));let M=h.clone().sub(e),C=n.clone().sub(h);return M.dot(C)>0&&(n.copy(h),r.set(0,0)),n}function _t(e,t,r,i,a,s){i=Math.max(1e-4,i);let n=2/i,l=n*s,c=1/(1+l+.48*l*l+.235*l*l*l),u=e-t,m=t,h=a*i;u=Math.sign(u)*Math.min(Math.abs(u),h),t=e-u;let E=(r.v+n*u)*s;r.v=(r.v-n*E)*c;let x=t+(u+E)*c,M=m-e,C=x-m;return M*C>0&&(x=m,r.v=0),{value:x,v:r.v}}function Oe(e,t,r){e.push(t),e.length>r&&e.shift()}function Ne(e){if(e.length===0)return 0;let t=[...e].sort((i,a)=>i-a),r=Math.floor(t.length/2);return t.length%2?t[r]:(t[r-1]+t[r])*.5}function Vt(e){let t=0,r=0,i=e.length||1;for(let a of e)t+=a.x,r+=a.y;return{x:t/i,y:r/i}}function Qt(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}export{Ua as GridScan};
/*! Bundled license information:

postprocessing/build/index.js:
  (**
   * postprocessing v6.39.4 build Mon Jul 27 2026
   * https://github.com/pmndrs/postprocessing
   * Copyright 2015-2026 Raoul van Rüschen
   * @license Zlib
   *)
*/
