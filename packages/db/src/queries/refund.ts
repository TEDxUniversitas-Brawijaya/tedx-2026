import { eq } from "drizzle-orm";
import type { DB } from "../db";
import {
  type InsertRefundRequest,
  refundRequestsTable,
  type SelectRefundRequest,
} from "../schemas/refunds";

export type RefundQueries = {
  getRefundByOrderId: (
    orderId: SelectRefundRequest["orderId"]
  ) => Promise<SelectRefundRequest | null>;
  createRefundRequest: (data: InsertRefundRequest) => Promise<void>;
  updateRefundRequest: (
    id: SelectRefundRequest["id"],
    data: Partial<InsertRefundRequest>
  ) => Promise<void>;
};

export const createRefundQueries = (db: DB): RefundQueries => ({
  getRefundByOrderId: async (orderId) => {
    const refundRequest = await db.query.refundRequestsTable.findFirst({
      where: eq(refundRequestsTable.orderId, orderId),
    });

    return refundRequest ?? null;
  },

  createRefundRequest: async (data) => {
    await db.insert(refundRequestsTable).values(data);
  },

  updateRefundRequest: async (id, data) => {
    await db
      .update(refundRequestsTable)
      .set(data)
      .where(eq(refundRequestsTable.id, id));
  },
});
