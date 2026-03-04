"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Target, AlertCircle } from "lucide-react";
import { AriaRevisionPlan } from "@/services/aria/examTypes";
import Link from "next/link";

export function AriaRevisionPlanCard({ plan, isLoading }: { plan: AriaRevisionPlan | null, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-surface p-8 rounded-3xl border border-surface-hover animate-pulse">
        <div className="h-6 w-48 bg-surface-hover rounded mb-6" />
        <div className="space-y-4">
          <div className="h-20 bg-surface-hover rounded-2xl" />
          <div className="h-20 bg-surface-hover rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-3xl border border-surface-hover overflow-hidden shadow-2xl"
    >
      <div className="p-6 border-b border-surface-hover bg-secondary-500/5 flex items-center space-x-3">
        <div className="w-10 h-10 bg-secondary-500/20 rounded-full flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-secondary-500" />
        </div>
        <div>
          <h2 className="font-bebas text-2xl text-white tracking-wide">Plan de Révision ARIA</h2>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Optimisé pour ton profil</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="bg-background/50 p-4 rounded-2xl border border-surface-hover">
          <p className="text-gray-300 text-sm leading-relaxed italic">&quot;{plan.analysis}&quot;</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-bebas text-lg text-primary-400 flex items-center tracking-widest">
            <Target className="w-4 h-4 mr-2" /> Actions Prioritaires
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {plan.actions.map((action, i) => (
              <Link 
                key={i} 
                href={action.route}
                className="group bg-background p-5 rounded-2xl border border-surface-hover hover:border-primary-500/50 transition-all flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      action.priority === 'HAUTE' ? 'bg-red-500/20 text-red-400' : 
                      action.priority === 'MOYENNE' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-primary-500/20 text-primary-400'
                    }`}>
                      {action.priority}
                    </span>
                    <h4 className="text-white font-bold">{action.label}</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{action.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary-500 transition-colors transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>

        {plan.confidence < 0.5 && (
          <div className="flex items-center space-x-2 text-orange-500/60 text-[10px] justify-center uppercase font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Plan basé sur des données limitées (Analyse standard)</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
