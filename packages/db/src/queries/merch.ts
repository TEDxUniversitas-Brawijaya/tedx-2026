import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import type { DB } from "../db";
import {
  orderItemsTable,
  ordersTable,
  type InsertOrder,
  type InsertOrderItem,
  type SelectOrder,
  type SelectOrderItem,
} from "../schemas/orders";
import { productsTable, type SelectProduct } from "../schemas/products";

type ListOrdersInput = {
  page: number;
  limit: number;
  type?: "ticket" | "merch";
  status?:
    | "pending_payment"
    | "pending_verification"
    | "paid"
    | "expired"
    | "refund_requested"
    | "refunded"
    | "rejected";
  search?: string;
  sortBy: "createdAt" | "totalPrice" | "status";
  sortOrder: "asc" | "desc";
};

const buildListOrdersWhereClause = ({
  type,
  status,
  search,
}: Pick<ListOrdersInput, "type" | "status" | "search">) => {
  const conditions = [
    type ? eq(ordersTable.type, type) : undefined,
    status ? eq(ordersTable.status, status) : undefined,
    search
      ? or(
          like(ordersTable.buyerName, `%${search}%`),
          like(ordersTable.buyerEmail, `%${search}%`),
          like(ordersTable.id, `%${search}%`)
        )
      : undefined,
  ].filter(Boolean);

  if (conditions.length === 0) {
    return undefined;
  }

  return and(
    ...(conditions as Exclude<(typeof conditions)[number], undefined>[])
  );
};

const getSortedOrders = async (
  db: DB,
  input: Pick<ListOrdersInput, "sortBy" | "sortOrder" | "limit" | "page">,
  whereClause: ReturnType<typeof buildListOrdersWhereClause>
) => {
  const offset = (input.page - 1) * input.limit;

  if (input.sortBy === "totalPrice") {
    return await db.query.ordersTable.findMany({
      where: whereClause,
      orderBy:
        input.sortOrder === "asc"
          ? asc(ordersTable.totalPrice)
          : desc(ordersTable.totalPrice),
      limit: input.limit,
      offset,
    });
  }

  if (input.sortBy === "status") {
    return await db.query.ordersTable.findMany({
      where: whereClause,
      orderBy:
        input.sortOrder === "asc"
          ? asc(ordersTable.status)
          : desc(ordersTable.status),
      limit: input.limit,
      offset,
    });
  }

  return await db.query.ordersTable.findMany({
    where: whereClause,
    orderBy:
      input.sortOrder === "asc"
        ? asc(ordersTable.createdAt)
        : desc(ordersTable.createdAt),
    limit: input.limit,
    offset,
  });
};

export type MerchQueries = {
  listActiveProducts: () => Promise<SelectProduct[]>;
  getProductsByIds: (productIds: string[]) => Promise<SelectProduct[]>;
  getOrderByIdempotencyKey: (
    idempotencyKey: string
  ) => Promise<SelectOrder | null>;
  createOrderWithItems: (
    order: InsertOrder,
    items: InsertOrderItem[]
  ) => Promise<void>;
  getOrderWithItemsById: (
    orderId: string
  ) => Promise<{ order: SelectOrder; items: SelectOrderItem[] } | null>;
  getOrderById: (orderId: string) => Promise<SelectOrder | null>;
  getOrderByMidtransOrderId: (
    midtransOrderId: string
  ) => Promise<SelectOrder | null>;
  updateOrder: (
    orderId: string,
    data: Partial<InsertOrder>
  ) => Promise<SelectOrder | null>;
  listOrders: (input: ListOrdersInput) => Promise<{
    orders: SelectOrder[];
    total: number;
  }>;
  expirePendingPaymentOrders: (nowIso: string) => Promise<number>;
  expirePendingVerificationOrders: (nowIso: string) => Promise<number>;
};

export const createMerchQueries = (db: DB): MerchQueries => ({
  listActiveProducts: async () => {
    return await db.query.productsTable.findMany({
      where: and(
        inArray(productsTable.type, ["merch_regular", "merch_bundle"]),
        eq(productsTable.isActive, true)
      ),
    });
  },

  getProductsByIds: async (productIds) => {
    if (productIds.length === 0) {
      return [];
    }

    return await db.query.productsTable.findMany({
      where: inArray(productsTable.id, productIds),
    });
  },

  getOrderByIdempotencyKey: async (idempotencyKey) => {
    return (
      (await db.query.ordersTable.findFirst({
        where: eq(ordersTable.idempotencyKey, idempotencyKey),
      })) ?? null
    );
  },

  createOrderWithItems: async (order, items) => {
    await db.batch([
      db.insert(ordersTable).values(order),
      db.insert(orderItemsTable).values(items),
    ]);
  },

  getOrderWithItemsById: async (orderId) => {
    const order = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
    });

    if (!order) {
      return null;
    }

    const items = await db.query.orderItemsTable.findMany({
      where: eq(orderItemsTable.orderId, orderId),
    });

    return { order, items };
  },

  getOrderById: async (orderId) => {
    return (
      (await db.query.ordersTable.findFirst({
        where: eq(ordersTable.id, orderId),
      })) ?? null
    );
  },

  getOrderByMidtransOrderId: async (midtransOrderId) => {
    return (
      (await db.query.ordersTable.findFirst({
        where: eq(ordersTable.midtransOrderId, midtransOrderId),
      })) ?? null
    );
  },

  updateOrder: async (orderId, data) => {
    const updated = await db
      .update(ordersTable)
      .set(data)
      .where(eq(ordersTable.id, orderId))
      .returning();

    return updated[0] ?? null;
  },

  listOrders: async ({
    page,
    limit,
    type,
    status,
    search,
    sortBy,
    sortOrder,
  }) => {
    const whereClause = buildListOrdersWhereClause({
      type,
      status,
      search,
    });

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(ordersTable)
      .where(whereClause);

    const count = countResult[0]?.count ?? 0;

    const orders = await getSortedOrders(
      db,
      { sortBy, sortOrder, limit, page },
      whereClause
    );

    return {
      orders,
      total: count,
    };
  },

  expirePendingPaymentOrders: async (nowIso) => {
    const expired = await db
      .update(ordersTable)
      .set({
        status: "expired",
      })
      .where(
        and(
          eq(ordersTable.status, "pending_payment"),
          sql`datetime(${ordersTable.expiresAt}) < datetime(${nowIso})`
        )
      )
      .returning({ id: ordersTable.id });

    return expired.length;
  },

  expirePendingVerificationOrders: async (nowIso) => {
    const expired = await db
      .update(ordersTable)
      .set({
        status: "expired",
      })
      .where(
        and(
          eq(ordersTable.status, "pending_verification"),
          sql`datetime(${ordersTable.createdAt}, '+24 hours') < datetime(${nowIso})`
        )
      )
      .returning({ id: ordersTable.id });

    return expired.length;
  },
});
