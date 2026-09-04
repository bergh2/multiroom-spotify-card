# Multiroom Spotify Card for Home Assistant

Dashboard cards for starting Spotify playlists on a multi-room Chromecast
speaker group, with a volume slider per room, a master volume, and mood
presets. One tap on a playlist, and the music plays in sync in every room you
have switched on.

Two cards are included, sharing the same design:

| Card | Starts music through | Choose it when |
|---|---|---|
| `custom:multiroom-spotify-card` | [SpotifyPlus](https://github.com/thlucas1/homeassistantcomponent_spotifyplus): launches Spotify's own Cast receiver on the speaker group, so it is a real Spotify Connect session | You want to keep controlling the music from the Spotify app afterwards (recommended) |
| `custom:multiroom-spotify-card-ma` | [Music Assistant](https://www.music-assistant.io/): MA streams the audio itself | You already run Music Assistant and don't need Spotify Connect |

## Features

- **Playlists**: recently played or most played, as tiles or a compact list. The SpotifyPlus card reads Spotify's play history (from every app, not only this card) and fills empty slots with your own playlists.
- **Speakers**: one row per room with its own volume slider and on/off toggle, a master row that scales every room proportionally, and a speaker picker sheet.
- **Presets**: "Focus", "Dinner", "Party"… each sets the volume of the rooms it wants and mutes the rest. The active preset is derived from the live speaker state, so the card never claims a mood that isn't true. An optional default preset is applied when music starts from a cold group.
- **Now playing**: artwork, track, artist, playlist, transport and seek. On the SpotifyPlus card this comes from the Cast group entity, which costs no Spotify API calls.
- **Layout**: one column on a phone, two columns (playlists left, player and speakers right) on a tablet in landscape or on a desktop, automatically.
- Dark and light appearance following the Home Assistant theme; visual editor for the main options.

## How multi-room works

Chromecast has no API for dynamic grouping, so synchronized playback uses a
**speaker group created in the Google Home app**. The cards always play to that
group. Speaker rows and presets only mute/unmute and set the volume of each
speaker's own Google Cast entity, so "off" means "muted in the group". Add or
remove rooms in Google Home; the card follows.

## Requirements

- Home Assistant 2024.x or newer (developed on 2026.x).
- The **Google Cast** integration, with entities for the individual speakers and for the group.
- A Google Home speaker group containing the speakers you want to control.
- For the SpotifyPlus card: **SpotifyPlus v1.0.86 or newer** with the
  [Spotify Desktop Player token](https://github.com/thlucas1/homeassistantcomponent_spotifyplus/wiki/Device-Configuration-Options)
  configured. Without that token SpotifyPlus cannot wake an idle Chromecast. Notes and a helper for creating it are in [`tools/spotifyplus-auth`](tools/spotifyplus-auth/README.md).
- For the Music Assistant card: the Music Assistant server and the `music_assistant` integration, with Spotify as a provider.
- Spotify Premium.

## Installation

### HACS (recommended)

1. HACS → three-dot menu → **Custom repositories** → add `https://github.com/bergh2/multiroom-spotify-card` with type **Dashboard**.
2. Search for **Multiroom Spotify Card** and install it. HACS registers the resource `/hacsfiles/multiroom-spotify-card/multiroom-spotify-card.js`, which contains both cards.
3. Reload the browser, then add a card (search for "Multiroom Spotify Card").

### Manual

Copy `dist/multiroom-spotify-card.js` to `config/www/multiroom-spotify-card/` and add
`/local/multiroom-spotify-card/multiroom-spotify-card.js` as a **JavaScript module**
resource under Settings → Dashboards → Resources. (`dist/` also holds the two
cards as separate files if you only want one.)

## Configuration: `multiroom-spotify-card`

```yaml
type: custom:multiroom-spotify-card
spotifyplus_entity: media_player.spotifyplus   # SpotifyPlus player (default)
cast_group_entity: media_player.all            # Google Cast entity of the speaker group
device_name: All                               # the group's name as Spotify Connect sees it
speakers:                                      # Google Cast entities, in display order
  - entity: media_player.living_room
    name: Living room
  - entity: media_player.kitchen
    name: Kitchen
  - entity: media_player.bedroom
    name: Bedroom
presets:                                       # speakers not listed in a preset are muted by it
  - name: Focus
    levels: { media_player.living_room: 35 }
  - name: Standard
    levels: { media_player.living_room: 30, media_player.kitchen: 22, media_player.bedroom: 18 }
  - name: Party
    levels: { media_player.living_room: 78, media_player.kitchen: 68 }
default_preset: Standard
master_label: Whole house
layout: auto
playlist_count: 8
tile_columns: 3
tile_columns_wide: 4
```

How it works:

- **Start**: `spotifyplus.player_media_play_context` on `device_name`. The now-playing bar shows "Starting on …" with a spinner until the Cast group reports the Spotify app playing. Waking a group from cold takes 10 to 30 seconds; resuming a paused group is instant. If the start fails because SpotifyPlus holds a stale address for the group (it happens after the group re-forms), the card reloads the SpotifyPlus integration and retries once (requires an admin user).
- **Now playing and transport** come from the Cast group entity by default (`control_via: cast`), which needs no Spotify API calls and stays in sync with the Spotify app. `control_via: spotifyplus` uses the SpotifyPlus entity instead.
- **Playlists**: Spotify's "recently played" tracks are folded into a play history stored in Home Assistant user data under `history_key`. Both orders come from it, so "most played" keeps improving over time. Spotify only reports the last 50 tracks, so with `fill_with_favorites` (default on) the remaining slots show your own playlists until real plays take their place. Playlists you delete in Spotify disappear from the history within a day.
- **API use**: refresh on load, a minute after a start, and every 10 minutes while the card is visible. Roughly 10 to 30 Spotify API calls per day. Spotify's developer quota is shared per developer account, so keep other integrations using the same account from polling aggressively.

## Configuration: `multiroom-spotify-card-ma` (Music Assistant)

```yaml
type: custom:multiroom-spotify-card-ma
group_entity: media_player.all_2             # Music Assistant entity of the Google Home group
speakers:                                    # Google Cast entities (not the MA ones)
  - entity: media_player.living_room
    name: Living room
  - entity: media_player.kitchen
    name: Kitchen
presets:
  - name: Standard
    levels: { media_player.living_room: 30, media_player.kitchen: 22 }
default_preset: Standard
ma_config_entry_id: ""                       # optional; auto-discovered when empty
```

Playlists come from `music_assistant.get_library`, sorted by last played or
play count as tracked by Music Assistant. Only plays that went through Music
Assistant count, and MA's stream is not a Spotify Connect session, so the
Spotify app cannot control it.

## Options

| Option | Default | Description |
|---|---|---|
| `speakers` | required | Google Cast entities, as strings or `{entity, name}`. Order is the display order. |
| `presets` | `[]` | List of `{name, levels}`. `levels` maps entity → volume 0–100; omitted speakers are muted. Edited in YAML. |
| `default_preset` | none | Preset applied automatically when a playlist is started while the group is cold (not playing or paused) and no speaker has been touched since it went idle. Pause/resume and preset taps are never overridden. |
| `master_volume` | `true` | Master row above the speakers: the average of the unmuted speakers; dragging scales each of them proportionally. |
| `master_label` | `All` | Name of the master row. |
| `master_style` | `panel` | `panel`: an inset block with the speakers on a rail under it. `plain`: a row like the speakers. `tree`: no panel, speakers indented on a rail. |
| `layout` | `vertical` | `vertical`: one column. `horizontal`: playlists left, player and speakers right. `auto`: horizontal when the card is at least 600 px wide. Give the card the full section width for the two-column layouts (in a sections view, `column_span: 2` on the section). |
| `playlist_layout` | `tiles` | `tiles` or `list`. |
| `playlist_sort` | `last_played` | `last_played` or `play_count`. |
| `playlist_count` | 6 / 10 | Playlists shown (tiles / list). |
| `tile_columns`, `tile_columns_wide` | 3 / same | Playlists per row (2–8) in the one-column and two-column layouts. |
| `speaker_count` | all | Speaker rows shown in the card; the picker always lists all. |
| `preset_tolerance` | 3 | Allowed volume difference when matching the active preset. |
| `title`, `accent` | `Listening`, indigo | Header text and accent colour (any CSS colour). |
| SpotifyPlus only: `spotifyplus_entity`, `cast_group_entity`, `device_name`, `control_via`, `shuffle`, `fill_with_favorites`, `history_key` | see above | |
| Music Assistant only: `group_entity`, `ma_config_entry_id` | see above | |

## Troubleshooting

- **"Starting on …" ends with "did not start"**: SpotifyPlus could not wake the group. Check that the Desktop Player token is installed, and that the group name in `device_name` matches the Spotify Connect device list (`media_player.spotifyplus` → `source_list`). If the Home Assistant log says `Failed to connect to service HostServiceInfo(...)`, the group has moved to another speaker and SpotifyPlus has a stale address; reload the SpotifyPlus integration. `tools/spotifyplus-auth/mdns_cast.py` shows where the group really is.
- **A speaker shows `n/a` while the group plays**: it is not a member of the Google Home group. Add it in the Google Home app.
- **Speakers show `–` when idle**: Google Cast strips volume and mute attributes while a speaker is off. Values you set before pressing play are remembered and applied.
- **Only a few playlists after a fresh install**: Spotify reports the last 50 tracks only. The history grows with use; `fill_with_favorites` fills the gaps meanwhile.
- **Everything stops when bedtime music starts in one room**: Spotify allows one stream per account. Starting a Connect session on one speaker moves the session there.

## Development

```bash
npm install
npm run dev        # mock preview: /dev/index.html (MA) and /dev/spotifyplus.html (SpotifyPlus)
npm test           # unit tests (vitest)
npm run build      # dist/: both cards separately plus the combined multiroom-spotify-card.js
npm run deploy     # build + copy to HA_WWW_ROOT/<card>/ (set HA_WWW_ROOT in .env.local)
```

`src/shared/` holds everything backend-independent (styles, speaker logic, the
`SpeakerCardBase` element); `src/ma/` and `src/spotifyplus/` the backend-specific
parts; the `src/*-media-card*.ts` files are the bundle entries. The original
design mockup and spec live in `docs/design/`.

## Acknowledgements

These cards are only a front end. The heavy lifting is done by two projects
that deserve the credit:

- [SpotifyPlus](https://github.com/thlucas1/homeassistantcomponent_spotifyplus) by
  [thlucas1](https://github.com/thlucas1), which talks to the Spotify Web API and
  wakes Chromecast devices as Spotify Connect targets. The `multiroom-spotify-card`
  requires it. If you use that card, consider supporting the integration.
- [Music Assistant](https://www.music-assistant.io/) and its Home Assistant
  integration, which the `multiroom-spotify-card-ma` card builds on.

The visual design was inspired by the classic
[spotify-card](https://github.com/custom-cards/spotify-card) and its maintained
fork [spotify-card-v2](https://github.com/mikevanes/spotify-card-v2), which showed
how good a playlist grid can look on a dashboard. No code was taken from either.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Spotify AB,
Google, Harman, or the authors of SpotifyPlus and Music Assistant. Spotify is a
trademark of Spotify AB; Chromecast, Google Home and Nest are trademarks of Google
LLC. The cards use your own Spotify account through the integrations above and
need a Spotify Premium subscription. Use at your own risk; see the license.

## License

[MIT](LICENSE)
