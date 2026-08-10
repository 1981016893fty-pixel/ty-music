import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';
import { GlassIcon } from './GlassIcons';

const PARTICLE_COUNT = 12;
const SPOTLIGHT_RADIUS = 300;
const GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

// The interaction layer follows the official MagicBento implementation.
// These values preserve the content and navigation actions that existed here.
const cards = [
  { title: '热门排行榜', description: '现在大家都在听', icon: 'fa-chart-line', color: 'red', source: 'netease-hot' },
  { title: '新歌速递', description: '刚刚上线的新声音', icon: 'fa-wand-magic-sparkles', color: 'blue', source: 'netease-new' },
  { title: '华语经典', description: '耐听的中文金曲', icon: 'fa-headphones', color: 'purple', query: '华语经典 金曲' },
  { title: '夜间氛围', description: '适合安静聆听', icon: 'fa-moon', color: 'indigo', query: '夜间 氛围 ambient' }
];

const createParticle = (x, y) => {
  const particle = document.createElement('span');
  particle.className = 'magic-bento-particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  return particle;
};

const setCardGlow = (card, mouseX, mouseY, intensity) => {
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--glow-x', `${((mouseX - rect.left) / rect.width) * 100}%`);
  card.style.setProperty('--glow-y', `${((mouseY - rect.top) / rect.height) * 100}%`);
  card.style.setProperty('--glow-intensity', `${intensity}`);
  card.style.setProperty('--glow-radius', `${SPOTLIGHT_RADIUS}px`);
};

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
}

function MagicCard({ card, disableAnimations }) {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const particleSeedsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const magnetismRef = useRef(null);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(window.clearTimeout);
    timeoutsRef.current = [];
    magnetismRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, { scale: 0, opacity: 0, duration: 0.24, ease: 'back.in(1.7)', onComplete: () => particle.remove() });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    const element = cardRef.current;
    if (!element || !isHoveredRef.current) return;
    if (!particleSeedsRef.current.length) {
      const { width, height } = element.getBoundingClientRect();
      particleSeedsRef.current = Array.from({ length: PARTICLE_COUNT }, () => [Math.random() * width, Math.random() * height]);
    }
    particleSeedsRef.current.forEach(([x, y], index) => {
      const timeout = window.setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const particle = createParticle(x, y);
        element.appendChild(particle);
        particlesRef.current.push(particle);
        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(particle, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
        gsap.to(particle, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, index * 80);
      timeoutsRef.current.push(timeout);
    });
  }, []);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return undefined;
    const element = cardRef.current;
    const onEnter = () => { isHoveredRef.current = true; animateParticles(); gsap.to(element, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 }); };
    const onLeave = () => { isHoveredRef.current = false; clearParticles(); gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.3, ease: 'power2.out' }); };
    const onMove = event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      gsap.to(element, { rotateX: ((y - centerY) / centerY) * -10, rotateY: ((x - centerX) / centerX) * 10, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
      magnetismRef.current = gsap.to(element, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.3, ease: 'power2.out' });
    };
    const onClick = event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const distance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
      const ripple = document.createElement('span');
      ripple.className = 'magic-bento-ripple';
      ripple.style.width = `${distance * 2}px`;
      ripple.style.height = `${distance * 2}px`;
      ripple.style.left = `${x - distance}px`;
      ripple.style.top = `${y - distance}px`;
      element.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };
    element.addEventListener('mouseenter', onEnter);
    element.addEventListener('mouseleave', onLeave);
    element.addEventListener('mousemove', onMove);
    element.addEventListener('click', onClick);
    return () => { isHoveredRef.current = false; element.removeEventListener('mouseenter', onEnter); element.removeEventListener('mouseleave', onLeave); element.removeEventListener('mousemove', onMove); element.removeEventListener('click', onClick); clearParticles(); };
  }, [animateParticles, clearParticles, disableAnimations]);

  return <button ref={cardRef} type="button" className="magic-bento-card magic-bento-card--border-glow particle-container" data-browse-source={card.source} data-browse-query={card.query} data-browse-title={card.title} style={{ '--glow-color': GLOW_COLOR }}>
    <span className="magic-bento-card__header"><GlassIcon icon={card.icon} color={card.color} /></span>
    <span className="magic-bento-card__content"><strong className="magic-bento-card__title">{card.title}</strong><small className="magic-bento-card__description">{card.description}</small></span>
  </button>;
}

function GlobalSpotlight({ gridRef, disabled }) {
  useEffect(() => {
    if (disabled || !gridRef.current) return undefined;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    document.body.appendChild(spotlight);
    const onMove = event => {
      const grid = gridRef.current;
      const bounds = grid?.getBoundingClientRect();
      const inside = bounds && event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      const cardsInGrid = grid?.querySelectorAll('.magic-bento-card') || [];
      if (!inside) { gsap.to(spotlight, { opacity: 0, duration: 0.3, ease: 'power2.out' }); cardsInGrid.forEach(card => card.style.setProperty('--glow-intensity', '0')); return; }
      const proximity = SPOTLIGHT_RADIUS * 0.5;
      const fadeDistance = SPOTLIGHT_RADIUS * 0.75;
      let closest = Infinity;
      cardsInGrid.forEach(card => {
        const rect = card.getBoundingClientRect();
        const distance = Math.max(0, Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2)) - Math.max(rect.width, rect.height) / 2);
        closest = Math.min(closest, distance);
        const intensity = distance <= proximity ? 1 : distance <= fadeDistance ? (fadeDistance - distance) / (fadeDistance - proximity) : 0;
        setCardGlow(card, event.clientX, event.clientY, intensity);
      });
      gsap.to(spotlight, { left: event.clientX, top: event.clientY, duration: 0.1, ease: 'power2.out' });
      const opacity = closest <= proximity ? 0.8 : closest <= fadeDistance ? ((fadeDistance - closest) / (fadeDistance - proximity)) * 0.8 : 0;
      gsap.to(spotlight, { opacity, duration: opacity ? 0.2 : 0.5, ease: 'power2.out' });
    };
    document.addEventListener('mousemove', onMove);
    return () => { document.removeEventListener('mousemove', onMove); spotlight.remove(); };
  }, [gridRef, disabled]);
  return null;
}

export default function MagicBento() {
  const gridRef = useRef(null);
  const disableAnimations = useMobileDetection();
  return <><GlobalSpotlight gridRef={gridRef} disabled={disableAnimations} /><div ref={gridRef} className="card-grid bento-section">{cards.map(card => <MagicCard key={card.title} card={card} disableAnimations={disableAnimations} />)}</div></>;
}
