import { TRPCError } from "@trpc/server";
import {
  getDashboardAnalyticsInputSchema,
  getDashboardAnalyticsOutputSchema,
} from "../../schemas/analytics";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const dashboard = protectedProcedure
  .input(getDashboardAnalyticsInputSchema)
  .output(getDashboardAnalyticsOutputSchema)
  .query(() => {
    // TODO: Implement admin.analytics.dashboard
    // - Calculate totalRevenue (sum of paid orders)
    // - Calculate totalOrders (count of all orders)
    // - Calculate ticketsSold (count of tickets)
    // - Calculate ticketsByType (breakdown by event day)
    // - Calculate merchOrders (count of merch orders)
    // - Calculate refundRate (refunded orders / total paid orders)
    // - Calculate checkInRate per event day (checked in / total tickets)
    // - Calculate revenueByDay (time series data)
    // - Return all analytics data
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.analytics.dashboard is not implemented yet",
    });
  });

export const analyticsRouter = createTRPCRouter({
  dashboard,
});
