import type { ListOrder } from "../types/order.types";
import {
  formatCurrency,
  formatDate,
  statusVariant,
} from "./order-management.utils";
import { Badge } from "@tedx-2026/ui/components/badge";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";

type OrdersTableProps = {
  isLoading: boolean;
  onOpenDetail: (orderId: string) => void;
  orders: ListOrder[];
};

export function OrdersTable({
  isLoading,
  onOpenDetail,
  orders,
}: OrdersTableProps) {
  return (
    <div className="rounded-xl border" id="order-management-table-wrapper">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Paid At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell className="h-16 text-center" colSpan={8}>
                Loading orders...
              </TableCell>
            </TableRow>
          )}

          {!isLoading && orders.length === 0 && (
            <TableRow>
              <TableCell className="h-16 text-center" colSpan={8}>
                No orders found.
              </TableCell>
            </TableRow>
          )}

          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div id={`order-${order.id}-buyer-name`}>{order.buyerName}</div>
                <div
                  className="text-muted-foreground text-xs"
                  id={`order-${order.id}-buyer-email`}
                >
                  {order.buyerEmail}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatDate(order.paidAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  onClick={() => onOpenDetail(order.id)}
                  size="sm"
                  variant="outline"
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
