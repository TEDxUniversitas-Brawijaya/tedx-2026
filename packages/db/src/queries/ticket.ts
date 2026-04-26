import { and, asc, desc, eq, like, or, sql, type SQL } from "drizzle-orm";
import type { DB } from "../db";
import { orderItemsTable, ordersTable } from "../schemas/orders";
import type { InsertTicket, SelectTicket } from "../schemas/tickets";
import { ticketsTable } from "../schemas/tickets";

type AttendanceStatus = SelectTicket["attendanceStatus"];
type EventDay = SelectTicket["eventDay"];

export type AttendanceRecord = {
  id: SelectTicket["id"];
  qrCode: SelectTicket["qrCode"];
  eventDay: EventDay;
  attendanceStatus: AttendanceStatus;
  checkedInAt: SelectTicket["checkedInAt"];
  buyerName: string;
  buyerEmail: string;
  orderId: string;
};

export type TicketQueries = {
  createTickets: (tickets: InsertTicket[]) => Promise<void>;
  getTicketsByOrderItemId: (orderItemId: string) => Promise<SelectTicket[]>;
  getAttendance: (opts: {
    page: number;
    limit: number;
    eventDay?: EventDay;
    status?: AttendanceStatus;
    search?: string;
    sortBy: "checkedInAt" | "buyerName" | "eventDay";
    sortOrder: "asc" | "desc";
  }) => Promise<{
    tickets: AttendanceRecord[];
    meta: {
      total: number;
    };
  }>;
  getAttendanceByQrCode: (
    qrCode: SelectTicket["qrCode"]
  ) => Promise<AttendanceRecord | null>;
  getTicketById: (ticketId: SelectTicket["id"]) => Promise<SelectTicket | null>;
  updateAttendance: (
    ticketId: SelectTicket["id"],
    status: AttendanceStatus,
    checkedInBy: string | null,
    checkedInAt: string | null,
    opts?: {
      onlyIfNotCheckedIn?: boolean;
    }
  ) => Promise<SelectTicket | null>;
};

const attendanceSelect = {
  id: sql<SelectTicket["id"]>`${ticketsTable.id}`.as("id"),
  qrCode: ticketsTable.qrCode,
  eventDay: ticketsTable.eventDay,
  attendanceStatus: ticketsTable.attendanceStatus,
  checkedInAt: ticketsTable.checkedInAt,
  buyerName: ordersTable.buyerName,
  buyerEmail: ordersTable.buyerEmail,
  orderId: sql<string>`${ordersTable.id}`.as("orderId"),
};

const getAttendanceWhereClause = (opts: {
  eventDay?: EventDay;
  status?: AttendanceStatus;
  search?: string;
}) => {
  const conditions: SQL[] = [];
  const normalizedSearch = opts.search?.trim();

  if (opts.eventDay) {
    conditions.push(eq(ticketsTable.eventDay, opts.eventDay));
  }

  if (opts.status) {
    conditions.push(eq(ticketsTable.attendanceStatus, opts.status));
  }

  if (normalizedSearch) {
    conditions.push(
      or(
        like(ordersTable.buyerName, `%${normalizedSearch}%`),
        like(ordersTable.buyerEmail, `%${normalizedSearch}%`)
      ) as SQL
    );
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
};

const getAttendanceOrderBy = (
  sortBy: "checkedInAt" | "buyerName" | "eventDay",
  sortOrder: "asc" | "desc"
) => {
  if (sortBy === "buyerName") {
    return sortOrder === "asc"
      ? asc(ordersTable.buyerName)
      : desc(ordersTable.buyerName);
  }

  if (sortBy === "eventDay") {
    return sortOrder === "asc"
      ? asc(ticketsTable.eventDay)
      : desc(ticketsTable.eventDay);
  }

  return sortOrder === "asc"
    ? asc(ticketsTable.checkedInAt)
    : desc(ticketsTable.checkedInAt);
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

  getAttendance: async (opts) => {
    const { page, limit, eventDay, status, search, sortBy, sortOrder } = opts;
    const offset = (page - 1) * limit;
    const whereClause = getAttendanceWhereClause({
      eventDay,
      status,
      search,
    });
    const orderBy = getAttendanceOrderBy(sortBy, sortOrder);

    const [countRecords, tickets] = await db.batch([
      db
        .select({ count: sql<number>`count(*)` })
        .from(ticketsTable)
        .innerJoin(
          orderItemsTable,
          eq(ticketsTable.orderItemId, orderItemsTable.id)
        )
        .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
        .where(whereClause),
      db
        .select(attendanceSelect)
        .from(ticketsTable)
        .innerJoin(
          orderItemsTable,
          eq(ticketsTable.orderItemId, orderItemsTable.id)
        )
        .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
    ]);

    return {
      tickets,
      meta: {
        total: countRecords[0]?.count ?? 0,
      },
    };
  },

  getAttendanceByQrCode: async (qrCode) => {
    const [ticket] = await db
      .select(attendanceSelect)
      .from(ticketsTable)
      .innerJoin(
        orderItemsTable,
        eq(ticketsTable.orderItemId, orderItemsTable.id)
      )
      .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(eq(ticketsTable.qrCode, qrCode))
      .limit(1);

    return ticket ?? null;
  },

  getTicketById: async (ticketId) => {
    const ticket = await db.query.ticketsTable.findFirst({
      where: eq(ticketsTable.id, ticketId),
    });

    return ticket ?? null;
  },

  updateAttendance: async (
    ticketId,
    status,
    checkedInBy,
    checkedInAt,
    opts
  ) => {
    const conditions = [eq(ticketsTable.id, ticketId)];

    if (opts?.onlyIfNotCheckedIn) {
      conditions.push(eq(ticketsTable.attendanceStatus, "not_checked_in"));
    }

    const [ticket] = await db
      .update(ticketsTable)
      .set({
        attendanceStatus: status,
        checkedInBy,
        checkedInAt,
      })
      .where(and(...conditions))
      .returning();

    return ticket ?? null;
  },
});
