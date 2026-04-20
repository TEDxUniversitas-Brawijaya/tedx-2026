import { and, eq, inArray, sql } from "drizzle-orm";
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
  batchDecrementProductStock: (
    operations: { productId: SelectProduct["id"]; quantity: number }[]
  ) => Promise<
    { productId: string; success: boolean; currentStock: number | null }[]
  >;
  batchIncrementProductStock: (
    operations: { productId: SelectProduct["id"]; quantity: number }[]
  ) => Promise<
    { productId: string; success: boolean; currentStock: number | null }[]
  >;
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

  batchDecrementProductStock: async (operations) => {
    if (operations.length === 0) {
      return [];
    }

    // Execute all decrements in parallel using db.batch
    const batchOperations = operations.map(({ productId, quantity }) =>
      db
        .update(schema.productsTable)
        .set({
          stock: sql`${schema.productsTable.stock} - ${quantity}`,
        })
        .where(
          and(
            eq(schema.productsTable.id, productId),
            sql`${schema.productsTable.stock} >= ${quantity}`,
            sql`${schema.productsTable.stock} IS NOT NULL`
          )
        )
        .returning({ stock: schema.productsTable.stock })
    );

    const results = await db.batch(
      batchOperations as [
        (typeof batchOperations)[0],
        ...typeof batchOperations,
      ]
    );

    // Map results back to operations
    return operations.map(({ productId }, index) => {
      const result = results[index];
      if (!result || result.length === 0) {
        return { productId, success: false, currentStock: null };
      }
      return {
        productId,
        success: true,
        currentStock: result[0]?.stock ?? null,
      };
    });
  },

  batchIncrementProductStock: async (operations) => {
    if (operations.length === 0) {
      return [];
    }

    // Execute all increments in parallel using db.batch
    const batchOperations = operations.map(({ productId, quantity }) =>
      db
        .update(schema.productsTable)
        .set({
          stock: sql`${schema.productsTable.stock} + ${quantity}`,
        })
        .where(
          and(
            eq(schema.productsTable.id, productId),
            sql`${schema.productsTable.stock} IS NOT NULL`
          )
        )
        .returning({ stock: schema.productsTable.stock })
    );

    const results = await db.batch(
      batchOperations as [
        (typeof batchOperations)[0],
        ...typeof batchOperations,
      ]
    );

    // Map results back to operations
    return operations.map(({ productId }, index) => {
      const result = results[index];
      if (!result || result.length === 0) {
        return { productId, success: false, currentStock: null };
      }
      return {
        productId,
        success: true,
        currentStock: result[0]?.stock ?? null,
      };
    });
  },
});
