import Chandelier from "@/assets/imgs/chandelier-1.png";
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
      <DialogContent className="max-h-[92vh] max-w-[90%] overflow-hidden rounded-3xl border-none bg-black p-0 text-white shadow-[0_0_100px_2px_rgba(255,149,0,0.25)] *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white md:w-full md:max-w-lg">
        <img
          alt="chandelier"
          aria-hidden="true"
          className="pointer-events-none absolute -top-15 -right-15 z-1 w-44 opacity-30 md:w-56"
          height={300}
          src={Chandelier}
          width={150}
        />
        <div className="relative z-2 flex max-h-[80vh] w-full flex-col p-4 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-normal font-serif-2 text-xl sm:text-2xl">
              Detail Pesanan
            </DialogTitle>
          </DialogHeader>

          <div className="no-scrollbar mt-6 space-y-4 overflow-x-hidden overflow-y-scroll px-1 pb-2 sm:mt-8 sm:space-y-6 sm:px-2 sm:pb-3">
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
            </div>
          </div>

          <div className="sticky bottom-0 z-10 bg-black pt-4 font-sans-2">
            <Button
              className="w-full"
              onClick={closeOrderDetail}
              size="checkout"
              variant="store-primary"
            >
              Tutup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
