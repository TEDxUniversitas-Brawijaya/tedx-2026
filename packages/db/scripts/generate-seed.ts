/** biome-ignore-all lint/style/noNonNullAssertion: TODO */
import { createNanoIdWithPrefix } from "@tedx-2026/utils";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createDB, type D1Database, type DB } from "../src/db";
import { userTable, type InsertUser } from "../src/schemas/auth";
import { configTable, type InsertConfig } from "../src/schemas/config";
import {
  orderItemsTable,
  ordersTable,
  type InsertOrder,
  type InsertOrderItem,
} from "../src/schemas/orders";
import { productsTable, type InsertProduct } from "../src/schemas/products";
import {
  refundRequestsTable,
  type InsertRefundRequest,
} from "../src/schemas/refunds";
import { ticketsTable, type InsertTicket } from "../src/schemas/tickets";

const now = "2026-06-01T00:00:00Z";

const userData: InsertUser[] = [
  {
    id: "admin_001",
    name: "Admin User",
    email: "admin@tedxub2026.com",
  },
];

const configData: InsertConfig[] = [
  {
    key: "payment_mode",
    value: "manual",
    description: "Active payment method: midtrans | manual",
  },
  {
    key: "merch_preorder_deadline",
    value: "2026-07-15T23:59:59Z",
    description: "When merch pre-order closes",
  },
  {
    key: "refund_deadline_days_before",
    value: "3",
    description: "Days before event that refunds close",
  },
  {
    key: "payment_timeout_minutes",
    value: "20",
    description: "Order expiry timeout in minutes",
  },
  {
    key: "cooldown_minutes",
    value: "10",
    description: "Per-buyer cooldown in minutes",
  },
  {
    key: "event_date_propa3_day1",
    value: "2026-08-10",
    description: "Propaganda 3 Day 1",
  },
  {
    key: "event_date_propa3_day2",
    value: "2026-08-11",
    description: "Propaganda 3 Day 2",
  },
  { key: "event_date_main", value: "2026-08-17", description: "Main Event" },
  {
    key: "whatsapp_group_propa3_day1",
    value: "https://chat.whatsapp.com/xxx",
    description: "WhatsApp group link for Propaganda 3 Day 1 attendees",
  },
  {
    key: "whatsapp_group_propa3_day2",
    value: "https://chat.whatsapp.com/xxx",
    description: "WhatsApp group link for Propaganda 3 Day 2 attendees",
  },
  {
    key: "whatsapp_group_main",
    value: "https://chat.whatsapp.com/xxx",
    description: "WhatsApp group link for Main Event attendees",
  },
];

const regularProductData: InsertProduct[] = [
  //#region Ticket
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_regular",
    name: "Propaganda 3 Day 1",
    description: "Propaganda 3 - Day 1",
    price: 135_000,
    stock: 23,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_regular",
    name: "Propaganda 3 Day 2",
    description: "Propaganda 3 - Day 2",
    price: 105_000,
    stock: 25,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_regular",
    name: "Main Event",
    description: "Main Event",
    price: 75_000, // TODO
    stock: 80, // TODO
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  //#endregion Ticket

  //#region Merchandise
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "T-shirt A",
    description: "Ideas Change Everything",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/t-shirt/tshirt-1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "T-shirt B",
    description: "Curating Moment: Home is where the heart is.",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/t-shirt/tshirt-2.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "T-shirt C",
    description: "Rooted Together at Home",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/t-shirt/tshirt-3.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Work Shirt A",
    description: "Sometimes, home is where you feel whole",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/workshirt/workshirt-1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Work Shirt B",
    description: "TEDxUniversitas Brawijaya",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/workshirt/workshirt-2.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Work Shirt C",
    description: "A House of My Own",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/workshirt/workshirt-3.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Work Shirt D",
    description: "TEDxUniversitas Brawijaya: Ideas Change Everything",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "S" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "M" },
      { id: createNanoIdWithPrefix("var", 21, true), type: "size", label: "L" },
      {
        id: createNanoIdWithPrefix("var", 21, true),
        type: "size",
        label: "XL",
      },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/workshirt/workshirt-4.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Topi A",
    description: "TEDx",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/hat/topi-1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Topi B",
    description: "TEDxUB",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/hat/topi-2.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Topi C",
    description: "TEDxUniversitas Brawijaya",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/hat/topi-3.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Socks A",
    description: "Home is where the heart is.",
    category: "socks",
    price: 18_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/socks/sock-1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Socks B",
    description: "TEDxUniversitas Brawijaya",
    category: "socks",
    price: 18_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/socks/sock-2.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Socks C",
    description: "X",
    category: "socks",
    price: 18_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/socks/sock-3.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v1",
    category: "keychain",
    description: "Keychain v1",
    price: 23_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 A",
    category: "keychain",
    description: "Keychain v2 A",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-a.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 B",
    category: "keychain",
    description: "Keychain v2 B",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-b.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 C",
    category: "keychain",
    description: "Keychain v2 C",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-c.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 D",
    category: "keychain",
    description: "Keychain v2 D",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-d.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 E",
    category: "keychain",
    description: "Keychain v2 E",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-e.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 F",
    category: "keychain",
    description: "Keychain v2 F",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-f.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 G",
    category: "keychain",
    description: "Keychain v2 G",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-g.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Keychain v2 H",
    category: "keychain",
    description: "Keychain v2 H",
    price: 15_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/keychain/keychain-v2-h.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Stickers A",
    category: "stickers",
    description: "Stickers A",
    price: 10_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/stickers/sticker-1.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_regular",
    name: "Stickers B",
    category: "stickers",
    description: "Stickers B",
    price: 10_000,
    isActive: true,
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/stickers/sticker-2.png",
    createdAt: now,
    updatedAt: now,
  },
  //#endregion Merchandise
];

const bundlingProductsData: InsertProduct[] = [
  //#region Ticket
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_bundle",
    name: "Bundling 1",
    description: "2 Day Pass Propaganda 3",
    price: 235_000,
    stock: null,
    isActive: true,
    bundleItems: [
      {
        productId: regularProductData.find(
          (p) => p.name === "Propaganda 3 Day 1"
        )!.id,
        type: "ticket",
      },
      {
        productId: regularProductData.find(
          (p) => p.name === "Propaganda 3 Day 2"
        )!.id,
        type: "ticket",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_bundle",
    name: "Bundling 2",
    description: "Main Event + Merch Keychain v1",
    price: 0, // TODO
    stock: null,
    isActive: false, // TODO
    bundleItems: [
      {
        productId: regularProductData.find((p) => p.name === "Main Event")!.id,
        type: "ticket",
      },
      {
        productId: regularProductData.find((p) => p.name === "Keychain v1")!.id,
        type: "merchandise_product",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_bundle",
    name: "Bundling 3",
    description: "Main Event + Merch Socks",
    price: 0, // TODO
    stock: null,
    isActive: false,
    bundleItems: [
      {
        productId: regularProductData.find((p) => p.name === "Main Event")!.id,
        type: "ticket",
      },
      { category: "socks", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "ticket_bundle",
    name: "Bundling 4",
    description: "Main Event + Merch Stickers",
    price: 0, // TODO
    stock: null, // TODO
    isActive: false,
    bundleItems: [
      {
        type: "ticket",
        productId: regularProductData.find((p) => p.name === "Main Event")!.id,
      },
      {
        type: "merchandise",
        category: "stickers",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },
  //#endregion Ticket

  // -- Merch Bundle --
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling A",
    description: "T-Shirt + Topi",
    price: 0, // TODO
    isActive: false,
    bundleItems: [
      { category: "t-shirt", type: "merchandise" },
      { category: "hat", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-a.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling B",
    description: "Workshirt + Topi",
    price: 0, // TODO
    isActive: false,
    bundleItems: [
      { category: "workshirt", type: "merchandise" },
      { category: "hat", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-b.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling C",
    description: "T-Shirt + Socks",
    price: 88_000,
    isActive: true,
    bundleItems: [
      { category: "t-shirt", type: "merchandise" },
      { category: "socks", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-c.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling D",
    description: "Workshirt + Socks",
    price: 193_000,
    isActive: true,
    bundleItems: [
      { category: "workshirt", type: "merchandise" },
      { category: "socks", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-d.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling E",
    description: "Topi + Keychain",
    price: 0, // TODO
    isActive: false,
    bundleItems: [
      { category: "hat", type: "merchandise" },
      { category: "keychain", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-e.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling F",
    description: "Topi + Stickers",
    price: 0, // TODO
    isActive: false,
    bundleItems: [
      { category: "hat", type: "merchandise" },
      { category: "stickers", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-f.png",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: createNanoIdWithPrefix("prod", 21, true),
    type: "merch_bundle",
    name: "Bundling G",
    description: "Socks + Keychain v1 + Stickers",
    price: 45_000,
    isActive: true,
    bundleItems: [
      { category: "socks", type: "merchandise" },
      {
        productId: regularProductData.find((p) => p.name === "Keychain v1")!.id,
        type: "merchandise_product",
      },
      { category: "stickers", type: "merchandise" },
    ],
    imageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/merchandise/bundling/bundling-g.png",
    createdAt: now,
    updatedAt: now,
  },
];

// TODO: Add sample data
const ordersData: InsertOrder[] = [];

// TODO: Add sample data
const orderItemsData: InsertOrderItem[] = [];

// TODO: Add sample data
const ticketsData: InsertTicket[] = [];

// TODO: Add sample data
const refundRequestsData: InsertRefundRequest[] = [];

function generateInsert<T extends Record<string, unknown>>(
  db: DB,
  table: SQLiteTable,
  data: T[]
): string {
  if (data.length === 0) {
    return "-- No data for table";
  }
  const { sql, params } = db
    .insert(table)
    .values(data)
    .onConflictDoNothing()
    .toSQL();

  // Drizzle's toSQL generates parameterized queries, but for seed generation we want the actual values inlined.
  // This is a simple and naive implementation that works for our controlled seed data, but may not cover all edge cases.
  let inlinedSQL = sql;
  for (const param of params) {
    if (typeof param === "string") {
      try {
        // Try to parse json to handle objects/arrays (like bundleItems and variants) - we want to inline the JSON string, not the object itself
        const parsed = JSON.parse(param);
        if (typeof parsed === "object") {
          inlinedSQL = inlinedSQL.replace("?", `'${param}'`); // Wrap JSON string in single quotes
          continue;
        }
      } catch {
        // Not JSON, treat as regular string
      }

      inlinedSQL = inlinedSQL.replace("?", `"${param}"`);
      continue;
    }

    if (param === null) {
      inlinedSQL = inlinedSQL.replace("?", "NULL");
      continue;
    }

    inlinedSQL = inlinedSQL.replace("?", `${param}`);
  }

  return `${inlinedSQL};`;
}

async function generateSeedSQL(): Promise<void> {
  // ! It is okay to use createDB here since we only need the SQL generation capabilities and won't actually execute any queries
  const db = createDB({} as D1Database);
  const sections: string[] = [];

  sections.push("-- TEDx 2026 Seed Data");
  sections.push(`-- Generated on ${new Date().toISOString()}`);
  sections.push("");

  sections.push("-- Users");
  sections.push(generateInsert(db, userTable, userData));
  sections.push("");

  sections.push("-- Config");
  sections.push(generateInsert(db, configTable, configData));
  sections.push("");

  sections.push("-- Products");
  sections.push(
    generateInsert(db, productsTable, [
      ...regularProductData,
      ...bundlingProductsData,
    ])
  );
  sections.push("");

  sections.push("-- Orders");
  sections.push(generateInsert(db, ordersTable, ordersData));
  sections.push("");

  sections.push("-- Order Items");
  sections.push(generateInsert(db, orderItemsTable, orderItemsData));
  sections.push("");

  sections.push("-- Tickets");
  sections.push(generateInsert(db, ticketsTable, ticketsData));
  sections.push("");

  sections.push("-- Refund Requests");
  sections.push(generateInsert(db, refundRequestsTable, refundRequestsData));
  sections.push("");

  const sql = sections.join("\n");
  const outputPath = join(process.cwd(), "temp", "seed.sql");

  await writeFile(outputPath, sql, "utf-8");
  console.log(`✅ Seed SQL generated successfully at: ${outputPath}`);
}

generateSeedSQL().catch((error) => {
  console.error("Error generating seed SQL:", error);
  process.exit(1);
});
