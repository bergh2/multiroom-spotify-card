import '../src/spotifyplus-media-card';
import type { SpotifyPlusMediaCard } from '../src/spotifyplus-media-card';
import type { SpCardConfig } from '../src/spotifyplus/config';
import { createMockHass } from './mock-hass';

const hass = createMockHass({ backend: 'spotifyplus' });
const stage = document.getElementById('stage')!;

const config: SpCardConfig = {
  type: 'custom:spotifyplus-media-card',
  spotifyplus_entity: 'media_player.spotifyplus',
  cast_group_entity: 'media_player.alla',
  device_name: 'Alla',
  speakers: [
    { entity: 'media_player.hk_citation_100_l', name: 'Living L' },
    { entity: 'media_player.nest_hub', name: 'Kök' },
    { entity: 'media_player.g10', name: 'Sovrum' },
    { entity: 'media_player.nest_mini', name: 'Barnrum' },
  ],
  presets: [
    { name: 'Focus', levels: { 'media_player.hk_citation_100_l': 35 } },
    { name: 'Standard', levels: { 'media_player.hk_citation_100_l': 30, 'media_player.nest_hub': 22, 'media_player.g10': 18 } },
    { name: 'Dinner', levels: { 'media_player.hk_citation_100_l': 34, 'media_player.nest_hub': 44 } },
    { name: 'Party', levels: { 'media_player.hk_citation_100_l': 78, 'media_player.nest_hub': 68, 'media_player.nest_mini': 62 } },
  ],
  default_preset: 'Standard',
  playlist_layout: 'tiles',
};

const card = document.createElement('spotifyplus-media-card') as SpotifyPlusMediaCard;
card.setConfig(config);
card.hass = hass;
stage.appendChild(card);
hass.onChange((h) => (card.hass = h));

const btn = (id: string) => document.getElementById(id) as HTMLButtonElement;
let dark = true;
let layout: 'tiles' | 'list' = 'tiles';
let sort: 'last_played' | 'play_count' = 'last_played';
const reconfig = () => card.setConfig({ ...config, playlist_layout: layout, playlist_sort: sort, playlist_count: layout === 'list' ? 10 : 6 });

btn('theme').onclick = () => {
  dark = !dark;
  document.body.classList.toggle('light', !dark);
  hass.setDark(dark);
  btn('theme').textContent = `Theme: ${dark ? 'dark' : 'light'}`;
};
btn('layout').onclick = () => {
  layout = layout === 'tiles' ? 'list' : 'tiles';
  btn('layout').textContent = `Layout: ${layout}`;
  reconfig();
};
btn('sort').onclick = () => {
  sort = sort === 'last_played' ? 'play_count' : 'last_played';
  btn('sort').textContent = `Sort: ${sort}`;
  reconfig();
};
btn('stop').onclick = () => hass.stopGroup();
btn('slow').onclick = () => {
  hass.castStartDelayMs = hass.castStartDelayMs === 8000 ? 70000 : 8000;
  btn('slow').textContent = `Cast start: ${hass.castStartDelayMs / 1000} s`;
};
btn('clear').onclick = () => {
  document.getElementById('log')!.textContent = '';
};
