/**
 * Utilitaires de notation et de normalisation pour le Français.
 */

// Retire les espaces superflus, convertit en minuscules, et ignore la casse et la ponctuation basique
export function normalizeString(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[.,:;!?()'"]/g, " ") // Remplace la ponctuation par des espaces
    .replace(/\s+/g, " ") // Compresse les espaces
    .trim();
}

// Distance de Levenshtein (Algorithme standard)
export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j] + 1, // deletion
        matrix[i - 1][j - 1] + indicator // substitution
      );
    }
  }
  return matrix[a.length][b.length];
}

export function evaluateAnswer(
  userAnswer: string | number,
  question: { type: string, correctAnswer?: string | number, toleranceRegex?: string, points: number }
): { isCorrect: boolean, earnedPoints: number, isPartial: boolean } {
  
  if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
    return { isCorrect: false, earnedPoints: 0, isPartial: false };
  }

  // 1. QCM
  if (question.type === 'qcm') {
    const isCorrect = userAnswer === question.correctAnswer;
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0, isPartial: false };
  }

  // Convert to string for text based evaluations
  const userStr = String(userAnswer).trim();
  const correctStr = String(question.correctAnswer || "").trim();

  // 2. Rewriting (Grammaire) -> Tolérance stricte via Regex
  if (question.type === 'rewriting') {
    if (question.toleranceRegex) {
      const regex = new RegExp(question.toleranceRegex, 'i'); // Case insensitive
      const isCorrect = regex.test(userStr);
      return { isCorrect, earnedPoints: isCorrect ? question.points : 0, isPartial: false };
    }
    // Fallback si pas de regex
    const isCorrect = userStr.toLowerCase() === correctStr.toLowerCase();
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0, isPartial: false };
  }

  // 3. Short Answer -> Normalisation agressive (on cherche l'idée ou le mot clé)
  if (question.type === 'short_answer') {
    const normUser = normalizeString(userStr);
    const normCorrect = normalizeString(correctStr);
    // Si la réponse correcte est incluse dans la réponse de l'élève (ex: "C'est un pantin dérisoire" contient "pantin derisoire")
    const isCorrect = normUser.includes(normCorrect) && normCorrect.length > 0;
    return { isCorrect, earnedPoints: isCorrect ? question.points : 0, isPartial: false };
  }

  // 4. Dictation -> Levenshtein Distance
  if (question.type === 'dictation_segment') {
    const distance = levenshteinDistance(userStr, correctStr);
    const maxLength = Math.max(userStr.length, correctStr.length);
    if (maxLength === 0) return { isCorrect: false, earnedPoints: 0, isPartial: false };
    
    const accuracy = 1 - (distance / maxLength);
    
    if (accuracy >= 0.95) return { isCorrect: true, earnedPoints: question.points, isPartial: false }; // Parfait ou quasi
    if (accuracy >= 0.8) return { isCorrect: true, earnedPoints: Math.floor(question.points * 0.5), isPartial: true }; // Moitié des points
    return { isCorrect: false, earnedPoints: 0, isPartial: false };
  }

  return { isCorrect: false, earnedPoints: 0, isPartial: false };
}
