import { eq } from "drizzle-orm";
import type { InsertTicket, SelectTicket } from "../schemas/tickets";
import { ticketsTable } from "../schemas/tickets";
import type { DB } from "../db";

export type TicketQueries = {
  createTickets: (tickets: InsertTicket[]) => Promise<void>;
  getTicketsByOrderItemId: (orderItemId: string) => Promise<SelectTicket[]>;
};

export const createTicketQueries = (db: DB): TicketQueries => ({
  createTickets: async (tickets) => {
    if (tickets.length === 0) {
      return;
    }

    await db.insert(ticketsTable).values(tickets);
  },

  getTicketsByOrderItemId: async (orderItemId) => {
    return await db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.orderItemId, orderItemId));
  },
});
