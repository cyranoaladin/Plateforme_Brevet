import { describe, it, expect } from 'vitest';
import { QuestEngine, NotionWithSubject } from '../services/questEngine';
import { UserStats } from '../types/game';
import { DailyQuestState } from '../types/quests';

describe('Quest Engine', () => {
  
  const mockNotions: NotionWithSubject[] = [
    { 
      id: "thales", 
      subject: "maths", 
      title: "Théorème de Thalès",
      objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N3_APPLICATION',
      onboarding: { hook: "", keyPoints: [] }, lesson: [], 
      quiz: { energyCost: 2, xpReward: 50, gemsReward: 5, questions: [] }
    },
    { 
      id: "pythagore", 
      subject: "maths", 
      title: "Pythagore",
      objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N3_APPLICATION',
      onboarding: { hook: "", keyPoints: [] }, lesson: [], 
      quiz: { energyCost: 2, xpReward: 50, gemsReward: 5, questions: [] }
    }
  ];

  const mockStats: UserStats = {
    xp: 0,
    gems: 0,
    energy: 30,
    lastSync: "",
    streakDays: 2,
    mastery: { "thales": 20, "pythagore": 50 },
    history: [],
    duels: [],
  };

  it('should generate exactly 3 daily quests', () => {
    const quests = QuestEngine.generateDailyQuests(mockStats, "2026-03-04", mockNotions);
    expect(quests.quests.length).toBe(3);
    expect(quests.date).toBe("2026-03-04");
  });

  it('should validate complete_notion quest', () => {
    const state: DailyQuestState = {
      date: "2026-03-04",
      quests: [{
        id: "1", title: "Test", description: "", xpReward: 10, gemsReward: 0,
        progress: 0, isCompleted: false, criteria: { type: 'complete_notion', target: 1, notionId: 'thales' }
      }]
    };

    let res = QuestEngine.processAction(state, { type: 'complete_notion', notionId: 'autre' });
    expect(res.updatedQuests.quests[0].isCompleted).toBe(false);

    res = QuestEngine.processAction(state, { type: 'complete_notion', notionId: 'thales' });
    expect(res.updatedQuests.quests[0].isCompleted).toBe(true);
  });

});
