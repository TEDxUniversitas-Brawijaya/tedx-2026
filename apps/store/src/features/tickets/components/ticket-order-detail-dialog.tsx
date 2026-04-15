import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import { formatIdrCurrency } from "../lib/formatter";
import { useTicketCheckoutStore } from "../stores/use-ticket-checkout-store";

export const TicketOrderDetailDialog = () => {
  const {
    isOrderDetailOpen,
    closeOrderDetail,
    order,
    selectedProduct,
    quantity,
    selectedBundleItemId,
    buyer,
  } = useTicketCheckoutStore();

  if (!(order && selectedProduct && buyer)) {
    return null;
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          closeOrderDetail();
        }
      }}
      open={isOrderDetailOpen}
    >
      <DialogContent className="max-w-[90vw] rounded-3xl border-none bg-black p-6 text-white md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-serif-2 text-xl">
            Detail Pesanan
          </DialogTitle>
        </DialogHeader>

        <div
          className="space-y-4 font-sans-2 text-sm"
          id="ticket-order-detail-dialog"
        >
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p>Order ID: {order.orderId}</p>
            <p>Status: {order.status}</p>
            <p>Total: {formatIdrCurrency(order.totalPrice)}</p>
            <p>Kedaluwarsa: {new Date(order.expiresAt).toLocaleString()}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p>Produk: {selectedProduct.name}</p>
            <p>Jumlah: {quantity}</p>
            {selectedBundleItemId && (
              <p>Pilihan bundling: {selectedBundleItemId}</p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p>Nama: {buyer.buyerName}</p>
            <p>Email: {buyer.buyerEmail}</p>
            <p>Telepon: {buyer.phone}</p>
            <p>Instansi: {buyer.buyerInstansi}</p>
          </div>

          <Button
            className="w-full"
            onClick={closeOrderDetail}
            variant="store-primary"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
