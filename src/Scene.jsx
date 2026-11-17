import { Suspense, useSyncExternalStore } from 'react';
import { createSceneStore, sceneActive } from './sceneStore.mjs';

const scenes = createSceneStore(document, window.matchMedia('(prefers-reduced-motion: reduce)'));

// Unmounting releases each effect's frame loop, observers and GPU context.
export default function Scene({ name, decorative = false, children }) {
  const snapshot = useSyncExternalStore(scenes.subscribe, scenes.snapshot);
  return sceneActive(name, snapshot, decorative) ? <Suspense fallback={null}>{children}</Suspense> : null;
}
