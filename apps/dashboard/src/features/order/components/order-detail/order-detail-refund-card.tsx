import { Badge } from "@tedx-2026/ui/components/badge";
import { formatDate, refundStatusVariant } from "../../utils/order-management";
import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../../stores/use-order-detail-store";

export function OrderDetailRefundCard() {
  const order = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.orderDetail
  );

  if (!order) {
    return null;
  }

  return (
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
  );
}
