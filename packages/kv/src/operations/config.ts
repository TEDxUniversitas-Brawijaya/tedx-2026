import { KEYS } from "../keys";
import type { KV } from "../kv";

export type ConfigOperations = {
  getConfig: (key: string) => Promise<string | null>;
  setConfig: (key: string, value: string) => Promise<void>;
};

export const createConfigOperations = (kv: KV): ConfigOperations => ({
  getConfig: async (key) => {
    return await kv.get(KEYS.config.key(key));
  },
  setConfig: async (key, value) => {
    await kv.set(KEYS.config.key(key), value);
  },
});
