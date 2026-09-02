import type { HassEntity, HomeAssistant } from '../src/types';

export interface MockHass extends HomeAssistant {
  /** Called with a fresh hass object whenever a state changes (mirrors HA replacing `hass`). */
  onChange: (cb: (h: MockHass) => void) => void;
  setDark: (dark: boolean) => void;
  failLibrary: boolean;
  setPlaying: (playing: boolean) => void;
  log: (line: string) => void;
}

const GROUP = 'media_player.alla_2';
const SPEAKERS: Array<[string, string, number, boolean]> = [
  ['media_player.hk_citation_100_l', 'Vardagsrum', 0.42, false],
  ['media_player.nest_hub', 'Kök', 0.28, false],
  ['media_player.g10', 'Sovrum', 0.15, true],
  ['media_player.nest_mini', 'Barnrum', 0.55, false],
  ['media_player.tv', 'TV Vardagsrum', 0.3, true],
];

const NAMES = [
  'Morning Coffee',
  'Deep Focus',
  'Late Drive',
  'Kitchen Disco',
  'Sunday Slow',
  'Discover Weekly',
  'Release Radar',
  'Dinner Jazz',
  'Running Hard',
  'Ambient Sleep',
  'Road Trip',
  'Piano Rain',
];

function svgArt(i: number): string {
  const h1 = (i * 47) % 360;
  const h2 = (h1 + 60) % 360;
  const s = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h1} 60% 45%)'/><stop offset='1' stop-color='hsl(${h2} 70% 30%)'/></linearGradient></defs><rect width='100' height='100' fill='url(#g)'/><circle cx='${30 + (i * 13) % 40}' cy='${40 + (i * 7) % 30}' r='22' fill='rgba(255,255,255,0.18)'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;
}

export function createMockHass(): MockHass {
  const now = () => new Date().toISOString();
  const states: Record<string, HassEntity> = {};
  const set = (id: string, state: string, attributes: Record<string, unknown>) => {
    const prev = states[id];
    states[id] = {
      entity_id: id,
      state,
      attributes: { ...(prev?.attributes ?? {}), ...attributes },
      last_changed: now(),
      last_updated: now(),
    };
  };
  for (const [id, name, vol, muted] of SPEAKERS) {
    set(id, 'playing', { friendly_name: name, volume_level: vol, is_volume_muted: muted });
  }
  set(GROUP, 'playing', {
    friendly_name: 'Alla',
    media_title: 'Weightless',
    media_artist: 'Marconi Union',
    media_duration: 214,
    media_position: 74,
    media_position_updated_at: now(),
    entity_picture: svgArt(99),
    mass_player_id: 'alla',
    mass_player_type: 'group',
  });

  let dark = true;
  let hass: MockHass | undefined;
  const listeners: Array<(h: MockHass) => void> = [];
  const logEl = document.getElementById('log');
  const log = (line: string) => {
    const t = new Date().toLocaleTimeString();
    if (logEl) logEl.textContent = `${t}  ${line}\n${logEl.textContent ?? ''}`.slice(0, 20000);
  };

  const build = (): MockHass => {
    const h: MockHass = {
      states: { ...states },
      themes: { darkMode: dark },
      failLibrary: hass?.failLibrary ?? false,
      log,
      onChange: (cb) => listeners.push(cb),
      setDark: (d) => {
        dark = d;
        emit();
      },
      setPlaying: (playing) => {
        const g = states[GROUP];
        set(GROUP, playing ? 'playing' : 'paused', {
          media_position: playing ? g.attributes.media_position : 74,
          media_position_updated_at: now(),
        });
        emit();
      },
      async callService(domain, service, data, target, _notify, returnResponse) {
        const ids = target?.entity_id ? ([] as string[]).concat(target.entity_id) : [];
        log(`${domain}.${service} ${JSON.stringify(data ?? {})} -> ${ids.join(', ') || '(no target)'}`);
        await new Promise((r) => setTimeout(r, 120));
        if (domain === 'music_assistant' && service === 'get_library') {
          if (hass?.failLibrary) throw new Error('Music Assistant is not reachable');
          const limit = Number(data?.limit ?? 6);
          const desc = String(data?.order_by).startsWith('play_count');
          const order = desc ? [...NAMES].reverse() : NAMES;
          const items = order.slice(0, limit).map((name, i) => ({
            media_type: 'playlist',
            uri: `spotify://playlist/${name.toLowerCase().replace(/\s+/g, '-')}`,
            name,
            image: i % 4 === 3 ? null : svgArt(i + (desc ? 20 : 0)),
          }));
          return returnResponse ? { context: {}, response: { items, limit, offset: 0, order_by: data?.order_by, media_type: 'playlist' } } : undefined;
        }
        if (domain === 'music_assistant' && service === 'play_media') {
          const name = String(data?.media_id).split('/').pop()?.replace(/-/g, ' ') ?? '';
          set(GROUP, 'playing', {
            media_title: `First track of ${name}`,
            media_artist: 'Some Artist',
            media_position: 0,
            media_position_updated_at: now(),
            entity_picture: svgArt(name.length),
          });
        }
        if (domain === 'media_player') {
          for (const id of ids) {
            const st = states[id];
            if (!st) continue;
            if (service === 'volume_set') set(id, st.state, { volume_level: data?.volume_level });
            if (service === 'volume_mute') set(id, st.state, { is_volume_muted: data?.is_volume_muted });
            if (service === 'media_play_pause') {
              const playing = st.state === 'playing';
              set(id, playing ? 'paused' : 'playing', { media_position: playing ? 74 : st.attributes.media_position, media_position_updated_at: now() });
            }
            if (service === 'media_seek') set(id, st.state, { media_position: data?.seek_position, media_position_updated_at: now() });
            if (service === 'media_next_track' || service === 'media_previous_track') {
              set(id, st.state, { media_title: service.includes('next') ? 'Next Song' : 'Previous Song', media_position: 0, media_position_updated_at: now() });
            }
          }
        }
        emit();
        return undefined;
      },
      async callWS<T>(msg: Record<string, unknown>): Promise<T> {
        log(`ws ${JSON.stringify(msg)}`);
        if (msg.type === 'config_entries/get') {
          return [{ entry_id: '01M0ESA7FG5614S4DEYHG8Y15E', domain: 'music_assistant', state: 'loaded', title: 'Music Assistant' }] as T;
        }
        return [] as T;
      },
    };
    return h;
  };

  hass = build();
  const emit = () => {
    const fail = hass?.failLibrary ?? false;
    hass = build();
    hass.failLibrary = fail;
    for (const cb of listeners) cb(hass);
  };
  // expose latest object through a stable proxy so the dev page can toggle flags
  const proxy = new Proxy({} as MockHass, {
    get: (_t, key) => (hass as unknown as Record<string | symbol, unknown>)[key],
    set: (_t, key, value) => {
      (hass as unknown as Record<string | symbol, unknown>)[key] = value;
      return true;
    },
  });
  return proxy;
}
