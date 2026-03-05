// src/lib/gamification/badges-catalog.ts
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'performance' | 'progression' | 'social' | 'secret' | 'exam';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpBonus: number;
}

export const BADGES_CATALOG: Badge[] = [
  // PERFORMANCE
  { id: 'SNIPER',        name: 'Sniper',             emoji: '🎯', category: 'performance', rarity: 'rare',      xpBonus: 50,  description: '10 bonnes réponses de suite sans erreur.' },
  { id: 'FLASH',         name: 'Flash',              emoji: '⚡', category: 'performance', rarity: 'common',    xpBonus: 20,  description: 'Répond à un exercice en moins de 5 secondes.' },
  { id: 'PERFECTIONIST', name: 'Perfectionniste',    emoji: '💎', category: 'performance', rarity: 'epic',      xpBonus: 100, description: 'Score parfait (100%) sur un brevet blanc complet.' },
  { id: 'FIRE',          name: 'En feu',             emoji: '🔥', category: 'performance', rarity: 'rare',      xpBonus: 50,  description: 'Streak de 7 jours consécutifs de révision.' },
  { id: 'CHAMPION',      name: 'Champion',           emoji: '🏆', category: 'performance', rarity: 'legendary', xpBonus: 200, description: 'Atteins le rang "Maître Ultime" (25 000 XP).' },
  // PROGRESSION
  { id: 'HALF_WAY',          name: 'Mi-chemin',              emoji: '🌟', category: 'progression', rarity: 'common', xpBonus: 30,  description: 'Complète 50% du curriculum.' },
  { id: 'ALL_SUBJECTS',      name: 'Polymathe',              emoji: '📚', category: 'progression', rarity: 'epic',   xpBonus: 150, description: 'Obtiens une maîtrise satisfaisante dans toutes les matières.' },
  { id: 'BOOKWORM',          name: 'Rat de bibliothèque',    emoji: '🐭', category: 'progression', rarity: 'rare',   xpBonus: 75,  description: 'Lis 50 fiches de cours.' },
  { id: 'RISING_STAR',       name: 'Étoile montante',        emoji: '⭐', category: 'progression', rarity: 'common', xpBonus: 25,  description: 'Passe du rang Apprenti au rang Explorateur.' },
  { id: 'FLASHCARD_MASTER',  name: 'Maître des flashcards',  emoji: '🃏', category: 'progression', rarity: 'rare',   xpBonus: 50,  description: 'Révise 100 flashcards.' },
  // MATIÈRES
  { id: 'PYTHAGORAS',   name: 'Nouveau Pythagore', emoji: '📐', category: 'progression', rarity: 'rare', xpBonus: 75, description: 'Maîtrises parfaitement la géométrie du cycle 4.' },
  { id: 'LITTERAIRE',   name: 'Littéraire',        emoji: '📖', category: 'progression', rarity: 'rare', xpBonus: 75, description: 'Maîtrises la partie langue et littérature du français.' },
  { id: 'HISTORIEN',    name: 'Historien',          emoji: '🏛️', category: 'progression', rarity: 'rare', xpBonus: 75, description: 'Complètes les chapitres WW1 et WW2.' },
  { id: 'SCIENTIFIQUE', name: 'Scientifique',       emoji: '🔬', category: 'progression', rarity: 'rare', xpBonus: 75, description: 'Maîtrises les 3 sciences (PC, SVT, Techno).' },
  // SOCIAUX
  { id: 'LEADER',     name: 'Leader',     emoji: '👑', category: 'social', rarity: 'epic',   xpBonus: 100, description: 'Atteins le top 10 du classement hebdomadaire.' },
  { id: 'CHALLENGER', name: 'Challenger', emoji: '⚔️', category: 'social', rarity: 'common', xpBonus: 20,  description: 'Remporte ton premier duel.' },
  { id: 'GLADIATOR',  name: 'Gladiateur', emoji: '🛡️', category: 'social', rarity: 'rare',   xpBonus: 50,  description: 'Remporte 10 duels au total.' },
  // SECRETS
  { id: 'NIGHT_OWL',  name: 'Hibou nocturne',        emoji: '🦉', category: 'secret', rarity: 'rare',      xpBonus: 50,  description: 'Révises après 22h00 (surprise !).' },
  { id: 'EARLY_BIRD', name: 'Lève-tôt',              emoji: '🌅', category: 'secret', rarity: 'rare',      xpBonus: 50,  description: 'Révises avant 7h00 du matin.' },
  { id: 'BIRTHDAY',   name: 'Joyeux anniversaire !', emoji: '🎂', category: 'secret', rarity: 'legendary', xpBonus: 100, description: 'Connexion le jour de ton anniversaire.' },
  // EXAMENS
  { id: 'EXAM_BLANC_MATHS',    name: 'Brevet Blanc Maths',    emoji: '📊', category: 'exam', rarity: 'rare', xpBonus: 100, description: 'Passes le brevet blanc de mathématiques.' },
  { id: 'EXAM_BLANC_FRANCAIS', name: 'Brevet Blanc Français', emoji: '✍️', category: 'exam', rarity: 'rare', xpBonus: 100, description: 'Passes le brevet blanc de français.' },
  { id: 'CANDIDAT_LIBRE',      name: 'Candidat libre',        emoji: '🎓', category: 'exam', rarity: 'epic', xpBonus: 150, description: 'Complètes un brevet blanc toutes matières en conditions réelles.' },
];

/**
 * Retrieve a badge by its unique ID.
 */
export const getBadgeById = (id: string): Badge | undefined =>
  BADGES_CATALOG.find(b => b.id === id);

/**
 * Retrieve badges filtered by category.
 */
export const getBadgesByCategory = (category: Badge['category']): Badge[] =>
  BADGES_CATALOG.filter(b => b.category === category);
