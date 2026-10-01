import YahooFinance from "yahoo-finance2";

interface CachedQuote {
  cmp: number | null;
  dayChange: number | null;
  dayChangePercent: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  currency: string;
  timestamp: number;
}

const cache = new Map<string, CachedQuote>();
const CACHE_TTL_MS = 15000;

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export async function fetchYahooQuotes(
  symbols: string[]
): Promise<Record<string, Omit<CachedQuote, "timestamp">>> {
  const now = Date.now();
  const result: Record<string, Omit<CachedQuote, "timestamp">> = {};
  const missingSymbols: string[] = [];

  for (const sym of symbols) {
    const cached = cache.get(sym);
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      result[sym] = {
        cmp: cached.cmp,
        dayChange: cached.dayChange,
        dayChangePercent: cached.dayChangePercent,
        fiftyTwoWeekHigh: cached.fiftyTwoWeekHigh,
        fiftyTwoWeekLow: cached.fiftyTwoWeekLow,
        currency: cached.currency
      };
    } else {
      missingSymbols.push(sym);
    }
  }

  if (missingSymbols.length === 0) {
    return result;
  }

  try {
    const quotes = await yf.quote(missingSymbols);
    const quoteList = Array.isArray(quotes) ? quotes : [quotes];

    for (const q of quoteList) {
      if (!q || !q.symbol) continue;

      const price = typeof q.regularMarketPrice === "number" ? q.regularMarketPrice : null;
      const change = typeof q.regularMarketChange === "number" ? q.regularMarketChange : null;
      const changePct = typeof q.regularMarketChangePercent === "number" ? q.regularMarketChangePercent : null;
      const high = typeof q.fiftyTwoWeekHigh === "number" ? q.fiftyTwoWeekHigh : null;
      const low = typeof q.fiftyTwoWeekLow === "number" ? q.fiftyTwoWeekLow : null;
      const curr = q.currency || "INR";

      const data: CachedQuote = {
        cmp: price,
        dayChange: change,
        dayChangePercent: changePct,
        fiftyTwoWeekHigh: high,
        fiftyTwoWeekLow: low,
        currency: curr,
        timestamp: now
      };

      cache.set(q.symbol, data);
      result[q.symbol] = {
        cmp: price,
        dayChange: change,
        dayChangePercent: changePct,
        fiftyTwoWeekHigh: high,
        fiftyTwoWeekLow: low,
        currency: curr
      };
    }
  } catch {
    for (const sym of missingSymbols) {
      const existing = cache.get(sym);
      if (existing) {
        result[sym] = {
          cmp: existing.cmp,
          dayChange: existing.dayChange,
          dayChangePercent: existing.dayChangePercent,
          fiftyTwoWeekHigh: existing.fiftyTwoWeekHigh,
          fiftyTwoWeekLow: existing.fiftyTwoWeekLow,
          currency: existing.currency
        };
      } else {
        result[sym] = {
          cmp: null,
          dayChange: null,
          dayChangePercent: null,
          fiftyTwoWeekHigh: null,
          fiftyTwoWeekLow: null,
          currency: "INR"
        };
      }
    }
  }

  for (const sym of symbols) {
    if (!result[sym]) {
      result[sym] = {
        cmp: null,
        dayChange: null,
        dayChangePercent: null,
        fiftyTwoWeekHigh: null,
        fiftyTwoWeekLow: null,
        currency: "INR"
      };
    }
  }

  return result;
}
