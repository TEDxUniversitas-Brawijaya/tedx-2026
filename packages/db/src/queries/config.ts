import { eq } from "drizzle-orm";
import type { DB } from "../db";
import { configTable, type SelectConfig } from "../schemas/config";

export type ConfigQueries = {
  getByKey: (key: SelectConfig["key"]) => Promise<SelectConfig | null>;
};

export const createConfigQueries = (db: DB): ConfigQueries => ({
  getByKey: async (key) => {
    const config = await db.query.configTable.findFirst({
      where: eq(configTable.key, key),
    });

    return config ?? null;
  },
});
