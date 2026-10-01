import { NextResponse } from "next/server";
import { getCompletePortfolio } from "@/services/finance/portfolio";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const portfolio = await getCompletePortfolio();
    return NextResponse.json(portfolio);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
