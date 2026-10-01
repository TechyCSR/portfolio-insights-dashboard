"use client";

import { RefreshCw } from "lucide-react";
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
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">
            Portfolio Insight Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded border border-gray-200">
            <span>Last updated:</span>
            <span className="font-mono text-gray-900">
              {formatTime(lastUpdated)}
            </span>
            <span className="text-gray-300">•</span>
            <span>Next refresh:</span>
            <span className="font-mono text-gray-900 w-5 text-center">
              {countdown}s
            </span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 px-3 py-1.5 rounded transition disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-gray-700" : "text-gray-500"}`}
            />
            <span>{isRefreshing ? "Updating..." : "Refresh"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
