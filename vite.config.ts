/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: { open: '/dev/index.html' },
  build: {
    lib: {
      entry: 'src/multiroom-spotify-card-ma.ts',
      formats: ['es'],
      fileName: () => 'multiroom-spotify-card-ma.js',
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
