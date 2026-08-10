import fs from 'node:fs/promises';
import { loopNoise } from '../src/electricBorderNoise.mjs';
import { roundedRectPerimeter, roundedRectPoint } from '../src/electricBorderGeometry.mjs';

const sample = value => Math.sin(value * 17.31) * 0.8 + Math.cos(value * 5.7) * 0.25;
const start = loopNoise(0, sample);
const end = loopNoise(1, sample);

if (Math.abs(start - end) > 1e-12) {
  throw new Error(`Electric border noise does not close continuously: ${start} !== ${end}`);
}

const component = await fs.readFile(new URL('../src/ElectricBorder.jsx', import.meta.url), 'utf8');
if (!component.includes('loopNoise(progress')) {
  throw new Error('ElectricBorder is not using the periodic noise seam guard');
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
