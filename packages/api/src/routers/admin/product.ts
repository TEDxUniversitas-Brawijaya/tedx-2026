import { TRPCError } from "@trpc/server";
import {
  createVariantInputSchema,
  deleteProductInputSchema,
  listProductsInputSchema,
  listProductsOutputSchema,
  updateProductInputSchema,
  updateProductOutputSchema,
} from "../../schemas/product";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listProductsInputSchema)
  .output(listProductsOutputSchema)
  .query(async ({ ctx }) => {
    const products = await ctx.services.product.adminListTicketProducts();
    // TODO: property access required only for getting a ticket
    return products.map((product) => ({
      id: product.id,
      type: product.type,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      imageUrl: product.imageUrl ?? null,
      variants: product.variants ?? null,
      bundleItems: null, // not needed in admin list view
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  });

const update = protectedProcedure
  .input(updateProductInputSchema)
  .output(updateProductOutputSchema)
  .mutation(async ({ ctx, input }) => {
    await ctx.services.product.adminUpdateProduct(input.productId, {
      price: input.price,
      stock: input.stock,
    });

    return {
      productId: input.productId,
      message: "Product updated successfully",
    };
  });

const deleteProduct = protectedProcedure
  .input(deleteProductInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.delete
    // - Soft delete: set isActive = false
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.delete is not implemented yet",
    });
  });

const createVariant = protectedProcedure
  .input(createVariantInputSchema)
  .mutation(() => {
    // TODO: Implement admin.product.createVariant
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.product.createVariant is not implemented yet",
    });
  });

export const productRouter = createTRPCRouter({
  list,
  update,
  delete: deleteProduct,
  createVariant,
});
