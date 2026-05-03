'use client';

interface FilterButtonsProps {
  currentFilter: string;
  setFilter: (filter: string) => void;
}

export default function FilterButtons({ currentFilter, setFilter }: FilterButtonsProps) {
  const filters = ['All', 'T20', 'ODI', 'Test'];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter.toLowerCase())}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            (filter.toLowerCase() === currentFilter || (filter === 'All' && currentFilter === 'all'))
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
