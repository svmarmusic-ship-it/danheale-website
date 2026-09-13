import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Builds three independent ES module "islands" — one per 3D scene —
// referenced directly from the static HTML via
// <script type="module" src="/assets/3d/console.js">. Not a Vite
// multi-page app (no HTML entries): rollupOptions.input points
// straight at the JSX entry files. Shared deps (React/Three/R3F)
// are automatically split into hash-named chunks that the fixed-name
// entry files import internally — the static HTML never needs to
// know those chunk names.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/3d',
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      // Without this, Vite/Rollup treats these .jsx entries as MPA
      // page-scripts and tree-shakes away the exported `mount`
      // function, since nothing *inside* the bundle graph calls it —
      // it's only ever invoked externally via dynamic import() from
      // index.html. 'strict' forces every entry's exports to survive.
      preserveEntrySignatures: 'strict',
      input: {
        console: resolve(__dirname, 'src/entry-console.jsx'),
        monitor: resolve(__dirname, 'src/entry-monitor.jsx'),
        turntable: resolve(__dirname, 'src/entry-turntable.jsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'asset-[name]-[hash][extname]',
      },
    },
  },
});
