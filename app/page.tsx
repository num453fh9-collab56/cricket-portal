"use client";
import { useEffect, useState } from 'react';

export default function CricketDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Aapka GitHub JSON link
    const dataUrl = "https://raw.githubusercontent.com/num453fh9-collab56/cricket-portal/main/live_score.json";
    
    const fetchScore = () => {
      fetch(dataUrl)
        .then(res => res.json())
        .then(json => setData(json))
        .catch(err => console.error("Error fetching score:", err));
    };

    fetchScore();
    const interval = setInterval(fetchScore, 30000); // Har 30 sec baad refresh
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Live Scores...</div>;

  return (
    <main className="min-h-screen bg-slate-900 p-8 font-sans text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-green-400">
          🏏 LIVE CRICKET PORTAL
        </h1>

        <div className="rounded-3xl bg-slate-800 p-8 shadow-2xl border-l-8 border-green-500">
          <div className="mb-4 flex justify-between items-center text-sm font-bold uppercase tracking-widest text-slate-400">
            <span>Live Match</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
              LIVE
            </span>
          </div>

          <h2 className="mb-2 text-3xl font-bold">{data.match}</h2>
          <div className="mb-6 text-5xl font-black text-green-400">{data.score}</div>
          
          <div className="rounded-xl bg-slate-700/50 p-4 mb-6">
            <p className="text-lg text-slate-200 italic">"{data.status}"</p>
          </div>

          <div className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-green-500">AI Savage Commentary</h3>
            <p className="text-xl font-medium leading-relaxed text-yellow-100">
              🔥 {data.commentary}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500 uppercase">
          Auto-updated by Jarvis AI • Every 10 minutes
        </p>
      </div>
    </main>
  );
}