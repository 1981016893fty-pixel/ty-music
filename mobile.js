'use strict';

(() => {
  const byId = id => document.getElementById(id);
  const audio = byId('audio');
  const panel = byId('panel');
  const cover = byId('cover');
  const seek = byId('seek');
  const provider = createBrowserMusicProvider();
  const queue = [];
  let current;
  let playback;
  let lyrics;
  let activeLine;

  function asTrack(song) {
    const source = song.source || (String(song.id).startsWith('embeat:') ? 'embeat' : 'netease');
    if (!['embeat', 'netease'].includes(source)) return null;
    let providerId = String(song.providerId || song.id || '');
    if (!song.providerId && source === 'embeat' && providerId.startsWith('embeat:')) {
      try { providerId = decodeURIComponent(providerId.slice(7)); } catch { return null; }
    }
    if (!providerId) return null;
    const id = source === 'embeat' ? 'embeat:' + encodeURIComponent(providerId)
      .replace(/[!'()*]/g, char => '%' + char.charCodeAt(0).toString(16).toUpperCase()) : providerId;
    return { ...song, id, providerId, source, title: song.title || song.name || '未知歌曲', artist: song.artist || '' };
  }

  function resourcePath(track, kind) {
    const params = new URLSearchParams({
      source: track.source,
      id: (kind === 'lyric' ? track.lyricId : track.urlId) || track.providerId,
    });
    if (track.source === 'embeat') {
      params.set('trackId', track.providerId);
      params.set('title', track.title);
      params.set('artist', track.artist);
      if (track.isrc) params.set('isrc', track.isrc);
    }
    return '/api/music/' + kind + '?' + params;
  }

  function read(key, empty) {
    const raw = localStorage.getItem(key);
    return raw === null ? empty : JSON.parse(raw);
  }

  function likedIds() {
    const ids = read('melodybox_fav', []);
    if (!Array.isArray(ids)) throw new TypeError('Invalid favorites');
    return ids;
  }

  function updateLike() {
    let liked = false;
    try { liked = current && likedIds().some(id => String(id) === current.id); } catch {}
    const button = byId('like');
    button.disabled = !current;
    button.setAttribute('aria-pressed', String(Boolean(liked)));
    button.setAttribute('aria-label', liked ? '取消喜欢当前歌曲' : '喜欢当前歌曲');
    button.textContent = liked ? '♥' : '♡';
  }

  function showStatus(message = '') {
    byId('play-status').textContent = message;
    byId('play-status').hidden = !message;
  }

  function toggleLike() {
    if (!current) return;
    try {
      const ids = likedIds();
      if (ids.some(id => String(id) === current.id)) {
        localStorage.setItem('melodybox_fav', JSON.stringify(ids.filter(id => String(id) !== current.id)));
      } else {
        const tracks = read('melodybox_tracks', {});
        if (!tracks || typeof tracks !== 'object' || Array.isArray(tracks)) throw new TypeError('Invalid track cache');
        localStorage.setItem('melodybox_tracks', JSON.stringify({ ...tracks, [current.id]: current }));
        localStorage.setItem('melodybox_fav', JSON.stringify([...ids, current.id]));
      }
      updateLike();
      if (!byId('likes').hidden) renderLikes();
    } catch { showStatus('无法保存喜欢，请检查浏览器存储。'); }
  }

  function button(text, label, onClick) {
    const node = document.createElement('button');
    node.type = 'button';
    if (text) node.textContent = text;
    if (label) {
      node.setAttribute('aria-label', label);
      node.title = label;
    }
    node.addEventListener('click', onClick);
    return node;
  }

  function trackRow(track, inQueue = false) {
    const item = document.createElement('li');
    const select = button('', '', () => playTrack(track));
    select.className = 'track-meta';
    select.dataset.track = track.id;
    if (current?.id === track.id) select.setAttribute('aria-current', 'true');
    const title = document.createElement('strong');
    title.textContent = track.title;
    const artist = document.createElement('small');
    artist.textContent = track.artist;
    select.append(title, artist);
    const action = inQueue
      ? button('−', '从队列移除 ' + track.title, () => {
          const index = queue.findIndex(item => item.id === track.id);
          if (index >= 0 && current?.id !== track.id) queue.splice(index, 1);
          updateQueue();
          byId('queued-tracks').querySelectorAll('.track-action:not(:disabled)')[index]?.focus();
          if (!panel.contains(document.activeElement)) panel.querySelector('button').focus();
        })
      : button('+', '加入队列 ' + track.title, () => {
          if (!queue.some(item => item.id === track.id)) {
            queue.push(track);
            showStatus('已加入队列：' + track.title);
            updateQueue();
          } else {
            showStatus('歌曲已在队列中。');
          }
        });
    action.className = 'track-action';
    if (inQueue) action.disabled = current?.id === track.id;
    item.append(select, action);
    return item;
  }

  function renderLikes() {
    const list = byId('liked-tracks');
    try {
      const ids = new Set(likedIds().filter(id => id != null).map(String));
      if (!ids.size) {
        list.replaceChildren();
        byId('likes-status').textContent = '还没有喜欢的歌曲。';
        return;
      }
      const tracks = read('melodybox_tracks', {});
      const recent = read('melodybox_rec', []);
      const recentById = new Map((Array.isArray(recent) ? recent : []).filter(Boolean).map(song => [String(song.id), song]));
      const rows = [];
      for (const id of ids) {
        const data = Object.hasOwn(tracks || {}, id) ? tracks[id] : recentById.get(id);
        const track = data && asTrack({ ...data, id });
        if (track) rows.push(trackRow(track));
      }
      list.replaceChildren(...rows);
      byId('likes-status').textContent = rows.length === ids.size ? ''
        : '有 ' + (ids.size - rows.length) + ' 首歌曲仅在完整版可用。';
    } catch {
      list.replaceChildren();
      byId('likes-status').textContent = '无法读取喜欢的歌曲。';
    }
  }

  const search = createMusicSearchSession({
    searchPage: provider.search,
    onChange(page) {
      const source = page.source === 'embeat' ? 'Embeat' : '网易云';
      byId('search-status').textContent = page.loading ? '正在搜索…' : page.error ||
        (page.songs.length ? source : source + ' · 未找到歌曲');
      byId('more').hidden = page.loading || !page.hasMore;
      byId('results').append(...page.added.map(asTrack).filter(Boolean).map(track => trackRow(track)));
    },
  });
  byId('search-form').addEventListener('submit', event => {
    event.preventDefault();
    const input = byId('query');
    const query = input.value.trim();
    if (!query) return;
    input.blur();
    byId('results').replaceChildren();
    search.search(query);
  });
  byId('more').addEventListener('click', async event => {
    const control = event.currentTarget;
    control.disabled = true;
    await search.loadMore();
    control.disabled = false;
  });
  function showLikes(show) {
    byId('likes').hidden = !show;
    byId('search').hidden = show;
    byId('show-likes').setAttribute('aria-pressed', String(show));
    byId('show-search').setAttribute('aria-pressed', String(!show));
    if (show) renderLikes();
    document.querySelector('main').scrollTop = 0;
  }
  byId('show-search').addEventListener('click', () => showLikes(false));
  byId('show-likes').addEventListener('click', () => showLikes(true));
  byId('like').addEventListener('click', toggleLike);
  window.addEventListener('storage', event => {
    if (event.key !== 'melodybox_fav' && event.key !== null) return;
    updateLike();
    if (!byId('likes').hidden) renderLikes();
  });

  function updateQueue() {
    const index = queue.findIndex(track => track.id === current?.id);
    byId('previous').disabled = index <= 0;
    byId('next').disabled = index >= queue.length - 1;
    if (!panel.open || byId('queue-panel').hidden) return;
    byId('queue-status').textContent = queue.length ? '' : '队列为空。';
    byId('queued-tracks').replaceChildren(...queue.map(track => trackRow(track, true)));
  }

  function stepQueue(delta) {
    const index = queue.findIndex(track => track.id === current?.id);
    const next = queue[index + delta];
    if (next) playTrack(next);
  }

  function setCover(track) {
    cover.hidden = true;
    cover.removeAttribute('src');
    const url = track.coverSmall || track.cover;
    if (typeof url !== 'string' || url === '/icon.svg') return;
    try {
      const image = new URL(url, location.origin);
      if (image.origin === location.origin || image.protocol === 'https:') cover.src = image.href;
    } catch {}
  }
  cover.addEventListener('load', () => { cover.hidden = false; });
  cover.addEventListener('error', () => { cover.hidden = true; });

  function requestPlay(request) {
    const attempt = ++request.attempt;
    request.wantsPlay = true;
    audio.play().catch(error => {
      if (request !== playback || attempt !== request.attempt || !request.wantsPlay || error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') {
        request.wantsPlay = false;
        showStatus('点播放继续。');
      } else if (!request.resolving) {
        showStatus('播放失败，请重试或换一首。');
      }
    });
  }

  function playTrack(track) {
    if (!queue.some(item => item.id === track.id)) {
      const index = queue.findIndex(item => item.id === current?.id);
      queue.splice(index < 0 ? queue.length : index + 1, 0, track);
    }
    current = track;
    byId('song-title').textContent = track.title;
    byId('song-artist').textContent = track.artist;
    byId('toggle').disabled = false;
    byId('open-lyrics').disabled = false;
    setCover(track);
    updateLike();
    for (const node of document.querySelectorAll('main [data-track]')) {
      if (node.dataset.track === track.id) node.setAttribute('aria-current', 'true');
      else node.removeAttribute('aria-current');
    }
    updateQueue();
    lyrics?.controller.abort();
    lyrics = undefined;
    if (panel.open && !byId('lyrics-panel').hidden) showLyrics();
    playback?.controller.abort();
    const request = { controller: new AbortController(), attempt: 0, wantsPlay: true, resolving: true };
    playback = request;
    showStatus('正在加载音频…');
    // Start the same-source URL within the tap; Safari may block an async first play.
    audio.src = resourcePath(track, 'proxy');
    updateTime();
    requestPlay(request);
    provider.resource(track, 'url', { signal: request.controller.signal }).then(url => {
      if (request !== playback) return;
      request.resolving = false;
      if (audio.currentTime > 0 || audio.readyState >= 3) return;
      audio.src = url;
      if (request.wantsPlay) requestPlay(request);
    }).catch(() => {
      if (request !== playback) return;
      request.resolving = false;
      if (request.wantsPlay && audio.error) showStatus('播放失败，请重试或换一首。');
    });
  }

  byId('toggle').addEventListener('click', () => {
    if (!playback) return;
    if (!audio.paused || (playback.resolving && playback.wantsPlay && !audio.error)) {
      playback.wantsPlay = false;
      audio.pause();
      showStatus();
    } else if (audio.error && !playback.resolving) {
      playTrack(current);
    } else {
      showStatus('正在加载音频…');
      requestPlay(playback);
    }
    updateTransport();
  });
  function updateTransport() {
    const busy = playback?.wantsPlay && playback.resolving && !audio.error && !audio.ended;
    const playing = (!audio.paused && !audio.ended) || busy;
    byId('toggle').textContent = playing ? '⏸' : '▶';
    byId('toggle').setAttribute('aria-label', playing ? '暂停' : '播放');
  }
  function time(value) {
    const sec = Number.isFinite(value) ? Math.floor(value) : 0;
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }
  function updateTime() {
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    seek.disabled = !duration;
    seek.max = duration || 1;
    seek.value = audio.currentTime;
    byId('elapsed').textContent = time(audio.currentTime);
    byId('duration').textContent = time(duration);
    syncLyrics();
  }
  seek.addEventListener('input', () => {
    if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value);
  });
  byId('previous').addEventListener('click', () => stepQueue(-1));
  byId('next').addEventListener('click', () => stepQueue(1));
  for (const event of ['play', 'pause']) audio.addEventListener(event, updateTransport);
  for (const event of ['timeupdate', 'durationchange', 'emptied']) audio.addEventListener(event, updateTime);
  audio.addEventListener('playing', () => {
    showStatus();
    playback?.controller.abort();
    updateTransport();
  });
  audio.addEventListener('error', () => {
    if (playback?.wantsPlay && !playback.resolving) showStatus('播放失败，请重试或换一首。');
    updateTransport();
  });
  audio.addEventListener('ended', () => {
    if (playback) playback.wantsPlay = false;
    updateTransport();
    stepQueue(1);
  });

  function openPanel(kind) {
    byId('panel-title').textContent = kind === 'queue' ? '播放队列' : '歌词';
    byId('queue-panel').hidden = kind !== 'queue';
    byId('lyrics-panel').hidden = kind !== 'lyrics';
    panel.showModal();
    if (kind === 'queue') updateQueue();
    else showLyrics();
  }
  byId('open-queue').addEventListener('click', () => openPanel('queue'));
  byId('open-lyrics').addEventListener('click', () => openPanel('lyrics'));

  async function showLyrics() {
    if (!current) return;
    if (lyrics?.track === current) {
      syncLyrics();
      return;
    }
    const track = current;
    const setup = { track, controller: new AbortController(), lines: [] };
    lyrics = setup;
    activeLine = undefined;
    const output = byId('lyrics-lines');
    const status = byId('lyrics-status');
    output.replaceChildren();
    status.textContent = '正在加载歌词…';
    const timer = setTimeout(() => setup.controller.abort(), 20000);
    try {
      const { signal } = setup.controller;
      const data = await provider.resource(track, 'lyric', { signal }).catch(async error => {
        if (signal.aborted) throw error;
        const response = await fetch(resourcePath(track, 'lyric'), { signal });
        if (!response.ok) throw new Error('Lyrics unavailable');
        return response.json();
      });
      if (lyrics !== setup) return;
      const raw = typeof data.lrc === 'string' ? data.lrc : '';
      const timed = [];
      const plain = [];
      for (const line of raw.split(/\r?\n/)) {
        const stamps = [...line.matchAll(/\[(\d+):(\d{2}(?:[.:]\d+)?)\]/g)];
        const text = line.replace(/^(?:\[[^\]]*\])+/g, '').trim();
        if (!text) continue;
        if (!stamps.length) plain.push({ text });
        for (const [, minutes, seconds] of stamps) timed.push({ text, at: Number(minutes) * 60 + Number(seconds.replace(':', '.')) });
      }
      const lines = timed.length ? timed.sort((a, b) => a.at - b.at) : plain;
      const fragment = document.createDocumentFragment();
      for (const line of lines) {
        const node = document.createElement('li');
        node.textContent = line.text;
        fragment.append(node);
        if (line.at !== undefined) setup.lines.push({ at: line.at, node });
      }
      output.replaceChildren(fragment);
      status.textContent = lines.length ? '' : '这首歌暂无歌词。';
      syncLyrics();
    } catch {
      if (lyrics !== setup) return;
      lyrics = undefined;
      status.textContent = '歌词暂时无法加载。';
    } finally {
      clearTimeout(timer);
    }
  }

  function syncLyrics() {
    if (!panel.open || byId('lyrics-panel').hidden || !lyrics?.lines.length) return;
    const line = lyrics.lines.findLast(entry => entry.at <= audio.currentTime)?.node;
    if (line === activeLine) return;
    activeLine?.removeAttribute('aria-current');
    activeLine = line;
    line?.setAttribute('aria-current', 'true');
    line?.scrollIntoView({ block: 'nearest' });
  }
})();
