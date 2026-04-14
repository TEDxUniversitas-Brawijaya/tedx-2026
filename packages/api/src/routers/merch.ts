import { TRPCError } from "@trpc/server/unstable-core-do-not-import";
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
  .query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Product listing is not implemented yet.",
    });
  });

const createOrder = publicProcedure
  .input(createMerchOrderInputSchema)
  .output(createMerchOrderOutputSchema)
  .mutation(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Order creation is not implemented yet.",
    });
  });

const getOrderStatus = publicProcedure
  .input(getMerchOrderStatusInputSchema)
  .output(getMerchOrderStatusOutputSchema)
  .query(() => {
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "Get order status is not implemented yet.",
    });
  });

export const merchRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
