import { VectorStoreService } from "./vectorStore";
import { RetrievedChunk } from "./types";

export class RetrievalService {
  
  /**
   * Orchestre la recherche hybride (Vectorielle + Re-ranking basique).
   */
  static async hybridRetrieval(query: string): Promise<RetrievedChunk[]> {
    // 1. Recherche vectorielle
    const { chunks, error } = await VectorStoreService.search(query);
    
    if (error) {
      console.warn(`[RETRIEVAL] Vector search returned error: ${error}`);
    }

    // 2. Re-ranking (Placeholder pour futur modèle de reranking)
    // Ici on trie simplement par score de confiance
    return this.rerank(chunks);
  }

  static rerank(chunks: RetrievedChunk[]): RetrievedChunk[] {
    return chunks.sort((a, b) => b.score - a.score);
  }
}
