"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Book, RefreshCcw, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { AriaResponse } from "@/services/aria/types";

interface AriaExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: AriaResponse | null;
  isLoading: boolean;
  onPractice: () => void;
}

export function AriaExplanationModal({ isOpen, onClose, response, isLoading, onPractice }: AriaExplanationModalProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-3xl border border-surface-hover shadow-2xl overflow-hidden flex flex-col relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aria-modal-title"
        >
          {response?.isMock && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-4 py-1 rounded-b-xl z-20 shadow-lg">
              MODE DÉMONSTRATION
            </div>
          )}

          <div className="p-6 border-b border-surface-hover flex items-center justify-between bg-secondary-500/5 pt-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-secondary-500" />
              </div>
              <div>
                <h2 id="aria-modal-title" className="font-bebas text-2xl text-white tracking-wide">Conseil d&apos;ARIA</h2>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Analyse personnalisée</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-full transition-colors text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-secondary-500/20 border-t-secondary-500 rounded-full animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse">ARIA analyse tes réponses...</p>
              </div>
            ) : response ? (
              <>
                {response.confidence <= 0.4 && response.refusalReason ? (
                  <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl">
                    <div className="flex items-center space-x-3 mb-4 text-orange-400">
                      <AlertCircle className="w-6 h-6" />
                      <h3 className="font-bold uppercase tracking-widest text-sm">Précision insuffisante</h3>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">{response.refusalReason}</p>
                    <div className="prose prose-invert max-w-none text-gray-400 text-xs italic border-t border-orange-500/20 pt-4">
                      {response.answerMarkdown}
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
                    <p className="whitespace-pre-wrap">{response.answerMarkdown}</p>
                  </div>
                )}

                {response.citations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bebas text-lg text-primary-400 flex items-center tracking-widest">
                      <Book className="w-4 h-4 mr-2" /> Sources Officielles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {response.citations.map((cite, i) => (
                        <div key={i} className="p-4 bg-background border border-surface-hover rounded-xl text-xs">
                          <p className="font-bold text-gray-400 mb-1 uppercase tracking-tighter">{cite.source}</p>
                          <p className="text-gray-500 italic">&quot;{cite.excerpt}&quot;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-red-400">Erreur lors de la récupération.</p>
            )}
          </div>

          <div className="p-6 border-t border-surface-hover bg-background/50 flex flex-col md:flex-row gap-4">
            <button onClick={onPractice} className="flex-1 flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
              <RefreshCcw className="w-5 h-5" />
              <span>Refaire une question similaire</span>
            </button>
            <button onClick={onClose} className="md:w-1/3 bg-surface-hover hover:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all">Fermer</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
