import { INITIAL_PORTFOLIO_HOLDINGS, TOTAL_PORTFOLIO_INVESTMENT } from "../../config/stocks";
import {
  EnrichedHolding,
  LiveMarketData,
  PortfolioApiResponse,
  PortfolioSummary,
  SectorSummary
} from "../../types/portfolio";
import {
  fetchGoogleFinanceBatch,
  fetchGoogleFinanceQuote
} from "./googleFinance";
import { fetchYahooQuotes } from "./yahoo";

export async function getLiveMarketData(): Promise<Record<string, LiveMarketData>> {
  const yfSymbols = INITIAL_PORTFOLIO_HOLDINGS.map((h) => h.yfSymbol);
  const gfSymbols = INITIAL_PORTFOLIO_HOLDINGS.map((h) => h.gfSymbol);

  const [yahooResults, googleResults] = await Promise.all([
    fetchYahooQuotes(yfSymbols),
    fetchGoogleFinanceBatch(gfSymbols)
  ]);

  const timestamp = new Date().toISOString();
  const marketDataMap: Record<string, LiveMarketData> = {};

  for (const holding of INITIAL_PORTFOLIO_HOLDINGS) {
    const yfData = yahooResults[holding.yfSymbol];
    const gfData = googleResults[holding.gfSymbol];

    marketDataMap[holding.id] = {
      symbol: holding.exchangeCode,
      cmp: yfData?.cmp ?? null,
      peRatio: gfData?.peRatio ?? null,
      latestEarnings: gfData?.latestEarnings ?? null,
      dayChange: yfData?.dayChange ?? null,
      dayChangePercent: yfData?.dayChangePercent ?? null,
      fiftyTwoWeekHigh: yfData?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: yfData?.fiftyTwoWeekLow ?? null,
      currency: yfData?.currency ?? "INR",
      lastUpdated: timestamp
    };
  }

  return marketDataMap;
}

export async function getCompletePortfolio(): Promise<PortfolioApiResponse> {
  const marketDataMap = await getLiveMarketData();
  const timestamp = new Date().toISOString();

  let currentPortfolioValue = 0;
  let totalInvestment = 0;
  let gainersCount = 0;
  let losersCount = 0;

  const holdings: EnrichedHolding[] = INITIAL_PORTFOLIO_HOLDINGS.map((h) => {
    const market = marketDataMap[h.id];
    const cmp = market?.cmp ?? null;

    const presentValue = cmp !== null ? Number((cmp * h.quantity).toFixed(2)) : null;
    const gainLoss =
      presentValue !== null ? Number((presentValue - h.investment).toFixed(2)) : null;
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
      id: h.id,
      stockName: h.stockName,
      exchangeCode: h.exchangeCode,
      sector: h.sector,
      purchasePrice: h.purchasePrice,
      quantity: h.quantity,
      investment: h.investment,
      portfolioPercentage: h.portfolioPercentage,
      cmp,
      presentValue,
      gainLoss,
      gainLossPercentage,
      peRatio: market?.peRatio ?? null,
      latestEarnings: market?.latestEarnings ?? null,
      dayChange: market?.dayChange ?? null,
      dayChangePercent: market?.dayChangePercent ?? null,
      fiftyTwoWeekHigh: market?.fiftyTwoWeekHigh ?? null,
      fiftyTwoWeekLow: market?.fiftyTwoWeekLow ?? null,
      lastUpdated: timestamp,
      notes: h.notes,
      yfSymbol: h.yfSymbol,
      gfSymbol: h.gfSymbol
    };
  });

  const sectorMap = new Map<
    string,
    {
      investment: number;
      presentValue: number;
      count: number;
    }
  >();

  for (const h of holdings) {
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

  const sectors: SectorSummary[] = Array.from(sectorMap.entries()).map(
    ([sector, stats]) => {
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
    }
  );

  sectors.sort((a, b) => b.totalInvestment - a.totalInvestment);

  const totalGainLoss = Number((currentPortfolioValue - totalInvestment).toFixed(2));
  const overallReturnPercentage =
    totalInvestment > 0
      ? Number(((totalGainLoss / totalInvestment) * 100).toFixed(2))
      : 0;

  const summary: PortfolioSummary = {
    totalInvestment: Number(totalInvestment.toFixed(2)),
    currentPortfolioValue: Number(currentPortfolioValue.toFixed(2)),
    totalGainLoss,
    overallReturnPercentage,
    totalHoldings: holdings.length,
    gainersCount,
    losersCount,
    lastUpdated: timestamp
  };

  return {
    summary,
    sectors,
    holdings,
    lastUpdated: timestamp
  };
}

export async function getSingleStock(symbolOrId: string): Promise<EnrichedHolding | null> {
  const holding = INITIAL_PORTFOLIO_HOLDINGS.find(
    (h) =>
      h.id.toLowerCase() === symbolOrId.toLowerCase() ||
      h.exchangeCode.toLowerCase() === symbolOrId.toLowerCase() ||
      h.yfSymbol.toLowerCase() === symbolOrId.toLowerCase()
  );

  if (!holding) return null;

  const [yahooResults, googleResults] = await Promise.all([
    fetchYahooQuotes([holding.yfSymbol]),
    fetchGoogleFinanceQuote(holding.gfSymbol)
  ]);

  const yfData = yahooResults[holding.yfSymbol];
  const cmp = yfData?.cmp ?? null;
  const presentValue = cmp !== null ? Number((cmp * holding.quantity).toFixed(2)) : null;
  const gainLoss =
    presentValue !== null ? Number((presentValue - holding.investment).toFixed(2)) : null;
  const gainLossPercentage =
    gainLoss !== null && holding.investment > 0
      ? Number(((gainLoss / holding.investment) * 100).toFixed(2))
      : null;

  return {
    id: holding.id,
    stockName: holding.stockName,
    exchangeCode: holding.exchangeCode,
    sector: holding.sector,
    purchasePrice: holding.purchasePrice,
    quantity: holding.quantity,
    investment: holding.investment,
    portfolioPercentage: holding.portfolioPercentage,
    cmp,
    presentValue,
    gainLoss,
    gainLossPercentage,
    peRatio: googleResults.peRatio,
    latestEarnings: googleResults.latestEarnings,
    dayChange: yfData?.dayChange ?? null,
    dayChangePercent: yfData?.dayChangePercent ?? null,
    fiftyTwoWeekHigh: yfData?.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: yfData?.fiftyTwoWeekLow ?? null,
    lastUpdated: new Date().toISOString(),
    notes: holding.notes,
    yfSymbol: holding.yfSymbol,
    gfSymbol: holding.gfSymbol
  };
}
