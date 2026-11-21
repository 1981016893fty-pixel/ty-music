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

// Choose one catalog for a query. A speculative NetEase request keeps
// fallback latency independent of the Embeat deadline.
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
      source === 'embeat' && offset === 0 ? 6000 : 15000);
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
      hasMore: session.hasMore,
      error: !session.songs.length ? session.error || null : null,
    });
  }

  async function loadMore() {
    const session = current;
    if (!session || session.loading || !session.hasMore) return;
    session.loading = true;
    try {
      let page;
      if (session.source) {
        page = await requestPage(session, session.source, new AbortController());
      } else {
        const fallback = new AbortController();
        const netease = requestPage(session, 'netease', fallback)
          .then(result => ({ result }), error => ({ error }));
        try {
          page = await requestPage(session, 'embeat', new AbortController());
          session.source = 'embeat';
          fallback.abort();
        } catch {
          if (current !== session) return;
          session.source = 'netease';
          const { result, error } = await netease;
          if (error) throw error;
          page = result;
        }
      }
      if (current !== session) return;
      const added = relevantSearchSongs(session, page.songs).filter(song => {
        const key = String(song.providerId ?? song.id);
        if (session.seen.has(key)) return false;
        session.seen.add(key);
        return true;
      });
      session.offset = page.nextOffset;
      session.hasMore = page.hasMore === true;
      session.songs.push(...added);
      session.loading = false;
      publish(session, added);
    } catch (error) {
      if (current !== session) return;
      session.loading = false;
      session.hasMore = false;
      session.error = error?.name === 'TimeoutError' ? '搜索超时，请稍后重试' : '搜索失败，请稍后重试';
      publish(session);
    }
  }

  return {
    search(query) {
      cancel();
      current = { query, normalizedQuery: normalizeSearchText(query), source: '', offset: 0,
        songs: [], seen: new Set(), hasMore: true, loading: false, controller: new AbortController() };
      void loadMore();
      publish(current);
    },
    loadMore,
    cancel,
  };
}
