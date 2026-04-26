import type { AttendanceQueries, SelectTicket } from "@tedx-2026/db";
import { AppError } from "../errors";
import type { BaseContext } from "../types";
import type { ConfigServices } from "./config";

type EventDay = SelectTicket["eventDay"];
type AttendanceStatus = SelectTicket["attendanceStatus"];

// Maps each event day enum to its corresponding config key.
const EVENT_DAY_CONFIG_KEYS: Record<EventDay, string> = {
  propa3_day1: "event_date_propa3_day1",
  propa3_day2: "event_date_propa3_day2",
  main_event: "event_date_main",
};

// Returns the current date in Asia/Jakarta as YYYY-MM-DD.
const getJakartaDate = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!(year && month && day)) {
    throw new AppError("INTERNAL_SERVER_ERROR", "Failed to determine today");
  }

  return `${year}-${month}-${day}`;
};

// Public contract for attendance-related business operations.
export type AttendanceServices = {
  getAttendance: (opts: {
    page: number;
    limit: number;
    eventDay?: EventDay;
    status?: AttendanceStatus;
    search?: string;
    sortBy: "checkedInAt" | "buyerName" | "eventDay";
    sortOrder: "asc" | "desc";
  }) => Promise<{
    tickets: Awaited<ReturnType<AttendanceQueries["getAttendance"]>>["tickets"];
    meta: {
      total: number;
    };
  }>;
  checkIn: (
    qrCode: string,
    adminUserId: string
  ) => Promise<{
    ticketId: string;
    buyerName: string;
    eventDay: EventDay;
    status: "checked_in";
    checkedInAt: string;
  }>;
  updateStatus: (
    ticketId: string,
    status: AttendanceStatus,
    adminUserId: string
  ) => Promise<{
    ticketId: string;
    status: AttendanceStatus;
    message: string;
  }>;
};

// Dependencies required to construct attendance services.
type CreateAttendanceServicesCtx = {
  attendanceQueries: AttendanceQueries;
  configServices: ConfigServices;
} & BaseContext;

// Resolves today's active event day by matching configured event dates.
const resolveCurrentEventDay = async (
  configServices: ConfigServices
): Promise<EventDay | null> => {
  const today = getJakartaDate();
  const configEntries = await Promise.all(
    Object.entries(EVENT_DAY_CONFIG_KEYS).map(
      async ([eventDay, configKey]) => ({
        eventDay: eventDay as EventDay,
        value: await configServices.getConfig(configKey),
      })
    )
  );
  const matchingConfig = configEntries.find(({ value }) => value === today);

  return matchingConfig?.eventDay ?? null;
};

// Creates attendance services backed by query and config dependencies.
export const createAttendanceServices = (
  ctx: CreateAttendanceServicesCtx
): AttendanceServices => ({
  getAttendance: async (opts) => {
    return await ctx.attendanceQueries.getAttendance(opts);
  },

  checkIn: async (qrCode, adminUserId) => {
    const ticket = await ctx.attendanceQueries.getAttendanceByQrCode(qrCode);
    if (!ticket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
        details: { qrCode },
      });
    }

    const currentEventDay = await resolveCurrentEventDay(ctx.configServices);
    if (!currentEventDay) {
      throw new AppError(
        "BAD_REQUEST",
        "Today does not match any configured event day"
      );
    }

    if (ticket.eventDay !== currentEventDay) {
      throw new AppError(
        "BAD_REQUEST",
        "Ticket is not valid for today's event day",
        {
          details: {
            ticketEventDay: ticket.eventDay,
            currentEventDay,
          },
        }
      );
    }

    if (ticket.attendanceStatus === "checked_in") {
      throw new AppError("CONFLICT", "Ticket is already checked in", {
        details: { ticketId: ticket.id },
      });
    }

    const checkedInAt = new Date().toISOString();
    const updatedTicket = await ctx.attendanceQueries.checkInTicket(
      ticket.id,
      adminUserId,
      checkedInAt
    );

    if (!updatedTicket) {
      throw new AppError("CONFLICT", "Ticket is already checked in", {
        details: { ticketId: ticket.id },
      });
    }

    return {
      ticketId: ticket.id,
      buyerName: ticket.buyerName,
      eventDay: ticket.eventDay,
      status: "checked_in",
      checkedInAt,
    };
  },

  updateStatus: async (ticketId, status, adminUserId) => {
    const ticket = await ctx.attendanceQueries.getTicketById(ticketId);
    if (!ticket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
        details: { ticketId },
      });
    }

    const checkedInAt =
      status === "checked_in" ? new Date().toISOString() : null;
    const checkedInBy = status === "checked_in" ? adminUserId : null;
    const updatedTicket = await ctx.attendanceQueries.updateAttendanceStatus(
      ticketId,
      status,
      checkedInBy,
      checkedInAt
    );

    if (!updatedTicket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
        details: { ticketId },
      });
    }

    return {
      ticketId,
      status: updatedTicket.attendanceStatus,
      message:
        status === "checked_in"
          ? "Ticket checked in"
          : "Ticket check-in removed",
    };
  },
});
