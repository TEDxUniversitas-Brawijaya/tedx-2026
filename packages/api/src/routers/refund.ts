import { TRPCError } from "@trpc/server";
import {
  getRefundOrderInfoInputSchema,
  getRefundOrderInfoOutputSchema,
  submitRefundRequestInputSchema,
  submitRefundRequestOutputSchema,
} from "../schemas/refund";
import { createTRPCRouter, publicProcedure } from "../trpc";

const getOrderInfo = publicProcedure
  .input(getRefundOrderInfoInputSchema)
  .output(getRefundOrderInfoOutputSchema)
  .query(() => {
    // TODO: Implement refund.getOrderInfo
    // - Validate token exists
    // - Check order status = "paid"
    // - Check within refund deadline (H-3)
    // - Check no existing pending refund request
    // - Return order info for refund form pre-fill
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "refund.getOrderInfo is not implemented yet",
    });
  });

const submitRequest = publicProcedure
  .input(submitRefundRequestInputSchema)
  .output(submitRefundRequestOutputSchema)
  .mutation(() => {
    // TODO: Implement refund.submitRequest
    // - Validate refund token
    // - Create refund request with "requested" status
    // - Return refund ID and confirmation message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "refund.submitRequest is not implemented yet",
    });
  });

export const refundRouter = createTRPCRouter({
  getOrderInfo,
  submitRequest,
});
