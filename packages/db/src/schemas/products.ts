import { sql } from "drizzle-orm";
import { index, sqliteTable } from "drizzle-orm/sqlite-core";

export const productsTable = sqliteTable(
  "products",
  (t) => ({
    id: t.text().primaryKey(), // prefix: prod_
    type: t
      .text({
        enum: [
          "ticket_regular",
          "ticket_bundle",
          "merch_regular",
          "merch_bundle",
        ],
      })
      .notNull(),
    name: t.text().notNull(),
    description: t.text(),
    price: t.integer().notNull(), // IDR, no decimals
    stock: t.integer(), // tickets only; null for merch (pre-order)
    isActive: t.integer({ mode: "boolean" }).default(true).notNull(),
    imageUrl: t.text(),
    variants: t.text({ mode: "json" }).$type<
      {
        id: string; // e.g. var_x
        type: string; // e.g. size, color
        label: string; // e.g. M, Red
      }[]
    >(),
    bundleItems: t.text({ mode: "json" }).$type<
      {
        productId: string;
        quantity: number;
        isSelectable: boolean; // for bundles only, whether the customer can choose this item or it's fixed
      }[]
    >(),
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
    index("products_type_idx").on(t.type),
    index("products_is_active_idx").on(t.isActive),
    index("products_type_is_active_idx").on(t.type, t.isActive),
  ]
);

export type SelectProduct = typeof productsTable.$inferSelect;
export type InsertProduct = typeof productsTable.$inferInsert;
