import type { CardConfig, NormalizedConfig } from '../types';
import { DEFAULT_ACCENT, fail, isMediaPlayer, normalizePlaylistView, normalizeSpeakerSection, normalizeText } from '../shared/config-utils';

export { DEFAULT_ACCENT };

const CARD = 'multiroom-spotify-card-ma';

export function normalizeConfig(raw: CardConfig): NormalizedConfig {
  if (!raw || typeof raw !== 'object') fail(CARD, 'invalid configuration');
  if (!isMediaPlayer(raw.group_entity)) {
    fail(CARD, 'group_entity must be the Music Assistant media_player entity of your Cast group');
  }
  return {
    type: raw.type,
    group_entity: raw.group_entity,
    ...normalizeSpeakerSection(CARD, raw),
    ...normalizePlaylistView(CARD, raw),
    title: typeof raw.title === 'string' ? raw.title : 'Listening',
    accent: normalizeText(raw.accent, DEFAULT_ACCENT),
    ma_config_entry_id: typeof raw.ma_config_entry_id === 'string' ? raw.ma_config_entry_id.trim() : '',
  };
}
