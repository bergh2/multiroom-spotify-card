// Copies dist/spotify-media-card.js to the Home Assistant www folder given by HA_WWW_DIR
// (read from .env.local or the environment). Resource URL: /local/spotify-media-card/spotify-media-card.js
import { readFileSync, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let target = process.env.HA_WWW_DIR;
const envFile = join(root, '.env.local');
if (!target && existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*HA_WWW_DIR\s*=\s*(.+?)\s*$/);
    if (m) target = m[1].replace(/^["']|["']$/g, '');
  }
}
if (!target) {
  console.error('HA_WWW_DIR is not set (put HA_WWW_DIR=<path to config/www/spotify-media-card> in .env.local)');
  process.exit(1);
}
const src = join(root, 'dist', 'spotify-media-card.js');
if (!existsSync(src)) { console.error('Build first: dist/spotify-media-card.js is missing'); process.exit(1); }
mkdirSync(target, { recursive: true });
const dst = join(target, 'spotify-media-card.js');
copyFileSync(src, dst);
console.log(`Deployed ${statSync(dst).size} bytes -> ${dst}`);
console.log('Dashboard resource: /local/spotify-media-card/spotify-media-card.js (bump ?v= after each deploy if cached)');
