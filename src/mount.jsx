import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import BubbleMenu from './BubbleMenu';
import PlayerBubbleMenu from './PlayerBubbleMenu';
import ChromaGrid from './ChromaGrid';
import ElasticSlider from './ElasticSlider';
import MagicBento from './MagicBento';
import { GlassIcon } from './GlassIcons';
import { mountVisualScenes } from './visualScenes';
import { initLightweightVisuals } from './lightweightVisuals.mjs';

function mount(id, element) {
  const target = document.getElementById(id);
  if (target) createRoot(target).render(element);
}

mount('bubbleMenuMount', <BubbleMenu />);
mount('playerBubbleMount', <PlayerBubbleMenu />);
mount('chromaGridMount', <ChromaGrid onGenreClick={genre => window.loadGenreDetail?.(genre)} />);
mount('browseQuickGrid', <MagicBento />);
mountVisualScenes(mount);
initLightweightVisuals();

for (const [id, icon] of [
  ['libraryFavoritesIconMount', 'fa-heart'],
  ['libraryLocalIconMount', 'fa-music'],
  ['libraryPlaylistsIconMount', 'fa-list-ul'],
  ['libraryAlbumsIconMount', 'fa-record-vinyl'],
  ['playlistDetailIconMount', 'fa-list-ul']
]) {
  mount(id, <GlassIcon icon={icon} color="rgba(255,255,255,.16)" className="library-glass-icon" />);
}

const mountedAudio = document.getElementById('audioPlayer');
const mountedProgress = mountedAudio?.duration > 0 && Number.isFinite(mountedAudio.duration)
  ? mountedAudio.currentTime / mountedAudio.duration * 100 : 0;
const sliderMounts = [
  ['progressSliderMount', mountedProgress, false, false, false, 1.2],
  ['volumeSliderMount', Math.round((mountedAudio?.volume ?? 0.7) * 100), true, true, true, 1.2],
  ['ampProgressSliderMount', mountedProgress, false, false, true, 1.1]
];
sliderMounts.forEach(([mountId, value, showIcons, showValue, interactive, hoverScale]) => {
  const mount = document.getElementById(mountId);
  if (mount) {
    const root = createRoot(mount);
    flushSync(() => root.render(
      <ElasticSlider
        defaultValue={value}
        showIcons={showIcons}
        showValue={showValue}
        interactive={interactive}
        hoverScale={hoverScale}
      />
    ));
  }
});

// Only artwork needs observation. Text updates and removed decorative layers
// should never schedule a frame or scan the entire document.
const coverSelector = 'img[data-embeat-cover]';
function visitCovers(node, visit) {
  if (!(node instanceof Element)) return;
  if (node.matches(coverSelector)) visit(node);
  node.querySelectorAll(coverSelector).forEach(visit);
}
const watchCover = image => window.watchCoverImage?.(image);
const unwatchCover = image => {
  if (!image.isConnected) window.unwatchCoverImage?.(image);
};
const coverObserver = new MutationObserver(records => {
  for (const record of records) {
    record.removedNodes.forEach(node => visitCovers(node, unwatchCover));
    record.addedNodes.forEach(node => visitCovers(node, watchCover));
  }
});
coverObserver.observe(document.body, { childList: true, subtree: true });
visitCovers(document.body, watchCover);
