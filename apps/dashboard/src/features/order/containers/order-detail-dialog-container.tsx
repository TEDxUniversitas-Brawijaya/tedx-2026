import { trpc } from "@/shared/lib/trpc";
import { OrderDetailDialogView } from "../components/order-detail/order-detail-dialog-view";
import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../stores/use-order-detail-store";
import { useQuery } from "@tanstack/react-query";
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
    return () => {
      clearOrderDetail();
    };
  }, [clearOrderDetail]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      clearOrderDetail();
    }
  };

  return (
    <OrderDetailDialogView
      canProcessRequestedRefund={canProcessRequestedRefund}
      canVerifyPayment={canVerifyPayment}
      errorMessage={detailQuery.error?.message ?? null}
      hasDetail={Boolean(detailQuery.data)}
      isLoading={detailQuery.isLoading}
      onOpenChange={handleOpenChange}
      open={open}
      orderId={orderId}
    />
  );
}
