import { describe, it, expect } from 'vitest';
import { generateLocalEmbedding } from '../services/aria/localEmbedding';

describe('Golden Embedding Protocol V1.1 (JS)', () => {
  
  it('should validate standard "ARIA" case', async () => {
    const v = await generateLocalEmbedding("ARIA");
    expect(v.findIndex(val => val > 0)).toBe(87);
    expect(v[87]).toBeCloseTo(1.0, 9);
  });

  it('should ignore punctuation and handle accents', async () => {
    const v1 = await generateLocalEmbedding("Thalès !");
    const v2 = await generateLocalEmbedding("thalès");
    expect(v1).toEqual(v2);
  });

  it('should always return unit vector (L2 norm = 1)', async () => {
    const texts = ["Hello world", "Calcul intégral", "Probabilités et Statistiques 2026"];
    for (const text of texts) {
      const v = await generateLocalEmbedding(text);
      const norm = Math.sqrt(v.reduce((a, b) => a + b * b, 0));
      expect(norm).toBeCloseTo(1.0, 9);
    }
  });

  it('should return zero vector for empty or non-alphanumeric text', async () => {
    const v = await generateLocalEmbedding(" !!! ??? ");
    const sum = v.reduce((a, b) => a + b, 0);
    expect(sum).toBe(0);
  });

});
