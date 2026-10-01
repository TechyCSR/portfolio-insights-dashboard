"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
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
          : valB.localeCompare(a[sortField] as string);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortAscending ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredHoldings, sortField, sortAscending]);

  function renderSortIcon(field: SortField) {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-30 ml-1 inline-block" />;
    }
    return sortAscending ? (
      <ArrowUp className="h-3 w-3 text-gray-700 ml-1 inline-block" />
    ) : (
      <ArrowDown className="h-3 w-3 text-gray-700 ml-1 inline-block" />
    );
  }

  return (
    <div className="bg-white border border-black rounded-lg overflow-hidden shadow-xs">
      <div className="p-4 sm:p-5 border-b border-gray-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-semibold text-gray-900 tracking-tight">
                Holdings Portfolio
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-mono">
                {sortedHoldings.length} of {holdings.length}
              </span>
              {isRefreshing && (
                <span className="text-xs text-gray-500">
                  Syncing prices...
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stock or code..."
                className="w-full bg-white border border-gray-300 text-xs text-gray-900 pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-gray-500 transition placeholder:text-gray-400"
              />
            </div>

            <select
              value={selectedSector || ""}
              onChange={(e) => onSelectSector(e.target.value || null)}
              className="bg-white border border-gray-300 text-xs text-gray-700 px-2.5 py-1.5 rounded focus:outline-none focus:border-gray-500 transition cursor-pointer"
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
              className="bg-white border border-gray-300 text-xs text-gray-700 px-2.5 py-1.5 rounded focus:outline-none focus:border-gray-500 transition cursor-pointer"
            >
              <option value="all">All Positions</option>
              <option value="profit">Profitable</option>
              <option value="loss">Unrealized Loss</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 uppercase tracking-wider text-[11px] select-none">
            <tr>
              <th
                onClick={() => handleSort("stockName")}
                className="py-3 px-3.5 cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Particulars {renderSortIcon("stockName")}
              </th>
              <th
                onClick={() => handleSort("purchasePrice")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Purchase Price {renderSortIcon("purchasePrice")}
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Qty {renderSortIcon("quantity")}
              </th>
              <th
                onClick={() => handleSort("investment")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Investment {renderSortIcon("investment")}
              </th>
              <th
                onClick={() => handleSort("portfolioPercentage")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Portfolio % {renderSortIcon("portfolioPercentage")}
              </th>
              <th
                onClick={() => handleSort("exchangeCode")}
                className="py-3 px-3 text-center cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                NSE/BSE {renderSortIcon("exchangeCode")}
              </th>
              <th
                onClick={() => handleSort("cmp")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                CMP {renderSortIcon("cmp")}
              </th>
              <th
                onClick={() => handleSort("presentValue")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Present Value {renderSortIcon("presentValue")}
              </th>
              <th
                onClick={() => handleSort("gainLoss")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Gain / Loss {renderSortIcon("gainLoss")}
              </th>
              <th
                onClick={() => handleSort("peRatio")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                P/E Ratio {renderSortIcon("peRatio")}
              </th>
              <th
                onClick={() => handleSort("latestEarnings")}
                className="py-3 px-3 text-right cursor-pointer hover:text-gray-900 transition whitespace-nowrap"
              >
                Latest Earnings {renderSortIcon("latestEarnings")}
              </th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Details</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedHoldings.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-10 text-center text-gray-500">
                  No stocks match the search or filter criteria.
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
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="py-3 px-3.5 font-medium text-gray-900 whitespace-nowrap">
                      <div>{h.stockName}</div>
                      <div className="text-[11px] text-gray-500 font-normal">
                        {h.sector}
                        {h.notes && (
                          <span className="ml-1.5 text-[10px] text-gray-500 border border-gray-200 rounded px-1 py-0.2">
                            {h.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap text-gray-900 tabular-nums">
                      {formatCurrency(h.purchasePrice)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap text-gray-600 font-mono tabular-nums">
                      {h.quantity}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap text-gray-900 tabular-nums">
                      {formatCurrency(h.investment)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap text-gray-500 tabular-nums font-mono">
                      {h.portfolioPercentage.toFixed(2)}%
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="font-mono text-gray-700 px-1.5 py-0.5 rounded bg-gray-100 text-[11px] border border-gray-200">
                        {h.exchangeCode}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap font-medium text-gray-900 tabular-nums">
                      {formatCurrency(h.cmp)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap text-gray-900 tabular-nums">
                      {formatCurrency(h.presentValue)}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
                      {h.gainLoss !== null ? (
                        <div
                          className={`font-medium ${
                            isProfit
                              ? "text-emerald-700"
                              : isLoss
                              ? "text-rose-700"
                              : "text-gray-500"
                          }`}
                        >
                          <div>{formatCurrency(h.gainLoss)}</div>
                          <div className="text-[11px] opacity-80">
                            {formatPercentage(h.gainLossPercentage)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
                      {h.peRatio !== null ? (
                        <span className="text-gray-800">
                          {formatNumber(h.peRatio)}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap tabular-nums">
                      {h.latestEarnings !== null ? (
                        <span className="text-gray-800">
                          ₹{h.latestEarnings}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Unavailable</span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHolding(h);
                        }}
                        className="text-gray-600 hover:text-gray-900 px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-100 text-[11px] transition cursor-pointer"
                      >
                        View
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
