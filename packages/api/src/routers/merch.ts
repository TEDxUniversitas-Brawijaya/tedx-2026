import { TRPCError } from "@trpc/server";
import {
  createMerchOrderInputSchema,
  getMerchOrderStatusInputSchema,
  listMerchProductsInputSchema,
} from "../schemas/merch";
import { createTRPCRouter, publicProcedure } from "../trpc";

const listProducts = publicProcedure
  .input(listMerchProductsInputSchema)
  .query(() => {
    // TODO: Implement merch.listProducts
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "merch.listProducts is not implemented yet",
    });
  });

const createOrder = publicProcedure
  .input(createMerchOrderInputSchema)
  .mutation(() => {
    // TODO: Implement merch.createOrder
    // - Validate CAPTCHA
    // - Check idempotency key
    // - Validate all products exist and are active
    // - Check pre-order deadline not passed (from config)
    // - Validate variant IDs are valid for each product
    // - Validate payment proof if payment_mode is manual
    // - Create order with pending_payment or pending_verification status
    // - Return order details with payment info
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "merch.createOrder is not implemented yet",
    });
  });

const getOrderStatus = publicProcedure
  .input(getMerchOrderStatusInputSchema)
  .query(() => {
    // TODO: Implement merch.getOrderStatus
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "merch.getOrderStatus is not implemented yet",
    });
  });

export const merchRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
