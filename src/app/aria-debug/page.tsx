"use client";

import { useState } from "react";
import { Search, Database, RefreshCw, ChevronRight } from "lucide-react";
import { RetrievedChunk } from "@/services/aria/types";

export default function AriaDebugPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RetrievedChunk[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    setIsPending(true);
    try {
      const res = await fetch("/api/aria/debug/seed", { method: "POST" });
      const data = await res.json();
      setMessage(`Seed OK: ${data.count} chunks insérés.`);
    } catch {
      setMessage("Erreur Seed");
    } finally {
      setIsPending(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsPending(true);
    try {
      const res = await fetch("/api/aria/debug/search", {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      setResults(data.chunks || []);
    } catch {
      setMessage("Erreur Search");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <div className="flex items-center justify-between border-b border-surface-hover pb-6">
        <div>
          <h1 className="text-4xl font-bebas text-white">ARIA RAG Debug Console</h1>
          <p className="text-gray-400">Test du moteur de retrieval local (Qdrant)</p>
        </div>
        <button 
          onClick={handleSeed}
          disabled={isPending}
          className="flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          <Database className="w-5 h-5" />
          <span>Lancer Seed (Fake BO)</span>
        </button>
      </div>

      {message && (
        <div className="bg-primary-500/10 border border-primary-500/30 p-4 rounded-xl text-primary-400 text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Entrez une requête pour tester le moteur vectoriel..."
          className="w-full bg-surface border-2 border-surface-hover rounded-2xl px-6 py-5 text-xl text-white focus:outline-none focus:border-primary-500 transition-all pl-14"
        />
        <Search className="absolute left-5 top-6 text-gray-500 w-6 h-6" />
        <button 
          type="submit"
          disabled={isPending}
          className="absolute right-4 top-4 bg-primary-500 p-3 rounded-xl text-white hover:bg-primary-600 transition-all"
        >
          {isPending ? <RefreshCw className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-2xl font-bebas text-white flex items-center">
          <Database className="w-6 h-6 mr-2 text-secondary-500" /> 
          Résultats du Retrieval ({results.length})
        </h2>
        
        {results.length > 0 ? (
          results.map((chunk, i) => {
            const meta = chunk.metadata as Record<string, string | number>;
            return (
              <div key={i} className="bg-surface rounded-2xl border border-surface-hover p-6 hover:border-primary-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mr-3">
                      {meta.sourceTitle || meta.source}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase">
                      Score: {chunk.score.toFixed(4)}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono">ID: {chunk.id}</span>
                </div>
                <p className="text-gray-300 leading-relaxed italic">&quot;{chunk.text}&quot;</p>
                <div className="mt-4 pt-4 border-t border-surface-hover grid grid-cols-3 gap-4 text-[10px]">
                  <div className="text-gray-500">Matière: <span className="text-white">{meta.subject}</span></div>
                  <div className="text-gray-500">Année: <span className="text-white">{meta.year}</span></div>
                  <div className="text-gray-500">Notion: <span className="text-white">{meta.notionId}</span></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-surface/30 rounded-3xl border-2 border-dashed border-surface-hover">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-500">Aucun résultat. Lancez un seed puis faites une recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
}
