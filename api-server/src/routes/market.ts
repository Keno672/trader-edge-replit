import { Router, type IRouter } from "express";
import { db, signalsTable } from "@workspace/db";
import { GetMarketSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/market/summary", async (_req, res): Promise<void> => {
  const signals = await db.select().from(signalsTable);

  const signalCount = signals.length;
  const buyCount = signals.filter((s) => s.direction === "BUY").length;
  const sellCount = signals.filter((s) => s.direction === "SELL").length;
  const avgConfidence = signalCount > 0
    ? Math.round(signals.reduce((acc, s) => acc + s.confidence, 0) / signalCount)
    : 0;

  const categoryCounts: Record<string, number> = {};
  for (const s of signals) {
    categoryCounts[s.category] = (categoryCounts[s.category] ?? 0) + 1;
  }
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mixed";

  const biasVotes = signals.map((s) => s.bias);
  const biasCounts: Record<string, number> = {};
  for (const b of biasVotes) {
    biasCounts[b] = (biasCounts[b] ?? 0) + 1;
  }
  const overallBias = (Object.entries(biasCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Neutral") as "Risk-On" | "Risk-Off" | "Neutral";
  const biasStrength = signalCount > 0 ? Math.round(((biasCounts[overallBias] ?? 0) / signalCount) * 100) : 0;

  const marketNote = overallBias === "Risk-On"
    ? "Markets are favouring momentum and breakouts. Follow the trend."
    : overallBias === "Risk-Off"
    ? "Defensive tone in markets. Fade rallies and look for safe haven flows."
    : "Mixed signals across markets. Wait for clearer conviction before sizing up.";

  res.json(GetMarketSummaryResponse.parse({
    overallBias,
    biasStrength,
    signalCount,
    buyCount,
    sellCount,
    topCategory,
    avgConfidence,
    marketNote,
  }));
});

export default router;
