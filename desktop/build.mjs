import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'desktop-dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const files = [
  'index.html', 'style.css', 'player.js', 'soft-aurora-react.js',
  'soft-aurora-react.css', 'liquid-glass.js', 'manifest.json',
  'icon-192.png', 'icon-512.png', 'service-worker.js'
];
for (const file of files) {
  const source = path.join(root, file);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(out, file));
}
for (const dir of ['assets', 'vendor']) {
  fs.cpSync(path.join(root, dir), path.join(out, dir), { recursive: true });
}

// The web build keeps relative /api URLs. In the desktop bundle they must
// point at the existing Render service, while artwork and audio continue to
// be addressed through the same URLs used by the web app.
const bootstrap = `<script>
window.__TY_MUSIC_DESKTOP__ = true;
window.__TY_MUSIC_API_BASE__ = 'https://ty-music.onrender.com';
document.documentElement.classList.add('ty-desktop');
(() => {
  const base = window.__TY_MUSIC_API_BASE__;
  const resolve = value => {
    if (typeof value !== 'string' || !value.startsWith('/api/')) return value;
    return base + value;
  };
  window.__TY_MUSIC_RESOLVE_URL__ = resolve;
  const imageSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (imageSrc?.set) Object.defineProperty(HTMLImageElement.prototype, 'src', {
    configurable: true, get: imageSrc.get,
    set(value) { imageSrc.set.call(this, resolve(value)); }
  });
  const mediaSrc = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
  if (mediaSrc?.set) Object.defineProperty(HTMLMediaElement.prototype, 'src', {
    configurable: true, get: mediaSrc.get,
    set(value) { mediaSrc.set.call(this, resolve(value)); }
  });
  const rewrite = root => root.querySelectorAll?.('img[src^="/api/"],audio[src^="/api/"],video[src^="/api/"]').forEach(el => {
    const current = el.getAttribute('src');
    if (current?.startsWith('/api/')) el.setAttribute('src', resolve(current));
  });
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) rewrite(node);
  }))).observe(document, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', () => {
    const listen = window.__TAURI__?.event?.listen;
    const click = selector => document.querySelector(selector)?.click();
    if (!listen) return;
    listen('ty:media-toggle', () => click('#playBtn'));
    listen('ty:media-play', () => {
      if (window.__TY_MUSIC_STATE__?.isPlaying === false) click('#playBtn');
      else if (!document.querySelector('#playBtn i')?.classList.contains('fa-pause')) click('#playBtn');
    });
    listen('ty:media-pause', () => {
      if (document.querySelector('#playBtn i')?.classList.contains('fa-pause')) click('#playBtn');
    });
    listen('ty:media-next', () => click('#nextBtn'));
    listen('ty:media-previous', () => click('#prevBtn'));
    listen('ty:media-seek', event => {
      const position = Number(event?.payload);
      const audio = document.querySelector('#audioPlayer');
      if (audio && Number.isFinite(position) && position >= 0) audio.currentTime = position;
    });
  });
})();
</script>`;
const index = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
fs.writeFileSync(path.join(out, 'index.html'), index.replace('</head>', `${bootstrap}</head>`));
console.log(`[Desktop] Prepared ${out}`);
