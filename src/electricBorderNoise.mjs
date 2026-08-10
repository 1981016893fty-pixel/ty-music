export function loopNoise(progress, sample) {
  const p = Math.max(0, Math.min(1, progress));
  return sample(p) * (1 - p) + sample(p - 1) * p;
}
