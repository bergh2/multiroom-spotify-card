// Builds each card as its own self-contained ES module in dist/.
import { build } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const CARDS = [
  { name: 'spotify-media-card', entry: 'src/spotify-media-card.ts' },
  { name: 'spotifyplus-media-card', entry: 'src/spotifyplus-media-card.ts' },
  // combined bundle (both cards) that HACS installs
  { name: 'spotify-media-cards', entry: 'src/spotify-media-cards.ts' },
];

for (const card of CARDS) {
  await build({
    root,
    configFile: false,
    logLevel: 'info',
    build: {
      lib: { entry: resolve(root, card.entry), formats: ['es'], fileName: () => `${card.name}.js` },
      outDir: 'dist',
      emptyOutDir: false,
      minify: 'esbuild',
      sourcemap: false,
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  });
}
