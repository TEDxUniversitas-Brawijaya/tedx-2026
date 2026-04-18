import { z } from "zod";
import {
  createMerchOrderInputSchema,
  createMerchOrderOutputSchema,
  getMerchOrderStatusInputSchema,
  getMerchOrderStatusOutputSchema,
  listMerchProductsInputSchema,
  listMerchProductsOutputSchema,
} from "../schemas/merch";
import { createTRPCRouter, publicProcedure } from "../trpc";

const listProducts = publicProcedure
  .input(listMerchProductsInputSchema)
  .output(listMerchProductsOutputSchema)
  .query(async ({ ctx }) => {
    const products = await ctx.services.product.getMerchProducts({
      status: "active",
    });
    return products;
  });

const createOrder = publicProcedure
  .input(z.instanceof(FormData))
  .output(createMerchOrderOutputSchema)
  .mutation(async ({ ctx, input: formData }) => {
    const input = createMerchOrderInputSchema.parse({
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      // Too lazy to determine if the value is string or not
      items: JSON.parse(formData.get("items") as string),
      idempotencyKey: formData.get("idempotencyKey"),
      captchaToken: formData.get("captchaToken"),
      // paymentProof is optional
      paymentProof: formData.get("paymentProof") ?? undefined,
    });

    const order = await ctx.services.order.createMerchOrder(
      {
        buyer: {
          name: input.fullName,
          email: input.email,
          phone: input.phone,
          college: input.address,
        },
        paymentProof: input.paymentProof ?? null,
        idempotencyKey: input.idempotencyKey,
        captchaToken: input.captchaToken,
      },
      input.items
    );

    return {
      ...order,
      expiresAt: order.expiresAt.toISOString(),
    };
  });

const getOrderStatus = publicProcedure
  .input(getMerchOrderStatusInputSchema)
  .output(getMerchOrderStatusOutputSchema)
  .query(async ({ ctx, input }) => {
    const status = await ctx.services.order.getOrderStatus(input.orderId);
    return { status };
  });

export const merchRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
