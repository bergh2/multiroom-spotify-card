import type { HomeAssistant } from '../types';

/** Start a playlist on a Music Assistant player entity. */
export const playPlaylist = (hass: HomeAssistant, group: string, uri: string) =>
  hass.callService(
    'music_assistant',
    'play_media',
    { media_id: uri, media_type: 'playlist', enqueue: 'replace' },
    { entity_id: group },
  );
