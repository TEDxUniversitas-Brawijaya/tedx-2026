import {
  listMerchPickupInputSchema,
  listMerchPickupOutputSchema,
  markPickedUpInputSchema,
  markPickedUpOutputSchema,
} from "../../schemas/merch-pickup";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listMerchPickupInputSchema)
  .output(listMerchPickupOutputSchema)
  .query(async ({ ctx, input }) => {
    const { orders, meta } = await ctx.services.order.getMerchPickupList({
      page: input.page,
      limit: input.limit,
      status: input.status,
      search: input.search,
    });
    return {
      orders,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: meta.total,
        totalPages: Math.ceil(meta.total / input.limit),
      },
    };
  });

const markPickedUp = protectedProcedure
  .input(markPickedUpInputSchema)
  .output(markPickedUpOutputSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.services.order.markPickedUp(
      input.orderId,
      ctx.session.user.id
    );
  });

export const merchPickupRouter = createTRPCRouter({
  list,
  markPickedUp,
});
