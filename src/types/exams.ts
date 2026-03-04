export type ExamSubject = 'maths' | 'francais' | 'hg_emc' | 'sciences';

export interface ExamSession {
  id: string;
  examId: string;
  subject: ExamSubject;
  startTime: string;
  answers: Record<string, string | number>;
  timeLeft: number; // en secondes
  status: 'draft' | 'submitted' | 'graded';
}

import { Question } from "./curriculum";
import { FrenchQuestion } from "./francais";
import { HgEmcQuestion } from "./hg_emc";
import { ScienceQuestion } from "./sciences";

export type AllQuestionTypes = Question | FrenchQuestion | HgEmcQuestion | ScienceQuestion;

export interface ExamDefinition {
  id: string;
  title: string;
  subject: ExamSubject;
  duration: number; // minutes
  energyCost: number;
  xpReward: number; // Bonus de complétion
  sections: {
    id: string;
    title: string;
    points: number;
    questions: AllQuestionTypes[];
  }[];
}
