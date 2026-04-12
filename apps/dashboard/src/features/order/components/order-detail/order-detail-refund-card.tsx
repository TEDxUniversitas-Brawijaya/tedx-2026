import { Badge } from "@tedx-2026/ui/components/badge";
import type { DetailOrder } from "../../types/order";
import { formatDate } from "../../utils/formatter";
import { orderRefundStatusBadgeVariantMap } from "../../utils/variant-mapper";

type OrderDetailRefundCardProps = {
  refund: NonNullable<DetailOrder["refund"]>;
};

export function OrderDetailRefundCard({ refund }: OrderDetailRefundCardProps) {
  return (
    <div className="space-y-3 rounded-lg border p-4" id="order-detail-refund">
      <h3 className="font-semibold">Refund</h3>
      <div className="grid gap-2 md:grid-cols-2">
        <p>
          <span className="font-medium">Refund ID:</span> {refund.id}
        </p>
        <p>
          <span className="font-medium">Refund Status:</span>{" "}
          <Badge variant={orderRefundStatusBadgeVariantMap[refund.status]}>
            {refund.status}
          </Badge>
        </p>
        <p>
          <span className="font-medium">Reason:</span> {refund.reason}
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {refund.paymentMethod}
        </p>
        <p>
          <span className="font-medium">Payment Proof:</span>{" "}
          {refund.paymentProofUrl ? (
            <a
              className="text-primary underline"
              href={refund.paymentProofUrl}
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
          {refund.bankAccountNumber}
        </p>
        <p>
          <span className="font-medium">Bank Name:</span> {refund.bankName}
        </p>
        <p>
          <span className="font-medium">Bank Account Holder:</span>{" "}
          {refund.bankAccountHolder}
        </p>
        <p>
          <span className="font-medium">Processed By:</span>{" "}
          {refund.processedBy ?? "-"}
        </p>
        <p>
          <span className="font-medium">Processed At:</span>{" "}
          {formatDate(refund.processedAt)}
        </p>
        <p>
          <span className="font-medium">Rejection Reason:</span>{" "}
          {refund.rejectionReason ?? "-"}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {formatDate(refund.createdAt)}
        </p>
      </div>
    </div>
  );
}
