"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Notion } from "@/types/curriculum";

interface NotionCardProps {
  notion: Notion;
  subject: string;
  mastery: number;
}

export function NotionCard({ notion, subject, mastery }: NotionCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-surface rounded-2xl border border-surface-hover overflow-hidden flex flex-col shadow-lg hover:border-primary-500/50 transition-all group"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest bg-primary-500/10 px-2 py-1 rounded">
            {notion.bloomTarget.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase mr-1">Maîtrise</span>
            <span className={`text-sm font-bebas ${mastery >= 80 ? 'text-success-500' : mastery >= 40 ? 'text-accent-500' : 'text-gray-400'}`}>
              {mastery}%
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bebas text-white mb-2 leading-tight group-hover:text-primary-400 transition-colors">
          {notion.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-6 italic">
          {notion.onboarding.hook}
        </p>

        <div className="space-y-3 mb-8 flex-1">
          <div className="flex items-center text-xs text-gray-400">
            <Target className="w-3 h-3 mr-2 text-accent-500" />
            {notion.objectives.length} objectifs clés
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <BookOpen className="w-3 h-3 mr-2 text-primary-500" />
            {notion.estimatedDuration} min estimées
          </div>
        </div>

        <Link 
          href={`/learn/${subject}/${notion.id}`}
          className="w-full bg-background border border-surface-hover group-hover:border-primary-500 group-hover:text-primary-500 text-white py-3 rounded-xl font-bold flex items-center justify-center transition-all"
        >
          Démarrer
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
