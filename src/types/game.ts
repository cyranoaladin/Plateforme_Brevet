import { DailyQuestState } from "./quests";

export interface Rank {
  level: number;
  name: string;
  maxXp: number;
  color: string;
}

export interface XPPoint {
  date: string; // YYYY-MM-DD
  xp: number;
}

export interface DuelMatch {
  id: string;
  date: string;
  subject: string;
  notionId: string;
  myScore: number;
  opponentScore: number;
  opponentName: string;
  xpReward: number;
  gemsReward: number;
  status: 'victory' | 'defeat' | 'draw';
}

export interface UserStats {
  xp: number;
  gems: number;
  energy: number;
  lastSync: string;
  streakDays: number;
  mastery: Record<string, number>; // slug-notion -> score 0-100
  dailyQuests?: DailyQuestState;
  history: XPPoint[]; // Historique pour les graphiques
  duels: DuelMatch[]; // Historique des duels
}

export const RANKS: Rank[] = [
  { level: 1, name: "Apprenti du Savoir", maxXp: 500, color: "text-gray-400" },
  { level: 2, name: "Explorateur", maxXp: 1500, color: "text-green-500" },
  { level: 3, name: "Chevalier du Brevet", maxXp: 4000, color: "text-blue-400" },
  { level: 4, name: "Maître des Révisions", maxXp: 8000, color: "text-purple-500" },
  { level: 5, name: "Expert DNB", maxXp: 15000, color: "text-orange-500" },
];

export function calculateRank(xp: number): Rank {
  return RANKS.slice().reverse().find((r) => xp >= (r.level === 1 ? 0 : RANKS[r.level - 2].maxXp)) || RANKS[0];
}
