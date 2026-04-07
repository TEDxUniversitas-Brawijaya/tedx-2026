import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { orderItemsTable } from "./orders";

export const ticketsTable = sqliteTable(
  "tickets",
  (t) => ({
    id: t.text().primaryKey(), // prefix: tkt_
    orderItemId: t
      .text()
      .notNull()
      .references(() => orderItemsTable.id, { onDelete: "cascade" }),
    qrCode: t.text().notNull().unique(), // nanoid, used as QR content
    eventDay: t
      .text({
        enum: ["propa3_day1", "propa3_day2", "main_event"],
      })
      .notNull(),
    attendanceStatus: t
      .text({
        enum: ["not_checked_in", "checked_in"],
      })
      .notNull()
      .default("not_checked_in"),
    checkedInAt: t.text(), // ISO 8601
    checkedInBy: t.text().references(() => userTable.id),
    createdAt: t
      .text()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
      .notNull(),
  }),
  (t) => [
    index("tickets_qr_code_idx").on(t.qrCode),
    index("tickets_event_day_idx").on(t.eventDay),
    index("tickets_event_day_attendance_status_idx").on(
      t.eventDay,
      t.attendanceStatus
    ),
    index("tickets_order_item_id_idx").on(t.orderItemId),
  ]
);

export type SelectTicket = typeof ticketsTable.$inferSelect;
export type InsertTicket = typeof ticketsTable.$inferInsert;

export const ticketsRelations = relations(ticketsTable, ({ one }) => ({
  orderItem: one(orderItemsTable, {
    fields: [ticketsTable.orderItemId],
    references: [orderItemsTable.id],
  }),
  checkedInByUser: one(userTable, {
    fields: [ticketsTable.checkedInBy],
    references: [userTable.id],
  }),
}));
