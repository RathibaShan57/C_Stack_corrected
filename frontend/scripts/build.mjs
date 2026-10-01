import { build } from 'esbuild';
import { mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../index.html', import.meta.url)));
const outdir = join(root, 'dist');
mkdirSync(outdir, { recursive: true });

await build({
  absWorkingDir: root,
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'esm',
  outfile: join(outdir, 'app.js'),
  jsx: 'automatic',
  sourcemap: true,
  minify: true,
  loader: { '.tsx': 'tsx', '.ts': 'ts', '.css': 'css' },
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'info',
});

copyFileSync(join(root, 'index.html'), join(outdir, 'index.html'));
