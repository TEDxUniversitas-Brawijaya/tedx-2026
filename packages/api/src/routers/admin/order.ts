import {
  getOrderByIdInputSchema,
  getOrderByIdOutputSchema,
  listOrdersInputSchema,
  listOrdersOutputSchema,
  processRefundInputSchema,
  processRefundOutputSchema,
  verifyPaymentInputSchema,
  verifyPaymentOutputSchema,
} from "../../schemas/order";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listOrdersInputSchema)
  .output(listOrdersOutputSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, type, status, search, sortBy, sortOrder } = input;
    const { orders, meta } = await ctx.services.order.getOrders({
      page,
      limit,
      type,
      status,
      search,
      sortBy,
      sortOrder,
    });

    const totalPages = Math.ceil(meta.total / limit);

    return {
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        paidAt: order.paidAt ? order.paidAt.toISOString() : null,
      })),
      pagination: { total: meta.total, page, limit, totalPages },
    };
  });

const getById = protectedProcedure
  .input(getOrderByIdInputSchema)
  .output(getOrderByIdOutputSchema)
  .query(async ({ ctx, input }) => {
    const [order, refund] = await Promise.all([
      ctx.services.order.getOrderById(input.orderId),
      ctx.services.refund.getRefundByOrderId(input.orderId),
    ]);

    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt ? order.paidAt.toISOString() : null,
      expiresAt: order.expiresAt ? order.expiresAt.toISOString() : null,
      verifiedAt: order.verifiedAt ? order.verifiedAt.toISOString() : null,
      pickedUpAt: order.pickedUpAt ? order.pickedUpAt.toISOString() : null,
      refund: refund
        ? {
            ...refund,
            processedAt: refund.processedAt
              ? new Date(refund.processedAt).toISOString()
              : null,
            createdAt: new Date(refund.createdAt).toISOString(),
          }
        : null,
      // TODO: include ticket details when available
      tickets: null,
    };
  });

const verifyPayment = protectedProcedure
  .input(verifyPaymentInputSchema)
  .output(verifyPaymentOutputSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.services.order.verifyPayment(
      input.orderId,
      input.action,
      input.reason ?? null,
      ctx.session.user.id
    );
  });

const processRefund = protectedProcedure
  .input(processRefundInputSchema)
  .output(processRefundOutputSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.services.order.processRefund(
      input.orderId,
      input.action,
      input.reason ?? "",
      ctx.session.user.id
    );
  });

export const orderRouter = createTRPCRouter({
  list,
  getById,
  verifyPayment,
  processRefund,
});
