import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createDB, type D1Database, type DB } from "../src/db";
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
];

const productsData: InsertProduct[] = [
  // -- Ticket Regular --
  {
    id: "prod_tkt_p3d1",
    type: "ticket_regular",
    name: "Propa 3 Day 1",
    description: "Propaganda 3 - Day 1",
    price: 35_000,
    stock: 100,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_p3d2",
    type: "ticket_regular",
    name: "Propa 3 Day 2",
    description: "Propaganda 3 - Day 2",
    price: 35_000,
    stock: 100,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_main",
    type: "ticket_regular",
    name: "Main Event",
    description: "TEDxUniversitasBrawijaya 2026 Main Event",
    price: 75_000,
    stock: 80,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // -- Ticket Bundle --
  {
    id: "prod_tkt_b_me_2dp",
    type: "ticket_bundle",
    name: "Main Event + 2 Day Pass Propa 3",
    description: "Bundle: Main Event + Propa 3 Day 1 & Day 2",
    price: 130_000,
    stock: 50,
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_main", quantity: 1, isSelectable: false },
      { productId: "prod_tkt_p3d1", quantity: 1, isSelectable: false },
      { productId: "prod_tkt_p3d2", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_p3d1d2",
    type: "ticket_bundle",
    name: "Propa 3 Day 1 + Day 2",
    description: "Bundle: Propa 3 both days",
    price: 60_000,
    stock: 60,
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_p3d1", quantity: 1, isSelectable: false },
      { productId: "prod_tkt_p3d2", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_me_p3",
    type: "ticket_bundle",
    name: "Main Event + Propa 3",
    description: "Bundle: Main Event + pick Propa 3 Day 1 or Day 2",
    price: 100_000,
    stock: 50,
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_main", quantity: 1, isSelectable: false },
      { productId: "prod_tkt_p3d1", quantity: 1, isSelectable: true },
      { productId: "prod_tkt_p3d2", quantity: 1, isSelectable: true },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_tkt_b_me_merch",
    type: "ticket_bundle",
    name: "Main Event + Merch",
    description: "Bundle: Main Event + pick topi/sticker/socks",
    price: 95_000,
    stock: 40,
    isActive: true,
    bundleItems: [
      { productId: "prod_tkt_main", quantity: 1, isSelectable: false },
      { productId: "prod_m_topi", quantity: 1, isSelectable: true },
      { productId: "prod_m_sticker", quantity: 1, isSelectable: true },
      { productId: "prod_m_socks", quantity: 1, isSelectable: true },
    ],
    createdAt: now,
    updatedAt: now,
  },

  // -- Merch Regular --
  {
    id: "prod_m_tshirt",
    type: "merch_regular",
    name: "T-shirt",
    description: "TEDxUB 2026 T-shirt",
    price: 120_000,
    isActive: true,
    variants: [
      { id: "var_ts_s", type: "size", label: "S" },
      { id: "var_ts_m", type: "size", label: "M" },
      { id: "var_ts_l", type: "size", label: "L" },
      { id: "var_ts_xl", type: "size", label: "XL" },
      { id: "var_ts_blk", type: "color", label: "Hitam" },
      { id: "var_ts_wht", type: "color", label: "Putih" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_workshirt",
    type: "merch_regular",
    name: "Work Shirt",
    description: "TEDxUB 2026 Work Shirt",
    price: 150_000,
    isActive: true,
    variants: [
      { id: "var_ws_s", type: "size", label: "S" },
      { id: "var_ws_m", type: "size", label: "M" },
      { id: "var_ws_l", type: "size", label: "L" },
      { id: "var_ws_xl", type: "size", label: "XL" },
      { id: "var_ws_blk", type: "color", label: "Hitam" },
      { id: "var_ws_nvy", type: "color", label: "Navy" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_topi",
    type: "merch_regular",
    name: "Topi",
    description: "TEDxUB 2026 Cap",
    price: 50_000,
    isActive: true,
    variants: [
      { id: "var_tp_blk", type: "color", label: "Hitam" },
      { id: "var_tp_wht", type: "color", label: "Putih" },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_socks",
    type: "merch_regular",
    name: "Socks",
    description: "TEDxUB 2026 Socks",
    price: 35_000,
    isActive: true,
    variants: [{ id: "var_sk_free", type: "size", label: "Free Size" }],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_keychain",
    type: "merch_regular",
    name: "Keychain",
    description: "TEDxUB 2026 Keychain",
    price: 25_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_m_sticker",
    type: "merch_regular",
    name: "Sticker",
    description: "TEDxUB 2026 Sticker Pack",
    price: 15_000,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },

  // -- Merch Bundle --
  {
    id: "prod_mb_ts_tp",
    type: "merch_bundle",
    name: "T-shirt + Topi",
    description: "Bundle",
    price: 155_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_tshirt", quantity: 1, isSelectable: false },
      { productId: "prod_m_topi", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_ws_tp",
    type: "merch_bundle",
    name: "Work Shirt + Topi",
    description: "Bundle",
    price: 185_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_workshirt", quantity: 1, isSelectable: false },
      { productId: "prod_m_topi", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_ts_sk",
    type: "merch_bundle",
    name: "T-shirt + Socks",
    description: "Bundle",
    price: 145_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_tshirt", quantity: 1, isSelectable: false },
      { productId: "prod_m_socks", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_ws_sk",
    type: "merch_bundle",
    name: "Work Shirt + Socks",
    description: "Bundle",
    price: 175_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_workshirt", quantity: 1, isSelectable: false },
      { productId: "prod_m_socks", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_tp_kc",
    type: "merch_bundle",
    name: "Topi + Keychain",
    description: "Bundle",
    price: 70_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_topi", quantity: 1, isSelectable: false },
      { productId: "prod_m_keychain", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_tp_st",
    type: "merch_bundle",
    name: "Topi + Sticker",
    description: "Bundle",
    price: 60_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_topi", quantity: 1, isSelectable: false },
      { productId: "prod_m_sticker", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "prod_mb_sk_kc_st",
    type: "merch_bundle",
    name: "Socks + Keychain + Sticker",
    description: "Bundle",
    price: 65_000,
    isActive: true,
    bundleItems: [
      { productId: "prod_m_socks", quantity: 1, isSelectable: false },
      { productId: "prod_m_keychain", quantity: 1, isSelectable: false },
      { productId: "prod_m_sticker", quantity: 1, isSelectable: false },
    ],
    createdAt: now,
    updatedAt: now,
  },
];

const ordersData: InsertOrder[] = [
  {
    id: "TDX-260701-AA001",
    type: "merch",
    status: "paid",
    buyerName: "Andi Pratama",
    buyerEmail: "andi@ub.ac.id",
    buyerPhone: "081234567001",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 155_000,
    idempotencyKey: "idem_001",
    paidAt: "2026-07-01T10:05:00Z",
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:05:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_001",
    refundToken: "rfnd_andi001",
  },
  {
    id: "TDX-260701-AA002",
    type: "merch",
    status: "paid",
    buyerName: "Budi Santoso",
    buyerEmail: "budi@ub.ac.id",
    buyerPhone: "081234567002",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 120_000,
    idempotencyKey: "idem_002",
    paidAt: "2026-07-01T11:30:00Z",
    createdAt: "2026-07-01T11:00:00Z",
    updatedAt: "2026-07-01T11:30:00Z",
    paymentMethod: "manual",
    proofImageUrl:
      "https://storage.tedxuniversitasbrawijaya.com/proofs/budi_proof.jpg",
    verifiedBy: "admin_001",
    verifiedAt: "2026-07-01T11:30:00Z",
    refundToken: "rfnd_budi002",
    pickedUpAt: "2026-08-17T09:00:00Z",
    pickedUpBy: "admin_001",
  },
  {
    id: "TDX-260702-AA003",
    type: "merch",
    status: "pending_verification",
    buyerName: "Citra Dewi",
    buyerEmail: "citra@ub.ac.id",
    buyerPhone: "081234567003",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 185_000,
    idempotencyKey: "idem_003",
    createdAt: "2026-07-02T09:00:00Z",
    updatedAt: "2026-07-02T09:00:00Z",
    paymentMethod: "manual",
    proofImageUrl:
      "https://storage.tedxuniversitasbrawijaya.com/proofs/citra_proof.jpg",
  },
  {
    id: "TDX-260702-AA004",
    type: "merch",
    status: "expired",
    buyerName: "Dian Ayu",
    buyerEmail: "dian@ub.ac.id",
    buyerPhone: "081234567004",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 50_000,
    idempotencyKey: "idem_004",
    expiresAt: "2026-07-02T10:20:00Z",
    createdAt: "2026-07-02T10:00:00Z",
    updatedAt: "2026-07-02T10:20:00Z",
    paymentMethod: "manual",
  },
  {
    id: "TDX-260703-BB001",
    type: "ticket",
    status: "paid",
    buyerName: "Eka Putra",
    buyerEmail: "eka@ub.ac.id",
    buyerPhone: "081234567005",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 150_000,
    idempotencyKey: "idem_005",
    paidAt: "2026-07-03T08:05:00Z",
    createdAt: "2026-07-03T08:00:00Z",
    updatedAt: "2026-07-03T08:05:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_005",
    refundToken: "rfnd_eka001",
  },
  {
    id: "TDX-260703-BB002",
    type: "ticket",
    status: "paid",
    buyerName: "Fajar Hidayat",
    buyerEmail: "fajar@ub.ac.id",
    buyerPhone: "081234567006",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 130_000,
    idempotencyKey: "idem_006",
    paidAt: "2026-07-03T09:05:00Z",
    createdAt: "2026-07-03T09:00:00Z",
    updatedAt: "2026-07-03T09:05:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_006",
    refundToken: "rfnd_fajar001",
  },
  {
    id: "TDX-260703-BB003",
    type: "ticket",
    status: "refund_requested",
    buyerName: "Gita Sari",
    buyerEmail: "gita@ub.ac.id",
    buyerPhone: "081234567007",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 75_000,
    idempotencyKey: "idem_007",
    paidAt: "2026-07-03T10:05:00Z",
    createdAt: "2026-07-03T10:00:00Z",
    updatedAt: "2026-07-03T14:00:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_007",
    refundToken: "rfnd_gita001",
  },
  {
    id: "TDX-260704-BB004",
    type: "ticket",
    status: "pending_payment",
    buyerName: "Hadi Wijaya",
    buyerEmail: "hadi@ub.ac.id",
    buyerPhone: "081234567008",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 35_000,
    idempotencyKey: "idem_008",
    expiresAt: "2026-07-04T12:20:00Z",
    createdAt: "2026-07-04T12:00:00Z",
    updatedAt: "2026-07-04T12:00:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_008",
  },
  {
    id: "TDX-260704-BB005",
    type: "ticket",
    status: "refunded",
    buyerName: "Indah Permata",
    buyerEmail: "indah@ub.ac.id",
    buyerPhone: "081234567009",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 60_000,
    idempotencyKey: "idem_009",
    paidAt: "2026-07-04T13:05:00Z",
    createdAt: "2026-07-04T13:00:00Z",
    updatedAt: "2026-07-04T15:00:00Z",
    paymentMethod: "midtrans",
    midtransOrderId: "mt_009",
    refundToken: "rfnd_indah001",
  },
  {
    id: "TDX-260705-AA005",
    type: "merch",
    status: "rejected",
    buyerName: "Joko Susanto",
    buyerEmail: "joko@ub.ac.id",
    buyerPhone: "081234567010",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 145_000,
    idempotencyKey: "idem_010",
    createdAt: "2026-07-05T14:00:00Z",
    updatedAt: "2026-07-05T15:00:00Z",
    paymentMethod: "manual",
    proofImageUrl:
      "https://storage.tedxuniversitasbrawijaya.com/proofs/joko_proof.jpg",
    verifiedBy: "admin_001",
    verifiedAt: "2026-07-05T15:00:00Z",
    rejectionReason: "Bukti pembayaran tidak valid",
  },
];

const orderItemsData: InsertOrderItem[] = [
  {
    id: "oi_001",
    orderId: "TDX-260701-AA001",
    productId: "prod_mb_ts_tp",
    quantity: 1,
    snapshotName: "T-shirt + Topi",
    snapshotPrice: 155_000,
    snapshotType: "merch_bundle",
    snapshotVariants: [
      { label: "M", type: "size" },
      { label: "Hitam", type: "color" },
      { label: "Hitam", type: "color" },
    ],
  },
  {
    id: "oi_002",
    orderId: "TDX-260701-AA002",
    productId: "prod_m_tshirt",
    quantity: 1,
    snapshotName: "T-shirt",
    snapshotPrice: 120_000,
    snapshotType: "merch_regular",
    snapshotVariants: [
      { label: "L", type: "size" },
      { label: "Putih", type: "color" },
    ],
  },
  {
    id: "oi_003",
    orderId: "TDX-260702-AA003",
    productId: "prod_mb_ws_tp",
    quantity: 1,
    snapshotName: "Work Shirt + Topi",
    snapshotPrice: 185_000,
    snapshotType: "merch_bundle",
    snapshotVariants: [
      { label: "M", type: "size" },
      { label: "Navy", type: "color" },
      { label: "Putih", type: "color" },
    ],
  },
  {
    id: "oi_004",
    orderId: "TDX-260702-AA004",
    productId: "prod_m_topi",
    quantity: 1,
    snapshotName: "Topi",
    snapshotPrice: 50_000,
    snapshotType: "merch_regular",
    snapshotVariants: [{ label: "Hitam", type: "color" }],
  },
  {
    id: "oi_005",
    orderId: "TDX-260703-BB001",
    productId: "prod_tkt_main",
    quantity: 2,
    snapshotName: "Main Event",
    snapshotPrice: 75_000,
    snapshotType: "ticket_regular",
  },
  {
    id: "oi_006",
    orderId: "TDX-260703-BB002",
    productId: "prod_tkt_b_me_2dp",
    quantity: 1,
    snapshotName: "Main Event + 2 Day Pass Propa 3",
    snapshotPrice: 130_000,
    snapshotType: "ticket_bundle",
  },
  {
    id: "oi_007",
    orderId: "TDX-260703-BB003",
    productId: "prod_tkt_main",
    quantity: 1,
    snapshotName: "Main Event",
    snapshotPrice: 75_000,
    snapshotType: "ticket_regular",
  },
  {
    id: "oi_008",
    orderId: "TDX-260704-BB004",
    productId: "prod_tkt_p3d1",
    quantity: 1,
    snapshotName: "Propa 3 Day 1",
    snapshotPrice: 35_000,
    snapshotType: "ticket_regular",
  },
  {
    id: "oi_009",
    orderId: "TDX-260704-BB005",
    productId: "prod_tkt_b_p3d1d2",
    quantity: 1,
    snapshotName: "Propa 3 Day 1 + Day 2",
    snapshotPrice: 60_000,
    snapshotType: "ticket_bundle",
  },
  {
    id: "oi_010",
    orderId: "TDX-260705-AA005",
    productId: "prod_mb_ts_sk",
    quantity: 1,
    snapshotName: "T-shirt + Socks",
    snapshotPrice: 145_000,
    snapshotType: "merch_bundle",
    snapshotVariants: [
      { label: "XL", type: "size" },
      { label: "Hitam", type: "color" },
      { label: "Free Size", type: "size" },
    ],
  },
];

const ticketsData: InsertTicket[] = [
  // BB001: Main Event qty 2
  {
    id: "tkt_001",
    orderItemId: "oi_005",
    qrCode: "qr_eka_main_1",
    eventDay: "main_event",
    attendanceStatus: "not_checked_in",
    createdAt: "2026-07-03T08:05:00Z",
  },
  {
    id: "tkt_002",
    orderItemId: "oi_005",
    qrCode: "qr_eka_main_2",
    eventDay: "main_event",
    attendanceStatus: "checked_in",
    checkedInAt: "2026-08-17T08:30:00Z",
    checkedInBy: "admin_001",
    createdAt: "2026-07-03T08:05:00Z",
  },
  // BB002: ME + 2 Day Pass qty 1 = 3 tickets
  {
    id: "tkt_003",
    orderItemId: "oi_006",
    qrCode: "qr_fajar_p3d1",
    eventDay: "propa3_day1",
    attendanceStatus: "checked_in",
    checkedInAt: "2026-08-10T09:00:00Z",
    checkedInBy: "admin_001",
    createdAt: "2026-07-03T09:05:00Z",
  },
  {
    id: "tkt_004",
    orderItemId: "oi_006",
    qrCode: "qr_fajar_p3d2",
    eventDay: "propa3_day2",
    attendanceStatus: "checked_in",
    checkedInAt: "2026-08-11T09:15:00Z",
    checkedInBy: "admin_001",
    createdAt: "2026-07-03T09:05:00Z",
  },
  {
    id: "tkt_005",
    orderItemId: "oi_006",
    qrCode: "qr_fajar_main",
    eventDay: "main_event",
    attendanceStatus: "not_checked_in",
    createdAt: "2026-07-03T09:05:00Z",
  },
  // BB003: Main Event qty 1 (refund_requested)
  {
    id: "tkt_006",
    orderItemId: "oi_007",
    qrCode: "qr_gita_main",
    eventDay: "main_event",
    attendanceStatus: "not_checked_in",
    createdAt: "2026-07-03T10:05:00Z",
  },
  // BB005: Propa D1+D2 qty 1 (refunded)
  {
    id: "tkt_007",
    orderItemId: "oi_009",
    qrCode: "qr_indah_p3d1",
    eventDay: "propa3_day1",
    attendanceStatus: "not_checked_in",
    createdAt: "2026-07-04T13:05:00Z",
  },
  {
    id: "tkt_008",
    orderItemId: "oi_009",
    qrCode: "qr_indah_p3d2",
    eventDay: "propa3_day2",
    attendanceStatus: "not_checked_in",
    createdAt: "2026-07-04T13:05:00Z",
  },
];

const refundRequestsData: InsertRefundRequest[] = [
  {
    id: "ref_001",
    orderId: "TDX-260703-BB003",
    status: "requested",
    reason: "Tidak bisa hadir karena ada acara keluarga",
    paymentMethod: "midtrans",
    bankAccountNumber: "1234567890",
    bankName: "BCA",
    bankAccountHolder: "Gita Sari",
    createdAt: "2026-07-03T14:00:00Z",
    updatedAt: "2026-07-03T14:00:00Z",
  },
  {
    id: "ref_002",
    orderId: "TDX-260704-BB005",
    status: "approved",
    reason: "Jadwal bentrok dengan ujian",
    paymentMethod: "midtrans",
    bankAccountNumber: "0987654321",
    bankName: "Mandiri",
    bankAccountHolder: "Indah Permata",
    processedBy: "admin_001",
    processedAt: "2026-07-04T15:00:00Z",
    createdAt: "2026-07-04T14:00:00Z",
    updatedAt: "2026-07-04T15:00:00Z",
  },
];

function generateInsert<T extends Record<string, unknown>>(
  db: DB,
  table: SQLiteTable,
  data: T[]
): string {
  const { sql, params } = db
    .insert(table)
    .values(data)
    .onConflictDoNothing()
    .toSQL();

  console.log("Generated SQL:", sql);
  console.log("With parameters:", params);

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
