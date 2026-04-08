import { TRPCError } from "@trpc/server";
import {
  listMerchPickupInputSchema,
  listMerchPickupOutputSchema,
  markPickedUpInputSchema,
  markPickedUpOutputSchema,
} from "../../schemas/merch-pickup";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listMerchPickupInputSchema)
  .output(listMerchPickupOutputSchema)
  .query(() => {
    // TODO: Implement admin.merchPickup.list
    // - Apply filters: status, search
    // - Apply pagination: page, limit
    // - Return merch orders with pickup status and pagination
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.merchPickup.list is not implemented yet",
    });
  });

const markPickedUp = protectedProcedure
  .input(markPickedUpInputSchema)
  .output(markPickedUpOutputSchema)
  .mutation(() => {
    // TODO: Implement admin.merchPickup.markPickedUp
    // - Validate order exists and is paid
    // - Update pickedUpAt timestamp and pickedUpBy admin ID
    // - Return order ID, status, and timestamp
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.merchPickup.markPickedUp is not implemented yet",
    });
  });

export const merchPickupRouter = createTRPCRouter({
  list,
  markPickedUp,
});
