import { z } from "zod";
import {
  isoDateStringSchema,
  orderIdSchema,
  paginationSchema,
  snapshotVariantSchema,
} from "./common";

// admin.merchPickup.list
export const listMerchPickupInputSchema = paginationSchema.extend({
  status: z.enum(["picked_up", "not_picked_up"]).optional(),
  search: z.string().optional(),
});

export const listMerchPickupOutputSchema = z.object({
  orders: z.array(
    z.object({
      orderId: orderIdSchema,
      buyerName: z.string(),
      buyerEmail: z.string().email(),
      totalPrice: z.number().int(),
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.number().int(),
          snapshotVariants: z.array(snapshotVariantSchema).nullable(),
        })
      ),
      pickedUpAt: isoDateStringSchema.nullable(),
      createdAt: isoDateStringSchema,
    })
  ),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// admin.merchPickup.markPickedUp
export const markPickedUpInputSchema = z.object({
  orderId: orderIdSchema,
});

export const markPickedUpOutputSchema = z.object({
  orderId: orderIdSchema,
  status: z.literal("picked_up"),
  pickedUpAt: isoDateStringSchema,
});
