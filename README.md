# Spotify Media Cards for Home Assistant

Two Home Assistant dashboard cards with the same Apple-style design for
starting Spotify playlists on multi-room Chromecast speakers:

| Card | Starts music through | Best for |
|---|---|---|
| `spotifyplus-media-card` | [SpotifyPlus](https://github.com/thlucas1/homeassistantcomponent_spotifyplus): launches Spotify's own Cast receiver on the speaker group, so it is a real Spotify Connect session | You want to keep controlling the music from the Spotify app afterwards |
| `spotify-media-card` | [Music Assistant](https://www.music-assistant.io/): MA streams the audio itself | You already run Music Assistant and don't need Spotify Connect |

Both cards share:

- Recently played (or most played) playlists as tiles or a compact list, one tap to play.
- One row per speaker with its own volume slider and on/off toggle, plus a master "All" row.
- Mood presets (Focus, Standard, Dinner, Party…) that set volumes and mute the rooms not needed, and an optional default preset applied on a fresh start.
- Compact now-playing bar with transport and seek.
- Dark and light appearance, following the Home Assistant theme.

## How multi-room works

Chromecast has no API for dynamic grouping, so synchronized playback uses a
speaker group created in the Google Home app. The cards always play to that
group. Speaker rows and presets only mute/unmute and set the volume of each
speaker's own Google Cast entity, so "off" means "muted in the group".

## Requirements

- Home Assistant 2023.7 or newer (2026.x recommended).
- Google Cast integration for the individual speakers and the group.
- A Google Home speaker group containing all speakers you want to control.
- For `spotifyplus-media-card`: SpotifyPlus v1.0.86 or newer with the
  [Spotify Desktop Player token](https://github.com/thlucas1/homeassistantcomponent_spotifyplus/wiki/Device-Configuration-Options)
  configured (needed to wake idle Chromecasts). A helper venv and notes live in `tools/spotifyplus-auth`.
- For `spotify-media-card`: Music Assistant server + the `music_assistant` integration with Spotify as a provider.

## Installation

Copy the card file(s) from `dist/` to `config/www/<card>/<card>.js` and add
`/local/<card>/<card>.js` as a *JavaScript module* resource under
Settings → Dashboards → Resources. `npm run deploy` does the copy for you
(set `HA_WWW_ROOT=<path to config/www>` in `.env.local`).

## `spotifyplus-media-card`

```yaml
type: custom:spotifyplus-media-card
spotifyplus_entity: media_player.spotifyplus   # SpotifyPlus player (default)
cast_group_entity: media_player.alla           # Google Cast entity of the speaker group
device_name: Alla                              # Spotify Connect name the playlist is started on
control_via: cast                              # cast (no API calls) | spotifyplus
shuffle: false
speakers:
  - entity: media_player.hk_citation_100_l
    name: Living L
  - entity: media_player.nest_hub
    name: Kök
presets:
  - name: Standard
    levels: { media_player.hk_citation_100_l: 30, media_player.nest_hub: 22 }
default_preset: Standard
master_volume: true
playlist_layout: tiles        # tiles | list
playlist_sort: last_played    # last_played | play_count
playlist_count: 6
history_key: spotifyplus-media-card
fill_with_favorites: true     # top up the grid with your own playlists until playlist_count
title: Listening
```

How it works:

- **Start**: `spotifyplus.player_media_play_context` on `device_name`. The now-playing
  bar shows "Starting on …" with a spinner until the Cast group reports the Spotify
  app playing (typically 10 to 30 s), with a 60 s timeout.
- **Now playing and transport** come from the Cast group entity by default, which
  costs no Spotify API calls and stays in sync with the Spotify app. Set
  `control_via: spotifyplus` to use the SpotifyPlus entity instead.
- **Playlists**: the card reads Spotify's "recently played" tracks (from every app,
  not only this card) and folds them into a play history stored in Home
  Assistant user data under `history_key`. "Last played" and "most played" are
  both derived from that history, so "most played" keeps improving over time.
  Names and artwork come from your followed playlists, cached for an hour.
  Spotify only reports the last 50 tracks, so a fresh history may contain few
  playlists; with `fill_with_favorites` (default on) the remaining slots show
  your own playlists in Spotify's order until real plays take their place.
- Refreshes: on load, a minute after a start, and every 10 minutes while
  visible. Roughly 10 to 30 API calls per day.

## `spotify-media-card` (Music Assistant)

```yaml
type: custom:spotify-media-card
group_entity: media_player.alla_2            # MA entity of the Google Home group (required)
speakers:                                    # Google Cast entities (required)
  - entity: media_player.hk_citation_100_l
    name: Living L
  - entity: media_player.nest_hub
    name: Kök
presets:
  - name: Standard
    levels: { media_player.hk_citation_100_l: 30, media_player.nest_hub: 22 }
default_preset: Standard
master_volume: true
playlist_layout: tiles
playlist_sort: last_played
playlist_count: 6
tile_columns: 3
speaker_count: 4
title: Listening
accent: "oklch(0.62 0.16 285)"
preset_tolerance: 3
ma_config_entry_id: ""        # optional; auto-discovered when empty
```

Playlists come from `music_assistant.get_library` sorted by last played or
play count as tracked by Music Assistant (only plays through MA count).

## Shared options

| Option | Description |
|---|---|
| `speakers` | Google Cast entities, as strings or `{entity, name}`. Order is the display order. |
| `presets` | List of `{name, levels}`. `levels` maps entity → volume 0–100; omitted speakers are muted. |
| `default_preset` | Preset applied automatically when a playlist is started while the group is cold (not playing or paused) and no speaker has been touched since it went idle. Pause/resume and preset taps are never overridden. |
| `master_volume` | Shows an "All" row above the speakers: the average of the unmuted speakers; dragging scales each of them proportionally. |
| `layout` | `vertical` (default): one column. `horizontal`: playlists and now-playing on the left, speakers on the right. `auto`: horizontal whenever the card is at least 600 px wide, so a tablet flips between one and two columns with its orientation. Give the card the full section width (`grid_options: { columns: full }`) for the two-column layouts. |
| `playlist_layout`, `playlist_sort`, `playlist_count`, `tile_columns` | Playlist section layout and size. |
| `speaker_count` | Number of speaker rows shown in the card; the picker always lists all. |
| `preset_tolerance` | The active preset is derived from live speaker state; this is the allowed volume difference. |
| `title`, `accent` | Header text and accent colour. |

## Development

```bash
npm install
npm run dev        # dev preview with a mock hass: /dev/index.html (MA) and /dev/spotifyplus.html (SpotifyPlus)
npm test           # unit tests
npm run build      # dist/spotify-media-card.js and dist/spotifyplus-media-card.js
npm run deploy     # build + copy both to HA_WWW_ROOT/<card>/
```

Layout: `src/shared/` holds everything backend-independent (styles, speaker
logic, the `SpeakerCardBase` element), `src/ma/` and `src/spotifyplus/` the
backend-specific parts, and the two `src/*-media-card.ts` files are the entries.
