import { Badge } from "@tedx-2026/ui/components/badge";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";
import { OrderDetailDialogContainer } from "../containers/order-detail-dialog-content-container";
import type { Order } from "../types/order";
import { formatCurrency, formatDate } from "../utils/formatter";
import { orderStatusBadgeVariantMap } from "../utils/variant-mapper";

type OrdersTableProps = {
  orders: Order[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
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
          {orders.length === 0 && (
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
                <div id={`order-${order.id}-buyer-name`}>
                  {order.buyer.name}
                </div>
                <div
                  className="text-muted-foreground text-xs"
                  id={`order-${order.id}-buyer-email`}
                >
                  {order.buyer.email}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{order.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={orderStatusBadgeVariantMap[order.status]}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatDate(order.paidAt)}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger
                    render={<Button size="sm" variant="outline" />}
                  >
                    Detail
                  </DialogTrigger>
                  <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-6xl">
                    <OrderDetailDialogContainer orderId={order.id} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
