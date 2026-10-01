interface CachedGoogleData {
  peRatio: number | null;
  latestEarnings: number | null;
  timestamp: number;
}

const googleCache = new Map<string, CachedGoogleData>();
const CACHE_TTL_MS = 30 * 60 * 1000;

function parseNumericValue(raw: string): number | null {
  const cleaned = raw.replace(/[₹$,%]/g, "").replace(/,/g, "").trim();
  const val = parseFloat(cleaned);
  return isNaN(val) ? null : val;
}

export async function fetchGoogleFinanceQuote(
  gfSymbol: string
): Promise<{ peRatio: number | null; latestEarnings: number | null }> {
  const cached = googleCache.get(gfSymbol);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      peRatio: cached.peRatio,
      latestEarnings: cached.latestEarnings
    };
  }

  const url = `https://www.google.com/finance/quote/${gfSymbol}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { peRatio: null, latestEarnings: null };
    }

    const html = await response.text();

    let peRatio: number | null = null;
    let latestEarnings: number | null = null;

    const peMatch = html.match(/P\/E ratio<\/div>\s*<div[^>]*>([^<]+)<\/div>/i);
    if (peMatch && peMatch[1]) {
      peRatio = parseNumericValue(peMatch[1]);
    }

    const epsMatch = html.match(/EPS<\/div>\s*<div[^>]*>([^<]+)<\/div>/i);
    if (epsMatch && epsMatch[1]) {
      latestEarnings = parseNumericValue(epsMatch[1]);
    }

    if (latestEarnings === null) {
      const quarterlyEpsMatch = html.match(
        /Earnings per share<\/td>\s*<td[^>]*>([^<]+)<\/td>/i
      );
      if (quarterlyEpsMatch && quarterlyEpsMatch[1]) {
        latestEarnings = parseNumericValue(quarterlyEpsMatch[1]);
      }
    }

    const result = { peRatio, latestEarnings };
    googleCache.set(gfSymbol, { ...result, timestamp: now });

    return result;
  } catch {
    if (cached) {
      return {
        peRatio: cached.peRatio,
        latestEarnings: cached.latestEarnings
      };
    }
    return { peRatio: null, latestEarnings: null };
  }
}

export async function fetchGoogleFinanceBatch(
  symbols: string[]
): Promise<Record<string, { peRatio: number | null; latestEarnings: number | null }>> {
  const results: Record<string, { peRatio: number | null; latestEarnings: number | null }> = {};
  const batchSize = 5;

  for (let i = 0; i < symbols.length; i += batchSize) {
    const chunk = symbols.slice(i, i + batchSize);
    const promises = chunk.map(async (sym) => {
      const data = await fetchGoogleFinanceQuote(sym);
      results[sym] = data;
    });
    await Promise.all(promises);
  }

  return results;
}
