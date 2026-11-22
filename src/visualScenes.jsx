import { useEffect, useState } from 'react';
import Scene from './Scene';
import {
  DriftWall, ElectricBorder, ElasticMesh, FloatingLines, GradientWaves, GridDistortion,
  GridScan, LiquidEther, Prism, ScrollExpand, SoftAurora, SplashCursor,
} from './sceneEffects';

// Player data is authoritative. Read it when a scene mounts and subscribe only
// while the effect is active.
function usePlayerVisual(event, read) {
  const [value, setValue] = useState(read);
  useEffect(() => {
    const update = () => setValue(read());
    window.addEventListener(event, update);
    update();
    return () => window.removeEventListener(event, update);
  }, [event, read]);
  return value;
}

const readHeroCover = () => document.querySelector('.hero-art-fallback')?.src || '';
const readHeroAccent = () => document.getElementById('heroCard')?.style.getPropertyValue('--hero-accent-rgb') || '98, 241, 243';
const readAmpPalette = () => window.ampGridColors;
const readAlbumWall = () => window.albumDriftWallItems;

function HeroMesh() {
  const image = usePlayerVisual('ty:herochange', readHeroCover);
  return image && <ElasticMesh image={image} borderRadius={14} shading={0.24} gridOpacity={0.12} />;
}

function HeroBorder() {
  const accent = usePlayerVisual('ty:herocolors', readHeroAccent);
  const color = '#' + accent.split(',').map(channel => Number(channel).toString(16).padStart(2, '0')).join('');
  return <ElectricBorder color={color} speed={1} chaos={0.12} borderRadius={24} />;
}

const fallbackPalette = {
  primary: { r: 74, g: 44, b: 156 },
  secondary: { r: 42, g: 122, b: 190 },
  tertiary: { r: 12, g: 10, b: 28 },
};

function FullscreenDistortion() {
  const { primary, secondary, tertiary } = usePlayerVisual('ty:ampgridcolors', readAmpPalette) || fallbackPalette;
  const rgb = ({ r, g, b }) => `rgb(${r},${g},${b})`;
  // Smooth gradients do not need a screen-sized texture. Keep the original
  // aspect ratio and color stops; the shader interpolates between texels.
  const image = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200" preserveAspectRatio="none"><defs><radialGradient id="a" cx="18%" cy="18%" r="82%"><stop stop-color="${rgb(secondary)}"/><stop offset=".5" stop-color="${rgb(primary)}"/><stop offset="1" stop-color="${rgb(tertiary)}"/></radialGradient><radialGradient id="b" cx="82%" cy="76%" r="68%"><stop stop-color="${rgb(primary)}" stop-opacity=".82"/><stop offset="1" stop-color="${rgb(tertiary)}" stop-opacity="0"/></radialGradient></defs><path fill="url(#a)" d="M0 0h320v200H0z"/><path fill="url(#b)" d="M0 0h320v200H0z"/></svg>`;
  return <GridDistortion imageSrc={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(image)}`}
    grid={15} mouse={0.1} strength={0.15} relaxation={0.9} />;
}

function AlbumWall() {
  const items = usePlayerVisual('ty:albumdriftcovers', readAlbumWall);
  return items?.length > 0 && <DriftWall items={items} columns={5} tileWidth={190} tileHeight={128}
    gap={16} speed={34} tilt={14} turn={-12} depth={110} parallax={0.52} dim={0.62} fade={0.48}
    overlayColor="#05030c" className="album-drift-wall" />;
}

const welcomeColors = ['#5227FF', '#FF9FFC', '#B497CF'];

export function mountVisualScenes(mount) {
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const compact = window.matchMedia('(max-width: 768px)').matches;
  const add = (id, scene, effect) => mount(id, <Scene name={scene} decorative>{effect}</Scene>);

  add('welcomeLiquidEtherMount', 'welcome', <LiquidEther colors={welcomeColors} mouseForce={20}
    cursorSize={100} autoDemo autoSpeed={0.34} autoIntensity={1.7} iterationsViscous={16}
    iterationsPoisson={16} BFECC={false} resolution={0.34} className="welcome-liquid-ether" />);
  add('homeFloatingLinesMount', 'discover', <FloatingLines interactive={!coarse} parallax={!coarse}
    lineCount={compact ? 4 : 6} animationSpeed={compact ? 0.55 : 1} maxFps={30} />);
  add('heroElasticMeshMount', 'discover', <HeroMesh />);
  add('heroElectricBorderMount', 'discover', <HeroBorder />);
  add('browsePrismMount', 'search', <Prism animationType="rotate" timeScale={compact ? 0 : 0.22}
    scale={3} hueShift={0.58} colorFrequency={1.25} glow={1.15} noise={0.04} bloom={0.65}
    hoverStrength={0.18} inertia={0.08} transparent suspendWhenOffscreen />);
  if (!coarse && !compact) add('browseSplashCursorMount', 'search', <SplashCursor active />);
  add('browseScrollExpandMount', 'search', <ScrollExpand src="/assets/browse-listener-hero-960.jpg"
    alt="音乐探索" title="发现下一首喜欢的歌" scrollHint="向下滚动探索" startWidth={48} startHeight={64}
    startRadius={26} mediaZoom={1.02} scrollDistance={1.05} holdDistance={0.25} className="browse-scroll-expand" />);
  add('ampGridDistortionMount', 'fullscreen', <FullscreenDistortion />);
  add('libraryGradientWavesMount', 'library', <GradientWaves />);
  add('softAuroraHost', 'aurora', <SoftAurora />);
  add('albumDriftWallMount', 'album-favorites', <AlbumWall />);
  add('coverFlowGridScanMount', 'coverflow', <GridScan sensitivity={0.42} lineThickness={1.05}
    linesColor="#3b3158" scanColor="#c28cff" scanOpacity={0.34} gridScale={0.14} lineJitter={0.04}
    scanDirection="pingpong" enablePost bloomIntensity={0.18} bloomThreshold={0.08} bloomSmoothing={0.28}
    chromaticAberration={0.0008} noiseIntensity={0.006} scanGlow={0.7} scanSoftness={2.2}
    scanPhaseTaper={0.86} scanDuration={3.2} scanDelay={1.8} className="cover-flow-grid-scan" />);
}
