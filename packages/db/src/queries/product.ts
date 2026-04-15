import { and, eq, inArray } from "drizzle-orm";
import type { DB } from "../db";
import { schema } from "../schemas";
import type { SelectProduct } from "../schemas/products";

export type ProductQueries = {
  getProducts: (opts?: {
    isActive?: boolean;
    types?: SelectProduct["type"][];
  }) => Promise<SelectProduct[]>;
  getProductsByIds: (
    productIds: SelectProduct["id"][],
    opts?: { isActive?: boolean }
  ) => Promise<SelectProduct[]>;
};

export const createProductQueries = (db: DB): ProductQueries => ({
  getProducts: async (opts) => {
    const { isActive, types } = opts || {};

    return await db.query.productsTable.findMany({
      where: and(
        isActive !== undefined
          ? eq(schema.productsTable.isActive, isActive)
          : undefined,
        types !== undefined && types.length > 0
          ? inArray(schema.productsTable.type, types)
          : undefined
      ),
    });
  },
  getProductsByIds: async (productIds, opts) => {
    const { isActive } = opts || {};
    if (productIds.length === 0) {
      return [];
    }

    return await db.query.productsTable.findMany({
      where: and(
        inArray(schema.productsTable.id, productIds),
        isActive !== undefined
          ? eq(schema.productsTable.isActive, isActive)
          : undefined
      ),
    });
  },
});
