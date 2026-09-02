/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { open: '/dev/index.html' },
  build: {
    lib: {
      entry: 'src/spotify-media-card.ts',
      formats: ['es'],
      fileName: () => 'spotify-media-card.js',
    },
    outDir: 'dist',
    emptyOutDir: false,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
