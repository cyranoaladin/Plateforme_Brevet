// src/data/exercises/index.ts
import { MATHS_EXERCISES } from './maths';
import { FRANCAIS_EXERCISES } from './francais';
import { HISTOIRE_GEO_EXERCISES } from './histoire_geo';
import { SCIENCES_EXERCISES } from './sciences';

export type { Exercise, ExerciseType } from '@/types/exercise';

export const ALL_EXERCISES = [
  ...MATHS_EXERCISES,
  ...FRANCAIS_EXERCISES,
  ...HISTOIRE_GEO_EXERCISES,
  ...SCIENCES_EXERCISES,
];

/**
 * Filter exercises by chapter ID.
 */
export const getExercisesByChapter = (chapterId: string) =>
  ALL_EXERCISES.filter(e => e.chapterId === chapterId);

/**
 * Filter exercises by subject slug using ID prefix convention.
 */
export const getExercisesBySubject = (subjectSlug: string) => {
  const prefix = subjectSlug === 'histoire_geo' ? 'hg-' :
                 subjectSlug === 'francais' ? 'fr-' :
                 subjectSlug === 'maths' ? 'math-' :
                 subjectSlug === 'emc' ? 'hg-emc-' : 'sci-';
  return ALL_EXERCISES.filter(e => e.id.startsWith(prefix));
};

/**
 * Find a single exercise by its unique ID.
 */
export const getExerciseById = (id: string) =>
  ALL_EXERCISES.find(e => e.id === id);
