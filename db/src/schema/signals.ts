import { pgTable, text, integer, boolean, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const signalsTable = pgTable("signals", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  direction: text("direction").notNull(), // BUY | SELL
  confidence: integer("confidence").notNull(),
  currentPrice: text("current_price").notNull(),
  change: text("change").notNull(),
  changePositive: boolean("change_positive").notNull(),
  bias: text("bias").notNull(), // Risk-On | Risk-Off | Neutral
  rank: integer("rank").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSignalSchema = createInsertSchema(signalsTable).omit({ id: true, createdAt: true });
export type InsertSignal = z.infer<typeof insertSignalSchema>;
export type Signal = typeof signalsTable.$inferSelect;
