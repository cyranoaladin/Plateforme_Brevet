import { QdrantClient } from '@qdrant/js-client-rest';
import { RetrievedChunk } from './types';
import { generateLocalEmbedding } from './localEmbedding';
import { env } from '@/config/env';
import { logger } from '@/utils/security/logger';
import { z } from 'zod';

const COLLECTION_NAME = "aria_docs";
const VECTOR_SIZE = 384;
const SEARCH_TIMEOUT_MS = env.QDRANT_TIMEOUT_MS || 2500;

// Schéma de validation runtime pour la réponse Qdrant
const QdrantPointSchema = z.object({
  id: z.union([z.string(), z.number()]),
  score: z.number(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

const QdrantSearchResponseSchema = z.array(QdrantPointSchema);

/**
 * Codes d'erreurs normalisés pour le VectorStore.
 */
export type VectorStoreErrorCode = "TIMEOUT" | "BREAKER_OPEN" | "QDRANT_ERROR";

// État du Circuit Breaker
let failureCount = 0;
let lastFailureTime = 0;
const BREAKER_THRESHOLD = 3;
const BREAKER_RESET_MS = 30000;

/**
 * Helper de timeout générique.
 */
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), ms)
  );
  return Promise.race([promise, timeout]);
}

export class VectorStoreService {
  private static client = new QdrantClient({
    url: env.QDRANT_URL,
  });

  private static isBreakerOpen(): boolean {
    if (failureCount >= BREAKER_THRESHOLD) {
      const timeSinceLastFailure = Date.now() - lastFailureTime;
      if (timeSinceLastFailure < BREAKER_RESET_MS) {
        return true;
      }
      logger.info("[CIRCUIT BREAKER] Auto-resetting breaker after cool-down period.");
      failureCount = 0;
    }
    return false;
  }

  static async upsertChunks(chunks: Array<{
    id: string;
    text: string;
    sourceTitle?: string;
    subject: string;
    notionId?: string;
    year: number;
    docType: string;
    level?: string;
    pageNumber?: number;
    pageRange?: string;
  }>) {
    try {
      const collections = await this.client.getCollections();
      const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
      if (!exists) {
        await this.client.createCollection(COLLECTION_NAME, {
          vectors: { size: VECTOR_SIZE, distance: "Cosine" }
        });
      }

      const points = await Promise.all(chunks.map(async (chunk) => ({
        id: chunk.id,
        vector: await generateLocalEmbedding(chunk.text),
        payload: {
          text: chunk.text,
          sourceTitle: chunk.sourceTitle,
          subject: chunk.subject,
          notionId: chunk.notionId,
          year: chunk.year,
          docType: chunk.docType,
          level: chunk.level || "3e",
          pageNumber: chunk.pageNumber,
          pageRange: chunk.pageRange
        }
      })));

      await this.client.upsert(COLLECTION_NAME, { wait: true, points });
    } catch (e) {
      logger.error("Failed to upsert chunks to Qdrant", { error: String(e) });
      throw e;
    }
  }

  static async search(query: string, limit = 5): Promise<{ chunks: RetrievedChunk[], error?: VectorStoreErrorCode }> {
    if (this.isBreakerOpen()) {
      return { chunks: [], error: "BREAKER_OPEN" };
    }

    try {
      const vector = await generateLocalEmbedding(query);
      
      const searchPromise = this.client.search(COLLECTION_NAME, {
        vector,
        limit,
        with_payload: true,
      });

      // 1. Race avec timeout (renvoie unknown)
      const rawResults = await withTimeout(searchPromise, SEARCH_TIMEOUT_MS);

      // 2. Validation Runtime via Zod
      const validation = QdrantSearchResponseSchema.safeParse(rawResults);
      
      if (!validation.success) {
        logger.error("[QDRANT] Invalid response format from database", { error: validation.error.format() });
        failureCount++;
        return { chunks: [], error: "QDRANT_ERROR" };
      }

      const results = validation.data;

      if (failureCount > 0) failureCount--;

      return {
        chunks: results.map((r) => ({
          id: String(r.id),
          text: String(r.payload?.text || ""),
          score: r.score,
          metadata: r.payload || {}
        }))
      };

    } catch (e: unknown) {
      failureCount++;
      lastFailureTime = Date.now();
      
      const message = e instanceof Error ? e.message : String(e);
      const errorCode: VectorStoreErrorCode = message === "TIMEOUT" ? "TIMEOUT" : "QDRANT_ERROR";
      
      logger.error(`[VECTOR STORE ISSUE] ${errorCode}`, { count: failureCount, message });
      
      return { chunks: [], error: errorCode };
    }
  }
}
