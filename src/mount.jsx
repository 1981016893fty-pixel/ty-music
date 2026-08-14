import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import SoftAurora from './SoftAurora';
import SpecularButton from './SpecularButton';
import TiltedCard from './TiltedCard';
import GlassSurface from './GlassSurface';
import BubbleMenu from './BubbleMenu';
import PlayerBubbleMenu from './PlayerBubbleMenu';
import ChromaGrid from './ChromaGrid';
import ElasticSlider from './ElasticSlider';
import Shuffle from './Shuffle';
import ElasticMesh from './ElasticMesh';
import GridDistortion from './GridDistortion';
import ScrollExpand from './ScrollExpand';
import MagicBento from './MagicBento';
import ShinyText from './ShinyText';
import GlitchText from './GlitchText';
import SplashCursor from './SplashCursor';
import Prism from './Prism';
import FloatingLines from './FloatingLines';
import ElectricBorder from './ElectricBorder';
import GradientWaves from './GradientWaves';
import DriftWall from './DriftWall';
import LiquidEther from './LiquidEther';
import { GridScan } from './GridScan';
import { GlassIcon } from './GlassIcons';

const host = document.getElementById('softAuroraHost');

const welcomeStartMount = document.getElementById('welcomeStartMount');
if (welcomeStartMount) {
  createRoot(welcomeStartMount).render(
    <SpecularButton
      className="welcome-start-button"
      tint="rgba(255, 255, 255, 0.02)"
      blur={18}
      lineColor="rgba(255,255,255,0.72)"
      baseColor="rgba(255,255,255,0.94)"
      intensity={0.62}
      autoAnimate
      onClick={() => window.enterMusicApp?.()}
    >
      <ShinyText text="开始使用" speed={2.1} color="#FFFFFF" shineColor="#FFFFFF" />
    </SpecularButton>
  );
}

const welcomeLearnMoreMount = document.getElementById('welcomeLearnMoreMount');
if (welcomeLearnMoreMount) {
  createRoot(welcomeLearnMoreMount).render(
    <SpecularButton
      className="welcome-learn-more"
      tint="rgba(255, 255, 255, 0.02)"
      blur={18}
      lineColor="rgba(255,255,255,0.72)"
      baseColor="rgba(255,255,255,0.94)"
      intensity={0.62}
      autoAnimate
      onClick={() => window.toggleWelcomeFeatures?.()}
    >
      <ShinyText text="了解更多" speed={2.1} color="#FFFFFF" shineColor="#FFFFFF" />
    </SpecularButton>
  );
}

const welcomeLiquidEtherMount = document.getElementById('welcomeLiquidEtherMount');
if (welcomeLiquidEtherMount) {
  createRoot(welcomeLiquidEtherMount).render(
    <LiquidEther
      colors={['#5227FF', '#FF9FFC', '#B497CF']}
      mouseForce={20}
      cursorSize={100}
      autoDemo={true}
      autoSpeed={0.34}
      autoIntensity={1.7}
      iterationsViscous={16}
      iterationsPoisson={16}
      BFECC={false}
      resolution={0.34}
      className="welcome-liquid-ether"
    />
  );
}

const libraryGradientHost = document.getElementById('libraryGradientWavesMount');
if (libraryGradientHost) {
  createRoot(libraryGradientHost).render(
    <GradientWaves
      horizonColor="#141125"
      waveColor="#6d46ff"
      crestColor="#ffd2f6"
      speed={0.34}
      brightness={0.92}
      opacity={0.78}
      detail="medium"
      grainIntensity={0.035}
    />
  );
}

[
  ['libraryFavoritesIconMount', 'fa-heart'],
  ['libraryLocalIconMount', 'fa-music'],
  ['libraryPlaylistsIconMount', 'fa-list-ul'],
  ['libraryAlbumsIconMount', 'fa-record-vinyl'],
  ['playlistDetailIconMount', 'fa-list-ul']
].forEach(([mountId, icon, color]) => {
  const mount = document.getElementById(mountId);
  if (mount) createRoot(mount).render(<GlassIcon icon={icon} color="rgba(255,255,255,.16)" className="library-glass-icon" />);
});

function HeroElasticMesh() {
  const [image, setImage] = React.useState(() => window.heroMeshCover || '');
  React.useEffect(() => {
    const art = document.querySelector('.hero-art');
    if (!art) return undefined;
    art.classList.add('has-elastic-mesh');
    return () => art.classList.remove('has-elastic-mesh');
  }, []);
  React.useEffect(() => {
    const update = event => setImage(event.detail?.cover || '');
    window.addEventListener('ty:herochange', update);
    if (window.heroMeshCover) setImage(window.heroMeshCover);
    return () => window.removeEventListener('ty:herochange', update);
  }, []);
  return <ElasticMesh image={image} borderRadius={14} shading={0.24} gridOpacity={0.12} />;
}

const heroMeshMount = document.getElementById('heroElasticMeshMount');
if (heroMeshMount) createRoot(heroMeshMount).render(<HeroElasticMesh />);

function HeroElectricBorder() {
  const [color, setColor] = React.useState(() => window.heroAccentHex || '#62F1F3');
  React.useEffect(() => {
    const update = event => setColor(event.detail?.accent || '#62F1F3');
    window.addEventListener('ty:herocolors', update);
    return () => window.removeEventListener('ty:herocolors', update);
  }, []);
  return <ElectricBorder color={color} speed={1} chaos={0.12} borderRadius={24} />;
}

const heroElectricBorderMount = document.getElementById('heroElectricBorderMount');
if (heroElectricBorderMount) createRoot(heroElectricBorderMount).render(<HeroElectricBorder />);

function AmpTiltedArtwork() {
  const [image, setImage] = React.useState(() => window.ampCoverSrc || '');
  React.useEffect(() => {
    const update = event => setImage(event.detail?.cover || '');
    window.addEventListener('ty:ampcoverchange', update);
    if (window.ampCoverSrc) setImage(window.ampCoverSrc);
    return () => window.removeEventListener('ty:ampcoverchange', update);
  }, []);
  if (!image) return null;
  return <TiltedCard imageSrc={image} altText="当前专辑封面" showTooltip={false} scaleOnHover={1.045} rotateAmplitude={12} />;
}

const ampTiltedCardMount = document.getElementById('ampTiltedCardMount');
if (ampTiltedCardMount) createRoot(ampTiltedCardMount).render(<AmpTiltedArtwork />);

const ampGridFallback = {
  primary: { r: 74, g: 44, b: 156 },
  secondary: { r: 42, g: 122, b: 190 },
  tertiary: { r: 12, g: 10, b: 28 }
};

function albumColorTexture(colors = ampGridFallback) {
  const toRgb = color => `rgb(${color.r},${color.g},${color.b})`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="none"><defs><radialGradient id="primary" cx="18%" cy="18%" r="82%"><stop offset="0" stop-color="${toRgb(colors.secondary)}"/><stop offset=".5" stop-color="${toRgb(colors.primary)}"/><stop offset="1" stop-color="${toRgb(colors.tertiary)}"/></radialGradient><radialGradient id="accent" cx="82%" cy="76%" r="68%"><stop offset="0" stop-color="${toRgb(colors.primary)}" stop-opacity=".82"/><stop offset="1" stop-color="${toRgb(colors.tertiary)}" stop-opacity="0"/></radialGradient></defs><rect width="1600" height="1000" fill="${toRgb(colors.tertiary)}"/><rect width="1600" height="1000" fill="url(#primary)"/><rect width="1600" height="1000" fill="url(#accent)"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function AmpGridDistortion() {
  const [image, setImage] = React.useState(() => albumColorTexture(window.ampGridColors));
  React.useEffect(() => {
    const update = event => setImage(albumColorTexture(event.detail));
    window.addEventListener('ty:ampgridcolors', update);
    if (window.ampGridColors) setImage(albumColorTexture(window.ampGridColors));
    return () => window.removeEventListener('ty:ampgridcolors', update);
  }, []);
  return <GridDistortion imageSrc={image} grid={15} mouse={0.1} strength={0.15} relaxation={0.9} />;
}

const ampGridMount = document.getElementById('ampGridDistortionMount');
if (ampGridMount) createRoot(ampGridMount).render(<AmpGridDistortion />);

function AlbumDriftWall() {
  const [items, setItems] = React.useState(() => window.albumDriftWallItems || []);
  const itemsRef = React.useRef(items);
  React.useEffect(() => {
    const update = event => {
      const incoming = Array.isArray(event.detail?.items) ? event.detail.items : [];
      if (!incoming.length) return;
      setItems(previous => {
        const merged = [];
        const seen = new Set();
        previous.concat(incoming).forEach(item => {
          if (!item?.image || seen.has(item.image)) return;
          seen.add(item.image);
          merged.push(item);
        });
        const next = merged.slice(-96);
        itemsRef.current = next;
        return next;
      });
    };
    window.addEventListener('ty:albumdriftcovers', update);
    if (window.albumDriftWallItems?.length) update({ detail: { items: window.albumDriftWallItems } });
    return () => window.removeEventListener('ty:albumdriftcovers', update);
  }, []);
  return <DriftWall items={items} columns={5} tileWidth={190} tileHeight={128} gap={16} speed={34} tilt={14} turn={-12} depth={110} parallax={0.52} dim={0.62} fade={0.48} overlayColor="#05030c" className="album-drift-wall" />;
}

const albumDriftWallMount = document.getElementById('albumDriftWallMount');
if (albumDriftWallMount) createRoot(albumDriftWallMount).render(<AlbumDriftWall />);

const coverFlowGridScanMount = document.getElementById('coverFlowGridScanMount');
if (coverFlowGridScanMount) {
  createRoot(coverFlowGridScanMount).render(
    <GridScan
      enableWebcam={false}
      showPreview={false}
      sensitivity={0.42}
      lineThickness={1.05}
      linesColor="#3b3158"
      scanColor="#c28cff"
      scanOpacity={0.34}
      gridScale={0.14}
      lineStyle="solid"
      lineJitter={0.04}
      scanDirection="pingpong"
      enablePost={true}
      bloomIntensity={0.18}
      bloomThreshold={0.08}
      bloomSmoothing={0.28}
      chromaticAberration={0.0008}
      noiseIntensity={0.006}
      scanGlow={0.7}
      scanSoftness={2.2}
      scanPhaseTaper={0.86}
      scanDuration={3.2}
      scanDelay={1.8}
      className="cover-flow-grid-scan"
    />
  );
}

const withChakra = element => (
  <ChakraProvider value={defaultSystem}>{element}</ChakraProvider>
);


const bubbleMenuHost = document.getElementById('bubbleMenuMount');
if (bubbleMenuHost) {
  createRoot(bubbleMenuHost).render(withChakra(<BubbleMenu />));
}

const playerBubbleHost = document.getElementById('playerBubbleMount');
if (playerBubbleHost) {
  createRoot(playerBubbleHost).render(withChakra(<PlayerBubbleMenu />));
}

const chromaGridHost = document.getElementById('chromaGridMount');
if (chromaGridHost) {
  createRoot(chromaGridHost).render(<ChromaGrid onGenreClick={genre => window.loadGenreDetail?.(genre)} />);
}

const browseScrollHost = document.getElementById('browseScrollExpandMount');
if (browseScrollHost) {
  function BrowseScrollExpand() {
    // This discovery artwork is intentionally independent from the currently
    // playing album, so changing songs cannot replace the expanded visual.
    const image = '/assets/browse-listener-hero-v2.jpg';
    return <ScrollExpand src={image} alt="音乐探索" title="发现下一首喜欢的歌" scrollHint="向下滚动探索" startWidth={48} startHeight={64} startRadius={26} mediaZoom={1.02} scrollDistance={1.05} holdDistance={0.25} className="browse-scroll-expand" />;
  }
  createRoot(browseScrollHost).render(<BrowseScrollExpand />);
}

const browseQuickGridHost = document.getElementById('browseQuickGrid');
if (browseQuickGridHost) createRoot(browseQuickGridHost).render(<MagicBento />);

const splashCursorHost = document.getElementById('browseSplashCursorMount');
const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
const compactViewport = window.matchMedia('(max-width: 768px)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (splashCursorHost) createRoot(splashCursorHost).render(<SplashCursor active={!coarsePointer && !reducedMotion} />);

const browsePrismHost = document.getElementById('browsePrismMount');
if (browsePrismHost) {
  createRoot(browsePrismHost).render(
    <Prism
      animationType="rotate"
      timeScale={compactViewport || reducedMotion ? 0 : 0.22}
      scale={3}
      hueShift={0.58}
      colorFrequency={1.25}
      glow={1.15}
      noise={0.04}
      bloom={0.65}
      hoverStrength={0.18}
      inertia={0.08}
      transparent
      suspendWhenOffscreen
    />
  );
}

const homeFloatingLinesHost = document.getElementById('homeFloatingLinesMount');
if (homeFloatingLinesHost) {
  // Keep the official React Bits defaults so the homepage retains the
  // recognizable pink/blue flowing-line composition.
  createRoot(homeFloatingLinesHost).render(
    <FloatingLines
      interactive={!coarsePointer && !reducedMotion}
      parallax={!coarsePointer && !reducedMotion}
      lineCount={compactViewport ? [4] : [6]}
      animationSpeed={reducedMotion ? 0 : compactViewport ? 0.55 : 1}
      maxFps={compactViewport ? 30 : 60}
    />
  );
}

[
['hotShuffleTitleMount', 'TOP CHARTS'],
  ['genreShuffleTitleMount', 'BROWSE BY GENRE'],
  ['recentShuffleTitleMount', 'RECENTLY PLAYED']
].forEach(([mountId, text]) => {
  const mount = document.getElementById(mountId);
  if (mount) {
    createRoot(mount).render(
      <Shuffle
        text={text}
        shuffleDirection="right"
        duration={0.35}
        stagger={0.045}
        colorFrom="#ddafff"
        colorTo="#8ee7ff"
      />
    );
  }
});

const genreTitleMount = document.getElementById('genreTitleMount');
let genreTitleRoot;
const renderGenreTitle = text => {
  if (!genreTitleMount) return;
  genreTitleRoot ||= createRoot(genreTitleMount);
  genreTitleRoot.render(
    <Shuffle
      key={text}
      text={text}
      shuffleDirection="right"
      duration={0.35}
      stagger={0.045}
      colorFrom="#ddafff"
      colorTo="#8ee7ff"
    />
  );
};
window.setGenreShuffleTitle = renderGenreTitle;
renderGenreTitle('GENRE');

const sliderMounts = [
  ['progressSliderMount', 0, false, false, false, 1.2],
  ['volumeSliderMount', 70, true, true, true, 1.2],
  ['ampProgressSliderMount', 0, false, false, true, 1.1]
];
sliderMounts.forEach(([mountId, value, showIcons, showValue, interactive, hoverScale]) => {
  const mount = document.getElementById(mountId);
  if (mount) {
    const root = createRoot(mount);
    flushSync(() => root.render(withChakra(
      <ElasticSlider
        defaultValue={value}
        showIcons={showIcons}
        showValue={showValue}
        interactive={interactive}
        hoverScale={hoverScale}
      />
    )));
  }
});

if (host) {
  createRoot(host).render(
    <StrictMode>
      <SoftAurora />
    </StrictMode>
  );
}

const heroPlayMount = document.getElementById('heroPlaySpecularMount');
if (heroPlayMount) {
  createRoot(heroPlayMount).render(
    <SpecularButton className="hero-play-cyan" onClick={() => window.playHeroTrack?.()} tint="rgba(47, 221, 227, 0.2)" blur={16} lineColor="#FFFFFF" baseColor="#FFFFFF" intensity={0.72} autoAnimate><ShinyText text="立即播放" speed={2.1} color="#E8FFFF" shineColor="#FFFFFF" /></SpecularButton>
  );
}

const albumPlayAllMount = document.getElementById('albumPlayAllBtn');
if (albumPlayAllMount) {
  createRoot(albumPlayAllMount).render(
    <SpecularButton
      className="album-play-specular"
      tint="rgba(255, 255, 255, 0.08)"
      blur={16}
      lineColor="#FFFFFF"
      baseColor="#FFFFFF"
      intensity={0.72}
      autoAnimate
    >
      <ShinyText
        text="播放全部"
        speed={2.1}
        color="#E8FFFF"
        shineColor="#FFFFFF"
      />
    </SpecularButton>
  );
}

const topDock = document.getElementById('topDock');
// Keep the brand marker outside the application scroll and layout tree.
if (topDock && topDock.parentElement !== document.documentElement) document.documentElement.appendChild(topDock);

const topDockBrandMount = document.getElementById('topDockBrandMount');
if (topDockBrandMount) createRoot(topDockBrandMount).render(<GlitchText className="top-dock__glitch" speed={0.85} enableOnHover={false}>TY MUSIC</GlitchText>);

const topDockClientMount = document.getElementById('topDockClientMount');
if (topDockClientMount) {
  createRoot(topDockClientMount).render(
    <SpecularButton
      className="top-dock__client-entry"
      tint="rgba(255, 255, 255, 0.02)"
      blur={18}
      lineColor="rgba(255,255,255,0.72)"
      baseColor="rgba(255,255,255,0.94)"
      intensity={0.62}
      autoAnimate
      onClick={() => { window.location.href = 'desktop.html'; }}
    >
      <span className="top-dock__client-content">
        <i className="fa-solid fa-desktop top-dock__client-icon" aria-hidden="true" />
        <ShinyText text="桌面客户端" speed={2.1} color="#FFFFFF" shineColor="#FFFFFF" />
      </span>
    </SpecularButton>
  );
}

function ShinyHeading({ target }) {
  const [text, setText] = React.useState(target.dataset.shinyText || '');
  React.useEffect(() => {
    target.classList.add('has-shiny-text');
    const update = () => setText(target.dataset.shinyText || '');
    const observer = new MutationObserver(update);
    observer.observe(target, { attributes: true, attributeFilter: ['data-shiny-text'] });
    return () => { observer.disconnect(); target.classList.remove('has-shiny-text'); };
  }, [target]);
  return <ShinyText text={text} speed={2.8} pauseOnHover />;
}

document.querySelectorAll('[data-shiny-text]').forEach(target => {
  createRoot(target).render(<ShinyHeading target={target} />);
});

// Apply the same specular language to legacy buttons without replacing their
// existing handlers or IDs.
const updateButtonSpecular = event => {
  document.querySelectorAll('button:not(.specular-button)').forEach(button => {
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--sb-mx', `${event.clientX - rect.left}px`);
    button.style.setProperty('--sb-my', `${event.clientY - rect.top}px`);
  });
};
if (!coarsePointer && !reducedMotion) {
  window.addEventListener('pointermove', updateButtonSpecular, { passive: true });
}

const tiltedRoots = new Map();
function mountTiltedCards() {
  if (coarsePointer || reducedMotion) return;
  document.querySelectorAll('.am-artwork').forEach(artwork => {
    if (tiltedRoots.has(artwork)) return;
    const image = artwork.querySelector(':scope > img');
    const imageSource = image?.getAttribute('src') || '';
    if (!image || !imageSource || !/^\/(?:api|assets)\//.test(imageSource) && !/^https?:\/\//i.test(imageSource)) return;
    const mount = document.createElement('div');
    mount.className = 'tilted-card-mount';
    const overlay = artwork.querySelector(':scope > .am-play-overlay');
    artwork.insertBefore(mount, image);
    image.remove();
    const root = createRoot(mount);
    root.render(<TiltedCard imageSrc={imageSource} altText={image.alt || '音乐专辑封面'} captionText={`${image.dataset.name || ''} · ${image.dataset.artist || ''}`} showTooltip={false} />);
    tiltedRoots.set(artwork, root);
    if (overlay) artwork.appendChild(overlay);
  });
}

const tiltedObserver = new MutationObserver(records => {
  records.forEach(record => record.removedNodes.forEach(node => {
    if (!(node instanceof Element)) return;
    node.querySelectorAll('.am-artwork').forEach(artwork => {
      const root = tiltedRoots.get(artwork);
      if (root) { root.unmount(); tiltedRoots.delete(artwork); }
    });
  }));
  mountTiltedCards();
  mountGlassSurfaces();
});
tiltedObserver.observe(document.body, { childList: true, subtree: true });
mountTiltedCards();

const glassRoots = new Map();
function mountGlassSurfaces() {
  // Playing state can move between rows without replacing the whole list.
  // Unmount a previous row surface so ordinary browse rows remain unframed.
  glassRoots.forEach((root, target) => {
    const isSongRow = target.classList.contains('track-row') || target.classList.contains('album-track-row') || target.classList.contains('fav-track-row') || target.classList.contains('local-track-row');
    if (isSongRow && !target.classList.contains('playing')) {
      root.unmount();
      target.querySelector('.glass-surface-mount')?.remove();
      target.classList.remove('song-row');
      glassRoots.delete(target);
    }
  });
  document.querySelectorAll('.top-dock,.browse-search-box,.hero-card,.recent-section .am-card.wide,.nav-item,.bubble-menu__trigger,.bubble-menu__item,.player-bubble-menu__trigger,.player-bubble-menu__now-playing,.player-bubble-menu__item,.player-bubble-menu__volume,.progress-bar,.volume-bar,.amp-progress-bar,.modal-content,.queue-panel,.album-detail-panel,.track-options-menu,.am-artist-page-surface,.am-album-page-surface,.am-artist-bio,.local-upload-area,.track-row.playing,.album-track-row.playing,.fav-track-row.playing,.local-track-row.playing').forEach(target => {
    if (glassRoots.has(target)) return;
    target.classList.add('glass-surface-host');
    const mount = document.createElement('div');
    mount.className = 'glass-surface-mount';
    target.prepend(mount);
    const root = createRoot(mount);
    const isTopDock = target.classList.contains('top-dock');
    const isBrowseSearch = target.classList.contains('browse-search-box');
    const isLocalUpload = target.classList.contains('local-upload-area');
    const isTrackOptions = target.classList.contains('track-options-menu');
    const isArtistBio = target.classList.contains('am-artist-bio');
    const isRecentCard = target.matches('.recent-section .am-card.wide');
    const isCreamPage = target.classList.contains('am-artist-page-surface') || target.classList.contains('am-album-page-surface');
    const isSelectedTrack = target.classList.contains('playing') && (target.classList.contains('track-row') || target.classList.contains('album-track-row') || target.classList.contains('fav-track-row') || target.classList.contains('local-track-row'));
    const isSongRow = target.classList.contains('track-row') || target.classList.contains('album-track-row') || target.classList.contains('fav-track-row') || target.classList.contains('local-track-row');
    const isHeroCard = target.classList.contains('hero-card');
    if (isSongRow) target.classList.add('song-row');
    const borderRadius = isCreamPage || isTopDock ? 0 : (isBrowseSearch ? 16 : (isLocalUpload || isTrackOptions || isArtistBio || isRecentCard ? 14 : 10));
    const brightness = isTopDock || isBrowseSearch ? 46 : (isCreamPage || isSelectedTrack ? 96 : (isLocalUpload || isTrackOptions || isArtistBio ? 38 : (isRecentCard || isSongRow ? 34 : 50)));
    const opacity = isTopDock ? 0.66 : (isBrowseSearch ? 0.86 : (isCreamPage || isSelectedTrack ? 0.82 : (isLocalUpload || isTrackOptions || isArtistBio ? 0.74 : (isRecentCard ? 0.72 : (isSongRow ? 0.62 : 0.93)))));
    const blur = isTopDock || isBrowseSearch ? 14 : (isCreamPage || isSelectedTrack || isLocalUpload || isTrackOptions || isArtistBio || isRecentCard ? 18 : 11);
    const backgroundOpacity = isTopDock ? 0.1 : (isBrowseSearch ? 0.18 : (isCreamPage || isSelectedTrack ? 0.34 : (isLocalUpload || isTrackOptions || isArtistBio ? 0.14 : (isRecentCard ? 0.1 : (isSongRow ? 0.08 : (isHeroCard ? 0.16 : 0.2))))));
    const saturation = isTopDock || isBrowseSearch ? 1.18 : (isCreamPage || isSelectedTrack ? 1.08 : (isLocalUpload || isArtistBio || isRecentCard ? 1.16 : 1.45));
    root.render(<GlassSurface
      borderRadius={borderRadius}
      brightness={brightness}
      opacity={opacity}
      blur={blur}
      backgroundOpacity={backgroundOpacity}
      saturation={saturation}
      className={`glass-surface--capsule ${isSelectedTrack ? 'glass-surface--selection' : ''} ${isArtistBio ? 'glass-surface--bio' : ''}`}
    />);
    glassRoots.set(target, root);
  });
}
window.mountGlassSurfaces = mountGlassSurfaces;
mountGlassSurfaces();
window.setTimeout(mountGlassSurfaces, 100);
window.setTimeout(mountGlassSurfaces, 800);
