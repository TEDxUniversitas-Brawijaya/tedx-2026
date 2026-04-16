import { eq } from "drizzle-orm";
import type { DB } from "../db";
import {
  type InsertRefundRequest,
  refundRequestsTable,
  type SelectRefundRequest,
} from "../schemas/refunds";
import type { SelectOrder, SelectOrderItem } from "../schemas/orders";

export type RefundQueries = {
  getRefundRequestByOrderId: (
    orderId: SelectRefundRequest["orderId"]
  ) => Promise<SelectRefundRequest | null>;
  getOrderByRefundToken: (token: string) => Promise<{
    order: SelectOrder;
    items: SelectOrderItem[];
  } | null>;
  createRefundRequest: (
    data: InsertRefundRequest
  ) => Promise<SelectRefundRequest>;
  updateRefundRequest: (
    id: SelectRefundRequest["id"],
    data: Partial<InsertRefundRequest>
  ) => Promise<SelectRefundRequest | null>;
};

export const createRefundQueries = (db: DB): RefundQueries => ({
  getRefundRequestByOrderId: async (orderId) => {
    const refundRequest = await db.query.refundRequestsTable.findFirst({
      where: eq(refundRequestsTable.orderId, orderId),
    });

    return refundRequest ?? null;
  },

  getOrderByRefundToken: async (token) => {
    const order = await db.query.ordersTable.findFirst({
      where: (ordersTable, { eq }) => eq(ordersTable.refundToken, token),
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

  createRefundRequest: async (data) => {
    const [createdRefundRequest] = await db
      .insert(refundRequestsTable)
      .values(data)
      .returning();

    if (!createdRefundRequest) {
      throw new Error("Failed to create refund request");
    }

    return createdRefundRequest;
  },

  updateRefundRequest: async (id, data) => {
    const [updatedRefundRequest] = await db
      .update(refundRequestsTable)
      .set(data)
      .where(eq(refundRequestsTable.id, id))
      .returning();

    return updatedRefundRequest ?? null;
  },
});
