import { pgTable, text, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const instrumentsTable = pgTable("instruments", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // market | crypto
  currentPrice: text("current_price").notNull(),
  change: text("change").notNull(),
  changePositive: boolean("change_positive").notNull(),
  direction: text("direction"), // BUY | SELL | null
  confidence: integer("confidence"),
});

export const insertInstrumentSchema = createInsertSchema(instrumentsTable).omit({ id: true });
export type InsertInstrument = z.infer<typeof insertInstrumentSchema>;
export type Instrument = typeof instrumentsTable.$inferSelect;
