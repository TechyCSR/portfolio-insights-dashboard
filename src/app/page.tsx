"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { SummaryCards } from "../components/SummaryCards";
import { SectorSummary } from "../components/SectorSummary";
import { PortfolioCharts } from "../components/PortfolioCharts";
import { PortfolioTable } from "../components/PortfolioTable";
import { StockModal } from "../components/StockModal";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { ErrorMessage } from "../components/ErrorMessage";
import {
  EnrichedHolding,
  PortfolioApiResponse,
  PortfolioSummary as PortfolioSummaryType,
  SectorSummary as SectorSummaryType,
  LiveMarketData
} from "../types/portfolio";
import { TOTAL_PORTFOLIO_INVESTMENT } from "../config/stocks";

const REFRESH_INTERVAL_SECONDS = 15;

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<EnrichedHolding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummaryType | null>(null);
  const [sectors, setSectors] = useState<SectorSummaryType[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL_SECONDS);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedHolding, setSelectedHolding] = useState<EnrichedHolding | null>(null);

  const isRefreshingRef = useRef(false);

  const fetchFullPortfolio = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/portfolio");
      if (!res.ok) {
        throw new Error(`Failed to load portfolio: ${res.statusText}`);
      }

      const data: PortfolioApiResponse = await res.json();
      setHoldings(data.holdings);
      setSummary(data.summary);
      setSectors(data.sectors);
      setLastUpdated(data.lastUpdated);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshMarketData = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setIsRefreshing(true);

    try {
      const res = await fetch("/api/market-data");
      if (!res.ok) {
        throw new Error("Failed to refresh market data");
      }

      const json = await res.json();
      const marketMap: Record<string, LiveMarketData> = json.data;
      const timestamp = json.lastUpdated;

      setHoldings((prevHoldings) => {
        let currentPortfolioValue = 0;
        let totalInvestment = 0;
        let gainersCount = 0;
        let losersCount = 0;

        const updatedHoldings = prevHoldings.map((h) => {
          const live = marketMap[h.id];
          const cmp = live?.cmp ?? h.cmp;
          const peRatio = live?.peRatio ?? h.peRatio;
          const latestEarnings = live?.latestEarnings ?? h.latestEarnings;
          const dayChange = live?.dayChange ?? h.dayChange;
          const dayChangePercent = live?.dayChangePercent ?? h.dayChangePercent;
          const fiftyTwoWeekHigh = live?.fiftyTwoWeekHigh ?? h.fiftyTwoWeekHigh;
          const fiftyTwoWeekLow = live?.fiftyTwoWeekLow ?? h.fiftyTwoWeekLow;

          const presentValue =
            cmp !== null ? Number((cmp * h.quantity).toFixed(2)) : null;
          const gainLoss =
            presentValue !== null
              ? Number((presentValue - h.investment).toFixed(2))
              : null;
          const gainLossPercentage =
            gainLoss !== null && h.investment > 0
              ? Number(((gainLoss / h.investment) * 100).toFixed(2))
              : null;

          totalInvestment += h.investment;
          if (presentValue !== null) {
            currentPortfolioValue += presentValue;
          } else {
            currentPortfolioValue += h.investment;
          }

          if (gainLoss !== null) {
            if (gainLoss > 0) gainersCount++;
            else if (gainLoss < 0) losersCount++;
          }

          return {
            ...h,
            cmp,
            presentValue,
            gainLoss,
            gainLossPercentage,
            peRatio,
            latestEarnings,
            dayChange,
            dayChangePercent,
            fiftyTwoWeekHigh,
            fiftyTwoWeekLow,
            lastUpdated: timestamp
          };
        });

        const sectorMap = new Map<
          string,
          { investment: number; presentValue: number; count: number }
        >();

        for (const h of updatedHoldings) {
          const existing = sectorMap.get(h.sector) || {
            investment: 0,
            presentValue: 0,
            count: 0
          };
          const val = h.presentValue !== null ? h.presentValue : h.investment;

          sectorMap.set(h.sector, {
            investment: existing.investment + h.investment,
            presentValue: existing.presentValue + val,
            count: existing.count + 1
          });
        }

        const updatedSectors: SectorSummaryType[] = Array.from(
          sectorMap.entries()
        ).map(([sector, stats]) => {
          const inv = Number(stats.investment.toFixed(2));
          const pv = Number(stats.presentValue.toFixed(2));
          const gl = Number((pv - inv).toFixed(2));
          const retPct = inv > 0 ? Number(((gl / inv) * 100).toFixed(2)) : 0;
          const allocPct =
            TOTAL_PORTFOLIO_INVESTMENT > 0
              ? Number(((inv / TOTAL_PORTFOLIO_INVESTMENT) * 100).toFixed(2))
              : 0;

          return {
            sector,
            totalInvestment: inv,
            totalPresentValue: pv,
            gainLoss: gl,
            returnPercentage: retPct,
            stockCount: stats.count,
            allocationPercentage: allocPct
          };
        });

        updatedSectors.sort((a, b) => b.totalInvestment - a.totalInvestment);
        setSectors(updatedSectors);

        const totalGainLoss = Number(
          (currentPortfolioValue - totalInvestment).toFixed(2)
        );
        const overallReturnPercentage =
          totalInvestment > 0
            ? Number(((totalGainLoss / totalInvestment) * 100).toFixed(2))
            : 0;

        setSummary({
          totalInvestment: Number(totalInvestment.toFixed(2)),
          currentPortfolioValue: Number(currentPortfolioValue.toFixed(2)),
          totalGainLoss,
          overallReturnPercentage,
          totalHoldings: updatedHoldings.length,
          gainersCount,
          losersCount,
          lastUpdated: timestamp
        });

        setSelectedHolding((prevSelected) => {
          if (!prevSelected) return null;
          return updatedHoldings.find((h) => h.id === prevSelected.id) || prevSelected;
        });

        return updatedHoldings;
      });

      setLastUpdated(timestamp);
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } catch {
      setCountdown(REFRESH_INTERVAL_SECONDS);
    } finally {
      setIsRefreshing(false);
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchFullPortfolio();
  }, [fetchFullPortfolio]);

  useEffect(() => {
    if (isLoading || error) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refreshMarketData();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, error, refreshMarketData]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans antialiased">
      <Navbar
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        countdown={countdown}
        onRefresh={refreshMarketData}
      />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchFullPortfolio} />
        ) : (
          <>
            {summary && <SummaryCards summary={summary} />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectorSummary
                sectors={sectors}
                selectedSector={selectedSector}
                onSelectSector={setSelectedSector}
              />
              <PortfolioCharts sectors={sectors} />
            </div>

            <PortfolioTable
              holdings={holdings}
              selectedSector={selectedSector}
              onSelectSector={setSelectedSector}
              onSelectHolding={setSelectedHolding}
              isRefreshing={isRefreshing}
            />
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <p>
          Developed by{" "}
          <a
            href="https://techycsr.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-900 underline underline-offset-4 transition"
          >
            @Techycsr
          </a>
        </p>
      </footer>

      <StockModal
        holding={selectedHolding}
        onClose={() => setSelectedHolding(null)}
      />
    </div>
  );
}
