import { AriaResponse } from "./types";

/**
 * Moteur de simulation pour ARIA.
 * STRICTEMENT POUR DÉMONSTRATION. NE CITE AUCUNE SOURCE RÉELLE.
 */
export function getAriaMockResponse(query: string): AriaResponse {
  const normalizedQuery = query.toLowerCase();

  const mockBase: Partial<AriaResponse> = {
    isMock: true,
    confidence: 0.6,
    coverage: 1.0,
    suggestedActions: ["Passer en mode RAG réel", "Consulter le QG"]
  };

  if (normalizedQuery.includes("thalès") || normalizedQuery.includes("thales")) {
    return {
      ...mockBase,
      answerMarkdown: "Ceci est une explication simulée du théorème de Thalès pour la démonstration de l'interface. Dans une version réelle, ARIA citerait ici le Bulletin Officiel. [Source:mock-1]",
      citations: [
        {
          chunkId: "mock-1",
          source: "SOURCE_DEMONSTRATION",
          excerpt: "Extrait de démonstration (non officiel) relatif à la géométrie.",
          relevance: 0.6
        }
      ],
      confidence: 0.6,
      coverage: 1.0,
      isMock: true,
      suggestedActions: ["Tenter un quiz réel"]
    };
  }

  return {
    ...mockBase,
    answerMarkdown: `En mode DÉMO, je peux simuler une réponse sur "${query}". Pour avoir accès aux vraies sources du Brevet, activez le moteur RAG. [Source:mock-gen]`,
    citations: [
      {
        chunkId: "mock-gen",
        source: "SOURCE_DEMONSTRATION",
        excerpt: "Ceci est un contenu factice généré pour valider le rendu de l'interface.",
        relevance: 0.5
      }
    ],
    confidence: 0.5,
    coverage: 1.0,
    isMock: true,
    suggestedActions: ["Revoir le QG"]
  };
}
