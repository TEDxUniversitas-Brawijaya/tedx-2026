import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  like,
  or,
  sql,
} from "drizzle-orm";
import type { DB } from "../db";
import {
  orderItemsTable,
  ordersTable,
  type InsertOrder,
  type InsertOrderItem,
  type SelectOrder,
  type SelectOrderItem,
} from "../schemas/orders";

export type OrderQueries = {
  createOrder: (order: InsertOrder, items: InsertOrderItem[]) => Promise<void>;
  updateOrder: (
    orderId: string,
    data: Partial<InsertOrder>
  ) => Promise<SelectOrder | null>;
  deleteOrderById: (orderId: string) => Promise<void>;

  getOrderById: (orderId: string) => Promise<SelectOrder | null>;

  getOrderStatusById: (
    orderId: string
  ) => Promise<SelectOrder["status"] | null>;

  // TODO: change to cursor-based pagination if needed
  getOrders: (opts?: {
    page: number;
    limit: number;
    type?: SelectOrder["type"];
    status?: SelectOrder["status"];
    search?: string;
    sortBy: "createdAt" | "totalPrice" | "status";
    sortOrder: "asc" | "desc";
  }) => Promise<{
    orders: SelectOrder[];
    meta: {
      total: number;
    };
  }>;

  getOrderItemsByOrderId: (
    orderId: SelectOrder["id"]
  ) => Promise<SelectOrderItem[]>;
  getOrderItemsByOrderIds: (
    orderIds: SelectOrder["id"][]
  ) => Promise<SelectOrderItem[]>;

  getOrderWithItemsByRefundToken: (
    refundToken: SelectOrder["refundToken"]
  ) => Promise<{ order: SelectOrder; items: SelectOrderItem[] } | null>;

  expirePendingPaymentOrders: () => Promise<Pick<SelectOrder, "buyerEmail">[]>;
  expirePendingVerificationOrders: () => Promise<
    Pick<SelectOrder, "buyerEmail">[]
  >;

  getOrderPendingCounts: () => Promise<{
    pendingVerificationsCount: number;
    refundRequestedCount: number;
  }>;

  getSoldTicketQuantityByProduct: () => Promise<
    { productId: string; quantitySold: number }[]
  >;

  getSoldMerchQuantityByProduct: () => Promise<
    {
      productId: string;
      name: string;
      quantitySold: number;
      unpickedUpQuantity: number;
    }[]
  >;

  getMerchPickupOrders: (opts: {
    page: number;
    limit: number;
    status?: "picked_up" | "not_picked_up";
    search?: string;
  }) => Promise<{
    orders: {
      orderId: string;
      buyerName: string;
      buyerEmail: string;
      totalPrice: number;
      pickedUpAt: string | null;
      createdAt: string;
      items: {
        name: string;
        quantity: number;
        snapshotVariants: { label: string; type: string }[] | null;
      }[];
    }[];
    meta: { total: number };
  }>;
};

export const createOrderQueries = (db: DB): OrderQueries => ({
  createOrder: async (order, items) => {
    await db.batch([
      db.insert(ordersTable).values(order),
      db.insert(orderItemsTable).values(items),
    ]);
  },

  getOrderById: async (orderId) => {
    const order = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
    });
    if (!order) {
      return null;
    }

    return order;
  },

  getOrderStatusById: async (orderId) => {
    const order = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.id, orderId),
      columns: { status: true },
    });
    if (!order) {
      return null;
    }

    return order.status;
  },

  updateOrder: async (orderId, data) => {
    const [updated] = await db
      .update(ordersTable)
      .set(data)
      .where(eq(ordersTable.id, orderId))
      .returning();

    return updated ?? null;
  },

  deleteOrderById: async (orderId) => {
    await db.delete(ordersTable).where(eq(ordersTable.id, orderId));
  },

  getOrders: async (opts) => {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      search,
      sortBy,
      sortOrder,
    } = opts || {};

    const offset = (page - 1) * limit;

    const whereClause = and(
      type ? eq(ordersTable.type, type) : undefined,
      status ? eq(ordersTable.status, status) : undefined,
      search
        ? or(
            like(ordersTable.buyerName, `%${search}%`),
            like(ordersTable.buyerEmail, `%${search}%`),
            like(ordersTable.id, `%${search}%`)
          )
        : undefined
    );

    const getOrderBy = () => {
      if (sortBy === "totalPrice") {
        return sortOrder === "asc"
          ? asc(ordersTable.totalPrice)
          : desc(ordersTable.totalPrice);
      }
      if (sortBy === "status") {
        return sortOrder === "asc"
          ? asc(ordersTable.status)
          : desc(ordersTable.status);
      }
      return sortOrder === "asc"
        ? asc(ordersTable.createdAt)
        : desc(ordersTable.createdAt);
    };

    const orderBy = getOrderBy();

    const [countRecords, ordersRecords] = await db.batch([
      db
        .select({ count: sql<number>`count(*)` })
        .from(ordersTable)
        .where(whereClause),
      db.query.ordersTable.findMany({
        where: whereClause,
        orderBy,
        limit,
        offset,
      }),
    ]);

    return {
      orders: ordersRecords,
      meta: {
        total: countRecords[0]?.count ?? 0,
      },
    };
  },

  getOrderItemsByOrderId: async (orderId) => {
    return await db.query.orderItemsTable.findMany({
      where: eq(orderItemsTable.orderId, orderId),
    });
  },

  getOrderItemsByOrderIds: async (orderIds) => {
    if (orderIds.length === 0) {
      return [];
    }

    return await db.query.orderItemsTable.findMany({
      where: inArray(orderItemsTable.orderId, orderIds),
    });
  },

  getOrderWithItemsByRefundToken: async (refundToken) => {
    const order = await db.query.ordersTable.findFirst({
      where: eq(ordersTable.refundToken, refundToken),
      with: {
        orderItems: true,
      },
    });

    if (!order) {
      return null;
    }

    return {
      order,
      items: order.orderItems,
    };
  },

  expirePendingPaymentOrders: async () => {
    const expiredOrders = await db
      .update(ordersTable)
      .set({
        status: "expired",
      })
      .where(
        and(
          eq(ordersTable.status, "pending_payment"),
          sql`datetime(${ordersTable.expiresAt}) < datetime(${new Date().toISOString()})`
        )
      )
      .returning({ buyerEmail: ordersTable.buyerEmail });

    return expiredOrders;
  },

  expirePendingVerificationOrders: async () => {
    const expiredOrders = await db
      .update(ordersTable)
      .set({
        status: "expired",
      })
      .where(
        and(
          eq(ordersTable.status, "pending_verification"),
          sql`datetime(${ordersTable.createdAt}, '+24 hours') < datetime(${new Date().toISOString()})`
        )
      )
      .returning({ buyerEmail: ordersTable.buyerEmail });

    return expiredOrders;
  },

  getOrderPendingCounts: async () => {
    const [[pendingRow], [refundRow]] = await db.batch([
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(ordersTable)
        .where(eq(ordersTable.status, "pending_verification")),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(ordersTable)
        .where(eq(ordersTable.status, "refund_requested")),
    ]);
    return {
      pendingVerificationsCount: pendingRow?.count ?? 0,
      refundRequestedCount: refundRow?.count ?? 0,
    };
  },

  getSoldTicketQuantityByProduct: async () => {
    return await db
      .select({
        productId: orderItemsTable.productId,
        quantitySold: sql<number>`cast(sum(${orderItemsTable.quantity}) as integer)`,
      })
      .from(orderItemsTable)
      .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(
        and(eq(ordersTable.status, "paid"), eq(ordersTable.type, "ticket"))
      )
      .groupBy(orderItemsTable.productId);
  },

  getSoldMerchQuantityByProduct: async () => {
    return await db
      .select({
        productId: orderItemsTable.productId,
        name: orderItemsTable.snapshotName,
        quantitySold: sql<number>`cast(sum(${orderItemsTable.quantity}) as integer)`,
        unpickedUpQuantity: sql<number>`cast(sum(case when ${ordersTable.pickedUpAt} is null then ${orderItemsTable.quantity} else 0 end) as integer)`,
      })
      .from(orderItemsTable)
      .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(and(eq(ordersTable.status, "paid"), eq(ordersTable.type, "merch")))
      .groupBy(orderItemsTable.productId, orderItemsTable.snapshotName);
  },

  getMerchPickupOrders: async ({ page, limit, status, search }) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
      eq(ordersTable.type, "merch"),
      eq(ordersTable.status, "paid"),
      status === "picked_up" ? isNotNull(ordersTable.pickedUpAt) : undefined,
      status === "not_picked_up" ? isNull(ordersTable.pickedUpAt) : undefined,
      search
        ? or(
            like(ordersTable.buyerName, `%${search}%`),
            like(ordersTable.buyerEmail, `%${search}%`),
            like(ordersTable.id, `%${search}%`)
          )
        : undefined
    );

    const [countRecords, ordersRecords] = await db.batch([
      db
        .select({ count: sql<number>`count(*)` })
        .from(ordersTable)
        .where(whereClause),
      db.query.ordersTable.findMany({
        where: whereClause,
        orderBy: desc(ordersTable.createdAt),
        limit,
        offset,
      }),
    ]);

    const total = countRecords[0]?.count ?? 0;

    if (ordersRecords.length === 0) {
      return { orders: [], meta: { total } };
    }

    const orderIds = ordersRecords.map((o) => o.id);
    const itemsRecords = await db.query.orderItemsTable.findMany({
      where: inArray(orderItemsTable.orderId, orderIds),
    });

    const itemsByOrderId = new Map<string, typeof itemsRecords>();
    for (const item of itemsRecords) {
      const existing = itemsByOrderId.get(item.orderId) ?? [];
      existing.push(item);
      itemsByOrderId.set(item.orderId, existing);
    }

    const orders = ordersRecords.map((order) => ({
      orderId: order.id,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      totalPrice: order.totalPrice,
      pickedUpAt: order.pickedUpAt ?? null,
      createdAt: order.createdAt,
      items: (itemsByOrderId.get(order.id) ?? []).map((item) => ({
        name: item.snapshotName,
        quantity: item.quantity,
        snapshotVariants: item.snapshotVariants as
          | { label: string; type: string }[]
          | null,
      })),
    }));

    return { orders, meta: { total } };
  },
});
