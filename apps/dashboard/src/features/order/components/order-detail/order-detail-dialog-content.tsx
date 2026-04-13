import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import type { DetailOrder } from "../../types/order";
import { OrderPaymentVerificationActions } from "../order-payment-verification-actions";
import { OrderRefundActions } from "../order-refund-actions";
import { OrderDetailBuyerInfoCard } from "./order-detail-buyer-info-card";
import { OrderDetailItemsCard } from "./order-detail-items-card";
import { OrderDetailPaymentInfoCard } from "./order-detail-payment-info-card";
import { OrderDetailRefundCard } from "./order-detail-refund-card";
import { OrderDetailTicketsCard } from "./order-detail-tickets-card";

type OrderDetailDialogContentProps = {
  order: DetailOrder;
};

export const OrderDetailDialogContent = ({
  order,
}: OrderDetailDialogContentProps) => {
  const canVerifyPayment = order.status === "pending_verification";
  const canProcessRequestedRefund = order.status === "refund_requested";

  return (
    <>
      <DialogHeader>
        <DialogTitle>Order Detail</DialogTitle>
        <DialogDescription>
          Buyer info, snapshot items, payment details, and timestamps.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4" id="order-detail-content">
        <OrderDetailPaymentInfoCard order={order} />
        <OrderDetailBuyerInfoCard order={order} />
        <OrderDetailItemsCard items={order.items} />
        {order.tickets && <OrderDetailTicketsCard tickets={order.tickets} />}
        {order.refund && <OrderDetailRefundCard refund={order.refund} />}
      </div>

      {canVerifyPayment && (
        <OrderPaymentVerificationActions orderId={order.id} />
      )}

      {canProcessRequestedRefund && <OrderRefundActions orderId={order.id} />}
    </>
  );
};
