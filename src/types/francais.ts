import { z } from "zod";

export const GradingCriteriaSchema = z.object({
  label: z.string(),
  maxPoints: z.number(),
  description: z.string()
});

export const FrenchQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['qcm', 'short_answer', 'rewriting', 'dictation_segment']),
  instruction: z.string(),
  placeholder: z.string().optional(),
  correctAnswer: z.union([z.string(), z.number()]).optional(),
  toleranceRegex: z.string().optional(),
  points: z.number(),
  options: z.array(z.string()).optional(),
  explanation: z.string().optional()
});

export const FrenchMetadataSchema = z.object({
  license: z.enum(['original', 'public-domain']),
  author: z.string().optional(),
  sourceRef: z.string().optional()
});

export const FrenchExerciseSchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: z.enum(['comprehension', 'langue', 'dictee', 'redaction']),
  supportText: z.string().optional(),
  supportImage: z.string().optional(),
  audioUrl: z.string().optional(),
  difficulty: z.number().min(1).max(4),
  energyCost: z.number(),
  xpReward: z.number(),
  metadata: FrenchMetadataSchema,
  questions: z.array(FrenchQuestionSchema),
  rubric: z.array(GradingCriteriaSchema)
});

export const FrenchContentPackSchema = z.object({
  version: z.string(),
  subject: z.literal("francais"),
  lastUpdated: z.string(),
  metadata: z.object({ license: z.string() }).optional(),
  exercises: z.array(FrenchExerciseSchema)
});

export type FrenchMode = z.infer<typeof FrenchExerciseSchema>["mode"];
export type FrenchQuestion = z.infer<typeof FrenchQuestionSchema>;
export type GradingCriteria = z.infer<typeof GradingCriteriaSchema>;
export type FrenchExercise = z.infer<typeof FrenchExerciseSchema>;
export type FrenchContentPack = z.infer<typeof FrenchContentPackSchema>;
