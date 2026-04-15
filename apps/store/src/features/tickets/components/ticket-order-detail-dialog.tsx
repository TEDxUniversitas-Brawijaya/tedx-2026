// Order detail dialog: displays final ticket order summary, buyer info, and status.
import { formatIdrCurrency } from "@/features/merchandise/lib/formatter";
import { Button } from "@tedx-2026/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@tedx-2026/ui/components/dialog";
import type { TicketBuyer, TicketOrder, TicketProduct } from "../types/ticket";

type TicketOrderDetailDialogProps = {
  isOpen: boolean;
  order: TicketOrder | null;
  product: TicketProduct | null;
  quantity: number;
  selectedBundleItemId?: string;
  buyer: TicketBuyer | null;
  onOpenChange: (open: boolean) => void;
};

export const TicketOrderDetailDialog = ({
  isOpen,
  order,
  product,
  quantity,
  selectedBundleItemId,
  buyer,
  onOpenChange,
}: TicketOrderDetailDialogProps) => {
  if (!(order && product && buyer)) {
    return null;
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
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
            <p>Produk: {product.name}</p>
            <p>Jumlah: {quantity}</p>
            {selectedBundleItemId && (
              <p>Pilihan bundling: {selectedBundleItemId}</p>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p>Nama: {buyer.buyerName}</p>
            <p>Email: {buyer.buyerEmail}</p>
            <p>Telepon: {buyer.buyerPhone}</p>
            <p>Instansi: {buyer.buyerInstansi}</p>
          </div>

          <Button
            className="w-full"
            onClick={() => onOpenChange(false)}
            variant="store-primary"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
