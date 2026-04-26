import { IconCircleCheck, IconUserCheck } from "@tabler/icons-react";
import { Badge } from "@tedx-2026/ui/components/badge";
import { Button } from "@tedx-2026/ui/components/button";
import { Switch } from "@tedx-2026/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import type { AttendanceStatus, AttendanceTicket } from "../types/attendance";
import {
  attendanceStatusLabelMap,
  eventDayLabelMap,
  formatAttendanceDate,
} from "../utils/formatter";

type AttendanceTableProps = {
  isUpdating: boolean;
  onCheckIn: (qrCode: string) => void;
  onUpdateStatus: (ticketId: string, status: AttendanceStatus) => void;
  tickets: AttendanceTicket[];
};

export function AttendanceTable({
  isUpdating,
  onCheckIn,
  onUpdateStatus,
  tickets,
}: AttendanceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border" id="attendance-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Buyer</TableHead>
            <TableHead>Event Day</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Checked In At</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 && (
            <TableRow>
              <TableCell className="h-20 text-center" colSpan={6}>
                No tickets found.
              </TableCell>
            </TableRow>
          )}

          {tickets.map((ticket) => {
            const checkedIn = ticket.attendanceStatus === "checked_in";

            return (
              <TableRow key={ticket.id}>
                <TableCell>
                  <div className="font-medium">{ticket.buyerName}</div>
                  <div className="text-muted-foreground text-xs">
                    {ticket.buyerEmail}
                  </div>
                </TableCell>
                <TableCell>{eventDayLabelMap[ticket.eventDay]}</TableCell>
                <TableCell>
                  <Badge variant={checkedIn ? "default" : "outline"}>
                    {checkedIn && <IconCircleCheck />}
                    {attendanceStatusLabelMap[ticket.attendanceStatus]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatAttendanceDate(ticket.checkedInAt)}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {ticket.orderId}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    {!checkedIn && (
                      <Button
                        disabled={isUpdating}
                        onClick={() => onCheckIn(ticket.qrCode)}
                        size="sm"
                      >
                        <IconUserCheck /> Check In
                      </Button>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Override
                      </span>
                      <Switch
                        aria-label={`Override check-in status for ${ticket.buyerName} (${eventDayLabelMap[ticket.eventDay]})`}
                        checked={checkedIn}
                        disabled={isUpdating}
                        onCheckedChange={(value) => {
                          onUpdateStatus(
                            ticket.id,
                            value ? "checked_in" : "not_checked_in"
                          );
                        }}
                        size="sm"
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
