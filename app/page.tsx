"use client";
import { useEffect, useState } from 'react';

export default function CricketDashboard() {
  const [matches, setMatches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aapka GitHub JSON link (update this if you have a new one)
    const dataUrl = "https://raw.githubusercontent.com/num453fh9-collab56/cricket-portal/main/live_score.json";

    const fetchScores = () => {
      fetch(dataUrl)
        .then(res => res.json())
        .then(json => {
          setMatches(Array.isArray(json) ? json : [json]);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching score:", err);
          setIsLoading(false);
        });
    };

    fetchScores();
    const interval = setInterval(fetchScores, 30000); // Har 30 sec baad refresh
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = matches.filter(match => {
    const matchText = (match.match || "").toLowerCase();
    const statusText = (match.status || "").toLowerCase();
    const tournamentText = (match.tournament || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return matchText.includes(search) || statusText.includes(search) || tournamentText.includes(search);
  });

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
        <p className="text-xl font-medium animate-pulse">Loading Live Matches...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-900 p-4 md:p-8 font-sans text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            🏏 LIVE CRICKET PORTAL
          </h1>
          <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">
            Real-time Match Updates & AI Insights
          </p>
        </header>

        {/* Search Bar */}
        <div className="mb-10 relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search matches, series, or status..."
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-4 px-6 text-lg focus:outline-none focus:border-green-500 transition-all shadow-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500">
             🔍
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {matches.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-2xl text-slate-500 font-bold">No Matches Found</p>
            </div>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((match, idx) => (
              <div key={idx} className="group rounded-3xl bg-slate-800 p-6 shadow-xl border-t-4 border-green-500 hover:scale-[1.02] transition-transform duration-300">
                <div className="mb-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span className="truncate max-w-[200px]">{match.tournament || "Match"}</span>
                  <span className="flex items-center gap-2 text-green-400">
                    <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                    LIVE
                  </span>
                </div>

                <h2 className="mb-3 text-2xl font-bold group-hover:text-green-400 transition-colors">{match.match || "Unknown Match"}</h2>
                <div className="mb-6 text-4xl font-black text-green-400">{match.score || "--/--"}</div>

                <div className="rounded-xl bg-slate-700/50 p-4 mb-6">
                  <p className="text-md text-slate-200 italic font-medium">"{match.status || "Status Unavailable"}"</p>
                </div>

                {match.ai_insight && (
                  <div className="mt-6 border-t border-slate-700 pt-6">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-yellow-500">AI Savage Insight</h3>
                    <p className="text-lg font-medium leading-relaxed text-yellow-50">
                      🔥 {match.ai_insight}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-2xl text-slate-500 font-bold">No matches found for "{searchTerm}"</p>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center border-t border-slate-800 pt-8">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">
            Auto-updated by Jarvis AI • Every 30 seconds
          </p>
        </footer>
      </div>
    </main>
  );
}
