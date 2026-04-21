import { TRPCError } from "@trpc/server";
import {
  createProductInputSchema,
  createProductOutputSchema,
  createVariantInputSchema,
  deleteProductInputSchema,
  listProductsInputSchema,
  listProductsOutputSchema,
  updateProductInputSchema,
  updateProductOutputSchema,
  updateVariantInputSchema,
} from "../../schemas/product";
import { createTRPCRouter, superadminOnlyProcedure } from "../../trpc";

const list = superadminOnlyProcedure
  .input(listProductsInputSchema)
  .output(listProductsOutputSchema)
  .query(async ({ ctx }) => {
    // for now we only wanna list ticket products in admin dashboard, so we can ignore the type input for now
    const products = await ctx.services.product.getTicketProducts({
      status: "all",
    });

    return products.map((product) => ({
      id: product.id,
      type: product.type,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      imageUrl: product.imageUrl ?? null,
      variants: null,
      bundleItems: null,
      createdAt: new Date(product.createdAt).toISOString(),
      updatedAt: new Date(product.updatedAt).toISOString(),
    }));
  });

const create = superadminOnlyProcedure
  .input(createProductInputSchema)
  .output(createProductOutputSchema)
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

const update = superadminOnlyProcedure
  .input(updateProductInputSchema)
  .output(updateProductOutputSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.services.product.updateProduct(input.productId, {
      price: input.price,
      stock: input.stock,
    });
  });

const deleteProduct = superadminOnlyProcedure
  .input(deleteProductInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.delete
    // - Soft delete: set isActive = false
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.delete is not implemented yet",
    });
  });

const createVariant = superadminOnlyProcedure
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

const updateVariant = superadminOnlyProcedure
  .input(updateVariantInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.updateVariant
    // - Validate product and variant exist
    // - Update variant in product's variants array
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
