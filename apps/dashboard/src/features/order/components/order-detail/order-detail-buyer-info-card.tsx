type OrderDetailBuyerInfoCardProps = {
  order: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerCollege: string;
  };
};

export function OrderDetailBuyerInfoCard({
  order,
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
