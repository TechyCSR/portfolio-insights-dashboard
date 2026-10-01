"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  ChevronRight
} from "lucide-react";
import { EnrichedHolding } from "../types/portfolio";
import {
  formatCurrency,
  formatNumber,
  formatPercentage
} from "../utils/formatters";

interface PortfolioTableProps {
  holdings: EnrichedHolding[];
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
  onSelectHolding: (holding: EnrichedHolding) => void;
  isRefreshing: boolean;
}

type SortField =
  | "stockName"
  | "purchasePrice"
  | "quantity"
  | "investment"
  | "portfolioPercentage"
  | "exchangeCode"
  | "cmp"
  | "presentValue"
  | "gainLoss"
  | "peRatio"
  | "latestEarnings";

export function PortfolioTable({
  holdings,
  selectedSector,
  onSelectSector,
  onSelectHolding,
  isRefreshing
}: PortfolioTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("portfolioPercentage");
  const [sortAscending, setSortAscending] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "profit" | "loss">("all");

  const sectors = useMemo(() => {
    const set = new Set<string>();
    holdings.forEach((h) => set.add(h.sector));
    return Array.from(set).sort();
  }, [holdings]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(field === "stockName" || field === "exchangeCode");
    }
  }

  const filteredHoldings = useMemo(() => {
    return holdings.filter((h) => {
      const matchesSearch =
        h.stockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.exchangeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.sector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = !selectedSector || h.sector === selectedSector;

      let matchesStatus = true;
      if (statusFilter === "profit") {
        matchesStatus = h.gainLoss !== null && h.gainLoss > 0;
      } else if (statusFilter === "loss") {
        matchesStatus = h.gainLoss !== null && h.gainLoss < 0;
      }

      return matchesSearch && matchesSector && matchesStatus;
    });
  }, [holdings, searchQuery, selectedSector, statusFilter]);

  const sortedHoldings = useMemo(() => {
    return [...filteredHoldings].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === "string" && typeof valB === "string") {
        return sortAscending
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAscending ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredHoldings, sortField, sortAscending]);

  function renderSortIcon(field: SortField) {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-40 ml-1 inline-block" />;
    }
    return sortAscending ? (
      <ArrowUp className="h-3 w-3 text-indigo-400 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-3 w-3 text-indigo-400 ml-1 inline-block" />
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Holdings Portfolio
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                {sortedHoldings.length} of {holdings.length}
              </span>
              {isRefreshing && (
                <span className="text-[11px] text-emerald-400 animate-pulse">
                  Updating prices...
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live CMP from Yahoo Finance • P/E &amp; Latest Earnings from Google Finance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock, symbol..."
                className="w-full bg-slate-800 border border-slate-700 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition placeholder:text-slate-500"
              />
            </div>

            <select
              value={selectedSector || ""}
              onChange={(e) => onSelectSector(e.target.value || null)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-md focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="">All Sectors</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "profit" | "loss")}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-md focus:outline-none focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="profit">In Profit</option>
              <option value="loss">In Loss</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/70 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px] select-none">
            <tr>
              <th
                onClick={() => handleSort("stockName")}
                className="py-3 px-4 cursor-pointer hover:text-white transition"
              >
                Particulars {renderSortIcon("stockName")}
              </th>
              <th
                onClick={() => handleSort("exchangeCode")}
                className="py-3 px-3 cursor-pointer hover:text-white transition"
              >
                NSE/BSE {renderSortIcon("exchangeCode")}
              </th>
              <th
                onClick={() => handleSort("purchasePrice")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Buy Price {renderSortIcon("purchasePrice")}
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Qty {renderSortIcon("quantity")}
              </th>
              <th
                onClick={() => handleSort("investment")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Investment {renderSortIcon("investment")}
              </th>
              <th
                onClick={() => handleSort("portfolioPercentage")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Portfolio % {renderSortIcon("portfolioPercentage")}
              </th>
              <th
                onClick={() => handleSort("cmp")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                CMP {renderSortIcon("cmp")}
              </th>
              <th
                onClick={() => handleSort("presentValue")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Present Value {renderSortIcon("presentValue")}
              </th>
              <th
                onClick={() => handleSort("gainLoss")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Gain / Loss {renderSortIcon("gainLoss")}
              </th>
              <th
                onClick={() => handleSort("peRatio")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                P/E Ratio {renderSortIcon("peRatio")}
              </th>
              <th
                onClick={() => handleSort("latestEarnings")}
                className="py-3 px-3 text-right cursor-pointer hover:text-white transition"
              >
                Latest Earnings {renderSortIcon("latestEarnings")}
              </th>
              <th className="py-3 px-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {sortedHoldings.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-12 text-center text-slate-500">
                  No stocks match the selected search or filter criteria.
                </td>
              </tr>
            ) : (
              sortedHoldings.map((h) => {
                const isProfit = h.gainLoss !== null && h.gainLoss >= 0;
                const isLoss = h.gainLoss !== null && h.gainLoss < 0;

                return (
                  <tr
                    key={h.id}
                    onClick={() => onSelectHolding(h)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span>{h.stockName}</span>
                        {h.notes && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {h.notes}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {h.sector}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-slate-300 px-1.5 py-0.5 rounded bg-slate-800 text-[11px] border border-slate-700/80">
                        {h.exchangeCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-200">
                      {formatCurrency(h.purchasePrice)}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap text-slate-300 font-mono">
                      {h.quantity}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-200">
                      {formatCurrency(h.investment)}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-mono text-slate-300">
                      {h.portfolioPercentage.toFixed(2)}%
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-bold text-white">
                      {formatCurrency(h.cmp)}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap font-medium text-slate-200">
                      {formatCurrency(h.presentValue)}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {h.gainLoss !== null ? (
                        <div
                          className={`font-semibold ${
                            isProfit
                              ? "text-emerald-400"
                              : isLoss
                              ? "text-rose-400"
                              : "text-slate-400"
                          }`}
                        >
                          <div>{formatCurrency(h.gainLoss)}</div>
                          <div className="text-[11px] font-normal">
                            {formatPercentage(h.gainLossPercentage)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {h.peRatio !== null ? (
                        <span className="font-medium text-slate-200">
                          {formatNumber(h.peRatio)}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      {h.latestEarnings !== null ? (
                        <span className="font-medium text-slate-200">
                          ₹{h.latestEarnings}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHolding(h);
                        }}
                        className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition inline-flex items-center space-x-0.5 cursor-pointer"
                        title="View details"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
