import { describe, it, expect } from 'vitest';
import { ParentSelector } from '../services/stats/parentSelector';
import { UserStats } from '../types/game';
import { Notion } from '../types/curriculum';

describe('Stats: ParentSelector Logic', () => {
  const mockNotions: Notion[] = [
    { id: 'n1', title: 'N1 Weak', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [] } },
    { id: 'n2', title: 'N2 Strong', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [] } }
  ];

  const allNotionsMap = { 'maths': mockNotions };

  it('should generate subject stats and extract weak notions', () => {
    const stats: UserStats = {
      xp: 0, gems: 0, energy: 30, lastSync: "", streakDays: 0,
      mastery: { 'n1': 20, 'n2': 90 }, history: [], duels: []
    };

    const data = ParentSelector.getDashboardData(stats, allNotionsMap);
    expect(data.subjects.length).toBe(1);
    expect(data.subjects[0].average).toBe(55); // (20 + 90) / 2
    expect(data.subjects[0].weakNotions.length).toBe(1);
    expect(data.subjects[0].weakNotions[0].id).toBe('n1');
  });

  it('should generate a remediation recommendation when weak notions exist', () => {
    const stats: UserStats = {
      xp: 0, gems: 0, energy: 30, lastSync: "", streakDays: 0,
      mastery: { 'n1': 20, 'n2': 90 }, history: [], duels: []
    };

    const data = ParentSelector.getDashboardData(stats, allNotionsMap);
    const reco = data.recommendations.find(r => r.type === 'remediation');
    expect(reco).toBeDefined();
    expect(reco?.title).toContain('N1 Weak');
  });

  it('should generate consistency recommendation based on streak', () => {
    const statsLow: UserStats = { xp: 0, gems: 0, energy: 30, lastSync: "", streakDays: 2, mastery: {}, history: [], duels: [] };
    const dataLow = ParentSelector.getDashboardData(statsLow, allNotionsMap);
    expect(dataLow.recommendations.some(r => r.title.includes("Maintenir la régularité"))).toBe(true);

    const statsHigh: UserStats = { xp: 0, gems: 0, energy: 30, lastSync: "", streakDays: 5, mastery: {}, history: [], duels: [] };
    const dataHigh = ParentSelector.getDashboardData(statsHigh, allNotionsMap);
    expect(dataHigh.recommendations.some(r => r.title.includes("Excellente régularité"))).toBe(true);
  });
});
