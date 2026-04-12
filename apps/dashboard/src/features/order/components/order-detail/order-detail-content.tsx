import { OrderDetailBuyerInfoCard } from "./order-detail-buyer-info-card";
import { OrderDetailItemsCard } from "./order-detail-items-card";
import { OrderDetailPaymentInfoCard } from "./order-detail-payment-info-card";
import { OrderDetailRefundCard } from "./order-detail-refund-card";
import { OrderDetailTicketsCard } from "./order-detail-tickets-card";

export function OrderDetailContent() {
  return (
    <div className="space-y-4" id="order-detail-content">
      <OrderDetailPaymentInfoCard />
      <OrderDetailBuyerInfoCard />
      <OrderDetailItemsCard />
      <OrderDetailTicketsCard />
      <OrderDetailRefundCard />
    </div>
  );
}
