import { useEffect, useRef } from 'react';
import './ElectricBorder.css';
import { createLoopNoiseSampler } from './electricBorderNoise.mjs';
import { roundedRectPerimeter, roundedRectPoint } from './electricBorderGeometry.mjs';
import { createRenderLoop } from './renderLoop.mjs';

export default function ElectricBorder({
  children,
  color = '#5227FF',
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  borderOffset = 60,
  topLeftExclusion = 0,
  className,
  style
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let loop;
    let points = [];
    let sampleNoise;
    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width + borderOffset * 2;
      const height = rect.height + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      const borderWidth = rect.width;
      const borderHeight = rect.height;
      const radius = Math.min(borderRadius, Math.min(borderWidth, borderHeight) / 2);
      const perimeter = roundedRectPerimeter(borderWidth, borderHeight, radius);
      const sampleCount = Math.max(64, Math.min(640, Math.ceil(perimeter / 5)));
      points = Array.from({ length: sampleCount + 1 }, (_, i) =>
        roundedRectPoint(i / sampleCount, borderOffset, borderOffset, borderWidth, borderHeight, radius));
      sampleNoise = createLoopNoiseSampler(sampleCount, 8 * Math.max(1, perimeter / 2500), chaos);
      loop?.request();
    };
    updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);
    let lastDraw = 0;
    lastFrameTimeRef.current = performance.now();
    const drawElectricBorder = currentTime => {
      if (currentTime - lastDraw < 1000 / 30) return true;
      lastDraw = currentTime;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        updateSize();
      }
      timeRef.current += Math.min((currentTime - lastFrameTimeRef.current) / 1000, 0.1) * speed;
      lastFrameTimeRef.current = currentTime;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const noise = sampleNoise(timeRef.current);
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        const displacedX = points[i].x + noise.x[i] * 60;
        const displacedY = points[i].y + noise.y[i] * 60;
        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else ctx.lineTo(displacedX, displacedY);
      }
      ctx.closePath();
      ctx.stroke();
      if (topLeftExclusion > 0) ctx.clearRect(0, 0, topLeftExclusion, topLeftExclusion);
      return true;
    };
    loop = createRenderLoop(container, drawElectricBorder);
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    loop.request();
    return () => {
      loop.dispose();
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, borderOffset, topLeftExclusion]);

  return <div ref={containerRef} className={`electric-border ${className ?? ''}`} style={{ '--electric-border-color': color, borderRadius, ...style }}>
    <div className="eb-canvas-container"><canvas ref={canvasRef} className="eb-canvas" /></div>
    <div className="eb-layers"><div className="eb-glow-1" /><div className="eb-glow-2" /><div className="eb-background-glow" /></div>
    <div className="eb-content">{children}</div>
  </div>;
}
