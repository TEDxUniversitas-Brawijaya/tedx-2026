import { TRPCError } from "@trpc/server";
import {
  getOrderByIdInputSchema,
  listOrdersInputSchema,
  processRefundInputSchema,
  verifyPaymentInputSchema,
} from "../../schemas/order";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure.input(listOrdersInputSchema).query(() => {
  // TODO: Implement admin.order.list
  // - Apply filters: type, status, search
  // - Apply sorting: sortBy, sortOrder
  // - Apply pagination: page, limit
  // - Return orders with pagination info
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "admin.order.list is not implemented yet",
  });
});

const getById = protectedProcedure.input(getOrderByIdInputSchema).query(() => {
  // TODO: Implement admin.order.getById
  // - Fetch full order details including items, tickets, payment, and refund info
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "admin.order.getById is not implemented yet",
  });
});

const verifyPayment = protectedProcedure
  .input(verifyPaymentInputSchema)
  .mutation(() => {
    // TODO: Implement admin.order.verifyPayment
    // - Validate order exists and status is pending_verification
    // - If action is "approve": update order to "paid", generate tickets + QR, queue confirmation email
    // - If action is "reject": update order with rejection reason, release stock
    // - Return order status and message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.order.verifyPayment is not implemented yet",
    });
  });

const processRefund = protectedProcedure
  .input(processRefundInputSchema)
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
