import { describe, expect, it, vi } from 'vitest';
import { applyPreset, setVolume, withRetry } from '../src/shared/media-services';
import type { HomeAssistant, Speaker } from '../src/shared/types';

const sp = (entity: string, on = true): Speaker => ({ entity, name: entity, vol: 20, on, available: true, standby: false, notInGroup: false });

describe('withRetry', () => {
  it('retries once after a failure', async () => {
    const run = vi.fn().mockRejectedValueOnce(new Error('Failed to execute set volume')).mockResolvedValueOnce('ok');
    await expect(withRetry(run, 1)).resolves.toBe('ok');
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('rejects with the first error when the retry fails too', async () => {
    const run = vi.fn().mockRejectedValueOnce(new Error('first')).mockRejectedValueOnce(new Error('second'));
    await expect(withRetry(run, 1)).rejects.toThrow('first');
  });
});

describe('media_player calls', () => {
  it('asks the frontend not to toast on its own', async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = { callService } as unknown as HomeAssistant;
    await setVolume(hass, 'media_player.a', 30);
    expect(callService).toHaveBeenCalledWith('media_player', 'volume_set', { volume_level: 0.3 }, { entity_id: 'media_player.a' }, false);
  });

  it('applyPreset mutes speakers one by one and survives a transient failure', async () => {
    let failed = false;
    const callService = vi.fn().mockImplementation(async (_d: string, service: string, _data: unknown, target: { entity_id: string }) => {
      if (service === 'volume_mute' && target.entity_id === 'media_player.c' && !failed) {
        failed = true;
        throw new Error('Failed to execute mute volume');
      }
    });
    const hass = { callService } as unknown as HomeAssistant;
    const speakers = [sp('media_player.a'), sp('media_player.b', false), sp('media_player.c')];
    await applyPreset(hass, speakers, { name: 'p', levels: { 'media_player.a': 40, 'media_player.b': 25 } });
    const mutes = callService.mock.calls.filter((c) => c[1] === 'volume_mute').map((c) => [c[3].entity_id, c[2].is_volume_muted]);
    expect(mutes).toEqual([['media_player.b', false], ['media_player.c', true], ['media_player.c', true]]);
  });
});
