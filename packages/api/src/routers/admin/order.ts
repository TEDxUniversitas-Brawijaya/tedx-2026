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
  .query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Order listing is not implemented yet.",
    });
  });

const getById = protectedProcedure
  .input(getOrderByIdInputSchema)
  .output(getOrderByIdOutputSchema)
  .query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Get order by ID is not implemented yet.",
    });
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
