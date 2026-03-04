"use client";

import { useGame } from "@/context/GameContext";
import { Zap, Gem } from "lucide-react";
import { RANKS } from "@/types/game";
import Image from "next/image";

export function TopBar() {
  const { xp, gems, energy, rank } = useGame();

  const prevRankMax = rank.level === 1 ? 0 : RANKS[rank.level - 2].maxXp;
  const currentRankMax = rank.maxXp;
  const progressPercent = Math.min(100, Math.max(0, ((xp - prevRankMax) / (currentRankMax - prevRankMax)) * 100));

  return (
    <div className="h-16 border-b border-surface-hover bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-surface-hover border-2 border-primary-500 flex items-center justify-center font-bebas text-xl overflow-hidden relative">
           <Image 
             src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas" 
             alt="Avatar"
             fill
             className="object-cover"
           />
        </div>
        <div>
          <h2 className={`font-bebas text-xl tracking-wide ${rank.color}`}>{rank.name}</h2>
          <div className="flex items-center space-x-2 w-48">
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 font-medium tracking-tighter uppercase">{xp} XP</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-accent-500/10 px-3 py-1 rounded-full border border-accent-500/20">
          <Zap className="w-5 h-5 text-accent-500 fill-accent-500" />
          <span className="font-bebas text-xl text-accent-500">{energy}/30</span>
        </div>
        <div className="flex items-center space-x-2 bg-secondary-500/10 px-3 py-1 rounded-full border border-secondary-500/20">
          <Gem className="w-5 h-5 text-secondary-500 fill-secondary-500" />
          <span className="font-bebas text-xl text-secondary-500">{gems}</span>
        </div>
      </div>
    </div>
  );
}