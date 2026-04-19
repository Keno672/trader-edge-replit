import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, instrumentsTable } from "@workspace/db";
import {
  GetWatchlistResponse,
  ListWatchlistInstrumentsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/watchlist", async (_req, res): Promise<void> => {
  const all = await db.select().from(instrumentsTable).orderBy(instrumentsTable.ticker);
  const market = all.filter((i) => i.category === "market");
  const crypto = all.filter((i) => i.category === "crypto");
  res.json(GetWatchlistResponse.parse({ market, crypto }));
});

router.get("/watchlist/instruments", async (_req, res): Promise<void> => {
  const instruments = await db.select().from(instrumentsTable).orderBy(instrumentsTable.ticker);
  res.json(ListWatchlistInstrumentsResponse.parse(instruments));
});

export default router;
