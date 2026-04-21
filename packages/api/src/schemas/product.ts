import { z } from "zod";
import {
  bundleItemSchema,
  imageFileSchema,
  isoDateStringSchema,
  productIdSchema,
  productTypeSchema,
  productVariantSchema,
} from "./common";

// admin.product.list
export const listProductsInputSchema = z.object({
  type: productTypeSchema.optional(),
});

export const listProductsOutputSchema = z.array(
  z.object({
    id: productIdSchema,
    type: productTypeSchema,
    name: z.string(),
    description: z.string().nullable(),
    price: z.number().int(),
    stock: z.number().int().nullable(),
    isActive: z.boolean(),
    imageUrl: z.nullable(z.url()),
    variants: z.array(productVariantSchema).nullable(),
    bundleItems: z.array(bundleItemSchema).nullable(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
  })
);

// admin.product.create
export const createProductInputSchema = z.object({
  type: productTypeSchema,
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  price: z.number().int().positive(),
  stock: z.number().int().nonnegative().optional(),
  imageUrl: imageFileSchema,
  variants: z.array(productVariantSchema).optional(),
  bundleItems: z.array(bundleItemSchema).optional(),
});

export const createProductOutputSchema = z.object({
  id: productIdSchema,
  message: z.string(),
});

// admin.product.update
export const updateProductInputSchema = z.object({
  productId: productIdSchema,
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().int().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  imageUrl: imageFileSchema.optional(),
});

export const updateProductOutputSchema = z.void();

// admin.product.delete
export const deleteProductInputSchema = z.object({
  productId: productIdSchema,
});

export const deleteProductOutputSchema = z.object({
  productId: productIdSchema,
  message: z.string(),
});

// admin.product.createVariant
export const createVariantInputSchema = z.object({
  productId: productIdSchema,
  variant: productVariantSchema,
});

export const createVariantOutputSchema = z.object({
  productId: productIdSchema,
  variantId: z.string(),
  message: z.string(),
});

// admin.product.updateVariant
export const updateVariantInputSchema = z.object({
  productId: productIdSchema,
  variantId: z.string(),
  variant: productVariantSchema.partial(),
});

export const updateVariantOutputSchema = z.object({
  productId: productIdSchema,
  variantId: z.string(),
  message: z.string(),
});
