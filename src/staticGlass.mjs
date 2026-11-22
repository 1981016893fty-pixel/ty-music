const surfaces = [
  '.top-dock', '.browse-search-box', '.hero-card', '.recent-section .am-card.wide',
  '.nav-item', '.bubble-menu__trigger', '.bubble-menu__item',
  '.player-bubble-menu__trigger', '.player-bubble-menu__now-playing',
  '.player-bubble-menu__item', '.player-bubble-menu__volume',
  '.progress-bar', '.volume-bar', '.amp-progress-bar',
  '.modal-content', '.queue-panel', '.album-detail-panel', '.track-options-menu',
  '.am-artist-page-surface', '.am-album-page-surface', '.am-artist-bio', '.local-upload-area',
].join(',');
const songRows = ':is(.track-row, .album-track-row, .fav-track-row, .local-track-row)';
const targets = surfaces + ',' + songRows + '.playing';

function addGlass(host, selected = false) {
  if (host.classList.contains('glass-surface-host')) return;
  const mount = document.createElement('span');
  const surface = document.createElement('span');
  mount.className = 'glass-surface-mount';
  mount.setAttribute('aria-hidden', 'true');
  surface.className = 'glass-surface glass-surface--capsule glass-surface--fallback';
  if (selected) {
    surface.classList.add('glass-surface--selection');
    host.classList.add('song-row');
  }
  mount.append(surface);
  host.classList.add('glass-surface-host');
  host.prepend(mount);
}

export function mountStaticGlass(scope) {
  const mount = host => addGlass(host, host.matches(songRows));
  if (scope.matches?.(targets)) mount(scope);
  scope.querySelectorAll(targets).forEach(mount);
}

export function syncSongGlass(row) {
  if (row.classList.contains('playing')) {
    addGlass(row, true);
  } else if (row.classList.contains('song-row')) {
    row.querySelector(':scope > .glass-surface-mount')?.remove();
    row.classList.remove('song-row', 'glass-surface-host');
  }
}
