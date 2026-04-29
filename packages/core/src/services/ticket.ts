import type { TicketQueries } from "@tedx-2026/db";
import {
  createNanoId,
  createNanoIdWithPrefix,
  tryCatch,
} from "@tedx-2026/utils";
import { qrcodePNG } from "etiket/png";
import type { BaseContext } from "../types";
import type { ConfigServices } from "./config";

export type TicketServices = {
  createTickets: (
    tickets: {
      orderItemId: string;
      eventDay: "propa3_day1" | "propa3_day2" | "main_event";
    }[]
  ) => Promise<
    {
      id: string;
      qrCode: string;
      qr: ArrayBuffer;
    }[]
  >;
};

type CreateTicketServicesCtx = {
  configServices: ConfigServices;
  ticketQueries: TicketQueries;
} & BaseContext;

export const createTicketServices = (
  ctx: CreateTicketServicesCtx
): TicketServices => ({
  createTickets: async (tickets) => {
    const startTime = Date.now();
    const ticketsToInsert = tickets.map((ticket) => {
      const id = createNanoIdWithPrefix("ticket");
      const qrCode = createNanoId();

      return {
        id,
        orderItemId: ticket.orderItemId,
        eventDay: ticket.eventDay,
        qrCode,
      };
    });

    const { error } = await tryCatch(
      ctx.ticketQueries.createTickets(ticketsToInsert)
    );
    if (error) {
      ctx.logger.error("tickets.create_failed", {
        count: ticketsToInsert.length,
        orderItemIds: tickets.map((t) => t.orderItemId),
        error,
        durationMs: Date.now() - startTime,
      });
      throw error;
    }

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

    ctx.logger.info("tickets.created", {
      count: ticketsToInsert.length,
      ticketIds: ticketsToInsert.map((t) => t.id),
      orderItemIds: tickets.map((t) => t.orderItemId),
      eventDays: [...new Set(tickets.map((t) => t.eventDay))],
      durationMs: Date.now() - startTime,
    });

    return response;
  },
});
