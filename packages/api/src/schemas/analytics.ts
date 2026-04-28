import { z } from "zod";

// admin.analytics.dashboard
export const getDashboardAnalyticsInputSchema = z.object({});

export const getDashboardAnalyticsOutputSchema = z.object({
  pendingVerificationsCount: z.number().int(),
  refundRequestedCount: z.number().int(),
  ticketProducts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      stock: z.number().int().nullable(),
      isActive: z.boolean(),
      quantitySold: z.number().int(),
      soldPlusRemaining: z.number().int().nullable(),
    })
  ),
  merchProducts: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      quantitySold: z.number().int(),
      unpickedUpQuantity: z.number().int(),
    })
  ),
});

// admin.export.csv
export const exportCSVInputSchema = z.object({
  entity: z.enum([
    "orders",
    "tickets",
    "merch-orders",
    "refunds",
    "attendance",
    "merch-pickups",
  ]),
});

export const exportCSVOutputSchema = z.object({
  csv: z.string(),
  filename: z.string(),
});
