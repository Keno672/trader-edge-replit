import { Router, type IRouter } from "express";
import multer from "multer";
import { parseScanText, type ScanRow } from "../lib/scanParser";
import { mergeScansAndBuildTop5, type RankedRow, type Top5Item } from "../lib/ranker";
import { db, signalsTable, tradeDecisionsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const upload = multer({ storage: multer.memoryStorage() });
const router: IRouter = Router();

// ---------- In-memory session store ----------
interface SessionStore {
  id: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  scan1: ScanRow[];
  scan2: ScanRow[];
  mergedWatchlist: RankedRow[];
  top5: Top5Item[];
}

let currentSession: SessionStore | null = null;

function ensureSession(): SessionStore {
  if (!currentSession) {
    currentSession = {
      id: `session_${Date.now()}`,
      label: "Morning Command",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scan1: [],
      scan2: [],
      mergedWatchlist: [],
      top5: [],
    };
  }
  return currentSession;
}

function sessionToState(session: SessionStore) {
  return {
    id: session.id,
    label: session.label,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
    scan1Count: session.scan1.length,
    scan2Count: session.scan2.length,
    scan1Ready: session.scan1.length > 0,
    scan2Ready: session.scan2.length > 0,
    top5Generated: session.top5.length > 0,
    top5: session.top5,
    watchlistCount: session.mergedWatchlist.length,
  };
}

// Helper: derive bias from direction
function biasByDirection(side: "BUY" | "SELL"): "Risk-On" | "Risk-Off" {
  return side === "BUY" ? "Risk-On" : "Risk-Off";
}

// Helper: derive simple trade levels from score and ticker
function generateLevels(ticker: string, side: "BUY" | "SELL", score: number) {
  // Generic placeholder levels — replaced with real levels when AI decision exists
  const baseNote = score >= 85 ? "High-conviction setup" : score >= 70 ? "Moderate setup" : "Speculative setup";
  return {
    entryRange: "See chart",
    stopLoss: "See chart",
    takeProfit1: "See chart",
    takeProfit2: "See chart",
    timeframe: "H4",
  };
}

// ---------- Routes ----------

// POST /session/start
router.post("/session/start", async (req, res): Promise<void> => {
  const label: string = req.body?.label || "Morning Command";

  currentSession = {
    id: `session_${Date.now()}`,
    label,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    scan1: [],
    scan2: [],
    mergedWatchlist: [],
    top5: [],
  };

  req.log.info({ sessionId: currentSession.id }, "Session started");

  res.json({
    ok: true,
    message: "Session started",
    session: sessionToState(currentSession),
  });
});

// GET /session/current
router.get("/session/current", (_req, res): void => {
  const session = ensureSession();
  res.json({
    ok: true,
    session: sessionToState(session),
  });
});

// POST /session/upload-scan
router.post(
  "/session/upload-scan",
  upload.single("file"),
  async (req, res): Promise<void> => {
    try {
      const session = ensureSession();
      const scanSlot = req.body?.scanSlot as string;

      if (!scanSlot || !["scan1", "scan2"].includes(scanSlot)) {
        res.status(400).json({ error: "scanSlot must be scan1 or scan2" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const text = req.file.buffer.toString("utf-8");
      const parsedRows = parseScanText(text);

      if (scanSlot === "scan1") {
        session.scan1 = parsedRows;
      } else {
        session.scan2 = parsedRows;
      }
      session.updatedAt = new Date().toISOString();

      req.log.info({ scanSlot, count: parsedRows.length }, "Scan uploaded");

      res.json({
        ok: true,
        message: `${scanSlot} uploaded`,
        count: parsedRows.length,
        rows: parsedRows,
      });
    } catch (err) {
      logger.error({ err }, "Error uploading scan");
      res.status(500).json({ error: "Failed to process scan file" });
    }
  }
);

// POST /session/generate-top5
router.post("/session/generate-top5", async (req, res): Promise<void> => {
  try {
    const session = ensureSession();

    if (!session.scan1.length || !session.scan2.length) {
      res.status(400).json({
        error: "Both scan1 and scan2 must be uploaded first",
      });
      return;
    }

    const result = mergeScansAndBuildTop5(session.scan1, session.scan2);
    session.mergedWatchlist = result.watchlist;
    session.top5 = result.top5;
    session.updatedAt = new Date().toISOString();

    // Persist top 5 to DB: clear and re-insert signals + decisions
    await db.delete(tradeDecisionsTable);
    await db.delete(signalsTable);

    for (const item of result.top5) {
      const bias = biasByDirection(item.side);
      const levels = generateLevels(item.ticker, item.side, item.score);

      const [inserted] = await db
        .insert(signalsTable)
        .values({
          ticker: item.ticker,
          name: item.ticker,
          category: item.category,
          direction: item.side,
          confidence: item.score,
          currentPrice: "—",
          change: "—",
          changePositive: item.side === "BUY",
          bias,
          rank: item.rank,
        })
        .returning();

      await db.insert(tradeDecisionsTable).values({
        signalId: inserted.id,
        ticker: item.ticker,
        direction: item.side,
        confidence: item.score,
        bias,
        entryRange: levels.entryRange,
        stopLoss: levels.stopLoss,
        takeProfit1: levels.takeProfit1,
        takeProfit2: levels.takeProfit2,
        rationale: item.reason,
        timeframe: levels.timeframe,
      });
    }

    req.log.info({ top5Count: result.top5.length }, "Top 5 generated and persisted");

    res.json({
      ok: true,
      message: "Top 5 generated",
      session: sessionToState(session),
    });
  } catch (err) {
    logger.error({ err }, "Error generating top 5");
    res.status(500).json({ error: "Failed to generate top 5" });
  }
});

export default router;
