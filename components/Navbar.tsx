'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🏏</span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                CricketTon
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              <Link href="#" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Matches</Link>
              <Link href="#" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Series</Link>
              <Link href="#" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Rankings</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
