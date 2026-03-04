import { z } from "zod";

export const ScienceSubjectSchema = z.enum(['physique_chimie', 'svt', 'technologie']);
export type ScienceSubject = z.infer<typeof ScienceSubjectSchema>;

export const SciencePairSchema = z.tuple([ScienceSubjectSchema, ScienceSubjectSchema]);
export type SciencePair = z.infer<typeof SciencePairSchema>;

export const ScienceQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['qcm', 'short_answer']),
  instruction: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  points: z.number(),
  explanation: z.string()
});

export const ScienceExerciseSchema = z.object({
  id: z.string(),
  subject: ScienceSubjectSchema,
  title: z.string(),
  difficulty: z.number().min(1).max(4),
  content: z.string(), // Support documentaire (texte ou description d'expérience)
  questions: z.array(ScienceQuestionSchema)
});

export const ScienceContentPackSchema = z.object({
  version: z.string(),
  subject: z.literal("sciences"),
  lastUpdated: z.string(),
  exercises: z.array(ScienceExerciseSchema)
});

export type ScienceExercise = z.infer<typeof ScienceExerciseSchema>;
export type ScienceQuestion = z.infer<typeof ScienceQuestionSchema>;
