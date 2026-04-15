import { TRPCError } from "@trpc/server";
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
    const order = await ctx.services.order.getOrderById(input.orderId);

    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      paidAt: order.paidAt ? order.paidAt.toISOString() : null,
      expiresAt: order.expiresAt ? order.expiresAt.toISOString() : null,
      verifiedAt: order.verifiedAt ? order.verifiedAt.toISOString() : null,
      pickedUpAt: order.pickedUpAt ? order.pickedUpAt.toISOString() : null,
      // TODO: include refund details when available
      refund: null,
      // TODO: include ticket details when available
      tickets: null,
    };
  });

const verifyPayment = protectedProcedure
  .input(verifyPaymentInputSchema)
  .output(verifyPaymentOutputSchema)
  .mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Payment verification is not implemented yet.",
    });
  });

const processRefund = protectedProcedure
  .input(processRefundInputSchema)
  .output(processRefundOutputSchema)
  .mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Refund processing is not implemented yet.",
    });
  });

export const orderRouter = createTRPCRouter({
  list,
  getById,
  verifyPayment,
  processRefund,
});
