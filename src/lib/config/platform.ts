// src/lib/config/platform.ts

export const PLATFORM_CONFIG = {
  name: 'BREVET MASTER',
  tagline: 'Prépare ton DNB 2026 avec intelligence',
  examDate: new Date('2025-06-26'),
  targetYear: 2026,

  grading: {
    controleContinuWeight: 0.40,
    epreuveTerminaleWeight: 0.60,
    subjects: [
      { slug: 'francais',      label: 'Français',           coef: 2,   points: 100 },
      { slug: 'maths',         label: 'Mathématiques',      coef: 2,   points: 100 },
      { slug: 'histoire_geo',  label: 'Histoire-Géo',       coef: 1.5, points: 75  },
      { slug: 'emc',           label: 'EMC',                coef: 0.5, points: 25  },
      { slug: 'sciences',      label: 'Sciences',           coef: 2,   points: 50  },
      { slug: 'oral',          label: 'Oral de soutenance', coef: 2,   points: 100 },
    ],
  },

  mathsExamStructure: {
    part1: {
      label: 'Automatismes',
      durationMinutes: 20,
      points: 20,
      calculatorAllowed: false,
    },
    part2: {
      label: 'Raisonnement et résolution de problèmes',
      durationMinutes: 100,
      points: 80,
      calculatorAllowed: true,
    },
  },

  masteryLevels: [
    { label: 'Insuffisant',   min: 0,    max: 0.25, color: '#EF4444', emoji: '😰' },
    { label: 'Fragile',       min: 0.25, max: 0.50, color: '#F59E0B', emoji: '😟' },
    { label: 'Satisfaisant',  min: 0.50, max: 0.75, color: '#10B981', emoji: '🙂' },
    { label: 'Très bonne',    min: 0.75, max: 1.01, color: '#3B82F6', emoji: '😄' },
  ],
} as const;
