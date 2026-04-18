import type { Product } from "@tedx-2026/types";
import { tryCatch } from "@tedx-2026/utils";
import { KEYS } from "../keys";
import type { KV } from "../kv";

export type ProductOperations = {
  getProducts: (
    key: "active" | "inactive" | "all"
  ) => Promise<Product[] | null>;
  setProducts: (
    key: "active" | "inactive" | "all",
    products: Product[],
    expirationTtlSeconds: number
  ) => Promise<void>;
  deleteProducts: (key: "active" | "inactive" | "all") => Promise<void>;
};

export const createProductOperations = (kv: KV): ProductOperations => ({
  getProducts: async (key) => {
    const cachedData = await kv.get(KEYS.product.merchs(key));

    if (!cachedData) {
      return null;
    }

    const { data: parsed, error } = await tryCatch(
      JSON.parse(cachedData) as Promise<
        (Omit<Product, "createdAt" | "updatedAt"> & {
          createdAt: string;
          updatedAt: string;
        })[]
      >
    );

    if (error) {
      // If parsing fails, invalidate cache
      await kv.delete(KEYS.product.merchs(key));
      return null;
    }

    return parsed.map((product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }));
  },

  setProducts: async (key, products, expirationTtlSeconds) => {
    const serialized = JSON.stringify(
      products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))
    );

    await kv.set(KEYS.product.merchs(key), serialized, {
      expirationTtl: expirationTtlSeconds,
    });
  },

  deleteProducts: async (key) => {
    await kv.delete(KEYS.product.merchs(key));
  },
});
