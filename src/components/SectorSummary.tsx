"use client";

import { useState } from "react";
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
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Sector Summary &amp; Allocation
          </h2>
          <p className="text-xs text-slate-400">
            Performance and capital allocation grouped by sector
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedSector && (
            <button
              onClick={() => onSelectSector(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700 transition cursor-pointer"
            >
              Reset ({selectedSector})
            </button>
          )}

          <div className="flex items-center bg-slate-800 p-0.5 rounded-md border border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2.5 py-1 text-xs font-medium rounded transition cursor-pointer ${
                viewMode === "cards"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Holdings</th>
                <th className="py-2.5 px-3 text-right">Investment</th>
                <th className="py-2.5 px-3 text-right">Present Value</th>
                <th className="py-2.5 px-3 text-right">Gain / Loss</th>
                <th className="py-2.5 px-3 text-right">Return %</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sectors.map((sec) => {
                const isProfit = sec.gainLoss >= 0;
                const isSelected = selectedSector === sec.sector;

                return (
                  <tr
                    key={sec.sector}
                    onClick={() => onSelectSector(isSelected ? null : sec.sector)}
                    className={`transition cursor-pointer ${
                      isSelected
                        ? "bg-slate-800 text-white"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <td className="py-3 px-3 font-medium text-white whitespace-nowrap">
                      {sec.sector}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 whitespace-nowrap tabular-nums">
                      {sec.stockCount}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-200 whitespace-nowrap tabular-nums">
                      {formatCurrency(sec.totalInvestment, "INR", 0)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-200 whitespace-nowrap tabular-nums">
                      {formatCurrency(sec.totalPresentValue, "INR", 0)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold whitespace-nowrap tabular-nums ${
                        isProfit ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(sec.gainLoss, "INR", 0)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold whitespace-nowrap tabular-nums ${
                        isProfit ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatPercentage(sec.returnPercentage)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-slate-300 font-mono text-[11px]">
                          {sec.allocationPercentage.toFixed(1)}%
                        </span>
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-slate-400 h-full rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(5, sec.allocationPercentage))}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sectors.map((sec) => {
            const isProfit = sec.gainLoss >= 0;
            const isSelected = selectedSector === sec.sector;

            return (
              <div
                key={sec.sector}
                onClick={() => onSelectSector(isSelected ? null : sec.sector)}
                className={`p-3.5 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-800 border-slate-600"
                    : "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white text-sm">
                      {sec.sector}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {sec.stockCount} {sec.stockCount === 1 ? "stock" : "stocks"}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isProfit ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatPercentage(sec.returnPercentage)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Investment:</span>
                    <span className="font-medium text-slate-200 tabular-nums">
                      {formatCurrency(sec.totalInvestment, "INR", 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Present Value:</span>
                    <span className="font-medium text-slate-200 tabular-nums">
                      {formatCurrency(sec.totalPresentValue, "INR", 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gain / Loss:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        isProfit ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {formatCurrency(sec.gainLoss, "INR", 0)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Portfolio Weight</span>
                    <span className="font-mono text-slate-300">
                      {sec.allocationPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-400 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(5, sec.allocationPercentage))}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
