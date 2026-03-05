export async function recordDailyActivity(userId: string): Promise<{
  streakUpdated: boolean
  currentStreak: number
  isNewRecord: boolean
  streakFreezeUsed: boolean
}> {
  const { prisma } = await import("@/lib/prisma")
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(today.getDate() - 2)
  
  const streak = await prisma.streak.upsert({
    where: { userId },
    update: {},
    create: { userId, currentStreak: 0, longestStreak: 0 },
  })
  
  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null
  
  // Déjà actif aujourd'hui — rien à faire
  if (lastActivity && lastActivity >= today) {
    return { streakUpdated: false, currentStreak: streak.currentStreak, isNewRecord: false, streakFreezeUsed: false }
  }
  
  let newStreak = streak.currentStreak
  let streakFreezeUsed = false
  
  if (!lastActivity || lastActivity < twoDaysAgo) {
    // Rupture du streak (2 jours ou plus d'absence)
    if (streak.freezesLeft > 0 && lastActivity && lastActivity >= yesterday) {
      // Le freeze couvre UN jour manqué
      newStreak += 1
      streakFreezeUsed = true
      await prisma.streak.update({
        where: { userId },
        data: { freezesLeft: { decrement: 1 } },
      })
    } else {
      newStreak = 1 // Reset
    }
  } else if (lastActivity >= yesterday && lastActivity < today) {
    // Activité hier — streak continue
    newStreak += 1
  }
  
  const isNewRecord = newStreak > streak.longestStreak
  
  await prisma.streak.update({
    where: { userId },
    data: {
      currentStreak: newStreak,
      longestStreak: isNewRecord ? newStreak : streak.longestStreak,
      lastActivityDate: new Date(),
    },
  })
  
  // Récompenses de streak
  if (newStreak === 7) await awardXp(userId, 100, "STREAK_7_DAYS")
  if (newStreak === 30) await awardXp(userId, 500, "STREAK_30_DAYS")
  
  return { streakUpdated: true, currentStreak: newStreak, isNewRecord, streakFreezeUsed }
}

// Importer depuis xp-service
import { awardXp } from "./xp-service"
