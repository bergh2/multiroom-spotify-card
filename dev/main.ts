import '../src/multiroom-spotify-card-ma';
import type { MultiroomSpotifyCardMa } from '../src/multiroom-spotify-card-ma';
import type { CardConfig } from '../src/types';
import { createMockHass } from './mock-hass';

const hass = createMockHass();
const stage = document.getElementById('stage')!;

const config: CardConfig = {
  type: 'custom:multiroom-spotify-card-ma',
  group_entity: 'media_player.alla_2',
  speakers: [
    { entity: 'media_player.hk_citation_100_l', name: 'Living Room' },
    { entity: 'media_player.nest_hub', name: 'Kitchen' },
    { entity: 'media_player.g10', name: 'Bedroom' },
    { entity: 'media_player.nest_mini', name: 'Office' },
    'media_player.tv',
  ],
  presets: [
    { name: 'Focus', levels: { 'media_player.nest_mini': 46 } },
    { name: 'Standard', levels: { 'media_player.hk_citation_100_l': 30, 'media_player.nest_hub': 22, 'media_player.g10': 18 } },
    { name: 'Dinner', levels: { 'media_player.hk_citation_100_l': 34, 'media_player.nest_hub': 44 } },
    { name: 'Party', levels: { 'media_player.hk_citation_100_l': 78, 'media_player.nest_hub': 68, 'media_player.nest_mini': 62 } },
  ],
  playlist_layout: 'tiles',
  layout: 'auto',
  speaker_count: 4,
  default_preset: 'Standard',
};

const card = document.createElement('multiroom-spotify-card-ma') as MultiroomSpotifyCardMa;
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
