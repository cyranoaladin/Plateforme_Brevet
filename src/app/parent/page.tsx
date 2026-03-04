"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { ParentSelector, ParentDashboardData } from "@/services/stats/parentSelector";
import { getAllSubjects, getAllNotionsBySubject } from "@/content/registry";
import { Users, GraduationCap, Flame, AlertTriangle, CheckCircle, TrendingUp, ChevronRight, Activity, Swords } from "lucide-react";
import { Notion } from "@/types/curriculum";

export default function ParentDashboard() {
  const stats = useGame();
  const [data, setData] = useState<ParentDashboardData | null>(null);

  useEffect(() => {
    async function load() {
      const subjects = getAllSubjects();
      const allNotionsMap: Record<string, Notion[]> = {};
      
      for (const sub of subjects) {
        allNotionsMap[sub] = await getAllNotionsBySubject(sub);
      }

      const userStats = {
        xp: stats.xp,
        gems: stats.gems,
        energy: stats.energy,
        streakDays: stats.streakDays,
        lastSync: stats.lastSync,
        mastery: stats.mastery,
        history: stats.history,
        duels: stats.duels,
      };

      setData(ParentSelector.getDashboardData(userStats, allNotionsMap));
    }
    load();
  }, [stats]);

  if (!data) return <div className="p-10 text-center animate-pulse text-gray-500">Chargement du rapport parental...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      
      {/* Header */}
      <div className="bg-surface p-8 rounded-3xl border border-surface-hover shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bebas text-white tracking-widest mb-1">Espace Parent</h1>
            <p className="text-sm text-gray-400">Suivi d&apos;activité et recommandations</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-background/50 px-6 py-3 rounded-2xl border border-surface-hover text-center">
            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">XP Total</span>
            <span className="text-xl font-bebas text-white">{data.xp}</span>
          </div>
          <div className="bg-background/50 px-6 py-3 rounded-2xl border border-surface-hover text-center">
            <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Régularité</span>
            <span className="text-xl font-bebas text-orange-500 flex items-center justify-center">
              <Flame className="w-4 h-4 mr-1" /> {data.streakDays} J
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale : Matières et Recommandations */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-xl font-bebas text-white mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-primary-500" /> Actions Recommandées
            </h2>
            <div className="space-y-4">
              {data.recommendations.length === 0 ? (
                <div className="bg-success-500/10 border border-success-500/20 p-6 rounded-2xl flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-success-500 shrink-0" />
                  <p className="text-success-400 text-sm leading-relaxed">
                    Tout semble en ordre ! Votre enfant progresse régulièrement et ne présente aucune lacune critique pour le moment.
                  </p>
                </div>
              ) : (
                data.recommendations.map((reco, idx) => (
                  <div key={idx} className="bg-surface p-5 rounded-2xl border border-surface-hover shadow-md flex items-start space-x-4">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      reco.type === 'remediation' ? 'bg-red-500/20 text-red-500' :
                      reco.type === 'consistency' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-blue-500/20 text-blue-500'
                    }`}>
                      {reco.type === 'remediation' ? <TrendingUp className="w-5 h-5" /> : 
                       reco.type === 'consistency' ? <Flame className="w-5 h-5" /> : 
                       <Swords className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-sm mb-1">{reco.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{reco.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bebas text-white mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-primary-500" /> Bilan par Matière
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.subjects.map(sub => (
                <div key={sub.subject} className="bg-surface p-5 rounded-2xl border border-surface-hover">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-200 uppercase tracking-widest">{sub.subject.replace('_', ' ')}</h3>
                    <span className="text-lg font-bebas text-white">{sub.average}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-background rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-primary-500" style={{ width: `${sub.average}%` }} />
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {sub.weakNotions.length} notion{sub.weakNotions.length > 1 ? 's' : ''} à revoir
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Colonne Secondaire : Activité et Duels */}
        <div className="space-y-8">
          
          <section className="bg-surface p-6 rounded-3xl border border-surface-hover shadow-xl">
            <h2 className="text-lg font-bebas text-white mb-6 flex items-center tracking-widest">
              <Activity className="w-4 h-4 mr-2 text-primary-500" /> Activité (7 derniers jours)
            </h2>
            <div className="space-y-3">
              {data.activity.length === 0 ? (
                <p className="text-xs text-gray-500 italic text-center py-4">Pas de données récentes</p>
              ) : (
                data.activity.slice().reverse().map((point, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{new Date(point.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-white font-bold">{point.xp} XP cumulé</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-surface p-6 rounded-3xl border border-surface-hover shadow-xl">
            <h2 className="text-lg font-bebas text-white mb-6 flex items-center tracking-widest">
              <Swords className="w-4 h-4 mr-2 text-primary-500" /> Derniers Combats
            </h2>
            <div className="space-y-3">
              {data.recentDuels.length === 0 ? (
                 <p className="text-xs text-gray-500 italic text-center py-4">Aucun duel joué</p>
              ) : (
                data.recentDuels.map(duel => (
                  <div key={duel.id} className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-surface-hover">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bebas text-sm ${
                        duel.status === 'victory' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                      }`}>
                        {duel.status === 'victory' ? 'V' : 'D'}
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{duel.opponentName}</p>
                        <p className="text-[9px] text-gray-600">{duel.subject}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
