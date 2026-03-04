import { describe, it, expect } from 'vitest';
import { StatsSelector } from '../services/stats/statsSelector';
import { UserStats } from '../types/game';
import { Notion } from '../types/curriculum';

describe('Stats Engine: StatsSelector', () => {
  
  const mockNotions: Notion[] = [
    { id: 'n1', title: 'N1', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [] } },
    { id: 'n2', title: 'N2', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [] } }
  ];

  const mockStats: UserStats = {
    xp: 1000,
    gems: 50,
    energy: 30,
    lastSync: "",
    streakDays: 5,
    mastery: { 'n1': 20, 'n2': 90 },
    history: []
  };

  it('should calculate subject mastery correctly', () => {
    const res = StatsSelector.getSubjectMastery(mockStats, { 'maths': mockNotions });
    expect(res[0].average).toBe(55); // (20 + 90) / 2
    expect(res[0].completedCount).toBe(1); // Only n2 is >= 80
  });

  it('should categorize notions based on mastery thresholds', () => {
    const res = StatsSelector.categorizeNotions(mockStats, mockNotions);
    expect(res.weak.length).toBe(1); // n1
    expect(res.strong.length).toBe(1); // n2
    expect(res.average.length).toBe(0);
  });

  it('should provide fallback for XP progress if history is empty', () => {
    const res = StatsSelector.getXPProgress(mockStats);
    expect(res.length).toBe(2);
    expect(res[1].xp).toBe(1000);
  });

});
