import { UserStats, DuelMatch, XPPoint } from "@/types/game";

export interface IDataService {
  getStats(): Promise<UserStats>;
  saveStats(stats: UserStats): Promise<void>;
}

export class LocalDataService implements IDataService {
  private STORAGE_KEY = "brevet_master_stats";

  /**
   * Récupère les stats et applique une normalisation pour la compatibilité descendante.
   */
  async getStats(): Promise<UserStats> {
    if (typeof window === "undefined") return this.getDefaultStats();
    
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (!saved) return this.getDefaultStats();

    try {
      const parsed = JSON.parse(saved);
      return this.normalizeStats(parsed);
    } catch (e) {
      console.error("Failed to parse local stats, resetting to default.", e);
      return this.getDefaultStats();
    }
  }

  async saveStats(stats: UserStats): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stats));
  }

  /**
   * Garantit que tous les champs requis sont présents et typés correctement.
   */
  private normalizeStats(raw: unknown): UserStats {
    const defaults = this.getDefaultStats();
    if (!raw || typeof raw !== 'object' || raw === null) return defaults;
    
    const data = raw as Record<string, unknown>;
    
    // 1. Mastery (Object, not Array)
    const mastery = (typeof data.mastery === 'object' && data.mastery !== null && !Array.isArray(data.mastery))
      ? (data.mastery as Record<string, number>)
      : defaults.mastery;

    // 2. History (Array of XPPoint)
    const rawHistory = data.history;
    const history: XPPoint[] = Array.isArray(rawHistory)
      ? rawHistory.filter((p: unknown): p is XPPoint => {
          const point = p as Record<string, unknown>;
          return typeof point?.date === 'string' && typeof point?.xp === 'number';
        })
      : defaults.history;

    // 3. Duels (Array of DuelMatch)
    const rawDuels = data.duels;
    const duels: DuelMatch[] = Array.isArray(rawDuels)
      ? rawDuels.filter((d: unknown): d is DuelMatch => {
          const match = d as Record<string, unknown>;
          return typeof match?.id === 'string' && 
                 typeof match?.date === 'string' && 
                 typeof match?.myScore === 'number' &&
                 ['victory', 'defeat', 'draw'].includes(match?.status as string);
        })
      : defaults.duels;

    return {
      xp: typeof data.xp === 'number' ? data.xp : defaults.xp,
      gems: typeof data.gems === 'number' ? data.gems : defaults.gems,
      // 4. Energy Clamp (0-30)
      energy: typeof data.energy === 'number' ? Math.max(0, Math.min(30, data.energy)) : defaults.energy,
      // 5. Streak Clamp (>= 0)
      streakDays: typeof data.streakDays === 'number' ? Math.max(0, data.streakDays) : defaults.streakDays,
      mastery,
      history,
      duels,
      // 6. LastSync (String)
      lastSync: typeof data.lastSync === 'string' ? data.lastSync : defaults.lastSync
    };
  }

  private getDefaultStats(): UserStats {
    return {
      xp: 0,
      gems: 0,
      energy: 30,
      streakDays: 4, 
      mastery: {},
      history: [],
      duels: [],
      lastSync: new Date().toISOString(),
    };
  }
}
