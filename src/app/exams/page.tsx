"use client";

import { motion } from "framer-motion";
import { Timer, Trophy, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { EXAMS_V1 } from "@/content/v1/exams";

export default function ExamsLobby() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-bebas text-white tracking-wider mb-2">
            Examens Blancs
          </h1>
          <p className="text-gray-400 text-lg italic">Simule les conditions réelles du DNB 2026.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAMS_V1.map((exam) => (
          <motion.div 
            key={exam.id}
            whileHover={{ y: -5 }}
            className="bg-surface rounded-2xl border border-surface-hover overflow-hidden flex flex-col shadow-xl"
          >
            <div className={`h-2 w-full ${exam.subject === 'maths' ? 'bg-blue-500' : 'bg-red-500'}`} />
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-primary-400 uppercase tracking-widest bg-primary-500/10 px-2 py-1 rounded">
                  {exam.subject}
                </span>
                <div className="flex items-center text-accent-500 font-bebas text-lg">
                  <Timer className="w-4 h-4 mr-1" /> {exam.duration}m
                </div>
              </div>
              
              <h3 className="text-2xl font-bebas text-white mb-4 leading-tight">{exam.title}</h3>
              
              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center text-sm text-gray-400">
                  <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                  Bonus complétion : +{exam.xpReward} XP
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <GraduationCap className="w-4 h-4 mr-2 text-primary-500" />
                  Notation officielle / 20
                </div>
              </div>

              <Link 
                href={`/exams/${exam.id}`}
                className="w-full bg-background border border-surface-hover hover:border-primary-500 hover:text-primary-500 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all group"
              >
                Accéder à l&apos;épreuve
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary-500/5 rounded-3xl border border-primary-500/20 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-10 h-10 text-primary-500" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white mb-2">Pourquoi faire des examens blancs ?</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            La gestion du temps est la clé de la réussite au Brevet. Nos sujets sont conçus par des professeurs certifiés pour refléter exactement les attentes du jury 2026. Faire au moins 3 examens blancs multiplie vos chances de mention par deux.
          </p>
        </div>
      </div>
    </div>
  );
}
