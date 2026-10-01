export interface PortfolioHolding {
  id: string;
  stockName: string;
  exchangeCode: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  yfSymbol: string;
  gfSymbol: string;
  notes: string | null;
}

export interface LiveMarketData {
  symbol: string;
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  currency: string;
  lastUpdated: string;
}

export interface EnrichedHolding {
  id: string;
  stockName: string;
  exchangeCode: string;
  sector: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercentage: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  lastUpdated: string;
  notes: string | null;
  yfSymbol: string;
  gfSymbol: string;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
  returnPercentage: number;
  stockCount: number;
  allocationPercentage: number;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentPortfolioValue: number;
  totalGainLoss: number;
  overallReturnPercentage: number;
  totalHoldings: number;
  gainersCount: number;
  losersCount: number;
  lastUpdated: string;
}

export interface PortfolioApiResponse {
  summary: PortfolioSummary;
  sectors: SectorSummary[];
  holdings: EnrichedHolding[];
  lastUpdated: string;
}

export interface MarketDataApiResponse {
  data: Record<string, LiveMarketData>;
  lastUpdated: string;
}
