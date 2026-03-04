import { UserStats, calculateRank, Rank } from "@/types/game";

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  rank: Rank;
  isPlayer: boolean;
  trend: 'up' | 'down' | 'stable';
}

const BOT_NAMES = [
  "Xenon", "Atlas", "Vega", "Nova", "Cipher", 
  "Astra", "Koda", "Lyra", "Orion", "Zenix", 
  "Eara", "Solan"
];

export class LeaderboardService {
  /**
   * Génère un classement autour du score de l'utilisateur.
   * Utilise une graine basée sur l'XP pour garder une certaine stabilité.
   */
  static getLeaderboard(stats: UserStats): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];

    // Ajouter le joueur
    entries.push({
      id: "player",
      name: "Toi",
      xp: stats.xp,
      rank: calculateRank(stats.xp),
      isPlayer: true,
      trend: 'stable'
    });

    // Générer les bots
    BOT_NAMES.forEach((name, index) => {
      // XP simulée : XP joueur + une variance déterministe basée sur l'index
      // On veut certains bots devant et certains derrière
      const variance = (index % 2 === 0 ? 1 : -1) * (index * 150 + 50);
      const botXP = Math.max(0, stats.xp + variance);
      
      entries.push({
        id: `bot-${index}`,
        name,
        xp: botXP,
        rank: calculateRank(botXP),
        isPlayer: false,
        trend: index % 3 === 0 ? 'up' : (index % 4 === 0 ? 'down' : 'stable')
      });
    });

    // Tri décroissant
    return entries.sort((a, b) => b.xp - a.xp);
  }
}
