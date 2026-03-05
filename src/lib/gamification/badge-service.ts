export const BADGES_CATALOG = {
  // Performance
  SNIPER:         { id: "sniper",         label: "Sniper",         emoji: "🎯", desc: "10 QCM à 100%",          category: "performance" },
  FLASH:          { id: "flash",          label: "Flash",          emoji: "⚡", desc: "Exercice < 60 secondes",  category: "performance" },
  FIRE:           { id: "fire",           label: "En Feu",         emoji: "🔥", desc: "7 jours de streak",       category: "streak"      },
  PERFECTIONIST:  { id: "perfectionist",  label: "Perfectionniste",emoji: "💎", desc: "Note max en rédaction",   category: "performance" },
  CHAMPION:       { id: "champion",       label: "Champion",       emoji: "🏆", desc: "Top 1 tournoi",           category: "social"      },
  // Progression
  HALF_WAY:       { id: "half_way",       label: "En Route",       emoji: "📈", desc: "50% du programme couvert",category: "progress"    },
  ALL_SUBJECTS:   { id: "all_subjects",   label: "Puzzle",         emoji: "🧩", desc: "Toutes matières activées",category: "progress"    },
  EXPLORER_20:    { id: "explorer_20",    label: "Explorateur",    emoji: "🗺️", desc: "20 chapitres étudiés",    category: "progress"    },
  BOOKWORM:       { id: "bookworm",       label: "Boulimique",     emoji: "📚", desc: "100 cours consultés",     category: "progress"    },
  RISING_STAR:    { id: "rising_star",    label: "Étoile Montante",emoji: "🌟", desc: "+3 rangs en 1 mois",      category: "progress"    },
  // Secrets (Easter Eggs)
  NIGHT_OWL:      { id: "night_owl",      label: "Hibou",          emoji: "🦉", desc: "Connexion après 23h",     category: "secret"      },
  EARLY_BIRD:     { id: "early_bird",     label: "Lève-Tôt",       emoji: "🌅", desc: "Connexion avant 7h",      category: "secret"      },
  MARATHON:       { id: "marathon",       label: "Marathon",       emoji: "📅", desc: "30 jours consécutifs",    category: "secret"      },
  BIRTHDAY:       { id: "birthday",       label: "Anniversaire",   emoji: "🎂", desc: "Connexion le jour J",     category: "secret"      },
  // Sociaux
  LEADER:         { id: "leader",         label: "Meneur",         emoji: "👥", desc: "Créer un groupe de révision", category: "social" },
  HELPER:         { id: "helper",         label: "Solidaire",      emoji: "🤝", desc: "Aider 5 élèves",          category: "social"      },
} as const

export type BadgeId = keyof typeof BADGES_CATALOG

export async function checkAndAwardBadges(userId: string, context: {
  exerciseCount?: number
  streakDays?: number
  subjectsCovered?: number
  chaptersStudied?: number
  coursesViewed?: number
  rankGained?: number
  loginHour?: number
  isDuelist?: boolean
}): Promise<BadgeId[]> {
  const { prisma } = await import("@/lib/prisma")
  
  const existingBadges = await prisma.userBadge.findMany({
    where: { userId },
    select: { badgeId: true },
  })
  const owned = new Set(existingBadges.map((b: { badgeId: string }) => b.badgeId))
  const earned: BadgeId[] = []
  
  const grant = async (id: BadgeId) => {
    if (owned.has(id)) return
    await prisma.userBadge.create({ data: { userId, badgeId: id } })
    earned.push(id)
  }
  
  const { exerciseCount, streakDays, subjectsCovered, chaptersStudied, coursesViewed, rankGained, loginHour } = context
  
  if (exerciseCount && exerciseCount >= 10) await grant("SNIPER")
  if (streakDays && streakDays >= 7) await grant("FIRE")
  if (streakDays && streakDays >= 30) await grant("MARATHON")
  if (subjectsCovered && subjectsCovered >= 7) await grant("ALL_SUBJECTS")
  if (chaptersStudied && chaptersStudied >= 20) await grant("EXPLORER_20")
  if (coursesViewed && coursesViewed >= 100) await grant("BOOKWORM")
  if (subjectsCovered && subjectsCovered >= 4) await grant("HALF_WAY")
  if (rankGained && rankGained >= 3) await grant("RISING_STAR")
  if (loginHour !== undefined && loginHour >= 23) await grant("NIGHT_OWL")
  if (loginHour !== undefined && loginHour < 7) await grant("EARLY_BIRD")
  
  return earned
}
