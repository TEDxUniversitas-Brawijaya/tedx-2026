import { KEYS } from "../keys";
import type { KV } from "../kv";

export type OrderKVOperations = {
  setOrderExpiry: (
    orderId: string,
    expirationTtlSeconds: number
  ) => Promise<void>;
  deleteOrderExpiry: (orderId: string) => Promise<void>;
  setBuyerCooldown: (
    email: string,
    expirationTtlSeconds: number
  ) => Promise<void>;
  hasBuyerCooldown: (email: string) => Promise<boolean>;
};

export const createOrderKVOperations = (kv: KV): OrderKVOperations => ({
  setOrderExpiry: async (orderId, expirationTtlSeconds) => {
    await kv.set(KEYS.orderExpiry(orderId), "1", {
      expirationTtl: expirationTtlSeconds,
    });
  },

  deleteOrderExpiry: async (orderId) => {
    await kv.delete(KEYS.orderExpiry(orderId));
  },

  setBuyerCooldown: async (email, expirationTtlSeconds) => {
    await kv.set(KEYS.buyerCooldown(email), "1", {
      expirationTtl: expirationTtlSeconds,
    });
  },

  hasBuyerCooldown: async (email) => {
    const value = await kv.get(KEYS.buyerCooldown(email));
    return value !== null;
  },
});
