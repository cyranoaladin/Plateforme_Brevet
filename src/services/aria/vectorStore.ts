import { QdrantClient } from '@qdrant/js-client-rest';
import { v5 as uuidv5 } from 'uuid';
import { RetrievedChunk } from './types';
import { generateLocalEmbedding } from './localEmbedding';
import { env } from '@/config/env';
import { logger } from '@/utils/security/logger';
import { z } from 'zod';

const COLLECTION_NAME = "aria_docs";
const VECTOR_SIZE = 384;
const SEARCH_TIMEOUT_MS = env.QDRANT_TIMEOUT_MS || 2500;

// Qdrant only accepts point IDs that are an unsigned 64-bit integer or a
// UUID string - it rejects arbitrary strings like "1" or "docId:page:0"
// (the shapes callers actually pass in via scripts/ingest-pdfs.ts's
// chunker and the debug seed route) with a 400 Bad Request. Rather than
// pushing that constraint onto every caller, chunk ids are deterministically
// mapped to a UUIDv5 here (stable across re-ingestion/re-seeding, so
// upserts of the same logical chunk stay idempotent) and the original,
// human-meaningful id is preserved in the payload as "chunkId" - that's
// what search() below surfaces back as RetrievedChunk.id, since it is what
// gets embedded in the LLM prompt and validated against [Source:ID]
// citation markers (see ariaPromptBuilder.ts / policy.ts).
const QDRANT_ID_NAMESPACE = "b6f0a2c4-6b8e-4f9a-9c1d-2e6f7a8b9c0d";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toQdrantPointId(chunkId: string): string {
  return UUID_RE.test(chunkId) ? chunkId : uuidv5(chunkId, QDRANT_ID_NAMESPACE);
}

/**
 * Schéma de validation pour le payload Qdrant.
 * On autorise des champs arbitraires pour la flexibilité du RAG.
 */
const QdrantPointSchema = z.object({
  id: z.union([z.string(), z.number()]),
  score: z.number(),
  payload: z.object({
    text: z.string(),
    chunkId: z.string().optional(),
    sourceTitle: z.string().optional(),
    sourceFile: z.string().optional(),
    page: z.number().optional(),
    pageNumber: z.number().optional(),
    docId: z.string().optional(),
    chunkIndex: z.number().optional(),
    subject: z.string().optional(),
    year: z.number().optional(),
    docType: z.string().optional(),
  }).and(z.record(z.string(), z.unknown())).optional(),
});

const QdrantSearchResponseSchema = z.array(QdrantPointSchema);

export type VectorStoreErrorCode = "TIMEOUT" | "BREAKER_OPEN" | "QDRANT_ERROR";

let failureCount = 0;
let lastFailureTime = 0;
const BREAKER_THRESHOLD = 3;
const BREAKER_RESET_MS = 30000;

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), ms)
  );
  return Promise.race([promise, timeout]);
}

export class VectorStoreService {
  private static client = new QdrantClient({
    url: env.QDRANT_URL,
    checkCompatibility: env.QDRANT_CHECK_COMPATIBILITY,
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

  /**
   * Insère des chunks avec métadonnées flexibles.
   */
  static async upsertChunks(chunks: Array<{
    id: string;
    text: string;
    metadata: Record<string, unknown>;
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
        id: toQdrantPointId(chunk.id),
        vector: await generateLocalEmbedding(chunk.text),
        payload: {
          text: chunk.text,
          // chunkId must win over anything with the same key in
          // chunk.metadata (spread first, canonical field last): it is
          // what search() relies on to recover the real, citable id (see
          // toQdrantPointId above), so it must never be silently
          // clobbered by caller-supplied metadata.
          ...chunk.metadata,
          chunkId: chunk.id
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

      const rawResults = await withTimeout(searchPromise, SEARCH_TIMEOUT_MS);
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
          // Prefer the original chunkId stashed in the payload (see
          // upsertChunks/toQdrantPointId above): the raw Qdrant point id is
          // a UUID derived for storage purposes only and was never the
          // caller-meaningful identifier used in [Source:ID] citations.
          // Falls back to r.id for points written before this field
          // existed, or by any other producer of this collection.
          id: String(r.payload?.chunkId ?? r.id),
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
