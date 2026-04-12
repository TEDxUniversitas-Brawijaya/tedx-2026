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
    const products = await ctx.services.merch.listProducts();
    return listMerchProductsOutputSchema.parse(products);
  });

const createOrder = publicProcedure
  .input(createMerchOrderInputSchema)
  .output(createMerchOrderOutputSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.services.merch.createOrder({
      buyerName: input.buyerName,
      buyerEmail: input.buyerEmail,
      buyerPhone: input.buyerPhone,
      buyerInstansi: input.buyerInstansi,
      idempotencyKey: input.idempotencyKey,
      items: input.items,
    });
  });

const getOrderStatus = publicProcedure
  .input(getMerchOrderStatusInputSchema)
  .output(getMerchOrderStatusOutputSchema)
  .query(async ({ ctx, input }) => {
    return await ctx.services.merch.getOrderStatus(input.orderId);
  });

export const merchRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
