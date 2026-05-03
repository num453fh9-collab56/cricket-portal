import { Match } from '@/lib/cricapi';

interface MatchCardProps {
  match: Match;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status.toLowerCase().includes('live') || match.status.toLowerCase().includes('progress');

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 shadow-xl group">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {match.matchType.toUpperCase()} • {match.venue}
        </span>
        {isLive && (
          <span className="flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            LIVE
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {match.teams[0]}
          </h3>
          <div className="text-right">
            {match.score[0] ? (
              <span className="text-lg font-bold text-slate-200">
                {match.score[0].r}/{match.score[0].w} <span className="text-sm font-normal text-slate-400">({match.score[0].o})</span>
              </span>
            ) : (
              <span className="text-slate-500">Yet to bat</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
            {match.teams[1]}
          </h3>
          <div className="text-right">
            {match.score[1] ? (
              <span className="text-lg font-bold text-slate-200">
                {match.score[1].r}/{match.score[1].w} <span className="text-sm font-normal text-slate-400">({match.score[1].o})</span>
              </span>
            ) : (
              <span className="text-slate-500">Yet to bat</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700">
        <p className="text-sm text-blue-400 font-medium italic">
          {match.status}
        </p>
      </div>
    </div>
  );
}
