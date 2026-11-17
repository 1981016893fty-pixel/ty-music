import { build } from 'esbuild';
import { mkdir, readdir, unlink, writeFile } from 'node:fs/promises';

// Only this generated namespace is replaced; artwork and source assets stay intact.
await mkdir('assets/aurora', { recursive: true });
for (const name of await readdir('assets/aurora')) {
  if (/^[\w-]+\.js$/.test(name)) await unlink(`assets/aurora/${name}`);
}

export const browserBuild = await build({
  entryPoints: { 'soft-aurora-react': 'src/mount.jsx' },
  bundle: true,
  metafile: true,
  minify: true,
  format: 'esm',
  splitting: true,
  outdir: '.',
  chunkNames: 'assets/aurora/[name]-[hash]',
  loader: { '.css': 'empty' },
  jsx: 'automatic',
  target: ['es2020']
});

const initialFiles = new Set();
function collectInitial(name) {
  if (initialFiles.has(name)) return;
  initialFiles.add(name);
  for (const dependency of browserBuild.metafile.outputs[name].imports) {
    if (dependency.kind === 'import-statement' && !dependency.external) collectInitial(dependency.path);
  }
}
collectInitial('soft-aurora-react.js');
await writeFile('assets/aurora/manifest.json', JSON.stringify([...initialFiles].map(name => '/' + name)) + '\n');

await build({
  entryPoints: ['src/components.css'],
  bundle: true,
  minify: true,
  outfile: 'soft-aurora-react.css'
});
