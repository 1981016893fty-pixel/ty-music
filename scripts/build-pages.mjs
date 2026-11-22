import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { cp, readFile, lstat, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'pages-dist');
process.chdir(root);

// Reuse the browser build and its content-addressed lazy chunks.
await import('../build.mjs');
await rm(out, { recursive: true, force: true });
await mkdir(out);

// Publish the download page alongside the web player, never the native shell.
// Never publish the repository root: it also contains private server data.
const publicFiles = [
  'index.html', 'desktop.html', 'library-transfer.html', 'library-transfer.js', 'local-music-db.js', 'player.js', 'gd-embeat-core.js', 'browser-provider.js', 'search-session.js',
  'soft-aurora-react.js', 'soft-aurora-react.css', 'style.css', 'liquid-glass.js',
  'manifest.json', 'service-worker.js', 'icon-192.png', 'icon-512.png', 'icon.svg',
  'mobile.html', 'mobile.css', 'mobile.js',
];
for (const file of [...publicFiles, 'assets', 'vendor']) {
  await cp(path.join(root, file), path.join(out, file), {
    recursive: true,
    filter: async source => {
      if ((await lstat(source)).isSymbolicLink()) throw new Error(`Refusing to publish symlink: ${source}`);
      return true;
    },
  });
}

const commit = process.env.TY_MUSIC_COMMIT || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('TY_MUSIC_COMMIT must be a full Git commit SHA');
const indexPath = path.join(out, 'index.html');
const index = await readFile(indexPath, 'utf8');
if (!index.includes('</head>')) throw new Error('Unable to stamp Pages HTML without a head element');
await writeFile(indexPath, index.replace('</head>', `  <meta name="ty-music-commit" content="${commit}">\n</head>`));
await build({
  entryPoints: ['cloudflare/worker.mjs'],
  bundle: true,
  minify: true,
  platform: 'node',
  format: 'esm',
  target: 'es2022',
  external: ['node:*', 'cloudflare:*'],
  outfile: path.join(out, '_worker.js'),
  // Pages currently injects an incomplete HTTP shim for direct imports.
  // Resolve native modules at runtime; verify-deployment checks real workerd.
  plugins: [{ name: 'node-builtins', setup(build) {
    build.onLoad({ filter: /server-simple\.js$/ }, async ({ path: source }) => {
      let contents = await readFile(source, 'utf8');
      for (const name of ['http', 'https', 'url']) contents = contents.replace(`require('${name}')`, `__ty_${name}`);
      return { contents: "import nativeProcess from 'node:process'; const __ty_http = nativeProcess.getBuiltinModule('node:http'); const __ty_https = nativeProcess.getBuiltinModule('node:https'); const __ty_url = nativeProcess.getBuiltinModule('node:url');\n" + contents, loader: 'js' };
    });
  } }],
  define: {
    'process.env.TY_MUSIC_RUNTIME': JSON.stringify('cloudflare'),
    'process.env.GD_EMBEAT_CONNECT_HOST': JSON.stringify(''),
    'process.env.TY_MUSIC_COMMIT': JSON.stringify(commit),
  },
});

await writeFile(path.join(out, '_routes.json'), JSON.stringify({ version: 1, include: ['/', '/index.html', '/api/*'], exclude: [] }, null, 2) + '\n');

// The Worker handles API requests and chooses the mobile home entry.
// Revalidate unhashed files after deploys;
// immutable caching belongs exclusively to content-addressed browser chunks.
const headerBlocks = ['/', '/mobile', ...publicFiles.map(file => '/' + file), '/assets/aurora/manifest.json']
  .map(url => `${url}\n  Cache-Control: no-cache`);
for (const file of await readdir(path.join(out, 'assets/aurora'))) {
  if (/^[\w-]+-[A-Z0-9]{8}\.js$/.test(file)) {
    headerBlocks.push(`/assets/aurora/${file}\n  Cache-Control: public, max-age=31536000, immutable`);
  }
}
await writeFile(path.join(out, '_headers'), headerBlocks.join('\n\n') + '\n');
console.log('Cloudflare Pages build ready: pages-dist/');
