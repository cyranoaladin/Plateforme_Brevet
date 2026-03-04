import { describe, it, expect } from 'vitest';
import { enforcePolicy, computeCoverage, getInformativeUnits } from '../services/aria/policy';
import { RetrievedChunk } from '../services/aria/types';

describe('ARIA Verifiability V2 (Markdown Units)', () => {
  
  const mockChunks: RetrievedChunk[] = [
    { id: 'c1', text: 'Thalès est utile.', score: 0.9, metadata: { sourceTitle: 'BO' } },
    { id: 'c2', text: 'Pythagore aussi.', score: 0.85, metadata: { sourceTitle: 'BO' } }
  ];

  it('should identify informative units correctly', () => {
    const text = "# Titre\n\nParagraphe 1 significatif.\n* Item 1 de liste significatif\n* Courte\n\nParagraphe 2.";
    const units = getInformativeUnits(text);
    // On s'attend à 3 unités (P1, Item 1, P2). "Courte" est ignoré (< 15 chars).
    expect(units.length).toBe(3);
  });

  it('should calculate coverage ratio correctly for lists', () => {
    const text = "Paragraphe cité [Source:c1].\n* Item cité [Source:c2]\n* Item non cité.";
    const { ratio } = computeCoverage(text, ['c1', 'c2']);
    expect(ratio).toBe(0.67); // 2/3
  });

  it('should refuse if an unknown marker is used (Anti-Invention)', () => {
    const text = "Affirmation [Source:unknown-id].";
    const result = enforcePolicy(text, mockChunks);
    expect(result.refusalReason).toContain("sources inexistantes");
  });

  it('should refuse short response with incomplete coverage (threshold 100%)', () => {
    const text = "Unité citée [Source:c1].\nUnité non citée.";
    const result = enforcePolicy(text, mockChunks);
    expect(result.refusalReason).toContain("inférieur au seuil requis");
  });

  it('should accept long response with high coverage (threshold 85%)', () => {
    const text = `
      P1 cité [Source:c1].
      P2 cité [Source:c2].
      P3 cité [Source:c1].
      P4 cité [Source:c2].
      P5 cité [Source:c1].
      P6 cité [Source:c2].
      P7 non cité.
    `.trim();
    // 6/7 = 0.86 (Passes threshold 0.85)
    const result = enforcePolicy(text, mockChunks);
    expect(result.answerMarkdown).toBe(text);
    expect(result.coverage).toBe(0.86);
  });

});
