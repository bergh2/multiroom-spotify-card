# Plan: fristående SpotifyPlus-kort (`spotifyplus-media-card`)

Status: utkast 2026-09-03, väntar på godkännande.

## Varför

Music Assistant-kortet fungerar, men MA strömmar ljudet själv, så uppspelningen är ingen
Spotify Connect-session och kan inte styras från Spotify-appen. SpotifyPlus v1.0.218 kan
starta Spotifys egen Cast-mottagare på Google Home-gruppen "Alla" (verifierat 2026-09-03:
`spotifyplus.player_media_play_context` med `device_id: Alla` startade en Connect-session på
alla fem högtalarna, ca 30 s till ljud). Kortet byggs som ett helt nytt, fristående kort.
MA-kortet lämnas orört.

## Verifierade fakta att bygga på

| Vad | Värde |
|---|---|
| SpotifyPlus-entitet | `media_player.spotifyplus` (källa/`source_list` listar "Alla" och alla högtalare) |
| Cast-grupp (Google Cast-integrationen) | `media_player.alla` (visar app "Spotify", titel, position när Spotify-mottagaren kör) |
| Högtalare (Cast) | `hk_citation_100_l`, `hk_citation_100_r`, `nest_hub`, `g10`, `nest_mini` |
| Start | `spotifyplus.player_media_play_context` {`context_uri`, `device_id`, `shuffle`, `delay`} |
| Senast spelade | `spotifyplus.get_player_recent_tracks` {`limit` ≤ 50, `after`} → låtar med `context.uri` (spellista) och `played_at` |
| Spellistedata | `spotifyplus.get_playlist_favorites` (namn, bild, uri) och `spotifyplus.get_playlist` {`playlist_id`} för ej följda |
| Tokenfil | `Z:\homeassistant\.storage\spotifyplus_tokens.json` (självförnyande) |
| Pollning | SpotifyPlus `spotify_scan_interval`, standard 30 s, inställbart i integrationens alternativ |
| Delad lagring | `frontend/get_user_data` / `set_user_data` fungerar (per HA-användare) |

## Steg 0: kvotstädning (innan kod)

Spotify räknar kvoten per utvecklarkonto, över alla appar. Idag:
1. SpotifyPlus: höj `spotify_scan_interval` till 120 s (Inställningar → Integrationer → SpotifyPlus → Konfigurera).
2. Spotcast: inaktivera integrationen (är i `setup_error`, pollar var 30:e s när den fungerar, används inte).
3. HA:s Spotify-integration: inaktivera entiteten `media_player.spotify` (pollar var 30:e s). Integrationen kan inte tas bort så länge Spotcast finns kvar; tas Spotcast bort kan hela integrationen tas bort.

## Arkitektur

Samma repo, andra byggmålet. Det som är oberoende av backend flyttas till `src/shared/`
och används av båda korten; MA-kortet ändrar inte beteende.

```
src/
  shared/            styles, icons, throttle, format, speakers/derive, presets, master volume, picker, toast
  spotify-media-card.ts          (MA-kortet, oförändrat beteende)
  spotifyplus-media-card.ts      (nytt kort)
  spotifyplus/
    config.ts        schema + validering
    services.ts      SpotifyPlus-anrop (start, recent tracks, playlists)
    history.ts       spellistehistorik: hämta, slå ihop, sortera, spara i user data
    playback.ts      nu-spelas/transport via Cast-gruppen (standard) eller SpotifyPlus
    editor.ts
dist/spotify-media-card.js, dist/spotifyplus-media-card.js
```

### Dataflöde

**Starta spellista**
1. Tryck → kortet visar tillståndet "Startar på Alla…" (spinner i nu-spelas-raden, spellistan markerad).
2. Om `default_preset` är satt, gruppen är kall (Cast-gruppen varken `playing` eller `paused`) och ingen högtalare rörts: preset appliceras först (samma regel som MA-kortet).
3. `spotifyplus.player_media_play_context` {`entity_id`, `context_uri`, `device_id: <device_name>`}.
4. Klart när `media_player.alla` rapporterar `app_name: Spotify` och `playing`, eller efter 60 s → fel-toast.

**Nu spelas och transport** (standard `control_via: cast`, noll Spotify-anrop)
- Titel, artist, omslag, position, längd från `media_player.alla`.
- Play/pause, nästa, föregående, sök via `media_player.*` mot `media_player.alla`.
- Alternativ `control_via: spotifyplus` för samma sak via `media_player.spotifyplus` om Cast-styrningen visar sig sakna något (t.ex. sök).

**Spellistor**
- `get_player_recent_tracks` (limit 50) → distinkta spellistor i ordning efter `played_at`.
- Historiklager i user data: `{ [playlistUri]: { name, image, lastPlayed, tracks: n } }`. Varje hämtning slår ihop nya låtar (nyare än senast sedda `played_at`), så antalet spelade låtar per spellista ackumuleras över tid och ger "mest spelade" på riktigt, från alla appar.
- Namn och bild: från `get_playlist_favorites` (cachat 60 min), och `get_playlist` en gång per okänd spellista (sparas i historiken).
- Uppdatering: vid kortladdning, 60 s efter en start, var 10:e minut när fliken är synlig. Uppskattad kostnad: 10 till 30 anrop per dag.
- `playlist_sort: last_played | play_count`, `playlist_layout: tiles | list`, `playlist_count` som idag.

**Högtalare, presets, master-volym, väljare**: oförändrade, återanvänds från `shared/`. Idle-, "n/a"- och intent-hanteringen följer med.

### Konfiguration

```yaml
type: custom:spotifyplus-media-card
spotifyplus_entity: media_player.spotifyplus
cast_group_entity: media_player.alla       # nu-spelas + transport
device_name: Alla                          # Spotify Connect-namn som starten riktas mot
control_via: cast                          # cast | spotifyplus
speakers: [...]                            # som MA-kortet
presets: [...]
default_preset: Standard
master_volume: true
playlist_layout: tiles
playlist_sort: last_played
playlist_count: 6
history_key: spotifyplus-media-card        # nyckel i user data, delas av alla kort med samma nyckel
title: Listening
```

## Milstolpar

1. **Delad kod.** Bryt ut `shared/`, lägg till andra Vite-entryn, bygg båda korten. Verifiera: MA-kortet i dev-preview och i HA ser ut och beter sig som innan, alla tester gröna.
2. **Spellistkälla.** `services.ts` + `history.ts` med enhetstester (sammanslagning, sortering, dedup). Verifiera mot riktig HA: listan matchar det du spelat i Spotify-appen.
3. **Start med väntetillstånd.** Verifiera på "Alla": tid till ljud, markering, fel-toast vid rate limit.
4. **Nu spelas via Cast.** Verifiera position, paus, nästa, sök mot Spotify-mottagaren. Faller något: växla till `control_via: spotifyplus` och notera.
5. **Editor, README, hacs.json (två filer), deploy till `www/spotifyplus-media-card/`**, resurs i HA, kort på vyn "Spotify test" bredvid MA-kortet.
6. **Verkligt bruk en dag**, sedan justera (starttidens presentation, uppdateringsintervall).

## Risker och hur de hanteras

| Risk | Hantering |
|---|---|
| ~30 s från tryck till ljud | Tydligt väntetillstånd; spellistan markeras direkt; timeout 60 s med toast |
| Spotify uppdaterar "recently played" med några minuters fördröjning | Historiken slår ihop i efterhand; kortet markerar den nyss startade listan lokalt tills den dyker upp |
| Ratebegränsning (429) | Fel-toast med klartext, exponentiell backoff på hämtningar, transport via Cast påverkas inte |
| Cast-transporten styr inte Spotify-mottagaren fullt ut | `control_via: spotifyplus` som reserv |
| Historik per HA-användare | `history_key` delas per användare; familjen bör dela HA-konto på väggplattan, annars separata listor |
| Tokenfilen slutar fungera efter Spotify-ändring | Skriptet och venv finns i `tools/spotifyplus-auth`, körs om på några minuter |
