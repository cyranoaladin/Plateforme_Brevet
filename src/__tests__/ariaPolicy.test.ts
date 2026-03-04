import { describe, it, expect } from 'vitest';
import { enforcePolicy, computeCoverage } from '../services/aria/policy';
import { RetrievedChunk } from '../services/aria/types';

describe('ARIA Safety Policy', () => {
  
  const mockChunks: RetrievedChunk[] = [{ id: '1', text: 'Source content', score: 0.9, metadata: {} }];

  it('should refuse answer if chunks are empty', () => {
    const result = enforcePolicy("Ceci est une réponse de test sans chunks.", []);
    expect(result.confidence).toBe(0.35);
    expect(result.answerMarkdown).toContain("Je ne trouve pas cette information");
  });

  it('should calculate coverage correctly', () => {
    // Deux unités informatives longues (> 10 chars)
    const draft = "Première unité informative longue avec citation [Source:1].\nDeuxième unité informative longue sans citation.";
    const { ratio } = computeCoverage(draft, ['1']);
    expect(ratio).toBe(0.5); // 1 unité sur 2
  });

  it('should refuse if coverage is too low (< 70%)', () => {
    // 3 unités, 1 seule citée = 33% ( < 70% seuil par défaut )
    const draft = "Unité un citée [Source:1].\nUnité deux non citée du tout.\nUnité trois également non citée.";
    const result = enforcePolicy(draft, mockChunks);
    expect(result.refusalReason).toBeDefined();
    expect(result.refusalReason).toContain("inférieur au seuil requis");
  });

  it('should accept if coverage is >= 70% (ou 100% pour court)', () => {
    const draft = "Cette unique unité est parfaitement citée [Source:1].";
    const result = enforcePolicy(draft, mockChunks);
    expect(result.answerMarkdown).toBe(draft);
    expect(result.coverage).toBe(1);
  });

});
