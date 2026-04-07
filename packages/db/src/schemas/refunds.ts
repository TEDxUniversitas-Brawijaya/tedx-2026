import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { ordersTable } from "./orders";

export const refundRequestsTable = sqliteTable(
  "refund_requests",
  (t) => ({
    id: t.text().primaryKey(), // prefix: ref_
    orderId: t
      .text()
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    status: t.text({ enum: ["requested", "approved", "rejected"] }).notNull(),
    reason: t.text().notNull(),
    paymentMethod: t.text().notNull(), // how the buyer originally paid
    paymentProofUrl: t.text(),
    bankAccountNumber: t.text().notNull(),
    bankName: t.text().notNull(),
    bankAccountHolder: t.text().notNull(),
    processedBy: t.text().references(() => userTable.id),
    processedAt: t.text(), // ISO 8601
    rejectionReason: t.text(),
    createdAt: t
      .text()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
      .notNull(),
    updatedAt: t
      .text()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  }),
  (t) => [
    index("refund_requests_order_id_idx").on(t.orderId),
    index("refund_requests_status_idx").on(t.status),
  ]
);

export type SelectRefundRequest = typeof refundRequestsTable.$inferSelect;
export type InsertRefundRequest = typeof refundRequestsTable.$inferInsert;

export const refundRequestsRelations = relations(
  refundRequestsTable,
  ({ one }) => ({
    order: one(ordersTable, {
      fields: [refundRequestsTable.orderId],
      references: [ordersTable.id],
    }),
    processor: one(userTable, {
      fields: [refundRequestsTable.processedBy],
      references: [userTable.id],
    }),
  })
);
