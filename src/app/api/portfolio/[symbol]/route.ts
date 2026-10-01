import { NextRequest, NextResponse } from "next/server";
import { getSingleStock } from "@/services/finance/portfolio";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await context.params;
    const stock = await getSingleStock(symbol);

    if (!stock) {
      return NextResponse.json(
        { error: `Stock '${symbol}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(stock);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch stock detail" },
      { status: 500 }
    );
  }
}
