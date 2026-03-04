import { describe, it, expect, beforeEach, vi, MockInstance } from 'vitest';
import { LocalDataService } from '../services/dataService';

describe('Data: LocalDataService Schema Migration', () => {
  
  const service = new LocalDataService();
  let getItemSpy: MockInstance;

  beforeEach(() => {
    const mockStorage: Record<string, string> = {};
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, val) => { mockStorage[key] = val; });
  });

  it('should migrate old stats format (missing duels and history)', async () => {
    const oldStats = {
      xp: 500,
      gems: 10,
      energy: 25,
      streakDays: 3,
      mastery: { 'notion-1': 50 },
      lastSync: "2026-01-01T00:00:00.000Z"
    };

    getItemSpy.mockReturnValue(JSON.stringify(oldStats));

    const result = await service.getStats();

    expect(result.xp).toBe(500);
    expect(result.mastery['notion-1']).toBe(50);
    // Migration checks
    expect(result.duels).toEqual([]);
    expect(result.history).toEqual([]);
    expect(result.lastSync).toBe(oldStats.lastSync);
  });

  it('should handle corrupt JSON by returning defaults', async () => {
    getItemSpy.mockReturnValue("INVALID_JSON");
    
    const result = await service.getStats();
    expect(result.xp).toBe(0);
    expect(result.history).toEqual([]);
  });

});
