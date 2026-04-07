import { sqliteTable } from "drizzle-orm/sqlite-core";

export const configTable = sqliteTable("config", (t) => ({
  key: t.text().primaryKey(),
  value: t.text().notNull(),
  description: t.text(),
}));

export type SelectConfig = typeof configTable.$inferSelect;
export type InsertConfig = typeof configTable.$inferInsert;
