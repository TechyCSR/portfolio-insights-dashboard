"use client";

import { PortfolioSummary } from "../types/portfolio";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isProfit = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
        <span className="text-xs font-medium text-slate-400 block">Total Investment</span>
        <div className="text-xl font-bold text-white tracking-tight mt-1.5 tabular-nums">
          {formatCurrency(summary.totalInvestment)}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Cost basis across all 26 stocks</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
        <span className="text-xs font-medium text-slate-400 block">Current Portfolio Value</span>
        <div className="text-xl font-bold text-white tracking-tight mt-1.5 tabular-nums">
          {formatCurrency(summary.currentPortfolioValue)}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Live market valuation</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
        <span className="text-xs font-medium text-slate-400 block">Total Gain / Loss</span>
        <div
          className={`text-xl font-bold tracking-tight mt-1.5 tabular-nums ${
            isProfit ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {formatCurrency(summary.totalGainLoss)}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Unrealized net P&amp;L</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
        <span className="text-xs font-medium text-slate-400 block">Overall Return</span>
        <div
          className={`text-xl font-bold tracking-tight mt-1.5 tabular-nums ${
            isProfit ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {formatPercentage(summary.overallReturnPercentage)}
        </div>
        <p className="text-[11px] text-slate-500 mt-1">Cumulative return percentage</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm">
        <span className="text-xs font-medium text-slate-400 block">Number of Holdings</span>
        <div className="text-xl font-bold text-white tracking-tight mt-1.5 tabular-nums">
          {summary.totalHoldings}
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-1">
          <span className="text-emerald-400 font-medium">{summary.gainersCount} up</span>
          <span>•</span>
          <span className="text-rose-400 font-medium">{summary.losersCount} down</span>
        </div>
      </div>
    </div>
  );
}
