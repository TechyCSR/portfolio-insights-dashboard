"use client";

import { PortfolioSummary } from "../types/portfolio";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface SummaryCardsProps {
  summary: PortfolioSummary;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const isProfit = summary.totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <div className="bg-white border border-black rounded-lg p-4 shadow-xs">
        <span className="text-xs text-neutral-600 block font-medium">Total Investment</span>
        <div className="text-xl font-bold text-neutral-900 tracking-tight mt-1 tabular-nums">
          {formatCurrency(summary.totalInvestment)}
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">Cost basis for 26 stocks</p>
      </div>

      <div className="bg-white border border-black rounded-lg p-4 shadow-xs">
        <span className="text-xs text-neutral-600 block font-medium">Current Valuation</span>
        <div className="text-xl font-bold text-neutral-900 tracking-tight mt-1 tabular-nums">
          {formatCurrency(summary.currentPortfolioValue)}
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">Live market value</p>
      </div>

      <div className="bg-white border border-black rounded-lg p-4 shadow-xs">
        <span className="text-xs text-neutral-600 block font-medium">Total Gain / Loss</span>
        <div
          className={`text-xl font-bold tracking-tight mt-1 tabular-nums ${
            isProfit ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {formatCurrency(summary.totalGainLoss)}
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">Unrealized net P&amp;L</p>
      </div>

      <div className="bg-white border border-black rounded-lg p-4 shadow-xs">
        <span className="text-xs text-neutral-600 block font-medium">Overall Return</span>
        <div
          className={`text-xl font-bold tracking-tight mt-1 tabular-nums ${
            isProfit ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {formatPercentage(summary.overallReturnPercentage)}
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">Cumulative return percentage</p>
      </div>

      <div className="bg-white border border-black rounded-lg p-4 shadow-xs">
        <span className="text-xs text-neutral-600 block font-medium">Holdings</span>
        <div className="text-xl font-bold text-neutral-900 tracking-tight mt-1 tabular-nums">
          {summary.totalHoldings} stocks
        </div>
        <p className="text-[11px] text-neutral-500 mt-1">
          <span className="text-emerald-700 font-semibold">{summary.gainersCount} up</span>
          {" "}•{" "}
          <span className="text-rose-700 font-semibold">{summary.losersCount} down</span>
        </p>
      </div>
    </div>
  );
}
