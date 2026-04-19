import { type ScanRow } from "./scanParser";

export interface RankedRow extends ScanRow {
  sourceScans: string[];
}

export interface Top5Item extends RankedRow {
  rank: number;
}

export interface RankerResult {
  watchlist: RankedRow[];
  top5: Top5Item[];
}

function normalizeReason(a: string, b: string): string {
  if (a && b && a !== b) return `${a} + ${b}`;
  return a || b || "Selected session opportunity";
}

interface MergedItem {
  ticker: string;
  category: string;
  sideVotes: { BUY: number; SELL: number };
  scoreTotal: number;
  scoreCount: number;
  reasons: string[];
  sources: string[];
}

export function mergeScansAndBuildTop5(scan1: ScanRow[], scan2: ScanRow[]): RankerResult {
  const mergedMap = new Map<string, MergedItem>();

  function upsert(row: ScanRow, sourceName: string): void {
    const key = row.ticker;

    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        ticker: row.ticker,
        category: row.category,
        sideVotes: { BUY: 0, SELL: 0 },
        scoreTotal: 0,
        scoreCount: 0,
        reasons: [],
        sources: [],
      });
    }

    const item = mergedMap.get(key)!;
    item.sideVotes[row.side] += 1;
    item.scoreTotal += row.score;
    item.scoreCount += 1;
    item.reasons.push(row.reason);
    item.sources.push(sourceName);
  }

  scan1.forEach((row) => upsert(row, "scan1"));
  scan2.forEach((row) => upsert(row, "scan2"));

  const watchlist: RankedRow[] = Array.from(mergedMap.values()).map((item) => {
    const avgScore = Math.round(item.scoreTotal / item.scoreCount);
    const side: "BUY" | "SELL" =
      item.sideVotes.BUY > item.sideVotes.SELL
        ? "BUY"
        : item.sideVotes.SELL > item.sideVotes.BUY
        ? "SELL"
        : "BUY";

    // bonus if both scans agree
    const agreementBonus =
      item.sideVotes.BUY === 2 || item.sideVotes.SELL === 2 ? 5 : 0;

    const finalScore = Math.min(99, avgScore + agreementBonus);

    return {
      ticker: item.ticker,
      category: item.category,
      side,
      score: finalScore,
      reason: normalizeReason(item.reasons[0] ?? "", item.reasons[1] ?? ""),
      sourceScans: item.sources,
    };
  });

  // sort by score descending
  watchlist.sort((a, b) => b.score - a.score);

  const top5: Top5Item[] = watchlist.slice(0, 5).map((row, index) => ({
    rank: index + 1,
    ...row,
  }));

  return { watchlist, top5 };
}
