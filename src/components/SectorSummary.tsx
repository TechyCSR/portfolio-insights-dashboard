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
    <div className="bg-white border border-black rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
            Sector Summary &amp; Allocation
          </h2>
          <p className="text-xs text-neutral-500">
            Performance and capital allocation by sector
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedSector && (
            <button
              onClick={() => onSelectSector(null)}
              className="text-xs text-neutral-700 hover:text-black px-2 py-1 rounded bg-neutral-100 border border-gray-300 transition cursor-pointer font-medium"
            >
              Clear filter ({selectedSector})
            </button>
          )}

          <div className="flex items-center bg-neutral-100 p-0.5 rounded border border-gray-200">
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                viewMode === "cards"
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:text-black"
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="w-full text-left text-xs text-neutral-800">
            <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-gray-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Stocks</th>
                <th className="py-2.5 px-3 text-right">Investment</th>
                <th className="py-2.5 px-3 text-right">Present Value</th>
                <th className="py-2.5 px-3 text-right">Gain / Loss</th>
                <th className="py-2.5 px-3 text-right">Return %</th>
                <th className="py-2.5 px-3 text-right">Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sectors.map((sec) => {
                const isProfit = sec.gainLoss >= 0;
                const isSelected = selectedSector === sec.sector;

                return (
                  <tr
                    key={sec.sector}
                    onClick={() => onSelectSector(isSelected ? null : sec.sector)}
                    className={`transition cursor-pointer ${
                      isSelected
                        ? "bg-neutral-100 text-black font-semibold"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <td className="py-3 px-3 font-semibold text-neutral-900 whitespace-nowrap">
                      {sec.sector}
                    </td>
                    <td className="py-3 px-3 text-right text-neutral-600 whitespace-nowrap tabular-nums">
                      {sec.stockCount}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-neutral-900 whitespace-nowrap tabular-nums">
                      {formatCurrency(sec.totalInvestment, "INR", 0)}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-neutral-900 whitespace-nowrap tabular-nums">
                      {formatCurrency(sec.totalPresentValue, "INR", 0)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold whitespace-nowrap tabular-nums ${
                        isProfit ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(sec.gainLoss, "INR", 0)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold whitespace-nowrap tabular-nums ${
                        isProfit ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {formatPercentage(sec.returnPercentage)}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-neutral-700 font-mono text-[11px] font-medium">
                          {sec.allocationPercentage.toFixed(1)}%
                        </span>
                        <div className="w-12 bg-neutral-200 h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-black h-full rounded-full"
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
                className={`p-3.5 rounded border transition cursor-pointer ${
                  isSelected
                    ? "bg-neutral-50 border-neutral-900 shadow-xs ring-1 ring-neutral-900"
                    : "bg-white border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-neutral-900 text-sm">
                      {sec.sector}
                    </span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 border border-gray-200 font-medium">
                      {sec.stockCount} {sec.stockCount === 1 ? "stock" : "stocks"}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isProfit ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {formatPercentage(sec.returnPercentage)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Investment:</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(sec.totalInvestment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Present Value:</span>
                    <span className="font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(sec.totalPresentValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Gain / Loss:</span>
                    <span
                      className={`font-semibold tabular-nums ${
                        isProfit ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {formatCurrency(sec.gainLoss)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                    <span className="text-neutral-500">Portfolio Weight:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-neutral-800 font-semibold">
                        {sec.allocationPercentage.toFixed(2)}%
                      </span>
                      <div className="w-16 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-black h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(5, sec.allocationPercentage))}%`
                          }}
                        />
                      </div>
                    </div>
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
