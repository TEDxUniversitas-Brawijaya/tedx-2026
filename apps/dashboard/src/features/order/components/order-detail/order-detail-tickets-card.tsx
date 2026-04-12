import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import { formatDate } from "../../utils/order-management";
import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../../stores/use-order-detail-store";

export function OrderDetailTicketsCard() {
  const order = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.orderDetail
  );

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-lg border p-4" id="order-detail-tickets">
      <h3 className="font-semibold">Tickets</h3>
      {order.tickets?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead>Event Day</TableHead>
              <TableHead>Attendance Status</TableHead>
              <TableHead>Checked In At</TableHead>
              <TableHead>Checked In By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.qrCode}</TableCell>
                <TableCell>{ticket.eventDay}</TableCell>
                <TableCell>{ticket.attendanceStatus}</TableCell>
                <TableCell>{formatDate(ticket.checkedInAt)}</TableCell>
                <TableCell>{ticket.checkedInBy ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground">No ticket data.</p>
      )}
    </div>
  );
}
