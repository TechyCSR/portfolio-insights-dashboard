"use client";

import { TrendingUp, TrendingDown, Wallet, Layers, DollarSign } from "lucide-react";
import { PortfolioSummary } from "../types/portfolio";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isProfit = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Investment</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(summary.totalInvestment)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cost basis across all positions</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Current Value</span>
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(summary.currentPortfolioValue)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Live market valuation</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Total Gain / Loss</span>
          <div
            className={`p-2 rounded-lg ${
              isProfit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </div>
        </div>
        <div className="mt-2">
          <div
            className={`text-2xl font-bold tracking-tight ${
              isProfit ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatCurrency(summary.totalGainLoss)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Net unrealized P&amp;L</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Overall Return</span>
          <div
            className={`p-2 rounded-lg ${
              isProfit ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {isProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </div>
        </div>
        <div className="mt-2">
          <div
            className={`text-2xl font-bold tracking-tight ${
              isProfit ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {formatPercentage(summary.overallReturnPercentage)}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cumulative portfolio ROI</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Holdings</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-white tracking-tight">
            {summary.totalHoldings}
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
            <span className="text-emerald-400 font-medium">{summary.gainersCount} up</span>
            <span>•</span>
            <span className="text-rose-400 font-medium">{summary.losersCount} down</span>
          </div>
        </div>
      </div>
    </div>
  );
}
