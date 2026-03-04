import { RetrievedChunk } from "./types";
import { getLlmProvider } from "./llmProvider";
import { env } from "@/config/env";

/**
 * Service de Re-ranking pour affiner la pertinence des résultats RAG.
 */
export class RerankService {
  
  static async rerank(query: string, chunks: RetrievedChunk[]): Promise<RetrievedChunk[]> {
    if (chunks.length <= 1) return chunks;

    const providerType = env.ARIA_RERANK_PROVIDER;

    // Activation du reranking seulement si explicitement demandé et clé dispo (si applicable)
    if (providerType === "llm") {
      const hasApiKey = env.ARIA_LLM_PROVIDER === 'openai' ? !!env.OPENAI_API_KEY : !!env.OPENROUTER_API_KEY;
      
      if (hasApiKey || env.ARIA_LLM_PROVIDER === 'mock') {
        return this.llmRerank(query, chunks);
      }
    }

    // Fallback : Tri par score de similarité brute (Vector Store default)
    return chunks.sort((a, b) => b.score - a.score);
  }

  private static async llmRerank(query: string, chunks: RetrievedChunk[]): Promise<RetrievedChunk[]> {
    const provider = getLlmProvider();
    
    const context = chunks.map((c, i) => `[${i}] ${c.text.substring(0, 300)}`).join("\n\n");
    
    const prompt = `
      QUESTION : "${query}"
      DOCUMENTS :
      ${context}
      TÂCHE : Réponds UNIQUEMENT par une liste d'indices (ex: 2,0,1) classés par pertinence.
    `.trim();

    try {
      const response = await Promise.race([
        provider.generate([{ role: 'user', content: prompt }]),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 2000))
      ]);

      if (!response) return chunks;

      const order = response.text.split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && id >= 0 && id < chunks.length);
      
      const reranked = [...chunks];
      const ordered = order.map(idx => chunks[idx]);
      const remaining = reranked.filter(c => !ordered.includes(c));

      return [...ordered, ...remaining];

    } catch (e) {
      console.warn("[RERANK] Using base scores due to:", e instanceof Error ? e.message : String(e));
      return chunks.sort((a, b) => b.score - a.score);
    }
  }
}
