import { useEffect, useId, useRef, useState } from 'react';
import './GlassSurface.css';

function supportsSvgFilter() {
  if (typeof window === 'undefined') return false;
  const safari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const firefox = /Firefox/.test(navigator.userAgent);
  if (safari || firefox) return false;
  const probe = document.createElement('div');
  probe.style.backdropFilter = 'url(#glass-filter)';
  return probe.style.backdropFilter !== '';
}

export default function GlassSurface({
  className = '', borderRadius = 20, brightness = 50, opacity = 0.93,
  blur = 11, backgroundOpacity = 0.08, saturation = 1.25, style = {}
}) {
  const id = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${id}`;
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [svgSupported, setSvgSupported] = useState(false);

  useEffect(() => setSvgSupported(supportsSvgFilter()), []);
  useEffect(() => {
    const updateMap = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !mapRef.current) return;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rect.width} ${rect.height}"><defs><linearGradient id="r" x1="100%" x2="0%"><stop offset="0" stop-color="#0000"/><stop offset="1" stop-color="red"/></linearGradient><linearGradient id="b" y1="0%" y2="100%"><stop offset="0" stop-color="#0000"/><stop offset="1" stop-color="blue"/></linearGradient></defs><rect width="100%" height="100%" fill="black"/><rect width="100%" height="100%" rx="${borderRadius}" fill="url(#r)"/><rect width="100%" height="100%" rx="${borderRadius}" fill="url(#b)" style="mix-blend-mode:difference"/><rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})"/></svg>`;
      mapRef.current.setAttribute('href', `data:image/svg+xml,${encodeURIComponent(svg)}`);
    };
    updateMap();
    const observer = new ResizeObserver(updateMap);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [borderRadius, brightness, opacity]);

  return <div ref={containerRef} className={`glass-surface ${svgSupported ? 'glass-surface--svg' : 'glass-surface--fallback'} ${className}`}
    style={{ ...style, borderRadius: `${borderRadius}px`, '--glass-frost': backgroundOpacity, '--glass-saturation': saturation, '--filter-id': `url(#${filterId})` }}>
    <svg className="glass-surface__filter" aria-hidden="true"><defs><filter id={filterId} colorInterpolationFilters="sRGB"><feImage ref={mapRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="-180" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>
  </div>;
}
