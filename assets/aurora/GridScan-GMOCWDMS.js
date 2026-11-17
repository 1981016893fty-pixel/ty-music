import{A as Ci,B as Sa,C as ts,D as vc,E as Si,F as Di,I as mc,J as gc,K as At,O as xc,P as Ti,Q as pe,S as yc,a as uc,b as Ea,c as Ca,d as Zt,f as cc,g as lc,i as Fn,j as Wt,k as fc,m as hc,o as dc,p as Vr,q as bi,r as We,s as Ai,t as kn,u as Vt,v as Ie,w as pc,x as Ei,y as es,z as dt}from"./chunk-WN2A7VKE.js";import{a as Zo,b as Jo,c as $o,e as Bp,f as sc}from"./chunk-D555T6QT.js";var wc=Jo(()=>{});var bc=Jo(()=>{});var Ac=Jo(()=>{});var ol=function(r,t){return(ol=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var a in n)n.hasOwnProperty(a)&&(e[a]=n[a])})(r,t)};function ur(r,t){function e(){this.constructor=r}ol(r,t),r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}function ee(r,t,e,n){return new(e||(e=Promise))((function(a,i){function o(c){try{u(n.next(c))}catch(l){i(l)}}function s(c){try{u(n.throw(c))}catch(l){i(l)}}function u(c){c.done?a(c.value):new e((function(l){l(c.value)})).then(o,s)}u((n=n.apply(r,t||[])).next())}))}function te(r,t){var e,n,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(i[Symbol.iterator]=function(){return this}),i;function s(u){return function(c){return(function(l){if(e)throw new TypeError("Generator is already executing.");for(;o;)try{if(e=1,n&&(a=2&l[0]?n.return:l[0]?n.throw||((a=n.return)&&a.call(n),0):n.next)&&!(a=a.call(n,l[1])).done)return a;switch(n=0,a&&(l=[2&l[0],a.value]),l[0]){case 0:case 1:a=l;break;case 4:return o.label++,{value:l[1],done:!1};case 5:o.label++,n=l[1],l=[0];continue;case 7:l=o.ops.pop(),o.trys.pop();continue;default:if(!(a=(a=o.trys).length>0&&a[a.length-1])&&(l[0]===6||l[0]===2)){o=0;continue}if(l[0]===3&&(!a||l[1]>a[0]&&l[1]<a[3])){o.label=l[1];break}if(l[0]===6&&o.label<a[1]){o.label=a[1],a=l;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(l);break}a[2]&&o.ops.pop(),o.trys.pop();continue}l=t.call(r,o)}catch(f){l=[6,f],n=0}finally{e=a=0}if(5&l[0])throw l[1];return{value:l[0]?l[1]:void 0,done:!0}})([u,c])}}}var _p=(function(){function r(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.populateURLFlags()}return r.prototype.setPlatform=function(t,e){this.platform!=null&&console.warn("Platform "+this.platformName+" has already been set. Overwriting the platform with "+e+"."),this.platformName=t,this.platform=e},r.prototype.registerFlag=function(t,e,n){if(this.flagRegistry[t]={evaluationFn:e,setHook:n},this.urlFlags[t]!=null){var a=this.urlFlags[t];console.warn("Setting feature override from URL "+t+": "+a+"."),this.set(t,a)}},r.prototype.get=function(t){return t in this.flags?this.flags[t]:(this.flags[t]=this.evaluateFlag(t),this.flags[t])},r.prototype.getNumber=function(t){return this.get(t)},r.prototype.getBool=function(t){return this.get(t)},r.prototype.getFlags=function(){return this.flags},Object.defineProperty(r.prototype,"features",{get:function(){return this.flags},enumerable:!0,configurable:!0}),r.prototype.set=function(t,e){if(this.flagRegistry[t]==null)throw new Error("Cannot set flag "+t+" as it has not been registered.");this.flags[t]=e,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(e)},r.prototype.evaluateFlag=function(t){if(this.flagRegistry[t]==null)throw new Error("Cannot evaluate flag '"+t+"': no evaluation function found.");return this.flagRegistry[t].evaluationFn()},r.prototype.setFlags=function(t){this.flags=Object.assign({},t)},r.prototype.reset=function(){this.flags={},this.urlFlags={},this.populateURLFlags()},r.prototype.populateURLFlags=function(){var t=this;if(this.global!==void 0&&this.global.location!==void 0&&this.global.location.search!==void 0){var e,n,a=(e=this.global.location.search,n={},e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(function(i){for(var o=[],s=1;s<arguments.length;s++)o[s-1]=arguments[s];return Pp(n,o[0],o[1]),o.join("=")})),n);"tfjsflags"in a&&a.tfjsflags.split(",").forEach((function(i){var o=i.split(":"),s=o[0],u=o[1];t.urlFlags[s]=(function(c,l){if((l=l.toLowerCase())==="true"||l==="false")return l==="true";if(""+ +l===l)return+l;throw new Error("Could not parse value flag value "+l+" for flag "+c+".")})(s,u)}))}},r})();function Pp(r,t,e){r[decodeURIComponent(t)]=decodeURIComponent(e||"")}function k(){return sl}var sl=null,Vi=new Map,Es=new Map;function ul(r,t){var e=ll(r,t);return Vi.get(e)}function Fp(r){return Es.get(r)}function Ec(r){for(var t=Vi.entries(),e=[];;){var n=t.next(),a=n.done,i=n.value;if(a)break;var o=i[0],s=i[1];o.split("_")[0]===r&&e.push(s)}return e}function cl(r){var t=r.kernelName,e=r.backendName,n=ll(t,e);if(Vi.has(n))throw new Error("The kernel '"+t+"' for backend '"+e+"' is already registered");Vi.set(n,r)}function kp(r){var t=r.kernelName;Es.has(t)&&console.warn("Overriding the gradient for '"+t+"'"),Es.set(t,r)}function ll(r,t){return t+"_"+r}function Cc(r){for(var t=r.length,e=0,n=0;t>0;)n=Math.random()*t|0,e=r[--t],r[t]=r[n],r[n]=e}function Xi(r,t,e){return Math.max(r,Math.min(t,e))}function Vs(r){return r%2==0?r:r+1}function fl(r){for(var t=0,e=0;e<r.length;e++)t+=r[e];return t}function C(r,t){if(!r)throw new Error(typeof t=="string"?t:t())}function De(r,t,e){e===void 0&&(e=""),C(Je(r,t),(function(){return e+" Shapes "+r+" and "+t+" must match"}))}function wn(r){C(r!=null,(function(){return"The input to the tensor constructor must be a non-null value."}))}function Br(r,t,e){if(t===void 0&&(t=[]),e===void 0&&(e=!1),t==null&&(t=[]),Array.isArray(r)||mt(r)&&!e)for(var n=0;n<r.length;++n)Br(r[n],t,e);else t.push(r);return t}function re(r){if(r.length===0)return 1;for(var t=r[0],e=1;e<r.length;e++)t*=r[e];return t}function Je(r,t){if(r===t)return!0;if(r==null||t==null||r.length!==t.length)return!1;for(var e=0;e<r.length;e++)if(r[e]!==t[e])return!1;return!0}function Ke(r){return r%1==0}function hl(r){if(Math.tanh!=null)return Math.tanh(r);if(r===1/0)return 1;if(r===-1/0)return-1;var t=Math.exp(2*r);return(t-1)/(t+1)}function Ki(r){var t=Math.ceil(Math.sqrt(r));return[t,Math.ceil(r/t)]}function pn(r,t){return t<=r.length?r:r+" ".repeat(t-r.length)}function Cs(r,t,e){return t===void 0&&(t=function(n){return 0}),new Promise((function(n,a){var i=0,o=function(){if(r())n();else{i++;var s=t(i);e!=null&&i>=e?a():setTimeout(o,s)}};o()}))}function dl(r,t){for(var e=1,n=-1,a=0;a<r.length;++a)if(r[a]>=0)e*=r[a];else if(r[a]===-1){if(n!==-1)throw Error("Shapes can only have 1 implicit size. Found -1 at dim "+n+" and dim "+a);n=a}else if(r[a]<0)throw Error("Shapes can not be < 0. Found "+r[a]+" at dim "+a);if(n===-1){if(t>0&&t!==e)throw Error("Size("+t+") must match the product of shape "+r);return r}if(e===0)throw Error("Cannot infer the missing size in ["+r+"] when there are 0 elements");if(t%e!=0)throw Error("The implicit shape can't be a fractional number. Got "+t+" / "+e);var i=r.slice();return i[n]=t/e,i}function et(r,t){var e=t.length;return C((r=r==null?t.map((function(n,a){return a})):[].concat(r)).every((function(n){return n>=-e&&n<e})),(function(){return"All values in axis param must be in range [-"+e+", "+e+") but got axis "+r})),C(r.every((function(n){return Ke(n)})),(function(){return"All values in axis param must be integers but got axis "+r})),r.map((function(n){return n<0?e+n:n}))}function Xr(r,t){for(var e=[],n=[],a=t!=null&&Array.isArray(t)&&t.length===0,i=t==null||a?null:et(t,r).sort(),o=0,s=0;s<r.length;++s){if(i!=null){if(i[o]===s&&r[s]!==1)throw new Error("Can't squeeze axis "+s+" since its dim '"+r[s]+"' is not 1");(i[o]==null||i[o]>s)&&r[s]===1&&(e.push(r[s]),n.push(s)),i[o]<=s&&o++}r[s]!==1&&(e.push(r[s]),n.push(s))}return{newShape:e,keptDims:n}}function jn(r,t){var e=null;if(r==null||r==="float32")e=new Float32Array(t);else if(r==="int32")e=new Int32Array(t);else{if(r!=="bool")throw new Error("Unknown data type "+r);e=new Uint8Array(t)}return e}function ka(r,t){var e=null;if(r==null||r==="float32")e=new Float32Array(t);else if(r==="int32")e=new Int32Array(t);else if(r==="bool")e=new Uint8Array(t);else{if(r!=="string")throw new Error("Unknown data type "+r);e=new Array(t)}return e}function pl(r,t){for(var e=0;e<r.length;e++){var n=r[e];if(isNaN(n)||!isFinite(n))throw Error("A tensor of type "+t+" being uploaded contains "+n+".")}}function vl(r){return r==="bool"||r==="complex64"||r==="float32"||r==="int32"||r==="string"}function ml(r,t){return t!=="complex64"&&(t!=="float32"||r==="complex64")&&(t!=="int32"||r==="float32"||r==="complex64")&&(t!=="bool"||r!=="bool")}function mt(r){return r instanceof Float32Array||r instanceof Int32Array||r instanceof Uint8Array}function Xs(r){if(r==="float32"||r==="int32")return 4;if(r==="complex64")return 8;if(r==="bool")return 1;throw new Error("Unknown dtype "+r)}function gl(r){if(r==null)return 0;var t=0;return r.forEach((function(e){return t+=e.length})),t}function Kr(r){return typeof r=="string"||r instanceof String}function xl(r){return typeof r=="boolean"}function yl(r){return typeof r=="number"}function Qn(r){return Array.isArray(r)?Qn(r[0]):r instanceof Float32Array?"float32":r instanceof Int32Array||r instanceof Uint8Array?"int32":yl(r)?"float32":Kr(r)?"string":xl(r)?"bool":"float32"}function ji(r){return!!(r&&r.constructor&&r.call&&r.apply)}function Yi(r,t){for(var e=t;e<r;++e)if(r%e==0)return e;return r}function or(r){var t=r.length;if(t<2)return[];var e=new Array(t-1);e[t-2]=r[t-1];for(var n=t-3;n>=0;--n)e[n]=e[n+1]*r[n+1];return e}function Ks(r,t,e){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(r)&&(r=Br(r)),e&&pl(r,t),(function(i,o){return i instanceof Float32Array&&o==="float32"||i instanceof Int32Array&&o==="int32"||i instanceof Uint8Array&&o==="bool"})(r,t))return r;if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool"){for(var n=new Uint8Array(r.length),a=0;a<n.length;++a)Math.round(r[a])!==0&&(n[a]=1);return n}throw new Error("Unknown data type "+t)}function Ss(r,t){if(r.length===0)return t[0];var e=r.reduce((function(n,a){return n*a}));if(e===0)return[];if(e!==t.length)throw new Error("["+r+"] does not match the input size.");return(function n(a,i,o){var s=new Array;if(i.length===1)for(var u=i[0],c=0;c<u;c++)s[c]=o[a+c];else{u=i[0];var l=i.slice(1),f=l.reduce((function(h,d){return h*d}));for(c=0;c<u;c++)s[c]=n(a+c*f,l,o)}return s})(0,r,t)}function js(r,t){for(var e=qn(r,t),n=0;n<e.length;n++)e[n]=1;return e}function qn(r,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(r);if(t==="int32")return new Int32Array(r);if(t==="bool")return new Uint8Array(r);throw new Error("Unknown data type "+t)}function ir(){return k().platform.now()}function Ys(r){r.forEach((function(t){C(Number.isInteger(t)&&t>=0,(function(){return"Tensor must have a shape comprised of positive integers but got shape ["+r+"]."}))}))}function wl(r,t){return t===void 0&&(t="utf-8"),t=t||"utf-8",k().platform.encode(r,t)}function Na(r,t){return t===void 0&&(t="utf-8"),t=t||"utf-8",k().platform.decode(r,t)}function Ds(r,t,e){if(t===0)return 0;if(t===1)return r[0];for(var n=r[r.length-1],a=0;a<r.length-1;++a)n+=e[a]*r[a];return n}function bl(r,t,e){if(t===0)return[];if(t===1)return[r];for(var n=new Array(t),a=0;a<n.length-1;++a)n[a]=Math.floor(r/e[a]),r-=n[a]*e[a];return n[n.length-1]=r,n}var j1=Object.freeze({shuffle:Cc,clamp:Xi,nearestLargerEven:Vs,sum:fl,randUniform:function(r,t){var e=Math.random();return t*e+(1-e)*r},distSquared:function(r,t){for(var e=0,n=0;n<r.length;n++){var a=Number(r[n])-Number(t[n]);e+=a*a}return e},assert:C,assertShapesMatch:De,assertNonNull:wn,flatten:Br,sizeFromShape:re,isScalarShape:function(r){return r.length===0},arraysEqual:Je,isInt:Ke,tanh:hl,sizeToSquarishShape:Ki,createShuffledIndices:function(r){for(var t=new Uint32Array(r),e=0;e<r;++e)t[e]=e;return Cc(t),t},rightPad:pn,repeatedTry:Cs,inferFromImplicitShape:dl,parseAxisParam:et,squeezeShape:Xr,getTypedArrayFromDType:jn,getArrayFromDType:ka,checkConversionForErrors:pl,isValidDtype:vl,hasEncodingLoss:ml,isTypedArray:mt,bytesPerElement:Xs,bytesFromStringArray:gl,isString:Kr,isBoolean:xl,isNumber:yl,inferDtype:Qn,isFunction:ji,nearestDivisor:Yi,computeStrides:or,toTypedArray:Ks,toNestedArray:Ss,makeOnesTypedArray:js,makeZerosTypedArray:qn,now:ir,assertNonNegativeIntegerDimensions:Ys,fetch:function(r,t){return k().platform.fetch(r,t)},encodeString:wl,decodeString:Na,locToIndex:Ds,indexToLoc:bl}),Np=(function(){function r(t,e){this.backendTimer=t,this.logger=e,e==null&&(this.logger=new Op)}return r.prototype.profileKernel=function(t,e,n){var a,i=this,o=this.backendTimer.time((function(){a=n()}));return a.forEach((function(s){s.data().then((function(u){(function(c,l,f){if(l!=="float32")return!1;for(var h=0;h<c.length;h++){var d=c[h];if(isNaN(d)||!isFinite(d))return console.warn("Found "+d+" in the result of '"+f+"'"),!0}})(u,s.dtype,t),o.then((function(c){var l="";c.getExtraProfileInfo!=null&&(l=c.getExtraProfileInfo()),i.logger.logKernelProfile(t,s,u,c.kernelMs,e,l)}))}))})),a},r})(),Op=(function(){function r(){}return r.prototype.logKernelProfile=function(t,e,n,a,i,o){var s=typeof a=="number"?pn(a+"ms",9):a.error,u=pn(t,25),c=e.rank,l=e.size,f=pn(e.shape.toString(),14),h="";for(var d in i){var p=i[d].shape||e.shape,v=p.length;h+=d+": "+v+"D "+(v>0?p:"")+" "}console.log("%c"+u+"	%c"+s+"	%c"+c+"D "+f+"	%c"+l+"	%c"+h+"	%c"+o,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")},r})(),Sc=20,Da=3,rs=7;function Lp(r,t,e,n){var a=or(t),i=(function(c,l,f,h){var d=re(l),p=h[h.length-1],v=new Array(p).fill(0),m=l.length,g=f==="complex64"?Ia(c):c;if(m>1)for(var x=0;x<d/p;x++)for(var w=x*p,y=0;y<p;y++)v[y]=Math.max(v[y],Ta(g[w+y],0,f).length);return v})(r,t,e,a),o=t.length,s=(function c(l,f,h,d,p,v){v===void 0&&(v=!0);var m=h==="complex64"?2:1,g=f[0],x=f.length;if(x===0)return h==="complex64"?[Ta(Ia(l)[0],0,h)]:h==="bool"?[Al(l[0])]:[l[0].toString()];if(x===1){if(g>Sc){var w=Da*m,y=Array.from(l.slice(0,w)),b=Array.from(l.slice((g-Da)*m,g*m));return h==="complex64"&&(y=Ia(y),b=Ia(b)),["["+y.map((function(N,H){return Ta(N,p[H],h)})).join(", ")+", ..., "+b.map((function(N,H){return Ta(N,p[g-Da+H],h)})).join(", ")+"]"]}return["["+(h==="complex64"?Ia(l):Array.from(l)).map((function(N,H){return Ta(N,p[H],h)})).join(", ")+"]"]}var A=f.slice(1),I=d.slice(1),T=d[0]*m,S=[];if(g>Sc){for(var D=0;D<Da;D++){var _=(M=D*T)+T;S.push.apply(S,c(l.slice(M,_),A,h,I,p,!1))}for(S.push("..."),D=g-Da;D<g;D++)_=(M=D*T)+T,S.push.apply(S,c(l.slice(M,_),A,h,I,p,D===g-1))}else for(D=0;D<g;D++){var M;_=(M=D*T)+T,S.push.apply(S,c(l.slice(M,_),A,h,I,p,D===g-1))}var L=x===2?",":"";for(S[0]="["+S[0]+L,D=1;D<S.length-1;D++)S[D]=" "+S[D]+L;var O=`,
`;for(D=2;D<x;D++)O+=`
`;return S[S.length-1]=" "+S[S.length-1]+"]"+(v?"":O),S})(r,t,e,a,i),u=["Tensor"];return n&&(u.push("  dtype: "+e),u.push("  rank: "+o),u.push("  shape: ["+t+"]"),u.push("  values:")),u.push(s.map((function(c){return"    "+c})).join(`
`)),u.join(`
`)}function Ta(r,t,e){return pn(Array.isArray(r)?parseFloat(r[0].toFixed(rs))+" + "+parseFloat(r[1].toFixed(rs))+"j":Kr(r)?"'"+r+"'":e==="bool"?Al(r):parseFloat(r.toFixed(rs)).toString(),t)}function Al(r){return r===0?"false":"true"}function Ia(r){for(var t=[],e=0;e<r.length;e+=2)t.push([r[e],r[e+1]]);return t}var Oa=(function(){function r(t,e,n){var a=this;if(this.dtype=e,this.shape=t.slice(),this.size=re(t),n!=null){var i=n.length;C(i===this.size,(function(){return"Length of values '"+i+"' does not match the size inferred by the shape '"+a.size+"'."}))}if(e==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=n||ka(e,this.size),this.strides=or(t)}return r.prototype.set=function(t){for(var e=this,n=[],a=1;a<arguments.length;a++)n[a-1]=arguments[a];n.length===0&&(n=[0]),C(n.length===this.rank,(function(){return"The number of provided coordinates ("+n.length+") must match the rank ("+e.rank+")"}));var i=this.locToIndex(n);this.values[i]=t},r.prototype.get=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];t.length===0&&(t=[0]);for(var n=0,a=0,i=t;a<i.length;a++){var o=i[a];if(o<0||o>=this.shape[n]){var s="Requested out of range element at "+t+".   Buffer shape="+this.shape;throw new Error(s)}n++}for(var u=t[t.length-1],c=0;c<t.length-1;++c)u+=this.strides[c]*t[c];return this.values[u]},r.prototype.locToIndex=function(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];for(var e=t[t.length-1],n=0;n<t.length-1;++n)e+=this.strides[n]*t[n];return e},r.prototype.indexToLoc=function(t){if(this.rank===0)return[];if(this.rank===1)return[t];for(var e=new Array(this.shape.length),n=0;n<e.length-1;++n)e[n]=Math.floor(t/this.strides[n]),t-=e[n]*this.strides[n];return e[e.length-1]=t,e},Object.defineProperty(r.prototype,"rank",{get:function(){return this.shape.length},enumerable:!0,configurable:!0}),r.prototype.toTensor=function(){return mr().makeTensor(this.values,this.shape,this.dtype)},r})(),mr=null,F=null,El=null,_e=(function(){function r(t,e,n,a){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=e||"float32",this.size=re(t),this.strides=or(t),this.dataId=n,this.id=a,this.rankType=this.rank<5?this.rank.toString():"higher"}return r.prototype.flatten=function(){return this.throwIfDisposed(),this.as1D()},r.prototype.asScalar=function(){return this.throwIfDisposed(),C(this.size===1,(function(){return"The array must have only 1 element."})),this.reshape([])},r.prototype.as1D=function(){return this.throwIfDisposed(),this.reshape([this.size])},r.prototype.as2D=function(t,e){return this.throwIfDisposed(),this.reshape([t,e])},r.prototype.as3D=function(t,e,n){return this.throwIfDisposed(),this.reshape([t,e,n])},r.prototype.as4D=function(t,e,n,a){return this.throwIfDisposed(),this.reshape([t,e,n,a])},r.prototype.as5D=function(t,e,n,a,i){return this.throwIfDisposed(),this.reshape([t,e,n,a,i])},r.prototype.asType=function(t){return this.throwIfDisposed(),F.cast(this,t)},Object.defineProperty(r.prototype,"rank",{get:function(){return this.shape.length},enumerable:!0,configurable:!0}),r.prototype.buffer=function(){return ee(this,void 0,void 0,(function(){var t;return te(this,(function(e){switch(e.label){case 0:return[4,this.data()];case 1:return t=e.sent(),[2,F.buffer(this.shape,this.dtype,t)]}}))}))},r.prototype.bufferSync=function(){return F.buffer(this.shape,this.dtype,this.dataSync())},r.prototype.array=function(){return ee(this,void 0,void 0,(function(){var t;return te(this,(function(e){switch(e.label){case 0:return[4,this.data()];case 1:return t=e.sent(),[2,Ss(this.shape,t)]}}))}))},r.prototype.arraySync=function(){return Ss(this.shape,this.dataSync())},r.prototype.data=function(){return ee(this,void 0,void 0,(function(){var t,e;return te(this,(function(n){switch(n.label){case 0:return this.throwIfDisposed(),t=mr().read(this.dataId),this.dtype!=="string"?[3,2]:[4,t];case 1:e=n.sent();try{return[2,e.map((function(a){return Na(a)}))]}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}n.label=2;case 2:return[2,t]}}))}))},r.prototype.dataSync=function(){this.throwIfDisposed();var t=mr().readSync(this.dataId);if(this.dtype==="string")try{return t.map((function(e){return Na(e)}))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t},r.prototype.bytes=function(){return ee(this,void 0,void 0,(function(){var t;return te(this,(function(e){switch(e.label){case 0:return this.throwIfDisposed(),[4,mr().read(this.dataId)];case 1:return t=e.sent(),this.dtype==="string"?[2,t]:[2,new Uint8Array(t.buffer)]}}))}))},r.prototype.dispose=function(){this.isDisposed||(mr().disposeTensor(this),this.isDisposedInternal=!0)},Object.defineProperty(r.prototype,"isDisposed",{get:function(){return this.isDisposedInternal},enumerable:!0,configurable:!0}),r.prototype.throwIfDisposed=function(){if(this.isDisposed)throw new Error("Tensor is disposed.")},r.prototype.toFloat=function(){return this.asType("float32")},r.prototype.toInt=function(){return this.asType("int32")},r.prototype.toBool=function(){return this.asType("bool")},r.prototype.print=function(t){return t===void 0&&(t=!1),F.print(this,t)},r.prototype.reshape=function(t){return this.throwIfDisposed(),F.reshape(this,t)},r.prototype.reshapeAs=function(t){return this.throwIfDisposed(),this.reshape(t.shape)},r.prototype.expandDims=function(t){return t===void 0&&(t=0),F.expandDims(this,t)},r.prototype.cumsum=function(t,e,n){return t===void 0&&(t=0),e===void 0&&(e=!1),n===void 0&&(n=!1),F.cumsum(this,t,e,n)},r.prototype.squeeze=function(t){return this.throwIfDisposed(),F.squeeze(this,t)},r.prototype.clone=function(){return this.throwIfDisposed(),F.clone(this)},r.prototype.oneHot=function(t,e,n){return this.throwIfDisposed(),F.oneHot(this,t,e,n)},r.prototype.toString=function(t){return t===void 0&&(t=!1),Lp(this.dataSync(),this.shape,this.dtype,t)},r.prototype.tile=function(t){return this.throwIfDisposed(),F.tile(this,t)},r.prototype.gather=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),F.gather(this,t,e)},r.prototype.matMul=function(t,e,n){return e===void 0&&(e=!1),n===void 0&&(n=!1),this.throwIfDisposed(),F.matMul(this,t,e,n)},r.prototype.dot=function(t){return this.throwIfDisposed(),F.dot(this,t)},r.prototype.norm=function(t,e,n){return t===void 0&&(t="euclidean"),e===void 0&&(e=null),n===void 0&&(n=!1),this.throwIfDisposed(),F.norm(this,t,e,n)},r.prototype.slice=function(t,e){return this.throwIfDisposed(),F.slice(this,t,e)},r.prototype.reverse=function(t){return this.throwIfDisposed(),F.reverse(this,t)},r.prototype.concat=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),t instanceof r&&(t=[t]),F.concat([this].concat(t),e)},r.prototype.split=function(t,e){return e===void 0&&(e=0),this.throwIfDisposed(),F.split(this,t,e)},r.prototype.stack=function(t,e){return e===void 0&&(e=0),F.stack([this,t],e)},r.prototype.unstack=function(t){return t===void 0&&(t=0),F.unstack(this,t)},r.prototype.pad=function(t,e){return e===void 0&&(e=0),F.pad(this,t,e)},r.prototype.batchNormalization=function(t,e,n,a,i){return n===void 0&&(n=.001),El("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon"),this.batchNorm(t,e,i,a,n)},r.prototype.batchNorm=function(t,e,n,a,i){return i===void 0&&(i=.001),this.throwIfDisposed(),F.batchNorm(this,t,e,n,a,i)},r.prototype.all=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.all(this,t,e)},r.prototype.any=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.any(this,t,e)},r.prototype.logSumExp=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.logSumExp(this,t,e)},r.prototype.sum=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.sum(this,t,e)},r.prototype.prod=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.prod(this,t,e)},r.prototype.mean=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.mean(this,t,e)},r.prototype.min=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.min(this,t,e)},r.prototype.max=function(t,e){return t===void 0&&(t=null),e===void 0&&(e=!1),this.throwIfDisposed(),F.max(this,t,e)},r.prototype.argMin=function(t){return t===void 0&&(t=null),this.throwIfDisposed(),F.argMin(this,t)},r.prototype.argMax=function(t){return t===void 0&&(t=null),this.throwIfDisposed(),F.argMax(this,t)},r.prototype.cast=function(t){return this.throwIfDisposed(),F.cast(this,t)},r.prototype.add=function(t){return this.throwIfDisposed(),F.add(this,t)},r.prototype.addStrict=function(t){return this.throwIfDisposed(),F.addStrict(this,t)},r.prototype.atan2=function(t){return this.throwIfDisposed(),F.atan2(this,t)},r.prototype.sub=function(t){return this.throwIfDisposed(),F.sub(this,t)},r.prototype.subStrict=function(t){return this.throwIfDisposed(),F.subStrict(this,t)},r.prototype.pow=function(t){return this.throwIfDisposed(),F.pow(this,t)},r.prototype.powStrict=function(t){return this.throwIfDisposed(),F.powStrict(this,t)},r.prototype.mul=function(t){return this.throwIfDisposed(),F.mul(this,t)},r.prototype.mulStrict=function(t){return this.throwIfDisposed(),F.mulStrict(this,t)},r.prototype.div=function(t){return this.throwIfDisposed(),F.div(this,t)},r.prototype.divNoNan=function(t){return this.throwIfDisposed(),F.divNoNan(this,t)},r.prototype.floorDiv=function(t){return this.throwIfDisposed(),F.floorDiv(this,t)},r.prototype.divStrict=function(t){return this.throwIfDisposed(),F.divStrict(this,t)},r.prototype.minimum=function(t){return this.throwIfDisposed(),F.minimum(this,t)},r.prototype.minimumStrict=function(t){return this.throwIfDisposed(),F.minimumStrict(this,t)},r.prototype.maximum=function(t){return this.throwIfDisposed(),F.maximum(this,t)},r.prototype.maximumStrict=function(t){return this.throwIfDisposed(),F.maximumStrict(this,t)},r.prototype.mod=function(t){return this.throwIfDisposed(),F.mod(this,t)},r.prototype.modStrict=function(t){return this.throwIfDisposed(),F.modStrict(this,t)},r.prototype.squaredDifferenceStrict=function(t){return this.throwIfDisposed(),F.squaredDifferenceStrict(this,t)},r.prototype.transpose=function(t){return this.throwIfDisposed(),F.transpose(this,t)},r.prototype.notEqual=function(t){return this.throwIfDisposed(),F.notEqual(this,t)},r.prototype.notEqualStrict=function(t){return this.throwIfDisposed(),F.notEqualStrict(this,t)},r.prototype.less=function(t){return this.throwIfDisposed(),F.less(this,t)},r.prototype.lessStrict=function(t){return this.throwIfDisposed(),F.lessStrict(this,t)},r.prototype.equal=function(t){return this.throwIfDisposed(),F.equal(this,t)},r.prototype.equalStrict=function(t){return this.throwIfDisposed(),F.equalStrict(this,t)},r.prototype.lessEqual=function(t){return this.throwIfDisposed(),F.lessEqual(this,t)},r.prototype.lessEqualStrict=function(t){return this.throwIfDisposed(),F.lessEqualStrict(this,t)},r.prototype.greater=function(t){return this.throwIfDisposed(),F.greater(this,t)},r.prototype.greaterStrict=function(t){return this.throwIfDisposed(),F.greaterStrict(this,t)},r.prototype.greaterEqual=function(t){return this.throwIfDisposed(),F.greaterEqual(this,t)},r.prototype.greaterEqualStrict=function(t){return this.throwIfDisposed(),F.greaterEqualStrict(this,t)},r.prototype.logicalAnd=function(t){return this.throwIfDisposed(),F.logicalAnd(this,t)},r.prototype.logicalOr=function(t){return this.throwIfDisposed(),F.logicalOr(this,t)},r.prototype.logicalNot=function(){return this.throwIfDisposed(),F.logicalNot(this)},r.prototype.logicalXor=function(t){return this.throwIfDisposed(),F.logicalXor(this,t)},r.prototype.where=function(t,e){return this.throwIfDisposed(),F.where(t,this,e)},r.prototype.neg=function(){return this.throwIfDisposed(),F.neg(this)},r.prototype.ceil=function(){return this.throwIfDisposed(),F.ceil(this)},r.prototype.floor=function(){return this.throwIfDisposed(),F.floor(this)},r.prototype.sign=function(){return this.throwIfDisposed(),F.sign(this)},r.prototype.isNaN=function(){return this.throwIfDisposed(),F.isNaN(this)},r.prototype.isInf=function(){return this.throwIfDisposed(),F.isInf(this)},r.prototype.isFinite=function(){return this.throwIfDisposed(),F.isFinite(this)},r.prototype.exp=function(){return this.throwIfDisposed(),F.exp(this)},r.prototype.expm1=function(){return this.throwIfDisposed(),F.expm1(this)},r.prototype.log=function(){return this.throwIfDisposed(),F.log(this)},r.prototype.log1p=function(){return this.throwIfDisposed(),F.log1p(this)},r.prototype.sqrt=function(){return this.throwIfDisposed(),F.sqrt(this)},r.prototype.rsqrt=function(){return this.throwIfDisposed(),F.rsqrt(this)},r.prototype.square=function(){return this.throwIfDisposed(),F.square(this)},r.prototype.reciprocal=function(){return this.throwIfDisposed(),F.reciprocal(this)},r.prototype.abs=function(){return this.throwIfDisposed(),F.abs(this)},r.prototype.clipByValue=function(t,e){return this.throwIfDisposed(),F.clipByValue(this,t,e)},r.prototype.relu=function(){return this.throwIfDisposed(),F.relu(this)},r.prototype.relu6=function(){return this.throwIfDisposed(),F.relu6(this)},r.prototype.elu=function(){return this.throwIfDisposed(),F.elu(this)},r.prototype.selu=function(){return this.throwIfDisposed(),F.selu(this)},r.prototype.leakyRelu=function(t){return t===void 0&&(t=.2),this.throwIfDisposed(),F.leakyRelu(this,t)},r.prototype.prelu=function(t){return this.throwIfDisposed(),F.prelu(this,t)},r.prototype.sigmoid=function(){return this.throwIfDisposed(),F.sigmoid(this)},r.prototype.logSigmoid=function(){return this.throwIfDisposed(),F.logSigmoid(this)},r.prototype.softplus=function(){return this.throwIfDisposed(),F.softplus(this)},r.prototype.zerosLike=function(){return this.throwIfDisposed(),F.zerosLike(this)},r.prototype.onesLike=function(){return this.throwIfDisposed(),F.onesLike(this)},r.prototype.sin=function(){return this.throwIfDisposed(),F.sin(this)},r.prototype.cos=function(){return this.throwIfDisposed(),F.cos(this)},r.prototype.tan=function(){return this.throwIfDisposed(),F.tan(this)},r.prototype.asin=function(){return this.throwIfDisposed(),F.asin(this)},r.prototype.acos=function(){return this.throwIfDisposed(),F.acos(this)},r.prototype.atan=function(){return this.throwIfDisposed(),F.atan(this)},r.prototype.sinh=function(){return this.throwIfDisposed(),F.sinh(this)},r.prototype.cosh=function(){return this.throwIfDisposed(),F.cosh(this)},r.prototype.tanh=function(){return this.throwIfDisposed(),F.tanh(this)},r.prototype.asinh=function(){return this.throwIfDisposed(),F.asinh(this)},r.prototype.acosh=function(){return this.throwIfDisposed(),F.acosh(this)},r.prototype.atanh=function(){return this.throwIfDisposed(),F.atanh(this)},r.prototype.erf=function(){return this.throwIfDisposed(),F.erf(this)},r.prototype.round=function(){return this.throwIfDisposed(),F.round(this)},r.prototype.step=function(t){return t===void 0&&(t=0),this.throwIfDisposed(),F.step(this,t)},r.prototype.softmax=function(t){return t===void 0&&(t=-1),this.throwIfDisposed(),F.softmax(this,t)},r.prototype.logSoftmax=function(t){return t===void 0&&(t=-1),this.throwIfDisposed(),F.logSoftmax(this,t)},r.prototype.resizeBilinear=function(t,e){return e===void 0&&(e=!1),this.throwIfDisposed(),F.image.resizeBilinear(this,t,e)},r.prototype.resizeNearestNeighbor=function(t,e){return e===void 0&&(e=!1),this.throwIfDisposed(),F.image.resizeNearestNeighbor(this,t,e)},r.prototype.conv1d=function(t,e,n,a,i,o){return a===void 0&&(a="NWC"),i===void 0&&(i=1),this.throwIfDisposed(),F.conv1d(this,t,e,n,a,i,o)},r.prototype.conv2d=function(t,e,n,a,i,o){return a===void 0&&(a="NHWC"),i===void 0&&(i=[1,1]),this.throwIfDisposed(),F.conv2d(this,t,e,n,a,i,o)},r.prototype.conv2dTranspose=function(t,e,n,a,i){return this.throwIfDisposed(),F.conv2dTranspose(this,t,e,n,a,i)},r.prototype.depthwiseConv2D=function(t,e,n,a,i,o){return a===void 0&&(a="NHWC"),i===void 0&&(i=[1,1]),this.throwIfDisposed(),F.depthwiseConv2d(this,t,e,n,a,i,o)},r.prototype.separableConv2d=function(t,e,n,a,i,o){return i===void 0&&(i=[1,1]),o===void 0&&(o="NHWC"),this.throwIfDisposed(),F.separableConv2d(this,t,e,n,a,i,o)},r.prototype.avgPool=function(t,e,n,a){return this.throwIfDisposed(),F.avgPool(this,t,e,n,a)},r.prototype.maxPool=function(t,e,n,a){return this.throwIfDisposed(),F.maxPool(this,t,e,n,a)},r.prototype.localResponseNormalization=function(t,e,n,a){return t===void 0&&(t=5),e===void 0&&(e=1),n===void 0&&(n=1),a===void 0&&(a=.5),F.localResponseNormalization(this,t,e,n,a)},r.prototype.pool=function(t,e,n,a,i){return this.throwIfDisposed(),F.pool(this,t,e,n,a,i)},r.prototype.variable=function(t,e,n){return t===void 0&&(t=!0),this.throwIfDisposed(),mr().makeVariable(this,t,e,n)},r.prototype.unsortedSegmentSum=function(t,e){return this.throwIfDisposed(),F.unsortedSegmentSum(this,t,e)},r.prototype.batchToSpaceND=function(t,e){return this.throwIfDisposed(),F.batchToSpaceND(this,t,e)},r.prototype.spaceToBatchND=function(t,e){return this.throwIfDisposed(),F.spaceToBatchND(this,t,e)},r.prototype.topk=function(t,e){return t===void 0&&(t=1),e===void 0&&(e=!0),this.throwIfDisposed(),F.topk(this,t,e)},r.prototype.stridedSlice=function(t,e,n,a,i,o,s,u){return a===void 0&&(a=0),i===void 0&&(i=0),o===void 0&&(o=0),s===void 0&&(s=0),u===void 0&&(u=0),this.throwIfDisposed(),F.stridedSlice(this,t,e,n,a,i,o,s,u)},r.prototype.depthToSpace=function(t,e){return this.throwIfDisposed(),F.depthToSpace(this,t,e)},r.prototype.fft=function(){return this.throwIfDisposed(),F.spectral.fft(this)},r.prototype.ifft=function(){return this.throwIfDisposed(),F.spectral.ifft(this)},r.prototype.rfft=function(){return this.throwIfDisposed(),F.spectral.rfft(this)},r.prototype.irfft=function(){return this.throwIfDisposed(),F.spectral.irfft(this)},r})();Object.defineProperty(_e,Symbol.hasInstance,{value:function(r){return!!r&&r.dataId!=null&&r.shape!=null&&r.dtype!=null}});var Dc,Ts,Is,Rs,Ms,mn=(function(r){function t(e,n,a,i){var o=r.call(this,e.shape,e.dtype,e.dataId,i)||this;return o.trainable=n,o.name=a,o}return ur(t,r),t.prototype.assign=function(e){if(e.dtype!==this.dtype)throw new Error("dtype of the new value ("+e.dtype+") and previous value ("+this.dtype+") must match");if(!Je(e.shape,this.shape))throw new Error("shape of the new value ("+e.shape+") and previous value ("+this.shape+") must match");mr().disposeTensor(this),this.dataId=e.dataId,mr().incRef(this,null)},t.prototype.dispose=function(){mr().disposeVariable(this),this.isDisposedInternal=!0},t})(_e);Object.defineProperty(mn,Symbol.hasInstance,{value:function(r){return r instanceof _e&&r.assign!=null&&r.assign instanceof Function}}),(function(r){r.R0="R0",r.R1="R1",r.R2="R2",r.R3="R3",r.R4="R4",r.R5="R5",r.R6="R6"})(Dc||(Dc={})),(function(r){r.float32="float32",r.int32="int32",r.bool="int32",r.complex64="complex64"})(Ts||(Ts={})),(function(r){r.float32="float32",r.int32="int32",r.bool="bool",r.complex64="complex64"})(Is||(Is={})),(function(r){r.float32="float32",r.int32="float32",r.bool="float32",r.complex64="complex64"})(Rs||(Rs={})),(function(r){r.float32="complex64",r.int32="complex64",r.bool="complex64",r.complex64="complex64"})(Ms||(Ms={}));var Up={float32:Rs,int32:Ts,bool:Is,complex64:Ms};function st(r,t){if(r==="string"||t==="string"){if(r==="string"&&t==="string")return"string";throw new Error("Can not upcast "+r+" with "+t)}return Up[r][t]}function ns(r){return st(r,"int32")}function Ve(r,t){if(r.dtype===t.dtype)return[r,t];var e=st(r.dtype,t.dtype);return[r.cast(e),t.cast(e)]}function Cl(r,t){C(r.dtype===t.dtype,(function(){return"The dtypes of the first("+r.dtype+") and second("+t.dtype+") input must match"}))}function Qs(r){var t=[];return(function e(n,a,i){if(n!=null){if(n instanceof _e)return void a.push(n);if(o=n,!(!Array.isArray(o)&&typeof o!="object")){var o,s=n;for(var u in s){var c=s[u];i.has(c)||(i.add(c),e(c,a,i))}}}})(r,t,new Set),t}var as,Y1=Object.freeze({makeTypesMatch:Ve,assertTypesMatch:Cl,isTensorInList:function(r,t){return t.some((function(e){return e.id===r.id}))},getTensorsInContainer:Qs}),Tc=(function(){function r(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null}}return r.prototype.dispose=function(){for(var t in this.registeredVariables)this.registeredVariables[t].dispose()},r})(),Gp=(function(){function r(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new Tc}return r.prototype.ready=function(){return ee(this,void 0,void 0,(function(){var t,e,n;return te(this,(function(a){switch(a.label){case 0:if(this.pendingBackendInit!=null)return[2,this.pendingBackendInit.then((function(){}))];if(this.backendInstance!=null)return[2];t=this.getSortedBackends(),e=0,a.label=1;case 1:return e<t.length?(n=t[e],[4,this.initializeBackend(n).success]):[3,5];case 2:return a.sent()?[4,this.setBackend(n)]:[3,4];case 3:return a.sent(),[2];case 4:return e++,[3,1];case 5:throw new Error("Could not initialize any backends, all backend initializations failed.")}}))}))},Object.defineProperty(r.prototype,"backend",{get:function(){if(this.pendingBackendInit!=null)throw new Error("Backend '"+this.backendName+"' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");if(this.backendInstance==null){var t=this.initializeBackendsAndReturnBest(),e=t.name;if(t.asyncInit)throw new Error("The highest priority backend '"+e+"' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods");this.setBackend(e)}return this.backendInstance},enumerable:!0,configurable:!0}),r.prototype.backendNames=function(){return Object.keys(this.registryFactory)},r.prototype.findBackend=function(t){return!(t in this.registry)&&(!(t in this.registryFactory)||this.initializeBackend(t).asyncInit)?null:this.registry[t]},r.prototype.findBackendFactory=function(t){return t in this.registryFactory?this.registryFactory[t].factory:null},r.prototype.registerBackend=function(t,e,n){return n===void 0&&(n=1),t in this.registryFactory?(console.warn(t+" backend was already registered. Reusing existing backend factory."),!1):(this.registryFactory[t]={factory:e,priority:n},!0)},r.prototype.setBackend=function(t){return ee(this,void 0,void 0,(function(){var e,n,a;return te(this,(function(i){switch(i.label){case 0:if(this.registryFactory[t]==null)throw new Error("Backend name '"+t+"' not found in registry");return this.backendName=t,this.registry[t]!=null?[3,4]:(this.backendInstance=null,e=this.initializeBackend(t),n=e.success,e.asyncInit?[4,n]:[3,2]);case 1:return a=i.sent(),[3,3];case 2:a=n,i.label=3;case 3:if(!a)return[2,!1];i.label=4;case 4:return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new Np(this.backendInstance),[2,!0]}}))}))},r.prototype.setupRegisteredKernels=function(){var t=this;Ec(this.backendName).forEach((function(e){e.setupFunc!=null&&e.setupFunc(t.backendInstance)}))},r.prototype.disposeRegisteredKernels=function(t){var e=this;Ec(t).forEach((function(n){n.disposeFunc!=null&&n.disposeFunc(e.registry[t])}))},r.prototype.initializeBackend=function(t){var e=this,n=this.registryFactory[t];if(n==null)throw new Error("Cannot initialize backend "+t+", no registration found.");try{var a=n.factory();if(Promise.resolve(a)===a){var i=++this.pendingBackendInitId,o=a.then((function(s){return!(i<e.pendingBackendInitId)&&(e.registry[t]=s,e.pendingBackendInit=null,!0)})).catch((function(s){return!(i<e.pendingBackendInitId)&&(e.pendingBackendInit=null,console.warn("Initialization of backend "+t+" failed"),console.warn(s.stack||s.message),!1)}));return this.pendingBackendInit=o,{success:o,asyncInit:!0}}return this.registry[t]=a,{success:!0,asyncInit:!1}}catch(s){return console.warn("Initialization of backend "+t+" failed"),console.warn(s.stack||s.message),{success:!1,asyncInit:!1}}},r.prototype.removeBackend=function(t){if(!(t in this.registryFactory))throw new Error(t+" backend not found in registry");this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)},r.prototype.getSortedBackends=function(){var t=this;if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((function(e,n){return t.registryFactory[n].priority-t.registryFactory[e].priority}))},r.prototype.initializeBackendsAndReturnBest=function(){for(var t=this.getSortedBackends(),e=0;e<t.length;e++){var n=t[e],a=this.initializeBackend(n),i=a.success,o=a.asyncInit;if(o||i)return{name:n,asyncInit:o}}throw new Error("Could not initialize any backends, all backend initializations failed.")},r.prototype.moveData=function(t,e){var n=this.state.tensorInfo.get(e),a=n.backend,i=this.readSync(e);a.disposeData(e),n.backend=t,t.move(e,i,n.shape,n.dtype),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++},r.prototype.tidy=function(t,e){var n,a=this,i=null;if(e==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");e=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof e!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");i=t}return this.scopedRun((function(){return a.startScope(i)}),(function(){return a.endScope(n)}),(function(){return(n=e())instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),n}))},r.prototype.scopedRun=function(t,e,n){t();try{var a=n();return e(),a}catch(i){throw e(),i}},r.prototype.nextTensorId=function(){return r.nextTensorId++},r.prototype.nextVariableId=function(){return r.nextVariableId++},r.prototype.clone=function(t){var e=this.makeTensorFromDataId(t.dataId,t.shape,t.dtype),n={x:t};return this.addTapeNode(this.state.activeScope.name,n,[e],(function(a){return{x:function(){return a.toFloat()}}}),[]),e},r.prototype.runKernel=function(t,e,n,a,i){return this.runKernelFunc(null,e,null,t,n,a,i)},r.prototype.shouldCheckForMemLeaks=function(){return this.ENV.getBool("IS_TEST")},r.prototype.checkKernelForMemLeak=function(t,e,n){var a=this.backend.numDataIds(),i=0;n.forEach((function(u){i+=u.dtype==="complex64"?3:1}));var o=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],s=a-e-i-o;if(s>0)throw new Error("Backend '"+this.backendName+"' has an internal memory leak ("+s+" data ids) after running '"+t+"'")},r.prototype.runKernelFunc=function(t,e,n,a,i,o,s){var u,c=this;o===void 0&&(o=[]),s===void 0&&(s=[]);var l=[],f=this.isTapeOn();a==null&&(a=this.state.activeScope!=null?this.state.activeScope.name:"");var h,d=function(x){f&&(l=x.map((function(w){return c.keep(c.clone(w))})))},p=this.state.numBytes,v=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);var m,g=ul(a,this.backendName);return h=g!=null?function(){var x=c.backend.numDataIds();m=g.kernelFunc({inputs:e,attrs:i,backend:c.backend});var w=Array.isArray(m)?m:[m];c.shouldCheckForMemLeaks()&&c.checkKernelForMemLeak(a,x,w);var y=w.map((function(A){var I=A.dataId,T=A.shape,S=A.dtype;return c.makeTensorFromDataId(I,T,S)})),b=y.filter((function(A,I){return s[I]}));return d((o||[]).slice().concat(b)),y}:function(){var x=c.backend.numDataIds();m=c.tidy((function(){return t(c.backend,d)}));var w=Array.isArray(m)?m:[m];return c.shouldCheckForMemLeaks()&&c.checkKernelForMemLeak(a,x,w),w},this.scopedRun((function(){return c.state.kernelDepth++}),(function(){return c.state.kernelDepth--}),(function(){u=c.ENV.getBool("DEBUG")?c.profiler.profileKernel(a,e,(function(){return h()})):h()})),f&&this.addTapeNode(a,e,u,n,l),this.state.profiling&&this.state.activeProfile.kernels.push({name:a,bytesAdded:this.state.numBytes-p,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-v,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(e).map((function(x){return e[x].shape})),outputShapes:u.map((function(x){return x.shape}))}),Array.isArray(m)?u:u[0]},r.prototype.makeTensor=function(t,e,n,a){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");n=n||"float32",a=a||this.backend;var i=t;n==="string"&&Kr(t[0])&&(i=t.map((function(l){return wl(l)})));var o=a.write(i,e,n),s=new _e(e,n,o,this.nextTensorId());if(this.incRef(s,a),n==="string"){var u=this.state.tensorInfo.get(o),c=gl(i);this.state.numBytes+=c-u.bytes,u.bytes=c}return s},r.prototype.makeTensorFromDataId=function(t,e,n,a){var i=new _e(e,n=n||"float32",t,this.nextTensorId());return this.incRef(i,a),i},r.prototype.makeVariable=function(t,e,n,a){e===void 0&&(e=!0),n=n||this.nextVariableId().toString(),a!=null&&a!==t.dtype&&(t=t.asType(a));var i=new mn(t,e,n,this.nextTensorId());if(this.state.registeredVariables[i.name]!=null)throw new Error("Variable with name "+i.name+" was already registered");return this.state.registeredVariables[i.name]=i,this.incRef(i,this.backend),i},r.prototype.incRef=function(t,e){var n=this.state.tensorInfo.has(t.dataId)?this.state.tensorInfo.get(t.dataId).refCount:0;if(this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++,n===0){this.state.numDataBuffers++;var a=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(a=t.size*Xs(t.dtype)),this.state.tensorInfo.set(t.dataId,{backend:e||this.backend,dtype:t.dtype,shape:t.shape,bytes:a,refCount:0}),this.state.numBytes+=a}this.state.tensorInfo.get(t.dataId).refCount++,t instanceof mn||this.track(t)},r.prototype.disposeTensor=function(t){if(this.state.tensorInfo.has(t.dataId)){this.state.numTensors--,t.dtype==="string"&&this.state.numStringTensors--;var e=this.state.tensorInfo.get(t.dataId);e.refCount<=1?(t.dtype!=="complex64"&&(this.state.numBytes-=e.bytes),this.state.numDataBuffers--,e.backend.disposeData(t.dataId),this.state.tensorInfo.delete(t.dataId)):this.state.tensorInfo.get(t.dataId).refCount--}},r.prototype.disposeVariables=function(){for(var t in this.state.registeredVariables){var e=this.state.registeredVariables[t];this.disposeVariable(e)}},r.prototype.disposeVariable=function(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]},r.prototype.memory=function(){var t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t},r.prototype.profile=function(t){return ee(this,void 0,void 0,(function(){var e,n;return te(this,(function(a){return this.state.profiling=!0,e=this.state.numBytes,n=this.state.numTensors,this.state.activeProfile.kernels=[],this.state.activeProfile.result=t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max.apply(Math,this.state.activeProfile.kernels.map((function(i){return i.totalBytesSnapshot}))),this.state.activeProfile.newBytes=this.state.numBytes-e,this.state.activeProfile.newTensors=this.state.numTensors-n,[2,this.state.activeProfile]}))}))},r.prototype.isTapeOn=function(){return this.state.gradientDepth>0&&this.state.kernelDepth===0},r.prototype.addTapeNode=function(t,e,n,a,i){var o=this,s={id:this.state.nextTapeNodeId++,kernelName:t,inputs:e,outputs:n,saved:i},u=Fp(t);u!=null&&(a=u.gradFunc),a!=null&&(s.gradient=function(c){return c=c.map((function(l,f){if(l==null){var h=n[f],d=qn(h.size,h.dtype);return o.makeTensor(d,h.shape,h.dtype)}return l})),a(c.length>1?c:c[0],i)}),this.state.activeTape.push(s)},r.prototype.keep=function(t){return t.kept=!0,t},r.prototype.startTape=function(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++},r.prototype.endTape=function(){this.state.gradientDepth--},r.prototype.startScope=function(t){var e={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(e.name=t),this.state.scopeStack.push(e),this.state.activeScope=e},r.prototype.endScope=function(t){for(var e=this,n=Qs(t),a=new Set(n.map((function(u){return u.id}))),i=0;i<this.state.activeScope.track.length;i++){var o=this.state.activeScope.track[i];o.kept||a.has(o.id)||o.dispose()}var s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach((function(u){u.kept||u.scopeId!==s.id||e.track(u)}))},r.prototype.gradients=function(t,e,n,a){var i=this;if(a===void 0&&(a=!1),C(e.length>0,(function(){return"gradients() received an empty list of xs."})),n!=null&&n.dtype!=="float32")throw new Error("dy must have 'float32' dtype, but has '"+n.dtype+"'");var o=this.scopedRun((function(){return i.startTape()}),(function(){return i.endTape()}),(function(){return i.tidy("forward",t)}));C(o instanceof _e,(function(){return"The result y returned by f() must be a tensor."}));var s=(function(u,c,l){for(var f={},h={},d=0;d<c.length;d++)f[c[d].id]=!0;for(d=0;d<u.length;d++){var p=(A=u[d]).inputs;for(var v in p){for(var m=p[v],g=!1,x=0;x<c.length;x++)if(f[m.id]){A.outputs.forEach((function(D){return f[D.id]=!0})),g=!0,h[A.id]=!0;break}if(g)break}}var w={};w[l.id]=!0;var y={};for(d=u.length-1;d>=0;d--)for(p=(A=u[d]).inputs,x=0;x<A.outputs.length;x++)if(w[A.outputs[x].id]){for(var v in p)w[p[v].id]=!0,y[A.id]=!0;break}var b=[];for(d=0;d<u.length;d++){var A;if(h[(A=u[d]).id]&&y[A.id]){var I={};for(var v in A.inputs){var T=A.inputs[v];f[T.id]&&(I[v]=T)}var S=Object.assign({},A);S.inputs=I,S.outputs=A.outputs,b.push(S)}}return b})(this.state.activeTape,e,o);if(!a&&s.length===0&&e.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",(function(){var u,c,l={};l[o.id]=n??(u=o.shape,c=js(re(u),"float32"),B.makeTensor(c,u,"float32")),(function(h,d,p){for(var v=function(g){var x=d[g],w=[];if(x.outputs.forEach((function(I){var T=h[I.id];T!=null?w.push(T):w.push(null)})),x.gradient==null)throw new Error("Cannot compute gradient: gradient function not found for "+x.kernelName+".");var y=x.gradient(w),b=function(I){if(!(I in y))throw new Error("Cannot backprop through input "+I+". Available gradients found: "+Object.keys(y)+".");var T=p((function(){return y[I]()}));if(T.dtype!=="float32")throw new Error("Error in gradient for op "+x.kernelName+". The gradient of input "+I+" must have 'float32' dtype, but has '"+T.dtype+"'");var S=x.inputs[I];if(!Je(T.shape,S.shape))throw new Error("Error in gradient for op "+x.kernelName+". The gradient of input '"+I+"' has shape '"+T.shape+"', which does not match the shape of the input '"+S.shape+"'");if(h[S.id]==null)h[S.id]=T;else{var D=h[S.id];h[S.id]=D.add(T),D.dispose()}};for(var A in x.inputs)b(A)},m=d.length-1;m>=0;m--)v(m)})(l,s,(function(h){return i.tidy(h)}));var f=e.map((function(h){return l[h.id]}));return i.state.gradientDepth===0&&(i.state.activeTape.forEach((function(h){for(var d=0,p=h.saved;d<p.length;d++)p[d].dispose()})),i.state.activeTape=null),{value:o,grads:f}}))},r.prototype.customGrad=function(t){var e=this;return C(ji(t),(function(){return"The f passed in customGrad(f) must be a function."})),function(){for(var n,a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];C(a.every((function(s){return s instanceof _e})),(function(){return"The args passed in customGrad(f)(x1, x2,...) must all be tensors"}));var o={};return a.forEach((function(s,u){o[u]=s})),e.runKernelFunc((function(s,u){return C((n=t.apply(void 0,a.concat([u]))).value instanceof _e,(function(){return"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"})),C(ji(n.gradFunc),(function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."})),n.value}),o,(function(s,u){var c=n.gradFunc(s,u),l=Array.isArray(c)?c:[c];C(l.length===a.length,(function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."})),C(l.every((function(h){return h instanceof _e})),(function(){return"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors."}));var f={};return l.forEach((function(h,d){f[d]=function(){return h}})),f}))}},r.prototype.readSync=function(t){return this.state.tensorInfo.get(t).backend.readSync(t)},r.prototype.read=function(t){return this.state.tensorInfo.get(t).backend.read(t)},r.prototype.time=function(t){return ee(this,void 0,void 0,(function(){var e,n;return te(this,(function(a){switch(a.label){case 0:return e=ir(),[4,this.backend.time(t)];case 1:return(n=a.sent()).wallMs=ir()-e,[2,n]}}))}))},r.prototype.track=function(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t},Object.defineProperty(r.prototype,"registeredVariables",{get:function(){return this.state.registeredVariables},enumerable:!0,configurable:!0}),r.prototype.reset=function(){for(var t in this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new Tc,this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null},r.nextTensorId=0,r.nextVariableId=0,r})(),B=(function(){var r=(function(){if(as==null){var e=void 0;if(typeof window<"u")e=window;else if(typeof global<"u")e=global;else if(typeof process<"u")e=process;else{if(typeof self>"u")throw new Error("Could not find a global object");e=self}as=e}return as})();if(r._tfengine==null){var t=new _p(r);r._tfengine=new Gp(t)}return(function(e){sl=e})(r._tfengine.ENV),mr=function(){return r._tfengine},r._tfengine})();function Sl(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}var Tr=k();Tr.registerFlag("DEBUG",(function(){return!1}),(function(r){r&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")})),Tr.registerFlag("IS_BROWSER",(function(){return Sl()})),Tr.registerFlag("IS_NODE",(function(){return typeof process<"u"&&process.versions!==void 0&&process.versions.node!==void 0})),Tr.registerFlag("IS_CHROME",(function(){return typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor)})),Tr.registerFlag("PROD",(function(){return!1})),Tr.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",(function(){return Tr.getBool("DEBUG")})),Tr.registerFlag("DEPRECATION_WARNINGS_ENABLED",(function(){return!0})),Tr.registerFlag("IS_TEST",(function(){return!1}));var La,Kt,Xt,ln={},is={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function Dl(r,t){ln[r]=t}function wr(r){r in ln||(ln[r]=(function(e){if(e!==1&&e!==2)throw new Error("Cannot get WebGL rendering context, WebGL is disabled.");var n=(function(a){if(typeof OffscreenCanvas<"u"&&a===2)return new OffscreenCanvas(300,150);if(typeof document<"u")return document.createElement("canvas");throw new Error("Cannot create a canvas in this context")})(e);return n.addEventListener("webglcontextlost",(function(a){a.preventDefault(),delete ln[e]}),!1),e===1?n.getContext("webgl",is)||n.getContext("experimental-webgl",is):n.getContext("webgl2",is)})(r));var t=ln[r];return t.isContextLost()?(delete ln[r],wr(r)):(t.disable(t.DEPTH_TEST),t.disable(t.STENCIL_TEST),t.disable(t.BLEND),t.disable(t.DITHER),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SAMPLE_COVERAGE),t.enable(t.SCISSOR_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),ln[r])}function oo(r,t){return[t,r]}function Pa(r){var t=re(r);return Ki(Math.ceil(t/4))}function Xa(r,t){return[Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(r/2))]}function qs(r,t){var e,n,a,i,o,s,u,c,l,f=r;return k().getNumber("WEBGL_VERSION")===2?(e=f.R32F,n=f.R16F,a=f.RGBA16F,i=f.RGBA32F,o=f.RED,s=4,u=1,c=f.HALF_FLOAT,l=f.FLOAT):(e=r.RGBA,n=r.RGBA,a=r.RGBA,i=f.RGBA,o=r.RGBA,s=4,u=4,c=t!=null?t.HALF_FLOAT_OES:null,l=r.FLOAT),{internalFormatFloat:e,internalFormatHalfFloat:n,internalFormatPackedHalfFloat:a,internalFormatPackedFloat:i,textureFormatFloat:o,downloadTextureFormat:r.RGBA,downloadUnpackNumChannels:s,defaultNumChannels:u,textureTypeHalfFloat:c,textureTypeFloat:l}}function J(r,t,e){var n=e();return t&&(function(a){var i=a.getError();if(i!==a.NO_ERROR)throw new Error("WebGL Error: "+Il(a,i))})(r),n}(function(r){r[r.DENSE=0]="DENSE",r[r.SHARED_BATCH=1]="SHARED_BATCH"})(La||(La={})),(function(r){r[r.RENDER=0]="RENDER",r[r.UPLOAD=1]="UPLOAD",r[r.PIXELS=2]="PIXELS",r[r.DOWNLOAD=3]="DOWNLOAD"})(Kt||(Kt={})),(function(r){r[r.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",r[r.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",r[r.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",r[r.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",r[r.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16"})(Xt||(Xt={}));var Hp=596e-10,zp=65504;function Tl(r){return!!(k().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||r===0||Hp<Math.abs(r)&&Math.abs(r)<zp)}function Il(r,t){switch(t){case r.NO_ERROR:return"NO_ERROR";case r.INVALID_ENUM:return"INVALID_ENUM";case r.INVALID_VALUE:return"INVALID_VALUE";case r.INVALID_OPERATION:return"INVALID_OPERATION";case r.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case r.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case r.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return"Unknown error code "+t}}function Ma(r,t,e){return _r(r,t,(function(){return r.getExtension(e)}),'Extension "'+e+'" not supported on this browser.')}function Rl(r,t,e){var n=_r(r,t,(function(){return r.createShader(r.VERTEX_SHADER)}),"Unable to create vertex WebGLShader.");if(J(r,t,(function(){return r.shaderSource(n,e)})),J(r,t,(function(){return r.compileShader(n)})),r.getShaderParameter(n,r.COMPILE_STATUS)===!1)throw console.log(r.getShaderInfoLog(n)),new Error("Failed to compile vertex shader.");return n}function Ml(r,t,e){var n=_r(r,t,(function(){return r.createShader(r.FRAGMENT_SHADER)}),"Unable to create fragment WebGLShader.");if(J(r,t,(function(){return r.shaderSource(n,e)})),J(r,t,(function(){return r.compileShader(n)})),r.getShaderParameter(n,r.COMPILE_STATUS)===!1)throw(function(a,i){var o=Wp.exec(i);if(o==null)return console.log("Couldn't parse line number in error: "+i),void console.log(a);for(var s=+o[1],u=a.split(`
`),c=u.length.toString().length+2,l=u.map((function(m,g){return pn((g+1).toString(),c)+m})),f=0,h=0;h<l.length;h++)f=Math.max(l[h].length,f);var d=l.slice(0,s-1),p=l.slice(s-1,s),v=l.slice(s);console.log(d.join(`
`)),console.log(i.split(`
`)[0]),console.log("%c "+pn(p[0],f),"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(v.join(`
`))})(e,r.getShaderInfoLog(n)),new Error("Failed to compile fragment shader.");return n}var Oi,Li,Wp=/ERROR: [0-9]+:([0-9]+):/g;function Bl(r,t){return _r(r,t,(function(){return r.createProgram()}),"Unable to create WebGLProgram.")}function _l(r,t,e){if(J(r,t,(function(){return r.linkProgram(e)})),r.getProgramParameter(e,r.LINK_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Failed to link vertex and fragment shaders.")}function Ui(r,t,e){if(J(r,t,(function(){return r.validateProgram(e)})),r.getProgramParameter(e,r.VALIDATE_STATUS)===!1)throw console.log(r.getProgramInfoLog(e)),new Error("Shader program validation failed.")}function Pl(r,t,e){var n=_r(r,t,(function(){return r.createBuffer()}),"Unable to create WebGLBuffer");return J(r,t,(function(){return r.bindBuffer(r.ARRAY_BUFFER,n)})),J(r,t,(function(){return r.bufferData(r.ARRAY_BUFFER,e,r.STATIC_DRAW)})),n}function Fl(r,t,e){var n=_r(r,t,(function(){return r.createBuffer()}),"Unable to create WebGLBuffer");return J(r,t,(function(){return r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,n)})),J(r,t,(function(){return r.bufferData(r.ELEMENT_ARRAY_BUFFER,e,r.STATIC_DRAW)})),n}function kl(r,t){return _r(r,t,(function(){return r.createTexture()}),"Unable to create WebGLTexture.")}function Nl(r,t){var e=k().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(r<=0||t<=0){var n="["+r+"x"+t+"]";throw new Error("Requested texture size "+n+" is invalid.")}if(r>e||t>e)throw n="["+r+"x"+t+"]",new Error("Requested texture size "+n+" greater than WebGL maximum on this browser / GPU "+("["+e+"x"+e+"]")+".")}function Ol(r,t){return _r(r,t,(function(){return r.createFramebuffer()}),"Unable to create WebGLFramebuffer.")}function Bs(r,t,e,n,a,i,o,s){var u=r.getAttribLocation(e,n);return u!==-1&&(J(r,t,(function(){return r.bindBuffer(r.ARRAY_BUFFER,a)})),J(r,t,(function(){return r.vertexAttribPointer(u,i,r.FLOAT,!1,o,s)})),J(r,t,(function(){return r.enableVertexAttribArray(u)})),!0)}function Ll(r,t,e,n){Wl(r,n),J(r,t,(function(){return r.activeTexture(r.TEXTURE0+n)})),J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,e)}))}function Ul(r,t,e,n){return _r(r,t,(function(){return r.getUniformLocation(e,n)}),'uniform "'+n+'" not present in program.')}function Gl(r,t,e){return r.getUniformLocation(t,e)}function Hl(r,t,e,n,a,i){J(r,t,(function(){return Ll(r,t,n,i)})),J(r,t,(function(){return r.uniform1i(a,i)}))}function Gi(r,t,e,n){J(r,t,(function(){return r.bindFramebuffer(r.FRAMEBUFFER,n)})),J(r,t,(function(){return r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0)}))}function _s(r,t,e){J(r,t,(function(){return r.bindFramebuffer(r.FRAMEBUFFER,e)})),J(r,t,(function(){return r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,null,0)}))}function Ba(r){var t=r.checkFramebufferStatus(r.FRAMEBUFFER);if(t!==r.FRAMEBUFFER_COMPLETE)throw new Error("Error binding framebuffer: "+zl(r,t))}function zl(r,t){switch(t){case r.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case r.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case r.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return"unknown error "+t}}function _r(r,t,e,n){var a=J(r,t,(function(){return e()}));if(a==null)throw new Error(n);return a}function Wl(r,t){var e=r.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,n=t+r.TEXTURE0;if(n<r.TEXTURE0||n>e)throw new Error("textureUnit must be in "+("[gl.TEXTURE0, gl.TEXTURE"+e+"]")+".")}function Ua(r,t){return t===void 0&&(t=2),re(r.slice(0,r.length-t))}function Ga(r){if(r.length===0)throw Error("Cannot get rows and columns of an empty shape array.");return[r.length>1?r[r.length-2]:1,r[r.length-1]]}function Hi(r){var t=[1,1,1];return r.length===0||r.length===1&&r[0]===1||(t=[Ua(r)].concat(Ga(r))),t}function Vl(r,t){var e;t===void 0&&(t=!1);var n=k().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(t&&(n*=2,(r=r.map((function(c,l){return l>=r.length-2?Vs(r[l]):r[l]}))).length===1&&(r=[2,r[0]])),r.length!==2){var a=Xr(r);r=a.newShape}var i=re(r);if(r.length<=1&&i<=n)return[1,i];if(r.length===2&&r[0]<=n&&r[1]<=n)return r;if(r.length===3&&r[0]*r[1]<=n&&r[2]<=n)return[r[0]*r[1],r[2]];if(r.length===3&&r[0]<=n&&r[1]*r[2]<=n)return[r[0],r[1]*r[2]];if(r.length===4&&r[0]*r[1]*r[2]<=n&&r[3]<=n)return[r[0]*r[1]*r[2],r[3]];if(r.length===4&&r[0]<=n&&r[1]*r[2]*r[3]<=n)return[r[0],r[1]*r[2]*r[3]];if(t){var o=Ua(r),s=2,u=2;return r.length&&(s=(e=Ga(r))[0],u=e[1]),Ki(i=o*(s/2)*(u/2)).map((function(c){return 2*c}))}return Ki(i)}function Ii(r){return r%2==0}function _a(r,t){if(Je(r=r.slice(-2),t=t.slice(-2))||!r.length||!t.length||r[0]===0||r[1]===0||t[0]===0||t[1]===0)return!0;if(r.length!==t.length){var e=r.slice(-1)[0],n=t.slice(-1)[0];if(e===n||Ii(e)&&Ii(n)&&(r[0]===1||t[0]===1))return!0}return r[1]===t[1]&&Ii(r[0])&&Ii(t[0])}function Xl(r){if(Oi==null){var t=wr(r);Oi=t.getParameter(t.MAX_TEXTURE_SIZE)}return Oi}function Kl(r){if(Li==null){var t=wr(r);Li=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,Li)}function jl(r){if(r===0)return 0;var t=wr(r);return jt(t,"EXT_disjoint_timer_query_webgl2")&&r===2?2:jt(t,"EXT_disjoint_timer_query")?1:0}function jt(r,t){return r.getExtension(t)!=null}function Ps(r){try{if(wr(r)!=null)return!0}catch{return!1}return!1}function Yl(r){if(r===0)return!1;var t=wr(r);if(r===1){if(!jt(t,"OES_texture_float"))return!1}else if(!jt(t,"EXT_color_buffer_float"))return!1;return Fs(t)}function Ql(r){if(r===0)return!1;var t=wr(r);if(r!==1){if(jt(t,"EXT_color_buffer_float"))return Fs(t);if(jt(t,"EXT_color_buffer_half_float")){var e=t.getExtension("EXT_color_buffer_half_float");return(function(n,a){var i=qs(n,a),o=n.createTexture();n.bindTexture(n.TEXTURE_2D,o),n.texImage2D(n.TEXTURE_2D,0,i.internalFormatHalfFloat,1,1,0,i.textureFormatFloat,i.textureTypeHalfFloat,null);var s=n.createFramebuffer();n.bindFramebuffer(n.FRAMEBUFFER,s),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,o,0);var u=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE;return n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(o),n.deleteFramebuffer(s),u})(t,e)}return!1}return!!jt(t,"OES_texture_float")&&!!jt(t,"WEBGL_color_buffer_float")&&Fs(t)}function Fs(r){var t=qs(r),e=r.createTexture();r.bindTexture(r.TEXTURE_2D,e),r.texImage2D(r.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);var n=r.createFramebuffer();r.bindFramebuffer(r.FRAMEBUFFER,n),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,e,0);var a=r.checkFramebufferStatus(r.FRAMEBUFFER)===r.FRAMEBUFFER_COMPLETE;return r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null),r.deleteTexture(e),r.deleteFramebuffer(n),a}function ql(r){return r===2&&wr(r).fenceSync!=null}var Vp=Object.freeze({callAndCheck:J,canBeRepresented:Tl,getWebGLErrorMessage:Il,getExtensionOrThrow:Ma,createVertexShader:Rl,createFragmentShader:Ml,createProgram:Bl,linkProgram:_l,validateProgram:Ui,createStaticVertexBuffer:Pl,createStaticIndexBuffer:Fl,getNumChannels:function(){return k().getNumber("WEBGL_VERSION")===2?1:4},createTexture:kl,validateTextureSize:Nl,createFramebuffer:Ol,bindVertexBufferToProgramAttribute:Bs,bindTextureUnit:Ll,unbindTextureUnit:function(r,t,e){Wl(r,e),J(r,t,(function(){return r.activeTexture(r.TEXTURE0+e)})),J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,null)}))},getProgramUniformLocationOrThrow:Ul,getProgramUniformLocation:Gl,bindTextureToProgramUniformSampler:Hl,bindCanvasToFramebuffer:function(r,t){J(r,t,(function(){return r.bindFramebuffer(r.FRAMEBUFFER,null)})),J(r,t,(function(){return r.viewport(0,0,r.canvas.width,r.canvas.height)})),J(r,t,(function(){return r.scissor(0,0,r.canvas.width,r.canvas.height)}))},bindColorTextureToFramebuffer:Gi,unbindColorTextureFromFramebuffer:_s,validateFramebuffer:Ba,getFramebufferErrorMessage:zl,getBatchDim:Ua,getRowsCols:Ga,getShapeAs3D:Hi,getTextureShapeFromLogicalShape:Vl,isReshapeFree:_a,getWebGLMaxTextureSize:Xl,resetMaxTextureSize:function(){Oi=null},resetMaxTexturesInShader:function(){Li=null},getMaxTexturesInShader:Kl,getWebGLDisjointQueryTimerVersion:jl,hasExtension:jt,isWebGLVersionEnabled:Ps,isCapableOfRenderingToFloatTexture:Yl,isDownloadFloatTextureEnabled:Ql,isWebGLFenceEnabled:ql}),se=k();function Zl(r){k().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(r+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function V(r,t){return B.tidy(r,t)}function Ot(r){Qs(r).forEach((function(t){return t.dispose()}))}function Xp(r){return B.keep(r)}function Qi(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];k().getBool("IS_TEST")||console.warn.apply(console,r)}function yr(r,t){var e=r;if(mt(r))return t==="string"?[]:[r.length];if(!Array.isArray(r))return[];for(var n=[];Array.isArray(e)||mt(e)&&t!=="string";)n.push(e.length),e=e[0];return Array.isArray(r)&&k().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&(function a(i,o,s){if(s=s||[],!Array.isArray(i)&&!mt(i))return void C(o.length===0,(function(){return"Element arr["+s.join("][")+"] is a primitive, but should be an array/TypedArray of "+o[0]+" elements"}));C(o.length>0,(function(){return"Element arr["+s.join("][")+"] should be a primitive, but is an array of "+i.length+" elements"})),C(i.length===o[0],(function(){return"Element arr["+s.join("][")+"] should have "+o[0]+" elements, but has "+i.length+" elements"}));for(var u=o.slice(1),c=0;c<i.length;++c)a(i[c],u,s.concat(c))})(r,n,[]),n}function Ic(r,t,e,n){if(r!=null&&(r!=="numeric"&&r!==t||r==="numeric"&&t==="string"))throw new Error("Argument '"+e+"' passed to '"+n+"' must be "+r+" tensor, but got "+t+" tensor")}function E(r,t,e,n){if(n===void 0&&(n="numeric"),r instanceof _e)return Ic(n,r.dtype,t,e),r;var a=Qn(r);if(a!=="string"&&["bool","int32","float32"].indexOf(n)>=0&&(a=n),Ic(n,a,t,e),r==null||!mt(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string"){var i=r==null?"null":r.constructor.name;throw new Error("Argument '"+t+"' passed to '"+e+"' must be a Tensor or TensorLike, but got '"+i+"'")}var o=yr(r,a);mt(r)||Array.isArray(r)||(r=[r]);var s=a!=="string"?Ks(r,a,k().getBool("DEBUG")):Br(r,[],!0);return B.makeTensor(s,o,a)}function qi(r,t,e,n){if(n===void 0&&(n="numeric"),!Array.isArray(r))throw new Error("Argument "+t+" passed to "+e+" must be a `Tensor[]` or `TensorLike[]`");return r.map((function(a,i){return E(a,t+"["+i+"]",e)}),n)}function Zs(r,t){for(var e=0;e<r.length;++e)if(r[r.length-e-1]!==t-1-e)return!1;return!0}function Jl(r,t,e){for(var n=r.length+t.length,a=[],i=0,o=0,s=0;s<n;s++)e.indexOf(s)===-1?a.push(r[i++]):a.push(t[o++]);return a}function vt(r,t){for(var e=[],n=r.length,a=0;a<n;a++)t.indexOf(a)===-1&&e.push(r[a]);return[e,t.map((function(i){return r[i]}))]}function Rt(r,t){return Jl(r,t.map((function(e){return 1})),t)}function kt(r,t,e){C(Zs(t,e),(function(){return r+" supports only inner-most axes for now. Got axes "+t+" and rank-"+e+" input."}))}function cr(r,t){if(Zs(r,t))return null;for(var e=[],n=0;n<t;++n)r.indexOf(n)===-1&&e.push(n);return r.forEach((function(a){return e.push(a)})),e}function so(r){return r.map((function(t,e){return[e,t]})).sort((function(t,e){return t[1]-e[1]})).map((function(t){return t[0]}))}function lr(r,t){for(var e=[],n=t-r;n<t;++n)e.push(n);return e}function $l(r,t){var e=r[0].length;r.forEach((function(a,i){C(a.length===e,(function(){return"Error in concat"+e+"D: rank of tensors["+i+"] must be the same as the rank of the rest ("+e+")"}))})),C(t>=0&&t<e,(function(){return"Error in concat"+e+"D: axis must be between 0 and "+(e-1)+"."}));var n=r[0];r.forEach((function(a,i){for(var o=0;o<e;o++)C(o===t||a[o]===n[o],(function(){return"Error in concat"+e+"D: Shape of tensors["+i+"] ("+a+") does not match the shape of the rest ("+n+") along the non-concatenated axis "+i+"."}))}))}function gn(r,t){for(var e=r[0].slice(),n=1;n<r.length;n++)e[t]+=r[n][t];return e}function R(r){var t=Object.keys(r);if(t.length!==1)throw new Error("Please provide an object with a single key (operation name) mapping to a function. Got an object with "+t.length+" keys.");var e=t[0],n=r[e];e.endsWith("_")&&(e=e.substring(0,e.length-1));var a=function(){for(var i=[],o=0;o<arguments.length;o++)i[o]=arguments[o];B.startScope(e);try{var s=n.apply(void 0,i);return s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),B.endScope(s),s}catch(u){throw B.endScope(null),u}};return Object.defineProperty(a,"name",{value:e,configurable:!0}),a}se.registerFlag("HAS_WEBGL",(function(){return se.getNumber("WEBGL_VERSION")>0})),se.registerFlag("WEBGL_VERSION",(function(){return Ps(2)?2:Ps(1)?1:0})),se.registerFlag("WEBGL_BUFFER_SUPPORTED",(function(){return se.get("WEBGL_VERSION")===2})),se.registerFlag("WEBGL_CPU_FORWARD",(function(){return!0})),se.registerFlag("WEBGL_FORCE_F16_TEXTURES",(function(){return!1})),se.registerFlag("WEBGL_PACK",(function(){return se.getBool("HAS_WEBGL")})),se.registerFlag("WEBGL_PACK_NORMALIZATION",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_CLIP",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_DEPTHWISECONV",(function(){return!1})),se.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_PACK_REDUCE",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_LAZILY_UNPACK",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_CONV_IM2COL",(function(){return se.getBool("WEBGL_PACK")})),se.registerFlag("WEBGL_MAX_TEXTURE_SIZE",(function(){return Xl(se.getNumber("WEBGL_VERSION"))})),se.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",(function(){return Kl(se.getNumber("WEBGL_VERSION"))})),se.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",(function(){var r=se.getNumber("WEBGL_VERSION");return r===0?0:jl(r)})),se.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",(function(){return se.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&(r=navigator.userAgent||navigator.vendor||window.opera,!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(r)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(r.substr(0,4))));var r})),se.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",(function(){return Yl(se.getNumber("WEBGL_VERSION"))})),se.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",(function(){return!se.getBool("WEBGL_FORCE_F16_TEXTURES")&&se.getBool("WEBGL_RENDER_FLOAT32_CAPABLE")})),se.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",(function(){return Ql(se.getNumber("WEBGL_VERSION"))})),se.registerFlag("WEBGL_FENCE_API_ENABLED",(function(){return ql(se.getNumber("WEBGL_VERSION"))})),se.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",(function(){return se.getBool("WEBGL_RENDER_FLOAT32_ENABLED")?4:0})),El=Zl;var pt=R({complex_:function(r,t){var e=E(r,"real","complex"),n=E(t,"imag","complex");return De(e.shape,n.shape,"real and imag shapes, "+e.shape+" and "+n.shape+", must match in call to tf.complex()."),B.runKernelFunc((function(a){return a.complex(e,n)}),{$real:e,$imag:n})}}),Jt=R({real_:function(r){var t=E(r,"input","real");return B.runKernelFunc((function(e){return e.real(t)}),{$input:t})}}),gr=R({imag_:function(r){var t=E(r,"input","imag");return B.runKernelFunc((function(e){return e.imag(t)}),{$input:t})}});function ut(r,t,e){return Qr(r,t,yr(r,e),e)}function Qr(r,t,e,n){if(n==null&&(n=Qn(r)),n==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(!mt(r)&&!Array.isArray(r)&&typeof r!="number"&&typeof r!="boolean"&&typeof r!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){Ys(t);var a=re(t),i=re(e);C(a===i,(function(){return"Based on the provided shape, ["+t+"], the tensor should have "+a+" values but has "+i}));for(var o=0;o<e.length;++o){var s=e[o],u=o!==e.length-1||s!==re(t.slice(o));C(e[o]===t[o]||!u,(function(){return"Error creating a new Tensor. Inferred shape ("+e+") does not match the provided shape ("+t+"). "}))}}return mt(r)||Array.isArray(r)||(r=[r]),t=t||e,r=n!=="string"?Ks(r,n,k().getBool("DEBUG")):Br(r,[],!0),B.makeTensor(r,t,n)}function Y(r,t){if((mt(r)&&t!=="string"||Array.isArray(r))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&mt(r)&&!(r instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Qr(r,[],[],t)}function Fe(r,t){wn(r);var e=yr(r,t);if(e.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Qr(r,null,e,t)}function xr(r,t,e){if(wn(r),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");var n=yr(r,e);if(n.length!==2&&n.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Qr(r,t,n,e)}function uo(r,t,e){if(wn(r),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");var n=yr(r,e);if(n.length!==3&&n.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Qr(r,t,n,e)}function at(r,t,e){if(wn(r),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");var n=yr(r,e);if(n.length!==4&&n.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Qr(r,t,n,e)}function Kp(r,t,e){if(wn(r),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");var n=yr(r,e);if(n.length!==5&&n.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Qr(r,t,n,e)}function jp(r,t,e){if(wn(r),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");var n=yr(r,e);if(n.length!==6&&n.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(n.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return Qr(r,t=t||n,n,e)}function Yp(r,t,e,n){return t===void 0&&(t=!0),B.makeVariable(r,t,e,n)}function Zn(r,t){if(t===void 0&&(t="float32"),t==="complex64"){var e=Zn(r,"float32"),n=Ne(r,"float32");return pt(e,n)}var a=js(re(r),t);return B.makeTensor(a,r,t)}function Ne(r,t){if(t===void 0&&(t="float32"),t==="complex64"){var e=Ne(r,"float32"),n=Ne(r,"float32");return pt(e,n)}var a=qn(re(r),t);return B.makeTensor(a,r,t)}function Qt(r,t,e){return B.runKernelFunc((function(n){return n.fill(r,t,e)}),{})}function Qp(r,t,e){if(e<=0)throw new Error("The number of values should be positive.");return B.runKernelFunc((function(n){return n.linspace(r,t,e)}),{})}function Zi(r,t,e,n){if(e===void 0&&(e=1),n===void 0&&(n="float32"),e===0)throw new Error("Cannot have a step of zero");if(r===t||r<t&&e<0||t<r&&e>1)return Ne([0],n);var a=qn(Math.abs(Math.ceil((t-r)/e)),n);t<r&&e===1&&(e=-1),a[0]=r;for(var i=1;i<a.length;i++)a[i]=a[i-1]+e;return Fe(a,n)}var ef=R({onesLike_:function(r){var t=E(r,"x","onesLike");if(t.dtype==="complex64"){var e=ef(Jt(t)),n=Ae(gr(t));return pt(e,n)}return B.runKernelFunc((function(a){return a.onesLike(t)}),{$x:t},(function(a,i){return{$x:function(){return Ae(a)}}}))}}),Ae=R({zerosLike_:function(r){var t=E(r,"x","zerosLike");return B.runKernelFunc((function(e){return e.zerosLike(t)}),{$x:t},(function(e,n){return{$x:function(){return Ae(e)}}}))}}),Ge=R({concat_:function(r,t){t===void 0&&(t=0),C(r.length>=1,(function(){return"Pass at least one tensor to concat"}));var e=qi(r,"tensors","concat");e[0].dtype==="complex64"&&e.forEach((function(s){if(s.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype `+s.dtype+". ")})),t=et(t,e[0].shape)[0];var n=gn(e.map((function(s){return s.shape})),t);if(re(n)===0)return ut([],n);if((e=e.filter((function(s){return s.size>0}))).length===1)return e[0];var a=e.map((function(s){return s.shape}));$l(a,t);var i=e,o={axis:t};return B.runKernelFunc((function(s){return s.concat(e,t)}),i,(function(s){var u=a.map((function(c){return c[t]}));return Js(s,u,t).map((function(c){return function(){return c}}))}),"Concat",o)}}),qp=R({concat1d_:function(r){return Ge(r,0)}}),Zp=R({concat2d_:function(r,t){return Ge(r,t)}}),Jp=R({concat3d_:function(r,t){return Ge(r,t)}}),$p=R({concat4d_:function(r,t){return Ge(r,t)}}),Js=R({split_:function(r,t,e){e===void 0&&(e=0);var n,a=E(r,"x","split");return e=et(e,a.shape)[0],typeof t=="number"?(C(a.shape[e]%t==0,(function(){return"Number of splits must evenly divide the axis."})),n=new Array(t).fill(a.shape[e]/t)):(C(a.shape[e]===t.reduce((function(i,o){return i+o})),(function(){return"The sum of sizes must match the size of the axis dimension."})),n=t),B.runKernelFunc((function(i){return i.split(a,n,e)}),{$x:a},(function(i){return{$x:function(){return Ge(i,e)}}}))}});function bn(r,t){return r(t={exports:{}},t.exports),t.exports}var ev=bn((function(r){(function(t,e,n){function a(s){var u,c=this,l=(u=4022871197,function(f){f=f.toString();for(var h=0;h<f.length;h++){var d=.02519603282416938*(u+=f.charCodeAt(h));d-=u=d>>>0,u=(d*=u)>>>0,u+=4294967296*(d-=u)}return 23283064365386963e-26*(u>>>0)});c.next=function(){var f=2091639*c.s0+23283064365386963e-26*c.c;return c.s0=c.s1,c.s1=c.s2,c.s2=f-(c.c=0|f)},c.c=1,c.s0=l(" "),c.s1=l(" "),c.s2=l(" "),c.s0-=l(s),c.s0<0&&(c.s0+=1),c.s1-=l(s),c.s1<0&&(c.s1+=1),c.s2-=l(s),c.s2<0&&(c.s2+=1),l=null}function i(s,u){return u.c=s.c,u.s0=s.s0,u.s1=s.s1,u.s2=s.s2,u}function o(s,u){var c=new a(s),l=u&&u.state,f=c.next;return f.int32=function(){return 4294967296*c.next()|0},f.double=function(){return f()+11102230246251565e-32*(2097152*f()|0)},f.quick=f,l&&(typeof l=="object"&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.alea=o})(0,r,!1)})),tv=bn((function(r){(function(t,e,n){function a(s){var u=this,c="";u.x=0,u.y=0,u.z=0,u.w=0,u.next=function(){var f=u.x^u.x<<11;return u.x=u.y,u.y=u.z,u.z=u.w,u.w^=u.w>>>19^f^f>>>8},s===(0|s)?u.x=s:c+=s;for(var l=0;l<c.length+64;l++)u.x^=0|c.charCodeAt(l),u.next()}function i(s,u){return u.x=s.x,u.y=s.y,u.z=s.z,u.w=s.w,u}function o(s,u){var c=new a(s),l=u&&u.state,f=function(){return(c.next()>>>0)/4294967296};return f.double=function(){do var h=((c.next()>>>11)+(c.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=c.next,f.quick=f,l&&(typeof l=="object"&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.xor128=o})(0,r,!1)})),rv=bn((function(r){(function(t,e,n){function a(s){var u=this,c="";u.next=function(){var f=u.x^u.x>>>2;return u.x=u.y,u.y=u.z,u.z=u.w,u.w=u.v,(u.d=u.d+362437|0)+(u.v=u.v^u.v<<4^f^f<<1)|0},u.x=0,u.y=0,u.z=0,u.w=0,u.v=0,s===(0|s)?u.x=s:c+=s;for(var l=0;l<c.length+64;l++)u.x^=0|c.charCodeAt(l),l==c.length&&(u.d=u.x<<10^u.x>>>4),u.next()}function i(s,u){return u.x=s.x,u.y=s.y,u.z=s.z,u.w=s.w,u.v=s.v,u.d=s.d,u}function o(s,u){var c=new a(s),l=u&&u.state,f=function(){return(c.next()>>>0)/4294967296};return f.double=function(){do var h=((c.next()>>>11)+(c.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=c.next,f.quick=f,l&&(typeof l=="object"&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.xorwow=o})(0,r,!1)})),nv=bn((function(r){(function(t,e,n){function a(s){var u=this;u.next=function(){var c,l,f=u.x,h=u.i;return c=f[h],l=(c^=c>>>7)^c<<24,l^=(c=f[h+1&7])^c>>>10,l^=(c=f[h+3&7])^c>>>3,l^=(c=f[h+4&7])^c<<7,c=f[h+7&7],l^=(c^=c<<13)^c<<9,f[h]=l,u.i=h+1&7,l},(function(c,l){var f,h=[];if(l===(0|l))h[0]=l;else for(l=""+l,f=0;f<l.length;++f)h[7&f]=h[7&f]<<15^l.charCodeAt(f)+h[f+1&7]<<13;for(;h.length<8;)h.push(0);for(f=0;f<8&&h[f]===0;++f);for(f==8?h[7]=-1:h[f],c.x=h,c.i=0,f=256;f>0;--f)c.next()})(u,s)}function i(s,u){return u.x=s.x.slice(),u.i=s.i,u}function o(s,u){s==null&&(s=+new Date);var c=new a(s),l=u&&u.state,f=function(){return(c.next()>>>0)/4294967296};return f.double=function(){do var h=((c.next()>>>11)+(c.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=c.next,f.quick=f,l&&(l.x&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.xorshift7=o})(0,r,!1)})),av=bn((function(r){(function(t,e,n){function a(s){var u=this;u.next=function(){var c,l,f=u.w,h=u.X,d=u.i;return u.w=f=f+1640531527|0,l=h[d+34&127],c=h[d=d+1&127],l^=l<<13,c^=c<<17,l^=l>>>15,c^=c>>>12,l=h[d]=l^c,u.i=d,l+(f^f>>>16)|0},(function(c,l){var f,h,d,p,v,m=[],g=128;for(l===(0|l)?(h=l,l=null):(l+="\0",h=0,g=Math.max(g,l.length)),d=0,p=-32;p<g;++p)l&&(h^=l.charCodeAt((p+32)%l.length)),p===0&&(v=h),h^=h<<10,h^=h>>>15,h^=h<<4,h^=h>>>13,p>=0&&(v=v+1640531527|0,d=(f=m[127&p]^=h+v)==0?d+1:0);for(d>=128&&(m[127&(l&&l.length||0)]=-1),d=127,p=512;p>0;--p)h=m[d+34&127],f=m[d=d+1&127],h^=h<<13,f^=f<<17,h^=h>>>15,f^=f>>>12,m[d]=h^f;c.w=v,c.X=m,c.i=d})(u,s)}function i(s,u){return u.i=s.i,u.w=s.w,u.X=s.X.slice(),u}function o(s,u){s==null&&(s=+new Date);var c=new a(s),l=u&&u.state,f=function(){return(c.next()>>>0)/4294967296};return f.double=function(){do var h=((c.next()>>>11)+(c.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=c.next,f.quick=f,l&&(l.X&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.xor4096=o})(0,r,!1)})),iv=bn((function(r){(function(t,e,n){function a(s){var u=this,c="";u.next=function(){var f=u.b,h=u.c,d=u.d,p=u.a;return f=f<<25^f>>>7^h,h=h-d|0,d=d<<24^d>>>8^p,p=p-f|0,u.b=f=f<<20^f>>>12^h,u.c=h=h-d|0,u.d=d<<16^h>>>16^p,u.a=p-f|0},u.a=0,u.b=0,u.c=-1640531527,u.d=1367130551,s===Math.floor(s)?(u.a=s/4294967296|0,u.b=0|s):c+=s;for(var l=0;l<c.length+20;l++)u.b^=0|c.charCodeAt(l),u.next()}function i(s,u){return u.a=s.a,u.b=s.b,u.c=s.c,u.d=s.d,u}function o(s,u){var c=new a(s),l=u&&u.state,f=function(){return(c.next()>>>0)/4294967296};return f.double=function(){do var h=((c.next()>>>11)+(c.next()>>>0)/4294967296)/2097152;while(h===0);return h},f.int32=c.next,f.quick=f,l&&(typeof l=="object"&&i(l,c),f.state=function(){return i(c,{})}),f}e&&e.exports?e.exports=o:n&&n.amd?n((function(){return o})):this.tychei=o})(0,r,!1)})),fn=bn((function(r){(function(t,e){var n,a=this,i=256,o=6,s="random",u=e.pow(i,o),c=e.pow(2,52),l=2*c,f=i-1;function h(g,x,w){var y=[],b=v((function T(S,D){var _,M=[],L=typeof S;if(D&&L=="object")for(_ in S)try{M.push(T(S[_],D-1))}catch{}return M.length?M:L=="string"?S:S+"\0"})((x=x==1?{entropy:!0}:x||{}).entropy?[g,m(t)]:g??(function(){try{var T;return n&&(T=n.randomBytes)?T=T(i):(T=new Uint8Array(i),(a.crypto||a.msCrypto).getRandomValues(T)),m(T)}catch{var S=a.navigator,D=S&&S.plugins;return[+new Date,a,D,a.screen,m(t)]}})(),3),y),A=new d(y),I=function(){for(var T=A.g(o),S=u,D=0;T<c;)T=(T+D)*i,S*=i,D=A.g(1);for(;T>=l;)T/=2,S/=2,D>>>=1;return(T+D)/S};return I.int32=function(){return 0|A.g(4)},I.quick=function(){return A.g(4)/4294967296},I.double=I,v(m(A.S),t),(x.pass||w||function(T,S,D,_){return _&&(_.S&&p(_,A),T.state=function(){return p(A,{})}),D?(e[s]=T,S):T})(I,b,"global"in x?x.global:this==e,x.state)}function d(g){var x,w=g.length,y=this,b=0,A=y.i=y.j=0,I=y.S=[];for(w||(g=[w++]);b<i;)I[b]=b++;for(b=0;b<i;b++)I[b]=I[A=f&A+g[b%w]+(x=I[b])],I[A]=x;(y.g=function(T){for(var S,D=0,_=y.i,M=y.j,L=y.S;T--;)S=L[_=f&_+1],D=D*i+L[f&(L[_]=L[M=f&M+S])+(L[M]=S)];return y.i=_,y.j=M,D})(i)}function p(g,x){return x.i=g.i,x.j=g.j,x.S=g.S.slice(),x}function v(g,x){for(var w,y=g+"",b=0;b<y.length;)x[f&b]=f&(w^=19*x[f&b])+y.charCodeAt(b++);return m(x)}function m(g){return String.fromCharCode.apply(0,g)}if(e["seed"+s]=h,v(e.random(),t),r.exports){r.exports=h;try{n=wc()}catch{}}})([],Math)}));fn.alea=ev,fn.xor128=tv,fn.xorwow=rv,fn.xorshift7=nv,fn.xor4096=av,fn.tychei=iv;var co=fn.alea,$s=(function(){function r(t,e,n,a,i){this.mean=t,this.stdDev=e,this.dtype=n,this.nextVal=NaN,this.truncated=a,this.truncated&&(this.upper=this.mean+2*this.stdDev,this.lower=this.mean-2*this.stdDev);var o=i||Math.random();this.random=co(o.toString())}return r.prototype.nextValue=function(){if(!isNaN(this.nextVal)){var t=this.nextVal;return this.nextVal=NaN,t}for(var e,n,a=!1;!a;){var i=void 0,o=void 0,s=void 0;do s=(i=2*this.random()-1)*i+(o=2*this.random()-1)*o;while(s>=1||s===0);var u=Math.sqrt(-2*Math.log(s)/s);e=this.mean+this.stdDev*i*u,n=this.mean+this.stdDev*o*u,this.truncated&&!this.isValidTruncated(e)||(a=!0)}return this.truncated&&!this.isValidTruncated(n)||(this.nextVal=this.convertValue(n)),this.convertValue(e)},r.prototype.convertValue=function(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)},r.prototype.isValidTruncated=function(t){return t<=this.upper&&t>=this.lower},r})(),ov=(function(){function r(t,e,n,a){this.alpha=t,this.beta=1/e,this.dtype=n;var i=a||Math.random();this.randu=co(i.toString()),this.randn=new $s(0,1,n,!1,this.randu()),this.d=t<1?t+2/3:t-1/3,this.c=1/Math.sqrt(9*this.d)}return r.prototype.nextValue=function(){for(var t,e,n,a,i,o;;){do a=this.randn.nextValue(),o=1+this.c*a;while(o<=0);if(o*=o*o,e=1-.331*(t=a*a)*t,n=.5*t+this.d*(1-o+Math.log(o)),(i=this.randu())<e||Math.log(i)<n)break}return o=1/this.beta*this.d*o,this.alpha<1&&(o*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(o)},r.prototype.convertValue=function(t){return this.dtype==="float32"?t:Math.round(t)},r})(),sv=(function(){function r(t,e,n,a){var i=this;if(t===void 0&&(t=0),e===void 0&&(e=1),this.canReturnFloat=function(){return i.dtype==null||i.dtype==="float32"},this.min=t,this.range=e-t,this.dtype=n,a==null&&(a=Math.random()),typeof a=="number"&&(a=a.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error("The difference between "+t+" - "+e+" <= 1 and dtype is not float");this.random=co(a)}return r.prototype.convertValue=function(t){return this.canReturnFloat()?t:Math.round(t)},r.prototype.nextValue=function(){return this.convertValue(this.min+this.range*this.random())},r})();function le(r,t,e){return t===void 0&&(t="float32"),t=t||"float32",Ys(r),new Oa(r,t,e)}function uv(r,t){t===void 0&&(t=!1),console.log(r.toString(t))}var tf=R({batchToSpaceND_:function(r,t,e){var n=E(r,"x","batchToSpaceND"),a=t.reduce((function(i,o){return i*o}));return C(n.rank>=1+t.length,(function(){return"input rank is "+n.rank+" but should be > than blockShape.length "+t.length})),C(e.length===t.length,(function(){return"crops.length is "+e.length+" but should be equal to blockShape.length  "+t.length})),C(n.shape[0]%a==0,(function(){return"input tensor batch is "+n.shape[0]+" but is not divisible by the product of the elements of blockShape "+t.join(" * ")+" === "+a})),B.runKernelFunc((function(i){return i.batchToSpaceND(n,t,e)}),{$x:n},(function(i){return{$x:function(){return i.spaceToBatchND(t,e)}}}))}}),cv=R({broadcastTo_:function(r,t){var e=E(r,"broadcastTo","x"),n=e.shape;if(t.some((function(u){return!(u>0)||u%1!=0})))throw new Error("broadcastTo(): Invalid broadcast shape ["+t+"].");if(t.length<e.rank)throw new Error("broadcastTo(): shape.length="+t.length+" < input.rank="+e.rank+".");if(t.length>e.rank){for(var a=e.shape.slice();a.length<t.length;)a.unshift(1);e=e.reshape(a)}for(var i=Array.from(t),o=t.length-1;o>=0;o--)if(e.shape[o]===t[o])i[o]=1;else if(e.shape[o]!==1)throw new Error("broadcastTo(): ["+n+"] cannot be broadcast to ["+t+"].");var s=i.map((function(u,c){return u>1?c:-1})).filter((function(u){return u>=0}));return s.length===0?e.clone():B.runKernelFunc((function(u){return u.tile(e,i)}),{input:e},(function(u){return{input:function(){return u.sum(s,!0)}}}))}}),lv=R({cast_:function(r,t){var e=E(r,"x","cast");if(!vl(t))throw new Error("Failed to cast to unknown dtype "+t);if(t==="string"&&e.dtype!=="string"||t!=="string"&&e.dtype==="string")throw new Error("Only strings can be casted to strings");var n={dtype:t};return B.runKernelFunc((function(a){return a.cast(e,t)}),{x:e},(function(a){return{x:function(){return a.clone()}}}),"Cast",n)}}),fv=R({clone_:function(r){var t=E(r,"x","clone",null);return B.runKernelFunc((function(){return B.makeTensorFromDataId(t.dataId,t.shape,t.dtype)}),{$x:t},(function(e){return{$x:function(){return e.toFloat()}}}))}}),hv=R({cumsum_:function(r,t,e,n){t===void 0&&(t=0),e===void 0&&(e=!1),n===void 0&&(n=!1);var a=E(r,"x","cumsum"),i=cr([t|=0],a.rank),o=a;i!=null&&(o=a.transpose(i));var s=lr(1,a.rank)[0],u=B.runKernelFunc((function(c){return c.cumsum(o,s,e,n)}),{permutedX:o},(function(c){return{permutedX:function(){return c.cumsum(t,e,!n)}}}));return i!=null&&(u=u.transpose(i)),u}}),dv=R({depthToSpace_:function(r,t,e){e===void 0&&(e="NHWC");var n=E(r,"x","depthToSpace"),a=e==="NHWC"?n.shape[1]:n.shape[2],i=e==="NHWC"?n.shape[2]:n.shape[3],o=e==="NHWC"?n.shape[3]:n.shape[1];return C(a*t>=0,(function(){return`Negative dimension size caused by overflow when multiplying
      `+a+" and "+t+`  for depthToSpace with input shape
      `+n.shape})),C(i*t>=0,(function(){return`Negative dimension size caused by overflow when multiplying
      `+i+" and "+t+` for depthToSpace with input shape
          `+n.shape})),C(o%(t*t)==0,(function(){return"Dimension size must be evenly divisible by "+t*t+" but is "+o+" for depthToSpace with input shape "+n.shape})),B.runKernelFunc((function(s){return s.depthToSpace(n,t,e)}),{$x:n})}}),Et=R({expandDims_:function(r,t){t===void 0&&(t=0);var e=E(r,"x","expandDims",null);C(t<=e.rank,(function(){return"Axis must be <= rank of the tensor"}));var n=e.shape.slice();return t<0&&(C(-(e.rank+1)<=t,(function(){return"Axis must be in the interval ["+-(e.rank+1)+", "+e.rank+"]"})),t=e.rank+t+1),n.splice(t,0,1),Bt(e,n)}}),rf=R({eye_:function(r,t,e,n){n===void 0&&(n="float32"),t==null&&(t=r);for(var a=le([r,t],n),i=r<=t?r:t,o=0;o<i;++o)a.set(1,o,o);var s=a.toTensor().as2D(r,t);if(e==null)return s;if(e.length===1)return vn(Et(s,0),[e[0],1,1]);if(e.length===2)return vn(Et(Et(s,0),0),[e[0],e[1],1,1]);if(e.length===3)return vn(Et(Et(Et(s,0),0),0),[e[0],e[1],e[2],1,1]);throw new Error("eye() currently supports only 1D and 2D batchShapes, but received "+e.length+"D.")}}),pv=R({multinomial_:function(r,t,e,n){n===void 0&&(n=!1);var a=E(r,"logits","multinomial"),i=a.size,o=a.rank;if(i<2)throw new Error("Error in multinomial: you need at least 2 outcomes, but got "+i+".");if(o>2)throw new Error("Rank of probabilities must be 1 or 2, but is "+o);e=e||Math.random();var s=o===1?a.as2D(1,-1):a,u=B.runKernelFunc((function(c){return c.multinomial(s,n,t,e)}),{logits2D:s});return o===1?u.as1D():u}}),ks=R({oneHot_:function(r,t,e,n){if(e===void 0&&(e=1),n===void 0&&(n=0),t<2)throw new Error("Error in oneHot: depth must be >=2, but it is "+t);var a=E(r,"indices","oneHot","int32"),i=a.shape.concat([t]);return a=a.flatten(),B.runKernelFunc((function(o){return o.oneHot(a,t,e,n)}),{$indices:a},(function(o){return{$indices:function(){return Ne(a.shape,"float32")}}})).reshape(i)}}),Pr=R({pad_:function(r,t,e){e===void 0&&(e=0);var n=E(r,"x","pad");if(n.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");var a={paddings:t,constantValue:e};return B.runKernelFunc((function(i){return i.pad(n,t,e)}),{x:n},(function(i){var o=t.map((function(s){return s[0]}));return{x:function(){return i.slice(o,n.shape)}}}),"PadV2",a)}}),vv=R({pad1d_:function(r,t,e){return e===void 0&&(e=0),C(t.length===2,(function(){return"Invalid number of paddings. Must be length of 2."})),Pr(r,[t],e)}}),mv=R({pad2d_:function(r,t,e){return e===void 0&&(e=0),C(t.length===2&&t[0].length===2&&t[1].length===2,(function(){return"Invalid number of paddings. Must be length of 2 each."})),Pr(r,t,e)}}),gv=R({pad3d_:function(r,t,e){return e===void 0&&(e=0),C(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,(function(){return"Invalid number of paddings. Must be length of 2 each."})),Pr(r,t,e)}}),xv=R({pad4d_:function(r,t,e){return e===void 0&&(e=0),C(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,(function(){return"Invalid number of paddings. Must be length of 2 each."})),Pr(r,t,e)}}),yv=R({rand_:function(r,t,e){var n=re(r),a=null;if(e==null||e==="float32")a=new Float32Array(n);else if(e==="int32")a=new Int32Array(n);else{if(e!=="bool")throw new Error("Unknown data type "+e);a=new Uint8Array(n)}for(var i=0;i<n;i++)a[i]=t();return B.makeTensor(a,r,e)}}),wv=R({randomNormal_:function(r,t,e,n,a){if(t===void 0&&(t=0),e===void 0&&(e=1),n!=null&&n==="bool")throw new Error("Unsupported data type "+n);for(var i=new $s(t,e,n,!1,a),o=le(r,n),s=0;s<o.values.length;s++)o.values[s]=i.nextValue();return o.toTensor()}}),bv=R({randomGamma_:function(r,t,e,n,a){if(e===void 0&&(e=1),n===void 0&&(n="float32"),e==null&&(e=1),n==null&&(n="float32"),n!=="float32"&&n!=="int32")throw new Error("Unsupported data type "+n);for(var i=new ov(t,e,n,a),o=le(r,n),s=0;s<o.values.length;s++)o.values[s]=i.nextValue();return o.toTensor()}}),nf=R({randomUniform_:function(r,t,e,n,a){t===void 0&&(t=0),e===void 0&&(e=1),n===void 0&&(n="float32");for(var i=le(r,n),o=new sv(t,e,null,a),s=0;s<i.values.length;s++)i.values[s]=o.nextValue();return i.toTensor()}}),Bt=R({reshape_:function(r,t){var e=E(r,"x","reshape",null);t=dl(t,e.size),C(e.size===re(t),(function(){return"new shape and old shape must have the same number of elements."}));var n={shape:t};return B.runKernelFunc((function(a){return a.reshape(e,t)}),{x:e},(function(a){return{x:function(){return a.reshape(e.shape)}}}),"Reshape",n)}}),af=R({spaceToBatchND_:function(r,t,e){var n=E(r,"x","spaceToBatchND");return C(n.rank>=1+t.length,(function(){return"input rank "+n.rank+" should be > than [blockShape] "+t.length})),C(e.length===t.length,(function(){return"paddings.shape[0] "+e.length+" must be equal to [blockShape] "+t.length})),C(n.shape.reduce((function(a,i,o){return o>0&&o<=t.length?a&&(i+e[o-1][0]+e[o-1][1])%t[o-1]==0:a}),!0),(function(){return"input spatial dimensions "+n.shape.slice(1)+" with paddings "+e.toString()+" must be divisible by blockShapes "+t.toString()})),B.runKernelFunc((function(a){return a.spaceToBatchND(n,t,e)}),{$x:n},(function(a){return{$x:function(){return a.batchToSpaceND(t,e)}}}))}}),of=R({squeeze_:function(r,t){var e=E(r,"x","squeeze");return Bt(e,Xr(e.shape,t).newShape)}}),gt=R({stack_:function(r,t){t===void 0&&(t=0);var e=qi(r,"tensors","stack");if(C(e.length>=1,(function(){return"Pass at least one tensor to tf.stack"})),e.length===1)return e[0].expandDims(t);var n=e[0].rank,a=e[0].shape,i=e[0].dtype;C(t<=n,(function(){return"Axis must be <= rank of the tensor"})),e.forEach((function(s){De(a,s.shape,"All tensors passed to stack must have matching shapes")})),e.forEach((function(s){C(i===s.dtype,(function(){return"All tensors passed to stack must have matching dtypes"}))}));var o=e.map((function(s){return s.expandDims(t)}));return Ge(o,t)}}),vn=R({tile_:function(r,t){var e=E(r,"x","tile",null);C(e.rank===t.length,(function(){return"Error in transpose: rank of input "+e.rank+" must match length of reps "+t+"."}));var n=[e],a={reps:t};return B.runKernelFunc((function(i,o){var s=i.tile(e,t);return o([e]),s}),{x:e},(function(i,o){var s=o[0];return{x:function(){var u=Ae(s);if(s.rank===1)for(var c=0;c<t[0];++c)u=u.add(i.slice([c*s.shape[0]],[s.shape[0]]));else if(s.rank===2)for(c=0;c<t[0];++c)for(var l=0;l<t[1];++l)u=u.add(i.slice([c*s.shape[0],l*s.shape[1]],[s.shape[0],s.shape[1]]));else if(s.rank===3)for(c=0;c<t[0];++c)for(l=0;l<t[1];++l)for(var f=0;f<t[2];++f)u=u.add(i.slice([c*s.shape[0],l*s.shape[1],f*s.shape[2]],[s.shape[0],s.shape[1],s.shape[2]]));else{if(s.rank!==4)throw new Error("Gradient for tile operation is not implemented for rank-"+s.rank+" tensors yet.");for(c=0;c<t[0];++c)for(l=0;l<t[1];++l)for(f=0;f<t[2];++f)for(var h=0;h<t[3];++h)u=u.add(i.slice([c*s.shape[0],l*s.shape[1],f*s.shape[2],h*s.shape[3]],[s.shape[0],s.shape[1],s.shape[2],s.shape[3]]))}return u}}}),"Tile",a,n)}}),Av=R({truncatedNormal_:function(r,t,e,n,a){if(t===void 0&&(t=0),e===void 0&&(e=1),n!=null&&n==="bool")throw new Error("Unsupported data type "+n);for(var i=new $s(t,e,n,!0,a),o=le(r,n),s=0;s<o.values.length;s++)o.values[s]=i.nextValue();return o.toTensor()}}),Me=R({unstack_:function(r,t){t===void 0&&(t=0),t=t||0;var e=E(r,"x","unstack");C(t>=-e.shape.length&&t<e.shape.length,(function(){return"Axis = "+t+" is not in [-"+e.shape.length+", "+e.shape.length+")"})),t<0&&(t+=e.shape.length);var n={axis:t};return B.runKernelFunc((function(a){return a.unstack(e,t)}),{x:e},(function(a){return{x:function(){return gt(a,t)}}}),"Unpack",n)}}),Ev=function(r,t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s,u,c,l,f;return te(this,(function(h){switch(h.label){case 0:return e=E(r,"x","setdiff1d"),n=E(t,"y","setdiff1d"),C(e.dtype===n.dtype,(function(){return"x and y should have the same dtype, but got x ("+e.dtype+") and y ("+n.dtype+")."})),C(e.rank===1,(function(){return"x should be 1D tensor, but got x ("+e.shape+")."})),C(n.rank===1,(function(){return"y should be 1D tensor, but got y ("+n.shape+")."})),[4,e.data()];case 1:return a=h.sent(),[4,n.data()];case 2:for(i=h.sent(),o=new Set(i),s=0,l=0;l<a.length;l++)o.has(a[l])||s++;for(u=new Oa([s],e.dtype),c=new Oa([s],"int32"),l=0,f=0;l<a.length;l++)o.has(a[l])||(u.values[f]=a[l],c.values[f]=l,f++);return[2,[u.toTensor(),c.toTensor()]]}}))}))};function Ji(r,t,e,n){n===void 0&&(n=!0);var a=[];if(n)(a=a.concat(t.slice(0))).push(r[0]/e),a=a.concat(r.slice(1));else{a=a.concat(r[0]);for(var i=t.length,o=0;o<i;++o)a=a.concat([r[o+1]/t[o],t[o]]);a=a.concat(r.slice(i+1))}return a}function $i(r,t,e){e===void 0&&(e=!0);var n=[];if(e){n.push(t);for(var a=t+1;a<r;++a)a<=2*t?(n.push(a),n.push(a-(t+1))):n.push(a)}else{var i=[],o=[];for(a=1;a<r;++a)a>=2*t+1||a%2==1?o.push(a):i.push(a);n.push.apply(n,i),n.push(0),n.push.apply(n,o)}return n}function eo(r,t,e,n){n===void 0&&(n=!0);var a=[];n?a.push(r[0]/e):a.push(r[0]*e);for(var i=1;i<r.length;++i)i<=t.length?n?a.push(t[i-1]*r[i]):a.push(r[i]/t[i-1]):a.push(r[i]);return a}function sf(r,t){for(var e=[0],n=0;n<t;++n)e.push(r[n][0]);return e}function uf(r,t,e){for(var n=r.slice(0,1),a=0;a<e;++a)n.push(r[a+1]-t[a][0]-t[a][1]);return n}function eu(r,t){if(r.rank<1)throw new Error("tf.gatherND() expects the input to be rank 1 or higher, but the rank was "+r.rank+".");if(t.rank<1)throw new Error("tf.gatherND() expects the indices to be rank 1 or higher, but the rank was "+t.rank+".");if(t.dtype!=="int32")throw new Error("tf.gatherND() expects the indices to be int32 type, but the dtype was "+t.dtype+".");if(t.shape[t.rank-1]>r.rank)throw new Error("index innermost dimension length must be <= tensor rank; saw: "+t.shape[t.rank-1]+" vs. "+r.rank);if(r.size===0)throw new Error("Requested more than 0 entries, but input is empty. Input shape: "+r.shape+".");for(var e=t.shape,n=e[e.length-1],a=1,i=0;i<e.length-1;++i)a*=e[i];var o=r.shape,s=e.slice();s.pop();var u=1;for(i=n;i<r.rank;++i)u*=o[i],s.push(o[i]);var c=or(r.shape).map((function(l){return l/u})).concat([1]).slice(0,n);return[s,a,u,c]}var Q1=Object.freeze({prepareAndValidate:eu}),tu=30;function zi(r){return r<=tu?r:Yi(r,Math.floor(Math.sqrt(r)))}function cf(r,t,e){var n=t.rank>1?t.shape[t.rank-1]:1,a=t.rank>1?t.rank-1:1,i="Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: "+e.shape+", indices.shape: "+t.shape+", shape: "+r+", sliceDim: "+n+", and batchDim: "+a+".";if(e.rank<a)throw new Error(i+" update.rank < "+a+". ");if(r.length<n+(e.rank-a))throw new Error(i+" Output shape length < "+(n+(e.rank-a)));if(e.rank!==a+r.length-n)throw new Error(i+" update.rank != "+(a+r.length-n));for(var o=0;o<a;++o)if(e.shape[o]!==t.shape[o])throw new Error(i+" updates.shape["+o+"] ("+e.shape[o]+") != indices.shape["+o+"] ("+t.shape[o]+").");for(o=0;o<e.rank-a;++o)if(e.shape[o+a]!==r[o+n])throw new Error(i+" updates.shape["+(o+a)+"] ("+e.shape[o+a]+") != shape["+(o+a)+"] ("+r[o+a]+")")}function lf(r,t,e){if(t.rank<1)throw new Error("tf.scatterND() expects the indices to be rank 1 or higher, but the rank was "+t.rank+".");if(r.rank<1)throw new Error("tf.scatterND() expects the updates to be rank 1 or higher, but the rank was "+r.rank+".");if(t.dtype!=="int32")throw new Error("The dtype of 'indices' should be int32, but got dtype: "+t.dtype);if(e.length<1)throw new Error("Output rank must be greater or equal to 1, but got shape: "+e);if(e.length===0){if(t.size===0)throw new Error("Indices specified for empty output. indices shape: "+t.shape);if(r.size===0)throw new Error("Updates specified for empty output. updates shape: "+r.shape)}cf(e,t,r)}function Ha(r,t,e){for(var n=t.shape.length,a=n>1?t.shape[n-1]:1,i=e.length,o=1,s=a;s<i;++s)o*=e[s];var u=a<1?1:a;return{sliceRank:a,numUpdates:re(t.shape)/u,sliceSize:o,strides:or(e.slice(0,a)).concat([1]),outputSize:re(e)}}var q1=Object.freeze({validateUpdateShape:cf,validateInput:lf,calculateShapes:Ha});function ff(r,t,e){C(r.rank===t.length,(function(){return"Error in slice"+r.rank+"D: Length of begin "+t+" must match the rank of the array ("+r.rank+")."})),C(r.rank===e.length,(function(){return"Error in slice"+r.rank+"D: Length of size "+e+" must match the rank of the array ("+r.rank+")."}));for(var n=function(i){C(t[i]+e[i]<=r.shape[i],(function(){return"Error in slice"+r.rank+"D: begin["+i+"] + size["+i+"] ("+(t[i]+e[i])+") would overflow input.shape["+i+"] ("+r.shape[i]+")"}))},a=0;a<r.rank;++a)n(a)}function Ns(r){for(var t=[],e=0;r>0;)1&r&&t.push(e),r/=2,e++;return t}function lo(r,t,e){for(var n=[],a=0;a<r.length;a++)n[a]=Math.ceil((t[a]-r[a])/e[a]);return n}function hf(r,t,e,n,a){var i=t[a],o=e[a]||1;(r&1<<a||i==null)&&(i=o>0?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER);var s=n[a];return i<0&&(i+=s),i=Xi(0,i,s-1)}function df(r,t,e,n,a){var i=t[a],o=e[a]||1;(r&1<<a||i==null)&&(i=o>0?Number.MAX_SAFE_INTEGER:Number.MIN_SAFE_INTEGER);var s=n[a];return i<0&&(i+=s),i=o>0?Xi(0,i,s):Xi(-1,i,s-1)}function ru(r,t,e){for(var n=e.length,a=0;a<e.length;a++)if(e[a]>1){n=a;break}for(a=n+1;a<e.length;a++)if(t[a]>0||e[a]!==r[a])return!1;return!0}function nu(r,t){for(var e=r.length>0?r[r.length-1]:1,n=0;n<r.length-1;n++)e+=r[n]*t[n];return e}var Z1=Object.freeze({assertParamsValid:ff,maskToAxes:Ns,computeOutShape:lo,startForAxis:hf,stopForAxis:df,isSliceContinous:ru,computeFlatOffset:nu});function Cv(r,t){C(ji(r),(function(){return"The f passed in variableGrads(f) must be a function"})),C(t==null||Array.isArray(t)&&t.every((function(l){return l instanceof mn})),(function(){return"The varList passed in variableGrads(f, varList) must be an array of variables"}));var e=t!=null;if(!e)for(var n in t=[],B.registeredVariables)t.push(B.registeredVariables[n]);var a=e?t.filter((function(l){return!l.trainable})):null,i=t.length;C((t=t.filter((function(l){return l.trainable}))).length>0,(function(){return"variableGrads() expects at least one of the input variables to be trainable, but none of the "+i+" variables is trainable."}));var o=B.gradients(r,t,null,!0),s=o.value,u=o.grads;C(u.some((function(l){return l!=null})),(function(){return"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."})),C(s.rank===0,(function(){return"The f passed in variableGrads(f) must return a scalar, but it returned a rank-"+s.rank+" tensor"}));var c={};return t.forEach((function(l,f){u[f]!=null&&(c[l.name]=u[f])})),a?.forEach((function(l){return c[l.name]=null})),{value:s,grads:c}}function fo(r){return B.customGrad(r)}var _t=R({softmax_:function(r,t){t===void 0&&(t=-1);var e=E(r,"logits","softmax","float32");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error("Softmax along a non-last dimension is not yet supported. Logits was rank "+e.rank+" and dim was "+t);return B.runKernelFunc((function(n,a){var i=n.softmax(e,t);return a([i]),i}),{logits:e},(function(n,a){var i=a[0],o=n.mul(i);return{logits:function(){return o.sub(o.sum([t],!0).mul(i))}}}),"Softmax",{dim:t},[],[!0])}}),Sv=R({logSoftmax_:function(r,t){t===void 0&&(t=-1);var e=E(r,"logits","logSoftmax");if(t===-1&&(t=e.rank-1),t!==e.rank-1)throw Error("Log Softmax along a non-last dimension is not yet supported. Logits was rank "+e.rank+" and axis was "+t);return fo((function(n,a){var i=n.max(t,!0),o=n.sub(i),s=o.toFloat().sub(o.exp().sum(t,!0).log());return a([s]),{value:s,gradFunc:function(u,c){var l=c[0].exp();return u.sub(u.sum(t,!0).mul(l))}}}))(e)}}),pf=(function(){function r(t,e){this.backend=t,this.dataMover=e,this.data=new WeakMap,this.dataIdsCount=0}return r.prototype.get=function(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)},r.prototype.set=function(t,e){this.dataIdsCount++,this.data.set(t,e)},r.prototype.has=function(t){return this.data.has(t)},r.prototype.delete=function(t){return this.dataIdsCount--,this.data.delete(t)},r.prototype.numDataIds=function(){return this.dataIdsCount},r})(),vf=(function(){function r(){}return r.prototype.time=function(t){return P("time")},r.prototype.read=function(t){return P("read")},r.prototype.readSync=function(t){return P("readSync")},r.prototype.numDataIds=function(){return P("numDataIds")},r.prototype.disposeData=function(t){return P("disposeData")},r.prototype.write=function(t,e,n){return P("write")},r.prototype.move=function(t,e,n,a){return P("move")},r.prototype.memory=function(){return P("memory")},r.prototype.floatPrecision=function(){return P("floatPrecision")},r.prototype.epsilon=function(){return this.floatPrecision()===32?1e-7:1e-4},r.prototype.batchMatMul=function(t,e,n,a){return P("batchMatMul")},r.prototype.fusedBatchMatMul=function(t){return t.a,t.b,t.transposeA,t.transposeB,t.bias,t.activation,t.preluActivationWeights,P("fusedBatchMatMul")},r.prototype.slice=function(t,e,n){return P("slice")},r.prototype.stridedSlice=function(t,e,n,a){return P("stridedSlice")},r.prototype.unstack=function(t,e){return P("unstack")},r.prototype.reverse=function(t,e){return P("reverse")},r.prototype.concat=function(t,e){return P("concat")},r.prototype.neg=function(t){return P("neg")},r.prototype.add=function(t,e){return P("add")},r.prototype.addN=function(t){return P("addN")},r.prototype.subtract=function(t,e){return P("subtract")},r.prototype.multiply=function(t,e){return P("multiply")},r.prototype.realDivide=function(t,e){return P("realDivide")},r.prototype.floorDiv=function(t,e){return P("floorDiv")},r.prototype.sum=function(t,e){return P("sum")},r.prototype.prod=function(t,e){return P("prod")},r.prototype.unsortedSegmentSum=function(t,e,n){return P("unsortedSegmentSum")},r.prototype.argMin=function(t,e){return P("argMin")},r.prototype.argMax=function(t,e){return P("argMax")},r.prototype.equal=function(t,e){return P("equal")},r.prototype.notEqual=function(t,e){return P("notEqual")},r.prototype.less=function(t,e){return P("less")},r.prototype.lessEqual=function(t,e){return P("lessEqual")},r.prototype.greater=function(t,e){return P("greater")},r.prototype.greaterEqual=function(t,e){return P("greaterEqual")},r.prototype.logicalNot=function(t){return P("logicalNot")},r.prototype.logicalAnd=function(t,e){return P("logicalAnd")},r.prototype.logicalOr=function(t,e){return P("logicalOr")},r.prototype.where=function(t){return P("where")},r.prototype.select=function(t,e,n){return P("select")},r.prototype.topk=function(t,e,n){return P("topk")},r.prototype.min=function(t,e){return P("min")},r.prototype.minimum=function(t,e){return P("minimum")},r.prototype.mod=function(t,e){return P("mod")},r.prototype.max=function(t,e){return P("max")},r.prototype.maximum=function(t,e){return P("maximum")},r.prototype.all=function(t,e){return P("all")},r.prototype.any=function(t,e){return P("any")},r.prototype.squaredDifference=function(t,e){return P("squaredDifference")},r.prototype.ceil=function(t){return P("ceil")},r.prototype.floor=function(t){return P("floor")},r.prototype.round=function(t){return P("round")},r.prototype.sign=function(t){return P("sign")},r.prototype.isNaN=function(t){return P("isNaN")},r.prototype.isInf=function(t){return P("isInf")},r.prototype.isFinite=function(t){return P("isFinite")},r.prototype.pow=function(t,e){return P("pow")},r.prototype.exp=function(t){return P("exp")},r.prototype.expm1=function(t){return P("expm1")},r.prototype.softmax=function(t,e){return P("softmax")},r.prototype.log=function(t){return P("log")},r.prototype.log1p=function(t){return P("log1p")},r.prototype.sqrt=function(t){return P("sqrt")},r.prototype.rsqrt=function(t){return P("rsqrt")},r.prototype.square=function(t){return P("square")},r.prototype.reciprocal=function(t){return P("reciprocal")},r.prototype.relu=function(t){return P("relu")},r.prototype.relu6=function(t){return P("relu6")},r.prototype.prelu=function(t,e){return P("prelu")},r.prototype.elu=function(t){return P("elu")},r.prototype.eluDer=function(t,e){return P("eluDer")},r.prototype.selu=function(t){return P("selu")},r.prototype.int=function(t){return P("int")},r.prototype.clip=function(t,e,n){return P("clip")},r.prototype.abs=function(t){return P("abs")},r.prototype.complexAbs=function(t){return P("complexAbs")},r.prototype.sigmoid=function(t){return P("sigmoid")},r.prototype.softplus=function(t){return P("softplus")},r.prototype.sin=function(t){return P("sin")},r.prototype.cos=function(t){return P("cos")},r.prototype.tan=function(t){return P("tan")},r.prototype.asin=function(t){return P("asin")},r.prototype.acos=function(t){return P("acos")},r.prototype.atan=function(t){return P("atan")},r.prototype.atan2=function(t,e){return P("atan2")},r.prototype.sinh=function(t){return P("sinh")},r.prototype.cosh=function(t){return P("cosh")},r.prototype.tanh=function(t){return P("tanh")},r.prototype.asinh=function(t){return P("asinh")},r.prototype.acosh=function(t){return P("acosh")},r.prototype.atanh=function(t){return P("atanh")},r.prototype.erf=function(t){return P("erf")},r.prototype.step=function(t,e){return P("step")},r.prototype.fusedConv2d=function(t){return t.input,t.filter,t.convInfo,t.bias,t.activation,t.preluActivationWeights,P("fusedConv2d")},r.prototype.conv2d=function(t,e,n){return P("conv2d")},r.prototype.conv2dDerInput=function(t,e,n){return P("conv2dDerInput")},r.prototype.conv2dDerFilter=function(t,e,n){return P("conv2dDerFilter")},r.prototype.fusedDepthwiseConv2D=function(t){return t.input,t.filter,t.convInfo,t.bias,t.activation,t.preluActivationWeights,P("fusedDepthwiseConv2D")},r.prototype.depthwiseConv2D=function(t,e,n){return P("depthwiseConv2D")},r.prototype.depthwiseConv2DDerInput=function(t,e,n){return P("depthwiseConv2DDerInput")},r.prototype.depthwiseConv2DDerFilter=function(t,e,n){return P("depthwiseConv2DDerFilter")},r.prototype.conv3d=function(t,e,n){return P("conv3d")},r.prototype.conv3dDerInput=function(t,e,n){return P("conv3dDerInput")},r.prototype.conv3dDerFilter=function(t,e,n){return P("conv3dDerFilter")},r.prototype.maxPool=function(t,e){return P("maxPool")},r.prototype.maxPoolBackprop=function(t,e,n,a){return P("maxPoolBackprop")},r.prototype.avgPool=function(t,e){return P("avgPool")},r.prototype.avgPoolBackprop=function(t,e,n){return P("avgPoolBackprop")},r.prototype.avgPool3d=function(t,e){return P("avgPool3d")},r.prototype.avgPool3dBackprop=function(t,e,n){return P("avgPool3dBackprop")},r.prototype.maxPool3d=function(t,e){return P("maxPool3d")},r.prototype.maxPool3dBackprop=function(t,e,n,a){return P("maxPool3dBackprop")},r.prototype.reshape=function(t,e){return P("reshape")},r.prototype.cast=function(t,e){return P("cast")},r.prototype.tile=function(t,e){return P("tile")},r.prototype.pad=function(t,e,n){return P("pad")},r.prototype.transpose=function(t,e){return P("transpose")},r.prototype.gather=function(t,e,n){return P("gather")},r.prototype.gatherND=function(t,e){return P("gatherND")},r.prototype.scatterND=function(t,e,n){return P("scatterND")},r.prototype.batchToSpaceND=function(t,e,n){return P("batchToSpaceND")},r.prototype.spaceToBatchND=function(t,e,n){return P("spaceToBatchND")},r.prototype.resizeBilinear=function(t,e,n,a){return P("resizeBilinear")},r.prototype.resizeBilinearBackprop=function(t,e,n){return P("resizeBilinearBackprop")},r.prototype.resizeNearestNeighbor=function(t,e,n,a){return P("resizeNearestNeighbor")},r.prototype.resizeNearestNeighborBackprop=function(t,e,n){return P("resizeNearestNeighborBackprop")},r.prototype.batchNormalization=function(t,e,n,a,i,o){return P("batchNormalization")},r.prototype.localResponseNormalization4D=function(t,e,n,a,i){return P("localResponseNormalization4D")},r.prototype.LRNGrad=function(t,e,n,a,i,o,s){return P("LRNGrad")},r.prototype.multinomial=function(t,e,n,a){return P("multinomial")},r.prototype.oneHot=function(t,e,n,a){return P("oneHot")},r.prototype.cumsum=function(t,e,n,a){return P("cumsum")},r.prototype.nonMaxSuppression=function(t,e,n,a,i){return P("nonMaxSuppression")},r.prototype.fft=function(t){return P("fft")},r.prototype.ifft=function(t){return P("ifft")},r.prototype.complex=function(t,e){return P("complex")},r.prototype.real=function(t){return P("real")},r.prototype.imag=function(t){return P("imag")},r.prototype.cropAndResize=function(t,e,n,a,i,o){return P("cropAndResize")},r.prototype.depthToSpace=function(t,e,n){return P("depthToSpace")},r.prototype.split=function(t,e,n){return P("split")},r.prototype.sparseToDense=function(t,e,n,a){return P("sparseToDense")},r.prototype.diag=function(t){return P("diag")},r.prototype.fill=function(t,e,n){return P("fill")},r.prototype.onesLike=function(t){return P("onesLike")},r.prototype.zerosLike=function(t){return P("zerosLike")},r.prototype.linspace=function(t,e,n){return P("linspace")},r.prototype.dispose=function(){return P("dispose")},r})();function P(r){throw new Error("'"+r+"' not yet implemented or not found in the registry. Did you forget to import the kernel?")}function Mr(r,t){for(var e=r.length,n=[],a=0;a<e;a++){var i=e-1-a,o=r[i]||1;(t[t.length-1-a]||1)>1&&o===1&&n.unshift(i)}return n}function $e(r,t){for(var e=[],n=0;n<t.length;n++){var a=r[r.length-n-1],i=t.length-n-1,o=t[i];(a==null||a===1&&o>1)&&e.unshift(i)}return e}function xe(r,t){for(var e=[],n=Math.max(r.length,t.length),a=0;a<n;a++){var i=r[r.length-a-1];i==null&&(i=1);var o=t[t.length-a-1];if(o==null&&(o=1),i===1)e.unshift(o);else if(o===1)e.unshift(i);else{if(i!==o)throw Error("Operands could not be broadcast together with shapes "+r+" and "+t+".");e.unshift(i)}}return e}function Yn(r,t,e,n,a,i,o){o===void 0&&(o="channelsLast");var s,u=to(t),c=u[0],l=u[1];if(o==="channelsLast")s=[c,l,r[3],r[3]];else{if(o!=="channelsFirst")throw new Error("Unknown dataFormat "+o);s=[c,l,r[1],r[1]]}return qr(r,s,e,n,a,i,!1,o)}function za(r,t,e,n,a,i,o){o===void 0&&(o="NDHWC");var s,u,c=Os(t),l=c[0],f=c[1],h=c[2];if(o==="NDHWC")u="channelsLast",s=[l,f,h,r[4],r[4]];else{if(o!=="NCDHW")throw new Error("Unknown dataFormat "+o);u="channelsFirst",s=[l,f,h,r[1],r[1]]}return Wa(r,s,e,n,a,!1,u,i)}function qr(r,t,e,n,a,i,o,s){o===void 0&&(o=!1),s===void 0&&(s="channelsLast");var u=[-1,-1,-1,-1],c=u[0],l=u[1],f=u[2],h=u[3];if(s==="channelsLast")c=r[0],l=r[1],f=r[2],h=r[3];else{if(s!=="channelsFirst")throw new Error("Unknown dataFormat "+s);c=r[0],h=r[1],l=r[2],f=r[3]}var d,p=t[0],v=t[1],m=t[3],g=to(e),x=g[0],w=g[1],y=to(n),b=y[0],A=y[1],I=Wn(p,b),T=Wn(v,A),S=(function(O,N,H,G,U,z,X,q){var Z,ne,ue;if(typeof O=="number"){Z={top:O,bottom:O,left:O,right:O,type:O===0?"VALID":"NUMBER"};var ce=(function(me,Se,we,Le,Ue){Le==null&&(Le=au(me,Se,we));var ke=me[0],Ut=me[1],Gt=Fa((ke-Se+2*Le)/we+1,Ue);C(Ke(Gt),(function(){return"The output # of rows ("+Gt+") must be an integer. Change the stride and/or zero pad parameters"}));var wt=Fa((Ut-Se+2*Le)/we+1,Ue);return C(Ke(wt),(function(){return"The output # of columns ("+wt+") must be an integer. Change the stride and/or zero pad parameters"})),[Gt,wt]})([N,H],z,G,O,q);ne=ce[0],ue=ce[1]}else if(O==="same"){ne=Math.ceil(N/G),ue=Math.ceil(H/U);var fe=Math.max(0,(ne-1)*G+z-N),ve=Math.max(0,(ue-1)*U+X-H),ye=Math.floor(fe/2),ge=fe-ye,He=Math.floor(ve/2);Z={top:ye,bottom:ge,left:He,right:ve-He,type:"SAME"}}else{if(O!=="valid")throw Error("Unknown padding parameter: "+O);Z={top:0,bottom:0,left:0,right:0,type:"VALID"},ne=Math.ceil((N-z+1)/G),ue=Math.ceil((H-X+1)/U)}return{padInfo:Z,outHeight:ne,outWidth:ue}})(a,l,f,x,w,I,T,i),D=S.padInfo,_=S.outHeight,M=S.outWidth,L=o?m*h:m;return s==="channelsFirst"?d=[c,L,_,M]:s==="channelsLast"&&(d=[c,_,M,L]),{batchSize:c,dataFormat:s,inHeight:l,inWidth:f,inChannels:h,outHeight:_,outWidth:M,outChannels:L,padInfo:D,strideHeight:x,strideWidth:w,filterHeight:p,filterWidth:v,effectiveFilterHeight:I,effectiveFilterWidth:T,dilationHeight:b,dilationWidth:A,inShape:r,outShape:d,filterShape:t}}function Wa(r,t,e,n,a,i,o,s){i===void 0&&(i=!1),o===void 0&&(o="channelsLast");var u=[-1,-1,-1,-1,-1],c=u[0],l=u[1],f=u[2],h=u[3],d=u[4];if(o==="channelsLast")c=r[0],l=r[1],f=r[2],h=r[3],d=r[4];else{if(o!=="channelsFirst")throw new Error("Unknown dataFormat "+o);c=r[0],d=r[1],l=r[2],f=r[3],h=r[4]}var p,v=t[0],m=t[1],g=t[2],x=t[4],w=Os(e),y=w[0],b=w[1],A=w[2],I=Os(n),T=I[0],S=I[1],D=I[2],_=Wn(v,T),M=Wn(m,S),L=Wn(g,D),O=(function(X,q,Z,ne,ue,ce,fe,ve,ye,ge,He){var me,Se,we,Le;if(typeof X=="number"){me={top:X,bottom:X,left:X,right:X,front:X,back:X,type:X===0?"VALID":"NUMBER"};var Ue=(function(Sr,Ft,Wr,Dr,oe,$){oe==null&&(oe=au(Sr,Ft,Dr));var ze=Sr[0],nt=Sr[1],Qe=Sr[2],ot=Fa((ze-Ft+2*oe)/Dr+1,$);C(Ke(ot),(function(){return"The output # of depths ("+ot+") must be an integer. Change the stride and/or zero pad parameters"}));var bt=Fa((nt-Ft+2*oe)/Dr+1,$);C(Ke(bt),(function(){return"The output # of rows ("+bt+") must be an integer. Change the stride and/or zero pad parameters"}));var qe=Fa((Qe-Ft+2*oe)/Dr+1,$);return C(Ke(qe),(function(){return"The output # of columns ("+qe+") must be an integer. Change the stride and/or zero pad parameters"})),[ot,bt,qe,Wr]})([q,Z,ne,1],ve,1,ue,X,He);Se=Ue[0],we=Ue[1],Le=Ue[2]}else if(X==="same"){Se=Math.ceil(q/ue),we=Math.ceil(Z/ce),Le=Math.ceil(ne/fe);var ke=(Se-1)*ue+ve-q,Ut=(we-1)*ce+ye-Z,Gt=(Le-1)*fe+ge-ne,wt=Math.floor(ke/2),Ht=ke-wt,zt=Math.floor(Ut/2),nr=Ut-zt,qt=Math.floor(Gt/2);me={top:zt,bottom:nr,left:qt,right:Gt-qt,front:wt,back:Ht,type:"SAME"}}else{if(X!=="valid")throw Error("Unknown padding parameter: "+X);me={top:0,bottom:0,left:0,right:0,front:0,back:0,type:"VALID"},Se=Math.ceil((q-ve+1)/ue),we=Math.ceil((Z-ye+1)/ce),Le=Math.ceil((ne-ge+1)/fe)}return{padInfo:me,outDepth:Se,outHeight:we,outWidth:Le}})(a,l,f,h,y,b,A,_,M,L,s),N=O.padInfo,H=O.outDepth,G=O.outHeight,U=O.outWidth,z=i?x*d:x;return o==="channelsFirst"?p=[c,z,H,G,U]:o==="channelsLast"&&(p=[c,H,G,U,z]),{batchSize:c,dataFormat:o,inDepth:l,inHeight:f,inWidth:h,inChannels:d,outDepth:H,outHeight:G,outWidth:U,outChannels:z,padInfo:N,strideDepth:y,strideHeight:b,strideWidth:A,filterDepth:v,filterHeight:m,filterWidth:g,effectiveFilterDepth:_,effectiveFilterHeight:M,effectiveFilterWidth:L,dilationDepth:T,dilationHeight:S,dilationWidth:D,inShape:r,outShape:p,filterShape:t}}function au(r,t,e,n){n===void 0&&(n=1);var a=Wn(t,n);return Math.floor((r[0]*(e-1)-e+a)/2)}function to(r){return typeof r=="number"?[r,r,r]:r.length===2?[r[0],r[1],1]:r}function Os(r){return typeof r=="number"?[r,r,r]:r}function Wn(r,t){return t<=1?r:r+(r-1)*(t-1)}function Fa(r,t){if(!t)return r;switch(t){case"round":return Math.round(r);case"ceil":return Math.ceil(r);case"floor":return Math.floor(r);default:throw new Error("Unknown roundingMode "+t)}}function xn(r){var t=to(r),e=t[0],n=t[1],a=t[2];return e===1&&n===1&&a===1}function Mt(r,t){return xn(r)||xn(t)}function ho(r){if(r==="NHWC")return"channelsLast";if(r==="NCHW")return"channelsFirst";throw new Error("Unknown dataFormat "+r)}function iu(r,t,e){if(t==="complex64"){if(r.dtype==="complex64")return r.clone();var n=Ne(r.shape),a=r.toFloat(),i=e.complex(a,n);return n.dispose(),a.dispose(),i}if(!ml(r.dtype,t))return B.makeTensorFromDataId(r.dataId,r.shape,t);if(r.dtype==="complex64"){var o=e.real(r);return i=o.cast(t),o.dispose(),i}if(t==="int32")return e.int(r);if(t==="bool"){var s=Y(0,r.dtype);return i=e.notEqual(r,s),s.dispose(),i}throw new Error("Error in Cast: failed to cast "+r.dtype+" to "+t)}function ro(r,t){return B.makeTensorFromDataId(r.dataId,t,r.dtype)}function ou(r,t,e){var n=(t-r)/(e-1),a=qn(e,"float32");a[0]=r;for(var i=1;i<a.length;i++)a[i]=a[i-1]+n;return Fe(a,"float32")}var J1=Object.freeze({castTensor:iu,reshapeTensor:ro,linspaceImpl:ou,upcastType:st,axesAreInnerMostDims:Zs,combineLocations:Jl,computeOutAndReduceShapes:vt,expandShapeToKeepDim:Rt,assertAxesAreInnerMostDims:kt,getAxesPermutation:cr,getUndoAxesPermutation:so,getInnerMostAxes:lr,getBroadcastDims:Mr,getReductionAxes:$e,assertAndGetBroadcastShape:xe,assertParamsConsistent:$l,computeOutShape:gn,computePool2DInfo:Yn,computePool3DInfo:za,computeConv2DInfo:qr,computeConv3DInfo:Wa,computeDefaultPad:au,tupleValuesAreOne:xn,eitherStridesOrDilationsAreOne:Mt,convertConv2DDataFormat:ho,PARALLELIZE_THRESHOLD:tu,computeOptimalWindowSize:zi});function Ls(r,t){if(r.length!==t.length)throw new Error("Cannot merge real and imag arrays of different lengths. real:"+r.length+", imag: "+t.length+".");for(var e=new Float32Array(2*r.length),n=0;n<e.length;n+=2)e[n]=r[n/2],e[n+1]=t[n/2];return e}function Rc(r,t){return{real:r[2*t],imag:r[2*t+1]}}function Dv(r,t,e,n){r[2*n]=t,r[2*n+1]=e}function Tv(r,t,e){var n=(e?2:-2)*Math.PI*(r/t);return{real:Math.cos(n),imag:Math.sin(n)}}function Iv(r,t,e){var n=(function(i,o,s){return(function(u,c,l){for(var f=0,h=u.length,d=0,p=!1;f<h;){var v=l(c,u[d=f+(h-f>>>1)]);v>0?f=d+1:(h=d,p=!v)}return p?f:-f-1})(i,o,s||Rv)})(r,t,e),a=n<0?-(n+1):n;r.splice(a,0,t)}function Rv(r,t){return r>t?1:r<t?-1:0}function su(r,t,e,n,a){return mf(r,t,e,n,a,0).selectedIndices}function uu(r,t,e,n,a,i){var o=mf(r,t,e,n,a,i,!0);return o.numValidOutputs.dispose(),{selectedIndices:o.selectedIndices,selectedScores:o.selectedScores}}function mf(r,t,e,n,a,i,o,s){o===void 0&&(o=!1),s===void 0&&(s=!1);for(var u=Array.from(t).map((function(y,b){return{score:y,boxIndex:b,suppressBeginIndex:0}})).filter((function(y){return y.score>a})).sort(Mc),c=i>0?-.5/i:0,l=[],f=[];l.length<e&&u.length>0;){var h=u.pop(),d=h.score,p=h.boxIndex,v=h.suppressBeginIndex;if(d<a)break;for(var m=!1,g=l.length-1;g>=v;--g){var x=Mv(r,p,l[g]);if(x>=n){m=!0;break}if(h.score=h.score*Bv(n,c,x),h.score<=a)break}h.suppressBeginIndex=l.length,m||(h.score===d?(l.push(p),f.push(h.score)):h.score>a&&Iv(u,h,Mc))}var w=l.length;return s&&(l.fill(0,w),f.fill(0,w)),{selectedIndices:Fe(l,"int32"),selectedScores:Fe(f,"float32"),numValidOutputs:Y(w,"int32")}}function Mv(r,t,e){var n=r.subarray(4*t,4*t+4),a=r.subarray(4*e,4*e+4),i=Math.min(n[0],n[2]),o=Math.min(n[1],n[3]),s=Math.max(n[0],n[2]),u=Math.max(n[1],n[3]),c=Math.min(a[0],a[2]),l=Math.min(a[1],a[3]),f=Math.max(a[0],a[2]),h=Math.max(a[1],a[3]),d=(s-i)*(u-o),p=(f-c)*(h-l);if(d<=0||p<=0)return 0;var v=Math.max(i,c),m=Math.max(o,l),g=Math.min(s,f),x=Math.min(u,h),w=Math.max(g-v,0)*Math.max(x-m,0);return w/(d+p-w)}function Bv(r,t,e){var n=Math.exp(t*e*e);return e<=r?n:0}function Mc(r,t){return r.score-t.score||r.score===t.score&&t.boxIndex-r.boxIndex}function gf(r,t,e){var n=new Array(r.rank).fill(0),a=r.shape.slice();return t.map((function(i){a[e]=i;var o=r.slice(n,a);return n[e]+=i,o}))}function xf(r,t){for(var e=new Array(r.rank),n=0;n<e.length;n++)e[n]=r.shape[n]*t[n];var a=le(e,r.dtype);for(n=0;n<a.values.length;++n){for(var i=a.indexToLoc(n),o=new Array(r.rank),s=0;s<o.length;s++)o[s]=i[s]%r.shape[s];var u=r.locToIndex(o);a.values[n]=r.values[u]}return a.toTensor()}function yf(r,t,e,n,a){for(var i=t[t.length-1],o=[r.length/i,i],s=o[0],u=o[1],c=jn(e,s*n),l=jn("int32",s*n),f=0;f<s;f++){for(var h=f*u,d=r.subarray(h,h+u),p=[],v=0;v<d.length;v++)p.push({value:d[v],index:v});p.sort((function(y,b){return b.value-y.value}));var m=f*n,g=c.subarray(m,m+n),x=l.subarray(m,m+n);for(v=0;v<n;v++)g[v]=p[v].value,x[v]=p[v].index}var w=t.slice();return w[w.length-1]=n,[ut(c,w,e),ut(l,w,"int32")]}function cu(r,t){for(var e=[],n=0;n<t.length;n++)t[n]&&e.push(n);var a=le(r,"int32"),i=le([e.length,r.length],"int32");for(n=0;n<e.length;n++){var o=a.indexToLoc(e[n]),s=n*r.length;i.values.set(o,s)}return i.toTensor()}var _v=function(r,t){this.outputShape=[],this.outputShape=r,this.variableNames=t.map((function(a,i){return"T"+i}));var e=[];this.variableNames.forEach((function(a){e.push("float v"+a+" = get"+a+"AtOutCoords();")}));var n=this.variableNames.map((function(a){return"v"+a})).join(" + ");this.userCode=`
      void main() {
        `+e.join(`
        `)+`

        float result = `+n+`;
        setOutput(result);
      }
    `},Pv=function(r,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r,this.variableNames=t.map((function(a,i){return"T"+i}));var e=[];this.variableNames.forEach((function(a){e.push("vec4 v"+a+" = get"+a+"AtOutCoords();")}));var n=this.variableNames.map((function(a){return"v"+a})).join(" + ");this.userCode=`
      void main() {
        `+e.join(`
        `)+`

        vec4 result = `+n+`;
        setOutput(result);
      }
    `},Fv=function(r,t,e){this.variableNames=["A"];var n=r.windowSize,a=r.batchSize,i=r.inSize,o=Math.ceil(i/n);e||this.variableNames.push("bestIndicesA"),this.outputShape=[a,o];var s=t==="max"?">":"<",u=e?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));";this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * `+n+`;

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < `+n+`; i++) {
          int inIdx = `+u+`;
          float candidate = getA(batch, inIdx);
          if (candidate `+s+` bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `};function wf(r,t){return["x","y","z","w","u","v"].slice(0,t).map((function(e){return r+"."+e}))}function Nt(r,t){return t===1?[r]:wf(r,t)}function Ct(){var r,t,e,n,a,i,o,s,u,c;return k().getNumber("WEBGL_VERSION")===2?(r="#version 300 es",t="in",e="out",n="in",a="texture",i="outputColor",o="out vec4 outputColor;",s=`
      bool isnan_custom(float val) {
        return (val > 0.0 || val < 0.0) ? false : val != 0.0;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `,u="",c=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(r="",t="attribute",e="varying",n="varying",a="texture2D",i="gl_FragColor",o="",s=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,u=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,c=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:r,attribute:t,varyingVs:e,varyingFs:n,texture2D:a,output:i,defineOutput:o,defineSpecialNaN:s,defineSpecialInf:u,defineRound:c}}function hn(r,t,e){e===void 0&&(e="index");var n=or(t);return n.map((function(a,i){return"int "+r[i]+" = "+e+" / "+a+"; "+(i===n.length-1?"int "+r[i+1]+" = "+e+" - "+r[i]+" * "+a:"index -= "+r[i]+" * "+a)+";"})).join("")}function lu(r){var t=or(r).map((function(e){return e.toString()}));return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * `+t[0]+" + coords.y * "+t[1]+` + coords.z;
  }
`}var bf=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`;function kv(r,t,e,n){var a=[];r.forEach((function(d){var p=re(d.shapeInfo.logicalShape);d.shapeInfo.isUniform?a.push("uniform float "+d.name+(p>1?"["+p+"]":"")+";"):(a.push("uniform sampler2D "+d.name+";"),a.push("uniform int offset"+d.name+";"))}));var i,o,s=a.join(`
`),u=r.map((function(d){return(function(p,v,m){m===void 0&&(m=!1);var g="";g+=m?Af(p):Un(p);var x=p.shapeInfo.logicalShape,w=v.logicalShape;return x.length<=w.length&&(g+=m?(function(y,b){var A,I=y.name,T=I.charAt(0).toUpperCase()+I.slice(1),S="get"+T+"AtOutCoords",D=y.shapeInfo.logicalShape.length,_=b.logicalShape.length,M=Mr(y.shapeInfo.logicalShape,b.logicalShape),L=Oe(_),O=_-D,N=["x","y","z","w","u","v"];A=D===0?"":_<2&&M.length>=1?"coords = 0;":M.map((function(Z){return"coords."+N[Z+O]+" = 0;"})).join(`
`);var H="";H=_<2&&D>0?"coords":y.shapeInfo.logicalShape.map((function(Z,ne){return"coords."+N[ne+O]})).join(", ");var G="return outputValue;",U=re(y.shapeInfo.logicalShape)===1,z=re(b.logicalShape)===1;if(D!==1||U||z){if(U&&!z)G=_===1?`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:`
        return vec4(outputValue.x);
      `;else if(M.length){var X=D-2,q=D-1;M.indexOf(X)>-1&&M.indexOf(q)>-1?G="return vec4(outputValue.x);":M.indexOf(X)>-1?G="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":M.indexOf(q)>-1&&(G="return vec4(outputValue.xx, outputValue.zz);")}}else G=`
      return vec4(outputValue.xy, outputValue.xy);
    `;return`
    vec4 `+S+`() {
      `+L+` coords = getOutputCoords();
      `+A+`
      vec4 outputValue = get`+T+"("+H+`);
      `+G+`
    }
  `})(p,v):(function(y,b){var A=y.name,I=A.charAt(0).toUpperCase()+A.slice(1),T="get"+I+"AtOutCoords",S=b.texShape,D=y.shapeInfo.texShape,_=y.shapeInfo.logicalShape.length,M=b.logicalShape.length;if(!y.shapeInfo.isUniform&&_===M&&y.shapeInfo.flatOffset==null&&Je(D,S))return`
      float `+T+`() {
        return sampleTexture(`+A+`, resultUV);
      }
    `;var L,O=Oe(M),N=Mr(y.shapeInfo.logicalShape,b.logicalShape),H=M-_,G=["x","y","z","w","u","v"];L=_===0?"":M<2&&N.length>=1?"coords = 0;":N.map((function(z){return"coords."+G[z+H]+" = 0;"})).join(`
`);var U="";return U=M<2&&_>0?"coords":y.shapeInfo.logicalShape.map((function(z,X){return"coords."+G[X+H]})).join(", "),`
    float `+T+`() {
      `+O+` coords = getOutputCoords();
      `+L+`
      return get`+I+"("+U+`);
    }
  `})(p,v)),g})(d,t,n)})).join(`
`),c=t.texShape,l=Ct(),f=(function(d){return`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return `+d.texture2D+`(textureSampler, uv).r;
    }
  `})(l),h=(function(d){return d.version+`
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    `+d.varyingFs+` vec2 resultUV;
    `+d.defineOutput+`
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    `+d.defineSpecialNaN+`
    `+d.defineSpecialInf+`
    `+d.defineRound+`

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    `+Nv+`
    `+Ov+`
    `+Lv+`
  `})(l);return t.isPacked?(i=(function(d,p){switch(d.length){case 0:return`
    int getOutputCoords() {
      return 0;
    }
  `;case 1:return(function(y,b){var A=[Math.ceil(b[0]/2),Math.ceil(b[1]/2)];return A[0]===1?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * `+A[1]+`.0);
      }
    `:A[1]===1?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * `+A[0]+`.0);
      }
    `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+A[0]+", "+A[1]+`));
      return 2 * (resTexRC.x * `+A[1]+` + resTexRC.y);
    }
  `})(0,p);case 2:return(function(y,b){var A=[Math.ceil(b[0]/2),Math.ceil(b[1]/2)];if(Je(y,b))return`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(`+A[0]+", "+A[1]+`));
      }
    `;var I=Math.ceil(y[1]/2);return`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+A[0]+", "+A[1]+`));

      int index = resTexRC.x * `+A[1]+` + resTexRC.y;
      int r = 2 * (index / `+I+`);
      int c = imod(index, `+I+`) * 2;

      return ivec2(r, c);
    }
  `})(d,p);case 3:return v=d,m=p,g=[Math.ceil(m[0]/2),Math.ceil(m[1]/2)],x=Math.ceil(v[2]/2),w=x*Math.ceil(v[1]/2),`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+g[0]+", "+g[1]+`));
      int index = resTexRC.x * `+g[1]+` + resTexRC.y;

      int b = index / `+w+`;
      index -= b * `+w+`;

      int r = 2 * (index / `+x+`);
      int c = imod(index, `+x+`) * 2;

      return ivec3(b, r, c);
    }
  `;default:return(function(y,b){for(var A=[Math.ceil(b[0]/2),Math.ceil(b[1]/2)],I=Math.ceil(y[y.length-1]/2),T=I*Math.ceil(y[y.length-2]/2),S=T,D="",_="b, r, c",M=2;M<y.length-1;M++)S*=y[y.length-M-1],D=`
      int b`+M+" = index / "+S+`;
      index -= b`+M+" * "+S+`;
    `+D,_="b"+M+", "+_;return`
    ivec`+y.length+` getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+A[0]+", "+A[1]+`));
      int index = resTexRC.x * `+A[1]+` + resTexRC.y;

      `+D+`

      int b = index / `+T+`;
      index -= b * `+T+`;

      int r = 2 * (index / `+I+`);
      int c = imod(index, `+I+`) * 2;

      return ivec`+y.length+"("+_+`);
    }
  `})(d,p)}var v,m,g,x,w})(t.logicalShape,c),o=(function(d){return`
    void setOutput(vec4 val) {
      `+d.output+` = val;
    }
  `})(l)):(i=(function(d,p){switch(d.length){case 0:return`
    int getOutputCoords() {
      return 0;
    }
  `;case 1:return(function(g,x){return x[0]===1?`
      int getOutputCoords() {
        return int(resultUV.x * `+x[1]+`.0);
      }
    `:x[1]===1?`
      int getOutputCoords() {
        return int(resultUV.y * `+x[0]+`.0);
      }
    `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+x[0]+", "+x[1]+`));
      return resTexRC.x * `+x[1]+` + resTexRC.y;
    }
  `})(0,p);case 2:return(function(g,x){return Je(g,x)?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(`+x[0]+", "+x[1]+`));
      }
    `:g[1]===1?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(`+x[0]+", "+x[1]+`));
        int index = resTexRC.x * `+x[1]+` + resTexRC.y;
        return ivec2(index, 0);
      }
    `:g[0]===1?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(`+x[0]+", "+x[1]+`));
        int index = resTexRC.x * `+x[1]+` + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+x[0]+", "+x[1]+`));
      int index = resTexRC.x * `+x[1]+` + resTexRC.y;
      int r = index / `+g[1]+`;
      int c = index - r * `+g[1]+`;
      return ivec2(r, c);
    }
  `})(d,p);case 3:return v=p,m=hn(["r","c","d"],d),`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(`+v[0]+", "+v[1]+`));
      int index = resTexRC.x * `+v[1]+` + resTexRC.y;
      `+m+`
      return ivec3(r, c, d);
    }
  `;case 4:return(function(g,x){var w=hn(["r","c","d","d2"],g);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(`+x[0]+", "+x[1]+`));
      int index = resTexRC.x * `+x[1]+` + resTexRC.y;
      `+w+`
      return ivec4(r, c, d, d2);
    }
  `})(d,p);case 5:return(function(g,x){var w=hn(["r","c","d","d2","d3"],g);return`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(`+x[0]+`,
                             `+x[1]+`));

      int index = resTexRC.x * `+x[1]+` + resTexRC.y;

      `+w+`

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `})(d,p);case 6:return(function(g,x){var w=hn(["r","c","d","d2","d3","d4"],g);return`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(`+x[0]+", "+x[1]+`));
      int index = resTexRC.x * `+x[1]+` + resTexRC.y;

      `+w+`

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `})(d,p);default:throw new Error(d.length+"-D output sampling is not yet supported")}var v,m})(t.logicalShape,c),o=(function(d){return`
    void setOutput(float val) {
      `+d.output+` = vec4(val, 0, 0, 0);
    }
  `})(l)),n&&(h+=Uv),[h,f,o,s,i,u,e].join(`
`)}function Un(r){var t=r.shapeInfo.logicalShape;switch(t.length){case 0:return(function(e){var n=e.name,a="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return"float "+a+"() {return "+n+";}";var i=e.shapeInfo.texShape,o=i[0],s=i[1];if(o===1&&s===1)return`
      float `+a+`() {
        return sampleTexture(`+n+`, halfCR);
      }
    `;var u=e.shapeInfo.texShape,c=u[0],l=u[1],f=un(n);return`
    float `+a+`() {
      vec2 uv = uvFromFlat(`+c+", "+l+", "+f+`);
      return sampleTexture(`+n+`, uv);
    }
  `})(r);case 1:return(function(e){var n=e.name,a="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return`
      float `+a+`(int index) {
        `+Nn(e)+`
      }
    `;var i=e.shapeInfo.texShape,o=i[0],s=i[1];if(s===1&&o===1)return`
      float `+a+`(int index) {
        return sampleTexture(`+n+`, halfCR);
      }
    `;var u=un(n);return s===1?`
      float `+a+`(int index) {
        vec2 uv = vec2(0.5, (float(index + `+u+") + 0.5) / "+o+`.0);
        return sampleTexture(`+n+`, uv);
      }
    `:o===1?`
      float `+a+`(int index) {
        vec2 uv = vec2((float(index + `+u+") + 0.5) / "+s+`.0, 0.5);
        return sampleTexture(`+n+`, uv);
      }
    `:`
    float `+a+`(int index) {
      vec2 uv = uvFromFlat(`+o+", "+s+", index + "+u+`);
      return sampleTexture(`+n+`, uv);
    }
  `})(r);case 2:return(function(e){var n=e.shapeInfo.logicalShape,a=e.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),o=e.shapeInfo.texShape;if(o!=null&&Je(n,o)){var s=o[0],u=o[1];return`
    float `+i+`(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(`+u+".0, "+s+`.0);
      return sampleTexture(`+a+`, uv);
    }
  `}var c=Xr(n),l=c.newShape,f=c.keptDims,h=l;if(h.length<n.length){var d=Gn(e,h);return`
      `+Un(d)+`
      float `+i+`(int row, int col) {
        return `+i+"("+Hn(["row","col"],f)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+i+`(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(`+n[1]+`, 1)));
        `+Nn(e)+`
      }
    `;var p=o[0],v=o[1],m=un(a);return v===1?`
    float `+i+`(int row, int col) {
      float index = dot(vec3(row, col, `+m+"), vec3("+n[1]+`, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / `+p+`.0);
      return sampleTexture(`+a+`, uv);
    }
  `:p===1?`
    float `+i+`(int row, int col) {
      float index = dot(vec3(row, col, `+m+"), vec3("+n[1]+`, 1, 1));
      vec2 uv = vec2((index + 0.5) / `+v+`.0, 0.5);
      return sampleTexture(`+a+`, uv);
    }
  `:`
  float `+i+`(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * `+n[1]+" + col + "+m+`;
    vec2 uv = uvFromFlat(`+p+", "+v+`, index);
    return sampleTexture(`+a+`, uv);
  }
`})(r);case 3:return(function(e){var n=e.shapeInfo.logicalShape,a=e.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),o=n[1]*n[2],s=n[2],u=Xr(n),c=u.newShape,l=u.keptDims,f=c;if(f.length<n.length){var h=Gn(e,f);return`
        `+Un(h)+`
        float `+i+`(int row, int col, int depth) {
          return `+i+"("+Hn(["row","col","depth"],l)+`);
        }
      `}if(e.shapeInfo.isUniform)return`
      float `+i+`(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(`+o+", "+s+`, 1)));
        `+Nn(e)+`
      }
    `;var d=e.shapeInfo.texShape,p=d[0],v=d[1],m=e.shapeInfo.flatOffset;if(v===o&&m==null)return`
        float `+i+`(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(`+s+`, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(`+v+".0, "+p+`.0);
          return sampleTexture(`+a+`, uv);
        }
      `;if(v===s&&m==null)return`
    float `+i+`(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(`+n[1]+`, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+v+".0, "+p+`.0);
      return sampleTexture(`+a+`, uv);
    }
  `;var g=un(a);return`
      float `+i+`(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * `+o+" + col * "+s+" + depth + "+g+`;
        vec2 uv = uvFromFlat(`+p+", "+v+`, index);
        return sampleTexture(`+a+`, uv);
      }
  `})(r);case 4:return(function(e){var n=e.shapeInfo.logicalShape,a=e.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),o=n[3],s=n[2]*o,u=n[1]*s,c=Xr(n),l=c.newShape,f=c.keptDims;if(l.length<n.length){var h=Gn(e,l);return`
      `+Un(h)+`
      float `+i+`(int row, int col, int depth, int depth2) {
        return `+i+"("+Hn(["row","col","depth","depth2"],f)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+i+`(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(`+u+", "+s+", "+o+`, 1)));
        `+Nn(e)+`
      }
    `;var d=e.shapeInfo.flatOffset,p=e.shapeInfo.texShape,v=p[0],m=p[1];if(m===u&&d==null)return`
      float `+i+`(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(`+s+", "+o+`, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+m+".0, "+v+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;if(m===o&&d==null)return`
      float `+i+`(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(`+n[1]*n[2]+", "+n[2]+`, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+m+".0, "+v+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;var g=un(a);return`
    float `+i+`(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+u+" + col * "+s+` +
          depth * `+o+` + depth2;
      vec2 uv = uvFromFlat(`+v+", "+m+", index + "+g+`);
      return sampleTexture(`+a+`, uv);
    }
  `})(r);case 5:return(function(e){var n=e.shapeInfo.logicalShape,a=e.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),o=n[4],s=n[3]*o,u=n[2]*s,c=n[1]*u,l=Xr(n),f=l.newShape,h=l.keptDims;if(f.length<n.length){var d=Gn(e,f);return`
      `+Un(d)+`
      float `+i+`(int row, int col, int depth, int depth2, int depth3) {
        return `+i+"("+Hn(["row","col","depth","depth2","depth3"],h)+`);
      }
    `}if(e.shapeInfo.isUniform)return`
      float `+i+`(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(`+c+", "+u+", "+s+", "+o+`)) +
          depth3;
        `+Nn(e)+`
      }
    `;var p=e.shapeInfo.flatOffset,v=e.shapeInfo.texShape,m=v[0],g=v[1];if(g===c&&p==null)return`
      float `+i+`(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(`+u+", "+s+", "+o+`, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+g+".0, "+m+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;if(g===o&&p==null)return`
      float `+i+`(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(`+n[1]*n[2]*n[3]+`,
               `+n[2]*n[3]+", "+n[3]+`, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+g+".0, "+m+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;var x=un(a);return`
    float `+i+`(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+c+" + col * "+u+" + depth * "+s+` +
          depth2 * `+o+" + depth3 + "+x+`;
      vec2 uv = uvFromFlat(`+m+", "+g+`, index);
      return sampleTexture(`+a+`, uv);
    }
  `})(r);case 6:return(function(e){var n=e.shapeInfo.logicalShape,a=e.name,i="get"+a.charAt(0).toUpperCase()+a.slice(1),o=Xr(n),s=o.newShape,u=o.keptDims;if(s.length<n.length){var c=Gn(e,s);return`
      `+Un(c)+`
      float `+i+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return `+i+"("+Hn(["row","col","depth","depth2","depth3","depth4"],u)+`);
      }
    `}var l=n[5],f=n[4]*l,h=n[3]*f,d=n[2]*h,p=n[1]*d;if(e.shapeInfo.isUniform)return`
      float `+i+`(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(`+p+", "+d+", "+h+", "+f+`)) +
          dot(
            vec2(depth3, depth4),
            vec2(`+l+`, 1)));
        `+Nn(e)+`
      }
    `;var v=e.shapeInfo.flatOffset,m=e.shapeInfo.texShape,g=m[0],x=m[1];if(x===p&&v==null)return`
      float `+i+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(`+d+", "+h+", "+f+", "+l+`)) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(`+x+".0, "+g+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;if(x===l&&v==null)return`
      float `+i+`(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(`+n[1]*n[2]*n[3]*n[4]+`,
               `+n[2]*n[3]*n[4]+`,
               `+n[3]*n[4]+`,
               `+n[4]+`)) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(`+x+".0, "+g+`.0);
        return sampleTexture(`+a+`, uv);
      }
    `;var w=un(a);return`
    float `+i+`(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * `+p+" + col * "+d+" + depth * "+h+` +
          depth2 * `+f+" + depth3 * "+l+" + depth4 + "+w+`;
      vec2 uv = uvFromFlat(`+g+", "+x+`, index);
      return sampleTexture(`+a+`, uv);
    }
  `})(r);default:throw new Error(t.length+"-D input sampling is not yet supported")}}function Af(r){var t,e,n;switch(r.shapeInfo.logicalShape.length){case 0:return t=r.name,e="get"+t.charAt(0).toUpperCase()+t.slice(1),n=Ct(),`
    vec4 `+e+`() {
      return `+n.texture2D+"("+t+`, halfCR);
    }
  `;case 1:return(function(a){var i=a.name,o="get"+i.charAt(0).toUpperCase()+i.slice(1),s=a.shapeInfo.texShape,u=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],c=Ct();return`
    vec4 `+o+`(int index) {
      vec2 uv = packedUVfrom1D(
        `+u[0]+", "+u[1]+`, index);
      return `+c.texture2D+"("+i+`, uv);
    }
  `})(r);case 2:return(function(a){var i=a.shapeInfo.logicalShape,o=a.name,s="get"+o.charAt(0).toUpperCase()+o.slice(1),u=a.shapeInfo.texShape,c=u[0],l=u[1],f=Ct();if(u!=null&&Je(i,u))return`
      vec4 `+s+`(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(`+l+".0, "+c+`.0);

        return `+f.texture2D+"("+o+`, uv);
      }
    `;var h=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)],d=Math.ceil(i[1]/2);return`
    vec4 `+s+`(int row, int col) {
      vec2 uv = packedUVfrom2D(`+d+", "+h[0]+", "+h[1]+`, row, col);
      return `+f.texture2D+"("+o+`, uv);
    }
  `})(r);case 3:return(function(a){var i=a.shapeInfo.logicalShape,o=a.name,s="get"+o.charAt(0).toUpperCase()+o.slice(1),u=a.shapeInfo.texShape,c=[Math.ceil(u[0]/2),Math.ceil(u[1]/2)];if(i[0]===1){var l=i.slice(1),f=Gn(a,l);return`
        `+Af(f)+`
        vec4 `+s+`(int b, int row, int col) {
          return `+s+"("+Hn(["b","row","col"],[1,2])+`);
        }
      `}var h=c[0],d=c[1],p=Math.ceil(i[2]/2),v=p*Math.ceil(i[1]/2),m=Ct();return`
    vec4 `+s+`(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        `+h+", "+d+", "+v+", "+p+`, b, row, col);
      return `+m.texture2D+"("+o+`, uv);
    }
  `})(r);default:return(function(a){for(var i=a.shapeInfo.logicalShape,o=i.length,s=a.name,u="get"+s.charAt(0).toUpperCase()+s.slice(1),c=a.shapeInfo.texShape,l=[Math.ceil(c[0]/2),Math.ceil(c[1]/2)],f=l[0],h=l[1],d=Math.ceil(i[o-1]/2),p=d*Math.ceil(i[o-2]/2),v="int b, int row, int col",m="b * "+p+" + (row / 2) * "+d+" + (col / 2)",g=2;g<o-1;g++)v="int b"+g+", "+v,p*=i[o-g-1],m="b"+g+" * "+p+" + "+m;var x=Ct();return`
    vec4 `+u+"("+v+`) {
      int index = `+m+`;
      int texR = index / `+h+`;
      int texC = index - texR * `+h+`;
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+h+", "+f+`);
      return `+x.texture2D+"("+s+`, uv);
    }
  `})(r)}}var Nv=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Ov=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Lv=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,Uv=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function un(r){return"offset"+r}function Nn(r){var t=r.name,e=re(r.shapeInfo.logicalShape);return e<2?"return "+t+";":`
    for (int i = 0; i < `+e+`; i++) {
      if (i == index) {
        return `+t+`[i];
      }
    }
  `}function Oe(r){if(r<=1)return"int";if(r===2)return"ivec2";if(r===3)return"ivec3";if(r===4)return"ivec4";if(r===5)return"ivec5";if(r===6)return"ivec6";throw Error("GPU for rank "+r+" is not yet supported")}function Gn(r,t){var e=JSON.parse(JSON.stringify(r));return e.shapeInfo.logicalShape=t,e}function Hn(r,t){return t.map((function(e){return r[e]})).join(", ")}var Gv=function(r,t,e,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,C(r.length>2,(function(){return"Packed arg"+(e.charAt(0).toUpperCase()+e.slice(1))+" supports only inputs with rank above 2."}));var a=r[r.length-1],i=Math.ceil(a/t);this.outputShape=r.slice(0,-1),i>1&&this.outputShape.push(i),n||this.variableNames.push("bestIndicesA");var o,s,u=this.outputShape,c=u.length,l=Oe(c),f=Nt("coords",c);if(i===1){var h=Oe(s=c+1);o=`
        `+h+" sourceLocR = "+h+"("+f.join()+`, 0);
        ++`+f[c-1]+`;
        `+h+" sourceLocG = "+h+"("+f.join()+`, 0);
        ++`+f[c-2]+`;
        `+h+" sourceLocA = "+h+"("+f.join()+`, 0);
        --`+f[c-1]+`;
        `+h+" sourceLocB = "+h+"("+f.join()+`, 0);
        --`+f[c-2]+";"}else s=c,o=`
        `+l+` sourceLocR = coords;
        ++`+f[c-1]+`;
        `+l+` sourceLocG = coords;
        ++`+f[c-2]+`;
        `+l+` sourceLocA = coords;
        --`+f[c-1]+`;
        `+l+` sourceLocB = coords;
        --`+f[c-2]+";";var d=["x","y","z","w","u","v"].slice(0,s),p="."+d[s-1],v=d.map((function(T){return"int "+T})),m=Nt("sourceLocR",s-1).concat("inIdx.r"),g=Nt("sourceLocG",s-1).concat("inIdx.g"),x=Nt("sourceLocB",s-1).concat("inIdx.b"),w=Nt("sourceLocA",s-1).concat("inIdx.a"),y=e==="max"?"greaterThan":"lessThan",b=n?"":`
          inIdx = round(vec4(getBestIndicesAChannel(`+m.join()+`),
                             getBestIndicesAChannel(`+g.join()+`),
                             getBestIndicesAChannel(`+x.join()+`),
                             getBestIndicesAChannel(`+w.join()+")));",A=`vec4(
            getAChannel(`+m.join()+`),
            hasNextCol ? getAChannel(`+g.join()+`) : 0.,
            hasNextRow ? getAChannel(`+x.join()+`) : 0.,
            hasNextRow && hasNextCol ? getAChannel(`+w.join()+") : 0.)",I=n?"":`
      float getBestIndicesAChannel(`+v.join()+`) {
        return getChannel(getBestIndicesA(`+d.join()+`),
                                          vec2(`+d.slice(-2).join()+`));
      }`;this.userCode=`
      float getAChannel(`+v.join()+`) {
        return getChannel(getA(`+d.join()+`),
                               vec2(`+d.slice(-2).join()+`));
      }
      `+I+`
      void main() {
        `+l+` coords = getOutputCoords();
        bool hasNextCol = `+f[c-1]+" < "+(u[c-1]-1)+`;
        bool hasNextRow = `+f[c-2]+" < "+(u[c-2]-1)+`;
        `+o+`
        ivec4 srcIdx = ivec4(sourceLocR`+p+", sourceLocG"+p+`,
          sourceLocB`+p+", sourceLocA"+p+") * "+t+`;
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = `+A+`;

        for (int i = 0; i < `+t+`; i++) {
          inIdx = srcIdx;
          `+b+`
          vec4 candidate = `+A+`;
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(`+y+`(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `},Hv=function(r){this.variableNames=["dy"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,a=r.strideWidth,i=r.dilationHeight,o=r.dilationWidth,s=r.effectiveFilterHeight,u=r.effectiveFilterWidth,c=s-1-r.padInfo.top,l=u-1-r.padInfo.left,f=1/(t*e);this.userCode=`
      const ivec2 pads = ivec2(`+c+", "+l+`);
      const float avgMultiplier = float(`+f+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+s+`;
            wR += `+i+`) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < `+u+`;
            wC+= `+o+`) {
            float dyC = float(dyCCorner + wC) / `+a+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `},zv=function(r){this.variableNames=["dy"],this.outputShape=r.inShape;var t=r.filterDepth,e=r.filterHeight,n=r.filterWidth,a=r.strideDepth,i=r.strideHeight,o=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,c=r.dilationWidth,l=r.effectiveFilterDepth,f=r.effectiveFilterHeight,h=r.effectiveFilterWidth,d=l-1-r.padInfo.front,p=f-1-r.padInfo.top,v=h-1-r.padInfo.left,m=1/(t*e*n);this.userCode=`
      const ivec3 pads = ivec3(`+d+", "+p+", "+v+`);
      const float avgMultiplier = float(`+m+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < `+l+`;
            wD += `+s+`) {
          float dyD = float(dyDCorner + wD) / `+a+`.0;

          if (dyD < 0.0 || dyD >= `+r.outDepth+`.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < `+f+`;
              wR += `+u+`) {
            float dyR = float(dyRCorner + wR) / `+i+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < `+h+`;
                wC += `+c+`) {
              float dyC = float(dyCCorner + wC) / `+o+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `},Wv=function(r,t,e,n,a,i){this.outputShape=[],this.variableNames=["x","mean","variance"],xe(r,t),xe(r,e);var o="0.0";n!=null&&(xe(r,n),this.variableNames.push("offset"),o="getOffsetAtOutCoords()");var s="1.0";a!=null&&(xe(r,a),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=r,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = `+o+`;
        float scale = `+s+`;
        float inv = scale * inversesqrt(variance + float(`+i+`));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `},Vv=function(r,t,e,n,a,i){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],xe(r,t),xe(r,e);var o="vec4(0.0)";n!=null&&(xe(r,n),this.variableNames.push("offset"),o="getOffsetAtOutCoords()");var s="vec4(1.0)";a!=null&&(xe(r,a),this.variableNames.push("scale"),s="getScaleAtOutCoords()"),this.outputShape=r,this.userCode=`
      void main() {
        vec4 offset = `+o+`;
        vec4 scale = `+s+`;

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(`+i+`));

        setOutput((x - mean) * inv + offset);
      }
    `},Xv="return areal * breal - aimag * bimag;",Kv="return areal * bimag + aimag * breal;",Bc=function(r,t,e){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=xe(t,e),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        `+r+`
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `},os="return a + b;",ss="return a - b;",_c="return a * b;",Ef="return (a < 0.) ? b * a : a;",Ye=function(r,t,e){this.variableNames=["A","B"],this.outputShape=xe(t,e),this.userCode=`
      float binaryOperation(float a, float b) {
        `+r+`
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `},Cf=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,Ir=function(r,t,e,n){n===void 0&&(n=!1),this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=xe(t,e);var a=this.outputShape.length,i="";if(n)if(a===0||re(this.outputShape)===1)i=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else if(i=`
          `+Oe(a)+` coords = getOutputCoords();
        `,a===1)i+=`
            result.y = (coords + 1) >= `+this.outputShape[0]+` ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{var o=Nt("coords",a);i+=`
            bool nextRowOutOfBounds =
              (`+o[a-2]+" + 1) >= "+this.outputShape[a-2]+`;
            bool nextColOutOfBounds =
              (`+o[a-1]+" + 1) >= "+this.outputShape[a-1]+`;
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        `+r+`
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        `+i+`

        setOutput(result);
      }
    `},jv=(function(){function r(t){this.variableNames=["A"],this.outputShape=t,this.userCode=`
      uniform float minVal;
      uniform float maxVal;

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}return r.prototype.getCustomSetupFunc=function(t,e){var n=this;return function(a,i){n.minLoc==null&&(n.minLoc=a.getUniformLocationNoThrow(i,"minVal"),n.maxLoc=a.getUniformLocationNoThrow(i,"maxVal")),a.gl.uniform1f(n.minLoc,t),a.gl.uniform1f(n.maxLoc,e)}},r})(),Yv=(function(){function r(t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.userCode=`
      uniform float minVal;
      uniform float maxVal;

      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}return r.prototype.getCustomSetupFunc=function(t,e){var n=this;return function(a,i){n.minLoc==null&&(n.minLoc=a.getUniformLocationNoThrow(i,"minVal"),n.maxLoc=a.getUniformLocationNoThrow(i,"maxVal")),a.gl.uniform1f(n.minLoc,t),a.gl.uniform1f(n.maxLoc,e)}},r})(),Qv=function(r){this.variableNames=["real","imag"],this.outputShape=r,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `},qv=function(r){this.outputShape=[],this.outputShape=gn(r,1),this.variableNames=r.map((function(s,u){return"T"+u}));var t=new Array(r.length-1);t[0]=r[0][1];for(var e=1;e<t.length;e++)t[e]=t[e-1]+r[e][1];var n=["if (yC < "+t[0]+") setOutput(getT0(yR, yC));"];for(e=1;e<t.length;e++){var a=t[e-1];n.push("else if (yC < "+t[e]+") setOutput(getT"+e+"(yR, yC-"+a+"));")}var i=t.length,o=t[t.length-1];n.push("else setOutput(getT"+i+"(yR, yC-"+o+"));"),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        `+n.join(`
        `)+`
      }
    `},Zv=function(r,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=gn(r,t);var e=this.outputShape,n=e.length,a=Oe(n),i=Nt("coords",n),o=["x","y","z","w","u","v"].slice(0,n);this.variableNames=r.map((function(m,g){return"T"+g}));var s=new Array(r.length-1);s[0]=r[0][t];for(var u=1;u<s.length;u++)s[u]=s[u-1]+r[u][t];var c=o[t],l=o.slice(-2),f=o.join(),h="if ("+c+" < "+s[0]+`) {
        return getChannel(
            getT0(`+f+"), vec2("+l.join()+`));
        }`;for(u=1;u<s.length;u++){var d=s[u-1];h+=`
        if (`+c+" < "+s[u]+"  && "+c+" >= "+s[u-1]+`) {
          return getChannel(
            getT`+u+"("+Ri(o,c,d)+`),
            vec2(`+Ri(l,c,d)+`));
        }`}var p=s.length,v=s[s.length-1];h+=`
        return getChannel(
          getT`+p+"("+Ri(o,c,v)+`),
          vec2(`+Ri(l,c,v)+"));",this.userCode=`
      float getValue(`+o.map((function(m){return"int "+m}))+`) {
        `+h+`
      }

      void main() {
        `+a+` coords = getOutputCoords();
        vec4 result = vec4(getValue(`+i+`), 0., 0., 0.);

        `+i[n-1]+" = "+i[n-1]+` + 1;
        if (`+i[n-1]+" < "+e[n-1]+`) {
          result.g = getValue(`+i+`);
        }

        `+i[n-2]+" = "+i[n-2]+` + 1;
        if (`+i[n-2]+" < "+e[n-2]+`) {
          result.a = getValue(`+i+`);
        }

        `+i[n-1]+" = "+i[n-1]+` - 1;
        if (`+i[n-2]+" < "+e[n-2]+` &&
            `+i[n-1]+" < "+e[n-1]+`) {
          result.b = getValue(`+i+`);
        }
        setOutput(result);
      }
    `};function Ri(r,t,e){var n=r.indexOf(t);return r.map((function(a,i){return i===n?a+" - "+e:a})).join()}var Jv=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideHeight,e=r.strideWidth,n=r.padInfo.top,a=r.padInfo.left,i=r.dataFormat==="channelsLast";this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yR = 0; yR < `+r.outHeight+`; yR++) {
            int xR = wR + yR * `+t+" - "+n+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int yC = 0; yC < `+r.outWidth+`; yC++) {
              int xC = wC + yC * `+e+" - "+a+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              if (`+i+`) {
                float dyValue = getDy(b, yR, yC, d2);
                float xValue = getX(b, xR, xC, d1);
                dotProd += (xValue * dyValue);
              } else {
                float dyValue = getDy(b, d2, yR, yC);
                float xValue = getX(b, d1, xR, xC);
                dotProd += (xValue * dyValue);
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `},$v=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,a=r.strideWidth,i=r.dataFormat==="channelsLast",o=t-1-r.padInfo.top,s=e-1-r.padInfo.left,u=i?1:2,c=i?2:3,l=i?3:1;this.userCode=`
      const ivec2 pads = ivec2(`+o+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[`+l+`];

        ivec2 dyCorner = ivec2(coords[`+u+"], coords["+c+`]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+t+`; wR++) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = `+t+` - 1 - wR;

          for (int wC = 0; wC < `+e+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+a+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = `+e+` - 1 - wC;

            for (int d2 = 0; d2 < `+r.outChannels+`; d2++) {

              if (`+i+`) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `},em=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideDepth,e=r.strideHeight,n=r.strideWidth,a=r.padInfo.front,i=r.padInfo.top,o=r.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yF = 0; yF < `+r.outDepth+`; yF++) {
            int xF = wF + yF * `+t+" - "+a+`;

            if (xF < 0 || xF >= `+r.inDepth+`) {
              continue;
            }

            for (int yR = 0; yR < `+r.outHeight+`; yR++) {
              int xR = wR + yR * `+e+" - "+i+`;

              if (xR < 0 || xR >= `+r.inHeight+`) {
                continue;
              }

              for (int yC = 0; yC < `+r.outWidth+`; yC++) {
                int xC = wC + yC * `+n+" - "+o+`;

                if (xC < 0 || xC >= `+r.inWidth+`) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},tm=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterDepth,e=r.filterHeight,n=r.filterWidth,a=r.strideDepth,i=r.strideHeight,o=r.strideWidth,s=t-1-r.padInfo.front,u=e-1-r.padInfo.top,c=n-1-r.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(`+s+", "+u+", "+c+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < `+t+`; wF++) {
          float dyF = float(dyFCorner + wF) / `+a+`.0;

          if (dyF < 0.0 || dyF >= `+r.outDepth+`.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = `+t+` - 1 - wF;

          for (int wR = 0; wR < `+e+`; wR++) {
            float dyR = float(dyRCorner + wR) / `+i+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = `+e+` - 1 - wR;

            for (int wC = 0; wC < `+n+`; wC++) {
              float dyC = float(dyCCorner + wC) / `+o+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = `+n+` - 1 - wC;

              for (int d2 = 0; d2 < `+r.outChannels+`; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},rm=function(r){this.variableNames=["x","dy"],this.outputShape=r.filterShape;var t=r.strideHeight,e=r.strideWidth,n=r.padInfo.top,a=r.padInfo.left,i=r.outChannels/r.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * `+i+` + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < `+r.batchSize+`; b++) {
          for (int yR = 0; yR < `+r.outHeight+`; yR++) {
            int xR = wR + yR * `+t+" - "+n+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int yC = 0; yC < `+r.outWidth+`; yC++) {
              int xC = wC + yC * `+e+" - "+a+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `},nm=function(r){this.variableNames=["dy","W"],this.outputShape=r.inShape;var t=r.filterHeight,e=r.filterWidth,n=r.strideHeight,a=r.strideWidth,i=t-1-r.padInfo.top,o=e-1-r.padInfo.left,s=r.outChannels/r.inChannels;this.userCode=`
      const ivec2 pads = ivec2(`+i+", "+o+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < `+t+`; wR++) {
          float dyR = float(dyRCorner + wR) / `+n+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = `+t+` - 1 - wR;

          for (int wC = 0; wC < `+e+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+a+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = `+e+` - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < `+s+`; dm++) {
              int d2 = d1 * `+s+` + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `},Pc=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.outputShape=r.outShape;var a=r.padInfo.top,i=r.padInfo.left,o=r.strideHeight,s=r.strideWidth,u=r.dilationHeight,c=r.dilationWidth,l=r.filterHeight,f=r.filterWidth,h=4*Math.floor(r.inChannels/4),d=r.inChannels%4,p=r.dataFormat==="channelsLast",v=p?1:2,m=p?2:3,g=p?3:1,x="",w="";e&&(x=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`
          float activation(float x) {
            `+e+`
          }
        `,w="result = activation(result);");var y=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+x+`

      const ivec2 strides = ivec2(`+o+", "+s+`);
      const ivec2 pads = ivec2(`+a+", "+i+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[`+g+`];

        ivec2 xRCCorner =
            ivec2(coords[`+v+"], coords["+m+`]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+l+`; wR++) {
          int xR = xRCorner + wR * `+u+`;

          if (xR < 0 || xR >= `+r.inHeight+`) {
            continue;
          }

          for (int wC = 0; wC < `+f+`; wC++) {
            int xC = xCCorner + wC * `+c+`;

            if (xC < 0 || xC >= `+r.inWidth+`) {
              continue;
            }

            for (int d1 = 0; d1 < `+h+`; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (`+p+`) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (`+(d===1)+`) {

              if (`+p+`) {
                dotProd +=
                    getX(batch, xR, xC, `+h+`) *
                    getW(wR, wC, `+h+`, d2);
              } else {
                dotProd +=
                    getX(batch, `+h+`, xR, xC) *
                    getW(wR, wC, `+h+`, d2);
              }

            } else if (`+(d===2)+`) {
              vec2 wValues = vec2(
                getW(wR, wC, `+h+`, d2),
                getW(wR, wC, `+h+` + 1, d2)
              );

              if (`+p+`) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, `+h+`),
                  getX(batch, xR, xC, `+h+` + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, `+h+`, xR, xC),
                  getX(batch, `+h+` + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (`+(d===3)+`) {
              vec3 wValues = vec3(
                getW(wR, wC, `+h+`, d2),
                getW(wR, wC, `+h+` + 1, d2),
                getW(wR, wC, `+h+` + 2, d2)
              );

              if (`+p+`) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, `+h+`),
                  getX(batch, xR, xC, `+h+` + 1),
                  getX(batch, xR, xC, `+h+` + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, `+h+`, xR, xC),
                  getX(batch, `+h+` + 1, xR, xC),
                  getX(batch, `+h+` + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        `+y+`
        `+w+`
        setOutput(result);
      }
    `},am=function(r){this.variableNames=["x","W"],this.outputShape=r.outShape;var t=r.padInfo.front,e=r.padInfo.top,n=r.padInfo.left,a=r.strideDepth,i=r.strideHeight,o=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,c=r.dilationWidth,l=r.filterDepth,f=r.filterHeight,h=r.filterWidth,d=4*Math.floor(r.inChannels/4),p=r.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(`+a+", "+i+", "+o+`);
      const ivec3 pads = ivec3(`+t+", "+e+", "+n+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < `+l+`; wF++) {
          int xF = xFCorner + wF * `+s+`;

          if (xF < 0 || xF >= `+r.inDepth+`) {
            continue;
          }

          for (int wR = 0; wR < `+f+`; wR++) {
            int xR = xRCorner + wR * `+u+`;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+h+`; wC++) {
              int xC = xCCorner + wC * `+c+`;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              for (int d1 = 0; d1 < `+d+`; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (`+(p===1)+`) {
                dotProd +=
                  getX(batch, xF, xR, xC, `+d+`) *
                  getW(wF, wR, wC, `+d+`, d2);
              } else if (`+(p===2)+`) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, `+d+`),
                  getX(batch, xF, xR, xC, `+d+` + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, `+d+`, d2),
                  getW(wF, wR, wC, `+d+` + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (`+(p===3)+`) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, `+d+`),
                  getX(batch, xF, xR, xC, `+d+` + 1),
                  getX(batch, xF, xR, xC, `+d+` + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, `+d+`, d2),
                  getW(wF, wR, wC, `+d+` + 1, d2),
                  getW(wF, wR, wC, `+d+` + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `},Fc=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.outputShape=r.outShape;var a=r.inHeight,i=r.inWidth,o=r.padInfo.top,s=r.padInfo.left,u=r.strideHeight,c=r.strideWidth,l=r.dilationHeight,f=r.dilationWidth,h=r.filterHeight,d=r.filterWidth,p=r.outChannels/r.inChannels,v="",m="";e&&(v=n?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`
          float activation(float x) {
            `+e+`
          }
        `,m="result = activation(result);");var g=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+v+`

      const ivec2 strides = ivec2(`+u+", "+c+`);
      const ivec2 pads = ivec2(`+o+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / `+p+`;
        int q = d2 - d1 * `+p+`;

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < `+h+`; wR++) {
          int xR = xRCorner + wR * `+l+`;

          if (xR < 0 || xR >= `+a+`) {
            continue;
          }

          for (int wC = 0; wC < `+d+`; wC++) {
            int xC = xCCorner + wC * `+f+`;

            if (xC < 0 || xC >= `+i+`) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        `+g+`
        `+m+`
        setOutput(result);
      }
    `},kc=function(r,t,e,n){t===void 0&&(t=!1),e===void 0&&(e=null),n===void 0&&(n=!1),this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r.outShape;for(var a=r.inHeight,i=r.inWidth,o=r.padInfo.top,s=r.padInfo.left,u=r.strideHeight,c=r.strideWidth,l=r.dilationHeight,f=r.dilationWidth,h=r.filterHeight,d=r.filterWidth,p=d,v="int xR; int xC; int xCOffset;",m=0;m<h;m++)for(var g=0;g<d;g++)v+=`
          vec4 xTexelR`+m+"C"+2*g+` = vec4(0.);
          vec4 wR`+m+"C"+g+` = vec4(0.);
          vec4 xR`+m+"C"+g+" = vec4(0.);";for(m=0;m<h;m++)for(var x=0;x<p;x++){if(v+=`
          xR = xRCorner + `+m*l+`;
          xC = xCCorner + `+(g=2*x)*f+`;
        `,c===1){if(g<d&&(v+=s%2==1?`
                xCOffset = xC + 1;
                if(xR >= 0 && xR < `+a+" && xCOffset >= 0 && xCOffset < "+i+`) {
                  xTexelR`+m+"C"+g+` = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if(xCOffset + 1 >= `+i+`) {
                    xTexelR`+m+"C"+g+`.zw = vec2(0.);
                  }
                } else {
                  xTexelR`+m+"C"+g+` = vec4(0.);
                }

                xCOffset = xC + 1 - 2;
                if(xR >= 0 && xR < `+a+" && xCOffset >= 0 && xCOffset < "+i+`) {
                  vec4 previous = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if(xCOffset + 1 >= `+i+`) {
                    previous.zw = vec2(0.);
                  }

                  xR`+m+"C"+g+" = vec4(previous.zw, xTexelR"+m+"C"+g+`.xy);
                } else {
                  xR`+m+"C"+g+" = vec4(0, 0, xTexelR"+m+"C"+g+`.xy);
                }
              `:`
                if(xR >= 0 && xR < `+a+" && xC >= 0 && xC < "+i+`) {
                  xTexelR`+m+"C"+g+` = getX(batch, xR, xC, d1);
                } else {
                  xTexelR`+m+"C"+g+` = vec4(0.);
                }

                xR`+m+"C"+g+" = xTexelR"+m+"C"+g+`;
              `,g+1<d)){var w=s%2==0?Vs(f):f;f%2==0&&s%2==1||f%2!=0&&s%2!=1?(v+=`
                  xCOffset = xC + `+s%2+" + "+w+`;

                  if(xR >= 0 && xR < `+a+` &&
                    xCOffset >= 0 && xCOffset < `+i+`) {
                    xTexelR`+m+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                  }
                `,f>1&&(v+=`
                    xCOffset -= 2;
                    if(xR >= 0 && xR < `+a+` &&
                      xCOffset >= 0 && xCOffset < `+i+`) {
                      xTexelR`+m+"C"+g+` = getX(batch, xR, xCOffset, d1);
                    } else {
                      xTexelR`+m+"C"+g+` = vec4(0.);
                    }
                  `),v+=`
                  xR`+m+"C"+(g+1)+` = vec4(
                    xTexelR`+m+"C"+g+".zw, xTexelR"+m+"C"+(g+2)+`.xy);
                `):v+=`
                  xCOffset = xC + `+w+`;

                  if(xR >= 0 && xR < `+a+` &&
                    xCOffset >= 0 && xCOffset < `+i+`) {
                    xTexelR`+m+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                  }

                  xR`+m+"C"+(g+1)+" = xTexelR"+m+"C"+(g+2)+`;
                `}}else g<d&&(v+=`
              if(xR >= 0 && xR < `+a+`) {
            `,s%2==1?(v+=`
                xCOffset = xC + 1 - `+c+`;
                if(xCOffset >= 0 && xCOffset < `+i+`) {
                  xTexelR`+m+"C"+g+` = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR`+m+"C"+g+` = vec4(0.);
                }

                if(xC + 1 >= 0 && xC + 1 < `+i+`) {
                  xTexelR`+m+"C"+(g+2)+` = getX(batch, xR, xC + 1, d1);
                } else {
                  xTexelR`+m+"C"+(g+2)+` = vec4(0.);
                }

                xR`+m+"C"+g+` = vec4(
                  xTexelR`+m+"C"+g+".zw, xTexelR"+m+"C"+(g+2)+`.zw);
              `,g+1<d&&(v+=`
                  vec4 final = vec4(0.);
                  xCOffset = xC + 1 + `+c+`;
                  if(xCOffset >= 0 && xCOffset < `+i+`) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xR`+m+"C"+(g+1)+" = vec4(xTexelR"+m+"C"+(g+2)+`.xy, final.xy);
                `)):(v+=`
                if(xC >= 0 && xC < `+i+`) {
                  xTexelR`+m+"C"+g+` = getX(batch, xR, xC, d1);
                } else {
                  xTexelR`+m+"C"+g+` = vec4(0.);
                }

                xCOffset = xC + `+c+`;
                if(xCOffset >= 0 && xCOffset < `+i+`) {
                  xTexelR`+m+"C"+(g+2)+` = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR`+m+"C"+(g+2)+` = vec4(0.);
                }

                xR`+m+"C"+g+` = vec4(
                  xTexelR`+m+"C"+g+".xy, xTexelR"+m+"C"+(g+2)+`.xy);
              `,g+1<d&&(v+=`
                  xR`+m+"C"+(g+1)+` = vec4(
                    xTexelR`+m+"C"+g+".zw, xTexelR"+m+"C"+(g+2)+`.zw);
                `)),v+="}");g<d&&(v+=`
            vec4 wTexelR`+m+"C"+g+" = getW("+m+", "+g+`, d1, q);
            wR`+m+"C"+g+" = vec4(wTexelR"+m+"C"+g+".xz, wTexelR"+m+"C"+g+`.xz);
          `,g+1<d&&(v+=`
              vec4 wTexelR`+m+"C"+(g+1)+" = getW("+m+", "+(g+1)+`, d1, q);
              wR`+m+"C"+(g+1)+` =
                vec4(wTexelR`+m+"C"+(g+1)+".xz, wTexelR"+m+"C"+(g+1)+".xz);"))}for(m=0;m<h;m++)for(g=0;g<d;g++)v+="dotProd += xR"+m+"C"+g+" * wR"+m+"C"+g+";";var y="",b="";e&&(y=n?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          `+e+`
        }`:`vec4 activation(vec4 x) {
          `+e+`
        }`,b="result = activation(result);");var A=t?"result += getBiasAtOutCoords();":"";t&&this.variableNames.push("bias"),n&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+y+`

      const ivec2 strides = ivec2(`+u+", "+c+`);
      const ivec2 pads = ivec2(`+o+", "+s+`);

      void main() {

        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2;
        int q = 0;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        vec4 dotProd = vec4(0.);

        `+v+`

        vec4 result = dotProd;
        `+A+`
        `+b+`
        setOutput(result);
      }
    `},im=function(r,t,e,n,a){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];var i=r[0],o=r[1],s=r[2],u=r[3],c=t[0],l=e[0],f=e[1];this.outputShape=[c,l,f,u];var h=n==="bilinear"?1:0,d=[o-1+".0",s-1+".0"],p=d[0],v=d[1],m=l>1?[""+(o-1)/(l-1),"(y2-y1) * height_ratio","y1*"+p+" + float(y)*(height_scale)"]:["0.0","0.0","0.5 * (y1+y2) * "+p],g=m[0],x=m[1],w=m[2],y=f>1?[""+(s-1)/(f-1),"(x2-x1) * width_ratio","x1*"+v+" + float(x)*(width_scale)"]:["0.0","0.0","0.5 * (x1+x2) * "+v],b=y[0],A=y[1],I=y[2];this.userCode=`
      const float height_ratio = float(`+g+`);
      const float width_ratio = float(`+b+`);
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= `+i+`) {
          return;
        }

        float height_scale = `+x+`;
        float width_scale = `+A+`;

        float in_y = `+w+`;
        if( in_y < 0.0 || in_y > `+p+` ) {
          setOutput(float(`+a+`));
          return;
        }
        float in_x = `+I+`;
        if( in_x < 0.0 || in_x > `+v+` ) {
          setOutput(float(`+a+`));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(`+h+` == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `},om=function(r,t,e){this.variableNames=["x"],this.outputShape=r;var n=r.length,a=r[r.length-1],i=e?"<":">";this.userCode=`
      int getIndex(int i) {
        `+(e?"return "+a+" -i - 1;":"return i;")+`
      }

      void main() {
        `+Oe(n)+` coords = getOutputCoords();
        int end = `+Nc(n,"coords")+`;
        float val = 0.0;
        for (int i = `+a+` - 1; i >= 0; i -= 1) {
          int idx = getIndex(i);
          if (idx `+i+` end) {
            continue;
          }
          if (idx == end && `+t+`) {
            continue;
          }
          `+Nc(n,"coords")+` = idx;
          val += getX(`+(function(o,s){if(o===1)return""+s;if(o===2)return s+".x, "+s+".y";if(o===3)return s+".x, "+s+".y, "+s+".z";if(o===4)return s+".x, "+s+".y, "+s+".z, "+s+".w";throw Error("Cumulative sum for rank "+o+" is not yet supported")})(n,"coords")+`);
        }
        setOutput(val);
      }
    `};function Nc(r,t){if(r===1)return""+t;if(r===2)return t+".y";if(r===3)return t+".z";if(r===4)return t+".w";throw Error("Cumulative sum for rank "+r+" is not yet supported")}var sm=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=La.DENSE;var t=Pa(r),e=Ct();this.outputShape=r,this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        `+hn(["r","c","d"],r)+`
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx *
          vec2(`+t[0]+", "+t[1]+`));
        int index = 4 * (resTexRC.x * `+t[1]+` + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        `+e.output+` = result;
      }
    `},um=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=La.DENSE;var t=Pa(r),e=Ct();this.outputShape=r,this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        `+hn(["r","c","d"],r)+`
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx *
          vec2(`+t[0]+", "+t[1]+`));
        int index = 4 * (resTexRC.x * `+t[1]+` + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        `+e.output+` = result;
      }
    `},cm=(function(){function r(t,e,n){this.variableNames=["x"],this.outputShape=[],this.outputShape=t,this.blockSize=e,this.dataFormat=n,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = `+this.getHeightCoordString()+`;
      int w = `+this.getWidthCoordString()+`;
      int d = `+this.getDepthCoordString()+`;

      int in_h = h / `+e+`;
      int offset_h = imod(h, `+e+`);
      int in_w = w / `+e+`;
      int offset_w = imod(w, `+e+`);
      int offset_d = (offset_h * `+e+` + offset_w) *
        `+this.getOutputDepthSize()+`;
      int in_d = d + offset_d;

      float result = `+this.getInputSamplingString()+`;
      setOutput(result);
    }
  `}return r.prototype.getHeightCoordString=function(){return this.dataFormat==="NHWC"?"coords[1]":"coords[2]"},r.prototype.getWidthCoordString=function(){return this.dataFormat==="NHWC"?"coords[2]":"coords[3]"},r.prototype.getDepthCoordString=function(){return this.dataFormat==="NHWC"?"coords[3]":"coords[1]"},r.prototype.getOutputDepthSize=function(){return this.dataFormat==="NHWC"?this.outputShape[3]:this.outputShape[1]},r.prototype.getInputSamplingString=function(){return this.dataFormat==="NHWC"?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"},r})(),lm=function(r){this.variableNames=["X"],this.outputShape=[r,r],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `},fm=function(r){this.variableNames=["A"],this.outTexUsage=Kt.DOWNLOAD;var t=Ct();this.outputShape=r,this.userCode=`
      `+bf+`

      void main() {
        float x = getAAtOutCoords();
        `+t.output+` = encode_float(x);
      }
    `},hm=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=Kt.DOWNLOAD;var t=Ct();this.outputShape=r,this.userCode=`
      `+bf+`

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        `+t.output+` = encode_float(x);
      }
    `},dm=function(r,t,e){e===void 0&&(e=!1),this.variableNames=["A"];var n=Ct(),a=t[0],i=t[1];this.outputShape=r;var o="result";e&&(o="floor(result * 255. + 0.5)"),this.userCode=`
      `+lu(r)+`

      void main() {
        ivec3 coords = getOutputCoords();

        int flatIndex = getFlatIndex(coords);
        int offset = imod(flatIndex, 4);

        flatIndex = idiv(flatIndex, 4, 1.);
        
        int r = flatIndex / `+i+`;
        int c = imod(flatIndex, `+i+`);
        vec2 uv = (vec2(c, r) + halfCR) / vec2(`+i+".0, "+a+`.0);
        vec4 values = `+n.texture2D+`(A, uv);

        float result;

        if(offset == 0) {
          result = values[0];
        } else if(offset == 1) {
          result = values[1];
        } else if(offset == 2) {
          result = values[2];
        } else {
          result = values[3];
        }

        `+n.output+" = vec4("+o+`, 0., 0., 0.);
      }
    `},pm=function(r,t,e){e===void 0&&(e=!1),this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;var n=Ct(),a=t[0],i=t[1];this.outputShape=r;var o="",s="result";e&&(s="floor(result * 255. + 0.5)");for(var u=0;u<=1;u++)for(var c=0;c<=1;c++){var l=2*u+c;o+=`
          localCoords = coords;
          if(localCoords[2] + `+c+" < "+r[2]+`) {
            localCoords[2] += `+c+`;
            if(localCoords[1] + `+u+" < "+r[1]+`) {
              localCoords[1] += `+u+`;

              flatIndex = getFlatIndex(localCoords);
              offset = imod(flatIndex, 4);

              flatIndex = idiv(flatIndex, 4, 1.);

              r = flatIndex / `+i+`;
              c = imod(flatIndex, `+i+`);
              uv = (vec2(c, r) + halfCR) / vec2(`+i+".0, "+a+`.0);
              values = `+n.texture2D+`(A, uv);

              if(offset == 0) {
                result[`+l+`] = values[0];
              } else if(offset == 1) {
                result[`+l+`] = values[1];
              } else if(offset == 2) {
                result[`+l+`] = values[2];
              } else {
                result[`+l+`] = values[3];
              }
            }
          }
        `}this.userCode=`
      `+lu(r)+`

      void main() {
        ivec3 coords = getOutputCoords();

        vec4 result = vec4(0.);
        int flatIndex, r, c, offset;
        ivec3 localCoords;
        vec2 uv;
        vec4 values;

        `+o+`

        `+n.output+" = "+s+`;
      }
    `},vm="return real * expR - imag * expI;",mm="return real * expI + imag * expR;",Oc=function(r,t,e){this.variableNames=["real","imag"];var n=t[1];this.outputShape=t;var a=e?"2.0 * "+Math.PI:"-2.0 * "+Math.PI,i=e?n+".0":"1.0";this.userCode=`
      const float exponentMultiplier = `+a+`;

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        `+r+`
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(`+n+`);
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < `+n+`; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / `+i+`;
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `},gm=(function(){function r(t,e){this.outputShape=[],this.variableNames=["x"],this.outputShape=t,this.userCode=`
      uniform float value;
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;return function(n,a){e.valueLoc==null&&(e.valueLoc=n.getUniformLocationNoThrow(a,"value")),n.gl.uniform1f(e.valueLoc,t)}},r})(),xm=function(r,t,e){this.variableNames=["A","indices"];var n=r.slice();n[e]=t,this.outputShape=n,this.rank=n.length;var a=Oe(this.rank),i=(function(o,s){var u=o.length;if(u>4)throw Error("Gather for rank "+u+" is not yet supported");if(u===1)return"int(getIndices(resRC))";for(var c=["resRC.x","resRC.y","resRC.z","resRC.w"],l=[],f=0;f<o.length;f++)f===s?l.push("int(getIndices("+c[f]+"))"):l.push(""+c[f]);return l.join()})(r,e);this.userCode=`
      void main() {
        `+a+` resRC = getOutputCoords();
        setOutput(getA(`+i+`));
      }
    `},ym=function(r,t,e){this.sliceDim=r,this.strides=t,this.variableNames=["x","indices"],this.outputShape=e;var n=Oe(t.length),a=Oe(e.length),i=this.sliceDim>1?"strides[j]":"strides";this.userCode=`
        `+n+" strides = "+n+"("+this.strides+`);
         void main() {
          `+a+` coords = getOutputCoords();
          int flattenIndex = 0;
          for (int j = 0; j < `+this.sliceDim+`; j++) {
            int index = round(getIndices(coords[0], j));
            flattenIndex += index * `+i+`;
          }
          setOutput(getX(flattenIndex, coords[1]));
        }
      `};function Sf(r,t){var e=Ct();return Rl(r,t,e.version+`
    precision highp float;
    `+e.attribute+` vec3 clipSpacePos;
    `+e.attribute+` vec2 uv;
    `+e.varyingVs+` vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`)}function Df(r,t){return Pl(r,t,new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]))}function Tf(r,t){return Fl(r,t,new Uint16Array([0,1,2,2,1,3]))}function Ka(r,t,e,n,a,i,o){Nl(e,n);var s=kl(r,t),u=r.TEXTURE_2D;return J(r,t,(function(){return r.bindTexture(u,s)})),J(r,t,(function(){return r.texParameteri(u,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE)})),J(r,t,(function(){return r.texParameteri(u,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)})),J(r,t,(function(){return r.texParameteri(u,r.TEXTURE_MIN_FILTER,r.NEAREST)})),J(r,t,(function(){return r.texParameteri(u,r.TEXTURE_MAG_FILTER,r.NEAREST)})),J(r,t,(function(){return r.texImage2D(u,0,a,e,n,0,i,o,null)})),J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,null)})),s}function If(r,t,e,n,a){var i=oo(e,n);return Ka(r,t,i[0],i[1],a.internalFormatFloat,a.textureFormatFloat,r.FLOAT)}function Rf(r,t,e,n,a){var i=oo(e,n);return Ka(r,t,i[0],i[1],a.internalFormatHalfFloat,a.textureFormatFloat,a.textureTypeHalfFloat)}function Mf(r,t,e,n,a){var i=oo(e,n);return Ka(r,t,i[0],i[1],r.RGBA,r.RGBA,r.UNSIGNED_BYTE)}function Bf(r,t,e,n,a){var i=Xa(e,n);return Ka(r,t,i[0],i[1],a.internalFormatPackedFloat,r.RGBA,r.FLOAT)}function _f(r,t,e,n,a){var i=Xa(e,n);return Ka(r,t,i[0],i[1],a.internalFormatPackedHalfFloat,r.RGBA,a.textureTypeHalfFloat)}function Pf(r,t,e,n){return J(r,t,(function(){return r.bindBuffer(r.ARRAY_BUFFER,n)})),Bs(r,t,e,"clipSpacePos",n,3,20,0)&&Bs(r,t,e,"uv",n,2,20,12)}function Ff(r,t,e,n,a,i,o){var s,u,c;J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,e)})),i instanceof Uint8Array?(s=new Uint8Array(n*a*4),u=r.UNSIGNED_BYTE,c=r.RGBA):(s=new Float32Array(n*a*4),u=r.FLOAT,c=o.internalFormatPackedFloat),s.set(i),J(r,t,(function(){return r.texImage2D(r.TEXTURE_2D,0,c,n,a,0,r.RGBA,u,s)})),J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,null)}))}function kf(r,t,e,n){J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,e)})),n.data instanceof Uint8Array?J(r,t,(function(){return r.texImage2D(r.TEXTURE_2D,0,r.RGBA,n.width,n.height,0,r.RGBA,r.UNSIGNED_BYTE,n.data)})):J(r,t,(function(){return r.texImage2D(r.TEXTURE_2D,0,r.RGBA,r.RGBA,r.UNSIGNED_BYTE,n)})),J(r,t,(function(){return r.bindTexture(r.TEXTURE_2D,null)}))}function Nf(r,t,e,n,a){var i=r.createBuffer();J(r,t,(function(){return r.bindBuffer(r.PIXEL_PACK_BUFFER,i)}));var o=16*e*n;return J(r,t,(function(){return r.bufferData(r.PIXEL_PACK_BUFFER,o,r.STREAM_READ)})),J(r,t,(function(){return r.readPixels(0,0,n,e,r.RGBA,r.FLOAT,0)})),J(r,t,(function(){return r.bindBuffer(r.PIXEL_PACK_BUFFER,null)})),i}function Of(r,t,e){var n=r,a=new Float32Array(e);return n.bindBuffer(n.PIXEL_PACK_BUFFER,t),n.getBufferSubData(n.PIXEL_PACK_BUFFER,0,a),n.bindBuffer(n.PIXEL_PACK_BUFFER,null),a}function Lf(r,t,e,n,a){var i=oo(e,n),o=i[0],s=i[1],u=new Uint8Array(e*n*4);return J(r,t,(function(){return r.readPixels(0,0,o,s,a.downloadTextureFormat,r.UNSIGNED_BYTE,u)})),new Float32Array(u.buffer)}function Uf(r,t,e,n,a,i,o,s){var u=r,c=new Float32Array((function(l,f){var h=Xa(l,f);return h[0]*h[1]*4})(i,o));return u.bindBuffer(u.PIXEL_PACK_BUFFER,t),u.getBufferSubData(u.PIXEL_PACK_BUFFER,0,c),u.bindBuffer(u.PIXEL_PACK_BUFFER,null),c}function Gf(r,t,e,n){var a=new Float32Array(e*n*4);return J(r,t,(function(){return r.readPixels(0,0,n,e,r.RGBA,r.FLOAT,a)})),a}var wm=Object.freeze({createVertexShader:Sf,createVertexBuffer:Df,createIndexBuffer:Tf,createFloat32MatrixTexture:If,createFloat16MatrixTexture:Rf,createUnsignedBytesMatrixTexture:Mf,createPackedMatrixTexture:Bf,createFloat16PackedMatrixTexture:_f,bindVertexProgramAttributeStreams:Pf,uploadDenseMatrixToTexture:Ff,uploadPixelDataToTexture:kf,createBufferFromOutputTexture:Nf,downloadFloat32MatrixFromBuffer:Of,downloadByteEncodedFloatMatrixFromOutputTexture:Lf,downloadPackedMatrixFromBuffer:Uf,downloadMatrixFromPackedOutputTexture:Gf}),Hf=(function(){function r(t){this.outputTexture=null,this.program=null,this.disposed=!1,this.vertexAttrsAreBound=!1,this.itemsToPoll=[];var e=k().getNumber("WEBGL_VERSION");t!=null?(this.gl=t,Dl(e,t)):this.gl=wr(e);var n="WEBGL_color_buffer_float";if(k().getNumber("WEBGL_VERSION")===1){if(this.textureFloatExtension=Ma(this.gl,this.debug,"OES_texture_float"),jt(this.gl,"OES_texture_half_float"))this.textureHalfFloatExtension=Ma(this.gl,this.debug,"OES_texture_half_float");else if(k().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(n),jt(this.gl,"EXT_color_buffer_half_float"))this.colorBufferHalfFloatExtension=Ma(this.gl,this.debug,"EXT_color_buffer_half_float");else if(k().get("WEBGL_FORCE_F16_TEXTURES"))throw new Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(n="EXT_color_buffer_float",jt(this.gl,n))this.colorBufferFloatExtension=this.gl.getExtension(n);else{if(!jt(this.gl,"EXT_color_buffer_half_float"))throw new Error("GL context does not support color renderable floats");this.colorBufferHalfFloatExtension=this.gl.getExtension("EXT_color_buffer_half_float")}this.vertexBuffer=Df(this.gl,this.debug),this.indexBuffer=Tf(this.gl,this.debug),this.framebuffer=Ol(this.gl,this.debug),this.textureConfig=qs(this.gl,this.textureHalfFloatExtension)}return Object.defineProperty(r.prototype,"debug",{get:function(){return k().getBool("DEBUG")},enumerable:!0,configurable:!0}),r.prototype.dispose=function(){var t=this;if(!this.disposed){this.program!=null&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),this.outputTexture!=null&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");var e=this.gl;J(e,this.debug,(function(){return e.finish()})),J(e,this.debug,(function(){return e.bindFramebuffer(e.FRAMEBUFFER,null)})),J(e,this.debug,(function(){return e.deleteFramebuffer(t.framebuffer)})),J(e,this.debug,(function(){return e.bindBuffer(e.ARRAY_BUFFER,null)})),J(e,this.debug,(function(){return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)})),J(e,this.debug,(function(){return e.deleteBuffer(t.indexBuffer)})),this.disposed=!0}},r.prototype.createFloat32MatrixTexture=function(t,e){return this.throwIfDisposed(),If(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createFloat16MatrixTexture=function(t,e){return this.throwIfDisposed(),Rf(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createUnsignedBytesMatrixTexture=function(t,e){return this.throwIfDisposed(),Mf(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.uploadPixelDataToTexture=function(t,e){this.throwIfDisposed(),kf(this.gl,this.debug,t,e)},r.prototype.uploadDenseMatrixToTexture=function(t,e,n,a){this.throwIfDisposed(),Ff(this.gl,this.debug,t,e,n,a,this.textureConfig)},r.prototype.createFloat16PackedMatrixTexture=function(t,e){return this.throwIfDisposed(),_f(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.createPackedMatrixTexture=function(t,e){return this.throwIfDisposed(),Bf(this.gl,this.debug,t,e,this.textureConfig)},r.prototype.deleteMatrixTexture=function(t){var e=this;this.throwIfDisposed(),this.outputTexture===t&&(_s(this.gl,this.debug,this.framebuffer),this.outputTexture=null),J(this.gl,this.debug,(function(){return e.gl.deleteTexture(t)}))},r.prototype.downloadByteEncodedFloatMatrixFromOutputTexture=function(t,e,n){var a=this;return this.downloadMatrixDriver(t,(function(){return Lf(a.gl,a.debug,e,n,a.textureConfig)}))},r.prototype.downloadPackedMatrixFromBuffer=function(t,e,n,a,i,o){return Uf(this.gl,t,0,0,0,i,o,this.textureConfig)},r.prototype.downloadFloat32MatrixFromBuffer=function(t,e){return Of(this.gl,t,e)},r.prototype.createBufferFromTexture=function(t,e,n){this.bindTextureToFrameBuffer(t);var a=Nf(this.gl,this.debug,e,n,this.textureConfig);return this.unbindTextureToFrameBuffer(),a},r.prototype.createAndWaitForFence=function(){var t=this.createFence(this.gl);return this.pollFence(t)},r.prototype.createFence=function(t){var e,n,a=this;if(k().getBool("WEBGL_FENCE_API_ENABLED")){var i=t,o=i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE,0);t.flush(),n=function(){var s=i.clientWaitSync(o,0,0);return s===i.ALREADY_SIGNALED||s===i.CONDITION_SATISFIED},e=o}else k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(e=this.beginQuery(),this.endQuery(),n=function(){return a.isQueryAvailable(e,k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}):n=function(){return!0};return{query:e,isFencePassed:n}},r.prototype.downloadMatrixFromPackedTexture=function(t,e,n){var a=this;return this.downloadMatrixDriver(t,(function(){return Gf(a.gl,a.debug,e,n)}))},r.prototype.createProgram=function(t){this.throwIfDisposed();var e=this.gl,n=Ml(e,this.debug,t),a=Sf(e,this.debug),i=Bl(e,this.debug);return J(e,this.debug,(function(){return e.attachShader(i,a)})),J(e,this.debug,(function(){return e.attachShader(i,n)})),_l(e,this.debug,i),this.debug&&Ui(e,this.debug,i),this.vertexAttrsAreBound||(this.setProgram(i),this.vertexAttrsAreBound=Pf(e,this.debug,this.program,this.vertexBuffer)),i},r.prototype.deleteProgram=function(t){var e=this;this.throwIfDisposed(),t===this.program&&(this.program=null),t!=null&&J(this.gl,this.debug,(function(){return e.gl.deleteProgram(t)}))},r.prototype.setProgram=function(t){var e=this;this.throwIfDisposed(),this.program=t,this.program!=null&&this.debug&&Ui(this.gl,this.debug,this.program),J(this.gl,this.debug,(function(){return e.gl.useProgram(t)}))},r.prototype.getUniformLocation=function(t,e,n){return n===void 0&&(n=!0),this.throwIfDisposed(),n?Ul(this.gl,this.debug,t,e):Gl(this.gl,t,e)},r.prototype.getAttributeLocation=function(t,e){var n=this;return this.throwIfDisposed(),J(this.gl,this.debug,(function(){return n.gl.getAttribLocation(t,e)}))},r.prototype.getUniformLocationNoThrow=function(t,e){return this.throwIfDisposed(),this.gl.getUniformLocation(t,e)},r.prototype.setInputMatrixTexture=function(t,e,n){this.throwIfDisposed(),this.throwIfNoProgram(),Hl(this.gl,this.debug,this.program,t,e,n)},r.prototype.setOutputMatrixTexture=function(t,e,n){this.setOutputMatrixTextureDriver(t,n,e)},r.prototype.setOutputPackedMatrixTexture=function(t,e,n){this.throwIfDisposed();var a=Xa(e,n),i=a[0],o=a[1];this.setOutputMatrixTextureDriver(t,i,o)},r.prototype.setOutputMatrixWriteRegion=function(t,e,n,a){this.setOutputMatrixWriteRegionDriver(n,t,a,e)},r.prototype.setOutputPackedMatrixWriteRegion=function(t,e,n,a){throw new Error("setOutputPackedMatrixWriteRegion not implemented.")},r.prototype.debugValidate=function(){this.program!=null&&Ui(this.gl,this.debug,this.program),Ba(this.gl)},r.prototype.executeProgram=function(){this.throwIfDisposed(),this.throwIfNoProgram();var t=this.gl;this.debug&&this.debugValidate(),J(t,this.debug,(function(){return t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0)}))},r.prototype.blockUntilAllProgramsCompleted=function(){var t=this;this.throwIfDisposed(),J(this.gl,this.debug,(function(){return t.gl.finish()}))},r.prototype.getQueryTimerExtension=function(){return this.disjointQueryTimerExtension==null&&(this.disjointQueryTimerExtension=Ma(this.gl,this.debug,k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension},r.prototype.getQueryTimerExtensionWebGL2=function(){return this.getQueryTimerExtension()},r.prototype.getQueryTimerExtensionWebGL1=function(){return this.getQueryTimerExtension()},r.prototype.beginQuery=function(){if(k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")===2){var t=this.gl,e=this.getQueryTimerExtensionWebGL2(),n=t.createQuery();return t.beginQuery(e.TIME_ELAPSED_EXT,n),n}var a=this.getQueryTimerExtensionWebGL1(),i=a.createQueryEXT();return a.beginQueryEXT(a.TIME_ELAPSED_EXT,i),i},r.prototype.endQuery=function(){if(k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")!==2){var t=this.getQueryTimerExtensionWebGL1();t.endQueryEXT(t.TIME_ELAPSED_EXT)}else{var e=this.gl,n=this.getQueryTimerExtensionWebGL2();e.endQuery(n.TIME_ELAPSED_EXT)}},r.prototype.waitForQueryAndGetTime=function(t){return ee(this,void 0,void 0,(function(){var e=this;return te(this,(function(n){switch(n.label){case 0:return[4,Cs((function(){return e.disposed||e.isQueryAvailable(t,k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}))];case 1:return n.sent(),[2,this.getQueryTime(t,k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))]}}))}))},r.prototype.getQueryTime=function(t,e){if(e===0)return null;if(e===2){var n=this.gl;return n.getQueryParameter(t,n.QUERY_RESULT)/1e6}var a=this.getQueryTimerExtensionWebGL1();return a.getQueryObjectEXT(t,a.QUERY_RESULT_EXT)/1e6},r.prototype.isQueryAvailable=function(t,e){if(e===0)return!0;if(e===2){var n=this.gl,a=this.getQueryTimerExtensionWebGL2(),i=n.getQueryParameter(t,n.QUERY_RESULT_AVAILABLE);return this.disjoint==null&&(this.disjoint=this.gl.getParameter(a.GPU_DISJOINT_EXT)),i&&!this.disjoint}return i=(a=this.getQueryTimerExtensionWebGL1()).getQueryObjectEXT(t,a.QUERY_RESULT_AVAILABLE_EXT),this.disjoint==null&&(this.disjoint=this.gl.getParameter(a.GPU_DISJOINT_EXT)),i&&!this.disjoint},r.prototype.pollFence=function(t){var e=this;return new Promise((function(n){e.addItemToPoll((function(){return t.isFencePassed()}),(function(){return n()}))}))},r.prototype.pollItems=function(){for(var t=(function(n){for(var a=0;a<n.length&&n[a]();++a);return a-1})(this.itemsToPoll.map((function(n){return n.isDoneFn}))),e=0;e<=t;++e)(0,this.itemsToPoll[e].resolveFn)();this.itemsToPoll=this.itemsToPoll.slice(t+1)},r.prototype.addItemToPoll=function(t,e){var n=this;this.itemsToPoll.push({isDoneFn:t,resolveFn:e}),this.itemsToPoll.length>1||Cs((function(){return n.pollItems(),n.itemsToPoll.length===0}))},r.prototype.bindTextureToFrameBuffer=function(t){this.throwIfDisposed(),Gi(this.gl,this.debug,t,this.framebuffer),this.debug&&Ba(this.gl)},r.prototype.unbindTextureToFrameBuffer=function(){this.outputTexture!=null?(Gi(this.gl,this.debug,this.outputTexture,this.framebuffer),this.debug&&Ba(this.gl)):_s(this.gl,this.debug,this.framebuffer)},r.prototype.downloadMatrixDriver=function(t,e){this.bindTextureToFrameBuffer(t);var n=e();return this.unbindTextureToFrameBuffer(),n},r.prototype.setOutputMatrixTextureDriver=function(t,e,n){this.throwIfDisposed();var a=this.gl;Gi(a,this.debug,t,this.framebuffer),this.debug&&Ba(a),this.outputTexture=t,J(a,this.debug,(function(){return a.viewport(0,0,e,n)})),J(a,this.debug,(function(){return a.scissor(0,0,e,n)}))},r.prototype.setOutputMatrixWriteRegionDriver=function(t,e,n,a){var i=this;this.throwIfDisposed(),J(this.gl,this.debug,(function(){return i.gl.scissor(t,e,n,a)}))},r.prototype.throwIfDisposed=function(){if(this.disposed)throw new Error("Attempted to use disposed GPGPUContext.")},r.prototype.throwIfNoProgram=function(){if(this.program==null)throw new Error("No GPU program is currently set.")},r})();function Lc(r,t){if(r.length!==t.length)throw Error("Binary was compiled with "+r.length+" inputs, but was executed with "+t.length+" inputs");r.forEach((function(e,n){var a=e.logicalShape,i=t[n],o=i.shape;if(!Je(a,o))throw Error("Binary was compiled with different shapes than the current args. Shapes "+a+" and "+o+" must match");if(!e.isUniform||!i.isUniform){var s=e.texShape,u=i.isUniform?null:i.texData.texShape;if(!Je(s,u))throw Error("Binary was compiled with different texture shapes than the current args. Shape "+s+" and "+u+" must match")}}))}var bm=function(r,t,e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r;for(var n=e.filterWidth,a=e.inChannels,i=e.strideWidth,o=e.strideHeight,s=e.padInfo,u=e.outWidth,c=e.dilationWidth,l=e.dilationHeight,f=e.dataFormat,h=s.left,d=s.top,p=a*n,v=Ct(),m=f==="channelsLast",g=m?0:1,x=m?1:2,w="",y=0;y<=1;y++)for(var b=0;b<=1;b++)w+=`
          blockIndex = rc.y + `+b+`;
          pos = rc.x + `+y+`;

          if(blockIndex < `+r[1]+" && pos < "+r[0]+`) {
            offsetY = int(blockIndex / (`+u+")) * "+o+" - "+d+`;
            d0 = offsetY + `+l+" * (pos / "+p+`);

            if(d0 < `+t[g]+` && d0 >= 0) {

              offsetX = int(mod(float(blockIndex), `+u+".) * "+i+". - "+h+`.);
              d1 = offsetX + `+c+" * (int(mod(float(pos), "+p+".) / "+a+`.));

              if(d1 < `+t[x]+` && d1 >= 0) {

                ch = int(mod(float(pos), `+a+`.));

                if (`+m+`) {
                  innerDims = vec2(d1, ch);
                  result[`+(2*y+b)+`] = getChannel(
                    getA(d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[`+(2*y+b)+`] = getChannel(
                    getA(ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec2 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        `+w+`

        `+v.output+` = result;
      }
    `},Am=function(r,t,e,n,a){this.variableNames=["x"],this.outputShape=[];var i,o=t,s=r[3]-1;this.outputShape=r;var u="float("+e+") + float("+n+") * sum";i=a===.5?"inversesqrt("+u+")":a===1?"1.0/("+u+")":"exp(log("+u+") * float(-"+a+"));",this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -`+o+"; j <= "+o+`; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  `+s+`) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * `+i+`;
        setOutput(val);
      }
    `},Em=function(r,t,e,n,a){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=r,this.depth=r[3],this.depthRadius=t,this.bias=e,this.alpha=n,this.beta=a,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < `+this.depth+`; ++d) {
          int depthBegin = int(max(0.0, float(d - `+t+`)));
          int depthEnd = int(min(float(`+this.depth+`),
              float(d + `+t+` + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = `+this.depth+`;

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(`+n+") * norm + float("+e+`);

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(`+n+`)
                * float(`+a+`)
                * getInputImage(b ,r ,c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * `+a+`);
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `},Cm=function(r,t,e,n,a){this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;var i,o=t,s=r[3]-1;this.outputShape=r;var u="float("+e+") + float("+n+") * sum";i=a===.5?"inversesqrt("+u+")":a===1?"1.0/("+u+")":"exp(log("+u+") * float(-"+a+"));",this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < `+this.outputShape[3]+`;
        bool hasNextRow = c < `+this.outputShape[2]+`;

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - `+o+`;
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - `+o+"; j <= "+o+`; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(`+s+`));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * `+i+`;
        setOutput(result);
      }
    `},Sm=function(r){this.variableNames=["dy","maxPos"],this.outputShape=r.inShape;var t=r.strideHeight,e=r.strideWidth,n=r.dilationHeight,a=r.effectiveFilterHeight,i=r.effectiveFilterWidth,o=a-1-r.padInfo.top,s=i-1-r.padInfo.left,u=a*i-1;this.userCode=`
      const ivec2 pads = ivec2(`+o+", "+s+`);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < `+a+`;
          wR += `+n+`) {
          float dyR = float(dyRCorner + wR) / `+t+`.0;

          if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < `+i+`; wC++) {
            float dyC = float(dyCCorner + wC) / `+e+`.0;

            if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = `+u+` - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * `+i+` + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `},Dm=function(r){this.variableNames=["dy","maxPos"],this.outputShape=r.inShape;var t=r.strideDepth,e=r.strideHeight,n=r.strideWidth,a=r.dilationDepth,i=r.dilationHeight,o=r.dilationWidth,s=r.effectiveFilterDepth,u=r.effectiveFilterHeight,c=r.effectiveFilterWidth,l=s-1-r.padInfo.front,f=u-1-r.padInfo.top,h=c-1-r.padInfo.left,d=s*u*c-1;this.userCode=`
      const ivec3 pads = ivec3(`+l+", "+f+", "+h+`);

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < `+s+`;
           wD += `+a+`) {
          float dyD = float(dyDCorner + wD) / `+t+`.0;

          if (dyD < 0.0 || dyD >= `+r.outDepth+`.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < `+u+`;
              wR += `+i+`) {
            float dyR = float(dyRCorner + wR) / `+e+`.0;

            if (dyR < 0.0 || dyR >= `+r.outHeight+`.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < `+c+`;
                wC += `+o+`) {
              float dyC = float(dyCCorner + wC) / `+n+`.0;

              if (dyC < 0.0 || dyC >= `+r.outWidth+`.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = `+d+` -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * `+u+" * "+c+` +
                  wR * `+c+` + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `},us=function(r,t,e,n,a,i,o){e===void 0&&(e=!1),n===void 0&&(n=!1),a===void 0&&(a=!1),i===void 0&&(i=null),o===void 0&&(o=!1),this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t;var s=e?r[1]:r[2],u=Math.ceil(s/2),c=e?"i * 2, rc.y":"rc.y, i * 2",l=n?"rc.z, i * 2":"i * 2, rc.z",f=e?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],h=n?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"],d="",p="";i&&(d=o?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          `+i+`
        }`:`vec4 activation(vec4 x) {
          `+i+`
        }`,p="result = activation(result);");var v=a?"result += getBiasAtOutCoords();":"";a&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),this.userCode=`
      `+d+`

      const float sharedDimension = `+u+`.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        for (int i = 0; i < `+u+`; i++) {
          vec4 a = getMatrixA(rc.x, `+c+`);
          vec4 b = getMatrixB(rc.x, `+l+`);

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (`+f[0]+" * "+h[0]+`);
          result += (`+f[1]+" * "+h[1]+`);
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        `+v+`

        `+p+`

        setOutput(result);
      }
    `},Tm=(function(){function r(t,e,n){this.variableNames=["probs"],this.outputShape=[t,n],this.userCode=`
      uniform float seed;

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < `+(e-1)+`; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(`+(e-1)+`));
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;return function(n,a){e.seedLoc==null&&(e.seedLoc=n.getUniformLocation(a,"seed")),n.gl.uniform1f(e.seedLoc,t)}},r})(),Im=function(r,t,e,n){this.variableNames=["indices"],this.outputShape=[r,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(`+n+"), float("+e+`),
                      float(index == coords.y)));
      }
    `},Rm=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=r;var t=r.length;if(t===0)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{var e=Nt("rc",t),n=Oe(t),a=(function(s,u,c){if(s===1)return"rc > "+u[0];for(var l="",f=s-2;f<s;f++)l+=c[f]+" >= "+u[f],f<s-1&&(l+="||");return l})(t,r,e),i=(function(s,u,c,l){if(s===1)return"";var f=l.slice(-2);return`
    int r = `+f[0]+`;
    int c = `+f[1]+`;
    int rp1 = r + 1;
    int cp1 = c + 1;

    bool cEdge = cp1 >= `+u+`;
    bool rEdge = rp1 >= `+c+`;
  `})(t,r[r.length-1],r[r.length-2],e),o=(function(s,u){var c=s.length,l=(function(f,h){for(var d=[],p=0;p<=1;p++)for(var v=0;v<=1;v++){for(var m=(p===0?"r":"rp1")+", "+(v===0?"c":"cp1"),g=2;g<f;g++)m=h[h.length-1-g]+","+m;d.push(m)}return d})(c,u);return c===1?`getA(rc),
            rc + 1 >= `+s[0]+` ? 0. : getA(rc + 1),
            0, 0`:"getA("+l[0]+`),
          cEdge ? 0. : getA(`+l[1]+`),
          rEdge ? 0. : getA(`+l[2]+`),
          rEdge || cEdge ? 0. : getA(`+l[3]+")"})(r,e);this.userCode=`
        void main() {
          `+n+` rc = getOutputCoords();

          if(`+a+`) {
            setOutput(vec4(0));
          } else {
            `+i+`

            setOutput(vec4(`+o+`));
          }
        }
      `}},Mm=function(r,t,e){this.variableNames=["x"],this.outputShape=t.map((function(u,c){return u[0]+r[c]+u[1]}));var n=r.length,a=Oe(n),i=t.map((function(u){return u[0]})).join(","),o=t.map((function(u,c){return u[0]+r[c]})).join(","),s=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,n);this.userCode=n!==1?`
      `+a+" start = "+a+"("+i+`);
      `+a+" end = "+a+"("+o+`);

      void main() {
        `+a+` outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(float(`+e+`));
        } else {
          `+a+` coords = outC - start;
          setOutput(getX(`+s+`));
        }
      }
    `:`
        int start = `+i+`;
        int end = `+o+`;

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(float(`+e+`));
          } else {
            setOutput(getX(outC - start));
          }
        }
      `},Bm=function(r,t,e){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((function(m,g){return m[0]+r[g]+m[1]}));for(var n=r.length,a=Oe(n),i=t.map((function(m){return m[0]})).join(","),o=t.map((function(m,g){return m[0]+r[g]})).join(","),s=Nt("rc",n),u=Nt("source",n),c=s[n-1]+" < "+this.outputShape[n-1],l=n===1?"source":"vec2("+u.slice(-2).join()+")",f=[a+" rc = outputLoc;",s[n-1]+` += 1;
       if(`+c+`) {
      `,n===1?"":`}
       rc = outputLoc;
       `+s[n-2]+` += 1;
       if(`+s[n-2]+" < "+this.outputShape[n-2]+") {",n===1?"":"  "+s[n-1]+` += 1;
         if(`+c+") {"],h=n===1?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))",d="",p=0,v=n===1?2:4;p<v;p++)d+=`
        `+f[p]+`
        if (`+h+`) {
          result[`+p+"] = float("+e+`);
        } else {
          `+a+` source = rc - start;
          result[`+p+"] = getChannel(getX("+u.join()+"), "+l+`);
        }
      `;d+=n===1?"} ":"}}",this.userCode=`
      const `+a+" start = "+a+"("+i+`);
      const `+a+" end = "+a+"("+o+`);

      void main() {
        `+a+` outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        `+d+`
        setOutput(result);
      }
    `},cs=function(r,t,e){if(this.variableNames=["x"],t==="avg"&&e)throw new Error("Cannot compute positions for average pool.");var n=r.filterWidth,a=r.strideHeight,i=r.strideWidth,o=r.dilationHeight,s=r.dilationWidth,u=r.effectiveFilterHeight,c=r.effectiveFilterWidth,l=r.padInfo.top,f=r.padInfo.left;this.outputShape=r.outShape;var h=t==="avg",d="0.0";if(h||(d="-1.0 / 1e-20"),e)this.userCode=`
        const ivec2 strides = ivec2(`+a+", "+i+`);
        const ivec2 pads = ivec2(`+l+", "+f+`);

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < `+u+`;
              wR += `+o+`) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+c+`;
                wC += `+s+`) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= `+r.inWidth+`) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = wR * `+c+` + wC;
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;else{var p=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="avg"&&(p="avgValue / count");var v=4*Math.floor(n/4),m=n%4,g=`
      if (`+h+`) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(`+a+", "+i+`);
      const ivec2 pads = ivec2(`+l+", "+f+`);
      const float initializationValue = `+d+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= `+r.inWidth+`) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(`+d+`);
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < `+u+`;
            wR += `+o+`) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= `+r.inHeight+`) {
            continue;
          }

          for (int wC = 0; wC < `+v+`; wC += 4) {
            int xC = xCCorner + wC * `+s+`;

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              getValue(batch, xR, xC + 2 * `+s+`, d),
              getValue(batch, xR, xC + 3 * `+s+`, d)
            );

            `+g+`
          }

          int xC = xCCorner + `+v+`;
          if (`+(m===1)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            `+g+`
          } else if (`+(m===2)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              initializationValue,
              initializationValue
            );

            `+g+`
          } else if (`+(m===3)+`) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + `+s+`, d),
              getValue(batch, xR, xC + 2 * `+s+`, d),
              initializationValue
            );

            `+g+`
          }
        }
        setOutput(`+p+`);
      }
    `}},ls=function(r,t,e){if(this.variableNames=["x"],t==="avg"&&e)throw new Error("Cannot compute positions for average pool.");var n=r.filterWidth,a=r.strideDepth,i=r.strideHeight,o=r.strideWidth,s=r.dilationDepth,u=r.dilationHeight,c=r.dilationWidth,l=r.effectiveFilterDepth,f=r.effectiveFilterHeight,h=r.effectiveFilterWidth,d=r.padInfo.front,p=r.padInfo.top,v=r.padInfo.left;this.outputShape=r.outShape;var m=t==="avg",g="0.0";if(m||(g="-1.0 / 1e-20"),e)this.userCode=`
        const ivec3 strides =
            ivec3(`+a+", "+i+", "+o+`);
        const ivec3 pads = ivec3(`+d+", "+p+", "+v+`);

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < `+l+`;
              wD += `+s+`) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= `+r.inDepth+`) {
              continue;
            }

            for (int wR = 0; wR < `+f+`;
                wR += `+u+`) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= `+r.inHeight+`) {
                continue;
              }

              for (int wC = 0; wC < `+h+`;
                  wC += `+c+`) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= `+r.inWidth+`) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition =
                      wD * `+f+" * "+h+` +
                      wR * `+h+` + wC;;
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;else{var x=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="avg"&&(x="avgValue / count");var w=4*Math.floor(n/4),y=n%4,b=`
      if (`+m+`) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(`+a+", "+i+", "+o+`);
      const ivec3 pads = ivec3(`+d+", "+p+", "+v+`);
      const float initializationValue = `+g+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= `+r.inWidth+`) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(`+g+`);
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < `+l+`;
            wD += `+s+`) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= `+r.inDepth+`) {
            continue;
          }

          for (int wR = 0; wR < `+f+`;
            wR += `+u+`) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= `+r.inHeight+`) {
              continue;
            }

            for (int wC = 0; wC < `+w+`; wC += 4) {
              int xC = xCCorner + wC * `+c+`;

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+c+`, ch),
                getValue(batch, xD, xR, xC + 2 * `+c+`, ch),
                getValue(batch, xD, xR, xC + 3 * `+c+`, ch)
              );

              `+b+`
            }

            int xC = xCCorner + `+w+`;
            if (`+(y===1)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              `+b+`
            } else if (`+(y===2)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+c+`, ch),
                initializationValue,
                initializationValue
              );

              `+b+`
            } else if (`+(y===3)+`) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + `+c+`, ch),
                getValue(batch, xD, xR, xC + 2 * `+c+`, ch),
                initializationValue
              );

              `+b+`
            }
          }
          setOutput(`+x+`);
        }
      }
    `}},_m=function(r,t){this.variableNames=["x"];var e=r.windowSize,n=r.batchSize,a=r.inSize,i=Math.ceil(a/e);this.outputShape=[n,i];var o="0.0",s="";t==="prod"?o="1.0":t==="min"?(o="1.0 / 1e-20",s="min"):t==="max"&&(o="-1.0 / 1e-20",s="max");var u=t+"("+t+"("+t+"(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])";t==="sum"?u="sumValue":t==="prod"?u="prodValue":t==="all"?u="allValue":t==="any"&&(u="anyValue");var c=4*Math.floor(e/4),l=e%4,f=`
      if (`+(t==="sum")+`) {
        sumValue += dot(values, ones);
      } else if (`+(t==="prod")+`) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = `+s+`(values, minMaxValue);
      }
    `,h="vec4";t==="all"?(o="1.0",f=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,h="bvec4"):t==="any"&&(o="0.0",f=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,h="bvec4");var d="";a%e>0&&(d=`
        if (inIdx < 0 || inIdx >= `+a+`) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = `+o+`;
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        `+d+`
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * `+e+`;

        vec4 minMaxValue = vec4(`+o+`);
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < `+c+`; i += 4) {
          int inIdx = inOffset + i;
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          `+f+`
        }

        int inIdx = inOffset + `+c+`;
        if (`+(l===1)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          `+f+`
        } else if (`+(l===2)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          `+f+`
        } else if (`+(l===3)+`) {
          `+h+" values = "+h+`(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          `+f+`
        }
        setOutput(`+u+`);
      }
    `},Pm=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r;for(var e="",n=0;n<4;n++){var a="thisRC = rc;";n%2==1&&(a+="thisRC.z += 1;"),n>1&&(a+="thisRC.y += 1;"),e+=`
        `+a+`
        `+(n>0?"if(thisRC.y < rows && thisRC.z < cols){":"")+`
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[`+n+`] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        `+(n>0?"}":"")+`
      `}this.userCode=`
      
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      `+hn(["r","c","d"],t)+`
      return ivec3(r, c, d);
    }
  
      `+lu(r)+`

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = `+r[1]+`;
        int cols = `+r[2]+`;

        `+e+`

        setOutput(result);
      }
    `},Fm=function(r,t,e){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t.shape;var n=t.shape,a=n[1],i=n[2],o=r.shape,s=o[1],u=o[2],c=[e&&s>1?a-1:a,e&&u>1?i-1:i],l=[e&&s>1?s-1:s,e&&u>1?u-1:u],f=c[0]/l[0],h=c[1]/l[1],d=1/f,p=1/h,v=2*Math.ceil(d)+2,m=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(`+f+`);
        const float widthScale = float(`+h+`);

        const float invHeightScale = float(`+d+`);
        const float invWidthScale = float(`+p+`);

        const int winHeight = int(`+v+`);
        const int winWidth = int(`+m+`);

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= `+s+`) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= `+u+`) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), `+(a-1)+`.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), `+(i-1)+`.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `},km=function(r,t,e,n){this.variableNames=["A"],this.outputShape=[];var a=r[0],i=r[1],o=r[2],s=r[3];this.outputShape=[a,t,e,s];var u=[n&&t>1?i-1:i,n&&e>1?o-1:o],c=[n&&t>1?t-1:t,n&&e>1?e-1:e];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          `+u[0]/c[0]+`,
          `+u[1]/c[1]+`);
      const vec2 inputShapeRC = vec2(`+i+".0, "+o+`.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(sourceFracIndexRC);
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `},Nm=function(r,t,e,n){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];var a=r[0],i=r[1],o=r[2],s=r[3];this.outputShape=[a,t,e,s];var u=[n&&t>1?i-1:i,n&&e>1?o-1:o],c=[n&&t>1?t-1:t,n&&e>1?e-1:e];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          `+u[0]/c[0]+`,
          `+u[1]/c[1]+`,
          `+u[1]/c[1]+`);
      const vec3 inputShapeRC = vec3(`+i+".0, "+o+`.0,
                                     `+o+`.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = vec3(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(sourceFracIndexRC);
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < `+(s-1)+`;
        bool hasNextRow = coords.z < `+(e-1)+`;

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `},Om=function(r,t,e){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t.shape;var n=t.shape,a=n[1],i=n[2],o=r.shape,s=o[1],u=o[2],c=[e&&s>1?a-1:a,e&&u>1?i-1:i],l=[e&&s>1?s-1:s,e&&u>1?u-1:u],f=c[0]/l[0],h=c[1]/l[1],d=1/f,p=1/h,v=2*Math.ceil(d)+2,m=2*Math.ceil(p)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(`+f+`);
        const float widthScale = float(`+h+`);

        const float invHeightScale = float(`+d+`);
        const float invWidthScale = float(`+p+`);

        const int winHeight = int(`+v+`);
        const int winWidth = int(`+m+`);

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= `+s+`) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= `+u+`) {
              continue;
            }

            float sourceFracRow =
              float(`+c[0]+`) *
                (float(dyR) / float(`+l[0]+`));

            float sourceFracCol =
                float(`+c[1]+`) *
                  (float(dyC) / float(`+l[1]+`));

            int sourceNearestRow = int(min(
                float(int(`+a+`) - 1),
                `+e+` ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(`+i+`) - 1),
                `+e+` ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `},Lm=function(r,t,e,n){this.variableNames=["A"],this.outputShape=[];var a=r[0],i=r[1],o=r[2],s=r[3];this.outputShape=[a,t,e,s];var u=[n&&t>1?i-1:i,n&&e>1?o-1:o],c=[n&&t>1?t-1:t,n&&e>1?e-1:e],l=n?"0.5":"0.0";this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          `+u[0]/c[0]+`,
          `+u[1]/c[1]+`);
      const vec2 inputShapeRC = vec2(`+i+".0, "+o+`.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = vec2(yRC) * effectiveInputOverOutputRatioRC;

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + `+l+`)));

        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `},Um=function(r,t){this.variableNames=["x"];var e=r.length;if(e>4)throw new Error("WebGL backend: Reverse of rank-"+e+" tensor is not yet supported");if(this.outputShape=r,e!==1){var n=r.map((function(i,o){return(function(s){return t.indexOf(s)!==-1&&r[s]!==1?r[s]+" - coords["+s+"] - 1":"coords["+s+"]"})(o)})).join(","),a=Oe(e);this.userCode=`
      void main() {
        `+a+` coords = getOutputCoords();
        setOutput(getX(`+n+`));
      }
    `}else this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(`+r[0]+` - coord - 1));
        }
      `},Gm=function(r,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;var e=r.length;if(e>4)throw new Error("WebGL backend: Reverse of rank-"+e+" tensor is not yet supported");this.outputShape=r;var n=Nt("rc",e),a=n[e-1]+" + 1 < "+this.outputShape[e-1],i=n[e-2]+" + 1 < "+this.outputShape[e-2],o=Oe(e);function s(u){var c=r.map((function(l,f){return(function(h,d){return t.indexOf(h)!==-1&&r[h]!==1?r[h]+" - "+d[h]+" - 1":""+d[h]})(f,u)}));return"getChannel(getX("+c.join(",")+"), vec2("+c.slice(-2).join(",")+"))"}this.userCode=e===1?`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(`+r[0]+` - rc - 1),
            `+r[0]+` - rc - 1);
          if(`+a+`){
              result.g = getChannel(getX(`+r[0]+` - (rc  + 1) - 1),
                `+r[0]+` - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:`
        void main() {
          `+o+` rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = `+(function(u){return s(u)})(n.slice())+`;
          if(`+a+`){
            result.g = `+(function(u){return u[e-1]="("+u[e-1]+" + 1)",s(u)})(n.slice())+`;
          }
          if(`+i+`) {
            result.b = `+(function(u){return u[e-2]="("+u[e-2]+" + 1)",s(u)})(n.slice())+`;
            if(`+a+`) {
              result.a = `+(function(u){return u[e-1]="("+u[e-1]+" + 1)",u[e-2]="("+u[e-2]+" + 1)",s(u)})(n.slice())+`;
            }
          }
          setOutput(result);
        }
    `},Uc=function(r,t,e,n,a,i,o){o===void 0&&(o=!0),this.variableNames=["updates","indices","defaultValue"],this.outputShape=i;var s=Oe(a.length),u=Oe(i.length),c="";e===1?c="i":e===2&&(c="i, j");var l="getIndices("+c+")",f="";n===1?f="i":n===2&&(f="i, coords[1]");var h="getUpdates("+f+")",d=t>1?"strides[j]":"strides";this.userCode=`
        `+s+" strides = "+s+"("+a+`);

        void main() {
          `+u+` coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < `+r+`; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < `+t+`; j++) {
              int index = round(`+l+`);
              flattenedIndex += index * `+d+`;
            }
            if (flattenedIndex == coords[0]) {
              sum += `+h+`;
              found = true;
            }
          }
          setOutput(mix(getDefaultValue(), sum, float(found)));
        }
      `},Hm=function(r,t){this.variableNames=["x","segmentIds"];var e=r.windowSize,n=r.batchSize,a=r.inSize,i=r.numSegments,o=i*Math.ceil(a/e);this.outputShape=[n,o];var s=4*Math.floor(e/4),u=e%4,c=`
        sumValue += dot(values, segFilter);
    `,l="";a%e>0&&(l=`
        if (inIdx < 0 || inIdx >= `+a+`) {
          return initializationValue;
        }
      `);var f="";a%e>0&&(f=`
        if (inIdx < 0 || inIdx >= `+a+`) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = 0.0;

      float getValue(int batch, int inIdx) {
        `+l+`
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        `+f+`
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          `+i+")) * float("+e+`));
        int currentSeg = int(mod(float(outIdx), float(`+i+`)));

        float sumValue = 0.0;

        for (int i = 0; i < `+s+`; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          `+c+`
        }

        int inIdx = inOffset + `+s+`;
        if (`+(u===1)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          `+c+`
        } else if (`+(u===2)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          `+c+`
        } else if (`+(u===3)+`) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          `+c+`
        }
        setOutput(sumValue);
      }
    `},zm=function(r,t,e){var n,a;if(this.variableNames=["c","a","b"],this.outputShape=t,e>4)throw Error("Where for rank "+e+" is not yet supported");if(e===1)a="resRC",n="resRC";else{for(var i=["resRC.x","resRC.y","resRC.z","resRC.w"],o=[],s=[],u=0;u<t.length;u++)s.push(""+i[u]),u<r&&o.push(""+i[u]);n=o.join(),a=s.join()}var c=Oe(e);this.userCode=`
      void main() {
        `+c+` resRC = getOutputCoords();
        float cVal = getC(`+n+`);
        if (cVal >= 1.0) {
          setOutput(getA(`+a+`));
        } else {
          setOutput(getB(`+a+`));
        }
      }
    `},Wm=(function(){function r(t){this.variableNames=["source"],this.outputShape=t,this.rank=t.length;var e,n=Oe(this.rank),a="uniform int start["+this.rank+"];",i=(function(o){if(o===1)return"sourceLoc";if(o<=6)return fs.slice(0,o).map((function(s){return"sourceLoc."+s})).join(",");throw Error("Slicing for rank "+o+" is not yet supported")})(this.rank);e=`
        `+n+` sourceLoc;
        `+n+` coords = getOutputCoords();
        `+t.map((function(o,s){return"sourceLoc."+fs[s]+" = start["+s+"] + coords."+fs[s]+";"})).join(`
`)+`
      `,this.userCode=`
      `+a+`
      void main() {
        `+e+`
        setOutput(getSource(`+i+`));
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;if(t.length!==this.rank)throw Error("The rank ("+this.rank+") of the program must match the length of start ("+t.length+")");return function(n,a){e.startLoc==null&&(e.startLoc=n.getUniformLocationNoThrow(a,"start"),e.startLoc==null)||n.gl.uniform1iv(e.startLoc,t)}},r})(),fs=["x","y","z","w","u","v"],Vm=(function(){function r(t){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t,this.rank=t.length;var e=Oe(this.rank),n=Nt("coords",this.rank),a=Nt("sourceLoc",this.rank),i=this.rank===1?"sourceLoc":"vec2("+a.slice(-2).join()+")",o="getChannel(getSource("+a.join()+"), "+i+")",s=`
      result.x = `+o+`;
      if (++`+n[this.rank-1]+" < "+t[this.rank-1]+`) {
        ++`+a[this.rank-1]+`;
        result.y = `+o+`;
        --`+a[this.rank-1]+`;
      }
    `,u=this.rank===1?"":`
      --`+n[this.rank-1]+`;
      if (++`+n[this.rank-2]+" < "+t[this.rank-2]+`) {
        ++`+a[this.rank-2]+`;
        result.z = `+o+`;
        if (++`+n[this.rank-1]+" < "+t[this.rank-1]+`) {
          ++`+a[this.rank-1]+`;
          result.w = `+o+`;
        }
      }
    `,c=this.rank<=4?`sourceLoc = coords +
            `+e+"("+t.map((function(l,f){return"start["+f+"]"})).join()+");":t.map((function(l,f){return a[f]+" = "+n[f]+" + start["+f+"];"})).join(`
`);this.userCode=`
      uniform int start[`+this.rank+`];
      void main() {
        `+e+` coords = getOutputCoords();
        `+e+` sourceLoc;
        `+c+`
        vec4 result = vec4(0.);
        `+s+`
        `+u+`
        setOutput(result);
      }
    `}return r.prototype.getCustomSetupFunc=function(t){var e=this;if(t.length!==this.rank)throw Error("The rank ("+this.rank+") of the program must match the length of start ("+t.length+")");return function(n,a){e.startLoc==null&&(e.startLoc=n.getUniformLocationNoThrow(a,"start"),e.startLoc==null)||n.gl.uniform1iv(e.startLoc,t)}},r})(),Xm=function(r,t,e){this.variableNames=["x"],this.outputShape=e;var n=e.length,a=Oe(e.length),i=Oe(e.length),o="";if(n===1)o="coords * strides + begin";else{var s=0;o=e.map((function(u,c){return s++,e.length===1?"coords * strides["+c+"] + begin["+c+"]":"coords["+(s-1)+"] * strides["+c+"] + begin["+c+"]"})).join(",")}this.userCode=`
      `+a+" begin = "+a+"("+r+`);
      `+a+" strides = "+a+"("+t+`);

      void main() {
        `+i+` coords = getOutputCoords();
        setOutput(getX(`+o+`));
      }
    `},Km=(function(){function r(t){this.gpgpu=t,this.numUsedTextures=0,this.numFreeTextures=0,this.freeTextures={},this.logEnabled=!1,this.usedTextures={}}return r.prototype.acquireTexture=function(t,e,n){var a,i=Gc(e,n),o=Hc(t,i,n);if(o in this.freeTextures||(this.freeTextures[o]=[]),o in this.usedTextures||(this.usedTextures[o]=[]),this.freeTextures[o].length>0){this.numFreeTextures--,this.numUsedTextures++,this.log();var s=this.freeTextures[o].shift();return this.usedTextures[o].push(s),s}return this.numUsedTextures++,this.log(),i===Xt.PACKED_2X2_FLOAT32?a=this.gpgpu.createPackedMatrixTexture(t[0],t[1]):i===Xt.PACKED_2X2_FLOAT16?a=this.gpgpu.createFloat16PackedMatrixTexture(t[0],t[1]):i===Xt.UNPACKED_FLOAT32?a=this.gpgpu.createFloat32MatrixTexture(t[0],t[1]):i===Xt.UNPACKED_FLOAT16?a=this.gpgpu.createFloat16MatrixTexture(t[0],t[1]):i===Xt.PACKED_4X1_UNSIGNED_BYTE&&(a=this.gpgpu.createUnsignedBytesMatrixTexture(t[0],t[1])),this.usedTextures[o].push(a),a},r.prototype.releaseTexture=function(t,e,n,a){if(this.freeTextures!=null){var i=Hc(e,Gc(n,a),a);i in this.freeTextures||(this.freeTextures[i]=[]),this.freeTextures[i].push(t),this.numFreeTextures++,this.numUsedTextures--;var o=this.usedTextures[i],s=o.indexOf(t);if(s<0)throw new Error("Cannot release a texture that was never provided by this texture manager");o.splice(s,1),this.log()}},r.prototype.log=function(){if(this.logEnabled){var t=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",this.numFreeTextures+" / "+this.numUsedTextures,"("+t+")")}},r.prototype.getNumUsedTextures=function(){return this.numUsedTextures},r.prototype.getNumFreeTextures=function(){return this.numFreeTextures},r.prototype.dispose=function(){var t=this;if(this.freeTextures!=null){for(var e in this.freeTextures)this.freeTextures[e].forEach((function(n){t.gpgpu.deleteMatrixTexture(n)}));for(var e in this.usedTextures)this.usedTextures[e].forEach((function(a){t.gpgpu.deleteMatrixTexture(a)}));this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0}},r})();function Gc(r,t){if(r===Kt.UPLOAD)return Xt.PACKED_2X2_FLOAT32;if(r===Kt.RENDER||r==null)return(function(e){return k().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?e?Xt.PACKED_2X2_FLOAT32:Xt.UNPACKED_FLOAT32:e?Xt.PACKED_2X2_FLOAT16:Xt.UNPACKED_FLOAT16})(t);if(r===Kt.DOWNLOAD||r===Kt.PIXELS)return Xt.PACKED_4X1_UNSIGNED_BYTE;throw new Error("Unknown logical texture type "+r)}function Hc(r,t,e){return r[0]+"_"+r[1]+"_"+t+"_"+e}var jm=function(r,t){this.variableNames=["A"];for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[n]*t[n];this.outputShape=e,this.rank=e.length;var a=Oe(this.rank),i=(function(o){var s=o.length;if(s>5)throw Error("Tile for rank "+s+" is not yet supported");if(s===1)return"imod(resRC, "+o[0]+")";for(var u=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],c=[],l=0;l<o.length;l++)c.push("imod("+u[l]+", "+o[l]+")");return c.join()})(r);this.userCode=`
      void main() {
        `+a+` resRC = getOutputCoords();
        setOutput(getA(`+i+`));
      }
    `},Ym=function(r,t){this.variableNames=["A"];for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[t[n]];this.outputShape=e,this.rank=e.length;var a=Oe(this.rank),i=(function(o){var s=o.length;if(s>6)throw Error("Transpose for rank "+s+" is not yet supported");for(var u=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],c=new Array(s),l=0;l<o.length;l++)c[o[l]]=u[l];return c.join()})(t);this.userCode=`
    void main() {
      `+a+` resRC = getOutputCoords();
      setOutput(getA(`+i+`));
    }
    `},Qm=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;for(var e=new Array(r.length),n=0;n<e.length;n++)e[n]=r[t[n]];if(this.outputShape=e,this.rank=e.length,this.rank>6)throw Error("Packed transpose for rank "+this.rank+" is not yet supported.");var a=Oe(this.rank),i=wf("rc",this.rank),o=new Array(this.rank);for(n=0;n<t.length;n++)o[t[n]]=i[n];var s="vec2("+o.slice(-2).join()+")",u="++"+i[this.rank-1]+" < "+e[this.rank-1],c="getChannel(getA("+o.join()+"), "+s+")";this.userCode=`
    void main() {
      `+a+` rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = `+c+`;
      if(`+u+`) {
        result[1] = `+c+`;
      }
      --`+i[this.rank-1]+`;
      if(++`+i[this.rank-2]+" < "+e[this.rank-2]+`) {
        result[2] = `+c+`;
        if(`+u+`) {
          result[3] = `+c+`;
        }
      }
      setOutput(result);
    }
    `},fu=1.7580993408473768,hu=1.0507009873554805,he=function(r,t){this.variableNames=["A"],this.outputShape=r,this.userCode=`
      float unaryOperation(float x) {
        `+t+`
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `},fr="if (isnan(x)) return x;",qm="return x;",zc="return abs(x);",zf=fr+`
  return (x < 0.0) ? 0.0 : x;
`,Wf=fr+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,Vf="return (x >= 0.0) ? x : (exp(x) - 1.0);",Zm=`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = `+fu+`;
  float scale = `+hu+`;
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`,Wc="return -x;",Vc="return ceil(x);",Xc="return floor(x);",Kc="return exp(x);",jc="return exp(x) - 1.0;",Jm=fr+`
  return sin(x);
`,$m=fr+`
  return cos(x);
`,eg=fr+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`,tg=fr+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`,rg=fr+`
  return atan(x);
`,ng=fr+"return log(x + sqrt(x * x + 1.0));",ag=fr+`
  if (x < 1.0) return NAN;
  return log(x + sqrt(x * x - 1.0));`,ig=fr+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
  return (log(1.0 + x) - log(1.0 - x)) / 2.0;`,Mi="return x;",og="return x;",Xf=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,Kf=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,jf=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,Ra=function(r,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=r,this.userCode=`
      vec4 unaryOperation(vec4 x) {
        `+t+`
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `},sg=function(r){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=r;var t=r.length,e=Nt("rc",t),n=Oe(t),a=(function(s,u){if(s===1)return"rc";for(var c="",l=0;l<s;l++)c+=u[l],l<s-1&&(c+=",");return c})(t,e),i=e.slice(-2),o=t<=1?"rc":"vec2("+i.join(",")+")";this.userCode=`
      void main() {
        `+n+` rc = getOutputCoords();
        vec4 packedInput = getA(`+a+`);

        setOutput(getChannel(packedInput, `+o+`));
      }
    `},Bi={};function _i(r,t){if(t===void 0&&(t=!1),r==="linear")return t?og:qm;if(r==="relu")return t?Xf:zf;if(r==="elu")return t?jf:Vf;if(r==="relu6")return t?Kf:Wf;if(r==="prelu")return t?Cf:Ef;throw new Error("Activation "+r+" has not been implemented for the WebGL backend.")}var ug=600,Yf=(function(r){function t(e){var n,a=r.call(this)||this;if(a.pendingRead=new WeakMap,a.pendingDisposal=new WeakSet,a.dataRefCount=new WeakMap,a.numBytesInGPU=0,a.uploadWaitMs=0,a.downloadWaitMs=0,a.warnedAboutMemory=!1,a.pendingDeletes=0,a.disposed=!1,!k().getBool("HAS_WEBGL"))throw new Error("WebGL is not supported on this device");if(e==null){var i=wr(k().getNumber("WEBGL_VERSION"));a.binaryCache=((n=k().getNumber("WEBGL_VERSION"))in Bi||(Bi[n]={}),Bi[n]),a.gpgpu=new Hf(i),a.canvas=i.canvas,a.gpgpuCreatedLocally=!0}else a.gpgpu=e,a.binaryCache={},a.gpgpuCreatedLocally=!1,a.canvas=e.gl.canvas;return a.textureManager=new Km(a.gpgpu),a.numMBBeforeWarning=k().global.screen==null?1024:k().global.screen.height*k().global.screen.width*window.devicePixelRatio*ug/1024/1024,a.texData=new pf(a,B),a}return ur(t,r),t.prototype.numDataIds=function(){return this.texData.numDataIds()+(this.cpuBackend?this.cpuBackend.numDataIds():0)-this.pendingDeletes},t.prototype.write=function(e,n,a){if(k().getBool("DEBUG")&&this.checkNumericalProblems(e),a==="complex64"&&e!=null)throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");var i={};return this.texData.set(i,{shape:n,dtype:a,values:e,usage:Kt.UPLOAD}),i},t.prototype.move=function(e,n,a,i){if(k().getBool("DEBUG")&&this.checkNumericalProblems(n),i==="complex64")throw new Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:a,dtype:i,values:n,usage:Kt.UPLOAD})},t.prototype.readSync=function(e){var n=this.texData.get(e),a=n.values,i=n.dtype,o=n.complexTensors,s=n.slice,u=n.shape,c=n.isPacked;if(s!=null){var l=void 0;l=c?new Ra(u,Mi):new he(u,Mi);var f=this.runWebGLProgram(l,[{dataId:e,shape:u,dtype:i}],i),h=this.readSync(f.dataId);return this.disposeData(f.dataId),h}if(a!=null)return this.convertAndCacheOnCPU(e);if(i==="string")return a;var d,p,v=this.activeTimers!=null;return v&&(d=ir()),i==="complex64"?p=Ls(o.real.dataSync(),o.imag.dataSync()):p=this.getValuesFromTexture(e),v&&(this.downloadWaitMs+=ir()-d),this.convertAndCacheOnCPU(e,p)},t.prototype.read=function(e){return ee(this,void 0,void 0,(function(){var n,a,i,o,s,u,c,l,f,h,d,p,v,m,g,x,w,y,b,A,I,T;return te(this,(function(S){switch(S.label){case 0:if(this.pendingRead.has(e))return n=this.pendingRead.get(e),[2,new Promise((function(D){return n.push(D)}))];if(a=this.texData.get(e),i=a.values,o=a.shape,s=a.slice,u=a.dtype,c=a.complexTensors,l=a.isPacked,s!=null)return f=void 0,f=l?new Ra(o,Mi):new he(o,Mi),h=this.runWebGLProgram(f,[{dataId:e,shape:o,dtype:u}],u),d=this.read(h.dataId),this.disposeData(h.dataId),[2,d];if(i!=null)return[2,this.convertAndCacheOnCPU(e)];if(!k().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&k().getNumber("WEBGL_VERSION")===2)throw new Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");return p=null,u!=="complex64"&&k().get("WEBGL_BUFFER_SUPPORTED")&&(v=this.decode(e),m=this.texData.get(v.dataId),p=(T=this.gpgpu).createBufferFromTexture.apply(T,[m.texture].concat(Pa(o)))),this.pendingRead.set(e,[]),u==="complex64"?[3,2]:[4,this.gpgpu.createAndWaitForFence()];case 1:S.sent(),S.label=2;case 2:return u!=="complex64"?[3,4]:[4,Promise.all([c.real.data(),c.imag.data()])];case 3:return x=S.sent(),w=x[0],y=x[1],g=Ls(w,y),[3,5];case 4:p==null?g=this.getValuesFromTexture(e):(b=re(o),g=this.gpgpu.downloadFloat32MatrixFromBuffer(p,b)),S.label=5;case 5:return v!=null&&this.disposeData(v.dataId),A=this.convertAndCacheOnCPU(e,g),I=this.pendingRead.get(e),this.pendingRead.delete(e),I.forEach((function(D){return D(A)})),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e),this.pendingDeletes--),[2,A]}}))}))},t.prototype.checkNumericalProblems=function(e){if(e!=null)for(var n=0;n<e.length;n++){var a=e[n];if(!Tl(a))throw k().getBool("WEBGL_RENDER_FLOAT32_CAPABLE")?Error("The value "+a+" cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'"):Error("The value "+a+" cannot be represented on this device.")}},t.prototype.getValuesFromTexture=function(e){var n,a=this.texData.get(e),i=a.shape,o=a.dtype,s=a.isPacked,u=re(i);if(k().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){var c=this.decode(e),l=this.texData.get(c.dataId),f=(n=this.gpgpu).downloadMatrixFromPackedTexture.apply(n,[l.texture].concat(Pa(i))).subarray(0,u);return this.disposeData(c.dataId),f}var h=k().getBool("WEBGL_PACK")&&s===!0,d=h?Hi(i):i,p=h?new hm(d):new fm(d),v=this.runWebGLProgram(p,[{shape:d,dtype:o,dataId:e}],"float32"),m=this.texData.get(v.dataId),g=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(m.texture,m.texShape[0],m.texShape[1]).subarray(0,u);return this.disposeData(v.dataId),g},t.prototype.time=function(e){return ee(this,void 0,void 0,(function(){var n,a,i,o,s,u,c;return te(this,(function(l){switch(l.label){case 0:return n=this.activeTimers,a=[],i=!1,this.programTimersStack==null?(this.programTimersStack=a,i=!0):this.activeTimers.push(a),this.activeTimers=a,e(),o=Br(this.activeTimers.map((function(f){return f.query}))).filter((function(f){return f!=null})),s=Br(this.activeTimers.map((function(f){return f.name}))).filter((function(f){return f!=null})),this.activeTimers=n,i&&(this.programTimersStack=null),u={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null},k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?[4,Promise.all(o)]:[3,2];case 1:return c=l.sent(),u.kernelMs=fl(c),u.getExtraProfileInfo=function(){return c.map((function(f,h){return{name:s[h],ms:f}})).map((function(f){return f.name+": "+f.ms})).join(", ")},[3,3];case 2:u.kernelMs={error:"WebGL query timers are not supported in this environment."},l.label=3;case 3:return this.uploadWaitMs=0,this.downloadWaitMs=0,[2,u]}}))}))},t.prototype.memory=function(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU}},t.prototype.startTimer=function(){return k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:ir(),endMs:null}},t.prototype.endTimer=function(e){return k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?(this.gpgpu.endQuery(),e):(e.endMs=ir(),e)},t.prototype.getQueryTime=function(e){return ee(this,void 0,void 0,(function(){var n;return te(this,(function(a){return k().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?[2,this.gpgpu.waitForQueryAndGetTime(e)]:[2,(n=e).endMs-n.startMs]}))}))},t.prototype.disposeData=function(e){if(!this.pendingDisposal.has(e)){if(this.pendingRead.has(e))return this.pendingDisposal.add(e),void this.pendingDeletes++;if(this.texData.has(e)){this.releaseGPUData(e);var n=this.texData.get(e).complexTensors;n!=null&&(n.real.dispose(),n.imag.dispose()),this.texData.delete(e)}}},t.prototype.releaseGPUData=function(e){var n=this.texData.get(e),a=n.texture,i=n.dtype,o=n.texShape,s=n.usage,u=n.isPacked,c=n.slice,l=c&&c.origDataId||e,f=this.dataRefCount.get(l);f>1?this.dataRefCount.set(l,f-1):(this.dataRefCount.delete(l),a!=null&&(this.numBytesInGPU-=this.computeBytes(o,i),this.textureManager.releaseTexture(a,o,s,u)));var h=this.texData.get(e);h.texture=null,h.texShape=null,h.isPacked=!1,h.slice=null},t.prototype.getTexture=function(e){return this.uploadToGPU(e),this.texData.get(e).texture},t.prototype.getDataInfo=function(e){return this.texData.get(e)},t.prototype.getCPUBackend=function(){return k().getBool("WEBGL_CPU_FORWARD")?(this.cpuBackend==null&&(this.cpuBackend=B.findBackend("cpu")),this.cpuBackend):null},t.prototype.shouldExecuteOnCPU=function(e,n){var a=this;return n===void 0&&(n=128),this.getCPUBackend()!=null&&e.every((function(i){return a.texData.get(i.dataId).texture==null&&i.size<n}))},t.prototype.getGPGPUContext=function(){return this.gpgpu},t.prototype.complex=function(e,n){var a=this.makeOutput(e.shape,"complex64");return this.texData.get(a.dataId).complexTensors={real:B.keep(e.clone()),imag:B.keep(n.clone())},a},t.prototype.real=function(e){return this.texData.get(e.dataId).complexTensors.real.clone()},t.prototype.imag=function(e){return this.texData.get(e.dataId).complexTensors.imag.clone()},t.prototype.slice=function(e,n,a){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.slice(e,n,a);if(re(a)===0)return ut([],a,e.dtype);var i=this.texData.get(e.dataId).isPacked,o=ru(e.shape,n,a);if(i||!o){var s=k().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Vm(a):new Wm(a),u=s.getCustomSetupFunc(n);return this.compileAndRun(s,[e],null,u)}return this.uploadToGPU(e.dataId),this.shallowSlice(e,n,a)},t.prototype.shallowSlice=function(e,n,a){var i=this.texData.get(e.dataId),o=this.makeOutput(a,e.dtype),s=this.texData.get(o.dataId);Object.assign(s,i),s.shape=a,s.dtype=e.dtype;var u=nu(n,e.strides);i.slice&&(u+=i.slice.flatOffset),s.slice={flatOffset:u,origDataId:i.slice&&i.slice.origDataId||e.dataId};var c=this.dataRefCount.get(s.slice.origDataId)||1;return this.dataRefCount.set(s.slice.origDataId,c+1),o},t.prototype.stridedSlice=function(e,n,a,i){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.stridedSlice(e,n,a,i);var o=lo(n,a,i);if(o.some((function(u){return u===0})))return ut([],o);var s=new Xm(n,i,o);return this.compileAndRun(s,[e])},t.prototype.reverse=function(e,n){var a=k().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Gm(e.shape,n):new Um(e.shape,n);return this.compileAndRun(a,[e])},t.prototype.concat=function(e,n){if(e[0].dtype==="complex64"){var a=e.map((function(d){return Jt(d)})),i=e.map((function(d){return gr(d)}));return pt(this.concat(a,n),this.concat(i,n))}if(this.shouldExecuteOnCPU(e))return this.cpuBackend.concat(e,n);if(e.length===1)return e[0];if(e.length>k().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){var o=Math.floor(e.length/2),s=this.concat(e.slice(0,o),n),u=this.concat(e.slice(o),n);return this.concat([s,u],n)}if(k().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&e[0].rank>1){var c=new Zv(e.map((function(d){return d.shape})),n);return this.compileAndRun(c,e)}var l=gn(e.map((function(d){return d.shape})),n),f=e.map((function(d){return d.as2D(-1,re(d.shape.slice(n)))})),h=new qv(f.map((function(d){return d.shape})));return this.compileAndRun(h,f).reshape(l)},t.prototype.neg=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.neg(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Wc,e.dtype);var n=new he(e.shape,Wc);return this.compileAndRun(n,[e])},t.prototype.batchMatMul=function(e,n,a,i){var o=a?e.shape[2]:e.shape[1],s=i?n.shape[1]:n.shape[2],u=a?e.shape[1]:e.shape[2],c=e.shape[0];if((o===1||s===1)&&u>1e3){a&&(e=e.transpose([0,2,1])),i&&(n=n.transpose([0,2,1]));var l=s===1?e:e.as3D(c,u,1),f=s===1?2:1,h=s===1?n.as3D(c,1,u):n;return this.multiply(l,h).sum(f,!0)}var d=st(e.dtype,n.dtype),p=new us(e.shape,[c,o,s],a,i);return this.compileAndRun(p,[e,n],d)},t.prototype.fusedBatchMatMul=function(e){var n=e.a,a=e.b,i=e.transposeA,o=e.transposeB,s=e.bias,u=e.activation,c=e.preluActivationWeights,l=i?n.shape[2]:n.shape[1],f=o?a.shape[1]:a.shape[2],h=n.shape[0],d=st(n.dtype,a.dtype),p=s!=null,v=c!=null,m=u?_i(u,!0):null,g=new us(n.shape,[h,l,f],i,o,p,m,v),x=[n,a];return s&&x.push(s),c&&x.push(c),this.compileAndRun(g,x,d)},t.prototype.multiply=function(e,n){if(e.dtype==="complex64"){var a=this.texData.get(e.dataId),i=this.texData.get(n.dataId),o=new Bc(Xv,e.shape,n.shape),s=new Bc(Kv,e.shape,n.shape),u=[this.makeComplexComponentTensorInfo(e,a.complexTensors.real),this.makeComplexComponentTensorInfo(e,a.complexTensors.imag),this.makeComplexComponentTensorInfo(n,i.complexTensors.real),this.makeComplexComponentTensorInfo(n,i.complexTensors.imag)],c=this.compileAndRun(o,u),l=this.compileAndRun(s,u),f=this.complex(c,l);return c.dispose(),l.dispose(),f}if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.multiply(e,n);if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,_c,e.dtype);var h=new Ye(_c,e.shape,n.shape);return this.compileAndRun(h,[e,n],e.dtype)},t.prototype.batchNormalization=function(e,n,a,i,o,s){var u=[e,n,a],c=null;s!=null&&(c=s.shape,u.push(s));var l=null;if(o!=null&&(l=o.shape,u.push(o)),k().getBool("WEBGL_PACK_NORMALIZATION")){var f=new Vv(e.shape,n.shape,a.shape,c,l,i);return this.compileAndRun(f,u)}var h=new Wv(e.shape,n.shape,a.shape,c,l,i);return this.compileAndRun(h,u)},t.prototype.localResponseNormalization4D=function(e,n,a,i,o){var s=k().getBool("WEBGL_PACK_NORMALIZATION")?new Cm(e.shape,n,a,i,o):new Am(e.shape,n,a,i,o);return this.compileAndRun(s,[e])},t.prototype.LRNGrad=function(e,n,a,i,o,s,u){var c=new Em(n.shape,i,o,s,u);return this.compileAndRun(c,[n,a,e])},t.prototype.tile=function(e,n){if(e.dtype==="string"){var a=this.readSync(e.dataId).map((function(o){return Na(o)}));return xf(le(e.shape,e.dtype,a),n)}var i=new jm(e.shape,n);return this.compileAndRun(i,[e])},t.prototype.pad=function(e,n,a){var i=k().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Bm(e.shape,n,a):new Mm(e.shape,n,a);return this.compileAndRun(i,[e])},t.prototype.transpose=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.transpose(e,n);var a=k().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new Qm(e.shape,n):new Ym(e.shape,n);return this.compileAndRun(a,[e])},t.prototype.gather=function(e,n,a){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.gather(e,n,a);var i=new xm(e.shape,n.size,a);return this.compileAndRun(i,[e,n])},t.prototype.batchToSpaceND=function(e,n,a){C(e.rank<=4,(function(){return"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet"}));var i=n.reduce((function(f,h){return f*h})),o=Ji(e.shape,n,i),s=$i(o.length,n.length),u=eo(e.shape,n,i),c=sf(a,n.length),l=uf(u,a,n.length);return e.reshape(o).transpose(s).reshape(u).slice(c,l)},t.prototype.spaceToBatchND=function(e,n,a){C(e.rank<=4,(function(){return"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet"}));var i=n.reduce((function(h,d){return h*d})),o=[[0,0]];o.push.apply(o,a);for(var s=1+n.length;s<e.shape.length;++s)o.push([0,0]);var u=e.pad(o),c=Ji(u.shape,n,i,!1),l=$i(c.length,n.length,!1),f=eo(u.shape,n,i,!1);return u.reshape(c).transpose(l).reshape(f)},t.prototype.reduce=function(e,n,a){var i=e.shape[0],o=e.shape[1],s=zi(o),u=new _m({windowSize:s,inSize:o,batchSize:i},n),c=this.compileAndRun(u,[e],a);return c.shape[1]===1?c:this.reduce(c,n,a)},t.prototype.argReduce=function(e,n,a){a===void 0&&(a=null);var i=e.shape[0],o=e.shape[1];a!=null&&(i=a.shape[0],o=a.shape[1]);var s=zi(o),u=new Fv({windowSize:s,inSize:o,batchSize:i},n,a==null),c=[e];a!=null&&c.push(a);var l=this.compileAndRun(u,c,"int32");return l.shape[1]===1?l:this.argReduce(e,n,l)},t.prototype.argReducePacked=function(e,n,a){a===void 0&&(a=null);var i=a!=null?a.shape:e.shape,o=zi(i[i.length-1]),s=new Gv(i,o,n,a==null),u=a==null?[e]:[e,a],c=this.compileAndRun(s,u,"int32");return c.rank===e.rank?this.argReducePacked(e,n,c):c},t.prototype.sum=function(e,n){kt("sum",n,e.rank);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o),u=ns(e.dtype);return this.reduce(s,"sum",u).reshape(i)},t.prototype.prod=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.prod(e,n);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o),u=ns(e.dtype);return this.reduce(s,"prod",u).reshape(i)},t.prototype.unsortedSegmentSum=function(e,n,a){var i=0,o=cr([i],e.rank),s=e;o!=null&&(s=e.transpose(o),i=lr(1,e.rank)[0]);var u=(function(d,p,v){for(var m=[],g=d.length,x=0;x<g;x++)x!==p?m.push(d[x]):m.push(v);return m})(s.shape,i,a),c=re([s.shape[i]]),l=s.as2D(-1,c),f=ns(e.dtype),h=this.segOpCompute(l,"unsortedSegmentSum",n,f,a).reshape(u);return o!=null&&(h=h.transpose(so(o))),h},t.prototype.segOpCompute=function(e,n,a,i,o){var s=e.shape[0],u=e.shape[1],c=(function(h,d){var p,v=!1;for(h<=tu?(p=h,v=!0):p=Yi(h,Math.floor(Math.sqrt(h)));!v;)p>d||p===h?v=!0:p=Yi(h,p+1);return p})(u,o),l=new Hm({windowSize:c,inSize:u,batchSize:s,numSegments:o},n),f=this.compileAndRun(l,[e,a],i);return f.shape[1]===o?f:(a=Zi(0,o).tile([u/c]),this.segOpCompute(f,n,a,i,o))},t.prototype.argMinMaxReduce=function(e,n,a){var i=[n];if(kt("arg"+a.charAt(0).toUpperCase()+a.slice(1),i,e.rank),!k().getBool("WEBGL_PACK_REDUCE")||e.rank<=2){var o=vt(e.shape,i),s=o[0],u=re(o[1]),c=e.as2D(-1,u);return this.argReduce(c,a).reshape(s)}return this.argReducePacked(e,a)},t.prototype.argMin=function(e,n){return this.argMinMaxReduce(e,n,"min")},t.prototype.argMax=function(e,n){return this.argMinMaxReduce(e,n,"max")},t.prototype.cumsum=function(e,n,a,i){if(n!==e.rank-1)throw new Error("WebGL cumsum shader expects an inner-most axis="+(e.rank-1)+" but got axis="+n);var o=new om(e.shape,a,i);return this.compileAndRun(o,[e])},t.prototype.equal=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(equal(a, b));
`,"bool");var a=new Ye("return float(a == b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.notEqual=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(notEqual(a, b));
`,"bool");var a=new Ye("return float(a != b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.less=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.less(e,n);if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(lessThan(a, b));
`,"bool");var a=new Ye("return float(a < b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.lessEqual=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(lessThanEqual(a, b));
`,"bool");var a=new Ye("return float(a <= b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.greater=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.greater(e,n);if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(greaterThan(a, b));
`,"bool");var a=new Ye("return float(a > b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.greaterEqual=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(greaterThanEqual(a, b));
`,"bool");var a=new Ye("return float(a >= b);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.logicalNot=function(e){var n=new he(e.shape,"return float(!(x >= 1.0));");return this.compileAndRun(n,[e])},t.prototype.logicalAnd=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,"bool");var a=new Ye("return float(a >= 1.0 && b >= 1.0);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.logicalOr=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,"bool");var a=new Ye("return float(a >= 1.0 || b >= 1.0);",e.shape,n.shape);return this.compileAndRun(a,[e,n],"bool")},t.prototype.select=function(e,n,a){var i=new zm(e.rank,n.shape,n.rank);return this.compileAndRun(i,[e,n,a],st(n.dtype,a.dtype))},t.prototype.where=function(e){Qi("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");var n=e.dataSync();return cu(e.shape,n)},t.prototype.topk=function(e,n,a){return yf(e.dataSync(),e.shape,e.dtype,n)},t.prototype.min=function(e,n){kt("min",n,e.rank);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o);return this.reduce(s,"min",s.dtype).reshape(i)},t.prototype.minimum=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.minimum(e,n);var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  vec4 result = vec4(min(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new Ye(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return min(a, b);
`,e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.mod=function(e,n){var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  vec4 result = mod(a, b);
  vec4 isNaN = vec4(equal(b, vec4(0.0)));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new Ye(`if (b == 0.0) return NAN;
  return mod(a, b);`,e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.max=function(e,n){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.max(e,n);kt("max",n,e.rank);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o);return this.reduce(s,"max",s.dtype).reshape(i)},t.prototype.maximum=function(e,n){if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.maximum(e,n);var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  vec4 result = vec4(max(a, b));
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new Ye(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return max(a, b);
`,e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.all=function(e,n){kt("all",n,e.rank);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o);return this.reduce(s,"all",s.dtype).reshape(i)},t.prototype.any=function(e,n){kt("any",n,e.rank);var a=vt(e.shape,n),i=a[0],o=re(a[1]),s=e.as2D(-1,o);return this.reduce(s,"any",s.dtype).reshape(i)},t.prototype.realDivide=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,"float32",!0);var a=new Ye(`
if (a == b) {
  return 1.0;
};
return a / b;`,e.shape,n.shape);return this.compileAndRun(a,[e,n],"float32")},t.prototype.floorDiv=function(e,n){if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,"int32");var a=new Ye(`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,e.shape,n.shape);return this.compileAndRun(a,[e,n],"int32")},t.prototype.add=function(e,n){if(e.dtype==="complex64"&&n.dtype==="complex64")return this.complexSeparableBinaryOp(e,n,os);if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.add(e,n);var a=st(e.dtype,n.dtype);if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,os,a);var i=new Ye(os,e.shape,n.shape);return this.compileAndRun(i,[e,n],a)},t.prototype.packedUnaryOp=function(e,n,a){var i=new Ra(e.shape,n);return this.compileAndRun(i,[e],a)},t.prototype.packedBinaryOp=function(e,n,a,i,o){o===void 0&&(o=!1);var s=new Ir(a,e.shape,n.shape,o);return this.compileAndRun(s,[e,n],i)},t.prototype.complexSeparableBinaryOp=function(e,n,a){var i=this,o=this.texData.get(e.dataId),s=this.texData.get(n.dataId),u=[[o.complexTensors.real,s.complexTensors.real],[o.complexTensors.imag,s.complexTensors.imag]].map((function(h){var d=h[0],p=h[1],v=i.makeComplexComponentTensorInfo(e,d),m=i.makeComplexComponentTensorInfo(n,p),g=new Ye(a,e.shape,n.shape);return i.compileAndRun(g,[v,m],st(d.dtype,p.dtype))})),c=u[0],l=u[1],f=this.complex(c,l);return c.dispose(),l.dispose(),f},t.prototype.makeComplexComponentTensorInfo=function(e,n){return{dataId:n.dataId,dtype:n.dtype,shape:e.shape}},t.prototype.addN=function(e){if(e.length===1)return e[0];if(e.length>k().get("WEBGL_MAX_TEXTURES_IN_SHADER")){var n=Math.floor(e.length/2),a=this.addN(e.slice(0,n)),i=this.addN(e.slice(n));return this.addN([a,i])}var o=e.map((function(c){return c.dtype})).reduce((function(c,l){return st(c,l)})),s=e.map((function(c){return c.shape})),u=k().getBool("WEBGL_PACK")?new Pv(e[0].shape,s):new _v(e[0].shape,s);return this.compileAndRun(u,e,o)},t.prototype.subtract=function(e,n){if(e.dtype==="complex64"&&n.dtype==="complex64")return this.complexSeparableBinaryOp(e,n,ss);if(this.shouldExecuteOnCPU([e,n]))return this.cpuBackend.subtract(e,n);var a=st(e.dtype,n.dtype);if(k().getBool("WEBGL_PACK_BINARY_OPERATIONS"))return this.packedBinaryOp(e,n,ss,e.dtype);var i=new Ye(ss,e.shape,n.shape);return this.compileAndRun(i,[e,n],a)},t.prototype.pow=function(e,n){var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  vec4 isNaN = vec4(lessThan(a, vec4(0.0))) * vec4(lessThan(floor(b), b));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new Ye(`
if(a < 0.0 && floor(b) < b){
  return NAN;
}
if (b == 0.0) {
  return 1.0;
}
return (round(mod(b, 2.0)) != 1) ?
    pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,e.shape,n.shape),i=st(e.dtype,n.dtype);return this.compileAndRun(a,[e,n],i)},t.prototype.ceil=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.ceil(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Vc,e.dtype);var n=new he(e.shape,Vc);return this.compileAndRun(n,[e])},t.prototype.floor=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.floor(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Xc,e.dtype);var n=new he(e.shape,Xc);return this.compileAndRun(n,[e])},t.prototype.sign=function(e){var n=new he(e.shape,`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`);return this.compileAndRun(n,[e])},t.prototype.isNaN=function(e){var n=new he(e.shape,"return float(isnan(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.isInf=function(e){var n=new he(e.shape,"return float(isinf(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.isFinite=function(e){var n=new he(e.shape,"return float(!isnan(x) && !isinf(x));");return this.compileAndRun(n,[e],"bool")},t.prototype.round=function(e){var n=new he(e.shape,`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`);return this.compileAndRun(n,[e])},t.prototype.exp=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.exp(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,Kc,e.dtype);var n=new he(e.shape,Kc);return this.compileAndRun(n,[e])},t.prototype.expm1=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.expm1(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,jc,e.dtype);var n=new he(e.shape,jc);return this.compileAndRun(n,[e])},t.prototype.softmax=function(e,n){var a=et([n],e.shape),i=this.max(e,a),o=Rt(i.shape,a),s=this.subtract(e,i.reshape(o)),u=this.exp(s),c=this.sum(u,a).reshape(o);return this.realDivide(u,c)},t.prototype.log=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.log(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,`
  vec4 result = log(x);
  vec4 isNaN = vec4(lessThan(x, vec4(0.0)));
  result.r = isNaN.r == 1.0 ? NAN : result.r;
  result.g = isNaN.g == 1.0 ? NAN : result.g;
  result.b = isNaN.b == 1.0 ? NAN : result.b;
  result.a = isNaN.a == 1.0 ? NAN : result.a;

  return result;
`,e.dtype);var n=new he(e.shape,`if (x < 0.0) return NAN;
  return log(x);`);return this.compileAndRun(n,[e])},t.prototype.log1p=function(e){var n=new he(e.shape,"return log(1.0 + x);");return this.compileAndRun(n,[e])},t.prototype.sqrt=function(e){var n=new he(e.shape,"return sqrt(x);");return this.compileAndRun(n,[e])},t.prototype.rsqrt=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.rsqrt(e);var n=new he(e.shape,"return inversesqrt(x);");return this.compileAndRun(n,[e])},t.prototype.reciprocal=function(e){var n=new he(e.shape,"return 1.0 / x;");return this.compileAndRun(n,[e])},t.prototype.relu=function(e){var n;return n=k().getBool("WEBGL_PACK")?new Ra(e.shape,Xf):new he(e.shape,zf),this.compileAndRun(n,[e])},t.prototype.relu6=function(e){var n;return n=k().getBool("WEBGL_PACK")?new Ra(e.shape,Kf):new he(e.shape,Wf),this.compileAndRun(n,[e])},t.prototype.prelu=function(e,n){var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(Cf,e.shape,n.shape):new Ye(Ef,e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.elu=function(e){if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,jf,e.dtype);var n=new he(e.shape,Vf);return this.compileAndRun(n,[e])},t.prototype.eluDer=function(e,n){var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,e.shape,n.shape):new Ye("return (b >= 1.0) ? a : a * (b + 1.0);",e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.selu=function(e){var n=new he(e.shape,Zm);return this.compileAndRun(n,[e])},t.prototype.int=function(e){var n=new he(e.shape,"return float(int(x));");return this.compileAndRun(n,[e],"int32")},t.prototype.clip=function(e,n,a){var i,o=(i=k().getBool("WEBGL_PACK_CLIP")?new Yv(e.shape):new jv(e.shape)).getCustomSetupFunc(n,a);return this.compileAndRun(i,[e],null,o)},t.prototype.abs=function(e){if(this.shouldExecuteOnCPU([e]))return this.cpuBackend.abs(e);if(k().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,zc,e.dtype);var n=new he(e.shape,zc);return this.compileAndRun(n,[e])},t.prototype.complexAbs=function(e){var n=this.texData.get(e.dataId),a=new Qv(e.shape),i=[this.makeComplexComponentTensorInfo(e,n.complexTensors.real),this.makeComplexComponentTensorInfo(e,n.complexTensors.imag)];return this.compileAndRun(a,i)},t.prototype.sigmoid=function(e){var n=new he(e.shape,"return 1.0 / (1.0 + exp(-1.0 * x));");return this.compileAndRun(n,[e])},t.prototype.softplus=function(e){var n=new he(e.shape,`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`);return this.compileAndRun(n,[e])},t.prototype.sin=function(e){var n=new he(e.shape,Jm);return this.compileAndRun(n,[e])},t.prototype.cos=function(e){var n=new he(e.shape,$m);return this.compileAndRun(n,[e])},t.prototype.tan=function(e){var n=new he(e.shape,"return tan(x);");return this.compileAndRun(n,[e])},t.prototype.asin=function(e){var n=new he(e.shape,eg);return this.compileAndRun(n,[e])},t.prototype.acos=function(e){var n=new he(e.shape,tg);return this.compileAndRun(n,[e])},t.prototype.atan=function(e){var n=new he(e.shape,rg);return this.compileAndRun(n,[e])},t.prototype.atan2=function(e,n){var a=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir(`
  vec4 result = atan(a, b);
  vec4 isNaN = min(vec4(isnan(a)) + vec4(isnan(b)), vec4(1.0));
  
  result.r = isNaN.r > 0. ? NAN : result.r;
  result.g = isNaN.g > 0. ? NAN : result.g;
  result.b = isNaN.b > 0. ? NAN : result.b;
  result.a = isNaN.a > 0. ? NAN : result.a;

  return result;
`,e.shape,n.shape):new Ye(`
  if (isnan(a)) return a;
  if (isnan(b)) return b;

  return atan(a, b);
`,e.shape,n.shape);return this.compileAndRun(a,[e,n])},t.prototype.sinh=function(e){var n=new he(e.shape,`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`);return this.compileAndRun(n,[e])},t.prototype.cosh=function(e){var n=new he(e.shape,`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`);return this.compileAndRun(n,[e])},t.prototype.tanh=function(e){var n=new he(e.shape,`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`);return this.compileAndRun(n,[e])},t.prototype.asinh=function(e){var n=new he(e.shape,ng);return this.compileAndRun(n,[e])},t.prototype.acosh=function(e){var n=new he(e.shape,ag);return this.compileAndRun(n,[e])},t.prototype.atanh=function(e){var n=new he(e.shape,ig);return this.compileAndRun(n,[e])},t.prototype.erf=function(e){var n=new he(e.shape,`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = 0.3275911;
  float a1 = 0.254829592;
  float a2 = -0.284496736;
  float a3 = 1.421413741;
  float a4 = -1.453152027;
  float a5 = 1.061405429;

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`);return this.compileAndRun(n,[e])},t.prototype.step=function(e,n){var a=new he(e.shape,(function(i){return i===void 0&&(i=0),fr+`
    return x > 0.0 ? 1.0 : float(`+i+`);
  `})(n));return this.compileAndRun(a,[e])},t.prototype.conv2dByMatMul=function(e,n,a,i,o,s){var u=e.shape,c=this.texData.get(e.dataId),l=a.inChannels,f=u[0]*u[1]*u[2],h=a.outChannels,d=a.dataFormat==="channelsLast",p=(f===1||h===1)&&l>1e3,v=u[2]%2!=0&&!!c.isPacked;if(p||!k().getBool("WEBGL_LAZILY_UNPACK")||!k().getBool("WEBGL_PACK_BINARY_OPERATIONS")||!v){var m=d?u[0]*u[1]*u[2]:u[0]*u[2]*u[3],g=this.reshape(e,[1,m,a.inChannels]),x=this.reshape(n,[1,a.inChannels,a.outChannels]);return this.reshape(this.fusedBatchMatMul({a:g,b:x,transposeA:!1,transposeB:!1,bias:i,activation:o,preluActivationWeights:s}),a.outShape)}var w=d?u[0]*u[1]*(u[2]+1):u[0]*u[2]*(u[3]+1),y={dataId:e.dataId,shape:[1,w,a.inChannels],dtype:e.dtype},b=c.shape;c.shape=c.shape.slice(),c.shape[c.shape.length-2]++,C(_a(c.shape,y.shape),(function(){return"packed reshape "+c.shape+" to "+y.shape+" isn't free"}));var A=this.reshape(n,[1,a.inChannels,a.outChannels]),I=this.fusedBatchMatMul({a:y,b:A,transposeA:!1,transposeB:!1,bias:i,activation:o,preluActivationWeights:s}),T=this.texData.get(I.dataId);return C(T.isPacked,(function(){return"batchMatMul result is expected to be packed"})),c.shape=b,T.shape=a.outShape,B.makeTensorFromDataId(I.dataId,a.outShape,I.dtype)},t.prototype.conv2dWithIm2Row=function(e,n,a,i,o,s){var u=a.filterWidth,c=a.filterHeight,l=a.inChannels,f=a.outWidth,h=a.outHeight,d=a.dataFormat==="channelsLast",p=u*c*l,v=h*f,m=[p,v],g=e.squeeze([0]),x=n.reshape([1,p,-1]),w=new bm(m,g.shape,a),y=this.compileAndRun(w,[g]).reshape([1,m[0],m[1]]),b=i!=null,A=s!=null,I=o?_i(o,!0):null,T=new us(y.shape,[1,v,a.outChannels],!0,!1,b,I,A),S=[y,x];i&&S.push(i),A&&S.push(s);var D=this.compileAndRun(T,S);return d?D.reshape([1,h,f,a.outChannels]):D.reshape([1,a.outChannels,h,f])},t.prototype.fusedConv2d=function(e){var n=e.input,a=e.filter,i=e.convInfo,o=e.bias,s=e.activation,u=e.preluActivationWeights;if(i.filterHeight===1&&i.filterWidth===1&&i.dilationHeight===1&&i.dilationWidth===1&&i.strideHeight===1&&i.strideWidth===1&&(i.padInfo.type==="SAME"||i.padInfo.type==="VALID"))return this.conv2dByMatMul(n,a,i,o,s,u);if(k().getBool("WEBGL_CONV_IM2COL")&&n.shape[0]===1)return this.conv2dWithIm2Row(n,a,i,o,s,u);var c=o!=null,l=u!=null,f=s?_i(s,!1):null,h=new Pc(i,c,f,l),d=[n,a];return o&&d.push(o),u&&d.push(u),this.compileAndRun(h,d)},t.prototype.conv2d=function(e,n,a){if(a.filterHeight===1&&a.filterWidth===1&&a.dilationHeight===1&&a.dilationWidth===1&&a.strideHeight===1&&a.strideWidth===1&&(a.padInfo.type==="SAME"||a.padInfo.type==="VALID"))return this.conv2dByMatMul(e,n,a);if(k().getBool("WEBGL_CONV_IM2COL")&&e.shape[0]===1)return this.conv2dWithIm2Row(e,n,a);var i=new Pc(a);return this.compileAndRun(i,[e,n])},t.prototype.conv2dDerInput=function(e,n,a){var i=new $v(a);return this.compileAndRun(i,[e,n])},t.prototype.conv2dDerFilter=function(e,n,a){var i=new Jv(a);return this.compileAndRun(i,[e,n])},t.prototype.fusedDepthwiseConv2D=function(e){var n,a=e.input,i=e.filter,o=e.convInfo,s=e.bias,u=e.activation,c=e.preluActivationWeights,l=k().getBool("WEBGL_PACK_DEPTHWISECONV")&&o.strideWidth<=2&&o.outChannels/o.inChannels==1,f=u?_i(u,l):null,h=[a,i],d=s!=null,p=c!=null;return d&&h.push(s),p&&h.push(c),l?(n=new kc(o,d,f,p),this.compileAndRun(n,h)):(n=new Fc(o,d,f,p),this.compileAndRun(n,h))},t.prototype.depthwiseConv2D=function(e,n,a){var i;return k().getBool("WEBGL_PACK_DEPTHWISECONV")&&a.strideWidth<=2&&a.outChannels/a.inChannels==1?(i=new kc(a),this.compileAndRun(i,[e,n])):(i=new Fc(a),this.compileAndRun(i,[e,n]))},t.prototype.depthwiseConv2DDerInput=function(e,n,a){var i=new nm(a);return this.compileAndRun(i,[e,n])},t.prototype.depthwiseConv2DDerFilter=function(e,n,a){var i=new rm(a);return this.compileAndRun(i,[e,n])},t.prototype.conv3d=function(e,n,a){var i=new am(a);return this.compileAndRun(i,[e,n])},t.prototype.conv3dDerInput=function(e,n,a){var i=new tm(a);return this.compileAndRun(i,[e,n])},t.prototype.conv3dDerFilter=function(e,n,a){var i=new em(a);return this.compileAndRun(i,[e,n])},t.prototype.maxPool=function(e,n){var a=new cs(n,"max",!1);return this.compileAndRun(a,[e])},t.prototype.avgPool=function(e,n){var a=new cs(n,"avg",!1);return this.compileAndRun(a,[e],"float32")},t.prototype.maxPoolBackprop=function(e,n,a,i){var o=new cs(i,"max",!0),s=this.compileAndRun(o,[n]),u=new Sm(i),c=this.compileAndRun(u,[e,s],n.dtype);return s.dispose(),c},t.prototype.avgPoolBackprop=function(e,n,a){var i=new Hv(a);return this.compileAndRun(i,[e],n.dtype)},t.prototype.cast=function(e,n){return iu(e,n,this)},t.prototype.unstack=function(e,n){for(var a=e.shape[n],i=new Array(e.rank-1),o=0,s=0;s<e.rank;s++)s!==n&&(i[o++]=e.shape[s]);var u=new Array(e.rank).fill(0),c=e.shape.slice();c[n]=1;var l=new Array(a);for(s=0;s<l.length;s++)u[n]=s,l[s]=this.slice(e,u,c).reshape(i);return l},t.prototype.avgPool3d=function(e,n){var a=new ls(n,"avg",!1);return this.compileAndRun(a,[e],"float32")},t.prototype.avgPool3dBackprop=function(e,n,a){var i=new zv(a);return this.compileAndRun(i,[e],n.dtype)},t.prototype.maxPool3d=function(e,n){var a=new ls(n,"max",!1);return this.compileAndRun(a,[e],"float32")},t.prototype.maxPool3dBackprop=function(e,n,a,i){var o=new ls(i,"max",!0),s=this.compileAndRun(o,[n]),u=new Dm(i),c=this.compileAndRun(u,[e,s],n.dtype);return s.dispose(),c},t.prototype.reshape=function(e,n){var a=this.texData.get(e.dataId);if(a.isPacked&&!_a(e.shape,n)&&(a.texture===null||!_a(a.shape,n))){var i=this.packedReshape(e,n);return B.makeTensorFromDataId(i.dataId,i.shape,i.dtype)}return ro(e,n)},t.prototype.resizeBilinear=function(e,n,a,i){var o=k().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new Nm(e.shape,n,a,i):new km(e.shape,n,a,i);return this.compileAndRun(o,[e],"float32")},t.prototype.resizeBilinearBackprop=function(e,n,a){var i=new Fm(e,n,a);return this.compileAndRun(i,[e])},t.prototype.resizeNearestNeighbor=function(e,n,a,i){var o=new Lm(e.shape,n,a,i);return this.compileAndRun(o,[e])},t.prototype.resizeNearestNeighborBackprop=function(e,n,a){var i=new Om(e,n,a);return this.compileAndRun(i,[e])},t.prototype.multinomial=function(e,n,a,i){var o=n?e:_t(e),s=o.shape[0],u=o.shape[1],c=new Tm(s,u,a),l=c.getCustomSetupFunc(i);return this.compileAndRun(c,[o],"int32",l)},t.prototype.oneHot=function(e,n,a,i){var o=new Im(e.size,n,a,i);return this.compileAndRun(o,[e])},t.prototype.diag=function(e){var n=new lm(e.size);return this.compileAndRun(n,[e])},t.prototype.nonMaxSuppression=function(e,n,a,i,o){return Qi("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead"),su(e.dataSync(),n.dataSync(),a,i,o)},t.prototype.cropAndResize=function(e,n,a,i,o,s){var u=new im(e.shape,n.shape,i,o,s);return this.compileAndRun(u,[e,n,a],"float32")},t.prototype.depthToSpace=function(e,n,a){C(n>1,(function(){return"blockSize should be > 1 for depthToSpace, but was: "+n}));var i=e.shape[0],o=a==="NHWC"?e.shape[1]:e.shape[2],s=a==="NHWC"?e.shape[2]:e.shape[3],u=a==="NHWC"?e.shape[3]:e.shape[1],c=o*n,l=s*n,f=u/(n*n),h=new cm(a==="NHWC"?[i,c,l,f]:[i,f,c,l],n,a);return this.compileAndRun(h,[e])},t.prototype.split=function(e,n,a){return gf(e,n,a)},t.prototype.scatterND=function(e,n,a){var i=Ha(0,e,a),o=i.sliceRank,s=i.numUpdates,u=i.sliceSize,c=i.strides,l=i.outputSize,f=[l/u,u],h=e.reshape([s,o]),d=n.reshape([s,u]);if(l===0)return ro(ut([]),a);var p=Y(0),v=new Uc(s,o,h.rank,d.rank,c,f);return this.compileAndRun(v,[d,h,p]).reshape(a)},t.prototype.sparseToDense=function(e,n,a,i){var o=Ha(0,e,a),s=o.sliceRank,u=o.numUpdates,c=o.strides,l=o.outputSize,f=new Uc(u,s,e.rank,n.rank,c,[l,1],!1);return this.compileAndRun(f,[n,e,i]).reshape(a)},t.prototype.fft=function(e){return this.fftImpl(e,!1)},t.prototype.ifft=function(e){return this.fftImpl(e,!0)},t.prototype.fftImpl=function(e,n){var a=this.texData.get(e.dataId),i=new Oc(vm,e.shape,n),o=new Oc(mm,e.shape,n),s=[this.makeComplexComponentTensorInfo(e,a.complexTensors.real),this.makeComplexComponentTensorInfo(e,a.complexTensors.imag)],u=this.compileAndRun(i,s),c=this.compileAndRun(o,s),l=this.complex(u,c).as2D(e.shape[0],e.shape[1]);return u.dispose(),c.dispose(),l},t.prototype.gatherND=function(e,n){var a=n.shape,i=a[a.length-1],o=eu(e,n),s=o[0],u=o[1],c=o[2],l=o[3],f=n.reshape([u,i]),h=e.reshape([e.size/c,c]),d=new ym(i,l,[u,c]);return this.compileAndRun(d,[h,f]).reshape(s)},t.prototype.fill=function(e,n,a){if((a=a||Qn(n))==="string"){var i=ka(a,re(e));return i.fill(n),B.makeTensor(i,e,a,this)}var o=new gm(e,n),s=o.getCustomSetupFunc(n);return this.compileAndRun(o,[],a,s)},t.prototype.onesLike=function(e){if(e.dtype==="string")throw new Error("onesLike is not supported under string dtype");return this.fill(e.shape,1,e.dtype)},t.prototype.zerosLike=function(e){return this.fill(e.shape,e.dtype==="string"?"":0,e.dtype)},t.prototype.linspace=function(e,n,a){return ou(e,n,a)},t.prototype.makeTensorInfo=function(e,n){var a=this.write(null,e,n);return this.texData.get(a).usage=null,{dataId:a,shape:e,dtype:n}},t.prototype.makeOutput=function(e,n){var a=this.makeTensorInfo(e,n).dataId;return B.makeTensorFromDataId(a,e,n,this)},t.prototype.unpackTensor=function(e){var n=new sg(e.shape);return this.runWebGLProgram(n,[e],e.dtype)},t.prototype.packTensor=function(e){var n=new Rm(e.shape);return this.runWebGLProgram(n,[e],e.dtype,null,!0)},t.prototype.packedReshape=function(e,n){var a=[Ua(e.shape)].concat(Ga(e.shape)),i={dtype:e.dtype,shape:a,dataId:e.dataId},o=[Ua(n)].concat(Ga(n)),s=new Pm(o,a),u=this.runWebGLProgram(s,[i],e.dtype,null,!0);return{dataId:u.dataId,shape:n,dtype:u.dtype}},t.prototype.decode=function(e){var n,a=this.texData.get(e),i=a.isPacked,o=a.shape,s=a.dtype,u=Hi(o);return n=i?new um(u):new sm(u),{dtype:s,shape:o,dataId:this.runWebGLProgram(n,[{shape:u,dtype:s,dataId:e}],s,null,!0).dataId}},t.prototype.runWebGLProgram=function(e,n,a,i,o){var s=this;o===void 0&&(o=!1);var u=this.makeTensorInfo(e.outputShape,a),c=this.texData.get(u.dataId);if(e.packedOutput&&(c.isPacked=!0),e.outPackingScheme===La.DENSE){var l=Pa(e.outputShape);c.texShape=l.map((function(w){return 2*w}))}if(e.outTexUsage!=null&&(c.usage=e.outTexUsage),re(u.shape)===0)return c.values=jn(u.dtype,0),u;var f=[],h=n.map((function(w){if(w.dtype==="complex64")throw new Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");var y=s.texData.get(w.dataId);if(y.texture==null){if(!e.packedInputs&&re(w.shape)<=k().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:w.shape,texData:null,isUniform:!0,uniformValues:y.values};e.packedInputs&&(y.isPacked=!0,y.shape=w.shape)}else if(!!y.isPacked!=!!e.packedInputs)w=y.isPacked?s.unpackTensor(w):s.packTensor(w),f.push(w),y=s.texData.get(w.dataId);else if(y.isPacked&&!_a(y.shape,w.shape)){var b=w,A=w.shape;w.shape=y.shape,w=s.packedReshape(w,A),f.push(w),y=s.texData.get(w.dataId),b.shape=A}return s.uploadToGPU(w.dataId),{shape:w.shape,texData:y,isUniform:!1}}));this.uploadToGPU(u.dataId);var d,p={shape:u.shape,texData:c,isUniform:!1},v=(function(w,y,b){var A="";y.concat(b).forEach((function(S){var D=S.texData!=null&&S.texData.slice!=null&&S.texData.slice.flatOffset>0,_=S.isUniform?"uniform":S.texData.texShape;A+=S.shape+"_"+_+"_"+D}));var I=w.userCode,T=w.constructor.name;return T+="_"+A+"_"+I})(e,h,p),m=this.getAndSaveBinary(v,(function(){return(function(w,y,b,A){var I=y.userCode,T=b.map((function(U,z){var X={logicalShape:U.shape,texShape:U.isUniform?null:U.texData.texShape,isUniform:U.isUniform,isPacked:!U.isUniform&&U.texData.isPacked,flatOffset:null};return U.texData!=null&&U.texData.slice!=null&&U.texData.slice.flatOffset>0&&(X.flatOffset=U.texData.slice.flatOffset),{name:y.variableNames[z],shapeInfo:X}})),S=T.map((function(U){return U.shapeInfo})),D={logicalShape:A.shape,texShape:A.texData.texShape,isUniform:!1,isPacked:A.texData.isPacked,flatOffset:null},_=kv(T,D,I,y.packedInputs),M=w.createProgram(_),L=null,O=w.getUniformLocation(M,"NAN",!1);k().getNumber("WEBGL_VERSION")===1&&(L=w.getUniformLocation(M,"INFINITY",!1));for(var N={},H=0;H<y.variableNames.length;H++){var G=y.variableNames[H];N[G]=w.getUniformLocation(M,G,!1),N["offset"+G]=w.getUniformLocation(M,"offset"+G,!1)}return{program:y,source:_,webGLProgram:M,uniformLocations:N,inShapeInfos:S,outShapeInfo:D,infLoc:L,nanLoc:O}})(s.gpgpu,e,h,p)})),g=this.activeTimers!=null;if(g&&(d=this.startTimer()),(function(w,y,b,A,I){Lc(y.inShapeInfos,b),Lc([y.outShapeInfo],[A]);var T=A.texData.texture,S=A.texData.texShape;A.texData.isPacked?w.setOutputPackedMatrixTexture(T,S[0],S[1]):w.setOutputMatrixTexture(T,S[0],S[1]),w.setProgram(y.webGLProgram),k().getNumber("WEBGL_VERSION")===1&&y.infLoc!==null&&w.gl.uniform1f(y.infLoc,1/0),y.nanLoc!==null&&w.gl.uniform1f(y.nanLoc,NaN),b.forEach((function(D,_){var M=y.program.variableNames[_],L=y.uniformLocations[M],O=y.uniformLocations["offset"+M];if(L!=null)if(D.isUniform)if(re(D.shape)<2)w.gl.uniform1f(L,D.uniformValues[0]);else{var N=D.uniformValues;N instanceof Float32Array||(N=new Float32Array(N)),w.gl.uniform1fv(L,N)}else D.texData.slice!=null&&O!=null&&w.gl.uniform1i(O,D.texData.slice.flatOffset),w.setInputMatrixTexture(D.texData.texture,L,_)})),I?.(w,y.webGLProgram),w.executeProgram()})(this.gpgpu,m,h,p,i),f.forEach((function(w){return s.disposeData(w.dataId)})),g&&(d=this.endTimer(d),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(d)})),!k().getBool("WEBGL_LAZILY_UNPACK")&&c.isPacked&&o===!1){var x=this.unpackTensor(u);return this.disposeData(u.dataId),x}return u},t.prototype.compileAndRun=function(e,n,a,i,o){o===void 0&&(o=!1),a=a||n[0].dtype;var s=this.runWebGLProgram(e,n,a,i,o);return B.makeTensorFromDataId(s.dataId,s.shape,s.dtype)},t.prototype.getAndSaveBinary=function(e,n){return e in this.binaryCache||(this.binaryCache[e]=n()),this.binaryCache[e]},t.prototype.getTextureManager=function(){return this.textureManager},t.prototype.dispose=function(){var e=this;this.disposed||(k().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach((function(n){e.gpgpu.deleteProgram(e.binaryCache[n].webGLProgram),delete e.binaryCache[n]})),this.textureManager.dispose(),this.canvas!=null&&typeof HTMLCanvasElement<"u"&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)},t.prototype.floatPrecision=function(){var e=this;return this.floatPrecisionValue==null&&(this.floatPrecisionValue=V((function(){if(!k().get("WEBGL_RENDER_FLOAT32_ENABLED")){var n=k().getBool("DEBUG");k().set("DEBUG",!1);var a=e.abs(Y(1e-8)).dataSync()[0];if(k().set("DEBUG",n),a>0)return 32}return 16}))),this.floatPrecisionValue},t.prototype.epsilon=function(){return this.floatPrecision()===32?1e-7:1e-4},t.prototype.uploadToGPU=function(e){var n,a=this.texData.get(e),i=a.shape,o=a.dtype,s=a.values,u=a.texture,c=a.usage,l=a.isPacked;if(u==null){var f,h=this.activeTimers!=null;h&&(f=ir());var d=a.texShape;if(d==null&&(d=Vl(i,l),a.texShape=d),s!=null){var p=Hi(i),v=void 0,m=d[1],g=d[0],x=s instanceof Uint8Array;l?(m=(n=Xa(d[0],d[1]))[0],g=n[1],v=new pm(p,[g,m],x)):v=new dm(p,[g,m],x);var w=this.makeTensorInfo([g,m],o);this.texData.get(w.dataId).usage=x?Kt.PIXELS:Kt.UPLOAD,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(w.dataId),m,g,s);var y=this.runWebGLProgram(v,[w],o,null,!0),b=this.texData.get(y.dataId);a.texture=b.texture,a.texShape=b.texShape,a.isPacked=b.isPacked,a.usage=b.usage,this.disposeData(w.dataId),this.texData.delete(y.dataId),a.values=null,h&&(this.uploadWaitMs+=ir()-f)}else{var A=this.acquireTexture(d,c,o,l);a.texture=A}}},t.prototype.convertAndCacheOnCPU=function(e,n){var a=this.texData.get(e),i=a.dtype;return this.releaseGPUData(e),n!=null&&(a.values=(function(o,s){if(s==="float32"||s==="complex64")return o;if(s==="int32"||s==="bool"){for(var u=s==="int32"?new Int32Array(o.length):new Uint8Array(o.length),c=0;c<u.length;++c)u[c]=Math.round(o[c]);return u}throw new Error("Unknown dtype "+s)})(n,i)),a.values},t.prototype.acquireTexture=function(e,n,a,i){if(this.numBytesInGPU+=this.computeBytes(e,a),!this.warnedAboutMemory&&this.numBytesInGPU>1024*this.numMBBeforeWarning*1024){var o=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn("High memory usage in GPU: "+o+" MB, most likely due to a memory leak")}return this.textureManager.acquireTexture(e,n,i)},t.prototype.computeBytes=function(e,n){return e[0]*e[1]*Xs(n)},t})(vf);Sl()&&B.registerBackend("webgl",(function(){return new Yf}),2);var cg=R({square_:function(r){var t=E(r,"x","square"),e=[t];return B.runKernelFunc((function(n,a){return a([t]),n.square(t)}),{x:t},null,"Square",{},e,[])}}),Va="SquaredDifference",Qf=R({squaredDifference_:function(r,t){var e,n=E(r,"a","squaredDifference"),a=E(t,"b","squaredDifference");e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape);var i={a:n,b:a},o=[n,a];return B.runKernelFunc((function(s,u){var c=s.squaredDifference(n,a);return u([n,a]),c}),i,(function(s,u){var c=u[0],l=u[1],f=Y(2);return{a:function(){return s.mul(c.sub(l).mul(f))},b:function(){return s.mul(l.sub(c).mul(f))}}}),Va,{},o,[])}}),lg=R({abs_:function(r){var t=E(r,"x","abs");return t.dtype==="complex64"?B.runKernelFunc((function(e){return e.complexAbs(t)}),{$x:t}):B.runKernelFunc((function(e,n){var a=e.abs(t);return n([t]),a}),{x:t},(function(e,n){var a=n[0];return{x:function(){return e.mul(a.toFloat().step(-1))}}}),"Abs")}}),fg=R({acos_:function(r){var t=E(r,"x","acos");return B.runKernelFunc((function(e,n){var a=e.acos(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.divStrict(Y(1).sub(a.toFloat().square()).sqrt()).neg()}}}))}}),hg=R({acosh_:function(r){var t=E(r,"x","acosh");return B.runKernelFunc((function(e,n){var a=e.acosh(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.divStrict(a.toFloat().square().sub(1).sqrt())}}}))}}),dg=R({asin_:function(r){var t=E(r,"x","asin");return B.runKernelFunc((function(e,n){var a=e.asin(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.divStrict(Y(1).sub(a.toFloat().square()).sqrt())}}}))}}),pg=R({asinh_:function(r){var t=E(r,"x","asinh");return B.runKernelFunc((function(e,n){var a=e.asinh(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.divStrict(Y(1).add(a.toFloat().square()).sqrt())}}}))}}),vg=R({atan_:function(r){var t=E(r,"x","atan");return B.runKernelFunc((function(e,n){var a=e.atan(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(a.toFloat().square().add(1))}}}))}}),mg=R({atanh_:function(r){var t=E(r,"x","atanh");return B.runKernelFunc((function(e,n){var a=e.atanh(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(Y(1).sub(a.toFloat().square()))}}}))}}),gg=R({ceil_:function(r){var t=E(r,"x","ceil");return B.runKernelFunc((function(e){return e.ceil(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),ja=R({clipByValue_:function(r,t,e){var n=E(r,"x","clipByValue");C(t<=e,(function(){return"Error in clip: min ("+t+") must be less than or equal to max ("+e+")."}));var a=[n],i={min:t,max:e};return B.runKernelFunc((function(o,s){var u=o.clip(n,t,e);return s([n]),u}),{x:n},(function(o,s){var u=s[0];return{x:function(){return o.where(u.greaterEqual(t).logicalAnd(u.lessEqual(e)),Ae(o))}}}),"ClipByValue",i,a)}}),xg=R({cos_:function(r){var t=E(r,"x","cos"),e=[t];return B.runKernelFunc((function(n,a){var i=n.cos(t);return a([t]),i}),{x:t},(function(n,a){var i=a[0];return{x:function(){return i.toFloat().sin().neg().mul(n)}}}),"Cos",{},e)}}),yg=R({cosh_:function(r){var t=E(r,"x","cosh");return B.runKernelFunc((function(e,n){var a=e.cosh(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return a.toFloat().sinh().mulStrict(e)}}}))}}),wg=R({erf_:function(r){var t=E(r,"x","erf");return C(t.dtype==="int32"||t.dtype==="float32",(function(){return"Input dtype must be `int32` or `float32`."})),t.dtype==="int32"&&(t=t.toFloat()),B.runKernelFunc((function(e,n){var a=e.erf(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.mul(a.square().neg().exp().mul(2/Math.sqrt(Math.PI)))}}}))}}),po=R({exp_:function(r){var t=E(r,"x","exp");return B.runKernelFunc((function(e,n){var a=e.exp(t);return n([a]),a}),{x:t},(function(e,n){return{x:function(){return e.mulStrict(n[0])}}}),"Exp",{},[],[!0])}}),bg=R({expm1_:function(r){var t=E(r,"x","expm1");return B.runKernelFunc((function(e,n){var a=e.expm1(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.mul(a.exp())}}}))}}),Ag=R({floor_:function(r){var t=E(r,"x","floor");return B.runKernelFunc((function(e){return e.floor(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),Eg=R({log_:function(r){var t=E(r,"x","log"),e=[t];return B.runKernelFunc((function(n,a){var i=n.log(t);return a([t]),i}),{x:t},(function(n,a){var i=a[0];return{x:function(){return n.div(i.toFloat())}}}),"Log",{},e)}}),Cg=R({log1p_:function(r){var t=E(r,"x","log1p");return B.runKernelFunc((function(e,n){var a=e.log1p(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(a.add(1))}}}))}}),Sg=R({logSigmoid_:function(r){var t=E(r,"x","logSigmoid");return B.runKernelFunc((function(e,n){var a=e.softplus(t.neg()).neg();return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.mul(a.neg().sigmoid())}}}))}}),Ya=R({neg_:function(r){var t=E(r,"x","neg"),e=[t];return B.runKernelFunc((function(n){return n.neg(t)}),{x:t},(function(n){return{x:function(){return n.neg()}}}),"Neg",{},e)}}),Dg=R({reciprocal_:function(r){var t=E(r,"x","reciprocal");return B.runKernelFunc((function(e,n){var a=e.reciprocal(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(a.square().neg())}}}))}}),Tg=R({round_:function(r){var t=E(r,"x","round");return B.runKernelFunc((function(e){return e.round(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),qf=R({rsqrt_:function(r){var t=E(r,"x","rsqrt"),e=[t];return B.runKernelFunc((function(n,a){var i=n.rsqrt(t);return a([t]),i}),{x:t},(function(n,a){var i=a[0];return{x:function(){return n.div(i.pow(1.5).mul(2)).neg()}}}),"Rsqrt",{},e)}}),du=R({sigmoid_:function(r){var t=E(r,"x","sigmoid");return B.runKernelFunc((function(e,n){var a=e.sigmoid(t);return n([a]),a}),{x:t},(function(e,n){var a=n[0];return{x:function(){return e.mul(a.mul(Y(1).sub(a)))}}}),"Sigmoid")}}),Ig=R({sign_:function(r){var t=E(r,"x","sign");return B.runKernelFunc((function(e){return e.sign(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),Rg=R({isNaN_:function(r){var t=E(r,"x","isNaN");return B.runKernelFunc((function(e){return e.isNaN(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),Mg=R({isInf_:function(r){var t=E(r,"x","isInf");return B.runKernelFunc((function(e){return e.isInf(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),Bg=R({isFinite_:function(r){var t=E(r,"x","isFinite");return B.runKernelFunc((function(e){return e.isFinite(t)}),{$x:t},(function(e){return{$x:function(){return Ae(e)}}}))}}),_g=R({sin_:function(r){var t=E(r,"x","sin"),e=[t];return B.runKernelFunc((function(n,a){var i=n.sin(t);return a([t]),i}),{x:t},(function(n,a){var i=a[0];return{x:function(){return i.toFloat().cos().mul(n)}}}),"Sin",{},e)}}),Pg=R({sinh_:function(r){var t=E(r,"x","sinh");return B.runKernelFunc((function(e,n){var a=e.sinh(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return a.toFloat().cosh().mulStrict(e)}}}))}}),Fg=R({softplus_:function(r){var t=E(r,"x","softplus");return B.runKernelFunc((function(e,n){var a=e.softplus(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.mul(a.sigmoid())}}}))}}),kg=R({sqrt_:function(r){var t=E(r,"x","sqrt");return B.runKernelFunc((function(e,n){var a=e.sqrt(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(a.toFloat().sqrt().mul(2))}}}))}}),Ng=R({step_:function(r,t){t===void 0&&(t=0);var e=E(r,"x","step");return B.runKernelFunc((function(n){return n.step(e,t)}),{$x:e},(function(n){return{$x:function(){return Ae(n)}}}))}}),Og=R({tan_:function(r){var t=E(r,"x","tan");return B.runKernelFunc((function(e,n){var a=e.tan(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return e.div(a.cos().square())}}}))}}),Lg=R({tanh_:function(r){var t=E(r,"x","tanh");return B.runKernelFunc((function(e,n){var a=e.tanh(t);return n([a]),a}),{x:t},(function(e,n){var a=n[0];return{x:function(){return Y(1).sub(a.square()).mulStrict(e)}}}),"Tanh",{},null,[!0])}});function Zf(r,t,e,n,a,i){var o,s,u=E(r,"x","batchNorm"),c=E(t,"mean","batchNorm"),l=E(e,"variance","batchNorm");return a!=null&&(o=E(a,"scale","batchNorm")),n!=null&&(s=E(n,"offset","batchNorm")),C(u.rank===2,(function(){return"Error in batchNorm3D: x must be rank 3 but got rank "+u.rank+"."})),C(c.rank===2||c.rank===1,(function(){return"Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank "+c.rank+"."})),C(l.rank===2||l.rank===1,(function(){return"Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank "+l.rank+"."})),o!=null&&C(o.rank===2||o.rank===1,(function(){return"Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank "+o.rank+"."})),s!=null&&C(s.rank===2||s.rank===1,(function(){return"Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank "+s.rank+"."})),Qa(u,c,l,s,o,i)}function Jf(r,t,e,n,a,i){var o,s,u=E(r,"x","batchNorm"),c=E(t,"mean","batchNorm"),l=E(e,"variance","batchNorm");return a!=null&&(o=E(a,"scale","batchNorm")),n!=null&&(s=E(n,"offset","batchNorm")),C(u.rank===3,(function(){return"Error in batchNorm3D: x must be rank 3 but got rank "+u.rank+"."})),C(c.rank===3||c.rank===1,(function(){return"Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank "+c.rank+"."})),C(l.rank===3||l.rank===1,(function(){return"Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank "+l.rank+"."})),o!=null&&C(o.rank===3||o.rank===1,(function(){return"Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank "+o.rank+"."})),s!=null&&C(s.rank===3||s.rank===1,(function(){return"Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank "+s.rank+"."})),Qa(u,c,l,s,o,i)}function $f(r,t,e,n,a,i){var o,s,u=E(r,"x","batchNorm"),c=E(t,"mean","batchNorm"),l=E(e,"variance","batchNorm");return a!=null&&(o=E(a,"scale","batchNorm")),n!=null&&(s=E(n,"offset","batchNorm")),C(u.rank===4,(function(){return"Error in batchNorm4D: x must be rank 4 but got rank "+u.rank+"."})),C(c.rank===4||c.rank===1,(function(){return"Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank "+c.rank+"."})),C(l.rank===4||l.rank===1,(function(){return"Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank "+l.rank+"."})),o!=null&&C(o.rank===4||o.rank===1,(function(){return"Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank "+o.rank+"."})),s!=null&&C(s.rank===4||s.rank===1,(function(){return"Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank "+s.rank+"."})),Qa(u,c,l,s,o,i)}function Qa(r,t,e,n,a,i){i==null&&(i=.001);var o,s,u,c=E(r,"x","batchNorm"),l=E(t,"mean","batchNorm"),f=E(e,"variance","batchNorm");a!=null&&(o=E(a,"scale","batchNorm")),n!=null&&(s=E(n,"offset","batchNorm")),C(l.rank===f.rank,(function(){return"Batch normalization gradient requires mean and variance to have equal ranks."})),C(s==null||l.rank===s.rank,(function(){return"Batch normalization gradient requires mean and offset to have equal ranks."})),C(o==null||l.rank===o.rank,(function(){return"Batch normalization gradient requires mean and scale to have equal ranks."})),u=c.rank===0||c.rank===1?c.as4D(1,1,1,c.size):c.rank===2?c.as4D(1,1,c.shape[0],c.shape[1]):c.rank===3?c.as4D(1,c.shape[0],c.shape[1],c.shape[2]):c;var h=[c,l,f,o];return B.runKernelFunc((function(d,p){var v=d.batchNormalization(u,Pi(l),Pi(f),i,Pi(o),Pi(s));return p([c,l,f,o]),v}),{x:c,mean:l,variance:f,scale:o,offset:s},(function(d,p){var v=p,m=v[0],g=v[1],x=v[2],w=v[3],y=w??Y(1),b=$e(g.shape,u.shape),A=[];if(g.rank===1){for(var I=0;I<u.shape.length-1;++I)A.push(u.shape[I]);A.push(1)}var T=m.sub(g),S=d.mul(y),D=qf(x.add(Y(i))),_=D.mul(D).mul(D).mul(Y(-.5));return{x:function(){return g.rank===1?d.mul(vn(D.as4D(1,1,1,g.shape[0]),A)).mul(y).reshape(m.shape):d.mul(D).mul(y).reshape(m.shape)},mean:function(){var M=D.mul(Y(-1)).mul(S);return g.rank===1&&(M=M.sum(b)),M.reshape(g.shape)},variance:function(){var M=_.mul(T).mul(S);return g.rank===1&&(M=M.sum(b)),M.reshape(g.shape)},scale:function(){var M=T.mul(D),L=d.mul(M);return g.rank===1&&(L=L.sum(b)),L.reshape(g.shape)},offset:function(){var M=d;return g.rank===1&&(M=M.sum(b)),M.reshape(g.shape)}}}),"BatchNormalization",{varianceEpsilon:i},h).reshape(c.shape)}function Pi(r){return r==null?null:r.rank===0?r.as1D():r.rank===1?r:r.rank===2?r.as4D(1,1,r.shape[0],r.shape[1]):r.rank===3?r.as4D(1,r.shape[0],r.shape[1],r.shape[2]):r}function vo(){Zl("tf.batchNormalization() is going away. Use tf.batchNorm() instead, and note the positional argument change of scale, offset, and varianceEpsilon")}var Ug=R({batchNormalization2d_:function(r,t,e,n,a,i){return n===void 0&&(n=.001),vo(),Zf(r,t,e,i,a,n)}}),Gg=R({batchNormalization3d_:function(r,t,e,n,a,i){return n===void 0&&(n=.001),vo(),Jf(r,t,e,i,a,n)}}),Hg=R({batchNormalization4d_:function(r,t,e,n,a,i){return n===void 0&&(n=.001),vo(),$f(r,t,e,i,a,n)}}),zg=R({batchNormalization_:function(r,t,e,n,a,i){return n===void 0&&(n=.001),vo(),Qa(r,t,e,i,a,n)}}),pu=R({batchNorm_:Qa}),Wg=R({batchNorm2d_:Zf}),Vg=R({batchNorm3d_:Jf}),Xg=R({batchNorm4d_:$f}),mo=R({logicalAnd_:function(r,t){var e=E(r,"a","logicalAnd","bool"),n=E(t,"b","logicalAnd","bool");return xe(e.shape,n.shape),B.runKernelFunc((function(a){return a.logicalAnd(e,n)}),{a:e,b:n},null,"LogicalAnd")}}),Kg=R({logicalNot_:function(r){var t=E(r,"x","logicalNot","bool");return B.runKernelFunc((function(e){return e.logicalNot(t)}),{$x:t})}}),eh=R({logicalOr_:function(r,t){var e=E(r,"a","logicalOr","bool"),n=E(t,"b","logicalOr","bool");return xe(e.shape,n.shape),B.runKernelFunc((function(a){return a.logicalOr(e,n)}),{$a:e,$b:n})}}),jg=R({logicalXor_:function(r,t){var e=E(r,"a","logicalXor","bool"),n=E(t,"b","logicalXor","bool");return xe(e.shape,n.shape),eh(r,t).logicalAnd(mo(r,t).logicalNot())}}),yn=R({where_:function(r,t,e){var n=E(t,"a","where"),a=E(e,"b","where"),i=E(r,"condition","where","bool");return De(n.shape,a.shape,"Error in where: "),i.rank===1?C(i.shape[0]===n.shape[0],(function(){return"The first dimension of `a` must match the size of `condition`."})):De(i.shape,a.shape,"Error in where: "),B.runKernelFunc((function(o,s){var u=o.select(i,n,a);return s([i]),u}),{$condition:i,$a:n,$b:a},(function(o,s){var u=s[0];return{$condition:function(){return Ae(u).toFloat()},$a:function(){return o.mul(u.cast(o.dtype))},$b:function(){return o.mul(u.logicalNot().cast(o.dtype))}}}))}}),th=function(r){return ee(this,void 0,void 0,(function(){var t,e,n;return te(this,(function(a){switch(a.label){case 0:return[4,(t=E(r,"condition","whereAsync","bool")).data()];case 1:return e=a.sent(),n=cu(t.shape,e),r!==t&&t.dispose(),[2,n]}}))}))},ie=R({add_:function(r,t){var e,n=E(r,"a","add"),a=E(t,"b","add");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o){return o.add(n,a)}),{a:n,b:a},(function(o){return{a:function(){var s=o,u=$e(n.shape,i);return u.length>0&&(s=s.sum(u)),s.reshape(n.shape)},b:function(){var s=o,u=$e(a.shape,i);return u.length>0&&(s=s.sum(u)),s.reshape(a.shape)}}}),"Add")}}),Yg=R({addN_:function(r){C(Array.isArray(r),(function(){return"The argument passed to tf.addN() must be a list of tensors"})),C(r.length>=1,(function(){return"Must pass at least one tensor to tf.addN(), but got "+r.length}));var t=r.map((function(a,i){return E(a,"tensors"+i,"addN")})),e=t[0];t.forEach((function(a){if(a.dtype!==e.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")})),t.forEach((function(a){if(!Je(a.shape,e.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")}));var n=t;return B.runKernelFunc((function(a){return a.addN(t)}),n,(function(a){var i={};return t.forEach((function(o,s){i[s]=function(){return a.clone()}})),i}),"AddN")}}),Qg=R({addStrict_:function(r,t){var e=E(r,"a","addStrict"),n=E(t,"b","addStrict");return De(e.shape,n.shape,"Error in addStrict: "),e.add(n)}}),qg=R({atan2_:function(r,t){var e,n=E(r,"a","atan2"),a=E(t,"b","atan2");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o,s){var u=o.atan2(n,a);return s([n,a]),u}),{$a:n,$b:a},(function(o,s){var u=s[0],c=s[1];return{$a:function(){var l=ie(u.square(),c.square()),f=o.mul(c.div(l)),h=$e(u.shape,i);return h.length>0&&(f=f.sum(h)),f.reshape(u.shape)},$b:function(){var l=ie(u.square(),c.square()),f=Ya(o.mul(u.div(l))),h=$e(c.shape,i);return h.length>0&&(f=f.sum(h)),f.reshape(c.shape)}}}))}}),$t=R({div_:function(r,t){var e,n=E(r,"a","div"),a=E(t,"b","div");if(e=Ve(n,a),n=e[0],a=e[1],n.dtype==="int32"&&a.dtype==="int32")return rh(n,a);var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o,s){var u=o.realDivide(n,a);return s([n,a]),u}),{a:n,b:a},(function(o,s){var u=s[0],c=s[1];return{a:function(){var l=o.div(c.toFloat()),f=$e(u.shape,i);return f.length>0?l.sum(f).reshape(u.shape):l},b:function(){var l=o.mul(u.toFloat()),f=$e(c.shape,i);f.length>0&&(l=l.sum(f).reshape(c.shape));var h=c.square();return l.div(h.toFloat()).neg()}}}),"Div")}}),Zg=R({divNoNan_:function(r,t){var e,n=E(r,"a","div"),a=E(t,"b","div");n=(e=Ve(n,a))[0],a=e[1];var i=$t(n,a),o=Ae(i),s=a.equal(o);return yn(s,o,i)}}),Jg=R({divStrict_:function(r,t){var e=E(r,"a","div"),n=E(t,"b","div");return De(e.shape,n.shape,"Error in divideStrict: "),e.div(n)}}),rh=R({floorDiv_:function(r,t){var e,n=E(r,"a","floorDiv"),a=E(t,"b","floorDiv");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o,s){var u=o.floorDiv(n,a);return s([n,a]),u}),{a:n,b:a},(function(o,s){var u=s[0],c=s[1];return{a:function(){var l=o.div(c.toFloat()),f=$e(u.shape,i);return f.length>0?l.sum(f).reshape(u.shape):l},b:function(){var l=o.mul(u.toFloat()),f=$e(c.shape,i);f.length>0&&(l=l.sum(f).reshape(c.shape));var h=c.square();return l.div(h.toFloat()).neg()}}}),"FloorDiv")}}),vu=R({maximum_:function(r,t){var e,n=E(r,"a","maximum"),a=E(t,"b","maximum");return e=Ve(n,a),n=e[0],a=e[1],n.dtype==="bool"&&(n=n.toInt(),a=a.toInt()),xe(n.shape,a.shape),B.runKernelFunc((function(i,o){var s=i.maximum(n,a);return o([n,a]),s}),{a:n,b:a},(function(i,o){var s=o[0],u=o[1];return{a:function(){return i.mul(s.greaterEqual(u).toFloat())},b:function(){return i.mul(s.less(u).toFloat())}}}),"Maximum")}}),$g=R({maximumStrict_:function(r,t){var e=E(r,"a","maximumStrict"),n=E(t,"b","maximumStrict");return De(e.shape,n.shape,"Error in maximumStrict: "),e.maximum(n)}}),nh=R({minimum_:function(r,t){var e,n=E(r,"a","minimum"),a=E(t,"b","minimum");return e=Ve(n,a),n=e[0],a=e[1],n.dtype==="bool"&&(n=n.toInt(),a=a.toInt()),xe(n.shape,a.shape),B.runKernelFunc((function(i,o){var s=i.minimum(n,a);return o([n,a]),s}),{a:n,b:a},(function(i,o){var s=o[0],u=o[1];return{a:function(){return i.mul(s.lessEqual(u).toFloat())},b:function(){return i.mul(s.greater(u).toFloat())}}}),"Minimum")}}),e0=R({minimumStrict_:function(r,t){var e=E(r,"a","minimumStrict"),n=E(t,"b","minimumStrict");return De(e.shape,n.shape,"Error in minimumStrict: "),e.minimum(n)}}),t0=R({mod_:function(r,t){var e,n=E(r,"a","mod"),a=E(t,"b","mod");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o,s){var u=o.mod(n,a);return s([n,a]),u}),{$a:n,$b:a},(function(o,s){var u=s[0],c=s[1];return{$a:function(){var l=$e(u.shape,i);return l.length>0?o.sum(l).reshape(u.shape):o},$b:function(){var l=o.mul(u.div(c).floor().neg()),f=$e(c.shape,i);return f.length>0?l.sum(f).reshape(c.shape):l}}}))}}),r0=R({modStrict_:function(r,t){var e=E(r,"a","modStrict"),n=E(t,"b","modStrict");return De(e.shape,n.shape,"Error in modStrict: "),e.mod(n)}}),Xe=R({mul_:function(r,t){var e,n=E(r,"a","mul"),a=E(t,"b","mul");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o,s){var u=o.multiply(n,a);return s([n,a]),u}),{a:n,b:a},(function(o,s){var u=s[0],c=s[1];return{a:function(){var l=o.mul(c.toFloat()),f=$e(u.shape,i);return f.length>0?l.sum(f).reshape(u.shape):l},b:function(){var l=o.mul(u.toFloat()),f=$e(c.shape,i);return f.length>0?l.sum(f).reshape(c.shape):l}}}),"Mul")}}),n0=R({mulStrict_:function(r,t){var e=E(r,"a","mul"),n=E(t,"b","mul");return De(e.shape,n.shape,"Error in multiplyStrict: "),e.mul(n)}}),no=R({pow_:function(r,t){var e,n=E(r,"base","pow"),a=E(t,"exp","pow");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape),o=[n,a];return B.runKernelFunc((function(s,u){var c=s.pow(n,a);return u([n,a,c]),c}),{a:n,b:a},(function(s,u){var c=u[0],l=u[1],f=u[2];return{a:function(){var h=l.toFloat(),d=s.mul(h.mul(c.pow(h.sub(Y(1))))),p=$e(c.shape,i);return p.length>0&&(d=d.sum(p)),d.reshape(c.shape)},b:function(){var h=c.greater(0),d=c.log().where(h,Ae(c)),p=s.mul(f.mul(d)),v=$e(l.shape,i);return v.length>0&&(p=p.sum(v)),p.reshape(l.shape)}}}),"Pow",{},o,[!0])}}),a0=R({powStrict_:function(r,t){return De(r.shape,t.shape,"Error in powStrict: "),r.pow(t)}}),i0=R({squaredDifferenceStrict_:function(r,t){var e=E(r,"a","squaredDifferenceStrict"),n=E(t,"b","squaredDifferenceStrict");return De(e.shape,n.shape,"Error in squaredDifferenceStrict: "),e.squaredDifference(n)}}),Pe=R({sub_:function(r,t){var e,n=E(r,"a","sub"),a=E(t,"b","sub");e=Ve(n,a),n=e[0],a=e[1];var i=xe(n.shape,a.shape);return B.runKernelFunc((function(o){return o.subtract(n,a)}),{a:n,b:a},(function(o){return{a:function(){var s=o,u=$e(n.shape,i);return u.length>0&&(s=s.sum(u)),s.reshape(n.shape)},b:function(){var s=o,u=$e(a.shape,i);return u.length>0&&(s=s.sum(u)),s.neg().reshape(a.shape)}}}),"Sub")}}),o0=R({subStrict_:function(r,t){var e=E(r,"a","subStrict"),n=E(t,"b","subStrict");return De(e.shape,n.shape,"Error in subStrict: "),e.sub(n)}}),ah=R({equal_:function(r,t){var e,n=E(r,"a","equal"),a=E(t,"b","equal");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i){return i.equal(n,a)}),{$a:n,$b:a})}}),s0=R({equalStrict_:function(r,t){var e=E(r,"a","equalStrict"),n=E(t,"b","equalStrict");return De(e.shape,n.shape,"Error in equalStrict: "),e.equal(n)}}),u0=R({greater_:function(r,t){var e,n=E(r,"a","greater"),a=E(t,"b","greater");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i){return i.greater(n,a)}),{a:n,b:a},null,"Greater")}}),ih=R({greaterEqual_:function(r,t){var e,n=E(r,"a","greaterEqual"),a=E(t,"b","greaterEqual");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i,o){var s=i.greaterEqual(n,a);return o([n,a]),s}),{a:n,b:a},(function(i,o){var s=o[0],u=o[1];return{a:function(){return Ae(s)},b:function(){return Ae(u)}}}),"GreaterEqual")}}),c0=R({greaterEqualStrict_:function(r,t){var e=E(r,"a","greaterEqualStrict"),n=E(t,"b","greaterEqualStrict");return De(e.shape,n.shape,"Error in greaterEqualStrict: "),e.greaterEqual(n)}}),l0=R({greaterStrict_:function(r,t){var e=E(r,"a","greaterStrict"),n=E(t,"b","greaterStrict");return De(e.shape,n.shape,"Error in greaterStrict: "),e.greater(n)}}),f0=R({less_:function(r,t){var e,n=E(r,"a","less"),a=E(t,"b","less");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i){return i.less(n,a)}),{a:n,b:a},null,"Less")}}),h0=R({lessEqual_:function(r,t){var e,n=E(r,"a","lessEqual"),a=E(t,"b","lessEqual");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i,o){var s=i.lessEqual(n,a);return o([n,a]),s}),{a:n,b:a},null,"LessEqual")}}),d0=R({lessEqualStrict_:function(r,t){var e=E(r,"a","lessEqualStrict"),n=E(t,"b","lessEqualStrict");return De(e.shape,n.shape,"Error in lessEqualStrict: "),e.lessEqual(n)}}),p0=R({lessStrict_:function(r,t){var e=E(r,"a","lessStrict"),n=E(t,"b","lessStrict");return De(e.shape,n.shape,"Error in lessStrict: "),e.less(n)}}),v0=R({notEqual_:function(r,t){var e,n=E(r,"a","notEqual"),a=E(t,"b","notEqual");return e=Ve(n,a),n=e[0],a=e[1],xe(n.shape,a.shape),B.runKernelFunc((function(i){return i.notEqual(n,a)}),{a:n,b:a},null,"NotEqual")}}),m0=R({notEqualStrict_:function(r,t){var e=E(r,"a","notEqualStrict"),n=E(t,"b","notEqualStrict");return De(e.shape,n.shape,"Error in notEqualStrict: "),e.notEqual(n)}});function Yc(r,t){for(var e=[],n=r;n<t;++n)e.push(n);return e}function Qc(r){for(var t=[],e=0;e<r.length;++e)for(var n=0;n<r[e].length;++n)t.push(r[e][n]);return t}var mu=R({gather_:function(r,t,e){e===void 0&&(e=0);var n=E(r,"x","gather"),a=E(t,"indices","gather","int32");e=et(e,n.shape)[0];var i=(function(o,s,u){for(var c=o.shape[u],l=[],f=1,h=1,d=0;d<u;d++)l.push(o.shape[d]),f*=o.shape[d];for(d=0;d<s.rank;d++)l.push(s.shape[d]);for(d=u+1;d<o.rank;d++)l.push(o.shape[d]),h*=o.shape[d];return{batchSize:f,sliceSize:h,dimSize:c,outputShape:l}})(n,a,e);return B.runKernelFunc((function(o,s){var u=o.gather(n,a.flatten(),e);return s([a]),u}),{x:n,indices:a},(function(o,s){var u=s[0];return{x:function(){var c=n.shape,l=u.size,f=c.slice(0,e),h=f.length,d=c.slice(e,c.length).slice(1),p=d.length,v=Yc(0,h),m=Yc(h+1,h+1+p),g=Qc([f,[l],d]),x=o.reshape(g),w=u.reshape([l]),y=Qc([[h],v,m]),b=x.transpose(y),A=oh(b,w,n.shape[e]),I=so(y);return A=A.transpose(I)},indices:function(){return u}}}),"Gather",{axis:e}).reshape(i.outputShape)}}),oh=R({unsortedSegmentSum_:function(r,t,e){var n=E(r,"x","unsortedSegmentSum"),a=E(t,"segmentIds","unsortedSegmentSum","int32");return C(Ke(e),(function(){return"numSegments must be of dtype int"})),B.runKernelFunc((function(i,o){var s=i.unsortedSegmentSum(n,a,e);return o([a]),s}),{$x:n},(function(i,o){var s=o[0];return{$x:function(){return(function(u,c){for(var l=vu(c,Ae(c)),f=mu(u,l),h=ih(c,Y(0,"int32")),d=f.rank-h.rank,p=0;p<d;++p)h=Et(h,p+1);h=mo(h,Zn(f.shape,"bool"));var v=Ae(f);return yn(h,f,v)})(i,s)}}}))}}),g0=function(r,t,e){return ee(this,void 0,void 0,(function(){var n,a,i,o,s,u,c,l,f,h,d,p,v;return te(this,(function(m){switch(m.label){case 0:for(n=E(r,"tensor","boolMask"),a=E(t,"mask","boolMask","bool"),i=e??0,o=a.rank,s=n.shape,C(o>0,(function(){return"mask cannot be scalar"})),De(s.slice(i,i+o),a.shape,"mask's shape must match the first K dimensions of tensor's shape,"),u=1,c=i;c<i+o;c++)u*=s[c];return l=s.slice(0,i).concat([u],s.slice(i+o)),f=n.reshape(l),h=a.reshape([-1]),[4,th(h)];case 1:return d=m.sent(),p=d.squeeze([1]),v=mu(f,p,i),r!==n&&n.dispose(),t!==a&&a.dispose(),p.dispose(),f.dispose(),h.dispose(),d.dispose(),[2,v]}}))}))};function sh(r,t,e,n,a,i,o){i===void 0&&(i="NHWC"),C(r.length===t.rank,(function(){return"Length of inShape ("+r.length+") and rank of dy ("+t.rank+") must match"}));var s=r,u=t,c=!1;t.rank===3&&(c=!0,u=t.as4D(1,t.shape[0],t.shape[1],t.shape[2]),s=[1,r[0],r[1],r[2]]),C(s.length===4,(function(){return"Error in conv2dDerInput: inShape must be length 4, but got length "+s.length+"."})),C(u.rank===4,(function(){return"Error in conv2dDerInput: dy must be rank 4, but got rank "+u.rank})),C(e.rank===4,(function(){return"Error in conv2dDerInput: filter must be rank 4, but got rank "+e.rank}));var l=i==="NHWC"?s[3]:s[1],f=i==="NHWC"?u.shape[3]:u.shape[1];C(l===e.shape[2],(function(){return"Error in conv2dDerInput: depth of input ("+l+") must match input depth for filter "+e.shape[2]+"."})),C(f===e.shape[3],(function(){return"Error in conv2dDerInput: depth of output ("+f+") must match output depth for filter "+e.shape[3]+"."})),o!=null&&C(Ke(a),(function(){return"Error in conv2dDerInput: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+a+"."}));var h=ho(i),d=qr(s,e.shape,n,1,a,o,!1,h),p=B.runKernelFunc((function(v,m){var g=v.conv2dDerInput(u,e,d);return m([e,u]),g}),{dy4D:u,filter:e},(function(v,m){var g=m[0],x=m[1];return{dy4D:function(){return ct(v,g,n,a,i,1,o)},filter:function(){return gu(v,x,g.shape,n,a,i,o)}}}));return c?p.as3D(p.shape[1],p.shape[2],p.shape[3]):p}function hs(r){var t=(function(i){return typeof i=="number"?[i,i,i]:i.length===2?[i[0],i[1],1]:i})(r),e=t[0],n=t[1],a=t[2];return e===1&&n===1&&a===1}function uh(r,t,e,n,a){C(r.length===t.rank,(function(){return"Length of inShape ("+r.length+") and rank of dy ("+t.rank+") must match"}));var i=r,o=t,s=!1;t.rank===4&&(s=!0,o=t.as5D(1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]),i=[1,r[0],r[1],r[2],r[3]]);var u=i[4],c=o.shape[4];C(i.length===5,(function(){return"Error in conv3dDerInput: inShape must be length 5, but got length "+i.length+"."})),C(o.rank===5,(function(){return"Error in conv3dDerInput: dy must be rank 5, but got rank "+o.rank})),C(e.rank===5,(function(){return"Error in conv3dDerInput: filter must be rank 5, but got rank "+e.rank})),C(u===e.shape[3],(function(){return"Error in conv3dDerInput: depth of input ("+u+") must match input depth for filter "+e.shape[3]+"."})),C(c===e.shape[4],(function(){return"Error in conv3dDerInput: depth of output ("+c+") must match output depth for filter "+e.shape[4]+"."}));var l=Wa(i,e.shape,n,1,a),f=B.runKernelFunc((function(h){return h.conv3dDerInput(o,e,l)}),{dy5D:o});return s?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}var x0=R({conv1d_:function(r,t,e,n,a,i,o){a===void 0&&(a="NWC"),i===void 0&&(i=1);var s=E(r,"x","conv1d"),u=E(t,"filter","conv1d"),c=s,l=!1;s.rank===2&&(l=!0,c=s.as3D(1,s.shape[0],s.shape[1])),C(c.rank===3,(function(){return"Error in conv1d: input must be rank 3, but got rank "+c.rank+"."})),C(u.rank===3,(function(){return"Error in conv1d: filter must be rank 3, but got rank "+u.rank+"."})),o!=null&&C(Ke(n),(function(){return"Error in conv1d: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+n+"."})),C(c.shape[2]===u.shape[1],(function(){return"Error in conv1d: depth of input ("+c.shape[2]+") must match input depth for filter "+u.shape[1]+"."})),C(Mt(e,i),(function(){return"Error in conv1D: Either stride or dilation must be 1. Got stride "+e+" and dilation '"+i+"'"})),C(a==="NWC",(function(){return"Error in conv1d: got dataFormat of "+a+" but only NWC is currently supported."}));var f=u.as4D(1,u.shape[0],u.shape[1],u.shape[2]),h=c.as4D(c.shape[0],1,c.shape[1],c.shape[2]),d=ct(h,f,[1,e],n,"NHWC",[1,i],o);return l?d.as2D(d.shape[2],d.shape[3]):d.as3D(d.shape[0],d.shape[2],d.shape[3])}}),ct=R({conv2d_:function(r,t,e,n,a,i,o){a===void 0&&(a="NHWC"),i===void 0&&(i=[1,1]);var s=E(r,"x","conv2d"),u=E(t,"filter","conv2d"),c=s,l=!1;s.rank===3&&(l=!0,c=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),C(c.rank===4,(function(){return"Error in conv2d: input must be rank 4, but got rank "+c.rank+"."})),C(u.rank===4,(function(){return"Error in conv2d: filter must be rank 4, but got rank "+u.rank+"."})),o!=null&&C(Ke(n),(function(){return"Error in conv2d: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+n+"."}));var f=a==="NHWC"?c.shape[3]:c.shape[1];C(f===u.shape[2],(function(){return"Error in conv2d: depth of input ("+f+") must match input depth for filter "+u.shape[2]+"."})),C(Mt(e,i),(function(){return"Error in conv2D: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+i+"'"}));var h=ho(a),d=qr(c.shape,u.shape,e,i,n,o,!1,h),p=[u,c],v=B.runKernelFunc((function(m,g){var x=m.conv2d(c,u,d);return g([u,c]),x}),{x:c,filter:u},(function(m,g){var x=g,w=x[0],y=x[1];return C(xn(i),(function(){return"Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+i+"'"})),{x:function(){return ch(y.shape,m,w,e,n,a)},filter:function(){return gu(y,m,w.shape,e,n,a)}}}),"Conv2D",d,p);return l?v.as3D(v.shape[1],v.shape[2],v.shape[3]):v}}),y0=R({conv3d_:function(r,t,e,n,a,i){a===void 0&&(a="NDHWC"),i===void 0&&(i=[1,1,1]);var o=E(r,"x","conv3d"),s=E(t,"filter","conv3d"),u=o,c=!1;o.rank===4&&(c=!0,u=o.as5D(1,o.shape[0],o.shape[1],o.shape[2],o.shape[3])),C(u.rank===5,(function(){return"Error in conv3d: input must be rank 5, but got rank "+u.rank+"."})),C(s.rank===5,(function(){return"Error in conv3d: filter must be rank 5, but got rank "+s.rank+"."})),C(u.shape[4]===s.shape[3],(function(){return"Error in conv3d: depth of input ("+u.shape[4]+") must match input depth for filter "+s.shape[3]+"."})),C((function(h,d){return hs(h)||hs(d)})(e,i),(function(){return"Error in conv3D: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+i+"'"})),C(a==="NDHWC",(function(){return"Error in conv3d: got dataFormat of "+a+" but only NDHWC is currently supported."}));var l=Wa(u.shape,s.shape,e,i,n),f=B.runKernelFunc((function(h,d){var p=h.conv3d(u,s,l);return d([u,s]),p}),{x:u,$filter:s},(function(h,d){C(hs(i),(function(){return"Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+i+"'"}));var p=d[0],v=d[1];return{x:function(){return uh(p.shape,h,v,e,n)},$filter:function(){return(function(m,g,x,w,y){var b=m;m.rank===4&&(b=m.as5D(1,m.shape[0],m.shape[1],m.shape[2],m.shape[3]));var A=g;A.rank===4&&(A=g.as5D(1,g.shape[0],g.shape[1],g.shape[2],g.shape[3])),C(b.rank===5,(function(){return"Error in conv3dDerFilter: input must be rank 5, but got shape "+b.shape+"."})),C(A.rank===5,(function(){return"Error in conv3dDerFilter: dy must be rank 5, but got shape "+A.shape+"."})),C(x.length===5,(function(){return"Error in conv3dDerFilter: filterShape must be length 5, but got "+x+"."})),C(b.shape[4]===x[3],(function(){return"Error in conv3dDerFilter: depth of input "+b.shape[4]+") must match input depth in filter ("+x[3]+"."})),C(A.shape[4]===x[4],(function(){return"Error in conv3dDerFilter: depth of dy ("+A.shape[4]+") must match output depth for filter ("+x[4]+")."}));var I=Wa(b.shape,x,w,1,y);return B.runKernelFunc((function(T){return T.conv3dDerFilter(b,A,I)}),{x5D:b,dy5D:A})})(p,h,v.shape,e,n)}}}));return c?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),gu=R({conv2dDerFilter_:function(r,t,e,n,a,i,o){i===void 0&&(i="NHWC");var s=r;r.rank===3&&(s=r.as4D(1,r.shape[0],r.shape[1],r.shape[2]));var u=t;u.rank===3&&(u=t.as4D(1,t.shape[0],t.shape[1],t.shape[2])),C(s.rank===4,(function(){return"Error in conv2dDerFilter: input must be rank 4, but got shape "+s.shape+"."})),C(u.rank===4,(function(){return"Error in conv2dDerFilter: dy must be rank 4, but got shape "+u.shape+"."})),C(e.length===4,(function(){return"Error in conv2dDerFilter: filterShape must be length 4, but got "+e+"."}));var c=i==="NHWC"?s.shape[3]:s.shape[1],l=i==="NHWC"?u.shape[3]:u.shape[1];C(c===e[2],(function(){return"Error in conv2dDerFilter: depth of input "+c+") must match input depth in filter ("+e[2]+"."})),C(l===e[3],(function(){return"Error in conv2dDerFilter: depth of dy ("+l+") must match output depth for filter ("+e[3]+")."})),o!=null&&C(Ke(a),(function(){return"Error in conv2dDerFilter: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+a+"."}));var f=ho(i),h=qr(s.shape,e,n,1,a,o,!1,f);return B.runKernelFunc((function(d){return d.conv2dDerFilter(s,u,h)}),{x4D:s,dy4D:u})}}),ch=R({conv2dDerInput_:sh}),qa=R({depthwiseConv2d_:function(r,t,e,n,a,i,o){a===void 0&&(a="NHWC"),i===void 0&&(i=[1,1]);var s=E(r,"x","depthwiseConv2d"),u=E(t,"filter","depthwiseConv2d"),c=s,l=!1;s.rank===3&&(l=!0,c=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),C(c.rank===4,(function(){return"Error in depthwiseConv2d: input must be rank 4, but got rank "+c.rank+"."})),C(u.rank===4,(function(){return"Error in depthwiseConv2d: filter must be rank 4, but got rank "+u.rank+"."})),C(c.shape[3]===u.shape[2],(function(){return"Error in depthwiseConv2d: number of input channels ("+c.shape[3]+") must match the inChannels dimension in filter "+u.shape[2]+"."})),i==null&&(i=[1,1]),C(Mt(e,i),(function(){return"Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+i+"'"})),o!=null&&C(Ke(n),(function(){return"Error in depthwiseConv2d: pad must be an integer when using, dimRoundingMode "+o+" but got pad "+n+"."}));var f=qr(c.shape,u.shape,e,i,n,o,!0),h=[c,u],d=B.runKernelFunc((function(p,v){var m=p.depthwiseConv2D(c,u,f);return v([c,u]),m}),{x:c,filter:u},(function(p,v){C(xn(i),(function(){return"Error in gradient of depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '"+i+"'"}));var m=v[0],g=v[1];return{x:function(){return lh(m.shape,p,g,f)},filter:function(){return fh(m,p,g.shape,f)}}}),"DepthwiseConv2dNative",f,h);return l?d.as3D(d.shape[1],d.shape[2],d.shape[3]):d}}),lh=R({depthwiseConv2dDerInput_:function(r,t,e,n){var a=t,i=!1;t.rank===3&&(i=!0,a=t.as4D(1,t.shape[0],t.shape[1],t.shape[2]));var o=B.runKernelFunc((function(s){return s.depthwiseConv2DDerInput(a,e,n)}),{dy4D:a});return i?o.as3D(o.shape[1],o.shape[2],o.shape[3]):o}}),fh=R({depthwiseConv2dDerFilter_:function(r,t,e,n){var a=r;r.rank===3&&(a=r.as4D(1,r.shape[0],r.shape[1],r.shape[2]));var i=t;return i.rank===3&&(i=t.as4D(1,t.shape[0],t.shape[1],t.shape[2])),B.runKernelFunc((function(o){return o.depthwiseConv2DDerFilter(a,i,n)}),{x4D:a,dy4D:i})}}),Za=R({separableConv2d_:function(r,t,e,n,a,i,o){i===void 0&&(i=[1,1]),o===void 0&&(o="NHWC");var s=E(r,"x","separableConv2d"),u=E(t,"depthwiseFilter","separableConv2d"),c=E(e,"pointwiseFilter","separableConv2d"),l=s,f=!1;if(s.rank===3&&(f=!0,l=s.as4D(1,s.shape[0],s.shape[1],s.shape[2])),o==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");C(l.rank===4,(function(){return"Error in separableConv2d: input must be rank 4, but got rank "+l.rank+"."})),C(u.rank===4,(function(){return"Error in separableConv2d: depthwise filter must be rank 4, but got rank "+u.rank+"."})),C(c.rank===4,(function(){return"Error in separableConv2d: pointwise filter must be rank 4, but got rank "+u.rank+"."})),C(c.shape[0]===1,(function(){return"Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got "+c.shape[0]+"."})),C(c.shape[1]===1,(function(){return"Error in separableConv2d: the second dimension of pointwise filter must be 1, but got "+c.shape[1]+"."}));var h=u.shape[2],d=u.shape[3];C(c.shape[2]===h*d,(function(){return"Error in separableConv2d: the third dimension of pointwise filter must be "+h*d+", but got "+c.shape[2]+"."}));var p=qa(l,u,n,a,o,i),v=ct(p,c,1,"valid",o);return f?v.as3D(v.shape[1],v.shape[2],v.shape[3]):v}}),w0=R({conv2dTranspose_:function(r,t,e,n,a,i){return sh(e,E(r,"x","conv2dTranspose"),E(t,"filter","conv2dTranspose"),n,a,"NHWC",i)}}),b0=R({conv3dTranspose_:function(r,t,e,n,a){return uh(e,E(r,"x","conv3dTranspose"),E(t,"filter","conv3dTranspose"),n,a)}}),Jn=R({matMul_:function(r,t,e,n){var a;e===void 0&&(e=!1),n===void 0&&(n=!1);var i=E(r,"a","matMul"),o=E(t,"b","matMul");a=Ve(i,o),i=a[0],o=a[1];var s=e?i.shape[i.rank-2]:i.shape[i.rank-1],u=n?o.shape[o.rank-1]:o.shape[o.rank-2],c=e?i.shape[i.rank-1]:i.shape[i.rank-2],l=n?o.shape[o.rank-2]:o.shape[o.rank-1],f=i.shape.slice(0,-2),h=o.shape.slice(0,-2),d=re(f),p=re(h);C(i.rank>=2&&o.rank>=2&&i.rank===o.rank,(function(){return"Error in matMul: inputs must have the same rank of at least 2, got ranks "+i.rank+" and "+o.rank+"."})),C(Je(f,h),(function(){return"Error in matMul: outer dimensions ("+f+") and ("+h+") of Tensors with shapes "+i.shape+" and "+o.shape+" must match."})),C(s===u,(function(){return"Error in matMul: inner shapes ("+s+") and ("+u+") of Tensors with shapes "+i.shape+" and "+o.shape+" and transposeA="+e+" and transposeB="+n+" must match."}));var v=i.shape.slice(0,-2).concat([c,l]),m=e?i.as3D(d,s,c):i.as3D(d,c,s),g=n?o.as3D(p,l,u):o.as3D(p,u,l),x={transposeA:e,transposeB:n};return B.runKernelFunc((function(w,y){var b=w.batchMatMul(m,g,e,n);return y([m,g]),b}),{a:m,b:g},(function(w,y){var b=y,A=b[0],I=b[1];return e||n?!e&&n?{a:function(){return w.matMul(I,!1,!1)},b:function(){return w.matMul(A,!0,!1)}}:e&&!n?{a:function(){return I.matMul(w,!1,!0)},b:function(){return A.matMul(w,!1,!1)}}:{a:function(){return I.matMul(w,!0,!0)},b:function(){return w.matMul(A,!0,!0)}}:{a:function(){return w.matMul(I,!1,!0)},b:function(){return A.matMul(w,!0,!1)}}}),"BatchMatMul",x).reshape(v)}}),A0=R({dot_:function(r,t){var e=E(r,"t1","dot"),n=E(t,"t2","dot");C(!(e.rank!==1&&e.rank!==2||n.rank!==1&&n.rank!==2),(function(){return"Error in dot: inputs must all be rank 1 or 2, but got ranks "+e.rank+" and "+n.rank+"."}));var a=e.rank===1?e.size:e.shape[1],i=n.rank===1?n.size:n.shape[0];return C(a===i,(function(){return"Error in dot: inner dimensions of inputs must match, but got "+a+" and "+i+"."})),e.rank===1&&n.rank===1?e.as2D(1,-1).matMul(n.as2D(-1,1)).asScalar():e.rank===1&&n.rank===2?e.as2D(1,-1).matMul(n.as2D(n.shape[0],n.shape[1])).as1D():e.rank===2&&n.rank===1?e.matMul(n.as2D(-1,1)).as1D():e.matMul(n.as2D(n.shape[0],n.shape[1]))}}),E0=R({outerProduct_:function(r,t){var e=E(r,"v1","outerProduct"),n=E(t,"v2","outerProduct");return C(e.rank===1&&n.rank===1,(function(){return"Error in outerProduct: inputs must be rank 1, but got ranks "+e.rank+" and "+n.rank+"."})),e.as2D(-1,1).matMul(n.as2D(1,-1))}}),Ja=R({reverse_:function(r,t){var e=E(r,"x","reverse");if(e.rank===0)return e.clone();var n=et(t,e.shape);return B.runKernelFunc((function(a){return a.reverse(e,n)}),{$x:e},(function(a){return{$x:function(){return a.reverse(n)}}})).reshapeAs(e)}}),C0=R({reverse1d_:function(r){var t=E(r,"x","reverse");return C(t.rank===1,(function(){return"Error in reverse1D: x must be rank 1 but got rank "+t.rank+"."})),Ja(t,0)}}),S0=R({reverse2d_:function(r,t){var e=E(r,"x","reverse");return C(e.rank===2,(function(){return"Error in reverse2D: x must be rank 2 but got rank "+e.rank+"."})),Ja(e,t)}}),D0=R({reverse3d_:function(r,t){var e=E(r,"x","reverse");return C(e.rank===3,(function(){return"Error in reverse3D: x must be rank 3 but got rank "+e.rank+"."})),Ja(e,t)}}),T0=R({reverse4d_:function(r,t){var e=E(r,"x","reverse");return C(e.rank===4,(function(){return"Error in reverse4D: x must be rank 4 but got rank "+e.rank+"."})),Ja(e,t)}});function hh(r,t,e,n,a,i){var o=E(r,"x","maxPool"),s=o,u=!1;o.rank===3&&(u=!0,s=o.as4D(1,o.shape[0],o.shape[1],o.shape[2])),n==null&&(n=[1,1]),C(s.rank===4,(function(){return"Error in maxPool: input must be rank 4 but got rank "+s.rank+"."})),C(Mt(e,n),(function(){return"Error in maxPool: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+n+"'"})),i!=null&&C(Ke(a),(function(){return"Error in maxPool: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+a+"."}));var c=Yn(s.shape,t,e,n,a,i);if(c.filterWidth===1&&c.filterHeight===1&&Je(c.inShape,c.outShape))return o.clone();var l=[s],f=B.runKernelFunc((function(h,d){var p=h.maxPool(s,c);return d([s,p]),p}),{x:s},(function(h,d){var p=d[0],v=d[1];return{x:function(){return(function(m,g,x,w,y,b,A,I){var T=E(m,"dy","maxPoolBackprop"),S=E(g,"input","maxPoolBackprop"),D=E(x,"output","maxPoolBackprop");C(S.rank===T.rank,(function(){return"Rank of input ("+S.rank+") does not match rank of dy ("+T.rank+")"})),b==null&&(b=[1,1]),C(Mt(y,b),(function(){return"Error in maxPoolBackProp: Either strides or dilations must be 1. Got strides "+y+" and dilations '"+b+"'"})),C(T.rank===4,(function(){return"Error in maxPoolBackprop: dy must be rank 4 but got rank "+T.rank+"."})),C(S.rank===4,(function(){return"Error in maxPoolBackprop: input must be rank 4 but got rank "+S.rank+"."})),I!=null&&C(Ke(A),(function(){return"Error in maxPoolBackprop: pad must be an integer when using, dimRoundingMode "+I+" but got pad "+A+"."}));var _=Yn(S.shape,w,y,b,A,I);return B.runKernelFunc((function(M){return M.maxPoolBackprop(T,S,D,_)}),{$dy:T,$input:S})})(h,p,v,t,e,n,a)}}}),"MaxPool",c,l);return u?f.as3D(f.shape[1],f.shape[2],f.shape[3]):f}function dh(r,t,e,n,a,i){var o=E(r,"x","avgPool","float32");n==null&&(n=[1,1]),C(Mt(e,n),(function(){return"Error in avgPool: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+n+"'"}));var s=o,u=!1;o.rank===3&&(u=!0,s=o.as4D(1,o.shape[0],o.shape[1],o.shape[2])),C(s.rank===4,(function(){return"Error in avgPool: x must be rank 4 but got rank "+s.rank+"."})),i!=null&&C(Ke(a),(function(){return"Error in avgPool: pad must be an integer when using, dimRoundingMode "+i+" but got pad "+a+"."}));var c=Yn(s.shape,t,e,n,a,i);if(c.filterWidth===1&&c.filterHeight===1&&Je(c.inShape,c.outShape))return o.clone();var l=B.runKernelFunc((function(f){return f.avgPool(s,c)}),{x:s},(function(f){return{x:function(){return(function(h,d,p,v,m,g){var x=E(h,"dy","avgPoolBackprop"),w=E(d,"input","avgPoolBackprop");C(w.rank===x.rank,(function(){return"Rank of input ("+w.rank+") does not match rank of dy ("+x.rank+")"})),m==null&&(m=[1,1]),C(Mt(v,m),(function(){return"Error in avgPoolBackprop: Either strides or dilations must be 1. Got strides "+v+" and dilations '"+m+"'"}));var y=w,b=x,A=!1;w.rank===3&&(A=!0,y=w.as4D(1,w.shape[0],w.shape[1],w.shape[2]),b=x.as4D(1,x.shape[0],x.shape[1],x.shape[2])),C(b.rank===4,(function(){return"Error in avgPoolBackprop: dy must be rank 4 but got rank "+b.rank+"."})),C(y.rank===4,(function(){return"Error in avgPoolBackprop: input must be rank 4 but got rank "+y.rank+"."}));var I=Yn(y.shape,p,v,m,g),T=B.runKernelFunc((function(S){return S.avgPoolBackprop(b,y,I)}),{dy4D:b,input4D:y});return A?T.as3D(T.shape[1],T.shape[2],T.shape[3]):T})(f,s,t,e,n,a)}}}),"AvgPool",c);return l=l.cast(o.dtype),u?l.as3D(l.shape[1],l.shape[2],l.shape[3]):l}var je=R({maxPool_:function(r,t,e,n,a){return hh(r,t,e,1,n,a)}}),Fr=R({avgPool_:function(r,t,e,n,a){return dh(r,t,e,1,n,a)}}),I0=R({pool_:function(r,t,e,n,a,i){a==null&&(a=[1,1]),i==null&&(i=1),n===0&&(n="valid");var o=E(r,"x","maxPool"),s=o,u=!1;o.rank===3&&(u=!0,s=o.as4D(1,o.shape[0],o.shape[1],o.shape[2])),C(Mt(i,a),(function(){return"Error in pool: Either strides or dilations must be 1. Got strides "+i+" and dilations '"+a+"'"}));var c,l=Yn(s.shape,t,i,a,n),f=[l.dilationHeight,l.dilationWidth];c=n==="same"?(function(y,b){var A=y.map((function(S,D){return S+(S-1)*(b[D]-1)})).map((function(S){return S-1})),I=A.map((function(S){return Math.floor(S/2)})),T=A.map((function(S,D){return S-I[D]}));return A.map((function(S,D){return[I[D],T[D]]}))})([l.filterHeight,l.filterWidth],f):[[0,0],[0,0]];var h=f[0]===1&&f[1]===1,d=(function(y,b,A){var I=A.map((function(O){return O[0]})),T=A.map((function(O){return O[1]})),S=y.concat(I,T),D=b.map((function(O,N){return(O-S[N]%O)%O})),_=T.map((function(O,N){return O+D[N]})),M=b.map((function(O,N){return[I[N],_[N]]})),L=b.map((function(O,N){return[0,D[N]]}));return[M,L]})([l.inHeight,l.inWidth],f,c),p=d[0],v=d[1],m=h?n:"valid",g=h?s:af(s,f,p),x=(e==="avg"?function(){return dh(g,t,i,1,m)}:function(){return hh(g,t,i,1,m)})(),w=h?x:tf(x,f,v);return u?w.as3D(w.shape[1],w.shape[2],w.shape[3]):w}}),R0=R({maxPool3d_:function(r,t,e,n,a,i,o){i===void 0&&(i="NDHWC");var s=E(r,"x","maxPool3d"),u=s,c=!1;s.rank===4&&(c=!0,u=s.as5D(1,s.shape[0],s.shape[1],s.shape[2],s.shape[3])),o==null&&(o=[1,1,1]),C(u.rank===5,(function(){return"Error in maxPool3d: x must be rank 5 but got rank "+u.rank+"."})),C(i==="NDHWC",(function(){return"Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of "+i})),C(Mt(e,o),(function(){return"Error in maxPool3d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+o+"'"})),a!=null&&C(Ke(n),(function(){return"Error in maxPool3d: pad must be an integer when using, dimRoundingMode "+a+" but got pad "+n+"."}));var l=za(u.shape,t,e,o,n,a,i),f=B.runKernelFunc((function(h,d){var p=h.maxPool3d(u,l);return d([u,p]),p}),{x:u},(function(h,d){var p=d[0],v=d[1];return{x:function(){return(function(m,g,x,w,y,b,A,I){var T=E(m,"dy","maxPool3dBackprop"),S=E(g,"input","maxPool3dBackprop"),D=E(x,"output","maxPool3dBackprop"),_=T,M=S,L=D,O=!1;S.rank===4&&(O=!0,_=T.as5D(1,T.shape[0],T.shape[1],T.shape[2],T.shape[3]),M=S.as5D(1,S.shape[0],S.shape[1],S.shape[2],S.shape[3]),L=D.as5D(1,D.shape[0],D.shape[1],D.shape[2],D.shape[3])),C(_.rank===5,(function(){return"Error in maxPool3dBackprop: dy must be rank 5 but got rank "+_.rank+"."})),C(M.rank===5,(function(){return"Error in maxPool3dBackprop: input must be rank 5 but got rank "+M.rank+"."})),C(L.rank===5,(function(){return"Error in maxPool3dBackprop: output must be rank 5 but got rank "+L.rank+"."})),b==null&&(b=[1,1,1]),C(Mt(y,b),(function(){return"Error in maxPool3dBackprop: Either strides or dilations must be 1. Got strides "+y+" and dilations '"+b+"'"})),I!=null&&C(Ke(A),(function(){return"Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode "+I+" but got pad "+A+"."}));var N=za(M.shape,w,y,b,A,I),H=B.runKernelFunc((function(G){return G.maxPool3dBackprop(_,M,L,N)}),{dy5D:_,input5D:M});return O?H.as4D(H.shape[1],H.shape[2],H.shape[3],H.shape[4]):H})(h,p,v,t,e,o,n,a)}}}));return c?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),M0=R({avgPool3d_:function(r,t,e,n,a,i,o){i===void 0&&(i="NDHWC");var s=E(r,"x","avgPool3d","float32"),u=s,c=!1;s.rank===4&&(c=!0,u=s.as5D(1,s.shape[0],s.shape[1],s.shape[2],s.shape[3])),o==null&&(o=[1,1,1]),C(u.rank===5,(function(){return"Error in avgPool3d: x must be rank 5 but got rank "+u.rank+"."})),C(i==="NDHWC",(function(){return"Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of "+i})),C(Mt(e,o),(function(){return"Error in avgPool3d: Either strides or dilations must be 1. Got strides "+e+" and dilations '"+o+"'"})),a!=null&&C(Ke(n),(function(){return"Error in avgPool3d: pad must be an integer when using, dimRoundingMode "+a+" but got pad "+n+"."}));var l=za(u.shape,t,e,o,n,a,i),f=B.runKernelFunc((function(h){return h.avgPool3d(u,l)}),{x:u},(function(h){return{x:function(){return(function(d,p,v,m,g,x,w){var y=E(d,"dy","avgPool3dBackprop"),b=E(p,"input","avgPool3dBackprop"),A=y,I=b,T=!1;b.rank===4&&(T=!0,A=y.as5D(1,y.shape[0],y.shape[1],y.shape[2],y.shape[3]),I=b.as5D(1,b.shape[0],b.shape[1],b.shape[2],b.shape[3])),C(A.rank===5,(function(){return"Error in avgPool3dBackprop: dy must be rank 5 but got rank "+A.rank+"."})),C(I.rank===5,(function(){return"Error in avgPool3dBackprop: input must be rank 5 but got rank "+I.rank+"."})),g==null&&(g=[1,1,1]),C(Mt(m,g),(function(){return"Error in avgPool3dBackprop: Either strides or dilations must be 1. Got strides "+m+" and dilations '"+g+"'"})),w!=null&&C(Ke(x),(function(){return"Error in maxPool3dBackprop: pad must be an integer when using, dimRoundingMode "+w+" but got pad "+x+"."}));var S=za(I.shape,v,m,g,x,w),D=B.runKernelFunc((function(_){return _.avgPool3dBackprop(A,I,S)}),{dy5D:A,input5D:I});return T?D.as4D(D.shape[1],D.shape[2],D.shape[3],D.shape[4]):D})(h,u,t,e,o,n,a)}}}));return f=f.cast(u.dtype),c?f.as4D(f.shape[1],f.shape[2],f.shape[3],f.shape[4]):f}}),sr=R({slice_:function(r,t,e){var n,a,i=E(r,"x","slice");if(i.rank===0)throw new Error("Slicing scalar is not possible");(n=typeof t=="number"?[t].concat(new Array(i.rank-1).fill(0)):t.length<i.rank?t.concat(new Array(i.rank-t.length).fill(0)):t.slice()).forEach((function(u){C(u!==-1,(function(){return"slice() does not support negative begin indexing."}))})),a=(a=e==null?new Array(i.rank).fill(-1):typeof e=="number"?[e].concat(new Array(i.rank-1).fill(-1)):e.length<i.rank?e.concat(new Array(i.rank-e.length).fill(-1)):e).map((function(u,c){return u>=0?u:(C(u===-1,(function(){return"Negative size values should be exactly -1 but got "+u+" for the slice() size at index "+c+"."})),i.shape[c]-n[c])})),ff(i,n,a);var o=i.shape,s={begin:n,size:a};return B.runKernelFunc((function(u){return u.slice(i,n,a)}),{x:i},(function(u){for(var c=[],l=0;l<u.rank;l++)c.push([n[l],o[l]-n[l]-a[l]]);return{x:function(){return u.pad(c)}}}),"Slice",s)}}),B0=R({slice1d_:function(r,t,e){var n=E(r,"x","slice1d");return C(n.rank===1,(function(){return"slice1d expects a rank-1 tensor, but got a rank-"+n.rank+" tensor"})),sr(n,[t],[e])}}),_0=R({slice2d_:function(r,t,e){var n=E(r,"x","slice2d");return C(n.rank===2,(function(){return"slice2d expects a rank-2 tensor, but got a rank-"+n.rank+" tensor"})),sr(n,t,e)}}),xu=R({slice3d_:function(r,t,e){var n=E(r,"x","slice3d");return C(n.rank===3,(function(){return"slice3d expects a rank-3 tensor, but got a rank-"+n.rank+" tensor"})),sr(n,t,e)}}),P0=R({slice4d_:function(r,t,e){var n=E(r,"x","slice4d");return C(n.rank===4,(function(){return"slice4d expects a rank-4 tensor, but got a rank-"+n.rank+" tensor"})),sr(n,t,e)}});function ph(r,t,e,n,a){return t.rank<e.rank&&(t=t.reshape(Rt(t.shape,n))),r.rank<e.rank&&(r=r.reshape(Rt(r.shape,n))),{x:function(){var i=r.mul(e.equal(t).cast(r.dtype));return a==null?i:i.transpose(a)}}}var F0=R({all_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","all","bool"),a=et(t,n.shape),i=a,o=cr(i,n.rank);o!=null&&(n=n.transpose(o),i=lr(i.length,n.rank));var s=B.runKernelFunc((function(c){return c.all(n,i)}),{$x:n});if(e){var u=Rt(s.shape,a);return s.reshape(u)}return s}}),k0=R({any_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","any","bool"),a=et(t,n.shape),i=a,o=cr(i,n.rank);o!=null&&(n=n.transpose(o),i=lr(i.length,n.rank));var s=B.runKernelFunc((function(c){return c.any(n,i)}),{$x:n});if(e){var u=Rt(s.shape,a);return s.reshape(u)}return s}}),N0=R({argMax_:function(r,t){t===void 0&&(t=0);var e=E(r,"x","argMax");t==null&&(t=0);var n=et(t,e.shape),a=cr(n,e.rank);a!=null&&(e=e.transpose(a),n=lr(n.length,e.rank));var i={axis:n[0]},o=[e];return B.runKernelFunc((function(s,u){var c=s.argMax(e,n[0]);return u([e]),c}),{x:e},(function(s,u){var c=u[0];return{x:function(){return Ae(c)}}}),"ArgMax",i,o)}}),O0=R({argMin_:function(r,t){t===void 0&&(t=0);var e=E(r,"x","argMin");t==null&&(t=0);var n=et(t,e.shape),a=cr(n,e.rank);return a!=null&&(e=e.transpose(a),n=lr(n.length,e.rank)),B.runKernelFunc((function(i,o){var s=i.argMin(e,n[0]);return o([e]),s}),{$x:e},(function(i,o){var s=o[0];return{$x:function(){return Ae(s)}}}))}}),L0=R({logSumExp_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","logSumExp"),a=et(t,n.shape),i=n.max(a,!0),o=n.sub(i).exp().sum(a).log(),s=i.reshape(o.shape).add(o);if(e){var u=Rt(s.shape,a);return s.reshape(u)}return s}}),An=R({max_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","max"),a=n,i=et(t,n.shape),o=i,s=cr(o,n.rank);s!=null&&(n=n.transpose(s),o=lr(o.length,n.rank));var u=[n],c=B.runKernelFunc((function(f,h){var d=f.max(n,o);return h([a,d]),d}),{x:n},(function(f,h){return ph(f,h[1],h[0],i,s)}),"Max",{axes:o},u,[!0]);if(e){var l=Rt(c.shape,i);c=c.reshape(l)}return c}}),U0=R({mean_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","mean"),a=et(t,n.shape),i=re(vt(n.shape,a)[1]);return fo((function(o){var s=Y(i);return{value:(s.dtype===o.dtype?o:o.cast(s.dtype)).div(s).sum(t,e),gradFunc:function(u){var c=o.shape.slice();return a.forEach((function(l){c[l]=1})),u.reshape(c).mul(Zn(o.shape,"float32")).div(i)}}}))(n)}}),G0=R({min_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","min"),a=n,i=et(t,n.shape),o=i,s=cr(o,n.rank);s!=null&&(n=n.transpose(s),o=lr(o.length,n.rank));var u=[n],c=B.runKernelFunc((function(f,h){var d=f.min(n,o);return h([a,d]),d}),{x:n},(function(f,h){return ph(f,h[1],h[0],i,s)}),"Min",{axes:o},u,[!0]);if(e){var l=Rt(c.shape,i);c=c.reshape(l)}return c}}),H0=R({moments_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=et(t,(r=E(r,"x","moments")).shape),a=r.mean(n,e),i=a.shape;e||(i=Rt(a.shape,n));var o=r.toFloat().sub(a.reshape(i)).square();return{mean:a,variance:o.mean(n,e)}}}),vh=R({sum_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","sum");n.dtype==="bool"&&(n=n.toInt());var a=et(t,n.shape);return fo((function(i){var o=cr(a,i.rank),s=a,u=i;o!=null&&(u=i.transpose(o),s=lr(s.length,i.rank));var c=function(d){var p=i.shape.slice();return a.forEach((function(v){p[v]=1})),d.reshape(p).mul(Zn(i.shape,"float32"))},l={axes:s},f=B.runKernelFunc((function(d){return d.sum(u,s)}),{x:u},(function(d){return{x:function(){return c(d)}}}),"Sum",l);if(e){var h=Rt(f.shape,a);f=f.reshape(h)}return{value:f,gradFunc:c}}))(n)}}),z0=R({prod_:function(r,t,e){t===void 0&&(t=null),e===void 0&&(e=!1);var n=E(r,"x","prod");n.dtype==="bool"&&(n=n.toInt());var a=et(t,n.shape),i=cr(a,n.rank),o=a,s=n;i!=null&&(s=n.transpose(i),o=lr(o.length,n.rank));var u=B.runKernelFunc((function(l){return l.prod(s,o)}),{permutedX:s});if(e){var c=Rt(u.shape,a);u=u.reshape(c)}return u}}),mh=R({elu_:function(r){var t=E(r,"x","elu");return B.runKernelFunc((function(e,n){var a=e.elu(t);return n([a]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){return B.runKernelFunc((function(i){return i.eluDer(e,a)}),{dy:e,y:a})}}}))}}),W0=R({leakyRelu_:function(r,t){t===void 0&&(t=.2);var e=E(r,"x","leakyRelu");return vu(Y(t).mul(e),e)}}),gh=R({prelu_:function(r,t){var e=E(r,"x","prelu"),n=E(t,"alpha","prelu");return B.runKernelFunc((function(a,i){var o=a.prelu(e,n);return i([e,n]),o}),{x:e,alpha:n},(function(a,i){var o=i[0],s=i[1],u=o.greater(0);return{x:function(){return yn(u,a,a.mul(s))},alpha:function(){var c=yn(u,Ae(a),a.mul(o)),l=$e(s.shape,a.shape);return l.length>0&&(c=c.sum(l)),c.reshape(s.shape)}}}),"Prelu")}}),Re=R({relu_:function(r){var t=E(r,"x","relu");return t.dtype==="bool"?t.toInt():B.runKernelFunc((function(e,n){var a=e.relu(t);return n([t]),a}),{x:t},(function(e,n){var a=n[0];return{x:function(){return e.mulStrict(a.step().toFloat())}}}),"Relu")}}),xh=R({relu6_:function(r){var t=E(r,"x","relu6");return t.dtype==="bool"?t.toInt():B.runKernelFunc((function(e,n){var a=e.relu6(t);return n([t]),a}),{x:t},(function(e,n){var a=n[0],i=a.lessEqual(6).mul(a.step());return{x:function(){return e.mulStrict(i.toFloat())}}}),"Relu6")}}),V0=R({selu_:function(r){var t=E(r,"x","selu");return B.runKernelFunc((function(e,n){var a=e.selu(t);return n([t]),a}),{$x:t},(function(e,n){var a=n[0];return{$x:function(){var i=a.greater(Y(0)),o=Y(fu),s=Y(hu),u=e.mul(s),c=e.mul(o).mul(a.toFloat().exp());return yn(i,u,c)}}}))}}),er=R({transpose_:function(r,t){var e=E(r,"x","transpose");if(t==null&&(t=e.shape.map((function(a,i){return i})).reverse()),C(e.rank===t.length,(function(){return"Error in transpose: rank of input "+e.rank+" must match length of perm "+t+"."})),t.forEach((function(a){C(a>=0&&a<e.rank,(function(){return"All entries in 'perm' must be between 0 and "+(e.rank-1)+" but got "+t}))})),e.rank<=1)return e.clone();var n={perm:t};return B.runKernelFunc((function(a){return a.transpose(e,t)}),{x:e},(function(a){var i=so(t);return{x:function(){return a.transpose(i)}}}),"Transpose",n)}}),X0=R({localResponseNormalization_:function(r,t,e,n,a){t===void 0&&(t=5),e===void 0&&(e=1),n===void 0&&(n=1),a===void 0&&(a=.5);var i=E(r,"x","localResponseNormalization");C(i.rank===4||i.rank===3,(function(){return`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank `+i.rank+"."})),C(Ke(t),(function(){return"Error in localResponseNormalization: depthRadius must be an integer but got depthRadius "+t+"."}));var o=i,s=!1;i.rank===3&&(s=!0,o=i.as4D(1,i.shape[0],i.shape[1],i.shape[2]));var u=B.runKernelFunc((function(c,l){var f=c.localResponseNormalization4D(o,t,e,n,a);return l([o,f]),f}),{x4D:o},(function(c,l){var f=l[0],h=l[1];return{x4D:function(){return B.runKernelFunc((function(d){return d.LRNGrad(c,f,h,t,e,n,a)}),{})}}}));return s?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),yh=R({norm_:function(r,t,e,n){t===void 0&&(t="euclidean"),e===void 0&&(e=null),n===void 0&&(n=!1);var a=(function s(u,c,l){if(l===void 0&&(l=null),u.rank===0)return u.abs();if(u.rank!==1&&l===null)return s(u.reshape([-1]),c,l);if(u.rank===1||typeof l=="number"||Array.isArray(l)&&l.length===1){if(c===1)return u.abs().sum(l);if(c===1/0)return u.abs().max(l);if(c===-1/0)return u.abs().min(l);if(c==="euclidean"||c===2)return u.abs().pow(Y(2,"int32")).sum(l).sqrt();throw new Error("Error in norm: invalid ord value: "+c)}if(Array.isArray(l)&&l.length===2){if(c===1)return u.abs().sum(l[0]).max(l[1]-1);if(c===1/0)return u.abs().sum(l[1]).max(l[0]);if(c===-1/0)return u.abs().sum(l[1]).min(l[0]);if(c==="fro"||c==="euclidean")return u.square().sum(l).sqrt();throw new Error("Error in norm: invalid ord value: "+c)}throw new Error("Error in norm: invalid axis: "+l)})(r=E(r,"x","norm"),t,e),i=a.shape;if(n){var o=et(e,r.shape);i=Rt(a.shape,o)}return a.reshape(i)}}),K0=R({basicLSTMCell_:function(r,t,e,n,a,i){var o=E(r,"forgetBias","basicLSTMCell"),s=E(t,"lstmKernel","basicLSTMCell"),u=E(e,"lstmBias","basicLSTMCell"),c=E(n,"data","basicLSTMCell"),l=E(a,"c","basicLSTMCell"),f=E(i,"h","basicLSTMCell"),h=c.concat(f,1).matMul(s).add(u),d=h.shape[0],p=h.shape[1]/4,v=[d,p],m=h.slice([0,0],v),g=h.slice([0,p],v),x=h.slice([0,2*p],v),w=h.slice([0,3*p],v),y=m.sigmoid().mulStrict(g.tanh()).addStrict(l.mulStrict(o.add(x).sigmoid())),b=y.tanh().mulStrict(w.sigmoid());return[y,b]}}),j0=R({multiRNNCell_:function(r,t,e,n){for(var a=E(t,"data","multiRNNCell"),i=qi(e,"c","multiRNNCell"),o=qi(n,"h","multiRNNCell"),s=a,u=[],c=0;c<r.length;c++){var l=r[c](s,i[c],o[c]);u.push(l[0]),u.push(l[1]),s=l[1]}var f=[],h=[];for(c=0;c<u.length;c+=2)f.push(u[c]),h.push(u[c+1]);return[f,h]}}),Y0=R({movingAverage_:function(r,t,e,n,a){a===void 0&&(a=!0);var i=E(r,"v","movingAverage"),o=E(t,"x","movingAverage"),s=E(e,"decay","movingAverage");Cl(i,o),C(Je(i.shape,o.shape),(function(){return"Shape mismatch in v and x"}));var u=Y(1),c=u.sub(s),l=o.sub(i).mul(c);if(a){C(n!=null,(function(){return"When using zeroDebias: true, step is required."}));var f=E(n,"step","movingAverage");l=l.div(u.sub(no(s,f)))}return i.add(l)}}),Q0=R({stridedSlice_:function(r,t,e,n,a,i,o,s,u){if(a===void 0&&(a=0),i===void 0&&(i=0),o===void 0&&(o=0),s===void 0&&(s=0),u===void 0&&(u=0),n==null&&(n=new Array(t.length)),o!==0)throw new Error("ellipsis mask is not yet supported");var c=E(r,"x","stridedSlice"),l=Ns(s),f=c.shape.slice();l.forEach((function(m){t[m]=0,e[m]=1,f.splice(m,0,1)})),c=c.reshape(f);for(var h=0;h<c.rank;h++)t[h]=hf(a,t,n,c.shape,h),e[h]=df(i,e,n,c.shape,h),n[h]=n[h]||1;var d=Ns(u);d.forEach((function(m){e[m]=t[m]+1,n[m]=1}));var p=lo(t,e,n),v=p.filter((function(m,g){return d.indexOf(g)===-1}));return n.every((function(m){return m===1}))?sr(c,t,p).reshape(v):B.runKernelFunc((function(m){return m.stridedSlice(c,t,e,n)}),{$x:c}).reshape(v)}}),q0=R({topk_:function(r,t,e){t===void 0&&(t=1),e===void 0&&(e=!0);var n=E(r,"x","topk");if(n.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");var a=n.shape[n.shape.length-1];if(t>a)throw new Error("'k' passed to topk() must be <= the last dimension ("+a+") but got "+t);var i=B.runKernelFunc((function(o){return o.topk(n,t,e)}),{$x:n});return{values:i[0],indices:i[1]}}}),Z0=R({scatterND_:function(r,t,e){var n=E(r,"indices","scatterND","int32"),a=E(t,"updates","scatterND");return lf(a,n,e),B.runKernelFunc((function(i){return i.scatterND(n,a,e)}),{indices:n,updates:a},null,"ScatterNd",{shape:e})}}),yu=R({fft_:function(r){C(r.dtype==="complex64",(function(){return"The dtype for tf.spectral.fft() must be complex64 but got "+r.dtype+"."}));var t=r.shape[r.shape.length-1],e=r.size/t,n=r.as2D(e,t);return B.runKernelFunc((function(a){return a.fft(n)}),{input:r}).reshape(r.shape)}}),ao=R({ifft_:function(r){C(r.dtype==="complex64",(function(){return"The dtype for tf.spectral.ifft() must be complex64 but got "+r.dtype+"."}));var t=r.shape[r.shape.length-1],e=r.size/t,n=r.as2D(e,t);return B.runKernelFunc((function(a){return a.ifft(n)}),{input:r}).reshape(r.shape)}}),wu=R({rfft_:function(r,t){C(r.dtype==="float32",(function(){return"The dtype for rfft() must be real value but got "+r.dtype}));var e,n=r.shape[r.shape.length-1],a=r.size/n;if(t!=null&&t<n){var i=r.shape.map((function(g){return 0})),o=r.shape.map((function(g){return g}));o[r.shape.length-1]=t,e=r.slice(i,o),n=t}else if(t!=null&&t>n){var s=r.shape.map((function(g){return g}));s[r.shape.length-1]=t-n,e=r.concat(Ne(s),r.shape.length-1),n=t}else e=r;var u=e.zerosLike(),c=pt(e,u).as2D(a,n),l=yu(c),f=Math.floor(n/2)+1,h=Jt(l),d=gr(l),p=h.split([f,n-f],h.shape.length-1),v=d.split([f,n-f],d.shape.length-1),m=e.shape.slice();return m[e.shape.length-1]=f,pt(p[0],v[0]).reshape(m)}}),wh=R({irfft_:function(r){var t=r.shape[r.shape.length-1],e=r.size/t;if(t<=2){var n=r.as2D(e,t),a=ao(n);return Jt(a)}var i=[e,2*(t-1)],o=Jt(r).as2D(e,t),s=gr(r).as2D(e,t),u=o.slice([0,1],[e,t-2]).reverse(1),c=s.slice([0,1],[e,t-2]).reverse(1).mul(Y(-1)),l=o.concat(u,1),f=s.concat(c,1);return n=pt(l,f).as2D(i[0],i[1]),a=ao(n),Jt(a)}}),J0=Object.freeze({fft:yu,ifft:ao,rfft:wu,irfft:wh}),$0=R({sparseToDense_:function(r,t,e,n){n===void 0&&(n=0);var a=E(r,"sparseIndices","sparseToDense","int32"),i=E(t,"sparseValues","sparseToDense"),o=E(n,"defaultValue","sparseToDense",i.dtype);return(function(s,u,c,l){if(s.dtype!=="int32")throw new Error("tf.sparseToDense() expects the indices to be int32 type, but the dtype was "+s.dtype+".");if(s.rank>2)throw new Error("sparseIndices should be a scalar, vector, or matrix, but got shape "+s.shape+".");var f=s.rank>0?s.shape[0]:1,h=s.rank>1?s.shape[1]:1;if(c.length!==h)throw new Error("outputShape has incorrect number of elements:, "+c.length+", should be: "+h+".");var d=u.size;if(u.rank!==0&&(u.rank!==1||d!==f))throw new Error("sparseValues has incorrect shape "+u.shape+", should be [] or ["+f+"]");if(u.dtype!==l.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")})(a,i,e,o),B.runKernelFunc((function(s){return s.sparseToDense(a,i,e,o)}),{$sparseIndices:a,$sparseValues:i,$defaultValue:o})}}),ex=R({gatherND_:function(r,t){var e=E(t,"indices","gatherND","int32"),n=E(r,"x","gatherND");return B.runKernelFunc((function(a){return a.gatherND(n,e)}),{x:n,indices:e},null,"GatherNd")}}),tx=R({diag_:function(r){var t=E(r,"x","diag").flatten(),e=r.shape.concat(r.shape);return B.runKernelFunc((function(n){return n.diag(t)}),{$x:t}).reshape(e)}}),rx=R({dropout_:function(r,t,e,n){var a=E(r,"x","dropout");if(C(a.dtype==="float32",(function(){return"x has to be a floating point tensor since it's going to be scaled, but got a "+a.dtype+" tensor instead."})),C(t>=0&&t<1,(function(){return"rate must be a float in the range [0, 1), but got "+t+"."})),t===0)return r instanceof _e?a.clone():a;var i=(function(u,c){if(c==null)return u.shape.slice();if(Je(u.shape,c))return c;if(u.shape.length===c.length){for(var l=[],f=0;f<u.shape.length;f++)c[f]==null&&u.shape[f]!=null?l.push(u.shape[f]):l.push(c[f]);return l}return c})(a,e),o=1-t,s=nf(i,0,1,"float32",n).add(o).floor().div(o);return a.mul(s)}});function bh(r,t,e){for(var n=1-r%2,a=new Float32Array(r),i=0;i<r;++i){var o=2*Math.PI*i/(r+n-1);a[i]=t-e*Math.cos(o)}return Fe(a,"float32")}var bu=R({hannWindow_:function(r){return bh(r,.5,.5)}}),Ah=R({hammingWindow_:function(r){return bh(r,.54,.46)}}),Au=R({frame_:function(r,t,e,n,a){n===void 0&&(n=!1),a===void 0&&(a=0);for(var i=0,o=[];i+t<=r.size;)o.push(sr(r,i,t)),i+=e;if(n)for(;i<r.size;){var s=i+t-r.size,u=Ge([sr(r,i,t-s),Qt([s],a)]);o.push(u),i+=e}return o.length===0?xr([],[0,t]):Ge(o).as2D(o.length,t)}}),Eh=R({stft_:function(r,t,e,n,a){var i;a===void 0&&(a=bu),n==null&&(i=t,n=Math.floor(Math.pow(2,Math.ceil(Math.log(i)/Math.log(2)))));for(var o=Au(r,t,e),s=Xe(o,a(t)),u=[],c=0;c<o.shape[0];c++)u.push(wu(s.slice([c,0],[1,t]),n));return Ge(u)}}),nx=Object.freeze({hannWindow:bu,hammingWindow:Ah,frame:Au,stft:Eh}),St,ax=function(r,t,e){return e===void 0&&(e=1),ee(this,void 0,void 0,(function(){var n,a,i,o,s,u,c,l,f,h,d,p,v,m;return te(this,(function(g){switch(g.label){case 0:return n=E(r,"predictions","inTopK"),a=E(t,"targets","inTopK"),C(n.rank>1,(function(){return"inTopK() expects the predictions to be of rank 2 or higher, but got "+n.rank})),C(n.rank-1===a.rank,(function(){return"predictions rank should be 1 larger than targets rank, but got predictions rank "+n.rank+" and targets rank "+a.rank})),De(n.shape.slice(0,n.shape.length-1),a.shape,"predictions's shape should be align with the targets' shape, except the last dimension."),i=n.shape[n.shape.length-1],C(e>0&&e<=i,(function(){return"'k' passed to inTopK() must be > 0 && <= the predictions last dimension ("+i+"), but got "+e})),[4,n.data()];case 1:return o=g.sent(),[4,a.data()];case 2:for(s=g.sent(),u=[o.length/i,i],l=u[1],f=jn("bool",c=u[0]),h=0;h<c;h++){for(d=h*l,p=o.subarray(d,d+l),v=[],m=0;m<p.length;m++)v.push({value:p[m],index:m});for(v.sort((function(x,w){return w.value-x.value})),f[h]=0,m=0;m<e;m++)if(v[m].index===s[h]){f[h]=1;break}}return r!==n&&n.dispose(),t!==a&&a.dispose(),[2,ut(f,a.shape,"bool")]}}))}))};(function(r){r[r.NONE=0]="NONE",r[r.MEAN=1]="MEAN",r[r.SUM=2]="SUM",r[r.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(St||(St={}));var ix=R({absoluteDifference_:function(r,t,e,n){n===void 0&&(n=St.SUM_BY_NONZERO_WEIGHTS);var a=E(r,"labels","absoluteDifference"),i=E(t,"predictions","absoluteDifference"),o=null;e!=null&&(o=E(e,"weights","absoluteDifference")),De(a.shape,i.shape,"Error in absoluteDifference: ");var s=a.sub(i).abs();return kr(s,o,n)}}),kr=R({computeWeightedLoss_:function(r,t,e){e===void 0&&(e=St.SUM_BY_NONZERO_WEIGHTS);var n=E(r,"losses","computeWeightedLoss"),a=null;t!=null&&(a=E(t,"weights","computeWeightedLoss"));var i=a==null?n:n.mul(a);if(e===St.NONE)return i;if(e===St.SUM)return i.sum();if(e===St.MEAN){if(a==null)return i.mean();var o=n.size/a.size,s=i.sum().div(a.sum());return o>1?s.div(Y(o)):s}if(e===St.SUM_BY_NONZERO_WEIGHTS){if(a==null)return i.sum().div(Y(n.size));var u=a.mul(Zn(n.shape)).notEqual(Y(0)).sum().toFloat();return i.sum().div(u)}throw Error("Unknown reduction: "+e)}}),ox=R({cosineDistance_:function(r,t,e,n,a){a===void 0&&(a=St.SUM_BY_NONZERO_WEIGHTS);var i=E(r,"labels","cosineDistance"),o=E(t,"predictions","cosineDistance"),s=null;n!=null&&(s=E(n,"weights","cosineDistance")),De(i.shape,o.shape,"Error in cosineDistance: ");var u=Y(1).sub(i.mul(o).sum(e,!0));return kr(u,s,a)}}),sx=R({hingeLoss_:function(r,t,e,n){n===void 0&&(n=St.SUM_BY_NONZERO_WEIGHTS);var a=E(r,"labels","hingeLoss"),i=E(t,"predictions","hingeLoss"),o=null;e!=null&&(o=E(e,"weights","hingeLoss")),De(a.shape,i.shape,"Error in hingeLoss: ");var s=Y(1);a=Y(2).mul(a).sub(s);var u=s.sub(a.mul(i)).relu();return kr(u,o,n)}}),ux=R({huberLoss_:function(r,t,e,n,a){n===void 0&&(n=1),a===void 0&&(a=St.SUM_BY_NONZERO_WEIGHTS);var i=E(r,"labels","huberLoss"),o=E(t,"predictions","huberLoss"),s=null;e!=null&&(s=E(e,"weights","huberLoss")),De(i.shape,o.shape,"Error in huberLoss: ");var u=Y(n),c=o.sub(i).abs(),l=nh(c,u),f=c.sub(l),h=Y(.5).mul(l.square()).add(u.mul(f));return kr(h,s,a)}}),cx=R({logLoss_:function(r,t,e,n,a){n===void 0&&(n=1e-7),a===void 0&&(a=St.SUM_BY_NONZERO_WEIGHTS);var i=E(r,"labels","logLoss"),o=E(t,"predictions","logLoss"),s=null;e!=null&&(s=E(e,"weights","logLoss")),De(i.shape,o.shape,"Error in logLoss: ");var u=Y(1),c=Y(n),l=i.mul(o.add(c).log()).neg().sub(u.sub(i).mul(u.sub(o).add(c).log()));return kr(l,s,a)}}),lx=R({meanSquaredError_:function(r,t,e,n){n===void 0&&(n=St.SUM_BY_NONZERO_WEIGHTS);var a=E(r,"labels","meanSquaredError"),i=E(t,"predictions","meanSquaredError"),o=null;e!=null&&(o=E(e,"weights","meanSquaredError")),De(a.shape,i.shape,"Error in meanSquaredError: ");var s=a.squaredDifference(i);return kr(s,o,n)}}),fx=R({sigmoidCrossEntropy_:function(r,t,e,n,a){n===void 0&&(n=0),a===void 0&&(a=St.SUM_BY_NONZERO_WEIGHTS);var i=E(r,"multiClassLabels","sigmoidCrossEntropy"),o=E(t,"logits","sigmoidCrossEntropy"),s=null;if(e!=null&&(s=E(e,"weights","sigmoidCrossEntropy")),De(i.shape,o.shape,"Error in sigmoidCrossEntropy: "),n>0){var u=Y(n),c=Y(1),l=Y(.5);i=i.mul(c.sub(u)).add(l.mul(u))}var f=(function(h,d){var p=E(h,"labels","sigmoidCrossEntropyWithLogits"),v=E(d,"logits","sigmoidCrossEntropyWithLogits");De(p.shape,v.shape,"Error in sigmoidCrossEntropyWithLogits: ");var m=v.relu(),g=v.mul(p),x=v.abs().neg().exp().log1p();return m.sub(g).add(x)})(i,o);return kr(f,s,a)}}),hx=R({softmaxCrossEntropy_:function(r,t,e,n,a){n===void 0&&(n=0),a===void 0&&(a=St.SUM_BY_NONZERO_WEIGHTS);var i=E(r,"onehotLabels","softmaxCrossEntropy"),o=E(t,"logits","softmaxCrossEntropy"),s=null;if(e!=null&&(s=E(e,"weights","softmaxCrossEntropy")),De(i.shape,o.shape,"Error in softmaxCrossEntropy: "),n>0){var u=Y(n),c=Y(1),l=Y(i.shape[1]);i=i.mul(c.sub(u)).add(u.div(l))}var f=(function(h,d,p){if(p===void 0&&(p=-1),p===-1&&(p=d.rank-1),p!==d.rank-1)throw Error("Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank "+d.rank+" and dim was "+p);return fo((function(v,m,g){var x=m.logSumExp([p],!0),w=m.toFloat().sub(x);return g([v,w]),{value:w.mul(v).neg().sum([p]),gradFunc:function(y,b){var A=b[0],I=b[1],T=Rt(y.shape,[p]);return[y.reshape(T).mul(A.toFloat().sub(I.exp())),y.reshape(T).mul(I.exp().sub(A.toFloat()))]}}}))(h,d)})(i,o);return kr(f,s,a)}}),dx=Object.freeze({get Reduction(){return St},absoluteDifference:ix,computeWeightedLoss:kr,cosineDistance:ox,hingeLoss:sx,huberLoss:ux,logLoss:cx,meanSquaredError:lx,sigmoidCrossEntropy:fx,softmaxCrossEntropy:hx});function qc(r,t){return t===void 0&&(t=!1),B.tidy((function(){if(r.shape.length!==2)throw new Error("qr2d() requires a 2D Tensor, but got a "+r.shape.length+"D Tensor.");for(var e=r.shape[0],n=r.shape[1],a=rf(e),i=r.clone(),o=xr([[1]],[1,1]),s=o.clone(),u=e>=n?n:e,c=function(f){var h,d=i,p=s,v=a;h=B.tidy((function(){var m=i.slice([f,f],[e-f,1]),g=m.norm(),x=i.slice([f,f],[1,1]),w=xr([[-1]]).where(x.greater(0),xr([[1]])),y=x.sub(w.mul(g)),b=m.div(y);s=b.shape[0]===1?o.clone():o.concat(b.slice([1,0],[b.shape[0]-1,b.shape[1]]),0);var A=w.matMul(y).div(g).neg(),I=i.slice([f,0],[e-f,n]),T=A.mul(s);if(f===0)i=I.sub(T.matMul(s.transpose().matMul(I)));else{var S=I.sub(T.matMul(s.transpose().matMul(I)));i=i.slice([0,0],[f,n]).concat(S,0)}var D=a.slice([0,f],[e,a.shape[1]-f]);if(f===0)a=D.sub(D.matMul(s).matMul(T.transpose()));else{var _=D.sub(D.matMul(s).matMul(T.transpose()));a=a.slice([0,0],[e,f]).concat(_,1)}return[s,i,a]})),s=h[0],i=h[1],a=h[2],Ot([d,p,v])},l=0;l<u;++l)c(l);return!t&&e>n&&(a=a.slice([0,0],[e,n]),i=i.slice([0,0],[n,n])),[a,i]}))}var px=R({bandPart_:function(r,t,e){if(t%1!=0)throw new Error("bandPart(): numLower must be an integer, got "+t+".");if(e%1!=0)throw new Error("bandPart(): numUpper must be an integer, got "+e+".");var n=E(r,"a","bandPart");if(n.rank<2)throw new Error("bandPart(): Rank must be at least 2, got "+n.rank+".");var a=n.shape,i=n.shape.slice(-2),o=i[0],s=i[1];if(!(t<=o))throw new Error("bandPart(): numLower ("+t+") must not be greater than the number of rows ("+o+").");if(!(e<=s))throw new Error("bandPart(): numUpper ("+e+") must not be greater than the number of columns ("+s+").");t<0&&(t=o),e<0&&(e=s);var u=Zi(0,o,1,"int32").reshape([-1,1]),c=Zi(0,s,1,"int32"),l=Pe(u,c),f=mo(l.lessEqual(Y(+t,"int32")),l.greaterEqual(Y(-e,"int32"))),h=Ne([o,s],n.dtype);return gt(Me(n.reshape([-1,o,s])).map((function(d){return yn(f,d,h)}))).reshape(a)}}),vx=R({gramSchmidt_:function(r){var t;if(Array.isArray(r)){t=!1,C(r!=null&&r.length>0,(function(){return"Gram-Schmidt process: input must not be null, undefined, or empty"}));for(var e=r[0].shape[0],n=function(u){C(r[u].shape[0]===e,(function(){return"Gram-Schmidt: Non-unique lengths found in the input vectors: ("+r[u].shape[0]+" vs. "+e+")"}))},a=1;a<r.length;++a)n(a)}else t=!0,r=Js(r,r.shape[0],0).map((function(u){return of(u,[0])}));C(r.length<=r[0].shape[0],(function(){return"Gram-Schmidt: Number of vectors ("+r.length+") exceeds number of dimensions ("+r[0].shape[0]+")."}));var i=[],o=r,s=function(u){i.push(B.tidy((function(){var c=o[u];if(u>0)for(var l=0;l<u;++l){var f=vh(i[l].mulStrict(c)).mul(i[l]);c=c.sub(f)}return c.div(yh(c,"euclidean"))})))};for(a=0;a<r.length;++a)s(a);return t?gt(i,0):i}}),mx=R({qr_:function(r,t){if(t===void 0&&(t=!1),r.rank<2)throw new Error("qr() requires input tensor to have a rank >= 2, but got rank "+r.rank);if(r.rank===2)return qc(r,t);var e=r.shape.slice(0,r.shape.length-2).reduce((function(o,s){return o*s})),n=Me(r.reshape([e,r.shape[r.shape.length-2],r.shape[r.shape.length-1]]),0),a=[],i=[];return n.forEach((function(o){var s=qc(o,t),u=s[0],c=s[1];a.push(u),i.push(c)})),[gt(a,0).reshape(r.shape),gt(i,0).reshape(r.shape)]}}),gx=Object.freeze({bandPart:px,gramSchmidt:vx,qr:mx});function go(r,t,e,n,a,i){n==null&&(n=.5),a==null&&(a=Number.NEGATIVE_INFINITY),i==null&&(i=0);var o=r.shape[0];return e=Math.min(e,o),C(0<=n&&n<=1,(function(){return"iouThreshold must be in [0, 1], but was '"+n+"'"})),C(r.rank===2,(function(){return"boxes must be a 2D tensor, but was of rank '"+r.rank+"'"})),C(r.shape[1]===4,(function(){return"boxes must have 4 columns, but 2nd dimension was "+r.shape[1]})),C(t.rank===1,(function(){return"scores must be a 1D tensor"})),C(t.shape[0]===o,(function(){return"scores has incompatible shape with boxes. Expected "+o+", but was "+t.shape[0]})),C(0<=i&&i<=1,(function(){return"softNmsSigma must be in [0, 1], but was '"+i+"'"})),{maxOutputSize:e,iouThreshold:n,scoreThreshold:a,softNmsSigma:i}}var xx=R({resizeBilinear_:function(r,t,e){e===void 0&&(e=!1);var n=E(r,"images","resizeBilinear");C(n.rank===3||n.rank===4,(function(){return"Error in resizeBilinear: x must be rank 3 or 4, but got rank "+n.rank+"."})),C(t.length===2,(function(){return"Error in resizeBilinear: new shape must 2D, but got shape "+t+"."}));var a=n,i=!1;n.rank===3&&(i=!0,a=n.as4D(1,n.shape[0],n.shape[1],n.shape[2]));var o=t[0],s=t[1],u=B.runKernelFunc((function(c,l){return l([a]),c.resizeBilinear(a,o,s,e)}),{x:a},(function(c,l){return{x:function(){return B.runKernelFunc((function(f){return f.resizeBilinearBackprop(c,l[0],e)}),{})}}}),"ResizeBilinear",{alignCorners:e,newHeight:o,newWidth:s});return i?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),yx=R({resizeNearestNeighbor_:function(r,t,e){e===void 0&&(e=!1);var n=E(r,"images","resizeNearestNeighbor");C(n.rank===3||n.rank===4,(function(){return"Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank "+n.rank+"."})),C(t.length===2,(function(){return"Error in resizeNearestNeighbor: new shape must 2D, but got shape "+t+"."})),C(n.dtype==="float32"||n.dtype==="int32",(function(){return"`images` must have `int32` or `float32` as dtype"}));var a=n,i=!1;n.rank===3&&(i=!0,a=n.as4D(1,n.shape[0],n.shape[1],n.shape[2]));var o=t[0],s=t[1],u=B.runKernelFunc((function(c,l){return l([a]),c.resizeNearestNeighbor(a,o,s,e)}),{batchImages:a},(function(c,l){return{batchImages:function(){return B.runKernelFunc((function(f){return f.resizeNearestNeighborBackprop(c,l[0],e)}),{})}}}));return i?u.as3D(u.shape[1],u.shape[2],u.shape[3]):u}}),wx=R({nonMaxSuppression_:function(r,t,e,n,a){n===void 0&&(n=.5),a===void 0&&(a=Number.NEGATIVE_INFINITY);var i=E(r,"boxes","nonMaxSuppression"),o=E(t,"scores","nonMaxSuppression"),s=go(i,o,e,n,a);e=s.maxOutputSize,n=s.iouThreshold,a=s.scoreThreshold;var u={maxOutputSize:e,iouThreshold:n,scoreThreshold:a};return B.runKernelFunc((function(c){return c.nonMaxSuppression(i,o,e,n,a)}),{boxes:i,scores:o},null,"NonMaxSuppressionV3",u)}}),bx=function(r,t,e,n,a){return n===void 0&&(n=.5),a===void 0&&(a=Number.NEGATIVE_INFINITY),ee(this,void 0,void 0,(function(){var i,o,s,u,c,l,f;return te(this,(function(h){switch(h.label){case 0:return i=E(r,"boxes","nonMaxSuppressionAsync"),o=E(t,"scores","nonMaxSuppressionAsync"),s=go(i,o,e,n,a),e=s.maxOutputSize,n=s.iouThreshold,a=s.scoreThreshold,[4,Promise.all([i.data(),o.data()])];case 1:return u=h.sent(),c=u[0],l=u[1],f=su(c,l,e,n,a),i!==r&&i.dispose(),o!==t&&o.dispose(),[2,f]}}))}))},Ax=R({nonMaxSuppressionWithScore_:function(r,t,e,n,a,i){n===void 0&&(n=.5),a===void 0&&(a=Number.NEGATIVE_INFINITY),i===void 0&&(i=0);var o=E(r,"boxes","nonMaxSuppression"),s=E(t,"scores","nonMaxSuppression"),u=go(o,s,e,n,a,i),c={maxOutputSize:e=u.maxOutputSize,iouThreshold:n=u.iouThreshold,scoreThreshold:a=u.scoreThreshold,softNmsSigma:i=u.softNmsSigma},l=B.runKernel("NonMaxSuppressionV5",{boxes:o,scores:s},c);return{selectedIndices:l[0],selectedScores:l[1]}}}),Ex=function(r,t,e,n,a,i){return n===void 0&&(n=.5),a===void 0&&(a=Number.NEGATIVE_INFINITY),i===void 0&&(i=0),ee(this,void 0,void 0,(function(){var o,s,u,c,l,f,h;return te(this,(function(d){switch(d.label){case 0:return o=E(r,"boxes","nonMaxSuppressionAsync"),s=E(t,"scores","nonMaxSuppressionAsync"),u=go(o,s,e,n,a,i),e=u.maxOutputSize,n=u.iouThreshold,a=u.scoreThreshold,i=u.softNmsSigma,[4,Promise.all([o.data(),s.data()])];case 1:return c=d.sent(),l=c[0],f=c[1],h=uu(l,f,e,n,a,i),o!==r&&o.dispose(),s!==t&&s.dispose(),[2,h]}}))}))},Cx=R({cropAndResize_:function(r,t,e,n,a,i){var o=E(r,"image","cropAndResize"),s=E(t,"boxes","cropAndResize","float32"),u=E(e,"boxInd","cropAndResize","int32");a=a||"bilinear",i=i||0;var c=s.shape[0];return C(o.rank===4,(function(){return"Error in cropAndResize: image must be rank 4,but got rank "+o.rank+"."})),C(s.rank===2&&s.shape[1]===4,(function(){return"Error in cropAndResize: boxes must be have size ["+c+",4] but had shape "+s.shape+"."})),C(u.rank===1&&u.shape[0]===c,(function(){return"Error in cropAndResize: boxInd must be have size ["+c+"] but had shape "+s.shape+"."})),C(n.length===2,(function(){return"Error in cropAndResize: cropSize must be of length 2, but got length "+n.length+"."})),C(n[0]>=1&&n[1]>=1,(function(){return"cropSize must be atleast [1,1], but was "+n})),C(a==="bilinear"||a==="nearest",(function(){return"method must be bilinear or nearest, but was "+a})),B.runKernelFunc((function(l,f){return l.cropAndResize(o,s,u,n,a,i)}),{images:o,boxes:s,boxInd:u},null,"CropAndResize",{method:a,extrapolationValue:i,cropSize:n})}}),$a=Object.freeze({resizeBilinear:xx,resizeNearestNeighbor:yx,nonMaxSuppression:wx,nonMaxSuppressionAsync:bx,nonMaxSuppressionWithScore:Ax,nonMaxSuppressionWithScoreAsync:Ex,cropAndResize:Cx}),Eu=function(r,t){return!(r>0)||t==="linear"},Cu=function(r,t,e){if(e==null||e==="linear")return r;if(e==="relu")return r.mul(t.step());throw new Error("Gradient for activation "+e+" has not been implemented yet.")},Su=function(r,t){var e=t,n=$e(r.shape,t.shape);return n.length>0&&(e=e.sum(n)),e.reshape(r.shape)},Du=function(r,t,e){if(t==="linear")return r;if(t==="relu")return Re(r);if(t==="elu")return mh(r);if(t==="relu6")return xh(r);if(t==="prelu")return gh(r,e);throw new Error("Unknown fused activation "+t+".")},Sx=R({fusedMatMul_:function(r){var t,e=r.a,n=r.b,a=r.transposeA,i=a!==void 0&&a,o=r.transposeB,s=o!==void 0&&o,u=r.bias,c=r.activation,l=c===void 0?"linear":c,f=r.preluActivationWeights;if(Eu(B.state.gradientDepth,l)===!1){var h=Jn(e,n,i,s);return u!=null&&(h=ie(h,u)),Du(h,l,f)}var d=E(e,"a","fused matMul"),p=E(n,"b","fused matMul");t=Ve(d,p),d=t[0],p=t[1];var v=i?d.shape[d.rank-2]:d.shape[d.rank-1],m=s?p.shape[p.rank-1]:p.shape[p.rank-2],g=i?d.shape[d.rank-1]:d.shape[d.rank-2],x=s?p.shape[p.rank-2]:p.shape[p.rank-1],w=d.shape.slice(0,-2),y=p.shape.slice(0,-2),b=re(w),A=re(y);C(d.rank>=2&&p.rank>=2&&d.rank===p.rank,(function(){return"Error in fused matMul: inputs must have the same rank of at least 2, got ranks "+d.rank+" and "+p.rank+"."})),C(Je(w,y),(function(){return"Error in fused matMul: outer dimensions ("+w+") and ("+y+") of Tensors with shapes "+d.shape+" and "+p.shape+" must match."})),C(v===m,(function(){return"Error in fused matMul: inner shapes ("+v+") and ("+m+") of Tensors with shapes "+d.shape+" and "+p.shape+" and transposeA="+i+" and transposeB="+s+" must match."}));var I,T,S=d.shape.slice(0,-2).concat([g,x]),D=i?d.as3D(b,v,g):d.as3D(b,g,v),_=s?p.as3D(A,x,m):p.as3D(A,m,x);u!=null&&xe(S,(I=Ve(I=E(u,"bias","fused matMul"),d)[0]).shape),f!=null&&(T=E(f,"prelu weights","fused matMul"));var M={a:D,b:_};u!=null&&(M.bias=I),f!=null&&(M.preluActivationWeights=T);var L=[D,_];return B.runKernelFunc((function(O,N){var H=O.fusedBatchMatMul({a:D,b:_,transposeA:i,transposeB:s,bias:I,activation:l,preluActivationWeights:T});return N([D,_,H]),H}),M,(function(O,N){var H=N[0],G=N[1],U=N[2],z=Cu(O,U,l),X={};return u!=null&&(X={bias:function(){return Su(I,z)}}),Object.assign(i||s?!i&&s?{a:function(){return z.matMul(G,!1,!1)},b:function(){return z.matMul(H,!0,!1)}}:i&&!s?{a:function(){return G.matMul(z,!1,!0)},b:function(){return H.matMul(z,!1,!1)}}:{a:function(){return G.matMul(z,!0,!0)},b:function(){return z.matMul(H,!0,!0)}}:{a:function(){return z.matMul(G,!1,!0)},b:function(){return H.matMul(z,!0,!1)}},X)}),"_FusedMatMul",{transposeA:i,transposeB:s,activation:l},L,[!0]).reshape(S)}}),Dx=R({fusedConv2d_:function(r){var t=r.x,e=r.filter,n=r.strides,a=r.pad,i=r.dataFormat,o=i===void 0?"NHWC":i,s=r.dilations,u=s===void 0?[1,1]:s,c=r.dimRoundingMode,l=r.bias,f=r.activation,h=f===void 0?"linear":f,d=r.preluActivationWeights;if(h=h||"linear",Eu(B.state.gradientDepth,h)===!1){var p=ct(t,e,n,a,o,u,c);return l!=null&&(p=ie(p,l)),Du(p,h,d)}var v=E(t,"x","conv2d"),m=E(e,"filter","conv2d"),g=v,x=!1;v.rank===3&&(x=!0,g=v.as4D(1,v.shape[0],v.shape[1],v.shape[2])),C(g.rank===4,(function(){return"Error in fused conv2d: input must be rank 4, but got rank "+g.rank+"."})),C(m.rank===4,(function(){return"Error in fused conv2d: filter must be rank 4, but got rank "+m.rank+"."})),c!=null&&C(Ke(a),(function(){return"Error in fused conv2d: pad must be an integer when using, dimRoundingMode "+c+" but got pad "+a+"."})),C(g.shape[3]===m.shape[2],(function(){return"Error in conv2d: depth of input ("+g.shape[3]+") must match input depth for filter "+m.shape[2]+"."})),C(Mt(n,u),(function(){return"Error in conv2D: Either strides or dilations must be 1. Got strides "+n+" and dilations '"+u+"'"})),C(o==="NHWC",(function(){return"Error in conv2d: got dataFormat of "+o+" but only NHWC is currently supported."}));var w,y,b=qr(g.shape,m.shape,n,u,a,c);l!=null&&(w=Ve(w=E(l,"bias","fused conv2d"),v)[0],xe(b.outShape,w.shape)),d!=null&&(y=E(d,"prelu weights","fused conv2d"));var A={x:g,filter:m};l!=null&&(A.bias=w),d!=null&&(A.preluActivationWeights=y);var I=[m,g],T=B.runKernelFunc((function(S,D){var _=S.fusedConv2d({input:g,filter:m,convInfo:b,bias:w,activation:h,preluActivationWeights:y});return D([m,g,_]),_}),A,(function(S,D){var _=D,M=_[0],L=_[1],O=_[2],N=Cu(S,O,h);C(xn(u),(function(){return"Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '"+u+"'"}));var H={};return l!=null&&(H={bias:function(){return Su(w,N)}}),Object.assign({x:function(){return ch(L.shape,N,M,n,a)},filter:function(){return gu(L,N,M.shape,n,a)}},H)}),"FusedConv2D",{convInfo:b,activation:h},I,[!0]);return x?T.as3D(T.shape[1],T.shape[2],T.shape[3]):T}}),Tx=R({fusedDepthwiseConv2d_:function(r){var t=r.x,e=r.filter,n=r.strides,a=r.pad,i=r.dataFormat,o=i===void 0?"NHWC":i,s=r.dilations,u=s===void 0?[1,1]:s,c=r.dimRoundingMode,l=r.bias,f=r.activation,h=f===void 0?"linear":f,d=r.preluActivationWeights;if(Eu(B.state.gradientDepth,h)===!1){var p=qa(t,e,n,a,o,u,c);return l!=null&&(p=ie(p,l)),Du(p,h,d)}var v=E(t,"x","depthwiseConv2d"),m=E(e,"filter","depthwiseConv2d"),g=v,x=!1;v.rank===3&&(x=!0,g=v.as4D(1,v.shape[0],v.shape[1],v.shape[2])),C(g.rank===4,(function(){return"Error in fused depthwiseConv2d: input must be rank 4, but got rank "+g.rank+"."})),C(m.rank===4,(function(){return"Error in fused depthwiseConv2d: filter must be rank 4, but got rank "+m.rank+"."})),C(g.shape[3]===m.shape[2],(function(){return"Error in fused depthwiseConv2d: number of input channels ("+g.shape[3]+") must match the inChannels dimension in filter "+m.shape[2]+"."})),u==null&&(u=[1,1]),C(Mt(n,u),(function(){return"Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides "+n+" and dilations '"+u+"'"})),c!=null&&C(Ke(a),(function(){return"Error in fused depthwiseConv2d: pad must be an integer when using dimRoundingMode "+c+" but got pad "+a+"."}));var w,y,b=qr(g.shape,m.shape,n,u,a,c,!0);l!=null&&(w=Ve(w=E(l,"bias","fused conv2d"),v)[0],xe(b.outShape,w.shape)),d!=null&&(y=E(d,"prelu weights","fused depthwiseConv2d"));var A={x:g,filter:m};l!=null&&(A.bias=w),d!=null&&(A.preluActivationWeights=y);var I=[m,g],T=B.runKernelFunc((function(S,D){var _=S.fusedDepthwiseConv2D({input:g,filter:m,convInfo:b,bias:w,activation:h,preluActivationWeights:y});return D([m,g,_]),_}),A,(function(S,D){C(xn(u),(function(){return"Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '"+u+"'"}));var _=D[0],M=D[1],L=D[2],O=Cu(S,L,h),N={};return l!=null&&(N={bias:function(){return Su(w,O)}}),Object.assign({x:function(){return lh(M.shape,O,_,b)},filter:function(){return fh(M,O,_.shape,b)}},N)}),"FusedDepthwiseConv2D",{convInfo:b,activation:h},I,[!0]);return x?T.as3D(T.shape[1],T.shape[2],T.shape[3]):T}}),Ix=Object.freeze({matMul:Sx,conv2d:Dx,depthwiseConv2d:Tx}),Rx=Object.freeze({image:$a,linalg:gx,losses:dx,spectral:J0,fused:Ix,signal:nx,square:cg,squaredDifference:Qf,conv1d:x0,conv2d:ct,conv3d:y0,depthwiseConv2d:qa,separableConv2d:Za,conv2dTranspose:w0,conv3dTranspose:b0,op:R,batchNormalization2d:Ug,batchNormalization3d:Gg,batchNormalization4d:Hg,batchNormalization:zg,batchNorm:pu,batchNorm2d:Wg,batchNorm3d:Vg,batchNorm4d:Xg,booleanMaskAsync:g0,complex:pt,real:Jt,imag:gr,concat:Ge,concat1d:qp,concat2d:Zp,concat3d:Jp,concat4d:$p,split:Js,matMul:Jn,dot:A0,outerProduct:E0,reverse:Ja,reverse1d:C0,reverse2d:S0,reverse3d:D0,reverse4d:T0,maxPool:je,avgPool:Fr,pool:I0,maxPool3d:R0,avgPool3d:M0,slice:sr,slice1d:B0,slice2d:_0,slice3d:xu,slice4d:P0,abs:lg,acos:fg,acosh:hg,asin:dg,asinh:pg,atan:vg,atanh:mg,ceil:gg,clipByValue:ja,cos:xg,cosh:yg,erf:wg,exp:po,expm1:bg,floor:Ag,log:Eg,log1p:Cg,logSigmoid:Sg,neg:Ya,reciprocal:Dg,round:Tg,rsqrt:qf,sigmoid:du,sign:Ig,isNaN:Rg,isInf:Mg,isFinite:Bg,sin:_g,sinh:Pg,softplus:Fg,sqrt:kg,step:Ng,tan:Og,tanh:Lg,all:F0,any:k0,argMax:N0,argMin:O0,logSumExp:L0,max:An,mean:U0,min:G0,moments:H0,sum:vh,prod:z0,equal:ah,equalStrict:s0,greater:u0,greaterEqual:ih,greaterEqualStrict:c0,greaterStrict:l0,less:f0,lessEqual:h0,lessEqualStrict:d0,lessStrict:p0,notEqual:v0,notEqualStrict:m0,add:ie,addN:Yg,addStrict:Qg,atan2:qg,div:$t,divNoNan:Zg,divStrict:Jg,floorDiv:rh,maximum:vu,maximumStrict:$g,minimum:nh,minimumStrict:e0,mod:t0,modStrict:r0,mul:Xe,mulStrict:n0,pow:no,powStrict:a0,squaredDifferenceStrict:i0,sub:Pe,subStrict:o0,elu:mh,leakyRelu:W0,prelu:gh,relu:Re,relu6:xh,selu:V0,logicalAnd:mo,logicalNot:Kg,logicalOr:eh,logicalXor:jg,where:yn,whereAsync:th,buffer:le,print:uv,batchToSpaceND:tf,broadcastTo:cv,cast:lv,clone:fv,cumsum:hv,depthToSpace:dv,expandDims:Et,eye:rf,multinomial:pv,oneHot:ks,pad:Pr,pad1d:vv,pad2d:mv,pad3d:gv,pad4d:xv,rand:yv,randomNormal:wv,randomGamma:bv,randomUniform:nf,reshape:Bt,spaceToBatchND:af,squeeze:of,stack:gt,tile:vn,truncatedNormal:Av,unstack:Me,setdiff1dAsync:Ev,fill:Qt,linspace:Qp,ones:Zn,range:Zi,scalar:Y,tensor:ut,tensor1d:Fe,tensor2d:xr,tensor3d:uo,tensor4d:at,tensor5d:Kp,tensor6d:jp,variable:Yp,zeros:Ne,onesLike:ef,zerosLike:Ae,transpose:er,softmax:_t,logSoftmax:Sv,localResponseNormalization:X0,norm:yh,gather:mu,unsortedSegmentSum:oh,basicLSTMCell:K0,multiRNNCell:j0,movingAverage:Y0,stridedSlice:Q0,topk:q0,scatterND:Z0,fft:yu,ifft:ao,rfft:wu,irfft:wh,sparseToDense:$0,gatherND:ex,diag:tx,dropout:rx,hannWindow:bu,hammingWindow:Ah,frame:Au,stft:Eh,inTopKAsync:ax});function W(r,t){Array.isArray(r)||(r=[r]),r.forEach((function(e){e!=null&&C(e.dtype!=="complex64",(function(){return t+" does not support complex64 tensors."}))}))}function ds(r,t,e,n){if(e==="linear")return r.linear(t);if(e==="relu")return r.relu(t);if(e==="elu")return r.elu(t);if(e==="relu6")return r.relu6(t);if(e==="prelu")return r.prelu(t,n);throw new Error("Activation "+e+" has not been implemented for the CPU backend.")}var Mx=(function(r){function t(){var e=r.call(this)||this;return e.blockSize=48,e.firstUse=!0,e.data=new pf(e,B),e}return ur(t,r),t.prototype.write=function(e,n,a){this.firstUse&&(this.firstUse=!1,k().get("IS_NODE")&&Qi(`
============================
Hi there \u{1F44B}. Looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, which binds to TensorFlow C++, by running npm i @tensorflow/tfjs-node, or npm i @tensorflow/tfjs-node-gpu if you have CUDA. Then call require('@tensorflow/tfjs-node'); (-gpu suffix for CUDA) at the start of your program. Visit https://github.com/tensorflow/tfjs-node for more details.
============================`));var i={};return this.data.set(i,{values:e,dtype:a}),i},t.prototype.move=function(e,n,a,i){this.data.set(e,{values:n,dtype:i})},t.prototype.numDataIds=function(){return this.data.numDataIds()},t.prototype.read=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){return[2,this.readSync(e)]}))}))},t.prototype.readSync=function(e){var n=this.data.get(e),a=n.dtype,i=n.complexTensors;return a==="complex64"?Ls(this.readSync(i.real.dataId),this.readSync(i.imag.dataId)):this.data.get(e).values},t.prototype.bufferSync=function(e){var n=this.readSync(e.dataId),a=n;if(e.dtype==="string")try{a=n.map((function(i){return Na(i)}))}catch{throw new Error("Failed to decode encoded string bytes into utf-8")}return le(e.shape,e.dtype,a)},t.prototype.makeOutput=function(e,n,a){var i=this.write(e,n,a);return B.makeTensorFromDataId(i,n,a,this)},t.prototype.disposeData=function(e){if(this.data.has(e)){var n=this.data.get(e).complexTensors;n!=null&&(n.real.dispose(),n.imag.dispose()),this.data.delete(e)}},t.prototype.time=function(e){return ee(this,void 0,void 0,(function(){var n;return te(this,(function(a){return n=ir(),e(),[2,{kernelMs:ir()-n}]}))}))},t.prototype.memory=function(){return{unreliable:!0,reasons:["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]}},t.prototype.complex=function(e,n){var a=this.makeOutput(null,e.shape,"complex64");return this.data.get(a.dataId).complexTensors={real:B.keep(e.clone()),imag:B.keep(n.clone())},a},t.prototype.real=function(e){return this.data.get(e.dataId).complexTensors.real.clone()},t.prototype.imag=function(e){return this.data.get(e.dataId).complexTensors.imag.clone()},t.prototype.slice=function(e,n,a){if(W(e,"slice"),ru(e.shape,n,a)){var i=nu(n,e.strides),o=re(a);return ut(this.readSync(e.dataId).subarray(i,i+o),a,e.dtype)}for(var s=le(a,e.dtype),u=this.bufferSync(e),c=0;c<s.size;++c){var l=s.indexToLoc(c).map((function(f,h){return f+n[h]}));s.values[c]=u.get.apply(u,l)}return s.toTensor()},t.prototype.stridedSlice=function(e,n,a,i){W(e,"stridedSlice");var o=lo(n,a,i);if(o.some((function(d){return d===0})))return ut([],o);for(var s=le(o,e.dtype),u=this.bufferSync(e),c=0;c<s.size;c++){for(var l=s.indexToLoc(c),f=new Array(l.length),h=0;h<f.length;h++)f[h]=l[h]*i[h]+n[h];s.set.apply(s,[u.get.apply(u,f)].concat(l))}return s.toTensor()},t.prototype.diag=function(e){for(var n=this.readSync(e.dataId),a=le([e.size,e.size],e.dtype),i=a.values,o=0;o<n.length;o++)i[o*e.size+o]=n[o];return a.toTensor()},t.prototype.unstack=function(e,n){for(var a=e.shape[n],i=new Array(e.rank-1),o=0,s=0;s<e.rank;s++)s!==n&&(i[o++]=e.shape[s]);var u=new Array(e.rank).fill(0),c=e.shape.slice();c[n]=1;var l=new Array(a);for(s=0;s<l.length;s++)u[n]=s,l[s]=this.slice(e,u,c).reshape(i);return l},t.prototype.reverse=function(e,n){W(e,"reverse");for(var a=le(e.shape,e.dtype),i=this.bufferSync(e),o=function(u){var c=a.indexToLoc(u),l=c.slice();n.forEach((function(f){return l[f]=e.shape[f]-1-l[f]})),a.set.apply(a,[i.get.apply(i,l)].concat(c))},s=0;s<a.size;s++)o(s);return a.toTensor()},t.prototype.concat=function(e,n){var a=this;if(e[0].dtype==="complex64"){var i=e.map((function(d){return Jt(d)})),o=e.map((function(d){return gr(d)}));return pt(this.concat(i,n),this.concat(o,n))}var s=e.map((function(d){var p=re(d.shape.slice(n));return d.as2D(-1,p)})),u=gn(s.map((function(d){return d.shape})),1),c=le(u,e[0].dtype).values;if(s[0].shape[0]===1){var l=0;s.forEach((function(d){c.set(a.readSync(d.dataId),l),l+=d.size}))}else{var f=0;s.forEach((function(d){for(var p=a.readSync(d.dataId),v=0,m=0;m<d.shape[0];++m)for(var g=m*u[1]+f,x=0;x<d.shape[1];++x)c[g+x]=p[v++];f+=d.shape[1]}))}var h=gn(e.map((function(d){return d.shape})),n);return ut(c,h,e[0].dtype)},t.prototype.neg=function(e){return W(e,"neg"),this.multiply(Y(-1),e)},t.prototype.add=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),(function(a,i,o,s){return{real:a+o,imag:i+s}})):this.broadcastedBinaryOp(e,n,st(e.dtype,n.dtype),(function(a,i){return a+i}))},t.prototype.addN=function(e){var n=this;W(e,"addN");for(var a=e.map((function(l){return n.readSync(l.dataId)})),i=le(e[0].shape,e[0].dtype),o=i.values,s=0;s<e.length;s++)for(var u=a[s],c=0;c<o.length;c++)o[c]+=u[c];return i.toTensor()},t.prototype.softmax=function(e,n){var a=et([n],e.shape),i=this.max(e,a),o=Rt(i.shape,a),s=this.subtract(e,i.reshape(o)),u=this.exp(s),c=this.sum(u,a).reshape(o);return this.realDivide(u,c)},t.prototype.subtract=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),(function(a,i,o,s){return{real:a-o,imag:i-s}})):this.broadcastedBinaryOp(e,n,st(e.dtype,n.dtype),(function(a,i){return a-i}))},t.prototype.pow=function(e,n){return W([e,n],"pow"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){return Math.pow(a,i)}))},t.prototype.batchMatMul=function(e,n,a,i){W([e,n],"matMul");for(var o=a?e.shape[1]:e.shape[2],s=a?e.shape[2]:e.shape[1],u=i?n.shape[1]:n.shape[2],c=e.shape[0],l=this.readSync(e.dataId),f=this.readSync(n.dataId),h=a?[e.strides[0],1,e.strides[1]]:[e.strides[0],e.strides[1],1],d=h[0],p=h[1],v=h[2],m=i?[1,n.strides[1],n.strides[0]]:[n.strides[1],1,n.strides[0]],g=m[0],x=m[1],w=m[2],y=s*u,b=le([c,s,u],e.dtype),A=b.values,I=this.blockSize,T=0;T<c;T++)for(var S=0;S<s;S+=I)for(var D=0;D<u;D+=I)for(var _=0;_<o;_+=I)for(var M=Math.min(S+I,s),L=Math.min(D+I,u),O=Math.min(_+I,o),N=S;N<M;N++)for(var H=D;H<L;H++){for(var G=0,U=_;U<O;U++)G+=l[T*d+N*p+U*v]*f[U*g+H*x+T*w];A[T*y+(N*u+H)]+=G}return b.toTensor()},t.prototype.fusedBatchMatMul=function(e){var n=e.a,a=e.b,i=e.transposeA,o=e.transposeB,s=e.bias,u=e.activation,c=e.preluActivationWeights,l=this.batchMatMul(n,a,i,o);return s&&(l=this.add(l,s)),u&&(l=ds(this,l,u,c)),l},t.prototype.multiply=function(e,n){return e.dtype==="complex64"||n.dtype==="complex64"?this.broadcastedBinaryComplexOp(e.cast("complex64"),n.cast("complex64"),(function(a,i,o,s){return{real:a*o-i*s,imag:a*s+i*o}})):this.broadcastedBinaryOp(e,n,st(e.dtype,n.dtype),(function(a,i){return a*i}))},t.prototype.realDivide=function(e,n){return W([e,n],"realDivide"),this.broadcastedBinaryOp(e,n,"float32",(function(a,i){return a/i}))},t.prototype.floorDiv=function(e,n){return W([e,n],"floorDiv"),this.broadcastedBinaryOp(e,n,"int32",(function(a,i){return Math.floor(a/i)}))},t.prototype.sum=function(e,n){W(e,"sum"),kt("sum",n,e.rank);for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,st(e.dtype,"int32")),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=0,p=0;p<u;++p)d+=l[h+p];c[f]=d}return s},t.prototype.prod=function(e,n){W(e,"sum");for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,st(e.dtype,"int32")),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=1,p=0;p<u;++p)d*=l[h+p];c[f]=d}return s},t.prototype.unsortedSegmentSum=function(e,n,a){W(e,"unsortedSegmentSum");for(var i=[],o=e.rank-n.rank,s=0;s<o;++s)n=n.expandDims(s+1);for(s=0;s<a;++s){var u=Y(s,"int32"),c=ah(u,n).asType("float32").mul(e).sum(0);i.push(c)}return gt(i)},t.prototype.argMin=function(e,n){W(e,"argMin");var a=[n];kt("argMin",a,e.rank);for(var i=vt(e.shape,a),o=i[0],s=i[1],u=Ne(o,"int32"),c=re(s),l=this.readSync(u.dataId),f=this.readSync(e.dataId),h=0;h<l.length;++h){for(var d=h*c,p=f[d],v=0,m=0;m<c;++m){var g=f[d+m];g<p&&(p=g,v=m)}l[h]=v}return u},t.prototype.argMax=function(e,n){W(e,"argMax");var a=[n];kt("argMax",a,e.rank);for(var i=vt(e.shape,a),o=i[0],s=i[1],u=Ne(o,"int32"),c=re(s),l=this.readSync(u.dataId),f=this.readSync(e.dataId),h=0;h<l.length;++h){for(var d=h*c,p=f[d],v=0,m=0;m<c;++m){var g=f[d+m];g>p&&(p=g,v=m)}l[h]=v}return u},t.prototype.cumsum=function(e,n,a,i){if(W(e,"cumsum"),n!==e.rank-1)throw new Error("backend.cumsum in CPU expects an inner-most axis="+(e.rank-1)+" but got axis="+n);for(var o=st(e.dtype,"int32"),s=Ne(e.shape,o),u=this.readSync(s.dataId),c=this.readSync(e.dataId),l=e.shape[e.rank-1],f=i?function(m,g){return m+l-g-1}:function(m,g){return m+g},h=0;h<c.length;h+=l)for(var d=0;d<l;d++){var p=f(h,d);if(d===0)u[p]=a?0:c[p];else{var v=f(h,d-1);u[p]=a?c[v]+u[v]:c[p]+u[v]}}return s},t.prototype.equal=function(e,n){return W([e,n],"equal"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a===i?1:0}))},t.prototype.notEqual=function(e,n){return W([e,n],"notEqual"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a!==i?1:0}))},t.prototype.less=function(e,n){return W([e,n],"less"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a<i?1:0}))},t.prototype.lessEqual=function(e,n){return W([e,n],"lessEqual"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a<=i?1:0}))},t.prototype.greater=function(e,n){return W([e,n],"greater"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a>i?1:0}))},t.prototype.greaterEqual=function(e,n){return W([e,n],"greaterEqual"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a>=i?1:0}))},t.prototype.logicalNot=function(e){W(e,"logicalNot");for(var n=this.readSync(e.dataId),a=new Uint8Array(n.length),i=0;i<n.length;++i)a[i]=n[i]?0:1;return this.makeOutput(a,e.shape,"bool")},t.prototype.logicalAnd=function(e,n){return W([e,n],"logicalAnd"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a&&i}))},t.prototype.logicalOr=function(e,n){return W([e,n],"logicalOr"),this.broadcastedBinaryOp(e,n,"bool",(function(a,i){return a||i}))},t.prototype.select=function(e,n,a){W([e,n,a],"select");for(var i=this.readSync(e.dataId),o=this.readSync(n.dataId),s=this.readSync(a.dataId),u=Ne(n.shape,st(n.dtype,a.dtype)),c=this.readSync(u.dataId),l=0,f=e.rank===0||e.rank>1||n.rank===1?1:re(n.shape.slice(1)),h=0;h<i.length;h++)for(var d=0;d<f;d++)i[h]===1?c[l++]=o[h]:c[l++]=s[h];return u},t.prototype.where=function(e){W([e],"where");var n=this.readSync(e.dataId);return cu(e.shape,n)},t.prototype.topk=function(e,n,a){return W(e,"topk"),yf(this.readSync(e.dataId),e.shape,e.dtype,n)},t.prototype.min=function(e,n){W(e,"min"),kt("min",n,e.rank);for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,e.dtype),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=l[h],p=0;p<u;++p){var v=l[h+p];v<d&&(d=v)}c[f]=d}return s},t.prototype.minimum=function(e,n){return W([e,n],"minimum"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){return Math.min(a,i)}))},t.prototype.mod=function(e,n){return W([e,n],"mod"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){var o=a%i;return a<0&&i<0||a>=0&&i>=0?o:(o+i)%i}))},t.prototype.max=function(e,n){W(e,"max"),kt("max",n,e.rank);for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,e.dtype),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=l[h],p=0;p<u;++p){var v=l[h+p];v>d&&(d=v)}c[f]=d}return s},t.prototype.maximum=function(e,n){return W([e,n],"maximum"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){return Math.max(a,i)}))},t.prototype.all=function(e,n){W(e,"all"),kt("all",n,e.rank);for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,e.dtype),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=l[h],p=0;p<u;++p){var v=l[h+p];d=d&&v}c[f]=d}return s},t.prototype.any=function(e,n){W(e,"any"),kt("any",n,e.rank);for(var a=vt(e.shape,n),i=a[0],o=a[1],s=Ne(i,e.dtype),u=re(o),c=this.readSync(s.dataId),l=this.readSync(e.dataId),f=0;f<c.length;++f){for(var h=f*u,d=l[h],p=0;p<u;++p){var v=l[h+p];d=d||v}c[f]=d}return s},t.prototype.squaredDifference=function(e,n){return W([e,n],"squaredDifference"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){var o=a-i;return o*o}))},t.prototype.ceil=function(e){W(e,"ceil");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)a[i]=Math.ceil(n[i]);return this.makeOutput(a,e.shape,"float32")},t.prototype.floor=function(e){W(e,"floor");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)a[i]=Math.floor(n[i]);return this.makeOutput(a,e.shape,"float32")},t.prototype.sign=function(e){W(e,"x");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)n[i]<0?a[i]=-1:n[i]>0?a[i]=1:a[i]=0;return this.makeOutput(a,e.shape,"float32")},t.prototype.isNaN=function(e){W(e,"x");for(var n=this.readSync(e.dataId),a=new Uint8Array(n.length),i=0;i<n.length;++i)Number.isNaN(n[i])&&(a[i]=1);return this.makeOutput(a,e.shape,"bool")},t.prototype.isInf=function(e){W(e,"x");for(var n=this.readSync(e.dataId),a=new Uint8Array(n.length),i=0;i<n.length;++i)Math.abs(n[i])===1/0&&(a[i]=1);return this.makeOutput(a,e.shape,"bool")},t.prototype.isFinite=function(e){W(e,"x");for(var n=this.readSync(e.dataId),a=new Uint8Array(n.length),i=0;i<n.length;++i)Number.isFinite(n[i])&&(a[i]=1);return this.makeOutput(a,e.shape,"bool")},t.prototype.round=function(e){W(e,"round");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i){var o=Math.floor(n[i]);n[i]-o<.5?a[i]=Math.floor(n[i]):n[i]-o>.5?a[i]=Math.ceil(n[i]):a[i]=o%2==0?o:o+1}return this.makeOutput(a,e.shape,"float32")},t.prototype.exp=function(e){W(e,"exp");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)a[i]=Math.exp(n[i]);return this.makeOutput(a,e.shape,"float32")},t.prototype.expm1=function(e){W(e,"expm1");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)a[i]=Math.expm1(n[i]);return this.makeOutput(a,e.shape,"float32")},t.prototype.log=function(e){W(e,"log");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i){var o=n[i];a[i]=Math.log(o)}return this.makeOutput(a,e.shape,"float32")},t.prototype.log1p=function(e){W(e,"log1p");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i){var o=n[i];a[i]=Math.log1p(o)}return this.makeOutput(a,e.shape,"float32")},t.prototype.sqrt=function(e){W(e,"sqrt");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i){var o=n[i];a[i]=Math.sqrt(o)}return this.makeOutput(a,e.shape,"float32")},t.prototype.rsqrt=function(e){W(e,"rsqrt");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i){var o=n[i];a[i]=1/Math.sqrt(o)}return this.makeOutput(a,e.shape,"float32")},t.prototype.reciprocal=function(e){W(e,"reciprocal");for(var n=this.readSync(e.dataId),a=new Float32Array(n.length),i=0;i<n.length;++i)a[i]=1/n[i];return this.makeOutput(a,e.shape,"float32")},t.prototype.linear=function(e){return e},t.prototype.relu=function(e){W(e,"relu");for(var n=Ne(e.shape,e.dtype),a=this.readSync(n.dataId),i=this.readSync(e.dataId),o=0;o<i.length;++o)a[o]=Math.max(0,i[o]);return n},t.prototype.relu6=function(e){W(e,"relu");for(var n=Ne(e.shape,e.dtype),a=this.readSync(n.dataId),i=this.readSync(e.dataId),o=0;o<i.length;++o)a[o]=Math.min(Math.max(0,i[o]),6);return n},t.prototype.prelu=function(e,n){return W([e,n],"prelu"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){return a<0?i*a:a}))},t.prototype.elu=function(e){W(e,"elu");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i){var o=a[i];n[i]=o>=0?o:Math.exp(o)-1}return this.makeOutput(n,e.shape,"float32")},t.prototype.eluDer=function(e,n){W([e,n],"eluDer");for(var a=new Float32Array(n.size),i=this.readSync(n.dataId),o=this.readSync(e.dataId),s=0;s<i.length;++s){var u=i[s];a[s]=u>=1?o[s]:o[s]*(u+1)}return this.makeOutput(a,n.shape,"float32")},t.prototype.selu=function(e){W(e,"selu");for(var n=fu,a=hu,i=new Float32Array(e.size),o=this.readSync(e.dataId),s=0;s<o.length;++s){var u=o[s];i[s]=u>=0?a*u:n*(Math.exp(u)-1)}return this.makeOutput(i,e.shape,"float32")},t.prototype.clip=function(e,n,a){W(e,"clip");for(var i=new Float32Array(e.size),o=this.readSync(e.dataId),s=0;s<o.length;++s){var u=o[s];i[s]=u>a?a:u<n?n:u}return this.makeOutput(i,e.shape,"float32")},t.prototype.abs=function(e){for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.abs(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.complexAbs=function(e){for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<e.size;++i){var o=a[2*i],s=a[2*i+1];n[i]=Math.hypot(o,s)}return this.makeOutput(n,e.shape,"float32")},t.prototype.int=function(e){W(e,"int");for(var n=new Int32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=a[i];return this.makeOutput(n,e.shape,"int32")},t.prototype.sigmoid=function(e){W(e,"sigmoid");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=1/(1+Math.exp(-a[i]));return this.makeOutput(n,e.shape,"float32")},t.prototype.softplus=function(e){W(e,"softplus");for(var n=Math.log(11920928955078125e-23)+2,a=new Float32Array(e.size),i=this.readSync(e.dataId),o=0;o<i.length;++o){var s=i[o]>-n,u=i[o]<n,c=Math.exp(i[o]),l=void 0;l=u?c:s?i[o]:Math.log(1+c),a[o]=l}return this.makeOutput(a,e.shape,"float32")},t.prototype.sin=function(e){W(e,"sin");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.sin(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.cos=function(e){W(e,"cos");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.cos(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.tan=function(e){W(e,"tan");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.tan(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.asin=function(e){W(e,"asin");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.asin(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.acos=function(e){W(e,"acos");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.acos(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atan=function(e){W(e,"atan");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.atan(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atan2=function(e,n){return W([e,n],"atan2"),this.broadcastedBinaryOp(e,n,e.dtype,(function(a,i){return Math.atan2(a,i)}))},t.prototype.sinh=function(e){W(e,"sinh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.sinh(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.cosh=function(e){W(e,"cosh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.cosh(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.tanh=function(e){W(e,"tanh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=hl(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.asinh=function(e){W(e,"asinh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.asinh(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.acosh=function(e){W(e,"acosh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.acosh(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.atanh=function(e){W(e,"atanh");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i)n[i]=Math.atanh(a[i]);return this.makeOutput(n,e.shape,"float32")},t.prototype.erf=function(e){W(e,"erf");for(var n=new Float32Array(e.size),a=this.readSync(e.dataId),i=0;i<a.length;++i){var o=Math.sign(a[i]),s=Math.abs(a[i]),u=1/(1+.3275911*s);n[i]=o*(1-((((1.061405429*u-1.453152027)*u+1.421413741)*u-.284496736)*u+.254829592)*u*Math.exp(-s*s))}return this.makeOutput(n,e.shape,"float32")},t.prototype.step=function(e,n){n===void 0&&(n=0),W(e,"step");for(var a=new Float32Array(e.size),i=this.readSync(e.dataId),o=0;o<i.length;++o){var s=i[o];isNaN(s)?a[o]=NaN:a[o]=s>0?1:n}return this.makeOutput(a,e.shape,"float32")},t.prototype.fusedConv2d=function(e){var n=e.input,a=e.filter,i=e.convInfo,o=e.bias,s=e.activation,u=e.preluActivationWeights,c=this.conv2d(n,a,i);return o&&(c=this.add(c,o)),s&&(c=ds(this,c,s,u)),c},t.prototype.conv2d=function(e,n,a){W([e,n],"conv2d");for(var i=a.filterHeight,o=a.filterWidth,s=a.dilationHeight,u=a.dilationWidth,c=a.padInfo.left,l=a.padInfo.top,f=a.dataFormat==="channelsLast",h=le(a.outShape,e.dtype),d=e.strides[0],p=f?e.strides[1]:e.strides[2],v=f?e.strides[2]:1,m=f?1:e.strides[1],g=h.strides[0],x=f?h.strides[1]:h.strides[2],w=f?h.strides[2]:1,y=f?1:h.strides[1],b=this.readSync(e.dataId),A=this.readSync(n.dataId),I=h.values,T=0;T<a.batchSize;++T)for(var S=T*d,D=T*g,_=0;_<a.outHeight;++_)for(var M=D+_*x,L=_*a.strideHeight-l,O=0;O<i;O++){var N=L+O*s;if(!(N<0||N>=a.inHeight))for(var H=O*n.strides[0],G=S+N*p,U=0;U<a.outWidth;++U)for(var z=M+U*w,X=U*a.strideWidth-c,q=0;q<o;q++){var Z=X+q*u;if(!(Z<0||Z>=a.inWidth))for(var ne=G+Z*v,ue=H+q*n.strides[1],ce=0;ce<a.inChannels;++ce){for(var fe=b[ne+ce*m],ve=0;ve<a.outChannels;++ve)I[z+ve*y]+=fe*A[ue+ve];ue+=a.outChannels}}}return h.toTensor()},t.prototype.conv3d=function(e,n,a){for(var i=a.filterDepth,o=a.filterHeight,s=a.filterWidth,u=a.dilationDepth,c=a.dilationHeight,l=a.dilationWidth,f=a.padInfo.front,h=a.padInfo.left,d=a.padInfo.top,p=le(a.outShape,e.dtype),v=this.readSync(e.dataId),m=this.readSync(n.dataId),g=p.values,x=0;x<a.batchSize;++x)for(var w=x*e.strides[0],y=x*p.strides[0],b=0;b<a.outDepth;++b)for(var A=y+b*p.strides[1],I=b*a.strideDepth-f,T=0;T<i;T++){var S=I+T*u;if(!(S<0||S>=a.inDepth))for(var D=T*n.strides[0],_=w+S*e.strides[1],M=0;M<a.outHeight;++M)for(var L=A+M*p.strides[2],O=M*a.strideHeight-d,N=0;N<o;N++){var H=O+N*c;if(!(H<0||H>=a.inHeight))for(var G=D+N*n.strides[1],U=_+H*e.strides[2],z=0;z<a.outWidth;++z)for(var X=L+z*a.outChannels,q=z*a.strideWidth-h,Z=0;Z<s;Z++){var ne=q+Z*l;if(!(ne<0||ne>=a.inWidth))for(var ue=G+Z*n.strides[2],ce=U+ne*a.inChannels,fe=ue,ve=0;ve<a.inChannels;++ve){for(var ye=v[ce+ve],ge=0;ge<a.outChannels;++ge)g[X+ge]+=ye*m[fe+ge];fe+=a.outChannels}}}}return p.toTensor()},t.prototype.conv2dDerInput=function(e,n,a){W([e,n],"conv2dDerInput");for(var i=le(a.inShape,"float32"),o=i.values,s=this.readSync(e.dataId),u=this.readSync(n.dataId),c=n.strides,l=c[0],f=c[1],h=c[2],d=a.batchSize,p=a.filterHeight,v=a.filterWidth,m=a.inChannels,g=a.inHeight,x=a.inWidth,w=a.outChannels,y=a.outHeight,b=a.outWidth,A=a.strideHeight,I=a.strideWidth,T=a.dataFormat,S=p-1-a.padInfo.top,D=v-1-a.padInfo.left,_=T==="channelsLast",M=i.strides[0],L=_?i.strides[1]:i.strides[2],O=_?i.strides[2]:1,N=_?1:i.strides[1],H=e.strides[0],G=_?e.strides[1]:e.strides[2],U=_?e.strides[2]:1,z=_?1:e.strides[1],X=0;X<d;++X)for(var q=0;q<m;++q)for(var Z=0;Z<g;++Z)for(var ne=Z-S,ue=Math.max(0,Math.ceil(ne/A)),ce=Math.min(y,(p+ne)/A),fe=0;fe<x;++fe){for(var ve=fe-D,ye=Math.max(0,Math.ceil(ve/I)),ge=Math.min(b,(v+ve)/I),He=0,me=ue;me<ce;++me)for(var Se=me*A-ne,we=ye;we<ge;++we)for(var Le=H*X+G*me+U*we,Ue=l*(p-1-Se)+f*(v-1-(we*I-ve))+h*q,ke=0;ke<w;++ke)He+=s[Le+z*ke]*u[Ue+ke];o[M*X+L*Z+O*fe+N*q]=He}return i.toTensor()},t.prototype.conv3dDerInput=function(e,n,a){for(var i=le(a.inShape,"float32"),o=i.values,s=i.strides,u=s[0],c=s[1],l=s[2],f=s[3],h=this.readSync(e.dataId),d=e.strides,p=d[0],v=d[1],m=d[2],g=d[3],x=this.readSync(n.dataId),w=n.strides,y=w[0],b=w[1],A=w[2],I=w[3],T=a.batchSize,S=a.filterDepth,D=a.filterHeight,_=a.filterWidth,M=a.inChannels,L=a.inDepth,O=a.inHeight,N=a.inWidth,H=a.outChannels,G=a.outDepth,U=a.outHeight,z=a.outWidth,X=a.strideDepth,q=a.strideHeight,Z=a.strideWidth,ne=S-1-a.padInfo.front,ue=D-1-a.padInfo.top,ce=_-1-a.padInfo.left,fe=0;fe<T;++fe)for(var ve=0;ve<M;++ve)for(var ye=0;ye<L;++ye)for(var ge=ye-ne,He=Math.max(0,Math.ceil(ge/X)),me=Math.min(G,(S+ge)/X),Se=0;Se<O;++Se)for(var we=Se-ue,Le=Math.max(0,Math.ceil(we/q)),Ue=Math.min(U,(D+we)/q),ke=0;ke<N;++ke){for(var Ut=ke-ce,Gt=Math.max(0,Math.ceil(Ut/Z)),wt=Math.min(z,(_+Ut)/Z),Ht=0,zt=He;zt<me;++zt)for(var nr=zt*X-ge,qt=Le;qt<Ue;++qt)for(var Sr=qt*q-we,Ft=Gt;Ft<wt;++Ft)for(var Wr=p*fe+v*zt+m*qt+g*Ft,Dr=y*(S-1-nr)+b*(D-1-Sr)+A*(_-1-(Ft*Z-Ut))+I*ve,oe=0;oe<H;++oe)Ht+=h[Wr+oe]*x[Dr+oe];o[u*fe+c*ye+l*Se+f*ke+ve]=Ht}return i.toTensor()},t.prototype.conv2dDerFilter=function(e,n,a){W([e,n],"conv2dDerFilter");for(var i=a.strideHeight,o=a.strideWidth,s=a.filterHeight,u=a.filterWidth,c=a.dataFormat==="channelsLast",l=le(a.filterShape,"float32"),f=a.padInfo.left,h=a.padInfo.top,d=this.bufferSync(e),p=this.bufferSync(n),v=0;v<s;++v)for(var m=Math.max(0,Math.ceil((h-v)/i)),g=Math.min(a.outHeight,(a.inHeight+h-v)/i),x=0;x<u;++x)for(var w=Math.max(0,Math.ceil((f-x)/o)),y=Math.min(a.outWidth,(a.inWidth+f-x)/o),b=0;b<a.inChannels;++b)for(var A=0;A<a.outChannels;++A){for(var I=0,T=0;T<a.batchSize;++T)for(var S=m;S<g;++S)for(var D=v+S*i-h,_=w;_<y;++_){var M=x+_*o-f;I+=c?d.get(T,D,M,b)*p.get(T,S,_,A):d.get(T,b,D,M)*p.get(T,A,S,_)}l.set(I,v,x,b,A)}return l.toTensor()},t.prototype.conv3dDerFilter=function(e,n,a){for(var i=a.strideDepth,o=a.strideHeight,s=a.strideWidth,u=a.filterDepth,c=a.filterHeight,l=a.filterWidth,f=le(a.filterShape,"float32"),h=f.values,d=f.strides,p=d[0],v=d[1],m=d[2],g=d[3],x=this.readSync(n.dataId),w=n.strides,y=w[0],b=w[1],A=w[2],I=w[3],T=this.readSync(e.dataId),S=e.strides,D=S[0],_=S[1],M=S[2],L=S[3],O=a.padInfo.front,N=a.padInfo.left,H=a.padInfo.top,G=0;G<u;++G)for(var U=Math.max(0,Math.ceil((O-G)/i)),z=Math.min(a.outDepth,(a.inDepth+O-G)/i),X=G*p,q=0;q<c;++q)for(var Z=Math.max(0,Math.ceil((H-q)/o)),ne=Math.min(a.outHeight,(a.inHeight+H-q)/o),ue=q*v+X,ce=0;ce<l;++ce)for(var fe=Math.max(0,Math.ceil((N-ce)/s)),ve=Math.min(a.outWidth,(a.inWidth+N-ce)/s),ye=ce*m+ue,ge=0;ge<a.inChannels;++ge)for(var He=ge*g+ye,me=0;me<a.outChannels;++me){for(var Se=0,we=0;we<a.batchSize;++we)for(var Le=we*D,Ue=we*y,ke=U;ke<z;++ke)for(var Ut=(G+ke*i-O)*_+Le,Gt=ke*b+Ue,wt=Z;wt<ne;++wt)for(var Ht=(q+wt*o-H)*M+Ut,zt=wt*A+Gt,nr=fe;nr<ve;++nr){var qt=nr*I+zt;Se+=T[(ce+nr*s-N)*L+Ht+ge]*x[qt+me]}h[He+me]=Se}return f.toTensor()},t.prototype.fusedDepthwiseConv2D=function(e){var n=e.input,a=e.filter,i=e.convInfo,o=e.bias,s=e.activation,u=e.preluActivationWeights,c=this.depthwiseConv2D(n,a,i);return o&&(c=this.add(c,o)),s&&(c=ds(this,c,s,u)),c},t.prototype.depthwiseConv2D=function(e,n,a){W([e,n],"depthwiseConv2D");for(var i=a.filterHeight,o=a.filterWidth,s=a.dilationHeight,u=a.dilationWidth,c=a.padInfo.left,l=a.padInfo.top,f=a.outChannels/a.inChannels,h=le(a.outShape,e.dtype),d=this.readSync(e.dataId),p=this.readSync(n.dataId),v=h.values,m=0;m<a.batchSize;++m)for(var g=m*e.strides[0],x=m*h.strides[0],w=0;w<a.outHeight;++w)for(var y=x+w*h.strides[1],b=w*a.strideHeight-c,A=0;A<i;++A){var I=b+A*s;if(!(I<0||I>=a.inHeight))for(var T=A*n.strides[0],S=g+I*e.strides[1],D=0;D<a.outWidth;++D)for(var _=y+D*h.strides[2],M=D*a.strideWidth-l,L=0;L<o;++L){var O=M+L*u;if(!(O<0||O>=a.inWidth))for(var N=T+L*n.strides[1],H=S+O*a.inChannels,G=_,U=N,z=0;z<a.inChannels;++z){for(var X=d[H+z],q=0;q<f;++q)v[G+q]+=X*p[U+q];G+=f,U+=f}}}return h.toTensor()},t.prototype.depthwiseConv2DDerInput=function(e,n,a){W([e,n],"depthwiseConv2DDerInput");for(var i=le(a.inShape,"float32"),o=i.values,s=i.strides,u=s[0],c=s[1],l=s[2],f=this.readSync(e.dataId),h=e.strides,d=h[0],p=h[1],v=h[2],m=this.readSync(n.dataId),g=n.strides,x=g[0],w=g[1],y=g[2],b=a.batchSize,A=a.filterHeight,I=a.filterWidth,T=a.inChannels,S=a.inHeight,D=a.inWidth,_=a.outChannels,M=a.outHeight,L=a.outWidth,O=a.strideHeight,N=a.strideWidth,H=A-1-a.padInfo.top,G=I-1-a.padInfo.left,U=_/T,z=0;z<b;++z)for(var X=0;X<T;++X)for(var q=0;q<S;++q)for(var Z=q-H,ne=Math.max(0,Math.ceil(Z/O)),ue=Math.min(M,(A+Z)/O),ce=0;ce<D;++ce){for(var fe=ce-G,ve=Math.max(0,Math.ceil(fe/N)),ye=Math.min(L,(I+fe)/N),ge=0,He=ne;He<ue;++He)for(var me=He*O-Z,Se=ve;Se<ye;++Se)for(var we=d*z+p*He+v*Se,Le=x*(A-1-me)+w*(I-1-(Se*N-fe))+y*X,Ue=0;Ue<U;++Ue)ge+=f[we+(X*U+Ue)]*m[Le+Ue];o[u*z+c*q+l*ce+X]=ge}return i.toTensor()},t.prototype.depthwiseConv2DDerFilter=function(e,n,a){W([e,n],"depthwiseConv2DDerFilter");for(var i=a.strideHeight,o=a.strideWidth,s=a.filterHeight,u=a.filterWidth,c=le(a.filterShape,"float32"),l=a.padInfo.left,f=a.padInfo.top,h=a.outChannels/a.inChannels,d=this.bufferSync(e),p=this.bufferSync(n),v=0;v<s;++v)for(var m=Math.max(0,Math.ceil((f-v)/i)),g=Math.min(a.outHeight,(a.inHeight+f-v)/i),x=0;x<u;++x)for(var w=Math.max(0,Math.ceil((l-x)/o)),y=Math.min(a.outWidth,(a.inWidth+l-x)/o),b=0;b<a.outChannels;++b){for(var A=Math.trunc(b/h),I=b%h,T=0,S=0;S<a.batchSize;++S)for(var D=m;D<g;++D)for(var _=v+D*i-f,M=w;M<y;++M){var L=x+M*o-l;T+=d.get(S,_,L,A)*p.get(S,D,M,b)}c.set(T,v,x,A,I)}return c.toTensor()},t.prototype.tile=function(e,n){return W(e,"tile"),xf(this.bufferSync(e),n)},t.prototype.pad=function(e,n,a){W(e,"pad");var i=n.map((function(h,d){return h[0]+e.shape[d]+h[1]})),o=n.map((function(h){return h[0]})),s=this.bufferSync(e),u=le(i,e.dtype);a!==0&&u.values.fill(a);for(var c=0;c<e.size;c++){var l=s.indexToLoc(c),f=l.map((function(h,d){return h+o[d]}));u.set.apply(u,[s.get.apply(s,l)].concat(f))}return u.toTensor()},t.prototype.transpose=function(e,n){W(e,"transpose");for(var a=new Array(e.rank),i=0;i<a.length;i++)a[i]=e.shape[n[i]];var o=this.readSync(e.dataId),s=le(a,e.dtype),u=this.bufferSync(e);for(i=0;i<e.size;++i){for(var c=u.indexToLoc(i),l=new Array(c.length),f=0;f<l.length;f++)l[f]=c[n[f]];var h=s.locToIndex(l);s.values[h]=o[i]}return s.toTensor()},t.prototype.gather=function(e,n,a){W([e,n],"gather");var i=e.shape.slice(),o=this.readSync(n.dataId);i[a]=o.length;for(var s=le(i,e.dtype),u=this.bufferSync(e),c=0;c<s.size;++c){var l=s.indexToLoc(c),f=l.slice();f[a]=o[l[a]];var h=u.locToIndex(f);s.values[c]=u.values[h]}return s.toTensor()},t.prototype.batchToSpaceND=function(e,n,a){W([e],"batchToSpaceND");var i=n.reduce((function(f,h){return f*h})),o=Ji(e.shape,n,i),s=$i(o.length,n.length),u=eo(e.shape,n,i),c=sf(a,n.length),l=uf(u,a,n.length);return e.reshape(o).transpose(s).reshape(u).slice(c,l)},t.prototype.spaceToBatchND=function(e,n,a){W([e],"spaceToBatchND");var i=n.reduce((function(h,d){return h*d})),o=[[0,0]];o.push.apply(o,a);for(var s=1+n.length;s<e.shape.length;++s)o.push([0,0]);var u=e.pad(o),c=Ji(u.shape,n,i,!1),l=$i(c.length,n.length,!1),f=eo(u.shape,n,i,!1);return u.reshape(c).transpose(l).reshape(f)},t.prototype.pool=function(e,n,a){W(e,"pool");for(var i=n.strideHeight,o=n.strideWidth,s=n.dilationHeight,u=n.dilationWidth,c=n.effectiveFilterHeight,l=n.effectiveFilterWidth,f=n.padInfo.top,h=n.padInfo.left,d=a==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,p=this.readSync(e.dataId),v=le(n.outShape,e.dtype),m=v.values,g=n.outShape[1]*n.outShape[2]*n.outShape[3],x=n.outShape[2]*n.outShape[3],w=n.outShape[3],y=0;y<n.batchSize;++y)for(var b=y*g,A=y*e.strides[0],I=0;I<n.inChannels;++I)for(var T=0;T<n.outHeight;++T)for(var S=T*i-f,D=Math.max(0,S),_=Math.min(n.inHeight,c+S),M=b+T*x,L=0;L<n.outWidth;++L){for(var O=L*o-h,N=Math.max(0,O),H=Math.min(n.inWidth,l+O),G=d,U=0,z=0,X=D;X<_;X+=s){for(var q=A+X*e.strides[1],Z=N;Z<H;Z+=u){var ne=p[q+Z*e.strides[2]+I];a==="max"&&ne>G?G=ne:a==="avg"&&(U+=ne,z++)}if(isNaN(G))break}m[M+L*w+I]=a==="avg"?U/z:G}return v.toTensor()},t.prototype.maxPool=function(e,n){return this.pool(e,n,"max")},t.prototype.maxPoolPositions=function(e,n){for(var a=le(n.outShape,"int32"),i=n.strideHeight,o=n.strideWidth,s=n.dilationHeight,u=n.dilationWidth,c=n.effectiveFilterHeight,l=n.effectiveFilterWidth,f=n.padInfo.top,h=n.padInfo.left,d=this.bufferSync(e),p=0;p<n.batchSize;++p)for(var v=0;v<n.inChannels;++v)for(var m=0;m<n.outHeight;++m){for(var g=m*i-f,x=g;x<0;)x+=s;for(var w=Math.min(n.inHeight,c+g),y=0;y<n.outWidth;++y){for(var b=y*o-h,A=b;A<0;)A+=u;for(var I=Math.min(n.inWidth,l+b),T=Number.NEGATIVE_INFINITY,S=-1,D=x;D<w;D+=s)for(var _=D-g,M=A;M<I;M+=u){var L=M-b,O=d.get(p,D,M,v);O>T&&(T=O,S=_*l+L)}a.set(S,p,m,y,v)}}return a.toTensor()},t.prototype.maxPoolBackprop=function(e,n,a,i){W([n,a],"maxPoolBackprop");for(var o=this.maxPoolPositions(n,i),s=i.strideHeight,u=i.strideWidth,c=i.dilationHeight,l=i.dilationWidth,f=i.effectiveFilterHeight,h=i.effectiveFilterWidth,d=h-1-i.padInfo.left,p=f-1-i.padInfo.top,v=le(n.shape,"float32"),m=this.bufferSync(o),g=this.bufferSync(e),x=0;x<i.batchSize;++x)for(var w=0;w<i.inChannels;++w)for(var y=0;y<i.inHeight;++y)for(var b=0;b<i.inWidth;++b){for(var A=y-p,I=b-d,T=0,S=0;S<f;S+=c){var D=(A+S)/s;if(!(D<0||D>=i.outHeight||Math.floor(D)!==D))for(var _=0;_<h;_+=l){var M=(I+_)/u;if(!(M<0||M>=i.outWidth||Math.floor(M)!==M)){var L=f*h-1-m.get(x,D,M,w)===S*h+_?1:0;L!==0&&(T+=g.get(x,D,M,w)*L)}}}v.set(T,x,y,b,w)}return v.toTensor()},t.prototype.avgPoolBackprop=function(e,n,a){W([e,n],"avgPoolBackprop");for(var i=a.strideHeight,o=a.strideWidth,s=a.filterHeight,u=a.filterWidth,c=a.dilationHeight,l=a.dilationWidth,f=a.effectiveFilterHeight,h=a.effectiveFilterWidth,d=h-1-a.padInfo.left,p=f-1-a.padInfo.top,v=le(n.shape,"float32"),m=1/(s*u),g=this.bufferSync(e),x=0;x<a.batchSize;++x)for(var w=0;w<a.inChannels;++w)for(var y=0;y<a.inHeight;++y)for(var b=0;b<a.inWidth;++b){for(var A=y-p,I=b-d,T=0,S=0;S<f;S+=c){var D=(A+S)/i;if(!(D<0||D>=a.outHeight||Math.floor(D)!==D))for(var _=0;_<h;_+=l){var M=(I+_)/o;M<0||M>=a.outWidth||Math.floor(M)!==M||(T+=g.get(x,D,M,w))}}v.set(T*m,x,y,b,w)}return v.toTensor()},t.prototype.pool3d=function(e,n,a){W(e,"pool3d");for(var i=n.strideDepth,o=n.strideHeight,s=n.strideWidth,u=n.dilationDepth,c=n.dilationHeight,l=n.dilationWidth,f=n.effectiveFilterDepth,h=n.effectiveFilterHeight,d=n.effectiveFilterWidth,p=n.padInfo.front,v=n.padInfo.top,m=n.padInfo.left,g=a==="max"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,x=this.readSync(e.dataId),w=le(n.outShape,e.dtype),y=w.values,b=n.outShape[1]*n.outShape[2]*n.outShape[3]*n.outShape[4],A=n.outShape[2]*n.outShape[3]*n.outShape[4],I=n.outShape[3]*n.outShape[4],T=n.outShape[4],S=0;S<n.batchSize;++S)for(var D=S*b,_=S*e.strides[0],M=0;M<n.inChannels;++M)for(var L=0;L<n.outDepth;++L){for(var O=L*i-p,N=O;N<0;)N+=u;for(var H=Math.min(n.inDepth,f+O),G=D+L*A,U=0;U<n.outHeight;++U){for(var z=U*o-v,X=z;X<0;)X+=c;for(var q=Math.min(n.inHeight,h+z),Z=G+U*I,ne=0;ne<n.outWidth;++ne){for(var ue=ne*s-m,ce=ue;ce<0;)ce+=l;for(var fe=Math.min(n.inWidth,d+ue),ve=Z+ne*T,ye=g,ge=0,He=0,me=N;me<H;me+=u){for(var Se=_+me*e.strides[1],we=X;we<q;we+=c){for(var Le=Se+we*e.strides[2],Ue=ce;Ue<fe;Ue+=l){var ke=x[Le+Ue*e.strides[3]+M];if(a==="max"&&ke>ye?ye=ke:a==="avg"&&(ge+=ke,He++),isNaN(ye))break}if(isNaN(ye))break}if(isNaN(ye))break}y[ve+M]=a==="avg"?ge/He:ye}}}return w.toTensor()},t.prototype.avgPool3d=function(e,n){return W(e,"avgPool3d"),this.pool3d(e,n,"avg").toFloat()},t.prototype.avgPool3dBackprop=function(e,n,a){W([e,n],"avgPool3dBackprop");for(var i=a.strideDepth,o=a.strideHeight,s=a.strideWidth,u=a.filterDepth,c=a.filterHeight,l=a.filterWidth,f=a.dilationDepth,h=a.dilationHeight,d=a.dilationWidth,p=a.effectiveFilterDepth,v=a.effectiveFilterHeight,m=a.effectiveFilterWidth,g=p-1-a.padInfo.front,x=m-1-a.padInfo.left,w=v-1-a.padInfo.top,y=le(n.shape,"float32"),b=1/(u*c*l),A=this.bufferSync(e),I=0;I<a.batchSize;++I)for(var T=0;T<a.inChannels;++T)for(var S=0;S<a.inDepth;++S)for(var D=0;D<a.inHeight;++D)for(var _=0;_<a.inWidth;++_){for(var M=S-g,L=D-w,O=_-x,N=0,H=0;H<p;H+=f){var G=(M+H)/i;if(!(G<0||G>=a.outDepth||Math.floor(G)!==G))for(var U=0;U<v;U+=h){var z=(L+U)/o;if(!(z<0||z>=a.outHeight||Math.floor(z)!==z))for(var X=0;X<m;X+=d){var q=(O+X)/s;q<0||q>=a.outWidth||Math.floor(q)!==q||(N+=A.get(I,G,z,q,T))}}}y.set(N*b,I,S,D,_,T)}return y.toTensor()},t.prototype.maxPool3d=function(e,n){return W(e,"maxPool3d"),this.pool3d(e,n,"max").toFloat()},t.prototype.maxPool3dPositions=function(e,n){for(var a=le(n.outShape,"int32"),i=n.strideDepth,o=n.strideHeight,s=n.strideWidth,u=n.dilationDepth,c=n.dilationHeight,l=n.dilationWidth,f=n.effectiveFilterDepth,h=n.effectiveFilterHeight,d=n.effectiveFilterWidth,p=n.padInfo.front,v=n.padInfo.top,m=n.padInfo.left,g=this.bufferSync(e),x=0;x<n.batchSize;++x)for(var w=0;w<n.inChannels;++w)for(var y=0;y<n.outDepth;++y){for(var b=y*i-p,A=b;A<0;)A+=u;for(var I=Math.min(n.inDepth,f+b),T=0;T<n.outHeight;++T){for(var S=T*o-v,D=S;D<0;)D+=c;for(var _=Math.min(n.inHeight,h+S),M=0;M<n.outWidth;++M){for(var L=M*s-m,O=L;O<0;)O+=l;for(var N=Math.min(n.inWidth,d+L),H=Number.NEGATIVE_INFINITY,G=-1,U=A;U<I;U+=u)for(var z=U-b,X=D;X<_;X+=c)for(var q=X-S,Z=O;Z<N;Z+=l){var ne=Z-L,ue=g.get(x,U,X,Z,w);ue>=H&&(H=ue,G=z*h*d+q*h+ne)}a.set(G,x,y,T,M,w)}}}return a.toTensor()},t.prototype.maxPool3dBackprop=function(e,n,a,i){W([n,a],"maxPool3dBackprop");for(var o=this.maxPool3dPositions(n,i),s=i.strideDepth,u=i.strideHeight,c=i.strideWidth,l=i.dilationDepth,f=i.dilationHeight,h=i.dilationWidth,d=i.effectiveFilterDepth,p=i.effectiveFilterHeight,v=i.effectiveFilterWidth,m=d-1-i.padInfo.front,g=v-1-i.padInfo.left,x=p-1-i.padInfo.top,w=le(n.shape,"float32"),y=this.bufferSync(o),b=this.bufferSync(e),A=0;A<i.batchSize;++A)for(var I=0;I<i.inChannels;++I)for(var T=0;T<i.inDepth;++T)for(var S=0;S<i.inHeight;++S)for(var D=0;D<i.inWidth;++D){for(var _=T-m,M=S-x,L=D-g,O=0,N=0;N<d;N+=l){var H=(_+N)/s;if(!(H<0||H>=i.outDepth||Math.floor(H)!==H))for(var G=0;G<p;G+=f){var U=(M+G)/u;if(!(U<0||U>=i.outHeight||Math.floor(U)!==U))for(var z=0;z<v;z+=h){var X=(L+z)/c;if(!(X<0||X>=i.outWidth||Math.floor(X)!==X)){var q=d*p*v-1-y.get(A,H,U,X,I)===N*p*v+G*v+z?1:0;q!==0&&(O+=b.get(A,H,U,X,I)*q)}}}}w.set(O,A,T,S,D,I)}return w.toTensor()},t.prototype.cast=function(e,n){return iu(e,n,this)},t.prototype.reshape=function(e,n){return ro(e,n)},t.prototype.avgPool=function(e,n){return W(e,"avgPool"),this.pool(e,n,"avg").toFloat()},t.prototype.resizeBilinear=function(e,n,a,i){W(e,"resizeBilinear");for(var o=e.shape,s=o[0],u=o[1],c=o[2],l=o[3],f=this.readSync(e.dataId),h=new Float32Array(re([s,n,a,l])),d=[i&&n>1?u-1:u,i&&a>1?c-1:c],p=[i&&n>1?n-1:n,i&&a>1?a-1:a],v=0,m=d[0]/p[0],g=d[1]/p[1],x=0;x<s;x++)for(var w=0;w<n;w++)for(var y=m*w,b=Math.floor(y),A=y-b,I=Math.min(u-1,Math.ceil(y)),T=x*e.strides[0]+b*e.strides[1],S=x*e.strides[0]+I*e.strides[1],D=0;D<a;D++)for(var _=g*D,M=Math.floor(_),L=_-M,O=Math.min(c-1,Math.ceil(_)),N=T+M*e.strides[2],H=S+M*e.strides[2],G=T+O*e.strides[2],U=S+O*e.strides[2],z=0;z<l;z++){var X=f[N+z],q=f[H+z],Z=X+(f[G+z]-X)*L,ne=Z+(q+(f[U+z]-q)*L-Z)*A;h[v++]=ne}return ut(h,[s,n,a,l])},t.prototype.resizeBilinearBackprop=function(e,n,a){W([e,n],"resizeBilinearBackprop");for(var i=n.shape,o=i[0],s=i[1],u=i[2],c=i[3],l=e.shape,f=l[1],h=l[2],d=new Float32Array(o*s*u*c),p=[a&&f>1?s-1:s,a&&h>1?u-1:u],v=[a&&f>1?f-1:f,a&&h>1?h-1:h],m=p[0]/v[0],g=p[1]/v[1],x=this.readSync(e.dataId),w=0,y=0;y<o;y++)for(var b=y*n.strides[0],A=0;A<f;A++)for(var I=A*m,T=Math.floor(I),S=Math.min(Math.ceil(I),s-1),D=b+T*n.strides[1],_=b+S*n.strides[1],M=I-T,L=1-M,O=0;O<h;O++)for(var N=O*g,H=Math.floor(N),G=Math.min(Math.ceil(N),u-1),U=N-H,z=1-U,X=D+H*n.strides[2],q=D+G*n.strides[2],Z=_+H*n.strides[2],ne=_+G*n.strides[2],ue=L*z,ce=L*U,fe=M*z,ve=M*U,ye=0;ye<c;ye++){var ge=x[w++];d[X+ye]+=ge*ue,d[q+ye]+=ge*ce,d[Z+ye]+=ge*fe,d[ne+ye]+=ge*ve}return at(d,[o,u,s,c],n.dtype)},t.prototype.resizeNearestNeighbor=function(e,n,a,i){W(e,"resizeNearestNeighbor");for(var o=e.shape,s=o[0],u=o[1],c=o[2],l=o[3],f=this.readSync(e.dataId),h=new Float32Array(s*n*a*l),d=[i&&n>1?u-1:u,i&&a>1?c-1:c],p=[i&&n>1?n-1:n,i&&a>1?a-1:a],v=d[0]/p[0],m=d[1]/p[1],g=0,x=0;x<s;x++)for(var w=x*e.strides[0],y=0;y<n;y++)for(var b=v*y,A=w+Math.min(u-1,i?Math.round(b):Math.floor(b))*e.strides[1],I=0;I<a;I++)for(var T=m*I,S=A+Math.min(c-1,i?Math.round(T):Math.floor(T))*e.strides[2],D=0;D<l;D++){var _=f[S+D];h[g++]=_}return ut(h,[s,n,a,l],e.dtype)},t.prototype.resizeNearestNeighborBackprop=function(e,n,a){W([e,n],"resizeNearestNeighborBackprop");for(var i=n.shape,o=i[0],s=i[1],u=i[2],c=i[3],l=e.shape,f=l[1],h=l[2],d=new Float32Array(o*s*u*c),p=this.readSync(e.dataId),v=[a&&f>1?s-1:s,a&&h>1?u-1:u],m=[a&&f>1?f-1:f,a&&h>1?h-1:h],g=v[0]/m[0],x=v[1]/m[1],w=1/g,y=1/x,b=2*Math.ceil(w)+2,A=2*Math.ceil(y)+2,I=0;I<o;I++)for(var T=I*n.strides[0],S=0;S<s;S++)for(var D=T+S*n.strides[1],_=Math.floor(S*w),M=Math.floor(_-b/2),L=0;L<u;L++)for(var O=D+L*n.strides[2],N=Math.floor(L*y),H=Math.floor(N-A/2),G=0;G<c;G++){for(var U=0,z=0;z<b;z++){var X=z+M;if(!(X<0||X>=f)){var q=T+X*e.strides[1],Z=X*g;if(S===Math.min(s-1,a?Math.round(Z):Math.floor(Z)))for(var ne=0;ne<A;ne++){var ue=ne+H;if(!(ue<0||ue>=h)){var ce=q+ue*e.strides[2],fe=ue*x;L===Math.min(u-1,a?Math.round(fe):Math.floor(fe))&&(U+=p[ce+G])}}}}d[O+G]=U}return at(d,n.shape,n.dtype)},t.prototype.batchNormalization=function(e,n,a,i,o,s){W([e,n,a,o,s],"batchNorm");for(var u=this.readSync(e.dataId),c=this.readSync(n.dataId),l=this.readSync(a.dataId),f=o?this.readSync(o.dataId):new Float32Array([1]),h=s?this.readSync(s.dataId):new Float32Array([0]),d=new Float32Array(u.length),p=h.length,v=f.length,m=l.length,g=c.length,x=0,w=0,y=0,b=0,A=0;A<u.length;++A)d[A]=h[x++]+(u[A]-c[w++])*f[y++]/Math.sqrt(l[b++]+i),x>=p&&(x=0),w>=g&&(w=0),y>=v&&(y=0),b>=m&&(b=0);return at(d,e.shape)},t.prototype.localResponseNormalization4D=function(e,n,a,i,o){W(e,"localResponseNormalization4D");var s=e.shape[3],u=s-1,c=this.readSync(e.dataId),l=e.size,f=new Float32Array(l);function h(m){for(var g=m%s,x=m-g+Math.max(0,g-n),w=m-g+Math.min(g+n,u),y=0;x<=w;x++){var b=c[x];y+=b*b}return y}for(var d=0;d<l;d++){var p=h(d),v=c[d]*Math.pow(a+i*p,-o);f[d]=v}return at(f,e.shape)},t.prototype.LRNGrad=function(e,n,a,i,o,s,u){W(e,"LRNGrad");for(var c=e.shape[3],l=this.readSync(e.dataId),f=this.readSync(n.dataId),h=this.readSync(a.dataId),d=new Float32Array(e.size),p=e.size,v=0;v<p;v++){for(var m=v%c,g=v-m+Math.max(0,m-i),x=v-m+Math.min(c,m+i+1),w=0,y=g;y<x;y++)w+=Math.pow(f[y],2);for(w=s*w+o,y=g;y<x;y++){var b=-2*s*u*f[y]*h[v]/w;v===y&&(b+=Math.pow(w,-u)),b*=l[v],d[y]+=b}}return at(d,e.shape)},t.prototype.multinomial=function(e,n,a,i){W(e,"multinomial");for(var o=n?e:_t(e),s=o.shape[0],u=o.shape[1],c=Ne([s,a],"int32"),l=this.readSync(c.dataId),f=this.readSync(o.dataId),h=0;h<s;++h){var d=h*u,p=new Float32Array(u-1);p[0]=f[d];for(var v=1;v<p.length;++v)p[v]=p[v-1]+f[d+v];for(var m=co(i.toString()),g=h*a,x=0;x<a;++x){var w=m();l[g+x]=p.length;for(var y=0;y<p.length;y++)if(w<p[y]){l[g+x]=y;break}}}return c},t.prototype.oneHot=function(e,n,a,i){W(e,"oneHot");var o=new Float32Array(e.size*n);o.fill(i);for(var s=this.readSync(e.dataId),u=0;u<e.size;++u)s[u]>=0&&s[u]<n&&(o[u*n+s[u]]=a);return xr(o,[e.size,n],"int32")},t.prototype.nonMaxSuppression=function(e,n,a,i,o){return W(e,"nonMaxSuppression"),su(this.readSync(e.dataId),this.readSync(n.dataId),a,i,o)},t.prototype.fft=function(e){return this.fftBatch(e,!1)},t.prototype.ifft=function(e){return this.fftBatch(e,!0)},t.prototype.fftBatch=function(e,n){for(var a=e.shape[0],i=e.shape[1],o=le(e.shape,"float32"),s=le(e.shape,"float32"),u=Jt(e).as2D(a,i),c=gr(e).as2D(a,i),l=0;l<a;l++)for(var f=u.slice([l,0],[1,i]),h=c.slice([l,0],[1,i]),d=pt(f,h),p=this.readSync(this.fftImpl(d,n).dataId),v=0;v<i;v++){var m=Rc(p,v);o.values[l*i+v]=m.real,s.values[l*i+v]=m.imag}return pt(o.toTensor(),s.toTensor()).as2D(a,i)},t.prototype.fftImpl=function(e,n){var a=e.as1D(),i=a.size;if(this.isExponentOf2(i)){var o=this.fftRadix2(a,i,n).as2D(e.shape[0],e.shape[1]);return n&&(o=pt(Jt(o).div(Y(i)),gr(o).div(Y(i)))),o}var s=this.readSync(e.dataId),u=(function(c){for(var l=new Float32Array(c.length/2),f=new Float32Array(c.length/2),h=0;h<c.length;h+=2)l[h/2]=c[h],f[h/2]=c[h+1];return{real:l,imag:f}})(this.fourierTransformByMatmul(s,i,n));return pt(u.real,u.imag).as2D(e.shape[0],e.shape[1])},t.prototype.isExponentOf2=function(e){return(e&e-1)==0},t.prototype.fftRadix2=function(e,n,a){if(n===1)return e;var i=this.readSync(e.dataId),o=n/2,s=(function(g){for(var x=Math.ceil(g.length/4),w=new Float32Array(x),y=new Float32Array(x),b=0;b<g.length;b+=4)w[Math.floor(b/4)]=g[b],y[Math.floor(b/4)]=g[b+1];return{real:w,imag:y}})(i),u=pt(s.real,s.imag).as1D(),c=(function(g){for(var x=Math.floor(g.length/4),w=new Float32Array(x),y=new Float32Array(x),b=2;b<g.length;b+=4)w[Math.floor(b/4)]=g[b],y[Math.floor(b/4)]=g[b+1];return{real:w,imag:y}})(i),l=pt(c.real,c.imag).as1D();u=this.fftRadix2(u,o,a),l=this.fftRadix2(l,o,a);var f=(function(g,x){for(var w=new Float32Array(g/2),y=new Float32Array(g/2),b=0;b<Math.ceil(g/2);b++){var A=(x?2:-2)*Math.PI*(b/g);w[b]=Math.cos(A),y[b]=Math.sin(A)}return{real:w,imag:y}})(n,a),h=pt(f.real,f.imag).mul(l),d=u.add(h),p=u.sub(h),v=Jt(d).concat(Jt(p)),m=gr(d).concat(gr(p));return pt(v,m).as1D()},t.prototype.fourierTransformByMatmul=function(e,n,a){for(var i=new Float32Array(2*n),o=0;o<n;o++){for(var s=0,u=0,c=0;c<n;c++){var l=Tv(o*c,n,a),f=Rc(e,c);s+=f.real*l.real-f.imag*l.imag,u+=f.real*l.imag+f.imag*l.real}a&&(s/=n,u/=n),Dv(i,s,u,o)}return i},t.prototype.depthToSpace=function(e,n,a){C(a==="NHWC",(function(){return"Only NHWC dataFormat supported on CPU for depthToSpace. Got "+a})),C(n>1,(function(){return"blockSize should be > 1 for depthToSpace, but was: "+n}));for(var i=e.shape[0],o=e.shape[1],s=e.shape[2],u=e.shape[3],c=o*n,l=s*n,f=u/(n*n),h=this.readSync(e.dataId),d=new Float32Array(i*c*l*f),p=0,v=0;v<i;++v)for(var m=0;m<c;++m)for(var g=Math.floor(m/n),x=m%n,w=0;w<l;++w)for(var y=Math.floor(w/n),b=(x*n+w%n)*f,A=0;A<f;++A){var I=A+b+u*(y+s*(g+o*v));d[p++]=h[I]}return at(d,[i,c,l,f])},t.prototype.broadcastedBinaryOp=function(e,n,a,i){var o=xe(e.shape,n.shape),s=le(o,a),u=this.readSync(e.dataId),c=this.readSync(n.dataId),l=Mr(e.shape,o),f=Mr(n.shape,o),h=s.values;if(l.length+f.length===0)for(var d=0;d<h.length;++d)h[d]=i(u[d%u.length],c[d%c.length]);else{var p=this.bufferSync(e),v=this.bufferSync(n),m=function(g){var x=s.indexToLoc(g),w=x.slice(-e.rank);l.forEach((function(I){return w[I]=0}));var y=p.locToIndex(w),b=x.slice(-n.rank);f.forEach((function(I){return b[I]=0}));var A=v.locToIndex(b);h[g]=i(u[y],c[A])};for(d=0;d<h.length;++d)m(d)}return s.toTensor()},t.prototype.broadcastedBinaryComplexOp=function(e,n,a){var i=xe(e.shape,n.shape),o=le(i,"float32"),s=le(i,"float32"),u=this.readSync(e.dataId),c=this.readSync(n.dataId),l=Mr(e.shape,i),f=Mr(n.shape,i),h=o.values,d=s.values;if(l.length+f.length===0)for(var p=0;p<h.length;p++){var v=p%u.length,m=p%c.length,g=a(u[2*v],u[2*v+1],c[2*m],c[2*m+1]);h[p]=g.real,d[p]=g.imag}else{var x=this.bufferSync(this.data.get(e.dataId).complexTensors.real),w=this.bufferSync(this.data.get(n.dataId).complexTensors.real),y=function(b){var A=o.indexToLoc(b),I=A.slice(-e.rank);l.forEach((function(M){return I[M]=0}));var T=x.locToIndex(I),S=A.slice(-n.rank);f.forEach((function(M){return S[M]=0}));var D=w.locToIndex(S),_=a(u[2*T],u[2*T+1],c[2*D],c[2*D+1]);h[b]=_.real,d[b]=_.imag};for(p=0;p<h.length;p++)y(p)}return this.complex(o.toTensor(),s.toTensor())},t.prototype.split=function(e,n,a){return gf(e,n,a)},t.prototype.dispose=function(){},t.prototype.floatPrecision=function(){return 32},t.prototype.epsilon=function(){return 1e-7},t.prototype.cropAndResize=function(e,n,a,i,o,s){for(var u=e.shape,c=u[0],l=u[1],f=u[2],h=u[3],d=n.shape[0],p=i[0],v=i[1],m=le([d,p,v,h],"float32"),g=this.readSync(n.dataId),x=this.readSync(a.dataId),w=this.readSync(e.dataId),y=e.strides,b=m.strides,A=0;A<d;A++){var I=4*A,T=g[I],S=g[I+1],D=g[I+2],_=g[I+3],M=x[A];if(!(M>=c))for(var L=p>1?(D-T)*(l-1)/(p-1):0,O=v>1?(_-S)*(f-1)/(v-1):0,N=0;N<p;N++){var H=p>1?T*(l-1)+N*L:.5*(T+D)*(l-1);if(H<0||H>l-1)for(var G=0;G<v;G++)for(var U=0;U<h;U++){var z=U+G*b[2]+N*b[1]+A*b[0];m.values[z]=s}else if(o==="bilinear"){var X=Math.floor(H),q=Math.ceil(H),Z=H-X;for(G=0;G<v;G++)if((me=v>1?S*(f-1)+G*O:.5*(S+_)*(f-1))<0||me>f-1)for(U=0;U<h;U++)z=U+G*b[2]+N*b[1]+A*b[0],m.values[z]=s;else{var ne=Math.floor(me),ue=Math.ceil(me),ce=me-ne;for(U=0;U<h;U++){var fe=w[z=U+ne*y[2]+X*y[1]+M*y[0]],ve=w[z=U+ue*y[2]+X*y[1]+M*y[0]],ye=w[z=U+ne*y[2]+q*y[1]+M*y[0]],ge=fe+(ve-fe)*ce,He=ye+(w[z=U+ue*y[2]+q*y[1]+M*y[0]]-ye)*ce;z=U+G*b[2]+N*b[1]+A*b[0],m.values[z]=ge+(He-ge)*Z}}}else for(G=0;G<v;++G){var me;if((me=v>1?S*(f-1)+G*O:.5*(S+_)*(f-1))<0||me>f-1)for(U=0;U<h;U++)z=U+G*b[2]+N*b[1]+A*b[0],m.values[z]=s;else{var Se=Math.round(me),we=Math.round(H);for(U=0;U<h;U++){var Le=U+Se*y[2]+we*y[1]+M*y[0],Ue=U+G*b[2]+N*b[1]+A*b[0];m.values[Ue]=w[Le]}}}}}return m.toTensor()},t.prototype.sparseToDense=function(e,n,a,i){var o=Ha(0,e,a),s=o.sliceRank,u=o.numUpdates,c=o.sliceSize,l=o.strides,f=o.outputSize;return this.scatter(e,n,a,f,c,u,s,l,i,!1)},t.prototype.gatherND=function(e,n){var a=n.shape,i=a[a.length-1],o=eu(e,n),s=o[0],u=o[1],c=o[2],l=o[3];if(u===0)return ut([],s,e.dtype);for(var f=new Oa([u,c],e.dtype),h=this.readSync(n.dataId),d=this.readSync(e.dataId),p=0;p<u;p++){for(var v=[],m=0,g=0;g<i;g++){var x=h[p*i+g];m+=x*l[g],v.push(x)}if(m<0||m>=e.size/c)throw new Error("Invalid indices: "+v+" does not index into "+e.shape);for(var w=0;w<c;w++)f.values[p*c+w]=d[m*c+w]}return f.toTensor().reshape(s)},t.prototype.scatterND=function(e,n,a){var i=Ha(0,e,a),o=i.sliceRank,s=i.numUpdates,u=i.sliceSize,c=i.strides,l=i.outputSize,f=Y(0);return this.scatter(e,n,a,l,u,s,o,c,f,!0)},t.prototype.fill=function(e,n,a){var i=ka(a=a||Qn(n),re(e));return i.fill(n),B.makeTensor(i,e,a,this)},t.prototype.onesLike=function(e){if(e.dtype==="string")throw new Error("onesLike is not supported for string tensors");return this.fill(e.shape,1,e.dtype)},t.prototype.zerosLike=function(e){var n=ka(e.dtype,re(e.shape));return this.makeOutput(n,e.shape,e.dtype)},t.prototype.linspace=function(e,n,a){return ou(e,n,a)},t.prototype.scatter=function(e,n,a,i,o,s,u,c,l,f){var h=[i/o,o],d=this.readSync(e.dataId),p=this.readSync(n.dataId);if(i===0)return ut([],a,n.dtype);var v=new Oa(h,n.dtype);v.values.fill(this.readSync(l.dataId)[0]);for(var m=0;m<s;m++){for(var g=[],x=0,w=0;w<u;w++){var y=d[m*u+w];g.push(y),x+=y*c[w]}if(x<0||x>=i/o)throw new Error("Invalid indices: "+g+" does not index into "+a);for(var b=0;b<o;b++)f?v.values[x*o+b]+=p[m*o+b]:v.values[x*o+b]=n.rank===0?p[0]:p[m*o+b]}return v.toTensor().reshape(a)},t})(vf);B.registerBackend("cpu",(function(){return new Mx}),1);for(Fi=0,ps=[{kernelName:"NonMaxSuppressionV5",backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs,a=t,i=a.boxes,o=a.scores,s=n,u=s.maxOutputSize,c=s.iouThreshold,l=s.scoreThreshold,f=s.softNmsSigma,h=e;W(i,"NonMaxSuppressionWithScore");var d=uu(h.data.get(i.dataId).values,h.data.get(o.dataId).values,u,c,l,f);return[d.selectedIndices,d.selectedScores]}},{kernelName:"Square",backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t.x,a=e;W(n,"square");for(var i=a.data.get(n.dataId).values,o=new Float32Array(i.length),s=0;s<i.length;++s){var u=i[s];o[s]=u*u}return{dataId:a.write(o,n.shape,n.dtype),shape:n.shape,dtype:n.dtype}}},{kernelName:Va,backendName:"cpu",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t,a=n.a,i=n.b,o=e;W([a,i],Va);var s=o.data.get(a.dataId).values,u=o.data.get(i.dataId).values,c=(function(h,d,p,v,m,g){var x=xe(h,d),w=x.length,y=or(x),b=jn(m,re(x)),A=h.length,I=d.length,T=or(h),S=or(d),D=Mr(h,x),_=Mr(d,x);if(D.length+_.length===0)for(var M=0;M<b.length;++M)b[M]=g(p[M%p.length],v[M%v.length]);else{var L=function(O){var N=bl(O,w,y),H=N.slice(-A);D.forEach((function(X){return H[X]=0}));var G=Ds(H,A,T),U=N.slice(-I);_.forEach((function(X){return U[X]=0}));var z=Ds(U,I,S);b[O]=g(p[G],v[z])};for(M=0;M<b.length;++M)L(M)}return[b,x]})(a.shape,i.shape,s,u,a.dtype,(function(h,d){var p=h-d;return p*p})),l=c[0],f=c[1];return{dataId:o.write(l,f,a.dtype),shape:f,dtype:a.dtype}}}];Fi<ps.length;Fi++)cl(ps[Fi]);var Fi,ps,On,Bx=function(r){this.variableNames=["A"];var t=Ct(),e=r[0],n=r[1];this.outputShape=r,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(`+n+".0, "+e+`.0);

        vec4 values = `+t.texture2D+`(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `},_x=function(r){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;var t=Ct(),e=r[0],n=r[1];this.outputShape=r,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(`+n+".0, "+e+`.0);
            vec4 values = `+t.texture2D+`(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        `+t.output+` = result;
      }
    `};for(ki=0,vs=[{kernelName:"FromPixels",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs,a=t.pixels,i=n.numChannels,o=typeof HTMLVideoElement<"u"&&a instanceof HTMLVideoElement,s=typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement,u=o?[a.videoWidth,a.videoHeight]:[a.width,a.height],c=u[0],l=u[1],f=[l,c],h=[l,c,i];(s||o)&&(On==null&&(On=document.createElement("canvas").getContext("2d")),On.canvas.width=c,On.canvas.height=l,On.drawImage(a,0,0,c,l),a=On.canvas);var d=e.makeTensorInfo(f,"int32");e.texData.get(d.dataId).usage=Kt.PIXELS,e.gpgpu.uploadPixelDataToTexture(e.getTexture(d.dataId),a);var p=k().getBool("WEBGL_PACK")?new _x(h):new Bx(h),v=e.runWebGLProgram(p,[d],"int32");return e.disposeData(d.dataId),v}},{kernelName:"NonMaxSuppressionV5",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=r.attrs;Qi("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");var a=t,i=a.boxes,o=a.scores,s=n,u=s.maxOutputSize,c=s.iouThreshold,l=s.scoreThreshold,f=s.softNmsSigma,h=e,d=uu(h.readSync(i.dataId),h.readSync(o.dataId),u,c,l,f);return[d.selectedIndices,d.selectedScores]}},{kernelName:"Square",backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t.x,a=e,i=new he(n.shape,"return x * x;");return a.runWebGLProgram(i,[n],n.dtype)}},{kernelName:Va,backendName:"webgl",kernelFunc:function(r){var t=r.inputs,e=r.backend,n=t,a=n.a,i=n.b,o=e,s=k().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new Ir("return (a - b) * (a - b);",a.shape,i.shape):new Ye("return (a - b) * (a - b);",a.shape,i.shape);return o.compileAndRun(s,[a,i])}}];ki<vs.length;ki++)cl(vs[ki]);var ki,vs;for(Ni=0,ms=[{kernelName:"Square",gradFunc:function(r,t){var e=t[0];return{x:function(){return r.mul(e.toFloat().mul(2))}}}},{kernelName:Va,gradFunc:function(r,t){var e=t[0],n=t[1],a=Y(2);return{a:function(){return Xe(r,Xe(a,Pe(e,n)))},b:function(){return Xe(r,Xe(a,Pe(n,e)))}}}}];Ni<ms.length;Ni++)kp(ms[Ni]);var Ni,ms,Px=(function(){function r(){}return r.prototype.fetch=function(t,e){return fetch(t,e)},r.prototype.now=function(){return performance.now()},r.prototype.encode=function(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error("Browser's encoder only supports utf-8, but got "+e);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)},r.prototype.decode=function(t,e){return new TextDecoder(e).decode(t)},r})();k().get("IS_BROWSER")&&k().setPlatform("browser",new Px);var gs,Fx=function(){return bc()},kx=(function(){function r(){this.util=Ac(),this.textEncoder=new this.util.TextEncoder}return r.prototype.fetch=function(t,e){return k().global.fetch!=null?k().global.fetch(t,e):(gs==null&&(gs=Fx()),gs(t,e))},r.prototype.now=function(){var t=process.hrtime();return 1e3*t[0]+t[1]/1e6},r.prototype.encode=function(t,e){if(e!=="utf-8"&&e!=="utf8")throw new Error("Node built-in encoder only supports utf-8, but got "+e);return this.textEncoder.encode(t)},r.prototype.decode=function(t,e){return t.length===0?"":new this.util.TextDecoder(e).decode(t)},r})();k().get("IS_NODE")&&k().setPlatform("node",new kx);var Us={float32:4,int32:4,uint16:2,uint8:1,bool:1},io=4;function Ch(r,t){for(var e={},n=0,a=function(s){var u=s.name,c=s.dtype,l=s.shape,f=re(l),h=void 0;if("quantization"in s){var d=s.quantization;if(d.dtype!=="uint8"&&d.dtype!=="uint16")throw new Error("Weight "+s.name+" has unknown quantization dtype "+d.dtype+". Supported quantization dtypes are: 'uint8' and 'uint16'.");var p=Us[d.dtype],v=r.slice(n,n+f*p),m=d.dtype==="uint8"?new Uint8Array(v):new Uint16Array(v);if(c==="float32")h=Float32Array.from(m,(function(A){return A*d.scale+d.min}));else{if(c!=="int32")throw new Error("Unsupported dtype in weight '"+u+"': "+c);h=Int32Array.from(m,(function(A){return Math.round(A*d.scale+d.min)}))}n+=f*p}else if(c==="string"){var g=re(s.shape);h=[];for(var x=0;x<g;x++){var w=new Uint32Array(r.slice(n,n+io))[0];n+=io;var y=new Uint8Array(r.slice(n,n+w));h.push(y),n+=w}}else{var b=Us[c];if(v=r.slice(n,n+f*b),c==="float32")h=new Float32Array(v);else if(c==="int32")h=new Int32Array(v);else{if(c!=="bool")throw new Error("Unsupported dtype in weight '"+u+"': "+c);h=new Uint8Array(v)}n+=f*b}e[u]=ut(h,l,c)},i=0,o=t;i<o.length;i++)a(o[i]);return e}function Nx(r){if(r===null)throw new Error("Invalid input value: "+JSON.stringify(r));var t=0,e=[];r.forEach((function(i){if(t+=i.byteLength,e.push(i.byteLength===i.buffer.byteLength?i:new i.constructor(i)),!(i instanceof Float32Array||i instanceof Int32Array||i instanceof Uint8Array))throw new Error("Unsupported TypedArray subtype: "+i.constructor.name)}));var n=new Uint8Array(t),a=0;return e.forEach((function(i){n.set(new Uint8Array(i.buffer),a),a+=i.byteLength})),n.buffer}var Gs=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function Zc(r){return Gs?Buffer.byteLength(r):new Blob([r]).size}function Tu(r){var t=0;r.forEach((function(a){t+=a.byteLength}));var e=new Uint8Array(t),n=0;return r.forEach((function(a){e.set(new Uint8Array(a),n),n+=a.byteLength})),e.buffer}function Jc(r){for(r=r.trim();r.endsWith("/");)r=r.slice(0,r.length-1);var t=r.split("/");return t[t.length-1]}function ei(r){if(r.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:r.modelTopology==null?0:Zc(JSON.stringify(r.modelTopology)),weightSpecsBytes:r.weightSpecs==null?0:Zc(JSON.stringify(r.weightSpecs)),weightDataBytes:r.weightData==null?0:r.weightData.byteLength}}var Yt=(function(){function r(){this.saveRouters=[],this.loadRouters=[]}return r.getInstance=function(){return r.instance==null&&(r.instance=new r),r.instance},r.registerSaveRouter=function(t){r.getInstance().saveRouters.push(t)},r.registerLoadRouter=function(t){r.getInstance().loadRouters.push(t)},r.getSaveHandlers=function(t){return r.getHandlers(t,"save")},r.getLoadHandlers=function(t,e){return r.getHandlers(t,"load",e)},r.getHandlers=function(t,e,n){var a=[];return(e==="load"?r.getInstance().loadRouters:r.getInstance().saveRouters).forEach((function(i){var o=i(t,n);o!==null&&a.push(o)})),a},r})(),Vn="://",Yr=(function(){function r(){this.managers={}}return r.getInstance=function(){return r.instance==null&&(r.instance=new r),r.instance},r.registerManager=function(t,e){C(t!=null,(function(){return"scheme must not be undefined or null."})),t.endsWith(Vn)&&(t=t.slice(0,t.indexOf(Vn))),C(t.length>0,(function(){return"scheme must not be an empty string."}));var n=r.getInstance();C(n.managers[t]==null,(function(){return"A model store manager is already registered for scheme '"+t+"'."})),n.managers[t]=e},r.getManager=function(t){var e=this.getInstance().managers[t];if(e==null)throw new Error("Cannot find model manager for scheme '"+t+"'");return e},r.getSchemes=function(){return Object.keys(this.getInstance().managers)},r})();function Wi(r){if(r.indexOf(Vn)===-1)throw new Error("The url string provided does not contain a scheme. Supported schemes are: "+Yr.getSchemes().join(","));return{scheme:r.split(Vn)[0],path:r.split(Vn)[1]}}function $c(r,t,e){return e===void 0&&(e=!1),ee(this,void 0,void 0,(function(){var n,a,i,o,s,u,c,l,f;return te(this,(function(h){switch(h.label){case 0:return C(r!==t,(function(){return"Old path and new path are the same: '"+r+"'"})),C((n=Yt.getLoadHandlers(r)).length>0,(function(){return"Copying failed because no load handler is found for source URL "+r+"."})),C(n.length<2,(function(){return"Copying failed because more than one ("+n.length+") load handlers for source URL "+r+"."})),a=n[0],C((i=Yt.getSaveHandlers(t)).length>0,(function(){return"Copying failed because no save handler is found for destination URL "+t+"."})),C(i.length<2,(function(){return"Copying failed because more than one ("+n.length+") save handlers for destination URL "+t+"."})),o=i[0],s=Wi(r).scheme,u=Wi(r).path,c=s===Wi(r).scheme,[4,a.load()];case 1:return l=h.sent(),e&&c?[4,Yr.getManager(s).removeModel(u)]:[3,3];case 2:h.sent(),h.label=3;case 3:return[4,o.save(l)];case 4:return f=h.sent(),!e||c?[3,6]:[4,Yr.getManager(s).removeModel(u)];case 5:h.sent(),h.label=6;case 6:return[2,f.modelArtifactsInfo]}}))}))}var dn="models_store",jr="model_info_store";function Sh(){if(!k().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");var r=window||self,t=r.indexedDB||r.mozIndexedDB||r.webkitIndexedDB||r.msIndexedDB||r.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function Hs(r){var t=r.result;t.createObjectStore(dn,{keyPath:"modelPath"}),t.createObjectStore(jr,{keyPath:"modelPath"})}var Xn=(function(){function r(t){if(this.indexedDB=Sh(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}return r.prototype.save=function(t){return ee(this,void 0,void 0,(function(){return te(this,(function(e){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return[2,this.databaseAction(this.modelPath,t)]}))}))},r.prototype.load=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(t){return[2,this.databaseAction(this.modelPath)]}))}))},r.prototype.databaseAction=function(t,e){var n=this;return new Promise((function(a,i){var o=n.indexedDB.open("tensorflowjs",1);o.onupgradeneeded=function(){return Hs(o)},o.onsuccess=function(){var s=o.result;if(e==null){var u=s.transaction(dn,"readonly"),c=u.objectStore(dn).get(n.modelPath);c.onsuccess=function(){if(c.result==null)return s.close(),i(new Error("Cannot find model with path '"+n.modelPath+"' in IndexedDB."));a(c.result.modelArtifacts)},c.onerror=function(v){return s.close(),i(c.error)},u.oncomplete=function(){return s.close()}}else{var l,f=ei(e),h=s.transaction(jr,"readwrite"),d=h.objectStore(jr),p=d.put({modelPath:n.modelPath,modelArtifactsInfo:f});p.onsuccess=function(){var v=(l=s.transaction(dn,"readwrite")).objectStore(dn).put({modelPath:n.modelPath,modelArtifacts:e,modelArtifactsInfo:f});v.onsuccess=function(){return a({modelArtifactsInfo:f})},v.onerror=function(m){var g=(d=h.objectStore(jr)).delete(n.modelPath);g.onsuccess=function(){return s.close(),i(v.error)},g.onerror=function(x){return s.close(),i(v.error)}}},p.onerror=function(v){return s.close(),i(p.error)},h.oncomplete=function(){l==null?s.close():l.oncomplete=function(){return s.close()}}}},o.onerror=function(s){return i(o.error)}}))},r.URL_SCHEME="indexeddb://",r})(),el=function(r){return k().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(Xn.URL_SCHEME)?(t=r.slice(Xn.URL_SCHEME.length),new Xn(t)):null;var t};Yt.registerSaveRouter(el),Yt.registerLoadRouter(el);var Ox=(function(){function r(){this.indexedDB=Sh()}return r.prototype.listModels=function(){return ee(this,void 0,void 0,(function(){var t=this;return te(this,(function(e){return[2,new Promise((function(n,a){var i=t.indexedDB.open("tensorflowjs",1);i.onupgradeneeded=function(){return Hs(i)},i.onsuccess=function(){var o=i.result,s=o.transaction(jr,"readonly"),u=s.objectStore(jr).getAll();u.onsuccess=function(){for(var c={},l=0,f=u.result;l<f.length;l++){var h=f[l];c[h.modelPath]=h.modelArtifactsInfo}n(c)},u.onerror=function(c){return o.close(),a(u.error)},s.oncomplete=function(){return o.close()}},i.onerror=function(o){return a(i.error)}}))]}))}))},r.prototype.removeModel=function(t){return ee(this,void 0,void 0,(function(){var e=this;return te(this,(function(n){var a;return t=(a=t).startsWith(Xn.URL_SCHEME)?a.slice(Xn.URL_SCHEME.length):a,[2,new Promise((function(i,o){var s=e.indexedDB.open("tensorflowjs",1);s.onupgradeneeded=function(){return Hs(s)},s.onsuccess=function(){var u,c=s.result,l=c.transaction(jr,"readwrite"),f=l.objectStore(jr),h=f.get(t);h.onsuccess=function(){if(h.result==null)return c.close(),o(new Error("Cannot find model with path '"+t+"' in IndexedDB."));var d=f.delete(t),p=function(){var v=(u=c.transaction(dn,"readwrite")).objectStore(dn).delete(t);v.onsuccess=function(){return i(h.result.modelArtifactsInfo)},v.onerror=function(m){return o(h.error)}};d.onsuccess=p,d.onerror=function(v){return p(),c.close(),o(h.error)}},h.onerror=function(d){return c.close(),o(h.error)},l.oncomplete=function(){u==null?c.close():u.oncomplete=function(){return c.close()}}},s.onerror=function(u){return o(s.error)}}))]}))}))},r})();if(k().getBool("IS_BROWSER"))try{Yr.registerManager(Xn.URL_SCHEME,new Ox)}catch{}var Rr="/",zn="tensorflowjs_models",Dh="info",Lx="model_topology",Ux="weight_specs",Gx="weight_data",Hx="model_metadata";function Th(r){return{info:[zn,r,Dh].join(Rr),topology:[zn,r,Lx].join(Rr),weightSpecs:[zn,r,Ux].join(Rr),weightData:[zn,r,Gx].join(Rr),modelMetadata:[zn,r,Hx].join(Rr)}}function zx(r){var t=r.split(Rr);if(t.length<3)throw new Error("Invalid key format: "+r);return t.slice(1,t.length-1).join(Rr)}var Kn=(function(){function r(t){if(!k().getBool("IS_BROWSER")||typeof window>"u"||window.localStorage===void 0)throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=Th(this.modelPath)}return r.prototype.save=function(t){return ee(this,void 0,void 0,(function(){var e,n,a;return te(this,(function(i){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");e=JSON.stringify(t.modelTopology),n=JSON.stringify(t.weightSpecs),a=ei(t);try{return this.LS.setItem(this.keys.info,JSON.stringify(a)),this.LS.setItem(this.keys.topology,e),this.LS.setItem(this.keys.weightSpecs,n),this.LS.setItem(this.keys.weightData,(function(o){if(Gs)return Buffer.from(o).toString("base64");for(var s=new Uint8Array(o),u="",c=0,l=s.length;c<l;c++)u+=String.fromCharCode(s[c]);return btoa(u)})(t.weightData)),this.LS.setItem(this.keys.modelMetadata,JSON.stringify({format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,userDefinedMetadata:t.userDefinedMetadata})),[2,{modelArtifactsInfo:a}]}catch{throw this.LS.removeItem(this.keys.info),this.LS.removeItem(this.keys.topology),this.LS.removeItem(this.keys.weightSpecs),this.LS.removeItem(this.keys.weightData),this.LS.removeItem(this.keys.modelMetadata),new Error("Failed to save model '"+this.modelPath+"' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes="+a.modelTopologyBytes+", weightSpecsBytes="+a.weightSpecsBytes+", weightDataBytes="+a.weightDataBytes+".")}return[2]}))}))},r.prototype.load=function(){return ee(this,void 0,void 0,(function(){var t,e,n,a,i,o,s;return te(this,(function(u){if((t=JSON.parse(this.LS.getItem(this.keys.info)))==null)throw new Error("In local storage, there is no model with name '"+this.modelPath+"'");if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");if(e={},(n=JSON.parse(this.LS.getItem(this.keys.topology)))==null)throw new Error("In local storage, the topology of model '"+this.modelPath+"' is missing.");if(e.modelTopology=n,(a=JSON.parse(this.LS.getItem(this.keys.weightSpecs)))==null)throw new Error("In local storage, the weight specs of model '"+this.modelPath+"' are missing.");if(e.weightSpecs=a,(i=this.LS.getItem(this.keys.modelMetadata))!=null&&(o=JSON.parse(i),e.format=o.format,e.generatedBy=o.generatedBy,e.convertedBy=o.convertedBy,e.userDefinedMetadata=o.userDefinedMetadata),(s=this.LS.getItem(this.keys.weightData))==null)throw new Error("In local storage, the binary weight values of model '"+this.modelPath+"' are missing.");return e.weightData=(function(c){if(Gs){var l=Buffer.from(c,"base64");return l.buffer.slice(l.byteOffset,l.byteOffset+l.byteLength)}for(var f=atob(c),h=new Uint8Array(f.length),d=0;d<f.length;++d)h.set([f.charCodeAt(d)],d);return h.buffer})(s),[2,e]}))}))},r.URL_SCHEME="localstorage://",r})(),tl=function(r){return k().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(Kn.URL_SCHEME)?(t=r.slice(Kn.URL_SCHEME.length),new Kn(t)):null;var t};Yt.registerSaveRouter(tl),Yt.registerLoadRouter(tl);var Wx=(function(){function r(){C(k().getBool("IS_BROWSER"),(function(){return"Current environment is not a web browser"})),C(typeof window>"u"||window.localStorage!==void 0,(function(){return"Current browser does not appear to support localStorage"})),this.LS=window.localStorage}return r.prototype.listModels=function(){return ee(this,void 0,void 0,(function(){var t,e,n,a,i,o;return te(this,(function(s){for(t={},e=zn+Rr,n=Rr+Dh,a=0;a<this.LS.length;++a)(i=this.LS.key(a)).startsWith(e)&&i.endsWith(n)&&(o=zx(i),t[o]=JSON.parse(this.LS.getItem(i)));return[2,t]}))}))},r.prototype.removeModel=function(t){return ee(this,void 0,void 0,(function(){var e,n;return te(this,(function(a){var i;if(t=(i=t).startsWith(Kn.URL_SCHEME)?i.slice(Kn.URL_SCHEME.length):i,e=Th(t),this.LS.getItem(e.info)==null)throw new Error("Cannot find model at path '"+t+"'");return n=JSON.parse(this.LS.getItem(e.info)),this.LS.removeItem(e.info),this.LS.removeItem(e.topology),this.LS.removeItem(e.weightSpecs),this.LS.removeItem(e.weightData),[2,n]}))}))},r})();if(k().getBool("IS_BROWSER"))try{Yr.registerManager(Kn.URL_SCHEME,new Wx)}catch{}var Vx="model",Xx=".json",Kx=".weights.bin";function rl(r){return new Promise((function(t){return setTimeout(t)})).then(r)}var xs=(function(){function r(t){if(!k().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");t.startsWith(r.URL_SCHEME)&&(t=t.slice(r.URL_SCHEME.length)),t!=null&&t.length!==0||(t=Vx),this.modelTopologyFileName=t+Xx,this.weightDataFileName=t+Kx}return r.prototype.save=function(t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s;return te(this,(function(u){switch(u.label){case 0:if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");if(e=window.URL.createObjectURL(new Blob([t.weightData],{type:"application/octet-stream"})),!(t.modelTopology instanceof ArrayBuffer))return[3,1];throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");case 1:return n=[{paths:["./"+this.weightDataFileName],weights:t.weightSpecs}],a={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,weightsManifest:n},i=window.URL.createObjectURL(new Blob([JSON.stringify(a)],{type:"application/json"})),(o=this.jsonAnchor==null?document.createElement("a"):this.jsonAnchor).download=this.modelTopologyFileName,o.href=i,[4,rl((function(){return o.dispatchEvent(new MouseEvent("click"))}))];case 2:return u.sent(),t.weightData==null?[3,4]:((s=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor).download=this.weightDataFileName,s.href=e,[4,rl((function(){return s.dispatchEvent(new MouseEvent("click"))}))]);case 3:u.sent(),u.label=4;case 4:return[2,{modelArtifactsInfo:ei(t)}]}}))}))},r.URL_SCHEME="downloads://",r})(),jx=(function(){function r(t){if(t==null||t.length<1)throw new Error("When calling browserFiles, at least 1 file is required, but received "+t);this.files=t}return r.prototype.load=function(){return ee(this,void 0,void 0,(function(){var t,e,n=this;return te(this,(function(a){return t=this.files[0],e=this.files.slice(1),[2,new Promise((function(i,o){var s=new FileReader;s.onload=function(u){var c=JSON.parse(u.target.result),l=c.modelTopology;if(l!=null){e.length===0&&i({modelTopology:l});var f=c.weightsManifest;if(f!=null){var h;try{h=n.checkManifestAndWeightFiles(f,e)}catch(m){return void o(m)}var d=[],p=[],v=[];f.forEach((function(m){m.paths.forEach((function(g){p.push(g),v.push(null)})),d.push.apply(d,m.weights)})),f.forEach((function(m){m.paths.forEach((function(g){var x=new FileReader;x.onload=function(w){var y=w.target.result,b=p.indexOf(g);v[b]=y,v.indexOf(null)===-1&&i({modelTopology:l,weightSpecs:d,weightData:Tu(v),format:c.format,generatedBy:c.generatedBy,convertedBy:c.convertedBy,userDefinedMetadata:c.userDefinedMetadata})},x.onerror=function(w){return o("Failed to weights data from file of path '"+g+"'.")},x.readAsArrayBuffer(h[g])}))}))}else o(new Error("weightManifest field is missing from file "+t.name))}else o(new Error("modelTopology field is missing from file "+t.name))},s.onerror=function(u){return o("Failed to read model topology and weights manifest JSON from file '"+t.name+"'. BrowserFiles supports loading Keras-style tf.Model artifacts only.")},s.readAsText(t)}))]}))}))},r.prototype.checkManifestAndWeightFiles=function(t,e){for(var n=[],a=e.map((function(u){return Jc(u.name)})),i={},o=0,s=t;o<s.length;o++)s[o].paths.forEach((function(u){var c=Jc(u);if(n.indexOf(c)!==-1)throw new Error("Duplicate file basename found in weights manifest: '"+c+"'");if(n.push(c),a.indexOf(c)===-1)throw new Error("Weight file with basename '"+c+"' is not provided.");i[u]=e[a.indexOf(c)]}));if(n.length!==e.length)throw new Error("Mismatch in the number of files in weights manifest ("+n.length+") and the number of weight files provided ("+e.length+").");return i},r})();function nl(r,t,e,n){(function(i){C(i!=null&&Array.isArray(i)&&i.length>0,(function(){return"promises must be a none empty array"}))})(r),(function(i,o){C(i>=0&&i<=1,(function(){return"Progress fraction must be in range [0, 1], but got startFraction "+i})),C(o>=0&&o<=1,(function(){return"Progress fraction must be in range [0, 1], but got endFraction "+o})),C(o>=i,(function(){return"startFraction must be no more than endFraction, but got startFraction "+i+" and endFraction "+o}))})(e=e??0,n=n??1);var a=0;return Promise.all(r.map((function(i){return i.then((function(o){var s=e+ ++a/r.length*(n-e);return t(s),o})),i})))}function Ih(r,t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s,u,c,l;return te(this,(function(f){switch(f.label){case 0:return t==null&&(t={}),e=t.fetchFunc==null?k().platform.fetch:t.fetchFunc,n=r.map((function(h){return e(h,t.requestInit,{isBinary:!0})})),a=0,i=.5,t.onProgress!=null?[3,2]:[4,Promise.all(n)];case 1:return o=f.sent(),[3,4];case 2:return[4,nl(n,t.onProgress,a,i)];case 3:o=f.sent(),f.label=4;case 4:return s=o.map((function(h){return h.arrayBuffer()})),u=.5,c=1,t.onProgress!=null?[3,6]:[4,Promise.all(s)];case 5:return l=f.sent(),[3,8];case 6:return[4,nl(s,t.onProgress,u,c)];case 7:l=f.sent(),f.label=8;case 8:return[2,l]}}))}))}function al(r){var t=this;return function(e,n,a){return n===void 0&&(n=""),ee(t,void 0,void 0,(function(){var i,o,s,u,c,l,f,h,d,p;return te(this,(function(v){switch(v.label){case 0:if(i=e.map((function(){return!1})),o={},s=a!=null?a.map((function(){return!1})):[],u=[],e.forEach((function(m,g){var x=0;m.weights.forEach((function(w){var y="quantization"in w?w.quantization.dtype:w.dtype,b=Us[y]*re(w.shape),A=function(){i[g]=!0,o[g]==null&&(o[g]=[]),o[g].push({manifestEntry:w,groupOffset:x,sizeBytes:b})};a!=null?a.forEach((function(I,T){I===w.name&&(A(),s[T]=!0)})):A(),u.push(w.name),x+=b}))})),!s.every((function(m){return m})))throw c=a.filter((function(m,g){return!s[g]})),new Error("Could not find weights in manifest with names: "+c.join(", ")+`. 
Manifest JSON has weights with names: `+u.join(", ")+".");return l=i.reduce((function(m,g,x){return g&&m.push(x),m}),[]),f=[],l.forEach((function(m){e[m].paths.forEach((function(g){var x=n+(n.endsWith("/")?"":"/")+g;f.push(x)}))})),[4,r(f)];case 1:return h=v.sent(),d={},p=0,l.forEach((function(m){for(var g=e[m].paths.length,x=0,w=0;w<g;w++)x+=h[p+w].byteLength;for(var y=new ArrayBuffer(x),b=new Uint8Array(y),A=0,I=0;I<g;I++){var T=new Uint8Array(h[p+I]);b.set(T,A),A+=T.byteLength}o[m].forEach((function(S){var D=Ch(y.slice(S.groupOffset,S.groupOffset+S.sizeBytes),[S.manifestEntry]);for(var _ in D)d[_]=D[_]})),p+=g})),[2,d]}}))}))}}Yt.registerSaveRouter((function(r){return k().getBool("IS_BROWSER")&&!Array.isArray(r)&&r.startsWith(xs.URL_SCHEME)?(function(t){return t===void 0&&(t="model"),new xs(t)})(r.slice(xs.URL_SCHEME.length)):null}));var Rh=(function(){function r(t,e){if(this.DEFAULT_METHOD="POST",e==null&&(e={}),this.weightPathPrefix=e.weightPathPrefix,this.onProgress=e.onProgress,e.fetchFunc!=null?(C(typeof e.fetchFunc=="function",(function(){return"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"})),this.fetch=e.fetchFunc):this.fetch=k().platform.fetch,C(t!=null&&t.length>0,(function(){return"URL path for http must not be null, undefined or empty."})),Array.isArray(t)&&C(t.length===2,(function(){return"URL paths for http must have a length of 2, (actual length is "+t.length+")."})),this.path=t,e.requestInit!=null&&e.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=e.requestInit||{}}return r.prototype.save=function(t){return ee(this,void 0,void 0,(function(){var e,n,a,i;return te(this,(function(o){switch(o.label){case 0:if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");return(e=Object.assign({method:this.DEFAULT_METHOD},this.requestInit)).body=new FormData,n=[{paths:["./model.weights.bin"],weights:t.weightSpecs}],a={modelTopology:t.modelTopology,format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,userDefinedMetadata:t.userDefinedMetadata,weightsManifest:n},e.body.append("model.json",new Blob([JSON.stringify(a)],{type:"application/json"}),"model.json"),t.weightData!=null&&e.body.append("model.weights.bin",new Blob([t.weightData],{type:"application/octet-stream"}),"model.weights.bin"),[4,this.fetch(this.path,e)];case 1:if((i=o.sent()).ok)return[2,{modelArtifactsInfo:ei(t),responses:[i]}];throw new Error("BrowserHTTPRequest.save() failed due to HTTP response status "+i.status+".")}}))}))},r.prototype.load=function(){return ee(this,void 0,void 0,(function(){var t,e,n,a,i,o,s,u,c,l,f,h;return te(this,(function(d){switch(d.label){case 0:return[4,this.fetch(this.path,this.requestInit)];case 1:if(!(t=d.sent()).ok)throw new Error("Request to "+this.path+" failed with status code "+t.status+". Please verify this URL points to the model JSON of the model to load.");d.label=2;case 2:return d.trys.push([2,4,,5]),[4,t.json()];case 3:return e=d.sent(),[3,5];case 4:throw d.sent(),n="Failed to parse model JSON of response from "+this.path+".",this.path.endsWith(".pb")?n+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":n+=" Please make sure the server is serving valid JSON for this request.",new Error(n);case 5:if(a=e.modelTopology,i=e.weightsManifest,o=e.generatedBy,s=e.convertedBy,u=e.format,c=e.userDefinedMetadata,a==null&&i==null)throw new Error("The JSON from HTTP path "+this.path+" contains neither model topology or manifest for weights.");return i==null?[3,7]:[4,this.loadWeights(i)];case 6:h=d.sent(),l=h[0],f=h[1],d.label=7;case 7:return[2,{modelTopology:a,weightSpecs:l,weightData:f,userDefinedMetadata:c,generatedBy:o,convertedBy:s,format:u}]}}))}))},r.prototype.loadWeights=function(t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s,u,c,l,f,h;return te(this,(function(d){switch(d.label){case 0:for(e=Array.isArray(this.path)?this.path[1]:this.path,n=(function(p){var v=p.lastIndexOf("/"),m=p.lastIndexOf("?"),g=p.substring(0,v),x=m>v?p.substring(m):"";return[g+"/",x]})(e),a=n[0],i=n[1],o=this.weightPathPrefix||a,s=[],u=0,c=t;u<c.length;u++)l=c[u],s.push.apply(s,l.weights);return f=[],t.forEach((function(p){p.paths.forEach((function(v){f.push(o+v+i)}))})),[4,Ih(f,{requestInit:this.requestInit,fetchFunc:this.fetch,onProgress:this.onProgress})];case 1:return h=d.sent(),[2,[s,Tu(h)]]}}))}))},r.URL_SCHEME_REGEX=/^https?:\/\//,r})();function zs(r){return r.match(Rh.URL_SCHEME_REGEX)!=null}var il=function(r,t){return typeof fetch>"u"?null:(Array.isArray(r)?r.every((function(e){return zs(e)})):zs(r))?Ws(r,{onProgress:t}):null};function Ws(r,t){return new Rh(r,t)}Yt.registerSaveRouter(il),Yt.registerLoadRouter(il);var ys=(function(){function r(t){this.modelArtifacts=t}return r.prototype.load=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(t){return[2,this.modelArtifacts]}))}))},r})(),Yx=(function(){function r(t){this.saveHandler=t}return r.prototype.save=function(t){return ee(this,void 0,void 0,(function(){return te(this,(function(e){return[2,this.saveHandler(t)]}))}))},r})(),xo=Object.freeze({browserFiles:function(r){return new jx(r)},browserHTTPRequest:function(r,t){return Ws(r,t)},concatenateArrayBuffers:Tu,decodeWeights:Ch,encodeWeights:function(r,t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s=this;return te(this,(function(u){switch(u.label){case 0:for(e=[],n=[],a=Array.isArray(r)?r.map((function(c){return c.name})):Object.keys(r),i=function(c){var l=a[c],f=Array.isArray(r)?r[c].tensor:r[l];if(f.dtype!=="float32"&&f.dtype!=="int32"&&f.dtype!=="bool"&&f.dtype!=="string")throw new Error("Unsupported dtype in weight '"+l+"': "+f.dtype);var h={name:l,shape:f.shape,dtype:f.dtype};if(f.dtype==="string"){var d=new Promise((function(p){return ee(s,void 0,void 0,(function(){var v,m,g,x,w,y,b;return te(this,(function(A){switch(A.label){case 0:return[4,f.bytes()];case 1:for(v=A.sent(),m=v.reduce((function(I,T){return I+T.length}),0)+io*v.length,g=new Uint8Array(m),x=0,w=0;w<v.length;w++)y=v[w],b=new Uint8Array(new Uint32Array([y.length]).buffer),g.set(b,x),x+=io,g.set(y,x),x+=y.length;return p(g),[2]}}))}))}));n.push(d)}else n.push(f.data());t!=null&&(h.group=t),e.push(h)},o=0;o<a.length;++o)i(o);return[4,Promise.all(n)];case 1:return[2,{data:Nx(u.sent()),specs:e}]}}))}))},fromMemory:function(r,t,e,n){return arguments.length===1?r.modelTopology!=null||r.weightSpecs!=null?new ys(r):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new ys({modelTopology:r})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new ys({modelTopology:r,weightSpecs:t,weightData:e,trainingConfig:n}))},getLoadHandlers:function(r,t){return Yt.getLoadHandlers(r,t)},getModelArtifactsInfoForJSON:ei,getSaveHandlers:function(r){return Yt.getSaveHandlers(r)},http:Ws,isHTTPScheme:zs,loadWeights:function(r,t,e,n){return t===void 0&&(t=""),ee(this,void 0,void 0,(function(){return te(this,(function(a){return[2,al((function(i){return Ih(i,{requestInit:n})}))(r,t,e)]}))}))},registerLoadRouter:function(r){return Yt.registerLoadRouter(r)},registerSaveRouter:function(r){return Yt.registerSaveRouter(r)},weightsLoaderFactory:al,withSaveHandler:function(r){return new Yx(r)},copyModel:function(r,t){return ee(this,void 0,void 0,(function(){return te(this,(function(e){return[2,$c(r,t,!1)]}))}))},listModels:function(){return ee(this,void 0,void 0,(function(){var r,t,e,n,a,i,o;return te(this,(function(s){switch(s.label){case 0:r=Yr.getSchemes(),t={},e=0,n=r,s.label=1;case 1:return e<n.length?(a=n[e],[4,Yr.getManager(a).listModels()]):[3,4];case 2:for(o in i=s.sent())t[a+Vn+o]=i[o];s.label=3;case 3:return e++,[3,1];case 4:return[2,t]}}))}))},moveModel:function(r,t){return ee(this,void 0,void 0,(function(){return te(this,(function(e){return[2,$c(r,t,!0)]}))}))},removeModel:function(r){return ee(this,void 0,void 0,(function(){var t;return te(this,(function(e){return t=Wi(r),[2,Yr.getManager(t.scheme).removeModel(t.path)]}))}))}}),Ln,Qx=R({confusionMatrix_:function(r,t,e){var n=E(r,"labels","confusionMatrix"),a=E(t,"predictions","confusionMatrix");C(e==null||e>0&&Number.isInteger(e),(function(){return"If provided, numClasses must be a positive integer, but got "+e})),C(n.rank===1,(function(){return"Expected the rank of labels to be 1, but got "+n.rank})),C(a.rank===1,(function(){return"Expected the rank of predictions to be 1, but got "+a.rank})),C(n.shape[0]===a.shape[0],(function(){return"Mismatch in the number of examples: "+n.shape[0]+" vs. "+a.shape[0]+". Labels and predictions should have the same number of elements."})),C(e>0&&Number.isInteger(e),(function(){return"numClasses is required to be a positive integer, but got "+e}));var i=ks(n.asType("int32"),e),o=ks(a.asType("int32"),e);return i.transpose().matMul(o).asType("int32")}}),$1=Object.freeze({confusionMatrix:Qx}),qx=R({fromPixels_:function(r,t){if(t===void 0&&(t=3),t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(r==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");var e=!1,n=!1,a=!1,i=!1,o=!1;if(r.data instanceof Uint8Array)e=!0;else if(typeof ImageData<"u"&&r instanceof ImageData)n=!0;else if(typeof HTMLVideoElement<"u"&&r instanceof HTMLVideoElement)a=!0;else if(typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement)i=!0;else{if(r.getContext==null)throw new Error("pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was "+r.constructor.name);o=!0}if(a&&a&&r.readyState<2)throw new Error("The video element has not loaded data yet. Please wait for `loadeddata` event on the <video> element.");if(ul("FromPixels",B.backendName)!=null)return B.runKernel("FromPixels",{pixels:r},{numChannels:t});var s,u,c=a?[r.videoWidth,r.videoHeight]:[r.width,r.height],l=c[0],f=c[1];if(o?s=r.getContext("2d").getImageData(0,0,l,f).data:n||e?s=r.data:(i||a)&&(Ln==null&&(Ln=document.createElement("canvas").getContext("2d")),Ln.canvas.width=l,Ln.canvas.height=f,Ln.drawImage(r,0,0,l,f),s=Ln.getImageData(0,0,l,f).data),t===4)u=new Int32Array(s);else{var h=l*f;u=new Int32Array(h*t);for(var d=0;d<h;d++)for(var p=0;p<t;++p)u[d*t+p]=s[4*d+p]}return uo(u,[f,l,t],"int32")}}),$n=Object.freeze({toPixels:function(r,t){return ee(this,void 0,void 0,(function(){var e,n,a,i,o,s,u,c,l,f,h,d,p,v,m,g,x,w,y,b,A,I,T;return te(this,(function(S){switch(S.label){case 0:if(e=E(r,"img","toPixels"),r instanceof _e||(e=e.toInt()),e.rank!==2&&e.rank!==3)throw new Error("toPixels only supports rank 2 or 3 tensors, got rank "+e.rank+".");if(n=e.shape.slice(0,2),a=n[0],i=n[1],(o=e.rank===2?1:e.shape[2])>4||o===2)throw new Error("toPixels only supports depth of size 1, 3 or 4 but got "+o);return[4,e.data()];case 1:return s=S.sent(),u=e.min(),c=e.max(),[4,Promise.all([u.data(),c.data()])];case 2:if(l=S.sent(),f=l[0],h=l[1],d=f[0],p=h[0],u.dispose(),c.dispose(),e.dtype==="float32"){if(d<0||p>1)throw new Error("Tensor values for a float32 Tensor must be in the range [0 - 1] but got range ["+d+" - "+p+"].")}else{if(e.dtype!=="int32")throw new Error("Unsupported type for toPixels: "+e.dtype+". Please use float32 or int32 tensors.");if(d<0||p>255)throw new Error("Tensor values for a int32 Tensor must be in the range [0 - 255] but got range ["+d+" - "+p+"].")}for(v=e.dtype==="float32"?255:1,m=new Uint8ClampedArray(i*a*4),g=0;g<a*i;++g)x=void 0,w=void 0,y=void 0,b=void 0,o===1?(x=s[g]*v,w=s[g]*v,y=s[g]*v,b=255):o===3?(x=s[3*g]*v,w=s[3*g+1]*v,y=s[3*g+2]*v,b=255):o===4&&(x=s[4*g]*v,w=s[4*g+1]*v,y=s[4*g+2]*v,b=s[4*g+3]*v),m[(A=4*g)+0]=Math.round(x),m[A+1]=Math.round(w),m[A+2]=Math.round(y),m[A+3]=Math.round(b);return t!=null&&(t.width=i,t.height=a,I=t.getContext("2d"),T=new ImageData(m,i,a),I.putImageData(T,0,0)),e!==r&&e.dispose(),[2,m]}}))}))},fromPixels:qx}),Mh=(function(){function r(){}return r.prototype.getClassName=function(){return this.constructor.className},r.fromConfig=function(t,e){return new t(e)},r})(),Bh=(function(){function r(){this.classNameMap={}}return r.getMap=function(){return r.instance==null&&(r.instance=new r),r.instance},r.register=function(t){r.getMap().classNameMap[t.className]=[t,t.fromConfig]},r})();function Zr(r){C(r.className!=null,(function(){return"Class being registered does not have the static className property defined."})),C(typeof r.className=="string",(function(){return"className is required to be a string, but got type "+typeof r.className})),C(r.className.length>0,(function(){return"Class being registered has an empty-string as its className, which is disallowed."})),Bh.register(r)}var ew=Object.freeze({Serializable:Mh,SerializationMap:Bh,registerClass:Zr}),Zx=.001,_h=.1;function ws(){return B.backend.floatPrecision()===32?Zx:_h}function bs(r,t,e){var n=!0;if((mt(r)||mt(t))&&(n=!1),mt(r)&&mt(t)&&(n=!0),n){var a=r.constructor.name,i=t.constructor.name;if(a!==i)throw new Error("Arrays are of different type. Actual: "+a+". Expected: "+i)}if(Array.isArray(r)&&Array.isArray(t)){var o=yr(r),s=yr(t);if(!Je(o,s))throw new Error("Arrays have different shapes. Actual: ["+o+"]. Expected: ["+s+"]")}var u=mt(r)?r:Br(r),c=mt(t)?t:Br(t);if(u.length!==c.length)throw new Error("Arrays have different lengths actual: "+u.length+" vs expected: "+c.length+`.
Actual:   `+u+`.
Expected: `+c+".");for(var l=0;l<c.length;++l){var f=u[l],h=c[l];if(!e(f,h))throw new Error("Arrays differ: actual["+l+"] = "+f+", expected["+l+"] = "+h+`.
Actual:   `+u+`.
Expected: `+c+".")}}function As(r,t,e){return!isFinite(r)&&!isFinite(t)||!(isNaN(r)||isNaN(t)||Math.abs(r-t)>e)}var tw=Object.freeze({TEST_EPSILON_FLOAT16:_h,expectArraysClose:function(r,t,e){return e==null&&(e=ws()),bs(r,t,(function(n,a){return As(n,a,e)}))},testEpsilon:ws,expectPromiseToFail:function(r,t){r().then((function(){return t.fail()}),(function(){return t()}))},expectArraysEqual:function(r,t){var e=typeof t=="string"||typeof t=="number"||typeof t=="boolean"?[t]:t;return Kr(r)||Kr(r[0])||Kr(t)||Kr(t[0])?bs(r,e,(function(n,a){return n==a})):bs(r,t,(function(n,a){return As(n,a,0)}))},expectNumbersClose:function(r,t,e){if(e==null&&(e=ws()),!As(r,t,e))throw new Error("Numbers differ: actual === "+r+", expected === "+t)},expectValuesInRange:function(r,t,e){for(var n=0;n<r.length;n++)if(r[n]<t||r[n]>e)throw new Error("Value out of range:"+r[n]+" low: "+t+", high: "+e)},expectArrayBuffersEqual:function(r,t){expect(new Float32Array(r)).toEqual(new Float32Array(t))}});var rw=Object.freeze({gpgpu_util:wm,webgl_util:Vp,forceHalfFloat:function(){k().set("WEBGL_FORCE_F16_TEXTURES",!0)},MathBackendWebGL:Yf,setWebGLContext:Dl,GPGPUContext:Hf}),En=(function(r){function t(){return r!==null&&r.apply(this,arguments)||this}return ur(t,r),t.prototype.minimize=function(e,n,a){n===void 0&&(n=!1);var i=this.computeGradients(e,a),o=i.value,s=i.grads;if(a!=null){var u=a.map((function(c){return{name:c.name,tensor:s[c.name]}}));this.applyGradients(u)}else this.applyGradients(s);return Ot(s),n?o:(o.dispose(),null)},Object.defineProperty(t.prototype,"iterations",{get:function(){return this.iterations_==null&&(this.iterations_=0),this.iterations_},enumerable:!0,configurable:!0}),t.prototype.incrementIterations=function(){this.iterations_=this.iterations+1},t.prototype.computeGradients=function(e,n){return Cv(e,n)},t.prototype.dispose=function(){this.iterations_!=null&&Ot(this.iterations_)},t.prototype.saveIterations=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){return this.iterations_==null&&(this.iterations_=0),[2,{name:"iter",tensor:Y(this.iterations_,"int32")}]}))}))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){throw new Error("getWeights() is not implemented for this optimizer yet.")}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){throw new Error("setWeights() is not implemented for this optimizer class "+this.getClassName())}))}))},t.prototype.extractIterations=function(e){return ee(this,void 0,void 0,(function(){var n;return te(this,(function(a){switch(a.label){case 0:return n=this,[4,e[0].tensor.data()];case 1:return n.iterations_=a.sent()[0],[2,e.slice(1)]}}))}))},t})(Mh);Object.defineProperty(En,Symbol.hasInstance,{value:function(r){return r.minimize!=null&&r.computeGradients!=null&&r.applyGradients!=null}});var Ph=(function(r){function t(e,n,a){a===void 0&&(a=null);var i=r.call(this)||this;return i.learningRate=e,i.rho=n,i.epsilon=a,i.accumulatedGrads=[],i.accumulatedUpdates=[],a==null&&(i.epsilon=B.backend.epsilon()),i}return ur(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map((function(a){return a.name})):Object.keys(e)).forEach((function(a,i){var o=B.registeredVariables[a];n.accumulatedGrads[i]==null&&(n.accumulatedGrads[i]={originalName:a+"/accum_grad",variable:V((function(){return Ae(o).variable(!1)}))}),n.accumulatedUpdates[i]==null&&(n.accumulatedUpdates[i]={originalName:a+"/accum_var",variable:V((function(){return Ae(o).variable(!1)}))});var s=Array.isArray(e)?e[i].tensor:e[a];if(s!=null){var u=n.accumulatedGrads[i].variable,c=n.accumulatedUpdates[i].variable;V((function(){var l=u.mul(n.rho).add(s.square().mul(1-n.rho)),f=c.add(n.epsilon).sqrt().div(u.add(n.epsilon).sqrt()).mul(s),h=c.mul(n.rho).add(f.square().mul(1-n.rho));u.assign(l),c.assign(h);var d=f.mul(-n.learningRate).add(o);o.assign(d)}))}})),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedUpdates!=null&&(Ot(this.accumulatedGrads.map((function(e){return e.variable}))),Ot(this.accumulatedUpdates.map((function(e){return e.variable}))))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){var e;return te(this,(function(n){switch(n.label){case 0:return e=this.accumulatedGrads.concat(this.accumulatedUpdates),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map((function(a){return{name:a.originalName,tensor:a.variable}})))]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){var n;return te(this,(function(a){switch(a.label){case 0:return[4,this.extractIterations(e)];case 1:return e=a.sent(),n=e.length/2,this.accumulatedGrads=e.slice(0,n).map((function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}})),this.accumulatedUpdates=e.slice(n,2*n).map((function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}})),[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}},t.fromConfig=function(e,n){return new e(n.learningRate,n.rho,n.epsilon)},t.className="Adadelta",t})(En);Zr(Ph);var Fh=(function(r){function t(e,n){n===void 0&&(n=.1);var a=r.call(this)||this;return a.learningRate=e,a.initialAccumulatorValue=n,a.accumulatedGrads=[],a}return ur(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map((function(a){return a.name})):Object.keys(e)).forEach((function(a,i){var o=B.registeredVariables[a];n.accumulatedGrads[i]==null&&(n.accumulatedGrads[i]={originalName:a+"/accumulator",variable:V((function(){return Qt(o.shape,n.initialAccumulatorValue).variable(!1)}))});var s=Array.isArray(e)?e[i].tensor:e[a];if(s!=null){var u=n.accumulatedGrads[i].variable;V((function(){var c=u.add(s.square());u.assign(c);var l=s.div(c.add(B.backend.epsilon()).sqrt()).mul(-n.learningRate).add(o);o.assign(l)}))}})),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedGrads!=null&&Ot(this.accumulatedGrads.map((function(e){return e.variable})))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()].concat(this.accumulatedGrads.map((function(n){return{name:n.originalName,tensor:n.variable}})))]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:return e=n.sent(),this.accumulatedGrads=e.map((function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}})),[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}},t.fromConfig=function(e,n){return new e(n.learningRate,n.initialAccumulatorValue)},t.className="Adagrad",t})(En);Zr(Fh);var kh=(function(r){function t(e,n,a,i){i===void 0&&(i=null);var o=r.call(this)||this;return o.learningRate=e,o.beta1=n,o.beta2=a,o.epsilon=i,o.accumulatedFirstMoment=[],o.accumulatedSecondMoment=[],V((function(){o.accBeta1=Y(n).variable(),o.accBeta2=Y(a).variable()})),i==null&&(o.epsilon=B.backend.epsilon()),o}return ur(t,r),t.prototype.applyGradients=function(e){var n=this,a=Array.isArray(e)?e.map((function(i){return i.name})):Object.keys(e);V((function(){var i=Pe(1,n.accBeta1),o=Pe(1,n.accBeta2);a.forEach((function(s,u){var c=B.registeredVariables[s];n.accumulatedFirstMoment[u]==null&&(n.accumulatedFirstMoment[u]={originalName:s+"/m",variable:V((function(){return Ae(c).variable(!1)}))}),n.accumulatedSecondMoment[u]==null&&(n.accumulatedSecondMoment[u]={originalName:s+"/v",variable:V((function(){return Ae(c).variable(!1)}))});var l=Array.isArray(e)?e[u].tensor:e[s];if(l!=null){var f=n.accumulatedFirstMoment[u].variable,h=n.accumulatedSecondMoment[u].variable,d=f.mul(n.beta1).add(l.mul(1-n.beta1)),p=h.mul(n.beta2).add(l.square().mul(1-n.beta2)),v=d.div(i),m=p.div(o);f.assign(d),h.assign(p);var g=v.div(m.sqrt().add(n.epsilon)).mul(-n.learningRate).add(c);c.assign(g)}})),n.accBeta1.assign(n.accBeta1.mul(n.beta1)),n.accBeta2.assign(n.accBeta2.mul(n.beta2))})),this.incrementIterations()},t.prototype.dispose=function(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&Ot(this.accumulatedFirstMoment.map((function(e){return e.variable}))),this.accumulatedSecondMoment!=null&&Ot(this.accumulatedSecondMoment.map((function(e){return e.variable})))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){var e;return te(this,(function(n){switch(n.label){case 0:return e=this.accumulatedFirstMoment.concat(this.accumulatedSecondMoment),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map((function(a){return{name:a.originalName,tensor:a.variable}})))]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){var n,a=this;return te(this,(function(i){switch(i.label){case 0:return[4,this.extractIterations(e)];case 1:return e=i.sent(),V((function(){a.accBeta1.assign(no(a.beta1,a.iterations_+1)),a.accBeta2.assign(no(a.beta2,a.iterations_+1))})),n=e.length/2,this.accumulatedFirstMoment=e.slice(0,n).map((function(o){return{originalName:o.name,variable:o.tensor.variable(!1)}})),this.accumulatedSecondMoment=e.slice(n,2*n).map((function(o){return{originalName:o.name,variable:o.tensor.variable(!1)}})),[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}},t.fromConfig=function(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon)},t.className="Adam",t})(En);Zr(kh);var Nh=(function(r){function t(e,n,a,i,o){i===void 0&&(i=null),o===void 0&&(o=0);var s=r.call(this)||this;return s.learningRate=e,s.beta1=n,s.beta2=a,s.epsilon=i,s.decay=o,s.accumulatedFirstMoment=[],s.accumulatedWeightedInfNorm=[],V((function(){s.iteration=Y(0).variable(),s.accBeta1=Y(n).variable()})),i==null&&(s.epsilon=B.backend.epsilon()),s}return ur(t,r),t.prototype.applyGradients=function(e){var n=this,a=Array.isArray(e)?e.map((function(i){return i.name})):Object.keys(e);V((function(){var i=Pe(1,n.accBeta1),o=$t(-n.learningRate,n.iteration.mul(n.decay).add(1));a.forEach((function(s,u){var c=B.registeredVariables[s];n.accumulatedFirstMoment[u]==null&&(n.accumulatedFirstMoment[u]={originalName:s+"/m",variable:Ae(c).variable(!1)}),n.accumulatedWeightedInfNorm[u]==null&&(n.accumulatedWeightedInfNorm[u]={originalName:s+"/v",variable:Ae(c).variable(!1)});var l=Array.isArray(e)?e[u].tensor:e[s];if(l!=null){var f=n.accumulatedFirstMoment[u].variable,h=n.accumulatedWeightedInfNorm[u].variable,d=f.mul(n.beta1).add(l.mul(1-n.beta1)),p=h.mul(n.beta2),v=l.abs(),m=p.maximum(v);f.assign(d),h.assign(m);var g=o.div(i).mul(d.div(m.add(n.epsilon))).add(c);c.assign(g)}})),n.iteration.assign(n.iteration.add(1)),n.accBeta1.assign(n.accBeta1.mul(n.beta1))})),this.incrementIterations()},t.prototype.dispose=function(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&Ot(this.accumulatedFirstMoment.map((function(e){return e.variable}))),this.accumulatedWeightedInfNorm!=null&&Ot(this.accumulatedWeightedInfNorm.map((function(e){return e.variable})))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){throw new Error("getWeights() is not implemented for Adamax yet.")}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){throw new Error("setWeights() is not implemented for Adamax yet.")}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}},t.fromConfig=function(e,n){return new e(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)},t.className="Adamax",t})(En);Zr(Nh);var Iu=(function(r){function t(e){var n=r.call(this)||this;return n.learningRate=e,n.setLearningRate(e),n}return ur(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map((function(a){return a.name})):Object.keys(e)).forEach((function(a,i){var o=Array.isArray(e)?e[i].tensor:e[a];if(o!=null){var s=B.registeredVariables[a];V((function(){var u=n.c.mul(o).add(s);s.assign(u)}))}})),this.incrementIterations()},t.prototype.setLearningRate=function(e){this.learningRate=e,this.c!=null&&this.c.dispose(),this.c=Xp(Y(-e))},t.prototype.dispose=function(){this.c.dispose()},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()]]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:if((e=n.sent()).length!==0)throw new Error("SGD optimizer does not have settable weights.");return[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate}},t.fromConfig=function(e,n){return new e(n.learningRate)},t.className="SGD",t})(En);Zr(Iu);var Oh=(function(r){function t(e,n,a){a===void 0&&(a=!1);var i=r.call(this,e)||this;return i.learningRate=e,i.momentum=n,i.useNesterov=a,i.accumulations=[],i.m=Y(i.momentum),i}return ur(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map((function(a){return a.name})):Object.keys(e)).forEach((function(a,i){var o=B.registeredVariables[a];n.accumulations[i]==null&&(n.accumulations[i]={originalName:a+"/momentum",variable:V((function(){return Ae(o).variable(!1)}))});var s=n.accumulations[i].variable,u=Array.isArray(e)?e[i].tensor:e[a];u!=null&&V((function(){var c,l=n.m.mul(s).add(u);c=n.useNesterov?n.c.mul(u.add(l.mul(n.m))).add(o):n.c.mul(l).add(o),s.assign(l),o.assign(c)}))})),this.incrementIterations()},t.prototype.dispose=function(){this.m.dispose(),this.accumulations!=null&&Ot(this.accumulations.map((function(e){return e.variable})))},t.prototype.setMomentum=function(e){this.momentum=e},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){return te(this,(function(e){switch(e.label){case 0:return[4,this.saveIterations()];case 1:return[2,[e.sent()].concat(this.accumulations.map((function(n){return{name:n.originalName,tensor:n.variable}})))]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){return te(this,(function(n){switch(n.label){case 0:return[4,this.extractIterations(e)];case 1:return e=n.sent(),this.accumulations=e.map((function(a){return{originalName:a.name,variable:a.tensor.variable(!1)}})),[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}},t.fromConfig=function(e,n){return new e(n.learningRate,n.momentum,n.useNesterov)},t.className="Momentum",t})(Iu);Zr(Oh);var Lh=(function(r){function t(e,n,a,i,o){n===void 0&&(n=.9),a===void 0&&(a=0),i===void 0&&(i=null),o===void 0&&(o=!1);var s=r.call(this)||this;if(s.learningRate=e,s.decay=n,s.momentum=a,s.epsilon=i,s.accumulatedMeanSquares=[],s.accumulatedMoments=[],s.accumulatedMeanGrads=[],s.centered=o,i==null&&(s.epsilon=B.backend.epsilon()),e==null)throw new Error("learningRate for RMSPropOptimizer must be defined.");return s}return ur(t,r),t.prototype.applyGradients=function(e){var n=this;(Array.isArray(e)?e.map((function(a){return a.name})):Object.keys(e)).forEach((function(a,i){var o=B.registeredVariables[a];n.accumulatedMeanSquares[i]==null&&(n.accumulatedMeanSquares[i]={originalName:a+"/rms",variable:V((function(){return Ae(o).variable(!1)}))}),n.accumulatedMoments[i]==null&&(n.accumulatedMoments[i]={originalName:a+"/momentum",variable:V((function(){return Ae(o).variable(!1)}))}),n.accumulatedMeanGrads[i]==null&&n.centered&&(n.accumulatedMeanGrads[i]={originalName:a+"/mg",variable:V((function(){return Ae(o).variable(!1)}))});var s=Array.isArray(e)?e[i].tensor:e[a];if(s!=null){var u=n.accumulatedMeanSquares[i].variable,c=n.accumulatedMoments[i].variable;V((function(){var l=u.mul(n.decay).add(s.square().mul(1-n.decay));if(n.centered){var f=n.accumulatedMeanGrads[i].variable,h=f.mul(n.decay).add(s.mul(1-n.decay)),d=c.mul(n.momentum).add(s.mul(n.learningRate).div(l.sub(h.square().add(n.epsilon)).sqrt()));u.assign(l),f.assign(h),c.assign(d);var p=o.sub(d);o.assign(p)}else{var v=u.mul(n.decay).add(s.square().mul(1-n.decay));d=c.mul(n.momentum).add(s.mul(n.learningRate).div(v.add(n.epsilon).sqrt())),u.assign(v),c.assign(d),p=o.sub(d),o.assign(p)}}))}})),this.incrementIterations()},t.prototype.dispose=function(){this.accumulatedMeanSquares!=null&&Ot(this.accumulatedMeanSquares.map((function(e){return e.variable}))),this.accumulatedMeanGrads!=null&&this.centered&&Ot(this.accumulatedMeanGrads.map((function(e){return e.variable}))),this.accumulatedMoments!=null&&Ot(this.accumulatedMoments.map((function(e){return e.variable})))},t.prototype.getWeights=function(){return ee(this,void 0,void 0,(function(){var e;return te(this,(function(n){switch(n.label){case 0:return e=this.accumulatedMeanSquares.concat(this.accumulatedMoments),this.centered&&e.push.apply(e,this.accumulatedMeanGrads),[4,this.saveIterations()];case 1:return[2,[n.sent()].concat(e.map((function(a){return{name:a.originalName,tensor:a.variable}})))]}}))}))},t.prototype.setWeights=function(e){return ee(this,void 0,void 0,(function(){var n;return te(this,(function(a){switch(a.label){case 0:return[4,this.extractIterations(e)];case 1:return e=a.sent(),n=this.centered?e.length/3:e.length/2,this.accumulatedMeanSquares=e.slice(0,n).map((function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}})),this.accumulatedMoments=e.slice(n,2*n).map((function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}})),this.centered&&(this.accumulatedMeanGrads=e.slice(2*n,3*n).map((function(i){return{originalName:i.name,variable:i.tensor.variable(!1)}}))),[2]}}))}))},t.prototype.getConfig=function(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}},t.fromConfig=function(e,n){return new e(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)},t.className="RMSProp",t})(En);Zr(Lh);var cn=(function(){function r(){}return r.sgd=function(t){return new Iu(t)},r.momentum=function(t,e,n){return n===void 0&&(n=!1),new Oh(t,e,n)},r.rmsprop=function(t,e,n,a,i){return e===void 0&&(e=.9),n===void 0&&(n=0),a===void 0&&(a=null),i===void 0&&(i=!1),new Lh(t,e,n,a,i)},r.adam=function(t,e,n,a){return t===void 0&&(t=.001),e===void 0&&(e=.9),n===void 0&&(n=.999),a===void 0&&(a=null),new kh(t,e,n,a)},r.adadelta=function(t,e,n){return t===void 0&&(t=.001),e===void 0&&(e=.95),n===void 0&&(n=null),new Ph(t,e,n)},r.adamax=function(t,e,n,a,i){return t===void 0&&(t=.002),e===void 0&&(e=.9),n===void 0&&(n=.999),a===void 0&&(a=null),i===void 0&&(i=0),new Nh(t,e,n,a,i)},r.adagrad=function(t,e){return e===void 0&&(e=.1),new Fh(t,e)},r})(),nw={sgd:cn.sgd,momentum:cn.momentum,adadelta:cn.adadelta,adagrad:cn.adagrad,rmsprop:cn.rmsprop,adamax:cn.adamax,adam:cn.adam};_e.prototype.squaredDifference=function(r){return Qf(this,r)},F=Rx;function Jr(r,t,e){if(e===void 0&&(e=!1),r.beginPath(),t.slice(1).forEach(function(i,o){var s=i.x,u=i.y,c=t[o];r.moveTo(c.x,c.y),r.lineTo(s,u)}),e){var n=t[t.length-1],a=t[0];if(!n||!a)return;r.moveTo(n.x,n.y),r.lineTo(a.x,a.y)}r.stroke()}var Ru=function(r,t){return Ru=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var a in n)n.hasOwnProperty(a)&&(e[a]=n[a])},Ru(r,t)};function Q(r,t){Ru(r,t);function e(){this.constructor=r}r.prototype=t===null?Object.create(t):(e.prototype=t.prototype,new e)}var tt=function(){return tt=Object.assign||function(t){for(var e,n=1,a=arguments.length;n<a;n++){e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t},tt.apply(this,arguments)};function K(r,t,e,n){function a(i){return i instanceof e?i:new e(function(o){o(i)})}return new(e||(e=Promise))(function(i,o){function s(l){try{c(n.next(l))}catch(f){o(f)}}function u(l){try{c(n.throw(l))}catch(f){o(f)}}function c(l){l.done?i(l.value):a(l.value).then(s,u)}c((n=n.apply(r,t||[])).next())})}function j(r,t){var e={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},n,a,i,o;return o={next:s(0),throw:s(1),return:s(2)},typeof Symbol=="function"&&(o[Symbol.iterator]=function(){return this}),o;function s(c){return function(l){return u([c,l])}}function u(c){if(n)throw new TypeError("Generator is already executing.");for(;e;)try{if(n=1,a&&(i=c[0]&2?a.return:c[0]?a.throw||((i=a.return)&&i.call(a),0):a.next)&&!(i=i.call(a,c[1])).done)return i;switch(a=0,i&&(c=[c[0]&2,i.value]),c[0]){case 0:case 1:i=c;break;case 4:return e.label++,{value:c[1],done:!1};case 5:e.label++,a=c[1],c=[0];continue;case 7:c=e.ops.pop(),e.trys.pop();continue;default:if(i=e.trys,!(i=i.length>0&&i[i.length-1])&&(c[0]===6||c[0]===2)){e=0;continue}if(c[0]===3&&(!i||c[1]>i[0]&&c[1]<i[3])){e.label=c[1];break}if(c[0]===6&&e.label<i[1]){e.label=i[1],i=c;break}if(i&&e.label<i[2]){e.label=i[2],e.ops.push(c);break}i[2]&&e.ops.pop(),e.trys.pop();continue}c=t.call(r,e)}catch(l){c=[6,l],a=0}finally{n=i=0}if(c[0]&5)throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}}function Cn(){for(var r=0,t=0,e=arguments.length;t<e;t++)r+=arguments[t].length;for(var n=Array(r),a=0,t=0;t<e;t++)for(var i=arguments[t],o=0,s=i.length;o<s;o++,a++)n[a]=i[o];return n}var hr=(function(){function r(t,e){if(!br(t)||!br(e))throw new Error("Dimensions.constructor - expected width and height to be valid numbers, instead have "+JSON.stringify({width:t,height:e}));this._width=t,this._height=e}return Object.defineProperty(r.prototype,"width",{get:function(){return this._width},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"height",{get:function(){return this._height},enumerable:!0,configurable:!0}),r.prototype.reverse=function(){return new r(1/this.width,1/this.height)},r})();function ti(r,t){return r instanceof _e&&r.shape.length===t}function Uh(r){return ti(r,2)}function $r(r){return ti(r,3)}function tr(r){return ti(r,4)}function Gh(r){return r%1!==0}function Mu(r){return r%2===0}function yo(r,t){t===void 0&&(t=2);var e=Math.pow(10,t);return Math.floor(r*e)/e}function Bu(r){return r&&r.width&&r.height}function Hh(r,t){var e=r.width,n=r.height,a=t/Math.max(n,e);return new hr(Math.round(e*a),Math.round(n*a))}function ea(r){return r.reduce(function(t,e){return t.add(e)},new de(0,0)).div(new de(r.length,r.length))}function Nr(r,t,e){return Array(r).fill(0).map(function(n,a){return t+a*e})}function br(r){return!!r&&r!==1/0&&r!==-1/0&&!isNaN(r)||r===0}function wo(r){return br(r)&&0<=r&&r<=1}var de=(function(){function r(t,e){this._x=t,this._y=e}return Object.defineProperty(r.prototype,"x",{get:function(){return this._x},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"y",{get:function(){return this._y},enumerable:!0,configurable:!0}),r.prototype.add=function(t){return new r(this.x+t.x,this.y+t.y)},r.prototype.sub=function(t){return new r(this.x-t.x,this.y-t.y)},r.prototype.mul=function(t){return new r(this.x*t.x,this.y*t.y)},r.prototype.div=function(t){return new r(this.x/t.x,this.y/t.y)},r.prototype.abs=function(){return new r(Math.abs(this.x),Math.abs(this.y))},r.prototype.magnitude=function(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))},r.prototype.floor=function(){return new r(Math.floor(this.x),Math.floor(this.y))},r})();var xt=(function(){function r(t,e){e===void 0&&(e=!0);var n=t||{},a=[n.left,n.top,n.right,n.bottom].every(br),i=[n.x,n.y,n.width,n.height].every(br);if(!i&&!a)throw new Error("Box.constructor - expected box to be IBoundingBox | IRect, instead have "+JSON.stringify(n));var o=i?[n.x,n.y,n.width,n.height]:[n.left,n.top,n.right-n.left,n.bottom-n.top],s=o[0],u=o[1],c=o[2],l=o[3];r.assertIsValidBox({x:s,y:u,width:c,height:l},"Box.constructor",e),this._x=s,this._y=u,this._width=c,this._height=l}return r.isRect=function(t){return!!t&&[t.x,t.y,t.width,t.height].every(br)},r.assertIsValidBox=function(t,e,n){if(n===void 0&&(n=!1),!r.isRect(t))throw new Error(e+" - invalid box: "+JSON.stringify(t)+", expected object with properties x, y, width, height");if(!n&&(t.width<0||t.height<0))throw new Error(e+" - width ("+t.width+") and height ("+t.height+") must be positive numbers")},Object.defineProperty(r.prototype,"x",{get:function(){return this._x},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"y",{get:function(){return this._y},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"width",{get:function(){return this._width},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"height",{get:function(){return this._height},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"left",{get:function(){return this.x},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"top",{get:function(){return this.y},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"right",{get:function(){return this.x+this.width},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"bottom",{get:function(){return this.y+this.height},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"area",{get:function(){return this.width*this.height},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"topLeft",{get:function(){return new de(this.left,this.top)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"topRight",{get:function(){return new de(this.right,this.top)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"bottomLeft",{get:function(){return new de(this.left,this.bottom)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"bottomRight",{get:function(){return new de(this.right,this.bottom)},enumerable:!0,configurable:!0}),r.prototype.round=function(){var t=[this.x,this.y,this.width,this.height].map(function(o){return Math.round(o)}),e=t[0],n=t[1],a=t[2],i=t[3];return new r({x:e,y:n,width:a,height:i})},r.prototype.floor=function(){var t=[this.x,this.y,this.width,this.height].map(function(o){return Math.floor(o)}),e=t[0],n=t[1],a=t[2],i=t[3];return new r({x:e,y:n,width:a,height:i})},r.prototype.toSquare=function(){var t=this,e=t.x,n=t.y,a=t.width,i=t.height,o=Math.abs(a-i);return a<i&&(e-=o/2,a+=o),i<a&&(n-=o/2,i+=o),new r({x:e,y:n,width:a,height:i})},r.prototype.rescale=function(t){var e=Bu(t)?t.width:t,n=Bu(t)?t.height:t;return new r({x:this.x*e,y:this.y*n,width:this.width*e,height:this.height*n})},r.prototype.pad=function(t,e){var n=[this.x-t/2,this.y-e/2,this.width+t,this.height+e],a=n[0],i=n[1],o=n[2],s=n[3];return new r({x:a,y:i,width:o,height:s})},r.prototype.clipAtImageBorders=function(t,e){var n=this,a=n.x,i=n.y,o=n.right,s=n.bottom,u=Math.max(a,0),c=Math.max(i,0),l=o-u,f=s-c,h=Math.min(l,t-u),d=Math.min(f,e-c);return new r({x:u,y:c,width:h,height:d}).floor()},r.prototype.shift=function(t,e){var n=this,a=n.width,i=n.height,o=this.x+t,s=this.y+e;return new r({x:o,y:s,width:a,height:i})},r.prototype.padAtBorders=function(t,e){var n=this.width+1,a=this.height+1,i=1,o=1,s=n,u=a,c=this.left,l=this.top,f=this.right,h=this.bottom;return f>e&&(s=-f+e+n,f=e),h>t&&(u=-h+t+a,h=t),c<1&&(u=2-c,c=1),l<1&&(u=2-l,l=1),{dy:o,edy:u,dx:i,edx:s,y:l,ey:h,x:c,ex:f,w:n,h:a}},r.prototype.calibrate=function(t){return new r({left:this.left+t.left*this.width,top:this.top+t.top*this.height,right:this.right+t.right*this.width,bottom:this.bottom+t.bottom*this.height}).toSquare().round()},r})();var Sn=(function(r){Q(t,r);function t(e,n,a,i,o){return o===void 0&&(o=!1),r.call(this,{left:e,top:n,right:a,bottom:i},o)||this}return t})(xt);var bo=(function(){function r(t,e,n,a,i){this._imageDims=new hr(i.width,i.height),this._score=t,this._classScore=e,this._className=n,this._box=new xt(a).rescale(this._imageDims)}return Object.defineProperty(r.prototype,"score",{get:function(){return this._score},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"classScore",{get:function(){return this._classScore},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"className",{get:function(){return this._className},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"box",{get:function(){return this._box},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"imageDims",{get:function(){return this._imageDims},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"imageWidth",{get:function(){return this.imageDims.width},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"imageHeight",{get:function(){return this.imageDims.height},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"relativeBox",{get:function(){return new xt(this._box).rescale(this.imageDims.reverse())},enumerable:!0,configurable:!0}),r.prototype.forSize=function(t,e){return new r(this.score,this.classScore,this.className,this.relativeBox,{width:t,height:e})},r})();var Ze=(function(r){Q(t,r);function t(e,n,a){return r.call(this,e,e,"",n,a)||this}return t.prototype.forSize=function(e,n){var a=r.prototype.forSize.call(this,e,n),i=a.score,o=a.relativeBox,s=a.imageDims;return new t(i,o,s)},t})(bo);function zh(r,t,e){e===void 0&&(e=!0);var n=Math.max(0,Math.min(r.right,t.right)-Math.max(r.left,t.left)),a=Math.max(0,Math.min(r.bottom,t.bottom)-Math.max(r.top,t.top)),i=n*a;return e?i/(r.area+t.area-i):i/Math.min(r.area,t.area)}function Wh(r){var t=r.map(function(s){return s.x}),e=r.map(function(s){return s.y}),n=t.reduce(function(s,u){return u<s?u:s},1/0),a=e.reduce(function(s,u){return u<s?u:s},1/0),i=t.reduce(function(s,u){return s<u?u:s},0),o=e.reduce(function(s,u){return s<u?u:s},0);return new Sn(n,a,i,o)}function Or(r,t,e,n){n===void 0&&(n=!0);for(var a=t.map(function(s,u){return{score:s,boxIndex:u}}).sort(function(s,u){return s.score-u.score}).map(function(s){return s.boxIndex}),i=[],o=function(){var s=a.pop();i.push(s);for(var u=a,c=[],l=0;l<u.length;l++){var f=u[l],h=r[s],d=r[f];c.push(zh(h,d,n))}a=a.filter(function(p,v){return c[v]<=e})};a.length>0;)o();return i}function Ar(r,t){return V(function(){var e=t[0],n=t[1],a=t[2],i=Qt(Cn(r.shape.slice(0,3),[1]),e),o=Qt(Cn(r.shape.slice(0,3),[1]),n),s=Qt(Cn(r.shape.slice(0,3),[1]),a),u=Ge([i,o,s],3);return Pe(r,u)})}function Vh(r,t){return t===void 0&&(t=!1),V(function(){var e=r.shape.slice(1),n=e[0],a=e[1];if(n===a)return r;var i=Math.abs(n-a),o=Math.round(i*(t?.5:1)),s=n>a?2:1,u=function(d){var p=r.shape.slice();return p[s]=d,Qt(p,0)},c=u(o),l=i-c.shape[s],f=t&&l?u(l):null,h=[f,r,c].filter(function(d){return!!d}).map(function(d){return d.toFloat()});return Ge(h,s)})}function Ao(r){return 1/(1+Math.exp(-r))}var ta=(function(r){Q(t,r);function t(e,n,a,i,o){return o===void 0&&(o=!1),r.call(this,{x:e,y:n,width:a,height:i},o)||this}return t})(xt);var $x=.5,ey=.43,ty=.45,Lr=(function(){function r(t,e,n){n===void 0&&(n=new de(0,0));var a=e.width,i=e.height;this._imgDims=new hr(a,i),this._shift=n,this._positions=t.map(function(o){return o.mul(new de(a,i)).add(n)})}return Object.defineProperty(r.prototype,"shift",{get:function(){return new de(this._shift.x,this._shift.y)},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"imageWidth",{get:function(){return this._imgDims.width},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"imageHeight",{get:function(){return this._imgDims.height},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"positions",{get:function(){return this._positions},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"relativePositions",{get:function(){var t=this;return this._positions.map(function(e){return e.sub(t._shift).div(new de(t.imageWidth,t.imageHeight))})},enumerable:!0,configurable:!0}),r.prototype.forSize=function(t,e){return new this.constructor(this.relativePositions,{width:t,height:e})},r.prototype.shiftBy=function(t,e){return new this.constructor(this.relativePositions,this._imgDims,new de(t,e))},r.prototype.shiftByPoint=function(t){return this.shiftBy(t.x,t.y)},r.prototype.align=function(t,e){if(e===void 0&&(e={}),t){var n=t instanceof Ze?t.box.floor():new xt(t);return this.shiftBy(n.x,n.y).align(null,e)}var a=Object.assign({},{useDlibAlignment:!1,minBoxPadding:.2},e),i=a.useDlibAlignment,o=a.minBoxPadding;return i?this.alignDlib():this.alignMinBbox(o)},r.prototype.alignDlib=function(){var t=this.getRefPointsForAlignment(),e=t[0],n=t[1],a=t[2],i=function(f){return a.sub(f).magnitude()},o=(i(e)+i(n))/2,s=Math.floor(o/ty),u=ea(t),c=Math.floor(Math.max(0,u.x-$x*s)),l=Math.floor(Math.max(0,u.y-ey*s));return new ta(c,l,Math.min(s,this.imageWidth+c),Math.min(s,this.imageHeight+l))},r.prototype.alignMinBbox=function(t){var e=Wh(this.positions);return e.pad(e.width*t,e.height*t)},r.prototype.getRefPointsForAlignment=function(){throw new Error("getRefPointsForAlignment not implemented by base class")},r})();var Xh=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.getRefPointsForAlignment=function(){var e=this.positions;return[e[0],e[1],ea([e[3],e[4]])]},t})(Lr);var Eo=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.getJawOutline=function(){return this.positions.slice(0,17)},t.prototype.getLeftEyeBrow=function(){return this.positions.slice(17,22)},t.prototype.getRightEyeBrow=function(){return this.positions.slice(22,27)},t.prototype.getNose=function(){return this.positions.slice(27,36)},t.prototype.getLeftEye=function(){return this.positions.slice(36,42)},t.prototype.getRightEye=function(){return this.positions.slice(42,48)},t.prototype.getMouth=function(){return this.positions.slice(48,68)},t.prototype.getRefPointsForAlignment=function(){return[this.getLeftEye(),this.getRightEye(),this.getMouth()].map(ea)},t})(Lr);var _u=(function(){function r(t,e){this._label=t,this._distance=e}return Object.defineProperty(r.prototype,"label",{get:function(){return this._label},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"distance",{get:function(){return this._distance},enumerable:!0,configurable:!0}),r.prototype.toString=function(t){return t===void 0&&(t=!0),""+this.label+(t?" ("+yo(this.distance)+")":"")},r})();var Pu=(function(r){Q(t,r);function t(e,n){var a=r.call(this,e)||this;return a._label=n,a}return t.assertIsValidLabeledBox=function(e,n){if(xt.assertIsValidBox(e,n),!br(e.label))throw new Error(n+" - expected property label ("+e.label+") to be a number")},Object.defineProperty(t.prototype,"label",{get:function(){return this._label},enumerable:!0,configurable:!0}),t})(xt);var ri=(function(){function r(t,e){if(typeof t!="string")throw new Error("LabeledFaceDescriptors - constructor expected label to be a string");if(!Array.isArray(e)||e.some(function(n){return!(n instanceof Float32Array)}))throw new Error("LabeledFaceDescriptors - constructor expected descriptors to be an array of Float32Array");this._label=t,this._descriptors=e}return Object.defineProperty(r.prototype,"label",{get:function(){return this._label},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"descriptors",{get:function(){return this._descriptors},enumerable:!0,configurable:!0}),r.prototype.toJSON=function(){return{label:this.label,descriptors:this.descriptors.map(function(t){return Array.from(t)})}},r.fromJSON=function(t){var e=t.descriptors.map(function(n){return new Float32Array(n)});return new r(t.label,e)},r})();var p2=(function(r){Q(t,r);function t(e,n,a,i){var o=r.call(this,e,n)||this;return o._score=a,o._classScore=i,o}return t.assertIsValidPredictedBox=function(e,n){if(Pu.assertIsValidLabeledBox(e,n),!wo(e.score)||!wo(e.classScore))throw new Error(n+" - expected properties score ("+e.score+") and ("+e.classScore+") to be a number between [0, 1]")},Object.defineProperty(t.prototype,"score",{get:function(){return this._score},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"classScore",{get:function(){return this._classScore},enumerable:!0,configurable:!0}),t})(Pu);function ni(r){return r.detection instanceof Ze}function ra(r,t){var e={detection:t};return Object.assign({},r,e)}function Fu(){var r=window.fetch||function(){throw new Error("fetch - missing fetch implementation for browser environment")},t=function(){throw new Error("readFile - filesystem not available for browser environment")};return{Canvas:HTMLCanvasElement,CanvasRenderingContext2D,Image:HTMLImageElement,ImageData,Video:HTMLVideoElement,createCanvasElement:function(){return document.createElement("canvas")},createImageElement:function(){return document.createElement("img")},fetch:r,readFile:t}}function Co(r){var t="";if(!r)try{r=Zo("fs")}catch(n){t=n.toString()}var e=r?function(n){return new Promise(function(a,i){r.readFile(n,function(o,s){return o?i(o):a(s)})})}:function(){throw new Error("readFile - failed to require fs in nodejs environment with error: "+t)};return{readFile:e}}function ku(){var r=global.Canvas||global.HTMLCanvasElement,t=global.Image||global.HTMLImageElement,e=function(){if(r)return new r;throw new Error("createCanvasElement - missing Canvas implementation for nodejs environment")},n=function(){if(t)return new t;throw new Error("createImageElement - missing Image implementation for nodejs environment")},a=global.fetch||function(){throw new Error("fetch - missing fetch implementation for nodejs environment")},i=Co();return tt({Canvas:r||(function(){function o(){}return o})(),CanvasRenderingContext2D:global.CanvasRenderingContext2D||(function(){function o(){}return o})(),Image:t||(function(){function o(){}return o})(),ImageData:global.ImageData||(function(){function o(){}return o})(),Video:global.HTMLVideoElement||(function(){function o(){}return o})(),createCanvasElement:e,createImageElement:n,fetch:a},i)}function Nu(){return typeof window=="object"&&typeof document<"u"&&typeof HTMLImageElement<"u"&&typeof HTMLCanvasElement<"u"&&typeof HTMLVideoElement<"u"&&typeof ImageData<"u"&&typeof CanvasRenderingContext2D<"u"}function Ou(){return typeof global=="object"&&typeof Zo=="function"&&typeof module<"u"&&typeof process<"u"&&!!process.version}var it;function ry(){if(!it)throw new Error("getEnv - environment is not defined, check isNodejs() and isBrowser()");return it}function Lu(r){it=r}function Uu(){Nu()&&Lu(Fu()),Ou()&&Lu(ku())}function ny(r){if(it||Uu(),!it)throw new Error("monkeyPatch - environment is not defined, check isNodejs() and isBrowser()");var t=r.Canvas,e=t===void 0?it.Canvas:t,n=r.Image,a=n===void 0?it.Image:n;it.Canvas=e,it.Image=a,it.createCanvasElement=r.createCanvasElement||(function(){return new e}),it.createImageElement=r.createImageElement||(function(){return new a}),it.ImageData=r.ImageData||it.ImageData,it.Video=r.Video||it.Video,it.fetch=r.fetch||it.fetch,it.readFile=r.readFile||it.readFile}var Te={getEnv:ry,setEnv:Lu,initialize:Uu,createBrowserEnv:Fu,createFileSystem:Co,createNodejsEnv:ku,monkeyPatch:ny,isBrowser:Nu,isNodejs:Ou};Uu();function na(r){return!Te.isNodejs()&&typeof r=="string"?document.getElementById(r):r}function yt(r){var t=Te.getEnv(),e=t.Canvas,n=t.CanvasRenderingContext2D;if(r instanceof n)return r;var a=na(r);if(!(a instanceof e))throw new Error("resolveContext2d - expected canvas to be of instance of Canvas");var i=a.getContext("2d");if(!i)throw new Error("resolveContext2d - canvas 2d context is null");return i}var Ur;(function(r){r.TOP_LEFT="TOP_LEFT",r.TOP_RIGHT="TOP_RIGHT",r.BOTTOM_LEFT="BOTTOM_LEFT",r.BOTTOM_RIGHT="BOTTOM_RIGHT"})(Ur||(Ur={}));var Gu=(function(){function r(t){t===void 0&&(t={});var e=t.anchorPosition,n=t.backgroundColor,a=t.fontColor,i=t.fontSize,o=t.fontStyle,s=t.padding;this.anchorPosition=e||Ur.TOP_LEFT,this.backgroundColor=n||"rgba(0, 0, 0, 0.5)",this.fontColor=a||"rgba(255, 255, 255, 1)",this.fontSize=i||14,this.fontStyle=o||"Georgia",this.padding=s||4}return r})();var Hu=(function(){function r(t,e,n){n===void 0&&(n={}),this.text=typeof t=="string"?[t]:t instanceof r?t.text:t,this.anchor=e,this.options=new Gu(n)}return r.prototype.measureWidth=function(t){var e=this.options.padding;return this.text.map(function(n){return t.measureText(n).width}).reduce(function(n,a){return n<a?a:n},0)+2*e},r.prototype.measureHeight=function(){var t=this.options,e=t.fontSize,n=t.padding;return this.text.length*e+2*n},r.prototype.getUpperLeft=function(t,e){var n=this.options.anchorPosition,a=n===Ur.BOTTOM_RIGHT||n===Ur.TOP_RIGHT,i=n===Ur.BOTTOM_LEFT||n===Ur.BOTTOM_RIGHT,o=this.measureWidth(t),s=this.measureHeight(),u=a?this.anchor.x-o:this.anchor.x,c=i?this.anchor.y-s:this.anchor.y;if(e){var l=e.width,f=e.height,h=Math.max(Math.min(u,l-o),0),d=Math.max(Math.min(c,f-s),0);return{x:h,y:d}}return{x:u,y:c}},r.prototype.draw=function(t){var e=na(t),n=yt(e),a=this.options,i=a.backgroundColor,o=a.fontColor,s=a.fontSize,u=a.fontStyle,c=a.padding;n.font=s+"px "+u;var l=this.measureWidth(n),f=this.measureHeight();n.fillStyle=i;var h=this.getUpperLeft(n,e);n.fillRect(h.x,h.y,l,f),n.fillStyle=o,this.text.forEach(function(d,p){var v=c+h.x,m=c+h.y+(p+1)*s;n.fillText(d,v,m)})},r})();var ay=(function(){function r(t){t===void 0&&(t={});var e=t.boxColor,n=t.lineWidth,a=t.label,i=t.drawLabelOptions;this.boxColor=e||"rgba(0, 0, 255, 1)",this.lineWidth=n||2,this.label=a;var o={anchorPosition:Ur.BOTTOM_LEFT,backgroundColor:this.boxColor};this.drawLabelOptions=new Gu(Object.assign({},o,i))}return r})();var iy=(function(){function r(t,e){e===void 0&&(e={}),this.box=new xt(t),this.options=new ay(e)}return r.prototype.draw=function(t){var e=yt(t),n=this.options,a=n.boxColor,i=n.lineWidth,o=this.box,s=o.x,u=o.y,c=o.width,l=o.height;e.strokeStyle=a,e.lineWidth=i,e.strokeRect(s,u,c,l);var f=this.options.label;f&&new Hu([f],{x:s-i/2,y:u},this.options.drawLabelOptions).draw(t)},r})();function So(r){var t=Te.getEnv(),e=t.Image,n=t.Video;return r instanceof e&&r.complete||r instanceof n&&r.readyState>=3}function Kh(r){return new Promise(function(t,e){if(r instanceof Te.getEnv().Canvas||So(r))return t();function n(i){i.currentTarget&&(i.currentTarget.removeEventListener("load",n),i.currentTarget.removeEventListener("error",a),t(i))}function a(i){i.currentTarget&&(i.currentTarget.removeEventListener("load",n),i.currentTarget.removeEventListener("error",a),e(i))}r.addEventListener("load",n),r.addEventListener("error",a)})}function ai(r){var t=Te.getEnv(),e=t.Image,n=t.Video;return r instanceof e?new hr(r.naturalWidth,r.naturalHeight):r instanceof n?new hr(r.videoWidth,r.videoHeight):new hr(r.width,r.height)}function Dn(r){var t=r.width,e=r.height,n=Te.getEnv().createCanvasElement,a=n();return a.width=t,a.height=e,a}function aa(r,t){var e=Te.getEnv().ImageData;if(!(r instanceof e)&&!So(r))throw new Error("createCanvasFromMedia - media has not finished loading yet");var n=t||ai(r),a=n.width,i=n.height,o=Dn({width:a,height:i});return r instanceof e?yt(o).putImageData(r,0,0):yt(o).drawImage(r,0,0,a,i),o}function jh(r,t){return K(this,void 0,void 0,function(){var e,n,a,i,o,s;return j(this,function(u){switch(u.label){case 0:return e=t||Te.getEnv().createCanvasElement(),n=r.shape.slice(tr(r)?1:0),a=n[0],i=n[1],o=n[2],s=V(function(){return r.as3D(a,i,o).toInt()}),[4,$n.toPixels(s,e)];case 1:return u.sent(),s.dispose(),[2,e]}})})}function zu(r){var t=Te.getEnv(),e=t.Image,n=t.Canvas,a=t.Video;return r instanceof e||r instanceof n||r instanceof a}function Yh(r,t,e){e===void 0&&(e=!1);var n=Te.getEnv(),a=n.Image,i=n.Canvas;if(!(r instanceof a||r instanceof i))throw new Error("imageToSquare - expected arg0 to be HTMLImageElement | HTMLCanvasElement");var o=ai(r),s=t/Math.max(o.height,o.width),u=s*o.width,c=s*o.height,l=Dn({width:t,height:t}),f=r instanceof i?r:aa(r),h=Math.abs(u-c)/2,d=e&&u<c?h:0,p=e&&c<u?h:0;return yt(l).drawImage(f,d,p,u,c),l}var Tn=(function(){function r(t,e){var n=this;if(e===void 0&&(e=!1),this._imageTensors=[],this._canvases=[],this._treatAsBatchInput=!1,this._inputDimensions=[],!Array.isArray(t))throw new Error("NetInput.constructor - expected inputs to be an Array of TResolvedNetInput or to be instanceof tf.Tensor4D, instead have "+t);this._treatAsBatchInput=e,this._batchSize=t.length,t.forEach(function(a,i){if($r(a)){n._imageTensors[i]=a,n._inputDimensions[i]=a.shape;return}if(tr(a)){var o=a.shape[0];if(o!==1)throw new Error("NetInput - tf.Tensor4D with batchSize "+o+" passed, but not supported in input array");n._imageTensors[i]=a,n._inputDimensions[i]=a.shape.slice(1);return}var s=a instanceof Te.getEnv().Canvas?a:aa(a);n._canvases[i]=s,n._inputDimensions[i]=[s.height,s.width,3]})}return Object.defineProperty(r.prototype,"imageTensors",{get:function(){return this._imageTensors},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"canvases",{get:function(){return this._canvases},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"isBatchInput",{get:function(){return this.batchSize>1||this._treatAsBatchInput},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"batchSize",{get:function(){return this._batchSize},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"inputDimensions",{get:function(){return this._inputDimensions},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"inputSize",{get:function(){return this._inputSize},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"reshapedInputDimensions",{get:function(){var t=this;return Nr(this.batchSize,0,1).map(function(e,n){return t.getReshapedInputDimensions(n)})},enumerable:!0,configurable:!0}),r.prototype.getInput=function(t){return this.canvases[t]||this.imageTensors[t]},r.prototype.getInputDimensions=function(t){return this._inputDimensions[t]},r.prototype.getInputHeight=function(t){return this._inputDimensions[t][0]},r.prototype.getInputWidth=function(t){return this._inputDimensions[t][1]},r.prototype.getReshapedInputDimensions=function(t){if(typeof this.inputSize!="number")throw new Error("getReshapedInputDimensions - inputSize not set, toBatchTensor has not been called yet");var e=this.getInputWidth(t),n=this.getInputHeight(t);return Hh({width:e,height:n},this.inputSize)},r.prototype.toBatchTensor=function(t,e){var n=this;return e===void 0&&(e=!0),this._inputSize=t,V(function(){var a=Nr(n.batchSize,0,1).map(function(o){var s=n.getInput(o);if(s instanceof _e){var u=tr(s)?s:s.expandDims();return u=Vh(u,e),(u.shape[1]!==t||u.shape[2]!==t)&&(u=$a.resizeBilinear(u,[t,t])),u.as3D(t,t,3)}if(s instanceof Te.getEnv().Canvas)return $n.fromPixels(Yh(s,t,e));throw new Error("toBatchTensor - at batchIdx "+o+", expected input to be instanceof tf.Tensor or instanceof HTMLCanvasElement, instead have "+s)}),i=gt(a.map(function(o){return o.toFloat()})).as4D(n.batchSize,t,t,3);return i})},r})();function Be(r){return K(this,void 0,void 0,function(){var t,e,n;return j(this,function(a){switch(a.label){case 0:if(r instanceof Tn)return[2,r];if(t=Array.isArray(r)?r:[r],!t.length)throw new Error("toNetInput - empty array passed as input");return e=function(i){return Array.isArray(r)?" at input index "+i+":":""},n=t.map(na),n.forEach(function(i,o){if(!zu(i)&&!$r(i)&&!tr(i))throw typeof t[o]=="string"?new Error("toNetInput -"+e(o)+" string passed, but could not resolve HTMLElement for element id "+t[o]):new Error("toNetInput -"+e(o)+" expected media to be of type HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | tf.Tensor3D, or to be an element id");if(tr(i)){var s=i.shape[0];if(s!==1)throw new Error("toNetInput -"+e(o)+" tf.Tensor4D with batchSize "+s+" passed, but not supported in input array")}}),[4,Promise.all(n.map(function(i){return zu(i)&&Kh(i)}))];case 1:return a.sent(),[2,new Tn(n,Array.isArray(r))]}})})}function ii(r,t){return K(this,void 0,void 0,function(){var e,n,a,i,o,s,u;return j(this,function(c){switch(c.label){case 0:return e=Te.getEnv().Canvas,n=r,r instanceof e?[3,5]:[4,Be(r)];case 1:if(a=c.sent(),a.batchSize>1)throw new Error("extractFaces - batchSize > 1 not supported");return i=a.getInput(0),i instanceof e?(o=i,[3,4]):[3,2];case 2:return[4,jh(i)];case 3:o=c.sent(),c.label=4;case 4:n=o,c.label=5;case 5:return s=yt(n),u=t.map(function(l){return l instanceof Ze?l.forSize(n.width,n.height).box.floor():l}).map(function(l){return l.clipAtImageBorders(n.width,n.height)}),[2,u.map(function(l){var f=l.x,h=l.y,d=l.width,p=l.height,v=Dn({width:d,height:p});return yt(v).putImageData(s.getImageData(f,h,d,p),0,0),v})]}})})}function oi(r,t){return K(this,void 0,void 0,function(){return j(this,function(e){if(!$r(r)&&!tr(r))throw new Error("extractFaceTensors - expected image tensor to be 3D or 4D");if(tr(r)&&r.shape[0]>1)throw new Error("extractFaceTensors - batchSize > 1 not supported");return[2,V(function(){var n=r.shape.slice(tr(r)?1:0),a=n[0],i=n[1],o=n[2],s=t.map(function(c){return c instanceof Ze?c.forSize(i,a).box:c}).map(function(c){return c.clipAtImageBorders(i,a)}),u=s.map(function(c){var l=c.x,f=c.y,h=c.width,d=c.height;return xu(r.as3D(a,i,o),[f,l,0],[d,h,o])});return u})]})})}function Do(r,t){return K(this,void 0,void 0,function(){var e,n;return j(this,function(a){switch(a.label){case 0:return e=Te.getEnv().fetch,[4,e(r,t)];case 1:if(n=a.sent(),!(n.status<400))throw new Error("failed to fetch: ("+n.status+") "+n.statusText+", from url: "+n.url);return[2,n]}})})}function Qh(r){return K(this,void 0,void 0,function(){return j(this,function(t){switch(t.label){case 0:return[4,Do(r)];case 1:return[2,t.sent().json()]}})})}function To(r,t){var e=t+"-weights_manifest.json";if(!r)return{modelBaseUri:"",manifestUri:e};if(r==="/")return{modelBaseUri:"/",manifestUri:"/"+e};var n=r.startsWith("http://")?"http://":r.startsWith("https://")?"https://":"";r=r.replace(n,"");var a=r.split("/").filter(function(s){return s}),i=r.endsWith(".json")?a[a.length-1]:e,o=n+(r.endsWith(".json")?a.slice(0,a.length-1):a).join("/");return o=r.startsWith("/")?"/"+o:o,{modelBaseUri:o,manifestUri:o==="/"?"/"+i:o+"/"+i}}function qh(r,t){return K(this,void 0,void 0,function(){var e,n,a,i;return j(this,function(o){switch(o.label){case 0:return e=To(r,t),n=e.manifestUri,a=e.modelBaseUri,[4,Qh(n)];case 1:return i=o.sent(),[2,xo.loadWeights(i,a)]}})})}var lt=(function(){function r(t){this._name=t,this._params=void 0,this._paramMappings=[]}return Object.defineProperty(r.prototype,"params",{get:function(){return this._params},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"paramMappings",{get:function(){return this._paramMappings},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"isLoaded",{get:function(){return!!this.params},enumerable:!0,configurable:!0}),r.prototype.getParamFromPath=function(t){var e=this.traversePropertyPath(t),n=e.obj,a=e.objProp;return n[a]},r.prototype.reassignParamFromPath=function(t,e){var n=this.traversePropertyPath(t),a=n.obj,i=n.objProp;a[i].dispose(),a[i]=e},r.prototype.getParamList=function(){var t=this;return this._paramMappings.map(function(e){var n=e.paramPath;return{path:n,tensor:t.getParamFromPath(n)}})},r.prototype.getTrainableParams=function(){return this.getParamList().filter(function(t){return t.tensor instanceof mn})},r.prototype.getFrozenParams=function(){return this.getParamList().filter(function(t){return!(t.tensor instanceof mn)})},r.prototype.variable=function(){var t=this;this.getFrozenParams().forEach(function(e){var n=e.path,a=e.tensor;t.reassignParamFromPath(n,a.variable())})},r.prototype.freeze=function(){var t=this;this.getTrainableParams().forEach(function(e){var n=e.path,a=e.tensor,i=ut(a.dataSync());a.dispose(),t.reassignParamFromPath(n,i)})},r.prototype.dispose=function(t){t===void 0&&(t=!0),this.getParamList().forEach(function(e){if(t&&e.tensor.isDisposed)throw new Error("param tensor has already been disposed for path "+e.path);e.tensor.dispose()}),this._params=void 0},r.prototype.serializeParams=function(){return new Float32Array(this.getParamList().map(function(t){var e=t.tensor;return Array.from(e.dataSync())}).reduce(function(t,e){return t.concat(e)}))},r.prototype.load=function(t){return K(this,void 0,void 0,function(){return j(this,function(e){switch(e.label){case 0:return t instanceof Float32Array?(this.extractWeights(t),[2]):[4,this.loadFromUri(t)];case 1:return e.sent(),[2]}})})},r.prototype.loadFromUri=function(t){return K(this,void 0,void 0,function(){var e;return j(this,function(n){switch(n.label){case 0:if(t&&typeof t!="string")throw new Error(this._name+".loadFromUri - expected model uri");return[4,qh(t,this.getDefaultModelName())];case 1:return e=n.sent(),this.loadFromWeightMap(e),[2]}})})},r.prototype.loadFromDisk=function(t){return K(this,void 0,void 0,function(){var e,n,a,i,o,s,u,c,l,f;return j(this,function(h){switch(h.label){case 0:if(t&&typeof t!="string")throw new Error(this._name+".loadFromDisk - expected model file path");return e=Te.getEnv().readFile,n=To(t,this.getDefaultModelName()),a=n.manifestUri,i=n.modelBaseUri,o=function(d){return Promise.all(d.map(function(p){return e(p).then(function(v){return v.buffer})}))},s=xo.weightsLoaderFactory(o),l=(c=JSON).parse,[4,e(a)];case 1:return u=l.apply(c,[h.sent().toString()]),[4,s(u,i)];case 2:return f=h.sent(),this.loadFromWeightMap(f),[2]}})})},r.prototype.loadFromWeightMap=function(t){var e=this.extractParamsFromWeigthMap(t),n=e.paramMappings,a=e.params;this._paramMappings=n,this._params=a},r.prototype.extractWeights=function(t){var e=this.extractParams(t),n=e.paramMappings,a=e.params;this._paramMappings=n,this._params=a},r.prototype.traversePropertyPath=function(t){if(!this.params)throw new Error("traversePropertyPath - model has no loaded params");var e=t.split("/").reduce(function(i,o){if(!i.nextObj.hasOwnProperty(o))throw new Error("traversePropertyPath - object does not have property "+o+", for path "+t);return{obj:i.nextObj,objProp:o,nextObj:i.nextObj[o]}},{nextObj:this.params}),n=e.obj,a=e.objProp;if(!n||!a||!(n[a]instanceof _e))throw new Error("traversePropertyPath - parameter is not a tensor, for path "+t);return{obj:n,objProp:a}},r})();function Pt(r,t,e){return V(function(){var n=Za(r,t.depthwise_filter,t.pointwise_filter,e,"same");return n=ie(n,t.bias),n})}function Io(r,t,e){return e===void 0&&(e=!1),V(function(){var n=Re(e?ie(ct(r,t.conv0.filters,[2,2],"same"),t.conv0.bias):Pt(r,t.conv0,[2,2])),a=Pt(n,t.conv1,[1,1]),i=Re(ie(n,a)),o=Pt(i,t.conv2,[1,1]);return Re(ie(n,ie(a,o)))})}function si(r,t,e,n){return e===void 0&&(e=!1),n===void 0&&(n=!0),V(function(){var a=Re(e?ie(ct(r,t.conv0.filters,n?[2,2]:[1,1],"same"),t.conv0.bias):Pt(r,t.conv0,n?[2,2]:[1,1])),i=Pt(a,t.conv1,[1,1]),o=Re(ie(a,i)),s=Pt(o,t.conv2,[1,1]),u=Re(ie(a,ie(i,s))),c=Pt(u,t.conv3,[1,1]);return Re(ie(a,ie(i,ie(s,c))))})}function Dt(r,t,e,n){return e===void 0&&(e="same"),n===void 0&&(n=!1),V(function(){var a=ie(ct(r,t.filters,[1,1],e),t.bias);return n?Re(a):a})}function ft(r,t){Object.keys(r).forEach(function(e){t.some(function(n){return n.originalPath===e})||r[e].dispose()})}function en(r,t){return function(e,n,a,i){var o=at(r(e*n*a*a),[a,a,e,n]),s=Fe(r(n));return t.push({paramPath:i+"/filters"},{paramPath:i+"/bias"}),{filters:o,bias:s}}}function ia(r,t){return function(e,n,a){var i=xr(r(e*n),[e,n]),o=Fe(r(n));return t.push({paramPath:a+"/weights"},{paramPath:a+"/bias"}),{weights:i,bias:o}}}var Wu=(function(){function r(t,e,n){this.depthwise_filter=t,this.pointwise_filter=e,this.bias=n}return r})();function oa(r,t){return function(e,n,a){var i=at(r(9*e),[3,3,e,1]),o=at(r(e*n),[1,1,e,n]),s=Fe(r(n));return t.push({paramPath:a+"/depthwise_filter"},{paramPath:a+"/pointwise_filter"},{paramPath:a+"/bias"}),new Wu(i,o,s)}}function sa(r){return function(t){var e=r(t+"/depthwise_filter",4),n=r(t+"/pointwise_filter",4),a=r(t+"/bias",1);return new Wu(e,n,a)}}function Tt(r,t){return function(e,n,a){var i=r[e];if(!ti(i,n))throw new Error("expected weightMap["+e+"] to be a Tensor"+n+"D, instead have "+i);return t.push({originalPath:e,paramPath:a||e}),i}}function ht(r){var t=r;function e(a){var i=t.slice(0,a);return t=t.slice(a),i}function n(){return t}return{extractWeights:e,getRemainingWeights:n}}function Ro(r,t){var e=en(r,t),n=oa(r,t);function a(o,s,u,c){c===void 0&&(c=!1);var l=c?e(o,s,3,u+"/conv0"):n(o,s,u+"/conv0"),f=n(s,s,u+"/conv1"),h=n(s,s,u+"/conv2");return{conv0:l,conv1:f,conv2:h}}function i(o,s,u,c){c===void 0&&(c=!1);var l=a(o,s,u,c),f=l.conv0,h=l.conv1,d=l.conv2,p=n(s,s,u+"/conv3");return{conv0:f,conv1:h,conv2:d,conv3:p}}return{extractDenseBlock3Params:a,extractDenseBlock4Params:i}}function Zh(r){var t=[],e=ht(r),n=e.extractWeights,a=e.getRemainingWeights,i=Ro(n,t).extractDenseBlock4Params,o=i(3,32,"dense0",!0),s=i(32,64,"dense1"),u=i(64,128,"dense2"),c=i(128,256,"dense3");if(a().length!==0)throw new Error("weights remaing after extract: "+a().length);return{paramMappings:t,params:{dense0:o,dense1:s,dense2:u,dense3:c}}}function Mo(r){return function(t){var e=r(t+"/filters",4),n=r(t+"/bias",1);return{filters:e,bias:n}}}function Bo(r,t){var e=Tt(r,t),n=Mo(e),a=sa(e);function i(s,u){u===void 0&&(u=!1);var c=u?n(s+"/conv0"):a(s+"/conv0"),l=a(s+"/conv1"),f=a(s+"/conv2");return{conv0:c,conv1:l,conv2:f}}function o(s,u){u===void 0&&(u=!1);var c=u?n(s+"/conv0"):a(s+"/conv0"),l=a(s+"/conv1"),f=a(s+"/conv2"),h=a(s+"/conv3");return{conv0:c,conv1:l,conv2:f,conv3:h}}return{extractDenseBlock3Params:i,extractDenseBlock4Params:o}}function Jh(r){var t=[],e=Bo(r,t).extractDenseBlock4Params,n={dense0:e("dense0",!0),dense1:e("dense1"),dense2:e("dense2"),dense3:e("dense3")};return ft(r,t),{params:n,paramMappings:t}}var _o=(function(r){Q(t,r);function t(){return r.call(this,"FaceFeatureExtractor")||this}return t.prototype.forwardInput=function(e){var n=this.params;if(!n)throw new Error("FaceFeatureExtractor - load model before inference");return V(function(){var a=e.toBatchTensor(112,!0),i=[122.782,117.001,104.298],o=Ar(a,i).div(Y(255)),s=si(o,n.dense0,!0);return s=si(s,n.dense1),s=si(s,n.dense2),s=si(s,n.dense3),s=Fr(s,[7,7],[2,2],"valid"),s})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.getDefaultModelName=function(){return"face_feature_extractor_model"},t.prototype.extractParamsFromWeigthMap=function(e){return Jh(e)},t.prototype.extractParams=function(e){return Zh(e)},t})(lt);function Lt(r,t){return V(function(){return ie(Jn(r,t.weights),t.bias)})}function $h(r,t,e){var n=[],a=ht(r),i=a.extractWeights,o=a.getRemainingWeights,s=ia(i,n),u=s(t,e,"fc");if(o().length!==0)throw new Error("weights remaing after extract: "+o().length);return{paramMappings:n,params:{fc:u}}}function ed(r){var t=[],e=Tt(r,t);function n(i){var o=e(i+"/weights",2),s=e(i+"/bias",1);return{weights:o,bias:s}}var a={fc:n("fc")};return ft(r,t),{params:a,paramMappings:t}}function Po(r){var t={},e={};return Object.keys(r).forEach(function(n){var a=n.startsWith("fc")?e:t;a[n]=r[n]}),{featureExtractorMap:t,classifierMap:e}}var Fo=(function(r){Q(t,r);function t(e,n){var a=r.call(this,e)||this;return a._faceFeatureExtractor=n,a}return Object.defineProperty(t.prototype,"faceFeatureExtractor",{get:function(){return this._faceFeatureExtractor},enumerable:!0,configurable:!0}),t.prototype.runNet=function(e){var n=this,a=this.params;if(!a)throw new Error(this._name+" - load model before inference");return V(function(){var i=e instanceof Tn?n.faceFeatureExtractor.forwardInput(e):e;return Lt(i.as2D(i.shape[0],-1),a.fc)})},t.prototype.dispose=function(e){e===void 0&&(e=!0),this.faceFeatureExtractor.dispose(e),r.prototype.dispose.call(this,e)},t.prototype.loadClassifierParams=function(e){var n=this.extractClassifierParams(e),a=n.params,i=n.paramMappings;this._params=a,this._paramMappings=i},t.prototype.extractClassifierParams=function(e){return $h(e,this.getClassifierChannelsIn(),this.getClassifierChannelsOut())},t.prototype.extractParamsFromWeigthMap=function(e){var n=Po(e),a=n.featureExtractorMap,i=n.classifierMap;return this.faceFeatureExtractor.loadFromWeightMap(a),ed(i)},t.prototype.extractParams=function(e){var n=this.getClassifierChannelsIn(),a=this.getClassifierChannelsOut(),i=a*n+a,o=e.slice(0,e.length-i),s=e.slice(e.length-i);return this.faceFeatureExtractor.extractWeights(o),this.extractClassifierParams(s)},t})(lt);var td=["neutral","happy","sad","angry","fearful","disgusted","surprised"],ko=(function(){function r(t){var e=this;if(t.length!==7)throw new Error("FaceExpressions.constructor - expected probabilities.length to be 7, have: "+t.length);td.forEach(function(n,a){e[n]=t[a]})}return r.prototype.asSortedArray=function(){var t=this;return td.map(function(e){return{expression:e,probability:t[e]}}).sort(function(e,n){return n.probability-e.probability})},r})();var rd=(function(r){Q(t,r);function t(e){return e===void 0&&(e=new _o),r.call(this,"FaceExpressionNet",e)||this}return t.prototype.forwardInput=function(e){var n=this;return V(function(){return _t(n.runNet(e))})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.predictExpressions=function(e){return K(this,void 0,void 0,function(){var n,a,i,o,s=this;return j(this,function(u){switch(u.label){case 0:return[4,Be(e)];case 1:return n=u.sent(),[4,this.forwardInput(n)];case 2:return a=u.sent(),[4,Promise.all(Me(a).map(function(c){return K(s,void 0,void 0,function(){var l;return j(this,function(f){switch(f.label){case 0:return[4,c.data()];case 1:return l=f.sent(),c.dispose(),[2,l]}})})}))];case 3:return i=u.sent(),a.dispose(),o=i.map(function(c){return new ko(c)}),[2,n.isBatchInput?o:o[0]]}})})},t.prototype.getDefaultModelName=function(){return"face_expression_model"},t.prototype.getClassifierChannelsIn=function(){return 256},t.prototype.getClassifierChannelsOut=function(){return 7},t})(Fo);function Vu(r,t){var e={expressions:t};return Object.assign({},r,e)}function No(r){return ni(r)&&r.landmarks instanceof Lr&&r.unshiftedLandmarks instanceof Lr&&r.alignedRect instanceof Ze}function ua(r,t){var e=r.detection.box,n=t.shiftBy(e.x,e.y),a=n.align(),i=r.detection.imageDims,o=new Ze(r.detection.score,a.rescale(i.reverse()),i),s={landmarks:n,unshiftedLandmarks:t,alignedRect:o};return Object.assign({},r,s)}var oy=(function(){function r(t){t===void 0&&(t={});var e=t.drawLines,n=e===void 0?!0:e,a=t.drawPoints,i=a===void 0?!0:a,o=t.lineWidth,s=t.lineColor,u=t.pointSize,c=t.pointColor;this.drawLines=n,this.drawPoints=i,this.lineWidth=o||1,this.pointSize=u||2,this.lineColor=s||"rgba(0, 255, 255, 1)",this.pointColor=c||"rgba(255, 0, 255, 1)"}return r})();var _C=(function(){function r(t,e){e===void 0&&(e={}),this.faceLandmarks=t,this.options=new oy(e)}return r.prototype.draw=function(t){var e=yt(t),n=this.options,a=n.drawLines,i=n.drawPoints,o=n.lineWidth,s=n.lineColor,u=n.pointSize,c=n.pointColor;if(a&&this.faceLandmarks instanceof Eo&&(e.strokeStyle=s,e.lineWidth=o,Jr(e,this.faceLandmarks.getJawOutline()),Jr(e,this.faceLandmarks.getLeftEyeBrow()),Jr(e,this.faceLandmarks.getRightEyeBrow()),Jr(e,this.faceLandmarks.getNose()),Jr(e,this.faceLandmarks.getLeftEye(),!0),Jr(e,this.faceLandmarks.getRightEye(),!0),Jr(e,this.faceLandmarks.getMouth(),!0)),i){e.strokeStyle=c,e.fillStyle=c;var l=function(f){e.beginPath(),e.arc(f.x,f.y,u,0,2*Math.PI),e.fill()};this.faceLandmarks.positions.forEach(l)}},r})();function uy(r,t){var e=en(r,t),n=oa(r,t);function a(o,s,u){var c=n(o,s,u+"/separable_conv0"),l=n(s,s,u+"/separable_conv1"),f=e(o,s,1,u+"/expansion_conv");return{separable_conv0:c,separable_conv1:l,expansion_conv:f}}function i(o,s){var u=n(o,o,s+"/separable_conv0"),c=n(o,o,s+"/separable_conv1"),l=n(o,o,s+"/separable_conv2");return{separable_conv0:u,separable_conv1:c,separable_conv2:l}}return{extractConvParams:e,extractSeparableConvParams:n,extractReductionBlockParams:a,extractMainBlockParams:i}}function nd(r,t){var e=[],n=ht(r),a=n.extractWeights,i=n.getRemainingWeights,o=uy(a,e),s=o.extractConvParams,u=o.extractSeparableConvParams,c=o.extractReductionBlockParams,l=o.extractMainBlockParams,f=s(3,32,3,"entry_flow/conv_in"),h=c(32,64,"entry_flow/reduction_block_0"),d=c(64,128,"entry_flow/reduction_block_1"),p={conv_in:f,reduction_block_0:h,reduction_block_1:d},v={};Nr(t,0,1).forEach(function(w){v["main_block_"+w]=l(128,"middle_flow/main_block_"+w)});var m=c(128,256,"exit_flow/reduction_block"),g=u(256,512,"exit_flow/separable_conv"),x={reduction_block:m,separable_conv:g};if(i().length!==0)throw new Error("weights remaing after extract: "+i().length);return{paramMappings:e,params:{entry_flow:p,middle_flow:v,exit_flow:x}}}function cy(r,t){var e=Tt(r,t),n=Mo(e),a=sa(e);function i(s){var u=a(s+"/separable_conv0"),c=a(s+"/separable_conv1"),l=n(s+"/expansion_conv");return{separable_conv0:u,separable_conv1:c,expansion_conv:l}}function o(s){var u=a(s+"/separable_conv0"),c=a(s+"/separable_conv1"),l=a(s+"/separable_conv2");return{separable_conv0:u,separable_conv1:c,separable_conv2:l}}return{extractConvParams:n,extractSeparableConvParams:a,extractReductionBlockParams:i,extractMainBlockParams:o}}function ad(r,t){var e=[],n=cy(r,e),a=n.extractConvParams,i=n.extractSeparableConvParams,o=n.extractReductionBlockParams,s=n.extractMainBlockParams,u=a("entry_flow/conv_in"),c=o("entry_flow/reduction_block_0"),l=o("entry_flow/reduction_block_1"),f={conv_in:u,reduction_block_0:c,reduction_block_1:l},h={};Nr(t,0,1).forEach(function(m){h["main_block_"+m]=s("middle_flow/main_block_"+m)});var d=o("exit_flow/reduction_block"),p=i("exit_flow/separable_conv"),v={reduction_block:d,separable_conv:p};return ft(r,e),{params:{entry_flow:f,middle_flow:h,exit_flow:v},paramMappings:e}}function id(r,t,e){return ie(ct(r,t.filters,e,"same"),t.bias)}function Xu(r,t,e){e===void 0&&(e=!0);var n=e?Re(r):r;return n=Pt(n,t.separable_conv0,[1,1]),n=Pt(Re(n),t.separable_conv1,[1,1]),n=je(n,[3,3],[2,2],"same"),n=ie(n,id(r,t.expansion_conv,[2,2])),n}function ly(r,t){var e=Pt(Re(r),t.separable_conv0,[1,1]);return e=Pt(Re(e),t.separable_conv1,[1,1]),e=Pt(Re(e),t.separable_conv2,[1,1]),e=ie(e,r),e}var od=(function(r){Q(t,r);function t(e){var n=r.call(this,"TinyXception")||this;return n._numMainBlocks=e,n}return t.prototype.forwardInput=function(e){var n=this,a=this.params;if(!a)throw new Error("TinyXception - load model before inference");return V(function(){var i=e.toBatchTensor(112,!0),o=[122.782,117.001,104.298],s=Ar(i,o).div(Y(256)),u=Re(id(s,a.entry_flow.conv_in,[2,2]));return u=Xu(u,a.entry_flow.reduction_block_0,!1),u=Xu(u,a.entry_flow.reduction_block_1),Nr(n._numMainBlocks,0,1).forEach(function(c){u=ly(u,a.middle_flow["main_block_"+c])}),u=Xu(u,a.exit_flow.reduction_block),u=Re(Pt(u,a.exit_flow.separable_conv,[1,1])),u})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.getDefaultModelName=function(){return"tiny_xception_model"},t.prototype.extractParamsFromWeigthMap=function(e){return ad(e,this._numMainBlocks)},t.prototype.extractParams=function(e){return nd(e,this._numMainBlocks)},t})(lt);function sd(r){var t=[],e=ht(r),n=e.extractWeights,a=e.getRemainingWeights,i=ia(n,t),o=i(512,1,"fc/age"),s=i(512,2,"fc/gender");if(a().length!==0)throw new Error("weights remaing after extract: "+a().length);return{paramMappings:t,params:{fc:{age:o,gender:s}}}}function ud(r){var t=[],e=Tt(r,t);function n(i){var o=e(i+"/weights",2),s=e(i+"/bias",1);return{weights:o,bias:s}}var a={fc:{age:n("fc/age"),gender:n("fc/gender")}};return ft(r,t),{params:a,paramMappings:t}}var ca;(function(r){r.FEMALE="female",r.MALE="male"})(ca||(ca={}));var cd=(function(r){Q(t,r);function t(e){e===void 0&&(e=new od(2));var n=r.call(this,"AgeGenderNet")||this;return n._faceFeatureExtractor=e,n}return Object.defineProperty(t.prototype,"faceFeatureExtractor",{get:function(){return this._faceFeatureExtractor},enumerable:!0,configurable:!0}),t.prototype.runNet=function(e){var n=this,a=this.params;if(!a)throw new Error(this._name+" - load model before inference");return V(function(){var i=e instanceof Tn?n.faceFeatureExtractor.forwardInput(e):e,o=Fr(i,[7,7],[2,2],"valid").as2D(i.shape[0],-1),s=Lt(o,a.fc.age).as1D(),u=Lt(o,a.fc.gender);return{age:s,gender:u}})},t.prototype.forwardInput=function(e){var n=this;return V(function(){var a=n.runNet(e),i=a.age,o=a.gender;return{age:i,gender:_t(o)}})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.predictAgeAndGender=function(e){return K(this,void 0,void 0,function(){var n,a,i,o,s,u,c=this;return j(this,function(l){switch(l.label){case 0:return[4,Be(e)];case 1:return n=l.sent(),[4,this.forwardInput(n)];case 2:return a=l.sent(),i=Me(a.age),o=Me(a.gender),s=i.map(function(f,h){return{ageTensor:f,genderTensor:o[h]}}),[4,Promise.all(s.map(function(f){var h=f.ageTensor,d=f.genderTensor;return K(c,void 0,void 0,function(){var p,v,m,g,x;return j(this,function(w){switch(w.label){case 0:return[4,h.data()];case 1:return p=w.sent()[0],[4,d.data()];case 2:return v=w.sent()[0],m=v>.5,g=m?ca.MALE:ca.FEMALE,x=m?v:1-v,h.dispose(),d.dispose(),[2,{age:p,gender:g,genderProbability:x}]}})})}))];case 3:return u=l.sent(),a.age.dispose(),a.gender.dispose(),[2,n.isBatchInput?u:u[0]]}})})},t.prototype.getDefaultModelName=function(){return"age_gender_model"},t.prototype.dispose=function(e){e===void 0&&(e=!0),this.faceFeatureExtractor.dispose(e),r.prototype.dispose.call(this,e)},t.prototype.loadClassifierParams=function(e){var n=this.extractClassifierParams(e),a=n.params,i=n.paramMappings;this._params=a,this._paramMappings=i},t.prototype.extractClassifierParams=function(e){return sd(e)},t.prototype.extractParamsFromWeigthMap=function(e){var n=Po(e),a=n.featureExtractorMap,i=n.classifierMap;return this.faceFeatureExtractor.loadFromWeightMap(a),ud(i)},t.prototype.extractParams=function(e){var n=1539,a=e.slice(0,e.length-n),i=e.slice(e.length-n);return this.faceFeatureExtractor.extractWeights(a),this.extractClassifierParams(i)},t})(lt);var Oo=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.postProcess=function(e,n,a){var i=a.map(function(s){var u=s.width,c=s.height,l=n/Math.max(c,u);return{width:u*l,height:c*l}}),o=i.length;return V(function(){var s=function(h,d){return gt([Qt([68],h),Qt([68],d)],1).as2D(1,136).as1D()},u=function(h,d){var p=i[h],v=p.width,m=p.height;return d(v,m)?Math.abs(v-m)/2:0},c=function(h){return u(h,function(d,p){return d<p})},l=function(h){return u(h,function(d,p){return p<d})},f=e.mul(Qt([o,136],n)).sub(gt(Array.from(Array(o),function(h,d){return s(c(d),l(d))}))).div(gt(Array.from(Array(o),function(h,d){return s(i[d].width,i[d].height)})));return f})},t.prototype.forwardInput=function(e){var n=this;return V(function(){var a=n.runNet(e);return n.postProcess(a,e.inputSize,e.inputDimensions.map(function(i){var o=i[0],s=i[1];return{height:o,width:s}}))})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.detectLandmarks=function(e){return K(this,void 0,void 0,function(){var n,a,i,o=this;return j(this,function(s){switch(s.label){case 0:return[4,Be(e)];case 1:return n=s.sent(),a=V(function(){return Me(o.forwardInput(n))}),[4,Promise.all(a.map(function(u,c){return K(o,void 0,void 0,function(){var l,f,h,d,p;return j(this,function(v){switch(v.label){case 0:return h=(f=Array).from,[4,u.data()];case 1:return l=h.apply(f,[v.sent()]),d=l.filter(function(m,g){return Mu(g)}),p=l.filter(function(m,g){return!Mu(g)}),[2,new Eo(Array(68).fill(0).map(function(m,g){return new de(d[g],p[g])}),{height:n.getInputHeight(c),width:n.getInputWidth(c)})]}})})}))];case 2:return i=s.sent(),a.forEach(function(u){return u.dispose()}),[2,n.isBatchInput?i:i[0]]}})})},t.prototype.getClassifierChannelsOut=function(){return 136},t})(Fo);var Lo=(function(r){Q(t,r);function t(e){return e===void 0&&(e=new _o),r.call(this,"FaceLandmark68Net",e)||this}return t.prototype.getDefaultModelName=function(){return"face_landmark_68_model"},t.prototype.getClassifierChannelsIn=function(){return 256},t})(Oo);function ld(r){var t=[],e=Bo(r,t).extractDenseBlock3Params,n={dense0:e("dense0",!0),dense1:e("dense1"),dense2:e("dense2")};return ft(r,t),{params:n,paramMappings:t}}function fd(r){var t=[],e=ht(r),n=e.extractWeights,a=e.getRemainingWeights,i=Ro(n,t).extractDenseBlock3Params,o=i(3,32,"dense0",!0),s=i(32,64,"dense1"),u=i(64,128,"dense2");if(a().length!==0)throw new Error("weights remaing after extract: "+a().length);return{paramMappings:t,params:{dense0:o,dense1:s,dense2:u}}}var hd=(function(r){Q(t,r);function t(){return r.call(this,"TinyFaceFeatureExtractor")||this}return t.prototype.forwardInput=function(e){var n=this.params;if(!n)throw new Error("TinyFaceFeatureExtractor - load model before inference");return V(function(){var a=e.toBatchTensor(112,!0),i=[122.782,117.001,104.298],o=Ar(a,i).div(Y(255)),s=Io(o,n.dense0,!0);return s=Io(s,n.dense1),s=Io(s,n.dense2),s=Fr(s,[14,14],[2,2],"valid"),s})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.getDefaultModelName=function(){return"face_feature_extractor_tiny_model"},t.prototype.extractParamsFromWeigthMap=function(e){return ld(e)},t.prototype.extractParams=function(e){return fd(e)},t})(lt);var dd=(function(r){Q(t,r);function t(e){return e===void 0&&(e=new hd),r.call(this,"FaceLandmark68TinyNet",e)||this}return t.prototype.getDefaultModelName=function(){return"face_landmark_68_tiny_model"},t.prototype.getClassifierChannelsIn=function(){return 128},t})(Oo);var ZS=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t})(Lo);function pd(r,t){return ie(Xe(r,t.weights),t.biases)}function Ku(r,t,e,n,a){a===void 0&&(a="same");var i=t.conv,o=i.filters,s=i.bias,u=ct(r,o,e,a);return u=ie(u,s),u=pd(u,t.scale),n?Re(u):u}function vd(r,t){return Ku(r,t,[1,1],!0)}function ju(r,t){return Ku(r,t,[1,1],!1)}function Uo(r,t){return Ku(r,t,[2,2],!0,"valid")}function fy(r,t){function e(s,u,c){var l=r(s),f=l.length/(u*c*c);if(Gh(f))throw new Error("depth has to be an integer: "+f+", weights.length: "+l.length+", numFilters: "+u+", filterSize: "+c);return V(function(){return er(at(l,[u,f,c,c]),[2,3,1,0])})}function n(s,u,c,l){var f=e(s,u,c),h=Fe(r(u));return t.push({paramPath:l+"/filters"},{paramPath:l+"/bias"}),{filters:f,bias:h}}function a(s,u){var c=Fe(r(s)),l=Fe(r(s));return t.push({paramPath:u+"/weights"},{paramPath:u+"/biases"}),{weights:c,biases:l}}function i(s,u,c,l){var f=n(s,u,c,l+"/conv"),h=a(u,l+"/scale");return{conv:f,scale:h}}function o(s,u,c,l,f){f===void 0&&(f=!1);var h=i((f?.5:1)*s,u,c,l+"/conv1"),d=i(s,u,c,l+"/conv2");return{conv1:h,conv2:d}}return{extractConvLayerParams:i,extractResidualLayerParams:o}}function md(r){var t=ht(r),e=t.extractWeights,n=t.getRemainingWeights,a=[],i=fy(e,a),o=i.extractConvLayerParams,s=i.extractResidualLayerParams,u=o(4704,32,7,"conv32_down"),c=s(9216,32,3,"conv32_1"),l=s(9216,32,3,"conv32_2"),f=s(9216,32,3,"conv32_3"),h=s(36864,64,3,"conv64_down",!0),d=s(36864,64,3,"conv64_1"),p=s(36864,64,3,"conv64_2"),v=s(36864,64,3,"conv64_3"),m=s(147456,128,3,"conv128_down",!0),g=s(147456,128,3,"conv128_1"),x=s(147456,128,3,"conv128_2"),w=s(589824,256,3,"conv256_down",!0),y=s(589824,256,3,"conv256_1"),b=s(589824,256,3,"conv256_2"),A=s(589824,256,3,"conv256_down_out"),I=V(function(){return er(xr(e(256*128),[128,256]),[1,0])});if(a.push({paramPath:"fc"}),n().length!==0)throw new Error("weights remaing after extract: "+n().length);var T={conv32_down:u,conv32_1:c,conv32_2:l,conv32_3:f,conv64_down:h,conv64_1:d,conv64_2:p,conv64_3:v,conv128_down:m,conv128_1:g,conv128_2:x,conv256_down:w,conv256_1:y,conv256_2:b,conv256_down_out:A,fc:I};return{params:T,paramMappings:a}}function hy(r,t){var e=Tt(r,t);function n(o){var s=e(o+"/scale/weights",1),u=e(o+"/scale/biases",1);return{weights:s,biases:u}}function a(o){var s=e(o+"/conv/filters",4),u=e(o+"/conv/bias",1),c=n(o);return{conv:{filters:s,bias:u},scale:c}}function i(o){return{conv1:a(o+"/conv1"),conv2:a(o+"/conv2")}}return{extractConvLayerParams:a,extractResidualLayerParams:i}}function gd(r){var t=[],e=hy(r,t),n=e.extractConvLayerParams,a=e.extractResidualLayerParams,i=n("conv32_down"),o=a("conv32_1"),s=a("conv32_2"),u=a("conv32_3"),c=a("conv64_down"),l=a("conv64_1"),f=a("conv64_2"),h=a("conv64_3"),d=a("conv128_down"),p=a("conv128_1"),v=a("conv128_2"),m=a("conv256_down"),g=a("conv256_1"),x=a("conv256_2"),w=a("conv256_down_out"),y=r.fc;if(t.push({originalPath:"fc",paramPath:"fc"}),!Uh(y))throw new Error("expected weightMap[fc] to be a Tensor2D, instead have "+y);var b={conv32_down:i,conv32_1:o,conv32_2:s,conv32_3:u,conv64_down:c,conv64_1:l,conv64_2:f,conv64_3:h,conv128_down:d,conv128_1:p,conv128_2:v,conv256_down:m,conv256_1:g,conv256_2:x,conv256_down_out:w,fc:y};return ft(r,t),{params:b,paramMappings:t}}function dr(r,t){var e=vd(r,t.conv1);return e=ju(e,t.conv2),e=ie(e,r),e=Re(e),e}function ui(r,t){var e=Uo(r,t.conv1);e=ju(e,t.conv2);var n=Fr(r,2,2,"valid"),a=Ne(n.shape),i=n.shape[3]!==e.shape[3],o=n.shape[1]!==e.shape[1]||n.shape[2]!==e.shape[2];if(o){var s=Cn(e.shape);s[1]=1;var u=Ne(s);e=Ge([e,u],1);var c=Cn(e.shape);c[2]=1;var l=Ne(c);e=Ge([e,l],2)}return n=i?Ge([n,a],3):n,e=ie(n,e),e=Re(e),e}var Yu=(function(r){Q(t,r);function t(){return r.call(this,"FaceRecognitionNet")||this}return t.prototype.forwardInput=function(e){var n=this.params;if(!n)throw new Error("FaceRecognitionNet - load model before inference");return V(function(){var a=e.toBatchTensor(150,!0).toFloat(),i=[122.782,117.001,104.298],o=Ar(a,i).div(Y(256)),s=Uo(o,n.conv32_down);s=je(s,3,2,"valid"),s=dr(s,n.conv32_1),s=dr(s,n.conv32_2),s=dr(s,n.conv32_3),s=ui(s,n.conv64_down),s=dr(s,n.conv64_1),s=dr(s,n.conv64_2),s=dr(s,n.conv64_3),s=ui(s,n.conv128_down),s=dr(s,n.conv128_1),s=dr(s,n.conv128_2),s=ui(s,n.conv256_down),s=dr(s,n.conv256_1),s=dr(s,n.conv256_2),s=ui(s,n.conv256_down_out);var u=s.mean([1,2]),c=Jn(u,n.fc);return c})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.computeFaceDescriptor=function(e){return K(this,void 0,void 0,function(){var n,a,i,o=this;return j(this,function(s){switch(s.label){case 0:return[4,Be(e)];case 1:return n=s.sent(),a=V(function(){return Me(o.forwardInput(n))}),[4,Promise.all(a.map(function(u){return u.data()}))];case 2:return i=s.sent(),a.forEach(function(u){return u.dispose()}),[2,n.isBatchInput?i:i[0]]}})})},t.prototype.getDefaultModelName=function(){return"face_recognition_model"},t.prototype.extractParamsFromWeigthMap=function(e){return gd(e)},t.prototype.extractParams=function(e){return md(e)},t})(lt);function Qu(r,t){var e={descriptor:t};return Object.assign({},r,e)}function qu(r,t){var e={age:t};return Object.assign({},r,e)}function Zu(r,t,e){var n={gender:t,genderProbability:e};return Object.assign({},r,n)}var ci=(function(){function r(t){var e=t===void 0?{}:t,n=e.minFaceSize,a=e.scaleFactor,i=e.maxNumScales,o=e.scoreThresholds,s=e.scaleSteps;if(this._name="MtcnnOptions",this._minFaceSize=n||20,this._scaleFactor=a||.709,this._maxNumScales=i||10,this._scoreThresholds=o||[.6,.7,.7],this._scaleSteps=s,typeof this._minFaceSize!="number"||this._minFaceSize<0)throw new Error(this._name+" - expected minFaceSize to be a number > 0");if(typeof this._scaleFactor!="number"||this._scaleFactor<=0||this._scaleFactor>=1)throw new Error(this._name+" - expected scaleFactor to be a number between 0 and 1");if(typeof this._maxNumScales!="number"||this._maxNumScales<0)throw new Error(this._name+" - expected maxNumScales to be a number > 0");if(!Array.isArray(this._scoreThresholds)||this._scoreThresholds.length!==3||this._scoreThresholds.some(function(u){return typeof u!="number"}))throw new Error(this._name+" - expected scoreThresholds to be an array of numbers of length 3");if(this._scaleSteps&&(!Array.isArray(this._scaleSteps)||this._scaleSteps.some(function(u){return typeof u!="number"})))throw new Error(this._name+" - expected scaleSteps to be an array of numbers")}return Object.defineProperty(r.prototype,"minFaceSize",{get:function(){return this._minFaceSize},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"scaleFactor",{get:function(){return this._scaleFactor},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"maxNumScales",{get:function(){return this._maxNumScales},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"scoreThresholds",{get:function(){return this._scoreThresholds},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"scaleSteps",{get:function(){return this._scaleSteps},enumerable:!0,configurable:!0}),r})();function dy(r,t){function e(u,c){var l=at(r(9*u),[3,3,u,1]),f=Fe(r(u)),h=Fe(r(u)),d=Fe(r(u)),p=Fe(r(u));return t.push({paramPath:c+"/filters"},{paramPath:c+"/batch_norm_scale"},{paramPath:c+"/batch_norm_offset"},{paramPath:c+"/batch_norm_mean"},{paramPath:c+"/batch_norm_variance"}),{filters:l,batch_norm_scale:f,batch_norm_offset:h,batch_norm_mean:d,batch_norm_variance:p}}function n(u,c,l,f,h){var d=at(r(u*c*l*l),[l,l,u,c]),p=Fe(r(c));return t.push({paramPath:f+"/filters"},{paramPath:f+"/"+(h?"batch_norm_offset":"bias")}),{filters:d,bias:p}}function a(u,c,l,f){var h=n(u,c,l,f,!0),d=h.filters,p=h.bias;return{filters:d,batch_norm_offset:p}}function i(u,c,l){var f=e(u,l+"/depthwise_conv"),h=a(u,c,1,l+"/pointwise_conv");return{depthwise_conv:f,pointwise_conv:h}}function o(){var u=a(3,32,3,"mobilenetv1/conv_0"),c=i(32,64,"mobilenetv1/conv_1"),l=i(64,128,"mobilenetv1/conv_2"),f=i(128,128,"mobilenetv1/conv_3"),h=i(128,256,"mobilenetv1/conv_4"),d=i(256,256,"mobilenetv1/conv_5"),p=i(256,512,"mobilenetv1/conv_6"),v=i(512,512,"mobilenetv1/conv_7"),m=i(512,512,"mobilenetv1/conv_8"),g=i(512,512,"mobilenetv1/conv_9"),x=i(512,512,"mobilenetv1/conv_10"),w=i(512,512,"mobilenetv1/conv_11"),y=i(512,1024,"mobilenetv1/conv_12"),b=i(1024,1024,"mobilenetv1/conv_13");return{conv_0:u,conv_1:c,conv_2:l,conv_3:f,conv_4:h,conv_5:d,conv_6:p,conv_7:v,conv_8:m,conv_9:g,conv_10:x,conv_11:w,conv_12:y,conv_13:b}}function s(){var u=a(1024,256,1,"prediction_layer/conv_0"),c=a(256,512,3,"prediction_layer/conv_1"),l=a(512,128,1,"prediction_layer/conv_2"),f=a(128,256,3,"prediction_layer/conv_3"),h=a(256,128,1,"prediction_layer/conv_4"),d=a(128,256,3,"prediction_layer/conv_5"),p=a(256,64,1,"prediction_layer/conv_6"),v=a(64,128,3,"prediction_layer/conv_7"),m=n(512,12,1,"prediction_layer/box_predictor_0/box_encoding_predictor"),g=n(512,9,1,"prediction_layer/box_predictor_0/class_predictor"),x=n(1024,24,1,"prediction_layer/box_predictor_1/box_encoding_predictor"),w=n(1024,18,1,"prediction_layer/box_predictor_1/class_predictor"),y=n(512,24,1,"prediction_layer/box_predictor_2/box_encoding_predictor"),b=n(512,18,1,"prediction_layer/box_predictor_2/class_predictor"),A=n(256,24,1,"prediction_layer/box_predictor_3/box_encoding_predictor"),I=n(256,18,1,"prediction_layer/box_predictor_3/class_predictor"),T=n(256,24,1,"prediction_layer/box_predictor_4/box_encoding_predictor"),S=n(256,18,1,"prediction_layer/box_predictor_4/class_predictor"),D=n(128,24,1,"prediction_layer/box_predictor_5/box_encoding_predictor"),_=n(128,18,1,"prediction_layer/box_predictor_5/class_predictor"),M={box_encoding_predictor:m,class_predictor:g},L={box_encoding_predictor:x,class_predictor:w},O={box_encoding_predictor:y,class_predictor:b},N={box_encoding_predictor:A,class_predictor:I},H={box_encoding_predictor:T,class_predictor:S},G={box_encoding_predictor:D,class_predictor:_};return{conv_0:u,conv_1:c,conv_2:l,conv_3:f,conv_4:h,conv_5:d,conv_6:p,conv_7:v,box_predictor_0:M,box_predictor_1:L,box_predictor_2:O,box_predictor_3:N,box_predictor_4:H,box_predictor_5:G}}return{extractMobilenetV1Params:o,extractPredictionLayerParams:s}}function xd(r){var t=[],e=ht(r),n=e.extractWeights,a=e.getRemainingWeights,i=dy(n,t),o=i.extractMobilenetV1Params,s=i.extractPredictionLayerParams,u=o(),c=s(),l=uo(n(5118*4),[1,5118,4]),f={extra_dim:l};if(t.push({paramPath:"output_layer/extra_dim"}),a().length!==0)throw new Error("weights remaing after extract: "+a().length);return{params:{mobilenetv1:u,prediction_layer:c,output_layer:f},paramMappings:t}}function py(r,t){var e=Tt(r,t);function n(c,l,f){var h=e(c+"/Conv2d_"+l+"_pointwise/weights",4,f+"/filters"),d=e(c+"/Conv2d_"+l+"_pointwise/convolution_bn_offset",1,f+"/batch_norm_offset");return{filters:h,batch_norm_offset:d}}function a(c){var l="mobilenetv1/conv_"+c,f="MobilenetV1/Conv2d_"+c+"_depthwise",h=l+"/depthwise_conv",d=l+"/pointwise_conv",p=e(f+"/depthwise_weights",4,h+"/filters"),v=e(f+"/BatchNorm/gamma",1,h+"/batch_norm_scale"),m=e(f+"/BatchNorm/beta",1,h+"/batch_norm_offset"),g=e(f+"/BatchNorm/moving_mean",1,h+"/batch_norm_mean"),x=e(f+"/BatchNorm/moving_variance",1,h+"/batch_norm_variance");return{depthwise_conv:{filters:p,batch_norm_scale:v,batch_norm_offset:m,batch_norm_mean:g,batch_norm_variance:x},pointwise_conv:n("MobilenetV1",c,d)}}function i(){return{conv_0:n("MobilenetV1",0,"mobilenetv1/conv_0"),conv_1:a(1),conv_2:a(2),conv_3:a(3),conv_4:a(4),conv_5:a(5),conv_6:a(6),conv_7:a(7),conv_8:a(8),conv_9:a(9),conv_10:a(10),conv_11:a(11),conv_12:a(12),conv_13:a(13)}}function o(c,l){var f=e(c+"/weights",4,l+"/filters"),h=e(c+"/biases",1,l+"/bias");return{filters:f,bias:h}}function s(c){var l=o("Prediction/BoxPredictor_"+c+"/BoxEncodingPredictor","prediction_layer/box_predictor_"+c+"/box_encoding_predictor"),f=o("Prediction/BoxPredictor_"+c+"/ClassPredictor","prediction_layer/box_predictor_"+c+"/class_predictor");return{box_encoding_predictor:l,class_predictor:f}}function u(){return{conv_0:n("Prediction",0,"prediction_layer/conv_0"),conv_1:n("Prediction",1,"prediction_layer/conv_1"),conv_2:n("Prediction",2,"prediction_layer/conv_2"),conv_3:n("Prediction",3,"prediction_layer/conv_3"),conv_4:n("Prediction",4,"prediction_layer/conv_4"),conv_5:n("Prediction",5,"prediction_layer/conv_5"),conv_6:n("Prediction",6,"prediction_layer/conv_6"),conv_7:n("Prediction",7,"prediction_layer/conv_7"),box_predictor_0:s(0),box_predictor_1:s(1),box_predictor_2:s(2),box_predictor_3:s(3),box_predictor_4:s(4),box_predictor_5:s(5)}}return{extractMobilenetV1Params:i,extractPredictionLayerParams:u}}function yd(r){var t=[],e=py(r,t),n=e.extractMobilenetV1Params,a=e.extractPredictionLayerParams,i=r["Output/extra_dim"];if(t.push({originalPath:"Output/extra_dim",paramPath:"output_layer/extra_dim"}),!$r(i))throw new Error("expected weightMap['Output/extra_dim'] to be a Tensor3D, instead have "+i);var o={mobilenetv1:n(),prediction_layer:a(),output_layer:{extra_dim:i}};return ft(r,t),{params:o,paramMappings:t}}function rr(r,t,e){return V(function(){var n=ct(r,t.filters,e,"same");return n=ie(n,t.batch_norm_offset),ja(n,0,6)})}var vy=.0010000000474974513;function my(r,t,e){return V(function(){var n=qa(r,t.filters,e,"same");return n=pu(n,t.batch_norm_mean,t.batch_norm_variance,t.batch_norm_offset,t.batch_norm_scale,vy),ja(n,0,6)})}function gy(r){return[2,4,6,12].some(function(t){return t===r})?[2,2]:[1,1]}function wd(r,t){return V(function(){var e=null,n=rr(r,t.conv_0,[2,2]),a=[t.conv_1,t.conv_2,t.conv_3,t.conv_4,t.conv_5,t.conv_6,t.conv_7,t.conv_8,t.conv_9,t.conv_10,t.conv_11,t.conv_12,t.conv_13];if(a.forEach(function(i,o){var s=o+1,u=gy(s);n=my(n,i.depthwise_conv,u),n=rr(n,i.pointwise_conv,[1,1]),s===11&&(e=n)}),e===null)throw new Error("mobileNetV1 - output of conv layer 11 is null");return{out:n,conv11:e}})}function bd(r,t,e,n,a){var i=r.shape[0],o=Math.min(e,i),s=t.map(function(l,f){return{score:l,boxIndex:f}}).filter(function(l){return l.score>a}).sort(function(l,f){return f.score-l.score}),u=function(l){return l<=n?1:0},c=[];return s.forEach(function(l){if(!(c.length>=o)){for(var f=l.score,h=c.length-1;h>=0;--h){var d=xy(r,l.boxIndex,c[h]);if(d!==0&&(l.score*=u(d),l.score<=a))break}f===l.score&&c.push(l.boxIndex)}}),c}function xy(r,t,e){var n=r.arraySync(),a=Math.min(n[t][0],n[t][2]),i=Math.min(n[t][1],n[t][3]),o=Math.max(n[t][0],n[t][2]),s=Math.max(n[t][1],n[t][3]),u=Math.min(n[e][0],n[e][2]),c=Math.min(n[e][1],n[e][3]),l=Math.max(n[e][0],n[e][2]),f=Math.max(n[e][1],n[e][3]),h=(o-a)*(s-i),d=(l-u)*(f-c);if(h<=0||d<=0)return 0;var p=Math.max(a,u),v=Math.max(i,c),m=Math.min(o,l),g=Math.min(s,f),x=Math.max(m-p,0)*Math.max(g-v,0);return x/(h+d-x)}function yy(r){var t=Me(er(r,[1,0])),e=[Pe(t[2],t[0]),Pe(t[3],t[1])],n=[ie(t[0],$t(e[0],Y(2))),ie(t[1],$t(e[1],Y(2)))];return{sizes:e,centers:n}}function wy(r,t){var e=yy(r),n=e.sizes,a=e.centers,i=Me(er(t,[1,0])),o=$t(Xe(po($t(i[2],Y(5))),n[0]),Y(2)),s=ie(Xe($t(i[0],Y(10)),n[0]),a[0]),u=$t(Xe(po($t(i[3],Y(5))),n[1]),Y(2)),c=ie(Xe($t(i[1],Y(10)),n[1]),a[1]);return er(gt([Pe(s,o),Pe(c,u),ie(s,o),ie(c,u)]),[1,0])}function Ad(r,t,e){return V(function(){var n=r.shape[0],a=wy(Bt(vn(e.extra_dim,[n,1,1]),[-1,4]),Bt(r,[-1,4]));a=Bt(a,[n,a.shape[0]/n,4]);var i=du(sr(t,[0,0,1],[-1,-1,-1])),o=sr(i,[0,0,0],[-1,-1,1]);o=Bt(o,[n,o.shape[1]]);var s=Me(a),u=Me(o);return{boxes:s,scores:u}})}function In(r,t){return V(function(){var e=r.shape[0],n=Bt(Dt(r,t.box_encoding_predictor),[e,-1,1,4]),a=Bt(Dt(r,t.class_predictor),[e,-1,3]);return{boxPredictionEncoding:n,classPrediction:a}})}function Ed(r,t,e){return V(function(){var n=rr(r,e.conv_0,[1,1]),a=rr(n,e.conv_1,[2,2]),i=rr(a,e.conv_2,[1,1]),o=rr(i,e.conv_3,[2,2]),s=rr(o,e.conv_4,[1,1]),u=rr(s,e.conv_5,[2,2]),c=rr(u,e.conv_6,[1,1]),l=rr(c,e.conv_7,[2,2]),f=In(t,e.box_predictor_0),h=In(r,e.box_predictor_1),d=In(a,e.box_predictor_2),p=In(o,e.box_predictor_3),v=In(u,e.box_predictor_4),m=In(l,e.box_predictor_5),g=Ge([f.boxPredictionEncoding,h.boxPredictionEncoding,d.boxPredictionEncoding,p.boxPredictionEncoding,v.boxPredictionEncoding,m.boxPredictionEncoding],1),x=Ge([f.classPrediction,h.classPrediction,d.classPrediction,p.classPrediction,v.classPrediction,m.classPrediction],1);return{boxPredictions:g,classPredictions:x}})}var tn=(function(){function r(t){var e=t===void 0?{}:t,n=e.minConfidence,a=e.maxResults;if(this._name="SsdMobilenetv1Options",this._minConfidence=n||.5,this._maxResults=a||100,typeof this._minConfidence!="number"||this._minConfidence<=0||this._minConfidence>=1)throw new Error(this._name+" - expected minConfidence to be a number between 0 and 1");if(typeof this._maxResults!="number")throw new Error(this._name+" - expected maxResults to be a number")}return Object.defineProperty(r.prototype,"minConfidence",{get:function(){return this._minConfidence},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"maxResults",{get:function(){return this._maxResults},enumerable:!0,configurable:!0}),r})();var Go=(function(r){Q(t,r);function t(){return r.call(this,"SsdMobilenetv1")||this}return t.prototype.forwardInput=function(e){var n=this.params;if(!n)throw new Error("SsdMobilenetv1 - load model before inference");return V(function(){var a=e.toBatchTensor(512,!1).toFloat(),i=Pe(Xe(a,Y(.007843137718737125)),Y(1)),o=wd(i,n.mobilenetv1),s=Ed(o.out,o.conv11,n.prediction_layer),u=s.boxPredictions,c=s.classPredictions;return Ad(u,c,n.output_layer)})},t.prototype.forward=function(e){return K(this,void 0,void 0,function(){var n;return j(this,function(a){switch(a.label){case 0:return n=this.forwardInput,[4,Be(e)];case 1:return[2,n.apply(this,[a.sent()])]}})})},t.prototype.locateFaces=function(e,n){return n===void 0&&(n={}),K(this,void 0,void 0,function(){var a,i,o,s,u,c,l,f,h,d,p,v,m,g,x,w,y,b,A,I,T;return j(this,function(S){switch(S.label){case 0:return a=new tn(n),i=a.maxResults,o=a.minConfidence,[4,Be(e)];case 1:for(s=S.sent(),u=this.forwardInput(s),c=u.boxes,l=u.scores,f=c[0],h=l[0],d=1;d<c.length;d++)c[d].dispose(),l[d].dispose();return m=(v=Array).from,[4,h.data()];case 2:return p=m.apply(v,[S.sent()]),g=.5,x=bd(f,p,i,g,o),w=s.getReshapedInputDimensions(0),y=s.inputSize,b=y/w.width,A=y/w.height,I=f.arraySync(),T=x.map(function(D){var _=[Math.max(0,I[D][0]),Math.min(1,I[D][2])].map(function(G){return G*A}),M=_[0],L=_[1],O=[Math.max(0,I[D][1]),Math.min(1,I[D][3])].map(function(G){return G*b}),N=O[0],H=O[1];return new Ze(p[D],new ta(N,M,H-N,L-M),{height:s.getInputHeight(0),width:s.getInputWidth(0)})}),f.dispose(),h.dispose(),[2,T]}})})},t.prototype.getDefaultModelName=function(){return"ssd_mobilenetv1_model"},t.prototype.extractParamsFromWeigthMap=function(e){return yd(e)},t.prototype.extractParams=function(e){return xd(e)},t})(lt);var vT=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t})(Go);var Cd=.4,Sd=[new de(.738768,.874946),new de(2.42204,2.65704),new de(4.30971,7.04493),new de(10.246,4.59428),new de(12.6868,11.8741)],Dd=[new de(1.603231,2.094468),new de(6.041143,7.080126),new de(2.882459,3.518061),new de(4.266906,5.178857),new de(9.041765,10.66308)],Td=[117.001,114.697,97.404],Id="tiny_yolov2_model",Rd="tiny_yolov2_separable_conv_model";var Ho=function(r){return typeof r=="number"};function Md(r){if(!r)throw new Error("invalid config: "+r);if(typeof r.withSeparableConvs!="boolean")throw new Error("config.withSeparableConvs has to be a boolean, have: "+r.withSeparableConvs);if(!Ho(r.iouThreshold)||r.iouThreshold<0||r.iouThreshold>1)throw new Error("config.iouThreshold has to be a number between [0, 1], have: "+r.iouThreshold);if(!Array.isArray(r.classes)||!r.classes.length||!r.classes.every(function(t){return typeof t=="string"}))throw new Error("config.classes has to be an array class names: string[], have: "+JSON.stringify(r.classes));if(!Array.isArray(r.anchors)||!r.anchors.length||!r.anchors.map(function(t){return t||{}}).every(function(t){return Ho(t.x)&&Ho(t.y)}))throw new Error("config.anchors has to be an array of { x: number, y: number }, have: "+JSON.stringify(r.anchors));if(r.meanRgb&&(!Array.isArray(r.meanRgb)||r.meanRgb.length!==3||!r.meanRgb.every(Ho)))throw new Error("config.meanRgb has to be an array of shape [number, number, number], have: "+JSON.stringify(r.meanRgb))}function la(r){return V(function(){var t=Xe(r,Y(.10000000149011612));return ie(Re(Pe(r,t)),t)})}function Gr(r,t){return V(function(){var e=Pr(r,[[0,0],[1,1],[1,1],[0,0]]);return e=ct(e,t.conv.filters,[1,1],"valid"),e=Pe(e,t.bn.sub),e=Xe(e,t.bn.truediv),e=ie(e,t.conv.bias),la(e)})}function Hr(r,t){return V(function(){var e=Pr(r,[[0,0],[1,1],[1,1],[0,0]]);return e=Za(e,t.depthwise_filter,t.pointwise_filter,[1,1],"valid"),e=ie(e,t.bias),la(e)})}function by(r,t){var e=en(r,t);function n(o,s){var u=Fe(r(o)),c=Fe(r(o));return t.push({paramPath:s+"/sub"},{paramPath:s+"/truediv"}),{sub:u,truediv:c}}function a(o,s,u){var c=e(o,s,3,u+"/conv"),l=n(s,u+"/bn");return{conv:c,bn:l}}var i=oa(r,t);return{extractConvParams:e,extractConvWithBatchNormParams:a,extractSeparableConvParams:i}}function Bd(r,t,e,n){var a=ht(r),i=a.extractWeights,o=a.getRemainingWeights,s=[],u=by(i,s),c=u.extractConvParams,l=u.extractConvWithBatchNormParams,f=u.extractSeparableConvParams,h;if(t.withSeparableConvs){var d=n[0],p=n[1],v=n[2],m=n[3],g=n[4],x=n[5],w=n[6],y=n[7],b=n[8],A=t.isFirstLayerConv2d?c(d,p,3,"conv0"):f(d,p,"conv0"),I=f(p,v,"conv1"),T=f(v,m,"conv2"),S=f(m,g,"conv3"),D=f(g,x,"conv4"),_=f(x,w,"conv5"),M=y?f(w,y,"conv6"):void 0,L=b?f(y,b,"conv7"):void 0,O=c(b||y||w,5*e,1,"conv8");h={conv0:A,conv1:I,conv2:T,conv3:S,conv4:D,conv5:_,conv6:M,conv7:L,conv8:O}}else{var d=n[0],p=n[1],v=n[2],m=n[3],g=n[4],x=n[5],w=n[6],y=n[7],b=n[8],A=l(d,p,"conv0"),I=l(p,v,"conv1"),T=l(v,m,"conv2"),S=l(m,g,"conv3"),D=l(g,x,"conv4"),_=l(x,w,"conv5"),M=l(w,y,"conv6"),L=l(y,b,"conv7"),O=c(b,5*e,1,"conv8");h={conv0:A,conv1:I,conv2:T,conv3:S,conv4:D,conv5:_,conv6:M,conv7:L,conv8:O}}if(o().length!==0)throw new Error("weights remaing after extract: "+o().length);return{params:h,paramMappings:s}}function Ay(r,t){var e=Tt(r,t);function n(s){var u=e(s+"/sub",1),c=e(s+"/truediv",1);return{sub:u,truediv:c}}function a(s){var u=e(s+"/filters",4),c=e(s+"/bias",1);return{filters:u,bias:c}}function i(s){var u=a(s+"/conv"),c=n(s+"/bn");return{conv:u,bn:c}}var o=sa(e);return{extractConvParams:a,extractConvWithBatchNormParams:i,extractSeparableConvParams:o}}function _d(r,t){var e=[],n=Ay(r,e),a=n.extractConvParams,i=n.extractConvWithBatchNormParams,o=n.extractSeparableConvParams,s;if(t.withSeparableConvs){var u=t.filterSizes&&t.filterSizes.length||9;s={conv0:t.isFirstLayerConv2d?a("conv0"):o("conv0"),conv1:o("conv1"),conv2:o("conv2"),conv3:o("conv3"),conv4:o("conv4"),conv5:o("conv5"),conv6:u>7?o("conv6"):void 0,conv7:u>8?o("conv7"):void 0,conv8:a("conv8")}}else s={conv0:i("conv0"),conv1:i("conv1"),conv2:i("conv2"),conv3:i("conv3"),conv4:i("conv4"),conv5:i("conv5"),conv6:i("conv6"),conv7:i("conv7"),conv8:a("conv8")};return ft(r,e),{params:s,paramMappings:e}}var Pd;(function(r){r[r.XS=224]="XS",r[r.SM=320]="SM",r[r.MD=416]="MD",r[r.LG=608]="LG"})(Pd||(Pd={}));var Rn=(function(){function r(t){var e=t===void 0?{}:t,n=e.inputSize,a=e.scoreThreshold;if(this._name="TinyYolov2Options",this._inputSize=n||416,this._scoreThreshold=a||.5,typeof this._inputSize!="number"||this._inputSize%32!==0)throw new Error(this._name+" - expected inputSize to be a number divisible by 32");if(typeof this._scoreThreshold!="number"||this._scoreThreshold<=0||this._scoreThreshold>=1)throw new Error(this._name+" - expected scoreThreshold to be a number between 0 and 1")}return Object.defineProperty(r.prototype,"inputSize",{get:function(){return this._inputSize},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"scoreThreshold",{get:function(){return this._scoreThreshold},enumerable:!0,configurable:!0}),r})();var zo=(function(r){Q(t,r);function t(e){var n=r.call(this,"TinyYolov2")||this;return Md(e),n._config=e,n}return Object.defineProperty(t.prototype,"config",{get:function(){return this._config},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"withClassScores",{get:function(){return this.config.withClassScores||this.config.classes.length>1},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"boxEncodingSize",{get:function(){return 5+(this.withClassScores?this.config.classes.length:0)},enumerable:!0,configurable:!0}),t.prototype.runTinyYolov2=function(e,n){var a=Gr(e,n.conv0);return a=je(a,[2,2],[2,2],"same"),a=Gr(a,n.conv1),a=je(a,[2,2],[2,2],"same"),a=Gr(a,n.conv2),a=je(a,[2,2],[2,2],"same"),a=Gr(a,n.conv3),a=je(a,[2,2],[2,2],"same"),a=Gr(a,n.conv4),a=je(a,[2,2],[2,2],"same"),a=Gr(a,n.conv5),a=je(a,[2,2],[1,1],"same"),a=Gr(a,n.conv6),a=Gr(a,n.conv7),Dt(a,n.conv8,"valid",!1)},t.prototype.runMobilenet=function(e,n){var a=this.config.isFirstLayerConv2d?la(Dt(e,n.conv0,"valid",!1)):Hr(e,n.conv0);return a=je(a,[2,2],[2,2],"same"),a=Hr(a,n.conv1),a=je(a,[2,2],[2,2],"same"),a=Hr(a,n.conv2),a=je(a,[2,2],[2,2],"same"),a=Hr(a,n.conv3),a=je(a,[2,2],[2,2],"same"),a=Hr(a,n.conv4),a=je(a,[2,2],[2,2],"same"),a=Hr(a,n.conv5),a=je(a,[2,2],[1,1],"same"),a=n.conv6?Hr(a,n.conv6):a,a=n.conv7?Hr(a,n.conv7):a,Dt(a,n.conv8,"valid",!1)},t.prototype.forwardInput=function(e,n){var a=this,i=this.params;if(!i)throw new Error("TinyYolov2 - load model before inference");return V(function(){var o=e.toBatchTensor(n,!1).toFloat();return o=a.config.meanRgb?Ar(o,a.config.meanRgb):o,o=o.div(Y(256)),a.config.withSeparableConvs?a.runMobilenet(o,i):a.runTinyYolov2(o,i)})},t.prototype.forward=function(e,n){return K(this,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return a=this.forwardInput,[4,Be(e)];case 1:return[4,a.apply(this,[i.sent(),n])];case 2:return[2,i.sent()]}})})},t.prototype.detect=function(e,n){return n===void 0&&(n={}),K(this,void 0,void 0,function(){var a,i,o,s,u,c,l,f,h,d,p,v,m,g,x=this;return j(this,function(w){switch(w.label){case 0:return a=new Rn(n),i=a.inputSize,o=a.scoreThreshold,[4,Be(e)];case 1:return s=w.sent(),[4,this.forwardInput(s,i)];case 2:return u=w.sent(),c=V(function(){return Me(u)[0].expandDims()}),l={width:s.getInputWidth(0),height:s.getInputHeight(0)},[4,this.extractBoxes(c,s.getReshapedInputDimensions(0),o)];case 3:return f=w.sent(),u.dispose(),c.dispose(),h=f.map(function(y){return y.box}),d=f.map(function(y){return y.score}),p=f.map(function(y){return y.classScore}),v=f.map(function(y){return x.config.classes[y.label]}),m=Or(h.map(function(y){return y.rescale(i)}),d,this.config.iouThreshold,!0),g=m.map(function(y){return new bo(d[y],p[y],v[y],h[y],l)}),[2,g]}})})},t.prototype.getDefaultModelName=function(){return""},t.prototype.extractParamsFromWeigthMap=function(e){return _d(e,this.config)},t.prototype.extractParams=function(e){var n=this.config.filterSizes||t.DEFAULT_FILTER_SIZES,a=n?n.length:void 0;if(a!==7&&a!==8&&a!==9)throw new Error("TinyYolov2 - expected 7 | 8 | 9 convolutional filters, but found "+a+" filterSizes in config");return Bd(e,this.config,this.boxEncodingSize,n)},t.prototype.extractBoxes=function(e,n,a){return K(this,void 0,void 0,function(){var i,o,s,u,c,l,f,h,d,p,v,m,g,x,w,y,b,A,I,T,S,D,_,M,L,O,N,H,G,U=this;return j(this,function(z){switch(z.label){case 0:return i=n.width,o=n.height,s=Math.max(i,o),u=s/i,c=s/o,l=e.shape[1],f=this.config.anchors.length,h=V(function(){var X=e.reshape([l,l,f,U.boxEncodingSize]),q=X.slice([0,0,0,0],[l,l,f,4]),Z=X.slice([0,0,0,4],[l,l,f,1]),ne=U.withClassScores?_t(X.slice([0,0,0,5],[l,l,f,U.config.classes.length]),3):Y(0);return[q,Z,ne]}),d=h[0],p=h[1],v=h[2],m=[],[4,p.array()];case 1:return g=z.sent(),[4,d.array()];case 2:x=z.sent(),w=0,z.label=3;case 3:if(!(w<l))return[3,12];y=0,z.label=4;case 4:if(!(y<l))return[3,11];b=0,z.label=5;case 5:return b<f?(A=Ao(g[w][y][b][0]),!a||A>a?(I=(y+Ao(x[w][y][b][0]))/l*u,T=(w+Ao(x[w][y][b][1]))/l*c,S=Math.exp(x[w][y][b][2])*this.config.anchors[b].x/l*u,D=Math.exp(x[w][y][b][3])*this.config.anchors[b].y/l*c,_=I-S/2,M=T-D/2,L={row:w,col:y,anchor:b},this.withClassScores?[4,this.extractPredictedClass(v,L)]:[3,7]):[3,9]):[3,10];case 6:return G=z.sent(),[3,8];case 7:G={classScore:1,label:0},z.label=8;case 8:O=G,N=O.classScore,H=O.label,m.push(tt({box:new Sn(_,M,_+S,M+D),score:A,classScore:A*N,label:H},L)),z.label=9;case 9:return b++,[3,5];case 10:return y++,[3,4];case 11:return w++,[3,3];case 12:return d.dispose(),p.dispose(),v.dispose(),[2,m]}})})},t.prototype.extractPredictedClass=function(e,n){return K(this,void 0,void 0,function(){var a,i,o,s;return j(this,function(u){switch(u.label){case 0:return a=n.row,i=n.col,o=n.anchor,[4,e.array()];case 1:return s=u.sent(),[2,Array(this.config.classes.length).fill(0).map(function(c,l){return s[a][i][o][l]}).map(function(c,l){return{classScore:c,label:l}}).reduce(function(c,l){return c.classScore>l.classScore?c:l})]}})})},t.DEFAULT_FILTER_SIZES=[3,16,32,64,128,256,512,1024,1024],t})(lt);var Ju=(function(r){Q(t,r);function t(e){e===void 0&&(e=!0);var n=this,a=Object.assign({},{withSeparableConvs:e,iouThreshold:Cd,classes:["face"]},e?{anchors:Dd,meanRgb:Td}:{anchors:Sd,withClassScores:!0});return n=r.call(this,a)||this,n}return Object.defineProperty(t.prototype,"withSeparableConvs",{get:function(){return this.config.withSeparableConvs},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"anchors",{get:function(){return this.config.anchors},enumerable:!0,configurable:!0}),t.prototype.locateFaces=function(e,n){return K(this,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return[4,this.detect(e,n)];case 1:return a=i.sent(),[2,a.map(function(o){return new Ze(o.score,o.relativeBox,{width:o.imageWidth,height:o.imageHeight})})]}})})},t.prototype.getDefaultModelName=function(){return this.withSeparableConvs?Rd:Id},t.prototype.extractParamsFromWeigthMap=function(e){return r.prototype.extractParamsFromWeigthMap.call(this,e)},t})(zo);var Wo=(function(r){Q(t,r);function t(){var e=r!==null&&r.apply(this,arguments)||this;return e._name="TinyFaceDetectorOptions",e}return t})(Rn);var Er=(function(){function r(){}return r.prototype.then=function(t){return K(this,void 0,void 0,function(){var e;return j(this,function(n){switch(n.label){case 0:return e=t,[4,this.run()];case 1:return[2,e.apply(void 0,[n.sent()])]}})})},r.prototype.run=function(){return K(this,void 0,void 0,function(){return j(this,function(t){throw new Error("ComposableTask - run is not implemented")})})},r})();function Mn(r,t,e,n,a){return a===void 0&&(a=function(i){var o=i.alignedRect;return o}),K(this,void 0,void 0,function(){var i,o,s,u,c;return j(this,function(l){switch(l.label){case 0:return i=r.map(function(f){return No(f)?a(f):f.detection}),s=n,s?[3,5]:t instanceof _e?[4,oi(t,i)]:[3,2];case 1:return u=l.sent(),[3,4];case 2:return[4,ii(t,i)];case 3:u=l.sent(),l.label=4;case 4:s=u,l.label=5;case 5:return o=s,[4,e(o)];case 6:return c=l.sent(),o.forEach(function(f){return f instanceof _e&&f.dispose()}),[2,c]}})})}function fa(r,t,e,n,a){return K(this,void 0,void 0,function(){var i=this;return j(this,function(o){return[2,Mn([r],t,function(s){return K(i,void 0,void 0,function(){return j(this,function(u){return[2,e(s[0])]})})},n,a)]})})}function Fd(r){return V(function(){return gt(Me(r,3).reverse(),3)})}var li=2,Bn=12;function Ey(r,t){var e=en(r,t),n=ia(r,t);function a(c,l){var f=Fe(r(c));return t.push({paramPath:l}),f}function i(c,l,f){f===void 0&&(f=!1);var h=e(c[0],c[1],3,l+"/conv1"),d=a(c[1],l+"/prelu1_alpha"),p=e(c[1],c[2],3,l+"/conv2"),v=a(c[2],l+"/prelu2_alpha"),m=e(c[2],c[3],f?2:3,l+"/conv3"),g=a(c[3],l+"/prelu3_alpha");return{conv1:h,prelu1_alpha:d,conv2:p,prelu2_alpha:v,conv3:m,prelu3_alpha:g}}function o(){var c=i([3,10,16,32],"pnet"),l=e(32,2,1,"pnet/conv4_1"),f=e(32,4,1,"pnet/conv4_2");return tt(tt({},c),{conv4_1:l,conv4_2:f})}function s(){var c=i([3,28,48,64],"rnet",!0),l=n(576,128,"rnet/fc1"),f=a(128,"rnet/prelu4_alpha"),h=n(128,2,"rnet/fc2_1"),d=n(128,4,"rnet/fc2_2");return tt(tt({},c),{fc1:l,prelu4_alpha:f,fc2_1:h,fc2_2:d})}function u(){var c=i([3,32,64,64],"onet"),l=e(64,128,2,"onet/conv4"),f=a(128,"onet/prelu4_alpha"),h=n(1152,256,"onet/fc1"),d=a(256,"onet/prelu5_alpha"),p=n(256,2,"onet/fc2_1"),v=n(256,4,"onet/fc2_2"),m=n(256,10,"onet/fc2_3");return tt(tt({},c),{conv4:l,prelu4_alpha:f,fc1:h,prelu5_alpha:d,fc2_1:p,fc2_2:v,fc2_3:m})}return{extractPNetParams:o,extractRNetParams:s,extractONetParams:u}}function kd(r){var t=ht(r),e=t.extractWeights,n=t.getRemainingWeights,a=[],i=Ey(e,a),o=i.extractPNetParams,s=i.extractRNetParams,u=i.extractONetParams,c=o(),l=s(),f=u();if(n().length!==0)throw new Error("weights remaing after extract: "+n().length);return{params:{pnet:c,rnet:l,onet:f},paramMappings:a}}function Cy(r,t){var e=Tt(r,t);function n(l){var f=e(l+"/weights",4,l+"/filters"),h=e(l+"/bias",1);return{filters:f,bias:h}}function a(l){var f=e(l+"/weights",2),h=e(l+"/bias",1);return{weights:f,bias:h}}function i(l){return e(l,1)}function o(l){var f=n(l+"/conv1"),h=i(l+"/prelu1_alpha"),d=n(l+"/conv2"),p=i(l+"/prelu2_alpha"),v=n(l+"/conv3"),m=i(l+"/prelu3_alpha");return{conv1:f,prelu1_alpha:h,conv2:d,prelu2_alpha:p,conv3:v,prelu3_alpha:m}}function s(){var l=o("pnet"),f=n("pnet/conv4_1"),h=n("pnet/conv4_2");return tt(tt({},l),{conv4_1:f,conv4_2:h})}function u(){var l=o("rnet"),f=a("rnet/fc1"),h=i("rnet/prelu4_alpha"),d=a("rnet/fc2_1"),p=a("rnet/fc2_2");return tt(tt({},l),{fc1:f,prelu4_alpha:h,fc2_1:d,fc2_2:p})}function c(){var l=o("onet"),f=n("onet/conv4"),h=i("onet/prelu4_alpha"),d=a("onet/fc1"),p=i("onet/prelu5_alpha"),v=a("onet/fc2_1"),m=a("onet/fc2_2"),g=a("onet/fc2_3");return tt(tt({},l),{conv4:f,prelu4_alpha:h,fc1:d,prelu5_alpha:p,fc2_1:v,fc2_2:m,fc2_3:g})}return{extractPNetParams:s,extractRNetParams:u,extractONetParams:c}}function Nd(r){var t=[],e=Cy(r,t),n=e.extractPNetParams,a=e.extractRNetParams,i=e.extractONetParams,o=n(),s=a(),u=i();return ft(r,t),{params:{pnet:o,rnet:s,onet:u},paramMappings:t}}function fi(r,t){var e=t[0],n=t[1];return{height:Math.floor(e*r),width:Math.floor(n*r)}}function Od(r,t,e){for(var n=e[0],a=e[1],i=Bn/r,o=[],s=Math.min(n,a)*i,u=0;s>=12;)o.push(i*Math.pow(t,u)),s=s*t,u+=1;return o}var ha=(function(r){Q(t,r);function t(e,n,a,i){return r.call(this,{left:e,top:n,right:a,bottom:i},!0)||this}return t})(xt);function Vo(r){return V(function(){return Xe(Pe(r,Y(127.5)),Y(.0078125))})}function zr(r,t){return V(function(){return ie(Re(r),Xe(t,Ya(Re(Ya(r)))))})}function da(r,t,e){return e===void 0&&(e=!1),V(function(){var n=Dt(r,t.conv1,"valid");return n=zr(n,t.prelu1_alpha),n=je(n,e?[2,2]:[3,3],[2,2],"same"),n=Dt(n,t.conv2,"valid"),n=zr(n,t.prelu2_alpha),n=e?n:je(n,[3,3],[2,2],"valid"),n=Dt(n,t.conv3,"valid"),n=zr(n,t.prelu3_alpha),n})}function Ld(r,t){return V(function(){var e=da(r,t,!0),n=Dt(e,t.conv4_1,"valid"),a=Et(An(n,3),3),i=_t(Pe(n,a),3),o=Dt(e,t.conv4_2,"valid");return{prob:i,regions:o}})}function Sy(r,t){return V(function(){var e=fi(t,r.shape.slice(1)),n=e.height,a=e.width,i=$a.resizeBilinear(r,[n,a]),o=Vo(i);return er(o,[0,2,1,3])})}function Dy(r,t,e,n){for(var a=[],i=r.arraySync(),o=0;o<r.shape[0];o++)for(var s=0;s<r.shape[1];s++)i[o][s]>=n&&a.push(new de(s,o));var u=a.map(function(c){var l=new Sn(Math.round((c.y*li+1)/e),Math.round((c.x*li+1)/e),Math.round((c.y*li+Bn)/e),Math.round((c.x*li+Bn)/e)),f=i[c.y][c.x],h=t.arraySync(),d=new ha(h[c.y][c.x][0],h[c.y][c.x][1],h[c.y][c.x][2],h[c.y][c.x][3]);return{cell:l,score:f,region:d}});return u}function Ud(r,t,e,n,a){a.stage1=[];var i=t.map(function(h){return V(function(){var d={scale:h},p=Sy(r,h),v=Date.now(),m=Ld(p,n),g=m.prob,x=m.regions;d.pnet=Date.now()-v;var w=Me(Me(g,3)[1])[0],y=Me(x)[0];return{scoresTensor:w,regionsTensor:y,scale:h,statsForScale:d}})}),o=i.map(function(h){var d=h.scoresTensor,p=h.regionsTensor,v=h.scale,m=h.statsForScale,g=Dy(d,p,v,e);if(d.dispose(),p.dispose(),!g.length)return a.stage1.push(m),[];var x=Date.now(),w=Or(g.map(function(y){return y.cell}),g.map(function(y){return y.score}),.5);return m.nms=Date.now()-x,m.numBoxes=w.length,a.stage1.push(m),w.map(function(y){return g[y]})}),s=o.reduce(function(h,d){return h.concat(d)},[]),u=[],c=[];if(s.length>0){var l=Date.now(),f=Or(s.map(function(h){return h.cell}),s.map(function(h){return h.score}),.7);a.stage1_nms=Date.now()-l,c=f.map(function(h){return s[h].score}),u=f.map(function(h){return s[h]}).map(function(h){var d=h.cell,p=h.region;return new Sn(d.left+p.left*d.width,d.top+p.top*d.height,d.right+p.right*d.width,d.bottom+p.bottom*d.height).toSquare().round()})}return{boxes:u,scores:c}}function Xo(r,t,e){var n=e.width,a=e.height;return K(this,void 0,void 0,function(){var i,o,s,u=this;return j(this,function(c){switch(c.label){case 0:return i=yt(r),[4,Promise.all(t.map(function(l){return K(u,void 0,void 0,function(){var f,h,d,p,v,m,g,x;return j(this,function(w){return f=l.padAtBorders(r.height,r.width),h=f.y,d=f.ey,p=f.x,v=f.ex,m=p-1,g=h-1,x=i.getImageData(m,g,v-m,d-g),[2,Te.isNodejs()?aa(x):createImageBitmap(x)]})})}))];case 1:return o=c.sent(),s=[],o.forEach(function(l){var f=Dn({width:n,height:a}),h=yt(f);h.drawImage(l,0,0,n,a);for(var d=h.getImageData(0,0,n,a).data,p=[],v=0;v<d.length;v+=4)p.push(d[v+2]),p.push(d[v+1]),p.push(d[v]);s.push(p)}),[2,s.map(function(l){var f=V(function(){var h=er(at(l,[1,n,a,3]),[0,2,1,3]).toFloat();return Vo(h)});return f})]}})})}function Gd(r,t){return V(function(){var e=da(r,t),n=Bt(e,[e.shape[0],t.fc1.weights.shape[0]]),a=Lt(n,t.fc1),i=zr(a,t.prelu4_alpha),o=Lt(i,t.fc2_1),s=Et(An(o,1),1),u=_t(Pe(o,s),1),c=Lt(i,t.fc2_2),l=Me(u,1)[1];return{scores:l,regions:c}})}function Hd(r,t,e,n,a){return K(this,void 0,void 0,function(){var i,o,s,u,c,l,f,h,d,p,v,m,g,x;return j(this,function(w){switch(w.label){case 0:return i=Date.now(),[4,Xo(r,t,{width:24,height:24})];case 1:return o=w.sent(),a.stage2_extractImagePatches=Date.now()-i,i=Date.now(),s=o.map(function(y){var b=Gd(y,n);return y.dispose(),b}),a.stage2_rnet=Date.now()-i,u=s.length>1?Ge(s.map(function(y){return y.scores})):s[0].scores,f=(l=Array).from,[4,u.data()];case 2:return c=f.apply(l,[w.sent()]),u.dispose(),h=c.map(function(y,b){return{score:y,idx:b}}).filter(function(y){return y.score>e}).map(function(y){var b=y.idx;return b}),d=h.map(function(y){return t[y]}),p=h.map(function(y){return c[y]}),v=[],m=[],d.length>0&&(i=Date.now(),g=Or(d,p,.7),a.stage2_nms=Date.now()-i,x=g.map(function(y){var b=s[h[y]].regions.arraySync();return new ha(b[0][0],b[0][1],b[0][2],b[0][3])}),m=g.map(function(y){return p[y]}),v=g.map(function(y,b){return d[y].calibrate(x[b])})),s.forEach(function(y){y.regions.dispose(),y.scores.dispose()}),[2,{boxes:v,scores:m}]}})})}function zd(r,t){return V(function(){var e=da(r,t);e=je(e,[2,2],[2,2],"same"),e=Dt(e,t.conv4,"valid"),e=zr(e,t.prelu4_alpha);var n=Bt(e,[e.shape[0],t.fc1.weights.shape[0]]),a=Lt(n,t.fc1),i=zr(a,t.prelu5_alpha),o=Lt(i,t.fc2_1),s=Et(An(o,1),1),u=_t(Pe(o,s),1),c=Lt(i,t.fc2_2),l=Lt(i,t.fc2_3),f=Me(u,1)[1];return{scores:f,regions:c,points:l}})}function Wd(r,t,e,n,a){return K(this,void 0,void 0,function(){var i,o,s,u,c,l,f,h,d,p,v,m,g,x,w;return j(this,function(y){switch(y.label){case 0:return i=Date.now(),[4,Xo(r,t,{width:48,height:48})];case 1:return o=y.sent(),a.stage3_extractImagePatches=Date.now()-i,i=Date.now(),s=o.map(function(b){var A=zd(b,n);return b.dispose(),A}),a.stage3_onet=Date.now()-i,u=s.length>1?Ge(s.map(function(b){return b.scores})):s[0].scores,f=(l=Array).from,[4,u.data()];case 2:return c=f.apply(l,[y.sent()]),u.dispose(),h=c.map(function(b,A){return{score:b,idx:A}}).filter(function(b){return b.score>e}).map(function(b){var A=b.idx;return A}),d=h.map(function(b){var A=s[b].regions.arraySync();return new ha(A[0][0],A[0][1],A[0][2],A[0][3])}),p=h.map(function(b,A){return t[b].calibrate(d[A])}),v=h.map(function(b){return c[b]}),m=[],g=[],x=[],p.length>0&&(i=Date.now(),w=Or(p,v,.7,!1),a.stage3_nms=Date.now()-i,m=w.map(function(b){return p[b]}),g=w.map(function(b){return v[b]}),x=w.map(function(b,A){return Array(5).fill(0).map(function(I,T){var S=s[b].points.arraySync();return new de(S[0][T]*(m[A].width+1)+m[A].left,S[0][T+5]*(m[A].height+1)+m[A].top)})})),s.forEach(function(b){b.regions.dispose(),b.scores.dispose(),b.points.dispose()}),[2,{boxes:m,scores:g,points:x}]}})})}var $u=(function(r){Q(t,r);function t(){return r.call(this,"Mtcnn")||this}return t.prototype.load=function(e){return K(this,void 0,void 0,function(){return j(this,function(n){return console.warn("mtcnn is deprecated and will be removed soon"),[2,r.prototype.load.call(this,e)]})})},t.prototype.loadFromDisk=function(e){return K(this,void 0,void 0,function(){return j(this,function(n){return console.warn("mtcnn is deprecated and will be removed soon"),[2,r.prototype.loadFromDisk.call(this,e)]})})},t.prototype.forwardInput=function(e,n){return n===void 0&&(n={}),K(this,void 0,void 0,function(){var a,i,o,s,u,c,l,f,h,d,p,v,m,g,x,w,y,b,A,I,T;return j(this,function(S){switch(S.label){case 0:if(a=this.params,!a)throw new Error("Mtcnn - load model before inference");if(i=e.canvases[0],!i)throw new Error("Mtcnn - inputCanvas is not defined, note that passing tensors into Mtcnn.forwardInput is not supported yet.");return o={},s=Date.now(),u=V(function(){return Fd(Et($n.fromPixels(i)).toFloat())}),c=function(D){return u.dispose(),o.total=Date.now()-s,D},l=u.shape.slice(1),f=l[0],h=l[1],d=new ci(n),p=d.minFaceSize,v=d.scaleFactor,m=d.maxNumScales,g=d.scoreThresholds,x=d.scaleSteps,w=(x||Od(p,v,[f,h])).filter(function(D){var _=fi(D,[f,h]);return Math.min(_.width,_.height)>Bn}).slice(0,m),o.scales=w,o.pyramid=w.map(function(D){return fi(D,[f,h])}),y=Date.now(),[4,Ud(u,w,g[0],a.pnet,o)];case 1:return b=S.sent(),o.total_stage1=Date.now()-y,b.boxes.length?(o.stage2_numInputBoxes=b.boxes.length,y=Date.now(),[4,Hd(i,b.boxes,g[1],a.rnet,o)]):[2,c({results:[],stats:o})];case 2:return A=S.sent(),o.total_stage2=Date.now()-y,A.boxes.length?(o.stage3_numInputBoxes=A.boxes.length,y=Date.now(),[4,Wd(i,A.boxes,g[2],a.onet,o)]):[2,c({results:[],stats:o})];case 3:return I=S.sent(),o.total_stage3=Date.now()-y,T=I.boxes.map(function(D,_){return ua(ra({},new Ze(I.scores[_],new ta(D.left/h,D.top/f,D.width/h,D.height/f),{height:f,width:h})),new Xh(I.points[_].map(function(M){return M.sub(new de(D.left,D.top)).div(new de(D.width,D.height))}),{width:D.width,height:D.height}))}),[2,c({results:T,stats:o})]}})})},t.prototype.forward=function(e,n){return n===void 0&&(n={}),K(this,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return a=this.forwardInput,[4,Be(e)];case 1:return[4,a.apply(this,[i.sent(),n])];case 2:return[2,i.sent().results]}})})},t.prototype.forwardWithStats=function(e,n){return n===void 0&&(n={}),K(this,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return a=this.forwardInput,[4,Be(e)];case 1:return[2,a.apply(this,[i.sent(),n])]}})})},t.prototype.getDefaultModelName=function(){return"mtcnn_model"},t.prototype.extractParamsFromWeigthMap=function(e){return Nd(e)},t.prototype.extractParams=function(e){return kd(e)},t})(lt);var Vd=.4,Xd=[new de(1.603231,2.094468),new de(6.041143,7.080126),new de(2.882459,3.518061),new de(4.266906,5.178857),new de(9.041765,10.66308)],Kd=[117.001,114.697,97.404];var ec=(function(r){Q(t,r);function t(){var e=this,n={withSeparableConvs:!0,iouThreshold:Vd,classes:["face"],anchors:Xd,meanRgb:Kd,isFirstLayerConv2d:!0,filterSizes:[3,16,32,64,128,256,512]};return e=r.call(this,n)||this,e}return Object.defineProperty(t.prototype,"anchors",{get:function(){return this.config.anchors},enumerable:!0,configurable:!0}),t.prototype.locateFaces=function(e,n){return K(this,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return[4,this.detect(e,n)];case 1:return a=i.sent(),[2,a.map(function(o){return new Ze(o.score,o.relativeBox,{width:o.imageWidth,height:o.imageHeight})})]}})})},t.prototype.getDefaultModelName=function(){return"tiny_face_detector_model"},t.prototype.extractParamsFromWeigthMap=function(e){return r.prototype.extractParamsFromWeigthMap.call(this,e)},t})(zo);var rt={ssdMobilenetv1:new Go,tinyFaceDetector:new ec,tinyYolov2:new Ju,mtcnn:new $u,faceLandmark68Net:new Lo,faceLandmark68TinyNet:new dd,faceRecognitionNet:new Yu,faceExpressionNet:new rd,ageGenderNet:new cd};var jd=(function(r){Q(t,r);function t(e,n,a){var i=r.call(this)||this;return i.parentTask=e,i.input=n,i.extractedFaces=a,i}return t})(Er);var hi=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a=this;return j(this,function(i){switch(i.label){case 0:return[4,this.parentTask];case 1:return e=i.sent(),[4,Mn(e,this.input,function(o){return K(a,void 0,void 0,function(){return j(this,function(s){switch(s.label){case 0:return[4,Promise.all(o.map(function(u){return rt.faceExpressionNet.predictExpressions(u)}))];case 1:return[2,s.sent()]}})})},this.extractedFaces)];case 2:return n=i.sent(),[2,e.map(function(o,s){return Vu(o,n[s])})]}})})},t.prototype.withAgeAndGender=function(){return new pi(this,this.input)},t})(jd);var di=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n;return j(this,function(a){switch(a.label){case 0:return[4,this.parentTask];case 1:return e=a.sent(),e?[4,fa(e,this.input,function(i){return rt.faceExpressionNet.predictExpressions(i)},this.extractedFaces)]:[2];case 2:return n=a.sent(),[2,Vu(e,n)]}})})},t.prototype.withAgeAndGender=function(){return new vi(this,this.input)},t})(jd);var pa=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.withAgeAndGender=function(){return new ma(this,this.input)},t.prototype.withFaceDescriptors=function(){return new xa(this,this.input)},t})(hi);var va=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.withAgeAndGender=function(){return new ga(this,this.input)},t.prototype.withFaceDescriptor=function(){return new ya(this,this.input)},t})(di);var Yd=(function(r){Q(t,r);function t(e,n,a){var i=r.call(this)||this;return i.parentTask=e,i.input=n,i.extractedFaces=a,i}return t})(Er);var pi=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a=this;return j(this,function(i){switch(i.label){case 0:return[4,this.parentTask];case 1:return e=i.sent(),[4,Mn(e,this.input,function(o){return K(a,void 0,void 0,function(){return j(this,function(s){switch(s.label){case 0:return[4,Promise.all(o.map(function(u){return rt.ageGenderNet.predictAgeAndGender(u)}))];case 1:return[2,s.sent()]}})})},this.extractedFaces)];case 2:return n=i.sent(),[2,e.map(function(o,s){var u=n[s],c=u.age,l=u.gender,f=u.genderProbability;return qu(Zu(o,l,f),c)})]}})})},t.prototype.withFaceExpressions=function(){return new hi(this,this.input)},t})(Yd);var vi=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a,i,o;return j(this,function(s){switch(s.label){case 0:return[4,this.parentTask];case 1:return e=s.sent(),e?[4,fa(e,this.input,function(u){return rt.ageGenderNet.predictAgeAndGender(u)},this.extractedFaces)]:[2];case 2:return n=s.sent(),a=n.age,i=n.gender,o=n.genderProbability,[2,qu(Zu(e,i,o),a)]}})})},t.prototype.withFaceExpressions=function(){return new di(this,this.input)},t})(Yd);var ma=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.withFaceExpressions=function(){return new pa(this,this.input)},t.prototype.withFaceDescriptors=function(){return new xa(this,this.input)},t})(pi);var ga=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.withFaceExpressions=function(){return new va(this,this.input)},t.prototype.withFaceDescriptor=function(){return new ya(this,this.input)},t})(vi);var Qd=(function(r){Q(t,r);function t(e,n){var a=r.call(this)||this;return a.parentTask=e,a.input=n,a}return t})(Er);var xa=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n;return j(this,function(a){switch(a.label){case 0:return[4,this.parentTask];case 1:return e=a.sent(),[4,Mn(e,this.input,function(i){return Promise.all(i.map(function(o){return rt.faceRecognitionNet.computeFaceDescriptor(o)}))},null,function(i){return i.landmarks.align(null,{useDlibAlignment:!0})})];case 2:return n=a.sent(),[2,n.map(function(i,o){return Qu(e[o],i)})]}})})},t.prototype.withFaceExpressions=function(){return new pa(this,this.input)},t.prototype.withAgeAndGender=function(){return new ma(this,this.input)},t})(Qd);var ya=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n;return j(this,function(a){switch(a.label){case 0:return[4,this.parentTask];case 1:return e=a.sent(),e?[4,fa(e,this.input,function(i){return rt.faceRecognitionNet.computeFaceDescriptor(i)},null,function(i){return i.landmarks.align(null,{useDlibAlignment:!0})})]:[2];case 2:return n=a.sent(),[2,Qu(e,n)]}})})},t.prototype.withFaceExpressions=function(){return new va(this,this.input)},t.prototype.withAgeAndGender=function(){return new ga(this,this.input)},t})(Qd);var qd=(function(r){Q(t,r);function t(e,n,a){var i=r.call(this)||this;return i.parentTask=e,i.input=n,i.useTinyLandmarkNet=a,i}return Object.defineProperty(t.prototype,"landmarkNet",{get:function(){return this.useTinyLandmarkNet?rt.faceLandmark68TinyNet:rt.faceLandmark68Net},enumerable:!0,configurable:!0}),t})(Er);var Zd=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a,i,o,s=this;return j(this,function(u){switch(u.label){case 0:return[4,this.parentTask];case 1:return e=u.sent(),n=e.map(function(c){return c.detection}),this.input instanceof _e?[4,oi(this.input,n)]:[3,3];case 2:return i=u.sent(),[3,5];case 3:return[4,ii(this.input,n)];case 4:i=u.sent(),u.label=5;case 5:return a=i,[4,Promise.all(a.map(function(c){return s.landmarkNet.detectLandmarks(c)}))];case 6:return o=u.sent(),a.forEach(function(c){return c instanceof _e&&c.dispose()}),[2,e.map(function(c,l){return ua(c,o[l])})]}})})},t.prototype.withFaceExpressions=function(){return new pa(this,this.input)},t.prototype.withAgeAndGender=function(){return new ma(this,this.input)},t.prototype.withFaceDescriptors=function(){return new xa(this,this.input)},t})(qd);var Jd=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a,i,o;return j(this,function(s){switch(s.label){case 0:return[4,this.parentTask];case 1:return e=s.sent(),e?(n=e.detection,this.input instanceof _e?[4,oi(this.input,[n])]:[3,3]):[2];case 2:return i=s.sent(),[3,5];case 3:return[4,ii(this.input,[n])];case 4:i=s.sent(),s.label=5;case 5:return a=i,[4,this.landmarkNet.detectLandmarks(a[0])];case 6:return o=s.sent(),a.forEach(function(u){return u instanceof _e&&u.dispose()}),[2,ua(e,o)]}})})},t.prototype.withFaceExpressions=function(){return new va(this,this.input)},t.prototype.withAgeAndGender=function(){return new ga(this,this.input)},t.prototype.withFaceDescriptor=function(){return new ya(this,this.input)},t})(qd);var $d=(function(r){Q(t,r);function t(e,n){n===void 0&&(n=new tn);var a=r.call(this)||this;return a.input=e,a.options=n,a}return t})(Er);var ep=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n,a,i;return j(this,function(o){switch(o.label){case 0:return e=this,n=e.input,a=e.options,a instanceof ci?[4,rt.mtcnn.forward(n,a)]:[3,2];case 1:return[2,o.sent().map(function(s){return s.detection})];case 2:if(i=a instanceof Wo?function(s){return rt.tinyFaceDetector.locateFaces(s,a)}:a instanceof tn?function(s){return rt.ssdMobilenetv1.locateFaces(s,a)}:a instanceof Rn?function(s){return rt.tinyYolov2.locateFaces(s,a)}:null,!i)throw new Error("detectFaces - expected options to be instance of TinyFaceDetectorOptions | SsdMobilenetv1Options | MtcnnOptions | TinyYolov2Options");return[2,i(n)]}})})},t.prototype.runAndExtendWithFaceDetections=function(){var e=this;return new Promise(function(n){return K(e,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return[4,this.run()];case 1:return a=i.sent(),[2,n(a.map(function(o){return ra({},o)}))]}})})})},t.prototype.withFaceLandmarks=function(e){return e===void 0&&(e=!1),new Zd(this.runAndExtendWithFaceDetections(),this.input,e)},t.prototype.withFaceExpressions=function(){return new hi(this.runAndExtendWithFaceDetections(),this.input)},t.prototype.withAgeAndGender=function(){return new pi(this.runAndExtendWithFaceDetections(),this.input)},t})($d);var tp=(function(r){Q(t,r);function t(){return r!==null&&r.apply(this,arguments)||this}return t.prototype.run=function(){return K(this,void 0,void 0,function(){var e,n;return j(this,function(a){switch(a.label){case 0:return[4,new ep(this.input,this.options)];case 1:return e=a.sent(),n=e[0],e.forEach(function(i){i.score>n.score&&(n=i)}),[2,n]}})})},t.prototype.runAndExtendWithFaceDetection=function(){var e=this;return new Promise(function(n){return K(e,void 0,void 0,function(){var a;return j(this,function(i){switch(i.label){case 0:return[4,this.run()];case 1:return a=i.sent(),[2,n(a?ra({},a):void 0)]}})})})},t.prototype.withFaceLandmarks=function(e){return e===void 0&&(e=!1),new Jd(this.runAndExtendWithFaceDetection(),this.input,e)},t.prototype.withFaceExpressions=function(){return new di(this.runAndExtendWithFaceDetection(),this.input)},t.prototype.withAgeAndGender=function(){return new vi(this.runAndExtendWithFaceDetection(),this.input)},t})($d);function rp(r,t){return t===void 0&&(t=new tn),new tp(r,t)}function np(r,t){if(r.length!==t.length)throw new Error("euclideanDistance: arr1.length !== arr2.length");var e=Array.from(r),n=Array.from(t);return Math.sqrt(e.map(function(a,i){return a-n[i]}).reduce(function(a,i){return a+Math.pow(i,2)},0))}var oB=(function(){function r(t,e){e===void 0&&(e=.6),this._distanceThreshold=e;var n=Array.isArray(t)?t:[t];if(!n.length)throw new Error("FaceRecognizer.constructor - expected atleast one input");var a=1,i=function(){return"person "+a++};this._labeledDescriptors=n.map(function(o){if(o instanceof ri)return o;if(o instanceof Float32Array)return new ri(i(),[o]);if(o.descriptor&&o.descriptor instanceof Float32Array)return new ri(i(),[o.descriptor]);throw new Error("FaceRecognizer.constructor - expected inputs to be of type LabeledFaceDescriptors | WithFaceDescriptor<any> | Float32Array | Array<LabeledFaceDescriptors | WithFaceDescriptor<any> | Float32Array>")})}return Object.defineProperty(r.prototype,"labeledDescriptors",{get:function(){return this._labeledDescriptors},enumerable:!0,configurable:!0}),Object.defineProperty(r.prototype,"distanceThreshold",{get:function(){return this._distanceThreshold},enumerable:!0,configurable:!0}),r.prototype.computeMeanDistance=function(t,e){return e.map(function(n){return np(n,t)}).reduce(function(n,a){return n+a},0)/(e.length||1)},r.prototype.matchDescriptor=function(t){var e=this;return this.labeledDescriptors.map(function(n){var a=n.descriptors,i=n.label;return new _u(i,e.computeMeanDistance(t,a))}).reduce(function(n,a){return n.distance<a.distance?n:a})},r.prototype.findBestMatch=function(t){var e=this.matchDescriptor(t);return e.distance<this.distanceThreshold?e:new _u("unknown",e.distance)},r.prototype.toJSON=function(){return{distanceThreshold:this.distanceThreshold,labeledDescriptors:this.labeledDescriptors.map(function(t){return t.toJSON()})}},r.fromJSON=function(t){var e=t.labeledDescriptors.map(function(n){return ri.fromJSON(n)});return new r(e,t.distanceThreshold)},r})();var Iy=(()=>{let r=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),e=new vc;return e.setAttribute("position",new ts(r,3)),e.setAttribute("uv",new ts(t,2)),e})(),pr=class ac{static get fullscreenGeometry(){return Iy}constructor(t="Pass",e=new Sa,n=new Ti){this.name=t,this.renderer=null,this.scene=e,this.camera=n,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthBlit=!1,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(t){if(this.rtt===t){let e=this.fullscreenMaterial;e!==null&&(e.needsUpdate=!0),this.rtt=!t}}set mainScene(t){}set mainCamera(t){}setRenderer(t){this.renderer=t}isEnabled(){return this.enabled}setEnabled(t){this.enabled=t}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(t){let e=this.screen;e!==null?e.material=t:(e=new Di(ac.fullscreenGeometry,t),e.frustumCulled=!1,this.scene===null&&(this.scene=new Sa),this.scene.add(e),this.screen=e)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(t){this.fullscreenMaterial=t}getDepthTexture(){return null}setDepthTexture(t,e=Vr){}render(t,e,n,a,i){throw new Error("Render method not implemented!")}setSize(t,e){}initialize(t,e,n){}dispose(){for(let t of Object.keys(this)){let e=this[t];(e instanceof dt||e instanceof Si||e instanceof Ei||e instanceof ac)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},Ry=class extends pr{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(r,t,e,n,a){let i=r.state.buffers.stencil;i.setLocked(!1),i.setTest(!1)}},My=`#ifdef COLOR_WRITE
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
}`,sp="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",up=class extends At{constructor(){super({name:"CopyMaterial",defines:{COLOR_SPACE_CONVERSION:"1",DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new pe(null),depthBuffer:new pe(null),channelWeights:new pe(null),opacity:new pe(1)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:My,vertexShader:sp}),this.depthFunc=cc}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(r){let t=r!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=r}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(r){let t=r!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=r}set depthPacking(r){this.defines.DEPTH_PACKING=r.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(r){this.colorSpaceConversion!==r&&(r?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(r){r!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=r):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(r){this.uniforms.inputBuffer.value=r}getOpacity(r){return this.uniforms.opacity.value}setOpacity(r){this.uniforms.opacity.value=r}},By=class extends pr{constructor(r,t=!0){super("CopyPass"),this.fullscreenMaterial=new up,this.needsSwap=!1,this.renderTarget=r,r===void 0&&(this.renderTarget=new dt(1,1,{minFilter:Fn,magFilter:Fn,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(r){this.autoResize=r}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(r){this.autoResize=r}render(r,t,e,n,a){this.fullscreenMaterial.inputBuffer=t.texture,r.setRenderTarget(this.renderToScreen?null:this.renderTarget),r.render(this.scene,this.camera)}setSize(r,t){this.autoResize&&this.renderTarget.setSize(r,t)}initialize(r,t,e){e!==void 0&&(this.renderTarget.texture.type=e,e!==Wt?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":r!==null&&r.outputColorSpace===We&&(this.renderTarget.texture.colorSpace=We))}},ap=new Ci,cp=class extends pr{constructor(r=!0,t=!0,e=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=r,this.depth=t,this.stencil=e,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(r,t,e){this.color=r,this.depth=t,this.stencil=e}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(r){this.overrideClearColor=r}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(r){this.overrideClearAlpha=r}render(r,t,e,n,a){let i=this.overrideClearColor,o=this.overrideClearAlpha,s=r.getClearAlpha(),u=i!==null,c=o>=0;u?(r.getClearColor(ap),r.setClearColor(i,c?o:s)):c&&r.setClearAlpha(o),r.setRenderTarget(this.renderToScreen?null:t),r.clear(this.color,this.depth,this.stencil),u?r.setClearColor(ap,s):c&&r.setClearAlpha(s)}},_y=class extends pr{constructor(r,t){super("MaskPass",r,t),this.needsSwap=!1,this.clearPass=new cp(!1,!1,!0),this.inverse=!1}set mainScene(r){this.scene=r}set mainCamera(r){this.camera=r}get inverted(){return this.inverse}set inverted(r){this.inverse=r}get clear(){return this.clearPass.enabled}set clear(r){this.clearPass.enabled=r}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(r){this.inverted=r}render(r,t,e,n,a){let i=r.getContext(),o=r.state.buffers,s=this.scene,u=this.camera,c=this.clearPass,l=this.inverted?0:1,f=1-l;o.color.setMask(!1),o.depth.setMask(!1),o.color.setLocked(!0),o.depth.setLocked(!0),o.stencil.setTest(!0),o.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),o.stencil.setFunc(i.ALWAYS,l,4294967295),o.stencil.setClear(f),o.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?c.render(r,null):(c.render(r,t),c.render(r,e))),this.renderToScreen?(r.setRenderTarget(null),r.render(s,u)):(r.setRenderTarget(t),r.render(s,u),r.setRenderTarget(e),r.render(s,u)),o.color.setLocked(!1),o.depth.setLocked(!1),o.stencil.setLocked(!1),o.stencil.setFunc(i.EQUAL,1,4294967295),o.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),o.stencil.setLocked(!0)}},tc=1/1e3,Py=1e3,Fy=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(r){typeof document<"u"&&document.hidden!==void 0&&(r?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=r)}get delta(){return this._delta*tc}get fixedDelta(){return this._fixedDelta*tc}set fixedDelta(r){this._fixedDelta=r*Py}get elapsed(){return this._elapsed*tc}update(r){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(r!==void 0?r:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(r){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},lp=class{constructor(r=null,{depthBuffer:t=!0,stencilBuffer:e=!1,multisampling:n=0,frameBufferType:a}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,e,a,n),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new By,this.depthRenderTarget=null,this.passes=[],this.timer=new Fy,this.autoRenderToScreen=!0,this.setRenderer(r)}get stableDepthTexture(){return this.depthRenderTarget===null?null:this.depthRenderTarget.depthTexture}get multisampling(){return this.inputBuffer.samples}set multisampling(r){this.multisampling!==r&&(this.inputBuffer.samples=r,this.outputBuffer.samples=r,this.inputBuffer.dispose(),this.outputBuffer.dispose())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(r){if(this.renderer=r,r!==null){let t=r.getSize(new Ie),e=r.getContext().getContextAttributes().alpha,n=this.inputBuffer.texture.type;n===Wt&&r.outputColorSpace===We&&(this.inputBuffer.texture.colorSpace=We,this.outputBuffer.texture.colorSpace=We,this.inputBuffer.dispose(),this.outputBuffer.dispose()),r.autoClear=!1,this.setSize(t.width,t.height);for(let a of this.passes)a.initialize(r,e,n)}}replaceRenderer(r,t=!0){let e=this.renderer,n=e.domElement.parentNode;return this.setRenderer(r),t&&n!==null&&(n.removeChild(e.domElement),n.appendChild(r.domElement)),e}createDepthTexture(){let r=new mc;r.name="EffectComposer.InputDepth",this.inputBuffer.stencilBuffer?(r.format=dc,r.type=hc):r.type=fc;let t=r.clone();t.name="EffectComposer.OutputDepth";let e=r.clone();e.name="EffectComposer.StableDepth",this.inputBuffer.depthTexture=r,this.outputBuffer.depthTexture=t,this.inputBuffer.dispose(),this.outputBuffer.dispose();let{width:n,height:a}=this.inputBuffer;this.depthRenderTarget=new dt(n,a,{depthBuffer:!0,stencilBuffer:this.inputBuffer.stencilBuffer,depthTexture:e})}blitDepthBuffer(r){let t=this.renderer,e=this.depthRenderTarget,n=t.properties,a=t.getContext();t.setRenderTarget(e);let i=n.get(r).__webglFramebuffer,o=n.get(e).__webglFramebuffer,s=r.stencilBuffer?a.DEPTH_BUFFER_BIT|a.STENCIL_BUFFER_BIT:a.DEPTH_BUFFER_BIT;a.bindFramebuffer(a.READ_FRAMEBUFFER,i),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,o),a.blitFramebuffer(0,0,r.width,r.height,0,0,e.width,e.height,s,a.NEAREST),a.bindFramebuffer(a.READ_FRAMEBUFFER,null),a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),t.setRenderTarget(null)}deleteDepthTexture(){let r=this.stableDepthTexture;for(let t of this.passes)t.getDepthTexture()===r&&t.setDepthTexture(null);this.depthRenderTarget!==null&&(this.depthRenderTarget.dispose(),this.depthRenderTarget=null),this.inputBuffer.depthTexture!==null&&(this.inputBuffer.depthTexture.dispose(),this.inputBuffer.depthTexture=null),this.outputBuffer.depthTexture!==null&&(this.outputBuffer.depthTexture.dispose(),this.outputBuffer.depthTexture=null)}createBuffer(r,t,e,n){let a=this.renderer,i=a===null?new Ie:a.getDrawingBufferSize(new Ie),o=new dt(i.width,i.height,{minFilter:Fn,magFilter:Fn,samples:n,stencilBuffer:t,depthBuffer:r,type:e});return e===Wt&&a!==null&&a.outputColorSpace===We&&(o.texture.colorSpace=We),o.texture.name="EffectComposer.Buffer",o.texture.generateMipmaps=!1,o}setMainScene(r){for(let t of this.passes)t.mainScene=r}setMainCamera(r){for(let t of this.passes)t.mainCamera=r}addPass(r,t){let e=this.passes,n=this.renderer,a=n.getDrawingBufferSize(new Ie),i=n.getContext().getContextAttributes().alpha,o=this.inputBuffer.texture.type;if(r.renderer=n,r.setSize(a.width,a.height),r.initialize(n,i,o),this.autoRenderToScreen&&(e.length>0&&(e[e.length-1].renderToScreen=!1),r.renderToScreen&&(this.autoRenderToScreen=!1)),t!==void 0?e.splice(t,0,r):e.push(r),this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!0),r.needsDepthTexture||this.depthRenderTarget!==null)if(this.depthRenderTarget===null){this.createDepthTexture();for(let s of e)s.setDepthTexture(this.stableDepthTexture)}else r.setDepthTexture(this.stableDepthTexture)}removePass(r){let t=this.passes,e=t.indexOf(r);if(e!==-1&&t.splice(e,1).length>0){let i=this.stableDepthTexture;if(i!==null){let o=(u,c)=>u||c.needsDepthTexture;t.reduce(o,!1)||(r.getDepthTexture()===i&&r.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&e===t.length&&(r.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){let r=this.passes;this.deleteDepthTexture(),r.length>0&&(this.autoRenderToScreen&&(r[r.length-1].renderToScreen=!1),this.passes=[])}render(r){let t=this.renderer,e=this.copyPass,n=this.inputBuffer,a=this.outputBuffer,i,o=!1;r===void 0&&(this.timer.update(),r=this.timer.getDelta());for(let s of this.passes)if(s.enabled){if(s.render(t,n,a,r,o),s.needsDepthBlit&&this.depthRenderTarget!==null&&this.blitDepthBuffer(n),s.needsSwap){if(o){e.renderToScreen=s.renderToScreen;let u=t.getContext(),c=t.state.buffers.stencil;c.setFunc(u.NOTEQUAL,1,4294967295),e.render(t,n,a,r,o),c.setFunc(u.EQUAL,1,4294967295)}i=n,n=a,a=i}s instanceof _y?o=!0:s instanceof Ry&&(o=!1)}}setSize(r,t,e){let n=this.renderer,a=n.getSize(new Ie);(r===void 0||t===void 0)&&(r=a.width,t=a.height),(a.width!==r||a.height!==t)&&n.setSize(r,t,e);let i=n.getDrawingBufferSize(new Ie);this.inputBuffer.setSize(i.width,i.height),this.outputBuffer.setSize(i.width,i.height),this.depthRenderTarget!==null&&this.depthRenderTarget.setSize(i.width,i.height);for(let o of this.passes)o.setSize(i.width,i.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(let r of this.passes)r.dispose();this.deleteDepthTexture(),this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.copyPass.dispose(),this.timer.dispose(),this.passes=[],pr.fullscreenGeometry.dispose()}},nn={NONE:0,DEPTH:1,CONVOLUTION:2},Ce={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},ky=class{constructor(){this.shaderParts=new Map([[Ce.FRAGMENT_HEAD,null],[Ce.FRAGMENT_MAIN_UV,null],[Ce.FRAGMENT_MAIN_IMAGE,null],[Ce.VERTEX_HEAD,null],[Ce.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=nn.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=Ai}};var rc=!1,ip=class{constructor(r=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(r),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let e;if(t.material.flatShading)switch(t.material.side){case Ca:e=this.materialsFlatShadedDoubleSide;break;case Ea:e=this.materialsFlatShadedBackSide;break;default:e=this.materialsFlatShaded;break}else switch(t.material.side){case Ca:e=this.materialsDoubleSide;break;case Ea:e=this.materialsBackSide;break;default:e=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=e[2]:t.isInstancedMesh?t.material=e[1]:t.material=e[0],++this.meshCount}}}cloneMaterial(r){if(!(r instanceof At))return r.clone();let t=r.uniforms,e=new Map;for(let a in t){let i=t[a].value;i.isRenderTargetTexture&&(t[a].value=null,e.set(a,i))}let n=r.clone();for(let a of e)t[a[0]].value=a[1],n.uniforms[a[0]].value=a[1];return n}setMaterial(r){if(this.disposeMaterials(),this.material=r,r!==null){let t=this.materials=[this.cloneMaterial(r),this.cloneMaterial(r),this.cloneMaterial(r)];for(let e of t)e.uniforms=Object.assign({},r.uniforms),e.side=uc;t[2].skinning=!0,this.materialsBackSide=t.map(e=>{let n=this.cloneMaterial(e);return n.uniforms=Object.assign({},r.uniforms),n.side=Ea,n}),this.materialsDoubleSide=t.map(e=>{let n=this.cloneMaterial(e);return n.uniforms=Object.assign({},r.uniforms),n.side=Ca,n}),this.materialsFlatShaded=t.map(e=>{let n=this.cloneMaterial(e);return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n}),this.materialsFlatShadedBackSide=t.map(e=>{let n=this.cloneMaterial(e);return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n.side=Ea,n}),this.materialsFlatShadedDoubleSide=t.map(e=>{let n=this.cloneMaterial(e);return n.uniforms=Object.assign({},r.uniforms),n.flatShading=!0,n.side=Ca,n})}}render(r,t,e){let n=r.shadowMap.enabled;if(r.shadowMap.enabled=!1,rc){let a=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),r.render(t,e);for(let i of a)i[0].material=i[1];this.meshCount!==a.size&&a.clear()}else{let a=t.overrideMaterial;t.overrideMaterial=this.material,r.render(t,e),t.overrideMaterial=a}r.shadowMap.enabled=n}disposeMaterials(){if(this.material!==null){let r=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(let t of r)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return rc}static set workaroundEnabled(r){rc=r}};var rn=-1,Cr=class extends kn{constructor(r=null,t=rn,e=rn,n=1){super(),r!==null&&this.addEventListener("change",()=>r.setSize(this.baseSize.width,this.baseSize.height)),this.baseSize=new Ie(1,1),this.preferredSize=new Ie(t,e),this.target=this.preferredSize,this.s=n,this.effectiveSize=new Ie,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){let r=this.baseSize,t=this.preferredSize,e=this.effectiveSize,n=this.scale;t.width!==rn?e.width=t.width:t.height!==rn?e.width=Math.round(t.height*(r.width/Math.max(r.height,1))):e.width=Math.round(r.width*n),t.height!==rn?e.height=t.height:t.width!==rn?e.height=Math.round(t.width/Math.max(r.width/Math.max(r.height,1),1)):e.height=Math.round(r.height*n)}get width(){return this.effectiveSize.width}set width(r){this.preferredWidth=r}get height(){return this.effectiveSize.height}set height(r){this.preferredHeight=r}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(r){this.s!==r&&(this.s=r,this.preferredSize.setScalar(rn),this.dispatchEvent({type:"change"}))}getScale(){return this.scale}setScale(r){this.scale=r}get baseWidth(){return this.baseSize.width}set baseWidth(r){this.baseSize.width!==r&&(this.baseSize.width=r,this.dispatchEvent({type:"change"}))}getBaseWidth(){return this.baseWidth}setBaseWidth(r){this.baseWidth=r}get baseHeight(){return this.baseSize.height}set baseHeight(r){this.baseSize.height!==r&&(this.baseSize.height=r,this.dispatchEvent({type:"change"}))}getBaseHeight(){return this.baseHeight}setBaseHeight(r){this.baseHeight=r}setBaseSize(r,t){(this.baseSize.width!==r||this.baseSize.height!==t)&&(this.baseSize.set(r,t),this.dispatchEvent({type:"change"}))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(r){this.preferredSize.width!==r&&(this.preferredSize.width=r,this.dispatchEvent({type:"change"}))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(r){this.preferredWidth=r}get preferredHeight(){return this.preferredSize.height}set preferredHeight(r){this.preferredSize.height!==r&&(this.preferredSize.height=r,this.dispatchEvent({type:"change"}))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(r){this.preferredHeight=r}setPreferredSize(r,t){(this.preferredSize.width!==r||this.preferredSize.height!==t)&&(this.preferredSize.set(r,t),this.dispatchEvent({type:"change"}))}copy(r){this.s=r.scale,this.baseSize.set(r.baseWidth,r.baseHeight),this.preferredSize.set(r.preferredWidth,r.preferredHeight),this.dispatchEvent({type:"change"})}static get AUTO_SIZE(){return rn}};var be={SKIP:9,SET:30,ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Ny="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Oy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}",Ly="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Uy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Gy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Hy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",zy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Wy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Vy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Xy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ky="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",jy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Yy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Qy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",qy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Zy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Jy="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",$y="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",e1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",t1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",r1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",n1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",a1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}",i1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",o1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",s1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",u1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",c1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",l1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",f1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}",h1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",d1="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",p1=new Map([[be.ADD,Ny],[be.ALPHA,Oy],[be.AVERAGE,Ly],[be.COLOR,Uy],[be.COLOR_BURN,Gy],[be.COLOR_DODGE,Hy],[be.DARKEN,zy],[be.DIFFERENCE,Wy],[be.DIVIDE,Vy],[be.DST,null],[be.EXCLUSION,Xy],[be.HARD_LIGHT,Ky],[be.HARD_MIX,jy],[be.HUE,Yy],[be.INVERT,Qy],[be.INVERT_RGB,qy],[be.LIGHTEN,Zy],[be.LINEAR_BURN,Jy],[be.LINEAR_DODGE,$y],[be.LINEAR_LIGHT,e1],[be.LUMINOSITY,t1],[be.MULTIPLY,r1],[be.NEGATION,n1],[be.NORMAL,a1],[be.OVERLAY,i1],[be.PIN_LIGHT,o1],[be.REFLECT,s1],[be.SATURATION,u1],[be.SCREEN,c1],[be.SOFT_LIGHT,l1],[be.SRC,f1],[be.SUBTRACT,h1],[be.VIVID_LIGHT,d1]]),v1=class extends kn{constructor(r,t=1){super(),this._blendFunction=r,this.opacity=new pe(t)}getOpacity(){return this.opacity.value}setOpacity(r){this.opacity.value=r}get blendFunction(){return this._blendFunction}set blendFunction(r){this._blendFunction=r,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(r){this.blendFunction=r}getShaderCode(){return p1.get(this.blendFunction)}};var fp=class extends kn{constructor(r,t,{attributes:e=nn.NONE,blendFunction:n=be.NORMAL,defines:a=new Map,uniforms:i=new Map,extensions:o=null,vertexShader:s=null}={}){super(),this.name=r,this.renderer=null,this.attributes=e,this.fragmentShader=t,this.vertexShader=s,this.defines=a,this.uniforms=i,this.extensions=o,this.blendMode=new v1(n),this.blendMode.addEventListener("change",u=>this.setChanged()),this._inputColorSpace=Ai,this._outputColorSpace=bi}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(r){this._inputColorSpace=r,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(r){this._outputColorSpace=r,this.setChanged()}set mainScene(r){}set mainCamera(r){}getName(){return this.name}setRenderer(r){this.renderer=r}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(r){this.attributes=r,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(r){this.fragmentShader=r,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(r){this.vertexShader=r,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(r,t=Vr){}update(r,t,e){}setSize(r,t){}initialize(r,t,e){}dispose(){for(let r of Object.keys(this)){let t=this[r];(t instanceof dt||t instanceof Si||t instanceof Ei||t instanceof pr)&&this[r].dispose()}}};var ic={VERY_SMALL:0,SMALL:1,MEDIUM:2,LARGE:3,VERY_LARGE:4,HUGE:5},m1=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`,g1="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",x1=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],y1=class extends At{constructor(r=new es){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new pe(null),texelSize:new pe(new es),scale:new pe(1),kernel:new pe(0)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:m1,vertexShader:g1}),this.setTexelSize(r.x,r.y),this.kernelSize=ic.MEDIUM}set inputBuffer(r){this.uniforms.inputBuffer.value=r}setInputBuffer(r){this.inputBuffer=r}get kernelSequence(){return x1[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(r){this.uniforms.scale.value=r}getScale(){return this.uniforms.scale.value}setScale(r){this.uniforms.scale.value=r}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(r){this.uniforms.kernel.value=r}setKernel(r){this.kernel=r}setTexelSize(r,t){this.uniforms.texelSize.value.set(r,t,r*.5,t*.5)}setSize(r,t){let e=1/r,n=1/t;this.uniforms.texelSize.value.set(e,n,e*.5,n*.5)}},w1=class extends pr{constructor({kernelSize:r=ic.MEDIUM,resolutionScale:t=.5,width:e=Cr.AUTO_SIZE,height:n=Cr.AUTO_SIZE,resolutionX:a=e,resolutionY:i=n}={}){super("KawaseBlurPass"),this.renderTargetA=new dt(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";let o=this.resolution=new Cr(this,a,i,t);o.addEventListener("change",s=>this.setSize(o.baseWidth,o.baseHeight)),this._blurMaterial=new y1,this._blurMaterial.kernelSize=r,this.copyMaterial=new up}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(r){this._blurMaterial=r}get dithering(){return this.copyMaterial.dithering}set dithering(r){this.copyMaterial.dithering=r}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(r){this.blurMaterial.kernelSize=r}get width(){return this.resolution.width}set width(r){this.resolution.preferredWidth=r}get height(){return this.resolution.height}set height(r){this.resolution.preferredHeight=r}get scale(){return this.blurMaterial.scale}set scale(r){this.blurMaterial.scale=r}getScale(){return this.blurMaterial.scale}setScale(r){this.blurMaterial.scale=r}getKernelSize(){return this.kernelSize}setKernelSize(r){this.kernelSize=r}getResolutionScale(){return this.resolution.scale}setResolutionScale(r){this.resolution.scale=r}render(r,t,e,n,a){let i=this.scene,o=this.camera,s=this.renderTargetA,u=this.renderTargetB,c=this.blurMaterial,l=c.kernelSequence,f=t;this.fullscreenMaterial=c;for(let h=0,d=l.length;h<d;++h){let p=(h&1)===0?s:u;c.kernel=l[h],c.inputBuffer=f.texture,r.setRenderTarget(p),r.render(i,o),f=p}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=f.texture,r.setRenderTarget(this.renderToScreen?null:e),r.render(i,o)}setSize(r,t){let e=this.resolution;e.setBaseSize(r,t);let n=e.width,a=e.height;this.renderTargetA.setSize(n,a),this.renderTargetB.setSize(n,a),this.blurMaterial.setSize(r,t)}initialize(r,t,e){e!==void 0&&(this.renderTargetA.texture.type=e,this.renderTargetB.texture.type=e,e!==Wt?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):r!==null&&r.outputColorSpace===We&&(this.renderTargetA.texture.colorSpace=We,this.renderTargetB.texture.colorSpace=We))}static get AUTO_SIZE(){return Cr.AUTO_SIZE}},b1=`#include <common>
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
}`,A1=class extends At{constructor(r=!1,t=null){super({name:"LuminanceMaterial",defines:{THREE_REVISION:"185".replace(/\D+/g,"")},uniforms:{inputBuffer:new pe(null),threshold:new pe(0),smoothing:new pe(1),range:new pe(null)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:b1,vertexShader:sp}),this.colorOutput=r,this.luminanceRange=t}set inputBuffer(r){this.uniforms.inputBuffer.value=r}setInputBuffer(r){this.uniforms.inputBuffer.value=r}get threshold(){return this.uniforms.threshold.value}set threshold(r){this.smoothing>0||r>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.threshold.value=r}getThreshold(){return this.threshold}setThreshold(r){this.threshold=r}get smoothing(){return this.uniforms.smoothing.value}set smoothing(r){this.threshold>0||r>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.smoothing.value=r}getSmoothingFactor(){return this.smoothing}setSmoothingFactor(r){this.smoothing=r}get useThreshold(){return this.threshold>0||this.smoothing>0}set useThreshold(r){}get colorOutput(){return this.defines.COLOR!==void 0}set colorOutput(r){r?this.defines.COLOR="1":delete this.defines.COLOR,this.needsUpdate=!0}isColorOutputEnabled(r){return this.colorOutput}setColorOutputEnabled(r){this.colorOutput=r}get useRange(){return this.luminanceRange!==null}set useRange(r){this.luminanceRange=null}get luminanceRange(){return this.uniforms.range.value}set luminanceRange(r){r!==null?this.defines.RANGE="1":delete this.defines.RANGE,this.uniforms.range.value=r,this.needsUpdate=!0}getLuminanceRange(){return this.luminanceRange}setLuminanceRange(r){this.luminanceRange=r}},E1=class extends pr{constructor({renderTarget:r,luminanceRange:t,colorOutput:e,resolutionScale:n=1,width:a=Cr.AUTO_SIZE,height:i=Cr.AUTO_SIZE,resolutionX:o=a,resolutionY:s=i}={}){super("LuminancePass"),this.fullscreenMaterial=new A1(e,t),this.needsSwap=!1,this.renderTarget=r,this.renderTarget===void 0&&(this.renderTarget=new dt(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="LuminancePass.Target");let u=this.resolution=new Cr(this,o,s,n);u.addEventListener("change",c=>this.setSize(u.baseWidth,u.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}render(r,t,e,n,a){let i=this.fullscreenMaterial;i.inputBuffer=t.texture,r.setRenderTarget(this.renderToScreen?null:this.renderTarget),r.render(this.scene,this.camera)}setSize(r,t){let e=this.resolution;e.setBaseSize(r,t),this.renderTarget.setSize(e.width,e.height)}initialize(r,t,e){e!==void 0&&e!==Wt&&(this.renderTarget.texture.type=e,this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},C1=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.05556
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`,S1="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",D1=class extends At{constructor(){super({name:"DownsamplingMaterial",uniforms:{inputBuffer:new pe(null),texelSize:new pe(new Ie)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:C1,vertexShader:S1})}set inputBuffer(r){this.uniforms.inputBuffer.value=r}setSize(r,t){this.uniforms.texelSize.value.set(1/r,1/t)}},T1=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`,I1="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",R1=class extends At{constructor(){super({name:"UpsamplingMaterial",uniforms:{inputBuffer:new pe(null),supportBuffer:new pe(null),texelSize:new pe(new Ie),radius:new pe(.85)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:T1,vertexShader:I1})}set inputBuffer(r){this.uniforms.inputBuffer.value=r}set supportBuffer(r){this.uniforms.supportBuffer.value=r}get radius(){return this.uniforms.radius.value}set radius(r){this.uniforms.radius.value=r}setSize(r,t){this.uniforms.texelSize.value.set(1/r,1/t)}},M1=class extends pr{constructor(){super("MipmapBlurPass"),this.needsSwap=!1,this.renderTarget=new dt(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Upsampling.Mipmap0",this.downsamplingMipmaps=[],this.upsamplingMipmaps=[],this.downsamplingMaterial=new D1,this.upsamplingMaterial=new R1,this.resolution=new Ie}get texture(){return this.renderTarget.texture}get levels(){return this.downsamplingMipmaps.length}set levels(r){if(this.levels!==r){let t=this.renderTarget;this.dispose(),this.downsamplingMipmaps=[],this.upsamplingMipmaps=[];for(let e=0;e<r;++e){let n=t.clone();n.texture.name="Downsampling.Mipmap"+e,this.downsamplingMipmaps.push(n)}this.upsamplingMipmaps.push(t);for(let e=1,n=r-1;e<n;++e){let a=t.clone();a.texture.name="Upsampling.Mipmap"+e,this.upsamplingMipmaps.push(a)}this.setSize(this.resolution.x,this.resolution.y)}}get radius(){return this.upsamplingMaterial.radius}set radius(r){this.upsamplingMaterial.radius=r}render(r,t,e,n,a){let{scene:i,camera:o}=this,{downsamplingMaterial:s,upsamplingMaterial:u}=this,{downsamplingMipmaps:c,upsamplingMipmaps:l}=this,f=t;this.fullscreenMaterial=s;for(let h=0,d=c.length;h<d;++h){let p=c[h];s.setSize(f.width,f.height),s.inputBuffer=f.texture,r.setRenderTarget(p),r.render(i,o),f=p}this.fullscreenMaterial=u;for(let h=l.length-1;h>=0;--h){let d=l[h];u.setSize(f.width,f.height),u.inputBuffer=f.texture,u.supportBuffer=c[h].texture,r.setRenderTarget(d),r.render(i,o),f=d}}setSize(r,t){let e=this.resolution;e.set(r,t);let n=e.width,a=e.height;for(let i=0,o=this.downsamplingMipmaps.length;i<o;++i)n=Math.round(n*.5),a=Math.round(a*.5),this.downsamplingMipmaps[i].setSize(n,a),i<this.upsamplingMipmaps.length&&this.upsamplingMipmaps[i].setSize(n,a)}initialize(r,t,e){if(e!==void 0){let n=this.downsamplingMipmaps.concat(this.upsamplingMipmaps);for(let a of n)a.texture.type=e;if(e!==Wt)this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1";else if(r!==null&&r.outputColorSpace===We)for(let a of n)a.texture.colorSpace=We}}dispose(){super.dispose();for(let r of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))r.dispose()}},B1=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv)*intensity;}`,hp=class extends fp{constructor({blendFunction:r=be.SCREEN,luminanceThreshold:t=1,luminanceSmoothing:e=.03,mipmapBlur:n=!0,intensity:a=1,radius:i=.85,levels:o=8,kernelSize:s=ic.LARGE,resolutionScale:u=.5,width:c=Cr.AUTO_SIZE,height:l=Cr.AUTO_SIZE,resolutionX:f=c,resolutionY:h=l}={}){super("BloomEffect",B1,{blendFunction:r,uniforms:new Map([["map",new pe(null)],["intensity",new pe(a)]])}),this.renderTarget=new dt(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Bloom.Target",this.blurPass=new w1({kernelSize:s}),this.luminancePass=new E1({colorOutput:!0}),this.luminanceMaterial.threshold=t,this.luminanceMaterial.smoothing=e,this.mipmapBlurPass=new M1,this.mipmapBlurPass.enabled=n,this.mipmapBlurPass.radius=i,this.mipmapBlurPass.levels=o,this.uniforms.get("map").value=n?this.mipmapBlurPass.texture:this.renderTarget.texture;let d=this.resolution=new Cr(this,f,h,u);d.addEventListener("change",p=>this.setSize(d.baseWidth,d.baseHeight))}get texture(){return this.mipmapBlurPass.enabled?this.mipmapBlurPass.texture:this.renderTarget.texture}getTexture(){return this.texture}getResolution(){return this.resolution}getBlurPass(){return this.blurPass}getLuminancePass(){return this.luminancePass}get luminanceMaterial(){return this.luminancePass.fullscreenMaterial}getLuminanceMaterial(){return this.luminancePass.fullscreenMaterial}get width(){return this.resolution.width}set width(r){this.resolution.preferredWidth=r}get height(){return this.resolution.height}set height(r){this.resolution.preferredHeight=r}get dithering(){return this.blurPass.dithering}set dithering(r){this.blurPass.dithering=r}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(r){this.blurPass.kernelSize=r}get distinction(){return console.warn(this.name,"distinction was removed"),1}set distinction(r){console.warn(this.name,"distinction was removed")}get intensity(){return this.uniforms.get("intensity").value}set intensity(r){this.uniforms.get("intensity").value=r}getIntensity(){return this.intensity}setIntensity(r){this.intensity=r}getResolutionScale(){return this.resolution.scale}setResolutionScale(r){this.resolution.scale=r}update(r,t,e){let n=this.renderTarget,a=this.luminancePass;a.enabled?(a.render(r,t),this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(r,a.renderTarget):this.blurPass.render(r,a.renderTarget,n)):this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(r,t):this.blurPass.render(r,t,n)}setSize(r,t){let e=this.resolution;e.setBaseSize(r,t),this.renderTarget.setSize(e.width,e.height),this.blurPass.resolution.copy(e),this.luminancePass.setSize(r,t),this.mipmapBlurPass.setSize(r,t)}initialize(r,t,e){this.blurPass.initialize(r,t,e),this.luminancePass.initialize(r,t,e),this.mipmapBlurPass.initialize(r,t,e),e!==void 0&&(this.renderTarget.texture.type=e,r!==null&&r.outputColorSpace===We&&(this.renderTarget.texture.colorSpace=We))}};var _1=`#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`,P1="uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}",dp=class extends fp{constructor({offset:r=new Ie(.001,5e-4),radialModulation:t=!1,modulationOffset:e=.15}={}){super("ChromaticAberrationEffect",_1,{vertexShader:P1,attributes:nn.CONVOLUTION,uniforms:new Map([["offset",new pe(r)],["modulationOffset",new pe(e)]])}),this.radialModulation=t}get offset(){return this.uniforms.get("offset").value}set offset(r){this.uniforms.get("offset").value=r}get radialModulation(){return this.defines.has("RADIAL_MODULATION")}set radialModulation(r){r?this.defines.set("RADIAL_MODULATION","1"):this.defines.delete("RADIAL_MODULATION"),this.setChanged()}get modulationOffset(){return this.uniforms.get("modulationOffset").value}set modulationOffset(r){this.uniforms.get("modulationOffset").value=r}getOffset(){return this.offset}setOffset(r){this.offset=r}};var pp=class extends pr{constructor(r,t,e=null){super("RenderPass",r,t),this.needsSwap=!1,this.needsDepthBlit=!0,this.clearPass=new cp,this.overrideMaterialManager=e===null?null:new ip(e),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(r){this.scene=r}set mainCamera(r){this.camera=r}get renderToScreen(){return super.renderToScreen}set renderToScreen(r){super.renderToScreen=r,this.clearPass.renderToScreen=r}get overrideMaterial(){let r=this.overrideMaterialManager;return r!==null?r.material:null}set overrideMaterial(r){let t=this.overrideMaterialManager;r!==null?t!==null?t.setMaterial(r):this.overrideMaterialManager=new ip(r):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(r){this.overrideMaterial=r}get clear(){return this.clearPass.enabled}set clear(r){this.clearPass.enabled=r}getSelection(){return this.selection}setSelection(r){this.selection=r}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(r){this.ignoreBackground=r}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(r){this.skipShadowMapUpdate=r}getClearPass(){return this.clearPass}render(r,t,e,n,a){let i=this.scene,o=this.camera,s=this.selection,u=o.layers.mask,c=i.background,l=r.shadowMap.autoUpdate,f=this.renderToScreen?null:t;s!==null&&o.layers.set(s.getLayer()),this.skipShadowMapUpdate&&(r.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(i.background=null),this.clearPass.enabled&&this.clearPass.render(r,t),r.setRenderTarget(f),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(r,i,o):r.render(i,o),o.layers.mask=u,i.background=c,r.shadowMap.autoUpdate=l}};var d_=Math.PI*.5;var F1=`#include <common>
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
}`,k1="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",N1=class extends At{constructor(r,t,e,n,a=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:"185".replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new pe(null),depthBuffer:new pe(null),resolution:new pe(new Ie),texelSize:new pe(new Ie),cameraNear:new pe(.3),cameraFar:new pe(1e3),aspect:new pe(1),time:new pe(0)},blending:Zt,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:a}),r&&this.setShaderParts(r),t&&this.setDefines(t),e&&this.setUniforms(e),this.copyCameraSettings(n)}set inputBuffer(r){this.uniforms.inputBuffer.value=r}setInputBuffer(r){this.uniforms.inputBuffer.value=r}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(r){this.uniforms.depthBuffer.value=r}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(r){this.defines.DEPTH_PACKING=r.toFixed(0),this.needsUpdate=!0}setDepthBuffer(r,t=Vr){this.depthBuffer=r,this.depthPacking=t}setShaderData(r){this.setShaderParts(r.shaderParts),this.setDefines(r.defines),this.setUniforms(r.uniforms),this.setExtensions(r.extensions)}setShaderParts(r){return this.fragmentShader=F1.replace(Ce.FRAGMENT_HEAD,r.get(Ce.FRAGMENT_HEAD)||"").replace(Ce.FRAGMENT_MAIN_UV,r.get(Ce.FRAGMENT_MAIN_UV)||"").replace(Ce.FRAGMENT_MAIN_IMAGE,r.get(Ce.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=k1.replace(Ce.VERTEX_HEAD,r.get(Ce.VERTEX_HEAD)||"").replace(Ce.VERTEX_MAIN_SUPPORT,r.get(Ce.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(r){for(let t of r.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(r){for(let t of r.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(r){this.extensions={};for(let t of r)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(r){this.encodeOutput!==r&&(r?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(r){return this.encodeOutput}setOutputEncodingEnabled(r){this.encodeOutput=r}get time(){return this.uniforms.time.value}set time(r){this.uniforms.time.value=r}setDeltaTime(r){this.uniforms.time.value+=r}adoptCameraSettings(r){this.copyCameraSettings(r)}copyCameraSettings(r){r&&(this.uniforms.cameraNear.value=r.near,this.uniforms.cameraFar.value=r.far,r instanceof xc?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(r,t){let e=this.uniforms;e.resolution.value.set(r,t),e.texelSize.value.set(1/r,1/t),e.aspect.value=r/t}static get Section(){return Ce}};var v_=Number("185".replace(/\D+/g,"")),_n=255/256,m_=new Float32Array([_n/256**3,_n/256**2,_n/256,_n]),g_=new Float32Array([_n,_n/256,_n/256**2,1/256**3]);function op(r,t,e){for(let n of t){let a="$1"+r+n.charAt(0).toUpperCase()+n.slice(1),i=new RegExp("([^\\.])(\\b"+n+"\\b)","g");for(let o of e.entries())o[1]!==null&&e.set(o[0],o[1].replace(i,a))}}function O1(r,t,e){let n=t.getFragmentShader(),a=t.getVertexShader(),i=n!==void 0&&/mainImage/.test(n),o=n!==void 0&&/mainUv/.test(n);if(e.attributes|=t.getAttributes(),n===void 0)throw new Error(`Missing fragment shader (${t.name})`);if(o&&(e.attributes&nn.CONVOLUTION)!==0)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!i&&!o)throw new Error(`Could not find mainImage or mainUv function (${t.name})`);{let s=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,u=e.shaderParts,c=u.get(Ce.FRAGMENT_HEAD)||"",l=u.get(Ce.FRAGMENT_MAIN_UV)||"",f=u.get(Ce.FRAGMENT_MAIN_IMAGE)||"",h=u.get(Ce.VERTEX_HEAD)||"",d=u.get(Ce.VERTEX_MAIN_SUPPORT)||"",p=new Set,v=new Set;if(o&&(l+=`	${r}MainUv(UV);
`,e.uvTransformation=!0),a!==null&&/mainSupport/.test(a)){let x=/mainSupport *\([\w\s]*?uv\s*?\)/.test(a);d+=`	${r}MainSupport(`,d+=x?`vUv);
`:`);
`;for(let w of a.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(let y of w[1].split(/\s*,\s*/))e.varyings.add(y),p.add(y),v.add(y);for(let w of a.matchAll(s))v.add(w[1])}for(let x of n.matchAll(s))v.add(x[1]);for(let x of t.defines.keys())v.add(x.replace(/\([\w\s,]*\)/g,""));for(let x of t.uniforms.keys())v.add(x);v.delete("while"),v.delete("for"),v.delete("if"),t.uniforms.forEach((x,w)=>e.uniforms.set(r+w.charAt(0).toUpperCase()+w.slice(1),x)),t.defines.forEach((x,w)=>e.defines.set(r+w.charAt(0).toUpperCase()+w.slice(1),x));let m=new Map([["fragment",n],["vertex",a]]);op(r,v,e.defines),op(r,v,m),n=m.get("fragment"),a=m.get("vertex");let g=t.blendMode;if(e.blendModes.set(g.blendFunction,g),i){t.inputColorSpace!==null&&t.inputColorSpace!==e.colorSpace&&(f+=t.inputColorSpace===We?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace!==bi?e.colorSpace=t.outputColorSpace:t.inputColorSpace!==null&&(e.colorSpace=t.inputColorSpace);let x=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;f+=`${r}MainImage(color0, UV, `,(e.attributes&nn.DEPTH)!==0&&x.test(n)&&(f+="depth, ",e.readDepth=!0),f+=`color1);
	`;let w=r+"BlendOpacity";e.uniforms.set(w,g.opacity),f+=`color0 = blend${g.blendFunction}(color0, color1, ${w});

	`,c+=`uniform float ${w};

`}if(c+=n+`
`,a!==null&&(h+=a+`
`),u.set(Ce.FRAGMENT_HEAD,c),u.set(Ce.FRAGMENT_MAIN_UV,l),u.set(Ce.FRAGMENT_MAIN_IMAGE,f),u.set(Ce.VERTEX_HEAD,h),u.set(Ce.VERTEX_MAIN_SUPPORT,d),t.extensions!==null)for(let x of t.extensions)e.extensions.add(x)}}var vp=class extends pr{constructor(r,...t){super("EffectPass"),this.fullscreenMaterial=new N1(null,null,null,r),this.listener=e=>this.handleEvent(e),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(r){for(let t of this.effects)t.mainScene=r}set mainCamera(r){this.fullscreenMaterial.copyCameraSettings(r);for(let t of this.effects)t.mainCamera=r}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(r){this.fullscreenMaterial.encodeOutput=r}get dithering(){return this.fullscreenMaterial.dithering}set dithering(r){let t=this.fullscreenMaterial;t.dithering=r,t.needsUpdate=!0}setEffects(r){for(let t of this.effects)t.removeEventListener("change",this.listener);this.effects=r.sort((t,e)=>e.attributes-t.attributes);for(let t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){let r=new ky,t=0;for(let o of this.effects)if(o.blendMode.blendFunction===be.DST)r.attributes|=o.getAttributes()&nn.DEPTH;else{if((r.attributes&o.getAttributes()&nn.CONVOLUTION)!==0)throw new Error(`Convolution effects cannot be merged (${o.name})`);O1("e"+t++,o,r)}let e=r.shaderParts.get(Ce.FRAGMENT_HEAD),n=r.shaderParts.get(Ce.FRAGMENT_MAIN_IMAGE),a=r.shaderParts.get(Ce.FRAGMENT_MAIN_UV),i=/\bblend\b/g;for(let o of r.blendModes.values())e+=o.getShaderCode().replace(i,`blend${o.blendFunction}`)+`
`;(r.attributes&nn.DEPTH)!==0?(r.readDepth&&(n=`float depth = readDepth(UV);

	`+n),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,r.colorSpace===We&&(n+=`color0 = sRGBToLinear(color0);
	`),r.uvTransformation?(a=`vec2 transformedUv = vUv;
`+a,r.defines.set("UV","transformedUv")):r.defines.set("UV","vUv"),r.shaderParts.set(Ce.FRAGMENT_HEAD,e),r.shaderParts.set(Ce.FRAGMENT_MAIN_IMAGE,n),r.shaderParts.set(Ce.FRAGMENT_MAIN_UV,a);for(let[o,s]of r.shaderParts)s!==null&&r.shaderParts.set(o,s.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(r)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(r,t=Vr){this.fullscreenMaterial.depthBuffer=r,this.fullscreenMaterial.depthPacking=t;for(let e of this.effects)e.setDepthTexture(r,t)}render(r,t,e,n,a){for(let i of this.effects)i.update(r,t,n);if(!this.skipRendering||this.renderToScreen){let i=this.fullscreenMaterial;i.inputBuffer=t.texture,i.time+=n*this.timeScale,r.setRenderTarget(this.renderToScreen?null:e),r.render(this.scene,this.camera)}}setSize(r,t){this.fullscreenMaterial.setSize(r,t);for(let e of this.effects)e.setSize(r,t)}initialize(r,t,e){this.renderer=r;for(let n of this.effects)n.initialize(r,t,e);this.updateMaterial(),e!==void 0&&e!==Wt&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(let r of this.effects)r.removeEventListener("change",this.listener),r.dispose()}handleEvent(r){r.type==="change"&&this.recompile()}};var y_=[new Float32Array(3),new Float32Array(3)],w_=[new Float32Array(3),new Float32Array(3),new Float32Array(3),new Float32Array(3)],b_=[[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([1,0,0]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([1,0,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([1,1,0]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,1,0]),new Float32Array([0,1,1]),new Float32Array([1,1,1])],[new Float32Array([0,0,0]),new Float32Array([0,0,1]),new Float32Array([0,1,1]),new Float32Array([1,1,1])]];var A_=[new Float32Array(2),new Float32Array(2)];var E_=new Float32Array([0,-.25,.25,-.125,.125,-.375,.375]),C_=[new Float32Array([0,0]),new Float32Array([.25,-.25]),new Float32Array([-.25,.25]),new Float32Array([.125,-.125]),new Float32Array([-.125,.125])],S_=[new Uint8Array([0,0]),new Uint8Array([3,0]),new Uint8Array([0,3]),new Uint8Array([3,3]),new Uint8Array([1,0]),new Uint8Array([4,0]),new Uint8Array([1,3]),new Uint8Array([4,3]),new Uint8Array([0,1]),new Uint8Array([3,1]),new Uint8Array([0,4]),new Uint8Array([3,4]),new Uint8Array([1,1]),new Uint8Array([4,1]),new Uint8Array([1,4]),new Uint8Array([4,4])],D_=[new Uint8Array([0,0]),new Uint8Array([1,0]),new Uint8Array([0,2]),new Uint8Array([1,2]),new Uint8Array([2,0]),new Uint8Array([3,0]),new Uint8Array([2,2]),new Uint8Array([3,2]),new Uint8Array([0,1]),new Uint8Array([1,1]),new Uint8Array([0,3]),new Uint8Array([1,3]),new Uint8Array([2,1]),new Uint8Array([3,1]),new Uint8Array([2,3]),new Uint8Array([3,3])];var T_=new Map([[It(0,0,0,0),new Float32Array([0,0,0,0])],[It(0,0,0,1),new Float32Array([0,0,0,1])],[It(0,0,1,0),new Float32Array([0,0,1,0])],[It(0,0,1,1),new Float32Array([0,0,1,1])],[It(0,1,0,0),new Float32Array([0,1,0,0])],[It(0,1,0,1),new Float32Array([0,1,0,1])],[It(0,1,1,0),new Float32Array([0,1,1,0])],[It(0,1,1,1),new Float32Array([0,1,1,1])],[It(1,0,0,0),new Float32Array([1,0,0,0])],[It(1,0,0,1),new Float32Array([1,0,0,1])],[It(1,0,1,0),new Float32Array([1,0,1,0])],[It(1,0,1,1),new Float32Array([1,0,1,1])],[It(1,1,0,0),new Float32Array([1,1,0,0])],[It(1,1,0,1),new Float32Array([1,1,0,1])],[It(1,1,1,0),new Float32Array([1,1,1,0])],[It(1,1,1,1),new Float32Array([1,1,1,1])]]);function nc(r,t,e){return r+(t-r)*e}function It(r,t,e,n){let a=nc(r,t,.75),i=nc(e,n,1-.25);return nc(a,i,1-.125)}var Ee=$o(Bp());var wa=$o(sc()),L1=`
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,U1=`
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
`,tP=({enableWebcam:r=!1,showPreview:t=!1,modelsPath:e="https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights",sensitivity:n=.55,lineThickness:a=1,linesColor:i="#2F293A",scanColor:o="#FF9FFC",scanOpacity:s=.4,gridScale:u=.1,lineStyle:c="solid",lineJitter:l=.1,scanDirection:f="pingpong",enablePost:h=!0,bloomIntensity:d=0,bloomThreshold:p=0,bloomSmoothing:v=0,chromaticAberration:m=.002,noiseIntensity:g=.01,scanGlow:x=.5,scanSoftness:w=2,scanPhaseTaper:y=.9,scanDuration:b=2,scanDelay:A=2,enableGyro:I=!1,scanOnClick:T=!1,snapBackDelay:S=250,className:D,style:_})=>{let M=(0,Ee.useRef)(null),L=(0,Ee.useRef)(null),O=(0,Ee.useRef)(null),N=(0,Ee.useRef)(null),H=(0,Ee.useRef)(null),G=(0,Ee.useRef)(null),U=(0,Ee.useRef)(null),z=(0,Ee.useRef)(null),[X,q]=(0,Ee.useState)(!1),[Z,ne]=(0,Ee.useState)(!1),ue=(0,Ee.useRef)(new Ie(0,0)),ce=(0,Ee.useRef)(0),fe=(0,Ee.useRef)(0),ve=(0,Ee.useRef)(new Ie(0,0)),ye=(0,Ee.useRef)(new Ie(0,0)),ge=(0,Ee.useRef)(0),He=(0,Ee.useRef)(0),me=(0,Ee.useRef)(0),Se=(0,Ee.useRef)(0),we=8,Le=(0,Ee.useRef)([]),Ue=oe=>{let $=Le.current.slice();if($.length>=we&&$.shift(),$.push(oe),Le.current=$,N.current){let ze=N.current.uniforms,nt=new Array(we).fill(0);for(let Qe=0;Qe<$.length&&Qe<we;Qe++)nt[Qe]=$[Qe];ze.uScanStarts.value=nt,ze.uScanCount.value=$.length}},ke=(0,Ee.useRef)([]),Ut=(0,Ee.useRef)([]),Gt=(0,Ee.useRef)([]),wt=(0,Ee.useRef)([]),Ht=Vt.clamp(n,0,1),zt=Vt.lerp(.06,.2,Ht),nr=Vt.lerp(.12,.3,Ht),qt=Vt.lerp(.1,.28,Ht),Sr=Vt.lerp(.25,.45,Ht),Ft=Vt.lerp(.45,.12,Ht),Wr=1/0,Dr=Vt.lerp(1.2,1.6,Ht);return(0,Ee.useEffect)(()=>{let oe=M.current;if(!oe)return;let $=null,ze=bt=>{if(Z)return;$&&(clearTimeout($),$=null);let qe=oe.getBoundingClientRect(),Pn=(bt.clientX-qe.left)/qe.width*2-1,ar=-((bt.clientY-qe.top)/qe.height*2-1);ue.current.set(Pn,ar)},nt=async()=>{let bt=performance.now()/1e3;if(T&&Ue(bt),I&&typeof window<"u"&&window.DeviceOrientationEvent&&DeviceOrientationEvent.requestPermission)try{await DeviceOrientationEvent.requestPermission()}catch{}},Qe=()=>{$&&(clearTimeout($),$=null)},ot=()=>{Z||($&&clearTimeout($),$=window.setTimeout(()=>{ue.current.set(0,0),ce.current=0,fe.current=0},Math.max(0,S||0)))};return oe.addEventListener("mousemove",ze),oe.addEventListener("mouseenter",Qe),T&&oe.addEventListener("click",nt),oe.addEventListener("mouseleave",ot),()=>{oe.removeEventListener("mousemove",ze),oe.removeEventListener("mouseenter",Qe),oe.removeEventListener("mouseleave",ot),T&&oe.removeEventListener("click",nt),$&&clearTimeout($)}},[Z,S,T,I]),(0,Ee.useEffect)(()=>{let oe=M.current;if(!oe)return;let $=new yc({antialias:!0,alpha:!0});O.current=$,$.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),$.setSize(oe.clientWidth,oe.clientHeight),$.outputColorSpace=We,$.toneMapping=lc,$.autoClear=!1,$.setClearColor(0,0),oe.appendChild($.domElement);let ze={iResolution:{value:new pc(oe.clientWidth,oe.clientHeight,$.getPixelRatio())},iTime:{value:0},uSkew:{value:new Ie(0,0)},uTilt:{value:0},uYaw:{value:0},uLineThickness:{value:a},uLinesColor:{value:jo(i)},uScanColor:{value:jo(o)},uGridScale:{value:u},uLineStyle:{value:c==="dashed"?1:c==="dotted"?2:0},uLineJitter:{value:Math.max(0,Math.min(1,l||0))},uScanOpacity:{value:s},uNoise:{value:g},uBloomOpacity:{value:d},uScanGlow:{value:x},uScanSoftness:{value:w},uPhaseTaper:{value:y},uScanDuration:{value:b},uScanDelay:{value:A},uScanDirection:{value:f==="backward"?1:f==="pingpong"?2:0},uScanStarts:{value:new Array(we).fill(0)},uScanCount:{value:0}},nt=new At({uniforms:ze,vertexShader:L1,fragmentShader:U1,transparent:!0,depthWrite:!1,depthTest:!1});N.current=nt;let Qe=new Sa,ot=new Ti(-1,1,1,-1,0,1),bt=new Di(new gc(2,2),nt);Qe.add(bt);let qe=null;if(h){qe=new lp($),H.current=qe;let an=new pp(Qe,ot);qe.addPass(an);let vr=new hp({intensity:1,luminanceThreshold:p,luminanceSmoothing:v});vr.blendMode.opacity.value=Math.max(0,d),G.current=vr;let on=new dp({offset:new Ie(m,m),radialModulation:!0,modulationOffset:0});U.current=on;let sn=new vp(ot,vr,on);sn.renderToScreen=!0,qe.addPass(sn)}let Pn=()=>{$.setSize(oe.clientWidth,oe.clientHeight),nt.uniforms.iResolution.value.set(oe.clientWidth,oe.clientHeight,$.getPixelRatio()),H.current&&H.current.setSize(oe.clientWidth,oe.clientHeight)},ar=typeof ResizeObserver<"u"?new ResizeObserver(Pn):null;ar?.observe(oe),window.addEventListener("resize",Pn);let ba=performance.now(),Aa=()=>{let an=performance.now(),vr=Math.max(0,Math.min(.1,(an-ba)/1e3));ba=an,ve.current.copy(G1(ve.current,ue.current,ye.current,Ft,Wr,vr));let on=mp(ge.current,ce.current,{v:He.current},Ft,Wr,vr);ge.current=on.value,He.current=on.v;let sn=mp(me.current,fe.current,{v:Se.current},Ft,Wr,vr);me.current=sn.value,Se.current=sn.v;let mi=new Ie(ve.current.x*zt,-ve.current.y*Dr*zt);nt.uniforms.uSkew.value.set(mi.x,mi.y),nt.uniforms.uTilt.value=ge.current*nr,nt.uniforms.uYaw.value=Vt.clamp(me.current*qt,-.6,.6),nt.uniforms.iTime.value=an/1e3,$.clear(!0,!0,!0),H.current?H.current.render(vr):$.render(Qe,ot),z.current=requestAnimationFrame(Aa)};return z.current=requestAnimationFrame(Aa),()=>{z.current&&cancelAnimationFrame(z.current),window.removeEventListener("resize",Pn),ar?.disconnect(),nt.dispose(),bt.geometry.dispose(),H.current&&(H.current.dispose(),H.current=null),$.dispose(),$.forceContextLoss(),oe.removeChild($.domElement)}},[n,a,i,o,s,u,c,l,f,h,g,d,x,w,y,b,A,p,v,m,Ft,Wr,zt,Dr,nr,qt]),(0,Ee.useEffect)(()=>{let oe=N.current;if(oe){let $=oe.uniforms;$.uLineThickness.value=a,$.uLinesColor.value.copy(jo(i)),$.uScanColor.value.copy(jo(o)),$.uGridScale.value=u,$.uLineStyle.value=c==="dashed"?1:c==="dotted"?2:0,$.uLineJitter.value=Math.max(0,Math.min(1,l||0)),$.uBloomOpacity.value=Math.max(0,d),$.uNoise.value=Math.max(0,g),$.uScanGlow.value=x,$.uScanOpacity.value=Math.max(0,Math.min(1,s)),$.uScanDirection.value=f==="backward"?1:f==="pingpong"?2:0,$.uScanSoftness.value=w,$.uPhaseTaper.value=y,$.uScanDuration.value=Math.max(.05,b),$.uScanDelay.value=Math.max(0,A)}G.current&&(G.current.blendMode.opacity.value=Math.max(0,d),G.current.luminanceMaterial.threshold=p,G.current.luminanceMaterial.smoothing=v),U.current&&U.current.offset.set(m,m)},[a,i,o,u,c,l,d,p,v,m,g,x,s,f,w,y,b,A]),(0,Ee.useEffect)(()=>{if(!I)return;let oe=$=>{if(Z)return;let ze=$.gamma??0,nt=$.beta??0,Qe=Vt.clamp(ze/45,-1,1),ot=Vt.clamp(-nt/30,-1,1);ue.current.set(Qe,ot),ce.current=Vt.degToRad(ze)*.4};return window.addEventListener("deviceorientation",oe),()=>{window.removeEventListener("deviceorientation",oe)}},[I,Z]),(0,Ee.useEffect)(()=>{if(!r){q(!1);return}let oe=!1;return(async()=>{try{await Promise.all([rt.tinyFaceDetector.loadFromUri(e),rt.faceLandmark68TinyNet.loadFromUri(e)]),oe||q(!0)}catch{oe||q(!1)}})(),()=>{oe=!0}},[e]),(0,Ee.useEffect)(()=>{let oe=!1,$=0,ze=L.current;return(async()=>{if(!r||!X||!ze)return;try{let bt=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:1280},height:{ideal:720}},audio:!1});ze.srcObject=bt,await ze.play()}catch{return}let Qe=new Wo({inputSize:320,scoreThreshold:.5}),ot=async bt=>{if(!oe){if(bt-$>=33){$=bt;try{let qe=await rp(ze,Qe).withFaceLandmarks(!0);if(qe&&qe.detection){let ar=qe.detection.box,ba=ze.videoWidth||1,Aa=ze.videoHeight||1,an=ar.x+ar.width*.5,vr=ar.y+ar.height*.5,on=an/ba*2-1,sn=vr/Aa*2-1;Yo(ke.current,on,5),Yo(Ut.current,sn,5);let mi=Qo(ke.current),yp=Qo(Ut.current),wp=new Ie(Math.tanh(mi),Math.tanh(yp)),bp=Math.min(1,Math.hypot(ar.width/ba,ar.height/Aa)),Ap=1+Sr*(bp-.25);ue.current.copy(wp.multiplyScalar(Ap));let Ep=qe.landmarks.getLeftEye(),Cp=qe.landmarks.getRightEye(),gi=gp(Ep),xi=gp(Cp),Sp=Math.atan2(xi.y-gi.y,xi.x-gi.x);Yo(Gt.current,Sp,5),ce.current=Qo(Gt.current);let yi=qe.landmarks.getNose(),oc=yi[yi.length-1]||yi[Math.floor(yi.length/2)],wi=qe.landmarks.getJawOutline(),Dp=wi[3]||wi[2],Tp=wi[13]||wi[14],Ip=xp(oc,Dp),Rp=xp(oc,Tp),Mp=Math.hypot(xi.x-gi.x,xi.y-gi.y)+1e-6,qo=Vt.clamp((Rp-Ip)/(Mp*1.6),-1,1);qo=Math.tanh(qo),Yo(wt.current,qo,5),fe.current=Qo(wt.current),ne(!0)}else ne(!1)}catch{ne(!1)}}"requestVideoFrameCallback"in HTMLVideoElement.prototype?ze.requestVideoFrameCallback(()=>ot(performance.now())):requestAnimationFrame(ot)}};requestAnimationFrame(ot)})(),()=>{if(oe=!0,ze){let Qe=ze.srcObject;Qe&&Qe.getTracks().forEach(ot=>ot.stop()),ze.pause(),ze.srcObject=null}}},[r,X,Sr]),(0,wa.jsx)("div",{ref:M,className:`gridscan${D?` ${D}`:""}`,style:_,children:t&&(0,wa.jsxs)("div",{className:"gridscan__preview",children:[(0,wa.jsx)("video",{ref:L,muted:!0,playsInline:!0,autoPlay:!0,className:"gridscan__video"}),(0,wa.jsx)("div",{className:"gridscan__badge",children:r?X?Z?"Face: tracking":"Face: searching":"Loading models":"Webcam disabled"})]})})};function jo(r){return new Ci(r).convertSRGBToLinear()}function G1(r,t,e,n,a,i){let o=r.clone();n=Math.max(1e-4,n);let s=2/n,u=s*i,c=1/(1+u+.48*u*u+.235*u*u*u),l=r.clone().sub(t),f=t.clone(),h=a*n;l.length()>h&&l.setLength(h),t=r.clone().sub(l);let d=e.clone().addScaledVector(l,s).multiplyScalar(i);e.sub(d.clone().multiplyScalar(s)),e.multiplyScalar(c),o.copy(t.clone().add(l.add(d).multiplyScalar(c)));let p=f.clone().sub(r),v=o.clone().sub(f);return p.dot(v)>0&&(o.copy(f),e.set(0,0)),o}function mp(r,t,e,n,a,i){n=Math.max(1e-4,n);let o=2/n,s=o*i,u=1/(1+s+.48*s*s+.235*s*s*s),c=r-t,l=t,f=a*n;c=Math.sign(c)*Math.min(Math.abs(c),f),t=r-c;let h=(e.v+o*c)*i;e.v=(e.v-o*h)*u;let d=t+(c+h)*u,p=l-r,v=d-l;return p*v>0&&(d=l,e.v=0),{value:d,v:e.v}}function Yo(r,t,e){r.push(t),r.length>e&&r.shift()}function Qo(r){if(r.length===0)return 0;let t=[...r].sort((n,a)=>n-a),e=Math.floor(t.length/2);return t.length%2?t[e]:(t[e-1]+t[e])*.5}function gp(r){let t=0,e=0,n=r.length||1;for(let a of r)t+=a.x,e+=a.y;return{x:t/n,y:e/n}}function xp(r,t){return Math.hypot(r.x-t.x,r.y-t.y)}export{tP as GridScan};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/tf-core.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

postprocessing/build/index.js:
  (**
   * postprocessing v6.39.4 build Mon Jul 27 2026
   * https://github.com/pmndrs/postprocessing
   * Copyright 2015-2026 Raoul van Rüschen
   * @license Zlib
   *)
*/
