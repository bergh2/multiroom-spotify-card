import type { HomeAssistant, NowPlaying, PresetConfig, Speaker, SpeakerConfig } from './types';

const UNAVAILABLE = new Set(['unavailable', 'unknown']);

/**
 * Live speaker rows from the Google Cast entities. `groupEntity` is the entity
 * whose "playing" state tells us the group is active (used for the not-in-group flag).
 */
export function deriveSpeakers(hass: HomeAssistant, speakers: SpeakerConfig[], groupEntity: string): Speaker[] {
  const groupPlaying = hass.states[groupEntity]?.state === 'playing';
  return speakers.map((s) => {
    const st = hass.states[s.entity];
    const attrs = st?.attributes ?? {};
    const available = !!st && !UNAVAILABLE.has(st.state);
    const hasVolume = typeof attrs.volume_level === 'number';
    const level = hasVolume ? (attrs.volume_level as number) : 0;
    const muted = attrs.is_volume_muted === true;
    const standby = available && !hasVolume;
    const friendly = typeof attrs.friendly_name === 'string' ? attrs.friendly_name : undefined;
    return {
      entity: s.entity,
      name: s.name ?? friendly ?? s.entity.replace('media_player.', ''),
      vol: Math.round(level * 100),
      on: available && !standby && !muted,
      available,
      standby,
      notInGroup: groupPlaying && standby,
    };
  });
}

export function deriveNowPlaying(hass: HomeAssistant, entity: string): NowPlaying {
  const st = hass.states[entity];
  if (!st) {
    return {
      found: false,
      state: 'missing',
      playing: false,
      title: '',
      artist: '',
      art: null,
      duration: null,
      position: null,
      positionUpdatedAt: null,
    };
  }
  const a = st.attributes;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
  return {
    found: true,
    state: st.state,
    playing: st.state === 'playing',
    title: typeof a.media_title === 'string' ? a.media_title : '',
    artist: typeof a.media_artist === 'string' ? a.media_artist : '',
    art: typeof a.entity_picture === 'string' && a.entity_picture ? a.entity_picture : null,
    duration: num(a.media_duration),
    position: num(a.media_position),
    positionUpdatedAt: typeof a.media_position_updated_at === 'string' ? a.media_position_updated_at : null,
  };
}

/**
 * Name of the preset whose levels match the live speaker state, or null.
 * Speakers listed in the preset must be on and within `tolerance` of the level;
 * all other speakers must be off. Unavailable and standby speakers are ignored;
 * if no speaker could be evaluated, no preset is active.
 */
export function activePreset(speakers: Speaker[], presets: PresetConfig[], tolerance: number): string | null {
  const live = speakers.filter((sp) => sp.available && !sp.standby);
  if (!live.length) return null;
  for (const p of presets) {
    let ok = true;
    for (const sp of live) {
      const level = p.levels[sp.entity];
      if (level === undefined) {
        if (sp.on) {
          ok = false;
          break;
        }
      } else if (!sp.on || Math.abs(sp.vol - level) > tolerance) {
        ok = false;
        break;
      }
    }
    if (ok) return p.name;
  }
  return null;
}

/** Master level: average volume of the speakers that are on, or null when none is. */
export function masterVolume(speakers: Speaker[]): number | null {
  const on = speakers.filter((s) => s.on);
  if (!on.length) return null;
  return Math.round(on.reduce((sum, s) => sum + s.vol, 0) / on.length);
}

/**
 * New per-speaker volumes for a master target: every speaker that is on is
 * scaled proportionally so their average becomes `target` while relative
 * differences are kept. Speakers at 0 (or when all are 0) jump to the target.
 */
export function scaleVolumes(speakers: Speaker[], target: number): Map<string, number> {
  const out = new Map<string, number>();
  const on = speakers.filter((s) => s.on);
  if (!on.length) return out;
  const avg = on.reduce((sum, s) => sum + s.vol, 0) / on.length;
  const t = Math.max(0, Math.min(100, target));
  for (const s of on) {
    const v = avg > 0 && s.vol > 0 ? (s.vol * t) / avg : t;
    out.set(s.entity, Math.max(0, Math.min(100, Math.round(v))));
  }
  return out;
}

/** True when the group player is neither playing nor paused, i.e. a fresh start. */
export function isGroupCold(hass: HomeAssistant, entity: string): boolean {
  const st = hass.states[entity];
  if (!st) return true;
  return !['playing', 'paused', 'buffering', 'on'].includes(st.state);
}

export function groupSummary(speakers: Speaker[]): string {
  const on = speakers.filter((s) => s.on);
  if (on.length === 0) {
    const available = speakers.filter((s) => s.available);
    if (!available.length) return 'No speakers available';
    if (available.every((s) => s.standby)) return 'Speakers idle';
    return 'No speakers selected';
  }
  if (on.length === 1) return on[0].name;
  return `${on[0].name} + ${on.length - 1} more`;
}

/** Cheap change detector so a card only re-renders when something it shows changed. */
export function fingerprint(hass: HomeAssistant, entities: string[]): string {
  const parts: string[] = [hass.themes?.darkMode ? 'd' : 'l'];
  for (const id of entities) {
    const st = hass.states[id];
    parts.push(st ? st.last_updated : '-');
  }
  return parts.join('|');
}

export function errorText(e: unknown): string {
  if (e && typeof e === 'object') {
    const o = e as { message?: unknown; error?: { message?: unknown }; body?: { message?: unknown } };
    if (typeof o.message === 'string') return o.message;
    if (o.error && typeof o.error.message === 'string') return o.error.message;
    if (o.body && typeof o.body.message === 'string') return o.body.message;
  }
  return String(e);
}
