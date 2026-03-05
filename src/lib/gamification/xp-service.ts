export const RANK_THRESHOLDS = [
  { rank: 1, name: "Apprenti du Savoir",    minXp: 0,      color: "from-gray-400 to-gray-600",   emoji: "🥉" },
  { rank: 2, name: "Explorateur",           minXp: 500,    color: "from-green-400 to-green-600",  emoji: "🗺️" },
  { rank: 3, name: "Chevalier du Brevet",   minXp: 1500,   color: "from-blue-400 to-blue-600",    emoji: "⚔️" },
  { rank: 4, name: "Maître des Révisions",  minXp: 4000,   color: "from-purple-400 to-purple-600",emoji: "📚" },
  { rank: 5, name: "Expert DNB",            minXp: 8000,   color: "from-orange-400 to-orange-600",emoji: "🎯" },
  { rank: 6, name: "Légende du Brevet",     minXp: 15000,  color: "from-red-400 to-red-600",      emoji: "🏆" },
  { rank: 7, name: "Maître Ultime",         minXp: 25000,  color: "from-yellow-400 to-yellow-600",emoji: "💎" },
] as const

export const XP_REWARDS = {
  EXERCISE_CORRECT:         10,
  EXERCISE_PERFECT:         25,  // 100% sur une série
  QUEST_DAILY:              50,
  QUEST_WEEKLY:             200,
  DUEL_WIN:                 80,
  DUEL_DRAW:                30,
  EXAM_BLANC_COMPLETE:      300,
  STREAK_7_DAYS:            100,
  STREAK_30_DAYS:           500,
  BADGE_EARNED:             50,
  FIRST_LOGIN_OF_DAY:       20,
} as const

export function calculateRankFromXp(xp: number): typeof RANK_THRESHOLDS[number] {
  for (let i = RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= RANK_THRESHOLDS[i].minXp) return RANK_THRESHOLDS[i]
  }
  return RANK_THRESHOLDS[0]
}

export function xpToNextRank(xp: number): { current: typeof RANK_THRESHOLDS[number], next: typeof RANK_THRESHOLDS[number] | null, progress: number } {
  const current = calculateRankFromXp(xp)
  const currentIdx = RANK_THRESHOLDS.findIndex(r => r.rank === current.rank)
  const next = RANK_THRESHOLDS[currentIdx + 1] ?? null
  const progress = next 
    ? ((xp - current.minXp) / (next.minXp - current.minXp)) * 100 
    : 100
  return { current, next, progress }
}

// Server action : ajouter de l'XP avec vérification de rang
export async function awardXp(userId: string, amount: number, _reason: keyof typeof XP_REWARDS): Promise<{ newXp: number; rankUp: boolean; newRank?: typeof RANK_THRESHOLDS[number] }> {
  const { prisma } = await import("@/lib/prisma")
  
  const profile = await prisma.studentProfile.findUnique({ where: { userId } })
  if (!profile) throw new Error("Profil élève introuvable")
  
  const oldRank = calculateRankFromXp(profile.xp)
  const newXp = profile.xp + amount
  const newRank = calculateRankFromXp(newXp)
  const rankUp = newRank.rank > oldRank.rank
  
  await prisma.studentProfile.update({
    where: { userId },
    data: { 
      xp: newXp, 
      rank: newRank.rank, 
    },
  })
  
  // Mise à jour du leaderboard
  await updateLeaderboard(userId, amount)
  
  return { newXp, rankUp, newRank: rankUp ? newRank : undefined }
}

async function updateLeaderboard(userId: string, xpGained: number) {
  const { prisma } = await import("@/lib/prisma")
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  weekStart.setHours(0, 0, 0, 0)
  
  const periods: { period: "weekly" | "monthly" | "alltime", weekStart: Date }[] = [
    { period: "weekly", weekStart },
    { period: "monthly", weekStart: new Date('1970-01-01') },
    { period: "alltime", weekStart: new Date('1970-01-01') },
  ]
  
  for (const { period, weekStart: ws } of periods) {
    await prisma.leaderboardEntry.upsert({
      where: { userId_period_subjectSlug_weekStart: { userId, period, subjectSlug: null, weekStart: ws } },
      update: { xp: { increment: xpGained } },
      create: { userId, period, xp: xpGained, subjectSlug: null, weekStart: ws },
    })
  }
}
