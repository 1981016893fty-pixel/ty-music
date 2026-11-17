export function loopNoise(progress, sample) {
  const p = Math.max(0, Math.min(1, progress));
  return sample(p) * (1 - p) + sample(p - 1) * p;
}

// Spatial lattice coordinates never change between resizes. Only the two
// neighbouring time rows change; keep those rows instead of recomputing the
// same floors, smoothsteps and random lookups for every point on every frame.
export function createLoopNoiseSampler(sampleCount, noiseSpan, amplitude) {
  const randomCache = new Map();
  const random = value => {
    if (!randomCache.has(value)) {
      if (randomCache.size >= 8192) randomCache.clear();
      randomCache.set(value, (Math.sin(value * 12.9898) * 43758.5453) % 1);
    }
    return randomCache.get(value);
  };
  const createTrack = (seed, shift) => {
    let frequency = 10;
    let strength = amplitude;
    const octaves = Array.from({ length: 5 }, (_, octave) => {
      const indices = new Int32Array(sampleCount + 1);
      const weights = new Float64Array(sampleCount + 1);
      for (let i = 0; i <= sampleCount; i++) {
        const x = frequency * ((i / sampleCount + shift) * noiseSpan) + seed * 100;
        indices[i] = Math.floor(x);
        const f = x - indices[i];
        weights[i] = f * f * (3 - 2 * f);
      }
      const layer = { frequency, strength: octave === 0 ? 0 : strength, indices, weights,
        row: NaN, blend: 0, lower: new Float64Array(sampleCount + 1), upper: new Float64Array(sampleCount + 1) };
      frequency *= 1.6;
      strength *= 0.7;
      return layer;
    }).filter(layer => layer.strength !== 0);
    const fillRow = (layer, target, row) => {
      for (let i = 0; i <= sampleCount; i++) {
        const lattice = layer.indices[i] + row * 57;
        target[i] = random(lattice) * (1 - layer.weights[i]) + random(lattice + 1) * layer.weights[i];
      }
    };
    return {
      update(time) {
        for (const layer of octaves) {
          const y = time * layer.frequency * 0.3;
          const row = Math.floor(y);
          if (row !== layer.row) {
            if (row === layer.row + 1) {
              [layer.lower, layer.upper] = [layer.upper, layer.lower];
            } else fillRow(layer, layer.lower, row);
            fillRow(layer, layer.upper, row + 1);
            layer.row = row;
          }
          const f = y - row;
          layer.blend = f * f * (3 - 2 * f);
        }
      },
      at(i) {
        let value = 0;
        for (const layer of octaves) value += layer.strength *
          (layer.lower[i] * (1 - layer.blend) + layer.upper[i] * layer.blend);
        return value;
      }
    };
  };
  const tracks = [createTrack(0, 0), createTrack(0, -1), createTrack(1, 0), createTrack(1, -1)];
  const result = { x: new Float64Array(sampleCount + 1), y: new Float64Array(sampleCount + 1) };
  return time => {
    for (const track of tracks) track.update(time);
    for (let i = 0; i <= sampleCount; i++) {
      const p = i / sampleCount;
      result.x[i] = tracks[0].at(i) * (1 - p) + tracks[1].at(i) * p;
      result.y[i] = tracks[2].at(i) * (1 - p) + tracks[3].at(i) * p;
    }
    return result;
  };
}
