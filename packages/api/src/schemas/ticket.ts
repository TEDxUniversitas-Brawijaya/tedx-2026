import { z } from "zod";
import {
  bundleItemSchema,
  buyerInfoSchema,
  captchaTokenSchema,
  eventDaySchema,
  idempotencyKeySchema,
  imageFileSchema,
  isoDateStringSchema,
  orderIdSchema,
  orderStatusSchema,
  productIdSchema,
  productTypeSchema,
  snapshotVariantSchema,
} from "./common";

// ticket.listProducts
export const listTicketProductsInputSchema = z.object({});

export const listTicketProductsOutputSchema = z.array(
  z.object({
    id: z.string(),
    type: productTypeSchema,
    name: z.string(),
    price: z.number().int(),
    stock: z.number().int().nullable(),
    isActive: z.boolean(),
    description: z.string().nullable(),
    imageUrl: z.string().nullable(),
    bundleItems: z.array(bundleItemSchema).optional(),
  })
);

// ticket.createOrder
export const createTicketOrderInputSchema = buyerInfoSchema.extend({
  productId: productIdSchema,
  quantity: z.number().int().min(1).max(5),
  selectedBundleItemId: z.string().optional(),
  captchaToken: captchaTokenSchema,
  idempotencyKey: idempotencyKeySchema,
  paymentProof: imageFileSchema.optional(),
});

export const createTicketOrderOutputSchema = z.object({
  orderId: orderIdSchema,
  status: z.enum(["pending_payment", "pending_verification"]),
  totalPrice: z.number().int(),
  expiresAt: isoDateStringSchema,
  qrisUrl: z.string().url().nullable(),
  midtransOrderId: z.string().nullable(),
  uploadUrl: z.string().url().nullable(),
});

// ticket.getOrderStatus
export const getTicketOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
});

export const getTicketOrderStatusOutputSchema = z.object({
  orderId: orderIdSchema,
  status: orderStatusSchema,
  type: z.literal("ticket"),
  totalPrice: z.number().int(),
  items: z.array(
    z.object({
      snapshotName: z.string(),
      quantity: z.number().int(),
      unitPrice: z.number().int(),
      snapshotVariants: z.array(snapshotVariantSchema).optional(),
    })
  ),
  createdAt: isoDateStringSchema,
  paidAt: isoDateStringSchema.nullable(),
  eventDay: eventDaySchema.optional(),
});
