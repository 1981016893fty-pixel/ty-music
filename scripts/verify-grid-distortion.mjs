import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/GridDistortion.jsx', import.meta.url), 'utf8');
const animate = source.match(/const animate = \(\) => \{([\s\S]*?)\n    \};/)?.[1] ?? '';

const checks = [
  [/mouseState\.vX\s*=\s*0/, 'pointer X velocity is consumed once per frame'],
  [/mouseState\.vY\s*=\s*0/, 'pointer Y velocity is consumed once per frame'],
  [/pointerInside/, 'first pointer sample does not inject a jump'],
  [/classList\.contains\('show'\)/, 'hidden fullscreen state resets pointer input'],
  [/MutationObserver/, 'fullscreen transitions reset pointer input'],
  [/visibilitychange/, 'tab visibility resets pointer input']
];

for (const [pattern, description] of checks) {
  if (!(pattern.test(animate) || pattern.test(source))) {
    throw new Error(`GridDistortion regression: missing ${description}`);
  }
}

console.log('Verified GridDistortion pointer reset and fullscreen lifecycle handling.');
