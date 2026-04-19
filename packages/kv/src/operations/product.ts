import type { Product } from "@tedx-2026/types";
import { tryCatch } from "@tedx-2026/utils";
import { KEYS } from "../keys";
import type { KV } from "../kv";

export type ProductOperations = {
  getMerchProducts: (
    key: "active" | "inactive" | "all"
  ) => Promise<Product[] | null>;
  setMerchProducts: (
    key: "active" | "inactive" | "all",
    products: Product[],
    expirationTtlSeconds: number
  ) => Promise<void>;
  deleteMerchProducts: (key: "active" | "inactive" | "all") => Promise<void>;
  getTicketProducts: (
    key: "active" | "inactive" | "all"
  ) => Promise<Product[] | null>;
  setTicketProducts: (
    key: "active" | "inactive" | "all",
    products: Product[],
    expirationTtlSeconds: number
  ) => Promise<void>;
  deleteTicketProducts: (key: "active" | "inactive" | "all") => Promise<void>;
};

export const createProductOperations = (kv: KV): ProductOperations => ({
  getMerchProducts: async (key) => {
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

  setMerchProducts: async (key, products, expirationTtlSeconds) => {
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

  deleteMerchProducts: async (key) => {
    await kv.delete(KEYS.product.merchs(key));
  },

  getTicketProducts: async (key) => {
    const cachedData = await kv.get(KEYS.product.tickets(key));

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
      await kv.delete(KEYS.product.tickets(key));
      return null;
    }

    return parsed.map((product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }));
  },

  setTicketProducts: async (key, products, expirationTtlSeconds) => {
    const serialized = JSON.stringify(
      products.map((product) => ({
        ...product,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }))
    );

    await kv.set(KEYS.product.tickets(key), serialized, {
      expirationTtl: expirationTtlSeconds,
    });
  },

  deleteTicketProducts: async (key) => {
    await kv.delete(KEYS.product.tickets(key));
  },
});
