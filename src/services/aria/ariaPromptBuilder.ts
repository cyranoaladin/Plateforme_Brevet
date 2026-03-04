import { AriaQueryRequest, RetrievedChunk } from "./types";
import { LlmMessage } from "./llmProvider";

export function buildAriaRAGPrompt(request: AriaQueryRequest, chunks: RetrievedChunk[]): LlmMessage[] {
  const { rank, mastery, bloomLevel } = request.studentProfile;
  
  const systemPrompt = `
Tu es ARIA, le Mentor IA expert du Diplôme National du Brevet (3ème).
Ton rôle est d'aider l'élève en t'appuyant EXCLUSIVEMENT sur les sources officielles fournies.

PROFIL ÉLÈVE :
- Rang : ${rank}
- Maîtrise : ${mastery}%
- Objectif : ${bloomLevel}

RÈGLES DE CITATION STRICTES :
1. Chaque phrase contenant une information issue des sources doit se terminer par le marqueur exact [Source:ID].
2. ID doit être l'identifiant technique fourni dans le bloc source.
3. Si plusieurs sources soutiennent une phrase, utilise plusieurs marqueurs : [Source:ID1][Source:ID2].
4. Si tu ne trouves pas l'info, dis "Je ne trouve pas cette précision dans les sources officielles".

FORMAT RÉPONSE :
- Markdown uniquement.
- Pas de blabla inutile.
- Ton pédagogue.
  `.trim();

  const contextBlock = chunks.length > 0 
    ? chunks.map(c => `--- SOURCE ID: ${c.id} ---\n${c.text}\n(Source: ${c.metadata.sourceTitle})`).join("\n\n")
    : "AUCUNE SOURCE DISPONIBLE.";

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `CONTEXTE :\n${contextBlock}\n\nQUESTION : ${request.query}` }
  ];
}
