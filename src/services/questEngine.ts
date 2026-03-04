import { Quest, DailyQuestState, QuestType } from "@/types/quests";
import { UserStats } from "@/types/game";
import { Notion } from "@/types/curriculum";

export interface NotionWithSubject extends Notion {
  subject: string;
}

// Seed random number generator simple basé sur la date pour la stabilité
function getSeededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export class QuestEngine {
  
  /**
   * Génère les 3 quêtes du jour basées sur la maîtrise de l'élève.
   * Reçoit la liste des notions déjà chargées pour rester synchrone.
   */
  static generateDailyQuests(stats: UserStats, dateStr: string, allNotions: NotionWithSubject[]): DailyQuestState {
    const seed = parseInt(dateStr.replace(/-/g, ''));
    const random = () => getSeededRandom(seed);
    
    const quests: Quest[] = [];
    const mastery = stats.mastery || {};
    
    if (allNotions.length === 0) {
      return { date: dateStr, quests: [] };
    }

    // 1. Quête de Remédiation (Mastery < 40 ou Notion non commencée)
    const weakNotions = allNotions.filter(n => (mastery[n.id] || 0) < 40);
    const targetWeak = weakNotions.length > 0 
      ? weakNotions[Math.floor(random() * weakNotions.length)] 
      : allNotions[Math.floor(random() * allNotions.length)];
      
    quests.push({
      id: `rem_${targetWeak.id}_${dateStr}`,
      title: `Remédiation : ${targetWeak.title}`,
      description: "Améliore ta maîtrise sur cette notion fragile.",
      xpReward: 100,
      gemsReward: 10,
      progress: 0,
      isCompleted: false,
      criteria: { type: 'complete_notion', target: 1, notionId: targetWeak.id, subject: targetWeak.subject }
    });

    // 2. Quête de Consolidation (Mastery 40-70)
    const midNotions = allNotions.filter(n => {
      const m = mastery[n.id] || 0;
      return m >= 40 && m < 80;
    });
    const targetMid = midNotions.length > 0 
      ? midNotions[Math.floor(random() * midNotions.length)] 
      : allNotions[Math.floor(random() * allNotions.length)];

    quests.push({
      id: `cons_${targetMid.id}_${dateStr}`,
      title: `Consolidation : ${targetMid.title}`,
      description: "Atteins le niveau de maîtrise pour sécuriser ces points.",
      xpReward: 80,
      gemsReward: 5,
      progress: 0,
      isCompleted: false,
      criteria: { type: 'score_min', target: 80, notionId: targetMid.id, subject: targetMid.subject }
    });

    // 3. Quête de Défi
    const isExamDay = random() > 0.7;
    if (isExamDay) {
      quests.push({
        id: `chal_exam_${dateStr}`,
        title: "Défi Examen Blanc",
        description: "Termine un examen blanc complet aujourd'hui.",
        xpReward: 300,
        gemsReward: 50,
        progress: 0,
        isCompleted: false,
        criteria: { type: 'exam', target: 1 }
      });
    } else {
      quests.push({
        id: `chal_streak_${dateStr}`,
        title: "Défi de Constance",
        description: "Maintiens ton streak ou valide une série parfaite (100%) sur n'importe quel quiz.",
        xpReward: 50,
        gemsReward: 15,
        progress: 0,
        isCompleted: false,
        criteria: { type: 'score_min', target: 100 }
      });
    }

    return { date: dateStr, quests };
  }

  static processAction(currentQuests: DailyQuestState, action: { type: QuestType, scorePercent?: number, notionId?: string }): { updatedQuests: DailyQuestState, newlyCompleted: Quest[] } {
    let changed = false;
    const newlyCompleted: Quest[] = [];

    const updatedQuestsData = currentQuests.quests.map(q => {
      if (q.isCompleted) return q;

      let newProgress = q.progress;

      if (q.criteria.type === 'complete_notion' && action.type === 'complete_notion') {
        if (!q.criteria.notionId || q.criteria.notionId === action.notionId) {
          newProgress += 1;
        }
      } 
      else if (q.criteria.type === 'score_min' && action.type === 'complete_notion' && action.scorePercent !== undefined) {
        if ((!q.criteria.notionId || q.criteria.notionId === action.notionId) && action.scorePercent >= q.criteria.target) {
           newProgress = q.criteria.target;
        }
      }
      else if (q.criteria.type === 'exam' && action.type === 'exam') {
        newProgress += 1;
      }

      if (newProgress >= q.criteria.target && !q.isCompleted) {
        newlyCompleted.push({...q, isCompleted: true, progress: newProgress});
        changed = true;
        return { ...q, isCompleted: true, progress: newProgress };
      }

      if (newProgress !== q.progress) {
        changed = true;
        return { ...q, progress: newProgress };
      }

      return q;
    });

    return {
      updatedQuests: changed ? { ...currentQuests, quests: updatedQuestsData } : currentQuests,
      newlyCompleted
    };
  }
}
