import { pgTable, text, integer, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tradeDecisionsTable = pgTable("trade_decisions", {
  id: serial("id").primaryKey(),
  signalId: integer("signal_id").notNull(),
  ticker: text("ticker").notNull(),
  direction: text("direction").notNull(), // BUY | SELL
  confidence: integer("confidence").notNull(),
  bias: text("bias").notNull(), // Risk-On | Risk-Off | Neutral
  entryRange: text("entry_range").notNull(),
  stopLoss: text("stop_loss").notNull(),
  takeProfit1: text("take_profit_1").notNull(),
  takeProfit2: text("take_profit_2").notNull(),
  rationale: text("rationale").notNull(),
  timeframe: text("timeframe").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTradeDecisionSchema = createInsertSchema(tradeDecisionsTable).omit({ id: true, createdAt: true });
export type InsertTradeDecision = z.infer<typeof insertTradeDecisionSchema>;
export type TradeDecision = typeof tradeDecisionsTable.$inferSelect;
