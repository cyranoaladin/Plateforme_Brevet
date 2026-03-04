export type BloomLevel = 'N1_MEMORISATION' | 'N2_COMPREHENSION' | 'N3_APPLICATION' | 'N4_ANALYSE';
export type Difficulty = 'FACILE' | 'MOYEN' | 'DIFFICILE' | 'EXPERT';
export type SubjectId = 'maths' | 'francais' | 'hg_emc' | 'sciences';

export interface Prerequisite {
  id: string;
  label: string;
}

export interface LearningItem {
  id: string;
  type: 'text' | 'formula' | 'video' | 'interactive';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Question {
  id: string;
  type: 'qcm' | 'vrai_faux' | 'reponse_courte';
  bloom: BloomLevel;
  difficulty: Difficulty;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface Notion {
  id: string;
  title: string;
  objectives: string[];
  prerequisites: Prerequisite[];
  estimatedDuration: number;
  bloomTarget: BloomLevel;
  onboarding: {
    hook: string;
    keyPoints: string[];
  };
  lesson: LearningItem[];
  quiz: {
    energyCost: number;
    xpReward: number;
    gemsReward: number;
    questions: Question[];
  };
}

export interface ContentPack {
  version: string;
  subject: SubjectId;
  lastUpdated: string;
  notions: Notion[];
}
