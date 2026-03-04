"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Swords, Trophy, History, AlertCircle, Loader2 } from "lucide-react";
import { DuelEngine, MCQQuestion } from "@/services/duelEngine";
import { getAllSubjects, getAllNotionsBySubject } from "@/content/registry";
import { NotionWithSubject } from "@/services/questEngine";
import { DuelMatch } from "@/components/duels/DuelMatch";
import { UserStats } from "@/types/game";

export default function DuelsLobby() {
  const { duels, energy, consumeEnergy, mastery } = useGame();
  const [isSearching, setIsSearching] = useState(false);
  const [isReadyNotions, setIsReadyNotions] = useState(false);
  const [activeMatch, setActiveMatch] = useState<{ notion: NotionWithSubject, questions: MCQQuestion[], opponentName: string } | null>(null);
  const [allNotions, setAllNotions] = useState<NotionWithSubject[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const subjects = getAllSubjects();
        const notions: NotionWithSubject[] = [];
        for (const sub of subjects) {
          const data = await getAllNotionsBySubject(sub);
          data.forEach(n => notions.push({ ...n, subject: sub }));
        }
        setAllNotions(notions);
        setIsReadyNotions(true);
      } catch (err) {
        console.error("Failed to load notions for Duels:", err);
      }
    }
    load();
  }, []);

  const startDuel = () => {
    if (!isReadyNotions) return;
    if (energy < 5) return;

    setIsSearching(true);
    
    // Simulation d'une recherche d'adversaire avec préparation atomique
    setTimeout(() => {
      try {
        // 1. Préparation du contexte (peut throw)
        const stats = { mastery } as UserStats;
        const notion = DuelEngine.pickDuelNotion(stats.mastery, allNotions);
        const questions = DuelEngine.pickMCQQuestions(notion, 3);
        const opponentName = DuelEngine.generateOpponentName();

        // 2. Consommation d'énergie (Étape finale de validation)
        if (consumeEnergy(5)) {
          setActiveMatch({ notion, questions, opponentName });
        }
      } catch (err: unknown) {
        // 3. Gestion des erreurs de contenu / système
        const error = err as Error;
        const message = error.message === "DUEL_NO_COMPATIBLE_NOTION" || error.message === "DUEL_NOT_ENOUGH_MCQ"
          ? "Duel indisponible : contenu pédagogique insuffisant."
          : "Une erreur est survenue lors de la création du duel.";
        
        console.error("Duel Init Error:", err);
        // Le GameContext gère déjà les toasts via consumeEnergy si besoin, 
        // ici on gère spécifiquement l'erreur système.
        alert(message); // Remplaçable par un toast UI plus complexe si disponible
      } finally {
        setIsSearching(false);
      }
    }, 1500);
  };

  if (activeMatch) {
    return (
      <DuelMatch 
        notion={activeMatch.notion} 
        questions={activeMatch.questions} 
        opponentName={activeMatch.opponentName}
        onFinish={() => setActiveMatch(null)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2">Arène des Duels</h1>
          <p className="text-gray-400 text-lg italic">Affronte les meilleurs pour gagner des récompenses épiques.</p>
        </div>
        
        <button
          onClick={startDuel}
          disabled={isSearching || energy < 5 || !isReadyNotions}
          className="group relative bg-secondary-500 hover:bg-secondary-600 disabled:opacity-50 disabled:bg-surface-hover text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 transition-all shadow-lg shadow-secondary-500/20 active:scale-95 min-w-[240px] justify-center"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Rival en approche...</span>
            </>
          ) : !isReadyNotions ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Chargement du programme...</span>
            </>
          ) : (
            <>
              <Swords className="w-6 h-6" />
              <span>Lancer un Duel (5 ⚡)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface p-6 rounded-3xl border border-surface-hover shadow-xl">
            <h3 className="font-bebas text-xl text-white mb-6 flex items-center tracking-widest">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> Ton Palmarès
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-background/50 p-4 rounded-2xl border border-surface-hover">
                <span className="text-[10px] uppercase font-bold text-gray-500">Victoires</span>
                <p className="text-3xl font-bebas text-green-500">{duels.filter(d => d.status === 'victory').length}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-surface-hover">
                <span className="text-[10px] uppercase font-bold text-gray-500">Défaites</span>
                <p className="text-3xl font-bebas text-red-500">{duels.filter(d => d.status === 'defeat').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-500/5 p-6 rounded-3xl border border-primary-500/20 flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-primary-400 shrink-0" />
            <p className="text-sm text-gray-400 leading-relaxed">
              Les duels se jouent en <span className="text-white font-bold">3 questions</span>. Sois plus rapide et précis que ton adversaire pour triompher.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface p-8 rounded-3xl border border-surface-hover shadow-xl">
          <h3 className="font-bebas text-xl text-white mb-6 flex items-center tracking-widest">
            <History className="w-5 h-5 mr-2 text-primary-500" /> Historique des Combats
          </h3>
          
          <div className="space-y-4">
            {duels.length === 0 ? (
              <div className="text-center py-20 opacity-30">
                <Swords className="w-16 h-12 mx-auto mb-4" />
                <p className="font-bebas text-xl tracking-widest">Aucun combat récent</p>
              </div>
            ) : (
              duels.map((duel) => (
                <div key={duel.id} className="bg-background/50 p-4 rounded-2xl border border-surface-hover flex items-center justify-between group hover:border-surface-hover transition-all">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bebas text-xl ${
                      duel.status === 'victory' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {duel.status === 'victory' ? 'V' : (duel.status === 'defeat' ? 'D' : 'N')}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Contre {duel.opponentName}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">{duel.notionId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bebas text-xl text-white">{duel.myScore} - {duel.opponentScore}</p>
                    <span className="text-[10px] text-gray-600">{duel.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
