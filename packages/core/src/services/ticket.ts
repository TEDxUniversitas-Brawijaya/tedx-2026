import type { SelectTicket, TicketQueries } from "@tedx-2026/db";
import { createNanoId, createNanoIdWithPrefix } from "@tedx-2026/utils";
import { qrcodePNG } from "etiket/png";
import { AppError } from "../errors";
import type { BaseContext } from "../types";

type EventDay = SelectTicket["eventDay"];
type AttendanceStatus = SelectTicket["attendanceStatus"];

export type TicketServices = {
  createTickets: (
    tickets: {
      orderItemId: SelectTicket["orderItemId"];
      eventDay: EventDay;
    }[]
  ) => Promise<
    {
      id: SelectTicket["id"];
      qrCode: SelectTicket["qrCode"];
      qr: ArrayBuffer;
    }[]
  >;
  getAttendance: (opts: {
    page: number;
    limit: number;
    eventDay?: EventDay;
    status?: AttendanceStatus;
    search?: string;
    sortBy: "checkedInAt" | "buyerName" | "eventDay";
    sortOrder: "asc" | "desc";
  }) => ReturnType<TicketQueries["getAttendance"]>;
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

type CreateTicketServicesCtx = {
  ticketQueries: TicketQueries;
} & BaseContext;

export const createTicketServices = (
  ctx: CreateTicketServicesCtx
): TicketServices => ({
  createTickets: async (tickets) => {
    const ticketsToInsert = tickets.map((ticket) => {
      const id = createNanoIdWithPrefix("tkt");
      const qrCode = createNanoId();

      return {
        id,
        orderItemId: ticket.orderItemId,
        eventDay: ticket.eventDay,
        qrCode,
      };
    });

    await ctx.ticketQueries.createTickets(ticketsToInsert);

    const response = ticketsToInsert.map((ticket) => {
      const qrUint8Array = qrcodePNG(ticket.qrCode, {
        margin: 1,
      });

      const qrBuffer = new Uint8Array(qrUint8Array).buffer;

      return {
        id: ticket.id,
        qrCode: ticket.qrCode,
        qr: qrBuffer,
      };
    });

    return response;
  },

  getAttendance: async (opts) => {
    return await ctx.ticketQueries.getAttendance(opts);
  },

  checkIn: async (qrCode, adminUserId) => {
    const ticket = await ctx.ticketQueries.getAttendanceByQrCode(qrCode);
    if (!ticket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
        details: { qrCode },
      });
    }

    if (ticket.attendanceStatus === "checked_in") {
      throw new AppError("CONFLICT", "Ticket is already checked in", {
        details: { ticketId: ticket.id },
      });
    }

    const checkedInAt = new Date().toISOString();
    const updatedTicket = await ctx.ticketQueries.updateAttendance(
      ticket.id,
      "checked_in",
      adminUserId,
      checkedInAt
    );

    if (!updatedTicket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
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
    const ticket = await ctx.ticketQueries.getTicketById(ticketId);
    if (!ticket) {
      throw new AppError("NOT_FOUND", "Ticket not found", {
        details: { ticketId },
      });
    }

    const checkedInAt =
      status === "checked_in" ? new Date().toISOString() : null;
    const checkedInBy = status === "checked_in" ? adminUserId : null;
    const updatedTicket = await ctx.ticketQueries.updateAttendance(
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
