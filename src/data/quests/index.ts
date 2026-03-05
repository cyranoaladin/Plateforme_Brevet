// src/data/quests/index.ts
export type QuestType = 'daily' | 'weekly' | 'story' | 'challenge' | 'exam';
export type QuestStatus = 'locked' | 'available' | 'in_progress' | 'completed' | 'claimed';

export interface QuestObjective {
  type: 'complete_exercises' | 'get_score' | 'chain_correct' | 'study_subject' | 'use_flashcards' | 'win_duel';
  value: number;
  subjectSlug?: string;
  chapterId?: string;
  description: string;
}

export interface Quest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  objectives: QuestObjective[];
  xpReward: number;
  gemReward: number;
  badge?: string;
  unlockCondition?: string;
  expiresInHours?: number;
}

export const QUESTS: Quest[] = [

  // ──────────── QUÊTES QUOTIDIENNES ────────────────────────────────
  {
    id: 'daily-maths-5',
    type: 'daily',
    title: '5 exercices de maths',
    description: 'L\'entraînement quotidien est la clé du succès ! Résous 5 exercices de maths aujourd\'hui.',
    objectives: [{ type: 'complete_exercises', value: 5, subjectSlug: 'maths', description: 'Résoudre 5 exercices de mathématiques' }],
    xpReward: 50,
    gemReward: 5,
    expiresInHours: 24,
  },
  {
    id: 'daily-flashcards-10',
    type: 'daily',
    title: 'Session de flashcards',
    description: 'Réactive ta mémoire avec 10 flashcards aujourd\'hui. La répétition espacée booste la mémorisation.',
    objectives: [{ type: 'use_flashcards', value: 10, description: 'Réviser 10 flashcards' }],
    xpReward: 30,
    gemReward: 3,
    expiresInHours: 24,
  },
  {
    id: 'daily-francais-3',
    type: 'daily',
    title: 'Rappel de français',
    description: 'Ne néglige pas le français ! Fais 3 exercices de langue ou littérature.',
    objectives: [{ type: 'complete_exercises', value: 3, subjectSlug: 'francais', description: 'Résoudre 3 exercices de français' }],
    xpReward: 30,
    gemReward: 3,
    expiresInHours: 24,
  },
  {
    id: 'daily-perfect-3',
    type: 'daily',
    title: 'Série parfaite ×3',
    description: 'Enchaîne 3 bonnes réponses consécutives dans n\'importe quelle matière.',
    objectives: [{ type: 'chain_correct', value: 3, description: 'Obtenir 3 bonnes réponses d\'affilée' }],
    xpReward: 40,
    gemReward: 4,
    expiresInHours: 24,
  },

  // ──────────── QUÊTES HEBDOMADAIRES ───────────────────────────────
  {
    id: 'weekly-all-subjects',
    type: 'weekly',
    title: 'Tour de France des matières',
    description: 'Révise au moins 2 exercices dans chaque matière principale cette semaine (Maths, Français, Histoire-Géo, Sciences).',
    objectives: [
      { type: 'complete_exercises', value: 2, subjectSlug: 'maths', description: '2 exercices de maths' },
      { type: 'complete_exercises', value: 2, subjectSlug: 'francais', description: '2 exercices de français' },
      { type: 'complete_exercises', value: 2, subjectSlug: 'histoire_geo', description: '2 exercices d\'histoire-géo' },
      { type: 'complete_exercises', value: 2, subjectSlug: 'sciences', description: '2 exercices de sciences' },
    ],
    xpReward: 200,
    gemReward: 20,
    expiresInHours: 168,
  },
  {
    id: 'weekly-duel-3',
    type: 'weekly',
    title: 'Gladiateur du savoir',
    description: 'Remporte 3 duels cette semaine. Chaque victoire t\'enrichit en XP et en expérience !',
    objectives: [{ type: 'win_duel', value: 3, description: 'Gagner 3 duels' }],
    xpReward: 150,
    gemReward: 15,
    expiresInHours: 168,
  },
  {
    id: 'weekly-score-80',
    type: 'weekly',
    title: 'Objectif excellence',
    description: 'Obtiens un score moyen ≥ 80% sur 10 exercices cette semaine.',
    objectives: [{ type: 'get_score', value: 80, description: 'Score moyen ≥ 80% sur 10 exercices' }],
    xpReward: 250,
    gemReward: 25,
    expiresInHours: 168,
  },

  // ──────────── QUÊTES HISTOIRE (PROGRESSION) ──────────────────────
  {
    id: 'story-maths-foundations',
    type: 'story',
    title: 'Les fondations du savoir mathématique',
    description: 'Maîtrise tous les chapitres fondamentaux des maths : automatismes, arithmétique et calcul littéral.',
    objectives: [
      { type: 'study_subject', value: 1, chapterId: 'maths-automatismes', description: 'Terminer le chapitre Automatismes' },
      { type: 'study_subject', value: 1, chapterId: 'maths-arithmetique', description: 'Terminer le chapitre Arithmétique' },
      { type: 'study_subject', value: 1, chapterId: 'maths-calcul-litteral', description: 'Terminer le chapitre Calcul littéral' },
    ],
    xpReward: 300,
    gemReward: 30,
    badge: 'MATHS_FOUNDATION',
  },
  {
    id: 'story-histoire-ww',
    type: 'story',
    title: 'Mémoire des guerres',
    description: 'Explore les deux guerres mondiales et comprends les enjeux du XXe siècle.',
    objectives: [
      { type: 'study_subject', value: 1, chapterId: 'hg-ww1', description: 'Terminer WW1' },
      { type: 'study_subject', value: 1, chapterId: 'hg-ww2', description: 'Terminer WW2' },
    ],
    xpReward: 200,
    gemReward: 20,
    badge: 'HISTORIEN',
  },

  // ──────────── QUÊTES DÉFI ─────────────────────────────────────────
  {
    id: 'challenge-pythagore-master',
    type: 'challenge',
    title: 'Maître Pythagore',
    description: 'Résous 10 exercices sur le théorème de Pythagore avec un score de 100%.',
    objectives: [{ type: 'complete_exercises', value: 10, chapterId: 'maths-geometrie-plane', description: '10 exercices Pythagore avec 100%' }],
    xpReward: 500,
    gemReward: 50,
    badge: 'PYTHAGORAS',
    unlockCondition: 'story-maths-foundations',
  },

  // ──────────── QUÊTES EXAMEN ───────────────────────────────────────
  {
    id: 'exam-brevet-blanc-1',
    type: 'exam',
    title: 'Brevet Blanc — Mathématiques',
    description: 'Passe le premier brevet blanc en mathématiques dans les conditions réelles (2h, calculatrice autorisée pour la 2e partie).',
    objectives: [{ type: 'get_score', value: 50, subjectSlug: 'maths', description: 'Obtenir au moins 50/100 au brevet blanc de maths' }],
    xpReward: 500,
    gemReward: 50,
    badge: 'EXAM_BLANC_MATHS',
  },
];

/**
 * Retrieve quests filtered by type.
 */
export const getQuestsByType = (type: QuestType): Quest[] =>
  QUESTS.filter(q => q.type === type);

/**
 * Retrieve a quest by its unique ID.
 */
export const getQuestById = (id: string): Quest | undefined =>
  QUESTS.find(q => q.id === id);
