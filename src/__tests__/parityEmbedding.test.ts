import { describe, it, expect } from 'vitest';
import { generateLocalEmbedding } from '../services/aria/localEmbedding';
import parityFixtures from './fixtures/embedding_parity.json';

describe('Embedding Parity (Python vs JS)', () => {
  
  const TOLERANCE = 1e-7;

  it('should match Python-generated vectors exactly (within tolerance)', async () => {
    for (const fixture of parityFixtures) {
      const jsVector = await generateLocalEmbedding(fixture.text);
      const pythonVector = fixture.vector;

      expect(jsVector.length).toBe(pythonVector.length);
      
      for (let i = 0; i < jsVector.length; i++) {
        const diff = Math.abs(jsVector[i] - pythonVector[i]);
        if (diff > TOLERANCE) {
          console.error(`Parity mismatch on text: "${fixture.text}" at index ${i}`);
          console.error(`JS: ${jsVector[i]}, Python: ${pythonVector[i]}, Diff: ${diff}`);
        }
        expect(diff).toBeLessThan(TOLERANCE);
      }
    }
  });

});
