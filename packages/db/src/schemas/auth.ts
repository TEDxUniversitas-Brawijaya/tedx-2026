import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("users", (t) => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.integer({ mode: "boolean" }).default(false).notNull(),
  image: t.text(),
  role: t.text().default("admin").notNull(), // admin | superadmin
  createdAt: t
    .integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: t
    .integer({ mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
}));

export type SelectUser = typeof userTable.$inferSelect;
export type InsertUser = typeof userTable.$inferInsert;

export const sessionTable = sqliteTable(
  "sessions",
  (t) => ({
    id: t.text().primaryKey(),
    expiresAt: t.integer({ mode: "timestamp_ms" }).notNull(),
    token: t.text().notNull().unique(),
    createdAt: t
      .integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: t
      .integer({ mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: t.text(),
    userAgent: t.text(),
    userId: t
      .text()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
  }),
  (t) => [index("session_userId_idx").on(t.userId)]
);

export const accountTable = sqliteTable(
  "accounts",
  (t) => ({
    id: t.text().primaryKey(),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    accessToken: t.text(),
    refreshToken: t.text(),
    idToken: t.text(),
    accessTokenExpiresAt: t.integer({ mode: "timestamp_ms" }),
    refreshTokenExpiresAt: t.integer({ mode: "timestamp_ms" }),
    scope: t.text(),
    password: t.text(),
    createdAt: t
      .integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: t
      .integer({ mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index("account_userId_idx").on(t.userId)]
);

export const verificationTable = sqliteTable(
  "verifications",
  (t) => ({
    id: t.text().primaryKey(),
    identifier: t.text().notNull(),
    token: t.text().notNull().unique(),
    expiresAt: t.integer({ mode: "timestamp_ms" }).notNull(),
    createdAt: t
      .integer({ mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: t
      .integer({ mode: "timestamp_ms" })
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}));
