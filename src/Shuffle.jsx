import React, { useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Shuffle.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Shuffle({
  text,
  className = '',
  shuffleDirection = 'right',
  duration = 0.35,
  stagger = 0.045,
  colorFrom,
  colorTo,
  tag = 'span'
}) {
  const root = useRef(null);
  const [ready, setReady] = useState(false);
  const chars = useMemo(() => Array.from(text || ''), [text]);

  useGSAP(() => {
    if (!root.current) return undefined;
    const letters = Array.from(root.current.querySelectorAll('.shuffle-char'));
    const axis = shuffleDirection === 'up' || shuffleDirection === 'down' ? 'y' : 'x';
    const sign = shuffleDirection === 'left' || shuffleDirection === 'up' ? -1 : 1;
    const animate = () => {
      gsap.killTweensOf(letters);
      gsap.fromTo(letters,
        { [axis]: index => sign * (12 + (index % 2) * 9), opacity: 0, color: colorFrom || 'inherit' },
        { [axis]: 0, opacity: 1, color: colorTo || 'inherit', duration, stagger, ease: 'power3.out', overwrite: true }
      );
    };
    const trigger = ScrollTrigger.create({ trigger: root.current, start: 'top 90%-=100px', once: true, onEnter: () => { setReady(true); animate(); } });
    const hover = () => animate();
    root.current.addEventListener('mouseenter', hover);
    return () => { trigger.kill(); root.current?.removeEventListener('mouseenter', hover); };
  }, { dependencies: [text, shuffleDirection, duration, stagger, colorFrom, colorTo], scope: root });

  const Tag = tag;
  return React.createElement(Tag, { ref: root, className: `shuffle-parent ${ready ? 'is-ready' : ''} ${className}` },
    chars.map((char, index) => React.createElement('span', { className: 'shuffle-char', key: `${char}-${index}` }, char))
  );
}
