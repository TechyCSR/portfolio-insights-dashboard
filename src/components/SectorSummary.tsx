"use client";

import { PieChart, TrendingDown, TrendingUp } from "lucide-react";
import { SectorSummary as SectorSummaryType } from "../types/portfolio";
import { formatCurrency, formatPercentage } from "../utils/formatters";

interface SectorSummaryProps {
  sectors: SectorSummaryType[];
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
}

export function SectorSummary({
  sectors,
  selectedSector,
  onSelectSector
}: SectorSummaryProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <PieChart className="h-5 w-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-tight">
            Sector Summary &amp; Allocation
          </h2>
        </div>
        {selectedSector && (
          <button
            onClick={() => onSelectSector(null)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium self-start sm:self-auto cursor-pointer"
          >
            Clear sector filter ({selectedSector})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {sectors.map((sec) => {
          const isProfit = sec.gainLoss >= 0;
          const isSelected = selectedSector === sec.sector;

          return (
            <div
              key={sec.sector}
              onClick={() => onSelectSector(isSelected ? null : sec.sector)}
              className={`p-3.5 rounded-lg border transition cursor-pointer ${
                isSelected
                  ? "bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/50"
                  : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-white text-sm">
                    {sec.sector}
                  </span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {sec.stockCount} {sec.stockCount === 1 ? "stock" : "stocks"}
                  </span>
                </div>
                <div
                  className={`flex items-center space-x-1 text-xs font-semibold ${
                    isProfit ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isProfit ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>{formatPercentage(sec.returnPercentage)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Investment</span>
                  <span className="font-medium text-slate-200">
                    {formatCurrency(sec.totalInvestment, "INR", 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Present Value</span>
                  <span className="font-medium text-slate-200">
                    {formatCurrency(sec.totalPresentValue, "INR", 0)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Gain / Loss</span>
                  <span
                    className={`font-semibold ${
                      isProfit ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatCurrency(sec.gainLoss, "INR", 0)}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Portfolio Weight</span>
                  <span className="font-mono text-slate-300">
                    {sec.allocationPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(3, sec.allocationPercentage))}%`
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
