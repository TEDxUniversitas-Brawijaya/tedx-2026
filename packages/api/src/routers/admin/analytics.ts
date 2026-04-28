import {
  getDashboardAnalyticsInputSchema,
  getDashboardAnalyticsOutputSchema,
} from "../../schemas/analytics";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const dashboard = protectedProcedure
  .input(getDashboardAnalyticsInputSchema)
  .output(getDashboardAnalyticsOutputSchema)
  .query(async ({ ctx }) => {
    const [pendingStats, ticketSales, merchSales, ticketProductsData] =
      await Promise.all([
        ctx.services.order.getDashboardPendingStats(),
        ctx.services.order.getSoldTicketsByProduct(),
        ctx.services.order.getSoldMerchByProduct(),
        ctx.services.product.getDashboardTicketProductStats(),
      ]);

    const soldMap = new Map(
      ticketSales.map((s) => [s.productId, s.quantitySold])
    );

    const ticketProducts = ticketProductsData.map((p) => {
      const quantitySold = soldMap.get(p.id) ?? 0;
      const soldPlusRemaining =
        p.stock !== null ? quantitySold + p.stock : null;
      return { ...p, quantitySold, soldPlusRemaining };
    });

    return {
      ...pendingStats,
      ticketProducts,
      merchProducts: merchSales,
    };
  });

export const analyticsRouter = createTRPCRouter({
  dashboard,
});
