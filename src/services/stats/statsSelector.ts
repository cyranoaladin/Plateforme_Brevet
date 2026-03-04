import { UserStats } from "@/types/game";
import { Notion } from "@/types/curriculum";

export interface SubjectMastery {
  subject: string;
  average: number;
  completedCount: number;
}

export interface CategorizedNotions {
  weak: Notion[];
  average: Notion[];
  strong: Notion[];
}

/**
 * Fonctions pures pour le calcul des statistiques.
 */
export const StatsSelector = {
  
  /**
   * Calcule la maîtrise moyenne par matière.
   */
  getSubjectMastery: (stats: UserStats, allNotions: Record<string, Notion[]>): SubjectMastery[] => {
    return Object.entries(allNotions).map(([subject, notions]) => {
      if (notions.length === 0) return { subject, average: 0, completedCount: 0 };
      
      const masteryValues = notions.map(n => stats.mastery[n.id] || 0);
      const average = Math.round(masteryValues.reduce((a, b) => a + b, 0) / notions.length);
      const completedCount = notions.filter(n => (stats.mastery[n.id] || 0) >= 80).length;

      return { subject, average, completedCount };
    });
  },

  /**
   * Catégorise les notions par niveau de maîtrise.
   */
  categorizeNotions: (stats: UserStats, allNotions: Notion[]): CategorizedNotions => {
    const weak: Notion[] = [];
    const average: Notion[] = [];
    const strong: Notion[] = [];

    allNotions.forEach(n => {
      const m = stats.mastery[n.id] || 0;
      if (m < 40) weak.push(n);
      else if (m < 75) average.push(n);
      else strong.push(n);
    });

    return { weak, average, strong };
  },

  /**
   * Formate les données pour le graphique XP.
   * Retourne les 7 derniers points triés par date.
   */
  getXPProgress: (stats: UserStats) => {
    if (!stats.history || stats.history.length === 0) {
      return [{ date: 'Début', xp: 0 }, { date: 'Aujourd\'hui', xp: stats.xp }];
    }
    
    return [...stats.history]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }
};
