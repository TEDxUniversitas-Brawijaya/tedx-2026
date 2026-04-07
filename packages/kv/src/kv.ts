import type { KVNamespace } from "@cloudflare/workers-types";

type KVSetOptions = {
  /**
   * The time to live (TTL) for the key, in seconds. After this time, the key will be automatically deleted from the KV store.
   * @remarks Expiration targets that are less than 60 seconds into the future are not supported. This is true for both expiration methods.
   */
  expirationTtl?: number;
};

export type KV = {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: KVSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
};

export const createKV = (kv: KVNamespace): KV => ({
  get: async (key) => await kv.get(key),
  set: async (key, value, options = {}) =>
    await kv.put(key, value, {
      expirationTtl: options.expirationTtl,
    }),
  delete: async (key) => await kv.delete(key),
});

export type KVNamespaceType = KVNamespace;
