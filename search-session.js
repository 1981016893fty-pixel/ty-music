'use strict';

// Search state only; rendering and playback remain in player.js. Each catalog
// owns its cursor and deadline, so optional results cannot lock the base list.
function createMusicSearchSession({ fetchImpl = globalThis.fetch, onChange }) {
  let current = null;
  function cancel() {
    const previous = current;
    current = null;
    if (!previous) return;
    for (const source of Object.values(previous.sources)) {
      clearTimeout(source.timer);
      source.controller?.abort();
    }
  }
  function append(session, songs) {
    const added = [];
    for (const song of songs) {
      const key = JSON.stringify([song.source, String(song.providerId ?? song.id)]);
      if (session.seen.has(key)) continue;
      session.seen.add(key);
      session.songs.push(song);
      added.push(song);
    }
    return added;
  }
  function publish(session, added = []) {
    if (current !== session) return;
    const base = session.sources.netease, extra = session.sources.embeat;
    onChange({
      songs: session.songs.slice(), added,
      loading: !base.settled,
      supplementLoading: extra.loading,
      hasMore: Object.values(session.sources).some(source => source.hasMore),
      primarySettled: base.settled,
      error: !session.songs.length && !extra.loading ? base.error : null,
    });
  }
  async function requestPage(session, name) {
    const source = session.sources[name];
    if (source.loading || !source.hasMore) return;
    if (name === 'embeat' && source.settled && !session.sources.netease.settled) return;
    source.loading = true;
    const controller = new AbortController();
    source.controller = controller;
    source.timer = setTimeout(() => controller.abort(), 15000);
    let onAbort;
    const aborted = new Promise((resolve, reject) => {
      onAbort = () => reject(new Error('搜索超时，请稍后重试'));
      controller.signal.addEventListener('abort', onAbort, { once: true });
    });
    let added = [];
    try {
      const query = new URLSearchParams({ keywords: session.query, source: name, limit: '20', offset: String(source.offset) });
      const page = await Promise.race([(async () => {
        const response = await fetchImpl('/api/music/search?' + query, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok) throw new Error('搜索失败，请稍后重试');
        return response.json();
      })(), aborted]);
      if (current !== session || controller.signal.aborted) return;
      if (!Array.isArray(page.songs) || page.songs.some(song => !song || song.source !== name || !song.id) ||
          !Number.isSafeInteger(page.nextOffset) || page.nextOffset < source.offset ||
          (page.hasMore === true && (page.nextOffset <= source.offset || !page.songs.length))) {
        throw new Error('搜索结果无效，请稍后重试');
      }
      source.offset = page.nextOffset;
      source.hasMore = page.hasMore === true;
      if (name === 'embeat' && !session.sources.netease.settled) session.buffered = page.songs;
      else added = append(session, page.songs);
    } catch (error) {
      if (current !== session) return;
      source.error = controller.signal.aborted ? '搜索超时，请稍后重试' : '搜索失败，请稍后重试';
      source.hasMore = false;
    } finally {
      clearTimeout(source.timer);
      controller.signal.removeEventListener('abort', onAbort);
      if (current === session) {
        source.loading = false;
        source.settled = true;
        source.controller = null;
        if (name === 'netease' && session.buffered.length) {
          added = added.concat(append(session, session.buffered));
          session.buffered = [];
        }
        publish(session, added);
      }
    }
  }
  function loadMore() {
    if (!current) return;
    for (const name of ['netease', 'embeat']) void requestPage(current, name);
  }
  return {
    search(query) {
      cancel();
      const source = () => ({ offset: 0, hasMore: true, loading: false, settled: false, error: null });
      current = { query, songs: [], buffered: [], seen: new Set(), sources: { netease: source(), embeat: source() } };
      loadMore();
      publish(current);
    },
    loadMore,
    cancel,
  };
}
