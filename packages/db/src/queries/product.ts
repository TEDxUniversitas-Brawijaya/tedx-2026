import { and, eq, inArray } from "drizzle-orm";
import type { DB } from "../db";
import { schema } from "../schemas";
import type { SelectProduct } from "../schemas/products";

export type ProductQueries = {
  getProducts: (opts?: {
    status?: "active" | "inactive" | "all";
    types?: SelectProduct["type"][];
  }) => Promise<SelectProduct[]>;
  getProductsByIds: (
    productIds: SelectProduct["id"][],
    opts?: { status?: "active" | "inactive" | "all" }
  ) => Promise<SelectProduct[]>;
};

export const createProductQueries = (db: DB): ProductQueries => ({
  getProducts: async (opts) => {
    const { status, types } = opts || {};

    const whereClause = and(
      status && status !== "all"
        ? eq(schema.productsTable.isActive, status === "active")
        : undefined,
      types && types.length > 0
        ? inArray(schema.productsTable.type, types)
        : undefined
    );

    return await db.query.productsTable.findMany({
      where: whereClause,
    });
  },
  getProductsByIds: async (productIds, opts) => {
    const { status } = opts || {};
    if (productIds.length === 0) {
      return [];
    }

    const whereClause = and(
      inArray(schema.productsTable.id, productIds),
      status && status !== "all"
        ? eq(schema.productsTable.isActive, status === "active")
        : undefined
    );

    return await db.query.productsTable.findMany({
      where: whereClause,
    });
  },
});
