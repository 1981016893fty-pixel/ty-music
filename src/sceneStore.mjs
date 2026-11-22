// One observer watches only navigation state, never the animated document subtree.
export function createSceneStore(document, motionPreference) {
  const listeners = new Set();
  let observer;
  const snapshot = () => [
    document.hidden ? 'hidden' : 'visible',
    document.getElementById('welcomeScreen')?.classList.contains('is-dismissed') === false ? 'welcome' : 'app',
    document.querySelector('.page.active')?.id || '',
    document.getElementById('ampFullscreenPlayer')?.classList.contains('show') ? 'fullscreen' : '',
    document.getElementById('page-album-favorites')?.classList.contains('cover-flow-active') ? 'coverflow' : '',
    motionPreference.matches ? 'reduced' : 'motion',
    document.body?.classList.contains('native-mini-mode') ? 'mini' : '',
  ].join('|');
  const notify = () => listeners.forEach(listener => listener());
  return {
    snapshot,
    subscribe(listener) {
      if (!listeners.size) {
        observer = new MutationObserver(notify);
        document.querySelectorAll('.page, #welcomeScreen, #ampFullscreenPlayer').forEach(element => {
          observer.observe(element, { attributes: true, attributeFilter: ['class'] });
        });
        if (document.body) observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        document.addEventListener('visibilitychange', notify);
        motionPreference.addEventListener('change', notify);
      }
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) {
          observer.disconnect();
          document.removeEventListener('visibilitychange', notify);
          motionPreference.removeEventListener('change', notify);
        }
      };
    },
  };
}

export function sceneActive(scene, snapshot, decorative = false) {
  const [visibility, entry, page, fullscreen, coverflow, motion, mode] = snapshot.split('|');
  if (visibility === 'hidden' || mode === 'mini' || decorative && motion === 'reduced') return false;
  if (scene === 'welcome') return entry === 'welcome';
  if (entry === 'welcome') return false;
  if (scene === 'fullscreen') return Boolean(fullscreen);
  if (fullscreen) return false;
  if (scene === 'app') return true;
  if (scene === 'aurora') return ['page-favorites', 'page-playlist-detail', 'page-album-detail', 'page-artist-detail'].includes(page);
  if (scene === 'library') return page === 'page-local' || page === 'page-playlists';
  if (scene === 'album-favorites') return page === 'page-album-favorites' && !coverflow;
  if (scene === 'coverflow') return page === 'page-album-favorites' && Boolean(coverflow);
  return page === `page-${scene}`;
}
