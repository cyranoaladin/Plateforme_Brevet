"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookText, PenTool, Mic, Edit3, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { getAllFrenchExercises } from "@/content/registry";
import { FrenchExercise } from "@/types/francais";

export default function FrenchLobby() {
  const [exercises, setExercises] = useState<FrenchExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllFrenchExercises();
      setExercises(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const modeIcons = {
    comprehension: <BookText className="text-blue-400" />,
    langue: <PenTool className="text-purple-400" />,
    dictee: <Mic className="text-red-400" />,
    redaction: <Edit3 className="text-green-400" />
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2">Français DNB</h1>
          <p className="text-gray-400 text-lg">Maîtrise la langue, analyse les textes et réussis ta dictée.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-surface rounded-2xl animate-pulse border border-surface-hover" />
          ))
        ) : (
          exercises.map((ex) => (
            <motion.div 
              key={ex.id}
              whileHover={{ x: 5 }}
              className="bg-surface rounded-2xl border border-surface-hover p-6 flex items-center justify-between group"
            >
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-background rounded-xl flex items-center justify-center border border-surface-hover">
                  {modeIcons[ex.mode as keyof typeof modeIcons]}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{ex.mode}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">{ex.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                     {Array.from({ length: ex.difficulty }).map((_, i) => <Star key={i} className="w-3 h-3 fill-accent-500 text-accent-500" />)}
                  </div>
                </div>
              </div>
              
              <Link 
                href={`/learn/francais/${ex.mode}/${ex.id}`}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-bold flex items-center transition-all"
              >
                S&apos;entraîner
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
