export type QuestType = 'complete_notion' | 'score_min' | 'streak' | 'exam' | 'flash_automatisme';

export interface QuestCriteria {
  type: QuestType;
  target: number; // ex: 1 pour complete_notion, 15 pour score_min, 3 pour streak
  subject?: string;
  notionId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  gemsReward: number;
  criteria: QuestCriteria;
  progress: number;
  isCompleted: boolean;
}

export interface DailyQuestState {
  date: string; // Format YYYY-MM-DD
  quests: Quest[];
}
