import { loopNoise, createLoopNoiseSampler } from '../src/electricBorderNoise.mjs';
import { roundedRectPerimeter, roundedRectPoint } from '../src/electricBorderGeometry.mjs';

const sample = value => Math.sin(value * 17.31) * 0.8 + Math.cos(value * 5.7) * 0.25;
const start = loopNoise(0, sample);
const end = loopNoise(1, sample);

if (Math.abs(start - end) > 1e-12) {
  throw new Error(`Electric border noise does not close continuously: ${start} !== ${end}`);
}

for (const count of [64, 285, 640]) {
  const sampleNoise = createLoopNoiseSampler(count, 8, 0.12);
  for (const time of [0, 0.03, 1, 12, -3, 0.5]) {
    const noise = sampleNoise(time);
    if (noise.x.length !== count + 1 || noise.y.length !== count + 1 ||
        Math.abs(noise.x[0] - noise.x[count]) > 1e-12 || Math.abs(noise.y[0] - noise.y[count]) > 1e-12) {
      throw new Error(`Cached border noise must preserve sample density and close at time ${time}`);
    }
  }
}

const width = 1200;
const height = 332;
const radius = 24;
const straightWidth = width - 2 * radius;
const straightHeight = height - 2 * radius;
const cornerArc = (Math.PI * radius) / 2;
const leftEdgeMidDistance = straightWidth + cornerArc + straightHeight + cornerArc + straightWidth + cornerArc + straightHeight / 2;
const leftEdgeMid = roundedRectPoint(leftEdgeMidDistance / roundedRectPerimeter(width, height, radius), 0, 0, width, height, radius);

if (Math.abs(leftEdgeMid.x) > 1e-9 || leftEdgeMid.y <= radius || leftEdgeMid.y >= height - radius) {
  throw new Error(`Electric border skipped the left edge: ${JSON.stringify(leftEdgeMid)}`);
}

console.log('Electric border includes all four edges and closes continuously.');
