import { UserStats, DuelMatch } from "@/types/game";
import { Question } from "@/types/curriculum";
import { NotionWithSubject } from "./questEngine";

/**
 * Type spécifique pour une question QCM garantie.
 */
export interface MCQQuestion extends Question {
  type: 'qcm';
  options: string[];
  correctAnswer: number;
}

/**
 * Type Guard pour valider une question QCM.
 */
export function isMCQ(q: Question): q is MCQQuestion {
  return (
    q.type === 'qcm' &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    typeof q.correctAnswer === 'number'
  );
}

export class DuelEngine {
  
  /**
   * Sélectionne une notion pour le duel.
   * Priorité aux notions ayant au moins 3 QCM.
   */
  static pickDuelNotion(mastery: Record<string, number>, allNotions: NotionWithSubject[]): NotionWithSubject {
    const validNotions = allNotions.filter(n => n.quiz.questions.filter(isMCQ).length >= 3);
    const weakNotions = validNotions.filter(n => (mastery[n.id] || 0) < 40);
    
    const pool = weakNotions.length > 0 ? weakNotions : validNotions;
    if (pool.length === 0) {
      throw new Error("Aucune notion compatible avec le mode Duel n'a été trouvée.");
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Extrait exactement 3 questions QCM d'une notion.
   */
  static pickMCQQuestions(notion: NotionWithSubject, count = 3): MCQQuestion[] {
    const mcqs = notion.quiz.questions.filter(isMCQ);
    return [...mcqs]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  static simulateOpponentScore(): number {
    const r = Math.random();
    if (r < 0.1) return 0;
    if (r < 0.3) return 1;
    if (r < 0.7) return 2;
    return 3;
  }

  static generateOpponentName(): string {
    const botNames = ["Xenon", "Atlas", "Vega", "Nova", "Cipher", "Astra", "Koda"];
    return botNames[Math.floor(Math.random() * botNames.length)];
  }

  static resolveDuel(myScore: number, opponentScore: number, opponentName: string, notion: NotionWithSubject): DuelMatch {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Math.random().toString(36).slice(2, 11);
      
    const date = new Date().toISOString().split('T')[0];
    
    let status: 'victory' | 'defeat' | 'draw' = 'draw';
    if (myScore > opponentScore) status = 'victory';
    else if (myScore < opponentScore) status = 'defeat';

    const xpReward = status === 'victory' ? 150 : (status === 'draw' ? 50 : 20);
    const gemsReward = status === 'victory' ? 15 : (status === 'draw' ? 5 : 0);

    return {
      id,
      date,
      subject: notion.subject,
      notionId: notion.id,
      myScore,
      opponentScore,
      opponentName,
      xpReward,
      gemsReward,
      status
    };
  }
}
