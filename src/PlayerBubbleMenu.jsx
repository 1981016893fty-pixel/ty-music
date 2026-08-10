import { useEffect, useRef, useState } from 'react';
import ElasticSlider from './ElasticSlider';
import './PlayerBubbleMenu.css';

const CONTROLS = [
  { id: 'prevBtn', label: '上一首', icon: 'fa-backward' },
  { id: 'playBtn', label: '播放 / 暂停', icon: 'fa-play' },
  { id: 'nextBtn', label: '下一首', icon: 'fa-forward' },
  { id: 'volumeBtn', label: '音量', icon: 'fa-volume-low' },
  { id: 'fullscreenBtn', label: '待播清单', icon: 'fa-list-ul' }
];

export default function PlayerBubbleMenu() {
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [track, setTrack] = useState({ title: '未在播放', artist: '', cover: '' });
  const [playerVisible, setPlayerVisible] = useState(false);
  const hideTimerRef = useRef();

  useEffect(() => {
    const audio = document.getElementById('audioPlayer');
    const showPlayer = () => {
      window.clearTimeout(hideTimerRef.current);
      setPlayerVisible(true);
    };
    const hidePlayerLater = () => {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setOpen(false);
        setPlayerVisible(false);
      }, 3500);
    };
    const readTrack = () => {
      const title = document.getElementById('playerTitle')?.textContent?.trim() || '未在播放';
      const artist = document.getElementById('playerArtist')?.textContent?.trim() || '';
      const cover = document.getElementById('playerCover')?.getAttribute('src') || '';
      setTrack({ title, artist, cover });
    };
    readTrack();
    const onTrackChange = event => {
      const next = event.detail;
      if (!next) return;
      setTrack({ title: next.title || '未在播放', artist: next.artist || '', cover: next.coverSmall || next.cover || '' });
    };
    window.addEventListener('ty:trackchange', onTrackChange);
    audio?.addEventListener('play', showPlayer);
    audio?.addEventListener('pause', hidePlayerLater);
    audio?.addEventListener('ended', hidePlayerLater);
    const observer = new MutationObserver(readTrack);
    ['playerTitle', 'playerArtist', 'playerCover'].forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element, { childList: true, subtree: true, attributes: true });
    });
    if (audio && !audio.paused) showPlayer();
    return () => {
      window.clearTimeout(hideTimerRef.current);
      observer.disconnect();
      window.removeEventListener('ty:trackchange', onTrackChange);
      audio?.removeEventListener('play', showPlayer);
      audio?.removeEventListener('pause', hidePlayerLater);
      audio?.removeEventListener('ended', hidePlayerLater);
    };
  }, []);

  const invoke = id => {
    document.getElementById(id)?.click();
    if (id === 'playBtn') setOpen(false);
  };

  const changeVolume = value => {
    const normalized = Number(value) / 100;
    setVolume(normalized);
    window.setVolume?.(normalized);
  };

  const toggleMenu = () => {
    const audio = document.getElementById('audioPlayer');
    const isPlaying = Boolean(audio && !audio.paused && !audio.ended);
    window.clearTimeout(hideTimerRef.current);
    setOpen(value => {
      const next = !value;
      if (!isPlaying) setPlayerVisible(next);
      return next;
    });
    if (isPlaying) setPlayerVisible(true);
  };

  return (
    <div className={`player-bubble-menu ${playerVisible ? 'is-player-visible' : ''} ${open ? 'is-open' : ''}`} onClick={event => event.stopPropagation()}>
      <button
        type="button"
        className="player-bubble-menu__trigger"
        aria-label={open ? '关闭播放菜单' : '打开播放菜单'}
        title={open ? '关闭播放菜单' : '打开播放菜单'}
        onClick={toggleMenu}
      >
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-music'}`} aria-hidden="true" />
      </button>
      <div className="player-bubble-menu__now-playing" title="打开正在播放" onClick={() => window.openNowPlaying?.()}>
        {track.cover ? <img src={track.cover} alt="" /> : <i className="fa-solid fa-music" aria-hidden="true" />}
        <div>
          <strong>{track.title}</strong>
          {track.artist && <span>{track.artist}</span>}
        </div>
      </div>
      <div className="player-bubble-menu__items" aria-hidden={!open}>
        {CONTROLS.map((control, index) => control.id === 'volumeBtn' ? (
          <div className="player-bubble-menu__volume" key={control.id} style={{ '--bubble-index': index }}>
            <button type="button" className="player-bubble-menu__volume-toggle" aria-label="静音或恢复音量" title="静音或恢复音量" onClick={() => invoke(control.id)}>
              <span className="player-bubble-menu__control-icon"><i className={`fa-solid ${control.icon}`} aria-hidden="true" /></span>
            </button>
            <ElasticSlider defaultValue={Math.round(volume * 100)} showIcons={false} onChange={changeVolume} />
          </div>
        ) : (
          <button
            type="button"
            className="player-bubble-menu__item"
            key={control.id}
            style={{ '--bubble-index': index }}
            tabIndex={open ? 0 : -1}
            onClick={() => invoke(control.id)}
          >
            <span className="player-bubble-menu__control-icon"><i className={`fa-solid ${control.icon}`} aria-hidden="true" /></span>
            <span>{control.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
