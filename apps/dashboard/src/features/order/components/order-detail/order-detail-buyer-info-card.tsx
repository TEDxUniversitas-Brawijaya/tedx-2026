import type { Order } from "../../types/order";

type OrderDetailBuyerInfoCardProps = {
  order: {
    buyer: Order["buyer"];
  };
};

export function OrderDetailBuyerInfoCard({
  order: { buyer },
}: OrderDetailBuyerInfoCardProps) {
  return (
    <div
      className="grid gap-2 rounded-lg border p-4 md:grid-cols-2"
      id="order-detail-buyer-info"
    >
      <p id="order-detail-buyer-name">
        <span className="font-medium" id="order-detail-buyer-name-label">
          Nama:
        </span>{" "}
        {buyer.name}
      </p>
      <p id="order-detail-buyer-email">
        <span className="font-medium" id="order-detail-buyer-email-label">
          Email:
        </span>{" "}
        {buyer.email}
      </p>
      <p id="order-detail-buyer-phone">
        <span className="font-medium" id="order-detail-buyer-phone-label">
          Phone:
        </span>{" "}
        {buyer.phone}
      </p>
      <p id="order-detail-buyer-college">
        <span className="font-medium" id="order-detail-buyer-college-label">
          Instansi:
        </span>{" "}
        {buyer.college}
      </p>
    </div>
  );
}
