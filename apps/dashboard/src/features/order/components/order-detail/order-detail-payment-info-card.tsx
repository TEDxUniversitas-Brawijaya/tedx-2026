import { Badge } from "@tedx-2026/ui/components/badge";
import type { DetailOrder } from "../../types/order";
import { formatCurrency, formatDate } from "../../utils/formatter";
import { orderStatusBadgeVariantMap } from "../../utils/variant-mapper";

type OrderDetailPaymentInfoCardProps = {
  order: DetailOrder;
};

export function OrderDetailPaymentInfoCard({
  order,
}: OrderDetailPaymentInfoCardProps) {
  return (
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
        <Badge variant={orderStatusBadgeVariantMap[order.status]}>
          {order.status}
        </Badge>
      </p>
      <p id="order-detail-midtrans-order-id">
        <span className="font-medium" id="order-detail-midtrans-order-id-label">
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
        <span className="font-medium" id="order-detail-rejection-reason-label">
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
  );
}
