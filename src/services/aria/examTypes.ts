import { z } from "zod";

export const ExamSummarySchema = z.object({
  examId: z.string(),
  subject: z.string(),
  score20: z.number(),
  timeSpentMinutes: z.number(),
  mistakesByNotion: z.record(z.string(), z.array(z.string())), // notionId -> [questionIds]
  totalQuestions: z.number()
});

export const AriaActionSchema = z.object({
  label: z.string(),
  description: z.string(),
  route: z.string(), // ex: "/learn/maths/thales"
  priority: z.enum(["HAUTE", "MOYENNE", "BASSE"])
});

export const AriaRevisionPlanSchema = z.object({
  analysis: z.string(),
  actions: z.array(AriaActionSchema).max(3),
  confidence: z.number()
});

export type ExamSummary = z.infer<typeof ExamSummarySchema>;
export type AriaAction = z.infer<typeof AriaActionSchema>;
export type AriaRevisionPlan = z.infer<typeof AriaRevisionPlanSchema>;
