import { IngestionChunk, IngestionConfig } from "./types";

/**
 * Nettoie le texte (espaces, sauts de ligne) et le découpe en chunks avec overlap.
 */
export function chunkText(
  text: string, 
  config: IngestionConfig, 
  meta: { docId: string; sourceFile: string; page: number; subject?: string }
): IngestionChunk[] {
  // Nettoyage minimal
  const cleanText = text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  if (!cleanText) return [];

  const chunks: IngestionChunk[] = [];
  let startIndex = 0;
  let chunkCount = 0;

  while (startIndex < cleanText.length) {
    const endIndex = Math.min(startIndex + config.chunkSize, cleanText.length);
    const content = cleanText.substring(startIndex, endIndex);

    chunks.push({
      id: `${meta.docId}:${meta.page}:${chunkCount}`,
      text: content,
      metadata: {
        ...meta,
        chunkIndex: chunkCount
      }
    });

    if (endIndex === cleanText.length) break;

    chunkCount++;
    startIndex += (config.chunkSize - config.overlap);
    
    if (config.overlap >= config.chunkSize) break;
  }

  return chunks;
}
