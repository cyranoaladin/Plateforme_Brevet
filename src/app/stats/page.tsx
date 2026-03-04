"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { StatsSelector, SubjectMastery, CategorizedNotions } from "@/services/stats/statsSelector";
import { getAllSubjects, getAllNotionsBySubject } from "@/content/registry";
import { SubjectStatCard } from "@/components/stats/SubjectStatCard";
import { TrendingUp, Award, Flame, Zap, Target, Sparkles } from "lucide-react";
import Link from "next/link";
import { Notion } from "@/types/curriculum";

export default function StatsPage() {
  const stats = useGame();
  const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>([]);
  const [categorized, setCategorized] = useState<CategorizedNotions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const subjects = getAllSubjects();
      const allNotionsMap: Record<string, Notion[]> = {};
      let flatNotions: Notion[] = [];

      for (const sub of subjects) {
        const notions = await getAllNotionsBySubject(sub);
        allNotionsMap[sub] = notions;
        flatNotions = [...flatNotions, ...notions];
      }

      const userStats = {
        xp: stats.xp,
        gems: stats.gems,
        energy: stats.energy,
        lastSync: stats.lastSync,
        streakDays: stats.streakDays,
        mastery: stats.mastery,
        history: stats.history
      };

      setSubjectMastery(StatsSelector.getSubjectMastery(userStats, allNotionsMap));
      setCategorized(StatsSelector.categorizeNotions(userStats, flatNotions));
      setIsLoading(false);
    }
    loadData();
  }, [stats]);

  if (isLoading) return <div className="p-10 text-center font-bebas text-2xl animate-pulse">Analyse de tes performances...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Profile */}
      <div className="bg-surface p-8 rounded-3xl border border-surface-hover shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Award className="w-48 h-48" /></div>
        
        <div className="flex items-center space-x-6 z-10">
          <div className="w-24 h-24 rounded-3xl bg-primary-500 border-4 border-surface-hover flex items-center justify-center font-bebas text-4xl shadow-inner">
             {stats.rank.level}
          </div>
          <div>
            <h1 className="text-4xl font-bebas text-white tracking-wider mb-1">{stats.rank.name}</h1>
            <p className="text-gray-400 font-medium">{stats.xp} XP au total • {stats.gems} 💎</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 z-10">
          <div className="bg-background/50 px-6 py-4 rounded-2xl border border-surface-hover flex items-center space-x-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Streak</span>
              <span className="text-xl font-bebas text-white">{stats.streakDays} Jours</span>
            </div>
          </div>
          <div className="bg-background/50 px-6 py-4 rounded-2xl border border-surface-hover flex items-center space-x-3">
            <Zap className="w-6 h-6 text-accent-500" />
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Énergie</span>
              <span className="text-xl font-bebas text-white">{stats.energy}/30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjectMastery.map((data) => (
          <SubjectStatCard key={data.subject} data={data} />
        ))}
      </div>

      {/* Mastery Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Focus Section (Weak notions) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-bebas text-white flex items-center">
            <Target className="w-6 h-6 mr-2 text-red-500" /> Points de vigilance
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {categorized?.weak.length === 0 ? (
              <p className="bg-success-500/5 p-6 rounded-2xl border border-success-500/20 text-success-400 italic">Aucune lacune majeure détectée. Continue comme ça !</p>
            ) : (
              categorized?.weak.map(n => (
                <div key={n.id} className="bg-surface p-5 rounded-2xl border border-surface-hover flex items-center justify-between group hover:border-red-500/30 transition-all">
                  <div>
                    <h4 className="text-white font-bold mb-1">{n.title}</h4>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-widest">Maîtrise : {stats.mastery[n.id] || 0}%</span>
                  </div>
                  <Link 
                    href={`/mentor?query=${encodeURIComponent(`Explique-moi ${n.title}`)}`}
                    className="bg-secondary-500/10 hover:bg-secondary-500/20 text-secondary-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Plan ARIA
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Strengths */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bebas text-white flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-success-500" /> Tes forces
          </h3>
          <div className="space-y-4">
            {categorized?.strong.slice(0, 5).map(n => (
              <div key={n.id} className="bg-background/50 p-4 rounded-xl border border-surface-hover flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-success-500 shadow-[0_0_8px_rgba(22,163,74,0.5)]" />
                <span className="text-sm text-gray-300">{n.title}</span>
              </div>
            ))}
            {categorized?.strong.length === 0 && <p className="text-gray-500 text-sm italic">Valide tes premières notions pour voir tes forces s&apos;afficher.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}
