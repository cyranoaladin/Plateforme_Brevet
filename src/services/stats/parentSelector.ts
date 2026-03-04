import { UserStats, calculateRank, Rank, XPPoint, DuelMatch } from "@/types/game";
import { Notion } from "@/types/curriculum";

export interface ParentSubjectStat {
  subject: string;
  average: number;
  weakNotions: Notion[];
}

export interface ParentAction {
  title: string;
  description: string;
  type: 'remediation' | 'duel' | 'consistency';
}

export interface ParentDashboardData {
  xp: number;
  rank: Rank;
  streakDays: number;
  subjects: ParentSubjectStat[];
  activity: XPPoint[];
  recentDuels: DuelMatch[];
  recommendations: ParentAction[];
}

export class ParentSelector {
  
  static getDashboardData(stats: UserStats, allNotions: Record<string, Notion[]>): ParentDashboardData {
    const subjects: ParentSubjectStat[] = [];
    const allWeakNotions: Notion[] = [];

    // 1. Analyse par matière
    for (const [subject, notions] of Object.entries(allNotions)) {
      if (notions.length === 0) continue;
      
      const masteryValues = notions.map(n => stats.mastery[n.id] || 0);
      const average = Math.round(masteryValues.reduce((a, b) => a + b, 0) / notions.length);
      const weakNotions = notions.filter(n => (stats.mastery[n.id] || 0) < 40);
      
      allWeakNotions.push(...weakNotions);
      subjects.push({ subject, average, weakNotions });
    }

    // 2. Activité et Duels
    const activity = stats.history ? [...stats.history].sort((a, b) => a.date.localeCompare(b.date)).slice(-7) : [];
    const recentDuels = stats.duels ? stats.duels.slice(0, 3) : [];

    // 3. Recommandations Actionnables (Max 3)
    const recommendations: ParentAction[] = [];
    
    // Reco 1 : Remédiation si lacunes
    if (allWeakNotions.length > 0) {
      const target = allWeakNotions[0];
      recommendations.push({
        title: `Lacune identifiée en ${target.title}`,
        description: `Votre enfant rencontre des difficultés sur cette notion. ARIA (notre Mentor IA) peut lui proposer un plan de révision adapté.`,
        type: 'remediation'
      });
    }

    // Reco 2 : Constance
    if (stats.streakDays < 3) {
      recommendations.push({
        title: "Maintenir la régularité",
        description: "15 minutes par jour sont plus efficaces qu'une longue session le week-end. Encouragez une petite révision ce soir.",
        type: 'consistency'
      });
    } else {
       recommendations.push({
        title: "Excellente régularité !",
        description: `Votre enfant a révisé ${stats.streakDays} jours de suite. Félicitez-le pour cette belle constance.`,
        type: 'consistency'
      });
    }

    // Reco 3 : Gamification / Duels
    const recentDefeats = recentDuels.filter(d => d.status === 'defeat').length;
    if (recentDefeats >= 2) {
      recommendations.push({
        title: "Soutien moral suite aux Duels",
        description: "Votre enfant a rencontré des adversaires coriaces récemment. Rappelez-lui que l'erreur fait partie de l'apprentissage.",
        type: 'duel'
      });
    } else if (allWeakNotions.length > 1 && recommendations.length < 3) {
       const target = allWeakNotions[1];
       recommendations.push({
        title: `Autre point de vigilance : ${target.title}`,
        description: `Une petite session de consolidation sur ce sujet serait bénéfique.`,
        type: 'remediation'
      });
    }

    return {
      xp: stats.xp,
      rank: calculateRank(stats.xp),
      streakDays: stats.streakDays,
      subjects,
      activity,
      recentDuels,
      recommendations: recommendations.slice(0, 3)
    };
  }
}
