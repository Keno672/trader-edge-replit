// Accepted row formats:
// GOLD,Commodities,SELL,92,Resistance fade
// NAS100|Indices|BUY|88|Dip support
//
// Output:
// { ticker, category, side, score, reason }

export interface ScanRow {
  ticker: string;
  category: string;
  side: "BUY" | "SELL";
  score: number;
  reason: string;
}

function splitRow(row: string): string[] {
  if (row.includes("|")) return row.split("|");
  return row.split(",");
}

export function parseScanText(text: string): ScanRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  const parsed: ScanRow[] = [];

  for (const line of lines) {
    // skip header rows if present
    if (/ticker/i.test(line) && /score/i.test(line)) continue;

    const parts = splitRow(line).map((x) => x.trim());
    if (parts.length < 5) continue;

    const [ticker, category, sideRaw, scoreRaw, ...reasonParts] = parts;
    const side = sideRaw.toUpperCase() as "BUY" | "SELL";
    const score = Number(scoreRaw);
    const reason = reasonParts.join(" ").trim();

    if (!ticker || !category || !["BUY", "SELL"].includes(side) || Number.isNaN(score)) {
      continue;
    }

    parsed.push({
      ticker: ticker.toUpperCase(),
      category,
      side,
      score,
      reason: reason || "Selected session opportunity",
    });
  }

  return parsed;
}
