"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Rank, UserStats, calculateRank, XPPoint } from "@/types/game";
import { LocalDataService } from "@/services/dataService";
import { ToastContainer, ToastProps, ToastType } from "@/components/ui/Toast";
import { processQuizResult, QuizInput } from "@/services/gameEngine";
import { QuestEngine, NotionWithSubject } from "@/services/questEngine";
import { DailyQuestState } from "@/types/quests";
import { getAllSubjects, getAllNotionsBySubject } from "@/content/registry";

const syncService = new LocalDataService();

interface GameContextType {
  xp: number;
  gems: number;
  energy: number;
  rank: Rank;
  streakDays: number;
  mastery: Record<string, number>;
  lastSync: string;
  history: XPPoint[];
  dailyQuests?: DailyQuestState;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  useEnergy: (amount: number) => boolean;
  completeQuiz: (input: QuizInput) => { earnedXP: number, earnedGems: number, newMastery: number, summary: string };
  toasts: ToastProps[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [stats, setStats] = useState<UserStats>({ xp: 0, gems: 0, energy: 30, streakDays: 0, mastery: {}, history: [], lastSync: "" });
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((message: string, type: ToastType, amount?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, amount }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    async function init() {
      const initialStats = await syncService.getStats();
      
      // 1. Chargement de TOUTES les notions pour le QuestEngine
      const subjects = getAllSubjects();
      const allNotions: NotionWithSubject[] = [];
      
      await Promise.all(subjects.map(async (sub) => {
        const notions = await getAllNotionsBySubject(sub);
        notions.forEach(n => allNotions.push({ ...n, subject: sub }));
      }));

      // 2. Génération/Validation des quêtes du jour
      const today = new Date().toISOString().split('T')[0];
      if (!initialStats.dailyQuests || initialStats.dailyQuests.date !== today) {
        initialStats.dailyQuests = QuestEngine.generateDailyQuests(initialStats, today, allNotions);
      }
      
      setStats(initialStats);
    }
    init();
  }, []);

  useEffect(() => {
    if (stats.lastSync) {
      syncService.saveStats(stats);
    }
  }, [stats]);

  const currentRank = calculateRank(stats.xp);

  const addXp = (amount: number) => {
    const oldRank = calculateRank(stats.xp);
    const newXp = stats.xp + amount;
    const newRank = calculateRank(newXp);
    setStats(prev => ({ ...prev, xp: newXp, lastSync: new Date().toISOString() }));
    addToast("XP gagné !", "xp", amount);
    if (newRank.level > oldRank.level) {
      addToast(`NOUVEAU RANG : ${newRank.name} !`, "levelup");
    }
  };

  const addGems = (amount: number) => {
    setStats(prev => ({ ...prev, gems: prev.gems + amount, lastSync: new Date().toISOString() }));
    addToast("Gemmes reçues !", "gems", amount);
  };

  const useEnergy = (amount: number) => {
    if (stats.energy >= amount) {
      setStats(prev => ({ ...prev, energy: prev.energy - amount, lastSync: new Date().toISOString() }));
      return true;
    }
    addToast("Énergie insuffisante !", "success");
    return false;
  };

  const completeQuiz = (input: QuizInput) => {
    const result = processQuizResult(stats, input);
    
    setStats(prev => {
      const nextState = {
        ...prev,
        xp: prev.xp + result.earnedXP,
        gems: prev.gems + result.earnedGems,
        mastery: { ...prev.mastery, [input.notionId]: result.newMastery },
        lastSync: new Date().toISOString()
      };

      if (nextState.dailyQuests) {
        const scorePercent = (input.score / input.total) * 100;
        const questResult = QuestEngine.processAction(nextState.dailyQuests, {
           type: input.difficulty === 4 ? 'exam' : 'complete_notion',
           scorePercent: scorePercent,
           notionId: input.notionId
        });
        
        nextState.dailyQuests = questResult.updatedQuests;
        
        questResult.newlyCompleted.forEach(q => {
          nextState.xp += q.xpReward;
          nextState.gems += q.gemsReward;
          setTimeout(() => {
            addToast(`Quête : ${q.title}`, "xp", q.xpReward);
          }, 500);
        });
      }

      return nextState;
    });

    addToast("Quiz Complété !", "xp", result.earnedXP);
    if (result.earnedGems > 0) addToast("Gemmes Bonus !", "gems", result.earnedGems);
    
    const newRank = calculateRank(stats.xp + result.earnedXP);
    if (newRank.level > currentRank.level) {
      addToast(`NOUVEAU RANG : ${newRank.name} !`, "levelup");
    }

    return result;
  };

  return (
    <GameContext.Provider value={{ ...stats, rank: currentRank, addXp, addGems, useEnergy, completeQuiz, toasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
