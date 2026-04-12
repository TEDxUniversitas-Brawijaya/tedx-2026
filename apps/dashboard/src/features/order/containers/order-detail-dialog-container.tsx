import { queryClient } from "@/shared/lib/query-client";
import { trpc } from "@/shared/lib/trpc";
import { OrderDetailContent } from "../components/order-detail-content";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { Textarea } from "@tedx-2026/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";

type OrderDetailDialogContainerProps = {
  orderId: string;
};

type ActionPanelProps = {
  orderId: string;
};

function PaymentVerificationActions({ orderId }: ActionPanelProps) {
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
        onSuccess: (updatedOrder) => {
          queryClient.setQueryData(
            trpc.admin.order.getById.queryKey({ orderId }),
            updatedOrder
          );

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
        onSuccess: (updatedOrder) => {
          queryClient.setQueryData(
            trpc.admin.order.getById.queryKey({ orderId }),
            updatedOrder
          );

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
            setIsRejectingPayment((prev) => !prev);
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

function RefundActions({ orderId }: ActionPanelProps) {
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
            setIsRejectingRefund((prev) => !prev);
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

export function OrderDetailDialogContainer({
  orderId,
}: OrderDetailDialogContainerProps) {
  const [open, setOpen] = useState(false);

  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({ orderId }),
    enabled: open,
  });

  const canProcessRequestedRefund =
    detailQuery.data?.refund?.status === "requested";
  const canVerifyPayment = detailQuery.data?.status === "pending_verification";

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <Button size="sm" variant="outline">
          Detail
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Order Detail</DialogTitle>
          <DialogDescription>
            Buyer info, snapshot items, payment details, and timestamps.
          </DialogDescription>
        </DialogHeader>

        {detailQuery.isLoading && (
          <div id="order-detail-loading">Loading detail...</div>
        )}
        {detailQuery.error && (
          <div className="text-destructive" id="order-detail-error">
            {detailQuery.error.message}
          </div>
        )}

        {detailQuery.data && <OrderDetailContent order={detailQuery.data} />}

        {canVerifyPayment ? (
          <PaymentVerificationActions orderId={orderId} />
        ) : null}

        {canProcessRequestedRefund ? <RefundActions orderId={orderId} /> : null}
      </DialogContent>
    </Dialog>
  );
}
