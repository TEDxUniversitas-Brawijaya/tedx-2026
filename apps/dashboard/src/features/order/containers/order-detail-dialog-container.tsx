import { trpc } from "@/shared/lib/trpc";
import { OrderDetailContent } from "../components/order-detail-content";
import { OrderPaymentVerificationActions } from "../components/order-payment-verification-actions";
import { OrderRefundActions } from "../components/order-refund-actions";
import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../stores/use-order-detail-store";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { useEffect, useState } from "react";

type OrderDetailDialogContainerProps = {
  orderId: string;
};

export function OrderDetailDialogContainer({
  orderId,
}: OrderDetailDialogContainerProps) {
  const [open, setOpen] = useState(false);
  const clearOrderDetail = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.clearOrderDetail
  );
  const setOrderDetail = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.setOrderDetail
  );

  const detailQuery = useQuery({
    ...trpc.admin.order.getById.queryOptions({ orderId }),
    enabled: open,
  });

  const canProcessRequestedRefund =
    detailQuery.data?.refund?.status === "requested";
  const canVerifyPayment = detailQuery.data?.status === "pending_verification";

  useEffect(() => {
    if (detailQuery.data) {
      setOrderDetail(detailQuery.data);
    }
  }, [detailQuery.data, setOrderDetail]);

  useEffect(() => {
    if (!open) {
      clearOrderDetail();
    }
  }, [open, clearOrderDetail]);

  useEffect(() => {
    return () => {
      clearOrderDetail();
    };
  }, [clearOrderDetail]);

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

        {detailQuery.data && <OrderDetailContent />}

        {canVerifyPayment ? (
          <OrderPaymentVerificationActions orderId={orderId} />
        ) : null}

        {canProcessRequestedRefund ? (
          <OrderRefundActions orderId={orderId} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
