import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, signalsTable, tradeDecisionsTable } from "@workspace/db";
import {
  GetSignalParams,
  GetSignalDecisionParams,
  ListSignalsResponse,
  GetSignalResponse,
  GetSignalDecisionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/signals", async (_req, res): Promise<void> => {
  const signals = await db
    .select()
    .from(signalsTable)
    .orderBy(signalsTable.rank);
  res.json(ListSignalsResponse.parse(signals));
});

router.get("/signals/:id", async (req, res): Promise<void> => {
  const params = GetSignalParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [signal] = await db.select().from(signalsTable).where(eq(signalsTable.id, id));
  if (!signal) {
    res.status(404).json({ error: "Signal not found" });
    return;
  }
  res.json(GetSignalResponse.parse(signal));
});

router.get("/signals/:id/decision", async (req, res): Promise<void> => {
  const params = GetSignalDecisionParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [signal] = await db.select().from(signalsTable).where(eq(signalsTable.id, id));
  if (!signal) {
    res.status(404).json({ error: "Signal not found" });
    return;
  }
  const [decision] = await db
    .select()
    .from(tradeDecisionsTable)
    .where(eq(tradeDecisionsTable.signalId, id));
  if (!decision) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }
  res.json(GetSignalDecisionResponse.parse(decision));
});

export default router;
