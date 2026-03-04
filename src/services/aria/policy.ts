import { AriaResponse, Citation, RetrievedChunk } from "./types";

const REFUSAL_MSG = "Je ne trouve pas cette information dans les sources disponibles (Bulletin Officiel / Eduscol). Je préfère ne pas te dire d'erreurs !";
const CITATION_REGEX = /\[Source:([\w-]+)\]/gi;

/**
 * Découpe le Markdown en unités informatives.
 * Gère les paragraphes et les items de listes.
 */
export function getInformativeUnits(text: string): string[] {
  return text
    .split(/\n/) // Split ligne par ligne pour capturer les items de liste
    .map(u => u.trim())
    .filter(u => u.length > 0 && !u.startsWith('#')) // Ignore lignes vides et titres
    .map(u => u.replace(/^[*+-]\s+/, "").trim()) // Nettoie les puces
    .filter(u => u.length > 10); // Ignore unités trop courtes (décorations)
}

/**
 * Extrait TOUS les marqueurs [Source:ID] présents dans le texte.
 */
export function getAllMarkers(text: string): string[] {
  const matches = [...text.matchAll(CITATION_REGEX)];
  return Array.from(new Set(matches.map(m => m[1])));
}

/**
 * Calcule le taux de couverture basé sur les unités informatives.
 */
export function computeCoverage(text: string, validIds: string[]): { ratio: number; unitsCount: number; hasInvalidCitations: boolean } {
  const units = getInformativeUnits(text);
  if (units.length === 0) return { ratio: 0, unitsCount: 0, hasInvalidCitations: false };

  const markers = getAllMarkers(text);
  const hasInvalidCitations = markers.some(id => !validIds.includes(id));

  const citedUnitsCount = units.filter(u => {
    const unitMarkers = [...u.matchAll(CITATION_REGEX)].map(m => m[1]);
    return unitMarkers.some(id => validIds.includes(id));
  }).length;

  return {
    ratio: parseFloat((citedUnitsCount / units.length).toFixed(2)),
    unitsCount: units.length,
    hasInvalidCitations
  };
}

export function buildRefusal(reason: string, coverage: number = 0): AriaResponse {
  return {
    answerMarkdown: REFUSAL_MSG,
    citations: [],
    suggestedActions: ["Consulter le programme officiel", "Poser une question précise"],
    confidence: 0.35,
    coverage,
    isMock: false,
    refusalReason: reason
  };
}

import { getSmartExcerpt } from "./excerpt";

/**
 * Orchestre la validation finale : mapping des citations + application de la politique.
 */
export function enforcePolicy(draftAnswer: string, retrievedChunks: RetrievedChunk[], query: string = ""): AriaResponse {
  const validIds = retrievedChunks.map(c => c.id);

  if (retrievedChunks.length === 0) {
    return buildRefusal("Aucune source trouvée dans la base de connaissances.");
  }

  const { ratio, unitsCount, hasInvalidCitations } = computeCoverage(draftAnswer, validIds);

  // 1. Règle Anti-Invention
  if (hasInvalidCitations) {
    return buildRefusal("La réponse cite des sources inexistantes (hallucination de référence).", ratio);
  }

  // 2. Mapping des citations valides avec Smart Excerpt
  const citedIds = getAllMarkers(draftAnswer).filter(id => validIds.includes(id));
  const foundCitations: Citation[] = citedIds.map(id => {
    const chunk = retrievedChunks.find(c => c.id === id)!;
    return {
      chunkId: chunk.id,
      source: String(chunk.metadata.sourceTitle || "Source Officielle"),
      excerpt: getSmartExcerpt(chunk.text, query),
      relevance: Number(chunk.score),
      pageNumber: chunk.metadata.pageNumber ? String(chunk.metadata.pageNumber) : undefined,
      url: chunk.metadata.url ? String(chunk.metadata.url) : undefined
    };
  });

  if (foundCitations.length === 0) {
    return buildRefusal("Aucune affirmation n'est rattachée à une source valide.", ratio);
  }

  // 3. Seuils adaptatifs de couverture
  let threshold = 0.70; // Seuil de base
  if (unitsCount <= 2) threshold = 1.0; 
  if (unitsCount > 5) threshold = 0.80; 

  if (ratio < threshold) {
    return buildRefusal(`Le taux d'ancrage aux sources (${Math.round(ratio * 100)}%) est inférieur au seuil requis (${Math.round(threshold * 100)}%).`, ratio);
  }

  const avgScore = foundCitations.reduce((acc, c) => acc + c.relevance, 0) / foundCitations.length;
  const confidence = parseFloat(((avgScore * 0.5) + (ratio * 0.5)).toFixed(2));

  return {
    answerMarkdown: draftAnswer,
    citations: foundCitations,
    suggestedActions: ["Vérifier dans le cours"],
    confidence,
    coverage: ratio,
    isMock: false
  };
}
