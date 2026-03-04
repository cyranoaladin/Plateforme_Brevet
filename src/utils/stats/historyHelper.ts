import { XPPoint } from "@/types/game";

/**
 * Met à jour l'historique d'XP en créant ou modifiant le point du jour.
 * Limite l'historique aux 30 derniers jours.
 */
export function updateXPHistory(history: XPPoint[], currentTotalXP: number): XPPoint[] {
  const today = new Date().toISOString().split('T')[0];
  const newHistory = [...history];
  const todayIndex = newHistory.findIndex(p => p.date === today);

  if (todayIndex >= 0) {
    newHistory[todayIndex] = { ...newHistory[todayIndex], xp: currentTotalXP };
  } else {
    newHistory.push({ date: today, xp: currentTotalXP });
  }

  // Tri par date croissante
  newHistory.sort((a, b) => a.date.localeCompare(b.date));

  // Cap à 30 jours
  if (newHistory.length > 30) {
    return newHistory.slice(-30);
  }

  return newHistory;
}
