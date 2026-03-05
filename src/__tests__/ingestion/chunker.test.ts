import { describe, it, expect } from 'vitest';
import { chunkText } from '../../services/ingestion/chunker';

describe('Ingestion: Chunker Hardening', () => {
  
  const meta = { docId: 'test', sourceFile: 'file.pdf', page: 1 };

  it('should throw error for invalid configuration', () => {
    expect(() => chunkText("test", { chunkSize: 0, overlap: 0 }, meta)).toThrow("INGEST_INVALID_CHUNK_CONFIG");
    expect(() => chunkText("test", { chunkSize: 10, overlap: 10 }, meta)).toThrow("INGEST_INVALID_CHUNK_CONFIG");
  });

  it('should respect word boundaries and proceed to next chunk', () => {
    const text = "Hello my friend today";
    // "Hello my f" is 10 chars. 
    // lastIndex of ' ' within 10 is 8 (after "my")
    // Chunk 1: "Hello my"
    // Chunk 2: starts at 9, next 10 chars: "friend tod"
    const chunks = chunkText(text, { chunkSize: 10, overlap: 0 }, meta);
    
    expect(chunks[0].text).toBe("Hello my");
    expect(chunks[1].text).toBe("friend tod");
  });

  it('should handle overlap correctly with word boundaries', () => {
    const text = "Alpha Beta Gamma Delta"; 
    const chunks = chunkText(text, { chunkSize: 10, overlap: 5 }, meta);
    
    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks[0].text).toBe("Alpha Beta");
  });

  it('should not create redundant final chunks', () => {
    const text = "Exactly ten"; // 11 chars
    const chunks = chunkText(text, { chunkSize: 11, overlap: 0 }, meta);
    expect(chunks.length).toBe(1);
    expect(chunks[0].text).toBe("Exactly ten");
  });

});
