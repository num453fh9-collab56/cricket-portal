'use client';
import { useEffect, useState } from 'react';
import { Match } from '@/lib/cricapi';
import FilterButtons from '@/components/FilterButtons';
import MatchCard from '@/components/MatchCard';

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const filteredMatches = matches.filter((match) => {
    if (filter === 'all') return true;
    return match.matchType.toLowerCase() === filter;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Live Match Center
          </span>
        </h1>
        <p className="text-slate-400 text-lg">
          Real-time scores and match analysis from around the world.
        </p>
      </div>

      <FilterButtons currentFilter={filter} setFilter={setFilter} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-800 rounded-2xl border border-slate-700"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-xl text-slate-500 font-medium">No {filter !== 'all' ? filter.toUpperCase() : ''} matches found.</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
