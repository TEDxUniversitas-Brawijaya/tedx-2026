import type { OrderDetail } from "../types/order.types";
import { formatCurrency, formatDate } from "./order-management.utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";

type OrderDetailContentProps = {
  order: OrderDetail;
};

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className="space-y-4" id="order-detail-content">
      <div
        className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
        id="order-detail-buyer-info"
      >
        <p id="order-detail-buyer-name">
          <span className="font-medium" id="order-detail-buyer-name-label">
            Nama:
          </span>{" "}
          {order.buyerName}
        </p>
        <p id="order-detail-buyer-email">
          <span className="font-medium" id="order-detail-buyer-email-label">
            Email:
          </span>{" "}
          {order.buyerEmail}
        </p>
        <p id="order-detail-buyer-phone">
          <span className="font-medium" id="order-detail-buyer-phone-label">
            Phone:
          </span>{" "}
          {order.buyerPhone}
        </p>
        <p id="order-detail-buyer-college">
          <span className="font-medium" id="order-detail-buyer-college-label">
            Instansi:
          </span>{" "}
          {order.buyerCollege}
        </p>
      </div>

      <div className="rounded-lg border" id="order-detail-items">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Variants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell id={`order-detail-item-${item.id}-name`}>
                  {item.snapshotName}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-type`}>
                  {item.snapshotType}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-quantity`}>
                  {item.quantity}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-price`}>
                  {formatCurrency(item.snapshotPrice)}
                </TableCell>
                <TableCell>
                  <span id={`order-detail-item-${item.id}-variants`}>
                    {item.snapshotVariants?.length
                      ? item.snapshotVariants
                          .map((variant) => `${variant.type}: ${variant.label}`)
                          .join(", ")
                      : "-"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div
        className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
        id="order-detail-payment-info"
      >
        <p id="order-detail-payment-method">
          <span className="font-medium" id="order-detail-payment-method-label">
            Payment Method:
          </span>{" "}
          {order.paymentMethod ?? "-"}
        </p>
        <p id="order-detail-midtrans-order-id">
          <span
            className="font-medium"
            id="order-detail-midtrans-order-id-label"
          >
            Midtrans Order ID:
          </span>{" "}
          {order.midtransOrderId ?? "-"}
        </p>
        <p id="order-detail-created-at">
          <span className="font-medium" id="order-detail-created-at-label">
            Created:
          </span>{" "}
          {formatDate(order.createdAt)}
        </p>
        <p id="order-detail-paid-at">
          <span className="font-medium" id="order-detail-paid-at-label">
            Paid:
          </span>{" "}
          {formatDate(order.paidAt)}
        </p>
        <p id="order-detail-expires-at">
          <span className="font-medium" id="order-detail-expires-at-label">
            Expires:
          </span>{" "}
          {formatDate(order.expiresAt)}
        </p>
        <p id="order-detail-status">
          <span className="font-medium" id="order-detail-status-label">
            Status:
          </span>{" "}
          {order.status}
        </p>
      </div>
    </div>
  );
}
