"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4">
      <div className="bg-surface border border-red-500/30 p-10 rounded-3xl shadow-2xl max-w-lg text-center">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bebas tracking-wider mb-4">Oups ! Une erreur est survenue.</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Le système a rencontré un problème inattendu. Pas d&apos;inquiétude, ta progression est sauvegardée en sécurité.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Réessayer</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 bg-surface-hover hover:bg-gray-700 text-white px-6 py-4 rounded-xl font-bold transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Retourner au QG</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
