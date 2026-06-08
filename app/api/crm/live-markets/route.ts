import { NextResponse } from "next/server";

const baseMarkets = [
  ["EUR/USD", 1.08742, 0.0004],
  ["GBP/USD", 1.27281, 0.0006],
  ["XAU/USD", 2368.4, 1.8],
  ["BTC/USD", 68420, 180],
  ["NAS100", 18424, 42],
  ["USOIL", 78.21, 0.22]
] as const;

export async function GET() {
  const markets = baseMarkets.map(([symbol, base, spread], index) => {
    const wave = Math.sin(Date.now() / 12000 + index) * spread * 2;
    const random = (Math.random() - 0.5) * spread;
    const buy = base + wave + random;
    const sell = buy + spread;
    const move = ((wave + random) / base) * 100;

    return {
      symbol,
      buy: buy > 100 ? buy.toLocaleString(undefined, { maximumFractionDigits: 2 }) : buy.toFixed(5),
      sell: sell > 100 ? sell.toLocaleString(undefined, { maximumFractionDigits: 2 }) : sell.toFixed(5),
      move: `${move >= 0 ? "+" : ""}${move.toFixed(2)}%`,
      updatedAt: new Date().toISOString()
    };
  });

  return NextResponse.json({ markets });
}
