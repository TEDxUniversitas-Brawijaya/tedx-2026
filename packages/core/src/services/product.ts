import type { ProductQueries } from "@tedx-2026/db";
import type { ProductOperations } from "@tedx-2026/kv";
import type { Product } from "@tedx-2026/types";
import type { BaseContext } from "../types";

export type ProductServices = {
  getMerchProducts: (opts?: {
    status?: "active" | "inactive" | "all";
  }) => Promise<Product[]>;
};

type CreateProductServicesCtx = {
  productQueries: ProductQueries;
  productOperations: ProductOperations;
} & BaseContext;

export const createProductServices = (
  ctx: CreateProductServicesCtx
): ProductServices => ({
  getMerchProducts: async (opts) => {
    // Use status directly for cache key, default to "all"
    const { status = "all" } = opts || {};

    // Check cache first
    const cachedProducts = await ctx.productOperations.getProducts(status);
    if (cachedProducts) {
      return cachedProducts;
    }

    // On cache miss, fetch from DB
    const products = await ctx.productQueries.getProducts({
      status,
      // we pass this because bundle merch products doesnt have ticket products
      types: ["merch_regular", "merch_bundle"],
    });

    const productMapById = new Map(
      products.map((product) => [product.id, product])
    );

    // group products by category
    // typeof products is hacky, we should declare entity type in packages/types
    const productsMapByCategory = new Map<string, typeof products>();
    for (const product of products) {
      if (product.category === null) {
        continue;
      }

      if (!productsMapByCategory.has(product.category)) {
        productsMapByCategory.set(product.category, []);
      }

      productsMapByCategory.get(product.category)?.push(product);
    }

    const response: Product[] = products.map((product) => {
      if (product.bundleItems === null) {
        return {
          ...product,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
          bundleItems: null,
        };
      }

      return {
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt),
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO - refactor this later
        bundleItems: product.bundleItems.map((bundleItem) => {
          if (bundleItem.type === "merchandise") {
            const products = productsMapByCategory.get(bundleItem.category);
            if (!products) {
              throw new Error(
                `No products found for category ${bundleItem.category}`
              );
            }
            return {
              ...bundleItem,
              products,
            };
          }

          if (bundleItem.type === "ticket") {
            const product = productMapById.get(bundleItem.productId);
            if (!product) {
              throw new Error(
                `Product with id ${bundleItem.productId} not found for bundle item`
              );
            }

            return {
              ...bundleItem,
              product,
            };
          }

          if (bundleItem.type === "selectable_item") {
            return {
              type: "selectable_item",
              // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO - refactor this later
              items: bundleItem.items.map((item) => {
                if (item.type === "ticket") {
                  const product = productMapById.get(item.productId);
                  if (!product) {
                    throw new Error(
                      `Product with id ${item.productId} not found for selectable item`
                    );
                  }

                  return {
                    ...item,
                    product,
                  };
                }

                if (item.type === "merchandise") {
                  const products = productsMapByCategory.get(item.category);
                  if (!products) {
                    throw new Error(
                      `No products found for category ${item.category} in selectable item`
                    );
                  }
                  return {
                    ...item,
                    products,
                  };
                }

                throw new Error(`Unknown selectable item type: ${item}`);
              }),
            };
          }

          if (bundleItem.type === "merchandise_product") {
            const product = productMapById.get(bundleItem.productId);
            if (!product) {
              throw new Error(
                `Product with id ${bundleItem.productId} not found for merchandise_product bundle item`
              );
            }

            return {
              ...bundleItem,
              product,
            };
          }

          throw new Error(`Unknown bundle item type: ${bundleItem}`);
        }),
      };
    });

    // Cache the response for 10 minutes (600 seconds)
    ctx.waitUntil(ctx.productOperations.setProducts(status, response, 60 * 10));

    return response;
  },
});
