import { KEYS } from "../keys";
import type { KV } from "../kv";

export type OrderOperations = {
  setBuyerCooldown: (
    email: string,
    expirationTtlSeconds: number
  ) => Promise<void>;
  getBuyerCooldown: (email: string) => Promise<boolean>;
  setOrderResponse: (
    idempotencyKey: string,
    // TODO: its already stringified when set in kv, consider changing to object and stringify inside the function
    orderResponse: string,
    expirationTtlSeconds: number
  ) => Promise<void>;
  getOrderResponse: (idempotencyKey: string) => Promise<string | null>;
  updateStockCache: (productId: string, newStock: number) => Promise<void>;
};

export const createOrderOperations = (kv: KV): OrderOperations => ({
  setBuyerCooldown: async (email, expirationTtlSeconds) => {
    await kv.set(KEYS.order.buyerCooldown(email), "1", {
      expirationTtl: expirationTtlSeconds,
    });
  },

  getBuyerCooldown: async (email) => {
    const value = await kv.get(KEYS.order.buyerCooldown(email));
    return value === "1";
  },

  setOrderResponse: async (
    idempotencyKey,
    orderResponse,
    expirationTtlSeconds
  ) => {
    await kv.set(KEYS.order.idempotencyKey(idempotencyKey), orderResponse, {
      expirationTtl: expirationTtlSeconds,
    });
  },

  getOrderResponse: async (idempotencyKey) => {
    const orderJson = await kv.get(KEYS.order.idempotencyKey(idempotencyKey));
    return orderJson;
  },

  updateStockCache: async (productId, newStock) => {
    await kv.set(KEYS.order.stock(productId), String(newStock));
  },
});
