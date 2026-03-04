import { z } from "zod";

export const HgEmcDocumentSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'map', 'image']),
  content: z.string(), // Le texte, l'URL de l'image ou le code SVG
  title: z.string(),
  source: z.string(),
  license: z.enum(['original', 'public-domain'])
});

export const HgEmcQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['qcm', 'short_answer']),
  instruction: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.number()]),
  toleranceRegex: z.string().optional(),
  points: z.number(),
  explanation: z.string()
});

export const HgEmcActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  mode: z.enum(['histoire', 'geographie', 'emc']),
  difficulty: z.number().min(1).max(4),
  energyCost: z.number(),
  xpReward: z.number(),
  documents: z.array(HgEmcDocumentSchema),
  questions: z.array(HgEmcQuestionSchema)
});

export const HgEmcContentPackSchema = z.object({
  version: z.string(),
  subject: z.literal("hg_emc"),
  lastUpdated: z.string(),
  activities: z.array(HgEmcActivitySchema)
});

export type HgEmcMode = z.infer<typeof HgEmcActivitySchema>["mode"];
export type HgEmcDocument = z.infer<typeof HgEmcDocumentSchema>;
export type HgEmcQuestion = z.infer<typeof HgEmcQuestionSchema>;
export type HgEmcActivity = z.infer<typeof HgEmcActivitySchema>;
export type HgEmcContentPack = z.infer<typeof HgEmcContentPackSchema>;
