import { eq } from "drizzle-orm";
import type { DB } from "../db";
import {
  type InsertRefundRequest,
  refundRequestsTable,
  type SelectRefundRequest,
} from "../schemas/refunds";

export type RefundQueries = {
  getRefundRequestByOrderId: (
    orderId: SelectRefundRequest["orderId"]
  ) => Promise<SelectRefundRequest | null>;
  createRefundRequest: (data: InsertRefundRequest) => Promise<void>;
  updateRefundRequest: (
    id: SelectRefundRequest["id"],
    data: Partial<InsertRefundRequest>
  ) => Promise<SelectRefundRequest | null>;
};

export const createRefundQueries = (db: DB): RefundQueries => ({
  getRefundRequestByOrderId: async (orderId) => {
    const refundRequest = await db.query.refundRequestsTable.findFirst({
      where: eq(refundRequestsTable.orderId, orderId),
      orderBy: (refundRequestsTable, { desc }) =>
        desc(refundRequestsTable.createdAt),
    });

    return refundRequest ?? null;
  },

  createRefundRequest: async (data) => {
    await db.insert(refundRequestsTable).values(data);
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
