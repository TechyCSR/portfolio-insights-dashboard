"use client";

import { RefreshCw, Clock } from "lucide-react";
import { formatTime } from "../utils/formatters";

interface NavbarProps {
  lastUpdated: string | null;
  isRefreshing: boolean;
  countdown: number;
  onRefresh: () => void;
}

export function Navbar({
  lastUpdated,
  isRefreshing,
  countdown,
  onRefresh
}: NavbarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-sm">
            PI
          </div>
          <h1 className="text-base font-semibold text-white tracking-tight leading-none">
            Portfolio Insight Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-md">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Updated:</span>
            <span className="font-mono text-slate-200">
              {formatTime(lastUpdated)}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">Next:</span>
            <span className="font-mono text-emerald-400 font-medium w-4 text-center">
              {countdown}s
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-md transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-slate-300" : "text-slate-300"}`}
            />
            <span>{isRefreshing ? "Syncing" : "Refresh"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
