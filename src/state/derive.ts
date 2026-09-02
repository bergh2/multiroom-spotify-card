import type { HomeAssistant, NormalizedConfig, NowPlaying, PresetConfig, Speaker } from '../types';

const UNAVAILABLE = new Set(['unavailable', 'unknown']);

export function deriveSpeakers(hass: HomeAssistant, cfg: NormalizedConfig): Speaker[] {
  const groupPlaying = hass.states[cfg.group_entity]?.state === 'playing';
  return cfg.speakers.map((s) => {
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

/** Cheap change detector so the card only re-renders when something it shows changed. */
export function fingerprint(hass: HomeAssistant, cfg: NormalizedConfig): string {
  const parts: string[] = [hass.themes?.darkMode ? 'd' : 'l'];
  const g = hass.states[cfg.group_entity];
  parts.push(g ? g.last_updated : '-');
  for (const s of cfg.speakers) {
    const st = hass.states[s.entity];
    parts.push(st ? st.last_updated : '-');
  }
  return parts.join('|');
}
