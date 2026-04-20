import type { ProductQueries } from "@tedx-2026/db";
import type { ProductOperations } from "@tedx-2026/kv";
import type { Product } from "@tedx-2026/types";
import { AppError } from "../errors";
import type { BaseContext } from "../types";
import type { ConfigServices } from "./config";

export type ProductServices = {
  getMerchProducts: (opts?: {
    status?: "active" | "inactive" | "all";
  }) => Promise<Product[]>;
  getTicketProducts: (opts?: {
    status?: "active" | "inactive" | "all";
  }) => Promise<Product[]>;
};

type CreateProductServicesCtx = {
  productQueries: ProductQueries;
  productOperations: ProductOperations;

  configServices: ConfigServices;
} & BaseContext;

export const createProductServices = (
  ctx: CreateProductServicesCtx
): ProductServices => ({
  getMerchProducts: async (opts) => {
    // Use status directly for cache key, default to "all"
    const { status = "all" } = opts || {};

    // Check cache first
    const cachedProducts = await ctx.productOperations.getMerchProducts(status);
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
    ctx.waitUntil(
      ctx.productOperations.setMerchProducts(status, response, 60 * 10)
    );

    return response;
  },
  getTicketProducts: async (opts) => {
    // Use status directly for cache key, default to "all"
    const { status = "all" } = opts || {};

    // Check cache first
    const cachedProducts =
      await ctx.productOperations.getTicketProducts(status);
    if (cachedProducts) {
      return cachedProducts;
    }

    const [eventDatePropa3Day1, eventDatePropa3Day2, eventDateMain, products] =
      await Promise.all([
        ctx.configServices.getConfig("event_date_propa3_day1"),
        ctx.configServices.getConfig("event_date_propa3_day2"),
        ctx.configServices.getConfig("event_date_main"),
        ctx.productQueries.getProducts({
          status,
          // we pass this because bundle ticket products does have merch products
          types: ["merch_regular", "ticket_bundle", "ticket_regular"],
        }),
      ]);
    if (
      eventDatePropa3Day1 === null ||
      eventDatePropa3Day2 === null ||
      eventDateMain === null
    ) {
      throw new AppError(
        "INTERNAL_SERVER_ERROR",
        "Missing required configuration values"
      );
    }

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

    // TODO: hacky way to show the event date in frontend, we should have a better way to handle this
    const getEventDate = (productName: string) => {
      if (productName.toLowerCase().includes("propaganda 3 day 1")) {
        return new Date(eventDatePropa3Day1);
      }

      if (productName.toLowerCase().includes("propaganda 3 day 2")) {
        return new Date(eventDatePropa3Day2);
      }

      if (productName.toLowerCase().includes("main event")) {
        return new Date(eventDateMain);
      }
      return null;
    };

    const response: Product[] = products.map((product) => {
      if (product.bundleItems === null) {
        const eventDate = getEventDate(product.name);

        const eventHasPassed = eventDate ? new Date() > eventDate : false;

        return {
          ...product,
          isActive: eventHasPassed ? false : product.isActive, // if event date has passed, set isActive to false
          description: eventDate
            ? eventDate.toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : product.description,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
          bundleItems: null,
        };
      }

      // we need to find the minimum event stock among the bundle items to determine the stock of the bundle product
      const minEventStock = Math.min(
        ...product.bundleItems.map((bundleItem) => {
          // if bundle item is not a ticket, we can ignore the stock because it doesnt affect the stock of the bundle product
          if (bundleItem.type !== "ticket") {
            return Number.POSITIVE_INFINITY;
          }

          const product = productMapById.get(bundleItem.productId);
          if (product === undefined || product.stock === null) {
            throw new Error(
              `Product with id ${bundleItem.productId} not found or has no stock for bundle item`
            );
          }

          return product.stock;
        })
      );

      return {
        ...product,
        quantity: minEventStock,
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

            const eventDate = getEventDate(product.name);

            const eventHasPassed = eventDate ? new Date() > eventDate : false;

            return {
              ...bundleItem,
              product: {
                ...product,
                isActive: eventHasPassed ? false : product.isActive, // if event date has passed, set isActive to false
                description: eventDate
                  ? eventDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : product.description,
              },
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

    // Cache the response for 1 minutes (60 seconds)
    ctx.waitUntil(
      ctx.productOperations.setTicketProducts(status, response, 60)
    );

    return response;
  },
});
