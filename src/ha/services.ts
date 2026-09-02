import type { HomeAssistant, PresetConfig, Speaker } from '../types';

const mp = (hass: HomeAssistant, service: string, entity: string | string[], data?: Record<string, unknown>) =>
  hass.callService('media_player', service, data, { entity_id: entity });

export const playPlaylist = (hass: HomeAssistant, group: string, uri: string) =>
  hass.callService(
    'music_assistant',
    'play_media',
    { media_id: uri, media_type: 'playlist', enqueue: 'replace' },
    { entity_id: group },
  );

export const playPause = (hass: HomeAssistant, group: string) => mp(hass, 'media_play_pause', group);
export const nextTrack = (hass: HomeAssistant, group: string) => mp(hass, 'media_next_track', group);
export const prevTrack = (hass: HomeAssistant, group: string) => mp(hass, 'media_previous_track', group);
export const seek = (hass: HomeAssistant, group: string, seconds: number) =>
  mp(hass, 'media_seek', group, { seek_position: Math.max(0, Math.round(seconds)) });

export const setVolume = (hass: HomeAssistant, entity: string, vol: number) =>
  mp(hass, 'volume_set', entity, { volume_level: Math.max(0, Math.min(100, vol)) / 100 });

export const setMute = (hass: HomeAssistant, entities: string | string[], muted: boolean) =>
  mp(hass, 'volume_mute', entities, { is_volume_muted: muted });

/** Unmute + set the volume for speakers listed in the preset, mute every other configured speaker. */
export async function applyPreset(hass: HomeAssistant, speakers: Speaker[], preset: PresetConfig): Promise<void> {
  const calls: Promise<unknown>[] = [];
  const toMute: string[] = [];
  for (const sp of speakers) {
    if (!sp.available) continue;
    const level = preset.levels[sp.entity];
    if (level === undefined) {
      if (sp.on) toMute.push(sp.entity);
      continue;
    }
    if (!sp.on) calls.push(setMute(hass, sp.entity, false));
    calls.push(setVolume(hass, sp.entity, level));
  }
  if (toMute.length) calls.push(setMute(hass, toMute, true));
  await Promise.all(calls);
}
