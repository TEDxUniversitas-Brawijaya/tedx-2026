import { z } from "zod";
import {
  attendanceStatusSchema,
  eventDaySchema,
  isoDateStringSchema,
  paginationSchema,
  sortOrderSchema,
  ticketIdSchema,
} from "./common";

// admin.attendance.list
export const listAttendanceInputSchema = paginationSchema.extend({
  eventDay: eventDaySchema.optional(),
  status: attendanceStatusSchema.optional(),
  search: z.string().optional(),
  sortBy: z
    .enum(["checkedInAt", "buyerName", "eventDay"])
    .default("checkedInAt"),
  sortOrder: sortOrderSchema.default("desc"),
});

export const listAttendanceOutputSchema = z.object({
  tickets: z.array(
    z.object({
      id: ticketIdSchema,
      qrCode: z.string(),
      eventDay: eventDaySchema,
      attendanceStatus: attendanceStatusSchema,
      checkedInAt: isoDateStringSchema.nullable(),
      buyerName: z.string(),
      buyerEmail: z.email(),
      orderId: z.string(),
    })
  ),
  pagination: z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
});

// admin.attendance.checkIn
export const checkInInputSchema = z.object({
  qrCode: z.string(),
});

export const checkInOutputSchema = z.object({
  ticketId: ticketIdSchema,
  buyerName: z.string(),
  eventDay: eventDaySchema,
  status: z.literal("checked_in"),
  checkedInAt: isoDateStringSchema,
});

// admin.attendance.updateStatus
export const updateAttendanceStatusInputSchema = z.object({
  ticketId: ticketIdSchema,
  status: attendanceStatusSchema,
});

export const updateAttendanceStatusOutputSchema = z.object({
  ticketId: ticketIdSchema,
  status: attendanceStatusSchema,
  message: z.string(),
});
