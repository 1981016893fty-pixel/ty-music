import { useCallback, useEffect, useRef } from 'react';
import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

/** React Bits ScrollExpand, kept self-contained so it can live in the static app bundle. */
export default function ScrollExpand({
  src = '', mediaType = 'image', poster = '', alt = '', title = '', scrollHint = '',
  startWidth = 42, startHeight = 58, startRadius = 24, endRadius = 0,
  mediaZoom = 1.35, scrollDistance = 1.2, holdDistance = 0.35, smoothing = 0.1,
  overlayScrim = 0.45, useWindowScroll = false, enabled = true, children, className = '', style, ...rest
}) {
  const rootRef = useRef(null), trackRef = useRef(null), stageRef = useRef(null), frameRef = useRef(null), mediaRef = useRef(null);
  const titleRef = useRef(null), overlayRef = useRef(null), scrimRef = useRef(null), hintRef = useRef(null);
  const propsRef = useRef({});
  propsRef.current = { startWidth, startHeight, startRadius, endRadius, mediaZoom, scrollDistance, holdDistance, smoothing, overlayScrim, useWindowScroll, enabled };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current, media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current, e = smoothstep(0, 1, p);
    const w = c.startWidth + (100 - c.startWidth) * e, h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2), iy = Math.max(0, (100 - h) / 2);
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${c.startRadius + (c.endRadius - c.startRadius) * e}px)`;
    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;
    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;
    if (titleRef.current) { const out = smoothstep(.4, .88, p); titleRef.current.style.opacity = `${1 - out}`; titleRef.current.style.transform = `translate3d(0,${-28 * out}px,0) scale(${1 + .06 * out})`; }
    if (hintRef.current) { const gone = smoothstep(0, .12, p); hintRef.current.style.opacity = `${1 - gone}`; hintRef.current.style.transform = `translate3d(0,${8 * gone}px,0)`; }
    if (overlayRef.current) { const inn = smoothstep(.68, 1, p); overlayRef.current.style.opacity = inn; overlayRef.current.style.transform = `translate3d(0,${18 * (1 - inn)}px,0)`; }
  }, []);

  useEffect(() => {
    const root = rootRef.current, track = trackRef.current, stage = stageRef.current;
    if (!root || !track || !stage) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, current = 0, target = 0, stageH = 0, running = false;
    const measure = () => { const c = propsRef.current; stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight; if (stageH <= 0) return; stage.style.height = `${stageH}px`; track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`; stage.style.setProperty('--se-title-size', `${clamp((root.clientWidth || stageH) * .075, 20, 84)}px`); };
    const readProgress = () => { const c = propsRef.current; if (!c.enabled) return 1; const span = stageH * Math.max(.01, c.scrollDistance); return c.useWindowScroll ? clamp(-track.getBoundingClientRect().top / span, 0, 1) : clamp(root.scrollTop / span, 0, 1); };
    const tick = () => { const c = propsRef.current, k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing)); current += (target - current) * k; if (Math.abs(target - current) < .0004) { current = target; running = false; } applyProgress(current); raf = running ? requestAnimationFrame(tick) : 0; };
    const onScroll = () => { target = readProgress(); if (propsRef.current.smoothing <= 0 || reduceMotion) { current = target; applyProgress(current); return; } if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const onResize = () => { measure(); target = readProgress(); current = target; applyProgress(current); };
    measure(); target = readProgress(); current = target; applyProgress(current);
    const scroller = useWindowScroll ? window : root; scroller.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize); ro.observe(root);
    return () => { if (raf) cancelAnimationFrame(raf); scroller.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); ro.disconnect(); };
  }, [applyProgress, useWindowScroll]);

  const media = mediaType === 'video' ? <video ref={mediaRef} className="scroll-expand__media" src={src} poster={poster} autoPlay muted loop playsInline /> : <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />;
  const rootStyle = useWindowScroll ? style : { ...style, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', touchAction: 'pan-y' };
  const handleWheel = useWindowScroll ? undefined : event => {
    const root = rootRef.current;
    if (!root || root.scrollHeight <= root.clientHeight) return;
    root.scrollTop += event.deltaY;
  };
  return <div ref={rootRef} onWheel={handleWheel} className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()} style={rootStyle} {...rest}>
    <div ref={trackRef} className="scroll-expand__track"><div ref={stageRef} className="scroll-expand__stage"><div ref={frameRef} className="scroll-expand__frame">{media}<div ref={scrimRef} className="scroll-expand__scrim" />{children ? <div ref={overlayRef} className="scroll-expand__overlay">{children}</div> : null}</div>{title ? <div ref={titleRef} className="scroll-expand__title">{title}</div> : null}{scrollHint ? <div ref={hintRef} className="scroll-expand__hint">{scrollHint}</div> : null}</div></div>
  </div>;
}
