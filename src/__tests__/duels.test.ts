import { describe, it, expect } from 'vitest';
import { DuelEngine, isMCQ } from '../services/duelEngine';
import { NotionWithSubject } from '../services/questEngine';
import { Question } from '../types/curriculum';

describe('Duel Engine: Selection & Resolution', () => {
  
  const mockNotions: NotionWithSubject[] = [
    { 
      id: 'weak-notion', subject: 'maths', title: 'Weak', objectives: [], prerequisites: [], estimatedDuration: 10, bloomTarget: 'N1_MEMORISATION', onboarding: { hook: '', keyPoints: [] }, lesson: [], 
      quiz: { 
        energyCost: 1, xpReward: 10, gemsReward: 1, 
        questions: [
          { id: 'q1', type: 'qcm', question: 'Q1', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' },
          { id: 'q2', type: 'qcm', question: 'Q2', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' },
          { id: 'q3', type: 'qcm', question: 'Q3', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' }
        ] 
      } 
    }
  ];

  it('isMCQ guard should validate correct MCQ format', () => {
    const q: Question = { id: '1', type: 'qcm', question: '?', options: ['A', 'B'], correctAnswer: 0, explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' };
    expect(isMCQ(q)).toBe(true);
    
    const q2: Question = { id: '2', type: 'reponse_courte', question: '?', correctAnswer: 'txt', explanation: '', bloom: 'N1_MEMORISATION', difficulty: 'FACILE' };
    expect(isMCQ(q2)).toBe(false);
  });

  it('should prioritize weak notions for duels', () => {
    const mastery = { 'weak-notion': 20 };
    for (let i = 0; i < 10; i++) {
      const notion = DuelEngine.pickDuelNotion(mastery, mockNotions);
      expect(notion.id).toBe('weak-notion');
    }
  });

  it('should resolve duel rewards correctly based on victory', () => {
    const result = DuelEngine.resolveDuel(3, 1, 'Opponent', mockNotions[0]);
    expect(result.status).toBe('victory');
    expect(result.xpReward).toBe(150);
    expect(result.opponentName).toBe('Opponent');
  });

  it('should pick exactly 3 MCQ questions', () => {
    const questions = DuelEngine.pickMCQQuestions(mockNotions[0], 3);
    expect(questions.length).toBe(3);
    expect(questions[0].type).toBe('qcm');
  });

});
