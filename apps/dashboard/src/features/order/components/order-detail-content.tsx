import type { OrderDetail } from "../types/order";
import {
  formatCurrency,
  formatDate,
  refundStatusVariant,
  statusVariant,
} from "../utils/order-management.utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@tedx-2026/ui/components/table";

import { Badge } from "@tedx-2026/ui/components/badge";
type OrderDetailContentProps = {
  order: OrderDetail;
};

export function OrderDetailContent({ order }: OrderDetailContentProps) {
  return (
    <div className="space-y-4" id="order-detail-content">
      <div
        className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
        id="order-detail-payment-info"
      >
        <p id="order-detail-id">
          <span className="font-medium" id="order-detail-id-label">
            Order ID:
          </span>{" "}
          {order.id}
        </p>
        <p id="order-detail-type">
          <span className="font-medium" id="order-detail-type-label">
            Type:
          </span>{" "}
          {order.type}
        </p>
        <p id="order-detail-payment-method">
          <span className="font-medium" id="order-detail-payment-method-label">
            Payment Method:
          </span>{" "}
          {order.paymentMethod ?? "-"}
        </p>
        <p id="order-detail-status">
          <span className="font-medium" id="order-detail-status-label">
            Status:
          </span>{" "}
          <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
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
        <p id="order-detail-paid-at">
          <span className="font-medium" id="order-detail-paid-at-label">
            Paid:
          </span>{" "}
          {formatDate(order.paidAt)}
        </p>
        <p id="order-detail-total-price">
          <span className="font-medium" id="order-detail-total-price-label">
            Total Price:
          </span>{" "}
          {formatCurrency(order.totalPrice)}
        </p>
        <p id="order-detail-idempotency-key">
          <span className="font-medium" id="order-detail-idempotency-key-label">
            Idempotency Key:
          </span>{" "}
          {order.idempotencyKey ?? "-"}
        </p>
        <p id="order-detail-proof-image-url">
          <span className="font-medium" id="order-detail-proof-image-url-label">
            Payment Proof:
          </span>{" "}
          {order.proofImageUrl ? (
            <a
              className="text-primary underline"
              href={order.proofImageUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Open proof image
            </a>
          ) : (
            "-"
          )}
        </p>
        <p id="order-detail-created-at">
          <span className="font-medium" id="order-detail-created-at-label">
            Created:
          </span>{" "}
          {formatDate(order.createdAt)}
        </p>
        <p id="order-detail-updated-at">
          <span className="font-medium" id="order-detail-updated-at-label">
            Updated:
          </span>{" "}
          {formatDate(order.updatedAt)}
        </p>
        <p id="order-detail-expires-at">
          <span className="font-medium" id="order-detail-expires-at-label">
            Expires:
          </span>{" "}
          {formatDate(order.expiresAt)}
        </p>
        <p id="order-detail-verified-by">
          <span className="font-medium" id="order-detail-verified-by-label">
            Verified By:
          </span>{" "}
          {order.verifiedBy ?? "-"}
        </p>
        <p id="order-detail-verified-at">
          <span className="font-medium" id="order-detail-verified-at-label">
            Verified At:
          </span>{" "}
          {formatDate(order.verifiedAt)}
        </p>
        <p id="order-detail-rejection-reason">
          <span
            className="font-medium"
            id="order-detail-rejection-reason-label"
          >
            Payment Rejection Reason:
          </span>{" "}
          {order.rejectionReason ?? "-"}
        </p>
        <p id="order-detail-refund-token">
          <span className="font-medium" id="order-detail-refund-token-label">
            Refund Token:
          </span>{" "}
          {order.refundToken ?? "-"}
        </p>
        <p id="order-detail-picked-up-at">
          <span className="font-medium" id="order-detail-picked-up-at-label">
            Picked Up At:
          </span>{" "}
          {formatDate(order.pickedUpAt)}
        </p>
        <p id="order-detail-picked-up-by">
          <span className="font-medium" id="order-detail-picked-up-by-label">
            Picked Up By:
          </span>{" "}
          {order.pickedUpBy ?? "-"}
        </p>
      </div>
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
              <TableHead>Order Item ID</TableHead>
              <TableHead>Product ID</TableHead>
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
                <TableCell id={`order-detail-item-${item.id}-id`}>
                  {item.id}
                </TableCell>
                <TableCell id={`order-detail-item-${item.id}-product-id`}>
                  {item.productId}
                </TableCell>
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
        className="space-y-3 rounded-lg border p-4"
        id="order-detail-tickets"
      >
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

      <div className="space-y-3 rounded-lg border p-4" id="order-detail-refund">
        <h3 className="font-semibold">Refund</h3>
        {order.refund ? (
          <div className="grid gap-2 md:grid-cols-2">
            <p>
              <span className="font-medium">Refund ID:</span> {order.refund.id}
            </p>
            <p>
              <span className="font-medium">Refund Status:</span>{" "}
              <Badge variant={refundStatusVariant(order.refund.status)}>
                {order.refund.status}
              </Badge>
            </p>
            <p>
              <span className="font-medium">Reason:</span> {order.refund.reason}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {order.refund.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Payment Proof:</span>{" "}
              {order.refund.paymentProofUrl ? (
                <a
                  className="text-primary underline"
                  href={order.refund.paymentProofUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Open refund proof
                </a>
              ) : (
                "-"
              )}
            </p>
            <p>
              <span className="font-medium">Bank Account Number:</span>{" "}
              {order.refund.bankAccountNumber}
            </p>
            <p>
              <span className="font-medium">Bank Name:</span>{" "}
              {order.refund.bankName}
            </p>
            <p>
              <span className="font-medium">Bank Account Holder:</span>{" "}
              {order.refund.bankAccountHolder}
            </p>
            <p>
              <span className="font-medium">Processed By:</span>{" "}
              {order.refund.processedBy ?? "-"}
            </p>
            <p>
              <span className="font-medium">Processed At:</span>{" "}
              {formatDate(order.refund.processedAt)}
            </p>
            <p>
              <span className="font-medium">Rejection Reason:</span>{" "}
              {order.refund.rejectionReason ?? "-"}
            </p>
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {formatDate(order.refund.createdAt)}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">No refund request.</p>
        )}
      </div>
    </div>
  );
}
