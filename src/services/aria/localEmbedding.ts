import { createHash } from 'crypto';

const VECTOR_SIZE = 384;

/**
 * HBOW MD5 Vectorizer (Standard V1.1)
 * Garantit une parité absolue avec l'ingestion Python.
 */
export async function generateLocalEmbedding(text: string): Promise<number[]> {
  const vector = new Array(VECTOR_SIZE).fill(0);
  
  // 1. Tokenisation stricte (Regex standardisée)
  const tokens = text.toLowerCase().match(/[a-z0-9à-ÿ]+/g) || [];

  if (tokens.length === 0) return vector;

  // 2. Hashing et Accumulation
  for (const token of tokens) {
    const hash = createHash('md5').update(token).digest('hex');
    const index = Number(BigInt('0x' + hash) % BigInt(VECTOR_SIZE));
    vector[index] += 1;
  }

  // 3. Normalisation L2 (Floats natifs, pas d'arrondi manuel)
  const squareSum = vector.reduce((acc, val) => acc + val * val, 0);
  const magnitude = Math.sqrt(squareSum);

  if (magnitude === 0) return vector;
  return vector.map(v => v / magnitude);
}
