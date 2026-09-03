// Copies each built card to its own folder under the Home Assistant www directory
// given by HA_WWW_ROOT (read from .env.local or the environment).
// Resource URLs: /local/<card>/<card>.js
import { readFileSync, existsSync, mkdirSync, copyFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CARDS = ['spotify-media-card', 'spotifyplus-media-card'];

function envValue(name) {
  if (process.env[name]) return process.env[name];
  const envFile = join(root, '.env.local');
  if (!existsSync(envFile)) return undefined;
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(new RegExp(`^\\s*${name}\\s*=\\s*(.+?)\\s*$`));
    if (m) return m[1].replace(/^["']|["']$/g, '');
  }
  return undefined;
}

// Backwards compatible: HA_WWW_DIR pointed at .../www/spotify-media-card
let wwwRoot = envValue('HA_WWW_ROOT');
if (!wwwRoot) {
  const legacy = envValue('HA_WWW_DIR');
  if (legacy) wwwRoot = resolve(legacy, '..');
}
if (!wwwRoot) {
  console.error('HA_WWW_ROOT is not set (put HA_WWW_ROOT=<path to config/www> in .env.local)');
  process.exit(1);
}

const only = process.argv[2];
for (const card of CARDS) {
  if (only && card !== only) continue;
  const src = join(root, 'dist', `${card}.js`);
  if (!existsSync(src)) {
    console.error(`Build first: ${src} is missing`);
    process.exit(1);
  }
  const dir = join(wwwRoot, card);
  mkdirSync(dir, { recursive: true });
  const dst = join(dir, `${card}.js`);
  copyFileSync(src, dst);
  console.log(`Deployed ${statSync(dst).size} bytes -> ${dst}  (resource /local/${card}/${card}.js)`);
}
console.log('Bump the ?v= on the dashboard resource after each deploy if the browser caches the old file.');
