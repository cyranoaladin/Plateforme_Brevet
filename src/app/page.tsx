"use client";

import { motion } from "framer-motion";
import { Flame, BookOpen, ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { QuestWidget } from "@/components/dashboard/QuestWidget";

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bebas text-white tracking-wider mb-2">
            Salut Lucas !
          </h1>
          <p className="text-gray-400 text-lg">Prêt à continuer ta quête vers le Brevet ?</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-surface p-3 rounded-xl border border-surface-hover shadow-lg">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Streak de révision</p>
            <p className="font-bebas text-2xl text-white">4 Jours 🔥</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Continue Learning */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30 p-6 flex flex-col justify-between group"
        >
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-primary-500 rounded-full blur-3xl opacity-20"></div>
          
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/30 text-primary-300 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Prochaine étape recommandée</span>
            </div>
            <h2 className="text-3xl font-bebas text-white mb-2 group-hover:text-primary-400 transition-colors">Théorème de Thalès</h2>
            <p className="text-gray-300 mb-6 max-w-md">Tu as eu des difficultés avec cette notion hier. ARIA a préparé une analyse ciblée pour toi.</p>
          </div>
          
          <Link 
            href="/learn/maths/thales"
            className="self-start inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary-500/30"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Démarrer l&apos;entraînement</span>
            <span className="text-primary-200 text-sm ml-2">-2 ⚡</span>
          </Link>
        </motion.div>

        {/* Daily Quests */}
        <QuestWidget />

      </div>

      {/* Subjects */}
      <div>
        <h3 className="text-2xl font-bebas text-white mb-6 flex items-center">
          <span className="text-primary-500 mr-2">/</span> Tes Matières
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SubjectCard name="Mathématiques" progress={45} color="bg-blue-500" href="/learn/maths" />
          <SubjectCard name="Français" progress={60} color="bg-red-500" href="/learn/francais" />
          <SubjectCard name="Histoire-Géo" progress={30} color="bg-green-500" href="/learn/hg_emc" />
          <SubjectCard name="Sciences" progress={15} color="bg-purple-500" href="/learn/sciences" />
        </div>
      </div>
      
    </div>
  );
}

function SubjectCard({ name, progress, color, href }: { name: string, progress: number, color: string, href: string }) {
  return (
    <Link href={href} className="group relative bg-surface p-5 rounded-xl border border-surface-hover hover:border-primary-500/50 transition-all flex flex-col justify-between min-h-[120px] overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <div className="flex justify-between items-start z-10">
        <h4 className="font-bold text-gray-200 group-hover:text-white transition-colors">{name}</h4>
        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-500 transition-colors transform group-hover:translate-x-1" />
      </div>
      <div className="mt-4 z-10">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} opacity-80`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
