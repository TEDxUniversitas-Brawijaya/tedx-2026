import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";

type OrderRefundActionsProps = {
  orderId: string;
};

export function OrderRefundActions({ orderId }: OrderRefundActionsProps) {
  const [isRejectingRefund, setIsRejectingRefund] = useState(false);
  const [refundRejectionReason, setRefundRejectionReason] = useState("");
  const [refundReasonError, setRefundReasonError] = useState<string | null>(
    null
  );

  const processRefundMutation = useMutation(
    trpc.admin.order.processRefund.mutationOptions()
  );

  const handleApproveRefund = () => {
    processRefundMutation.mutate(
      {
        action: "approve",
        orderId,
      },
      {
        onError: (error) => {
          toast.error("Failed to approve refund", {
            description: error.message,
          });
        },
        onSuccess: (updatedOrder) => {
          queryClient.setQueryData(
            trpc.admin.order.getById.queryKey({ orderId }),
            updatedOrder
          );

          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.list.queryKey(),
          });

          setIsRejectingRefund(false);
          setRefundReasonError(null);
          setRefundRejectionReason("");

          toast.success("Refund approved");
        },
      }
    );
  };

  const handleRejectRefund = () => {
    const trimmedReason = refundRejectionReason.trim();

    if (!trimmedReason) {
      setRefundReasonError("Rejection reason is required.");
      return;
    }

    processRefundMutation.mutate(
      {
        action: "reject",
        orderId,
        reason: trimmedReason,
      },
      {
        onError: (error) => {
          toast.error("Failed to reject refund", {
            description: error.message,
          });
        },
        onSuccess: (updatedOrder) => {
          queryClient.setQueryData(
            trpc.admin.order.getById.queryKey({ orderId }),
            updatedOrder
          );

          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.list.queryKey(),
          });

          setIsRejectingRefund(false);
          setRefundReasonError(null);
          setRefundRejectionReason("");

          toast.success("Refund rejected");
        },
      }
    );
  };

  return (
    <div className="space-y-3 rounded-lg border p-4" id="order-refund-actions">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={processRefundMutation.isPending}
          id="order-refund-approve-button"
          onClick={handleApproveRefund}
          type="button"
        >
          {processRefundMutation.isPending ? "Processing..." : "Approve Refund"}
        </Button>
        <Button
          disabled={processRefundMutation.isPending}
          id="order-refund-reject-button"
          onClick={() => {
            setIsRejectingRefund((previousValue) => !previousValue);
            setRefundReasonError(null);
          }}
          type="button"
          variant="destructive"
        >
          Reject Refund
        </Button>
      </div>

      {isRejectingRefund ? (
        <div className="space-y-2" id="order-refund-reject-form">
          <Textarea
            aria-invalid={Boolean(refundReasonError)}
            id="order-refund-rejection-reason"
            onChange={(event) => {
              setRefundRejectionReason(event.target.value);
              if (refundReasonError) {
                setRefundReasonError(null);
              }
            }}
            placeholder="Write the reason for rejecting this refund request"
            value={refundRejectionReason}
          />
          {refundReasonError ? (
            <p className="text-destructive text-sm">{refundReasonError}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={processRefundMutation.isPending}
              id="order-refund-submit-rejection"
              onClick={handleRejectRefund}
              type="button"
              variant="destructive"
            >
              {processRefundMutation.isPending
                ? "Processing..."
                : "Confirm Rejection"}
            </Button>
            <Button
              disabled={processRefundMutation.isPending}
              id="order-refund-cancel-rejection"
              onClick={() => {
                setIsRejectingRefund(false);
                setRefundReasonError(null);
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
