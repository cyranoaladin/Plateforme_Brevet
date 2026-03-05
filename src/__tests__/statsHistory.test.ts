import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateXPHistory } from '../utils/stats/historyHelper';
import { StatsSelector } from '../services/stats/statsSelector';
import { UserStats, XPPoint } from '../types/game';

describe('Stats: XP History Logic', () => {
  
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should create a new daily point if missing', () => {
    vi.setSystemTime(new Date('2026-03-04'));
    const history = updateXPHistory([], 100);
    expect(history).toEqual([{ date: '2026-03-04', xp: 100 }]);
  });

  it('should update existing daily point', () => {
    vi.setSystemTime(new Date('2026-03-04'));
    const initial = [{ date: '2026-03-04', xp: 100 }];
    const history = updateXPHistory(initial, 250);
    expect(history).toEqual([{ date: '2026-03-04', xp: 250 }]);
  });

  it('should cap history at 30 entries', () => {
    let history: XPPoint[] = [];
    for (let i = 1; i <= 35; i++) {
      // Simulate 35 days across Jan and Feb
      const day = i <= 31 ? i : i - 31;
      const month = i <= 31 ? '01' : '02';
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      
      vi.setSystemTime(new Date(`2026-${month}-${dayStr}`));
      history = updateXPHistory(history, i * 10);
    }
    expect(history.length).toBe(30);
    expect(history[0].date).toBe('2026-01-06'); // First 5 entries removed (31+4 = 35, 35-30 = 5)
  });

  it('StatsSelector.getXPProgress should return 7 latest sorted points', () => {
    const stats: UserStats = {
      xp: 1000, 
      gems: 0, 
      energy: 0, 
      lastSync: "", 
      streakDays: 0, 
      mastery: {},
      history: [
        { date: '2026-03-05', xp: 500 },
        { date: '2026-03-01', xp: 100 },
        { date: '2026-03-04', xp: 400 },
        { date: '2026-03-02', xp: 200 },
        { date: '2026-03-03', xp: 300 },
        { date: '2026-03-06', xp: 600 },
        { date: '2026-03-07', xp: 700 },
        { date: '2026-03-08', xp: 800 },
      ],
      duels: [],
    };

    const progress = StatsSelector.getXPProgress(stats);
    expect(progress.length).toBe(7);
    expect(progress[0].date).toBe('2026-03-02');
    expect(progress[6].date).toBe('2026-03-08');
  });

});
