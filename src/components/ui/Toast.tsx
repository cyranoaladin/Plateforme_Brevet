"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Zap, Gem, Trophy } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "xp" | "gems" | "levelup";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  amount?: number;
}

export function ToastContainer({ toasts, removeToast }: { toasts: ToastProps[], removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ message, type, amount, onClose }: ToastProps & { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-success-500" />,
    xp: <Zap className="w-5 h-5 text-primary-400 fill-primary-400" />,
    gems: <Gem className="w-5 h-5 text-secondary-400 fill-secondary-400" />,
    levelup: <Trophy className="w-6 h-6 text-accent-500" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="bg-surface border border-surface-hover shadow-2xl rounded-xl p-4 flex items-center space-x-4 min-w-[280px]"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{message}</p>
        {amount && <p className={`text-lg font-bebas ${type === 'xp' ? 'text-primary-400' : 'text-secondary-400'}`}>+{amount}</p>}
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-white">&times;</button>
    </motion.div>
  );
}
