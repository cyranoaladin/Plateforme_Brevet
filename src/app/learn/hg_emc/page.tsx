"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, BookOpen, Landmark, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { getAllHgEmcActivities } from "@/content/registry";
import { HgEmcActivity } from "@/types/hg_emc";

export default function HgEmcLobby() {
  const [activities, setActivities] = useState<HgEmcActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllHgEmcActivities();
      setActivities(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const modeIcons = {
    histoire: <BookOpen className="text-orange-400" />,
    geographie: <Globe className="text-green-400" />,
    emc: <Landmark className="text-blue-400" />
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2">Histoire-Géo & EMC</h1>
          <p className="text-gray-400 text-lg">Comprends le monde, analyse les documents et maîtrise les repères spatio-temporels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-surface rounded-2xl animate-pulse border border-surface-hover" />
          ))
        ) : (
          activities.map((act) => (
            <motion.div 
              key={act.id}
              whileHover={{ y: -5 }}
              className="bg-surface rounded-2xl border border-surface-hover p-6 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-surface-hover">
                    {modeIcons[act.mode as keyof typeof modeIcons]}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-surface-hover px-3 py-1 rounded-full">
                    {act.mode}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors mb-2 leading-tight">{act.title}</h3>
                
                <div className="flex items-center space-x-2 mb-6">
                   <span className="text-xs text-gray-500">Difficulté :</span>
                   <div className="flex">
                     {Array.from({ length: act.difficulty }).map((_, i) => <Star key={i} className="w-3 h-3 fill-accent-500 text-accent-500" />)}
                   </div>
                </div>
              </div>
              
              <Link 
                href={`/learn/hg_emc/${act.id}`}
                className="bg-primary-500 hover:bg-primary-600 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all mt-auto"
              >
                Étudier le document
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
