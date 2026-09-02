import '../src/spotify-media-card';
import type { SpotifyMediaCard } from '../src/spotify-media-card';
import type { CardConfig } from '../src/types';
import { createMockHass } from './mock-hass';

const hass = createMockHass();
const stage = document.getElementById('stage')!;

const config: CardConfig = {
  type: 'custom:spotify-media-card',
  group_entity: 'media_player.alla_2',
  speakers: [
    { entity: 'media_player.hk_citation_100_6794f9_2', name: 'Living Room' },
    { entity: 'media_player.nesthubdacf', name: 'Kitchen' },
    { entity: 'media_player.g10_4691', name: 'Bedroom' },
    { entity: 'media_player.badrum', name: 'Office' },
    'media_player.tv',
  ],
  presets: [
    { name: 'Focus', levels: { 'media_player.badrum': 46 } },
    { name: 'Chill', levels: { 'media_player.hk_citation_100_6794f9_2': 30, 'media_player.nesthubdacf': 22, 'media_player.g10_4691': 18 } },
    { name: 'Dinner', levels: { 'media_player.hk_citation_100_6794f9_2': 34, 'media_player.nesthubdacf': 44 } },
    { name: 'Party', levels: { 'media_player.hk_citation_100_6794f9_2': 78, 'media_player.nesthubdacf': 68, 'media_player.badrum': 62 } },
  ],
  playlist_layout: 'tiles',
  speaker_count: 4,
};

const card = document.createElement('spotify-media-card') as SpotifyMediaCard;
card.setConfig(config);
card.hass = hass;
stage.appendChild(card);
hass.onChange((h) => (card.hass = h));

let dark = true;
let layout: 'tiles' | 'list' = 'tiles';
const btn = (id: string) => document.getElementById(id) as HTMLButtonElement;

btn('theme').onclick = () => {
  dark = !dark;
  document.body.classList.toggle('light', !dark);
  hass.setDark(dark);
  btn('theme').textContent = `Theme: ${dark ? 'dark' : 'light'}`;
};
btn('layout').onclick = () => {
  layout = layout === 'tiles' ? 'list' : 'tiles';
  card.setConfig({ ...config, playlist_layout: layout, playlist_count: layout === 'list' ? 10 : 6 });
  btn('layout').textContent = `Layout: ${layout}`;
};
let playing = true;
btn('playing').onclick = () => {
  playing = !playing;
  hass.setPlaying(playing);
};
btn('kill').onclick = () => {
  hass.failLibrary = !hass.failLibrary;
  btn('kill').textContent = `Playlists: ${hass.failLibrary ? 'ok' : 'error'}`;
  card.setConfig({ ...config, playlist_layout: layout, playlist_count: layout === 'list' ? 10 : 6, ma_config_entry_id: hass.failLibrary ? 'x' : '' });
};
btn('clear').onclick = () => {
  document.getElementById('log')!.textContent = '';
};
