import { describe, it, expect } from 'vitest';
import { enforcePolicy } from '../services/aria/policy';
import { RetrievedChunk } from '../services/aria/types';

describe('Aria: PDF Citations Wiring', () => {
  
  const mockChunks: RetrievedChunk[] = [
    {
      id: 'doc1:1:0',
      text: "Le théorème de Thalès permet de calculer des longueurs dans un triangle.",
      score: 0.95,
      metadata: {
        sourceFile: "geometrie.pdf",
        page: 12
      }
    }
  ];

  it('should extract citations with PDF sourceFile and page', () => {
    // Une seule unité, 100% citée
    const draft = "Le théorème de Thalès permet de calculer des longueurs. [Source:doc1:1:0]";
    const result = enforcePolicy(draft, mockChunks, "Thalès");

    expect(result.citations.length).toBe(1);
    expect(result.citations[0].source).toBe("geometrie.pdf");
    expect(result.citations[0].pageNumber).toBe("12");
  });

  it('should use sourceTitle as priority over sourceFile', () => {
    const chunks: RetrievedChunk[] = [{
      ...mockChunks[0],
      metadata: {
        sourceTitle: "Cours de Maths",
        sourceFile: "geometrie.pdf",
        page: 12
      }
    }];
    const draft = "Thalès est une notion de géométrie plane. [Source:doc1:1:0]";
    const result = enforcePolicy(draft, chunks);

    expect(result.citations.length).toBe(1);
    expect(result.citations[0].source).toBe("Cours de Maths");
  });

});
