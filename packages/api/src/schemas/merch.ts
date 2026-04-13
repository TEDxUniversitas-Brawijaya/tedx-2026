import { z } from "zod";
import {
  bundleItemSchema,
  captchaTokenSchema,
  idempotencyKeySchema,
  imageFileSchema,
  isoDateStringSchema,
  merchBuyerInfoSchema,
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
    imageUrl: z.string().nullable().optional(),
    category: productCategorySchema.optional(),
    variants: z.array(productVariantSchema).optional(),
    bundleItems: z.array(bundleItemSchema).optional(),
  })
);

// merch.createOrder
export const createMerchOrderInputSchema = merchBuyerInfoSchema.extend({
  items: z.array(
    z.object({
      productId: productIdSchema,
      quantity: z.number().int().min(1).max(100),
      variantIds: z.array(z.string()).optional(), // for regular items, the selected variant IDs (if applicable)
      bundleItemProducts: z
        .array(
          z.object({
            productId: productIdSchema,
            variantIds: z.array(z.string()).optional(),
          })
        )
        .optional(), // for bundle items, the selected product IDs (if applicable)
    })
  ),
  idempotencyKey: idempotencyKeySchema,
  captchaToken: captchaTokenSchema,
  paymentProof: imageFileSchema.optional(),
});

export const createMerchOrderOutputSchema = z.object({
  orderId: orderIdSchema,
  status: z.literal("pending_payment").or(z.literal("paid")),
  totalPrice: z.number().int(),
  expiresAt: isoDateStringSchema,
  qrisUrl: z.url().nullable(),
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
