import { z } from "zod";
import {
  bundleItemSchema,
  buyerInfoSchema,
  captchaTokenSchema,
  idempotencyKeySchema,
  imageFileSchema,
  isoDateStringSchema,
  orderIdSchema,
  orderStatusSchema,
  productIdSchema,
  productTypeSchema,
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
    bundleItems: z.array(bundleItemSchema).nullable(),
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
  bundleItemProducts: z
    .array(
      z.object({
        productId: productIdSchema,
        variantIds: z.array(z.string()).optional(),
      })
    )
    .optional(), // for bundle items, the selected product IDs (if applicable)
});

export const createTicketOrderOutputSchema = z.object({
  orderId: orderIdSchema,
  status: orderStatusSchema,
  totalPrice: z.number().int(),
  expiresAt: isoDateStringSchema,
  qrisUrl: z.nullable(z.url()),
});

// ticket.getOrderStatus
export const getTicketOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
});

export const getTicketOrderStatusOutputSchema = z.object({
  status: orderStatusSchema,
});
