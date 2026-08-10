import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

const GENRES = [
  ['流行乐', 'pop', '#ff2d95', 'linear-gradient(145deg, #ff2d95, #4a103a)', '椎名林檎'], ['摇滚', 'rock', '#7c4dff', 'linear-gradient(210deg, #7c4dff, #211044)', '五月天'], ['电子', 'electronic', '#00e5ff', 'linear-gradient(165deg, #00e5ff, #063e54)', 'Avicii'], ['嘻哈', 'hiphop', '#ff1744', 'linear-gradient(195deg, #ff1744, #4a0a21)', 'Eminem'], ['爵士', 'jazz', '#ff6d00', 'linear-gradient(225deg, #ff6d00, #4b1d06)', 'Miles Davis'], ['古典', 'classical', '#00e676', 'linear-gradient(135deg, #00e676, #073e2b)', 'Ludovico Einaudi'], ['K-Pop', 'kpop', '#ff4081', 'linear-gradient(145deg, #ff4081, #4b1234)', 'IU'], ['华语', 'chinese', '#e040fb', 'linear-gradient(210deg, #e040fb, #40105a)', '周杰伦'], ['R&B', 'rnb', '#448aff', 'linear-gradient(165deg, #448aff, #102c67)', 'The Weeknd'], ['拉丁', 'latin', '#ffab00', 'linear-gradient(195deg, #ffab00, #543606)', 'Bad Bunny'], ['动漫', 'anime', '#b388ff', 'linear-gradient(225deg, #b388ff, #2c1559)', 'Aimer'], ['乡村', 'country', '#ffd740', 'linear-gradient(135deg, #ffd740, #554514)', 'Taylor Swift']
];

export default function ChromaGrid({ onGenreClick }) {
  const rootRef = useRef(null), fadeRef = useRef(null), position = useRef({ x: 0, y: 0 });
  const setX = useRef(null), setY = useRef(null);
  useEffect(() => {
    const root = rootRef.current; if (!root) return undefined;
    setX.current = gsap.quickSetter(root, '--x', 'px'); setY.current = gsap.quickSetter(root, '--y', 'px');
    const rect = root.getBoundingClientRect(); position.current = { x: rect.width / 2, y: rect.height / 2 };
    setX.current(position.current.x); setY.current(position.current.y);
    const moveTo = (x, y) => gsap.to(position.current, { x, y, duration: .45, ease: 'power3.out', overwrite: true, onUpdate: () => { setX.current?.(position.current.x); setY.current?.(position.current.y); } });
    const onMove = event => { const r = root.getBoundingClientRect(); moveTo(event.clientX - r.left, event.clientY - r.top); gsap.to(fadeRef.current, { opacity: 0, duration: .25, overwrite: true }); };
    const onLeave = () => gsap.to(fadeRef.current, { opacity: 1, duration: .6, overwrite: true });
    root.addEventListener('pointermove', onMove); root.addEventListener('pointerleave', onLeave);
    return () => { root.removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); };
  }, []);
  return <div ref={rootRef} className="chroma-grid" style={{ '--cols': 4, '--r': '220px' }}>
    {GENRES.map(([title, id, borderColor, gradient, artist]) => <article key={id} className="chroma-card" onMouseMove={event => { const r = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - r.left}px`); event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - r.top}px`); }} onClick={() => onGenreClick?.(id)} style={{ '--card-border': borderColor, '--card-gradient': gradient, cursor: 'pointer' }}>
      <div className="chroma-img-wrapper" aria-hidden="true"><img src={`/api/artist-photo?name=${encodeURIComponent(artist)}`} alt="" loading="lazy" /></div>
      <footer className="chroma-info"><h3 className="name">{title}</h3><p className="role">探索此流派</p></footer>
    </article>)}
    <div className="chroma-overlay" /><div ref={fadeRef} className="chroma-fade" />
  </div>;
}
