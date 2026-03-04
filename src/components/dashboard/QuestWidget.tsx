"use client";

import { useGame } from "@/context/GameContext";
import { Target, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Quest } from "@/types/quests";

export function QuestWidget() {
  const { dailyQuests } = useGame();

  if (!dailyQuests || dailyQuests.quests.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-surface-hover p-6 flex flex-col animate-pulse">
        <div className="h-6 w-48 bg-surface-hover rounded mb-6" />
        <div className="space-y-4">
          <div className="h-20 bg-surface-hover rounded-xl" />
          <div className="h-20 bg-surface-hover rounded-xl" />
        </div>
      </div>
    );
  }

  const completedCount = dailyQuests.quests.filter(q => q.isCompleted).length;

  return (
    <div className="bg-surface rounded-2xl border border-surface-hover p-6 flex flex-col h-full shadow-lg relative overflow-hidden">
      {/* Background glow if all done */}
      {completedCount === 3 && (
        <div className="absolute inset-0 bg-success-500/5 z-0" />
      )}
      
      <div className="flex justify-between items-center mb-6 z-10">
        <div className="flex items-center space-x-2">
          <Target className={`w-6 h-6 ${completedCount === 3 ? 'text-success-500' : 'text-accent-500'}`} />
          <h3 className="text-xl font-bebas text-white">Quêtes du Jour</h3>
        </div>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${completedCount === 3 ? 'bg-success-500/20 text-success-400' : 'bg-surface-hover text-gray-400'}`}>
          {completedCount} / 3
        </span>
      </div>
      
      <div className="space-y-4 flex-1 z-10">
        {dailyQuests.quests.map((quest) => (
          <QuestItem key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}

function QuestItem({ quest }: { quest: Quest }) {
  const isDone = quest.isCompleted;
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl border ${isDone ? 'bg-success-500/10 border-success-500/30 shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'bg-background/50 border-surface-hover'} flex flex-col transition-all`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2">
          <span className={`text-sm font-bold flex items-center ${isDone ? 'text-success-500' : 'text-gray-200'}`}>
            {isDone && <CheckCircle className="w-4 h-4 mr-1.5" />}
            {quest.title}
          </span>
          {!isDone && <p className="text-[10px] text-gray-500 leading-tight mt-1">{quest.description}</p>}
        </div>
        <span className="text-xs font-mono text-gray-500">
          {isDone ? 'COMPLÉTÉ' : `${quest.progress}/${quest.criteria.target}`}
        </span>
      </div>
      
      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mb-3">
        <motion.div 
          className={`h-full rounded-full transition-all duration-1000 ${isDone ? 'bg-success-500' : 'bg-accent-500'}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (quest.progress / quest.criteria.target) * 100)}%` }}
        />
      </div>
      
      <div className="flex space-x-3 text-[10px] font-bold uppercase tracking-widest">
        <span className={`${isDone ? 'text-success-500/50' : 'text-primary-400'}`}>+{quest.xpReward} XP</span>
        <span className={`${isDone ? 'text-success-500/50' : 'text-secondary-400'}`}>+{quest.gemsReward} 💎</span>
      </div>
    </motion.div>
  );
}
