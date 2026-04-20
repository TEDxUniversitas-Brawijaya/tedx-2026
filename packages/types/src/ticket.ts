import type { OrderItem } from "./order";

export type Ticket = {
  id: string;
  orderItemId: string;
  orderItem: OrderItem;
  qrCode: string;
  eventDay: "propa3_day1" | "propa3_day2" | "main_event";
  attendanceStatus: "not_checked_in" | "checked_in";
  checkedInAt: string | null; // ISO 8601
  checkedInBy: string | null; // userId
  checkedInByUser: {
    id: string;
    name: string;
  } | null;
  createdAt: string; // ISO 8601
};
