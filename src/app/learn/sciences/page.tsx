"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Leaf, Settings2, ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import { getAllScienceExercises } from "@/content/registry";
import { ScienceExercise, ScienceSubject } from "@/types/sciences";

export default function SciencesLobby() {
  const [exercises, setExercises] = useState<ScienceExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<ScienceSubject[]>(['physique_chimie', 'svt']);

  useEffect(() => {
    async function load() {
      const data = await getAllScienceExercises();
      setExercises(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const subjects: { id: ScienceSubject, label: string, icon: React.ReactNode, color: string }[] = [
    { id: 'physique_chimie', label: 'Physique-Chimie', icon: <FlaskConical />, color: 'text-blue-400' },
    { id: 'svt', label: 'SVT', icon: <Leaf />, color: 'text-green-500' },
    { id: 'technologie', label: 'Technologie', icon: <Settings2 />, color: 'text-orange-500' }
  ];

  const toggleSubject = (id: ScienceSubject) => {
    if (selectedSubjects.includes(id)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== id));
      }
    } else {
      if (selectedSubjects.length < 2) {
        setSelectedSubjects([...selectedSubjects, id]);
      } else {
        setSelectedSubjects([selectedSubjects[1], id]);
      }
    }
  };

  const filteredExercises = exercises.filter(ex => selectedSubjects.includes(ex.subject));

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2">Sciences DNB</h1>
          <p className="text-gray-400 text-lg italic">Choisis ton couple de matières pour l&apos;entraînement.</p>
        </div>

        <div className="flex bg-surface p-2 rounded-2xl border border-surface-hover shadow-lg">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSubject(s.id)}
              className={`px-4 py-3 rounded-xl flex items-center space-x-2 transition-all ${
                selectedSubjects.includes(s.id) 
                  ? 'bg-primary-500 text-white shadow-lg scale-105' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className={selectedSubjects.includes(s.id) ? 'text-white' : s.color}>{s.icon}</span>
              <span className="text-xs font-bold uppercase hidden lg:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-primary-500/5 rounded-3xl border border-primary-500/20 p-6 flex items-center space-x-4">
        <Info className="w-6 h-6 text-primary-400 flex-shrink-0" />
        <p className="text-sm text-gray-400 leading-relaxed">
          Au Brevet, seules <span className="text-white font-bold">2 matières sur 3</span> sont tirées au sort chaque année. Entraîne-toi sur toutes les combinaisons pour être prêt !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 bg-surface rounded-2xl animate-pulse border border-surface-hover" />)
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredExercises.map((ex) => (
              <motion.div 
                key={ex.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-surface rounded-2xl border border-surface-hover p-6 flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-background border border-surface-hover ${subjects.find(s => s.id === ex.subject)?.color}`}>
                      {ex.subject.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-primary-400 transition-colors">
                    {ex.title}
                  </h3>
                </div>
                
                <Link 
                  href={`/learn/sciences/${ex.id}`}
                  className="bg-background border border-surface-hover group-hover:border-primary-500 group-hover:text-primary-500 text-white w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all"
                >
                  Démarrer l&apos;expérience
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
