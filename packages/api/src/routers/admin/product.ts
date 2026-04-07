import { TRPCError } from "@trpc/server";
import {
  createProductInputSchema,
  createVariantInputSchema,
  deleteProductInputSchema,
  listProductsInputSchema,
  updateProductInputSchema,
  updateVariantInputSchema,
} from "../../schemas/product";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure.input(listProductsInputSchema).query(() => {
  // TODO: Implement admin.product.list
  // - Apply type filter if provided
  // - Return all products with full details
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "admin.product.list is not implemented yet",
  });
});

const create = protectedProcedure
  .input(createProductInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.create
    // - Generate product ID with prod_ prefix
    // - Create product with provided details
    // - Return product ID and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.create is not implemented yet",
    });
  });

const update = protectedProcedure
  .input(updateProductInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.update
    // - Validate product exists
    // - Update product fields
    // - Return product ID and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.update is not implemented yet",
    });
  });

const deleteProduct = protectedProcedure
  .input(deleteProductInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.delete
    // - Soft delete: set isActive = false
    // - Return product ID and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.delete is not implemented yet",
    });
  });

const createVariant = protectedProcedure
  .input(createVariantInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.createVariant
    // - Validate product exists
    // - Add variant to product's variants array
    // - Return product ID, variant ID, and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.createVariant is not implemented yet",
    });
  });

const updateVariant = protectedProcedure
  .input(updateVariantInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.updateVariant
    // - Validate product and variant exist
    // - Update variant in product's variants array
    // - Return product ID, variant ID, and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.updateVariant is not implemented yet",
    });
  });

export const productRouter = createTRPCRouter({
  list,
  create,
  update,
  delete: deleteProduct,
  createVariant,
  updateVariant,
});
