import { z } from "zod";

export const CitationSchema = z.object({
  chunkId: z.string(),
  source: z.string(),
  excerpt: z.string(),
  relevance: z.number().min(0).max(1),
  pageNumber: z.union([z.number(), z.string()]).optional(),
  url: z.string().optional()
});

export const RetrievedChunkSchema = z.object({
  id: z.string(),
  text: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  score: z.number().min(0).max(1)
});

export const SuggestedActionSchema = z.string();

export const AriaResponseSchema = z.object({
  answerMarkdown: z.string(),
  citations: z.array(CitationSchema),
  suggestedActions: z.array(SuggestedActionSchema),
  confidence: z.number().min(0).max(1),
  coverage: z.number(),
  isMock: z.boolean().default(false),
  refusalReason: z.string().optional()
});

export const AriaQueryRequestSchema = z.object({
  query: z.string().min(1),
  context: z.object({
    subject: z.string(),
    notionId: z.string().optional(),
    lastError: z.string().optional()
  }),
  studentProfile: z.object({
    rank: z.string(),
    mastery: z.number(),
    bloomLevel: z.string()
  })
});

export type Citation = z.infer<typeof CitationSchema>;
export type RetrievedChunk = z.infer<typeof RetrievedChunkSchema>;
export type AriaResponse = z.infer<typeof AriaResponseSchema>;
export type AriaQueryRequest = z.infer<typeof AriaQueryRequestSchema>;
