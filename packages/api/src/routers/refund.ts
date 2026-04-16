import { z } from "zod";
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
  .query(async ({ ctx, input }) => {
    const orderInfo = await ctx.services.refund.getOrderInfo(input.refundToken);

    return {
      ...orderInfo,
      refundDeadline: orderInfo.refundDeadline.toISOString(),
    };
  });

const submitRequest = publicProcedure
  .input(z.instanceof(FormData))
  .output(submitRefundRequestOutputSchema)
  .mutation(async ({ ctx, input: formData }) => {
    const input = submitRefundRequestInputSchema.parse({
      refundToken: formData.get("refundToken"),
      reason: formData.get("reason"),
      paymentMethod: formData.get("paymentMethod"),
      bankAccountNumber: formData.get("bankAccountNumber"),
      bankName: formData.get("bankName"),
      bankAccountHolder: formData.get("bankAccountHolder"),
      paymentProof: formData.get("paymentProof") ?? undefined,
    });

    return await ctx.services.refund.submitRequest(input);
  });

export const refundRouter = createTRPCRouter({
  getOrderInfo,
  submitRequest,
});
