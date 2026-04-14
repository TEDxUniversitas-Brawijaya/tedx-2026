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
} from "./common";

// merch.listProducts
export const listMerchProductsInputSchema = z.object({});

export const listMerchProductsOutputSchema = z.array(
  z.object({
    id: z.string(),
    type: productTypeSchema,
    name: z.string(),
    price: z.number().int(),
    imageUrl: z.string().nullable(),
    category: productCategorySchema.nullable(),
    variants: z.array(productVariantSchema).nullable(),
    bundleItems: z.array(bundleItemSchema).nullable(),
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
  status: orderStatusSchema,
  totalPrice: z.number().int(),
  expiresAt: isoDateStringSchema,
  qrisUrl: z.nullable(z.url()),
});

// merch.getOrderStatus
export const getMerchOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
});

export const getMerchOrderStatusOutputSchema = z.object({
  status: orderStatusSchema,
});
