import { LitElement, html, css, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CardConfig, HomeAssistant } from '../types';

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<{ createCardElement: (c: Record<string, unknown>) => HTMLElement & { constructor: { getConfigElement?: () => void } } }>;
  }
}

const SCHEMA = [
  {
    name: 'group_entity',
    required: true,
    selector: { entity: { domain: 'media_player', integration: 'music_assistant' } },
  },
  {
    name: 'speakers',
    required: true,
    selector: { entity: { domain: 'media_player', integration: 'cast', multiple: true } },
  },
  {
    type: 'grid',
    name: '',
    schema: [
      { name: 'playlist_layout', selector: { select: { mode: 'dropdown', options: [{ value: 'tiles', label: 'Tiles' }, { value: 'list', label: 'List' }] } } },
      { name: 'playlist_sort', selector: { select: { mode: 'dropdown', options: [{ value: 'last_played', label: 'Last played' }, { value: 'play_count', label: 'Most played' }] } } },
      { name: 'playlist_count', selector: { number: { min: 1, max: 50, mode: 'box' } } },
      { name: 'tile_columns', selector: { number: { min: 2, max: 8, mode: 'box' } } },
      { name: 'tile_columns_wide', selector: { number: { min: 2, max: 8, mode: 'box' } } },
      { name: 'speaker_count', selector: { number: { min: 1, max: 50, mode: 'box' } } },
      { name: 'preset_tolerance', selector: { number: { min: 0, max: 50, mode: 'box' } } },
    ],
  },
  { name: 'layout', selector: { select: { mode: 'dropdown', options: [{ value: 'vertical', label: 'Vertical' }, { value: 'horizontal', label: 'Horizontal (playlists left, speakers right)' }, { value: 'auto', label: 'Auto (horizontal when wide)' }] } } },
  { name: 'default_preset', selector: { text: {} } },
  { name: 'master_volume', selector: { boolean: {} } },
  { name: 'master_label', selector: { text: {} } },
  { name: 'master_style', selector: { select: { mode: 'dropdown', options: [{ value: 'plain', label: 'Plain row' }, { value: 'panel', label: 'Own panel' }, { value: 'tree', label: 'Speakers indented under it' }] } } },
  { name: 'title', selector: { text: {} } },
  { name: 'accent', selector: { text: {} } },
  { name: 'ma_config_entry_id', selector: { text: {} } },
];

const LABELS: Record<string, string> = {
  group_entity: 'Music Assistant player for the Cast group',
  speakers: 'Speakers (Google Cast entities)',
  playlist_layout: 'Playlist layout',
  playlist_sort: 'Playlist order',
  playlist_count: 'Playlists to show',
  tile_columns: 'Playlists per row',
  tile_columns_wide: 'Playlists per row in two-column layout',
  speaker_count: 'Speaker rows to show',
  preset_tolerance: 'Preset match tolerance',
  layout: 'Card layout',
  default_preset: 'Preset applied on a fresh start (name)',
  master_volume: 'Show master volume row',
  master_label: 'Master volume label',
  master_style: 'Master volume style',
  title: 'Title',
  accent: 'Accent color (CSS)',
  ma_config_entry_id: 'Music Assistant config entry id (optional)',
};

@customElement('spotify-media-card-editor')
export class SpotifyMediaCardEditor extends LitElement {
  static override styles = css`
    .hint {
      margin-top: 12px;
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.4;
    }
    code {
      font-family: ui-monospace, Menlo, monospace;
    }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: CardConfig;
  @state() private _helpersLoaded = false;

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void this._loadHaForm();
  }

  /** ha-form is lazy-loaded by the frontend; loading the entities card editor pulls it in. */
  private async _loadHaForm(): Promise<void> {
    if (customElements.get('ha-form')) {
      this._helpersLoaded = true;
      return;
    }
    try {
      const helpers = await window.loadCardHelpers?.();
      const el = helpers?.createCardElement({ type: 'entities', entities: [] });
      el?.constructor.getConfigElement?.();
      await customElements.whenDefined('ha-form');
    } catch {
      /* fall through: render anyway */
    }
    this._helpersLoaded = true;
  }

  private _formData(): Record<string, unknown> {
    const c = this._config ?? ({} as CardConfig);
    const speakers = Array.isArray(c.speakers)
      ? c.speakers.map((s) => (typeof s === 'string' ? s : s?.entity)).filter(Boolean)
      : [];
    return { ...c, speakers, master_volume: c.master_volume !== false };
  }

  private _valueChanged(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = ev.detail.value;
    const prev = this._config;
    // keep per-speaker names that were configured in YAML
    const names = new Map<string, string>();
    for (const s of prev.speakers ?? []) if (typeof s === 'object' && s?.name) names.set(s.entity, s.name);
    const speakers = ((value.speakers as string[]) ?? []).map((e) => (names.has(e) ? { entity: e, name: names.get(e)! } : e));
    const next: CardConfig = { ...prev, ...value, speakers } as CardConfig;
    for (const key of Object.keys(next) as Array<keyof CardConfig>) {
      const v = next[key];
      if (v === '' || v === undefined || v === null) delete next[key];
    }
    this._config = next;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: next }, bubbles: true, composed: true }));
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config || !this._helpersLoaded) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._formData()}
        .schema=${SCHEMA}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <div class="hint">
        Presets (Focus, Chill, Dinner, Party…) are edited in the YAML code editor as
        <code>presets: [{ name, levels: { media_player.x: 40 } }]</code>. Speakers left out of a preset's levels are muted by it.
      </div>
    `;
  }
}
