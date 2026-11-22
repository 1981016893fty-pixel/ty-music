'use strict';

function normalizeSearchText(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, ' ').trim();
}

function searchArtistNames(artist) {
  if (Array.isArray(artist)) return artist.map(normalizeSearchText);
  if (typeof artist !== 'string') return [];
  return [artist, ...artist.split(/[,，、]|\s+(?:feat\.?|ft\.?)\s+/i)].map(normalizeSearchText);
}

function relevantSearchSongs(session, songs) {
  const query = session.normalizedQuery;
  const exactArtist = song => searchArtistNames(song.artist).includes(query);
  if (session.offset === 0) session.artistSearch = Boolean(query) && songs.some(exactArtist);
  if (session.artistSearch) return songs.filter(exactArtist);
  // A single word can be a partial title or name. Multiple words should each
  // be present in the song metadata, with Latin names compared as whole words.
  const terms = query.split(' ');
  if (terms.length < 2) return songs;
  return songs.filter(song => {
    const text = normalizeSearchText([song.name || song.title, song.artist, song.album].join(' '));
    const words = new Set(text.split(' '));
    return terms.every(term => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(term)
      ? text.includes(term) : words.has(term));
  });
}

// A slow Embeat request may show a provisional NetEase page, never mixed results.
function createMusicSearchSession({ fetchImpl = globalThis.fetch, searchPage, onChange, limit = 20 }) {
  let current = null;
  function cancel() {
    const previous = current;
    current = null;
    previous?.controller.abort();
  }

  async function requestPage(session, source, controller) {
    const offset = session.offset;
    const signal = controller.signal;
    const cancel = () => controller.abort();
    session.controller.signal.addEventListener('abort', cancel, { once: true });
    const timer = setTimeout(() => controller.abort({ name: 'TimeoutError' }),
      source === 'embeat' && offset === 0 ? 12000 : 15000);
    let onAbort;
    const aborted = new Promise((_, reject) => {
      onAbort = () => reject(signal.reason);
      signal.addEventListener('abort', onAbort, { once: true });
    });
    try {
      const page = await Promise.race([(async () => {
        if (searchPage) return searchPage(session.query, source, limit, offset, { signal });
        const query = new URLSearchParams({ keywords: session.query, source, limit: String(limit), offset: String(offset) });
        const response = await fetchImpl('/api/music/search?' + query, { signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Invalid search response');
        return response.json();
      })(), aborted]);
      if (!Array.isArray(page?.songs) || page.songs.some(song => !song || song.source !== source || !song.id) ||
          !Number.isSafeInteger(page.nextOffset) || page.nextOffset < offset ||
          (page.hasMore === true && (page.nextOffset <= offset || !page.songs.length))) {
        throw new Error('Invalid music results');
      }
      return page;
    } finally {
      clearTimeout(timer);
      session.controller.signal.removeEventListener('abort', cancel);
      signal.removeEventListener('abort', onAbort);
    }
  }

  function publish(session, added = []) {
    if (current !== session) return;
    onChange({
      source: session.source,
      songs: session.songs.slice(), added,
      loading: session.loading && !session.songs.length,
      hasMore: !session.loading && session.hasMore,
      error: !session.songs.length ? session.error || null : null,
    });
  }

  function acceptPage(session, source, page) {
    if (current !== session) return;
    if (session.source !== source) {
      session.source = source;
      session.offset = 0;
      session.songs = [];
      session.seen.clear();
    }
    const added = relevantSearchSongs(session, page.songs).filter(song => {
      const key = String(song.providerId ?? song.id);
      if (session.seen.has(key)) return false;
      session.seen.add(key);
      return true;
    });
    session.offset = page.nextOffset;
    session.hasMore = page.hasMore === true;
    session.songs.push(...added);
    publish(session, added);
  }

  function fail(session, error) {
    if (current !== session) return;
    session.loading = false;
    session.hasMore = false;
    session.error = error?.name === 'TimeoutError' ? '搜索超时，请稍后重试' : '搜索失败，请稍后重试';
    publish(session);
  }

  async function loadFirst(session) {
    const fallback = new AbortController();
    let pendingFallback;
    const requestFallback = () => pendingFallback ||= requestPage(session, 'netease', fallback)
      .then(page => ({ page }), error => ({ error }));
    const embeat = requestPage(session, 'embeat', new AbortController());
    let waitingForEmbeat = true;
    const previewTimer = setTimeout(async () => {
      if (current !== session) return;
      const { page } = await requestFallback();
      if (waitingForEmbeat && page?.songs.length) acceptPage(session, 'netease', page);
    }, 2000);
    try {
      const page = await embeat;
      fallback.abort();
      session.loading = false;
      acceptPage(session, 'embeat', page);
    } catch {
      waitingForEmbeat = false;
      clearTimeout(previewTimer);
      if (current !== session) return;
      const { page, error } = await requestFallback();
      if (current !== session) return;
      session.loading = false;
      if (!page) fail(session, error);
      else if (session.source === 'netease') publish(session);
      else acceptPage(session, 'netease', page);
    } finally {
      waitingForEmbeat = false;
      clearTimeout(previewTimer);
    }
  }

  async function loadMore() {
    const session = current;
    if (!session || session.loading || !session.hasMore) return;
    session.loading = true;
    try {
      const page = await requestPage(session, session.source, new AbortController());
      session.loading = false;
      acceptPage(session, session.source, page);
    } catch (error) { fail(session, error); }
  }

  return {
    search(query) {
      cancel();
      current = { query, normalizedQuery: normalizeSearchText(query), source: '', offset: 0,
        songs: [], seen: new Set(), hasMore: false, loading: true, controller: new AbortController() };
      void loadFirst(current);
      publish(current);
    },
    loadMore,
    cancel,
  };
}
