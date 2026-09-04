# Spotify Media Card — Design & Functionality Spec

Custom Home Assistant dashboard card for Spotify playback with multi-room audio control.
Source: `Media Card.dc.html`

---

## 1. Intent

An Apple-feeling media card that does three things without leaving the card:

1. Start one of your recently played playlists.
2. See and set the volume of every speaker independently (multi-room).
3. Control what's currently playing.

Priority is **playlist launching first**, transport second — playlists occupy the top of the card, now-playing is a compact bar pinned at the bottom.

---

## 2. Form factor

| Property | Value |
|---|---|
| Card width | 340px (fits a narrow HA dashboard column; `box-sizing: border-box`) |
| Card height | ~600–640px depending on playlist mode |
| Corner radius | 26px card, 18px inner bar, 12px tile art, 10px preset buttons |
| Padding | 16px top / 14px sides / 14px bottom |
| Surface | Translucent card over the dashboard background, `backdrop-filter: blur(30px) saturate(160%)` |
| Borders | 0.5px hairlines, plus a 1px inset top highlight |
| Shadow | `0 30px 70px -20px rgba(0,0,0,0.65)` |

---

## 3. Visual language

**Type** — system stack (`-apple-system`, SF Pro, Helvetica Neue). Weights 540–640 for UI labels, tight negative letter-spacing on names/titles. Secondary metadata uses a monospace stack (SF Mono / Menlo) at 9.5–10.5px so numbers and timers don't jitter.

**Color** — a single accent, `oklch(0.62 0.16 285)` (indigo-violet), used only for active state: active preset fill, active playlist, live volume fill, sheet checkmarks, and text buttons. Everything else is neutral.

**Themes** — dark and light, defined as CSS custom properties on the root and switched by a toggle above the card. All child styling reads `var(--token, fallback)`, so the card paints instantly and re-themes without a re-layout.

| Token | Dark | Light |
|---|---|---|
| `--page` | `#08080a` | `#f2f2f5` |
| `--card` | `rgba(24,24,27,0.86)` | `rgba(255,255,255,0.86)` |
| `--text` | `#f5f5f7` | `#111114` |
| `--text2` | `rgba(235,235,245,0.52)` | `rgba(30,30,36,0.55)` |
| `--line` | `rgba(255,255,255,0.10)` | `rgba(10,10,14,0.10)` |
| `--track` | `rgba(255,255,255,0.13)` | `rgba(10,10,14,0.11)` |

**Imagery** — all artwork is currently a striped placeholder with a monospace `ART nn` label. Replace with real playlist artwork (`entity_picture` from the Spotify integration).

---

## 4. Anatomy, top to bottom

### 4.1 Header
- **Left:** "Listening" + a group summary line that reads the active speakers — `"Living Room + 2 more"`, or `"No speakers selected"` when everything is off.
- **Right:** AirPlay-style pill button showing the count of active speakers. Opens the device picker sheet.

### 4.2 Playlist section — two modes

Switchable via the Tiles / List control above the card.

**Tiles (default)** — 3×2 grid of 6 recently played playlists. Square art, 12px radius, name truncated to one line beneath. The active playlist gets a 2px accent inset ring.

**List** — a denser row layout that fits **10 playlists in the same vertical space**:
- 24px art thumb, 6px radius
- Playlist name, one line, 12.5px
- Right-aligned monospace recency tag (`yesterday`, `2d ago`, `Friday`)
- Play glyph appears only on the active row; the row's name switches to the accent
- 33px row height, 0.5px separators between rows (none above the first)

Clicking any playlist sets it active, starts playback, and resets the progress position.

### 4.3 Mood presets

A row of four equal-width buttons directly above the speaker list. Each writes a volume to every speaker at once and switches off the rooms it doesn't need.

| Preset | Living Room | Kitchen | Bedroom | Office |
|---|---|---|---|---|
| **Focus** | off | off | off | 46 |
| **Chill** | 30 | 22 | 18 | off |
| **Dinner** | 34 | 44 | off | off |
| **Party** | 78 | 68 | off | 62 |

The active preset fills with the accent. Any manual change — dragging a slider, toggling a speaker, mute all — clears the highlight, so it never claims a state that isn't true.

### 4.4 Speakers (multi-room)

Always visible, one row per speaker. Each row:
- **Speaker icon button** (22px, rounded square) toggles that room in or out of the group. Filled accent when on, neutral when off.
- **Name**, dimmed to `--text2` when the speaker is off.
- **Volume slider** — 6px capsule track, accent fill, drag anywhere on the row's track. Pointer-driven: `pointerdown` sets the value immediately, then follows `pointermove` until release. Dragging a muted speaker turns it on.
- **Value** in monospace, 0–100.

A **Mute all / Play on all** text button sits in the section header and flips depending on whether anything is currently on.

Demo speakers: Living Room (sonos), Kitchen (homepod), Bedroom (homepod), Office (echo).

### 4.5 Now playing bar

Inset panel at the bottom of the card:
- 44px album art thumb
- Three-bar animated equalizer, dimmed to 25% opacity when paused
- Track title (600 weight) and artist line, which also names the playing playlist
- Transport: previous, play/pause (38px filled circle, inverted color), next
- **Progress bar** — 4px track, click or drag to seek, elapsed time on the left and remaining (`-1:40`) on the right, both monospace

The position advances once per second while playing and loops at the track length (214s in the mock).

### 4.6 Device picker sheet

Opened from the header AirPlay button. A scrimmed, blurred overlay inside the card bounds with a bottom-anchored sheet that animates up (`0.22s cubic-bezier(0.22, 1, 0.36, 1)`).

Each row: a radio-style circle that fills accent with a white check when the speaker is active, the speaker name, and its integration type in monospace. Rows toggle group membership — the same state the speaker list shows. "Done" dismisses.

---

## 5. State model

| Key | Purpose |
|---|---|
| `theme` | `'dark'` / `'light'` |
| `playlistStyle` | `'tiles'` / `'list'` |
| `activePlaylist` | index of the playing playlist |
| `playing` | transport state |
| `pos` | playback position in seconds |
| `preset` | name of the applied mood preset, or `null` |
| `pickerOpen` | device sheet visibility |
| `speakers[]` | `{ name, kind, vol, on }` per room |

---

## 6. To wire up for real

- **Playlists** — Spotify integration recently-played source; each item needs a name, artwork URL, and last-played timestamp for the recency tag.
- **Artwork** — swap striped placeholders for `entity_picture`.
- **Speakers** — one `media_player` entity per room; `vol` maps to `volume_level` (0–1, shown 0–100), `on` maps to group membership (`media_player.join` / `unjoin`).
- **Presets** — a script or scene per mood, or the level table above applied as a batch of `volume_set` + join/unjoin calls.
- **Transport** — `media_play_pause`, `media_next_track`, `media_previous_track`, `media_seek` against the group leader.
- **Progress** — read `media_position` and `media_duration` instead of the local timer.

---

## 7. Open items

- Real speaker names (the four above are placeholders).
- Real playlist names and artwork.
- Which speaker is the group leader when several are active.
- Whether presets should also switch playlist, not just volumes.
