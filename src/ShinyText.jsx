import { useEffect, useRef } from 'react';
import './ShinyText.css';

const ShinyText = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}) => {
  const elementRef = useRef(null);
  const syncRef = useRef(null);
  const controlsRef = useRef({ disabled, pauseOnHover });
  controlsRef.current = { disabled, pauseOnHover };
  const uniformColor = color === shineColor;

  useEffect(() => {
    const element = elementRef.current;
    if (!element?.animate || uniformColor || speed <= 0) return;
    const cycle = speed + Math.max(0, delay);
    const start = direction === 'left' ? '150% center' : '-50% center';
    const end = direction === 'left' ? '-50% center' : '150% center';
    const frames = yoyo ? [
      { backgroundPosition: start, offset: 0 },
      { backgroundPosition: end, offset: speed / (2 * cycle) },
      { backgroundPosition: end, offset: 0.5 },
      { backgroundPosition: start, offset: (cycle + speed) / (2 * cycle) },
      { backgroundPosition: start, offset: 1 }
    ] : [
      { backgroundPosition: start, offset: 0 },
      { backgroundPosition: end, offset: speed / cycle },
      { backgroundPosition: end, offset: 1 }
    ];
    // Native timing preserves the sweep and hold without per-frame React /
    // Motion subscriptions. Background-position still needs browser painting.
    const animation = element.animate(frames, { duration: cycle * (yoyo ? 2 : 1) * 1000, iterations: Infinity, easing: 'linear' });
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let inView = true;
    let hovered = false;
    const sync = () => {
      if (disposed) return;
      const paused = controlsRef.current.disabled || document.hidden || !inView || media.matches ||
        (controlsRef.current.pauseOnHover && hovered);
      if (paused && animation.playState !== 'paused') animation.pause();
      else if (!paused && animation.playState !== 'running') animation.play();
    };
    const enter = () => { hovered = true; sync(); };
    const leave = () => { hovered = false; sync(); };
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      sync();
    }) : null;
    observer?.observe(element);
    element.addEventListener('mouseenter', enter);
    element.addEventListener('mouseleave', leave);
    document.addEventListener('visibilitychange', sync);
    media.addEventListener('change', sync);
    syncRef.current = sync;
    sync();
    return () => {
      disposed = true;
      syncRef.current = null;
      observer?.disconnect();
      element.removeEventListener('mouseenter', enter);
      element.removeEventListener('mouseleave', leave);
      document.removeEventListener('visibilitychange', sync);
      media.removeEventListener('change', sync);
      animation.cancel();
    };
  }, [speed, delay, yoyo, direction, uniformColor]);

  useEffect(() => { syncRef.current?.(); }, [disabled, pauseOnHover]);

  return <span ref={elementRef} className={`shiny-text ${className}`} style={{
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    backgroundPosition: '150% center',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }}>{text}</span>;
};

export default ShinyText;
