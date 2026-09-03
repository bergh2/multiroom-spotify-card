import type { HomeAssistant, PresetConfig, Speaker } from './types';

/** Plain `media_player.*` calls, valid for any media_player entity (Cast, MA, SpotifyPlus). */
const mp = (hass: HomeAssistant, service: string, entity: string | string[], data?: Record<string, unknown>) =>
  hass.callService('media_player', service, data, { entity_id: entity });

export const playPause = (hass: HomeAssistant, entity: string) => mp(hass, 'media_play_pause', entity);
export const nextTrack = (hass: HomeAssistant, entity: string) => mp(hass, 'media_next_track', entity);
export const prevTrack = (hass: HomeAssistant, entity: string) => mp(hass, 'media_previous_track', entity);
export const seek = (hass: HomeAssistant, entity: string, seconds: number) =>
  mp(hass, 'media_seek', entity, { seek_position: Math.max(0, Math.round(seconds)) });

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
      // idle Cast speakers report no mute state, so mute them explicitly too
      if (sp.on || sp.standby) toMute.push(sp.entity);
      continue;
    }
    if (!sp.on) calls.push(setMute(hass, sp.entity, false));
    calls.push(setVolume(hass, sp.entity, level));
  }
  if (toMute.length) calls.push(setMute(hass, toMute, true));
  await Promise.all(calls);
}
