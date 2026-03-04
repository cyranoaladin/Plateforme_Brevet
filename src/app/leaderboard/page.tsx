"use client";

import { useGame } from "@/context/GameContext";
import { LeaderboardService, LeaderboardEntry } from "@/services/leaderboard/leaderboardService";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Medal } from "lucide-react";
import Image from "next/image";

export default function LeaderboardPage() {
  const stats = useGame();
  const entries = LeaderboardService.getLeaderboard(stats);
  
  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bebas text-white tracking-widest">Ligue des Champions</h1>
        <p className="text-gray-400">Hisse-toi au sommet du classement du DNB 2026</p>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end pt-10">
        {/* 2nd Place */}
        <PodiumCard entry={top3[1]} rank={2} height="h-48" color="text-gray-300" />
        {/* 1st Place */}
        <PodiumCard entry={top3[0]} rank={1} height="h-64" color="text-yellow-500" />
        {/* 3rd Place */}
        <PodiumCard entry={top3[2]} rank={3} height="h-40" color="text-orange-600" />
      </div>

      {/* Full List */}
      <div className="bg-surface rounded-3xl border border-surface-hover shadow-xl overflow-hidden">
        <div className="p-6 border-b border-surface-hover flex justify-between text-[10px] uppercase font-bold text-gray-500 tracking-widest">
          <span>Rang / Élève</span>
          <span>XP Total</span>
        </div>
        <div className="divide-y divide-surface-hover">
          {others.map((entry, index) => (
            <motion.div 
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-5 flex items-center justify-between transition-colors ${entry.isPlayer ? 'bg-primary-500/10' : 'hover:bg-surface-hover/50'}`}
            >
              <div className="flex items-center space-x-4">
                <span className="font-bebas text-xl text-gray-500 w-6 text-center">{index + 4}</span>
                <div className="w-10 h-10 rounded-full bg-background border border-surface-hover relative overflow-hidden">
                  <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="avatar" fill />
                </div>
                <div>
                  <h4 className={`font-bold ${entry.isPlayer ? 'text-primary-400' : 'text-white'}`}>
                    {entry.name} {entry.isPlayer && "(Toi)"}
                  </h4>
                  <span className={`text-[10px] uppercase font-bold ${entry.rank.color}`}>{entry.rank.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <TrendIcon trend={entry.trend} />
                <span className="font-bebas text-2xl text-white">{entry.xp.toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ entry, rank, height, color }: { entry: LeaderboardEntry, rank: number, height: string, color: string }) {
  if (!entry) return <div className={`flex-1 ${height} bg-surface/50 rounded-t-3xl border border-dashed border-surface-hover`} />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center"
    >
      <div className="relative mb-4">
        <div className={`w-20 h-20 rounded-full border-4 ${entry.isPlayer ? 'border-primary-500' : 'border-surface-hover'} overflow-hidden relative shadow-2xl`}>
          <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} alt="avatar" fill />
        </div>
        <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface border-2 border-surface-hover flex items-center justify-center`}>
          <Medal className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className={`w-full ${height} bg-surface rounded-t-3xl border-x border-t border-surface-hover flex flex-col items-center justify-center p-4 text-center shadow-2xl relative`}>
        {entry.isPlayer && <div className="absolute inset-0 bg-primary-500/5 rounded-t-3xl" />}
        <span className={`font-bebas text-4xl mb-1 ${color}`}>#{rank}</span>
        <h3 className="font-bold text-white text-sm truncate w-full">{entry.name}</h3>
        <p className="font-bebas text-xl text-gray-400">{entry.xp.toLocaleString()}</p>
      </div>
    </motion.div>
  );
}

function TrendIcon({ trend }: { trend: LeaderboardEntry['trend'] }) {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-600" />;
}
