import { UserStats } from "@/types/game";

export interface IDataService {
  getStats(): Promise<UserStats>;
  saveStats(stats: UserStats): Promise<void>;
}

export class LocalDataService implements IDataService {
  private STORAGE_KEY = "brevet_master_stats";

  async getStats(): Promise<UserStats> {
    if (typeof window === "undefined") return this.getDefaultStats();
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : this.getDefaultStats();
  }

  async saveStats(stats: UserStats): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  private getDefaultStats(): UserStats {
    return {
      xp: 0,
      gems: 0,
      energy: 30,
      streakDays: 4, // Simulation d'un utilisateur actif
      mastery: {},
      history: [],
      lastSync: new Date().toISOString(),
    };
  }
}
