/**
 * Génère un extrait pertinent (best window) autour des termes de recherche.
 */
export function getSmartExcerpt(text: string, query: string, maxLength: number = 240): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  // 1. Extraction des termes de recherche (normalisés)
  const queryTerms = query.toLowerCase().match(/[a-z0-9à-ÿ]+/g) || [];
  if (queryTerms.length === 0) return text.substring(0, maxLength) + "...";

  // 2. Découpage en phrases
  const sentences = text.split(/[.!?\n]+/).map(s => s.trim()).filter(s => s.length > 5);
  
  let bestSentenceIdx = 0;
  let maxMatches = -1;

  // 3. Recherche de la phrase avec le plus de matches
  sentences.forEach((sentence, idx) => {
    const sentenceLower = sentence.toLowerCase();
    let matchCount = 0;
    
    queryTerms.forEach(term => {
      if (sentenceLower.includes(term)) {
        matchCount++;
      }
    });
    
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestSentenceIdx = idx;
    }
  });

  // 4. Reconstruction de l'extrait
  let excerpt = sentences[bestSentenceIdx];
  
  // Fenêtrage : on essaie d'inclure la phrase suivante
  if (bestSentenceIdx + 1 < sentences.length && (excerpt.length + sentences[bestSentenceIdx + 1].length) < maxLength) {
    excerpt += ". " + sentences[bestSentenceIdx + 1];
  }

  // Puis la phrase précédente si possible
  if (bestSentenceIdx - 1 >= 0 && (excerpt.length + sentences[bestSentenceIdx - 1].length) < maxLength) {
    excerpt = sentences[bestSentenceIdx - 1] + ". " + excerpt;
  }

  return excerpt.length > maxLength ? excerpt.substring(0, maxLength - 3) + "..." : excerpt + "...";
}
