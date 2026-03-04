import { describe, it, expect } from 'vitest';
import { getSmartExcerpt } from '../services/aria/excerpt';
import { RerankService } from '../services/aria/rerank';
import { RetrievedChunk } from '../services/aria/types';

describe('RAG Quality: Smart Excerpts', () => {
  
  const text = "Le théorème de Pythagore est fondamental. Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés. C'est une règle de géométrie antique.";

  it('should center the excerpt around the query terms', () => {
    const query = "carré hypoténuse";
    const excerpt = getSmartExcerpt(text, query, 100);
    expect(excerpt.toLowerCase()).toContain("carré de l'hypoténuse");
  });

  it('should fallback to start if no terms match', () => {
    const query = "mot-totalement-inconnu";
    const excerpt = getSmartExcerpt(text, query, 50);
    expect(excerpt.toLowerCase()).toContain("le théorème de pythagore");
  });

  it('should handle empty query gracefully', () => {
    const excerpt = getSmartExcerpt(text, "", 50);
    expect(excerpt.toLowerCase()).toContain("le théorème de pythagore");
  });

});

describe('RAG Quality: Reranking', () => {
  
  const mockChunks: RetrievedChunk[] = [
    { id: '1', text: 'Low relevance', score: 0.1, metadata: { sourceTitle: 'BO' } },
    { id: '2', text: 'High relevance', score: 0.9, metadata: { sourceTitle: 'BO' } }
  ];

  it('should sort by score by default (no rerank)', async () => {
    const results = await RerankService.rerank("test", mockChunks);
    expect(results[0].id).toBe('2');
  });

});
