import {
  useOrderDetailStore,
  type OrderDetailStoreState,
} from "../../stores/use-order-detail-store";

export function OrderDetailBuyerInfoCard() {
  const order = useOrderDetailStore(
    (state: OrderDetailStoreState) => state.orderDetail
  );

  if (!order) {
    return null;
  }

  return (
    <div
      className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
      id="order-detail-buyer-info"
    >
      <p id="order-detail-buyer-name">
        <span className="font-medium" id="order-detail-buyer-name-label">
          Nama:
        </span>{" "}
        {order.buyerName}
      </p>
      <p id="order-detail-buyer-email">
        <span className="font-medium" id="order-detail-buyer-email-label">
          Email:
        </span>{" "}
        {order.buyerEmail}
      </p>
      <p id="order-detail-buyer-phone">
        <span className="font-medium" id="order-detail-buyer-phone-label">
          Phone:
        </span>{" "}
        {order.buyerPhone}
      </p>
      <p id="order-detail-buyer-college">
        <span className="font-medium" id="order-detail-buyer-college-label">
          Instansi:
        </span>{" "}
        {order.buyerCollege}
      </p>
    </div>
  );
}
