import { useEffect, useRef, useState } from 'react';
import './BubbleMenu.css';
import { GlassIcon } from './GlassIcons';

const ITEMS = [
  { page: 'discover', label: '立即收听', icon: 'fa-headphones', glassColor: 'linear-gradient(hsl(333, 90%, 52%), hsl(318, 90%, 47%))' },
  { page: 'search', label: '浏览', icon: 'fa-compass', glassColor: 'linear-gradient(hsl(158, 90%, 43%), hsl(143, 90%, 38%))' },
  { page: 'local', label: '本地音乐', icon: 'fa-music', glassColor: 'orange' },
  { page: 'favorites', label: '喜爱', icon: 'fa-heart', glassColor: 'green' },
  { page: 'album-favorites', label: '专辑', icon: 'fa-compact-disc', glassColor: 'linear-gradient(hsl(183, 90%, 46%), hsl(168, 90%, 39%))' },
  { page: 'playlists', label: '播放列表', icon: 'fa-list', glassColor: 'linear-gradient(hsl(58, 90%, 51%), hsl(38, 90%, 48%))' }
];

export default function BubbleMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const close = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  const navigate = page => {
    window.navigateTo?.(page);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`bubble-menu ${open ? 'is-open' : ''}`}>
      <button
        type="button"
        className="bubble-menu__trigger"
        aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
        title={open ? '关闭导航菜单' : '打开导航菜单'}
        onClick={() => setOpen(value => !value)}
      >
        <span /><span /><span />
      </button>
      <div className="bubble-menu__items" aria-hidden={!open}>
        {ITEMS.map((item, index) => (
          <button
            type="button"
            className="bubble-menu__item"
            key={item.page}
            style={{ '--bubble-index': index }}
            tabIndex={open ? 0 : -1}
            onClick={() => navigate(item.page)}
          >
            {item.glassColor ? <GlassIcon icon={item.icon} color={item.glassColor} className="bubble-menu__glass-icon" /> : <i className={`fa-solid ${item.icon}`} aria-hidden="true" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
