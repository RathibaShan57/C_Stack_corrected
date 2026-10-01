import { context } from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../index.html', import.meta.url)));

const ctx = await context({
  absWorkingDir: root,
  entryPoints: ['src/main.tsx'],
  bundle: true,
  format: 'esm',
  outfile: join(root, 'dist', 'app.js'),
  jsx: 'automatic',
  sourcemap: true,
  loader: { '.tsx': 'tsx', '.ts': 'ts', '.css': 'css' },
  define: { 'process.env.NODE_ENV': '"development"' },
  logLevel: 'info',
});

await ctx.watch();
await ctx.serve({
  servedir: root,
  port: 5173,
});
console.warn('esbuild serving http://localhost:5173 (proxies are not built-in; API is :5080)');
