import { describe, it, expect } from 'vitest';
import { chunkText } from '../../services/ingestion/chunker';

describe('Ingestion: Chunker Logic', () => {
  
  const meta = { docId: 'test', sourceFile: 'file.pdf', page: 1 };

  it('should clean text by removing extra whitespaces and newlines', () => {
    const text = "  Hello   \n\n  World  ";
    const chunks = chunkText(text, { chunkSize: 100, overlap: 0 }, meta);
    expect(chunks[0].text).toBe("Hello World");
  });

  it('should split text into chunks of specified size', () => {
    const text = "12345678901234567890"; // 20 chars
    const chunks = chunkText(text, { chunkSize: 10, overlap: 0 }, meta);
    expect(chunks.length).toBe(2);
    expect(chunks[0].text).toBe("1234567890");
    expect(chunks[1].text).toBe("1234567890");
  });

  it('should handle overlap correctly', () => {
    const text = "12345678901234567890"; // 20 chars
    // Chunk 1: 0-10 (1234567890)
    // Overlap 5: Start 2 at 10-5 = 5. End at 5+10 = 15.
    // Chunk 2: 5-15 (6789012345)
    // Chunk 3: 10-20 (1234567890)
    const chunks = chunkText(text, { chunkSize: 10, overlap: 5 }, meta);
    expect(chunks.length).toBe(3);
    expect(chunks[0].text).toBe("1234567890");
    expect(chunks[1].text).toBe("6789012345");
    expect(chunks[2].text).toBe("1234567890");
  });

  it('should return empty array for empty input', () => {
    const chunks = chunkText("   ", { chunkSize: 10, overlap: 0 }, meta);
    expect(chunks).toEqual([]);
  });

});
