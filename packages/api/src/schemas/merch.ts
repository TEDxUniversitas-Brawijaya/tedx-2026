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
  productCategorySchema,
  productIdSchema,
  productTypeSchema,
  productVariantSchema,
  snapshotVariantSchema,
} from "./common";

// merch.listProducts
export const listMerchProductsInputSchema = z.object({});

export const listMerchProductsOutputSchema = z.array(
  z.object({
    id: z.string(),
    type: productTypeSchema,
    name: z.string(),
    price: z.number().int(),
    imageUrl: z.string().optional(),
    category: productCategorySchema.optional(),
    variants: z.array(productVariantSchema).optional(),
    bundleItems: z.array(bundleItemSchema).optional(),
  })
);

// merch.createOrder
export const createMerchOrderInputSchema = buyerInfoSchema.extend({
  items: z.array(
    z.object({
      productId: productIdSchema,
      quantity: z.number().int().min(1).max(100),
      variantIds: z.array(z.string()),
    })
  ),
  captchaToken: captchaTokenSchema,
  idempotencyKey: idempotencyKeySchema,
  paymentProof: imageFileSchema.optional(),
});

export const createMerchOrderOutputSchema = z.object({
  orderId: orderIdSchema,
  status: z.literal("pending_payment").or(z.literal("pending_verification")),
  totalPrice: z.number().int(),
  expiresAt: isoDateStringSchema,
  payment: z
    .object({
      qrisUrl: z.string().url(),
      midtransOrderId: z.string(),
    })
    .or(
      z.object({
        uploadUrl: z.string().url(),
      })
    ),
});

// merch.getOrderStatus
export const getMerchOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
});

export const getMerchOrderStatusOutputSchema = z.object({
  orderId: orderIdSchema,
  status: orderStatusSchema,
  type: z.literal("merch"),
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
});
