import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";

type OrderPaymentVerificationActionsProps = {
  orderId: string;
};

export function OrderPaymentVerificationActions({
  orderId,
}: OrderPaymentVerificationActionsProps) {
  const [isRejectingPayment, setIsRejectingPayment] = useState(false);
  const [paymentRejectionReason, setPaymentRejectionReason] = useState("");
  const [paymentReasonError, setPaymentReasonError] = useState<string | null>(
    null
  );

  const verifyPaymentMutation = useMutation(
    trpc.admin.order.verifyPayment.mutationOptions()
  );

  const handleApprovePayment = () => {
    verifyPaymentMutation.mutate(
      {
        action: "approve",
        orderId,
      },
      {
        onError: (error) => {
          toast.error("Failed to approve payment", {
            description: error.message,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.getById.queryKey({ orderId }),
          });

          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.list.queryKey(),
          });

          setIsRejectingPayment(false);
          setPaymentReasonError(null);
          setPaymentRejectionReason("");

          toast.success("Payment approved");
        },
      }
    );
  };

  const handleRejectPayment = () => {
    const trimmedReason = paymentRejectionReason.trim();

    if (!trimmedReason) {
      setPaymentReasonError("Rejection reason is required.");
      return;
    }

    verifyPaymentMutation.mutate(
      {
        action: "reject",
        orderId,
        reason: trimmedReason,
      },
      {
        onError: (error) => {
          toast.error("Failed to reject payment", {
            description: error.message,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.getById.queryKey({ orderId }),
          });

          queryClient.invalidateQueries({
            queryKey: trpc.admin.order.list.queryKey(),
          });

          setIsRejectingPayment(false);
          setPaymentReasonError(null);
          setPaymentRejectionReason("");

          toast.success("Payment rejected");
        },
      }
    );
  };

  return (
    <div className="space-y-3 rounded-lg border p-4" id="order-payment-actions">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={verifyPaymentMutation.isPending}
          id="order-payment-approve-button"
          onClick={handleApprovePayment}
          type="button"
        >
          {verifyPaymentMutation.isPending
            ? "Processing..."
            : "Approve Payment"}
        </Button>
        <Button
          disabled={verifyPaymentMutation.isPending}
          id="order-payment-reject-button"
          onClick={() => {
            setIsRejectingPayment((previousValue) => !previousValue);
            setPaymentReasonError(null);
          }}
          type="button"
          variant="destructive"
        >
          Reject Payment
        </Button>
      </div>

      {isRejectingPayment ? (
        <div className="space-y-2" id="order-payment-reject-form">
          <Textarea
            aria-invalid={Boolean(paymentReasonError)}
            id="order-payment-rejection-reason"
            onChange={(event) => {
              setPaymentRejectionReason(event.target.value);
              if (paymentReasonError) {
                setPaymentReasonError(null);
              }
            }}
            placeholder="Write the reason for rejecting this payment"
            value={paymentRejectionReason}
          />
          {paymentReasonError ? (
            <p className="text-destructive text-sm">{paymentReasonError}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={verifyPaymentMutation.isPending}
              id="order-payment-submit-rejection"
              onClick={handleRejectPayment}
              type="button"
              variant="destructive"
            >
              {verifyPaymentMutation.isPending
                ? "Processing..."
                : "Confirm Rejection"}
            </Button>
            <Button
              disabled={verifyPaymentMutation.isPending}
              id="order-payment-cancel-rejection"
              onClick={() => {
                setIsRejectingPayment(false);
                setPaymentReasonError(null);
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
