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

// TODO: Add imageUrl
const productsData: InsertProduct[] = [
  // -- Ticket Regular --
  {
    id: "prod_tkt_p3d1",
    type: "ticket_regular",
    name: "Propaganda 3 Day 1",
    description: "Propaganda 3 - Day 1",
    price: 135_000,
    stock: 100, // TODO
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_p3d2",
    type: "ticket_regular",
    name: "Propaganda 3 Day 2",
    description: "Propaganda 3 - Day 2",
    price: 105_000, // TODO
    stock: 100, // TODO
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_main",
    type: "ticket_regular",
    name: "Main Event",
    description: "Main Event",
    price: 75_000, // TODO
    stock: 80, // TODO
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // -- Ticket Bundle --
  {
    id: "prod_tkt_b_1",
    type: "ticket_bundle",
    name: "Bundling 1",
    description: "2 Day Pass Propaganda 3",
    price: 235_000,
    stock: 50, // TODO
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_p3d1", type: "ticket" },
      { productId: "prod_tkt_p3d2", type: "ticket" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_2",
    type: "ticket_bundle",
    name: "Bundling 2",
    description: "Main Event + Merch Keychain",
    price: 60_000, // TODO
    stock: 60, // TODO
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_main", type: "ticket" },
      { category: "keychain", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_3",
    type: "ticket_bundle",
    name: "Bundling 3",
    description: "Main Event + Merch Socks",
    price: 100_000, // TODO
    stock: 50, // TODO
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_main", type: "ticket" },
      { category: "socks", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_4",
    type: "ticket_bundle",
    name: "Bundling 4",
    description: "Main Event + Merch Stickers",
    price: 95_000, // TODO
    stock: 40, // TODO
    isActive: true,
    bundleItems: [
      {
        type: "ticket",
        productId: "prod_tkt_main",
      },
      {
        type: "merchandise",
        category: "stickers",
      },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // -- Merch Regular --
  {
    id: "prod_m_tshirt_a",
    type: "merch_regular",
    name: "T-shirt A",
    description: "2026 T-shirt A",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: "var_ts_s", type: "size", label: "S" },
      { id: "var_ts_m", type: "size", label: "M" },
      { id: "var_ts_l", type: "size", label: "L" },
      { id: "var_ts_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_tshirt_b",
    type: "merch_regular",
    name: "T-shirt B",
    description: "2026 T-shirt B",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: "var_ts_s", type: "size", label: "S" },
      { id: "var_ts_m", type: "size", label: "M" },
      { id: "var_ts_l", type: "size", label: "L" },
      { id: "var_ts_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_tshirt_c",
    type: "merch_regular",
    name: "T-shirt C",
    description: "2026 T-shirt C",
    price: 75_000,
    isActive: true,
    category: "t-shirt",
    variants: [
      // TODO
      { id: "var_ts_s", type: "size", label: "S" },
      { id: "var_ts_m", type: "size", label: "M" },
      { id: "var_ts_l", type: "size", label: "L" },
      { id: "var_ts_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_workshirt_black_a",
    type: "merch_regular",
    name: "Work Shirt Black A",
    description: "Work Shirt Black A",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: "var_ws_s", type: "size", label: "S" },
      { id: "var_ws_m", type: "size", label: "M" },
      { id: "var_ws_l", type: "size", label: "L" },
      { id: "var_ws_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_workshirt_black_b",
    type: "merch_regular",
    name: "Work Shirt Black B",
    description: "Work Shirt Black B",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: "var_ws_s", type: "size", label: "S" },
      { id: "var_ws_m", type: "size", label: "M" },
      { id: "var_ws_l", type: "size", label: "L" },
      { id: "var_ws_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_workshirt_maroon_a",
    type: "merch_regular",
    name: "Work Shirt Maroon A",
    description: "Work Shirt Maroon A",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: "var_ws_s", type: "size", label: "S" },
      { id: "var_ws_m", type: "size", label: "M" },
      { id: "var_ws_l", type: "size", label: "L" },
      { id: "var_ws_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_workshirt_maroon_b",
    type: "merch_regular",
    name: "Work Shirt Maroon B",
    description: "Work Shirt Maroon B",
    price: 180_000,
    isActive: true,
    category: "workshirt",
    variants: [
      // TODO
      { id: "var_ws_s", type: "size", label: "S" },
      { id: "var_ws_m", type: "size", label: "M" },
      { id: "var_ws_l", type: "size", label: "L" },
      { id: "var_ws_xl", type: "size", label: "XL" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  // Commented since in figma there's only 2 maroon workshirts
  // {
  //   id: "prod_m_workshirt_maroon_c",
  //   type: "merch_regular",
  //   name: "Work Shirt Maroon C",
  //   description: "Work Shirt Maroon C",
  //   price: 180_000,
  //   isActive: true,
  //   category: "workshirt",
  //   variants: [
  //     // TODO
  //     { id: "var_ws_s", type: "size", label: "S" },
  //     { id: "var_ws_m", type: "size", label: "M" },
  //     { id: "var_ws_l", type: "size", label: "L" },
  //     { id: "var_ws_xl", type: "size", label: "XL" },
  //   ],
  //   createdAt: now,
  //   updatedAt: now,
  // },
  {
    id: "prod_m_topi_a",
    type: "merch_regular",
    name: "Topi A",
    description: "Topi A",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_topi_b",
    type: "merch_regular",
    name: "Topi B",
    description: "Topi B",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_topi_c",
    type: "merch_regular",
    name: "Topi C",
    description: "Topi C",
    category: "hat",
    price: 50_000, // TODO
    isActive: false, // Price will be determined after sales start
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_socks_a",
    type: "merch_regular",
    name: "Socks A",
    description: "Socks A",
    category: "socks",
    price: 18_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_socks_b",
    type: "merch_regular",
    name: "Socks B",
    description: "Socks B",
    category: "socks",
    price: 18_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_socks_c",
    type: "merch_regular",
    name: "Socks C",
    description: "Socks C",
    category: "socks",
    price: 18_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain_v1_a",
    type: "merch_regular",
    name: "Keychain v1 A",
    category: "keychain",
    description: "Keychain v1 A",
    price: 23_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain_v1_b",
    type: "merch_regular",
    name: "Keychain v1 B",
    category: "keychain",
    description: "Keychain v1 B",
    price: 23_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain_v1_c",
    type: "merch_regular",
    name: "Keychain v1 C",
    category: "keychain",
    description: "Keychain v1 C",
    price: 23_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain_v2_a",
    type: "merch_regular",
    name: "Keychain v2 A",
    category: "keychain",
    description: "Keychain v2 A",
    price: 15_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain_v2_b",
    type: "merch_regular",
    name: "Keychain v2 B",
    category: "keychain",
    description: "Keychain v2 B",
    price: 15_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_sticker_a",
    type: "merch_regular",
    name: "Stickers A",
    category: "stickers",
    description: "Sticker A",
    price: 10_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_sticker_b",
    type: "merch_regular",
    name: "Stickers B",
    category: "stickers",
    description: "Sticker B",
    price: 10_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // -- Merch Bundle --
  {
    id: "prod_mb_a",
    type: "merch_bundle",
    name: "Bundling A",
    description: "T-Shirt + Topi",
    price: 155_000, // TODO
    isActive: false,
    bundleItems: [
      { category: "t-shirt", type: "merchandise" },
      { category: "hat", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_b",
    type: "merch_bundle",
    name: "Bundling B",
    description: "Workshirt + Topi",
    price: 185_000, // TODO
    isActive: false,
    bundleItems: [
      { category: "workshirt", type: "merchandise" },
      { category: "hat", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_c",
    type: "merch_bundle",
    name: "Bundling C",
    description: "T-Shirt + Socks",
    price: 88_000,
    isActive: true,
    bundleItems: [
      { category: "t-shirt", type: "merchandise" },
      { category: "socks", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_d",
    type: "merch_bundle",
    name: "Bundling D",
    description: "Workshirt + Socks",
    price: 193_000,
    isActive: true,
    bundleItems: [
      { category: "workshirt", type: "merchandise" },
      { category: "socks", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_e",
    type: "merch_bundle",
    name: "Bundling E",
    description: "Topi + Keychain",
    price: 70_000, // TODO
    isActive: false,
    bundleItems: [
      { category: "hat", type: "merchandise" },
      { category: "keychain", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_f",
    type: "merch_bundle",
    name: "Bundling F",
    description: "Topi + Stickers",
    price: 70_000, // TODO
    isActive: false,
    bundleItems: [
      { category: "hat", type: "merchandise" },
      { category: "stickers", type: "merchandise" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_G",
    type: "merch_bundle",
    name: "Bundling G",
    description: "Socks + Keychain v1 + Stickers",
    price: 45_000,
    isActive: true,
    bundleItems: [
      { category: "socks", type: "merchandise" },
      { productId: "prod_m_keychain_v1_a", type: "merchandise_product" },
      { category: "stickers", type: "merchandise" },
    ],
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
  sections.push(generateInsert(db, productsTable, productsData));
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
