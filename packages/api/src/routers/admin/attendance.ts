import { TRPCError } from "@trpc/server";
import {
  checkInInputSchema,
  listAttendanceInputSchema,
  updateAttendanceStatusInputSchema,
} from "../../schemas/attendance";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const list = protectedProcedure.input(listAttendanceInputSchema).query(() => {
  // TODO: Implement admin.attendance.list
  // - Apply filters: eventDay, status, search
  // - Apply sorting: sortBy, sortOrder
  // - Apply pagination: page, limit
  // - Return tickets with attendance info and pagination
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "admin.attendance.list is not implemented yet",
  });
});

const checkIn = protectedProcedure.input(checkInInputSchema).mutation(() => {
  // TODO: Implement admin.attendance.checkIn
  // - Validate QR code exists
  // - Check event day matches today (from config)
  // - Check not already checked in
  // - Update attendance status and timestamp
  // - Return ticket info and success message
  throw new TRPCError({
    code: "NOT_IMPLEMENTED",
    message: "admin.attendance.checkIn is not implemented yet",
  });
});

const updateStatus = protectedProcedure
  .input(updateAttendanceStatusInputSchema)
  .mutation(() => {
    // TODO: Implement admin.attendance.updateStatus
    // - Validate ticket exists
    // - Update attendance status (admin override)
    // - Return ticket ID, status, and success message
    throw new TRPCError({
      code: "NOT_IMPLEMENTED",
      message: "admin.attendance.updateStatus is not implemented yet",
    });
  });

export const attendanceRouter = createTRPCRouter({
  list,
  checkIn,
  updateStatus,
});
