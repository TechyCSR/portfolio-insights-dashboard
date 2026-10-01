import { NextResponse } from "next/server";
import { getLiveMarketData } from "@/services/finance/portfolio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await getLiveMarketData();
    return NextResponse.json({
      data,
      lastUpdated: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch live market data" },
      { status: 500 }
    );
  }
}
