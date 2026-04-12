import { TRPCError } from "@trpc/server";
import {
  getOrderByIdInputSchema,
  getOrderByIdOutputSchema,
  listOrdersInputSchema,
  listOrdersOutputSchema,
  processRefundInputSchema,
  verifyPaymentInputSchema,
  verifyPaymentOutputSchema,
} from "../../schemas/order";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listOrdersInputSchema)
  .output(listOrdersOutputSchema)
  .query(async ({ ctx, input }) => {
    const result = await ctx.services.order.listAdminOrders({
      page: input.page,
      limit: input.limit,
      type: input.type,
      status: input.status,
      search: input.search,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
    });

    return {
      orders: result.orders.map((order) => ({
        id: order.id,
        type: order.type,
        status: order.status,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
      })),
      pagination: {
        page: input.page,
        limit: input.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / input.limit)),
      },
    };
  });

const getById = protectedProcedure
  .input(getOrderByIdInputSchema)
  .output(getOrderByIdOutputSchema)
  .query(async ({ ctx, input }) => {
    const result = await ctx.services.order.getAdminOrderById(input.orderId);

    return {
      ...result.order,
      items: result.items,
      tickets: [],
      refund: null,
    };
  });

const verifyPayment = protectedProcedure
  .input(verifyPaymentInputSchema)
  .output(verifyPaymentOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const status = await ctx.services.order.verifyPayment({
      orderId: input.orderId,
      action: input.action,
      reason: input.reason,
      verifierId: ctx.session.user.id,
    });

    return {
      orderId: input.orderId,
      status,
      message:
        status === "paid"
          ? "Payment has been approved"
          : "Payment has been rejected",
    };
  });

const processRefund = protectedProcedure
  .input(processRefundInputSchema)
  .output(getOrderByIdOutputSchema)
  .mutation(() => {
    // TODO: Implement admin.order.processRefund
    // - Validate order exists and has refund request
    // - If action is "approve": release stock (KV), update order status, queue refund confirmation email
    // - If action is "reject": update refund request with rejection reason
    // - Return refund status and message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.order.processRefund is not implemented yet",
    });
  });

export const orderRouter = createTRPCRouter({
  list,
  getById,
  verifyPayment,
  processRefund,
});
