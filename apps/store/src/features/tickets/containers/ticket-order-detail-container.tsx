// Order detail container: connects order detail dialog visibility and selected order data.
import { TicketOrderDetailDialog } from "../components/ticket-order-detail-dialog";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

export const TicketOrderDetailContainer = () => {
  const {
    isOrderDetailOpen,
    closeOrderDetail,
    order,
    selectedProduct,
    quantity,
    selectedBundleItemId,
    buyer,
  } = useTicketCheckoutStore();

  return (
    <TicketOrderDetailDialog
      buyer={buyer}
      isOpen={isOrderDetailOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeOrderDetail();
        }
      }}
      order={order}
      product={selectedProduct}
      quantity={quantity}
      selectedBundleItemId={selectedBundleItemId}
    />
  );
};
