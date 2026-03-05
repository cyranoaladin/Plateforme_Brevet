import { IngestionChunk, IngestionConfig } from "./types";

/**
 * Nettoie le texte et le découpe en chunks avec overlap.
 * Respecte les frontières de mots (espaces).
 */
export function chunkText(
  text: string, 
  config: IngestionConfig, 
  meta: { docId: string; sourceFile: string; page: number; subject?: string }
): IngestionChunk[] {
  if (config.chunkSize <= 0) throw new Error("INGEST_INVALID_CHUNK_CONFIG: chunkSize must be > 0");
  if (config.overlap < 0 || config.overlap >= config.chunkSize) {
    throw new Error("INGEST_INVALID_CHUNK_CONFIG: overlap must be >= 0 and < chunkSize");
  }

  const cleanText = text.replace(/\s+/g, ' ').trim();
  if (!cleanText) return [];

  const chunks: IngestionChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < cleanText.length) {
    let endIndex = Math.min(startIndex + config.chunkSize, cleanText.length);

    if (endIndex < cleanText.length) {
      const windowSize = Math.floor(config.chunkSize * 0.2);
      const lastSpace = cleanText.lastIndexOf(' ', endIndex);
      
      if (lastSpace >= endIndex - windowSize && lastSpace > startIndex) {
        endIndex = lastSpace;
      }
    }

    const content = cleanText.substring(startIndex, endIndex).trim();
    if (content) {
      chunks.push({
        id: `${meta.docId}:${meta.page}:${chunkIndex}`,
        text: content,
        metadata: { ...meta, chunkIndex }
      });
      chunkIndex++;
    }

    if (endIndex >= cleanText.length) break;

    // Calcul du prochain startIndex
    // On part de la fin de ce chunk et on recule de l'overlap
    startIndex = endIndex - config.overlap;
    
    // Si on pointe sur un espace, on avance pour ne pas commencer par un espace
    while (startIndex < cleanText.length && cleanText[startIndex] === ' ') {
      startIndex++;
    }
    
    // Sécurité anti-boucle infinie
    if (chunks.length > 0 && startIndex < 0) startIndex = 0;
  }

  return chunks;
}
