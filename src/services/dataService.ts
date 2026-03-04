import { UserStats } from "@/types/game";

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
   * Garantit que tous les champs requis sont présents sans écraser les données existantes.
   */
  private normalizeStats(raw: unknown): UserStats {
    const defaults = this.getDefaultStats();
    if (!raw || typeof raw !== 'object') return defaults;
    
    const data = raw as Partial<UserStats>;
    
    return {
      ...defaults,
      ...data,
      // On force l'initialisation des tableaux/objets s'ils sont null ou undefined dans data
      mastery: data.mastery || {},
      history: data.history || [],
      duels: data.duels || [],
      // lastSync est conservé s'il existe, sinon on prend celui du default
      lastSync: data.lastSync || defaults.lastSync
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
