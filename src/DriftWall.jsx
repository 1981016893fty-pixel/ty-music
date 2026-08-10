import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const columnFactor = (index, variance) => 1 + variance * ((((index * 0.6180339887 + 0.35) % 1) * 2) - 1);

export default function DriftWall({
  items = [], columns = 5, tileWidth = 200, tileHeight = 132, gap = 18,
  radius = 14, tilt = 16, turn = -14, roll = 0, perspective = 1200,
  depth = 120, speed = 42, direction = 'up', variance = 0.45, parallax = 0.6,
  pauseOnHover = false, lift = 64, fade = 0.6, dim = 0.55,
  grayscale = false, overlayColor = '#060010', className = '', style
}) {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);
  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = event => setReduced(event.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const safeItems = useMemo(() => items.filter(item => item && item.image), [items]);
  const columnItems = useMemo(() => {
    const cols = Array.from({ length: Math.max(1, columns) }, () => []);
    safeItems.forEach((item, index) => cols[index % cols.length].push(item));
    return cols.map(col => (col.length ? col : safeItems.slice(0, 1)));
  }, [safeItems, columns]);
  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new ResizeObserver(([entry]) => setContainerHeight(entry.contentRect.height || 600));
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const sign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, index) => speed * columnFactor(index, variance) * sign * (index % 2 === 0 ? 1 : -1));
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, index) => meta.copyHeight * ((index * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback((px, py) => {
    if (!planeRef.current) return;
    planeRef.current.style.transform = `translate(-50%, -50%) scale(1.18) rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) translateZ(${-depth}px)`;
  }, [tilt, turn, roll, depth]);

  useEffect(() => {
    const animate = timestamp => {
      if (lastTsRef.current === null) lastTsRef.current = timestamp;
      const dt = Math.min(0.05, Math.max(0, timestamp - lastTsRef.current) / 1000);
      lastTsRef.current = timestamp;
      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);
      if (!reduced) {
        for (let column = 0; column < trackRefs.current.length; column += 1) {
          const meta = columnMeta[column];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === column ? 0 : 1;
          const target = baseVelocities[column] * factor;
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[column] += (target - velocitiesRef.current[column]) * ease;
          const next = ((offsetsRef.current[column] + velocitiesRef.current[column] * dt) % meta.copyHeight + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[column] = next;
          if (trackRefs.current[column]) trackRefs.current[column].style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; lastTsRef.current = null; };
  }, [applyPlaneTransform, baseVelocities, columnMeta, columnItems, pauseOnHover, parallax, reduced]);

  const activate = (id, column) => { activeIdRef.current = id; hoveredColRef.current = column; setActiveId(id); };
  const release = () => { activeIdRef.current = null; hoveredColRef.current = -1; setActiveId(null); };
  const handlePointerMove = event => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (parallax > 0 && !reduced) pointerRef.current = { x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 };
    const tile = document.elementFromPoint(event.clientX, event.clientY)?.closest?.('[data-tile-id]');
    if (tile && tile.dataset.tileId !== activeIdRef.current) activate(tile.dataset.tileId, Number(tile.dataset.col));
  };
  const renderTile = (item, id, column) => (
    <div key={id} tabIndex={0} role="img" aria-label={item.title || '专辑封面'} className={`drift-wall__tile${activeId === id ? ' is-active' : ''}`} data-tile-id={id} data-col={column} onFocus={() => activate(id, column)} onBlur={release}>
      <span className="drift-wall__inner"><img src={item.image} alt={item.title || ''} loading="lazy" decoding="async" draggable={false} /><span className="drift-wall__overlay" aria-hidden="true" /></span>
    </div>
  );
  const cssVars = { '--dw-tile-w': `${tileWidth}px`, '--dw-tile-h': `${tileHeight}px`, '--dw-gap': `${gap}px`, '--dw-radius': `${radius}px`, '--dw-perspective': `${perspective}px`, '--dw-lift': `${lift}px`, '--dw-dim': dim, '--dw-gray': grayscale ? 1 : 0, '--dw-overlay': overlayColor, '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`, ...style };
  return <div ref={containerRef} className={`drift-wall${reduced ? ' drift-wall--reduced' : ''}${className ? ` ${className}` : ''}`} style={cssVars} onPointerMove={handlePointerMove} onPointerEnter={() => { wallHoveredRef.current = true; }} onPointerLeave={() => { wallHoveredRef.current = false; pointerRef.current = { x: 0, y: 0 }; release(); }} role="group" aria-label="专辑封面漂浮墙">
    <div ref={planeRef} className="drift-wall__plane">
      {columnItems.map((column, columnIndex) => <div className="drift-wall__col" key={`column-${columnIndex}`}><div className="drift-wall__track" ref={element => { trackRefs.current[columnIndex] = element; }}>{Array.from({ length: columnMeta[columnIndex].copies }).map((_, copy) => column.map((item, itemIndex) => renderTile(item, `${columnIndex}-${copy}-${itemIndex}`, columnIndex)))}</div></div>)}
    </div>
  </div>;
}
