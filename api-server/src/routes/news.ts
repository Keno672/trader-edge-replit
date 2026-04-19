import { Router, type IRouter } from "express";
import { db, signalsTable } from "@workspace/db";

const router: IRouter = Router();

const headlines = [
  {
    id: "h1",
    title: "Fed holds rates steady, Powell signals 'no rush' to cut amid sticky inflation",
    source: "Reuters",
    timeAgo: "23m",
    sentiment: "bearish",
    region: "US",
    category: "Central Bank",
  },
  {
    id: "h2",
    title: "China PMI beats expectations at 51.3 — factory output accelerates for third month",
    source: "Bloomberg",
    timeAgo: "1h",
    sentiment: "bullish",
    region: "ASIA",
    category: "Data",
  },
  {
    id: "h3",
    title: "Dollar index (DXY) surges to 106 as safe-haven flows dominate G10",
    source: "FX Street",
    timeAgo: "1h 30m",
    sentiment: "bearish",
    region: "GLOBAL",
    category: "FX",
  },
  {
    id: "h4",
    title: "ECB's Lagarde warns of 'elevated uncertainty' — rate cut timing now in doubt",
    source: "FT",
    timeAgo: "2h",
    sentiment: "bearish",
    region: "EU",
    category: "Central Bank",
  },
  {
    id: "h5",
    title: "Gold breaks $3,340 as geopolitical risk premium widens in Middle East",
    source: "Kitco",
    timeAgo: "2h 45m",
    sentiment: "bullish",
    region: "GLOBAL",
    category: "Commodities",
  },
  {
    id: "h6",
    title: "US 10Y yield climbs to 4.68% — bond market signals higher-for-longer repricing",
    source: "CNBC",
    timeAgo: "3h",
    sentiment: "bearish",
    region: "US",
    category: "Bonds",
  },
  {
    id: "h7",
    title: "Japan BoJ maintains ultra-loose policy; yen slides past 155 vs dollar",
    source: "Nikkei",
    timeAgo: "4h",
    sentiment: "bearish",
    region: "ASIA",
    category: "Central Bank",
  },
  {
    id: "h8",
    title: "Oil dips on surprise EIA inventory build — WTI back below $83/bbl",
    source: "MarketWatch",
    timeAgo: "5h",
    sentiment: "bearish",
    region: "GLOBAL",
    category: "Commodities",
  },
];

const macroIndicators = [
  // Equities
  { symbol: "SPX", name: "S&P 500", value: "5,218", change: "-34.2", changePct: "-0.65%", direction: "down", category: "Equities" },
  { symbol: "NDX", name: "NASDAQ 100", value: "18,124", change: "-112.5", changePct: "-0.62%", direction: "down", category: "Equities" },
  { symbol: "DAX", name: "DAX 40", value: "17,843", change: "+58.3", changePct: "+0.33%", direction: "up", category: "Equities" },
  { symbol: "UKX", name: "FTSE 100", value: "8,032", change: "-21.4", changePct: "-0.27%", direction: "down", category: "Equities" },
  { symbol: "NKY", name: "Nikkei 225", value: "38,460", change: "-188.9", changePct: "-0.49%", direction: "down", category: "Equities" },
  // FX
  { symbol: "DXY", name: "Dollar Index", value: "106.12", change: "+0.48", changePct: "+0.45%", direction: "up", category: "FX" },
  { symbol: "EURUSD", name: "EUR/USD", value: "1.0718", change: "-0.0042", changePct: "-0.39%", direction: "down", category: "FX" },
  { symbol: "GBPUSD", name: "GBP/USD", value: "1.2534", change: "-0.0031", changePct: "-0.25%", direction: "down", category: "FX" },
  { symbol: "USDJPY", name: "USD/JPY", value: "155.28", change: "+0.74", changePct: "+0.48%", direction: "up", category: "FX" },
  // Commodities
  { symbol: "XAUUSD", name: "Gold", value: "3,341", change: "+18.4", changePct: "+0.55%", direction: "up", category: "Commodities" },
  { symbol: "WTI", name: "WTI Crude", value: "82.74", change: "-1.23", changePct: "-1.47%", direction: "down", category: "Commodities" },
  { symbol: "XAGUSD", name: "Silver", value: "28.61", change: "+0.38", changePct: "+1.35%", direction: "up", category: "Commodities" },
  // Bonds
  { symbol: "US10Y", name: "US 10Y Yield", value: "4.68%", change: "+0.06", changePct: "+1.30%", direction: "up", category: "Bonds" },
  { symbol: "DE10Y", name: "Bund 10Y", value: "2.49%", change: "+0.03", changePct: "+1.22%", direction: "up", category: "Bonds" },
  // Crypto
  { symbol: "BTCUSD", name: "Bitcoin", value: "63,840", change: "-1,240", changePct: "-1.91%", direction: "down", category: "Crypto" },
  { symbol: "ETHUSD", name: "Ethereum", value: "3,142", change: "-88", changePct: "-2.73%", direction: "down", category: "Crypto" },
];

router.get("/news/feed", async (_req, res): Promise<void> => {
  const signals = await db.select().from(signalsTable);

  // Derive risk sentiment from live signals
  const biasVotes = signals.map((s) => s.bias);
  const biasCounts: Record<string, number> = {};
  for (const b of biasVotes) {
    biasCounts[b] = (biasCounts[b] ?? 0) + 1;
  }
  const topBias = (Object.entries(biasCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutral") as string;
  const strength = signals.length > 0 ? Math.round(((biasCounts[topBias] ?? 0) / signals.length) * 100) : 0;

  const riskSentiment =
    topBias === "Risk-On" ? "risk-on" :
    topBias === "Risk-Off" ? "risk-off" : "neutral";

  const sentimentLabel =
    strength >= 75 ? `Strong ${topBias}` :
    strength >= 50 ? `Moderate ${topBias}` : `Mild ${topBias}`;

  const macroSummary =
    riskSentiment === "risk-on"
      ? "Risk appetite dominates. Momentum setups favoured across equities and high-beta FX. Watch for breakouts in growth assets."
      : riskSentiment === "risk-off"
      ? "Defensive flows driving markets. USD, Gold and JPY are the key beneficiaries. Fade equity rallies into resistance."
      : "Mixed macro signals. Market awaiting catalyst. Reduce position size and focus on high-conviction setups only.";

  res.json({
    riskSentiment,
    sentimentStrength: strength,
    sentimentLabel,
    macroSummary,
    headlines,
    macroIndicators,
    lastUpdated: new Date().toISOString(),
  });
});

export default router;
