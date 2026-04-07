import { relations, sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";
import { userTable } from "./auth";
import { productsTable } from "./products";

export const ordersTable = sqliteTable(
  "orders",
  (t) => ({
    id: t.text().primaryKey(), // human-readable: TDX-YYMMDD-XXXXX
    type: t
      .text({
        enum: ["ticket", "merch"],
      })
      .notNull(),
    status: t
      .text({
        enum: [
          "pending_payment",
          "pending_verification",
          "paid",
          "expired",
          "refund_requested",
          "refunded",
          "rejected",
        ],
      })
      .notNull(),
    buyerName: t.text().notNull(),
    buyerEmail: t.text().notNull(),
    buyerPhone: t.text().notNull(),
    buyerCollege: t.text().notNull(), // instansi
    totalPrice: t.integer().notNull(), // IDR
    idempotencyKey: t.text().unique(), // client-generated, prevents duplicate orders
    expiresAt: t.text(), // 20-min TTL for pending_payment
    paidAt: t.text(), // ISO 8601
    createdAt: t
      .text()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
      .notNull(),
    updatedAt: t
      .text()
      .default(sql`(strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`)
      .$onUpdate(() => new Date().toISOString())
      .notNull(),

    // Payment fields
    paymentMethod: t.text({
      enum: ["midtrans", "manual"],
    }), // midtrans | manual — system-determined
    midtransOrderId: t.text(),
    proofImageUrl: t.text(), // storage.tedxuniversitasbrawijaya.com (private bucket)
    verifiedBy: t.text().references(() => userTable.id), // admin user ID
    verifiedAt: t.text(), // ISO 8601
    rejectionReason: t.text(),

    // Refund fields
    refundToken: t.text().unique(), // nanoid, for tokenized refund link

    // Pickup fields
    pickedUpAt: t.text(), // ISO 8601
    pickedUpBy: t.text().references(() => userTable.id), // admin user ID
  }),
  (t) => [
    index("orders_status_idx").on(t.status),
    index("orders_type_idx").on(t.type),
    index("orders_buyer_email_idx").on(t.buyerEmail),
    index("orders_type_status_idx").on(t.type, t.status),
    index("orders_status_expires_at_idx").on(t.status, t.expiresAt), // for cron expiry queries
    index("orders_created_at_idx").on(t.createdAt),
  ]
);

export type SelectOrder = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;

export const orderItemsTable = sqliteTable(
  "order_items",
  (t) => ({
    id: t.text().primaryKey(), // prefix: oi_
    orderId: t
      .text()
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    productId: t
      .text()
      .notNull()
      .references(() => productsTable.id),
    quantity: t.integer().notNull(),
    snapshotName: t.text().notNull(), // product name at purchase time
    snapshotPrice: t.integer().notNull(), // unit price at purchase time
    snapshotType: t.text().notNull(), // product type at purchase time
    snapshotVariants: t.text({ mode: "json" }).$type<
      {
        label: string; // e.g. M, Red
        type: string; // e.g. size, color
      }[]
    >(), // JSON array of selected variants at purchase time. e.g. [{"label":"M","type":"size"}]
  }),
  (t) => [index("order_items_order_id_idx").on(t.orderId)]
);

export type SelectOrderItem = typeof orderItemsTable.$inferSelect;
export type InsertOrderItem = typeof orderItemsTable.$inferInsert;

export const ordersRelations = relations(ordersTable, ({ many, one }) => ({
  orderItems: many(orderItemsTable),
  verifier: one(userTable, {
    fields: [ordersTable.verifiedBy],
    references: [userTable.id],
    relationName: "verifier",
  }),
  picker: one(userTable, {
    fields: [ordersTable.pickedUpBy],
    references: [userTable.id],
    relationName: "picker",
  }),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  product: one(productsTable, {
    fields: [orderItemsTable.productId],
    references: [productsTable.id],
  }),
}));
