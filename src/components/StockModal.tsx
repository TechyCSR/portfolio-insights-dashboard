"use client";

import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-white tracking-tight">
                {holding.stockName}
              </h3>
              <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {holding.exchangeCode}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {holding.sector}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Yahoo: {holding.yfSymbol} • Google: {holding.gfSymbol}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {holding.notes && (
            <div className="px-3 py-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
              Note: {holding.notes}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 block text-[11px]">Current Price</span>
              <span className="text-base font-semibold text-white block mt-0.5 tabular-nums">
                {formatCurrency(holding.cmp)}
              </span>
              <span className="text-[10px] text-slate-500">Yahoo Finance</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 block text-[11px]">Purchase Price</span>
              <span className="text-base font-semibold text-white block mt-0.5 tabular-nums">
                {formatCurrency(holding.purchasePrice)}
              </span>
              <span className="text-[10px] text-slate-500">Qty: {holding.quantity}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 block text-[11px]">Investment</span>
              <span className="text-base font-semibold text-white block mt-0.5 tabular-nums">
                {formatCurrency(holding.investment)}
              </span>
              <span className="text-[10px] text-slate-500">Weight: {holding.portfolioPercentage}%</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 p-3 rounded">
              <span className="text-slate-400 block text-[11px]">Present Value</span>
              <span className="text-base font-semibold text-white block mt-0.5 tabular-nums">
                {formatCurrency(holding.presentValue)}
              </span>
              <span className="text-[10px] text-slate-500">CMP × Qty</span>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded p-3.5 space-y-2.5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Performance &amp; Fundamentals
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Gain / Loss</span>
                <span
                  className={`font-semibold text-sm block mt-0.5 tabular-nums ${
                    isProfit ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatCurrency(holding.gainLoss)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Return</span>
                <span
                  className={`font-semibold text-sm block mt-0.5 tabular-nums ${
                    isProfit ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPercentage(holding.gainLossPercentage)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">P/E Ratio</span>
                <span className="font-semibold text-sm text-slate-200 block mt-0.5 tabular-nums">
                  {formatNumber(holding.peRatio)}
                </span>
                <span className="text-[10px] text-slate-500">Google Finance</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Latest Earnings</span>
                <span className="font-semibold text-sm text-slate-200 block mt-0.5 tabular-nums">
                  {holding.latestEarnings !== null
                    ? `₹${holding.latestEarnings}`
                    : "Unavailable"}
                </span>
                <span className="text-[10px] text-slate-500">Google Finance</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-slate-800 rounded p-3.5 space-y-2.5">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Trading Context
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Day Change</span>
                <span
                  className={`font-medium block mt-0.5 tabular-nums ${
                    isDayPositive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formatPercentage(holding.dayChangePercent)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">52-Week High</span>
                <span className="font-medium text-slate-200 block mt-0.5 tabular-nums">
                  {formatCurrency(holding.fiftyTwoWeekHigh)}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">52-Week Low</span>
                <span className="font-medium text-slate-200 block mt-0.5 tabular-nums">
                  {formatCurrency(holding.fiftyTwoWeekLow)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 border-t border-slate-800">
            <span>Updated: {formatTime(holding.lastUpdated)}</span>
            <div className="flex items-center space-x-3">
              <a
                href={`https://finance.yahoo.com/quote/${holding.yfSymbol}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white inline-flex items-center space-x-1"
              >
                <span>Yahoo</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={`https://www.google.com/finance/quote/${holding.gfSymbol}`}
                target="_blank"
                rel="noreferrer"
                className="text-slate-300 hover:text-white inline-flex items-center space-x-1"
              >
                <span>Google</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
