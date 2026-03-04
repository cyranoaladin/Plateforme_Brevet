"use client";

import { motion } from "framer-motion";
import { SubjectMastery } from "@/services/stats/statsSelector";

export function SubjectStatCard({ data }: { data: SubjectMastery }) {
  const colors: Record<string, string> = {
    maths: "bg-blue-500",
    francais: "bg-red-500",
    hg_emc: "bg-green-500",
    sciences: "bg-purple-500"
  };

  const color = colors[data.subject] || "bg-primary-500";

  return (
    <div className="bg-surface p-6 rounded-3xl border border-surface-hover shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-bebas text-xl text-white uppercase tracking-wider">{data.subject.replace('_', ' ')}</h4>
        <span className="text-2xl font-bebas text-white">{data.average}%</span>
      </div>
      
      <div className="h-2 w-full bg-background rounded-full overflow-hidden mb-4">
        <motion.div 
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${data.average}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
        <span>Maîtrise</span>
        <span>{data.completedCount} notions validées</span>
      </div>
    </div>
  );
}
