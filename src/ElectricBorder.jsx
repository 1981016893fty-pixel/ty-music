import { useEffect, useRef, useCallback } from 'react';
import './ElectricBorder.css';
import { loopNoise } from './electricBorderNoise.mjs';
import { roundedRectPerimeter, roundedRectPoint } from './electricBorderGeometry.mjs';

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
  const animationRef = useRef(null);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  const random = useCallback(x => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback((x, y) => {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;
    const a = random(i + j * 57);
    const b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57);
    const d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octavedNoise = useCallback((x, octaves, lacunarity, gain, baseAmplitude, baseFrequency, time, seed, baseFlatness) => {
    let y = 0;
    let amplitude = baseAmplitude;
    let frequency = baseFrequency;
    for (let i = 0; i < octaves; i++) {
      let octaveAmplitude = amplitude;
      if (i === 0) octaveAmplitude *= baseFlatness;
      y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
      frequency *= lacunarity;
      amplitude *= gain;
    }
    return y;
  }, [noise2D]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const octaves = 10;
    const lacunarity = 1.6;
    const gain = 0.7;
    const amplitude = chaos;
    const frequency = 10;
    const baseFlatness = 0;
    const displacement = 60;
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
      return { width, height };
    };
    let { width, height } = updateSize();
    let lastDpr = Math.min(window.devicePixelRatio || 1, 2);
    const drawElectricBorder = currentTime => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) {
        lastDpr = dpr;
        ({ width, height } = updateSize());
      }
      timeRef.current += ((currentTime - lastFrameTimeRef.current) / 1000) * speed;
      lastFrameTimeRef.current = currentTime;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const left = borderOffset;
      const top = borderOffset;
      const borderWidth = width - 2 * borderOffset;
      const borderHeight = height - 2 * borderOffset;
      const radius = Math.min(borderRadius, Math.min(borderWidth, borderHeight) / 2);
      const perimeter = roundedRectPerimeter(borderWidth, borderHeight, radius);
      const sampleCount = Math.floor(perimeter / 2);
      // Preserve the reference card's arc density when this component wraps a wide hero.
      const noiseSpan = 8 * Math.max(1, perimeter / 2500);
      const sampleNoiseX = offset => octavedNoise(offset * noiseSpan, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 0, baseFlatness);
      const sampleNoiseY = offset => octavedNoise(offset * noiseSpan, octaves, lacunarity, gain, amplitude, frequency, timeRef.current, 1, baseFlatness);
      ctx.beginPath();
      for (let i = 0; i <= sampleCount; i++) {
        const progress = i / sampleCount;
        const point = roundedRectPoint(progress, left, top, borderWidth, borderHeight, radius);
        const displacedX = point.x + loopNoise(progress, sampleNoiseX) * displacement;
        const displacedY = point.y + loopNoise(progress, sampleNoiseY) * displacement;
        if (i === 0) {
          ctx.moveTo(displacedX, displacedY);
        } else ctx.lineTo(displacedX, displacedY);
      }
      ctx.closePath();
      ctx.stroke();
      if (topLeftExclusion > 0) ctx.clearRect(0, 0, topLeftExclusion, topLeftExclusion);
      animationRef.current = requestAnimationFrame(drawElectricBorder);
    };
    const resizeObserver = new ResizeObserver(() => ({ width, height } = updateSize()));
    resizeObserver.observe(container);
    animationRef.current = requestAnimationFrame(drawElectricBorder);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
    };
  }, [color, speed, chaos, borderRadius, borderOffset, topLeftExclusion, octavedNoise]);

  return <div ref={containerRef} className={`electric-border ${className ?? ''}`} style={{ '--electric-border-color': color, borderRadius, ...style }}>
    <div className="eb-canvas-container"><canvas ref={canvasRef} className="eb-canvas" /></div>
    <div className="eb-layers"><div className="eb-glow-1" /><div className="eb-glow-2" /><div className="eb-background-glow" /></div>
    <div className="eb-content">{children}</div>
  </div>;
}
