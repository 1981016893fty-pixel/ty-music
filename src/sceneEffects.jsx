import { Component, Suspense, lazy, useMemo } from 'react';

class EffectBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { console.warn('Optional visual effect unavailable:', error); }
  render() { return this.state.failed ? null : this.props.children; }
}

// A failed optional chunk cannot remove functional siblings. A fresh lazy
// instance on scene re-entry permits retry after a transient loading failure.
function sceneEffect(load) {
  return function Effect(props) {
    const LazyEffect = useMemo(() => lazy(load), []);
    // Commit the wrapper while its child loads. An outer-only Suspense would
    // discard this memo on initial suspension and continually create new lazies.
    return <EffectBoundary><Suspense fallback={null}><LazyEffect {...props} /></Suspense></EffectBoundary>;
  };
}

// Scene mounts these only when visible; unopened scenes do not fetch GPU engines.
export const SoftAurora = sceneEffect(() => import('./SoftAurora'));
export const ElasticMesh = sceneEffect(() => import('./ElasticMesh'));
export const GridDistortion = sceneEffect(() => import('./GridDistortion'));
export const Prism = sceneEffect(() => import('./Prism'));
export const FloatingLines = sceneEffect(() => import('./FloatingLines'));
export const ElectricBorder = sceneEffect(() => import('./ElectricBorder'));
export const GradientWaves = sceneEffect(() => import('./GradientWaves'));
export const DriftWall = sceneEffect(() => import('./DriftWall'));
export const LiquidEther = sceneEffect(() => import('./LiquidEther'));
export const GridScan = sceneEffect(() => import('./GridScan').then(module => ({ default: module.GridScan })));
export const SplashCursor = sceneEffect(() => import('./SplashCursor'));
export const ScrollExpand = sceneEffect(() => import('./ScrollExpand'));
