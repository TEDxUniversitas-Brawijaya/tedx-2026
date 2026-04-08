import { z } from "zod";
import { eventDaySchema, isoDateStringSchema } from "./common";

// admin.analytics.dashboard
export const getDashboardAnalyticsInputSchema = z.object({});

export const getDashboardAnalyticsOutputSchema = z.object({
  totalRevenue: z.number().int(),
  totalOrders: z.number().int(),
  ticketsSold: z.number().int(),
  ticketsByType: z.object({
    propa3_day1: z.number().int(),
    propa3_day2: z.number().int(),
    main_event: z.number().int(),
    bundles: z.number().int(),
  }),
  merchOrders: z.number().int(),
  refundRate: z.number(),
  checkInRate: z.record(eventDaySchema, z.number()),
  revenueByDay: z.array(
    z.object({
      date: isoDateStringSchema,
      revenue: z.number().int(),
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
