// src/types/exercise.ts
export type ExerciseType = 'qcm' | 'open' | 'matching' | 'ordering' | 'fill_blank';

export interface Exercise {
  id: string;
  chapterId: string;
  difficulty: 1 | 2 | 3;
  points: number;
  type: ExerciseType;
  question: string;
  choices?: string[];
  correctIndex?: number;
  answer?: string;
  explanation: string;
  hint: string;
  tags: string[];
  timeLimit?: number;
}
