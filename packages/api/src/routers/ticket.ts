import { z } from "zod";
import {
  createTicketOrderInputSchema,
  createTicketOrderOutputSchema,
  getTicketOrderStatusInputSchema,
  getTicketOrderStatusOutputSchema,
  listTicketProductsInputSchema,
  listTicketProductsOutputSchema,
} from "../schemas/ticket";
import { createTRPCRouter, publicProcedure } from "../trpc";

const listProducts = publicProcedure
  .input(listTicketProductsInputSchema)
  .output(listTicketProductsOutputSchema)
  .query(async ({ ctx }) => {
    const products = await ctx.services.product.getTicketProducts({
      status: "all",
    });
    return products;
  });

const createOrder = publicProcedure
  .input(z.instanceof(FormData))
  .output(createTicketOrderOutputSchema)
  .mutation(async ({ ctx, input: formData }) => {
    const bundleItemProductsValue = formData.get("bundleItemProducts");
    const bundleItemProducts =
      bundleItemProductsValue &&
      bundleItemProductsValue !== "undefined" &&
      bundleItemProductsValue !== "null"
        ? (JSON.parse(bundleItemProductsValue as string) as {
            productId: string;
            variantIds?: string[] | undefined;
          }[])
        : [];

    const input = createTicketOrderInputSchema.parse({
      buyerName: formData.get("buyerName"),
      buyerEmail: formData.get("buyerEmail"),
      phone: formData.get("phone"),
      buyerInstansi: formData.get("buyerInstansi"),
      productId: formData.get("productId"),
      quantity: Number(formData.get("quantity")),
      captchaToken: formData.get("captchaToken"),
      idempotencyKey: formData.get("idempotencyKey"),
      paymentProof: formData.get("paymentProof") ?? undefined,
      bundleItemProducts,
    });

    const order = await ctx.services.order.createTicketOrder(
      {
        buyer: {
          name: input.buyerName,
          email: input.buyerEmail,
          phone: input.phone,
          college: input.buyerInstansi,
        },
        paymentProof: input.paymentProof ?? null,
        idempotencyKey: input.idempotencyKey,
        captchaToken: input.captchaToken,
      },
      {
        productId: input.productId,
        quantity: input.quantity,
        bundleItemProducts: input.bundleItemProducts,
      }
    );

    return {
      ...order,
      expiresAt: order.expiresAt.toISOString(),
    };
  });

const getOrderStatus = publicProcedure
  .input(getTicketOrderStatusInputSchema)
  .output(getTicketOrderStatusOutputSchema)
  .query(async ({ ctx, input }) => {
    const status = await ctx.services.order.getOrderStatus(input.orderId);
    return { status };
  });

export const ticketRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
