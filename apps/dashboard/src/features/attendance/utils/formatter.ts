import type { AttendanceStatus, EventDay } from "../types/attendance";

export const eventDayLabelMap: Record<EventDay, string> = {
  propa3_day1: "Propa 3 Day 1",
  propa3_day2: "Propa 3 Day 2",
  main_event: "Main Event",
};

export const attendanceStatusLabelMap: Record<AttendanceStatus, string> = {
  not_checked_in: "Not Checked In",
  checked_in: "Checked In",
};

export function formatAttendanceDate(date: string | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
