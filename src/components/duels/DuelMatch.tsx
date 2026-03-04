"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGame } from "@/context/GameContext";
import { DuelEngine, MCQQuestion } from "@/services/duelEngine";
import { NotionWithSubject } from "@/services/questEngine";
import { DuelMatch as DuelMatchType } from "@/types/game";
import { CheckCircle2, XCircle, Trophy, Skull, Swords } from "lucide-react";

interface DuelMatchProps {
  notion: NotionWithSubject;
  questions: MCQQuestion[];
  opponentName: string;
  onFinish: () => void;
}

export function DuelMatch({ notion, questions, opponentName, onFinish }: DuelMatchProps) {
  const { completeDuel } = useGame();
  const [step, setStep] = useState(0); // 0-2: questions, 3: result
  const [score, setScore] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [finalResult, setFinalResult] = useState<DuelMatchType | null>(null);

  const currentQ = questions[step];

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    
    const isCorrect = idx === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (step < 2) {
        setStep(s => s + 1);
        setSelectedIdx(null);
        setIsAnswered(false);
      } else {
        const opponentScore = DuelEngine.simulateOpponentScore();
        const myFinalScore = score + (isCorrect ? 1 : 0);
        const result = DuelEngine.resolveDuel(myFinalScore, opponentScore, opponentName, notion);
        setFinalResult(result);
        completeDuel(result);
        setStep(3);
      }
    }, 1500);
  };

  if (step === 3 && finalResult) {
    const isVictory = finalResult.status === 'victory';
    const isDraw = finalResult.status === 'draw';

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-surface p-10 rounded-3xl border border-surface-hover shadow-2xl text-center space-y-8"
      >
        <div className="flex justify-center">
          {isVictory ? (
            <div className="bg-yellow-500/20 p-6 rounded-full"><Trophy className="w-20 h-20 text-yellow-500" /></div>
          ) : isDraw ? (
            <div className="bg-blue-500/20 p-6 rounded-full"><Swords className="w-20 h-20 text-blue-500" /></div>
          ) : (
            <div className="bg-red-500/20 p-6 rounded-full"><Skull className="w-20 h-20 text-red-500" /></div>
          )}
        </div>

        <div>
          <h2 className="text-5xl font-bebas text-white tracking-widest mb-2">
            {isVictory ? "VICTOIRE !" : isDraw ? "ÉGALITÉ" : "DÉFAITE..."}
          </h2>
          <p className="text-gray-400">Score final : {finalResult.myScore} - {finalResult.opponentScore}</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-primary-500/10 p-4 rounded-2xl border border-primary-500/20">
            <span className="text-[10px] uppercase font-bold text-primary-400">XP Gagné</span>
            <p className="text-2xl font-bebas text-white">+{finalResult.xpReward}</p>
          </div>
          <div className="bg-secondary-500/10 p-4 rounded-2xl border border-secondary-500/20">
            <span className="text-[10px] uppercase font-bold text-secondary-400">Gemmes</span>
            <p className="text-2xl font-bebas text-white">+{finalResult.gemsReward}</p>
          </div>
        </div>

        <button 
          onClick={onFinish}
          className="w-full bg-surface-hover hover:bg-gray-700 text-white py-4 rounded-2xl font-bold transition-all"
        >
          Retour au Lobby
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Duel Header */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-surface-hover shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">T</div>
          <div className="text-left">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Toi</p>
            <p className="font-bebas text-lg text-white">Score: {score}</p>
          </div>
        </div>
        <div className="font-bebas text-2xl text-gray-600 tracking-widest italic opacity-50">VS</div>
        <div className="flex items-center space-x-3 text-right">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">{opponentName}</p>
            <p className="font-bebas text-lg text-white">Concurrent</p>
          </div>
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">B</div>
        </div>
      </div>

      <div className="flex space-x-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < step ? 'bg-primary-500' : (i === step ? 'bg-primary-500/30 animate-pulse' : 'bg-surface-hover')}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-surface p-8 rounded-3xl border border-surface-hover shadow-xl space-y-8"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold text-secondary-400 uppercase tracking-widest">Question {step + 1} / 3</span>
            <h3 className="text-2xl font-medium text-white leading-relaxed">{currentQ.question}</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={`p-5 rounded-2xl text-left font-medium transition-all flex justify-between items-center group ${
                  selectedIdx === idx 
                    ? (idx === currentQ.correctAnswer ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]')
                    : (isAnswered && idx === currentQ.correctAnswer ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-background border-surface-hover text-gray-300 hover:border-primary-500/50')
                } border-2`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {isAnswered && selectedIdx === idx && idx !== currentQ.correctAnswer && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
