import { TRPCError } from "@trpc/server";
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
  .query(() => {
    // TODO: Implement ticket.listProducts
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "ticket.listProducts is not implemented yet",
    });
  });

const createOrder = publicProcedure
  .input(createTicketOrderInputSchema)
  .output(createTicketOrderOutputSchema)
  .mutation(() => {
    // TODO: Implement ticket.createOrder
    // - Validate CAPTCHA
    // - Check idempotency key
    // - Check cooldown by email (KV)
    // - Validate product exists and is active
    // - Validate selectedBundleItemId if product has selectable bundle items
    // - Check stock availability (KV atomic decrement)
    // - Validate payment proof if payment_mode is manual
    // - Create order with pending_payment or pending_verification status
    // - Return order details with payment info
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "ticket.createOrder is not implemented yet",
    });
  });

const getOrderStatus = publicProcedure
  .input(getTicketOrderStatusInputSchema)
  .output(getTicketOrderStatusOutputSchema)
  .query(() => {
    // TODO: Implement ticket.getOrderStatus
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "ticket.getOrderStatus is not implemented yet",
    });
  });

export const ticketRouter = createTRPCRouter({
  listProducts,
  createOrder,
  getOrderStatus,
});
