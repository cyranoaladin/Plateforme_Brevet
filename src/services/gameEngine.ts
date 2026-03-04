import { UserStats } from "@/types/game";

export interface QuizInput {
  score: number;
  total: number;
  difficulty: number; // 1 (N1) à 4 (N4)
  notionId: string;
}

export function processQuizResult(stats: UserStats, input: QuizInput) {
  const ratio = input.score / input.total;
  
  // 1. Calcul Multiplicateur Streak
  const streakMult = stats.streakDays >= 7 ? 1.5 : stats.streakDays >= 4 ? 1.25 : 1.1;
  
  // 2. Calcul XP & Gemmes
  const baseXP = 25 * input.difficulty;
  const earnedXP = Math.round(baseXP * ratio * streakMult);
  const earnedGems = ratio === 1 ? 10 : Math.floor(5 * ratio);

  // 3. Calcul Mastery (Pondération 70% dernier score, 30% historique)
  const currentMastery = stats.mastery[input.notionId] || 0;
  const attemptMastery = ratio * 100;
  const newMastery = Math.min(100, Math.round((attemptMastery * 0.7) + (currentMastery * 0.3)));

  // 4. Génération Résumé Pédagogique (2 phrases)
  const summary = ratio === 1 
    ? "Maîtrise parfaite ! Tu as assimilé tous les concepts de cette notion." 
    : ratio > 0.5 
      ? "Bonne compréhension globale. Revois les points d'ombre pour atteindre la perfection."
      : "Notion encore fragile. Une nouvelle lecture de la leçon est recommandée pour consolider tes bases.";

  return {
    earnedXP,
    earnedGems,
    newMastery,
    summary
  };
}

export function getNextAction(mastery: number): string {
  if (mastery < 50) return "Réviser la leçon";
  if (mastery < 80) return "S'entraîner (N3)";
  if (mastery < 100) return "Défi Expert (N4)";
  return "Notion Maîtrisée !";
}
