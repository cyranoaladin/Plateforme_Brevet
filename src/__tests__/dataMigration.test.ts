import { describe, it, expect, beforeEach, vi, MockInstance } from 'vitest';
import { LocalDataService } from '../services/dataService';

describe('Data: LocalDataService Schema Migration', () => {
  
  const service = new LocalDataService();
  let getItemSpy: MockInstance;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
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
    expect(result.duels).toEqual([]);
    expect(result.history).toEqual([]);
  });

  it('should sanitize wrong types and clamp values', async () => {
    const corruptStats = {
      xp: "1000", // Wrong type (string)
      energy: 50, // Over limit
      streakDays: -5, // Under limit
      mastery: ["not", "an", "object"], // Wrong type (array)
      history: "none", // Wrong type (string)
      duels: [{ id: 123, status: "hacking" }], // Invalid items
      lastSync: 123456789 // Wrong type (number)
    };

    getItemSpy.mockReturnValue(JSON.stringify(corruptStats));

    const result = await service.getStats();

    expect(result.xp).toBe(0); // Reset to default
    expect(result.energy).toBe(30); // Clamped to max
    expect(result.streakDays).toBe(0); // Clamped to min
    expect(result.mastery).toEqual({}); // Reset to default
    expect(result.history).toEqual([]); // Reset to default
    expect(result.duels).toEqual([]); // Filtered out invalid items
    expect(typeof result.lastSync).toBe('string');
  });

  it('should handle corrupt JSON by returning defaults', async () => {
    getItemSpy.mockReturnValue("INVALID_JSON");
    
    const result = await service.getStats();
    expect(result.xp).toBe(0);
    expect(result.history).toEqual([]);
  });

});
