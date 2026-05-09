export type EventDay = "propa3_day1" | "propa3_day2" | "main_event";

export type AttendanceStatus = "not_checked_in" | "checked_in";

export type AttendanceTicket = {
  id: string;
  qrCode: string;
  eventDay: EventDay;
  attendanceStatus: AttendanceStatus;
  checkedInAt: string | null;
  buyerName: string;
  buyerEmail: string;
  orderId: string;
};
