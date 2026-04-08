import { drizzle, type AnyD1Database } from "drizzle-orm/d1";
import { schema } from "./schemas";

export const createDB = (d1: AnyD1Database) =>
  drizzle(d1, {
    schema,
    casing: "snake_case",
  });

export type DB = ReturnType<typeof createDB>;
export type D1Database = AnyD1Database;
