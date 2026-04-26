import {
  checkInInputSchema,
  checkInOutputSchema,
  listAttendanceInputSchema,
  listAttendanceOutputSchema,
  updateAttendanceStatusInputSchema,
  updateAttendanceStatusOutputSchema,
} from "../../schemas/attendance";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure
  .input(listAttendanceInputSchema)
  .output(listAttendanceOutputSchema)
  .query(async ({ ctx, input }) => {
    const { tickets, meta } = await ctx.services.ticket.getAttendance({
      page: input.page,
      limit: input.limit,
      eventDay: input.eventDay,
      status: input.status,
      search: input.search,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
    });

    return {
      tickets,
      pagination: {
        page: input.page,
        limit: input.limit,
        total: meta.total,
        totalPages: Math.ceil(meta.total / input.limit),
      },
    };
  });

const checkIn = protectedProcedure
  .input(checkInInputSchema)
  .output(checkInOutputSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.services.ticket.checkIn(input.qrCode, ctx.session.user.id);
  });

const updateStatus = protectedProcedure
  .input(updateAttendanceStatusInputSchema)
  .output(updateAttendanceStatusOutputSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.services.ticket.updateStatus(
      input.ticketId,
      input.status,
      ctx.session.user.id
    );
  });

export const attendanceRouter = createTRPCRouter({
  list,
  checkIn,
  updateStatus,
});
