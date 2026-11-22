import React from 'react';
import { Search, Bell, RefreshCw, DollarSign, Sparkles } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing, analytics }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search deals, sponsor brands, campaign deliverables..."
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/50 w-72 transition-colors"
          />
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Pipeline: <strong className="text-white">${analytics?.activePipelineValue?.toLocaleString() || '38,000'}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">
            YTD Revenue: <strong className="text-emerald-400">${analytics?.totalRevenueYearToDate?.toLocaleString() || '84,600'}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Refresh sponsorship data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5 pl-1">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-xs text-white shadow-sm">
            CD
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">Creator Studio</div>
            <div className="text-[10px] text-rose-400">Partner Tier VIP</div>
          </div>
        </div>
      </div>
    </header>
  );
}
