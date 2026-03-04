"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { Send, Sparkles, Book, ChevronRight, Info } from "lucide-react";
import { AriaClient } from "@/services/aria/ariaClient";
import { Citation } from "@/services/aria/types";

interface Message {
  role: 'user' | 'aria';
  content: string;
  citations?: Citation[];
  isMock?: boolean;
}

export default function MentorAriaPage() {
  const { rank, mastery } = useGame();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'aria', content: "Bonjour ! Je suis ARIA, ton mentor pédagogique. Sur quoi souhaites-tu travailler aujourd'hui ?" }
  ]);
  const [input, setInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState<Citation[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const averageMastery = Object.keys(mastery).length > 0 
    ? Math.round(Object.values(mastery).reduce((a, b) => a + b, 0) / Object.keys(mastery).length) 
    : 0;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isPending) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsPending(true);

    try {
      const response = await AriaClient.query({
        query: userMsg,
        context: { subject: "Général" },
        studentProfile: {
          rank: rank.name,
          mastery: 50,
          bloomLevel: "N2"
        }
      });

      setMessages(prev => [...prev, { 
        role: 'aria', 
        content: response.answerMarkdown,
        citations: response.citations,
        isMock: response.isMock
      }]);
      
      if (response.citations.length > 0) {
        setSelectedCitations(response.citations);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'aria', content: "Désolé, j'ai rencontré une petite erreur technique. Peux-tu reformuler ?" }]);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-120px)] gap-6 overflow-hidden">
      
      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-surface rounded-3xl border border-surface-hover shadow-xl overflow-hidden relative">
        <div className="bg-surface-hover/50 p-4 border-b border-surface-hover flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary-500/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <h1 className="font-bebas text-xl text-white tracking-wide">Mentor ARIA</h1>
              <span className="text-[10px] text-secondary-400 uppercase font-bold tracking-widest animate-pulse">En ligne</span>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-2xl relative ${
                msg.role === 'user' 
                  ? 'bg-primary-500 text-white rounded-tr-none' 
                  : 'bg-background border border-surface-hover text-gray-200 rounded-tl-none'
              }`}>
                {msg.isMock && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10">
                    DEMO
                  </span>
                )}
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <button 
                    onClick={() => setSelectedCitations(msg.citations!)}
                    className="mt-3 text-[10px] flex items-center text-secondary-400 hover:text-secondary-300 font-bold uppercase tracking-widest"
                  >
                    <Book className="w-3 h-3 mr-1" /> {msg.citations.length} Sources consultées
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="bg-background border border-surface-hover p-4 rounded-2xl rounded-tl-none flex space-x-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-background/50 border-t border-surface-hover flex items-center space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pose une question sur le programme..."
            className="flex-1 bg-surface border border-surface-hover rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button 
            type="submit" 
            disabled={isPending || !input.trim()}
            className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary-500 p-3 rounded-xl text-white transition-all active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Sources Section (Sidebar) */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-surface rounded-3xl border border-surface-hover p-6 flex-1 shadow-xl overflow-y-auto">
          <h2 className="font-bebas text-xl text-white mb-6 flex items-center tracking-wide">
            <Book className="w-5 h-5 mr-2 text-primary-500" /> Sources Pédagogiques
          </h2>
          
          <AnimatePresence mode="wait">
            {selectedCitations.length > 0 ? (
              <motion.div 
                key="sources" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {selectedCitations.map((cite, i) => (
                  <div key={i} className="p-4 bg-background border border-surface-hover rounded-xl group hover:border-primary-500/50 transition-all">
                    <p className="text-[10px] font-bold text-primary-400 mb-2 uppercase tracking-widest">{cite.source}</p>
                    <p className="text-xs text-gray-400 italic leading-relaxed">&quot;{cite.excerpt}&quot;</p>
                    <div className="mt-3 flex justify-end">
                      <div className="h-1 w-full bg-surface-hover rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500" style={{ width: `${cite.relevance * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" className="text-center py-10 opacity-30">
                <Info className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm">Pose une question pour voir les sources officielles ici.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stats Panel */}
        <div className="bg-secondary-500/10 rounded-3xl border border-secondary-500/20 p-6">
          <h3 className="font-bebas text-lg text-secondary-400 mb-4 flex items-center">
             <ChevronRight className="w-4 h-4 mr-1" /> Contexte Élève
          </h3>
          <div className="space-y-3">
             <div className="flex justify-between text-xs">
               <span className="text-gray-500">Rang :</span>
               <span className={`font-bold ${rank.color}`}>{rank.name}</span>
             </div>
             <div className="flex justify-between text-xs">
               <span className="text-gray-500">Maîtrise Globale :</span>
               <span className="text-white font-bold">{averageMastery}%</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
