import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { configTable, type SelectConfig } from "../schemas/config";

export type ConfigQueries = {
  getByKey: (key: string) => Promise<SelectConfig | null>;
  getPaymentMode: () => Promise<"midtrans" | "manual">;
  getMerchPreorderDeadline: () => Promise<string | null>;
  getPaymentTimeoutMinutes: () => Promise<number>;
};

export const createConfigQueries = (db: DB): ConfigQueries => ({
  getByKey: async (key) => {
    const config = await db.query.configTable.findFirst({
      where: eq(configTable.key, key),
    });

    return config ?? null;
  },

  getPaymentMode: async () => {
    const config = await db.query.configTable.findFirst({
      where: eq(configTable.key, "payment_mode"),
    });

    if (config?.value === "midtrans") {
      return "midtrans";
    }

    return "manual";
  },

  getMerchPreorderDeadline: async () => {
    const config = await db.query.configTable.findFirst({
      where: eq(configTable.key, "merch_preorder_deadline"),
    });

    return config?.value ?? null;
  },

  getPaymentTimeoutMinutes: async () => {
    const config = await db.query.configTable.findFirst({
      where: eq(configTable.key, "payment_timeout_minutes"),
    });

    const timeout = Number(config?.value);
    return Number.isFinite(timeout) && timeout > 0 ? timeout : 20;
  },
});
