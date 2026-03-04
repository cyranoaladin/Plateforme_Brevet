import { describe, it, expect } from 'vitest';
import { LeaderboardService } from '../services/leaderboard/leaderboardService';
import { UserStats } from '../types/game';

describe('Leaderboard Service: Competitive Simulation', () => {
  
  const mockStats: UserStats = {
    xp: 2500,
    gems: 100,
    energy: 30,
    lastSync: "",
    streakDays: 10,
    mastery: {},
    history: [],
    duels: []
  };

  it('should include the player in the results', () => {
    const entries = LeaderboardService.getLeaderboard(mockStats);
    const player = entries.find(e => e.isPlayer);
    expect(player).toBeDefined();
    expect(player?.xp).toBe(2500);
  });

  it('should return exactly 13 entries (1 player + 12 bots)', () => {
    const entries = LeaderboardService.getLeaderboard(mockStats);
    expect(entries.length).toBe(13);
  });

  it('should be sorted by XP descending', () => {
    const entries = LeaderboardService.getLeaderboard(mockStats);
    for (let i = 0; i < entries.length - 1; i++) {
      expect(entries[i].xp).toBeGreaterThanOrEqual(entries[i + 1].xp);
    }
  });

  it('should generate different ranks based on simulated XP', () => {
    const entries = LeaderboardService.getLeaderboard(mockStats);
    const uniqueRanks = new Set(entries.map(e => e.rank.level));
    expect(uniqueRanks.size).toBeGreaterThan(1);
  });

});
