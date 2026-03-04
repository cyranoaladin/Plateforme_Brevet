import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DuelEngine, isMCQ } from '../services/duelEngine';
import { NotionWithSubject } from '../services/questEngine';
import { Question } from '../types/curriculum';

describe('Duel Engine: Advanced Reliability', () => {
  
  const mockMCQs = [
    { id: 'q1', type: 'qcm', question: 'Q1', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' },
    { id: 'q2', type: 'qcm', question: 'Q2', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' },
    { id: 'q3', type: 'qcm', question: 'Q3', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' }
  ] as Question[];

  const mockNotions: NotionWithSubject[] = [
    { 
      id: 'weak-notion', subject: 'maths', title: 'Weak', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], 
      quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [...mockMCQs] } 
    },
    { 
      id: 'strong-notion', subject: 'maths', title: 'Strong', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], 
      quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [...mockMCQs] } 
    },
    {
      id: 'invalid-notion', subject: 'maths', title: 'No MCQs', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], 
      quiz: { energyCost: 1, xpReward: 10, gemsReward: 1, questions: [] } // No questions at all
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('isMCQ guard should validate correct MCQ format', () => {
    const q: Question = { id: '1', type: 'qcm', question: '?', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' };
    expect(isMCQ(q)).toBe(true);
    
    const q2: Question = { id: '2', type: 'reponse_courte', question: '?', correctAnswer: 'txt', explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' };
    expect(isMCQ(q2)).toBe(false);
  });

  it('should resolve duel rewards correctly for DRAW', () => {
    const result = DuelEngine.resolveDuel(2, 2, 'Bot', mockNotions[0]);
    expect(result.status).toBe('draw');
    expect(result.xpReward).toBe(50);
    expect(result.gemsReward).toBe(5);
  });

  it('should fallback to global pool if no weak notions are available', () => {
    const mastery = { 'weak-notion': 90, 'strong-notion': 95 };
    // Force Math.random to pick the first one from the valid pool (pool length 2 because invalid-notion is filtered)
    vi.spyOn(Math, 'random').mockReturnValue(0.1); 
    
    const notion = DuelEngine.pickDuelNotion(mastery, mockNotions);
    expect(notion.id).toBe('weak-notion'); // Still picked because it has enough MCQs
  });

  it('should never pick a notion with less than 3 MCQs', () => {
    const mastery = {};
    const poolWithInvalid = [...mockNotions];
    
    // On appelle pickDuelNotion plusieurs fois
    for (let i = 0; i < 10; i++) {
      const notion = DuelEngine.pickDuelNotion(mastery, poolWithInvalid);
      expect(notion.id).not.toBe('invalid-notion');
    }
  });

  it('should throw controlled error if no notion has enough MCQs', () => {
    const emptyPool: NotionWithSubject[] = [mockNotions[2]]; // only invalid-notion
    expect(() => DuelEngine.pickDuelNotion({}, emptyPool)).toThrow("Aucune notion compatible");
  });

  it('should pick exactly 3 MCQ questions and shuffle them', () => {
    // Force a specific "shuffle" via mock
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const questions = DuelEngine.pickMCQQuestions(mockNotions[0], 3);
    expect(questions.length).toBe(3);
    expect(questions[0].type).toBe('qcm');
  });

});
