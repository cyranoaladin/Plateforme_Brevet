"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { getAllNotionsBySubject } from "@/content/registry";
import { NotionCard } from "@/components/learn/NotionCard";
import { Calculator, GraduationCap } from "lucide-react";
import { Notion } from "@/types/curriculum";

export default function MathsLobby() {
  const { mastery } = useGame();
  const [notions, setNotions] = useState<Notion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllNotionsBySubject('maths');
      setNotions(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const totalMastery = notions.length > 0 
    ? Math.round(notions.reduce((acc, n) => acc + (mastery[n.id] || 0), 0) / notions.length)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2 flex items-center">
            <Calculator className="w-10 h-10 mr-4 text-primary-500" />
            Mathématiques
          </h1>
          <p className="text-gray-400 text-lg">Préparez le DNB : Algèbre, Géométrie, Statistiques et Algorithmique.</p>
        </div>

        {!isLoading && (
          <div className="bg-surface p-4 rounded-2xl border border-surface-hover flex items-center space-x-6 shadow-xl">
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Maîtrise Globale</span>
               <span className="text-3xl font-bebas text-primary-400">{totalMastery}%</span>
             </div>
             <div className="w-px h-10 bg-surface-hover" />
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Notions</span>
               <span className="text-3xl font-bebas text-white">{notions.length}</span>
             </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-surface rounded-2xl animate-pulse border border-surface-hover" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notions.map((notion) => (
            <NotionCard 
              key={notion.id} 
              notion={notion} 
              subject="maths" 
              mastery={mastery[notion.id] || 0} 
            />
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-primary-500/5 rounded-3xl border border-primary-500/20 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-10 h-10 text-primary-500" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-white">Objectif 100% Maîtrise</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Chaque notion terminée augmente ton score de maîtrise. Atteins 80% pour débloquer les badges de rang supérieur et 100% pour devenir un Maître de la notion. Un score de maîtrise élevé en maths est indispensable pour obtenir la mention au Brevet.
          </p>
        </div>
      </div>
    </div>
  );
}
