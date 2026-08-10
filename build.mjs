import { build } from 'esbuild';

await build({
  entryPoints: ['src/mount.jsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  outfile: 'soft-aurora-react.js',
  loader: { '.css': 'empty' },
  jsx: 'automatic',
  target: ['es2020']
});

await build({
  entryPoints: ['src/components.css'],
  bundle: true,
  minify: true,
  outfile: 'soft-aurora-react.css'
});
