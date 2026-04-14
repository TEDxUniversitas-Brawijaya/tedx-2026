import type { ConfigQueries } from "@tedx-2026/db";
import type { ConfigOperations } from "@tedx-2026/kv";
import type { BaseContext } from "../types";

export type ConfigServices = {
  /**
   * Get config value by key. It first checks KV for the value, if not found,
   * it falls back to DB and populates KV for future requests.
   * @param key - The config key to retrieve the value for. See docs/erd.md for available config keys.
   * @returns
   */
  getConfig: (key: string) => Promise<string | null>;
};

type CreateConfigServicesCtx = {
  configQueries: ConfigQueries;
  configOperations: ConfigOperations;
} & BaseContext;

export const createConfigServices = (
  ctx: CreateConfigServicesCtx
): ConfigServices => ({
  getConfig: async (key) => {
    const kvValue = await ctx.configOperations.getConfig(key);
    if (kvValue !== null) {
      return kvValue;
    }

    const dbConfig = await ctx.configQueries.getByKey(key);
    if (dbConfig) {
      ctx.waitUntil(ctx.configOperations.setConfig(key, dbConfig.value));
      return dbConfig.value;
    }

    return null;
  },
});
