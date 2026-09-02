# Spotify Media Card

A Home Assistant dashboard card for starting Spotify playlists on multi-room
Chromecast speakers through [Music Assistant](https://www.music-assistant.io/).

- Recently played (or most played) playlists as tiles or a compact list, one tap to play.
- One row per speaker with its own volume slider and on/off toggle.
- Mood presets (Focus, Chill, Dinner, Party…) that set volumes and mute the rooms not needed.
- Compact now-playing bar with transport and seek.
- Dark and light appearance, following the Home Assistant theme.

## How multi-room works

Chromecast has no API for dynamic grouping, so synchronized playback uses a
speaker group created in the Google Home app. The card always plays to the
Music Assistant `media_player` entity for that group (`group_entity`). Speaker
rows and presets only mute/unmute and set the volume of each speaker's own
Google Cast entity, so "off" means "muted in the group".

## Requirements

- Home Assistant 2023.7 or newer (2026.x recommended).
- Music Assistant server + the `music_assistant` integration, with Spotify configured as a provider.
- Google Cast integration for the individual speakers.
- A Google Home speaker group containing all speakers you want to control.

## Installation

### HACS

Add this repository as a custom repository of type *Dashboard*, install, and
reload the browser. HACS registers the resource automatically.

### Manual

Copy `dist/spotify-media-card.js` to `config/www/spotify-media-card/` and add
`/local/spotify-media-card/spotify-media-card.js` as a *JavaScript module*
resource under Settings → Dashboards → Resources.

## Configuration

```yaml
type: custom:spotify-media-card
group_entity: media_player.alla_2            # MA entity of the Google Home group (required)
speakers:                                    # Google Cast entities (required)
  - entity: media_player.hk_citation_100_6794f9_2
    name: Vardagsrum
  - entity: media_player.nesthubdacf
    name: Kök
  - entity: media_player.g10_4691
    name: Sovrum
  - entity: media_player.badrum
    name: Barnrum
presets:                                     # optional; speakers not listed are muted
  - name: Focus
    levels: { media_player.g10_4691: 46 }
  - name: Chill
    levels: { media_player.hk_citation_100_6794f9_2: 30, media_player.nesthubdacf: 22, media_player.g10_4691: 18 }
  - name: Dinner
    levels: { media_player.hk_citation_100_6794f9_2: 34, media_player.nesthubdacf: 44 }
  - name: Party
    levels: { media_player.hk_citation_100_6794f9_2: 78, media_player.nesthubdacf: 68, media_player.badrum: 62 }
playlist_layout: tiles        # tiles | list
playlist_sort: last_played    # last_played | play_count
playlist_count: 6             # 1..50 (default 6 for tiles, 10 for list)
tile_columns: 3               # 2..6
speaker_count: 4              # rows shown; the speaker picker always lists all
title: Listening
accent: "oklch(0.62 0.16 285)"
preset_tolerance: 3           # volume points within which a preset counts as active
ma_config_entry_id: ""        # optional; auto-discovered when empty
```

| Option | Description |
|---|---|
| `group_entity` | Music Assistant player for the Cast group. Playback, transport and now-playing use this entity. |
| `speakers` | Google Cast entities, as strings or `{entity, name}`. Order is the display order. |
| `presets` | List of `{name, levels}`. `levels` maps entity → volume 0–100; omitted speakers are muted. |
| `playlist_layout` | `tiles` (grid) or `list` (dense rows). |
| `playlist_sort` | `last_played` or `play_count`, as tracked by Music Assistant. |
| `playlist_count` | Number of playlists fetched and shown. |
| `tile_columns` | Grid columns in tile layout. |
| `speaker_count` | Number of speaker rows shown in the card. |
| `preset_tolerance` | The active preset is derived from live speaker state; this is the allowed volume difference. |

Note: Music Assistant only tracks plays that go through Music Assistant, so
playlists played directly from the Spotify app do not affect the order.

## Development

```bash
npm install
npm run dev        # standalone preview with a mock hass at http://localhost:5173/dev/index.html
npm test           # unit tests
npm run build      # dist/spotify-media-card.js
npm run deploy     # build + copy to HA_WWW_DIR (set in .env.local)
```

Put `HA_WWW_DIR=<path to config/www/spotify-media-card>` in `.env.local` for `npm run deploy`.
