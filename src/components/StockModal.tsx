"use client";

import { useEffect } from "react";
import { X, TrendingUp, TrendingDown, ExternalLink, ShieldAlert } from "lucide-react";
import { EnrichedHolding } from "../types/portfolio";
import { formatCurrency, formatNumber, formatPercentage, formatTime } from "../utils/formatters";

interface StockModalProps {
  holding: EnrichedHolding | null;
  onClose: () => void;
}

export function StockModal({ holding, onClose }: StockModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!holding) return null;

  const isProfit = holding.gainLoss !== null && holding.gainLoss >= 0;
  const isDayPositive = holding.dayChange !== null && holding.dayChange >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {holding.stockName}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {holding.exchangeCode}
                </span>
                <span className="text-xs px-2 py-0.5 rounded font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {holding.sector}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Yahoo Symbol: {holding.yfSymbol} • Google Symbol: {holding.gfSymbol}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {holding.notes && (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                <strong>Portfolio Note:</strong> {holding.notes}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Current Price (CMP)</span>
              <span className="text-lg font-bold text-white block mt-1">
                {formatCurrency(holding.cmp)}
              </span>
              <span className="text-[10px] text-slate-500">Source: Yahoo Finance</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Purchase Price</span>
              <span className="text-lg font-bold text-white block mt-1">
                {formatCurrency(holding.purchasePrice)}
              </span>
              <span className="text-[10px] text-slate-500">Qty: {holding.quantity}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Total Investment</span>
              <span className="text-lg font-bold text-white block mt-1">
                {formatCurrency(holding.investment)}
              </span>
              <span className="text-[10px] text-slate-500">Weight: {holding.portfolioPercentage}%</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded-xl">
              <span className="text-xs text-slate-400 block">Present Value</span>
              <span className="text-lg font-bold text-white block mt-1">
                {formatCurrency(holding.presentValue)}
              </span>
              <span className="text-[10px] text-slate-500">Based on live CMP</span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Performance &amp; Valuation
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Gain / Loss</span>
                <div
                  className={`flex items-center space-x-1 font-bold mt-1 ${
                    isProfit ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isProfit ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{formatCurrency(holding.gainLoss)}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Return %</span>
                <span
                  className={`font-bold block mt-1 ${
                    isProfit ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPercentage(holding.gainLossPercentage)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">P/E Ratio</span>
                <span className="font-bold text-slate-200 block mt-1">
                  {formatNumber(holding.peRatio)}
                </span>
                <span className="text-[10px] text-slate-500">Google Finance</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Latest Earnings</span>
                <span className="font-bold text-slate-200 block mt-1">
                  {holding.latestEarnings !== null
                    ? `₹${holding.latestEarnings}`
                    : "Unavailable"}
                </span>
                <span className="text-[10px] text-slate-500">Google Finance</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Market Context &amp; Range
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Day Change</span>
                <span
                  className={`font-semibold block mt-1 ${
                    isDayPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPercentage(holding.dayChangePercent)}
                  {holding.dayChange !== null && (
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      ({formatCurrency(holding.dayChange)})
                    </span>
                  )}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">52-Week High</span>
                <span className="font-semibold text-slate-200 block mt-1">
                  {formatCurrency(holding.fiftyTwoWeekHigh)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">52-Week Low</span>
                <span className="font-semibold text-slate-200 block mt-1">
                  {formatCurrency(holding.fiftyTwoWeekLow)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800">
            <div>
              <span>Last updated: </span>
              <span className="font-mono text-slate-300">
                {formatTime(holding.lastUpdated)}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href={`https://finance.yahoo.com/quote/${holding.yfSymbol}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>Yahoo Finance</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <span>•</span>
              <a
                href={`https://www.google.com/finance/quote/${holding.gfSymbol}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 transition"
              >
                <span>Google Finance</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
